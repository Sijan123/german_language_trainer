/*
 * Staging for c041 — "Einen Termin verschieben".
 *
 * A phone call, so two rooms and `call` left at its default. The scaffolder
 * put a kitchen on the other end of the line, which is wrong for a receptionist
 * with a diary in front of her.
 *
 * The right-hand room is the Bürgerbüro used as a half. It is a full-frame set
 * (width 1920, origin 0) dropped into the 960-wide right half, so the frame
 * shows the office's own x 0-960 — the waiting chairs and the left end of the
 * counter — and `findAnchor` shifts its boxes by +960 to match. The figure at
 * x=1664 lands at office x=704, which is behind the counter, which is where a
 * receptionist should be standing.
 */

import type { Scene } from "../types";

export const c041: Scene = {
  id: "c041",

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "buergerbuero", from: 960, to: 1920, label: "Praxis" }
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
    2: { icon: "kalender", label: "der Termin", word: "Termin" },
    7: { icon: "uhr", label: "vierzehn Uhr", word: "Uhr" },
    8: { icon: "schreibtisch", label: "arbeiten", word: "arbeite" }
  },

  wortschatz: [
    { de: "der Termin", en: "appointment" },
    { de: "verschieben", en: "to postpone" },
    { de: "passen", en: "to suit" },
    { de: "der Mittwoch", en: "Wednesday" },
    { de: "der Donnerstag", en: "Thursday" },
    { de: "eintragen", en: "to enter, to write in" }
  ]
};
