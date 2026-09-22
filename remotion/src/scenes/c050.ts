/*
 * Staging for c050 — "Streit um die Hausarbeit".
 *
 * It opens on "die Küche sieht schon wieder furchtbar aus", so they are both
 * standing in it: the full-frame kitchen, one room, no phones. The split the
 * scaffolder proposed would have put the person complaining about the kitchen
 * somewhere else.
 *
 * Marked `couple: true` in the dialogue data, and it is the argument-and-
 * making-up one, which is why it ends on a plan rather than on the mess.
 */

import type { Scene } from "../types";

export const c050: Scene = {
  id: "c050",

  call: false,

  rooms: [
    { set: "kuecheGross", from: 0, to: 1920 }
  ],

  cast: {
    Shruti: {
      room: 0,
      x: 420,
      headY: 470,
      scale: 1,
      skin: "#c48b64",
      skinShade: "#a97148",
      hair: "#40291f",
      hairLight: "#8a5733",
      hairStyle: "long",
      beard: false,
      brows: "normal",
      top: "#9c5068",
      topDark: "#89455a",
      basket: false
    },
    Sijan: {
      room: 0,
      x: 1500,
      headY: 470,
      scale: 1,
      skin: "#b9805a",
      skinShade: "#9d6741",
      hair: "#241b17",
      hairLight: "#4a382e",
      hairStyle: "short",
      beard: true,
      brows: "thick",
      top: "#3f6b8f",
      topDark: "#355b7a",
      basket: false
    }
  },

  /* The table, for the Sunday breakfast the plan hangs off. It starts at
     x=1648, just clear of the right-hand figure band that ends at 1635. */
  callouts: {
    10: { at: "tisch", label: "das Frühstück", word: "Frühstück" }
  },

  thoughts: {
    2: { icon: "kalender", label: "jede Woche", word: "Woche" },
    7: { icon: "tonne", label: "der Müll", word: "Müll" }
  },

  wortschatz: [
    { de: "die Hausarbeit", en: "housework" },
    { de: "furchtbar", en: "terrible" },
    { de: "allein", en: "alone" },
    { de: "der Müll", en: "rubbish" },
    { de: "die Wäsche", en: "laundry" },
    { de: "sich ärgern", en: "to get annoyed" }
  ]
};
