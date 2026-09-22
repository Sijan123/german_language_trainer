/*
 * Staging for c025 — "Die Bewerbung durchgehen".
 *
 * Topic "arbeit", and not set at work: this is the two of them at home going
 * over a cover letter, the same way c005 is the evening after the first day
 * rather than the day itself. The bedroom and the living room, together, no
 * phones.
 *
 * The scaffolder also proposed a ring on the window for "morgen" on line 11.
 * That is the "Guten Abend" failure — a time word matching a set's weather
 * keywords — and it is dropped.
 */

import type { Scene } from "../types";

export const c025: Scene = {
  id: "c025",

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

  /* "Brauche ich ein Foto?" — the shelf carries the framed photograph, and it
     is the one object in this dialogue that is actually in the room. */
  callouts: {
    7: { at: "regal", label: "das Foto", word: "Foto" }
  },

  thoughts: {
    1: { icon: "brief", label: "das Anschreiben", word: "Anschreiben" },
    10: { icon: "kalender", label: "die Frist", word: "Frist" }
  },

  wortschatz: [
    { de: "die Bewerbung", en: "application" },
    { de: "das Anschreiben", en: "cover letter" },
    { de: "die Ausbildung", en: "training, apprenticeship" },
    { de: "die Erfahrung", en: "experience" },
    { de: "die Frist", en: "deadline" },
    { de: "schicken", en: "to send" }
  ]
};
