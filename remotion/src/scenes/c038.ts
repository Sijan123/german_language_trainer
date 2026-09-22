/*
 * Staging for c038 — "Den Führerschein umschreiben".
 *
 * A counter dialogue in a public office, which is what the Bürgerbüro was
 * drawn for, so this one keeps the room the topic gave it. Sijan speaks first
 * and takes the left seat; Shruti is the clerk.
 *
 * The scaffolder proposed nothing here — "Führerschein", "Übersetzung" and
 * "Prüfung" are not in any set's keyword list — but the room does hold a
 * document and a form, and those are exactly what the first four lines are
 * about.
 */

import type { Scene } from "../types";

export const c038: Scene = {
  id: "c038",

  call: false,

  rooms: [
    { set: "buergerbuero", from: 0, to: 1920 }
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

  /* The document on the counter for the licence itself, the form beside it
     for the translation. Both sit in the centre band, clear of the two
     figures at x=420 and x=1500. */
  callouts: {
    0: { at: "ausweis", label: "der Führerschein", word: "Führerschein" },
    3: { at: "formular", label: "die Übersetzung", word: "Übersetzung" }
  },

  thoughts: {
    11: { icon: "kalender", label: "drei Monate", word: "Monate" },
    12: { icon: "auto", label: "die Fahrschule", word: "Fahrschule" }
  },

  wortschatz: [
    { de: "der Führerschein", en: "driving licence" },
    { de: "die Übersetzung", en: "translation" },
    { de: "das Foto", en: "photo" },
    { de: "die Prüfung", en: "test, exam" },
    { de: "dauern", en: "to take, to last" },
    { de: "die Fahrschule", en: "driving school" }
  ]
};
