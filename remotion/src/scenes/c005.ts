/*
 * Staging for c005 — "Der erste Tag im Büro".
 *
 * The handoff lists this one as "needs a room", meaning an office. It does
 * not. The dialogue is the evening *after* the first day — "Und? Wie war
 * dein erster Tag?" — so the office is only ever talked about, never seen,
 * and a Büro set would be a room neither of them is standing in. They are at
 * home, and the last line ("Den Wecker stelle ich") says where: near bedtime.
 *
 * Hence the bedroom for Shruti, who is the one setting the alarm, and the
 * living room for Sijan, home from work. Both sets sit in the half they were
 * drawn for, so no anchor box is shifted.
 */

import type { Scene } from "../types";

export const c005: Scene = {
  id: "c005",

  /* Two rooms of one flat. */
  call: false,

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "wohnzimmer", from: 960, to: 1920 }
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
   * One, and that is the honest number.
   *
   * Almost every noun in this dialogue belongs to a building neither of them
   * is in — the desk, the canteen, the boss, the third floor. The scaffolder
   * proposed ringing the living-room window for "direkt am Fenster", which is
   * the office window seven lines away from here; that is the "Guten Abend
   * hits the restaurant window" mistake and it was dropped. The alarm clock
   * is the one thing the dialogue names that is actually in shot, and it is
   * the last line of the film, which is a good place to land a pointer.
   */
  callouts: {
    12: { at: "wecker", label: "der Wecker", word: "Wecker" }
  },

  /*
   * The office, imagined.
   *
   * This is the film that needed thought bubbles. Everything c005 teaches —
   * the boss, the desk, the canteen, tomorrow's bus — belongs to a building
   * neither of them is standing in, so there was nothing in either room to
   * ring and the film ran thirteen lines on a single pointer.
   *
   * Four, spread across the second half, none of them on a line that already
   * has a callout. They stop before the last two lines on purpose: "Ich bin
   * stolz auf dich" is the point of the scene and wants the screen to itself,
   * with only the alarm clock — a real object, in a real room — to close on.
   */
  thoughts: {
    4: { icon: "chef", label: "der Chef", word: "Chef" },
    6: { icon: "schreibtisch", label: "der Schreibtisch", word: "Schreibtisch" },
    8: { icon: "kantine", label: "die Kantine", word: "Kantine" },
    11: { icon: "bus", label: "der Bus", word: "Bus" }
  },

  /* The office vocabulary the film is really teaching, even though the office
     is never on screen. */
  wortschatz: [
    { de: "der Kollege", en: "colleague (male)" },
    { de: "die Kollegin", en: "colleague (female)" },
    { de: "der Chef", en: "boss" },
    { de: "die Besprechung", en: "meeting" },
    { de: "der Schreibtisch", en: "desk" },
    { de: "die Kantine", en: "canteen" }
  ]
};
