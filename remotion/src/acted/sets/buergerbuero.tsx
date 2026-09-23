/*
 * The Bürgerbüro, in 3D.
 *
 * Same room as the drawn set (components/sets/Buergerbuero.tsx) and the same
 * palette, but now it has a depth the camera can move in and furniture people
 * can sit on. The official's desk stands side-on to the master camera so the
 * two people face each other across it in profile; the waiting bench is at the
 * back left, under the number display, which is where the film starts.
 *
 *            back wall  z = -1.5
 *   [bench]  [door]   [display]      [clock]   [shelves]
 *
 *     Sijan's chair  |  desk  |  Shruti's chair
 *        x = -0.80      x = 0      x = +0.74
 *
 *                 camera, side-on, at +z
 *
 * The layout is plain data — chairs, spots, anchors — because the rig solves
 * against it without three.js being loaded at all. The drawing is below it.
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { theme } from "../../theme";
import { Model, toon, useModels } from "../models";
import type { SetLayout, SetState } from "./index";

const c = theme.set.amt;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const DESK_TOP = 0.77;
const PAPER = DESK_TOP + 0.004;

export const buergerbueroLayout: SetLayout = {
  chairs: {
    /* seat centre, the way a person sitting on it faces, seat height */
    visitor: { at: [-0.8, 0.0], yaw: 0, seat: 0.46, desk: true },
    official: { at: [0.74, 0.0], yaw: Math.PI, seat: 0.47, desk: true },
    bench: { at: [-3.3, -1.12], yaw: -Math.PI / 2, seat: 0.44 }
  },

  spots: {
    /* over the middle of the desk, where a hand-over meets */
    exchange: { p: [-0.03, 0.97, 0.12] },
    /* Shruti's keyboard; her left hand is on the +z side */
    keyL: { p: [0.19, DESK_TOP + 0.045, 0.09] },
    keyR: { p: [0.19, DESK_TOP + 0.045, -0.09] },
    /* where the form lies while he fills it in, turned to face him */
    formSijan: { p: [-0.19, PAPER, 0.04], yaw: 0 },
    /* the form, back on her side */
    formShruti: { p: [0.14, PAPER + 0.002, 0.3], yaw: Math.PI },
    /* his folder, put down at his near elbow */
    folderSijan: { p: [-0.22, PAPER, 0.38], yaw: 0.12 },
    /* the landlord's confirmation once she has it */
    docShruti: { p: [0.13, PAPER, 0.27], yaw: Math.PI - 0.1 },
    /* the passport on her side, while she types it in */
    passportShruti: { p: [0.12, PAPER, 0.2], yaw: Math.PI - 0.2 },
    /* the tray of blank forms and the pen beside it */
    formTray: { p: [0.2, DESK_TOP + 0.034, 0.52], yaw: Math.PI },
    penRest: { p: [0.3, DESK_TOP + 0.006, 0.34], yaw: Math.PI / 2 },
    /* on the bench at his right hand, before he is called */
    benchFolder: { p: [-3.66, 0.455, -1.12], yaw: 1.4 },
    /* half way across: as far as he can slide the signed form back */
    formMiddle: { p: [-0.03, PAPER + 0.001, 0.2], yaw: 0.15 },
    /* the pen, put down on the desk after signing */
    penSijan: { p: [-0.12, DESK_TOP + 0.006, 0.26], yaw: 1.2 }
  },

  anchors: {
    screen: [0.1, 1.05, -0.42],
    display: [-0.85, 2.05, -1.47],
    clock: [0.95, 2.12, -1.47],
    door: [-2.0, 1.0, -1.47],
    visitorChair: [-0.8, 0.7, 0.0]
  }
};

/* ------------------------------------------------------------------ */
/* Palette for the furniture                                          */
/* ------------------------------------------------------------------ */

/* Kenney's material names, repainted. Module-level so the memo in <Model>
   sees the same object every frame and never re-clones a mesh. */
const BEECH = { wood: "#cbb08a", woodDark: "#a88d69", metal: c.chrome, metalDark: "#5d666c", metalMedium: "#7b858b", carpet: c.stuhl, carpetDarker: c.stuhlDark, _defaultMat: c.wall };
const OFFICE_CHAIR = { carpet: "#4f5d69", metalMedium: "#6f7a82", metal: c.chrome };
const VISITOR = { wood: c.stuhl, woodDark: c.stuhlDark };
const BENCH = { wood: c.stuhl, woodDark: c.stuhlDark, carpet: c.stuhl, metal: c.chrome };
const DOOR = { wood: "#b9ae97", metal: c.chrome, woodDark: "#a39883" };
const PLANT = { wood: "#c9c3b5", woodDark: "#b3ab9b", plant: c.pflanze };
const SHELF = { wood: "#c9c3b5" };
const KEYS = { metalDark: "#3a4148", metalMedium: "#59636b" };
const BIN = { metal: "#9aa3a8", metalDark: "#6f787d" };

const MODELS = [
  "desk", "chairDesk", "chair", "bench", "doorway", "bookcaseClosedWide",
  "computerKeyboard", "computerMouse", "pottedPlant", "coatRackStanding",
  "trashcan", "plantSmall1", "books"
];

/* ------------------------------------------------------------------ */
/* Painted things: the display, the monitor, the clock, the sign       */
/* ------------------------------------------------------------------ */

/**
 * A canvas that becomes a texture, redrawn only when what it shows changes.
 * The number display and the monitor are the two surfaces in the room that
 * carry words, and both have to be legible in a close-up.
 */
function useCanvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, key: string) {
  const { canvas, tex } = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: cv, tex: t };
  }, [w, h]);
  useMemo(() => {
    const g = canvas.getContext("2d")!;
    draw(g);
    tex.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return tex;
}

const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

/** "SCHALTER 3" over the called number; the number flashes when it changes. */
const Display: React.FC<{ text: string; flash: number }> = ({ text, flash }) => {
  const lit = flash > 0 && Math.floor(flash * 6) % 2 === 0;
  const tex = useCanvasTexture(512, 288, (g) => {
    g.fillStyle = c.anzeige;
    g.fillRect(0, 0, 512, 288);
    g.fillStyle = c.anzeigeInk;
    g.globalAlpha = 0.75;
    g.font = `700 40px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("SCHALTER 3", 256, 70);
    g.globalAlpha = lit ? 0.35 : 1;
    g.font = `700 118px ${MONO}`;
    g.fillText(text, 256, 185);
  }, text + (lit ? "!" : ""));
  const [x, y, z] = buergerbueroLayout.anchors.display;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.78, 0.46, 0.05]} />
        <meshBasicMaterial color="#1b2229" />
      </mesh>
      <mesh position={[0, 0, 0.007]}>
        <planeGeometry args={[0.72, 0.405]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
};

/*
 * The official's screen. It shows the appointment calendar: while she types
 * the name the search box fills a letter at a time, then the ten o'clock row
 * lights up. States: "list", "search" (progress 0..1 types the name),
 * "found" (the row highlighted), "entry" (the registration form being
 * filled), "done".
 */
const Screen: React.FC<{ state: string; progress: number }> = ({ state, progress }) => {
  const name = "Pahari";
  const typed = state === "search" ? name.slice(0, Math.round(progress * name.length)) : state === "list" ? "" : name;
  const tex = useCanvasTexture(640, 400, (g) => {
    g.fillStyle = "#f4f6f5";
    g.fillRect(0, 0, 640, 400);
    /* title bar */
    g.fillStyle = "#3f6b8f";
    g.fillRect(0, 0, 640, 44);
    g.fillStyle = "#ffffff";
    g.font = `600 22px ${FONT}`;
    g.textBaseline = "middle";
    g.fillText(state === "entry" || state === "done" ? "Anmeldung · Wohnsitz" : "Termine · Schalter 3", 18, 23);
    if (state === "entry" || state === "done") {
      const rows = [
        ["Name", "Pahari, Sijan"],
        ["Ausweis", "Reisepass ✓"],
        ["Einzug", progress > 0.3 || state === "done" ? "01.03." : ""],
        ["Wohnungsgeber", "✓"],
        ["Unterschrift", state === "done" ? "✓" : "…"]
      ];
      rows.forEach(([k, v], i) => {
        const y = 80 + i * 60;
        g.fillStyle = "#7b8298";
        g.font = `500 22px ${FONT}`;
        g.fillText(k, 24, y);
        g.fillStyle = "#ffffff";
        g.fillRect(230, y - 22, 380, 44);
        g.strokeStyle = "#cfd4d8";
        g.strokeRect(230, y - 22, 380, 44);
        g.fillStyle = "#1f2a3c";
        g.font = `600 24px ${FONT}`;
        g.fillText(v, 244, y);
      });
      return;
    }
    /* search box */
    g.fillStyle = "#ffffff";
    g.fillRect(18, 60, 604, 46);
    g.strokeStyle = "#9aa3a8";
    g.lineWidth = 2;
    g.strokeRect(18, 60, 604, 46);
    g.fillStyle = "#1f2a3c";
    g.font = `600 26px ${FONT}`;
    g.fillText("🔍︎ " + typed + (state === "search" ? "|" : ""), 30, 84);
    const slots = [
      ["09:30", "Becker"],
      ["10:00", "Pahari"],
      ["10:30", "Nowak"],
      ["11:00", "Yilmaz"]
    ];
    slots.forEach(([t, n], i) => {
      const y = 150 + i * 58;
      const hit = n === "Pahari" && state === "found";
      const dim = typed.length > 0 && !n.startsWith(typed);
      g.fillStyle = hit ? "#e2761b" : i % 2 ? "#e9ecea" : "#f4f6f5";
      g.fillRect(18, y - 26, 604, 52);
      g.globalAlpha = dim ? 0.3 : 1;
      g.fillStyle = hit ? "#ffffff" : "#1f2a3c";
      g.font = `700 28px ${MONO}`;
      g.fillText(t, 34, y);
      g.font = `600 28px ${FONT}`;
      g.fillText(n, 170, y);
      g.globalAlpha = 1;
    });
  }, state + typed + (state === "entry" ? String(progress > 0.3) : ""));

  return (
    /* screen faces +x towards her, turned 30° to the lens so the master sees it */
    <group position={[0.1, DESK_TOP, -0.44]} rotation={[0, Math.PI / 3, 0]}>
      {/* foot and neck */}
      <mesh position={[0, 0.008, -0.03]} castShadow>
        <boxGeometry args={[0.2, 0.016, 0.16]} />
        <meshToonMaterial color="#3a4148" />
      </mesh>
      <mesh position={[0, 0.13, -0.05]} castShadow>
        <boxGeometry args={[0.05, 0.24, 0.03]} />
        <meshToonMaterial color="#3a4148" />
      </mesh>
      {/* bezel */}
      <mesh position={[0, 0.34, -0.03]} castShadow>
        <boxGeometry args={[0.6, 0.38, 0.035]} />
        <meshToonMaterial color="#2b3238" />
      </mesh>
      <mesh position={[0, 0.34, -0.011]}>
        <planeGeometry args={[0.56, 0.35]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** A wall clock at ten to ten, then ten — the appointment is at ten. */
const Clock: React.FC<{ minutes: number }> = ({ minutes }) => {
  const [x, y, z] = buergerbueroLayout.anchors.clock;
  const hour = ((9 + minutes / 60) / 12) * Math.PI * 2;
  const min = (minutes / 60) * Math.PI * 2;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 40]} />
        <meshToonMaterial color="#3d4552" />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <circleGeometry args={[0.175, 40]} />
        <meshBasicMaterial color="#f2f0ea" />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.15, Math.cos(a) * 0.15, 0.023]} rotation={[0, 0, -a]}>
            <planeGeometry args={[0.012, i % 3 === 0 ? 0.04 : 0.022]} />
            <meshBasicMaterial color="#3d4552" />
          </mesh>
        );
      })}
      <mesh position={[Math.sin(hour) * 0.045, Math.cos(hour) * 0.045, 0.026]} rotation={[0, 0, -hour]}>
        <planeGeometry args={[0.018, 0.1]} />
        <meshBasicMaterial color="#1f2a3c" />
      </mesh>
      <mesh position={[Math.sin(min) * 0.065, Math.cos(min) * 0.065, 0.028]} rotation={[0, 0, -min]}>
        <planeGeometry args={[0.012, 0.14]} />
        <meshBasicMaterial color="#1f2a3c" />
      </mesh>
    </group>
  );
};

/** The sign over the door: the first thing the opening shot has to say. */
const Sign: React.FC = () => {
  const tex = useCanvasTexture(768, 160, (g) => {
    g.fillStyle = "#2f5d8a";
    g.fillRect(0, 0, 768, 160);
    g.fillStyle = "#ffffff";
    g.font = `700 64px ${FONT}`;
    g.textBaseline = "middle";
    g.fillText("Bürgerbüro", 36, 64);
    g.globalAlpha = 0.8;
    g.font = `500 34px ${FONT}`;
    g.fillText("Anmeldung · Ummeldung · Ausweise", 38, 124);
  }, "sign");
  return (
    <mesh position={[-2.0, 2.42, -1.485]}>
      <planeGeometry args={[1.25, 0.26]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/** A framed print, so the long wall has something on it. */
const Picture: React.FC<{ at: [number, number]; w: number; h: number; tint: string }> = ({ at, w, h, tint }) => (
  <group position={[at[0], at[1], -1.49]}>
    <mesh>
      <boxGeometry args={[w, h, 0.03]} />
      <meshToonMaterial color={c.rahmen} />
    </mesh>
    <mesh position={[0, 0, 0.016]}>
      <planeGeometry args={[w - 0.06, h - 0.06]} />
      <meshToonMaterial color={tint} />
    </mesh>
  </group>
);

/** The tray of blank forms on her side of the desk. */
const Tray: React.FC = () => {
  const s = buergerbueroLayout.spots.formTray.p;
  return (
    <group position={[s[0], DESK_TOP, s[2]]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.024, 0.34]} />
        <meshToonMaterial color="#3a4148" />
      </mesh>
      {/* the blank forms under the one she will hand over */}
      <mesh position={[0, 0.028, 0]} receiveShadow>
        <boxGeometry args={[0.21, 0.01, 0.297]} />
        <meshToonMaterial color={c.papier} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The room                                                            */
/* ------------------------------------------------------------------ */

export const Buergerbuero3D: React.FC<{ state: SetState }> = ({ state }) => {
  const m = useModels(MODELS);
  const ch = state.chairs;
  if (!m) return null;
  const visitor = ch.visitor;

  return (
    <group>
      {/* floor and walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshToonMaterial color={c.floor} />
      </mesh>
      {/* floor tiles, as thin lines, so the floor has scale and the walk has
          something to be measured against */}
      {Array.from({ length: 26 }, (_, i) => (
        <mesh key={"tx" + i} rotation={[-Math.PI / 2, 0, 0]} position={[-7 + i * 0.6, 0.001, 2]}>
          <planeGeometry args={[0.012, 8]} />
          <meshBasicMaterial color={c.floorLine} />
        </mesh>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={"tz" + i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -1.5 + i * 0.6]}>
          <planeGeometry args={[30, 0.012]} />
          <meshBasicMaterial color={c.floorLine} />
        </mesh>
      ))}
      <mesh position={[0, 1.6, -1.52]} receiveShadow>
        <planeGeometry args={[30, 3.2]} />
        <meshToonMaterial color={c.wall} />
      </mesh>
      {/* dado panel along the lower wall, and the skirting */}
      <mesh position={[0, 0.5, -1.51]} receiveShadow>
        <planeGeometry args={[30, 1.0]} />
        <meshToonMaterial color={c.wallDark} />
      </mesh>
      <mesh position={[0, 1.005, -1.505]}>
        <boxGeometry args={[30, 0.03, 0.02]} />
        <meshToonMaterial color={c.rahmen} />
      </mesh>
      <mesh position={[0, 0.05, -1.5]}>
        <boxGeometry args={[30, 0.1, 0.02]} />
        <meshToonMaterial color={c.rahmen} />
      </mesh>
      {/* a window high on the right, the room's light source */}
      <group position={[3.4, 1.75, -1.5]}>
        <mesh>
          <boxGeometry args={[1.3, 1.1, 0.04]} />
          <meshToonMaterial color="#f0efe9" />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.18, 0.98]} />
          <meshBasicMaterial color="#cfe2ec" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.03, 0.98, 0.01]} />
          <meshToonMaterial color="#f0efe9" />
        </mesh>
      </group>

      <Model model={m.doorway} at={[-2.0, -1.47]} yaw={-Math.PI / 2} paint={DOOR} />
      <Sign />
      <Display text={state.display} flash={state.displayFlash} />
      <Clock minutes={state.clock} />
      <Picture at={[-3.9, 1.7]} w={0.62} h={0.46} tint="#7a97ad" />
      <Picture at={[2.35, 1.72]} w={0.44} h={0.58} tint="#b07f6d" />

      {/* the waiting area */}
      <Model model={m.bench} at={[-3.3, -1.2]} yaw={-Math.PI / 2} paint={BENCH} scale={[2.2, 2, 2]} />
      <Model model={m.pottedPlant} at={[-4.35, -1.22]} yaw={-Math.PI / 2} paint={PLANT} scale={1.6} />
      <Model model={m.coatRackStanding} at={[-2.72, -1.3]} yaw={-Math.PI / 2} paint={SHELF} />

      {/* behind the official */}
      <Model model={m.bookcaseClosedWide} at={[1.75, -1.36]} yaw={-Math.PI / 2} paint={SHELF} />
      <Model model={m.books} at={[1.5, -1.36]} y={0.79 * 2} yaw={-Math.PI / 2} paint={BEECH} scale={2} />
      <Model model={m.pottedPlant} at={[2.95, -1.22]} yaw={-Math.PI / 2} paint={PLANT} scale={1.6} />
      <Model model={m.trashcan} at={[0.62, -0.78]} yaw={-Math.PI / 2} paint={BIN} scale={1.0} />

      {/* the desk: drawers on her side, the plain back on his */}
      <Model model={m.desk} at={[0, -0.05]} yaw={0} paint={BEECH} scale={[2, 2, 0.7 / 0.556]} />
      <Model model={m.computerKeyboard} at={[0.19, 0.0]} y={DESK_TOP} yaw={0} paint={KEYS} scale={1.5} />
      <Model model={m.computerMouse} at={[0.21, -0.26]} y={DESK_TOP} yaw={0} paint={KEYS} scale={1.5} />
      <Model model={m.plantSmall1} at={[-0.2, -0.62]} y={DESK_TOP} yaw={0} paint={PLANT} scale={1.5} />
      <Screen state={state.screen} progress={state.screenProgress} />
      <Tray />

      {/* the chairs */}
      <Model
        model={m.chairDesk}
        at={[ch.official.at[0] + 0.03, ch.official.at[1]]}
        yaw={ch.official.yaw}
        paint={OFFICE_CHAIR}
      />
      <Model
        model={m.chair}
        at={[visitor.at[0] - 0.02, visitor.at[1]]}
        yaw={visitor.yaw}
        paint={VISITOR}
        scale={2.2}
      />
    </group>
  );
};
