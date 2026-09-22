/*
 * Staging for c049 — "Besuch am Wochenende".
 *
 * His parents are coming, so it is the bed and the food cupboard that the
 * dialogue keeps landing on: the bedroom for the guest bed on line 4, the
 * kitchen's shelf for the chilli on line 9.
 *
 * Note the kitchen ring is on `vorrat` and not on `fruehstueck` or `fenster`.
 * Those two run to x=1606 and x=1584 and the figure stands at 1664, so a ring
 * on either is clipped by a shoulder — c001 shipped like that and so does
 * c009. `vorrat` ends at 1286 and is clear.
 */

import type { Scene } from "../types";

export const c049: Scene = {
  id: "c049",

  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "kueche", from: 960, to: 1920 }
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

  callouts: {
    4: { at: "bett", label: "das Gästebett", word: "Gästebett" },
    9: { at: "vorrat", label: "das Chili", word: "Chili" }
  },

  thoughts: {
    0: { icon: "kalender", label: "am Samstag", word: "Samstag" },
    10: { icon: "gebaeude", label: "die Stadt", word: "Stadt" }
  },

  wortschatz: [
    { de: "der Besuch", en: "visit, visitors" },
    { de: "die Nacht", en: "night" },
    { de: "das Arbeitszimmer", en: "study" },
    { de: "aufräumen", en: "to tidy up" },
    { de: "scharf", en: "spicy" },
    { de: "der See", en: "lake" }
  ]
};
