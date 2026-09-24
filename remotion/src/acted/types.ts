/*
 * The staging of an acted film: people with bodies, in a room with depth,
 * doing things while they talk.
 *
 * A drawn film (src/SceneDialogue.tsx) has two figures that stand and speak.
 * An acted one has a script of physical business as well — he gets up when his
 * number is called, finds his passport, hands it over — and that business is
 * written here as a list of beats against the dialogue, never as frame
 * numbers. A beat says "when Shruti reaches the word Ausweis, Sijan starts
 * reaching for his inside pocket", so re-recording a line moves every action
 * that hangs off it and nothing has to be retimed by hand.
 *
 * Everything is in metres, in one world frame:
 *
 *   +x  screen right in the master shot, which is side-on to the desk
 *   +y  up; the floor is y = 0
 *   +z  towards the camera
 *
 * A person's own frame is the world frame turned by their yaw about +y. At
 * yaw 0 they face +x and their right hand is on the +z side, nearest the
 * lens. Yaw π faces -x (their left hand nearest the lens); yaw -π/2 faces the
 * camera.
 */

export type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* Cues: when a beat starts                                            */
/* ------------------------------------------------------------------ */

/**
 * A moment in the film, named by the dialogue rather than by the clock.
 *
 *   { line: 3, word: "Ausweis" }        the frame that word starts sounding
 *   { line: 3, word: "Ausweis", end: true }   ...or stops
 *   { line: 3 }                          the line's voice starts
 *   { line: 3, end: true }               the line's voice stops
 *   { gap: 4 }                           the start of the silence added
 *                                        before line 4 (see Acted.gaps)
 *   { t: 1.5 }                           seconds from the first frame
 *   { after: "draw" }                    when the beat with that id ends
 *
 * `plus` shifts any of them, in seconds, either way.
 */
export type Cue = (
  | { line: number; word?: string; end?: boolean }
  | { gap: number }
  | { t: number }
  | { after: string }
) & { plus?: number };

/* ------------------------------------------------------------------ */
/* Targets: where a hand or a gaze goes                                */
/* ------------------------------------------------------------------ */

/**
 * Somewhere a hand can be sent. Resolved on every frame, so a hand sent to
 * the person's own lap follows the lap when they sit down.
 *
 *   body   a point in the person's own torso frame (see BODY_SPOTS in rig.ts)
 *   spot   a named point the set publishes: a desk position, the keyboard
 *   prop   wherever a prop currently rests, plus an optional offset
 *   world  a literal point
 */
export type Target =
  | { body: string; off?: Vec3 }
  | { spot: string; off?: Vec3 }
  | { prop: string; off?: Vec3 }
  | { world: Vec3 };

/** Somewhere a pair of eyes can be pointed. */
export type LookTarget =
  | { face: string }            // another person's face
  | { hand: string }            // "Sijan.R": follow a hand
  | { spot: string; off?: Vec3 }
  | { prop: string }
  | { world: Vec3 }
  | { ahead: true };            // straight ahead, at eye level

/** Which way the palm faces, in the person's own frame. */
export type Palm = "down" | "up" | "in" | "out" | "forward" | "back" | Vec3;

/* ------------------------------------------------------------------ */
/* Beats                                                               */
/* ------------------------------------------------------------------ */

type BeatBase = {
  /** so another beat can start { after: id } */
  id?: string;
  who: string;
  at: Cue;
};

/**
 * The vocabulary. Each verb is a small piece of choreography that the
 * timeline compiles into keys on the person's channels; see timeline.ts.
 * Durations are seconds and every one has a default that looked right.
 */
export type Beat = BeatBase & (
  /* whole body */
  | { do: "walk"; path: [number, number][]; face?: number; speed?: number }
  | { do: "step"; to: [number, number]; dur?: number }
  | { do: "turn"; yaw: number; dur?: number }
  | { do: "sit"; chair: string; dur?: number }
  | { do: "stand"; dur?: number }
  | { do: "scoot"; chair: string; by: number; dur?: number }
  | { do: "lean"; amount: number; dur?: number }
  | { do: "twist"; amount: number; dur?: number }

  /* head and face */
  | { do: "look"; to: LookTarget; dur?: number; hold?: number }
  | { do: "nod"; times?: number; size?: number; dur?: number }
  | { do: "shake"; times?: number; dur?: number }
  | { do: "smile"; amount: number; dur?: number }
  | { do: "brows"; amount: number; dur?: number }
  /** eyes shut (0) or open (1), for someone dozing; blinks still happen when open */
  | { do: "eyes"; open: number; dur?: number }

  /* hands */
  | {
      do: "reach";
      hand: "L" | "R";
      to: Target;
      dur?: number;
      /** how high the hand arcs on the way, metres */
      arc?: number;
      palm?: Palm;
      grip?: number;
      point?: number;
      /** after holding for this long, go back to rest */
      hold?: number;
    }
  | { do: "rest"; hand: "L" | "R" | "both"; dur?: number }
  | { do: "type"; dur: number }
  | { do: "gesture"; hand: "L" | "R"; kind: "offer"; toward: Target; dur?: number }
  /**
   * Pen on paper. `on` names the paper prop: the ink is recorded from where
   * the pen tip actually went, frame by frame, and stays on the paper
   * afterwards — including when the paper is slid back across the desk.
   * `style` is "fill" for filling in fields (short separate words along a
   * few lines) or "sign" for one signature.
   */
  | { do: "scribble"; hand: "L" | "R"; dur: number; on: string; style: "fill" | "sign" }
  | { do: "tap"; hand: "L" | "R"; times?: number }

  /* the jacket */
  | { do: "jacket"; open: number; dur?: number }

  /* props */
  /**
   * The prop moves into the hand. "keep" holds it exactly as it was lying
   * when the hand closed on it, which is right for a hand-over; "carry"
   * settles it into the hand's natural hold, which is right for picking a
   * thing up to take it somewhere.
   */
  | { do: "take"; prop: string; hand: "L" | "R"; grip?: "keep" | "carry" }
  /**
   * Down onto a set spot, or into another prop (`into`: a roll into a bag,
   * a card into a wallet), `off` from that prop's middle in its own frame.
   */
  | { do: "put"; prop: string; spot?: string; into?: string; off?: Vec3; blend?: number }
  /** into a pocket: `into` is the person whose jacket it goes in */
  | { do: "stow"; prop: string; into: string }
  | { do: "open"; prop: string; amount: number; dur?: number }

  /* the room */
  | { do: "chair"; chair: string; to: [number, number]; yaw?: number; dur?: number }
  | { do: "screen"; state: string; dur?: number }
  | { do: "display"; text: string }
  | { do: "sound"; name: string; volume?: number; dur?: number }
  /**
   * Anything else in the room that moves by degrees — a till drawer, a bread
   * slicer running — as a named value the set reads (SetState.values),
   * eased from where it is to `value` over `dur`.
   */
  | { do: "room"; name: string; value: number; dur?: number }
);

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

export type Shot3D = {
  at: Cue;
  /** camera position and the point it looks at */
  pos: Vec3;
  look: Vec3;
  /** vertical field of view, degrees */
  fov: number;
  /**
   * Where the camera ends up by the next shot. It eases there across the
   * whole shot, so a held setup still breathes. Absent means a very small
   * push towards `look`.
   */
  to?: { pos?: Vec3; look?: Vec3; fov?: number };
  /** glide from the previous setup over this many seconds instead of cutting */
  glide?: number;
  /**
   * Keep a moving subject in frame: the look point follows this person's
   * pelvis in x, blended by `follow` (0..1).
   */
  track?: string;
  follow?: number;
};

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export type Look3D = {
  /** metres, crown to floor */
  height: number;
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: "short" | "long";
  beard: boolean;
  brows: "normal" | "thick";
  /** the outer layer on the torso */
  top: string;
  topDark: string;
  /** a jacket over a shirt; the inside pocket lives in it */
  jacket?: { color: string; dark: string; shirt: string };
  trousers: string;
  shoes: string;
  /** an ID on a lanyard, which is how you know who works here */
  lanyard?: boolean;
  /**
   * A rigged model from public/models/cast/<model>.glb (built by
   * blender/cast.py) instead of the shapes Person.tsx draws. The colours
   * above still apply; the model's build, hair, beard, jacket and lanyard
   * are its own, so they should agree with the fields above.
   */
  model?: string;
};

export type Start = {
  x: number;
  z: number;
  yaw: number;
  /** sat down on this chair from the first frame */
  seated?: string;
};

/* ------------------------------------------------------------------ */
/* Callouts on 3D things                                               */
/* ------------------------------------------------------------------ */

/**
 * A ring round something in the room. `at` is a prop name or a set anchor,
 * and the ring is projected from 3D on every frame, so it stays on a passport
 * that is moving across the desk.
 */
export type Callout3D = {
  at: string;
  label: string;
  word: string;
  /** half-size of the ring in metres; the projection decides the pixels */
  size?: [number, number];
};

/** Where a prop is being kept at a given moment. */
export type Holder =
  | { hand: [string, "L" | "R"]; grip?: "keep" | "carry" }
  | { spot: string }
  | { pocket: string }
  | { inside: string; off?: Vec3 };

export type PropKind =
  | "passport" | "folder" | "sheet" | "form" | "pen"
  /* the bakery */
  | "roll" | "loaf" | "bag" | "box" | "slice" | "wallet" | "card" | "coins"
  /* the flat */
  | "clock" | "sandwich" | "lunchbox" | "mug" | "key";

export type Acted = {
  /** a key of SETS3D in acted/sets */
  set: string;
  cast: Record<string, {
    look: Look3D;
    start: Start;
    /**
     * A change of clothes (colours only: the model stays the same), from
     * the cue on. Do it while the person is out of shot.
     */
    changes?: { at: Cue; look: Partial<Look3D> }[];
  }>;
  /**
   * Silence added before line i, in seconds: room for things that take
   * longer to do than to say. Line 0's gap sits between the title card and
   * the first line; `tail` is the silence after the last line and before
   * the Wortschatz card.
   */
  gaps: Record<number, number>;
  tail?: number;
  /** things that get handed about, and where each is at the first frame */
  props: Record<string, { kind: PropKind; start: Holder }>;
  beats: Beat[];
  shots: Shot3D[];
  callouts: Record<number, Callout3D>;
};
