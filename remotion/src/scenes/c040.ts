/*
 * Staging for c040 — "Ein Brief vom Amt".
 *
 * Topic "amt" sent this to the Bürgerbüro, and it is the one "amt" dialogue
 * that is not set in one: nobody goes anywhere, they are at home reading a
 * letter that arrived. The counter, the forms and the number display would
 * all have been scenery for a conversation happening in a hallway.
 *
 * The scaffolder's single callout was the office out-tray for "Post" on line
 * 0, which is the same mistake in miniature — the post in this dialogue is in
 * their own letterbox.
 */

import type { Scene } from "../types";

export const c040: Scene = {
  id: "c040",

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

  callouts: {},

  thoughts: {
    0: { icon: "briefkasten", label: "der Briefkasten", word: "Briefkasten" },
    4: { icon: "brief", label: "die Bescheinigung", word: "Bescheinigung" },
    6: { icon: "geld", label: "das Gehalt", word: "Gehalts" },
    10: { icon: "kalender", label: "das Datum", word: "fünfzehnten" }
  },

  wortschatz: [
    { de: "das Amt", en: "public authority" },
    { de: "der Briefkasten", en: "letterbox" },
    { de: "die Bescheinigung", en: "certificate" },
    { de: "der Arbeitgeber", en: "employer" },
    { de: "das Gehalt", en: "salary" },
    { de: "das Datum", en: "date" }
  ]
};
