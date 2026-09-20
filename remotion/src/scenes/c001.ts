/*
 * Staging for c001 — "Der Wecker hat nicht geklingelt".
 *
 * Scaffolded by scripts/new-scene.mjs, then edited. What the scaffolder got
 * right on its own: the bedroom and the kitchen, and a callout on "der Wecker"
 * the moment the word is spoken, which is the whole dialogue in one image.
 *
 * What it could not know, and what was changed:
 *
 *   call: false   These two are not on the phone. They live together and it is
 *                 half past seven: she is up and in the kitchen, he is only
 *                 just out of bed because the alarm never went off. Two people
 *                 in one flat holding handsets to their ears would be absurd,
 *                 so nobody holds one and the name chip drops its phone glyph.
 *
 *   who is where  The scaffolder puts whoever speaks first in the left-hand
 *                 room, and Shruti speaks first. But the room on the left is
 *                 the bedroom and the person in it has to be the one whose
 *                 alarm failed, so the two are swapped.
 *
 *   line 8        "Kaffee" matched the jar shelf before the breakfast board,
 *                 because that is the order the anchors happen to be in. The
 *                 mug is the better thing to point at.
 */

import type { Scene } from "../types";

export const c001: Scene = {
  id: "c001",
  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "kueche", from: 960, to: 1920 }
  ],

  /* `x` is the centre of the head. Both are pushed towards the outer edges so
     the speech bubble can sit across the middle without covering a face. */
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
      top: "#6b7f9c",
      topDark: "#5b6d87",
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

  /* One callout per line at most, and most lines have none. `word` is the
     word in the German the ring waits for before it appears. */
  callouts: {
    1: { at: "wecker", label: "der Wecker", word: "Wecker" },
    6: { at: "fruehstueck", label: "das Brot", word: "Brot" },
    8: { at: "fruehstueck", label: "der Kaffee", word: "Kaffee" },
    11: { at: "wecker", label: "der Wecker", word: "Wecker" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  wortschatz: [
    { de: "der Wecker", en: "alarm clock" },
    { de: "der Abend", en: "evening" },
    { de: "der Akku", en: "battery" },
    { de: "das Brot", en: "bread" },
    { de: "der Kaffee", en: "coffee" },
    { de: "die Zeit", en: "time" }
  ]
};
