/*
 * The Bäckerei, in 3D.
 *
 * Same shop as the drawn set (components/sets/Baeckerei.tsx) and the same
 * warm palette. The counter stands side-on to the master camera like the
 * Bürgerbüro's desk, so the customer and the baker face each other across it
 * in profile. Its far half is the glass case; its near half is bare worktop,
 * where things are packed, paid for and handed over.
 *
 *              back wall  z = -1.5
 *   [door]  [BÄCKEREI]  [price board]  [slicer] [bread shelves]
 *
 *                 +------ glass case ------+   z = -1.05 .. -0.05
 *   Sijan         |  rolls      cheesecake |          Shruti
 *   x = -0.58     +------ worktop ---------+   x = +0.52
 *                    money dish      till      z = -0.05 .. 0.85
 *
 *                     camera, side-on, at +z
 *
 * The case's contents sit side by side across it (rolls on the customer's
 * side, the cake stand on the baker's), because the side-on camera looks
 * along its length: one behind the other, the front thing would hide the
 * rest. The prices on the board add up to what the till says: two rolls at
 * 0,40, the Vollkornbrot at 3,40 and two slices at 2,00 make 8,20.
 */

import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { theme } from "../../theme";
import { Model, toon, useModels } from "../models";
import { useCanvasTexture } from "./buergerbuero";
import type { SetLayout, SetState } from "./index";

const c = theme.set.baeckerei;
const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export const TOP = 0.92;
const CASE = { x0: -0.3, x1: 0.25, z0: -1.05, z1: -0.05, h: 0.34 };
const TRAY_Y = TOP + 0.012;
const PLATE_Y = TOP + 0.075;
const BACK_TOP = 0.9;
const SHELF_Y = [1.2, 1.52, 1.84];

export const baeckereiLayout: SetLayout = {
  chairs: {},

  spots: {
    /* over the worktop between them, where things change hands */
    exchange: { p: [-0.05, 1.02, 0.34] },
    /* the rolls he buys, at the front of the tray on her side */
    roll1: { p: [0.0, TRAY_Y, -0.2], yaw: 0.3 },
    roll2: { p: [0.0, TRAY_Y, -0.31], yaw: -0.2 },
    /* the two last slices on the cake stand */
    slice1: { p: [0.07, PLATE_Y, -0.33], yaw: Math.PI - 0.5 },
    slice2: { p: [0.14, PLATE_Y, -0.43], yaw: Math.PI + 0.7 },
    /* the bag, open, where she packs it; and slid over to him at the end */
    bagPack: { p: [0.15, TOP, 0.36], yaw: Math.PI / 2 },
    bagOut: { p: [-0.14, TOP, 0.5], yaw: Math.PI / 2 },
    /* the cake box, waiting on the worktop by the case; and his at the end */
    boxStart: { p: [0.15, TOP, 0.08], yaw: Math.PI / 2 },
    boxOut: { p: [-0.18, TOP, 0.1], yaw: Math.PI / 2 },
    /* the loaf on its shelf, in the slicer, and out of it */
    loafShelf: { p: [1.38, SHELF_Y[0], -1.33], yaw: 0 },
    slicerIn: { p: [0.86, BACK_TOP + 0.11, -1.25], yaw: 0 },
    /* the little dish in the middle of the worktop that money is put down on */
    dish: { p: [-0.03, TOP + 0.012, 0.2], yaw: 0.4 },
    /* her fingers on the till's keys, and the open drawer the coins go into */
    tillKeys: { p: [0.27, TOP + 0.13, 0.66] },
    tillDrawer: { p: [0.38, TOP + 0.05, 0.7], hidden: true },
    /* the sticker on the till: EC-Karte ab 10 € */
    sticker: { p: [0.18, TOP + 0.06, 0.88] },
    /* the slicer's switch */
    slicerSwitch: { p: [0.67, BACK_TOP + 0.25, -1.33] }
  },

  anchors: {
    rolls: [-0.08, TOP + 0.05, -0.3],
    cake: [0.11, PLATE_Y + 0.03, -0.38],
    till: [0.14, TOP + 0.22, 0.7],
    dish: [-0.03, TOP + 0.02, 0.2],
    board: [0.0, 2.0, -1.47],
    slicer: [0.86, BACK_TOP + 0.12, -1.3],
    shelf: [1.7, 1.5, -1.35]
  }
};

/* ------------------------------------------------------------------ */
/* Canvas-painted things                                               */
/* ------------------------------------------------------------------ */

/** The shop's name over the door. */
const ShopSign: React.FC = () => {
  const tex = useCanvasTexture(768, 180, (g) => {
    g.fillStyle = c.sign;
    g.fillRect(0, 0, 768, 180);
    g.strokeStyle = "#c9a36a";
    g.lineWidth = 6;
    g.strokeRect(12, 12, 744, 156);
    g.fillStyle = c.signInk;
    g.font = `700 92px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("BÄCKEREI", 384, 92);
  }, "sign");
  return (
    <mesh position={[-1.85, 2.38, -1.485]}>
      <planeGeometry args={[1.28, 0.3]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/**
 * The price board: chalk on black, the four things in this dialogue among a
 * few others. The sums are right, so a learner who checks the till can.
 */
const PriceBoard: React.FC = () => {
  const tex = useCanvasTexture(900, 560, (g) => {
    g.fillStyle = "#2b2f2c";
    g.fillRect(0, 0, 900, 560);
    g.strokeStyle = "#8d5f38";
    g.lineWidth = 22;
    g.strokeRect(0, 0, 900, 560);
    g.fillStyle = "#f3efe4";
    g.font = `600 54px ${FONT}`;
    g.textBaseline = "middle";
    g.fillText("Heute frisch", 60, 78);
    const rows: [string, string][] = [
      ["Brötchen", "0,40 €"],
      ["Vollkornbrot", "3,40 €"],
      ["Käsekuchen, Stück", "2,00 €"],
      ["Brezel", "0,90 €"],
      ["Croissant", "1,20 €"]
    ];
    rows.forEach(([k, v], i) => {
      const y = 170 + i * 76;
      g.font = `500 44px ${FONT}`;
      g.fillStyle = "#f3efe4";
      g.fillText(k, 60, y);
      g.font = `600 44px ${MONO}`;
      g.fillStyle = "#f2d38a";
      g.textAlign = "right";
      g.fillText(v, 840, y);
      g.textAlign = "left";
    });
  }, "board");
  const [x, y, z] = baeckereiLayout.anchors.board;
  return (
    <mesh position={[x, y, z]}>
      <planeGeometry args={[1.0, 0.62]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/**
 * The till. Its customer display faces him, turned towards the lens so the
 * master can read the total; the sticker on its side says what line 10 says.
 * The cash drawer slides out towards her as `drawer` goes to 1.
 */
const Till: React.FC<{ text: string; drawer: number }> = ({ text, drawer }) => {
  const screen = useCanvasTexture(320, 150, (g) => {
    g.fillStyle = "#1c2a24";
    g.fillRect(0, 0, 320, 150);
    g.fillStyle = "#8ef0b0";
    g.font = `600 64px ${MONO}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 160, 78);
  }, text);
  const sticker = useCanvasTexture(300, 150, (g) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, 300, 150);
    g.fillStyle = "#2f5d8a";
    g.fillRect(0, 0, 300, 34);
    g.fillStyle = "#ffffff";
    g.font = `700 24px ${FONT}`;
    g.textAlign = "center";
    g.fillText("EC · KARTE", 150, 25);
    g.fillStyle = "#1f2a3c";
    g.font = `700 38px ${FONT}`;
    g.fillText("ab 10 €", 150, 86);
    g.font = `500 22px ${FONT}`;
    g.fillText("darunter nur bar", 150, 124);
  }, "sticker");
  return (
    /* at her edge of the worktop, so from the master it stands clear of the case */
    <group position={[0.2, TOP, 0.7]}>
      {/* the body, and the drawer under it */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.09, 0.3]} />
        <meshToonMaterial color={c.kasse} />
      </mesh>
      <mesh position={[0.02 + drawer * 0.16, 0.022, 0]} castShadow>
        <boxGeometry args={[0.28, 0.04, 0.26]} />
        <meshToonMaterial color={c.kasseDark} />
      </mesh>
      {/* coins in the open drawer */}
      {drawer > 0.2 ? (
        <mesh position={[0.1 + drawer * 0.16, 0.043, 0]}>
          <boxGeometry args={[0.12, 0.004, 0.2]} />
          <meshToonMaterial color="#c9b37a" />
        </mesh>
      ) : null}
      {/* her keypad, sloping towards her */}
      <mesh position={[0.07, 0.1, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.14, 0.03, 0.24]} />
        <meshToonMaterial color={c.kasseDark} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[0.05 + (i % 3) * 0.025, 0.12 + (i % 3) * 0.009, -0.08 + Math.floor(i / 3) * 0.045]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.018, 0.008, 0.03]} />
          <meshToonMaterial color="#e8e4da" />
        </mesh>
      ))}
      {/* the customer display on its post, facing him and a little the lens */}
      <mesh position={[-0.06, 0.14, 0]} castShadow>
        <boxGeometry args={[0.025, 0.1, 0.025]} />
        <meshToonMaterial color={c.kasseDark} />
      </mesh>
      {/* the plane's front is +z; turned to face -x (him) and 0.55 towards +z (the lens) */}
      <group position={[-0.07, 0.22, 0.0]} rotation={[0, -Math.PI / 2 + 0.55, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.075, 0.025]} />
          <meshToonMaterial color="#2b3238" />
        </mesh>
        <mesh position={[0, 0, 0.013]}>
          <planeGeometry args={[0.136, 0.064]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
      {/* the card sticker, on the side facing the lens */}
      <mesh position={[-0.02, 0.05, 0.1505]}>
        <planeGeometry args={[0.13, 0.065]} />
        <meshBasicMaterial map={sticker} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** The card reader beside the till, which line 10 will not let him use. */
const CardReader: React.FC = () => (
  <group position={[-0.12, TOP, 0.76]} rotation={[0, 0.3, 0]}>
    <mesh position={[0, 0.012, 0]} castShadow>
      <boxGeometry args={[0.1, 0.024, 0.08]} />
      <meshToonMaterial color="#2b3238" />
    </mesh>
    <mesh position={[-0.01, 0.06, 0]} rotation={[0, 0, 0.5]} castShadow>
      <boxGeometry args={[0.07, 0.12, 0.075]} />
      <meshToonMaterial color="#3a4148" />
    </mesh>
    <mesh position={[-0.043, 0.085, 0]} rotation={[0, 0, 0.5]}>
      <boxGeometry args={[0.002, 0.04, 0.05]} />
      <meshBasicMaterial color="#8fd0e8" />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/* Bread and cake, for dressing                                        */
/* ------------------------------------------------------------------ */

const SPHERE = new THREE.SphereGeometry(1, 20, 14);
const TORUS = new THREE.TorusGeometry(1, 0.34, 10, 24);

const RollDeco: React.FC<{ at: [number, number, number]; yaw?: number; tone?: string }> = ({ at, yaw = 0, tone = c.broetchen }) => (
  <group position={at} rotation={[0, yaw, 0]}>
    <mesh geometry={SPHERE} material={toon(tone)} position={[0, 0.022, 0]} scale={[0.047, 0.03, 0.033]} castShadow />
    <mesh geometry={SPHERE} material={toon(c.brotDark)} position={[0, 0.05, 0]} scale={[0.032, 0.004, 0.004]} />
  </group>
);

const LoafDeco: React.FC<{ at: [number, number, number]; dark?: boolean; long?: boolean }> = ({ at, dark, long }) => (
  <group position={at}>
    <mesh geometry={SPHERE} material={toon(dark ? "#6f4a2c" : c.brot)} position={[0, 0.05, 0]} scale={[long ? 0.17 : 0.12, 0.055, 0.065]} castShadow />
    {[-1, 0, 1].map((i) => (
      <mesh key={i} geometry={SPHERE} material={toon(c.brotDark)} position={[i * 0.045, 0.1, 0]} rotation={[0, 0.5, 0]} scale={[0.006, 0.004, 0.035]} />
    ))}
  </group>
);

/** A Brezel: three loops of a torus, glossy brown. */
const Pretzel: React.FC<{ at: [number, number, number]; yaw?: number }> = ({ at, yaw = 0 }) => (
  <group position={at} rotation={[0, yaw, 0]}>
    {[[-0.022, 0], [0.022, 0], [0, 0.02]].map(([x, z], i) => (
      <mesh key={i} geometry={TORUS} material={toon("#8a4f24")} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.025, 0.025, 0.025]} castShadow />
    ))}
  </group>
);

const Croissant: React.FC<{ at: [number, number, number]; yaw?: number }> = ({ at, yaw = 0 }) => (
  <group position={at} rotation={[0, yaw, 0]}>
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.045, 0.02, 10, 18, Math.PI * 1.2]} />
      <meshToonMaterial color="#d99a4e" />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/* The counter and its glass case                                      */
/* ------------------------------------------------------------------ */

const GLASS = new THREE.MeshToonMaterial({ color: c.glass, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });

const Counter: React.FC = () => {
  const z0 = -1.05;
  const z1 = 0.85;
  const len = z1 - z0;
  const zc = (z0 + z1) / 2;
  const { x0, x1, h } = CASE;
  const slope = 0.12;
  const frame = toon(c.chrome);
  return (
    <group>
      {/* the body and the worktop */}
      <mesh position={[0, (TOP - 0.03) / 2, zc]} castShadow receiveShadow>
        <boxGeometry args={[0.6, TOP - 0.03, len]} />
        <meshToonMaterial color={c.counter} />
      </mesh>
      <mesh position={[0, TOP - 0.015, zc]} castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.03, len + 0.04]} />
        <meshToonMaterial color={c.counterTop} />
      </mesh>
      {/* panels on his side, so the front is not one flat slab */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-0.301, 0.45, z0 + 0.24 + i * 0.475]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.62]} />
          <meshToonMaterial color={c.shelf} />
        </mesh>
      ))}
      {/* the case's floor: a pale lining the goods sit on */}
      <mesh position={[(x0 + x1) / 2, TOP + 0.002, (CASE.z0 + CASE.z1) / 2]} receiveShadow>
        <boxGeometry args={[x1 - x0, 0.004, CASE.z1 - CASE.z0]} />
        <meshToonMaterial color="#efe6d6" />
      </mesh>
      {/* glass: the sloped front on his side, the top, the two ends; her side is open */}
      {(() => {
        const fx = x0 + slope / 2;
        const fl = Math.hypot(slope, h);
        const ang = Math.atan2(slope, h);
        return (
          <mesh position={[fx, TOP + h / 2, (CASE.z0 + CASE.z1) / 2]} rotation={[0, 0, -ang]} material={GLASS}>
            <boxGeometry args={[0.006, fl, CASE.z1 - CASE.z0]} />
          </mesh>
        );
      })()}
      <mesh position={[(x0 + slope + x1) / 2, TOP + h, (CASE.z0 + CASE.z1) / 2]} material={GLASS}>
        <boxGeometry args={[x1 - x0 - slope, 0.006, CASE.z1 - CASE.z0]} />
      </mesh>
      {[CASE.z0, CASE.z1].map((z) => (
        <mesh key={z} position={[(x0 + x1) / 2, TOP + h / 2, z]} material={GLASS}>
          <boxGeometry args={[x1 - x0, h, 0.006]} />
        </mesh>
      ))}
      {/* the chrome edges that make the glass read as glass */}
      {[CASE.z0, CASE.z1].map((z) => (
        <group key={"f" + z}>
          <mesh position={[(x0 + slope + x1) / 2, TOP + h, z]} material={frame}>
            <boxGeometry args={[x1 - x0 - slope, 0.012, 0.012]} />
          </mesh>
          <mesh position={[x0 + slope / 2, TOP + h / 2, z]} rotation={[0, 0, -Math.atan2(slope, h)]} material={frame}>
            <boxGeometry args={[0.012, Math.hypot(slope, h), 0.012]} />
          </mesh>
          <mesh position={[x1, TOP + h / 2, z]} material={frame}>
            <boxGeometry args={[0.012, h, 0.012]} />
          </mesh>
        </group>
      ))}
      <mesh position={[x0 + slope, TOP + h, (CASE.z0 + CASE.z1) / 2]} material={frame}>
        <boxGeometry args={[0.012, 0.012, CASE.z1 - CASE.z0]} />
      </mesh>
      <mesh position={[x1, TOP + h, (CASE.z0 + CASE.z1) / 2]} material={frame}>
        <boxGeometry args={[0.012, 0.012, CASE.z1 - CASE.z0]} />
      </mesh>

      {/* ---- in the case: the tray of rolls, on his side */}
      <mesh position={[-0.08, TOP + 0.007, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.01, 0.34]} />
        <meshToonMaterial color={c.shelf} />
      </mesh>
      {[[-0.16, -0.18], [-0.16, -0.29], [-0.16, -0.4], [-0.08, -0.14], [-0.08, -0.25], [-0.08, -0.36], [-0.08, -0.45], [0.0, -0.42]].map(([x, z], i) => (
        <RollDeco key={i} at={[x, TRAY_Y, z]} yaw={i * 0.7} />
      ))}
      {/* ---- the cake stand, on her side, with the two slices the dialogue says are left */}
      <group position={[0.11, TOP, -0.38]}>
        <mesh position={[0, 0.004, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.008, 28]} />
          <meshToonMaterial color={c.chrome} />
        </mesh>
        <mesh position={[0, 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
          <meshToonMaterial color={c.chrome} />
        </mesh>
        <mesh position={[0, PLATE_Y - TOP - 0.005, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.11, 0.01, 36]} />
          <meshToonMaterial color="#f4f1ea" />
        </mesh>
      </group>
      {/* ---- further back: croissants and Brezeln */}
      <mesh position={[-0.08, TOP + 0.006, -0.78]} receiveShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.008, 30]} />
        <meshToonMaterial color="#f4f1ea" />
      </mesh>
      <Croissant at={[-0.12, TOP + 0.01, -0.74]} yaw={0.4} />
      <Croissant at={[-0.04, TOP + 0.01, -0.83]} yaw={2.1} />
      <Croissant at={[-0.06, TOP + 0.01, -0.7]} yaw={-1.2} />
      <mesh position={[0.12, TOP + 0.006, -0.8]} receiveShadow>
        <boxGeometry args={[0.2, 0.01, 0.34]} />
        <meshToonMaterial color={c.shelf} />
      </mesh>
      <Pretzel at={[0.12, TOP + 0.012, -0.7]} yaw={0.3} />
      <Pretzel at={[0.12, TOP + 0.012, -0.84]} yaw={-0.4} />
      <Pretzel at={[0.12, TOP + 0.012, -0.95]} yaw={1.1} />

      {/* ---- on the worktop: the money dish */}
      <group position={[-0.03, TOP, 0.2]}>
        <mesh position={[0, 0.006, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.012, 32]} />
          <meshToonMaterial color="#b9c2c6" />
        </mesh>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Behind her: the back counter, the slicer, the bread shelves         */
/* ------------------------------------------------------------------ */

/**
 * A bread slicer: a white housing, the round blade guard, the carriage the
 * loaf lies on. While `run` is up the blade's spokes turn.
 */
const Slicer: React.FC<{ run: number }> = ({ run }) => {
  const frame = useCurrentFrame();
  const spin = run > 0.01 ? frame * 0.9 : 0;
  const s = baeckereiLayout.spots.slicerIn.p;
  return (
    <group position={[s[0], BACK_TOP, s[2]]}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.1, 0.34]} />
        <meshToonMaterial color="#e9ebe8" />
      </mesh>
      {/* the carriage the loaf sits in */}
      <mesh position={[0, 0.105, 0.02]} receiveShadow>
        <boxGeometry args={[0.36, 0.01, 0.2]} />
        <meshToonMaterial color="#c6ccce" />
      </mesh>
      {/* the tall housing at the back with the blade */}
      <mesh position={[0, 0.2, -0.13]} castShadow>
        <boxGeometry args={[0.46, 0.3, 0.08]} />
        <meshToonMaterial color="#e9ebe8" />
      </mesh>
      <group position={[0.17, 0.2, -0.085]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.012, 32]} />
          <meshToonMaterial color="#b7bec1" />
        </mesh>
        <group rotation={[0, 0, spin]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0, 0.008]} rotation={[0, 0, (i * Math.PI) / 3]}>
              <boxGeometry args={[0.17, 0.012, 0.004]} />
              <meshToonMaterial color="#7d868a" />
            </mesh>
          ))}
        </group>
      </group>
      {/* the red switch, lit while it runs */}
      <mesh position={[-0.19, 0.25, -0.088]}>
        <boxGeometry args={[0.03, 0.03, 0.01]} />
        <meshBasicMaterial color={run > 0.01 ? "#ff5a3c" : "#9a3a2c"} />
      </mesh>
    </group>
  );
};

const BackCounter: React.FC = () => (
  <group>
    <mesh position={[1.43, BACK_TOP / 2, -1.3]} castShadow receiveShadow>
      <boxGeometry args={[1.8, BACK_TOP, 0.4]} />
      <meshToonMaterial color={c.counter} />
    </mesh>
    <mesh position={[1.43, BACK_TOP - 0.01, -1.3]} receiveShadow>
      <boxGeometry args={[1.84, 0.02, 0.44]} />
      <meshToonMaterial color={c.counterTop} />
    </mesh>
    {/* bread shelves on the wall above, from the slicer's right to the corner */}
    {SHELF_Y.map((y, r) => (
      <group key={y}>
        <mesh position={[1.72, y - 0.012, -1.36]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.024, 0.28]} />
          <meshToonMaterial color={c.shelf} />
        </mesh>
        {[0, 1, 2, 3].map((i) =>
          /* leave the front-left place on the lowest shelf for his loaf */
          r === 0 && i === 0 ? null : (
            <LoafDeco key={i} at={[1.36 + i * 0.24, y, -1.36]} dark={(i + r) % 2 === 0} long={r === 2} />
          )
        )}
      </group>
    ))}
    {/* the shelves' back board and uprights */}
    <mesh position={[1.72, 1.52, -1.49]} receiveShadow>
      <boxGeometry args={[1.14, 0.9, 0.02]} />
      <meshToonMaterial color={c.shelfDark} />
    </mesh>
    {[1.16, 2.28].map((x) => (
      <mesh key={x} position={[x, 1.52, -1.36]} castShadow>
        <boxGeometry args={[0.03, 0.9, 0.28]} />
        <meshToonMaterial color={c.shelf} />
      </mesh>
    ))}
  </group>
);

/* ------------------------------------------------------------------ */
/* The room                                                            */
/* ------------------------------------------------------------------ */

const DOOR = { wood: "#b98a54", metal: c.chrome, woodDark: "#95663a" };
const PLANT = { wood: "#c9b89a", woodDark: "#b3a283", plant: "#7f9a64" };
const BIN = { metal: "#9aa3a8", metalDark: "#6f787d" };
const MODELS = ["doorway", "pottedPlant", "trashcan"];

export const Baeckerei3D: React.FC<{ state: SetState }> = ({ state }) => {
  const m = useModels(MODELS);
  if (!m) return null;
  const v = state.values;
  return (
    <group>
      {/* floor, with tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshToonMaterial color={c.floor} />
      </mesh>
      {Array.from({ length: 30 }, (_, i) => (
        <mesh key={"tx" + i} rotation={[-Math.PI / 2, 0, 0]} position={[-6 + i * 0.45, 0.001, 2]}>
          <planeGeometry args={[0.012, 8]} />
          <meshBasicMaterial color={c.floorLine} />
        </mesh>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={"tz" + i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -1.5 + i * 0.45]}>
          <planeGeometry args={[30, 0.012]} />
          <meshBasicMaterial color={c.floorLine} />
        </mesh>
      ))}
      {/* the back wall: plaster above, tiles below */}
      <mesh position={[0, 1.6, -1.52]} receiveShadow>
        <planeGeometry args={[30, 3.2]} />
        <meshToonMaterial color={c.wall} />
      </mesh>
      <mesh position={[0, 0.6, -1.51]} receiveShadow>
        <planeGeometry args={[30, 1.2]} />
        <meshToonMaterial color={c.wallDark} />
      </mesh>
      <mesh position={[0, 1.2, -1.505]}>
        <boxGeometry args={[30, 0.025, 0.02]} />
        <meshToonMaterial color={c.shelf} />
      </mesh>
      {/* a band of darker wall at the top, like the drawn set */}
      <mesh position={[0, 2.85, -1.505]}>
        <planeGeometry args={[30, 0.5]} />
        <meshToonMaterial color="#e2d4c0" />
      </mesh>

      {/* the shop door and its window, where he comes in from */}
      <Model model={m.doorway} at={[-2.55, -1.47]} yaw={-Math.PI / 2} paint={DOOR} />
      <group position={[-3.6, 1.45, -1.5]}>
        <mesh>
          <boxGeometry args={[1.1, 1.2, 0.04]} />
          <meshToonMaterial color={c.shelf} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.0, 1.1]} />
          <meshBasicMaterial color="#d6e6ec" />
        </mesh>
      </group>
      <ShopSign />
      <PriceBoard />
      <Model model={m.pottedPlant} at={[-1.2, -1.25]} yaw={-Math.PI / 2} paint={PLANT} scale={1.6} />
      <Model model={m.trashcan} at={[-0.9, -1.3]} yaw={-Math.PI / 2} paint={BIN} scale={1.0} />

      <Counter />
      <Till text={state.display} drawer={v.drawer ?? 0} />
      <CardReader />
      <BackCounter />
      <Slicer run={v.slicer ?? 0} />
    </group>
  );
};
