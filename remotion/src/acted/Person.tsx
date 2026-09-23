/*
 * A person, drawn from a solved body.
 *
 * rig.ts decides where every joint is; this only puts rounded shapes on them.
 * The look is the drawn cast in the round — the same skin, hair and clothes
 * colours, the same slightly large head — built from spheres, tapered
 * cylinders and one lathed torso, with toon shading so it sits in the same
 * illustrated world as the furniture.
 *
 * The face is what carries the dialogue, so it gets the detail: a separate
 * jaw that drops for open vowels, a mouth that widens and rounds, lips that
 * close on m/b/p, eyes that aim at what the gaze is after and squash shut on
 * a blink, and brows that lift on questions. In profile the jaw is what reads;
 * from the front, the mouth.
 */

import React from "react";
import * as THREE from "three";
import type { Body, Side } from "./rig";
import type { Look3D, Vec3 } from "./types";
import { toon } from "./models";
import { add, basis, clamp, dist, mul, norm, quatFromBasis, quatYTo, sub } from "./math";

/* ------------------------------------------------------------------ */
/* Shared geometry                                                     */
/* ------------------------------------------------------------------ */

const SPHERE = new THREE.SphereGeometry(1, 28, 20);
const SPHERE_LO = new THREE.SphereGeometry(1, 16, 12);

const cylCache = new Map<string, THREE.CylinderGeometry>();
/** A unit-height cylinder along +y with its base at 0; taper = top/bottom. */
function cyl(taper: number) {
  const key = taper.toFixed(3);
  let g = cylCache.get(key);
  if (!g) {
    g = new THREE.CylinderGeometry(taper, 1, 1, 18, 1, false);
    g.translate(0, 0.5, 0);
    cylCache.set(key, g);
  }
  return g;
}

/*
 * The torso, as a lathe: radius against height, from the hips to the base of
 * the neck. Wide at the chest, in at the waist a little, round over the
 * shoulders. Scaled flatter front-to-back than side-to-side afterwards.
 */
const TORSO_PROFILE: [number, number][] = [
  [0.125, 0], [0.142, 0.06], [0.146, 0.16], [0.155, 0.3], [0.158, 0.4],
  [0.148, 0.47], [0.118, 0.535], [0.07, 0.568], [0.001, 0.578]
];
const latheCache = new Map<string, THREE.LatheGeometry>();
function lathe(grow: number, phiStart = 0, phiLength = Math.PI * 2) {
  const key = `${grow}|${phiStart.toFixed(3)}|${phiLength.toFixed(3)}`;
  let g = latheCache.get(key);
  if (!g) {
    g = new THREE.LatheGeometry(
      TORSO_PROFILE.map(([r, y]) => new THREE.Vector2(r * grow, y)),
      40,
      phiStart,
      phiLength
    );
    latheCache.set(key, g);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Little helpers                                                      */
/* ------------------------------------------------------------------ */

const q4 = (q: [number, number, number, number]) => new THREE.Quaternion(q[0], q[1], q[2], q[3]);

/** An ellipsoid: centre, radii in its own frame, and that frame's rotation. */
const Blob: React.FC<{
  at: Vec3; r: Vec3; color: string; q?: THREE.Quaternion; lo?: boolean; shadow?: boolean;
}> = ({ at, r, color, q, lo, shadow = true }) => (
  <mesh
    geometry={lo ? SPHERE_LO : SPHERE}
    material={toon(color)}
    position={at}
    quaternion={q}
    scale={r}
    castShadow={shadow}
  />
);

/** A tapered limb segment between two points. */
const Limb: React.FC<{ a: Vec3; b: Vec3; ra: number; rb: number; color: string }> = ({ a, b, ra, rb, color }) => {
  const L = dist(a, b);
  const q = quatYTo(sub(b, a));
  return (
    <mesh
      geometry={cyl(rb / ra)}
      material={toon(color)}
      position={a}
      quaternion={q4(q)}
      scale={[ra, L, ra]}
      castShadow
    />
  );
};

/* ------------------------------------------------------------------ */
/* The hand                                                            */
/* ------------------------------------------------------------------ */

/*
 * In the hand's own frame: x along the fingers, y out of the palm, z across.
 * The thumb sits on +z for a right hand and -z for a left one (work it out
 * palm-down: the right thumb is on the left). `grip` curls the fingers in
 * towards the palm; `point` keeps the index finger straight while the rest
 * curl, which is what tapping a signature line needs.
 */
const Hand: React.FC<{ body: Body; side: Side; skin: string; shade: string }> = ({ body, side, skin, shade }) => {
  const x = body.hand[side];
  const k = body.k;
  const grip = clamp(body.grip[side]);
  const point = clamp(body.point[side]);
  const t = side === "R" ? 1 : -1;
  const curl = grip * 1.35;
  const idxCurl = curl * (1 - point);
  return (
    <group position={x.p} quaternion={q4(x.q)} scale={k}>
      {/* the palm */}
      <Blob at={[0.045, 0.004, 0]} r={[0.05, 0.02, 0.043]} color={skin} lo />
      {/* three fingers as one mitten, curling about the knuckles */}
      <group position={[0.085, 0.004, -t * 0.01]}>
        <group quaternion={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), curl)}>
          <Blob at={[0.036, 0, 0]} r={[0.042, 0.015, 0.031]} color={skin} lo />
        </group>
      </group>
      {/* the index finger, on the thumb side */}
      <group position={[0.085, 0.004, t * 0.028]}>
        <group quaternion={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), idxCurl)}>
          <Blob at={[0.036, 0, 0]} r={[0.042, 0.013, 0.013]} color={skin} lo />
        </group>
      </group>
      {/* the thumb, which swings in under the fingers as the hand closes */}
      <group position={[0.03, 0.012, t * 0.04]}>
        <group quaternion={new THREE.Quaternion().setFromEuler(new THREE.Euler(t * -0.3 * grip, t * (0.5 - 0.5 * grip), 0))}>
          <Blob at={[0.032, 0.006, t * 0.008]} r={[0.036, 0.014, 0.016]} color={shade} lo />
        </group>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The head                                                            */
/* ------------------------------------------------------------------ */

type Mouth = { open: number; wide: number; round: number };

const Head: React.FC<{ body: Body; look: Look3D; mouth: Mouth }> = ({ body, look, mouth }) => {
  const k = body.k;
  const q = q4(quatFromBasis(body.headF, body.headU, body.headR));
  const skin = look.skin;
  const shade = look.skinShade;
  const hair = look.hair;

  /* the eyes aim at the gaze point, in the head's frame, within limits */
  const toGaze = sub(body.gaze, body.head);
  const inv = q.clone().invert();
  const g = new THREE.Vector3(...toGaze).applyQuaternion(inv).normalize();
  const gy = clamp(g.y, -0.45, 0.45);
  const gz = clamp(g.z, -0.55, 0.55);
  const gx = Math.sqrt(Math.max(0.2, 1 - gy * gy - gz * gz));
  const iris = norm([gx, gy, gz]);

  const blink = body.face.blink;
  const brow = body.face.brows;
  const smile = body.face.smile;
  const jaw = mouth.open * 0.32;
  const thick = look.brows === "thick";

  /* mouth, from the front: wider for i/e and smiles, narrower when rounded */
  const mw = 0.03 * (1 + 0.35 * mouth.wide + 0.25 * smile - 0.5 * mouth.round);
  const mh = 0.003 + 0.028 * mouth.open;

  return (
    <group position={body.head} quaternion={q} scale={k}>
      {/* the skull */}
      <Blob at={[0, 0, 0]} r={[0.125, 0.132, 0.118]} color={skin} />
      {/* the mid-face: cheeks and upper lip, fixed to the skull */}
      <Blob at={[0.052, -0.04, 0]} r={[0.086, 0.066, 0.092]} color={skin} />
      {/* ears */}
      <Blob at={[-0.006, -0.008, 0.116]} r={[0.022, 0.034, 0.014]} color={shade} lo />
      <Blob at={[-0.006, -0.008, -0.116]} r={[0.022, 0.034, 0.014]} color={shade} lo />

      {/* the jaw, hinged just below the ear, dropping for open vowels */}
      <group position={[-0.02, -0.035, 0]} rotation={[0, 0, -jaw]}>
        <Blob at={[0.07, -0.042, 0]} r={[0.078, 0.046, 0.08]} color={skin} />
        {look.beard ? (
          <>
            <Blob at={[0.058, -0.05, 0]} r={[0.098, 0.058, 0.104]} color={hair} />
            <Blob at={[0.1, -0.075, 0]} r={[0.05, 0.036, 0.06]} color={hair} />
          </>
        ) : null}
      </group>

      {/* the mouth: dark inside, teeth along the top, lips round it */}
      <group position={[0.13 + 0.012 * mouth.round, -0.058 - 0.012 * mouth.open, 0]}>
        <Blob at={[0, 0, 0]} r={[0.012, mh, mw]} color="#5a2226" lo shadow={false} />
        <Blob at={[0.002, mh * 0.55, 0]} r={[0.008, Math.min(mh * 0.35, 0.007), mw * 0.8]} color="#f4f1ea" lo shadow={false} />
        <Blob at={[-0.004, 0, 0]} r={[0.013, mh + 0.007, mw + 0.006]} color={look.beard ? hair : "#b8625e"} lo shadow={false} />
      </group>
      {look.beard ? (
        /* the moustache, over the upper lip */
        <Blob at={[0.132, -0.034, 0]} r={[0.018, 0.012, 0.038]} color={hair} lo />
      ) : null}

      {/* the nose: in profile it is the face. Skin, not the shade colour —
          a darker nose read as a clown's from the front. */}
      <Blob at={[0.126, 0.0, 0]} r={[0.03, 0.028, 0.021]} color={skin} />

      {/* eyes: white, iris, a catch-light, and a lid that only just shows.
          A heavy dark lid over the top of the eye read as a scowl on both
          of them in the first render. */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.098, 0.03, s * 0.047]} scale={[1, blink, 1]}>
          <Blob at={[0, 0, 0]} r={[0.025, 0.028, 0.025]} color="#ffffff" lo shadow={false} />
          <Blob at={mul(iris, 0.019)} r={[0.011, 0.013, 0.013]} color="#2a2420" lo shadow={false} />
          <Blob at={add(mul(iris, 0.026), [0, 0.005, 0.003])} r={[0.003, 0.0035, 0.0035]} color="#ffffff" lo shadow={false} />
          <Blob at={[-0.001, 0.02 + 0.004 * (1 - blink), 0]} r={[0.024, 0.008, 0.026]} color={skin} lo shadow={false} />
        </group>
      ))}
      {/* brows: high and nearly level at rest, lifted on questions. Sloping
          in towards the nose is anger, and that is not this film. */}
      {[-1, 1].map((s) => (
        <mesh
          key={"b" + s}
          geometry={SPHERE_LO}
          material={toon(hair)}
          position={[0.104, 0.086 + brow * 0.014, s * 0.05]}
          rotation={[s * (-0.08 - brow * 0.12), 0, 0.18 + brow * 0.1]}
          scale={[0.011, thick ? 0.0095 : 0.0065, thick ? 0.029 : 0.026]}
        />
      ))}
      {/* the smile: the corners of a closed mouth turned up, and the cheeks
          lifted with them */}
      {smile > 0.05 ? (
        <mesh
          position={[0.137, -0.05 - 0.004 * smile, 0]}
          rotation={[0, Math.PI / 2, Math.PI]}
          scale={[1, 0.5 + 0.8 * smile, 1]}
        >
          <torusGeometry args={[0.028 + 0.006 * smile, 0.0028, 6, 16, Math.PI]} />
          <meshBasicMaterial color={look.beard ? hair : "#8c3a38"} transparent opacity={Math.min(1, smile * 1.6) * (1 - mouth.open)} />
        </mesh>
      ) : null}
      {[-1, 1].map((s) => (
        <Blob key={"c" + s} at={[0.094, -0.022 + 0.006 * smile, s * 0.068]} r={[0.016, 0.011, 0.018]} color="#c98270" lo shadow={false} />
      ))}

      {/* hair */}
      {look.hairStyle === "short" ? (
        <>
          <Blob at={[-0.025, 0.032, 0]} r={[0.128, 0.13, 0.125]} color={hair} />
          <Blob at={[0.035, 0.1, 0.04]} r={[0.07, 0.05, 0.06]} color={hair} />
          <Blob at={[0.03, 0.105, -0.04]} r={[0.07, 0.05, 0.06]} color={hair} />
          <Blob at={[-0.04, 0.115, 0]} r={[0.08, 0.05, 0.08]} color={hair} />
          <Blob at={[0.085, 0.078, 0]} r={[0.04, 0.03, 0.07]} color={hair} />
          {/* sideburns, joining the hair to the beard */}
          <Blob at={[0.03, -0.02, 0.105]} r={[0.03, 0.05, 0.016]} color={hair} lo />
          <Blob at={[0.03, -0.02, -0.105]} r={[0.03, 0.05, 0.016]} color={hair} lo />
        </>
      ) : (
        <>
          <Blob at={[-0.022, 0.028, 0]} r={[0.132, 0.138, 0.128]} color={hair} />
          {/* the parting: two sweeps over the forehead */}
          <Blob at={[0.075, 0.085, 0.04]} r={[0.055, 0.04, 0.065]} color={hair} />
          <Blob at={[0.075, 0.085, -0.04]} r={[0.055, 0.04, 0.065]} color={hair} />
          {/* down the back to the shoulder blades */}
          <Blob at={[-0.07, -0.13, 0]} r={[0.075, 0.2, 0.125]} color={hair} />
          {/* and forward over the shoulders, framing the face */}
          <Blob at={[0.0, -0.1, 0.112]} r={[0.055, 0.14, 0.03]} color={hair} />
          <Blob at={[0.0, -0.1, -0.112]} r={[0.055, 0.14, 0.03]} color={hair} />
        </>
      )}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The whole person                                                    */
/* ------------------------------------------------------------------ */

export const Person: React.FC<{ body: Body; look: Look3D; mouth: Mouth }> = ({ body, look, mouth }) => {
  const k = body.k;
  const jacket = look.jacket;
  const torsoColor = jacket ? jacket.shirt : look.top;
  const sleeve = jacket ? jacket.color : look.top;

  /* the torso's frame: x forward, y up the spine, z to the right */
  const torsoQ = q4(quatFromBasis(body.chestF, body.chestU, body.chestR));
  const torsoBase = add(body.pelvis, mul(body.chestU, -0.07 * k));
  /* the lathe revolves about y with phi = 0 on +z; the front (+x) is phi = π/2 */
  const open = clamp(body.face.jacket);
  const hipQ = q4(quatFromBasis(body.hipF, [0, 1, 0], body.hipR));

  const shoes = (["L", "R"] as const).map((s) => {
    const a = body.ankle[s];
    const f = body.footF[s];
    const [bx, by, bz] = basis(f, [0, 1, 0]);
    return { s, at: add(add(a, mul(f, 0.055 * k)), [0, -0.045 * k, 0]), q: q4(quatFromBasis(bx, by, bz)) };
  });

  return (
    <group>
      {/* ------------------------------------------------ legs and hips */}
      <Blob at={body.pelvis} r={[0.13 * k, 0.11 * k, 0.175 * k]} q={hipQ} color={look.trousers} />
      {(["L", "R"] as const).map((s) => (
        <React.Fragment key={s}>
          <Limb a={body.hip[s]} b={body.knee[s]} ra={0.078 * k} rb={0.06 * k} color={look.trousers} />
          <Blob at={body.knee[s]} r={[0.06 * k, 0.06 * k, 0.06 * k]} color={look.trousers} lo />
          <Limb a={body.knee[s]} b={body.ankle[s]} ra={0.058 * k} rb={0.047 * k} color={look.trousers} />
        </React.Fragment>
      ))}
      {shoes.map(({ s, at, q }) => (
        <Blob key={s} at={at} r={[0.13 * k, 0.05 * k, 0.055 * k]} q={q} color={look.shoes} />
      ))}

      {/* ------------------------------------------------ torso */}
      <group position={torsoBase} quaternion={torsoQ} scale={[0.72 * k, k, 1.2 * k]}>
        <mesh geometry={lathe(1)} material={toon(torsoColor)} castShadow />
        {jacket ? (
          <>
            {/* the jacket's back, sides and right front, open in a V at the
                front: it runs from the left panel's hinge all the way round to
                the right-hand edge of the V */}
            <mesh geometry={lathe(1.07, Math.PI / 2 + 0.22 + 0.9, Math.PI * 2 - 0.44 - 0.9)} material={toon(jacket.color, { side: THREE.DoubleSide })} castShadow />
            {/* the left front panel, which swings open for the inside pocket:
                hinged at its outer edge, it turns out and away */}
            {(() => {
              const phi = Math.PI / 2 + 0.22 + 0.9;
              const r = 0.155 * 1.07;
              const hx = r * Math.sin(phi);
              const hz = r * Math.cos(phi);
              return (
                <group position={[hx, 0, hz]} rotation={[0, open * 1.25, 0]}>
                  <group position={[-hx, 0, -hz]}>
                    <mesh geometry={lathe(1.075, Math.PI / 2 + 0.22, 0.9)} material={toon(jacket.color, { side: THREE.DoubleSide })} castShadow />
                    {/* the lining, seen when it is open */}
                    <mesh geometry={lathe(1.06, Math.PI / 2 + 0.22, 0.9)} material={toon(jacket.dark, { side: THREE.DoubleSide })} />
                  </group>
                </group>
              );
            })()}
          </>
        ) : null}
        {/* the collar: a shirt collar under a jacket, a neckline otherwise */}
        <mesh position={[0, 0.555, 0]} scale={[0.07, 0.035, 0.065]} geometry={SPHERE_LO} material={toon(jacket ? "#ffffff" : look.topDark)} />
      </group>

      {look.lanyard ? (
        /* the official's ID, on its ribbon */
        <group position={torsoBase} quaternion={torsoQ} scale={k}>
          <mesh position={[0.118, 0.34, 0]} rotation={[0, 0, -0.3]} scale={[0.004, 0.19, 0.11]} geometry={SPHERE_LO} material={toon("#2f5d8a")} />
          <mesh position={[0.122, 0.28, 0]} scale={[0.006, 0.05, 0.038]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color="#f4f1ea" />
          </mesh>
          <mesh position={[0.126, 0.292, 0]} scale={[0.002, 0.012, 0.028]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#2f5d8a" />
          </mesh>
        </group>
      ) : null}

      {/* ------------------------------------------------ neck and head */}
      <Limb a={add(body.chestTop, mul(body.chestU, -0.02 * k))} b={add(body.head, mul(body.headU, -0.07 * k))} ra={0.047 * k} rb={0.045 * k} color={look.skinShade} />
      <Head body={body} look={look} mouth={mouth} />

      {/* ------------------------------------------------ arms */}
      {(["L", "R"] as const).map((s) => (
        <React.Fragment key={s}>
          <Blob at={body.shoulder[s]} r={[0.058 * k, 0.058 * k, 0.058 * k]} color={sleeve} />
          <Limb a={body.shoulder[s]} b={body.elbow[s]} ra={0.05 * k} rb={0.044 * k} color={sleeve} />
          <Blob at={body.elbow[s]} r={[0.044 * k, 0.044 * k, 0.044 * k]} color={sleeve} lo />
          <Limb a={body.elbow[s]} b={body.wrist[s]} ra={0.043 * k} rb={0.036 * k} color={sleeve} />
          {/* the cuff */}
          <Blob at={body.wrist[s]} r={[0.033 * k, 0.033 * k, 0.033 * k]} color={jacket ? "#ffffff" : look.topDark} lo />
          <Hand body={body} side={s} skin={look.skin} shade={look.skinShade} />
        </React.Fragment>
      ))}
    </group>
  );
};
