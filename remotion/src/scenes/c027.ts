/*
 * Staging for c027 — "Zahnschmerzen".
 *
 * She notices he is not eating, so they are at the same table and not in two
 * halves of the flat: the full-frame kitchen, both in room 0, no phones. The
 * scaffolder's split of bedroom and kitchen would have put the person who is
 * not eating in a different room from the meal he is not eating.
 *
 * Its one proposed callout was the window for "morgen", which is a time word
 * hitting a weather keyword, and is dropped.
 */

import type { Scene } from "../types";

export const c027: Scene = {
  id: "c027",

  call: false,

  rooms: [
    { set: "kuecheGross", from: 0, to: 1920 }
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

  /* The pot on the hob, for the line about hot food hurting. It sits at
     x 700-890, clear of both figure bands (285-555 and 1365-1635). */
  callouts: {
    9: { at: "topf", label: "heißes Essen", word: "Heißes" }
  },

  thoughts: {
    1: { icon: "zahn", label: "der Zahn", word: "Zahn" },
    3: { icon: "kalender", label: "das Wochenende", word: "Wochenende" },
    6: { icon: "handy", label: "beim Zahnarzt anrufen", word: "Zahnarzt" }
  },

  wortschatz: [
    { de: "der Zahn", en: "tooth" },
    { de: "wehtun", en: "to hurt" },
    { de: "kauen", en: "to chew" },
    { de: "der Zahnarzt", en: "dentist" },
    { de: "das Wochenende", en: "weekend" },
    { de: "anrufen", en: "to call" }
  ]
};
