/*
 * Staging for c004 — "Die Heizung wird nicht warm".
 *
 * Scaffolded by scripts/new-scene.mjs, then read and changed. The three
 * decisions the scaffolder marked TODO:
 *
 * 1. Together, not on the phone. "Komm her, zu zweit ist es sowieso wärmer"
 *    is said across a flat, not down a line, so `call: false` — nobody holds
 *    a handset and the name chips drop the phone glyph. Same shape as c001.
 *
 * 2. The rooms changed. The scaffolder proposed wohnzimmer + kueche, but the
 *    kitchen is never mentioned once in twelve lines and every callout would
 *    have landed in the other half. Swapped for the bedroom, which the last
 *    third of the dialogue is actually about — the thick blanket, the night
 *    below zero, "come here". Both sets now also sit in the half they were
 *    drawn for (schlafzimmer origin 0, wohnzimmer origin 960), so no anchor
 *    box has to be shifted.
 *
 * 3. Sijan is in the living room because he is the one standing in it saying
 *    it is freezing; Shruti is in the bedroom she ends the film calling him
 *    into. That reverses the scaffolder's "first speaker on the left".
 */

import type { Scene } from "../types";

export const c004: Scene = {
  id: "c004",

  /* Two rooms of one flat, not two ends of a call. */
  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "wohnzimmer", from: 960, to: 1920 }
  ],

  /* `x` is the centre of the head. Both are pushed towards the outer edges so
     the speech bubble can sit across the middle without covering a face. */
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

  /*
   * Three, on a twelve-line dialogue. The scaffolder proposed four; two of
   * them were dropped and one added.
   *
   * Dropped: line 6 "einen kleinen Schlüssel" pointed at the bookshelf, which
   * has no key on it — a ring round some books labelled "der Schlüssel" is
   * the wallpaper case. Line 9 "unter null Grad" went to the radiator, which
   * is the one thing in the room that is *not* below zero; it would also have
   * been the second ring on that box.
   *
   * Kept and added: the radiator twice, three lines apart, because the film
   * teaches two words for it — die Heizung, then der Heizkörper — and that
   * distinction is the point of the scene. The blanket lands on the bed,
   * where the duvet is actually drawn.
   */
  callouts: {
    1: { at: "heizung", label: "die Heizung", word: "Heizung" },
    4: { at: "heizung", label: "der Heizkörper", word: "Heizkörper" },
    10: { at: "bett", label: "die Decke", word: "Decke" }
  },

  /*
   * The card at the end. Six reads at a glance; ten is a list you skip.
   *
   * The scaffolder's list carried "das Wohnzimmer" (the room chip already
   * says it), "der Morgen" and "die Luft" (both matched loosely, and neither
   * is what the scene teaches). Replaced with the words the dialogue leans
   * on and a learner would actually need to report a cold flat.
   */
  wortschatz: [
    { de: "die Heizung", en: "heating" },
    { de: "der Heizkörper", en: "radiator" },
    { de: "der Schlüssel", en: "key" },
    { de: "der Vermieter", en: "landlord" },
    { de: "der Schrank", en: "cupboard" },
    { de: "die Decke", en: "blanket" }
  ]
};
