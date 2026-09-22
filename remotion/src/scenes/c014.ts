/*
 * Staging for c014 - "Die Hose ist zu eng".
 *
 * Sent to the supermarket by topic, because the topic is "einkaufen". A food
 * shop has no fitting rooms and nothing to try on, and this dialogue turns on
 * both - so it has its own set, full frame, at the returns counter.
 *
 * Shruti is the customer and Sijan is serving, which is the order the lines
 * are in.
 */

import type { Scene } from "../types";

export const c014: Scene = {
  id: "c014",

  call: false,

  rooms: [
    { set: "bekleidung", from: 0, to: 1920 }
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

  callouts: {
    0: { at: "hose", label: "die Hose", word: "Hose" },
    1: { at: "kassenbon", label: "der Kassenbon", word: "Kassenbon" },
    10: { at: "kabine", label: "die Kabinen", word: "Kabinen" },
    11: { at: "jacken", label: "die Jacken", word: "Jacken" }
  },

  wortschatz: [
    { de: "umtauschen", en: "to exchange" },
    { de: "der Kassenbon", en: "receipt" },
    { de: "die Größe", en: "size" },
    { de: "die Hüfte", en: "hip" },
    { de: "anprobieren", en: "to try on" },
    { de: "die Kabine", en: "fitting room" }
  ]
};
