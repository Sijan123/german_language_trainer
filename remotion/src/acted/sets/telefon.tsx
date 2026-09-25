/*
 * A phone call between two places (c002): the supermarket on the left, their
 * kitchen at home on the right, a solid wall between.
 *
 *              back wall  z = -1.5
 *   [checkout + queue] [jam shelf] [   dairy chiller   ] | [ the flat's kitchen ]
 *   [self-checkout]         [produce: eggs, tomatoes]    |      [island]
 *        x = -5 .. -0.1  (the shop)                   wall    x = 0.15 .. 4.6
 *
 *                     camera at +z, one master per room
 *
 * The kitchen is the flat's (sets/wohnung.tsx, so c001's home), with a bowl
 * and a cake tin on the island for "Ich backe ... einen Kuchen". The shop is
 * built here. What the dialogue says is true of the set: the milk shelf has a
 * gap and a sold-out tag, the oat milk is beside it, the tomatoes are
 * bruised, and the checkout has a queue of four while the self-checkout is
 * free.
 */

import React from "react";
import * as THREE from "three";
import { theme } from "../../theme";
import { toon, useModels } from "../models";
import { useCanvasTexture } from "./buergerbuero";
import { Kitchen, wohnungLayout } from "./wohnung";
import { Wall } from "./walls";
import type { SetLayout, SetState } from "./index";

const c = theme.set.shop;
const FONT = "'IBM Plex Sans', system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const WALL_Z = -1.5;
const CHILL = { x0: -3.3, x1: -1.1, depth: 0.6, shelves: [0.45, 0.85, 1.25, 1.65] };
const MILK_Y = CHILL.shelves[2];
const TABLE = { x: -2.3, z: 0.25, w: 1.1, d: 0.7, top: 0.82 };
const JAM = { x0: -4.5, x1: -3.6, shelves: [0.6, 1.0, 1.4] };
const IT = 0.92;

export const telefonLayout: SetLayout = {
  chairs: {},
  spots: {
    /* the kitchen's, from the flat */
    ...wohnungLayout.spots,
    /* the bowl for the cake, on the island */
    bowl: { p: [1.72, IT, 0.45] },
    /* the oat milk on the dairy shelf, beside the gap where the milk was */
    oat: { p: [-1.72, MILK_Y, -1.12], yaw: 0 },
    /* a box of eggs on the produce table, and a tomato in the crate */
    eggs: { p: [-2.0, TABLE.top, 0.12], yaw: 0.2 },
    tomato: { p: [-2.6, TABLE.top + 0.1, 0.2], yaw: 0 },
    /* a jar of jam on the jam shelf */
    jar: { p: [-3.8, JAM.shelves[1], -1.28], yaw: 0 }
  },
  anchors: {
    milkGap: [-2.22, MILK_Y + 0.1, -1.1],
    oatMilk: [-1.72, MILK_Y + 0.1, -1.1],
    tomatoes: [-2.62, TABLE.top + 0.08, 0.3],
    queue: [-4.55, 1.2, -0.4],
    selfCheckout: [-3.95, 1.2, 0.55],
    kuchen: [1.62, IT + 0.08, 0.38]
  }
};

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const BOXG = new THREE.BoxGeometry(1, 1, 1);
const SPH = new THREE.SphereGeometry(1, 16, 12);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 20);

const Box: React.FC<{ at: [number, number, number]; size: [number, number, number]; color: string; shadow?: boolean }> = ({
  at, size, color, shadow = true
}) => <mesh geometry={BOXG} material={toon(color)} position={at} scale={size} castShadow={shadow} receiveShadow />;

/** A sign on canvas: dark with white letters, like the drawn shop's. */
const Sign: React.FC<{ at: [number, number, number]; w: number; h: number; text: string; bg?: string; ink?: string }> = ({
  at, w, h, text, bg = c.sign, ink = c.signInk
}) => {
  const tex = useCanvasTexture(512, Math.round((512 * h) / w), (g) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = ink;
    g.font = `700 ${Math.round(((512 * h) / w) * 0.55)}px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 256, ((512 * h) / w) / 2 + 2);
  }, text + bg);
  return (
    <mesh position={at}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/** A row of cartons on a shelf, in a colour, leaving out any whose x is in `gap`. */
const Cartons: React.FC<{ x0: number; x1: number; y: number; z: number; color: string; band: string; gap?: [number, number] }> = ({
  x0, x1, y, z, color, band, gap
}) => {
  const out: React.ReactNode[] = [];
  for (let x = x0; x <= x1; x += 0.085) {
    if (gap && x > gap[0] && x < gap[1]) continue;
    for (const dz of [0, -0.1, -0.2]) {
      out.push(
        <group key={`${x}${dz}`} position={[x, y + 0.1, z + dz]}>
          <mesh geometry={BOXG} material={toon(color)} scale={[0.07, 0.19, 0.07]} castShadow />
          <mesh geometry={BOXG} material={toon(band)} position={[0, -0.02, 0]} scale={[0.071, 0.04, 0.071]} />
        </group>
      );
    }
  }
  return <>{out}</>;
};

/** The open dairy chiller along the back wall. */
const Chiller: React.FC = () => {
  const { x0, x1, depth, shelves } = CHILL;
  const xc = (x0 + x1) / 2;
  const w = x1 - x0;
  const zf = WALL_Z + depth;
  return (
    <group>
      <Box at={[xc, 1.0, WALL_Z + 0.03]} size={[w, 2.0, 0.06]} color="#e9eef1" />
      <Box at={[xc, 0.2, WALL_Z + depth / 2]} size={[w, 0.4, depth]} color={c.shelfDark} />
      {[x0, x1].map((x) => (
        <Box key={x} at={[x, 1.0, WALL_Z + depth / 2]} size={[0.05, 2.0, depth]} color={c.shelf} />
      ))}
      {shelves.map((y) => (
        <group key={y}>
          <Box at={[xc, y - 0.01, WALL_Z + depth / 2]} size={[w, 0.02, depth]} color={c.shelfEdge} />
          <Box at={[xc, y - 0.035, zf]} size={[w, 0.05, 0.02]} color="#4f7fa8" shadow={false} />
        </group>
      ))}
      {/* the canopy and its sign */}
      <Box at={[xc, 2.05, WALL_Z + depth / 2 + 0.05]} size={[w + 0.1, 0.18, depth + 0.1]} color="#e9eef1" />
      <Sign at={[xc, 2.05, zf + 0.101]} w={1.4} h={0.14} text="MOLKEREIPRODUKTE" />
      {/* bottom shelf: yoghurts; next: butter and cheese; the milk shelf with its gap; top: cream */}
      {Array.from({ length: 22 }, (_, i) => (
        <mesh key={"y" + i} geometry={CYL} material={toon(i % 3 ? "#f2f0ea" : "#e5c46a")} position={[x0 + 0.1 + i * 0.095, shelves[0] + 0.05, WALL_Z + 0.35]} scale={[0.035, 0.09, 0.035]} castShadow />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={"c" + i} geometry={BOXG} material={toon(i % 2 ? "#f2c94c" : "#f6e6a8")} position={[x0 + 0.12 + i * 0.13, shelves[1] + 0.04, WALL_Z + 0.35]} scale={[0.11, 0.07, 0.14]} castShadow />
      ))}
      {/* milk: white and blue cartons, with the gap where it has run out */}
      <Cartons x0={x0 + 0.1} x1={-2.35} y={MILK_Y} z={WALL_Z + 0.45} color="#f4f6f8" band="#3f78b6" gap={[-2.4, -2.0]} />
      {/* ... the gap itself, bare shelf, with a sold-out tag */}
      <Sign at={[-2.2, MILK_Y - 0.035, zf + 0.012]} w={0.3} h={0.045} text="AUSVERKAUFT" bg="#c0433a" />
      {/* oat milk beside it */}
      <Cartons x0={-1.98} x1={-1.2} y={MILK_Y} z={WALL_Z + 0.45} color="#efe2c2" band="#6f9a4a" />
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={"s" + i} geometry={CYL} material={toon("#f2f0ea")} position={[x0 + 0.1 + i * 0.12, shelves[3] + 0.06, WALL_Z + 0.35]} scale={[0.03, 0.12, 0.03]} castShadow />
      ))}
    </group>
  );
};

/** The produce table: egg boxes stacked, and a crate of tired tomatoes. */
const Produce: React.FC = () => {
  const { x, z, w, d, top } = TABLE;
  return (
    <group>
      <Box at={[x, top / 2, z]} size={[w, top, d]} color={c.wood} />
      <Box at={[x, top - 0.01, z]} size={[w + 0.04, 0.02, d + 0.04]} color={c.woodDark} />
      {/* eggs */}
      {[0, 1, 2].map((r) =>
        [0, 1].map((col) => (
          <Box key={`${r}${col}`} at={[x + 0.18 + col * 0.14, top + 0.035 + r * 0.07, z - 0.1]} size={[0.13, 0.068, 0.26]} color="#c9b999" />
        ))
      )}
      {/* the crate, and the tomatoes in it */}
      <Box at={[x - 0.3, top + 0.06, z + 0.05]} size={[0.42, 0.12, 0.34]} color={c.woodDark} />
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={"t" + i} geometry={SPH} material={toon(i % 3 === 0 ? "#8e5a3a" : "#b4533f")} position={[x - 0.47 + (i % 5) * 0.085, top + 0.13, z - 0.06 + Math.floor(i / 5) * 0.09]} scale={[0.033, 0.03, 0.033]} castShadow />
      ))}
      <Sign at={[x - 0.3, top + 0.2, z + 0.23]} w={0.3} h={0.08} text="Tomaten" bg="#f4f1ea" ink="#2b3440" />
    </group>
  );
};

/** The jam shelf, three boards of jars. */
const JamShelf: React.FC = () => (
  <group>
    <Box at={[(JAM.x0 + JAM.x1) / 2, 0.95, WALL_Z + 0.2]} size={[JAM.x1 - JAM.x0, 1.9, 0.4]} color={c.shelfDark} />
    {JAM.shelves.map((y) => (
      <group key={y}>
        <Box at={[(JAM.x0 + JAM.x1) / 2, y - 0.01, WALL_Z + 0.22]} size={[JAM.x1 - JAM.x0, 0.02, 0.4]} color={c.shelfEdge} />
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} geometry={CYL} material={toon(["#9c2a3a", "#d98b2b", "#5a2a4a"][i % 3])} position={[JAM.x0 + 0.06 + i * 0.085, y + 0.05, WALL_Z + 0.3]} scale={[0.036, 0.1, 0.036]} castShadow />
        ))}
      </group>
    ))}
    <Sign at={[(JAM.x0 + JAM.x1) / 2, 1.98, WALL_Z + 0.41]} w={0.8} h={0.12} text="FRÜHSTÜCK" />
  </group>
);

/** A stylised shopper: a body and a head, in a coat colour. */
const Shopper: React.FC<{ at: [number, number]; coat: string; h?: number }> = ({ at, coat, h = 1.7 }) => (
  <group position={[at[0], 0, at[1]]}>
    <mesh geometry={CYL} material={toon("#3a3f48")} position={[0, h * 0.24, 0]} scale={[0.13, h * 0.48, 0.1]} castShadow />
    <mesh geometry={SPH} material={toon(coat)} position={[0, h * 0.62, 0]} scale={[0.2, h * 0.2, 0.14]} castShadow />
    <mesh geometry={SPH} material={toon("#c48b64")} position={[0, h * 0.89, 0]} scale={[0.1, 0.12, 0.1]} castShadow />
  </group>
);

/** The checkout and its queue, and the free self-checkout by the front. */
const Checkout: React.FC = () => (
  <group>
    {/* the till counter, running front to back, and its cashier's screen */}
    <Box at={[-4.95, 0.45, -0.35]} size={[0.5, 0.9, 1.4]} color="#5d6b6f" />
    <Box at={[-4.95, 0.91, -0.35]} size={[0.52, 0.02, 1.42]} color="#3a4148" />
    <Box at={[-5.0, 1.15, -0.75]} size={[0.06, 0.3, 0.4]} color="#2b3238" />
    <Sign at={[-4.95, 2.1, -0.35]} w={0.7} h={0.18} text="KASSE 1" />
    {/* the queue, four long */}
    <Shopper at={[-4.55, -1.05]} coat="#7a97ad" />
    <Shopper at={[-4.5, -0.6]} coat="#b07f6d" h={1.62} />
    <Shopper at={[-4.55, -0.15]} coat="#8a9a6a" h={1.76} />
    <Shopper at={[-4.5, 0.3]} coat="#9c7ab0" h={1.68} />
    {/* the self-checkout: a kiosk with a green light, nobody at it */}
    <group position={[-3.95, 0, 0.55]} rotation={[0, -0.5, 0]}>
      <Box at={[0, 0.5, 0]} size={[0.45, 1.0, 0.4]} color="#e9eef1" />
      <Box at={[0, 1.2, -0.05]} size={[0.4, 0.35, 0.05]} color="#2b3238" />
      <mesh position={[0, 1.2, -0.02]}>
        <planeGeometry args={[0.34, 0.28]} />
        <meshBasicMaterial color="#8fd0a8" />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshBasicMaterial color="#3fcf6a" />
      </mesh>
      <Sign at={[0, 1.78, 0]} w={0.5} h={0.1} text="SB-KASSE" bg="#3f8a5a" />
    </group>
  </group>
);

/* ------------------------------------------------------------------ */
/* The room                                                            */
/* ------------------------------------------------------------------ */

export const Telefon3D: React.FC<{ state: SetState }> = () => {
  const m = useModels(["pottedPlant"]);
  if (!m) return null;
  return (
    <group>
      {/* the shop's floor and walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.75, 0.001, 0.8]} receiveShadow>
        <planeGeometry args={[5.5, 4.6]} />
        <meshToonMaterial color={c.floor} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-5.5 + i * 0.5, 0.002, 0.8]}>
          <planeGeometry args={[0.012, 4.6]} />
          <meshBasicMaterial color={c.floorLine} />
        </mesh>
      ))}
      <Wall x0={-5.6} x1={-0.1} z={WALL_Z} height={2.8} color={c.wall} bands={[{ y0: 0, y1: 0.12, color: c.shelfDark, proud: 0.01 }]} />
      <Chiller />
      <Produce />
      <JamShelf />
      <Checkout />
      {/* the wall between the shop and home, seen end-on */}
      <Box at={[0.02, 1.4, -0.3]} size={[0.24, 2.8, 2.4]} color="#cfcbc2" />
      {/* home */}
      <Kitchen m={m} />
      {/* the cake to come: a mixing bowl and a springform tin on the island */}
      <group position={[1.72, IT, 0.45]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.08, 0.12, 24, 1, true]} />
          <meshToonMaterial color="#e9e2d4" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 24]} />
          <meshToonMaterial color="#e9e2d4" />
        </mesh>
        <mesh position={[-0.2, 0.03, -0.15]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 28, 1, true]} />
          <meshToonMaterial color="#9aa1a8" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};
