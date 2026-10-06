/*
 * c003 acted — "Ein Tisch für zwei": an evening out, in the restaurant set
 * (acted/sets/restaurant.tsx).
 *
 * Three people: Shruti and Sijan, and the waiter, who never speaks (the
 * dialogue has no lines for him) but is who "haben Sie noch einen Tisch
 * frei?" is said to. He is the cast's third model, kellner.glb.
 *
 * What happens:
 *
 *   0-2   They come in off the street. The waiter meets them at his stand:
 *         a table for two, not booked, the one by the window. He takes two
 *         menus and leads them over; they sit.
 *   3     He lays a menu at each place. Sijan opens his: it is in English too.
 *   4-5   They order, to him, standing behind the table; he nods each dish
 *         in, collects the menus and goes to the kitchen.
 *   6-7   Alone: a beer? No, water, he's driving — he lifts his glass.
 *   8     The waiter is back already with the soup and the pasta.
 *   9-10  They eat. Is there room for dessert?
 *   11-12 He's full; she orders an ice cream and the bill, to the waiter,
 *         who has come back over. He nods, and clears the plates.
 *
 * The camera: a wide of the room for the arrival, a glide to the table's
 * master once they are sat, and the master from then on.
 */

import type { Acted, Beat, Shot3D, Vec3 } from "../acted/types";

const S = "Sijan";
const R = "Shruti";
const K = "Kellner";

type Verb = Beat extends infer B ? (B extends Beat ? Omit<B, "who"> : never) : never;
const sij = (b: Verb): Beat => ({ ...b, who: S }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: R }) as Beat;
const kel = (b: Verb): Beat => ({ ...b, who: K }) as Beat;
const room = (b: Verb): Beat => ({ ...b, who: R }) as Beat;

/* where people stand */
const SHRUTI_IN: [number, number] = [-2.95, -1.4];
const SIJAN_IN: [number, number] = [-2.35, -0.86];
const KELLNER_STAND: [number, number] = [-1.85, -1.45];
/* behind the window table, facing the camera, where he serves from */
const SERVE: [number, number] = [0, -1.9];
/* at the pass in the kitchen, behind the wall */
const PASS: [number, number] = [2.9, -2.72];
/* behind the bar, out of the master, waiting */
const BAR: [number, number] = [3.5, -1.86];
const FACE_CAMERA = -Math.PI / 2;

/* cues used a lot: the ends of lines 2, 5 and 12 */
const L2E = { line: 2, end: true };
const L5E = { line: 5, end: true };
const L12E = { line: 12, end: true };
const plus = (c: { line: number; end: boolean }, s: number) => ({ ...c, plus: s });

const beats: Beat[] = [
  /* ---------------------------------------------------------- arrival */
  kel({ do: "look", to: { world: [-3.6, 1.5, -2.3] }, dur: 0.1, at: { t: 0 } }),
  room({ do: "room", name: "door", value: 1, dur: 0.9, at: { t: 0.2 } }),
  room({ do: "sound", name: "bell", volume: 0.5, at: { t: 0.25 } }),
  shr({ do: "walk", path: [[-3.6, -2.05], [-3.3, -1.6], SHRUTI_IN], face: -0.2, at: { t: 0.5 } }),
  sij({ do: "walk", path: [[-3.6, -2.05], [-3.5, -1.3], [-3.0, -0.92], SIJAN_IN], face: -0.35, at: { t: 1.25 } }),
  kel({ do: "look", to: { face: R }, dur: 0.5, at: { t: 1.6 } }),
  kel({ do: "smile", amount: 0.5, at: { t: 2.2 } }),
  kel({ do: "nod", size: 0.6, at: { line: 0, plus: -1.0 } }),
  room({ do: "room", name: "door", value: 0, dur: 1.2, at: { t: 4.4 } }),
  shr({ do: "look", to: { face: K }, dur: 0.5, at: { t: 3.4 } }),
  sij({ do: "look", to: { face: K }, dur: 0.5, at: { t: 4.3 } }),
  shr({ do: "smile", amount: 0.45, at: { line: 0, word: "Guten" } }),

  /* ---------------------------------------------------------- 0-2: a table for two */
  kel({ do: "look", to: { face: S }, dur: 0.4, at: { line: 1, plus: 0.1 } }),
  kel({ do: "nod", size: 0.5, at: { line: 1, word: "reserviert" } }),
  sij({ do: "smile", amount: 0.35, at: { line: 1, word: "zweit" } }),
  /* the menus, while Sijan explains */
  kel({ do: "look", to: { spot: "menuStand" }, dur: 0.4, hold: 0.8, at: { line: 1, end: true, plus: -0.3 } }),
  kel({ do: "reach", hand: "R", to: { prop: "menuA", off: [0, 0.01, 0] }, palm: "down", grip: 0.7, dur: 0.6, at: { line: 1, end: true, plus: -0.3 } }),
  kel({ do: "take", prop: "menuA", hand: "R", grip: "carry", at: { line: 1, end: true, plus: 0.32 } }),
  kel({ do: "reach", hand: "R", to: { body: "carry", off: [0.12, 0.2, 0] }, palm: "in", dur: 0.6, at: { line: 1, end: true, plus: 0.4 } }),
  /* "the one by the window": she looks, then points it out */
  shr({ do: "look", to: { world: [-0.8, 1.4, -2.3] }, dur: 0.45, at: { line: 2, word: "Tisch", plus: -0.1 } }),
  shr({ do: "reach", hand: "R", to: { body: "present", off: [0.1, 0.12, 0.05] }, palm: "forward", point: 1, dur: 0.5, hold: 0.7, at: { line: 2, word: "Fenster", plus: -0.25 } }),
  shr({ do: "look", to: { face: K }, dur: 0.4, at: { line: 2, word: "schön", plus: -0.1 } }),
  kel({ do: "look", to: { world: [-0.3, 1.1, -1.3] }, dur: 0.4, at: { line: 2, word: "Fenster" } }),
  kel({ do: "look", to: { face: R }, dur: 0.4, at: { line: 2, word: "schön" } }),
  kel({ do: "nod", size: 0.8, at: { line: 2, word: "schön", plus: 0.1 } }),
  kel({ do: "gesture", hand: "L", kind: "offer", toward: { world: [-1.2, 1.05, -1.1] }, dur: 1.0, at: plus(L2E, -0.7) }),

  /* ---------------------------------------------------------- to the table */
  kel({ do: "look", to: { ahead: true }, dur: 0.4, at: plus(L2E, 0.2) }),
  kel({ id: "kToTable", do: "walk", path: [[-1.35, -1.85], [-0.6, -1.95], SERVE], face: FACE_CAMERA, speed: 1.2, at: plus(L2E, 0.35) }),
  shr({ do: "smile", amount: 0.3, at: plus(L2E, 0.2) }),
  shr({ do: "look", to: { ahead: true }, dur: 0.4, at: plus(L2E, 0.5) }),
  shr({ id: "rWalk", do: "walk", path: [[-2.1, -0.97], [-1.1, -0.82], [-0.68, -0.95], [-0.65, -1.2]], face: -0.3, at: plus(L2E, 0.55) }),
  sij({ do: "look", to: { ahead: true }, dur: 0.4, at: plus(L2E, 0.15) }),
  sij({ id: "sWalk", do: "walk", path: [[-1.2, -0.52], [0.3, -0.55], [0.7, -0.85], [0.65, -1.2]], face: Math.PI + 0.3, speed: 1.35, at: plus(L2E, 0.25) }),
  shr({ id: "rSit", do: "sit", chair: "shruti", at: { after: "rWalk", plus: 0.05 } }),
  shr({ do: "scoot", chair: "shruti", by: 0.26, at: { after: "rSit", plus: 0.05 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { after: "rWalk", plus: 0.3 } }),
  sij({ id: "sSit", do: "sit", chair: "sijan", at: { after: "sWalk", plus: 0.05 } }),
  sij({ do: "scoot", chair: "sijan", by: 0.26, at: { after: "sSit", plus: 0.05 } }),

  /* he lays a menu at each place, hers with the right hand, his with the left */
  kel({ do: "reach", hand: "R", to: { body: "present", off: [-0.06, -0.06, 0.02] }, palm: "up", dur: 0.6, at: { after: "kToTable", plus: -1.4 } }),
  kel({ do: "look", to: { prop: "menuA" }, dur: 0.4, at: { after: "kToTable", plus: -0.8 } }),
  kel({ do: "reach", hand: "L", to: { prop: "menuB", off: [0, 0.01, 0] }, palm: "down", grip: 0.7, dur: 0.55, at: { after: "kToTable", plus: -0.75 } }),
  kel({ do: "take", prop: "menuB", hand: "L", grip: "keep", at: { after: "kToTable", plus: -0.18 } }),
  kel({ do: "lean", amount: 0.4, dur: 0.7, at: { after: "kToTable", plus: 0.0 } }),
  kel({ do: "look", to: { spot: "menuShruti" }, dur: 0.4, at: { after: "kToTable", plus: 0.0 } }),
  kel({ do: "reach", hand: "R", to: { spot: "menuShruti", off: [0, 0.02, -0.1] }, palm: "down", dur: 0.7, at: { after: "kToTable", plus: 0.0 } }),
  kel({ do: "put", prop: "menuA", spot: "menuShruti", blend: 8, at: { after: "kToTable", plus: 0.7 } }),
  kel({ do: "rest", hand: "R", at: { after: "kToTable", plus: 0.75 } }),
  kel({ do: "look", to: { spot: "menuSijan" }, dur: 0.4, at: { after: "kToTable", plus: 0.6 } }),
  kel({ do: "reach", hand: "L", to: { spot: "menuSijan", off: [0, 0.02, -0.1] }, palm: "down", dur: 0.7, at: { after: "kToTable", plus: 0.45 } }),
  kel({ do: "put", prop: "menuB", spot: "menuSijan", blend: 8, at: { after: "kToTable", plus: 1.15 } }),
  kel({ do: "rest", hand: "L", at: { after: "kToTable", plus: 1.2 } }),
  kel({ do: "lean", amount: 0, dur: 0.7, at: { after: "kToTable", plus: 1.2 } }),
  kel({ do: "look", to: { face: S }, dur: 0.4, at: { after: "kToTable", plus: 1.3 } }),

  /* ---------------------------------------------------------- 3: the menu */
  sij({ do: "look", to: { prop: "menuB" }, dur: 0.4, at: { after: "sSit", plus: -0.3 } }),
  sij({ do: "lean", amount: 0.28, dur: 0.6, at: { after: "sSit", plus: -0.15 } }),
  sij({ do: "reach", hand: "R", to: { prop: "menuB", off: [0.05, 0.01, 0] }, palm: "down", grip: 0.7, dur: 0.6, at: { after: "sSit", plus: -0.15 } }),
  sij({ do: "take", prop: "menuB", hand: "R", grip: "carry", at: { after: "sSit", plus: 0.47 } }),
  sij({ do: "lean", amount: 0, dur: 0.6, at: { after: "sSit", plus: 0.55 } }),
  sij({ do: "reach", hand: "R", to: { body: "read" }, palm: "up", dur: 0.6, at: { after: "sSit", plus: 0.55 } }),
  sij({ do: "open", prop: "menuB", amount: 1, dur: 0.6, at: { line: 3, word: "Speisekarte", plus: -0.1 } }),
  sij({ do: "reach", hand: "L", to: { prop: "menuB", off: [0.05, 0.01, -0.3] }, palm: "down", grip: 0.4, dur: 0.5, at: { line: 3, word: "Speisekarte", plus: 0.45 } }),
  sij({ do: "smile", amount: 0.5, at: { line: 3, word: "Glück" } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 3, word: "Englisch", plus: -0.2 } }),
  shr({ do: "smile", amount: 0.5, at: { line: 3, word: "Englisch" } }),
  shr({ do: "nod", size: 0.5, at: { line: 3, end: true, plus: -0.2 } }),
  /* she takes hers up too */
  shr({ do: "look", to: { prop: "menuA" }, dur: 0.4, at: { line: 3, end: true } }),
  shr({ do: "lean", amount: 0.28, dur: 0.6, at: { line: 3, end: true } }),
  shr({ do: "reach", hand: "L", to: { prop: "menuA", off: [0.05, 0.01, 0] }, palm: "down", grip: 0.7, dur: 0.6, at: { line: 3, end: true } }),
  shr({ do: "take", prop: "menuA", hand: "L", grip: "carry", at: { line: 3, end: true, plus: 0.62 } }),
  shr({ do: "lean", amount: 0, dur: 0.6, at: { line: 3, end: true, plus: 0.7 } }),
  shr({ do: "reach", hand: "L", to: { body: "read" }, palm: "up", dur: 0.6, at: { line: 3, end: true, plus: 0.7 } }),
  shr({ do: "open", prop: "menuA", amount: 1, dur: 0.6, at: { line: 3, end: true, plus: 1.1 } }),
  kel({ do: "look", to: { face: R }, dur: 0.4, at: { line: 3, end: true, plus: 0.5 } }),

  /* ---------------------------------------------------------- 4-5: ordering */
  shr({ do: "look", to: { face: K }, dur: 0.45, at: { line: 4, plus: -0.3 } }),
  shr({ do: "smile", amount: 0.35, at: { line: 4 } }),
  kel({ do: "nod", size: 0.5, at: { line: 4, word: "Gemüsesuppe", plus: 0.3 } }),
  kel({ do: "nod", size: 0.6, at: { line: 4, end: true, plus: -0.1 } }),
  kel({ do: "look", to: { face: S }, dur: 0.4, at: { line: 5, plus: -0.25 } }),
  sij({ do: "look", to: { face: K }, dur: 0.45, at: { line: 5, plus: -0.3 } }),
  kel({ do: "nod", size: 0.6, at: { line: 5, word: "Tomatensoße", plus: 0.2 } }),
  /* the menus shut and laid down; he collects them */
  sij({ do: "open", prop: "menuB", amount: 0, dur: 0.5, at: plus(L5E, -0.3) }),
  sij({ do: "rest", hand: "L", at: plus(L5E, -0.3) }),
  sij({ do: "lean", amount: 0.25, dur: 0.6, at: plus(L5E, 0.2) }),
  sij({ do: "reach", hand: "R", to: { spot: "menuSijan", off: [0.1, 0.03, 0] }, palm: "up", dur: 0.6, at: plus(L5E, 0.2) }),
  sij({ do: "put", prop: "menuB", spot: "menuSijan", blend: 8, at: plus(L5E, 0.8) }),
  sij({ do: "rest", hand: "R", dur: 0.7, at: plus(L5E, 0.85) }),
  sij({ do: "lean", amount: 0, dur: 0.6, at: plus(L5E, 1.3) }),
  shr({ do: "open", prop: "menuA", amount: 0, dur: 0.5, at: plus(L5E, -0.1) }),
  shr({ do: "lean", amount: 0.25, dur: 0.6, at: plus(L5E, 0.4) }),
  shr({ do: "reach", hand: "L", to: { spot: "menuShruti", off: [-0.1, 0.03, 0] }, palm: "up", dur: 0.6, at: plus(L5E, 0.4) }),
  shr({ do: "put", prop: "menuA", spot: "menuShruti", blend: 8, at: plus(L5E, 1.0) }),
  shr({ do: "rest", hand: "L", dur: 0.7, at: plus(L5E, 1.05) }),
  shr({ do: "lean", amount: 0, dur: 0.6, at: plus(L5E, 1.5) }),
  kel({ do: "look", to: { spot: "menuShruti" }, dur: 0.4, at: plus(L5E, 1.05) }),
  kel({ do: "lean", amount: 0.4, dur: 0.6, at: plus(L5E, 1.1) }),
  kel({ do: "reach", hand: "R", to: { prop: "menuA", off: [0, 0.01, -0.08] }, palm: "down", grip: 0.7, dur: 0.6, at: plus(L5E, 1.1) }),
  kel({ do: "take", prop: "menuA", hand: "R", grip: "keep", at: plus(L5E, 1.72) }),
  kel({ do: "look", to: { spot: "menuSijan" }, dur: 0.4, at: plus(L5E, 1.6) }),
  kel({ do: "reach", hand: "L", to: { prop: "menuB", off: [0, 0.01, 0.08] }, palm: "down", grip: 0.7, dur: 0.6, at: plus(L5E, 1.6) }),
  kel({ do: "take", prop: "menuB", hand: "L", grip: "keep", at: plus(L5E, 2.22) }),
  kel({ do: "lean", amount: 0, dur: 0.6, at: plus(L5E, 2.3) }),
  /* stack them and carry them off */
  kel({ do: "reach", hand: "R", to: { body: "present", off: [-0.06, -0.06, 0.02] }, palm: "down", dur: 0.6, at: plus(L5E, 2.3) }),
  kel({ do: "reach", hand: "L", to: { prop: "menuA", off: [0, 0.03, 0] }, palm: "down", dur: 0.55, at: plus(L5E, 2.4) }),
  kel({ do: "put", prop: "menuB", into: "menuA", off: [0, 0.012, 0], blend: 8, at: plus(L5E, 2.97) }),
  kel({ do: "rest", hand: "L", at: plus(L5E, 3.02) }),
  kel({ do: "look", to: { ahead: true }, dur: 0.4, at: plus(L5E, 3.0) }),
  kel({ do: "turn", yaw: 0, dur: 0.6, at: plus(L5E, 3.05) }),
  kel({ id: "kToKitchen", do: "walk", path: [[1.0, -1.95], [1.75, -2.0], [2.05, -2.6], PASS], face: Math.PI / 2, speed: 1.35, at: plus(L5E, 3.7) }),
  room({ do: "room", name: "kitchen", value: 0.9, dur: 0.5, at: plus(L5E, 4.7) }),
  room({ do: "room", name: "kitchen", value: 0.15, dur: 0.9, at: { after: "kToKitchen", plus: 0.2 } }),

  /* ---------------------------------------------------------- the waiter, in the kitchen */
  kel({ do: "put", prop: "menuA", spot: "kitchenMenus", blend: 6, at: { after: "kToKitchen", plus: 0.1 } }),
  kel({ do: "rest", hand: "R", at: { after: "kToKitchen", plus: 0.1 } }),
  kel({ do: "lean", amount: 0.25, dur: 0.4, at: { after: "kToKitchen", plus: 0.15 } }),
  kel({ do: "reach", hand: "R", to: { prop: "soup", off: [-0.1, 0.0, 0] }, palm: "up", grip: 0.5, dur: 0.5, at: { after: "kToKitchen", plus: 0.2 } }),
  kel({ do: "reach", hand: "L", to: { prop: "pasta", off: [-0.1, 0.0, 0] }, palm: "up", grip: 0.5, dur: 0.5, at: { after: "kToKitchen", plus: 0.2 } }),
  kel({ do: "take", prop: "soup", hand: "R", grip: "carry", at: { after: "kToKitchen", plus: 0.72 } }),
  kel({ do: "take", prop: "pasta", hand: "L", grip: "carry", at: { after: "kToKitchen", plus: 0.72 } }),
  kel({ do: "lean", amount: 0, dur: 0.4, at: { after: "kToKitchen", plus: 0.75 } }),
  kel({ do: "reach", hand: "R", to: { body: "present", off: [0.02, -0.05, 0.08] }, palm: "up", dur: 0.5, at: { after: "kToKitchen", plus: 0.75 } }),
  kel({ do: "reach", hand: "L", to: { body: "present", off: [0.02, -0.05, 0.08] }, palm: "up", dur: 0.5, at: { after: "kToKitchen", plus: 0.75 } }),
  kel({ do: "turn", yaw: -2.6, dur: 0.8, at: { after: "kToKitchen", plus: 1.3 } }),
  room({ do: "room", name: "kitchen", value: 0.9, dur: 0.5, at: { after: "kToKitchen", plus: 1.8 } }),
  kel({ id: "kBack", do: "walk", path: [[2.1, -2.3], [1.4, -1.97], [0.6, -1.97], SERVE], face: FACE_CAMERA, speed: 1.35, at: { after: "kToKitchen", plus: 2.1 } }),
  room({ do: "room", name: "kitchen", value: 0.15, dur: 0.9, at: { after: "kBack", plus: -0.4 } }),

  /* ---------------------------------------------------------- 6-7: a beer? water */
  shr({ do: "look", to: { face: S }, dur: 0.4, at: plus(L5E, 2.0) }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: plus(L5E, 1.4) }),
  shr({ do: "smile", amount: 0.55, at: { line: 6 } }),
  sij({ do: "shake", times: 2, at: { line: 7, word: "Nein" } }),
  sij({ do: "look", to: { prop: "glassS" }, dur: 0.35, at: { line: 7, word: "heute", plus: -0.3 } }),
  sij({ do: "lean", amount: 0.25, dur: 0.5, at: { line: 7, word: "heute", plus: -0.3 } }),
  sij({ do: "reach", hand: "R", to: { prop: "glassS" }, palm: "in", grip: 0.8, dur: 0.55, at: { line: 7, word: "heute", plus: -0.3 } }),
  sij({ do: "take", prop: "glassS", hand: "R", grip: "carry", at: { line: 7, word: "heute", plus: 0.27 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 7, word: "heute", plus: 0.3 } }),
  sij({ do: "reach", hand: "R", to: { body: "present", off: [-0.08, 0.02, -0.02] }, palm: "in", dur: 0.5, at: { line: 7, word: "heute", plus: 0.3 } }),
  sij({ do: "look", to: { face: R }, dur: 0.35, at: { line: 7, word: "Ich" } }),
  sij({ do: "smile", amount: 0.45, at: { line: 7, word: "fahre" } }),
  shr({ do: "nod", size: 0.6, at: { line: 7, word: "fahre", plus: 0.2 } }),
  /* a sip, and the glass back down */
  sij({ do: "reach", hand: "R", to: { body: "drink" }, palm: "in", dur: 0.6, at: { line: 7, end: true, plus: 0.1 } }),
  sij({ do: "look", to: { ahead: true }, dur: 0.3, at: { line: 7, end: true, plus: 0.3 } }),
  sij({ do: "lean", amount: 0.2, dur: 0.5, at: { line: 7, end: true, plus: 1.2 } }),
  sij({ do: "reach", hand: "R", to: { spot: "glassSijan", off: [0, 0.055, 0.0] }, palm: "in", dur: 0.7, at: { line: 7, end: true, plus: 1.2 } }),
  sij({ do: "put", prop: "glassS", spot: "glassSijan", blend: 6, at: { line: 7, end: true, plus: 1.9 } }),
  sij({ do: "rest", hand: "R", at: { line: 7, end: true, plus: 1.95 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 7, end: true, plus: 1.95 } }),

  /* ---------------------------------------------------------- 8: the food */
  shr({ do: "look", to: { face: K }, dur: 0.45, at: { after: "kBack", plus: -1.2 } }),
  sij({ do: "look", to: { face: K }, dur: 0.45, at: { after: "kBack", plus: -1.0 } }),
  kel({ do: "look", to: { spot: "placeShruti" }, dur: 0.4, at: { after: "kBack", plus: 0.05 } }),
  kel({ do: "lean", amount: 0.45, dur: 0.7, at: { after: "kBack", plus: 0.05 } }),
  kel({ do: "reach", hand: "R", to: { spot: "placeShruti", off: [0, 0.04, -0.1] }, palm: "up", dur: 0.7, at: { after: "kBack", plus: 0.05 } }),
  kel({ do: "put", prop: "soup", spot: "placeShruti", blend: 8, at: { after: "kBack", plus: 0.75 } }),
  kel({ do: "rest", hand: "R", at: { after: "kBack", plus: 0.82 } }),
  kel({ do: "look", to: { spot: "placeSijan" }, dur: 0.4, at: { after: "kBack", plus: 0.8 } }),
  kel({ do: "reach", hand: "L", to: { spot: "placeSijan", off: [0, 0.04, -0.1] }, palm: "up", dur: 0.7, at: { after: "kBack", plus: 0.8 } }),
  kel({ do: "put", prop: "pasta", spot: "placeSijan", blend: 8, at: { after: "kBack", plus: 1.5 } }),
  kel({ do: "rest", hand: "L", at: { after: "kBack", plus: 1.57 } }),
  kel({ do: "lean", amount: 0, dur: 0.7, at: { after: "kBack", plus: 1.57 } }),
  shr({ do: "look", to: { prop: "soup" }, dur: 0.4, at: { after: "kBack", plus: 0.7 } }),
  shr({ do: "smile", amount: 0.6, at: { line: 8 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 8, word: "schnell" } }),
  kel({ do: "look", to: { face: R }, dur: 0.4, at: { line: 8, plus: 0.2 } }),
  kel({ do: "smile", amount: 0.6, at: { line: 8, word: "schnell" } }),
  kel({ do: "nod", size: 0.6, at: { line: 8, end: true } }),
  /* back to the bar */
  kel({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 8, end: true, plus: 0.6 } }),
  kel({ do: "turn", yaw: 0, dur: 0.6, at: { line: 8, end: true, plus: 0.7 } }),
  kel({ do: "walk", path: [[1.2, -1.95], [2.6, -1.88], BAR], face: FACE_CAMERA, at: { line: 8, end: true, plus: 1.3 } }),

  /* ---------------------------------------------------------- 9-10: eating */
  sij({ do: "look", to: { prop: "pasta" }, dur: 0.4, at: { line: 8, end: true, plus: 0.2 } }),
  sij({ do: "lean", amount: 0.22, dur: 0.5, at: { line: 8, end: true, plus: 0.3 } }),
  sij({ do: "reach", hand: "R", to: { prop: "fork", off: [-0.04, 0.01, 0] }, palm: "down", grip: 0.75, dur: 0.6, at: { line: 8, end: true, plus: 0.3 } }),
  sij({ do: "take", prop: "fork", hand: "R", grip: "carry", at: { line: 8, end: true, plus: 0.92 } }),
  sij({ do: "reach", hand: "R", to: { prop: "pasta", off: [0.03, 0.05, 0.02] }, palm: "down", dur: 0.55, at: { line: 8, end: true, plus: 1.0 } }),
  sij({ do: "open", prop: "pasta", amount: 0.25, dur: 2.4, at: { line: 8, end: true, plus: 1.4 } }),
  sij({ do: "lean", amount: 0.1, dur: 0.5, at: { line: 8, end: true, plus: 1.6 } }),
  sij({ do: "reach", hand: "R", to: { body: "drink", off: [0.02, -0.02, -0.04] }, palm: "in", dur: 0.55, at: { line: 8, end: true, plus: 1.6 } }),
  sij({ do: "reach", hand: "R", to: { prop: "pasta", off: [0.03, 0.06, 0.02] }, palm: "down", dur: 0.6, at: { line: 8, end: true, plus: 2.5 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 9, plus: -0.2 } }),
  sij({ do: "smile", amount: 0.6, at: { line: 9, word: "schmeckt" } }),
  sij({ do: "nod", size: 0.6, at: { line: 9, word: "wirklich" } }),
  /* her soup */
  shr({ do: "look", to: { prop: "soup" }, dur: 0.4, at: { line: 8, end: true, plus: 0.5 } }),
  shr({ do: "lean", amount: 0.25, dur: 0.5, at: { line: 8, end: true, plus: 0.6 } }),
  shr({ do: "reach", hand: "R", to: { prop: "spoon", off: [-0.04, 0.01, 0] }, palm: "down", grip: 0.75, dur: 0.6, at: { line: 8, end: true, plus: 0.6 } }),
  shr({ do: "take", prop: "spoon", hand: "R", grip: "carry", at: { line: 8, end: true, plus: 1.22 } }),
  shr({ do: "reach", hand: "R", to: { prop: "soup", off: [0, 0.06, 0.03] }, palm: "down", dur: 0.55, at: { line: 8, end: true, plus: 1.3 } }),
  shr({ do: "open", prop: "soup", amount: 0.3, dur: 3.0, at: { line: 8, end: true, plus: 1.8 } }),
  shr({ do: "lean", amount: 0.12, dur: 0.5, at: { line: 8, end: true, plus: 1.9 } }),
  shr({ do: "reach", hand: "R", to: { body: "drink", off: [0.02, -0.02, 0.04] }, palm: "in", dur: 0.55, at: { line: 8, end: true, plus: 1.9 } }),
  shr({ do: "lean", amount: 0.22, dur: 0.5, at: { line: 8, end: true, plus: 2.8 } }),
  shr({ do: "reach", hand: "R", to: { prop: "soup", off: [0, 0.06, 0.03] }, palm: "down", dur: 0.6, at: { line: 8, end: true, plus: 2.8 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 9, word: "schmeckt" } }),
  shr({ do: "nod", size: 0.5, at: { line: 9, end: true, plus: -0.1 } }),
  /* time passes over the plates */
  sij({ do: "look", to: { prop: "pasta" }, dur: 0.4, at: { line: 9, end: true, plus: 0.2 } }),
  sij({ do: "reach", hand: "R", to: { body: "drink", off: [0.02, -0.02, -0.04] }, palm: "in", dur: 0.55, at: { line: 9, end: true, plus: 0.3 } }),
  sij({ do: "open", prop: "pasta", amount: 0.92, dur: 1.4, at: { line: 9, end: true, plus: 0.3 } }),
  sij({ do: "reach", hand: "R", to: { prop: "pasta", off: [0.03, 0.06, 0.02] }, palm: "down", dur: 0.6, at: { line: 9, end: true, plus: 1.0 } }),
  shr({ do: "look", to: { prop: "soup" }, dur: 0.4, at: { line: 9, end: true, plus: 0.4 } }),
  shr({ do: "lean", amount: 0.12, dur: 0.5, at: { line: 9, end: true, plus: 0.5 } }),
  shr({ do: "reach", hand: "R", to: { body: "drink", off: [0.02, -0.02, 0.04] }, palm: "in", dur: 0.55, at: { line: 9, end: true, plus: 0.5 } }),
  shr({ do: "open", prop: "soup", amount: 0.95, dur: 1.4, at: { line: 9, end: true, plus: 0.5 } }),
  shr({ do: "lean", amount: 0.22, dur: 0.5, at: { line: 9, end: true, plus: 1.2 } }),
  shr({ do: "reach", hand: "R", to: { spot: "spoonDone", off: [-0.04, 0.02, 0] }, palm: "down", dur: 0.6, at: { line: 9, end: true, plus: 1.2 } }),
  shr({ do: "put", prop: "spoon", spot: "spoonDone", blend: 6, at: { line: 9, end: true, plus: 1.8 } }),
  shr({ do: "rest", hand: "R", at: { line: 9, end: true, plus: 1.85 } }),
  shr({ do: "lean", amount: 0, dur: 0.5, at: { line: 9, end: true, plus: 1.85 } }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: { line: 10, plus: -0.3 } }),
  sij({ do: "lean", amount: 0.2, dur: 0.5, at: { line: 10, plus: -0.3 } }),
  sij({ do: "reach", hand: "R", to: { spot: "forkDone", off: [-0.04, 0.02, 0] }, palm: "down", dur: 0.6, at: { line: 10, plus: -0.3 } }),
  sij({ do: "put", prop: "fork", spot: "forkDone", blend: 6, at: { line: 10, plus: 0.3 } }),
  sij({ do: "rest", hand: "R", at: { line: 10, plus: 0.35 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 10, plus: 0.35 } }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: { line: 10, word: "Nachtisch" } }),
  shr({ do: "smile", amount: 0.55, at: { line: 10, word: "Nachtisch" } }),

  /* ---------------------------------------------------------- 11-12: full; ice cream and the bill */
  sij({ do: "lean", amount: -0.12, dur: 0.8, at: { line: 11, plus: -0.2 } }),
  sij({ do: "reach", hand: "L", to: { body: "lap", off: [-0.12, 0.12, 0.06] }, palm: "back", dur: 0.6, at: { line: 11, plus: -0.2 } }),
  sij({ do: "smile", amount: 0.4, at: { line: 11, word: "satt" } }),
  sij({ do: "shake", times: 2, dur: 0.7, at: { line: 11, word: "satt", plus: 0.05 } }),
  sij({ do: "rest", hand: "L", at: { line: 11, word: "Aber" } }),
  sij({ do: "lean", amount: 0, dur: 0.6, at: { line: 11, word: "Aber" } }),
  sij({ do: "gesture", hand: "R", kind: "offer", toward: { world: [-0.45, 0.95, -1.25] }, at: { line: 11, word: "bestell" } }),
  sij({ do: "smile", amount: 0.6, at: { line: 11, word: "ruhig" } }),
  kel({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 10, end: true, plus: 0.2 } }),
  kel({ do: "turn", yaw: Math.PI, dur: 0.6, at: { line: 10, end: true, plus: 0.2 } }),
  kel({ do: "walk", path: [[2.6, -1.88], [1.2, -1.95], SERVE], face: FACE_CAMERA, speed: 1.2, at: { line: 10, end: true, plus: 0.8 } }),
  shr({ do: "look", to: { face: K }, dur: 0.5, at: { line: 12, plus: -0.4 } }),
  kel({ do: "look", to: { face: R }, dur: 0.4, at: { line: 12, plus: -0.3 } }),
  kel({ do: "nod", size: 0.6, at: { line: 12, word: "Eis", plus: 0.2 } }),
  kel({ do: "smile", amount: 0.55, at: { line: 12, word: "Rechnung" } }),
  kel({ do: "nod", size: 0.7, at: plus(L12E, -0.1) }),
  sij({ do: "look", to: { face: K }, dur: 0.4, at: { line: 12, word: "Rechnung" } }),
  /* he clears the plates */
  kel({ do: "lean", amount: 0.45, dur: 0.7, at: plus(L12E, 0.6) }),
  kel({ do: "look", to: { prop: "soup" }, dur: 0.4, at: plus(L12E, 0.6) }),
  kel({ do: "reach", hand: "R", to: { prop: "soup", off: [-0.1, 0.0, 0] }, palm: "up", grip: 0.5, dur: 0.7, at: plus(L12E, 0.6) }),
  kel({ do: "take", prop: "soup", hand: "R", grip: "carry", at: plus(L12E, 1.32) }),
  kel({ do: "look", to: { prop: "pasta" }, dur: 0.4, at: plus(L12E, 1.3) }),
  kel({ do: "reach", hand: "L", to: { prop: "pasta", off: [-0.1, 0.0, 0] }, palm: "up", grip: 0.5, dur: 0.7, at: plus(L12E, 1.35) }),
  kel({ do: "take", prop: "pasta", hand: "L", grip: "carry", at: plus(L12E, 2.07) }),
  kel({ do: "lean", amount: 0, dur: 0.7, at: plus(L12E, 2.1) }),
  kel({ do: "reach", hand: "R", to: { body: "present", off: [0.02, -0.05, 0.08] }, palm: "up", dur: 0.6, at: plus(L12E, 2.1) }),
  kel({ do: "reach", hand: "L", to: { body: "present", off: [0.02, -0.05, 0.08] }, palm: "up", dur: 0.6, at: plus(L12E, 2.1) }),
  kel({ do: "look", to: { face: R }, dur: 0.4, at: plus(L12E, 2.2) }),
  shr({ do: "look", to: { face: S }, dur: 0.4, at: plus(L12E, 1.0) }),
  shr({ do: "smile", amount: 0.6, at: plus(L12E, 1.0) }),
  sij({ do: "look", to: { face: R }, dur: 0.4, at: plus(L12E, 1.2) })
];

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

const MASTER = { pos: [0, 1.38, 2.9] as Vec3, look: [0, 1.02, -1.4] as Vec3, fov: 31 };

const shots: Shot3D[] = [
  /* the room from the front, pushing in slowly on the door and the stand */
  {
    at: { t: 0 }, pos: [-1.4, 1.7, 5.0], look: [-1.6, 1.1, -1.5], fov: 40,
    to: { pos: [-1.75, 1.55, 3.3], look: [-1.55, 1.12, -1.4], fov: 37 }
  },
  /* and once they are sat, the table */
  { at: { after: "rSit", plus: -0.6 }, ...MASTER, glide: 2.8 }
];

/* ------------------------------------------------------------------ */

export const c003Acted: Acted = {
  set: "restaurant",
  cast: {
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
        /* dressed for the evening */
        top: "#9c5068",
        topDark: "#89455a",
        trousers: "#2b2f3a",
        shoes: "#2b2b30",
        lanyard: true
      },
      start: { x: -3.6, z: -2.95, yaw: Math.PI / 2 }
    },
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
      start: { x: -3.6, z: -3.75, yaw: Math.PI / 2 }
    },
    Kellner: {
      look: {
        height: 1.8,
        model: "kellner",
        skin: "#d9a882",
        skinShade: "#c08e68",
        hair: "#5a3d27",
        hairStyle: "short",
        beard: false,
        brows: "normal",
        top: "#f4f1ea",
        topDark: "#dcd6cc",
        trousers: "#26262b",
        shoes: "#1f1f22",
        apron: "#2b2b30"
      },
      start: { x: KELLNER_STAND[0], z: KELLNER_STAND[1], yaw: Math.PI + 0.35 }
    }
  },
  gaps: { 0: 3.0, 3: 4.5, 4: 0.3, 6: 1.8, 7: 0.4, 8: 2.4, 9: 1.2, 10: 1.6, 12: 0.4 },
  tail: 3.2,
  props: {
    menuA: { kind: "menu", start: { spot: "menuStand" } },
    menuB: { kind: "menu", start: { inside: "menuA", off: [0.01, 0.012, 0.005] } },
    glassR: { kind: "glass", start: { spot: "glassShruti" } },
    glassS: { kind: "glass", start: { spot: "glassSijan" } },
    soup: { kind: "soup", start: { spot: "kitchenSoup" } },
    pasta: { kind: "pasta", start: { spot: "kitchenPasta" } },
    spoon: { kind: "spoon", start: { spot: "spoonShruti" } },
    fork: { kind: "fork", start: { spot: "forkSijan" } }
  },
  beats,
  shots,
  callouts: {
    0: { at: "table", label: "der Tisch", word: "Tisch", size: [0.45, 0.2] },
    2: { at: "fenster", label: "das Fenster", word: "Fenster", size: [0.55, 0.6] },
    3: { at: "menuB", label: "die Speisekarte", word: "Speisekarte", size: [0.17, 0.1] },
    5: { at: "boardNudeln", label: "die Nudeln", word: "Nudeln", size: [0.34, 0.06] },
    7: { at: "glassS", label: "das Wasser", word: "Wasser", size: [0.06, 0.08] },
    12: { at: "boardEis", label: "das Eis", word: "Eis", size: [0.14, 0.06] }
  }
};
