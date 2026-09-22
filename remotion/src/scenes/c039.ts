/*
 * Staging for c039 — "Ein Konto eröffnen".
 *
 * A bank rather than a Bürgerbüro, but it is the same shot: a counter, a
 * person behind it, an ID document and a form on top. The set is reused with
 * its label overridden, which is what `Room.label` is for — drawing a second
 * counter that differs only in the word on the chip would be the expensive
 * way to change one noun.
 *
 * Shruti is the customer and speaks first; Sijan is the clerk.
 */

import type { Scene } from "../types";

export const c039: Scene = {
  id: "c039",

  call: false,

  rooms: [
    { set: "buergerbuero", from: 0, to: 1920, label: "Bank" }
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

  /* Three, which is the most any of these films carries, and they are spread
     across the dialogue rather than bunched: the ID at the start, the post
     two thirds in, the signature on the last line. */
  callouts: {
    1: { at: "ausweis", label: "der Ausweis", word: "Ausweis" },
    9: { at: "post", label: "per Post", word: "Post" },
    12: { at: "formular", label: "unterschreiben", word: "unterschreibe" }
  },

  thoughts: {
    8: { icon: "karte", label: "die Karte", word: "Karte" }
  },

  wortschatz: [
    { de: "das Konto", en: "account" },
    { de: "der Ausweis", en: "ID card" },
    { de: "das Gehalt", en: "salary" },
    { de: "die Miete", en: "rent" },
    { de: "die Karte", en: "card" },
    { de: "unterschreiben", en: "to sign" }
  ]
};
