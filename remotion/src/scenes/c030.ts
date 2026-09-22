/*
 * Staging for c030 — "Ein Zettel an der Windschutzscheibe".
 *
 * "0 of 13" at the bus stop. This one is standing over a parked car reading a
 * fine, and the set was drawn with the slip of paper already under the wiper
 * so that line 0 has something to ring rather than something to imagine.
 *
 * Sijan speaks first and takes the left.
 */

import type { Scene } from "../types";

export const c030: Scene = {
  id: "c030",

  call: false,

  rooms: [
    { set: "strasse", from: 0, to: 1920 }
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
    0: { at: "scheibe", label: "die Windschutzscheibe", word: "Scheibe" },
    4: { at: "schild", label: "das Schild", word: "Schild" }
  },

  thoughts: {
    2: { icon: "geld", label: "dreißig Euro", word: "Euro" },
    10: { icon: "kalender", label: "zwei Wochen", word: "Wochen" }
  },

  wortschatz: [
    { de: "der Zettel", en: "note, slip" },
    { de: "der Strafzettel", en: "parking fine" },
    { de: "parken", en: "to park" },
    { de: "der Parkschein", en: "parking ticket" },
    { de: "das Schild", en: "sign" },
    { de: "überweisen", en: "to transfer money" }
  ]
};
