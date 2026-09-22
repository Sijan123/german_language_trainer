/*
 * Staging for c031 — "Ein gebrauchtes Fahrrad kaufen".
 *
 * "0 of 13", and the third dialogue topic "unterwegs" sent to a bus stop.
 * Line 1 is "es steht hier in der Garage", so the bike is propped against the
 * garage door on the street set and the seller is standing next to it.
 *
 * Shruti is the buyer and speaks first.
 *
 * Note what is *not* ringed. Line 6 is "die Bremsen sind ein bisschen weich"
 * and the set does own a `bremse` anchor — but that one is the brake on the
 * car, drawn for c029, and ringing it here would point at the wrong vehicle.
 */

import type { Scene } from "../types";

export const c031: Scene = {
  id: "c031",

  call: false,

  rooms: [
    { set: "strasse", from: 0, to: 1920, label: "Garage" }
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

  callouts: {
    0: { at: "fahrrad", label: "das Fahrrad", word: "Fahrrads" }
  },

  thoughts: {
    3: { icon: "kalender", label: "drei Jahre", word: "Jahre" },
    9: { icon: "geld", label: "hundertachtzig Euro", word: "Euro" }
  },

  wortschatz: [
    { de: "gebraucht", en: "second-hand" },
    { de: "das Fahrrad", en: "bicycle" },
    { de: "die Garage", en: "garage" },
    { de: "die Bremse", en: "brake" },
    { de: "einstellen", en: "to adjust" },
    { de: "das Schloss", en: "lock" }
  ]
};
