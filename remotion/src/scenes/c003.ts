/*
 * Staging for c003 — "Ein Tisch für zwei".
 *
 * Scaffolded by scripts/new-scene.mjs, then edited.
 *
 * One room, not two. "Essen & Restaurant" maps to a single full-width set,
 * so the scaffolder seated them at one table and set call: false without
 * being told — which is right: "Wir sind zu zweit", "Sollen wir noch einen
 * Nachtisch nehmen?" They are at the same table, not on the phone.
 *
 * What was changed:
 *
 *   line 0   "Guten Abend" matched the window, because "abend" is in its
 *            keyword list. It is a greeting, not a thing you can point at,
 *            and the line is really about wanting a table - so the ring goes
 *            on the table instead.
 *   line 2   which frees the window for "Der Tisch am Fenster wäre schön",
 *            the line that actually names it.
 */

import type { Scene } from "../types";

export const c003: Scene = {
  id: "c003",
  call: false,

  rooms: [
    { set: "restaurant", from: 0, to: 1920 }
  ],

  /* Either side of the table, far enough apart that the bubble can sit
     between and below them without covering a face. */
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
  callouts: {
    0: { at: "tisch", label: "der Tisch", word: "Tisch" },
    2: { at: "fenster", label: "das Fenster", word: "Fenster" },
    3: { at: "speisekarte", label: "die Speisekarte", word: "Speisekarte" },
    5: { at: "essen", label: "die Nudeln", word: "Nudeln" },
    7: { at: "getraenk", label: "das Wasser", word: "Wasser" },
    12: { at: "essen", label: "das Eis", word: "Eis" }
  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  wortschatz: [
    { de: "der Abend", en: "evening" },
    { de: "der Tisch", en: "table" },
    { de: "das Fenster", en: "window" },
    { de: "die Speisekarte", en: "menu" },
    { de: "die Nudeln", en: "pasta, noodles" },
    { de: "das Wasser", en: "water" }
  ]
};
