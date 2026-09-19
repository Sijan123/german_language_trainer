/*
 * Two halves that meet in the composition.
 *
 * `Dialogue` and everything under it is generated — scripts/build-data.mjs
 * writes it from the app's own data and from what ffprobe and the aligner say
 * about the clips. `Scene` and everything under it is hand-authored staging,
 * one file per dialogue in src/scenes/. They are joined by id and never by
 * position, so adding a line to a dialogue cannot silently shift its callouts.
 */

/* ------------------------------------------------------------------ */
/* Generated                                                           */
/* ------------------------------------------------------------------ */

/** One word of a line, with the frames the aligner put it between. */
export type Word = {
  /** the word as it is printed, punctuation and all */
  text: string;
  /** frames from the start of the composition */
  from: number;
  to: number;
  /**
   * False when the aligner could not place this word and the timing was
   * interpolated from its neighbours. The karaoke still runs; this exists so
   * the render can be honest about it if it ever needs to be.
   */
  aligned: boolean;
};

export type Line = {
  i: number;
  s: string;
  de: string;
  en: string;
  clip: string;
  /** the bubble opens here, a beat before the voice */
  enterAt: number;
  audioAt: number;
  audioFrames: number;
  endAt: number;
  words: Word[];
};

export type Dialogue = {
  id: string;
  title: string;
  titleEn: string;
  topic: string;
  tone: string;
  fps: number;
  intro: number;
  outro: number;
  durationInFrames: number;
  lines: Line[];
};

/* ------------------------------------------------------------------ */
/* Hand-authored                                                       */
/* ------------------------------------------------------------------ */

export type Room = {
  /** a key of SETS in components/sets/index.ts */
  set: string;
  /** the x range of the frame this room occupies */
  from: number;
  to: number;
  /** overrides the set's own label, for a room used as somewhere specific */
  label?: string;
};

export type Actor = {
  /** index into Scene.rooms */
  room: number;
  /** centre of the head, in full-frame coordinates */
  x: number;
  headY: number;
  scale: number;
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: "short" | "bun";
  beard: boolean;
  top: string;
  topDark: string;
  basket: boolean;
};

/** A box on the set, in full-frame coordinates. */
export type Anchor = { x: number; y: number; w: number; h: number };

export type Callout = {
  /** key into Scene.anchors */
  at: string;
  label: string;
  /** the callout waits for this word in the German before it appears */
  word: string;
};

export type Scene = {
  id: string;
  /**
   * Are the two on the phone, or in the same place?
   *
   * A call puts a handset in each hand and a phone glyph on the name chip. Two
   * people in one flat calling each other looks absurd, and c001 - one of them
   * in bed, the other in the kitchen - is exactly that case. Defaults to true
   * because a split scene usually is a call.
   */
  call?: boolean;
  rooms: Room[];
  cast: Record<string, Actor>;
  /**
   * Keyed by line index; most lines have none. `at` is an anchor id belonging
   * to one of this scene's rooms — the sets own their anchors, so a callout
   * cannot point at a box that has moved out from under it.
   */
  callouts: Record<number, Callout>;
  wortschatz: { de: string; en: string }[];
};
