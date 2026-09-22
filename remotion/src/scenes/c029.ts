/*
 * Staging for c029 — "Das Auto macht ein Geräusch".
 *
 * "0 of 12", and topic "unterwegs" had sent it to a bus stop. The first three
 * lines are two people listening to a noise from the front right of their own
 * car, which is not a thing that happens at a bus stop.
 *
 * The street set, full frame. Shruti speaks first and takes the left.
 */

import type { Scene } from "../types";

export const c029: Scene = {
  id: "c029",

  call: false,

  rooms: [
    { set: "strasse", from: 0, to: 1920 }
  ],

  cast: {
    Shruti: {
      room: 0,
      x: 420,
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
      room: 0,
      x: 1500,
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

  /* The brake disc for the noise, the whole car for the last line. The brake
     sits inside the car's own box, which is deliberate — they are two shots
     of the same object and the film uses both. */
  callouts: {
    3: { at: "bremse", label: "die Bremsen", word: "Bremsen" },
    11: { at: "auto", label: "das Auto", word: "Auto" }
  },

  thoughts: {
    5: { icon: "handy", label: "die Werkstatt", word: "Werkstatt" },
    7: { icon: "kalender", label: "der Donnerstag", word: "Donnerstag" }
  },

  wortschatz: [
    { de: "das Geräusch", en: "noise" },
    { de: "bremsen", en: "to brake" },
    { de: "die Bremse", en: "brake" },
    { de: "die Werkstatt", en: "garage" },
    { de: "der Termin", en: "appointment" },
    { de: "vorsichtig", en: "careful" }
  ]
};
