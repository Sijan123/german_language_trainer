/*
 * Staging for c035 — "Ins Kino oder nicht?".
 *
 * Deciding whether to go, so they are still at home; the cinema itself never
 * appears in the dialogue as a place, only as a plan. Rooms of the flat and
 * three thoughts.
 */

import type { Scene } from "../types";

export const c035: Scene = {
  id: "c035",

  call: false,

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
    0: { icon: "gebaeude", label: "das Kino", word: "Kino" },
    6: { icon: "uhr", label: "zwanzig Uhr dreißig", word: "Uhr" },
    7: { icon: "karte", label: "die Karte", word: "Karten" }
  },

  wortschatz: [
    { de: "das Kino", en: "cinema" },
    { de: "der Film", en: "film" },
    { de: "die Karte", en: "ticket" },
    { de: "der Platz", en: "seat, place" },
    { de: "anfangen", en: "to start" },
    { de: "treffen", en: "to meet" }
  ]
};
