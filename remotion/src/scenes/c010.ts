/*
 * Staging for c010 — "Anmeldung beim Bürgerbüro".
 *
 * The only dialogue here between an official and a member of the public, and
 * the set is built to say so: one counter across the frame, Sijan in front of
 * it and Shruti behind. The set is new
 * (src/components/sets/Buergerbuero.tsx) and borrows the restaurant's trick —
 * the counter sits at the height the speech bubble starts, so the documents
 * lying on it fall in the band between the bubble and the faces, which is
 * where every noun in this dialogue lives.
 */

import type { Scene } from "../types";

export const c010: Scene = {
  id: "c010",
  call: false,

  rooms: [
    { set: "buergerbuero", from: 0, to: 1920 }
  ],

  /* `x` is the centre of the head. Both are pushed towards the outer edges so
     the speech bubble can sit across the middle without covering a face. */
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

  /* One callout per line at most, and most lines have none. `word` is the
     word in the German the ring waits for before it appears. */
  /*
   * Four. Two of them share an anchor on purpose: line 3 asks for "Ihren
   * Ausweis" and line 4 answers with "mein Pass", and ringing the same
   * document twice under two names is the clearest way to show that a German
   * official will accept either word. Same reasoning as c004's Heizung and
   * Heizkörper.
   *
   * The scaffolder's fourth was a ring round the waiting chairs labelled "die
   * Post", for "Die Bestätigung kommt per Post" — the letter, not the
   * furniture. Dropped, and "post" taken out of the set's keyword list so it
   * cannot be proposed again.
   */
  callouts: {
    1: { at: "nummer", label: "der Termin", word: "Termin" },
    3: { at: "ausweis", label: "der Ausweis", word: "Ausweis" },
    4: { at: "ausweis", label: "der Pass", word: "Pass" },
    9: { at: "formular", label: "das Formular", word: "Formular" },
    11: { at: "post", label: "die Post", word: "Post" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  /* "der März" was in the scaffolder's list because he moved in on the first
     of March. It is a month, not something this film teaches. */
  wortschatz: [
    { de: "die Anmeldung", en: "registration" },
    { de: "der Termin", en: "appointment" },
    { de: "der Ausweis", en: "ID card" },
    { de: "der Pass", en: "passport" },
    { de: "das Formular", en: "form" },
    { de: "die Bestätigung", en: "confirmation" }
  ]
};
