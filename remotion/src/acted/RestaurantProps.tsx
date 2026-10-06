/*
 * The restaurant's props (c003): the menus, the water glasses, the soup and
 * the pasta, and the spoon and fork they are eaten with.
 *
 * Same convention as Props.tsx: each is drawn in its own frame, x along its
 * long side, y up (out of its face, when it lies down), z across, centred on
 * its PROP_SIZE box. The glass stands up, so its y is its height; the plates
 * lie flat.
 *
 * `open` is the menu's cover (0 shut, 1 opened out flat), and for the soup
 * and the pasta how much has been eaten.
 */

import React from "react";
import * as THREE from "three";
import { PROP_SIZE } from "./world";
import { toon } from "./models";
import { theme } from "../theme";

const r = theme.set.restaurant;
const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const SPHERE = new THREE.SphereGeometry(1, 20, 14);
const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 32, 1);

/* ------------------------------------------------------------------ */
/* The menu                                                            */
/* ------------------------------------------------------------------ */

const menuTex = new Map<string, THREE.CanvasTexture>();

/** The cover, and the inside: the dishes in German, and in English under each. */
function menuTexture(side: "cover" | "inside") {
  let t = menuTex.get(side);
  if (t) return t;
  const W = 600;
  const H = 840;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  if (side === "cover") {
    g.fillStyle = "#6f2f2a";
    g.fillRect(0, 0, W, H);
    g.strokeStyle = "#d9b56a";
    g.lineWidth = 10;
    g.strokeRect(30, 30, W - 60, H - 60);
    g.fillStyle = "#f2e2bf";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `700 76px ${FONT}`;
    g.fillText("Speisekarte", W / 2, H * 0.42);
    g.font = `500 44px ${FONT}`;
    g.fillStyle = "#d9b56a";
    g.fillText("Menu", W / 2, H * 0.52);
  } else {
    g.fillStyle = r.menu;
    g.fillRect(0, 0, W, H);
    g.fillStyle = r.menuInk;
    g.textBaseline = "alphabetic";
    g.font = `700 46px ${FONT}`;
    g.fillText("Hauptgerichte", 50, 90);
    const dishes: [string, string, string][] = [
      ["Gemüsesuppe", "Vegetable soup", "5,50"],
      ["Salat", "Salad", "4,90"],
      ["Nudeln mit Tomatensoße", "Pasta with tomato sauce", "9,80"],
      ["Schnitzel mit Pommes", "Schnitzel with fries", "13,50"],
      ["Eis", "Ice cream", "3,90"]
    ];
    dishes.forEach(([de, en, p], i) => {
      const y = 180 + i * 128;
      g.font = `600 36px ${FONT}`;
      g.fillStyle = r.menuInk;
      g.fillText(de, 50, y);
      g.font = `italic 400 28px ${FONT}`;
      g.fillStyle = "#8a7a66";
      g.fillText(en, 50, y + 38);
      g.font = `600 34px ${FONT}`;
      g.fillStyle = r.menuInk;
      g.textAlign = "right";
      g.fillText(p + " €", W - 50, y);
      g.textAlign = "left";
    });
  }
  t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  menuTex.set(side, t);
  return t;
}

/**
 * A menu in a card cover. Shut, it is the cover; opened, the cover swings
 * over on its spine (the -z edge) and lies flat beside the inside page.
 */
export const Menu: React.FC<{ open: number }> = ({ open }) => {
  const [L, T, S] = PROP_SIZE.menu;
  const cover = menuTexture("cover");
  const inside = menuTexture("inside");
  const leaf = T / 2;
  return (
    <group>
      {/* the back board, with the inside page on it */}
      <mesh geometry={BOX} material={toon("#6f2f2a")} position={[0, -leaf / 2, 0]} scale={[L, leaf, S]} castShadow />
      <mesh position={[0, 0.0005, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <planeGeometry args={[S * 0.94, L * 0.94]} />
        <meshBasicMaterial map={inside} />
      </mesh>
      {/* the cover, hinged on the spine */}
      <group position={[0, 0, -S / 2]} rotation={[-open * Math.PI * 0.98, 0, 0]}>
        <mesh geometry={BOX} material={toon("#6f2f2a")} position={[0, leaf / 2, S / 2]} scale={[L, leaf, S]} castShadow />
        <mesh position={[0, leaf + 0.0005, S / 2]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <planeGeometry args={[S, L]} />
          <meshBasicMaterial map={cover} />
        </mesh>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Glass, plates, cutlery                                              */
/* ------------------------------------------------------------------ */

/** A tumbler of water. */
export const Glass: React.FC = () => {
  const [D, H] = PROP_SIZE.glass;
  const rad = D / 2;
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[rad, rad * 0.86, H, 24, 1, true]} />
        <meshToonMaterial color="#e8f1f4" transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={CYL} position={[0, -H / 2 + 0.004, 0]} scale={[rad * 0.86, 0.008, rad * 0.86]}>
        <meshToonMaterial color="#e8f1f4" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* the water, two thirds up */}
      <mesh position={[0, -H / 2 + H * 0.34, 0]}>
        <cylinderGeometry args={[rad * 0.95, rad * 0.86, H * 0.66, 24]} />
        <meshToonMaterial color={r.water} transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Plate: React.FC<{ rad: number; y: number }> = ({ rad, y }) => (
  <group>
    <mesh position={[0, y + 0.004, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[rad, rad * 0.78, 0.012, 40]} />
      <meshToonMaterial color={r.plate} />
    </mesh>
    <mesh position={[0, y + 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[rad * 0.72, rad * 0.76, 40]} />
      <meshBasicMaterial color="#e3ddd2" />
    </mesh>
  </group>
);

/** A bowl of vegetable soup on its plate; `eaten` lowers it in the bowl. */
export const Soup: React.FC<{ eaten: number }> = ({ eaten }) => {
  const [D, H] = PROP_SIZE.soup;
  const y0 = -H / 2;
  const level = 0.042 - 0.022 * eaten;
  return (
    <group>
      <Plate rad={D / 2} y={y0} />
      <mesh position={[0, y0 + 0.012 + 0.025, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.045, 0.05, 32, 1, true]} />
        <meshToonMaterial color={r.plate} side={THREE.DoubleSide} />
      </mesh>
      {/* scaled rather than rebuilt, so the Blender capture can follow it */}
      <mesh position={[0, y0 + 0.012 + level, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.045 + 0.03 * (level / 0.05)}>
        <circleGeometry args={[1, 32]} />
        <meshToonMaterial color={r.soup} />
      </mesh>
      {/* bits of carrot and green in it */}
      {[[0.02, 0.01, "#e0782e"], [-0.018, 0.02, "#6d8a52"], [0.005, -0.025, "#e0782e"], [-0.025, -0.01, "#6d8a52"]].map(([x, z, c], i) => (
        <mesh key={i} geometry={BOX} material={toon(c as string)} position={[x as number, y0 + 0.013 + level, z as number]} scale={[0.01, 0.004, 0.01]} />
      ))}
    </group>
  );
};

/** A plate of pasta with tomato sauce and a basil leaf; `eaten` takes it down. */
export const Pasta: React.FC<{ eaten: number }> = ({ eaten }) => {
  const [D, H] = PROP_SIZE.pasta;
  const y0 = -H / 2;
  const s = 1 - 0.6 * eaten;
  return (
    <group>
      <Plate rad={D / 2} y={y0} />
      <mesh geometry={SPHERE} material={toon(r.pasta)} position={[0, y0 + 0.014, 0]} scale={[0.085 * s + 0.01, 0.028 * s, 0.075 * s + 0.01]} castShadow />
      <mesh geometry={SPHERE} material={toon(r.sauce)} position={[0.005, y0 + 0.014 + 0.018 * s, -0.004]} scale={[0.05 * s, 0.018 * s, 0.045 * s]} />
      <mesh geometry={SPHERE} material={toon("#4f7a3a")} position={[0.012, y0 + 0.016 + 0.034 * s, 0.006]} rotation={[0, 0.6, 0.2]} scale={[0.016, 0.003, 0.009]} />
    </group>
  );
};

/** Cutlery: along x, the business end at +x. */
const Cutlery: React.FC<{ head: "fork" | "spoon" }> = ({ head }) => {
  const [L, , W] = PROP_SIZE[head];
  const steel = toon("#c9ced1");
  return (
    <group>
      <mesh geometry={BOX} material={steel} position={[-L * 0.14, 0, 0]} scale={[L * 0.7, 0.004, W * 0.45]} castShadow />
      {head === "spoon" ? (
        <mesh geometry={SPHERE} material={steel} position={[L * 0.34, 0.002, 0]} scale={[L * 0.16, 0.006, W / 2]} castShadow />
      ) : (
        <group>
          <mesh geometry={BOX} material={steel} position={[L * 0.25, 0, 0]} scale={[L * 0.08, 0.004, W]} />
          {[-1, -0.33, 0.33, 1].map((z) => (
            <mesh key={z} geometry={BOX} material={steel} position={[L * 0.38, 0, (z * W) / 2.4]} scale={[L * 0.2, 0.003, 0.003]} />
          ))}
        </group>
      )}
    </group>
  );
};

export const Fork: React.FC = () => <Cutlery head="fork" />;
export const Spoon: React.FC = () => <Cutlery head="spoon" />;
