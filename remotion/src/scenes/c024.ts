/*
 * Staging for c024 — "Sich krankmelden".
 *
 * He is ill at home and phoning the office, so this is the split frame doing
 * what it is for: the bedroom on the left with the person who cannot get up,
 * the office on the right with the person who has to reorganise a meeting.
 *
 * The office is the full-frame `buero` used as the right-hand half, which
 * shows its own x 0-960 and puts the figure at office x=704 — behind the left
 * end of the desk. The desk was drawn 1000 wide for exactly this.
 *
 * Only one anchor survives that crop: the wall planner at office x 90-260,
 * which lands at frame 1050-1220. The window and the monitor are both cut off
 * by the room's right edge, so they are not used here.
 *
 * The scaffolder proposed ringing the bedroom window for "Morgen" on line 0.
 * That is a greeting matching a weather keyword — the same way "Guten Abend"
 * once hit the restaurant window — and it is dropped.
 */

import type { Scene } from "../types";

export const c024: Scene = {
  id: "c024",

  rooms: [
    { set: "schlafzimmer", from: 0, to: 960 },
    { set: "buero", from: 960, to: 1920 }
  ],

  cast: {
    Sijan: {
      room: 0,
      x: 258,
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
      room: 1,
      x: 1664,
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
    9: { at: "kalender", label: "die Besprechung", word: "Besprechung" }
  },

  thoughts: {
    4: { icon: "medizin", label: "die Erkältung", word: "Erkältung" },
    6: { icon: "uhr", label: "um elf", word: "elf" },
    7: { icon: "brief", label: "die Krankmeldung", word: "Krankmeldung" }
  },

  wortschatz: [
    { de: "krank", en: "ill" },
    { de: "die Erkältung", en: "cold" },
    { de: "das Fieber", en: "fever" },
    { de: "der Termin", en: "appointment" },
    { de: "die Krankmeldung", en: "sick note" },
    { de: "die Besprechung", en: "meeting" }
  ]
};
