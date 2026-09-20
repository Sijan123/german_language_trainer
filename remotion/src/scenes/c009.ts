/*
 * Staging for c009 — "Was machen wir am Wochenende?".
 *
 * A Saturday being planned before it starts, which is a thing said across a
 * flat first thing in the morning: the bedroom for Sijan, who opens with
 * "Hast du am Samstag schon etwas vor?", and the kitchen for Shruti, who
 * closes it making sandwiches for the trip.
 *
 * The scaffolder proposed wohnzimmer + kueche. Both of those sets are drawn
 * for the right-hand half, so one would have had to be shifted into the left
 * — and the living room shifted left puts its sofa exactly where the figure
 * standing there is. The bedroom is the only home set drawn for the left.
 */

import type { Scene } from "../types";

export const c009: Scene = {
  id: "c009",

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

  /*
   * Two. The weekend itself — the lake, the bikes, the flat tyre, the pump in
   * the cellar, the camera — is all somewhere else, so there is not much in
   * either room to point at.
   *
   * "das Wetter" goes to the bedroom window because room 0 is searched first
   * and both rooms own a `fenster`; that is the one the sentence wants
   * anyway, since he is the one looking out of it. The scaffolder also
   * proposed ringing a radiator for "zwanzig Grad" — a sunny forecast is not
   * the heating, and it was dropped for the same reason as c004's.
   */
  callouts: {
    3: { at: "fenster", label: "das Wetter", word: "Wetter" },
    9: { at: "fruehstueck", label: "die Brote", word: "Brote" }
  },

  wortschatz: [
    { de: "der See", en: "lake" },
    { de: "das Fahrrad", en: "bicycle" },
    { de: "der Reifen", en: "tyre" },
    { de: "die Pumpe", en: "pump" },
    { de: "der Keller", en: "cellar" },
    { de: "die Kamera", en: "camera" }
  ]
};
