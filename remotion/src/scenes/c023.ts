/*
 * Staging for c023 — "Urlaub beantragen".
 *
 * The one dialogue in this batch that genuinely needed a room drawing. It is
 * not a couple at home talking about work the way c005 and c025 are: it opens
 * on "Haben Sie kurz Zeit?", it is in Sie throughout, and the other person can
 * approve or refuse two weeks in August. That is a conversation with a
 * manager, in an office, and the scaffolder's bedroom-and-living-room split
 * would have put a line manager in someone's flat.
 *
 * So `buero`, full frame, both in room 0, no phones. Sijan speaks first and
 * takes the left seat; Shruti is the manager.
 *
 * The scaffolder found nothing at all here, which was true of every set that
 * existed at the time — none of them had a calendar on the wall.
 */

import type { Scene } from "../types";

export const c023: Scene = {
  id: "c023",

  call: false,

  rooms: [
    { set: "buero", from: 0, to: 1920 }
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

  /*
   * The wall planner twice, which would normally be a stutter — but the two
   * hits are six lines apart and they are the two halves of the negotiation:
   * the fortnight he asks for on line 4, and the date she offers instead on
   * line 9. Ringing the same calendar for both is the point.
   */
  callouts: {
    2: { at: "kalender", label: "der Urlaub", word: "Urlaub" },
    9: { at: "kalender", label: "ab dem siebzehnten", word: "siebzehnten" },
    11: { at: "schreibtisch", label: "der Antrag", word: "Antrag" }
  },

  thoughts: {
    6: { icon: "koffer", label: "nach Nepal fliegen", word: "Nepal" }
  },

  wortschatz: [
    { de: "der Urlaub", en: "holiday, leave" },
    { de: "beantragen", en: "to apply for" },
    { de: "die Woche", en: "week" },
    { de: "umbuchen", en: "to rebook" },
    { de: "der Antrag", en: "application, request" },
    { de: "stellen", en: "to submit, to put" }
  ]
};
