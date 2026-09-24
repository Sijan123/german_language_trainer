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
import { toon } from "./models";
import {
  add, basis, clamp, cross, dot, len, mul, norm, qaxis, qconj, qmul, qrot, quatFromBasis, sub,
  type Quat
} from "./math";

type Mouth = { open: number; wide: number; round: number };

/* how far the jaw drops for a fully open vowel, and the lids travel to shut */
const JAW = 0.24;
const LID = 1.42;

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
    cardStripe: "#2f5d8a"
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
  rest: Map<string, { q: Quat; p: Vec3; local: THREE.Vector3 }>;
  restBases: Record<string, Quat>;
  restLen: { spine1: number };
  morphs: THREE.Mesh[];
};

function prepare(scene: THREE.Group, look: Look3D): Rig {
  const root = cloneSkinned(scene) as THREE.Group;
  const colours = palette(look);
  const morphs: THREE.Mesh[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (!mesh.isMesh) return;
    const paint = (m: THREE.Material) => {
      const c = colours[m.name];
      if (!c) throw new Error(`cast model: no colour for material "${m.name}"`);
      /* the jacket's lining and the lanyard are seen from both sides */
      const twoSided = /^(lanyard|card|cardStripe)$/.test(m.name);
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
  const rest = new Map<string, { q: Quat; p: Vec3; local: THREE.Vector3 }>();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  for (const b of bones) {
    b.matrixWorld.decompose(p, q, s);
    rest.set(b.name, { q: [q.x, q.y, q.z, q.w], p: [p.x, p.y, p.z], local: b.position.clone() });
  }
  const at = (n: string): Vec3 => {
    const r = rest.get(n);
    if (!r) throw new Error(`cast model: no bone "${n}"`);
    return r.p;
  };

  /* the rest pose as Joints: facing +x, upright, hands as the builder made them */
  const F: Vec3 = [1, 0, 0];
  const R: Vec3 = [0, 0, 1];
  const handRest = (sd: Side) => {
    const x = norm(sub(at("hand_" + sd), at("forearm_" + sd)));
    const y = norm(sd === "R" ? cross(F, x) : cross(x, F));
    return { x, y, z: cross(x, y) };
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
  return {
    root, bones, rest,
    restBases: bases(restJ),
    restLen: { spine1: len(sub(at("spine2"), at("spine1"))) },
    morphs
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

  /* where the rig says the joints are; everything else rides its parent */
  const spine1Q = target.spine1;
  const place: Record<string, Vec3> = {
    pelvis: b.pelvis,
    spine1: b.pelvis,
    spine2: add(b.pelvis, mul(qrot(spine1Q, [0, 1, 0]), rig.restLen.spine1 * k)),
    neck: b.chestTop,
    head: b.neck
  };
  for (const s of ["L", "R"] as const) {
    place["clav_" + s] = b.chestTop;
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
    const tb = target[bone.name];
    const rb = rig.restBases[bone.name];
    /* the turn that carries the rest basis onto this frame's, applied to the bone */
    const wq = tb && rb ? qmul(qmul(tb, qconj(rb)), rest.q) : rest.q;
    const parent = bone.parent!;
    let wp: Vec3;
    if (place[bone.name]) {
      wp = place[bone.name];
    } else {
      _p.copy(rest.local).applyMatrix4(parent.matrixWorld);
      wp = [_p.x, _p.y, _p.z];
    }
    _m.compose(_p.set(...wp), _q.set(...wq), _s.set(k, k, k));
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
    for (const [name, i] of Object.entries(dict)) inf[i] = keys[name] ?? 0;
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
