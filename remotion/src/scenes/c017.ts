/*
 * Staging for c017 - "Zusammen kochen".
 *
 * The topic is "essen", so the scaffolder proposed the restaurant - and this
 * is two people cooking dinner at home. They are in one room together, which
 * the half-frame kitchen cannot show, so this is the film the full-frame
 * kitchen was drawn for.
 */

import type { Scene } from "../types";

export const c017: Scene = {
  id: "c017",

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
    5: { at: "brett", label: "der Knoblauch", word: "Knoblauch" },
    6: { at: "topf", label: "die Linsen", word: "Linsen" },
    8: { at: "tisch", label: "der Tisch", word: "Tisch" },
    10: { at: "topf", label: "das Wasser", word: "Wasser" }
  },

  wortschatz: [
    { de: "die Linsen", en: "lentils" },
    { de: "der Reis", en: "rice" },
    { de: "die Zwiebel", en: "onion" },
    { de: "der Knoblauch", en: "garlic" },
    { de: "schneiden", en: "to cut, chop" },
    { de: "das Salz", en: "salt" }
  ]
};
