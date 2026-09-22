/*
 * Staging for c021 — "Der Umzugstag".
 *
 * Scaffolded onto the living room and the kitchen, and moved. The living room
 * is drawn for the right-hand half; putting it on the left shifts its anchors
 * by -960, which lands the sofa at x 245-545 — on top of the figure standing
 * at x=258. The sofa is the one thing this dialogue has to be able to point
 * at, so the living room goes back to the side it was drawn for and the
 * bedroom takes the left.
 *
 * Not a phone call: they are emptying one flat together, so `call: false`.
 * Sijan speaks first and takes the left room; that also puts Shruti next to
 * the sofa she asks about on line 3, which is the right way round.
 */

import type { Scene } from "../types";

export const c021: Scene = {
  id: "c021",

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

  /*
   * Two, which is thin for twelve lines, and it is the dialogue's fault
   * rather than the staging's: a moving day is about a van, cardboard boxes,
   * a doorway and a freshly painted wall, and not one of those is drawn in
   * either room. The sofa is the only object in the script that exists on a
   * set, so it gets the ring and the boxes get the cloud.
   */
  callouts: {
    3: { at: "sofa", label: "das Sofa", word: "Sofa" }
  },

  thoughts: {
    1: { icon: "paket", label: "der Karton", word: "Kartons" }
  },

  wortschatz: [
    { de: "der Umzug", en: "move, removal" },
    { de: "der Karton", en: "cardboard box" },
    { de: "das Sofa", en: "sofa" },
    { de: "tragen", en: "to carry" },
    { de: "schwer", en: "heavy" },
    { de: "die Wand", en: "wall" }
  ]
};
