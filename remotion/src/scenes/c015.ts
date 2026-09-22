/*
 * Staging for c015 - "Samstag auf dem Markt".
 *
 * A couple shopping together, so one full-frame set rather than the
 * supermarket-and-kitchen split the topic proposed. The point of the dialogue
 * is that a market is not a supermarket: you pay cash, the cheese stall sells
 * out, and you come earlier next week.
 */

import type { Scene } from "../types";

export const c015: Scene = {
  id: "c015",

  call: false,

  rooms: [
    { set: "markt", from: 0, to: 1920 }
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
    0: { at: "erdbeeren", label: "die Erdbeeren", word: "Erdbeeren" },
    1: { at: "preis", label: "was kostet es?", word: "kostet" },
    4: { at: "kartoffeln", label: "die Kartoffeln", word: "Kartoffeln" },
    6: { at: "kaesestand", label: "der Käsestand", word: "Käsestand" }
  },

  thoughts: {
    9: { icon: "geld", label: "das Bargeld", word: "Bargeld" }
  },

  wortschatz: [
    { de: "die Erdbeere", en: "strawberry" },
    { de: "die Schale", en: "punnet, bowl" },
    { de: "die Kartoffel", en: "potato" },
    { de: "der Käsestand", en: "cheese stall" },
    { de: "das Bargeld", en: "cash" },
    { de: "die Karte", en: "card" }
  ]
};
