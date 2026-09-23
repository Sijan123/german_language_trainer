/*
 * The things that get handed about.
 *
 * Each is drawn in its own frame — x along its long side, y out of its face,
 * z across — and placed by the transform world.ts solved for it, whether that
 * is lying on the desk, in a hand, or tucked inside a folder. The paper
 * carries real German on it, because the camera goes close enough to read a
 * form and a blank rectangle there would say "prop".
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import type { PropKind } from "./types";
import type { Ink } from "./world";
import { PROP_SIZE } from "./world";
import { toon } from "./models";
import { quatFromBasis, type Xform } from "./math";
import { theme } from "../theme";

const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const c = theme.set.amt;

/* ------------------------------------------------------------------ */
/* Printed paper                                                       */
/* ------------------------------------------------------------------ */

const paperTex = new Map<string, THREE.CanvasTexture>();

/** A page of A4 at 4 px/mm, drawn once. Portrait, top of the page first. */
function pageTexture(kind: "form" | "sheet") {
  let tex = paperTex.get(kind);
  if (tex) return tex;
  const W = 840;
  const H = 1188;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#fbfaf6";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#1f2a3c";
  g.textBaseline = "alphabetic";
  const rule = (y: number, x0 = 70, x1 = W - 70) => {
    g.fillStyle = "#b9bdc4";
    g.fillRect(x0, y, x1 - x0, 3);
  };
  if (kind === "form") {
    g.fillStyle = "#2f5d8a";
    g.fillRect(0, 0, W, 26);
    g.fillStyle = "#1f2a3c";
    g.font = `700 50px ${FONT}`;
    g.fillText("Anmeldung", 70, 120);
    g.font = `500 28px ${FONT}`;
    g.fillStyle = "#4d5570";
    g.fillText("bei der Meldebehörde · Bürgerbüro", 70, 164);
    const fields = ["Familienname", "Vorname", "Einzugsdatum", "Neue Wohnung (Straße, Nr.)", "Staatsangehörigkeit"];
    fields.forEach((label, i) => {
      const y = 250 + i * 128;
      g.fillStyle = "#7b8298";
      g.font = `500 24px ${FONT}`;
      g.fillText(label, 70, y);
      rule(y + 62);
    });
    /* the signature box, low on the page where "hier unten" points */
    g.fillStyle = "#fdf0e0";
    g.fillRect(60, 930, W - 120, 170);
    g.fillStyle = "#7b8298";
    g.font = `500 24px ${FONT}`;
    g.fillText("Datum, Unterschrift", 70, 1080);
    rule(1040, 70, W - 70);
    g.fillStyle = "#e2761b";
    g.font = `700 40px ${FONT}`;
    g.fillText("✕", 76, 1026);
  } else {
    g.font = `700 40px ${FONT}`;
    g.fillText("Wohnungsgeberbestätigung", 70, 120);
    g.font = `500 24px ${FONT}`;
    g.fillStyle = "#4d5570";
    g.fillText("nach § 19 Bundesmeldegesetz", 70, 162);
    const lines = ["Wohnungsgeber: Hausverwaltung Krämer", "Anschrift der Wohnung: Lindenstraße 14", "Einzug am: 01.03.", "Meldepflichtige Person: Sijan Pahari"];
    lines.forEach((l, i) => {
      g.fillStyle = "#1f2a3c";
      g.font = `500 26px ${FONT}`;
      g.fillText(l, 70, 260 + i * 90);
      rule(275 + i * 90);
    });
    g.font = `italic 500 44px Georgia, serif`;
    g.fillStyle = "#2b3a6b";
    g.fillText("R. Krämer", 460, 1000);
    rule(1020, 420, W - 70);
  }
  tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  paperTex.set(kind, tex);
  return tex;
}

/* The plane a page is printed on, turned so the canvas's top is the prop's
   +x and its right-hand edge the prop's +z: plane x -> prop z, plane y ->
   prop x, plane normal -> prop y. */
const PAGE_Q = (() => {
  const q = quatFromBasis([0, 0, 1], [1, 0, 0], [0, 1, 0]);
  return new THREE.Quaternion(q[0], q[1], q[2], q[3]);
})();

/** Pen strokes on a page, as thin ribbons lying on it. */
const InkLines: React.FC<{ ink: Ink; y: number }> = ({ ink, y }) => {
  const count = ink.reduce((n, s) => n + s.length, 0);
  const geom = useMemo(() => {
    const pos: number[] = [];
    const w = 0.0011;
    for (const s of ink) {
      for (let i = 0; i + 1 < s.length; i++) {
        const [ax, az] = s[i];
        const [bx, bz] = s[i + 1];
        const dx = bx - ax;
        const dz = bz - az;
        const l = Math.hypot(dx, dz) || 1;
        const nx = (-dz / l) * w;
        const nz = (dx / l) * w;
        pos.push(ax + nx, y, az + nz, bx + nx, y, bz + nz, ax - nx, y, az - nz);
        pos.push(bx + nx, y, bz + nz, bx - nx, y, bz - nz, ax - nx, y, az - nz);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return (
    <mesh geometry={geom}>
      <meshBasicMaterial color="#1f3a8a" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Page: React.FC<{ kind: "form" | "sheet"; ink?: Ink }> = ({ kind, ink }) => {
  const [L, T, S] = PROP_SIZE[kind];
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[L, T, S]} />
        <meshToonMaterial color="#f4f2ec" />
      </mesh>
      <mesh position={[0, T / 2 + 0.0002, 0]} quaternion={PAGE_Q}>
        <planeGeometry args={[S, L]} />
        <meshBasicMaterial map={pageTexture(kind)} toneMapped={false} />
      </mesh>
      {ink && ink.length ? <InkLines ink={ink} y={T / 2 + 0.0005} /> : null}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The passport                                                        */
/* ------------------------------------------------------------------ */

/*
 * A burgundy booklet with a gold emblem, which opens along its long side
 * like a book. The back cover lies still and the front cover turns on the
 * spine; open, the photo page shows.
 */
const Passport: React.FC<{ open: number }> = ({ open }) => {
  const [L, T, S] = PROP_SIZE.passport;
  const leaf = T / 2;
  const cover = c.pass;
  return (
    <group>
      {/* back cover and the pages resting on it */}
      <mesh position={[0, -leaf / 2, 0]} castShadow>
        <boxGeometry args={[L, leaf, S]} />
        <meshToonMaterial color={cover} />
      </mesh>
      <mesh position={[0, 0.0003, 0]}>
        <boxGeometry args={[L - 0.006, 0.0006, S - 0.006]} />
        <meshToonMaterial color="#efe9dc" />
      </mesh>
      {/* the photo page, seen once the cover is turned */}
      {open > 0.05 ? (
        <group position={[0, 0.0008, 0]}>
          <mesh position={[0.018, 0, 0.018]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.035, 0.028]} />
            <meshBasicMaterial color="#8a6f5a" />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.015 - i * 0.012, 0, 0.004]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.004, 0.06]} />
              <meshBasicMaterial color="#9aa0a8" />
            </mesh>
          ))}
        </group>
      ) : null}
      {/* the front cover, hinged on the spine at -z */}
      <group position={[0, 0, -S / 2]} rotation={[-open * Math.PI * 0.97, 0, 0]}>
        <group position={[0, leaf / 2, S / 2]}>
          <mesh castShadow>
            <boxGeometry args={[L, leaf, S]} />
            <meshToonMaterial color={cover} />
          </mesh>
          {/* the emblem */}
          <mesh position={[0.012, leaf / 2 + 0.0003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.016, 24]} />
            <meshBasicMaterial color={c.passInk} />
          </mesh>
          <mesh position={[-0.038, leaf / 2 + 0.0003, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.05, 0.006]} />
            <meshBasicMaterial color={c.passInk} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The rest                                                            */
/* ------------------------------------------------------------------ */

const Folder: React.FC = () => {
  const [L, T, S] = PROP_SIZE.folder;
  return (
    <group>
      {/* a clear sleeve: the sheet inside shows through */}
      <mesh castShadow>
        <boxGeometry args={[L, T, S]} />
        <meshToonMaterial color="#cfe0ea" transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <mesh position={[L / 2 - 0.004, 0, 0]}>
        <boxGeometry args={[0.008, T + 0.002, S]} />
        <meshToonMaterial color="#4d7aa0" />
      </mesh>
    </group>
  );
};

const Pen: React.FC = () => {
  const [L, , D] = PROP_SIZE.pen;
  return (
    /* along x, tip at -x */
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[D / 2, D / 2, L * 0.8, 12]} />
        <meshToonMaterial color="#2f5d8a" />
      </mesh>
      <mesh position={[-L * 0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[D / 2, L * 0.1, 12]} />
        <meshToonMaterial color="#d8dde2" />
      </mesh>
      <mesh position={[L * 0.41, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[D / 2 + 0.0005, D / 2 + 0.0005, L * 0.05, 12]} />
        <meshToonMaterial color="#1f2a3c" />
      </mesh>
    </group>
  );
};

export const Prop: React.FC<{ kind: PropKind; x: Xform; open: number; ink?: Ink }> = ({ kind, x, open, ink }) => (
  <group position={x.p} quaternion={new THREE.Quaternion(x.q[0], x.q[1], x.q[2], x.q[3])}>
    {kind === "passport" ? <Passport open={open} /> : null}
    {kind === "folder" ? <Folder /> : null}
    {kind === "sheet" ? <Page kind="sheet" /> : null}
    {kind === "form" ? <Page kind="form" ink={ink} /> : null}
    {kind === "pen" ? <Pen /> : null}
  </group>
);

export { toon };
