/*
 * Two halves that meet in the composition.
 *
 * `Dialogue` and everything under it is generated — scripts/build-data.mjs
 * writes it from the app's own data and from what ffprobe and the aligner say
 * about the clips. `Scene` and everything under it is hand-authored staging,
 * one file per dialogue in src/scenes/. They are joined by id and never by
 * position, so adding a line to a dialogue cannot silently shift its callouts.
 */

import type { Acted } from "./acted/types";

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
  /**
   * The same thing a letter at a time, in fractional frames, from the
   * romanized spelling the aligner works in ("ü" arrives as "u", "e"). Only
   * the acted films read it — it is what their mouths are shaped from.
   */
  letters?: { ch: string; from: number; to: number }[];
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
  /**
   * "short" is thick and high on top rather than a flat cap; "long" falls
   * past the shoulders and is centre-parted. "bun" is kept because it is a
   * real style, but nobody in the current films wears one — both of them are
   * drawn from photographs and neither has their hair up.
   */
  hairStyle: "short" | "bun" | "long";
  /**
   * A lighter tone brushed through the hair. Flat hair at this size reads as
   * a helmet; one highlight is what turns it back into hair. Falls back to
   * the base colour, which switches the highlight off.
   */
  hairLight?: string;
  beard: boolean;
  /** thick brows are a face's strongest single cue at 720p */
  brows?: "normal" | "thick";
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

/**
 * A thing the speaker is talking about that is nowhere near them.
 *
 * A callout needs the object to be drawn in the room. When a dialogue is
 * about somewhere else — an office described from the sofa at the end of the
 * day — there is nothing to ring, and c005 had one pointer in thirteen lines
 * because of it. A thought draws the thing in a cloud over the speaker's head
 * instead, so the vocabulary still gets a picture.
 *
 * `icon` is a key of ICONS in components/ThoughtIcons.tsx. Adding a thought
 * for a thing with no icon means drawing one; that is the cost here, the way
 * a new room is the cost of a callout in a new place.
 */
export type Thought = {
  icon: string;
  label: string;
  /** waits for this word in the German, exactly like a callout */
  word: string;
};

/**
 * One camera setup, held for as long as no later line names another.
 *
 * The default composition is a locked-off two-shot: both rooms, whole frame,
 * for fifty seconds. That is readable and it is not filmed. A scene that
 * carries a `film` block is instead cut like coverage — the camera sits on
 * whoever is talking, or on the thing being talked about, and moves the whole
 * time it is there.
 *
 * The window is described in the set's own full-frame coordinates, so a shot
 * is written by reading the numbers off the room rather than by guessing a
 * zoom factor: `{ x: 1440, y: 500, w: 900 }` is "the right-hand room, chest
 * up". `w` is what decides the scale; `H` follows from the 16:9 frame.
 */
export type Shot = {
  /** centre of the visible window, full-frame coordinates */
  x: number;
  y: number;
  /** width of the visible window; 1920 is the whole frame */
  w: number;
  /**
   * What the camera does while it is here. Every shot moves: a still frame
   * held for four seconds is the thing that reads as a slideshow.
   *
   * "push" and "pull" change `w` by 4% across the shot; "left" and "right"
   * track `x` by 3% of the window. "hold" still gets the handheld float.
   */
  move?: "push" | "pull" | "left" | "right" | "hold";
  /**
   * False glides to this framing from the previous one instead of cutting.
   * Use it when the camera is following something rather than changing angle;
   * a glide between two people reads as a mistake, not an edit.
   */
  cut?: boolean;
  /** the chip in the corner. null while the camera is inside one room. */
  label?: string | null;
};

export type Film = {
  /**
   * Keyed by line index, like callouts. A line with no shot holds whatever
   * the last one set, so a two-shot that covers four lines is written once.
   */
  shots: Record<number, Shot>;
  /** what the title card plays over, before the first line opens */
  open?: Shot;
  /**
   * How far the background falls out of focus when the camera is close, in
   * pixels of blur at the tightest shot in the film. The people are drawn in
   * a separate layer and stay sharp, which is the whole point — it is what
   * separates a subject from a backdrop and it is why this looks lensed
   * rather than zoomed. 0 switches it off.
   */
  focus?: number;
};

export type Scene = {
  id: string;
  /**
   * Played out by people with bodies in a 3D room instead of drawn figures on
   * a flat set: see src/acted/. When this is present the composition hands
   * the whole film to SceneActed, and `rooms`, `cast` and `film` are unused
   * (they stay filled in, so the scene still type-checks as a drawn one and
   * can fall back to it by deleting this block).
   */
  acted?: Acted;
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
  /**
   * Keyed by line index, like callouts, and mutually exclusive with them: a
   * line that rings something in the room does not also imagine it. The
   * composition renders at most one pointer per line.
   */
  thoughts?: Record<number, Thought>;
  /**
   * Shot the film instead of locking off on a two-shot. Absent on almost
   * every scene, and absent means the composition behaves exactly as it did
   * before this existed — the camera path collapses to the identity.
   */
  film?: Film;
  wortschatz: { de: string; en: string }[];
};
