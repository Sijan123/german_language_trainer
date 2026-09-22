/*
 * Staging for c032 — "Ankunft im Hotel".
 *
 * Topic "reisen" sent this to the railway platform. It is a check-in at a
 * reception desk, which is a counter dialogue like c010, c018 and c026 — so
 * it gets a counter, and the three things it turns on are drawn on or behind
 * it: the keys, the card with the wifi password, the luggage.
 *
 * Sijan speaks first and takes the left; Shruti is on reception.
 */

import type { Scene } from "../types";

export const c032: Scene = {
  id: "c032",

  call: false,

  rooms: [
    { set: "rezeption", from: 0, to: 1920 }
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
    0: { at: "schluessel", label: "das Zimmer", word: "Zimmer" },
    7: { at: "karte", label: "die Karte", word: "Karte" },
    10: { at: "koffer", label: "das Gepäck", word: "Gepäck" }
  },

  thoughts: {
    5: { icon: "uhr", label: "ab halb sieben", word: "sieben" }
  },

  wortschatz: [
    { de: "reservieren", en: "to reserve" },
    { de: "das Doppelzimmer", en: "double room" },
    { de: "das Frühstück", en: "breakfast" },
    { de: "das Erdgeschoss", en: "ground floor" },
    { de: "die Rezeption", en: "reception" },
    { de: "das Gepäck", en: "luggage" }
  ]
};
