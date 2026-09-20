/*
 * Staging for c008 — "Der Zug hat Verspätung".
 *
 * Two people travelling together on one platform, so one full-frame set and
 * no handsets. The set is new (src/components/sets/Bahnhof.tsx).
 *
 * The departure board is doing the work here. Everything this dialogue turns
 * on — twenty minutes late, a missed connection, platform five instead of
 * three — is a number on a board rather than a thing you can hold, which is
 * why that board is drawn large and amber and given its own anchor.
 */

import type { Scene } from "../types";

export const c008: Scene = {
  id: "c008",
  call: false,

  rooms: [
    { set: "bahnhof", from: 0, to: 1920 }
  ],

  /* `x` is the centre of the head. Both are pushed towards the outer edges so
     the speech bubble can sit across the middle without covering a face. */
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

  /* One callout per line at most, and most lines have none. `word` is the
     word in the German the ring waits for before it appears. */
  /*
   * Five on thirteen lines.
   *
   * Line 0 moved from the train to the board: the sentence is about the
   * delay, and the board is the thing that states it. Line 2 lost its pointer
   * altogether — the scaffolder rang the departure board for "die App", but
   * the app is a phone in her hand, not the board, and pointing at one while
   * saying the other teaches the wrong word. Line 10 moved from the train to
   * the platform plate for the same reason as line 0: "auf Gleis fünf, nicht
   * auf drei" is about the number, and the plate on the post reads 5.
   */
  callouts: {
    0: { at: "anzeigetafel", label: "die Verspätung", word: "Verspätung" },
    1: { at: "zug", label: "der Anschluss", word: "Anschluss" },
    7: { at: "rucksack", label: "der Rucksack", word: "Rucksack" },
    10: { at: "gleis", label: "das Gleis", word: "Gleis" },
    12: { at: "treppe", label: "die Treppe", word: "Treppe" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  /* The hotel and the dinner are real words in this dialogue but they are not
     what it teaches; a traveller who learns these six can handle the next
     delay without the film. */
  wortschatz: [
    { de: "die Verspätung", en: "delay" },
    { de: "der Anschluss", en: "connection (onward train)" },
    { de: "die Verbindung", en: "route, connection" },
    { de: "das Gleis", en: "platform, track" },
    { de: "der Aufzug", en: "lift" },
    { de: "der Rucksack", en: "backpack" }
  ]
};
