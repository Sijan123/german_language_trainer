/*
 * One palette, one set of curves, one type scale — shared by every scene.
 *
 * Two families of colour live here and they do different jobs.
 *
 * The UI colours are the trainer's own light-mode tokens from css/style.css, so
 * a video dropped into the Gespräch page reads as part of the page rather than
 * as something pasted in. The set colours are flat illustration colours: a
 * drawn room needs more of them, and they are chosen to sit under the UI
 * without competing with it.
 *
 * `attention` is the one loud colour in the project and it has exactly one job:
 * the callout that points at the thing being talked about. Nothing else is ever
 * allowed to use it, which is what makes it work when it appears.
 *
 * The video is always light: a rendered file cannot follow
 * prefers-color-scheme, and a light card on a dark page still looks deliberate
 * where the reverse looks broken.
 */

import { Easing } from "remotion";

export const theme = {
  color: {
    bg: "#f4f5f0",
    surface: "#ffffff",
    sunken: "#ecede6",
    ink: "#1f2a3c",
    inkSoft: "#4d5570",
    inkFaint: "#7b8298",
    border: "#ddd9cc",
    borderSoft: "#e7e4d9",

    /* The callout, and nothing else. */
    attention: "#e2761b",
    attentionSoft: "#fdf0e0",

    /* One speaker per side of the conversation, each with the tint the app
       already gives them, plus the wash their chip sits on. */
    speaker: {
      Sijan: { ink: "#2f5d8a", soft: "#e4edf5" },
      Shruti: { ink: "#a8455f", soft: "#f8e7eb" }
    } as Record<string, { ink: string; soft: string }>
  },

  /* Flat illustration colours for the drawn rooms. Deliberately a little
     desaturated: a cartoon-bright set fights the text that sits on top of it,
     and the text is the reason the video exists. */
  set: {
    shop: {
      wall: "#e8e9e4",
      wallDark: "#dcded7",
      floor: "#eceadf",
      floorLine: "#dfdccd",
      shelf: "#b9c1c7",
      shelfDark: "#9ba4ac",
      shelfEdge: "#ccd2d7",
      chrome: "#b9c0c6",
      glass: "#dcecf4",
      glassDark: "#c2dce8",
      sign: "#2b3440",
      signInk: "#ffffff",
      wood: "#b98a54",
      woodDark: "#9a6f40",
      bread: "#d8a45e"
    },
    kitchen: {
      wall: "#eeeae1",
      wallDark: "#e3ded2",
      floor: "#e6ded0",
      counter: "#d9d3c5",
      counterTop: "#8e9389",
      cabinet: "#cfd6ce",
      cabinetDark: "#b6bfb6",
      tile: "#e9efe9",
      sky: "#cfe2ec",
      skyLow: "#e6eff3",
      wood: "#c09463",
      jar: "#c97f4a",
      pot: "#7d8a86"
    },
    living: {
      wall: "#efe9df",
      wallDark: "#e4ddd0",
      floor: "#d8c3a6",
      floorLine: "#c9b294",
      skirting: "#e8e2d6",
      wood: "#b98a54",
      woodDark: "#95663a",
      sofa: "#8d9a93",
      sofaDark: "#7b8880",
      cushion: "#c2a678",
      radiator: "#e6e2d8",
      radiatorDark: "#c9c4b6",
      curtain: "#cdbfa6",
      frame: "#b9ae97",
      art: "#7a97ad",
      artAlt: "#b07f6d",
      sky: "#cfe2ec",
      skyLow: "#e6eff3"
    },
    bedroom: {
      wall: "#e9e5ee",
      wallDark: "#ded9e6",
      floor: "#cbb79c",
      floorLine: "#bda98e",
      skirting: "#e4dfe9",
      wood: "#b0845a",
      woodDark: "#8e6740",
      duvet: "#b9c6d6",
      duvetDark: "#a3b3c7",
      pillow: "#f0efec",
      sheet: "#e7e3dc",
      wardrobe: "#c3b49f",
      wardrobeDark: "#a8977f",
      clock: "#3d4552",
      clockFace: "#e9ede4",
      lamp: "#d9b96a",
      sky: "#b9c8dc",
      skyLow: "#d6dee9",
      frame: "#b0a894"
    },
    restaurant: {
      wall: "#e7ded2",
      wallDark: "#dbd0c1",
      floor: "#bd9a74",
      floorLine: "#ab8763",
      panel: "#c69a76",
      panelDark: "#b58763",
      rail: "#9a7050",
      metal: "#8a8478",
      lamp: "#d9a54e",
      lampGlow: "#f0d79a",
      bar: "#8d5c3c",
      barDark: "#6f4830",
      bottle: "#7f9a7a",
      cloth: "#f2ece0",
      clothShade: "#ded5c5",
      menu: "#f7f3e8",
      menuInk: "#5a4b3c",
      plate: "#ffffff",
      soup: "#d99a4e",
      pasta: "#e8d9a8",
      sauce: "#c4614f",
      beer: "#e0a53c",
      water: "#cfe0e8",
      vase: "#9aa8a0",
      frame: "#8d6a4a",
      sky: "#8fa8bf",
      skyLow: "#b9c8d6"
    },
    /* The crayon-box colours the product blocks on the shelves are drawn from.
       Saturated enough to read as a shop and no further: a real shelf is a
       colour riot, and the first pass was so muted the aisles looked like
       filing cabinets. The subtitles survive it because they sit on an opaque
       card, not on the set. */
    products: [
      "#e08272", "#eab85f", "#7fabc6", "#9ec081", "#c68cb2",
      "#5f9cb4", "#e2c06a", "#ab85c6", "#78bd9c", "#dd8b82"
    ]
  },

  font: {
    display: "Fraunces, Georgia, serif",
    body: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace"
  },

  /* Nothing in this project interpolates linearly. These are the only three
     curves it uses: things arriving, things leaving, and things drifting. */
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),      // entrances, camera
    in: Easing.bezier(0.7, 0, 0.84, 0),       // exits
    inOut: Easing.bezier(0.65, 0, 0.35, 1)    // idle drift, crossfades
  },

  spring: {
    /* A bubble landing: it should settle, not wobble. */
    settle: { damping: 200, stiffness: 120, mass: 0.8 },
    /* The speaker taking their turn: a little overshoot reads as leaning in. */
    lean: { damping: 15, stiffness: 150, mass: 0.7 },
    /* A callout snapping onto the thing it points at. */
    snap: { damping: 13, stiffness: 190, mass: 0.6 }
  }
} as const;

export const speakerColor = (name: string) =>
  theme.color.speaker[name] ?? theme.color.speaker.Sijan;
