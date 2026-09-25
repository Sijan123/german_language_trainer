/*
 * The shopping props: what c002 carries round the supermarket and reads out
 * at home.
 *
 * Same convention as Props.tsx: each is drawn in its own frame, x along its
 * long side, y up (out of its face, when it lies down), z across, centred on
 * its PROP_SIZE box. The basket, the carton and the jar stand up, so their y
 * is their height.
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { PROP_SIZE } from "./world";
import { toon } from "./models";

const BOX = new THREE.BoxGeometry(1, 1, 1);
const SPHERE = new THREE.SphereGeometry(1, 20, 14);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 24, 1);
const FONT = "'IBM Plex Sans', system-ui, sans-serif";

/** A red wire shopping basket with a handle over the top. */
export const Basket: React.FC = () => {
  const [L, H, S] = PROP_SIZE.basket;
  const red = toon("#c0433a");
  const rods: React.ReactNode[] = [];
  /* the sides as bars, so it reads as wire and not a box */
  for (let i = 0; i <= 8; i++) {
    const x = -L / 2 + (i * L) / 8;
    for (const z of [-S / 2, S / 2]) rods.push(<mesh key={`x${i}${z}`} geometry={BOX} material={red} position={[x, 0, z]} scale={[0.006, H, 0.006]} />);
  }
  for (let i = 0; i <= 5; i++) {
    const z = -S / 2 + (i * S) / 5;
    for (const x of [-L / 2, L / 2]) rods.push(<mesh key={`z${i}${x}`} geometry={BOX} material={red} position={[x, 0, z]} scale={[0.006, H, 0.006]} />);
  }
  return (
    <group>
      {rods}
      {/* the rims and the floor */}
      {[-H / 2, H / 2].map((y) => (
        <group key={y}>
          {[-S / 2, S / 2].map((z) => <mesh key={z} geometry={BOX} material={red} position={[0, y, z]} scale={[L, 0.01, 0.01]} />)}
          {[-L / 2, L / 2].map((x) => <mesh key={x} geometry={BOX} material={red} position={[x, y, 0]} scale={[0.01, 0.01, S]} />)}
        </group>
      ))}
      <mesh geometry={BOX} material={toon("#a93a33")} position={[0, -H / 2 + 0.003, 0]} scale={[L, 0.004, S]} castShadow />
      {/* the handle, up over the middle */}
      <mesh position={[0, H / 2, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[L * 0.32, 0.008, 8, 24, Math.PI]} />
        <meshToonMaterial color="#2b2b30" />
      </mesh>
    </group>
  );
};

/** A carton of oat milk: oat-coloured with a green band and a picture of oats. */
export const Carton: React.FC = () => {
  const [W, H, D] = PROP_SIZE.carton;
  return (
    <group>
      <mesh geometry={BOX} material={toon("#efe2c2")} scale={[W, H * 0.9, D]} position={[0, -H * 0.05, 0]} castShadow />
      <mesh geometry={BOX} material={toon("#6f9a4a")} scale={[W * 1.002, H * 0.22, D * 1.002]} position={[0, -H * 0.12, 0]} />
      {/* the gable top */}
      <mesh position={[0, H * 0.42, 0]} rotation={[0, 0, Math.PI / 4]} scale={[W * 0.5, W * 0.5, D]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#efe2c2" />
      </mesh>
    </group>
  );
};

/** A box of ten eggs, lid shut, a window showing two of them. */
export const Eggs: React.FC = () => {
  const [L, H, S] = PROP_SIZE.eggs;
  return (
    <group>
      <mesh geometry={BOX} material={toon("#c9b999")} scale={[L, H, S]} castShadow />
      {[-0.05, 0.0, 0.05].map((x) => (
        <mesh key={x} geometry={SPHERE} material={toon("#f0e2c8")} position={[x, H / 2, 0]} scale={[0.02, 0.012, 0.022]} />
      ))}
    </group>
  );
};

/**
 * A tomato. These are the ones that "sehen heute nicht gut aus", so it is a
 * dull red with a brown bruise.
 */
export const Tomato: React.FC = () => {
  const [W, H] = PROP_SIZE.tomato;
  return (
    <group>
      <mesh geometry={SPHERE} material={toon("#b4533f")} scale={[W / 2, H / 2, W / 2]} castShadow />
      <mesh geometry={SPHERE} material={toon("#7a5a36")} position={[W * 0.22, H * 0.08, W * 0.2]} scale={[0.012, 0.01, 0.012]} />
      <mesh geometry={SPHERE} material={toon("#5d7a3a")} position={[0, H / 2, 0]} scale={[0.012, 0.004, 0.012]} />
    </group>
  );
};

/** A jar of strawberry jam with a gingham lid. */
export const Jar: React.FC = () => {
  const [W, H] = PROP_SIZE.jar;
  return (
    <group>
      <mesh geometry={CYL} material={toon("#9c2a3a")} scale={[W / 2, H * 0.8, W / 2]} position={[0, -H * 0.1, 0]} castShadow />
      <mesh geometry={CYL} material={toon("#d24a4a")} scale={[W / 2 + 0.003, H * 0.18, W / 2 + 0.003]} position={[0, H * 0.41, 0]} />
      <mesh geometry={CYL} material={toon("#f3efe6")} scale={[W / 2 + 0.0005, H * 0.25, W / 2 + 0.0005]} position={[0, -H * 0.1, 0]} />
    </group>
  );
};

/** A phone: dark slab, lit screen on its face (+y). */
export const Phone: React.FC = () => {
  const [L, T, S] = PROP_SIZE.phone;
  return (
    <group>
      <mesh geometry={BOX} material={toon("#23262b")} scale={[L, T, S]} castShadow />
      <mesh position={[0, T / 2 + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L * 0.9, S * 0.86]} />
        <meshBasicMaterial color="#7fb2d6" />
      </mesh>
    </group>
  );
};

let noteTex: THREE.CanvasTexture | null = null;
function noteTexture() {
  if (noteTex) return noteTex;
  const cv = document.createElement("canvas");
  cv.width = 400;
  cv.height = 600;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#fbf6e3";
  g.fillRect(0, 0, 400, 600);
  g.strokeStyle = "#c9d8e8";
  g.lineWidth = 3;
  for (let y = 110; y < 600; y += 70) {
    g.beginPath();
    g.moveTo(20, y);
    g.lineTo(380, y);
    g.stroke();
  }
  g.fillStyle = "#1f3a8a";
  g.font = `600 40px ${FONT}`;
  g.fillText("Einkaufen", 30, 70);
  g.font = `italic 500 44px Georgia, serif`;
  ["Milch", "Brot", "Eier", "Tomaten", "Käse"].forEach((w, i) => g.fillText("– " + w, 40, 160 + i * 70));
  noteTex = new THREE.CanvasTexture(cv);
  noteTex.colorSpace = THREE.SRGBColorSpace;
  return noteTex;
}

/** The shopping list: a slip of lined paper with the five things on it. */
export const Note: React.FC = () => {
  const [L, T, S] = PROP_SIZE.note;
  const map = useMemo(() => noteTexture(), []);
  return (
    <group>
      <mesh geometry={BOX} material={toon("#fbf6e3")} scale={[L, T, S]} castShadow />
      {/* printed top along +x, like the forms: plane x -> prop z, plane y -> prop x */}
      <mesh position={[0, T / 2 + 0.0003, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <planeGeometry args={[S, L]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
};
