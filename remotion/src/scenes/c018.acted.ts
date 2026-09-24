/*
 * c018 acted — "Beim Bäcker", played by the two of them in a 3D Bäckerei.
 * The second acted film; the set is acted/sets/baeckerei.tsx.
 *
 * What happens, line by line:
 *
 *   open   Shruti tidies the rolls in the case. The shop bell; Sijan comes
 *          in from the street on the left and walks up to the counter.
 *   0      "Guten Morgen…" — she offers the case with a hand.
 *   1      He points at the rolls on "Brötchen" and glances at the bread
 *          shelf on "Vollkornbrot".
 *   gap    She puts two rolls into the paper bag and goes to the shelf.
 *   2      "Geschnitten oder am Stück?" — she takes the loaf down and turns
 *          to him with it.
 *   3      "Geschnitten bitte."
 *   gap    She steps to the slicer, lays the loaf in, switches it on; the
 *          blade runs and the loaf comes out in slices.
 *   4      "Darf es sonst noch etwas sein?" as she carries it back, and it
 *          goes into the bag.
 *   5-7    He points at the cake; she shows him the last two slices; he
 *          takes both.
 *   gap    She opens the cake box, lifts both slices in, shuts it, and rings
 *          it up: the till shows 8,20 €.
 *   8      "Das macht acht Euro zwanzig."
 *   gap    His wallet comes out of the inside pocket and opens.
 *   9      "Kann ich mit Karte zahlen?" — he holds up his card.
 *   10     She points at the sticker on the till (ab 10 €) and shakes her
 *          head a little on "leider".
 *   gap    The card goes back; he takes the coins out.
 *   11     "Kein Problem, ich habe passend." — the coins go on the dish.
 *   gap    She puts them in the drawer (the till rings) and slides the bag
 *          and the box over to him while he puts his wallet away.
 *   12     "Vielen Dank und einen schönen Tag!" — he picks up both, nods,
 *          and leaves the way he came.
 *
 * Every beat hangs off a word or a line, never a frame number. `plus` is
 * seconds. The prices on the board add up to the till's 8,20.
 *
 * World coordinates (metres): +x is screen right in the master, +z towards
 * the camera, the floor y = 0. The counter runs along z at x = 0; he stands
 * at x ≈ -0.58 facing +x, she at +0.52 facing -x. Her right hand is on the
 * case's side (-z), her left on the till's (+z); his right hand is nearest
 * the lens.
 */

import type { Acted, Beat, Shot3D } from "../acted/types";

const S = "Sijan";
const R = "Shruti";

type Verb = Beat extends infer B ? (B extends Beat ? Omit<B, "who"> : never) : never;
const sij = (b: Verb): Beat => ({ ...b, who: S }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: R }) as Beat;
/* the room's own events, which belong to nobody */
const room = (b: Verb): Beat => ({ ...b, who: R }) as Beat;

/* where each of them stands at the counter */
const HIS: [number, number] = [-0.58, 0.32];
const HERS: [number, number] = [0.52, 0.3];
/* in front of the case's glass on his side, where a pointing finger stops */
const AT_ROLLS = { world: [-0.36, 1.08, -0.28] as [number, number, number] };
const AT_CAKE = { world: [-0.36, 1.1, -0.38] as [number, number, number] };

const beats: Beat[] = [
  /* ---------------------------------------------------------- opening */
  room({ do: "display", text: "0,00 €", at: { t: 0 } }),
  shr({ do: "look", to: { spot: "roll2" }, dur: 0.1, at: { t: 0 } }),
  shr({ do: "lean", amount: 0.22, dur: 0.1, at: { t: 0 } }),
  shr({ do: "reach", hand: "R", to: { spot: "roll2", off: [0.02, 0.06, -0.1] }, palm: "down", grip: 0.4, dur: 0.8, at: { t: 0.3 } }),
  shr({ do: "reach", hand: "R", to: { spot: "roll1", off: [0.02, 0.06, 0.02] }, palm: "down", dur: 0.6, at: { t: 1.3 } }),

  room({ do: "sound", name: "bell", volume: 0.45, at: { gap: 0, plus: 0.1 } }),
  sij({ do: "walk", path: [[-1.7, 0.75], HIS], face: 0, at: { gap: 0, plus: 0.2 } }),
  shr({ do: "rest", hand: "R", at: { gap: 0, plus: 0.4 } }),
  shr({ do: "step", to: HERS, dur: 0.7, at: { gap: 0, plus: 0.9 } }),
  shr({ do: "lean", amount: 0, dur: 0.7, at: { gap: 0, plus: 0.4 } }),
  shr({ do: "look", to: { face: S }, dur: 0.5, at: { gap: 0, plus: 0.5 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { gap: 0, plus: 0.3 } }),
  sij({ do: "look", to: { spot: "roll1" }, dur: 0.4, hold: 0.8, at: { gap: 0, plus: 2.2 } }),
  shr({ do: "smile", amount: 0.5, at: { gap: 0, plus: 2.6 } }),
  sij({ do: "smile", amount: 0.45, at: { gap: 0, plus: 3.4 } }),

  /* ---------------------------------------------------------- 0: good morning */
  sij({ do: "nod", size: 0.5, at: { line: 0, word: "Morgen" } }),
  shr({ do: "gesture", hand: "R", kind: "offer", toward: { spot: "roll1", off: [0.1, 0.2, 0.15] }, at: { line: 0, word: "hätten" } }),
  sij({ do: "smile", amount: 0.25, at: { line: 0, end: true } }),

  /* ---------------------------------------------------------- 1: rolls and a loaf */
  sij({ do: "look", to: { spot: "roll1" }, dur: 0.35, at: { line: 1, word: "Zwei", plus: -0.15 } }),
  sij({ do: "lean", amount: 0.12, at: { line: 1, word: "Zwei" } }),
  sij({ do: "reach", hand: "R", to: AT_ROLLS, palm: "down", grip: 0.9, point: 1, dur: 0.45, hold: 0.7, at: { line: 1, word: "Brötchen", plus: -0.25 } }),
  sij({ do: "lean", amount: 0, at: { line: 1, word: "und" } }),
  sij({ do: "look", to: { spot: "loafShelf" }, dur: 0.4, at: { line: 1, word: "Vollkornbrot", plus: -0.1 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 1, word: "bitte" } }),
  shr({ do: "look", to: { spot: "roll1" }, dur: 0.3, hold: 0.5, at: { line: 1, word: "Brötchen" } }),
  shr({ do: "nod", size: 0.5, at: { line: 1, word: "bitte" } }),

  /* ---------------------------------------------------------- the rolls into the bag */
  shr({ do: "step", to: [0.47, 0.02], dur: 0.6, at: { gap: 2, plus: 0.05 } }),
  shr({ do: "look", to: { spot: "roll1" }, dur: 0.35, at: { gap: 2, plus: 0.1 } }),
  shr({ do: "lean", amount: 0.26, dur: 0.6, at: { gap: 2, plus: 0.3 } }),
  shr({ do: "reach", hand: "R", to: { prop: "roll1", off: [0, 0.03, 0] }, palm: "down", grip: 0.65, dur: 0.55, at: { gap: 2, plus: 0.35 } }),
  shr({ do: "take", prop: "roll1", hand: "R", grip: "keep", at: { gap: 2, plus: 0.9 } }),
  shr({ do: "look", to: { prop: "bag" }, dur: 0.3, at: { gap: 2, plus: 0.9 } }),
  shr({ do: "reach", hand: "R", to: { prop: "bag", off: [-0.05, 0.19, 0] }, palm: "down", dur: 0.5, at: { gap: 2, plus: 0.95 } }),
  shr({ do: "put", prop: "roll1", into: "bag", off: [-0.06, -0.093, 0.0], at: { gap: 2, plus: 1.45 } }),
  shr({ do: "look", to: { prop: "roll2" }, dur: 0.3, at: { gap: 2, plus: 1.45 } }),
  shr({ do: "reach", hand: "R", to: { prop: "roll2", off: [0, 0.03, 0] }, palm: "down", grip: 0.65, dur: 0.5, at: { gap: 2, plus: 1.5 } }),
  shr({ do: "take", prop: "roll2", hand: "R", grip: "keep", at: { gap: 2, plus: 2.0 } }),
  shr({ do: "look", to: { prop: "bag" }, dur: 0.3, at: { gap: 2, plus: 2.0 } }),
  shr({ do: "reach", hand: "R", to: { prop: "bag", off: [0.05, 0.19, 0] }, palm: "down", dur: 0.5, at: { gap: 2, plus: 2.05 } }),
  shr({ do: "put", prop: "roll2", into: "bag", off: [0.06, -0.093, 0.0], at: { gap: 2, plus: 2.55 } }),
  shr({ do: "rest", hand: "R", at: { gap: 2, plus: 2.6 } }),
  shr({ do: "lean", amount: 0, dur: 0.5, at: { gap: 2, plus: 2.6 } }),
  /* to the bread shelf behind her */
  shr({ do: "look", to: { spot: "loafShelf" }, dur: 0.4, at: { gap: 2, plus: 2.55 } }),
  shr({ do: "walk", path: [[0.95, -0.3], [1.38, -0.86]], face: Math.PI / 2, at: { gap: 2, plus: 2.6 } }),
  sij({ do: "look", to: { hand: "Shruti.R" }, dur: 0.4, at: { gap: 2, plus: 0.4 } }),
  sij({ do: "look", to: { face: R }, dur: 0.5, at: { gap: 2, plus: 3.0 } }),

  /* ---------------------------------------------------------- 2: sliced or whole? */
  shr({ do: "reach", hand: "R", to: { prop: "loaf", off: [0, 0.04, 0] }, palm: "down", grip: 0.75, dur: 0.45, at: { line: 2, plus: -0.35 } }),
  shr({ do: "take", prop: "loaf", hand: "R", grip: "keep", at: { line: 2, plus: 0.1 } }),
  shr({ do: "reach", hand: "R", to: { body: "present" }, palm: "up", dur: 0.55, at: { line: 2, plus: 0.15 } }),
  shr({ do: "turn", yaw: 3.45, dur: 1.0, at: { line: 2, plus: 0.2 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 2, word: "Geschnitten" } }),

  /* ---------------------------------------------------------- 3: sliced, please */
  sij({ do: "nod", size: 0.6, at: { line: 3, word: "Geschnitten" } }),
  shr({ do: "nod", size: 0.5, at: { line: 3, end: true } }),

  /* ---------------------------------------------------------- the slicer */
  shr({ do: "turn", yaw: Math.PI / 2, dur: 0.9, at: { gap: 4, plus: 0.0 } }),
  shr({ do: "look", to: { spot: "slicerIn" }, dur: 0.4, at: { gap: 4, plus: 0.05 } }),
  shr({ do: "step", to: [0.86, -0.84], dur: 0.8, at: { gap: 4, plus: 0.35 } }),
  shr({ do: "reach", hand: "R", to: { spot: "slicerIn", off: [0.0, 0.1, 0.02] }, palm: "down", dur: 0.55, at: { gap: 4, plus: 0.8 } }),
  shr({ do: "put", prop: "loaf", spot: "slicerIn", at: { gap: 4, plus: 1.35 } }),
  shr({ do: "reach", hand: "R", to: { spot: "slicerSwitch", off: [0.0, 0.0, 0.05] }, palm: "forward", grip: 0.9, point: 1, dur: 0.35, hold: 0.25, at: { gap: 4, plus: 1.4 } }),
  room({ do: "room", name: "slicer", value: 1, dur: 0.2, at: { gap: 4, plus: 1.75 } }),
  room({ do: "sound", name: "slicer", volume: 0.35, dur: 2.4, at: { gap: 4, plus: 1.75 } }),
  shr({ do: "open", prop: "loaf", amount: 1, dur: 1.5, at: { gap: 4, plus: 2.0 } }),
  room({ do: "room", name: "slicer", value: 0, dur: 0.3, at: { gap: 4, plus: 3.6 } }),
  shr({ do: "reach", hand: "R", to: { prop: "loaf", off: [0, 0.05, 0] }, palm: "down", grip: 0.75, dur: 0.4, at: { gap: 4, plus: 3.45 } }),
  shr({ do: "take", prop: "loaf", hand: "R", grip: "keep", at: { gap: 4, plus: 3.85 } }),
  shr({ do: "reach", hand: "R", to: { body: "present" }, palm: "up", dur: 0.5, at: { gap: 4, plus: 3.9 } }),
  /* turn round first, loaf held, then walk: a hand swinging to the chest
     while the body spins round under it was the film's worst jolt */
  shr({ do: "turn", yaw: -2.2, dur: 0.9, at: { gap: 4, plus: 4.4 } }),
  shr({ do: "walk", path: [[1.0, -0.3], HERS], face: Math.PI, at: { gap: 4, plus: 5.2 } }),
  sij({ do: "look", to: { spot: "slicerIn" }, dur: 0.5, at: { gap: 4, plus: 1.6 } }),

  /* ---------------------------------------------------------- 4: anything else? */
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 4, plus: -0.2 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 4, plus: -0.3 } }),
  shr({ do: "look", to: { prop: "bag" }, dur: 0.3, at: { line: 4, word: "etwas" } }),
  shr({ do: "reach", hand: "R", to: { prop: "bag", off: [0, 0.23, 0] }, palm: "down", dur: 0.5, at: { line: 4, end: true, plus: 0.1 } }),
  shr({ do: "put", prop: "loaf", into: "bag", off: [0, -0.02, 0.0], at: { line: 4, end: true, plus: 0.6 } }),
  shr({ do: "rest", hand: "R", at: { line: 4, end: true, plus: 0.65 } }),
  shr({ do: "look", to: { face: S }, dur: 0.35, at: { line: 4, word: "sein" } }),

  /* ---------------------------------------------------------- 5-7: the cheesecake */
  sij({ do: "look", to: { spot: "slice1" }, dur: 0.35, at: { line: 5, word: "noch" } }),
  sij({ do: "lean", amount: 0.12, at: { line: 5, word: "noch" } }),
  sij({ do: "reach", hand: "R", to: AT_CAKE, palm: "down", grip: 0.9, point: 1, dur: 0.45, hold: 0.7, at: { line: 5, word: "Käsekuchen", plus: -0.2 } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 5, end: true, plus: 0.1 } }),
  sij({ do: "lean", amount: 0, at: { line: 5, end: true, plus: 0.1 } }),
  shr({ do: "look", to: { spot: "slice1" }, dur: 0.3, hold: 0.9, at: { line: 5, word: "Käsekuchen" } }),
  shr({ do: "gesture", hand: "R", kind: "offer", toward: { spot: "slice1", off: [0.05, 0.15, 0.1] }, at: { line: 6, word: "zwei", plus: -0.3 } }),
  shr({ do: "brows", amount: 0.4, at: { line: 6, word: "Nur" } }),
  shr({ do: "brows", amount: 0, at: { line: 6, end: true } }),
  sij({ do: "nod", size: 0.7, at: { line: 7, word: "beide" } }),
  sij({ do: "smile", amount: 0.55, at: { line: 7, word: "nehme" } }),
  shr({ do: "smile", amount: 0.55, at: { line: 7, end: true } }),

  /* ---------------------------------------------------------- the box */
  shr({ do: "step", to: [0.48, 0.02], dur: 0.6, at: { gap: 8, plus: 0.0 } }),
  shr({ do: "look", to: { prop: "box" }, dur: 0.3, at: { gap: 8, plus: 0.0 } }),
  shr({ do: "reach", hand: "R", to: { prop: "box", off: [0.0, 0.05, 0.075] }, palm: "down", grip: 0.5, dur: 0.45, at: { gap: 8, plus: 0.2 } }),
  shr({ do: "open", prop: "box", amount: 1, dur: 0.45, at: { gap: 8, plus: 0.65 } }),
  shr({ do: "look", to: { prop: "slice1" }, dur: 0.3, at: { gap: 8, plus: 0.9 } }),
  shr({ do: "lean", amount: 0.22, dur: 0.5, at: { gap: 8, plus: 0.9 } }),
  shr({ do: "reach", hand: "R", to: { prop: "slice1", off: [0, 0.03, 0] }, palm: "down", grip: 0.6, dur: 0.5, at: { gap: 8, plus: 0.95 } }),
  shr({ do: "take", prop: "slice1", hand: "R", grip: "keep", at: { gap: 8, plus: 1.45 } }),
  shr({ do: "look", to: { prop: "box" }, dur: 0.3, at: { gap: 8, plus: 1.45 } }),
  shr({ do: "reach", hand: "R", to: { prop: "box", off: [-0.05, 0.08, 0] }, palm: "down", dur: 0.5, at: { gap: 8, plus: 1.5 } }),
  shr({ do: "put", prop: "slice1", into: "box", off: [-0.05, -0.012, 0], at: { gap: 8, plus: 2.0 } }),
  shr({ do: "look", to: { prop: "slice2" }, dur: 0.3, at: { gap: 8, plus: 2.0 } }),
  shr({ do: "reach", hand: "R", to: { prop: "slice2", off: [0, 0.03, 0] }, palm: "down", grip: 0.6, dur: 0.5, at: { gap: 8, plus: 2.05 } }),
  shr({ do: "take", prop: "slice2", hand: "R", grip: "keep", at: { gap: 8, plus: 2.55 } }),
  shr({ do: "look", to: { prop: "box" }, dur: 0.3, at: { gap: 8, plus: 2.55 } }),
  shr({ do: "reach", hand: "R", to: { prop: "box", off: [0.05, 0.08, 0] }, palm: "down", dur: 0.5, at: { gap: 8, plus: 2.6 } }),
  shr({ do: "put", prop: "slice2", into: "box", off: [0.05, -0.012, 0], at: { gap: 8, plus: 3.1 } }),
  shr({ do: "open", prop: "box", amount: 0, dur: 0.45, at: { gap: 8, plus: 3.2 } }),
  shr({ do: "rest", hand: "R", at: { gap: 8, plus: 3.25 } }),
  shr({ do: "lean", amount: 0, dur: 0.5, at: { gap: 8, plus: 3.25 } }),
  /* ringing it up */
  shr({ do: "step", to: [0.52, 0.42], dur: 0.6, at: { gap: 8, plus: 3.4 } }),
  shr({ do: "look", to: { spot: "tillKeys" }, dur: 0.3, at: { gap: 8, plus: 3.5 } }),
  shr({ do: "reach", hand: "L", to: { spot: "tillKeys" }, palm: "down", grip: 0.9, point: 1, dur: 0.4, at: { gap: 8, plus: 3.6 } }),
  shr({ do: "tap", hand: "L", times: 3, at: { gap: 8, plus: 4.05 } }),
  room({ do: "display", text: "8,20 €", at: { gap: 8, plus: 4.6 } }),
  shr({ do: "rest", hand: "L", at: { gap: 8, plus: 4.75 } }),
  sij({ do: "look", to: { prop: "box" }, dur: 0.4, at: { gap: 8, plus: 0.6 } }),
  sij({ do: "look", to: { spot: "tillKeys" }, dur: 0.4, at: { gap: 8, plus: 4.2 } }),

  /* ---------------------------------------------------------- 8: 8,20 */
  shr({ do: "look", to: { face: S }, dur: 0.35, at: { line: 8, plus: -0.1 } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 8, word: "acht" } }),
  sij({ do: "nod", size: 0.45, at: { line: 8, end: true } }),

  /* ---------------------------------------------------------- the wallet */
  sij({ do: "look", to: { hand: "Sijan.R" }, dur: 0.35, at: { gap: 9, plus: 0.0 } }),
  sij({ do: "jacket", open: 1, at: { gap: 9, plus: 0.05 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.4, grip: 0.2, at: { gap: 9, plus: 0.05 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketIn" }, dur: 0.35, grip: 0.85, at: { gap: 9, plus: 0.45 } }),
  sij({ do: "take", prop: "wallet", hand: "R", grip: "keep", at: { gap: 9, plus: 0.83 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.35, at: { gap: 9, plus: 0.9 } }),
  sij({ do: "jacket", open: 0, dur: 0.4, at: { gap: 9, plus: 1.25 } }),
  sij({ do: "reach", hand: "R", to: { body: "present", off: [0.0, 0.02, -0.08] }, palm: "up", dur: 0.45, at: { gap: 9, plus: 1.27 } }),
  sij({ do: "look", to: { prop: "wallet" }, dur: 0.3, at: { gap: 9, plus: 1.5 } }),
  sij({ do: "open", prop: "wallet", amount: 1, dur: 0.4, at: { gap: 9, plus: 1.75 } }),
  sij({ do: "reach", hand: "L", to: { prop: "card", off: [0.0, 0.01, 0.0] }, palm: "down", grip: 0.6, dur: 0.45, at: { gap: 9, plus: 1.9 } }),
  sij({ do: "take", prop: "card", hand: "L", grip: "keep", at: { gap: 9, plus: 2.4 } }),

  /* ---------------------------------------------------------- 9: by card? */
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 9, plus: -0.2 } }),
  sij({ do: "reach", hand: "L", to: { spot: "exchange", off: [-0.18, 0.05, -0.12] }, palm: "in", dur: 0.5, at: { line: 9, word: "Karte", plus: -0.45 } }),
  shr({ do: "look", to: { prop: "card" }, dur: 0.3, hold: 0.5, at: { line: 9, word: "Karte" } }),

  /* ---------------------------------------------------------- 10: from ten euros */
  shr({ do: "look", to: { spot: "sticker" }, dur: 0.35, at: { line: 10, word: "Ab", plus: -0.1 } }),
  shr({ do: "reach", hand: "L", to: { spot: "sticker", off: [0.02, 0.03, 0.05] }, palm: "down", grip: 0.9, point: 1, dur: 0.45, hold: 0.9, at: { line: 10, word: "Ab", plus: -0.1 } }),
  shr({ do: "look", to: { face: S }, dur: 0.35, at: { line: 10, word: "gern" } }),
  shr({ do: "shake", times: 2, dur: 0.7, at: { line: 10, word: "leider" } }),
  shr({ do: "brows", amount: 0.5, at: { line: 10, word: "darunter" } }),
  shr({ do: "smile", amount: 0.3, at: { line: 10, word: "leider" } }),
  shr({ do: "brows", amount: 0, at: { line: 10, end: true, plus: 0.3 } }),
  sij({ do: "look", to: { spot: "sticker" }, dur: 0.35, hold: 0.8, at: { line: 10, word: "zehn" } }),
  sij({ do: "nod", size: 0.5, at: { line: 10, word: "bar" } }),

  /* ---------------------------------------------------------- the card back, the coins out */
  sij({ do: "look", to: { prop: "wallet" }, dur: 0.3, at: { gap: 11, plus: 0.0 } }),
  sij({ do: "reach", hand: "L", to: { prop: "wallet", off: [0.0, 0.02, 0.0] }, palm: "down", dur: 0.45, at: { gap: 11, plus: 0.0 } }),
  sij({ do: "put", prop: "card", into: "wallet", off: [0.0, 0.0012, 0.012], at: { gap: 11, plus: 0.45 } }),
  sij({ do: "reach", hand: "L", to: { prop: "coins", off: [0.0, 0.01, 0.0] }, palm: "down", grip: 0.55, dur: 0.4, at: { gap: 11, plus: 0.55 } }),
  sij({ do: "take", prop: "coins", hand: "L", grip: "keep", at: { gap: 11, plus: 0.95 } }),
  sij({ do: "open", prop: "wallet", amount: 0, dur: 0.4, at: { gap: 11, plus: 1.05 } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { gap: 11, plus: 1.2 } }),

  /* ---------------------------------------------------------- 11: exact change */
  sij({ do: "smile", amount: 0.5, at: { line: 11, word: "Problem" } }),
  sij({ do: "look", to: { spot: "dish" }, dur: 0.3, at: { line: 11, word: "ich", plus: -0.1 } }),
  sij({ do: "lean", amount: 0.28, dur: 0.55, at: { line: 11, word: "ich", plus: -0.2 } }),
  sij({ do: "reach", hand: "L", to: { spot: "dish", off: [0.0, 0.05, 0.0] }, palm: "down", dur: 0.55, at: { line: 11, word: "ich", plus: -0.2 } }),
  sij({ do: "put", prop: "coins", spot: "dish", at: { line: 11, word: "passend", plus: -0.05 } }),
  room({ do: "sound", name: "coins", volume: 0.4, at: { line: 11, word: "passend", plus: -0.02 } }),
  sij({ do: "rest", hand: "L", at: { line: 11, word: "passend", plus: 0.05 } }),
  sij({ do: "lean", amount: 0, dur: 0.6, at: { line: 11, word: "passend", plus: 0.05 } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 11, end: true } }),
  shr({ do: "look", to: { spot: "dish" }, dur: 0.3, at: { line: 11, word: "habe" } }),
  shr({ do: "smile", amount: 0.5, at: { line: 11, word: "passend" } }),

  /* ---------------------------------------------------------- the till, and his things */
  shr({ do: "lean", amount: 0.3, dur: 0.55, at: { gap: 12, plus: 0.0 } }),
  shr({ do: "reach", hand: "R", to: { prop: "coins", off: [0.0, 0.01, 0.0] }, palm: "down", grip: 0.55, dur: 0.5, at: { gap: 12, plus: 0.0 } }),
  shr({ do: "take", prop: "coins", hand: "R", grip: "keep", at: { gap: 12, plus: 0.5 } }),
  shr({ do: "lean", amount: 0, dur: 0.5, at: { gap: 12, plus: 0.55 } }),
  room({ do: "room", name: "drawer", value: 1, dur: 0.3, at: { gap: 12, plus: 0.6 } }),
  room({ do: "sound", name: "till", volume: 0.4, at: { gap: 12, plus: 0.6 } }),
  shr({ do: "look", to: { spot: "tillDrawer" }, dur: 0.3, at: { gap: 12, plus: 0.6 } }),
  shr({ do: "reach", hand: "R", to: { spot: "tillDrawer", off: [0.0, 0.08, -0.14] }, palm: "down", dur: 0.5, at: { gap: 12, plus: 0.6 } }),
  shr({ do: "put", prop: "coins", spot: "tillDrawer", at: { gap: 12, plus: 1.1 } }),
  room({ do: "room", name: "drawer", value: 0, dur: 0.3, at: { gap: 12, plus: 1.3 } }),
  room({ do: "display", text: "Danke!", at: { gap: 12, plus: 1.3 } }),
  shr({ do: "look", to: { prop: "bag" }, dur: 0.3, at: { gap: 12, plus: 1.3 } }),
  shr({ do: "lean", amount: 0.25, dur: 0.5, at: { gap: 12, plus: 1.35 } }),
  shr({ do: "reach", hand: "R", to: { prop: "bag", off: [0, 0.13, 0] }, palm: "in", grip: 0.8, dur: 0.45, at: { gap: 12, plus: 1.35 } }),
  shr({ do: "take", prop: "bag", hand: "R", grip: "keep", at: { gap: 12, plus: 1.8 } }),
  shr({ do: "reach", hand: "R", to: { spot: "bagOut", off: [0.1, 0.25, -0.05] }, palm: "in", arc: 0.0, dur: 0.6, at: { gap: 12, plus: 1.85 } }),
  shr({ do: "put", prop: "bag", spot: "bagOut", at: { gap: 12, plus: 2.45 } }),
  shr({ do: "reach", hand: "R", to: { prop: "box", off: [0.0, 0.05, 0.0] }, palm: "down", grip: 0.5, dur: 0.45, at: { gap: 12, plus: 2.5 } }),
  shr({ do: "take", prop: "box", hand: "R", grip: "keep", at: { gap: 12, plus: 2.95 } }),
  shr({ do: "reach", hand: "R", to: { spot: "boxOut", off: [0.1, 0.1, 0.0] }, palm: "down", arc: 0.0, dur: 0.55, at: { gap: 12, plus: 3.0 } }),
  shr({ do: "put", prop: "box", spot: "boxOut", at: { gap: 12, plus: 3.55 } }),
  shr({ do: "rest", hand: "R", at: { gap: 12, plus: 3.6 } }),
  shr({ do: "lean", amount: 0, dur: 0.5, at: { gap: 12, plus: 3.6 } }),
  shr({ do: "look", to: { face: S }, dur: 0.35, at: { gap: 12, plus: 3.6 } }),
  /* he puts the wallet away meanwhile */
  sij({ do: "look", to: { hand: "Sijan.R" }, dur: 0.3, at: { gap: 12, plus: 0.2 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.4, at: { gap: 12, plus: 0.2 } }),
  sij({ do: "jacket", open: 1, at: { gap: 12, plus: 0.3 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketIn" }, dur: 0.35, at: { gap: 12, plus: 0.65 } }),
  sij({ do: "stow", prop: "wallet", into: S, at: { gap: 12, plus: 0.95 } }),
  sij({ do: "reach", hand: "R", to: { body: "pocketOut" }, dur: 0.3, grip: 0.2, at: { gap: 12, plus: 1.05 } }),
  sij({ do: "jacket", open: 0, dur: 0.4, at: { gap: 12, plus: 1.35 } }),
  sij({ do: "rest", hand: "R", at: { gap: 12, plus: 1.4 } }),
  sij({ do: "look", to: { prop: "bag" }, dur: 0.4, at: { gap: 12, plus: 1.6 } }),

  /* ---------------------------------------------------------- 12: thank you, and out */
  shr({ do: "smile", amount: 0.65, at: { line: 12, word: "Vielen" } }),
  shr({ do: "nod", size: 0.6, at: { line: 12, word: "Dank" } }),
  sij({ do: "lean", amount: 0.2, dur: 0.5, at: { line: 12, word: "Vielen" } }),
  sij({ do: "reach", hand: "R", to: { prop: "bag", off: [0, 0.13, 0] }, palm: "in", grip: 0.85, dur: 0.5, at: { line: 12, word: "Vielen" } }),
  sij({ do: "take", prop: "bag", hand: "R", grip: "carry", at: { line: 12, word: "Dank", plus: 0.15 } }),
  sij({ do: "rest", hand: "R", dur: 0.7, at: { line: 12, word: "Dank", plus: 0.2 } }),
  sij({ do: "look", to: { prop: "box" }, dur: 0.3, at: { line: 12, word: "und" } }),
  sij({ do: "reach", hand: "L", to: { prop: "box", off: [0, -0.03, 0] }, palm: "up", grip: 0.4, dur: 0.5, at: { line: 12, word: "und" } }),
  sij({ do: "take", prop: "box", hand: "L", grip: "carry", at: { line: 12, word: "schönen" } }),
  sij({ do: "reach", hand: "L", to: { body: "present", off: [-0.08, -0.06, 0.02] }, palm: "up", dur: 0.55, at: { line: 12, word: "schönen", plus: 0.05 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 12, word: "schönen" } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 12, word: "Tag" } }),
  sij({ do: "smile", amount: 0.6, at: { line: 12, word: "Tag" } }),
  sij({ do: "nod", size: 0.8, at: { line: 12, end: true, plus: 0.3 } }),
  sij({ do: "walk", path: [[-1.7, 0.75], [-3.8, 1.1]], at: { line: 12, end: true, plus: 1.1 } }),
  room({ do: "sound", name: "bell", volume: 0.35, at: { line: 12, end: true, plus: 3.3 } }),
  shr({ do: "look", to: { hand: "Sijan.R" }, dur: 0.6, at: { line: 12, end: true, plus: 1.6 } }),
  shr({ do: "look", to: { spot: "roll1" }, dur: 0.6, at: { line: 12, end: true, plus: 3.4 } }),
  shr({ do: "smile", amount: 0.2, at: { line: 12, end: true, plus: 3.4 } }),
  shr({ do: "step", to: [0.47, 0.02], dur: 0.7, at: { line: 12, end: true, plus: 3.6 } }),
  shr({ do: "lean", amount: 0.22, dur: 0.6, at: { line: 12, end: true, plus: 4.1 } }),
  shr({ do: "reach", hand: "R", to: { spot: "roll1", off: [0.0, 0.06, -0.1] }, palm: "down", grip: 0.4, dur: 0.7, at: { line: 12, end: true, plus: 4.2 } })
];

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

/* A side-on master across the counter, like the Bürgerbüro's across the desk. */
const MASTER = { pos: [-0.22, 1.5, 3.45], look: [-0.05, 1.1, -0.2], fov: 32 } as const;
const master = (at: Shot3D["at"], extra: Partial<Shot3D> = {}): Shot3D => ({
  at, pos: [...MASTER.pos], look: [...MASTER.look], fov: MASTER.fov, ...extra
});

const shots: Shot3D[] = [
  /* The camera moves only when it has to (the user's direction, 2026-09-24):
     the shop as he comes in, a glide into the master, the master for the
     whole sale (the case, the shelves and the slicer are all in it), and a
     pan as he leaves. */
  { at: { t: 0 }, pos: [-1.5, 1.62, 4.5], look: [-0.35, 1.1, -0.55], fov: 40, to: { pos: [-1.25, 1.58, 4.2] } },
  master({ gap: 0, plus: 2.9 }, { glide: 1.6 }),
  { at: { line: 12, end: true, plus: 1.4 }, pos: [-1.4, 1.6, 4.4], look: [-1.3, 1.1, -0.2], fov: 38, glide: 1.6, track: S, follow: 0.45 }
];

/* ------------------------------------------------------------------ */

export const c018Acted: Acted = {
  set: "baeckerei",
  cast: {
    /* the same two people as in c010, dressed the same */
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
      start: { x: -3.6, z: 1.0, yaw: 0 }
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
      start: { x: 0.47, z: 0.02, yaw: Math.PI }
    }
  },
  /* seconds of silence before each line, for the business that takes longer
     to do than to say; see the synopsis at the top */
  gaps: { 0: 4.4, 2: 4.6, 4: 4.8, 8: 4.9, 9: 2.6, 11: 1.4, 12: 3.3 },
  /* long enough for him to be out of the door before the Wortschatz card */
  tail: 6.0,
  props: {
    bag: { kind: "bag", start: { spot: "bagPack" } },
    roll1: { kind: "roll", start: { spot: "roll1" } },
    roll2: { kind: "roll", start: { spot: "roll2" } },
    loaf: { kind: "loaf", start: { spot: "loafShelf" } },
    slice1: { kind: "slice", start: { spot: "slice1" } },
    slice2: { kind: "slice", start: { spot: "slice2" } },
    box: { kind: "box", start: { spot: "boxStart" } },
    wallet: { kind: "wallet", start: { pocket: S } },
    card: { kind: "card", start: { inside: "wallet", off: [0.0, 0.0012, 0.012] } },
    coins: { kind: "coins", start: { inside: "wallet", off: [0.0, 0.0045, -0.022] } }
  },
  beats,
  shots,
  /* Rings on real things, each on the line that names it. */
  callouts: {
    1: { at: "rolls", label: "die Brötchen", word: "Brötchen", size: [0.14, 0.07] },
    5: { at: "cake", label: "der Käsekuchen", word: "Käsekuchen", size: [0.12, 0.07] },
    8: { at: "till", label: "8,20 €", word: "zwanzig", size: [0.09, 0.055] },
    9: { at: "card", label: "mit Karte zahlen", word: "Karte", size: [0.06, 0.045] },
    11: { at: "coins", label: "passend", word: "passend", size: [0.06, 0.045] }
  }
};
