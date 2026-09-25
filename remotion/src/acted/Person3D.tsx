/*
 * A person as a rigged model, posed from a solved body.
 *
 * The models are built in Blender by blender/cast.py (npm run cast) and live
 * in public/models/cast/<name>.glb: one skinned mesh per character with a
 * skeleton whose joints are the ones rig.ts solves, plus shape keys for the
 * mouth and brows. Nothing is animated in the file. On every frame this reads
 * the solved Body — joint positions and the frames of hips, chest, head and
 * hands — and turns it into a rotation for every bone.
 *
 * How a bone is turned: for each one there is a basis worked out from the
 * body (the upper arm's is "along the arm, with the elbow's bend as the
 * second axis", the hand's is the hand frame itself, a finger's is the hand
 * frame curled about the knuckles). The same function run on the model's
 * rest pose gives the rest basis, and the bone is turned by exactly the
 * rotation that carries one onto the other. So nothing here needs to know
 * how Blender or the glTF exporter oriented the bones, and a model with a
 * different rest pose would pose the same.
 *
 * Joints the rig places (hips, knees, shoulders, elbows, wrists, the neck)
 * are put exactly where it says, so a hand closes on the prop that rig.ts
 * put in it. The rest follow their parents.
 *
 * Colours come from the scene's Look3D, by the material names the builder
 * gave each part ("skin", "sleeve", "trousers" ...).
 */

import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { Body, Side } from "./rig";
import type { Look3D, Vec3 } from "./types";
import { toon, toonGradient } from "./models";
import {
  add, basis, clamp, cross, dot, len, mul, norm, qaxis, qconj, qmul, qrot, quatFromBasis, sub,
  type Quat
} from "./math";

type Mouth = { open: number; wide: number; round: number };

/* how far the jaw drops for a fully open vowel, and the lids travel to shut */
const JAW = 0.24;
/* far enough that no white shows through a shut eye, head down or not */
const LID = 1.62;

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

const files = new Map<string, Promise<THREE.Group>>();
function load(name: string) {
  let p = files.get(name);
  if (!p) {
    p = new GLTFLoader().loadAsync(staticFile(`models/cast/${name}.glb`)).then((g) => g.scene);
    files.set(name, p);
  }
  return p;
}

function useCastModel(name: string) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender("loading cast model: " + name));
  useEffect(() => {
    let live = true;
    load(name).then((g) => {
      if (!live) return;
      setScene(g);
      continueRender(handle);
    });
    return () => {
      live = false;
    };
  }, [name, handle]);
  return scene;
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

function palette(look: Look3D): Record<string, string> {
  const j = look.jacket;
  return {
    skin: look.skin,
    hair: look.hair,
    /* under a beard the lips are a darker skin, not the pink of a bare face */
    lips: look.beard ? "#7c4336" : "#b8625e",
    mouth: "#5a2226",
    teeth: "#f4f1ea",
    eyeWhite: "#ffffff",
    iris: "#2a2420",
    blush: "#c98270",
    top: j ? j.shirt : look.top,
    sleeve: j ? j.color : look.top,
    cuff: j ? "#ffffff" : look.topDark,
    collar: j ? "#ffffff" : look.topDark,
    trousers: look.trousers,
    shoes: look.shoes,
    jacket: j ? j.color : look.top,
    lining: j ? j.dark : look.topDark,
    lanyard: "#2f5d8a",
    card: "#f4f1ea",
    cardStripe: "#2f5d8a",
    earbud: "#f4f4f2"
  };
}

/* small parts that should not throw shadows onto the face */
const NO_SHADOW = /^(eye|glint|lid|brow|teeth|mouthInside|blush)/;

/* ------------------------------------------------------------------ */
/* The pose, as bases                                                  */
/* ------------------------------------------------------------------ */

/** What the bases are worked out from: a solved Body, or the model at rest. */
type Joints = {
  k: number;
  pelvis: Vec3;
  hipF: Vec3;
  hipR: Vec3;
  chestTop: Vec3;
  chestF: Vec3;
  chestU: Vec3;
  chestR: Vec3;
  neck: Vec3;
  headF: Vec3;
  headU: Vec3;
  headR: Vec3;
  shoulder: Record<Side, Vec3>;
  elbow: Record<Side, Vec3>;
  wrist: Record<Side, Vec3>;
  hand: Record<Side, { x: Vec3; y: Vec3; z: Vec3 }>;
  hip: Record<Side, Vec3>;
  knee: Record<Side, Vec3>;
  ankle: Record<Side, Vec3>;
  footF: Record<Side, Vec3>;
  /** where the eyes point, in the world */
  eyes: Vec3;
  jaw: number;
  blink: number;
  jacket: number;
  grip: Record<Side, number>;
  point: Record<Side, number>;
};

const Y: Vec3 = [0, 1, 0];
const qb = (primary: Vec3, hint: Vec3): Quat => quatFromBasis(...basis(primary, hint));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/*
 * Which way a hinge (elbow, knee) is bent: the part of the lower bone's
 * direction square to the upper one. Straight, that is undefined, so it
 * leans on a fallback — the way the joint bends when it does — which is
 * also what the model's straight rest pose gets.
 */
function bend(upper: Vec3, lower: Vec3, fallback: Vec3): Vec3 {
  const perp = sub(lower, mul(upper, dot(upper, lower)));
  const fb = norm(sub(fallback, mul(upper, dot(upper, fallback))));
  const L = len(perp);
  if (L < 1e-6) return fb;
  const w = smoothstep(0.02, 0.16, L);
  return norm(add(mul(norm(perp), w), mul(fb, 1 - w)));
}

/* per-joint share of a full curl, knuckle to tip; the smaller fingers close more */
const CURL: Record<string, [number, number, number]> = {
  index: [0.9, 1.1, 0.75],
  middle: [0.95, 1.15, 0.8],
  ring: [1.0, 1.2, 0.85],
  pinky: [1.05, 1.25, 0.9]
};

function bases(j: Joints): Record<string, Quat> {
  const out: Record<string, Quat> = {};
  const hips = qb(j.hipF, Y);
  const chest = qb(j.chestF, j.chestU);
  const head = qb(j.headF, j.headU);
  out.pelvis = hips;
  out.spine1 = qb(norm(add(j.hipF, j.chestF)), norm(add(Y, j.chestU)));
  out.spine2 = chest;
  out.neck = qb(norm(add(j.chestF, j.headF)), norm(add(j.chestU, j.headU)));
  out.head = head;
  out.jaw = qmul(head, qaxis([0, 0, 1], -j.jaw * JAW));
  const lid = qmul(head, qaxis([0, 0, 1], -(1 - j.blink) * LID));
  out.lid_L = lid;
  out.lid_R = lid;
  const eye = qb(j.eyes, j.headU);
  out.eye_L = eye;
  out.eye_R = eye;
  /* only a lift of the lapel: a real panel swung any wider comes out of
     the jacket like a door and hides his face in a close-up */
  out.jacket_L = qmul(chest, qaxis([0, 1, 0], clamp(j.jacket) * 0.32));

  for (const s of ["L", "R"] as const) {
    const t = s === "R" ? 1 : -1;
    out["clav_" + s] = qb(sub(j.shoulder[s], j.chestTop), j.chestU);

    const up = norm(sub(j.elbow[s], j.shoulder[s]));
    const fore = norm(sub(j.wrist[s], j.elbow[s]));
    /* the elbow points out, back and down (rig.ts's pole); it bends the other way */
    const elbowBend = bend(up, fore, add(add(mul(j.chestF, 0.35), mul(j.chestU, 0.7)), mul(j.chestR, -0.75 * t)));
    out["upperarm_" + s] = qb(up, elbowBend);
    /* the forearm takes half the hand's roll, so the wrist does not wring */
    const h = j.hand[s];
    const hy = sub(h.y, mul(fore, dot(fore, h.y)));
    out["forearm_" + s] = qb(fore, len(hy) > 1e-4 ? add(elbowBend, norm(hy)) : elbowBend);
    const hand = quatFromBasis(h.x, h.y, h.z);
    out["hand_" + s] = hand;

    const grip = clamp(j.grip[s]);
    for (const f of ["index", "middle", "ring", "pinky"]) {
      const c = CURL[f];
      const g = f === "index" ? grip * (1 - clamp(j.point[s])) : grip;
      let a = 0;
      for (let i = 0; i < 3; i++) {
        a += c[i] * g;
        out[`${f}${i + 1}_${s}`] = qmul(hand, qaxis([0, 0, 1], a));
      }
    }
    /* the thumb swings across under the fingers, then curls */
    const t1 = qmul(qaxis([1, 0, 0], -t * 0.8 * grip), qaxis([0, 1, 0], t * 0.15 * grip));
    const axis = norm(cross(norm([0.72, 0.28, 0.63 * t]), Y));
    const t2 = qmul(t1, qaxis(axis, 0.45 * grip));
    const t3 = qmul(t2, qaxis(axis, 0.5 * grip));
    out["thumb1_" + s] = qmul(hand, t1);
    out["thumb2_" + s] = qmul(hand, t2);
    out["thumb3_" + s] = qmul(hand, t3);

    const th = norm(sub(j.knee[s], j.hip[s]));
    const sh = norm(sub(j.ankle[s], j.knee[s]));
    /* a knee bends the shin backwards */
    const kneeBend = bend(th, sh, mul(j.hipF, -1));
    out["thigh_" + s] = qb(th, kneeBend);
    out["shin_" + s] = qb(sh, kneeBend);
    out["foot_" + s] = qb(j.footF[s], Y);
  }
  return out;
}

/** The joints of a solved body, as the bases want them. */
function jointsOf(b: Body, mouth: Mouth): Joints {
  /* the eyes aim at the gaze point, in the head's frame, within limits */
  const hq = quatFromBasis(b.headF, b.headU, b.headR);
  const g = norm(qrot(qconj(hq), sub(b.gaze, b.head)));
  const gy = clamp(g[1], -0.45, 0.45);
  const gz = clamp(g[2], -0.55, 0.55);
  const gx = Math.sqrt(Math.max(0.2, 1 - gy * gy - gz * gz));
  const eyes = qrot(hq, norm([gx, gy, gz]));
  return {
    k: b.k, pelvis: b.pelvis, hipF: b.hipF, hipR: b.hipR,
    chestTop: b.chestTop, chestF: b.chestF, chestU: b.chestU, chestR: b.chestR,
    neck: b.neck, headF: b.headF, headU: b.headU, headR: b.headR,
    shoulder: b.shoulder, elbow: b.elbow, wrist: b.wrist, hand: b.handAxes,
    hip: b.hip, knee: b.knee, ankle: b.ankle, footF: b.footF,
    eyes, jaw: clamp(mouth.open), blink: b.face.blink, jacket: b.face.jacket,
    grip: b.grip, point: b.point
  };
}

/* ------------------------------------------------------------------ */
/* The model, and what it looks like at rest                           */
/* ------------------------------------------------------------------ */

type Rig = {
  root: THREE.Group;
  bones: THREE.Bone[]; // parents before children
  rest: Map<string, { q: Quat; p: Vec3; local: THREE.Vector3; localQ: THREE.Quaternion }>;
  restBases: Record<string, Quat>;
  restLen: { spine1: number };
  morphs: THREE.Mesh[];
  /** the model's bone name -> this file's name for it (the cast's are the same) */
  mine: Map<string, string>;
  /** a downloaded avatar rather than one of blender/cast.py's */
  external: boolean;
  /** how much the model is scaled to the look's height */
  scale: number;
  /** from the middle of the hips to the pelvis bone, at rest, in the rest frame */
  pelvisOffset: Vec3;
};

/*
 * Avatars from elsewhere (Avaturn, Mixamo, Ready Player Me) use the Mixamo
 * names, sometimes with a "mixamorig" prefix. This is what each of our bones
 * is called there; anything not listed (Spine1, the toes) just rides along
 * with its parent. They have no jaw, eyes or lids, so those stay still.
 */
function mixamoNames(prefix: string): Record<string, string> {
  const m: Record<string, string> = {
    pelvis: "Hips", spine1: "Spine", spine2: "Spine2", neck: "Neck", head: "Head"
  };
  for (const [s, side] of [["L", "Left"], ["R", "Right"]] as const) {
    m["clav_" + s] = side + "Shoulder";
    m["upperarm_" + s] = side + "Arm";
    m["forearm_" + s] = side + "ForeArm";
    m["hand_" + s] = side + "Hand";
    for (const f of ["thumb", "index", "middle", "ring", "pinky"]) {
      for (const n of [1, 2, 3]) m[`${f}${n}_${s}`] = `${side}Hand${f[0].toUpperCase()}${f.slice(1)}${n}`;
    }
    m["thigh_" + s] = side + "UpLeg";
    m["shin_" + s] = side + "Leg";
    m["foot_" + s] = side + "Foot";
  }
  for (const key of Object.keys(m)) m[key] = prefix + m[key];
  return m;
}

function prepare(scene: THREE.Group, look: Look3D): Rig {
  const root = cloneSkinned(scene) as THREE.Group;
  const colours = palette(look);
  const morphs: THREE.Mesh[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (!mesh.isMesh) return;
    const paint = (m: THREE.Material) => {
      /* a textured avatar keeps its texture, shaded in the same three bands */
      const std = m as THREE.MeshStandardMaterial;
      if (std.map) {
        return new THREE.MeshToonMaterial({ map: std.map, gradientMap: toonGradient(), side: THREE.DoubleSide });
      }
      const c = colours[m.name];
      if (!c) throw new Error(`cast model: no colour for material "${m.name}"`);
      /* the jacket's lining, the lanyard and single-skinned clothes are seen from both sides */
      const twoSided = /^(lanyard|card|cardStripe|jacket|top|trousers|lining)$/.test(m.name);
      return toon(c, twoSided ? { side: THREE.DoubleSide } : {});
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(paint) : paint(mesh.material);
    mesh.frustumCulled = false;
    mesh.castShadow = !NO_SHADOW.test(mesh.name);
    if (mesh.morphTargetDictionary && Object.keys(mesh.morphTargetDictionary).length) morphs.push(mesh);
  });

  root.updateMatrixWorld(true);
  const bones: THREE.Bone[] = [];
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone) bones.push(o as THREE.Bone);
  });

  /* whose names: ours, or Mixamo's (with any prefix) */
  const ownCast = bones.some((b) => b.name === "pelvis");
  const hips = ownCast ? undefined : bones.find((b) => /Hips$/.test(b.name));
  const external = !!hips;
  const theirs: Record<string, string> = external ? mixamoNames(hips!.name.slice(0, -"Hips".length)) : {};
  const mine = new Map<string, string>();
  if (external) {
    for (const [ours, t] of Object.entries(theirs)) mine.set(t, ours);
  } else {
    for (const b of bones) mine.set(b.name, b.name);
  }

  const rest = new Map<string, { q: Quat; p: Vec3; local: THREE.Vector3; localQ: THREE.Quaternion }>();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  for (const b of bones) {
    b.matrixWorld.decompose(p, q, s);
    rest.set(b.name, { q: [q.x, q.y, q.z, q.w], p: [p.x, p.y, p.z], local: b.position.clone(), localQ: b.quaternion.clone() });
  }
  const theirName = (n: string) => (external ? theirs[n] ?? n : n);
  const has = (n: string) => rest.has(theirName(n));
  const at = (n: string): Vec3 => {
    const r = rest.get(theirName(n));
    if (!r) throw new Error(`cast model: no bone "${n}"`);
    return r.p;
  };

  /* the rest pose as Joints. The cast faces +x; anything else is read off the
     skeleton: right is from the left hip to the right, forward is square to
     it, and a hand's axes come from its knuckles. */
  let F: Vec3 = [1, 0, 0];
  let R: Vec3 = [0, 0, 1];
  if (external) {
    const r = sub(at("thigh_R"), at("thigh_L"));
    R = norm([r[0], 0, r[2]]);
    F = cross(Y, R);
  }
  const handRest = (sd: Side) => {
    if (!external || !has("index1_" + sd) || !has("pinky1_" + sd) || !has("middle1_" + sd)) {
      const x = norm(sub(at("hand_" + sd), at("forearm_" + sd)));
      const y = norm(sd === "R" ? cross(F, x) : cross(x, F));
      return { x, y, z: cross(x, y) };
    }
    const x = norm(sub(at("middle1_" + sd), at("hand_" + sd)));
    /* across the knuckles, towards the thumb: +z on a right hand, -z on a left */
    const across = sub(at("index1_" + sd), at("pinky1_" + sd));
    const z0 = norm(sub(across, mul(x, dot(across, x))));
    const z = sd === "R" ? z0 : mul(z0, -1);
    return { x, y: cross(z, x), z };
  };
  const two = <T,>(f: (sd: Side) => T): Record<Side, T> => ({ L: f("L"), R: f("R") });
  const restJ: Joints = {
    k: 1, pelvis: at("pelvis"), hipF: F, hipR: R,
    chestTop: at("neck"), chestF: F, chestU: Y, chestR: R,
    neck: at("head"), headF: F, headU: Y, headR: R,
    shoulder: two((sd) => at("upperarm_" + sd)),
    elbow: two((sd) => at("forearm_" + sd)),
    wrist: two((sd) => at("hand_" + sd)),
    hand: two(handRest),
    hip: two((sd) => at("thigh_" + sd)),
    knee: two((sd) => at("shin_" + sd)),
    ankle: two((sd) => at("foot_" + sd)),
    footF: two(() => F),
    eyes: F, jaw: 0, blink: 1, jacket: 0,
    grip: two(() => 0), point: two(() => 0)
  };

  /* an avatar is scaled to the look's height by its own height; the cast is
     built at 1.76 m, the rig's own size */
  let scale = look.height / 1.76;
  let pelvisOffset: Vec3 = [0, 0, 0];
  if (external) {
    const box = new THREE.Box3().setFromObject(root);
    scale = look.height / Math.max(0.5, box.max.y - box.min.y);
    const mid = mul(add(at("thigh_L"), at("thigh_R")), 0.5);
    const d = sub(at("pelvis"), mid);
    /* in the rest frame: forward, up, right */
    pelvisOffset = [dot(d, F), dot(d, Y), dot(d, R)];
  }
  return {
    root, bones, rest,
    restBases: bases(restJ),
    restLen: { spine1: has("spine2") && has("spine1") ? len(sub(at("spine2"), at("spine1"))) : 0 },
    morphs, mine, external, scale, pelvisOffset
  };
}

/* ------------------------------------------------------------------ */
/* Posing                                                              */
/* ------------------------------------------------------------------ */

const _m = new THREE.Matrix4();
const _inv = new THREE.Matrix4();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();

function pose(rig: Rig, b: Body, mouth: Mouth) {
  const j = jointsOf(b, mouth);
  const target = bases(j);
  const k = b.k;
  const sc = rig.external ? rig.scale : k;

  /* where the rig says the joints are; everything else rides its parent */
  const place: Record<string, Vec3> = {};
  if (rig.external) {
    /* the pelvis bone sits a little above the hip joints: carry that offset
       round with the hips */
    const o = rig.pelvisOffset;
    place.pelvis = add(b.pelvis, add(mul(b.hipF, o[0] * sc), add(mul(Y, o[1] * sc), mul(b.hipR, o[2] * sc))));
  } else {
    place.pelvis = b.pelvis;
    place.spine1 = b.pelvis;
    place.spine2 = add(b.pelvis, mul(qrot(target.spine1, [0, 1, 0]), rig.restLen.spine1 * k));
    place.neck = b.chestTop;
    place.head = b.neck;
  }
  for (const s of ["L", "R"] as const) {
    if (!rig.external) place["clav_" + s] = b.chestTop;
    place["upperarm_" + s] = b.shoulder[s];
    place["forearm_" + s] = b.elbow[s];
    place["hand_" + s] = b.wrist[s];
    place["thigh_" + s] = b.hip[s];
    place["shin_" + s] = b.knee[s];
    place["foot_" + s] = b.ankle[s];
  }

  rig.root.updateMatrixWorld(true);
  for (const bone of rig.bones) {
    const rest = rig.rest.get(bone.name)!;
    const ours = rig.mine.get(bone.name);
    const parent = bone.parent!;
    if (!ours) {
      /* a bone we have no say over: its rest pose relative to its parent */
      bone.position.copy(rest.local);
      bone.quaternion.copy(rest.localQ);
      bone.scale.set(1, 1, 1);
      bone.updateMatrix();
      bone.matrixWorld.multiplyMatrices(parent.matrixWorld, bone.matrix);
      continue;
    }
    const tb = target[ours];
    const rb = rig.restBases[ours];
    /* the turn that carries the rest basis onto this frame's, applied to the bone */
    const wq = tb && rb ? qmul(qmul(tb, qconj(rb)), rest.q) : rest.q;
    let wp: Vec3;
    if (place[ours]) {
      wp = place[ours];
    } else {
      _p.copy(rest.local).applyMatrix4(parent.matrixWorld);
      wp = [_p.x, _p.y, _p.z];
    }
    _m.compose(_p.set(...wp), _q.set(...wq), _s.set(sc, sc, sc));
    _inv.copy(parent.matrixWorld).invert();
    _m.premultiply(_inv);
    _m.decompose(bone.position, bone.quaternion, bone.scale);
    bone.updateMatrix();
    bone.matrixWorld.multiplyMatrices(parent.matrixWorld, bone.matrix);
  }

  /* the face's shape keys */
  const keys: Record<string, number> = {
    wide: clamp(mouth.wide),
    round: clamp(mouth.round),
    smile: clamp(b.face.smile),
    brows: clamp(b.face.brows)
  };
  for (const m of rig.morphs) {
    const dict = m.morphTargetDictionary!;
    const inf = m.morphTargetInfluences!;
    for (const [name, n] of Object.entries(dict)) inf[n] = keys[name] ?? 0;
  }
}

/* ------------------------------------------------------------------ */
/* The component                                                       */
/* ------------------------------------------------------------------ */

export const Person3D: React.FC<{ body: Body; look: Look3D; mouth: Mouth }> = ({ body, look, mouth }) => {
  const scene = useCastModel(look.model!);
  const rig = useMemo(() => (scene ? prepare(scene, look) : null), [scene, look]);
  if (!rig) return null;
  pose(rig, body, mouth);
  return <primitive object={rig.root} />;
};
