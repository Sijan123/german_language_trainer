/*
 * Staging for c034 — "Einen Ausflug planen".
 *
 * Topic "reisen" sent this to the station, and it does not belong there: the
 * two are sitting somewhere planning tomorrow, and everything they name — the
 * island, the ferry, the harbour, the bikes — is somewhere they are not. That
 * is the c005 case exactly, so it is staged at home and illustrated with
 * thoughts rather than rings.
 *
 * Nothing is ringed here at all, which is unusual and correct. There is no
 * object in this dialogue that is in the room with them.
 */

import type { Scene } from "../types";

export const c034: Scene = {
  id: "c034",

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
    3: { icon: "schiff", label: "die Fähre", word: "Fähre" },
    4: { icon: "geld", label: "die Fahrt", word: "Fahrt" },
    7: { icon: "uhr", label: "eine Stunde", word: "Stunde" },
    8: { icon: "fahrrad", label: "das Rad", word: "Räder" }
  },

  wortschatz: [
    { de: "der Ausflug", en: "day trip" },
    { de: "die Insel", en: "island" },
    { de: "die Fähre", en: "ferry" },
    { de: "die Fahrt", en: "journey, crossing" },
    { de: "leihen", en: "to hire, to borrow" },
    { de: "der Hafen", en: "harbour" }
  ]
};
