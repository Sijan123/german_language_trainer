/*
 * Staging for c016 — "Das Paket ist nicht angekommen".
 *
 * The scaffolder proposed supermarkt + kueche and reported *0 of 12*
 * callouts, which is the clearest signal in this project that a dialogue has
 * been put in the wrong place. Nothing in this conversation is in any room:
 * the parcel, the app, the neighbour, the note in the letterbox, the depot
 * and the ID card are all elsewhere or abstract.
 *
 * So it is staged at home — where they actually are — and every pointer is a
 * thought. This is the second film after c005 built entirely that way.
 */

import type { Scene } from "../types";

export const c016: Scene = {
  id: "c016",

  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
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
    0: { icon: "paket", label: "das Paket", word: "Paket" },
    5: { icon: "briefkasten", label: "der Briefkasten", word: "Briefkasten" },
    6: { icon: "gebaeude", label: "die Filiale", word: "Filiale" },
    9: { icon: "ausweis", label: "der Ausweis", word: "Ausweis" }
  },

  wortschatz: [
    { de: "das Paket", en: "parcel" },
    { de: "der Nachbar", en: "neighbour" },
    { de: "der Zettel", en: "note, slip" },
    { de: "der Briefkasten", en: "letterbox" },
    { de: "die Filiale", en: "branch, depot" },
    { de: "der Ausweis", en: "ID card" }
  ]
};
