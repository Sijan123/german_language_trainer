/*
 * Staging for c042 — "Falsch verbunden".
 *
 * Two strangers on a phone, so two rooms and a call. They are not in the same
 * flat and the frame should not suggest they are — but there is no way to say
 * "two different homes" in a set registry, so it is the usual pair and the
 * handsets do the work.
 *
 * Only two pointers, and that is the dialogue: it is about a telephone number,
 * which is not a thing anyone can draw.
 */

import type { Scene } from "../types";

export const c042: Scene = {
  id: "c042",

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "wohnzimmer", from: 960, to: 1920 }
  ],

  cast: {
    Shruti: {
      room: 0,
      x: 258,
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
      room: 1,
      x: 1664,
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

  callouts: {},

  thoughts: {
    3: { icon: "auto", label: "die Werkstatt", word: "Werkstatt" },
    8: { icon: "handy", label: "die Nummer", word: "Nummer" }
  },

  wortschatz: [
    { de: "die Nummer", en: "number" },
    { de: "die Werkstatt", en: "garage, workshop" },
    { de: "wählen", en: "to dial" },
    { de: "sich vertippen", en: "to mistype" },
    { de: "die Störung", en: "disturbance" },
    { de: "entschuldigen", en: "to excuse" }
  ]
};
