/*
 * Staging for c007 — "Welcher Bus fährt zum Bahnhof?".
 *
 * The first film with no couple in it: a stranger asks another stranger which
 * bus goes where. One full-frame set, both of them on the same kerb, `call`
 * off — a handset in each hand would be absurd for two people close enough to
 * say "Entschuldigung" to each other.
 *
 * The set is new (src/components/sets/Bushaltestelle.tsx) and was drawn for
 * this dialogue: the bus, the stop plate, the timetable case, the ticket
 * machine and the pavement opposite are exactly the five things these twelve
 * lines talk about.
 */

import type { Scene } from "../types";

export const c007: Scene = {
  id: "c007",
  call: false,

  rooms: [
    { set: "bushaltestelle", from: 0, to: 1920 }
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
   * Four, one per anchor, none repeated.
   *
   * The scaffolder proposed ringing the far pavement on line 1 for "die
   * Richtung", which is a direction rather than a place; line 3 says "sie
   * hält auf der anderen Straßenseite" and means the pavement literally, so
   * the pointer moved there. It also wanted to close on the bus again at line
   * 11 — a nice bookend, but the opening line already rings it, and twice
   * round the same object is how a pointer stops being noticed.
   */
  callouts: {
    0: { at: "bus", label: "der Bus", word: "Bus" },
    3: { at: "strasse", label: "die andere Straßenseite", word: "Straßenseite" },
    4: { at: "fahrplan", label: "die Fahrt", word: "Fahrt" },
    6: { at: "automat", label: "die Fahrkarte", word: "Fahrkarte" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  /* "Entschuldigung" was in the scaffolder's list; it is a word worth knowing
     but it is not a noun and the card is a noun card. */
  wortschatz: [
    { de: "der Bahnhof", en: "train station" },
    { de: "die Haltestelle", en: "bus stop" },
    { de: "die Richtung", en: "direction" },
    { de: "die Fahrkarte", en: "ticket" },
    { de: "der Fahrer", en: "driver" },
    { de: "die Fahrt", en: "journey, ride" }
  ]
};
