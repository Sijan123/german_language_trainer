/*
 * Staging for c019 - "Gäste kommen zum Essen".
 *
 * Also proposed for the restaurant by topic, and also wrong: Anna and Tom are
 * coming to them. Same full-frame kitchen as c017, one evening earlier in the
 * preparation.
 *
 * The table in that set is drawn small and laid for two on purpose, which is
 * what line 9 is complaining about: "Der Tisch ist zu klein für vier."
 */

import type { Scene } from "../types";

export const c019: Scene = {
  id: "c019",

  call: false,

  rooms: [
    { set: "kuecheGross", from: 0, to: 1920 }
  ],

  cast: {
    Sijan: {
      room: 0,
      x: 420,
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
      room: 0,
      x: 1500,
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
    4: { at: "brett", label: "das Gemüse", word: "Gemüse" },
    5: { at: "topf", label: "die Suppe", word: "Suppe" },
    9: { at: "tisch", label: "der Tisch", word: "Tisch" }
  },

  wortschatz: [
    { de: "der Gast", en: "guest" },
    { de: "der Vegetarier", en: "vegetarian" },
    { de: "das Gemüse", en: "vegetables" },
    { de: "die Vorspeise", en: "starter" },
    { de: "das Getränk", en: "drink" },
    { de: "der Saft", en: "juice" }
  ]
};
