/*
 * Staging for c043 — "Eine Nachricht hinterlassen".
 *
 * Calling an office and being told the person is in a meeting, so the other
 * end of the line is the Bürgerbüro used as a half — see c041 for how a
 * full-frame set sits in a 960-wide room and what that does to its anchors.
 *
 * The scaffolder's one proposal was a ring on the living-room coffee table
 * labelled "das Handy", which is a keyword hit and not a thing that is there.
 * Dropped; the mobile gets a cloud instead, on the line that actually names it.
 */

import type { Scene } from "../types";

export const c043: Scene = {
  id: "c043",

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "buergerbuero", from: 960, to: 1920, label: "Büro" }
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
    1: { icon: "besprechung", label: "die Besprechung", word: "Besprechung" },
    3: { icon: "uhr", label: "ab elf", word: "elf" },
    6: { icon: "paket", label: "die Lieferung", word: "Lieferung" },
    8: { icon: "handy", label: "das Handy", word: "Handy" }
  },

  wortschatz: [
    { de: "die Besprechung", en: "meeting" },
    { de: "erreichbar", en: "reachable, available" },
    { de: "die Nachricht", en: "message" },
    { de: "die Lieferung", en: "delivery" },
    { de: "zurückrufen", en: "to call back" },
    { de: "das Handy", en: "mobile phone" }
  ]
};
