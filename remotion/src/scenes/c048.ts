/*
 * Staging for c048 — "Video-Anruf nach Hause".
 *
 * A call, and for once the two rooms are honestly two places: Shruti is at
 * home in Nepal and Sijan is in Germany.
 *
 * The scaffolder proposed a window for "Wetter" on line 9 and the radiator for
 * "Grad" on line 10. The radiator is dropped — a temperature is not a heater —
 * and the window moves to line 11. Line 9 asks what the weather is like where
 * *she* is; the window in *his* room cannot answer that. Line 11 is him saying
 * it has rained here for three days, and he is standing next to it.
 */

import type { Scene } from "../types";

export const c048: Scene = {
  id: "c048",

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

  callouts: {
    11: { at: "fenster", label: "der Regen", word: "regnet" }
  },

  thoughts: {
    1: { icon: "handy", label: "das Bild", word: "Bild" },
    7: { icon: "kalender", label: "im Sommer", word: "Sommer" }
  },

  wortschatz: [
    { de: "das Bild", en: "picture, image" },
    { de: "der Garten", en: "garden" },
    { de: "die Oma", en: "grandma" },
    { de: "der Sommer", en: "summer" },
    { de: "das Wetter", en: "weather" },
    { de: "der Grad", en: "degree" }
  ]
};
