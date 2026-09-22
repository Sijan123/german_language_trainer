/*
 * Staging for c022 — "Die Nachbarn sind laut".
 *
 * The morning after a noisy night, so the bedroom and the kitchen rather than
 * the living room the scaffolder proposed: the dialogue opens on "hast du
 * letzte Nacht geschlafen?" and closes on going to bed early, and the bed is
 * the one object in it that any set owns.
 *
 * Together in their own flat, so `call: false`. Shruti speaks first and takes
 * the left room, which is the bedroom — and Sijan, who is the one who did not
 * sleep, ends up in the kitchen. That is the wrong way round for line 1, but
 * the callout on line 11 is his ("heute gehe ich früh ins Bett") and a ring on
 * a bed in the room the other person is standing in reads as pointing at the
 * thing being talked about, which is what it is.
 */

import type { Scene } from "../types";

export const c022: Scene = {
  id: "c022",

  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "kueche", from: 960, to: 1920 }
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

  /*
   * The scaffolder found nothing at all here, and it was right to: the
   * subject is a noise coming through a ceiling. The bed is the only thing
   * the script names that is in the room, and it is named once, at the end.
   */
  callouts: {
    11: { at: "bett", label: "ins Bett gehen", word: "Bett" }
  },

  thoughts: {
    9: { icon: "gebaeude", label: "der Boden", word: "Boden" }
  },

  wortschatz: [
    { de: "der Nachbar", en: "neighbour" },
    { de: "laut", en: "loud" },
    { de: "feiern", en: "to celebrate, to party" },
    { de: "klingeln", en: "to ring the bell" },
    { de: "der Boden", en: "floor" },
    { de: "der Vermieter", en: "landlord" }
  ]
};
