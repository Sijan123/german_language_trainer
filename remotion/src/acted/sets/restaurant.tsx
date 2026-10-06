/*
 * A small restaurant in the evening, for c003 ("Ein Tisch für zwei").
 *
 *   back wall z = -2.3
 *   [street door] [host stand]  [====== window ======] [board] [kitchen door] [bar, bottles]
 *        x = -3.6      -2.25       x = -1.45 .. 0.35     1.12       2.05        2.8 .. 4.6
 *                                 [chair][table][chair]
 *                                    the window table, x = 0, z = -1.3
 *   [reserved table]                                           [reserved table]
 *
 *                      camera, side-on, at +z
 *
 * They come in off the street through the glass door on the left, where the
 * waiter meets them at his stand, and are taken to the table by the window.
 * The waiter serves from behind the table, between it and the window, so he
 * faces the camera while he does it and never stands between the lens and
 * the two of them. The kitchen is through the door on the right.
 *
 * It is dark outside: the window and the door look onto a street at night,
 * and the room is lit by the lamps over the tables. The other tables are laid
 * and marked "Reserviert", which is why "haben Sie noch einen Tisch frei?" is
 * a question worth asking.
 *
 * The board by the window lists the evening's dishes, the ones the dialogue
 * orders, so a callout on "Nudeln" or "Eis" has something to ring.
 */

import React from "react";
import * as THREE from "three";
import { theme } from "../../theme";
import { Model, useModels } from "../models";
import type { SetLayout, SetState } from "./index";
import { useCanvasTexture } from "./buergerbuero";
import { Behind, DoorFrame, DoorLeaf, Wall } from "./walls";

const r = theme.set.restaurant;
const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const HAND = "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const WALL_Z = -2.3;
const DOOR = { x: -3.6, w: 1.0, h: 2.15 };
const KITCHEN = { x: 2.05, w: 0.9, h: 2.05 };
const WINDOW = { x: -0.55, w: 1.8, h: 2.15, y: 0.95 };
/* the window table: 0.8 square, top where rig.ts rests a hand on a desk */
const TABLE = { x: 0, z: -1.3, half: 0.4, top: 0.77 };
const TT = TABLE.top;
const STAND = { x: -2.2, z: -1.98, top: 1.06 };
const BOARD = { x: 1.12, y: 1.85, w: 0.72, h: 0.6 };
const BAR = { x0: 2.8, x1: 4.6, z0: -1.6, z1: -1.05, top: 1.08 };

/* the board's rows, top to bottom, and where each sits on the wall */
const DISHES: [string, string][] = [
  ["Gemüsesuppe", "5,50"],
  ["Salat", "4,90"],
  ["Nudeln mit Tomatensoße", "9,80"],
  ["Eis", "3,90"]
];
const BOARD_PX = { w: 720, h: 600, row0: 200, row: 92 };
const rowY = (i: number) => BOARD.y + BOARD.h / 2 - ((BOARD_PX.row0 + i * BOARD_PX.row) / BOARD_PX.h) * BOARD.h;

export const restaurantLayout: SetLayout = {
  chairs: {
    /* pulled out a little at the start, so a person can stand clear of the
       table in front of the seat; they shuffle in once sat. Both turned
       towards the camera. */
    shruti: { at: [-1.05, -1.34], yaw: -0.3, seat: 0.47, desk: true },
    sijan: { at: [1.05, -1.34], yaw: Math.PI + 0.3, seat: 0.47, desk: true }
  },

  spots: {
    /* the menus, stacked on the host stand */
    menuStand: { p: [STAND.x - 0.02, STAND.top + 0.002, STAND.z + 0.02], yaw: 0.15 },
    /* where the waiter lays them, one at each place */
    menuShruti: { p: [-0.17, TT + 0.001, -1.42], yaw: -Math.PI / 2 },
    menuSijan: { p: [0.17, TT + 0.001, -1.42], yaw: -Math.PI / 2 },
    /* read and done with: laid by the back edge for him to collect */
    menusDone: { p: [0.02, TT + 0.001, -1.52], yaw: -Math.PI / 2 + 0.1 },
    /* the places: a plate goes down here */
    placeShruti: { p: [-0.19, TT, -1.32], yaw: 0 },
    placeSijan: { p: [0.19, TT, -1.32], yaw: Math.PI },
    /* the cutlery on the right of each place (her +z, his -z) */
    spoonShruti: { p: [-0.27, TT + 0.004, -1.09], yaw: 0 },
    forkSijan: { p: [0.27, TT + 0.004, -1.52], yaw: Math.PI },
    /* the water glasses, back right of each place */
    glassShruti: { p: [-0.32, TT, -1.56], yaw: 0 },
    glassSijan: { p: [0.34, TT, -1.54], yaw: 0 },
    /* over the table between them */
    exchange: { p: [0, TT + 0.15, -1.3] },
    /* in the kitchen, behind the wall: the dishes waiting on the pass */
    kitchenSoup: { p: [3.05, 0.94, -3.12], yaw: 0 },
    kitchenPasta: { p: [2.72, 0.94, -3.12], yaw: 0 },
    kitchenMenus: { p: [3.3, 0.94, -3.1], yaw: 0.2 },
    /* the spoon and the fork, laid down when they have finished */
    spoonDone: { p: [-0.22, TT + 0.004, -1.1], yaw: 0.25 },
    forkDone: { p: [0.24, TT + 0.004, -1.54], yaw: Math.PI - 0.25 }
  },

  anchors: {
    table: [TABLE.x, TT + 0.05, TABLE.z],
    fenster: [WINDOW.x - 0.4, 1.55, WALL_Z],
    board: [BOARD.x, BOARD.y, WALL_Z + 0.03],
    boardSuppe: [BOARD.x, rowY(0), WALL_Z + 0.03],
    boardNudeln: [BOARD.x, rowY(2), WALL_Z + 0.03],
    boardEis: [BOARD.x - 0.2, rowY(3), WALL_Z + 0.03],
    door: [DOOR.x, 1.3, WALL_Z],
    kitchen: [KITCHEN.x, 1.3, WALL_Z],
    stand: [STAND.x, STAND.top, STAND.z]
  },

  /* the room's own lights, as the Blender render lights it: the lamps over
     the tables, the bar and the kitchen through its door */
  lights: [
    { p: [TABLE.x, 2.18, TABLE.z], color: "#ffd49a", power: 60 },
    { p: [-2.7, 2.18, 0.55], color: "#ffd49a", power: 35 },
    { p: [2.75, 2.18, 0.5], color: "#ffd49a", power: 35 },
    { p: [3.7, 2.1, -1.5], color: "#ffcf8c", power: 45 },
    { p: [STAND.x, 1.9, STAND.z + 0.3], color: "#ffd49a", power: 25 },
    { p: [KITCHEN.x + 0.6, 2.2, WALL_Z - 0.8], color: "#e8f0ff", power: 60 }
  ]
};

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const Box: React.FC<{ at: [number, number, number]; size: [number, number, number]; color: string; shadow?: boolean; rot?: [number, number, number] }> = ({
  at, size, color, shadow = true, rot
}) => (
  <mesh position={at} rotation={rot} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} />
    <meshToonMaterial color={color} />
  </mesh>
);

const Cyl: React.FC<{ at: [number, number, number]; r: [number, number]; h: number; color: string; seg?: number; shadow?: boolean }> = ({
  at, r: [rt, rb], h, color, seg = 24, shadow = true
}) => (
  <mesh position={at} castShadow={shadow} receiveShadow>
    <cylinderGeometry args={[rt, rb, h, seg]} />
    <meshToonMaterial color={color} />
  </mesh>
);

/** A street at night: houses opposite with lit windows, lamps, the sky. */
function useStreet() {
  return useCanvasTexture(1600, 700, (g) => {
    const sky = g.createLinearGradient(0, 0, 0, 700);
    sky.addColorStop(0, "#16213b");
    sky.addColorStop(0.6, "#2b3d63");
    sky.addColorStop(1, "#3a4a6a");
    g.fillStyle = sky;
    g.fillRect(0, 0, 1600, 700);
    /* the houses across the road, gables and all */
    const houses = [
      [0, 170, 300], [170, 150, 250], [320, 220, 330], [540, 160, 230], [700, 240, 300],
      [940, 180, 260], [1120, 210, 340], [1330, 150, 240], [1480, 180, 300]
    ];
    for (const [x, w, h] of houses) {
      const top = 700 - 120 - h;
      g.fillStyle = "#1c2438";
      g.fillRect(x, top, w + 2, h + 120);
      g.beginPath();
      g.moveTo(x - 4, top + 2);
      g.lineTo(x + w / 2, top - 60);
      g.lineTo(x + w + 6, top + 2);
      g.fill();
      /* windows, some lit */
      for (let yy = top + 30; yy < 700 - 150; yy += 70) {
        for (let xx = x + 22; xx < x + w - 30; xx += 52) {
          const lit = Math.sin(xx * 12.9898 + yy * 78.233) * 43758.5453 % 1;
          g.fillStyle = Math.abs(lit) > 0.45 ? "#f3c66b" : "#2a3350";
          g.fillRect(xx, yy, 26, 38);
        }
      }
    }
    /* the pavement and the road */
    g.fillStyle = "#2c3140";
    g.fillRect(0, 580, 1600, 120);
    g.fillStyle = "#3b4050";
    g.fillRect(0, 580, 1600, 16);
    /* street lamps and their glow */
    for (const x of [120, 700, 1280]) {
      const glow = g.createRadialGradient(x, 330, 4, x, 330, 150);
      glow.addColorStop(0, "rgba(255,214,140,0.85)");
      glow.addColorStop(1, "rgba(255,214,140,0)");
      g.fillStyle = glow;
      g.fillRect(x - 150, 180, 300, 300);
      g.fillStyle = "#11151f";
      g.fillRect(x - 4, 330, 8, 260);
      g.fillStyle = "#ffe2a8";
      g.beginPath();
      g.arc(x, 330, 12, 0, Math.PI * 2);
      g.fill();
    }
  }, "street");
}

/** The street, far enough behind the glass that it moves a little with the camera. */
const Street: React.FC<{ x: number; w: number; tex: THREE.Texture }> = ({ x, w, tex }) => (
  <mesh position={[x, 1.25, WALL_Z - 1.2]}>
    <planeGeometry args={[w, w * (700 / 1600)]} />
    <meshBasicMaterial map={tex} toneMapped={false} />
  </mesh>
);

/** The window by the table: frame, mullions, a deep sill, curtains. */
const Window: React.FC<{ tex: THREE.Texture }> = ({ tex }) => {
  const { x, w, h, y } = WINDOW;
  const mid = (y + h) / 2;
  const H = h - y;
  return (
    <group>
      <Street x={x} w={4.2} tex={tex} />
      {/* the reveals either side, so the wall has thickness */}
      {[-1, 1].map((s) => (
        <Box key={"rv" + s} at={[x + (s * w) / 2, mid, WALL_Z - 0.1]} size={[0.02, H, 0.2]} color={r.wallDark} shadow={false} />
      ))}
      {/* frame and mullions */}
      <Box at={[x, y + 0.025, WALL_Z + 0.03]} size={[w + 0.1, 0.05, 0.22]} color={r.frame} />
      <Box at={[x, h - 0.03, WALL_Z - 0.02]} size={[w + 0.08, 0.06, 0.08]} color={r.frame} />
      {[-1, 1].map((s) => (
        <Box key={s} at={[x + (s * (w + 0.04)) / 2, mid, WALL_Z - 0.02]} size={[0.06, H, 0.08]} color={r.frame} />
      ))}
      {[-w / 6, w / 6].map((dx) => (
        <Box key={dx} at={[x + dx, mid, WALL_Z - 0.05]} size={[0.04, H, 0.04]} color={r.frame} />
      ))}
      <Box at={[x, y + H * 0.66, WALL_Z - 0.05]} size={[w, 0.035, 0.04]} color={r.frame} />
      {/* the glass: a faint reflection of the room */}
      <mesh position={[x, mid, WALL_Z - 0.06]}>
        <planeGeometry args={[w, H]} />
        <meshBasicMaterial color="#e8d3b0" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      {/* curtains, drawn back */}
      {[-1, 1].map((s) => (
        <mesh key={"c" + s} position={[x + s * (w / 2 + 0.16), mid + 0.1, WALL_Z + 0.07]} castShadow>
          <boxGeometry args={[0.26, H + 0.25, 0.06]} />
          <meshToonMaterial color="#9c3f36" />
        </mesh>
      ))}
      <Box at={[x, h + 0.14, WALL_Z + 0.08]} size={[w + 0.8, 0.03, 0.03]} color={r.rail} />
    </group>
  );
};

/** The evening's dishes, in chalk. */
const Board: React.FC = () => {
  const tex = useCanvasTexture(BOARD_PX.w, BOARD_PX.h, (g) => {
    g.fillStyle = "#2b2f2c";
    g.fillRect(0, 0, BOARD_PX.w, BOARD_PX.h);
    g.strokeStyle = "#8d5f38";
    g.lineWidth = 26;
    g.strokeRect(0, 0, BOARD_PX.w, BOARD_PX.h);
    g.fillStyle = "#f3efe4";
    g.textBaseline = "middle";
    g.font = `700 64px ${HAND}`;
    g.textAlign = "center";
    g.fillText("Heute Abend", BOARD_PX.w / 2, 96);
    g.textAlign = "left";
    DISHES.forEach(([k, v], i) => {
      const y = BOARD_PX.row0 + i * BOARD_PX.row;
      g.font = `600 ${k.length > 14 ? 34 : 48}px ${HAND}`;
      g.fillStyle = "#f3efe4";
      g.fillText(k, 50, y);
      g.font = `700 46px ${HAND}`;
      g.fillStyle = "#f2d38a";
      g.textAlign = "right";
      g.fillText(v + " €", BOARD_PX.w - 44, y);
      g.textAlign = "left";
    });
  }, "board");
  return (
    <group position={[BOARD.x, BOARD.y, WALL_Z + 0.02]}>
      <mesh>
        <planeGeometry args={[BOARD.w, BOARD.h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** A folded card on a laid table. */
const Reserved: React.FC<{ at: [number, number, number]; yaw: number }> = ({ at, yaw }) => {
  const tex = useCanvasTexture(256, 96, (g) => {
    g.fillStyle = "#f7f3e8";
    g.fillRect(0, 0, 256, 96);
    g.fillStyle = "#5a4b3c";
    g.font = `600 38px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("Reserviert", 128, 50);
  }, "reserved");
  return (
    <group position={at} rotation={[0, yaw, 0]}>
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0.03, s * 0.012]} rotation={[s * -0.35, s > 0 ? 0 : Math.PI, 0]} castShadow>
          <planeGeometry args={[0.12, 0.065]} />
          <meshBasicMaterial map={tex} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

/** A lamp hung over a table: cord, shade, the bulb glowing inside. */
/* high enough that the waiter, standing under the one over the window table,
   does not have it on his head (in the Blender render it is a real light) */
const Pendant: React.FC<{ x: number; z: number; y?: number }> = ({ x, z, y = 2.2 }) => (
  <group position={[x, y, z]}>
    <Box at={[0, (2.9 - y) / 2 + 0.1, 0]} size={[0.012, 2.9 - y, 0.012]} color="#2a2420" shadow={false} />
    <mesh position={[0, 0.08, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.22, 0.18, 32, 1, true]} />
      <meshToonMaterial color={r.lamp} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.0, 0]}>
      <sphereGeometry args={[0.055, 16, 12]} />
      <meshBasicMaterial color="#fff1cf" toneMapped={false} />
    </mesh>
  </group>
);

/** A laid table: pedestal, cloth, and what is on it before anyone sits. */
const Table: React.FC<{ x: number; z: number; half?: number; children?: React.ReactNode }> = ({ x, z, half = 0.4, children }) => {
  const drop = 0.17;
  return (
    <group position={[x, 0, z]}>
      <Cyl at={[0, 0.02, 0]} r={[0.26, 0.28]} h={0.04} color="#2a2420" />
      <Cyl at={[0, TT / 2, 0]} r={[0.045, 0.05]} h={TT - 0.04} color="#2a2420" />
      <Box at={[0, TT - 0.02, 0]} size={[half * 2, 0.04, half * 2]} color={r.bar} />
      {/* the cloth: over the top and hanging down the sides */}
      <Box at={[0, TT + 0.002, 0]} size={[half * 2 + 0.04, 0.006, half * 2 + 0.04]} color={r.cloth} />
      {[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([sx, sz]) => (
        <Box
          key={`${sx}${sz}`}
          at={[sx * (half + 0.02), TT - drop / 2, sz * (half + 0.02)]}
          size={sx ? [0.006, drop, half * 2 + 0.04] : [half * 2 + 0.04, drop, 0.006]}
          color={r.clothShade}
        />
      ))}
      {children}
    </group>
  );
};

/** A plate, a folded napkin and a glass: a place laid for someone not here yet. */
const Setting: React.FC<{ at: [number, number]; yaw: number }> = ({ at, yaw }) => (
  <group position={[at[0], TT, at[1]]} rotation={[0, yaw, 0]}>
    <Cyl at={[0, 0.006, 0]} r={[0.12, 0.1]} h={0.012} color={r.plate} />
    <Box at={[0, 0.02, 0]} size={[0.1, 0.02, 0.05]} color="#b9d2c4" rot={[0, 0.3, 0]} />
    <Box at={[0.005, 0.005, 0.15]} size={[0.17, 0.004, 0.012]} color="#c9ced1" />
    <Box at={[0.005, 0.005, -0.15]} size={[0.17, 0.004, 0.012]} color="#c9ced1" />
    <mesh position={[0.13, 0.06, -0.13]}>
      <cylinderGeometry args={[0.032, 0.028, 0.12, 20, 1, true]} />
      <meshToonMaterial color={r.water} transparent opacity={0.45} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** A candle in a glass and a small vase with one flower. */
const Centre: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, TT, z]}>
    <mesh position={[0, 0.045, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.09, 20, 1, true]} />
      <meshToonMaterial color="#e8d3b0" transparent opacity={0.4} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
    <Cyl at={[0, 0.03, 0]} r={[0.025, 0.025]} h={0.06} color="#f4efe2" />
    <mesh position={[0, 0.072, 0]}>
      <sphereGeometry args={[0.009, 10, 8]} />
      <meshBasicMaterial color="#ffcf6a" toneMapped={false} />
    </mesh>
    <group position={[0.1, 0, 0.02]}>
      <Cyl at={[0, 0.06, 0]} r={[0.022, 0.03]} h={0.12} color={r.vase} />
      <Box at={[0, 0.16, 0]} size={[0.004, 0.1, 0.004]} color="#5f7d4a" shadow={false} />
      <mesh position={[0, 0.215, 0]}>
        <sphereGeometry args={[0.022, 12, 10]} />
        <meshToonMaterial color="#d8606a" />
      </mesh>
    </group>
  </group>
);

/** The waiter's stand by the door: a narrow lectern with a lamp. */
const Stand: React.FC = () => (
  <group position={[STAND.x, 0, STAND.z]}>
    <Box at={[0, 0.52, 0]} size={[0.5, 1.04, 0.36]} color={r.bar} />
    <Box at={[0, 0.3, 0.181]} size={[0.42, 0.5, 0.004]} color={r.barDark} shadow={false} />
    <Box at={[0, STAND.top - 0.01, 0]} size={[0.56, 0.03, 0.42]} color={r.barDark} />
    <Cyl at={[0.2, STAND.top + 0.1, -0.12]} r={[0.008, 0.008]} h={0.2} color="#2a2420" />
    <mesh position={[0.2, STAND.top + 0.23, -0.12]}>
      <cylinderGeometry args={[0.04, 0.07, 0.08, 16, 1, true]} />
      <meshToonMaterial color={r.lamp} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** The bar on the right: counter, shelf of bottles, the coffee machine. */
const Bar: React.FC<{ m: Record<string, THREE.Group> }> = ({ m }) => {
  const cx = (BAR.x0 + BAR.x1) / 2;
  const cz = (BAR.z0 + BAR.z1) / 2;
  const bottles = ["#7f9a7a", "#5d7a4e", "#b6862e", "#8a3a2e", "#cfd8d2", "#7f9a7a", "#4e5f3e", "#c9a14a", "#8a3a2e", "#7f9a7a"];
  return (
    <group>
      <Box at={[cx, (BAR.top - 0.04) / 2, cz]} size={[BAR.x1 - BAR.x0, BAR.top - 0.04, BAR.z1 - BAR.z0]} color={r.bar} />
      {Array.from({ length: 4 }, (_, i) => (
        <Box key={i} at={[BAR.x0 + 0.225 + i * 0.45, BAR.top / 2, BAR.z1 + 0.002]} size={[0.4, BAR.top - 0.2, 0.004]} color={r.barDark} shadow={false} />
      ))}
      <Box at={[cx, BAR.top - 0.02, cz]} size={[BAR.x1 - BAR.x0 + 0.06, 0.04, BAR.z1 - BAR.z0 + 0.08]} color={r.barDark} />
      <Box at={[cx, 0.08, BAR.z1 + 0.06]} size={[BAR.x1 - BAR.x0, 0.03, 0.03]} color={r.metal} />
      {/* the shelves on the wall behind, with bottles */}
      {[1.45, 1.8].map((y, j) => (
        <group key={y}>
          <Box at={[cx, y, WALL_Z + 0.12]} size={[BAR.x1 - BAR.x0 - 0.2, 0.03, 0.22]} color={r.barDark} />
          {bottles.map((c, i) => (
            <group key={i} position={[BAR.x0 + 0.25 + i * 0.14 + j * 0.05, y + 0.015, WALL_Z + 0.12]}>
              <Cyl at={[0, 0.1, 0]} r={[0.032, 0.032]} h={0.2} color={c} seg={12} />
              <Cyl at={[0, 0.24, 0]} r={[0.011, 0.028]} h={0.08} color={c} seg={12} />
            </group>
          ))}
        </group>
      ))}
      <Model model={m.kitchenCoffeeMachine} at={[3.1, cz - 0.05]} y={BAR.top} yaw={-Math.PI / 2} scale={1.6} />
      {[3.4, 3.95].map((x) => (
        <Model key={x} model={m.stoolBar} at={[x, BAR.z1 + 0.35]} yaw={Math.PI / 2} paint={STOOL} scale={1.9} />
      ))}
    </group>
  );
};

const CHAIR = { wood: "#6f4830", woodDark: "#5a3a26", carpet: "#9c3f36" };
const STOOL = { wood: "#6f4830", metal: "#3a3a3e", metalDark: "#2a2a2e", carpet: "#9c3f36" };
const PLANT = { wood: "#8d5c3c", woodDark: "#6f4830", plant: "#6d8a52", metal: "#8a8478" };

/* ------------------------------------------------------------------ */
/* The room                                                            */
/* ------------------------------------------------------------------ */

const MODELS = ["chair", "pottedPlant", "plantSmall2", "stoolBar", "kitchenCoffeeMachine", "coatRackStanding"];

export const Restaurant3D: React.FC<{ state: SetState }> = ({ state }) => {
  const m = useModels(MODELS);
  const street = useStreet();
  if (!m) return null;
  const ch = state.chairs;
  const door = state.values.door ?? 0;
  const kitchen = state.values.kitchen ?? 0.15;
  return (
    <group>
      {/* the floor: dark boards */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshToonMaterial color={r.floor} />
      </mesh>
      {Array.from({ length: 34 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, WALL_Z + i * 0.16]}>
          <planeGeometry args={[12, 0.008]} />
          <meshBasicMaterial color={r.floorLine} />
        </mesh>
      ))}

      {/* the ceiling, dark wood */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.9, 0.5]}>
        <planeGeometry args={[12, 7]} />
        <meshToonMaterial color="#6f5642" side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={"beam" + i} at={[-4.5 + i * 1.8, 2.84, 0.5]} size={[0.14, 0.12, 7]} color="#5a4232" shadow={false} />
      ))}
      {/* the back wall, panelled to the rail, with the door, window and kitchen door in it */}
      <Wall
        x0={-5.2} x1={5.2} z={WALL_Z} height={2.9} color={r.wall}
        openings={[DOOR, WINDOW, KITCHEN]}
        bands={[
          { y0: 0, y1: 0.95, color: r.panel, proud: 0.015 },
          { y0: 0.93, y1: 0.97, color: r.rail, proud: 0.03 },
          { y0: 0, y1: 0.09, color: r.panelDark, proud: 0.02 }
        ]}
      />
      <Window tex={street} />

      {/* the street door: glass, standing open as they come in */}
      <DoorFrame x={DOOR.x} w={DOOR.w} h={DOOR.h} z={WALL_Z} color={r.frame} />
      <DoorLeaf x={DOOR.x} w={DOOR.w} h={DOOR.h} z={WALL_Z} open={door} hinge="left" color={r.frame} glass />
      <Behind x={DOOR.x} w={2.2} z={WALL_Z - 0.1} depth={1.6} wall="#1c2438" floor="#2c3140" />
      <Street x={DOOR.x} w={3.0} tex={street} />

      {/* the kitchen door, and the bright kitchen through it */}
      <DoorFrame x={KITCHEN.x} w={KITCHEN.w} h={KITCHEN.h} z={WALL_Z} color={r.frame} />
      <DoorLeaf x={KITCHEN.x} w={KITCHEN.w} h={KITCHEN.h} z={WALL_Z} open={kitchen} hinge="right" color={r.barDark} />
      <Behind x={KITCHEN.x + 0.5} w={2.4} z={WALL_Z - 0.1} depth={1.6} wall="#dfe6ea" floor="#c9d0d4">
        {/* the pass, where the plates wait */}
        <Box at={[KITCHEN.x + 0.8, 0.45, WALL_Z - 0.95]} size={[1.8, 0.9, 0.4]} color="#b9c1c6" />
        <Box at={[KITCHEN.x + 0.8, 0.92, WALL_Z - 0.95]} size={[1.8, 0.04, 0.44]} color="#e4e8ea" />
        <Box at={[KITCHEN.x + 0.9, 1.7, WALL_Z - 1.5]} size={[1.0, 0.5, 0.2]} color="#c9d0d4" />
      </Behind>

      <Board />
      {/* pictures and a mirror, so the wall is a restaurant's wall */}
      <Box at={[-1.95, 1.75, WALL_Z + 0.02]} size={[0.5, 0.64, 0.03]} color={r.frame} />
      <Box at={[-1.95, 1.75, WALL_Z + 0.036]} size={[0.42, 0.56, 0.004]} color="#c98f5a" shadow={false} />
      <Box at={[-4.5, 1.7, WALL_Z + 0.02]} size={[0.6, 0.46, 0.03]} color={r.frame} />
      <Box at={[-4.5, 1.7, WALL_Z + 0.036]} size={[0.52, 0.38, 0.004]} color="#6d8aa3" shadow={false} />
      {/* wall lights between the openings */}
      {[-2.9, 1.6, 4.9].map((x) => (
        <group key={x} position={[x, 2.05, WALL_Z + 0.05]}>
          <mesh>
            <sphereGeometry args={[0.07, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color="#ffe6b8" toneMapped={false} />
          </mesh>
        </group>
      ))}

      <Stand />
      <Model model={m.coatRackStanding} at={[-4.55, -1.9]} yaw={-Math.PI / 2} paint={CHAIR} />
      <Model model={m.pottedPlant} at={[-2.78, -2.07]} yaw={-Math.PI / 2} paint={PLANT} scale={1.6} />
      <Bar m={m} />

      {/* the window table and its chairs */}
      <Table x={TABLE.x} z={TABLE.z}>
        <Centre x={-0.02} z={-0.28} />
      </Table>
      {/* the water carafe */}
      <group position={[0.0, TT, TABLE.z - 0.28]}>
        <mesh position={[-0.1, 0.1, 0.02]}>
          <cylinderGeometry args={[0.045, 0.055, 0.2, 20, 1, true]} />
          <meshToonMaterial color={r.water} transparent opacity={0.5} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.1, 0.07, 0.02]}>
          <cylinderGeometry args={[0.043, 0.052, 0.14, 20]} />
          <meshToonMaterial color="#a9c8d8" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>
      <Pendant x={TABLE.x} z={TABLE.z} />
      <Model model={m.chair} at={[ch.shruti.at[0] - 0.03, ch.shruti.at[1]]} yaw={ch.shruti.yaw} paint={CHAIR} scale={2.2} />
      <Model model={m.chair} at={[ch.sijan.at[0] + 0.03, ch.sijan.at[1]]} yaw={ch.sijan.yaw} paint={CHAIR} scale={2.2} />

      {/* the reserved tables, laid for the people who booked */}
      {([[-2.7, 0.55], [2.75, 0.5]] as [number, number][]).map(([x, z]) => (
        <group key={x}>
          <Table x={x} z={z}>
            <Centre x={0.1} z={-0.22} />
            <Reserved at={[-0.12, TT, -0.2]} yaw={0.3} />
          </Table>
          <Setting at={[x - 0.19, z]} yaw={0} />
          <Setting at={[x + 0.19, z]} yaw={Math.PI} />
          <Model model={m.chair} at={[x - 0.78, z]} yaw={0} paint={CHAIR} scale={2.2} />
          <Model model={m.chair} at={[x + 0.78, z]} yaw={Math.PI} paint={CHAIR} scale={2.2} />
          <Pendant x={x} z={z} />
        </group>
      ))}
      <Model model={m.plantSmall2} at={[4.3, 0.9]} y={0} yaw={-Math.PI / 2} paint={PLANT} scale={2.4} />
    </group>
  );
};
