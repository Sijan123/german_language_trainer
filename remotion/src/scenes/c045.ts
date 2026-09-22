/*
 * Staging for c045 — "Eine Verabredung absagen".
 *
 * The two of them on the phone to each other, working out which evening is
 * left. Both are somewhere ordinary, so the usual pair of rooms.
 */

import type { Scene } from "../types";

export const c045: Scene = {
  id: "c045",

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

  callouts: {},

  thoughts: {
    4: { icon: "schreibtisch", label: "länger arbeiten", word: "arbeiten" },
    6: { icon: "uhr", label: "bis acht", word: "acht" },
    9: { icon: "ball", label: "der Sport", word: "Sport" },
    10: { icon: "kalender", label: "der Samstag", word: "Samstag" }
  },

  wortschatz: [
    { de: "die Verabredung", en: "arrangement, date" },
    { de: "absagen", en: "to cancel" },
    { de: "klappen", en: "to work out" },
    { de: "verschieben", en: "to move, to postpone" },
    { de: "der Samstag", en: "Saturday" },
    { de: "sich melden", en: "to get in touch" }
  ]
};
