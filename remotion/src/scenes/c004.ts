/*
 * Staging for c004 — "Die Heizung wird nicht warm".
 *
 * Scaffolded by scripts/new-scene.mjs from the dialogue, the set registry and
 * js/vocab.js. Read it before rendering: the parts it cannot know are marked
 * TODO, and a first draft that nobody read is how a film ends up set in the
 * wrong room.
 *
 * TODO Are these two in the same place, or on the phone? The scaffolder
 *      splits them into two rooms because that is right more often than not.
 *      If they are together, give the scene a full-width set instead, put
 *      both in room 0, and set call: false.
 * TODO Check each callout actually earns its place, and that the labels read
 *      the way you would say them.
 */

import type { Scene } from "../types";

export const c004: Scene = {
  id: "c004",

  rooms: [
    { set: "wohnzimmer", from: 0, to: 960 },
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
      skin: "#c98f63",
      skinShade: "#b67f56",
      hair: "#2f2723",
      hairStyle: "short",
      beard: true,
      top: "#3f6b8f",
      topDark: "#355b7a",
      basket: false
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

  /* One callout per line at most, and most lines have none. `word` is the
     word in the German the ring waits for before it appears. */
  callouts: {
    1: { at: "heizung", label: "die Heizung", word: "Heizung" },
    6: { at: "regal", label: "der Schlüssel", word: "Schlüssel" },
    9: { at: "heizung", label: "der Grad", word: "Grad" },
    10: { at: "regal", label: "der Schrank", word: "Schrank" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  wortschatz: [
    { de: "das Wohnzimmer", en: "living room" },
    { de: "die Heizung", en: "heating" },
    { de: "der Morgen", en: "morning" },
    { de: "die Luft", en: "air" },
    { de: "der Schlüssel", en: "key" },
    { de: "der Vermieter", en: "landlord" }
  ]
};
