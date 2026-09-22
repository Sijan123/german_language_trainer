/*
 * Staging for c011 - "Die Waschmaschine ist voll".
 *
 * The handoff's standing example of a dialogue with nowhere to point: it
 * scaffolded onto the living room, which has no washing machine, and got one
 * callout in twelve lines. The bathroom set was drawn for it.
 *
 * Sijan is in the bathroom because he is the one doing the hanging up; Shruti
 * is in the kitchen, going down to the cellar for the airer. The scaffolder
 * would have put her on the left for speaking first.
 */

import type { Scene } from "../types";

export const c011: Scene = {
  id: "c011",

  call: false,

  rooms: [
    { set: "bad", from: 0, to: 960 },
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

  /*
   * Four, all in the bathroom, which is where the dialogue is looking. Line 4
   * names the room itself and the airer is the thing in it the sentence is
   * actually about.
   */
  callouts: {
    0: { at: "waesche", label: "die Wäsche", word: "Wäsche" },
    1: { at: "waschmaschine", label: "die Maschine", word: "Maschine" },
    3: { at: "fenster", label: "es regnet", word: "regnet" },
    9: { at: "waesche", label: "die Socken", word: "Socken" }
  },

  wortschatz: [
    { de: "die Waschmaschine", en: "washing machine" },
    { de: "die Wäsche", en: "washing, laundry" },
    { de: "der Ständer", en: "clothes airer" },
    { de: "der Keller", en: "cellar" },
    { de: "das Hemd", en: "shirt" },
    { de: "die Socke", en: "sock" }
  ]
};
