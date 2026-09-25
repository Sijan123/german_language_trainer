/*
 * c002 acted — "Im Supermarkt fehlt die Hälfte", a phone call: Sijan in the
 * supermarket, Shruti at home in the kitchen (acted/sets/telefon.tsx).
 *
 * Both are the cast's own models (public/models/cast/sijan.glb and
 * shruti.glb). A first cut used a downloaded avatar for Sijan
 * (sijan_test_dressed.glb, dressed by blender/dress.py); it could not move
 * its mouth, so the cast's Sijan plays it now.
 *
 * What happens:
 *
 *   0-1   At the dairy chiller, basket on his arm, he asks what's on the list;
 *         at home she reads it off the slip in her hand.
 *   2-3   The milk has sold out (a gap and a red tag on the shelf); she says
 *         take the oat milk, and it goes into the basket.
 *   4-5   At the produce table, eggs: "Zehn reichen" — a box goes in. At
 *         home, "Ich backe ... einen Kuchen" with a nod at her baking bowl.
 *   6-7   He picks up a tomato, turns it over, shakes his head; puts it back.
 *   8-9   Over to the breakfast shelf; a jar of jam goes in.
 *   10-12 He sees the queue at the till; she says the self-checkout is free;
 *         he heads for it. "Ich bin in fünf Minuten zu Hause."
 *
 * The camera stays with the shop, where the business is, and cuts home only
 * for her lines about the list, the cake and the market (the owner's rule:
 * the camera moves only when needed).
 */

import type { Acted, Beat, Shot3D, Vec3 } from "../acted/types";

const S = "Sijan";
const R = "Shruti";

type Verb = Beat extends infer B ? (B extends Beat ? Omit<B, "who"> : never) : never;
const sij = (b: Verb): Beat => ({ ...b, who: S }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: R }) as Beat;

const MILK_GAP: Vec3 = [-2.22, 1.32, -1.1];
const QUEUE: Vec3 = [-4.5, 1.5, -0.4];
const KIOSK: Vec3 = [-3.95, 1.2, 0.55];
/* where he stands: at the chiller, at the table (facing the camera), by the
   tomatoes, at the jam shelf, and by the self-checkout */
const CHILLER: [number, number] = [-2.05, -0.52];
/* close enough to the shelves and the table to reach them */
const TABLE_EGGS: [number, number] = [-2.0, -0.22];
const TABLE_TOM: [number, number] = [-2.6, -0.24];
const JAM: [number, number] = [-3.82, -0.62];
const SB: [number, number] = [-3.45, 0.38];

const beats: Beat[] = [
  /* ---------------------------------------------------------- opening */
  sij({ do: "look", to: { spot: "oat" }, dur: 0.1, at: { t: 0 } }),
  shr({ do: "reach", hand: "L", to: { body: "phone" }, palm: "in", grip: 0.8, dur: 0.1, at: { t: 0 } }),
  shr({ do: "reach", hand: "R", to: { body: "read" }, palm: "up", grip: 0.5, dur: 0.1, at: { t: 0 } }),
  shr({ do: "look", to: { ahead: true }, dur: 0.1, at: { t: 0 } }),
  sij({ do: "look", to: { world: MILK_GAP }, dur: 0.6, at: { gap: 0, plus: 0.6 } }),

  /* ---------------------------------------------------------- 0-1: the list */
  sij({ do: "turn", yaw: -1.2, dur: 0.9, at: { line: 0, plus: -0.6 } }),
  sij({ do: "look", to: { ahead: true }, dur: 0.5, at: { line: 0, plus: -0.4 } }),
  shr({ do: "look", to: { prop: "note" }, dur: 0.4, at: { line: 1, plus: -0.4 } }),
  shr({ do: "nod", size: 0.3, at: { line: 1, word: "Eier" } }),
  sij({ do: "turn", yaw: Math.PI / 2, dur: 0.9, at: { line: 1, word: "Milch" } }),
  sij({ do: "look", to: { world: MILK_GAP }, dur: 0.5, at: { line: 1, word: "Milch", plus: 0.2 } }),
  sij({ do: "nod", size: 0.4, at: { line: 1, word: "Käse" } }),

  /* ---------------------------------------------------------- 2-3: no milk; oat milk */
  sij({ do: "turn", yaw: -1.1, dur: 0.8, at: { line: 2, word: "leider", plus: -0.3 } }),
  sij({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 2, word: "leider", plus: -0.2 } }),
  sij({ do: "brows", amount: 0.7, at: { line: 2, word: "leider" } }),
  sij({ do: "brows", amount: 0, at: { line: 3, word: "einfach" } }),
  shr({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 3, plus: -0.2 } }),
  shr({ do: "smile", amount: 0.35, at: { line: 3, word: "gut" } }),
  sij({ do: "turn", yaw: Math.PI / 2, dur: 0.8, at: { line: 3, word: "einfach" } }),
  sij({ do: "look", to: { prop: "carton" }, dur: 0.4, at: { line: 3, word: "die" } }),
  sij({ do: "reach", hand: "R", to: { prop: "carton", off: [0, 0.02, 0] }, palm: "in", grip: 0.75, dur: 0.6, at: { line: 3, word: "Hafermilch", plus: -0.3 } }),
  sij({ do: "take", prop: "carton", hand: "R", grip: "keep", at: { line: 3, word: "Hafermilch", plus: 0.3 } }),
  sij({ do: "look", to: { prop: "basket" }, dur: 0.4, at: { line: 3, word: "ist" } }),
  sij({ do: "reach", hand: "R", to: { prop: "basket", off: [0.02, 0.2, 0] }, palm: "in", dur: 0.7, at: { line: 3, word: "ist" } }),
  sij({ do: "put", prop: "carton", into: "basket", off: [-0.1, -0.01, 0.0], at: { line: 3, word: "ist", plus: 0.7 } }),
  sij({ do: "rest", hand: "R", at: { line: 3, word: "ist", plus: 0.75 } }),

  /* ---------------------------------------------------------- 4-5: eggs; the cake */
  sij({ do: "turn", yaw: -Math.PI / 2, dur: 1.0, at: { line: 3, end: true, plus: 0.2 } }),
  sij({ do: "step", to: TABLE_EGGS, dur: 0.7, at: { line: 3, end: true, plus: 1.1 } }),
  sij({ do: "look", to: { prop: "eggs" }, dur: 0.4, at: { line: 4, word: "Eier", plus: -0.2 } }),
  sij({ do: "brows", amount: 0.5, at: { line: 4, word: "wir" } }),
  sij({ do: "brows", amount: 0, at: { line: 5, word: "reichen" } }),
  shr({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 5, plus: -0.3 } }),
  sij({ do: "lean", amount: 0.25, dur: 0.5, at: { line: 5, word: "Zehn" } }),
  sij({ do: "reach", hand: "R", to: { prop: "eggs", off: [0, 0.04, 0] }, palm: "down", grip: 0.6, dur: 0.55, at: { line: 5, word: "Zehn" } }),
  sij({ do: "take", prop: "eggs", hand: "R", grip: "keep", at: { line: 5, word: "Zehn", plus: 0.55 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 5, word: "Zehn", plus: 0.6 } }),
  sij({ do: "reach", hand: "R", to: { prop: "basket", off: [0.0, 0.2, 0] }, palm: "down", dur: 0.7, at: { line: 5, word: "Zehn", plus: 0.65 } }),
  sij({ do: "put", prop: "eggs", into: "basket", off: [0.08, -0.07, 0.0], at: { line: 5, word: "Zehn", plus: 1.35 } }),
  sij({ do: "rest", hand: "R", at: { line: 5, word: "Zehn", plus: 1.4 } }),
  shr({ do: "look", to: { spot: "bowl" }, dur: 0.4, hold: 0.9, at: { line: 5, word: "backe" } }),
  shr({ do: "gesture", hand: "R", kind: "offer", toward: { spot: "bowl", off: [0, 0.15, 0] }, at: { line: 5, word: "Wochenende" } }),
  shr({ do: "smile", amount: 0.55, at: { line: 5, word: "Kuchen" } }),
  sij({ do: "smile", amount: 0.45, at: { line: 5, word: "Kuchen" } }),

  /* ---------------------------------------------------------- 6-7: the tomatoes */
  sij({ do: "step", to: TABLE_TOM, dur: 0.8, at: { line: 5, end: true, plus: 0.1 } }),
  sij({ do: "look", to: { prop: "tomato" }, dur: 0.4, at: { line: 6, word: "Tomaten", plus: -0.3 } }),
  sij({ do: "lean", amount: 0.28, dur: 0.5, at: { line: 6, word: "Tomaten", plus: -0.3 } }),
  sij({ do: "reach", hand: "R", to: { prop: "tomato", off: [0, 0.03, 0] }, palm: "down", grip: 0.7, dur: 0.5, at: { line: 6, word: "Tomaten", plus: -0.3 } }),
  sij({ do: "take", prop: "tomato", hand: "R", grip: "keep", at: { line: 6, word: "Tomaten", plus: 0.2 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 6, word: "Tomaten", plus: 0.25 } }),
  sij({ do: "reach", hand: "R", to: { body: "present", off: [-0.06, 0.1, 0] }, palm: "up", dur: 0.5, at: { line: 6, word: "Tomaten", plus: 0.25 } }),
  sij({ do: "smile", amount: 0, at: { line: 6, word: "sehen" } }),
  sij({ do: "shake", times: 2, dur: 0.8, at: { line: 6, word: "nicht" } }),
  sij({ do: "lean", amount: 0.28, dur: 0.5, at: { line: 7, word: "kaufen" } }),
  sij({ do: "reach", hand: "R", to: { spot: "tomato", off: [0, 0.06, 0] }, palm: "down", dur: 0.5, at: { line: 7, word: "kaufen" } }),
  sij({ do: "put", prop: "tomato", spot: "tomato", at: { line: 7, word: "kaufen", plus: 0.5 } }),
  sij({ do: "rest", hand: "R", at: { line: 7, word: "kaufen", plus: 0.55 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 7, word: "kaufen", plus: 0.55 } }),
  sij({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 7, word: "morgen" } }),
  sij({ do: "nod", size: 0.6, at: { line: 7, word: "Markt" } }),
  shr({ do: "look", to: { ahead: true }, dur: 0.3, at: { line: 7, plus: -0.2 } }),
  shr({ do: "nod", size: 0.5, at: { line: 7, word: "morgen" } }),

  /* ---------------------------------------------------------- 8-9: breakfast; jam */
  sij({ do: "turn", yaw: 2.6, dur: 0.8, at: { line: 8, word: "Soll", plus: -0.2 } }),
  sij({ do: "walk", path: [[-3.3, -0.55], JAM], face: Math.PI / 2, at: { line: 8, word: "noch" } }),
  sij({ do: "look", to: { spot: "jar" }, dur: 0.5, at: { line: 8, word: "Frühstück" } }),
  shr({ do: "smile", amount: 0.4, at: { line: 9, word: "Ja" } }),
  sij({ do: "lean", amount: 0.2, dur: 0.5, at: { line: 9, word: "Glas", plus: -0.1 } }),
  sij({ do: "reach", hand: "R", to: { prop: "jar", off: [0, 0.02, 0] }, palm: "in", grip: 0.75, dur: 0.55, at: { line: 9, word: "Glas", plus: -0.1 } }),
  sij({ do: "lean", amount: 0, dur: 0.5, at: { line: 9, word: "Marmelade", plus: 0.05 } }),
  sij({ do: "take", prop: "jar", hand: "R", grip: "keep", at: { line: 9, word: "Marmelade" } }),
  sij({ do: "reach", hand: "R", to: { body: "present", off: [-0.05, 0.08, 0] }, palm: "in", dur: 0.5, at: { line: 9, word: "Marmelade", plus: 0.05 } }),
  sij({ do: "turn", yaw: -1.3, dur: 0.9, at: { line: 9, word: "bitte" } }),
  sij({ do: "look", to: { prop: "basket" }, dur: 0.4, at: { line: 9, end: true, plus: 0.1 } }),
  sij({ do: "reach", hand: "R", to: { prop: "basket", off: [0.0, 0.2, 0] }, palm: "down", dur: 0.7, at: { line: 9, end: true, plus: 0.1 } }),
  sij({ do: "put", prop: "jar", into: "basket", off: [0.02, -0.06, 0.07], at: { line: 9, end: true, plus: 0.8 } }),
  sij({ do: "rest", hand: "R", at: { line: 9, end: true, plus: 0.85 } }),

  /* ---------------------------------------------------------- 10-12: the queue, the self-checkout */
  sij({ do: "look", to: { world: QUEUE }, dur: 0.5, at: { line: 10, word: "Kasse", plus: -0.3 } }),
  sij({ do: "brows", amount: 0.6, at: { line: 10, word: "lange" } }),
  sij({ do: "brows", amount: 0, at: { line: 11, word: "Geh" } }),
  shr({ do: "look", to: { ahead: true }, dur: 0.4, at: { line: 11, plus: -0.2 } }),
  sij({ do: "look", to: { world: KIOSK }, dur: 0.5, at: { line: 11, word: "Selbstbedienungskasse", plus: 0.3 } }),
  sij({ do: "nod", size: 0.6, at: { line: 11, word: "frei" } }),
  sij({ do: "smile", amount: 0.55, at: { line: 12, word: "Gute" } }),
  sij({ do: "walk", path: [SB], face: 2.6, at: { line: 12, word: "Idee", plus: 0.2 } }),
  sij({ do: "look", to: { world: KIOSK }, dur: 0.5, at: { line: 12, end: true, plus: 0.2 } }),
  shr({ do: "smile", amount: 0.6, at: { line: 12, word: "fünf" } }),
  shr({ do: "reach", hand: "L", to: { spot: "mug", off: [0, 0.03, 0] }, palm: "down", dur: 0.7, at: { line: 12, end: true, plus: 0.4 } }),
  shr({ do: "put", prop: "phone", spot: "mug", at: { line: 12, end: true, plus: 1.1 } }),
  shr({ do: "rest", hand: "L", at: { line: 12, end: true, plus: 1.15 } })
];

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

const SHOP = { pos: [-2.7, 1.55, 3.9] as Vec3, look: [-2.75, 1.05, -0.4] as Vec3, fov: 35 };
const HOME = { pos: [1.65, 1.45, 3.4] as Vec3, look: [1.65, 1.1, -0.2] as Vec3, fov: 34 };
const shop = (at: Shot3D["at"]): Shot3D => ({ at, ...SHOP });
const home = (at: Shot3D["at"]): Shot3D => ({ at, ...HOME });

const shots: Shot3D[] = [
  /* both places at once: the shop and home, the wall between */
  { at: { t: 0 }, pos: [-0.6, 1.95, 8.2], look: [-0.6, 1.1, -0.6], fov: 44 },
  shop({ line: 0, plus: -0.5 }),
  home({ line: 1 }),
  shop({ line: 2 }),
  home({ line: 5, word: "Ich" }),
  shop({ line: 6 }),
  home({ line: 7, word: "kaufen", plus: 0.6 }),
  shop({ line: 8 }),
  /* and both again at the end, as they hang up */
  { at: { line: 12, end: true, plus: 0.6 }, pos: [-0.6, 1.95, 8.2], look: [-0.6, 1.1, -0.6], fov: 44, glide: 2.5 }
];

/* ------------------------------------------------------------------ */

export const c002Acted: Acted = {
  set: "telefon",
  cast: {
    Sijan: {
      /* the cast's own Sijan (blender/cast.py), dressed as in the other films */
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
      start: { x: CHILLER[0], z: CHILLER[1], yaw: Math.PI / 2 }
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
      start: { x: 2.22, z: 0.1, yaw: Math.PI }
    }
  },
  gaps: { 0: 2.4, 4: 0.8, 6: 0.6, 8: 0.6, 10: 1.2 },
  tail: 4.0,
  props: {
    basket: { kind: "basket", start: { hand: [S, "L"], grip: "carry" } },
    carton: { kind: "carton", start: { spot: "oat" } },
    eggs: { kind: "eggs", start: { spot: "eggs" } },
    tomato: { kind: "tomato", start: { spot: "tomato" } },
    jar: { kind: "jar", start: { spot: "jar" } },
    phone: { kind: "phone", start: { hand: [R, "L"], grip: "carry" } },
    note: { kind: "note", start: { hand: [R, "R"], grip: "carry" } }
  },
  beats,
  shots,
  callouts: {
    2: { at: "milkGap", label: "die Milch", word: "Milch", size: [0.2, 0.1] },
    3: { at: "carton", label: "die Hafermilch", word: "Hafermilch", size: [0.06, 0.12] },
    4: { at: "eggs", label: "die Eier", word: "Eier", size: [0.15, 0.06] },
    5: { at: "kuchen", label: "der Kuchen", word: "Kuchen", size: [0.18, 0.1] },
    6: { at: "tomatoes", label: "die Tomaten", word: "Tomaten", size: [0.25, 0.1] },
    9: { at: "jar", label: "die Marmelade", word: "Marmelade", size: [0.06, 0.07] },
    10: { at: "queue", label: "die Kasse", word: "Kasse", size: [0.45, 0.7] },
    11: { at: "selfCheckout", label: "die SB-Kasse", word: "Selbstbedienungskasse", size: [0.26, 0.45] }
  }
};
