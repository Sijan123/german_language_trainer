/*
 * Staging for c013 — "Der Schlüssel ist weg".
 *
 * A hunt through a flat, which is the rare case where nearly everything named
 * is actually in shot: the key, the jacket, the hook. Three callouts, no
 * thought bubbles needed.
 *
 * The jacket rail added for c006 pays for itself twice here — line 3 asks
 * whether he looked in it, and line 11 tells him to hang the key on the hook,
 * which is the same object under a different name.
 */

import type { Scene } from "../types";

export const c013: Scene = {
  id: "c013",

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
    0: { at: "regal", label: "der Schlüssel", word: "Schlüssel" },
    3: { at: "jacke", label: "die Jacke", word: "Jacke" },
    11: { at: "jacke", label: "der Haken", word: "Haken" }
  },

  wortschatz: [
    { de: "der Schlüssel", en: "key" },
    { de: "die Haustür", en: "front door" },
    { de: "die Tasche", en: "pocket, bag" },
    { de: "der Rucksack", en: "backpack" },
    { de: "der Haken", en: "hook" },
    { de: "die Hose", en: "trousers" }
  ]
};
