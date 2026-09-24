/*
 * c001 acted — "Der Wecker hat nicht geklingelt", played in their flat: the
 * bedroom and the kitchen side by side (acted/sets/wohnung.tsx).
 *
 * What happens, line by line:
 *
 *   open   Half past seven. Shruti drinks her coffee at the kitchen island,
 *          glances at the clock on the wall, puts the mug down and hurries
 *          through to the bedroom. Sijan sits on the edge of the bed in his
 *          pyjamas, dozing, his head nodding.
 *   0      "Sijan, es ist schon halb acht!" — he starts awake.
 *   1      "Was? Mein Wecker…" — he grabs the alarm clock and stares at it.
 *   2      "Hast du ihn gestern Abend gestellt?"
 *   3      "Ich glaube schon. Vielleicht ist der Akku leer." — he taps it.
 *   4      "Dein Bus fährt in zwanzig Minuten." — he puts it back.
 *   5      "Ich dusche ganz schnell…" — up, and off into the bathroom.
 *   gap    She goes back to the kitchen.
 *   6-7    "Soll ich dir ein Brot machen?" she calls towards the bathroom;
 *          "Ja bitte, das wäre super" comes back, and she gets on with it.
 *   gap    The sandwich goes into the lunch box; she picks up her coffee
 *          again. He comes through from the bathroom, dressed.
 *   8      "Kaffee hast du keine Zeit mehr." — over her mug.
 *   9      "Kein Problem…" — she slides the lunch box over; he takes it.
 *   10     "Hier ist dein Schlüssel." — from the bowl, into his hand, into
 *          his jacket.
 *   11     "Danke, Schatz! Heute Abend stelle ich zwei Wecker." — and out of
 *          the front door; she shakes her head over her coffee.
 *
 * Every beat hangs off a word or a line; `plus` is seconds. He changes from
 * pyjamas into his work clothes while he is behind the bathroom wall.
 *
 * World coordinates (metres): +x is screen right, +z towards the camera, the
 * floor y = 0. The bedroom is x < 0, the kitchen x > 0.15; the partition's
 * doorway is at the back (z -1.25 .. -0.4). In the kitchen she stands at
 * x ≈ 2.22 facing -x (right hand on the -z side), he at 1.08 facing +x.
 */

import type { Acted, Beat, Shot3D, Vec3 } from "../acted/types";

const S = "Sijan";
const R = "Shruti";

type Verb = Beat extends infer B ? (B extends Beat ? Omit<B, "who"> : never) : never;
const sij = (b: Verb): Beat => ({ ...b, who: S }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: R }) as Beat;

/* where things are, for looks */
const KITCHEN_CLOCK: Vec3 = [1.0, 2.15, -1.47];
const BATHROOM: Vec3 = [-0.9, 1.5, -1.5];
const FLOOR_AT_HIS_FEET: Vec3 = [-2.9, 0.0, 0.7];
const COFFEE: Vec3 = [2.35, 1.12, -1.25];

/* where they stand */
const HER_BEDROOM: [number, number] = [-0.5, 0.35];
const HER_ISLAND: [number, number] = [2.22, 0.1];
const HIS_ISLAND: [number, number] = [1.08, 0.3];

const beats: Beat[] = [
  /* ---------------------------------------------------------- opening */
  /* him: asleep sitting up */
  sij({ do: "eyes", open: 0, dur: 0.1, at: { t: 0 } }),
  sij({ do: "lean", amount: 0.32, dur: 0.1, at: { t: 0 } }),
  sij({ do: "look", to: { world: FLOOR_AT_HIS_FEET }, dur: 0.1, at: { t: 0 } }),
  sij({ do: "smile", amount: 0, dur: 0.1, at: { t: 0 } }),
  sij({ do: "nod", size: 0.6, dur: 1.2, at: { gap: 0, plus: 1.2 } }),
  sij({ do: "nod", size: 0.9, dur: 1.4, at: { gap: 0, plus: 3.4 } }),
  /* her: coffee at the island, then the clock */
  shr({ do: "reach", hand: "R", to: { body: "drink" }, palm: "in", grip: 0.8, dur: 0.1, at: { t: 0 } }),
  shr({ do: "take", prop: "mug", hand: "R", grip: "carry", at: { t: 0 } }),
  shr({ do: "look", to: { world: KITCHEN_CLOCK }, dur: 0.45, at: { gap: 0, plus: 0.1 } }),
  shr({ do: "brows", amount: 0.9, at: { gap: 0, plus: 0.4 } }),
  shr({ do: "reach", hand: "R", to: { spot: "mug", off: [0, 0.05, 0] }, palm: "in", dur: 0.5, at: { gap: 0, plus: 0.6 } }),
  shr({ do: "put", prop: "mug", spot: "mug", at: { gap: 0, plus: 1.1 } }),
  shr({ do: "rest", hand: "R", at: { gap: 0, plus: 1.15 } }),
  shr({ do: "brows", amount: 0.2, at: { gap: 0, plus: 1.4 } }),
  shr({ do: "walk", speed: 1.45, path: [[2.2, -0.68], [0.5, -0.7], [-0.35, -0.8], HER_BEDROOM], face: Math.PI, at: { gap: 0, plus: 1.15 } }),
  shr({ do: "look", to: { face: S }, dur: 0.5, at: { gap: 0, plus: 3.6 } }),

  /* ---------------------------------------------------------- 0: half past seven! */
  sij({ do: "eyes", open: 1, dur: 0.15, at: { line: 0, word: "Sijan", plus: 0.15 } }),
  sij({ do: "brows", amount: 0.9, at: { line: 0, word: "Sijan", plus: 0.15 } }),
  sij({ do: "lean", amount: 0, dur: 0.35, at: { line: 0, word: "Sijan", plus: 0.15 } }),
  sij({ do: "look", to: { face: R }, dur: 0.3, at: { line: 0, word: "Sijan", plus: 0.2 } }),
  sij({ do: "look", to: { spot: "clockTable" }, dur: 0.3, at: { line: 0, word: "halb" } }),
  shr({ do: "brows", amount: 0.6, at: { line: 0, word: "halb" } }),

  /* ---------------------------------------------------------- 1: the alarm */
  sij({ do: "twist", amount: -0.35, dur: 0.45, at: { line: 1, word: "Mein", plus: -0.2 } }),
  sij({ do: "lean", amount: 0.18, dur: 0.45, at: { line: 1, word: "Mein", plus: -0.2 } }),
  sij({ do: "reach", hand: "R", to: { prop: "clock", off: [0, 0.03, 0] }, palm: "in", grip: 0.7, dur: 0.45, at: { line: 1, word: "Mein", plus: -0.2 } }),
  sij({ do: "take", prop: "clock", hand: "R", grip: "keep", at: { line: 1, word: "Mein", plus: 0.27 } }),
  sij({ do: "reach", hand: "R", to: { body: "present", off: [-0.06, 0.08, -0.05] }, palm: "in", dur: 0.5, at: { line: 1, word: "Mein", plus: 0.32 } }),
  sij({ do: "twist", amount: 0, dur: 0.5, at: { line: 1, word: "Mein", plus: 0.32 } }),
  sij({ do: "lean", amount: 0.08, dur: 0.5, at: { line: 1, word: "Mein", plus: 0.32 } }),
  sij({ do: "look", to: { prop: "clock" }, dur: 0.3, at: { line: 1, word: "Wecker" } }),
  sij({ do: "shake", times: 2, dur: 0.7, at: { line: 1, word: "nicht" } }),
  sij({ do: "brows", amount: 0.5, at: { line: 1, end: true } }),

  /* ---------------------------------------------------------- 2-3: set it? the battery */
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 2, word: "Hast" } }),
  shr({ do: "gesture", hand: "R", kind: "offer", toward: { prop: "clock" }, at: { line: 2, word: "gestern" } }),
  sij({ do: "nod", size: 0.4, at: { line: 3, word: "glaube" } }),
  sij({ do: "look", to: { prop: "clock" }, dur: 0.3, at: { line: 3, word: "Vielleicht" } }),
  sij({ do: "tap", hand: "R", times: 3, at: { line: 3, word: "Akku", plus: -0.2 } }),
  sij({ do: "brows", amount: 0.7, at: { line: 3, word: "leer" } }),

  /* ---------------------------------------------------------- 4: the bus */
  sij({ do: "look", to: { face: R }, dur: 0.3, at: { line: 4, word: "Dein" } }),
  shr({ do: "nod", size: 0.8, at: { line: 4, word: "Minuten" } }),
  shr({ do: "brows", amount: 0.4, at: { line: 4, word: "zwanzig" } }),
  sij({ do: "brows", amount: 1, at: { line: 4, word: "zwanzig" } }),
  sij({ do: "twist", amount: -0.35, dur: 0.45, at: { line: 4, end: true, plus: -0.3 } }),
  sij({ do: "lean", amount: 0.2, dur: 0.45, at: { line: 4, end: true, plus: -0.3 } }),
  sij({ do: "look", to: { spot: "clockTable" }, dur: 0.3, at: { line: 4, end: true, plus: -0.3 } }),
  sij({ do: "reach", hand: "R", to: { spot: "clockTable", off: [0, 0.1, 0] }, palm: "in", dur: 0.45, at: { line: 4, end: true, plus: -0.3 } }),
  sij({ do: "put", prop: "clock", spot: "clockTable", at: { line: 4, end: true, plus: 0.15 } }),
  sij({ do: "rest", hand: "R", at: { line: 4, end: true, plus: 0.2 } }),
  sij({ do: "twist", amount: 0, dur: 0.4, at: { line: 4, end: true, plus: 0.2 } }),
  sij({ do: "lean", amount: 0, dur: 0.4, at: { line: 4, end: true, plus: 0.2 } }),

  /* ---------------------------------------------------------- 5: shower */
  sij({ do: "look", to: { face: R }, dur: 0.3, at: { line: 5, word: "Ich" } }),
  sij({ do: "brows", amount: 0.2, at: { line: 5, word: "Ich" } }),
  sij({ do: "stand", dur: 0.95, at: { line: 5, word: "Ich" } }),
  sij({ do: "look", to: { world: BATHROOM }, dur: 0.4, at: { line: 5, word: "ziehe" } }),
  sij({ do: "walk", speed: 1.25, path: [[-1.55, 0.2], [-0.95, -1.05], [-0.9, -2.3]], at: { line: 5, word: "und" } }),
  shr({ do: "look", to: { hand: "Sijan.R" }, dur: 0.6, at: { line: 5, word: "ziehe" } }),
  shr({ do: "smile", amount: 0.3, at: { line: 5, end: true } }),

  /* ---------------------------------------------------------- back to the kitchen */
  shr({ do: "walk", speed: 1.35, path: [[-0.35, -0.78], [0.5, -0.7], [2.2, -0.68], HER_ISLAND], face: Math.PI, at: { gap: 6, plus: 0.1 } }),
  shr({ do: "look", to: { world: BATHROOM }, dur: 0.5, at: { line: 6, plus: -0.3 } }),

  /* ---------------------------------------------------------- 6-7: a sandwich? */
  shr({ do: "brows", amount: 0.5, at: { line: 6, word: "Brot" } }),
  shr({ do: "smile", amount: 0.45, at: { line: 7, word: "super" } }),
  shr({ do: "look", to: { spot: "board" }, dur: 0.4, at: { line: 7, word: "das" } }),
  shr({ do: "lean", amount: 0.15, at: { line: 7, word: "das" } }),
  shr({ do: "type", dur: 2.1, at: { line: 7, end: true, plus: -0.3 } }),

  /* ---------------------------------------------------------- into the box; he comes in */
  shr({ do: "reach", hand: "L", to: { prop: "lunchbox", off: [0, 0.03, 0.06] }, palm: "down", grip: 0.5, dur: 0.4, at: { gap: 8, plus: 1.85 } }),
  shr({ do: "open", prop: "lunchbox", amount: 1, dur: 0.4, at: { gap: 8, plus: 2.2 } }),
  shr({ do: "rest", hand: "L", at: { gap: 8, plus: 2.6 } }),
  shr({ do: "reach", hand: "R", to: { prop: "sandwich", off: [0, 0.03, 0] }, palm: "down", grip: 0.6, dur: 0.45, at: { gap: 8, plus: 2.05 } }),
  shr({ do: "take", prop: "sandwich", hand: "R", grip: "keep", at: { gap: 8, plus: 2.5 } }),
  shr({ do: "look", to: { prop: "lunchbox" }, dur: 0.3, at: { gap: 8, plus: 2.5 } }),
  shr({ do: "reach", hand: "R", to: { prop: "lunchbox", off: [0, 0.08, 0] }, palm: "down", dur: 0.5, at: { gap: 8, plus: 2.55 } }),
  shr({ do: "put", prop: "sandwich", into: "lunchbox", off: [0, -0.006, 0], at: { gap: 8, plus: 3.05 } }),
  shr({ do: "open", prop: "lunchbox", amount: 0, dur: 0.4, at: { gap: 8, plus: 3.15 } }),
  shr({ do: "lean", amount: 0, at: { gap: 8, plus: 3.4 } }),
  shr({ do: "reach", hand: "R", to: { prop: "mug", off: [0, 0.0, 0] }, palm: "in", grip: 0.8, dur: 0.45, at: { gap: 8, plus: 3.45 } }),
  shr({ do: "take", prop: "mug", hand: "R", grip: "carry", at: { gap: 8, plus: 3.9 } }),
  shr({ do: "reach", hand: "R", to: { body: "present", off: [-0.08, 0.05, -0.04] }, palm: "in", dur: 0.5, at: { gap: 8, plus: 3.95 } }),
  shr({ do: "look", to: { face: S }, dur: 0.45, at: { gap: 8, plus: 4.4 } }),
  /* him: dressed now, in from the bathroom */
  /* turned round behind the wall, where nobody sees him do it */
  sij({ do: "turn", yaw: -Math.PI / 2, dur: 0.8, at: { gap: 8, plus: 0.3 } }),
  sij({ do: "walk", speed: 1.2, path: [[-0.9, -1.1], [-0.35, -0.8], [0.5, -0.7], HIS_ISLAND], face: 0, at: { gap: 8, plus: 1.3 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { gap: 8, plus: 3.4 } }),
  sij({ do: "smile", amount: 0.3, at: { gap: 8, plus: 3.4 } }),

  /* ---------------------------------------------------------- 8: no time for coffee */
  shr({ do: "reach", hand: "R", to: { body: "drink" }, palm: "in", dur: 0.45, at: { line: 8, word: "Kaffee", plus: -0.1 } }),
  shr({ do: "reach", hand: "R", to: { body: "present", off: [-0.08, 0.05, -0.04] }, palm: "in", dur: 0.45, at: { line: 8, word: "hast" } }),
  shr({ do: "smile", amount: 0.5, at: { line: 8, word: "keine" } }),
  sij({ do: "look", to: { prop: "mug" }, dur: 0.3, hold: 0.4, at: { line: 8, word: "Kaffee" } }),
  sij({ do: "look", to: { world: COFFEE }, dur: 0.4, hold: 0.5, at: { line: 8, word: "Zeit" } }),
  sij({ do: "brows", amount: 0.5, at: { line: 8, word: "Zeit" } }),

  /* ---------------------------------------------------------- 9: at the office, then */
  sij({ do: "brows", amount: 0, at: { line: 9, word: "Kein" } }),
  sij({ do: "shake", times: 1, dur: 0.5, at: { line: 9, word: "Problem" } }),
  shr({ do: "reach", hand: "R", to: { spot: "mug", off: [0, 0.05, 0] }, palm: "in", dur: 0.5, at: { line: 9, word: "Kein" } }),
  shr({ do: "put", prop: "mug", spot: "mug", at: { line: 9, word: "Kein", plus: 0.5 } }),
  shr({ do: "rest", hand: "R", at: { line: 9, word: "Kein", plus: 0.55 } }),
  shr({ do: "lean", amount: 0.22, at: { line: 9, word: "trinke" } }),
  shr({ do: "reach", hand: "L", to: { prop: "lunchbox", off: [0.04, 0.02, 0.0] }, palm: "down", grip: 0.55, dur: 0.4, at: { line: 9, word: "Problem" } }),
  shr({ do: "take", prop: "lunchbox", hand: "L", grip: "keep", at: { line: 9, word: "ich" } }),
  shr({ do: "reach", hand: "L", to: { spot: "lunchOut", off: [0.06, 0.06, 0] }, palm: "down", arc: 0, dur: 0.5, at: { line: 9, word: "ich", plus: 0.05 } }),
  shr({ do: "put", prop: "lunchbox", spot: "lunchOut", at: { line: 9, word: "einen" } }),
  shr({ do: "rest", hand: "L", at: { line: 9, word: "einen", plus: 0.05 } }),
  shr({ do: "lean", amount: 0, at: { line: 9, word: "einen", plus: 0.05 } }),
  sij({ do: "look", to: { prop: "lunchbox" }, dur: 0.3, at: { line: 9, word: "trinke" } }),
  sij({ do: "lean", amount: 0.2, at: { line: 9, word: "im" } }),
  sij({ do: "reach", hand: "L", to: { prop: "lunchbox", off: [0, -0.03, 0] }, palm: "up", grip: 0.5, dur: 0.45, at: { line: 9, word: "im" } }),
  sij({ do: "take", prop: "lunchbox", hand: "L", grip: "carry", at: { line: 9, end: true } }),
  sij({ do: "reach", hand: "L", to: { body: "present", off: [-0.08, -0.06, 0.02] }, palm: "up", dur: 0.5, at: { line: 9, end: true, plus: 0.05 } }),
  sij({ do: "lean", amount: 0, at: { line: 9, end: true, plus: 0.05 } }),

  /* ---------------------------------------------------------- 10: your key */
  shr({ do: "look", to: { spot: "key" }, dur: 0.3, at: { gap: 10, plus: 0.0 } }),
  shr({ do: "reach", hand: "L", to: { prop: "key", off: [0, 0.02, 0] }, palm: "down", grip: 0.7, dur: 0.4, at: { gap: 10, plus: 0.0 } }),
  shr({ do: "take", prop: "key", hand: "L", grip: "keep", at: { gap: 10, plus: 0.4 } }),
  shr({ do: "look", to: { face: S }, dur: 0.3, at: { line: 10, word: "Hier" } }),
  shr({ do: "lean", amount: 0.22, at: { line: 10, word: "Hier" } }),
  shr({ do: "reach", hand: "L", to: { spot: "exchange", off: [0.08, 0.0, -0.05] }, palm: "in", dur: 0.5, at: { line: 10, word: "Hier" } }),
  sij({ do: "look", to: { prop: "key" }, dur: 0.3, at: { line: 10, word: "dein" } }),
  sij({ do: "lean", amount: 0.2, at: { line: 10, word: "dein" } }),
  sij({ do: "reach", hand: "R", to: { prop: "key", off: [-0.02, 0.0, 0.0] }, palm: "in", grip: 0.75, dur: 0.45, at: { line: 10, word: "dein" } }),
  sij({ do: "take", prop: "key", hand: "R", grip: "keep", at: { line: 10, word: "Schlüssel", plus: 0.15 } }),
  shr({ do: "rest", hand: "L", at: { line: 10, word: "Schlüssel", plus: 0.25 } }),
  shr({ do: "lean", amount: 0, at: { line: 10, word: "Schlüssel", plus: 0.25 } }),
  sij({ do: "lean", amount: 0, at: { line: 10, word: "Schlüssel", plus: 0.25 } }),
  shr({ do: "brows", amount: 0.6, at: { line: 10, word: "vergisst" } }),
  shr({ do: "smile", amount: 0.55, at: { line: 10, word: "immer" } }),
  shr({ do: "shake", times: 1, dur: 0.6, at: { line: 10, word: "immer" } }),
  sij({ do: "look", to: { hand: "Sijan.R" }, dur: 0.3, at: { line: 10, word: "Du" } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.4, at: { line: 10, word: "Du" } }),
  sij({ do: "jacket", open: 1, at: { line: 10, word: "Du", plus: 0.1 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketIn" }, dur: 0.35, at: { line: 10, word: "Du", plus: 0.45 } }),
  sij({ do: "stow", prop: "key", into: S, at: { line: 10, word: "Du", plus: 0.8 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.3, grip: 0.2, at: { line: 10, word: "Du", plus: 0.9 } }),
  sij({ do: "jacket", open: 0, dur: 0.4, at: { line: 10, word: "Du", plus: 1.2 } }),
  sij({ do: "rest", hand: "R", at: { line: 10, word: "Du", plus: 1.25 } }),
  sij({ do: "look", to: { face: R }, dur: 0.3, at: { line: 10, end: true } }),
  sij({ do: "smile", amount: 0.4, at: { line: 10, word: "immer" } }),
  shr({ do: "brows", amount: 0, at: { line: 10, end: true, plus: 0.3 } }),

  /* ---------------------------------------------------------- 11: thanks, love; and out */
  sij({ do: "smile", amount: 0.7, at: { line: 11, word: "Danke" } }),
  sij({ do: "nod", size: 0.6, at: { line: 11, word: "Schatz" } }),
  sij({ do: "brows", amount: 0.6, at: { line: 11, word: "zwei" } }),
  shr({ do: "smile", amount: 0.6, at: { line: 11, word: "Schatz" } }),
  sij({ do: "look", to: { world: [0.75, 1.5, -1.5] }, dur: 0.4, at: { line: 11, end: true, plus: 0.3 } }),
  sij({ do: "turn", yaw: Math.PI / 2 + 0.4, dur: 0.9, at: { line: 11, end: true, plus: 0.3 } }),
  sij({ do: "walk", speed: 1.3, path: [[0.75, -0.8], [0.75, -2.3]], at: { line: 11, end: true, plus: 1.1 } }),
  shr({ do: "look", to: { hand: "Sijan.L" }, dur: 0.5, at: { line: 11, end: true, plus: 0.5 } }),
  shr({ do: "shake", times: 2, dur: 1.0, at: { line: 11, end: true, plus: 1.4 } }),
  shr({ do: "reach", hand: "R", to: { prop: "mug", off: [0, 0.0, 0] }, palm: "in", grip: 0.8, dur: 0.45, at: { line: 11, end: true, plus: 2.2 } }),
  shr({ do: "take", prop: "mug", hand: "R", grip: "carry", at: { line: 11, end: true, plus: 2.65 } }),
  shr({ do: "reach", hand: "R", to: { body: "drink" }, palm: "in", dur: 0.6, at: { line: 11, end: true, plus: 2.7 } }),
  shr({ do: "look", to: { world: [1.0, 1.4, 1.8] }, dur: 0.6, at: { line: 11, end: true, plus: 3.0 } })
];

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

const BEDROOM = { pos: [-1.9, 1.45, 3.3] as Vec3, look: [-1.9, 1.0, -0.4] as Vec3, fov: 36 };
const KITCHEN = { pos: [1.65, 1.45, 3.4] as Vec3, look: [1.65, 1.1, -0.2] as Vec3, fov: 34 };
const bedroom = (at: Shot3D["at"], extra: Partial<Shot3D> = {}): Shot3D => ({ at, ...BEDROOM, ...extra });
const kitchen = (at: Shot3D["at"], extra: Partial<Shot3D> = {}): Shot3D => ({ at, ...KITCHEN, ...extra });

const shots: Shot3D[] = [
  /* The camera moves only when it has to (the user's direction, 2026-09-24):
     the flat with both of them, a glide into the bedroom as she goes in, a
     pan across to the kitchen as she goes back, and the kitchen from there
     to the end — he leaves by the door in that shot. */
  { at: { t: 0 }, pos: [-0.3, 1.75, 6.7], look: [-0.3, 1.1, -0.6], fov: 40, to: { pos: [-0.5, 1.72, 6.3] } },
  bedroom({ gap: 0, plus: 3.3 }, { glide: 1.6 }),
  kitchen({ gap: 6, plus: 0.8 }, { glide: 2.6 })
];

/* ------------------------------------------------------------------ */

/* his clothes: pyjamas (and bare feet) until the shower, then the suit */
const PYJAMAS = {
  top: "#8aa0bf",
  topDark: "#7489a8",
  jacket: { color: "#8aa0bf", dark: "#7489a8", shirt: "#a9bad1" },
  trousers: "#8aa0bf",
  shoes: "#b9805a"
};
const DRESSED = {
  top: "#3f6b8f",
  topDark: "#355b7a",
  jacket: { color: "#3f6b8f", dark: "#2c4c66", shirt: "#eef1f3" },
  trousers: "#2f3540",
  shoes: "#3a2e28"
};

export const c001Acted: Acted = {
  set: "wohnung",
  cast: {
    Sijan: {
      look: {
        height: 1.76,
        model: "sijan",
        skin: "#b9805a",
        skinShade: "#9d6741",
        hair: "#241b17",
        hairStyle: "short",
        beard: true,
        brows: "thick",
        ...PYJAMAS
      },
      start: { x: -3.08, z: -0.24, yaw: -Math.PI / 2, seated: "bed" },
      /* behind the bathroom wall, between lines 7 and 8 */
      changes: [{ at: { gap: 8 }, look: DRESSED }]
    },
    Shruti: {
      look: {
        height: 1.66,
        model: "shruti",
        skin: "#c48b64",
        skinShade: "#a97148",
        hair: "#40291f",
        hairStyle: "long",
        beard: false,
        brows: "normal",
        top: "#9c5068",
        topDark: "#89455a",
        trousers: "#3d4450",
        shoes: "#2b2b30",
        lanyard: true
      },
      start: { x: HER_ISLAND[0], z: HER_ISLAND[1], yaw: Math.PI }
    }
  },
  /* seconds of silence before each line, for the business that takes longer
     to do than to say; see the synopsis at the top */
  gaps: { 0: 5.4, 6: 4.0, 8: 5.2, 10: 0.9 },
  /* long enough for him to be out of the door before the Wortschatz card */
  tail: 5.0,
  props: {
    clock: { kind: "clock", start: { spot: "clockTable" } },
    mug: { kind: "mug", start: { spot: "mug" } },
    sandwich: { kind: "sandwich", start: { spot: "board" } },
    lunchbox: { kind: "lunchbox", start: { spot: "lunchbox" } },
    key: { kind: "key", start: { spot: "key" } }
  },
  beats,
  shots,
  /* Rings on real things, each on the line that names it. */
  callouts: {
    1: { at: "clock", label: "der Wecker", word: "Wecker", size: [0.08, 0.08] },
    3: { at: "clock", label: "der Akku", word: "Akku", size: [0.08, 0.08] },
    6: { at: "sandwich", label: "das Brot", word: "Brot", size: [0.08, 0.05] },
    8: { at: "mug", label: "der Kaffee", word: "Kaffee", size: [0.06, 0.07] },
    10: { at: "key", label: "der Schlüssel", word: "Schlüssel", size: [0.05, 0.04] }
  }
};
