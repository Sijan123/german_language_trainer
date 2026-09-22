/*
 * Staging for c036 — "Im Sportverein anmelden".
 *
 * "0 of 13" in a living room, which is what topic "freizeit" defaults to.
 * Unlike c035 and c037 — which really are two people at home deciding whether
 * to go out — this one is already there: he is asking whether he can join in,
 * she answers as someone who trains here, and line 11 tells him where the
 * entrance is. That is a conversation on a court.
 *
 * Sijan speaks first and takes the left.
 */

import type { Scene } from "../types";

export const c036: Scene = {
  id: "c036",

  call: false,

  rooms: [
    { set: "halle", from: 0, to: 1920 }
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

  callouts: {
    0: { at: "ball", label: "mitspielen", word: "mitspielen" },
    3: { at: "schild", label: "der Trainingsplan", word: "Dienstags" },
    9: { at: "schuhe", label: "die Hallenschuhe", word: "Hallenschuhe" }
  },

  thoughts: {
    7: { icon: "geld", label: "zwölf Euro im Monat", word: "Euro" }
  },

  wortschatz: [
    { de: "der Sportverein", en: "sports club" },
    { de: "trainieren", en: "to train" },
    { de: "das Mitglied", en: "member" },
    { de: "der Beitrag", en: "membership fee" },
    { de: "die Halle", en: "hall" },
    { de: "der Eingang", en: "entrance" }
  ]
};
