/*
 * Staging for c044 — "Internet funktioniert nicht".
 *
 * Shruti speaks first, so the scaffolder put her on the left — but she is the
 * call centre and the left-hand room is a bedroom. The rule that the first
 * speaker takes the left is a default and this is one of the cases where it
 * loses: the office has to be on the right, because the Bürgerbüro only works
 * as a half when its counter lands under the figure, and that means the person
 * at home takes the left whoever speaks first.
 */

import type { Scene } from "../types";

export const c044: Scene = {
  id: "c044",

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "buergerbuero", from: 960, to: 1920, label: "Kundendienst" }
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

  callouts: {},

  thoughts: {
    10: { icon: "kalender", label: "morgen Abend", word: "morgen" },
    11: { icon: "gebaeude", label: "das Büro", word: "Büro" },
    12: { icon: "handy", label: "die SMS", word: "SMS" }
  },

  wortschatz: [
    { de: "der Kundendienst", en: "customer service" },
    { de: "der Router", en: "router" },
    { de: "neu starten", en: "to restart" },
    { de: "die Leitung", en: "line" },
    { de: "die Störung", en: "fault" },
    { de: "die Reparatur", en: "repair" }
  ]
};
