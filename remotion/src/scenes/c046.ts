/*
 * Staging for c046 — "Einen Tisch reservieren".
 *
 * A phone call into a restaurant, so the restaurant is on the line's far end.
 * It is a full-frame set used as the left half, which shows its own x 0-960 —
 * the window wall and the left end of the table.
 *
 * No callouts, and the reason is worth writing down: the restaurant's `tisch`
 * anchor runs x 636-1284 and the room only shows up to 960, so a ring on the
 * very table being reserved would have been drawn half outside the room it
 * belongs to. An anchor that is clipped by its own room is not a callout, it
 * is a rectangle with an arrow pointing off the edge.
 */

import type { Scene } from "../types";

export const c046: Scene = {
  id: "c046",

  rooms: [
    { set: "restaurant", from: 0, to: 960, label: "Restaurant" },
    { set: "wohnzimmer", from: 960, to: 1920 }
  ],

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

  callouts: {},

  thoughts: {
    3: { icon: "kalender", label: "der Samstag", word: "Samstag" },
    5: { icon: "uhr", label: "neunzehn Uhr", word: "Uhr" },
    10: { icon: "ausweis", label: "der Name", word: "Namen" }
  },

  wortschatz: [
    { de: "reservieren", en: "to book, to reserve" },
    { de: "die Person", en: "person" },
    { de: "voll", en: "full" },
    { de: "der Samstag", en: "Saturday" },
    { de: "der Name", en: "name" },
    { de: "reichen", en: "to be enough" }
  ]
};
