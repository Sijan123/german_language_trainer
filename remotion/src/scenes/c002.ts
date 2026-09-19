/*
 * The staging for c002 — "Im Supermarkt fehlt die Hälfte".
 *
 * The timings in src/data/dialogues.json are generated; this is the part a
 * person has to decide, so it is hand-written and lives apart from them: which
 * room each speaker is standing in, what they look like, and which object on
 * the set each line is about.
 *
 * Why two rooms. Read the script and it is plainly a phone call — Sijan is in
 * the shop ("Die Milch ist leider aus"), Shruti is not ("Ich backe am
 * Wochenende einen Kuchen"), and it ends with "Ich bin in fünf Minuten zu
 * Hause". Putting them side by side in one aisle would have been easier and
 * would have quietly contradicted the last line of the dialogue.
 *
 * The anchors a callout can name live with the set that draws them, in
 * components/sets/, not here. They used to be copied into this file and the
 * first time a room moved they stayed behind, pointing at nothing.
 */

import type { Scene } from "../types";

export const c002: Scene = {
  id: "c002",

  rooms: [
    { set: "supermarkt", from: 0, to: 960 },
    /* Labelled for the contrast with the shop rather than as a room. */
    { set: "kueche", from: 960, to: 1920, label: "Zu Hause" }
  ],

  /*
   * Where each speaker stands and what they look like. `x` is the centre of the
   * head; everything else in the drawing hangs off it. Both are pushed towards
   * the outer edges so the bubble can sit across the middle without covering a
   * face — the one thing in the frame that has to stay readable.
   */
  cast: {
    Sijan: {
      room: 0,
      x: 258,
      headY: 470,
      scale: 1,
      skin: "#c98f63",
      skinShade: "#b67f56",
      hair: "#2f2723",
      hairStyle: "short",
      beard: true,
      top: "#3f6b8f",
      topDark: "#355b7a",
      /* He is the one in the shop, so he is the one with a basket. */
      basket: true
    },
    Shruti: {
      room: 1,
      x: 1664,
      headY: 470,
      scale: 1,
      skin: "#cf9a72",
      skinShade: "#bc8862",
      hair: "#3a2a26",
      hairStyle: "bun",
      beard: false,
      top: "#9c5068",
      topDark: "#89455a",
      basket: false
    }
  },

  /*
   * One callout per line, at most, and most lines have none. A pointer that
   * fires on every line is wallpaper; the ones here land on the lines where a
   * learner actually gains something from being shown the noun rather than
   * only told it. `at` is the anchor, `label` is what the tag says, and `word`
   * is the word in the German that the callout waits for before appearing.
   */
  callouts: {
    2: { at: "kuehlregal", label: "die Milch", word: "Milch" },
    3: { at: "kuehlregal", label: "die Hafermilch", word: "Hafermilch" },
    4: { at: "auslage", label: "die Eier", word: "Eier" },
    5: { at: "kuchen", label: "der Kuchen", word: "Kuchen" },
    6: { at: "auslage", label: "die Tomaten", word: "Tomaten" },
    9: { at: "vorrat", label: "die Marmelade", word: "Marmelade" },
    10: { at: "kasse", label: "die Kasse", word: "Kasse" },
    11: { at: "kasse", label: "die SB-Kasse", word: "Selbstbedienungskasse" }
  },

  /*
   * The card at the end. Six words, because a grid of six reads at a glance and
   * a grid of ten is a list you skip. The English matches js/vocab.js where the
   * word is in there, so the film and the Vokabeln tab never disagree.
   */
  wortschatz: [
    { de: "die Milch", en: "milk" },
    { de: "die Hafermilch", en: "oat milk" },
    { de: "die Eier", en: "eggs" },
    { de: "die Marmelade", en: "jam" },
    { de: "die Kasse", en: "checkout, till" },
    { de: "die Schlange", en: "queue" }
  ]
};
