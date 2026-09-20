/*
 * Staging for c006 — "Beim Arzt anrufen".
 *
 * Listed in the handoff as "needs a room" (a surgery). It does not: nobody
 * goes to the doctor in this dialogue, they ring one. It is a flat, in the
 * morning, with one of them ill — so the bedroom for Sijan, who is the one
 * coughing, and the kitchen for Shruti, who ends the film making him tea.
 *
 * The scaffolder put Shruti on the left because she speaks first. Swapped:
 * the left room is the bedroom and the person in it has to be the patient.
 */

import type { Scene } from "../types";

export const c006: Scene = {
  id: "c006",

  /* She is making him tea at the end of it — same flat, no handsets. The
     phone call in the title is the one he makes to the surgery, offscreen. */
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
   * One. An illness is mostly invisible: the cough, the throat, the fever,
   * the appointment and the insurance card are all things no room contains.
   * The scaffolder's two were both wrong — "achtunddreißig Grad" pointed at
   * a radiator (the fever is not the heating) and the tea went to a living
   * room that is not in this scene at all.
   *
   * The honey and the tea are on the kitchen's store shelf, which is also
   * the one kitchen anchor that sits completely clear of the figure standing
   * in that half.
   */
  callouts: {
    9: { at: "jacke", label: "die Jacke", word: "Jacke" },
    12: { at: "vorrat", label: "der Tee mit Honig", word: "Tee" }
  },

  /* What you actually need to ring a German surgery and be understood. */
  wortschatz: [
    { de: "der Husten", en: "cough" },
    { de: "der Hals", en: "throat" },
    { de: "das Fieber", en: "fever" },
    { de: "die Praxis", en: "doctor's surgery" },
    { de: "der Termin", en: "appointment" },
    { de: "die Versichertenkarte", en: "health insurance card" }
  ]
};
