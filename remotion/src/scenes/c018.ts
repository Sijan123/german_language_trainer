/*
 * Staging for c018 - "Beim Bäcker".
 *
 * Scaffolded onto the restaurant, which is the right kind of place and the
 * wrong one - you sit down in a restaurant and you queue in a Bäckerei. Its
 * own set now, full frame, with Shruti serving and Sijan buying.
 */

import type { Scene } from "../types";
import { c018Acted } from "./c018.acted";

export const c018: Scene = {
  id: "c018",

  call: false,

  /* Played by people in a 3D bakery: see c018.acted.ts. Delete this line and
     the film goes back to the drawn staging below, which is kept intact. */
  acted: c018Acted,

  rooms: [
    { set: "baeckerei", from: 0, to: 1920 }
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

  /*
   * Four. Line 5 asks whether there is any cheesecake left and line 6 says
   * only two slices - the stand is drawn with exactly two on it, so the ring
   * lands on a set that agrees with the dialogue.
   */
  callouts: {
    1: { at: "broetchen", label: "die Brötchen", word: "Brötchen" },
    5: { at: "kuchen", label: "der Käsekuchen", word: "Käsekuchen" },
    9: { at: "kasse", label: "mit Karte zahlen", word: "Karte" },
    11: { at: "kasse", label: "passend", word: "passend" }
  },

  wortschatz: [
    { de: "das Brötchen", en: "bread roll" },
    { de: "das Vollkornbrot", en: "wholemeal bread" },
    { de: "geschnitten", en: "sliced" },
    { de: "der Käsekuchen", en: "cheesecake" },
    { de: "bar", en: "cash" },
    { de: "passend", en: "exact change" }
  ]
};
