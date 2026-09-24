/*
 * c010 acted — "Anmeldung beim Bürgerbüro", played by the two of them in a
 * 3D Bürgerbüro. The pilot for the acted films; see src/acted/.
 *
 * What happens, line by line:
 *
 *   open   Shruti types. Sijan waits on the bench under the number display
 *          with a clear folder beside him. The display chimes to B 042; he
 *          looks up, takes the folder, stands and walks to her desk.
 *   0      "Guten Tag…" standing beside the chair. She offers him the seat;
 *          he steps in front of it, sits, shuffles the chair in, puts the
 *          folder down.
 *   1-2    The appointment: she turns to her screen and types his name, and
 *          the ten o'clock row lights up.
 *   3-4    "Ihren Ausweis": his jacket opens, the right hand goes into the
 *          inside pocket and comes out with the passport, and it crosses the
 *          desk on "Hier ist mein Pass".
 *   gap    She opens it, looks from the photo to him and back, puts it down,
 *          types, and hands it back as she asks for the landlord's form. He
 *          puts it away again while she asks.
 *   5-6    He slides the Wohnungsgeberbestätigung out of the folder and
 *          passes it over; she reads it.
 *   7-8    Since when: she looks at him; he answers; she types the date.
 *   9-11   The form and a pen come across. He fills it in, points at the
 *          bottom with the pen — "hier unten?" — she taps the line, "Genau",
 *          and he signs while she explains the post.
 *   12     He slides it back. "Vielen Dank." He gathers his folder, gets up,
 *          pushes the chair in, nods, and leaves the way he came.
 *
 * Every beat hangs off a word or a line, never a frame number, so a
 * re-recorded line carries its business with it. `plus` is seconds.
 *
 * World coordinates (metres): +x is screen right in the master shot, +z is
 * towards the camera, the floor is y = 0. The desk is at x = 0; he sits at
 * x ≈ -0.72 facing +x, she at +0.74 facing -x. The named spots are in
 * acted/sets/buergerbuero.tsx.
 */

import type { Acted, Beat, Shot3D } from "../acted/types";

const S = "Sijan";
const R = "Shruti";

/* a beat for one of them, so the list below reads as a script */
type Verb = Beat extends infer B ? (B extends Beat ? Omit<B, "who"> : never) : never;
const sij = (b: Verb): Beat => ({ ...b, who: S }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: R }) as Beat;
/* the room's own events, which belong to nobody */
const room = (b: Verb): Beat => ({ ...b, who: R }) as Beat;

/* where she looks when she looks at her monitor */
const MONITOR = { spot: "keyL", off: [-0.1, 0.28, -0.5] as [number, number, number] };

const beats: Beat[] = [
  /* ---------------------------------------------------------- opening */
  shr({ do: "look", to: MONITOR, dur: 0.1, at: { t: 0 } }),
  shr({ do: "twist", amount: -0.15, dur: 0.1, at: { t: 0 } }),
  shr({ do: "type", dur: 2.6, at: { t: 0.05 } }),
  sij({ do: "look", to: { world: [-2.7, 0.55, -0.1] }, dur: 0.1, at: { t: 0 } }),

  room({ do: "display", text: "B 042", at: { gap: 0, plus: 0.15 } }),
  room({ do: "sound", name: "ding", volume: 0.55, at: { gap: 0, plus: 0.15 } }),
  sij({ do: "look", to: { world: [-0.85, 2.05, -1.47] }, dur: 0.45, at: { gap: 0, plus: 0.45 } }),
  sij({ do: "brows", amount: 0.6, at: { gap: 0, plus: 0.5 } }),
  sij({ do: "brows", amount: 0, at: { gap: 0, plus: 1.4 } }),
  shr({ do: "rest", hand: "both", at: { gap: 0, plus: 1.0 } }),
  shr({ do: "look", to: { face: S }, dur: 0.5, at: { gap: 0, plus: 1.1 } }),
  shr({ do: "twist", amount: 0, at: { gap: 0, plus: 1.1 } }),
  sij({ do: "reach", hand: "R", to: { spot: "benchFolder" }, palm: "down", grip: 0.7, dur: 0.55, at: { gap: 0, plus: 0.95 } }),
  sij({ do: "take", prop: "folder", hand: "R", grip: "carry", at: { gap: 0, plus: 1.5 } }),
  sij({ do: "rest", hand: "R", at: { gap: 0, plus: 1.52 } }),
  sij({ do: "stand", at: { gap: 0, plus: 1.55 } }),
  sij({ do: "look", to: { face: R }, dur: 0.5, at: { gap: 0, plus: 2.3 } }),
  sij({ do: "walk", path: [[-1.9, -0.05], [-0.82, 0.46]], face: 0, at: { gap: 0, plus: 2.5 } }),
  shr({ do: "smile", amount: 0.45, at: { gap: 0, plus: 4.4 } }),
  sij({ do: "smile", amount: 0.5, at: { gap: 0, plus: 5.0 } }),

  /* ---------------------------------------------------------- 0: greeting */
  sij({ do: "nod", size: 0.5, at: { line: 0, word: "Tag" } }),
  shr({ do: "nod", size: 0.6, at: { line: 0, end: true } }),
  shr({ do: "gesture", hand: "L", kind: "offer", toward: { world: [-0.28, 0.93, 0.3] }, at: { line: 0, end: true, plus: 0.05 } }),
  sij({ do: "step", to: [-0.42, 0.0], dur: 1.0, at: { gap: 1, plus: 0.25 } }),
  sij({ do: "sit", chair: "visitor", at: { gap: 1, plus: 1.3 } }),
  sij({ do: "scoot", chair: "visitor", by: 0.08, dur: 0.45, at: { gap: 1, plus: 2.5 } }),
  sij({ do: "lean", amount: 0.12, at: { gap: 1, plus: 2.95 } }),
  sij({ do: "reach", hand: "R", to: { spot: "folderSijan" }, palm: "down", dur: 0.55, at: { gap: 1, plus: 2.95 } }),
  sij({ do: "put", prop: "folder", spot: "folderSijan", at: { gap: 1, plus: 3.5 } }),
  sij({ do: "rest", hand: "R", at: { gap: 1, plus: 3.55 } }),
  sij({ do: "lean", amount: 0, at: { gap: 1, plus: 3.6 } }),
  sij({ do: "smile", amount: 0.2, at: { gap: 1, plus: 3.4 } }),
  shr({ do: "smile", amount: 0.2, at: { gap: 1, plus: 3.0 } }),

  /* ---------------------------------------------------------- 1-2: the appointment */
  shr({ do: "look", to: MONITOR, dur: 0.4, at: { line: 1, end: true, plus: 0.1 } }),
  shr({ do: "twist", amount: -0.25, at: { line: 1, end: true, plus: 0.1 } }),
  sij({ do: "nod", size: 0.7, at: { line: 2, word: "Ja" } }),
  shr({ do: "type", dur: 1.5, at: { line: 2, word: "Namen" } }),
  room({ do: "screen", state: "search", dur: 1.3, at: { line: 2, word: "Pahari" } }),
  room({ do: "screen", state: "found", at: { line: 2, end: true, plus: 0.25 } }),
  shr({ do: "nod", size: 0.4, at: { line: 2, end: true, plus: 0.35 } }),
  shr({ do: "rest", hand: "both", at: { gap: 3, plus: 0.1 } }),
  shr({ do: "look", to: { face: S }, dur: 0.45, at: { gap: 3, plus: 0.3 } }),
  shr({ do: "twist", amount: 0, at: { gap: 3, plus: 0.3 } }),

  /* ---------------------------------------------------------- 3-4: the passport */
  sij({ do: "nod", size: 0.6, at: { line: 3, word: "Ausweis" } }),
  sij({ do: "look", to: { hand: "Sijan.R" }, dur: 0.35, at: { line: 3, end: true, plus: -0.1 } }),
  sij({ do: "jacket", open: 1, at: { line: 3, end: true } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.4, grip: 0.2, at: { line: 3, end: true } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketIn" }, dur: 0.35, grip: 0.85, at: { line: 3, end: true, plus: 0.4 } }),
  sij({ do: "take", prop: "passport", hand: "R", grip: "keep", at: { line: 3, end: true, plus: 0.78 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.35, at: { line: 3, end: true, plus: 0.85 } }),
  sij({ do: "jacket", open: 0, dur: 0.4, at: { line: 3, end: true, plus: 1.2 } }),
  sij({ do: "reach", hand: "R", to: { body: "present" }, dur: 0.45, at: { line: 3, end: true, plus: 1.22 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 3, end: true, plus: 1.4 } }),
  sij({ do: "lean", amount: 0.3, dur: 0.7, at: { line: 4, plus: -0.35 } }),
  sij({ do: "reach", hand: "R", to: { spot: "exchange" }, palm: "in", dur: 0.75, at: { line: 4, plus: -0.35 } }),
  shr({ do: "lean", amount: 0.28, dur: 0.6, at: { line: 4, word: "Pass", plus: -0.25 } }),
  shr({ do: "look", to: { prop: "passport" }, dur: 0.3, hold: 0.7, at: { line: 4, word: "Pass", plus: -0.3 } }),
  shr({ do: "reach", hand: "L", to: { prop: "passport", off: [0.035, 0.0, 0.0] }, palm: "in", grip: 0.75, dur: 0.6, at: { line: 4, word: "Pass", plus: -0.25 } }),
  shr({ do: "take", prop: "passport", hand: "L", grip: "keep", at: { line: 4, word: "Pass", plus: 0.36 } }),
  sij({ do: "rest", hand: "R", dur: 0.6, at: { line: 4, word: "Pass", plus: 0.45 } }),
  sij({ do: "lean", amount: 0, dur: 0.7, at: { line: 4, word: "Pass", plus: 0.45 } }),
  shr({ do: "reach", hand: "L", to: { body: "read" }, palm: "up", dur: 0.6, at: { line: 4, word: "Pass", plus: 0.5 } }),
  shr({ do: "lean", amount: 0.06, at: { line: 4, word: "Pass", plus: 0.5 } }),
  shr({ do: "open", prop: "passport", amount: 1, at: { line: 4, end: true, plus: 0.2 } }),

  /* ---------------------------------------------------------- the check */
  shr({ do: "look", to: { prop: "passport" }, dur: 0.3, at: { gap: 5, plus: -0.3 } }),
  shr({ do: "look", to: { face: S }, dur: 0.3, at: { gap: 5, plus: 0.6 } }),
  shr({ do: "look", to: { prop: "passport" }, dur: 0.3, at: { gap: 5, plus: 1.15 } }),
  shr({ do: "reach", hand: "L", to: { spot: "passportShruti" }, palm: "down", dur: 0.5, at: { gap: 5, plus: 1.6 } }),
  shr({ do: "put", prop: "passport", spot: "passportShruti", at: { gap: 5, plus: 2.1 } }),
  shr({ do: "look", to: MONITOR, dur: 0.35, at: { gap: 5, plus: 2.1 } }),
  shr({ do: "twist", amount: -0.22, at: { gap: 5, plus: 2.1 } }),
  shr({ do: "type", dur: 1.1, at: { gap: 5, plus: 2.15 } }),
  room({ do: "screen", state: "entry", dur: 1.0, at: { gap: 5, plus: 2.4 } }),
  shr({ do: "twist", amount: 0, at: { gap: 5, plus: 3.3 } }),
  shr({ do: "look", to: { prop: "passport" }, dur: 0.3, at: { gap: 5, plus: 3.3 } }),
  shr({ do: "rest", hand: "R", at: { gap: 5, plus: 3.3 } }),
  shr({ do: "reach", hand: "L", to: { prop: "passport" }, palm: "down", grip: 0.75, dur: 0.45, at: { gap: 5, plus: 3.3 } }),
  shr({ do: "take", prop: "passport", hand: "L", grip: "keep", at: { gap: 5, plus: 3.76 } }),
  shr({ do: "open", prop: "passport", amount: 0, dur: 0.4, at: { gap: 5, plus: 3.8 } }),
  shr({ do: "look", to: { face: S }, dur: 0.35, at: { gap: 5, plus: 4.0 } }),
  shr({ do: "lean", amount: 0.26, dur: 0.6, at: { gap: 5, plus: 4.1 } }),
  shr({ do: "reach", hand: "L", to: { spot: "exchange", off: [0.03, 0, -0.02] }, palm: "in", dur: 0.65, at: { gap: 5, plus: 4.1 } }),
  sij({ do: "lean", amount: 0.28, dur: 0.6, at: { gap: 5, plus: 4.35 } }),
  sij({ do: "reach", hand: "R", to: { prop: "passport", off: [-0.035, 0, 0] }, palm: "in", grip: 0.8, dur: 0.55, at: { gap: 5, plus: 4.35 } }),
  sij({ do: "take", prop: "passport", hand: "R", grip: "keep", at: { gap: 5, plus: 4.92 } }),
  shr({ do: "rest", hand: "L", at: { gap: 5, plus: 5.0 } }),
  shr({ do: "lean", amount: 0, dur: 0.7, at: { gap: 5, plus: 5.0 } }),
  sij({ do: "lean", amount: 0, dur: 0.6, at: { gap: 5, plus: 5.0 } }),
  sij({ do: "nod", size: 0.5, at: { gap: 5, plus: 5.0 } }),

  /* he puts it away while she asks for the landlord's form */
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.4, at: { line: 5, word: "Und", plus: 0.1 } }),
  sij({ do: "jacket", open: 1, at: { line: 5, word: "Und", plus: 0.2 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketIn" }, dur: 0.35, at: { line: 5, word: "Und", plus: 0.55 } }),
  sij({ do: "stow", prop: "passport", into: S, at: { line: 5, word: "Und", plus: 0.85 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.3, grip: 0.2, at: { line: 5, word: "Und", plus: 0.95 } }),
  sij({ do: "jacket", open: 0, dur: 0.4, at: { line: 5, word: "Und", plus: 1.25 } }),
  sij({ do: "rest", hand: "R", at: { line: 5, word: "Und", plus: 1.3 } }),

  /* ---------------------------------------------------------- 5-6: the landlord's form */
  sij({ do: "look", to: { prop: "folder" }, dur: 0.35, at: { line: 6, plus: -0.3 } }),
  sij({ do: "reach", hand: "R", to: { prop: "folder", off: [0.02, 0.012, 0.0] }, palm: "down", grip: 0.6, dur: 0.5, at: { line: 6, plus: -0.2 } }),
  sij({ do: "take", prop: "sheet", hand: "R", grip: "keep", at: { line: 6, plus: 0.32 } }),
  sij({ do: "reach", hand: "R", to: { spot: "exchange", off: [-0.25, -0.12, 0.08] }, palm: "down", dur: 0.55, arc: 0.02, at: { line: 6, plus: 0.35 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 6, word: "dabei" } }),
  sij({ do: "lean", amount: 0.3, dur: 0.6, at: { line: 6, end: true } }),
  sij({ do: "reach", hand: "R", to: { spot: "exchange", off: [-0.06, -0.08, 0.02] }, palm: "down", dur: 0.6, at: { line: 6, end: true } }),
  shr({ do: "lean", amount: 0.3, dur: 0.6, at: { line: 6, end: true, plus: 0.1 } }),
  shr({ do: "look", to: { prop: "sheet" }, dur: 0.3, at: { line: 6, end: true } }),
  shr({ do: "reach", hand: "L", to: { prop: "sheet", off: [0.1, 0.008, 0.02] }, palm: "down", grip: 0.7, dur: 0.6, at: { line: 6, end: true, plus: 0.1 } }),
  shr({ do: "take", prop: "sheet", hand: "L", grip: "keep", at: { line: 6, end: true, plus: 0.72 } }),
  sij({ do: "rest", hand: "R", at: { line: 6, end: true, plus: 0.8 } }),
  sij({ do: "lean", amount: 0, at: { line: 6, end: true, plus: 0.8 } }),
  shr({ do: "lean", amount: 0.05, at: { line: 6, end: true, plus: 0.8 } }),
  shr({ do: "reach", hand: "L", to: { body: "read" }, palm: "up", dur: 0.55, at: { line: 6, end: true, plus: 0.8 } }),
  shr({ do: "nod", size: 0.4, at: { gap: 7, plus: 1.0 } }),
  shr({ do: "reach", hand: "L", to: { spot: "docShruti" }, palm: "down", dur: 0.5, at: { gap: 7, plus: 1.3 } }),
  shr({ do: "put", prop: "sheet", spot: "docShruti", at: { gap: 7, plus: 1.8 } }),
  shr({ do: "rest", hand: "L", at: { gap: 7, plus: 1.85 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { gap: 7, plus: 1.8 } }),

  /* ---------------------------------------------------------- 7-8: since when */
  sij({ do: "nod", size: 0.35, at: { line: 8, word: "März" } }),
  shr({ do: "look", to: MONITOR, dur: 0.35, at: { line: 8, end: true } }),
  shr({ do: "twist", amount: -0.22, at: { line: 8, end: true } }),
  shr({ do: "type", dur: 0.9, at: { line: 8, end: true, plus: 0.1 } }),
  shr({ do: "rest", hand: "both", at: { gap: 9, plus: 0.9 } }),
  shr({ do: "twist", amount: 0, at: { gap: 9, plus: 0.9 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { gap: 9, plus: 0.95 } }),

  /* ---------------------------------------------------------- 9-11: the form */
  shr({ do: "look", to: { spot: "formTray" }, dur: 0.3, hold: 0.5, at: { line: 9, word: "füllen" } }),
  shr({ do: "reach", hand: "L", to: { prop: "form", off: [0.1, 0.006, 0.0] }, palm: "down", grip: 0.55, dur: 0.45, at: { line: 9, word: "füllen" } }),
  shr({ do: "take", prop: "form", hand: "L", grip: "keep", at: { line: 9, word: "füllen", plus: 0.47 } }),
  shr({ do: "lean", amount: 0.3, dur: 0.7, at: { line: 9, word: "Formular", plus: -0.2 } }),
  shr({ do: "reach", hand: "L", to: { spot: "formSijan", off: [0.13, 0.01, 0.0] }, palm: "down", arc: 0.03, dur: 0.8, at: { line: 9, word: "Formular", plus: -0.2 } }),
  shr({ do: "put", prop: "form", spot: "formSijan", at: { line: 9, word: "Formular", plus: 0.62 } }),
  shr({ do: "lean", amount: 0.05, at: { line: 9, end: true, plus: -0.1 } }),
  shr({ do: "reach", hand: "L", to: { spot: "penRest" }, palm: "down", grip: 0.6, dur: 0.45, at: { line: 9, end: true, plus: -0.1 } }),
  shr({ do: "take", prop: "pen", hand: "L", grip: "keep", at: { line: 9, end: true, plus: 0.37 } }),
  shr({ do: "lean", amount: 0.25, at: { line: 9, end: true, plus: 0.4 } }),
  shr({ do: "reach", hand: "L", to: { spot: "penSijan", off: [0.06, 0.01, 0] }, palm: "down", dur: 0.6, at: { line: 9, end: true, plus: 0.4 } }),
  shr({ do: "put", prop: "pen", spot: "penSijan", at: { line: 9, end: true, plus: 1.0 } }),
  shr({ do: "rest", hand: "L", at: { line: 9, end: true, plus: 1.05 } }),
  shr({ do: "lean", amount: 0, at: { line: 9, end: true, plus: 1.05 } }),

  sij({ do: "look", to: { prop: "form" }, dur: 0.35, at: { line: 9, word: "Formular", plus: 0.4 } }),
  sij({ do: "lean", amount: 0.2, dur: 0.6, at: { gap: 10, plus: 0.1 } }),
  sij({ do: "reach", hand: "R", to: { prop: "pen" }, palm: "down", grip: 0.8, dur: 0.45, at: { gap: 10, plus: 0.1 } }),
  sij({ do: "take", prop: "pen", hand: "R", grip: "carry", at: { gap: 10, plus: 0.55 } }),
  sij({ do: "reach", hand: "L", to: { prop: "form", off: [0.06, 0.03, -0.085] }, palm: "down", grip: 0.1, dur: 0.5, at: { gap: 10, plus: 0.4 } }),
  sij({ do: "reach", hand: "R", to: { prop: "form", off: [0.05, 0.06, 0.0] }, palm: "down", dur: 0.4, at: { gap: 10, plus: 0.6 } }),
  sij({ do: "scribble", hand: "R", on: "form", style: "fill", dur: 2.2, at: { gap: 10, plus: 1.0 } }),
  sij({ do: "reach", hand: "R", to: { prop: "form", off: [-0.095, 0.035, 0.03] }, palm: "down", dur: 0.45, at: { gap: 10, plus: 3.25 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 10, word: "unterschreiben" } }),
  sij({ do: "brows", amount: 0.7, at: { line: 10, word: "unterschreiben" } }),

  shr({ do: "look", to: { prop: "form" }, dur: 0.35, at: { line: 10, word: "unten" } }),
  shr({ do: "lean", amount: 0.32, dur: 0.6, at: { line: 10, end: true, plus: -0.1 } }),
  shr({ do: "reach", hand: "L", to: { prop: "form", off: [-0.1, 0.012, -0.06] }, palm: "down", grip: 0.9, point: 1, dur: 0.55, at: { line: 10, end: true, plus: -0.1 } }),
  shr({ do: "tap", hand: "L", times: 2, at: { line: 11, word: "Genau" } }),
  shr({ do: "nod", size: 0.6, at: { line: 11, word: "Genau" } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 11, word: "Die" } }),
  shr({ do: "rest", hand: "L", at: { line: 11, word: "Die" } }),
  shr({ do: "lean", amount: 0, dur: 0.7, at: { line: 11, word: "Die" } }),
  sij({ do: "brows", amount: 0, at: { line: 11, word: "Genau" } }),
  sij({ do: "look", to: { prop: "form" }, dur: 0.35, at: { line: 11, word: "Genau", plus: 0.25 } }),
  sij({ do: "scribble", hand: "R", on: "form", style: "sign", dur: 1.5, at: { line: 11, word: "Bestätigung" } }),
  sij({ do: "reach", hand: "R", to: { spot: "penSijan" }, palm: "down", dur: 0.45, at: { line: 11, end: true, plus: 0.05 } }),
  sij({ do: "put", prop: "pen", spot: "penSijan", at: { line: 11, end: true, plus: 0.5 } }),
  sij({ do: "rest", hand: "L", at: { line: 11, end: true, plus: 0.55 } }),
  sij({ do: "reach", hand: "R", to: { prop: "form", off: [0.0, 0.012, 0.03] }, palm: "down", grip: 0.3, dur: 0.4, at: { line: 11, end: true, plus: 0.55 } }),
  sij({ do: "take", prop: "form", hand: "R", grip: "keep", at: { line: 11, end: true, plus: 0.96 } }),
  sij({ do: "lean", amount: 0.28, dur: 0.6, at: { line: 11, end: true, plus: 0.95 } }),
  sij({ do: "reach", hand: "R", to: { spot: "formMiddle", off: [0.0, 0.012, 0.03] }, palm: "down", arc: 0.0, dur: 0.7, at: { line: 11, end: true, plus: 1.0 } }),
  sij({ do: "put", prop: "form", spot: "formMiddle", at: { line: 11, end: true, plus: 1.7 } }),
  sij({ do: "rest", hand: "R", at: { line: 11, end: true, plus: 1.72 } }),
  sij({ do: "lean", amount: 0, at: { line: 11, end: true, plus: 1.75 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 11, end: true, plus: 1.8 } }),

  /* ---------------------------------------------------------- 12: thanks, and out */
  sij({ do: "smile", amount: 0.6, at: { line: 12, word: "Vielen" } }),
  sij({ do: "nod", size: 0.6, at: { line: 12, word: "Dank" } }),
  shr({ do: "smile", amount: 0.55, at: { line: 12, word: "Dank" } }),
  shr({ do: "lean", amount: 0.2, at: { line: 12, word: "Dank" } }),
  shr({ do: "reach", hand: "L", to: { prop: "form", off: [0.05, 0.01, 0.0] }, palm: "down", grip: 0.5, dur: 0.5, at: { line: 12, word: "Dank" } }),
  shr({ do: "take", prop: "form", hand: "L", grip: "keep", at: { line: 12, word: "Dank", plus: 0.52 } }),
  shr({ do: "reach", hand: "L", to: { spot: "formShruti", off: [-0.05, 0.01, 0.0] }, palm: "down", arc: 0.0, dur: 0.6, at: { line: 12, word: "Dank", plus: 0.55 } }),
  shr({ do: "put", prop: "form", spot: "formShruti", at: { line: 12, word: "Dank", plus: 1.15 } }),
  shr({ do: "rest", hand: "L", at: { line: 12, word: "Dank", plus: 1.2 } }),
  shr({ do: "lean", amount: 0, at: { line: 12, word: "Dank", plus: 1.2 } }),

  sij({ do: "look", to: { prop: "folder" }, dur: 0.35, hold: 0.8, at: { line: 12, end: true, plus: 0.1 } }),
  sij({ do: "reach", hand: "R", to: { prop: "folder", off: [-0.08, 0.01, 0.0] }, palm: "down", grip: 0.7, dur: 0.5, at: { line: 12, end: true, plus: 0.1 } }),
  sij({ do: "take", prop: "folder", hand: "R", grip: "carry", at: { line: 12, end: true, plus: 0.62 } }),
  sij({ do: "rest", hand: "R", at: { line: 12, end: true, plus: 0.65 } }),
  sij({ do: "scoot", chair: "visitor", by: -0.1, dur: 0.4, at: { line: 12, end: true, plus: 0.7 } }),
  sij({ do: "stand", at: { line: 12, end: true, plus: 1.1 } }),
  sij({ do: "step", to: [-0.82, 0.46], dur: 0.9, at: { line: 12, end: true, plus: 2.2 } }),
  sij({ do: "reach", hand: "L", to: { world: [-1.0, 0.95, 0.05] }, palm: "down", grip: 0.6, dur: 0.4, hold: 0.55, at: { line: 12, end: true, plus: 3.0 } }),
  room({ do: "chair", chair: "visitor", to: [-0.76, 0.0], dur: 0.5, at: { line: 12, end: true, plus: 3.4 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 12, end: true, plus: 3.4 } }),
  sij({ do: "nod", size: 0.8, at: { line: 12, end: true, plus: 3.9 } }),
  shr({ do: "nod", size: 0.7, at: { line: 12, end: true, plus: 4.0 } }),
  sij({ do: "walk", path: [[-2.2, 0.7], [-5.6, 0.9]], at: { line: 12, end: true, plus: 4.4 } }),
  shr({ do: "look", to: MONITOR, dur: 0.5, at: { line: 12, end: true, plus: 5.4 } }),
  shr({ do: "twist", amount: -0.2, at: { line: 12, end: true, plus: 5.4 } }),
  shr({ do: "smile", amount: 0.15, at: { line: 12, end: true, plus: 5.4 } }),
  shr({ do: "type", dur: 3, at: { line: 12, end: true, plus: 5.8 } })
];

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

/* A side-on master across the desk, and cuts for the business. */
const MASTER = { pos: [-0.05, 1.28, 4.0], look: [-0.05, 1.0, -0.05], fov: 30 } as const;
const master = (at: Shot3D["at"], extra: Partial<Shot3D> = {}): Shot3D => ({
  at, pos: [...MASTER.pos], look: [...MASTER.look], fov: MASTER.fov, ...extra
});

const shots: Shot3D[] = [
  /* The camera moves only when it has to (the user's direction, 2026-09-24):
     the room with him on the bench, a glide into the master as he walks to
     the desk, the master for the whole conversation, and a pan as he leaves. */
  { at: { t: 0 }, pos: [-1.35, 1.6, 6.2], look: [-1.45, 1.05, -0.55], fov: 38, to: { pos: [-1.2, 1.55, 5.9] } },
  master({ gap: 0, plus: 4.6 }, { glide: 1.6 }),
  { at: { line: 12, end: true, plus: 4.2 }, pos: [-1.3, 1.55, 5.9], look: [-1.3, 1.05, -0.35], fov: 36, glide: 1.6, track: S, follow: 0.45 }
];

/* ------------------------------------------------------------------ */

export const c010Acted: Acted = {
  set: "buergerbuero",
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
        top: "#3f6b8f",
        topDark: "#355b7a",
        jacket: { color: "#3f6b8f", dark: "#2c4c66", shirt: "#eef1f3" },
        trousers: "#2f3540",
        shoes: "#3a2e28"
      },
      start: { x: -3.3, z: -0.7, yaw: -Math.PI / 2, seated: "bench" }
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
      start: { x: 0.32, z: 0, yaw: Math.PI, seated: "official" }
    }
  },
  /* seconds of silence before each line, for the business that takes longer
     to do than to say; see the synopsis at the top */
  gaps: { 0: 4.8, 1: 3.2, 3: 0.9, 4: 1.2, 5: 3.4, 7: 1.4, 9: 0.7, 10: 3.3, 12: 1.4 },
  /* long enough for him to be out of the door before the Wortschatz card */
  tail: 9.0,
  props: {
    passport: { kind: "passport", start: { pocket: S } },
    folder: { kind: "folder", start: { spot: "benchFolder" } },
    sheet: { kind: "sheet", start: { inside: "folder", off: [0, 0, 0] } },
    form: { kind: "form", start: { spot: "formTray" } },
    pen: { kind: "pen", start: { spot: "penRest" } }
  },
  beats,
  shots,
  /* Rings on real things. Line 3 asks for "Ausweis" while the passport is
     still in his pocket, so it waits for line 4, where it is in his hand. */
  callouts: {
    2: { at: "clock", label: "zehn Uhr", word: "Uhr", size: [0.22, 0.22] },
    4: { at: "passport", label: "der Pass", word: "Pass", size: [0.08, 0.07] },
    5: { at: "folder", label: "die Wohnungsgeberbestätigung", word: "Wohnungsgeberbestätigung", size: [0.17, 0.08] },
    9: { at: "form", label: "das Formular", word: "Formular", size: [0.16, 0.1] }
  }
};
