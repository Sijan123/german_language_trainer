/*
 * The bakery's props: what c018 buys and pays with.
 *
 * Same convention as Props.tsx: each is drawn in its own frame, x along its
 * long side, y out of its face (up, when it is lying down), z across, centred
 * on the middle of its PROP_SIZE box. The paper bag stands upright, so its y
 * is its height and its top is open.
 *
 * `open` is each prop's one degree of freedom: how far a lid or a wallet is
 * open, and for the loaf, how far it has been through the slicer.
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { PROP_SIZE } from "./world";
import { toon } from "./models";

const FONT = "'IBM Plex Sans', system-ui, sans-serif";

const CRUST = "#d8a45e";
const CRUST_DARK = "#a06f38";
const RYE = "#6f4a2c";
const RYE_CRUMB = "#b39067";
const KRAFT = "#d8b888";
const KRAFT_DARK = "#b99462";
const BROWN = "#6b4630";

/* ------------------------------------------------------------------ */
/* Shared geometry                                                     */
/* ------------------------------------------------------------------ */

const SPHERE = new THREE.SphereGeometry(1, 24, 16);
const BOX = new THREE.BoxGeometry(1, 1, 1);
/** a unit cylinder lying along x, for loaf slices and coins seen end-on */
const CYL_X = (() => {
  const g = new THREE.CylinderGeometry(1, 1, 1, 28, 1);
  g.rotateZ(Math.PI / 2);
  return g;
})();
const CYL_Y = new THREE.CylinderGeometry(1, 1, 1, 28, 1);

/* ------------------------------------------------------------------ */
/* A roll                                                              */
/* ------------------------------------------------------------------ */

/** A Brötchen: a domed oval with a slash along the top, flat underneath. */
export const Roll: React.FC = () => {
  const [L, T, S] = PROP_SIZE.roll;
  return (
    <group>
      <mesh geometry={SPHERE} material={toon(CRUST)} position={[0, -T * 0.08, 0]} scale={[L / 2, T * 0.62, S / 2]} castShadow />
      {/* the slash, a darker groove along the crown */}
      <mesh geometry={SPHERE} material={toon(CRUST_DARK)} position={[0, T * 0.5, 0]} scale={[L * 0.34, T * 0.07, S * 0.06]} />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The loaf                                                            */
/* ------------------------------------------------------------------ */

const SLICES = 13;

/**
 * A Vollkornbrot, as a row of slices that fit together as one loaf until it
 * has been through the slicer; then the gaps open a little and the crumb
 * shows between them. The ends are rounded by making the end slices smaller.
 */
export const Loaf: React.FC<{ sliced: number }> = ({ sliced }) => {
  const [L, T, S] = PROP_SIZE.loaf;
  const gap = 0.0045 * Math.max(0, Math.min(1, sliced));
  const w = L / SLICES;
  const mats = useMemo(() => [toon(RYE), toon(RYE_CRUMB), toon(RYE_CRUMB)], []);
  const crust = useMemo(() => [toon(RYE), toon(RYE), toon(RYE)], []);
  return (
    <group>
      {Array.from({ length: SLICES }, (_, i) => {
        const u = (i + 0.5) / SLICES * 2 - 1;
        const s = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 4)), 0.35);
        const x = (i - (SLICES - 1) / 2) * (w + gap);
        /* the ends keep their crust showing; the cut faces show crumb */
        const end = i === 0 || i === SLICES - 1;
        return (
          <mesh
            key={i}
            geometry={CYL_X}
            material={sliced > 0.02 && !end ? mats : crust}
            position={[x, -T / 2 + (T / 2) * s, 0]}
            scale={[w * 0.999, (T / 2) * s, (S / 2) * s]}
            castShadow
          />
        );
      })}
      {/* seeds scattered on the top crust */}
      {[-0.08, -0.05, -0.02, 0.01, 0.04, 0.07, -0.065, 0.025, 0.055].map((x, i) => (
        <mesh
          key={"s" + i}
          geometry={SPHERE}
          material={toon("#e6d3a8")}
          position={[x * (1 + gap * 20), T / 2 - 0.004, ((i * 37) % 7 - 3) * 0.009]}
          scale={[0.006, 0.0025, 0.004]}
          rotation={[0, i, 0]}
        />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The paper bag                                                       */
/* ------------------------------------------------------------------ */

let bagTex: THREE.CanvasTexture | null = null;
function bagTexture() {
  if (bagTex) return bagTex;
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 440;
  const g = cv.getContext("2d")!;
  g.fillStyle = KRAFT;
  g.fillRect(0, 0, 512, 440);
  /* the folded rim */
  g.fillStyle = KRAFT_DARK;
  g.fillRect(0, 0, 512, 34);
  /* the baker's mark: a wheat ear in a circle, and the name */
  g.strokeStyle = BROWN;
  g.fillStyle = BROWN;
  g.lineWidth = 7;
  g.beginPath();
  g.arc(256, 190, 78, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(256, 250);
  g.lineTo(256, 130);
  g.stroke();
  for (let k = 0; k < 4; k++) {
    for (const sgn of [-1, 1]) {
      g.beginPath();
      g.ellipse(256 + sgn * 14, 150 + k * 22, 9, 16, sgn * 0.6, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.font = `700 54px ${FONT}`;
  g.textAlign = "center";
  g.fillText("BÄCKEREI", 256, 330);
  g.font = `500 30px ${FONT}`;
  g.fillText("seit 1962", 256, 372);
  bagTex = new THREE.CanvasTexture(cv);
  bagTex.colorSpace = THREE.SRGBColorSpace;
  bagTex.anisotropy = 4;
  return bagTex;
}

/** A paper bag, open at the top: four walls and a floor. */
export const Bag: React.FC = () => {
  const [L, H, S] = PROP_SIZE.bag;
  const side = toon(KRAFT, { side: THREE.DoubleSide });
  const print = useMemo(
    () => new THREE.MeshToonMaterial({ map: bagTexture(), side: THREE.DoubleSide }),
    []
  );
  return (
    <group>
      {/* the two broad faces carry the print */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0, (s * S) / 2]} rotation={[0, s > 0 ? 0 : Math.PI, 0]} material={print} castShadow>
          <planeGeometry args={[L, H]} />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh key={"e" + s} position={[(s * L) / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={side} castShadow>
          <planeGeometry args={[S, H]} />
        </mesh>
      ))}
      <mesh position={[0, -H / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={side}>
        <planeGeometry args={[L, S]} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The cake box                                                        */
/* ------------------------------------------------------------------ */

/** A white cake box with a brown band; the lid is hinged along the back (-z). */
export const CakeBox: React.FC<{ open: number }> = ({ open }) => {
  const [L, H, S] = PROP_SIZE.box;
  const t = 0.003;
  const white = toon("#f3efe6", { side: THREE.DoubleSide });
  const band = toon("#8d5f38");
  const lidH = 0.012;
  return (
    <group>
      {/* the tray: floor and four low walls */}
      <mesh geometry={BOX} material={white} position={[0, -H / 2 + t / 2, 0]} scale={[L, t, S]} castShadow />
      {[1, -1].map((s) => (
        <mesh key={"z" + s} geometry={BOX} material={white} position={[0, 0, (s * (S - t)) / 2]} scale={[L, H, t]} castShadow />
      ))}
      {[1, -1].map((s) => (
        <mesh key={"x" + s} geometry={BOX} material={white} position={[(s * (L - t)) / 2, 0, 0]} scale={[t, H, S]} castShadow />
      ))}
      {/* the band round the front */}
      <mesh geometry={BOX} material={band} position={[0, -H * 0.1, S / 2 + 0.0005]} scale={[L * 1.001, H * 0.22, 0.001]} />
      {/* the lid, turning up and back on its hinge */}
      <group position={[0, H / 2, -S / 2]} rotation={[-open * 1.9, 0, 0]}>
        <group position={[0, lidH / 2, S / 2]}>
          <mesh geometry={BOX} material={white} scale={[L + 0.006, t, S + 0.006]} castShadow />
          {[1, -1].map((s) => (
            <mesh key={s} geometry={BOX} material={white} position={[(s * (L + 0.006)) / 2, -lidH / 2, 0]} scale={[t, lidH, S + 0.006]} />
          ))}
          <mesh geometry={BOX} material={white} position={[0, -lidH / 2, (S + 0.006) / 2]} scale={[L + 0.006, lidH, t]} />
          <mesh geometry={BOX} material={band} position={[0, t / 2 + 0.0005, 0]} scale={[L * 0.3, 0.001, S + 0.006]} />
        </group>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* A slice of cheesecake                                               */
/* ------------------------------------------------------------------ */

function wedge(len: number, width: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(-len / 2, -width / 2);
  s.lineTo(len / 2, 0);
  s.lineTo(-len / 2, width / 2);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false });
  /* extruded along +z; stand it up so the height is y */
  g.rotateX(-Math.PI / 2);
  return g;
}
const CAKE = (() => {
  const [L, H, S] = PROP_SIZE.slice;
  return {
    crust: wedge(L, S, H * 0.18),
    fill: wedge(L, S, H * 0.72),
    top: wedge(L, S, H * 0.1)
  };
})();

/** A wedge of Käsekuchen: a biscuit base, the cream filling, a baked top. */
export const Slice: React.FC = () => {
  const [, H] = PROP_SIZE.slice;
  return (
    <group position={[0, -H / 2, 0]}>
      <mesh geometry={CAKE.crust} material={toon("#b7803f")} castShadow />
      <mesh geometry={CAKE.fill} material={toon("#f0e2b4")} position={[0, H * 0.18, 0]} castShadow />
      <mesh geometry={CAKE.top} material={toon("#d99a55")} position={[0, H * 0.9, 0]} />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The wallet, the card and the coins                                  */
/* ------------------------------------------------------------------ */

/** A brown leather bifold that opens along its long side, like the passport. */
export const Wallet: React.FC<{ open: number }> = ({ open }) => {
  const [L, T, S] = PROP_SIZE.wallet;
  const leaf = T / 2;
  const leather = toon("#5a3a26");
  const inner = toon("#7a5238");
  return (
    <group>
      <mesh geometry={BOX} material={leather} position={[0, -leaf / 2, 0]} scale={[L, leaf, S]} castShadow />
      {/* the card slots, seen once it is open */}
      {open > 0.05
        ? [0, 1, 2].map((i) => (
            <mesh key={i} geometry={BOX} material={inner} position={[0, 0.0004, -S * 0.25 + i * 0.012]} scale={[L * 0.9, 0.0008, 0.004]} />
          ))
        : null}
      <group position={[0, 0, -S / 2]} rotation={[-open * Math.PI * 0.95, 0, 0]}>
        <mesh geometry={BOX} material={leather} position={[0, leaf / 2, S / 2]} scale={[L, leaf, S]} castShadow />
        <mesh geometry={BOX} material={inner} position={[0, leaf / 2 - leaf / 2 - 0.0003, S / 2]} scale={[L * 0.96, 0.0006, S * 0.94]} />
      </group>
    </group>
  );
};

/** A bank card: blue, with its chip. */
export const Card: React.FC = () => {
  const [L, T, S] = PROP_SIZE.card;
  return (
    <group>
      <mesh geometry={BOX} material={toon("#2f5d8a")} scale={[L, T, S]} castShadow />
      <mesh geometry={BOX} material={toon("#d9b85a")} position={[L * 0.22, T / 2 + 0.0002, -S * 0.1]} scale={[0.011, 0.0004, 0.009]} />
      <mesh geometry={BOX} material={toon("#e9eef2")} position={[-L * 0.12, T / 2 + 0.0002, S * 0.28]} scale={[L * 0.55, 0.0004, 0.004]} />
    </group>
  );
};

/* where the five coins lie in the little pile: x, z, stacked height */
const COINS: [number, number, number, number][] = [
  [-0.018, -0.008, 0, 0.0128],
  [0.004, -0.012, 0, 0.0128],
  [0.022, 0.006, 0, 0.0128],
  [-0.006, 0.012, 0, 0.0116],
  [-0.004, -0.004, 1, 0.011]
];

/** Exact change: four two-euro coins and a twenty-cent piece. */
export const Coins: React.FC = () => {
  const [, T] = PROP_SIZE.coins;
  const h = 0.0022;
  return (
    <group position={[0, -T / 2, 0]}>
      {COINS.map(([x, z, level, r], i) => {
        const y = h / 2 + level * h;
        const twenty = i === 4;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh geometry={CYL_Y} material={toon(twenty ? "#d6b04e" : "#cfd3d6")} scale={[r, h, r]} castShadow />
            {twenty ? null : (
              <mesh geometry={CYL_Y} material={toon("#d6b04e")} position={[0, 0.0002, 0]} scale={[r * 0.62, h, r * 0.62]} />
            )}
          </group>
        );
      })}
    </group>
  );
};
