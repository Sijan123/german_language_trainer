/*
 * The flat's props: what c001 picks up on a morning when the alarm failed.
 *
 * Same convention as Props.tsx: each is drawn in its own frame, x along its
 * long side, y up (out of its face, when it lies down), z across, centred on
 * its PROP_SIZE box. The alarm clock and the mug stand up, so their y is
 * their height; the clock's face looks along +x.
 *
 * `open` is the lunch box's lid.
 */

import React from "react";
import * as THREE from "three";
import { PROP_SIZE } from "./world";
import { toon } from "./models";

const SPHERE = new THREE.SphereGeometry(1, 20, 14);
const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL_X = (() => {
  const g = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
  g.rotateZ(Math.PI / 2);
  return g;
})();
const CYL_Y = new THREE.CylinderGeometry(1, 1, 1, 32, 1);

/* ------------------------------------------------------------------ */
/* The alarm clock                                                     */
/* ------------------------------------------------------------------ */

/**
 * A red twin-bell alarm clock showing half past seven: the time line 0 says
 * it is, which is the joke of the whole dialogue.
 */
export const AlarmClock: React.FC = () => {
  const [D, H] = PROP_SIZE.clock;
  const r = 0.05;
  const cy = -H / 2 + 0.012 + r;
  const red = toon("#c0433a");
  const metal = toon("#c9ced1");
  /* 7:30: the minute hand straight down, the hour hand half way from 7 to 8 */
  const hour = (7.5 / 12) * Math.PI * 2;
  const min = Math.PI;
  const face = D / 2 + 0.0015;
  return (
    <group>
      <mesh geometry={CYL_X} material={red} position={[0, cy, 0]} scale={[D * 0.8, r, r]} castShadow />
      {/* the face */}
      <mesh position={[face - 0.001, cy, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[r * 0.86, 32]} />
        <meshBasicMaterial color="#f6f2e8" />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[face, cy + Math.cos(a) * r * 0.7, -Math.sin(a) * r * 0.7]} rotation={[0, Math.PI / 2, -a]}>
            <planeGeometry args={[0.003, i % 3 === 0 ? 0.009 : 0.005]} />
            <meshBasicMaterial color="#2a2420" />
          </mesh>
        );
      })}
      {([[hour, 0.024, 0.004], [min, 0.036, 0.003]] as const).map(([a, l, w], i) => (
        <mesh key={"h" + i} position={[face + 0.0005 * (i + 1), cy + (Math.cos(a) * l) / 2, (-Math.sin(a) * l) / 2]} rotation={[0, Math.PI / 2, -a]}>
          <planeGeometry args={[w, l]} />
          <meshBasicMaterial color="#2a2420" />
        </mesh>
      ))}
      {/* two bells and the hammer between them */}
      {[1, -1].map((s) => (
        <mesh key={s} geometry={SPHERE} material={metal} position={[0, cy + r * 0.95, s * r * 0.62]} rotation={[s * 0.5, 0, 0]} scale={[0.02, 0.018, 0.02]} castShadow />
      ))}
      <mesh geometry={BOX} material={metal} position={[0, cy + r * 1.15, 0]} scale={[0.004, 0.02, 0.004]} />
      {/* feet */}
      {[1, -1].map((s) => (
        <mesh key={"f" + s} geometry={BOX} material={metal} position={[0, -H / 2 + 0.006, s * r * 0.6]} rotation={[s * 0.4, 0, 0]} scale={[0.008, 0.016, 0.006]} />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The sandwich and its box                                            */
/* ------------------------------------------------------------------ */

/** Two slices of bread with cheese and a leaf of lettuce between them. */
export const Sandwich: React.FC = () => {
  const [L, H, S] = PROP_SIZE.sandwich;
  const t = 0.014;
  const bread = toon("#e6cf9e");
  const crust = toon("#b98a54");
  const slice = (y: number) => (
    <group position={[0, y, 0]}>
      <mesh geometry={BOX} material={bread} scale={[L * 0.94, t, S * 0.94]} castShadow />
      <mesh geometry={BOX} material={crust} scale={[L, t * 0.9, S]} />
    </group>
  );
  return (
    <group>
      {slice(-H / 2 + t / 2)}
      <mesh geometry={BOX} material={toon("#7fb24a")} position={[0.004, -H / 2 + t + 0.004, 0.003]} rotation={[0, 0.2, 0]} scale={[L * 1.02, 0.004, S * 1.02]} />
      <mesh geometry={BOX} material={toon("#f2c94c")} position={[-0.003, -H / 2 + t + 0.009, -0.002]} rotation={[0, -0.35, 0]} scale={[L * 0.9, 0.005, S * 0.9]} />
      {slice(H / 2 - t / 2)}
    </group>
  );
};

/** A green lunch box; the lid lifts off its back edge as `open` goes to 1. */
export const LunchBox: React.FC<{ open: number }> = ({ open }) => {
  const [L, H, S] = PROP_SIZE.lunchbox;
  const body = toon("#9fd0ad");
  const lid = toon("#3f8a5a");
  const w = 0.004;
  const lidH = 0.014;
  return (
    <group>
      <mesh geometry={BOX} material={body} position={[0, -H / 2 + w / 2, 0]} scale={[L, w, S]} castShadow />
      {[1, -1].map((s) => (
        <mesh key={"z" + s} geometry={BOX} material={body} position={[0, -lidH / 2, (s * (S - w)) / 2]} scale={[L, H - lidH, w]} castShadow />
      ))}
      {[1, -1].map((s) => (
        <mesh key={"x" + s} geometry={BOX} material={body} position={[(s * (L - w)) / 2, -lidH / 2, 0]} scale={[w, H - lidH, S]} castShadow />
      ))}
      <group position={[0, H / 2 - lidH, -S / 2]} rotation={[-open * 1.7, 0, 0]}>
        <mesh geometry={BOX} material={lid} position={[0, lidH / 2, S / 2]} scale={[L + 0.004, lidH, S + 0.004]} castShadow />
        {/* the clips */}
        {[1, -1].map((s) => (
          <mesh key={s} geometry={BOX} material={lid} position={[s * L * 0.3, 0, S + 0.003]} scale={[0.03, 0.02, 0.004]} />
        ))}
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The mug and the key                                                 */
/* ------------------------------------------------------------------ */

/** A mug of coffee, handle on its -z side. */
export const Mug: React.FC = () => {
  const [, H] = PROP_SIZE.mug;
  const r = 0.038;
  return (
    <group>
      <mesh geometry={CYL_Y} material={toon("#e9e2d4")} scale={[r, H, r]} castShadow />
      <mesh position={[0, H / 2 - 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r * 0.9, 28]} />
        <meshToonMaterial color="#4a2e1c" />
      </mesh>
      <mesh position={[0, 0, -r - 0.012]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.022, 0.006, 8, 18]} />
        <meshToonMaterial color="#e9e2d4" />
      </mesh>
      <mesh position={[0, 0.01, r + 0.0005]}>
        <planeGeometry args={[0.03, 0.03]} />
        <meshBasicMaterial color="#2f5d8a" />
      </mesh>
    </group>
  );
};

/** A flat key on a ring, with a bright red tag so it reads at a distance. */
export const Key: React.FC = () => {
  const [L] = PROP_SIZE.key;
  const brass = toon("#d8b24e");
  return (
    <group scale={1.35}>
      {/* the bow */}
      <mesh position={[-L / 2 + 0.012, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.009, 0.0035, 8, 18]} />
        <meshToonMaterial color="#c9a54a" />
      </mesh>
      {/* the blade and its teeth */}
      <mesh geometry={BOX} material={brass} position={[0.008, 0, 0]} scale={[0.04, 0.003, 0.007]} castShadow />
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={BOX} material={brass} position={[0.01 + i * 0.008, 0, 0.005]} scale={[0.004, 0.003, 0.004]} />
      ))}
      {/* the tag on the ring */}
      <mesh geometry={BOX} material={toon("#c0433a")} position={[-L / 2 + 0.004, -0.001, -0.014]} rotation={[0, 0.5, 0]} scale={[0.026, 0.004, 0.017]} castShadow />
    </group>
  );
};
