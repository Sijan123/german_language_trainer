/*
 * Staging for c047 — "Geschenk für die Schwester".
 *
 * At home, working out what to buy. The living room earns its place here: its
 * shelf is the only object in any set that a cookbook can be, and line 5 is
 * the line that names one.
 */

import type { Scene } from "../types";

export const c047: Scene = {
  id: "c047",

  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "wohnzimmer", from: 960, to: 1920 }
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
    5: { at: "regal", label: "das Kochbuch", word: "Kochbuch" }
  },

  thoughts: {
    0: { icon: "kalender", label: "der Geburtstag", word: "Geburtstag" },
    10: { icon: "gebaeude", label: "die Stadt", word: "Stadt" },
    12: { icon: "karte", label: "die Karte", word: "Karte" }
  },

  wortschatz: [
    { de: "der Geburtstag", en: "birthday" },
    { de: "schenken", en: "to give as a present" },
    { de: "das Kochbuch", en: "cookbook" },
    { de: "die Pfanne", en: "pan" },
    { de: "praktisch", en: "practical" },
    { de: "die Karte", en: "card" }
  ]
};
