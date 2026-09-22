/*
 * Staging for c028 — "Rücken nach dem Sport".
 *
 * A couple at home talking about a training session that already happened, so
 * rooms of the flat rather than a gym — the same reading as c005 and c006.
 * Sijan speaks first and takes the left, which is the bedroom; the living
 * room carries both things this dialogue can point at.
 *
 * The scaffolder found nothing at all here. It was looking for nouns that
 * match a set's keywords, and "Rücken", "Training" and "Kirschkernkissen" are
 * not in any of them — but the sofa's keyword list does include "kissen",
 * which is what line 10 turns out to need.
 */

import type { Scene } from "../types";

export const c028: Scene = {
  id: "c028",

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
   * The radiator for the warmth she prescribes, and the sofa for the cushion
   * he remembers they own. Both sit left of x=1520 in the living room, which
   * is where everything in that room had to move after c004 rang "die
   * Heizung" round the figure standing at 1664.
   */
  callouts: {
    9: { at: "heizung", label: "die Wärme", word: "Wärme" },
    10: { at: "sofa", label: "das Kissen", word: "Kirschkernkissen" }
  },

  thoughts: {
    2: { icon: "ball", label: "das Training", word: "Training" },
    11: { icon: "kalender", label: "nächste Woche", word: "Woche" }
  },

  wortschatz: [
    { de: "der Rücken", en: "back" },
    { de: "heben", en: "to lift" },
    { de: "das Training", en: "training" },
    { de: "sich aufwärmen", en: "to warm up" },
    { de: "die Pause", en: "break" },
    { de: "die Wärme", en: "warmth, heat" }
  ]
};
