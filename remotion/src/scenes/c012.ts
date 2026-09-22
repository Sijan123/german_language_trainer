/*
 * Staging for c012 — "Wer bringt den Müll raus?".
 *
 * German bin day, discussed from inside the flat. The bins, the cardboard,
 * the container by the garage and the collection lorry are all outside, so
 * they are thoughts; the knife she sends him to the kitchen for is real, and
 * the kitchen already owns it.
 */

import type { Scene } from "../types";

export const c012: Scene = {
  id: "c012",

  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "kueche", from: 960, to: 1920 }
  ],

  cast: {
    Sijan: {
      room: 0,
      x: 258,
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
    },
    Shruti: {
      room: 1,
      x: 1664,
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
    }
  },

  callouts: {
    6: { at: "fruehstueck", label: "das Messer", word: "Messer" }
  },

  thoughts: {
    1: { icon: "tonne", label: "die Tonne", word: "Tonne" },
    3: { icon: "paket", label: "die Kartons", word: "Kartons" }
  },

  wortschatz: [
    { de: "die Müllabfuhr", en: "refuse collection" },
    { de: "die Tonne", en: "wheelie bin" },
    { de: "das Papier", en: "paper" },
    { de: "der Karton", en: "cardboard box" },
    { de: "das Messer", en: "knife" },
    { de: "der Container", en: "skip, container" }
  ]
};
