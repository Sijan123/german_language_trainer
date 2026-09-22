/*
 * Staging for c033 — "Der Koffer ist nicht angekommen".
 *
 * The scaffolder put this on the railway platform and found one callout: the
 * rucksack, on line 11. That is the platform's rucksack, and it was the only
 * thing in a station that this dialogue names — which is a fair description of
 * how wrong the room was.
 *
 * Its own set now. Four rings, and each one is the object the line is about:
 * the cases that are not theirs, the belt that has stopped, the desk they
 * report it at, and the rucksack that has the toothbrush in it.
 *
 * Shruti speaks first and takes the left.
 */

import type { Scene } from "../types";

export const c033: Scene = {
  id: "c033",

  call: false,

  rooms: [
    { set: "gepaeck", from: 0, to: 1920 }
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
    0: { at: "koffer", label: "der Koffer", word: "Koffer" },
    2: { at: "band", label: "das Band", word: "Band" },
    3: { at: "schalter", label: "der Schalter", word: "Schalter" },
    11: { at: "rucksack", label: "der Rucksack", word: "Rucksack" }
  },

  wortschatz: [
    { de: "der Koffer", en: "suitcase" },
    { de: "das Band", en: "belt, carousel" },
    { de: "der Schalter", en: "counter, desk" },
    { de: "der Flug", en: "flight" },
    { de: "liefern", en: "to deliver" },
    { de: "der Rucksack", en: "backpack" }
  ]
};
