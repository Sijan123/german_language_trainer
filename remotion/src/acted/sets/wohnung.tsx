/*
 * Their flat, in 3D: the bedroom and the kitchen side by side.
 *
 * The drawn c001 splits the frame into the two rooms, and so does this: a
 * dolls'-house cut with no front wall, the partition between the rooms seen
 * end-on as a strip down the middle of the wide shot, with a doorway in it
 * near the back so either of them can walk through.
 *
 *              back wall  z = -1.5
 *   [wardrobe] [window]   [bathroom] |door| [front door] [clock] [cabinets] [window]
 *   [table][====bed====]             |    |          [island]  [back counter]
 *        x = -3.3 .. -1.3            x = 0.1          x = 1.35 .. 1.95
 *
 *                      camera, side-on, at +z
 *
 * Doors are drawn as dark openings on the back wall; walking through one is
 * walking behind the wall, which hides a person as it would.
 *
 * Both clocks — the alarm clock on the bedside table and the one on the
 * kitchen wall — say half past seven, which is line 0.
 */

import React from "react";
import * as THREE from "three";
import { theme } from "../../theme";
import { Model, toon, useModels } from "../models";
import type { SetLayout, SetState } from "./index";

const b = theme.set.bedroom;
const k = theme.set.kitchen;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const WALL_Z = -1.5;
const BED = { x0: -3.3, x1: -1.3, z0: -1.5, z1: -0.1, top: 0.5 };
const TABLE = { x: -3.58, z: -0.36, top: 0.55 };
/* forward of the back counter by a walkway, so she can get past behind it */
const ISLAND = { x0: 1.35, x1: 1.95, z0: -0.45, z1: 0.85, top: 0.92 };
const BACK = { x0: 1.4, x1: 3.9, top: 0.9 };
const IT = ISLAND.top;

export const wohnungLayout: SetLayout = {
  chairs: {
    /* the front edge of the bed, near its head, facing the room */
    bed: { at: [-3.08, -0.24], yaw: -Math.PI / 2, seat: BED.top }
  },

  spots: {
    /* the alarm clock on the bedside table, its face turned to him and the lens */
    clockTable: { p: [TABLE.x + 0.02, TABLE.top, TABLE.z + 0.06], yaw: -Math.PI / 4 },
    /* on the island: where she works on the board, the sandwich on it */
    keyL: { p: [1.74, IT + 0.05, 0.15] },
    keyR: { p: [1.74, IT + 0.05, -0.09] },
    board: { p: [1.73, IT + 0.016, 0.03], yaw: 0 },
    /* the lunch box, waiting open-lidded; and put over to his side */
    lunchbox: { p: [1.76, IT, 0.37], yaw: 0 },
    lunchOut: { p: [1.47, IT, 0.3], yaw: 0.1 },
    /* her coffee, and where it goes back down */
    mug: { p: [1.84, IT, -0.22], yaw: 1.2 },
    /* the key in its bowl at the near end, on her side */
    key: { p: [1.84, IT + 0.018, 0.67], yaw: 0.6 },
    /* over the island between them, where things change hands */
    exchange: { p: [1.62, 1.04, 0.45] }
  },

  anchors: {
    bathroom: [-0.9, 1.3, WALL_Z],
    frontDoor: [0.75, 1.3, WALL_Z],
    kitchenClock: [1.0, 2.15, WALL_Z + 0.03],
    coffee: [2.35, BACK.top + 0.2, -1.25],
    bed: [-2.3, 0.6, -0.8]
  }
};

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const Box: React.FC<{ at: [number, number, number]; size: [number, number, number]; color: string; shadow?: boolean }> = ({
  at, size, color, shadow = true
}) => (
  <mesh position={at} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} />
    <meshToonMaterial color={color} />
  </mesh>
);

/** A dark doorway on the back wall, with its frame. */
const Doorway: React.FC<{ x: number; inside: string; w?: number }> = ({ x, inside, w = 0.84 }) => (
  <group position={[x, 0, WALL_Z]}>
    <mesh position={[0, 1.02, 0.012]}>
      <planeGeometry args={[w, 2.04]} />
      <meshBasicMaterial color={inside} />
    </mesh>
    {[-1, 1].map((s) => (
      <Box key={s} at={[(s * (w + 0.06)) / 2, 1.04, 0.02]} size={[0.06, 2.08, 0.04]} color="#f1ede6" shadow={false} />
    ))}
    <Box at={[0, 2.08, 0.02]} size={[w + 0.12, 0.06, 0.04]} color="#f1ede6" shadow={false} />
  </group>
);

/** A window on the back wall: frame, glass, a cross bar, curtains either side. */
const Window: React.FC<{ x: number; y: number; w: number; h: number; sky: string; curtain?: string }> = ({ x, y, w, h, sky, curtain }) => (
  <group position={[x, y, WALL_Z]}>
    <Box at={[0, 0, 0.01]} size={[w + 0.08, h + 0.08, 0.03]} color="#f4f1ea" shadow={false} />
    <mesh position={[0, 0, 0.027]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={sky} />
    </mesh>
    <Box at={[0, 0, 0.03]} size={[0.03, h, 0.01]} color="#f4f1ea" shadow={false} />
    {curtain
      ? [-1, 1].map((s) => (
          <Box key={s} at={[(s * (w + 0.2)) / 2, -0.05, 0.06]} size={[0.2, h + 0.3, 0.04]} color={curtain} />
        ))
      : null}
  </group>
);

/** A wall clock at half past seven. */
const WallClock: React.FC = () => {
  const [x, y, z] = wohnungLayout.anchors.kitchenClock;
  const hour = (7.5 / 12) * Math.PI * 2;
  const min = Math.PI;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.035, 36]} />
        <meshToonMaterial color={b.clock} />
      </mesh>
      <mesh position={[0, 0, 0.019]}>
        <circleGeometry args={[0.15, 36]} />
        <meshBasicMaterial color={b.clockFace} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.125, Math.cos(a) * 0.125, 0.021]} rotation={[0, 0, -a]}>
            <planeGeometry args={[0.01, i % 3 === 0 ? 0.034 : 0.018]} />
            <meshBasicMaterial color={b.clock} />
          </mesh>
        );
      })}
      <mesh position={[Math.sin(hour) * 0.04, Math.cos(hour) * 0.04, 0.024]} rotation={[0, 0, -hour]}>
        <planeGeometry args={[0.016, 0.085]} />
        <meshBasicMaterial color="#1f2a3c" />
      </mesh>
      <mesh position={[Math.sin(min) * 0.055, Math.cos(min) * 0.055, 0.026]} rotation={[0, 0, -min]}>
        <planeGeometry args={[0.01, 0.12]} />
        <meshBasicMaterial color="#1f2a3c" />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The bedroom                                                         */
/* ------------------------------------------------------------------ */

const SPHERE = new THREE.SphereGeometry(1, 24, 16);

const Bedroom: React.FC = () => {
  const bx = (BED.x0 + BED.x1) / 2;
  const bz = (BED.z0 + BED.z1) / 2;
  const L = BED.x1 - BED.x0;
  const W = BED.z1 - BED.z0;
  return (
    <group>
      {/* the wooden floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.001, 0.5]} receiveShadow>
        <planeGeometry args={[4.6, 5]} />
        <meshToonMaterial color={b.floor} />
      </mesh>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.002, WALL_Z + i * 0.17]}>
          <planeGeometry args={[4.6, 0.008]} />
          <meshBasicMaterial color={b.floorLine} />
        </mesh>
      ))}
      <mesh position={[-2.2, 1.4, WALL_Z - 0.01]} receiveShadow>
        <planeGeometry args={[4.8, 2.8]} />
        <meshToonMaterial color={b.wall} />
      </mesh>
      <Box at={[-2.2, 0.05, WALL_Z + 0.01]} size={[4.8, 0.1, 0.02]} color={b.skirting} shadow={false} />

      {/* the bed: frame, mattress, a thrown-back duvet, pillows, headboard */}
      <Box at={[bx, 0.17, bz]} size={[L, 0.24, W]} color={b.wood} />
      <Box at={[bx, 0.39, bz]} size={[L - 0.04, 0.2, W - 0.04]} color={b.sheet} />
      <Box at={[BED.x0 - 0.03, 0.55, bz]} size={[0.06, 0.95, W + 0.04]} color={b.woodDark} />
      {/* the duvet over the far half and the foot, pushed back where he got up */}
      <mesh geometry={SPHERE} position={[bx + 0.3, 0.5, bz - 0.25]} scale={[L * 0.42, 0.07, W * 0.36]} castShadow receiveShadow>
        <meshToonMaterial color={b.duvet} />
      </mesh>
      <mesh geometry={SPHERE} position={[bx - 0.35, 0.51, bz - 0.35]} rotation={[0, 0.3, 0.1]} scale={[0.35, 0.09, 0.28]} castShadow>
        <meshToonMaterial color={b.duvetDark} />
      </mesh>
      {[-0.35, 0.35].map((dz) => (
        <mesh key={dz} geometry={SPHERE} position={[BED.x0 + 0.24, 0.55, bz + dz]} scale={[0.17, 0.07, 0.28]} castShadow>
          <meshToonMaterial color={b.pillow} />
        </mesh>
      ))}

      {/* the bedside table and its lamp */}
      <Box at={[TABLE.x, TABLE.top / 2, TABLE.z]} size={[0.44, TABLE.top, 0.42]} color={b.wood} />
      <Box at={[TABLE.x + 0.221, TABLE.top * 0.55, TABLE.z]} size={[0.004, 0.08, 0.3]} color={b.woodDark} shadow={false} />
      <mesh position={[TABLE.x - 0.08, TABLE.top + 0.12, TABLE.z - 0.1]} castShadow>
        <cylinderGeometry args={[0.012, 0.05, 0.24, 16]} />
        <meshToonMaterial color={b.woodDark} />
      </mesh>
      <mesh position={[TABLE.x - 0.08, TABLE.top + 0.3, TABLE.z - 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.16, 20, 1, true]} />
        <meshToonMaterial color={b.lamp} side={THREE.DoubleSide} />
      </mesh>

      {/* the wardrobe against the back wall, his jacket hung on its door */}
      <Box at={[-4.05, 1.0, WALL_Z + 0.3]} size={[0.8, 2.0, 0.6]} color={b.wardrobe} />
      <Box at={[-4.05, 1.0, WALL_Z + 0.601]} size={[0.006, 1.9, 0.004]} color={b.wardrobeDark} shadow={false} />
      <Window x={-2.25} y={1.62} w={1.0} h={1.0} sky={b.sky} curtain={b.duvetDark} />
      {/* a picture over the bed */}
      <group position={[-2.3, 1.62, WALL_Z]} />
      {/* a rug by the bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.004, 0.3]} receiveShadow>
        <planeGeometry args={[1.6, 0.8]} />
        <meshToonMaterial color={b.scarf} />
      </mesh>
      {/* the bathroom, through its door: pale tiles */}
      <Doorway x={-0.9} inside="#b8cdd6" />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The kitchen                                                         */
/* ------------------------------------------------------------------ */

const PLANT = { wood: "#c9b89a", woodDark: "#b3a283", plant: "#7f9a64" };

const Kitchen: React.FC<{ m: Record<string, THREE.Group> }> = ({ m }) => {
  const ix = (ISLAND.x0 + ISLAND.x1) / 2;
  const iz = (ISLAND.z0 + ISLAND.z1) / 2;
  return (
    <group>
      {/* tiled floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.35, 0.001, 0.5]} receiveShadow>
        <planeGeometry args={[4.5, 5]} />
        <meshToonMaterial color={k.floor} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={"a" + i} rotation={[-Math.PI / 2, 0, 0]} position={[0.2 + i * 0.4, 0.002, 0.5]}>
          <planeGeometry args={[0.01, 5]} />
          <meshBasicMaterial color={k.counter} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={"b" + i} rotation={[-Math.PI / 2, 0, 0]} position={[2.35, 0.002, WALL_Z + i * 0.4]}>
          <planeGeometry args={[4.5, 0.01]} />
          <meshBasicMaterial color={k.counter} />
        </mesh>
      ))}
      <mesh position={[2.35, 1.4, WALL_Z - 0.01]} receiveShadow>
        <planeGeometry args={[4.6, 2.8]} />
        <meshToonMaterial color={k.wall} />
      </mesh>
      {/* tiles behind the worktop */}
      <mesh position={[(BACK.x0 + BACK.x1) / 2, 1.18, WALL_Z]}>
        <planeGeometry args={[BACK.x1 - BACK.x0, 0.56]} />
        <meshToonMaterial color={k.tile} />
      </mesh>

      {/* the back counter: base units, worktop, wall cabinets */}
      <Box at={[(BACK.x0 + BACK.x1) / 2, BACK.top / 2 - 0.02, WALL_Z + 0.3]} size={[BACK.x1 - BACK.x0, BACK.top - 0.04, 0.6]} color={k.cabinet} />
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i} at={[BACK.x0 + 0.25 + i * 0.5, BACK.top / 2, WALL_Z + 0.601]} size={[0.46, BACK.top - 0.14, 0.004]} color={k.cabinetDark} shadow={false} />
      ))}
      <Box at={[(BACK.x0 + BACK.x1) / 2, BACK.top - 0.015, WALL_Z + 0.31]} size={[BACK.x1 - BACK.x0 + 0.02, 0.03, 0.64]} color={k.counterTop} />
      <Box at={[1.95, 1.8, WALL_Z + 0.18]} size={[1.1, 0.7, 0.36]} color={k.cabinet} />
      <Box at={[1.95, 1.8, WALL_Z + 0.361]} size={[0.004, 0.66, 0.004]} color={k.cabinetDark} shadow={false} />
      <Window x={3.15} y={1.7} w={1.0} h={0.9} sky={k.sky} />

      {/* the coffee machine, and a jar or two */}
      <group position={[2.35, BACK.top, -1.25]}>
        <Box at={[0, 0.17, 0]} size={[0.24, 0.34, 0.28]} color="#2f3336" />
        <Box at={[0, 0.06, 0.1]} size={[0.14, 0.02, 0.1]} color="#8a9094" />
        <mesh position={[0, 0.1, 0.08]}>
          <cylinderGeometry args={[0.035, 0.03, 0.08, 16]} />
          <meshToonMaterial color="#e9e2d4" />
        </mesh>
        <Box at={[0, 0.3, 0.141]} size={[0.1, 0.05, 0.004]} color="#8fd0e8" shadow={false} />
      </group>
      {[[2.8, "#c97f4a"], [2.95, "#e0c070"]].map(([x, c]) => (
        <mesh key={x as number} position={[x as number, BACK.top + 0.09, -1.3]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.18, 18]} />
          <meshToonMaterial color={c as string} />
        </mesh>
      ))}
      <WallClock />
      {/* the flat's front door, next to the partition */}
      <Doorway x={0.75} inside="#6d6a63" w={0.9} />
      <Model model={m.pottedPlant} at={[3.75, 0.2]} yaw={-Math.PI / 2} paint={PLANT} scale={1.6} />

      {/* the island they talk across */}
      <Box at={[ix, (IT - 0.03) / 2, iz]} size={[ISLAND.x1 - ISLAND.x0, IT - 0.03, ISLAND.z1 - ISLAND.z0]} color={k.cabinet} />
      <Box at={[ix, IT - 0.015, iz]} size={[ISLAND.x1 - ISLAND.x0 + 0.06, 0.03, ISLAND.z1 - ISLAND.z0 + 0.06]} color={k.wood} />
      {/* the board, a loaf with its heel cut, the knife, the key bowl */}
      <Box at={[1.73, IT + 0.008, 0.03]} size={[0.3, 0.016, 0.22]} color="#d6ae7a" />
      <mesh geometry={SPHERE} position={[1.62, IT + 0.06, -0.3]} scale={[0.12, 0.055, 0.07]} castShadow>
        <meshToonMaterial color="#b98a54" />
      </mesh>
      <Box at={[1.53, IT + 0.004, -0.1]} size={[0.2, 0.004, 0.02]} color="#c9ced1" />
      <mesh position={[1.84, IT + 0.01, 0.67]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.05, 0.02, 24]} />
        <meshToonMaterial color="#7a97ad" />
      </mesh>
    </group>
  );
};

/** The wall between the rooms: seen end-on in the wide, with a doorway near the back. */
const Partition: React.FC = () => (
  <group>
    <Box at={[0.1, 1.3, (WALL_Z + -1.25) / 2]} size={[0.1, 2.6, 0.25]} color={b.wallDark} />
    <Box at={[0.1, 1.3, (-0.4 + 0.9) / 2]} size={[0.1, 2.6, 1.3]} color={b.wallDark} />
    <Box at={[0.1, 2.35, (-1.25 + -0.4) / 2]} size={[0.1, 0.5, 0.85]} color={b.wallDark} />
  </group>
);

export const Wohnung3D: React.FC<{ state: SetState }> = () => {
  const m = useModels(["pottedPlant"]);
  if (!m) return null;
  return (
    <group>
      <Bedroom />
      <Partition />
      <Kitchen m={m} />
    </group>
  );
};

export { toon };
