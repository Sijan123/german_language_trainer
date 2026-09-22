/*
 * Staging for c037 — "Karten für das Konzert".
 *
 * At home, deciding whether fifty-five euros is too much. Like c034 and c035,
 * everything named is somewhere else — a band, a hall by the station, a car
 * they will not need — so it runs on thoughts.
 */

import type { Scene } from "../types";

export const c037: Scene = {
  id: "c037",

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
    1: { icon: "karte", label: "die Karte", word: "Karten" },
    4: { icon: "geld", label: "fünfundfünfzig Euro", word: "Euro" },
    8: { icon: "gebaeude", label: "die Halle", word: "Halle" },
    9: { icon: "auto", label: "das Auto", word: "Auto" }
  },

  wortschatz: [
    { de: "die Karte", en: "ticket" },
    { de: "teuer", en: "expensive" },
    { de: "die Halle", en: "hall, arena" },
    { de: "selten", en: "rarely" },
    { de: "ausverkauft", en: "sold out" },
    { de: "das Auto", en: "car" }
  ]
};
