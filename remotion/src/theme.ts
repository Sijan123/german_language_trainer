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
      frame: "#b0a894",
      jacket: "#5c6f86",
      jacketDark: "#4a5b70",
      scarf: "#b07a63"
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
    ],

    /*
     * The three outdoor-ish sets below are the first that are not a room, so
     * "wall" is the sky and "floor" is pavement or platform. Keeping the same
     * key names means Wall and Floor from the kit still draw them, and the
     * horizon stays at y=648 like everywhere else.
     */
    strasse: {
      wall: "#cfe0ea",
      wallDark: "#bcd3e1",
      floor: "#c4c3bd",
      floorLine: "#b2b1ab",
      kerb: "#d6d5cf",
      road: "#8e8d89",
      roadLine: "#e8e6dd",
      haus: "#d3c8b8",
      hausDark: "#c0b4a2",
      dach: "#9a8573",
      shelter: "#8fa3ae",
      shelterDark: "#768994",
      glass: "#dbe9f0",
      bus: "#c8523f",
      busDark: "#a8422f",
      busGlass: "#cfe2ec",
      sign: "#2b3440",
      signInk: "#ffffff",
      chrome: "#a9b0b6",
      plan: "#f4f1e8",
      planInk: "#6a6459",
      automat: "#5d6b6f",
      automatDark: "#4a565a"
    },
    bahnhof: {
      wall: "#d8dde1",
      wallDark: "#c6ccd2",
      floor: "#b8b6ae",
      floorLine: "#a6a49c",
      kante: "#d9d6cb",
      kanteWarn: "#d8b45e",
      zug: "#b24a4a",
      zugDark: "#953c3c",
      zugGlass: "#cfe0ea",
      zugRoof: "#8f9399",
      tafel: "#232a33",
      tafelInk: "#e6c15f",
      pfosten: "#8d949a",
      sign: "#1f5aa8",
      signInk: "#ffffff",
      chrome: "#aab1b7",
      stahl: "#9aa2a8",
      stahlDark: "#828a90",
      bank: "#b2894f",
      bankDark: "#946f3d",
      rucksack: "#4f7a6a",
      rucksackDark: "#3f6455"
    },
    bath: {
      wall: "#e6edee",
      wallDark: "#d6e0e2",
      floor: "#cfd6d6",
      floorLine: "#bcc5c5",
      tile: "#e9f0f0",
      tileLine: "#d5dfdf",
      trim: "#c6d0d0",
      machine: "#eef1f1",
      machineDark: "#c9d1d1",
      drum: "#4d5a60",
      linen: "#f2efe6",
      towel: "#7fa8b0",
      pink: "#dba3ae",
      red: "#b8545a",
      porcelain: "#f6f7f6",
      porcelainShade: "#dbe2e1",
      chrome: "#a9b4b6",
      mirror: "#cfe0e4",
      mirrorGlint: "#e8f2f4",
      frame: "#b4bec0",
      sky: "#cfe2ec",
      skyLow: "#e6eff3"
    },
    bekleidung: {
      wall: "#eeeae6",
      wallDark: "#e0dbd5",
      floor: "#ddd3c6",
      floorLine: "#cbc0b1",
      rail: "#a9b0b4",
      railDark: "#8d9498",
      counter: "#b98a54",
      counterTop: "#9a6f40",
      kabine: "#7d6a80",
      kabineDark: "#67566a",
      curtain: "#8a6f8e",
      hose: "#5c6f86",
      hoseDark: "#49596c",
      jacke: "#7a6a58",
      sign: "#2b3440",
      signInk: "#ffffff",
      chrome: "#aab1b5",
      mirror: "#d6e2e6"
    },
    markt: {
      wall: "#cfe0ea",
      wallDark: "#bcd3e1",
      floor: "#bfb9ad",
      floorLine: "#aca699",
      awning: "#c8523f",
      awningAlt: "#f2ece0",
      pole: "#9aa2a8",
      crate: "#b98a54",
      crateDark: "#95663a",
      erdbeere: "#cc3f4c",
      erdbeereLeaf: "#6d9b6a",
      kartoffel: "#c2996a",
      kartoffelDark: "#a67f52",
      kaese: "#e2c06a",
      kaeseDark: "#c9a44f",
      cloth: "#8fae86",
      sign: "#3d3630",
      signInk: "#f7f3e8",
      chrome: "#a9b0b6"
    },
    baeckerei: {
      wall: "#efe4d4",
      wallDark: "#e2d4c0",
      floor: "#c9ad8c",
      floorLine: "#b6997a",
      counter: "#a9764a",
      counterTop: "#8d5f38",
      glass: "#dbeaf0",
      glassEdge: "#c2d8e2",
      shelf: "#b98a54",
      shelfDark: "#95663a",
      brot: "#c08748",
      brotDark: "#a06f38",
      broetchen: "#d8a45e",
      kuchen: "#e8d9a8",
      kuchenTop: "#c4614f",
      sign: "#4a3524",
      signInk: "#f7f0e2",
      chrome: "#aab1b5",
      kasse: "#5d6b6f",
      kasseDark: "#4a565a"
    },
    amt: {
      wall: "#e4e6e3",
      wallDark: "#d6d9d5",
      floor: "#cfcdc6",
      floorLine: "#bfbdb6",
      tresen: "#b6b2a6",
      tresenTop: "#8d9289",
      tresenDark: "#9d998d",
      glas: "#dbe7ea",
      anzeige: "#26303a",
      anzeigeInk: "#7fd4a0",
      papier: "#f7f5ee",
      papierInk: "#8a8478",
      pass: "#7a3f4a",
      passInk: "#e0c98a",
      stuhl: "#6f8496",
      stuhlDark: "#5c7080",
      pflanze: "#7faa78",
      rahmen: "#b0aa9a",
      chrome: "#a8aeb2"
    }
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
