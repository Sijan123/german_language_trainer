/*
 * Staging for c026 — "In der Apotheke".
 *
 * The scaffolder reported "0 of 13", which the handoff calls the strongest
 * signal this project produces, and it was right: topic "gesundheit" defaults
 * to a bedroom and a kitchen, and this is a customer at a pharmacy counter
 * describing a cough to a pharmacist. Nothing in a flat has anything to do
 * with it.
 *
 * Its own set, full frame, both in room 0, no phones. Sijan is the customer
 * and speaks first; Shruti is the pharmacist.
 */

import type { Scene } from "../types";

export const c026: Scene = {
  id: "c026",

  call: false,

  rooms: [
    { set: "apotheke", from: 0, to: 1920 }
  ],

  cast: {
    Sijan: {
      room: 0,
      x: 420,
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
      room: 0,
      x: 1500,
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

  /* The prescription on line 1, the syrup on line 7 — the two objects the
     dialogue actually turns on, six lines apart. */
  callouts: {
    1: { at: "rezept", label: "das Rezept", word: "Rezept" },
    7: { at: "saft", label: "der Hustensaft", word: "Saft" }
  },

  thoughts: {
    4: { icon: "kalender", label: "seit drei Tagen", word: "Tagen" },
    9: { icon: "uhr", label: "dreimal am Tag", word: "Dreimal" }
  },

  wortschatz: [
    { de: "der Husten", en: "cough" },
    { de: "das Rezept", en: "prescription" },
    { de: "das Fieber", en: "fever" },
    { de: "die Halsschmerzen", en: "sore throat" },
    { de: "der Saft", en: "syrup, juice" },
    { de: "die Beratung", en: "advice" }
  ]
};
