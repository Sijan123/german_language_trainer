/*
 * From beats to channels.
 *
 * A scene says what happens ("he takes the passport out of his pocket when
 * she says Ausweis"). The rig needs to know, for any frame, where every part
 * of everyone is. This file is the step in between: it walks the beats in
 * order, resolves each cue to a frame, and writes keys onto a set of channels
 * per person — where they stand, how far they are sat down, where each hand
 * is headed and with the palm which way up, what they are looking at.
 *
 * The channels are dumb. A number track interpolates between keys; a hand
 * track holds a list of reaches, each blending from wherever the hand was
 * heading before. None of them knows about German or passports. That is what
 * makes the vocabulary reusable: the second acted film is a new list of beats,
 * not new code.
 *
 * Two rules about writing keys:
 *
 *  - A new move on a channel overrides everything after its start. "Reach for
 *    the keyboard at frame 300" after "rest at frame 320" means the rest never
 *    happens, which is what a later beat interrupting an earlier one means.
 *
 *  - A move starts from wherever the channel is at that frame, evaluated
 *    then — never from where some earlier beat said it would be. That is what
 *    lets beats be written without knowing each other.
 */

import type { Dialogue } from "../types";
import type { SetLayout } from "./sets";
import type {
  Acted, Beat, Cue, Holder, Look3D, LookTarget, Palm, PropKind, Shot3D, Start, Target
} from "./types";
import { angleDiff, mjerk, rotY } from "./math";

export type Ease = (t: number) => number;

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */

type Key = { f: number; v: number; e: Ease };

export class NumTrack {
  keys: Key[] = [];
  constructor(public init: number, private angular = false) {}

  at(f: number): number {
    const k = this.keys;
    if (!k.length) return this.init;
    if (f <= k[0].f) return k[0].v;
    let i = k.length - 1;
    while (i > 0 && k[i].f > f) i--;
    if (i === k.length - 1) return k[i].v;
    const a = k[i];
    const b = k[i + 1];
    const span = b.f - a.f;
    if (span <= 1e-6) return b.v;
    return a.v + (b.v - a.v) * b.e((f - a.f) / span);
  }

  /** From whatever the value is at f0, to v by f1. Overrides later keys. */
  moveTo(f0: number, f1: number, v: number, e: Ease = mjerk) {
    const cur = this.at(f0);
    const target = this.angular ? cur + angleDiff(cur, v) : v;
    this.keys = this.keys.filter((k) => k.f < f0);
    this.keys.push({ f: f0, v: cur, e: mjerk });
    this.keys.push({ f: Math.max(f1, f0 + 1e-3), v: target, e });
  }
}

/* ------------------------------------------------------------------ */
/* Getting about: paths and gait                                       */
/* ------------------------------------------------------------------ */

export type PathSeg = {
  f0: number;
  f1: number;
  pts: [number, number][];
  /** cumulative length at each point */
  cum: number[];
  D: number;
  /** frames spent speeding up and slowing down at each end */
  ramp: number;
  /** feet step (walking) or glide (a chair shuffled forward) */
  gait: boolean;
  /** body turns to face the way it is going */
  faceTravel: boolean;
  /** yaw on arrival */
  face: number;
  /** step length, chosen so a whole number of steps lands on the mark */
  step: number;
  steps: number;
};

function makePath(f0: number, f1: number, pts: [number, number][], opts: {
  gait: boolean; faceTravel: boolean; face: number; ramp: number;
}): PathSeg {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const D = cum[cum.length - 1];
  /* 0.62 m is a relaxed indoor stride for someone of 1.75; the count is
     rounded so the last step lands on the mark rather than short of it */
  const steps = Math.max(1, Math.round(D / 0.62));
  return { f0, f1, pts, cum, D, ramp: opts.ramp, gait: opts.gait, faceTravel: opts.faceTravel, face: opts.face, step: D / steps, steps };
}

/**
 * Distance travelled along a path by frame f: speed up, cruise, slow down.
 * A linear walk starts at full speed from a standstill, which is the single
 * most robotic thing a figure can do.
 */
export function pathDist(p: PathSeg, f: number) {
  const T = p.f1 - p.f0;
  const u = Math.min(Math.max(f - p.f0, 0), T);
  const ta = Math.min(p.ramp, T / 2);
  const vmax = p.D / Math.max(1e-6, T - ta);
  if (u < ta) return (0.5 * vmax * u * u) / ta;
  if (u <= T - ta) return 0.5 * vmax * ta + vmax * (u - ta);
  const r = T - u;
  return p.D - (0.5 * vmax * r * r) / ta;
}

/** A point on the path at distance d, and the direction of travel there. */
export function pathAt(p: PathSeg, d: number): { x: number; z: number; heading: number } {
  const dd = Math.min(Math.max(d, 0), p.D);
  let i = 1;
  while (i < p.pts.length - 1 && p.cum[i] < dd) i++;
  const a = p.pts[i - 1];
  const b = p.pts[i];
  const seg = p.cum[i] - p.cum[i - 1];
  const t = seg > 1e-9 ? (dd - p.cum[i - 1]) / seg : 0;
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  return { x: a[0] + dx * t, z: a[1] + dz * t, heading: Math.atan2(-dz, dx) };
}

/* ------------------------------------------------------------------ */
/* Hands, gaze, pulses                                                 */
/* ------------------------------------------------------------------ */

export type HandSeg = {
  f0: number;
  f1: number;
  to: Target;
  palm: Palm | "auto";
  /** metres of lift at the middle of the move */
  arc: number;
};

export type Motion = {
  f0: number;
  f1: number;
  kind: "type" | "fill" | "sign" | "tap" | "hover";
  /** the paper prop, for writing */
  on?: string;
  times?: number;
};

export type LookSeg = { f0: number; to: LookTarget | "default"; dur: number };

export type Pulse = { f0: number; dur: number; kind: "nod" | "shake" | "bob"; times: number; size: number };

export type Speech = {
  from: number;
  to: number;
  question: boolean;
  words: { from: number; to: number; text: string }[];
  letters: { ch: string; from: number; to: number }[];
};

export type PersonProg = {
  name: string;
  partner: string | null;
  look: Look3D;
  start: Start;
  seed: number;
  path: PathSeg[];
  startPos: [number, number];
  yaw: NumTrack;
  sit: NumTrack;
  seats: { f: number; chair: string }[];
  lean: NumTrack;
  twist: NumTrack;
  hands: { L: HandSeg[]; R: HandSeg[] };
  grip: { L: NumTrack; R: NumTrack };
  point: { L: NumTrack; R: NumTrack };
  motions: { L: Motion[]; R: Motion[] };
  looks: LookSeg[];
  pulses: Pulse[];
  smile: NumTrack;
  brows: NumTrack;
  jacket: NumTrack;
  blinks: number[];
  speech: Speech[];
};

export type PropProg = {
  kind: PropKind;
  holders: { f: number; h: Holder; blend: number }[];
  open: NumTrack;
};

export type Program = {
  fps: number;
  duration: number;
  set: SetLayout;
  people: Record<string, PersonProg>;
  props: Record<string, PropProg>;
  chairs: Record<string, { x: NumTrack; z: NumTrack; yaw: NumTrack }>;
  screen: { f: number; state: string; dur: number }[];
  display: { f: number; text: string }[];
  sounds: { f: number; name: string; volume: number; frames?: number }[];
  shots: { f: number; shot: Shot3D }[];
};

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

/* Seconds. Each looked right in a test render; they are defaults, and a beat
   that wants a slower sit or a quicker glance says so. */
const DUR: Record<string, number> = {
  step: 0.8, turn: 0.5, sit: 1.15, stand: 1.05, scoot: 0.5, lean: 0.6, twist: 0.6,
  look: 0.32, nod: 0.75, shake: 0.8, smile: 0.4, brows: 0.25,
  reach: 0.7, rest: 0.6, gesture: 1.3, jacket: 0.35, open: 0.55, chair: 0.7,
  screen: 0.9, take: 0, put: 0, stow: 0, display: 0, sound: 0, type: 1, scribble: 1, tap: 0.6
};

/* ------------------------------------------------------------------ */
/* Compiling                                                           */
/* ------------------------------------------------------------------ */

const bare = (w: string) => w.replace(/[.,!?;:„“"'»«]/g, "").toLowerCase();

export function compile(acted: Acted, d: Dialogue, set: SetLayout): Program {
  const fps = d.fps;
  const sec = (s: number) => Math.round(s * fps);
  const names = Object.keys(acted.cast);

  /* ------------------------------------------------------- cues */
  const ends: Record<string, number> = {};
  const gapStart = (i: number) => d.lines[i].enterAt - sec(acted.gaps[i] ?? 0);

  function cue(c: Cue): number {
    let f: number;
    if ("line" in c) {
      const L = d.lines[c.line];
      if (!L) throw new Error(`acted cue: no line ${c.line}`);
      if (c.word) {
        const w = L.words.find((x) => bare(x.text) === bare(c.word!));
        if (!w) throw new Error(`acted cue: no word "${c.word}" in line ${c.line}: ${L.de}`);
        f = c.end ? w.to : w.from;
      } else {
        f = c.end ? L.audioAt + L.audioFrames : L.audioAt;
      }
    } else if ("gap" in c) {
      f = gapStart(c.gap);
    } else if ("t" in c) {
      f = sec(c.t);
    } else {
      if (!(c.after in ends)) throw new Error(`acted cue: no earlier beat with id "${c.after}"`);
      f = ends[c.after];
    }
    return f + sec(c.plus ?? 0);
  }

  /* ------------------------------------------------------- people */
  const people: Record<string, PersonProg> = {};
  names.forEach((name, n) => {
    const { look, start } = acted.cast[name];
    let pos: [number, number] = [start.x, start.z];
    let yaw = start.yaw;
    if (start.seated) {
      /* sat down from the first frame: the feet are in front of the seat */
      const ch = set.chairs[start.seated];
      const fwd = rotY([0.42, 0, 0], ch.yaw);
      pos = [ch.at[0] + fwd[0], ch.at[1] + fwd[2]];
      yaw = ch.yaw;
    }
    const speech: Speech[] = d.lines
      .filter((l) => l.s === name)
      .map((l) => ({
        from: l.audioAt,
        to: l.audioAt + l.audioFrames,
        question: l.de.trim().endsWith("?"),
        words: l.words.map((w) => ({ from: w.from, to: w.to, text: w.text })),
        letters: l.words.flatMap((w) => w.letters ?? [])
      }));
    people[name] = {
      name,
      partner: names.find((o) => o !== name) ?? null,
      look,
      start,
      seed: n * 2.7 + 1.3,
      path: [],
      startPos: pos,
      yaw: new NumTrack(yaw, true),
      sit: new NumTrack(start.seated ? 1 : 0),
      seats: start.seated ? [{ f: -1e9, chair: start.seated }] : [],
      lean: new NumTrack(0),
      twist: new NumTrack(0),
      hands: { L: [], R: [] },
      grip: { L: new NumTrack(0.3), R: new NumTrack(0.3) },
      point: { L: new NumTrack(0), R: new NumTrack(0) },
      motions: { L: [], R: [] },
      looks: [],
      pulses: [],
      smile: new NumTrack(0.15),
      brows: new NumTrack(0),
      jacket: new NumTrack(0),
      blinks: [],
      speech
    };
  });

  /* ------------------------------------------------------- props, chairs */
  const props: Record<string, PropProg> = {};
  for (const [name, p] of Object.entries(acted.props)) {
    props[name] = { kind: p.kind, holders: [{ f: -1e9, h: p.start, blend: 0 }], open: new NumTrack(0) };
  }
  const chairs: Program["chairs"] = {};
  for (const [name, ch] of Object.entries(set.chairs)) {
    chairs[name] = { x: new NumTrack(ch.at[0]), z: new NumTrack(ch.at[1]), yaw: new NumTrack(ch.yaw, true) };
  }

  const screen: Program["screen"] = [];
  const display: Program["display"] = [];
  const sounds: Program["sounds"] = [];

  /** Where a person's feet are at frame f, per the paths written so far. */
  function posAt(p: PersonProg, f: number): [number, number] {
    let pos = p.startPos;
    for (const seg of p.path) {
      if (f < seg.f0) break;
      const at = pathAt(seg, pathDist(seg, f));
      pos = [at.x, at.z];
    }
    return pos;
  }

  /** Set a path segment, discarding any written after it starts. */
  function addPath(p: PersonProg, seg: PathSeg) {
    p.path = p.path.filter((s) => s.f0 < seg.f0);
    p.path.push(seg);
  }

  /* ------------------------------------------------------- the beats */
  for (const b of acted.beats) {
    const p = people[b.who];
    if (!p && !["screen", "display", "sound", "chair"].includes(b.do)) {
      throw new Error(`acted beat: nobody called "${b.who}"`);
    }
    const f0 = cue(b.at);
    const dur = "dur" in b && typeof b.dur === "number" ? b.dur : DUR[b.do] ?? 0.5;
    let f1 = f0 + sec(dur);

    switch (b.do) {
      case "walk": {
        const from = posAt(p, f0);
        const pts: [number, number][] = [from, ...b.path];
        let D = 0;
        for (let i = 1; i < pts.length; i++) D += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        const speed = b.speed ?? 1.1;
        f1 = f0 + sec(D / speed + 0.5);
        const last = pts[pts.length - 1];
        const prev = pts[pts.length - 2];
        const face = b.face ?? Math.atan2(-(last[1] - prev[1]), last[0] - prev[0]);
        addPath(p, makePath(f0, f1, pts, { gait: true, faceTravel: true, face, ramp: sec(0.45) }));
        p.yaw.moveTo(f1 - 1, f1, face, () => 1);
        break;
      }
      case "step": {
        const from = posAt(p, f0);
        const face = p.yaw.at(f0);
        addPath(p, makePath(f0, f1, [from, b.to], { gait: true, faceTravel: false, face, ramp: Math.round((f1 - f0) / 2) }));
        break;
      }
      case "turn":
        p.yaw.moveTo(f0, f1, b.yaw);
        break;
      case "sit": {
        p.seats.push({ f: f0, chair: b.chair });
        p.sit.moveTo(f0, f1, 1);
        sounds.push({ f: f1 - sec(0.25), name: "chair", volume: 0.25 });
        break;
      }
      case "stand":
        p.sit.moveTo(f0, f1, 0);
        sounds.push({ f: f0 + sec(0.2), name: "chair", volume: 0.2 });
        break;
      case "scoot": {
        const from = posAt(p, f0);
        const y = p.yaw.at(f0);
        const v = rotY([b.by, 0, 0], y);
        addPath(p, makePath(f0, f1, [from, [from[0] + v[0], from[1] + v[2]]], {
          gait: false, faceTravel: false, face: y, ramp: Math.round((f1 - f0) / 2)
        }));
        const ch = chairs[b.chair];
        ch.x.moveTo(f0, f1, ch.x.at(f0) + v[0]);
        ch.z.moveTo(f0, f1, ch.z.at(f0) + v[2]);
        sounds.push({ f: f0, name: "chair", volume: 0.3 });
        break;
      }
      case "lean":
        p.lean.moveTo(f0, f1, b.amount);
        break;
      case "twist":
        p.twist.moveTo(f0, f1, b.amount);
        break;

      case "look": {
        p.looks = p.looks.filter((l) => l.f0 < f0);
        p.looks.push({ f0, to: b.to, dur: sec(dur) });
        f1 = f0 + sec(dur);
        if (b.hold !== undefined) {
          p.looks.push({ f0: f1 + sec(b.hold), to: "default", dur: sec(0.4) });
          f1 += sec(b.hold);
        }
        break;
      }
      case "nod":
        p.pulses.push({ f0, dur: f1 - f0, kind: "nod", times: b.times ?? 1, size: b.size ?? 1 });
        break;
      case "shake":
        p.pulses.push({ f0, dur: f1 - f0, kind: "shake", times: b.times ?? 2, size: 1 });
        break;
      case "smile":
        p.smile.moveTo(f0, f1, b.amount);
        break;
      case "brows":
        p.brows.moveTo(f0, f1, b.amount);
        break;

      case "reach": {
        const segs = p.hands[b.hand];
        p.hands[b.hand] = segs.filter((s) => s.f0 < f0);
        p.hands[b.hand].push({ f0, f1, to: b.to, palm: b.palm ?? "auto", arc: b.arc ?? 0.04 });
        if (b.grip !== undefined) p.grip[b.hand].moveTo(f0, f1, b.grip);
        p.point[b.hand].moveTo(f0, f1, b.point ?? 0);
        if (b.hold !== undefined) {
          const r0 = f1 + sec(b.hold);
          const r1 = r0 + sec(DUR.rest);
          p.hands[b.hand].push({ f0: r0, f1: r1, to: { body: "rest" }, palm: "auto", arc: 0.02 });
          p.grip[b.hand].moveTo(r0, r1, 0.3);
          p.point[b.hand].moveTo(r0, r1, 0);
          f1 = r1;
        }
        break;
      }
      case "rest": {
        for (const h of b.hand === "both" ? (["L", "R"] as const) : [b.hand]) {
          p.hands[h] = p.hands[h].filter((s) => s.f0 < f0);
          p.hands[h].push({ f0, f1, to: { body: "rest" }, palm: "auto", arc: 0.02 });
          p.grip[h].moveTo(f0, f1, 0.3);
          p.point[h].moveTo(f0, f1, 0);
          p.motions[h] = p.motions[h].filter((m) => m.f0 < f0);
        }
        break;
      }
      case "type": {
        const arrive = sec(0.4);
        for (const h of ["L", "R"] as const) {
          p.hands[h] = p.hands[h].filter((s) => s.f0 < f0);
          p.hands[h].push({ f0, f1: f0 + arrive, to: { spot: h === "L" ? "keyL" : "keyR" }, palm: "down", arc: 0.03 });
          p.grip[h].moveTo(f0, f0 + arrive, 0.45);
          p.point[h].moveTo(f0, f0 + arrive, 0);
          p.motions[h].push({ f0: f0 + arrive - 4, f1, kind: "type" });
        }
        sounds.push({ f: f0 + arrive, name: "typing", volume: 0.3, frames: f1 - f0 - arrive });
        break;
      }
      case "gesture": {
        const out = sec(0.45);
        const hold = sec(0.35);
        const segs = p.hands[b.hand].filter((s) => s.f0 < f0);
        segs.push({ f0, f1: f0 + out, to: b.toward, palm: "up", arc: 0.05 });
        segs.push({ f0: f0 + out + hold, f1: f1, to: { body: "rest" }, palm: "auto", arc: 0.02 });
        p.hands[b.hand] = segs;
        p.grip[b.hand].moveTo(f0, f0 + out, 0.05);
        p.grip[b.hand].moveTo(f0 + out + hold, f1, 0.3);
        break;
      }
      case "scribble": {
        p.motions[b.hand].push({ f0, f1, kind: b.style, on: b.on });
        sounds.push({ f: f0, name: "pen", volume: 0.35, frames: f1 - f0 });
        break;
      }
      case "tap": {
        const times = b.times ?? 2;
        f1 = f0 + sec(0.22 * times + 0.1);
        p.motions[b.hand].push({ f0, f1, kind: "tap", times });
        break;
      }

      case "jacket":
        p.jacket.moveTo(f0, f1, b.open);
        break;

      case "take": {
        const pr = props[b.prop];
        pr.holders = pr.holders.filter((h) => h.f < f0);
        pr.holders.push({ f: f0, h: { hand: [b.who, b.hand], grip: b.grip ?? "keep" }, blend: 5 });
        if (pr.kind !== "pen") sounds.push({ f: f0, name: "paper", volume: 0.3 });
        break;
      }
      case "put": {
        const pr = props[b.prop];
        pr.holders = pr.holders.filter((h) => h.f < f0);
        pr.holders.push({ f: f0, h: { spot: b.spot }, blend: b.blend ?? 5 });
        if (pr.kind !== "pen") sounds.push({ f: f0, name: "paper", volume: 0.22 });
        break;
      }
      case "stow": {
        const pr = props[b.prop];
        pr.holders = pr.holders.filter((h) => h.f < f0);
        pr.holders.push({ f: f0, h: { pocket: b.into }, blend: 9 });
        break;
      }
      case "open":
        props[b.prop].open.moveTo(f0, f1, b.amount);
        break;

      case "chair": {
        const ch = chairs[b.chair];
        ch.x.moveTo(f0, f1, b.to[0]);
        ch.z.moveTo(f0, f1, b.to[1]);
        if (b.yaw !== undefined) ch.yaw.moveTo(f0, f1, b.yaw);
        sounds.push({ f: f0, name: "chair", volume: 0.3 });
        break;
      }
      case "screen":
        screen.push({ f: f0, state: b.state, dur: f1 - f0 });
        break;
      case "display":
        display.push({ f: f0, text: b.text });
        break;
      case "sound":
        sounds.push({ f: f0, name: b.name, volume: b.volume ?? 0.5 });
        break;
    }
    if (b.id) ends[b.id] = f1;
  }

  /* ------------------------------------------------------- footsteps */
  /* One per footfall, read off the gait the same way the feet are placed,
     so a step you hear is a foot you see land. */
  for (const p of Object.values(people)) {
    for (const seg of p.path) {
      if (!seg.gait) continue;
      const falls: number[] = [];
      for (let k = 1; k <= seg.steps; k++) falls.push(k * seg.step - 0.35 * seg.step);
      falls.push(seg.D);
      let fi = 0;
      for (let f = seg.f0; f <= seg.f1 && fi < falls.length; f++) {
        if (pathDist(seg, f) >= falls[fi] - 1e-6) {
          sounds.push({ f, name: "step", volume: fi === falls.length - 1 ? 0.18 : 0.3 });
          fi++;
        }
      }
    }
  }

  /* ------------------------------------------------------- living */
  /*
   * The acting nobody writes down. People blink every few seconds, and more
   * often when their eyes jump; the speaker's head moves with the stresses of
   * the sentence; the listener acknowledges a statement with a small nod. A
   * figure without these reads as a mannequin no matter how well it reaches.
   */
  const total = d.durationInFrames;
  for (const p of Object.values(people)) {
    let seedy = p.seed * 1000;
    const rnd = () => {
      seedy = (seedy * 9301 + 49297) % 233280;
      return seedy / 233280;
    };
    for (let f = sec(0.6 + rnd()); f < total; f += sec(2.6 + rnd() * 2.8)) p.blinks.push(f);
    for (const l of p.looks) if (rnd() < 0.7) p.blinks.push(l.f0 + 1);
    p.blinks.sort((a, b) => a - b);

    for (const s of p.speech) {
      s.words.forEach((w, i) => {
        const stressed = w.text.replace(/[^A-Za-zÄÖÜäöüß]/g, "").length > 4 || /^[A-ZÄÖÜ]/.test(w.text) && i > 0;
        if (stressed) p.pulses.push({ f0: w.from - 2, dur: sec(0.32), kind: "bob", times: 1, size: 0.8 + rnd() * 0.5 });
      });
      if (s.question) {
        const last = s.words[s.words.length - 1];
        p.brows.moveTo(last.from - sec(0.25), last.from, 0.8);
        p.brows.moveTo(s.to + sec(0.5), s.to + sec(0.8), 0);
      }
    }
    /* the partner's statements get a nod unless the scene already nods there */
    const partner = p.partner ? people[p.partner] : null;
    if (partner) {
      for (const s of partner.speech) {
        if (s.question) continue;
        const busy = p.pulses.some((q) => q.kind === "nod" && Math.abs(q.f0 - s.to) < sec(1.2));
        if (!busy) p.pulses.push({ f0: s.to - sec(0.35), dur: sec(0.6), kind: "nod", times: 1, size: 0.45 });
      }
    }
  }

  /* ------------------------------------------------------- shots */
  const shots = acted.shots.map((shot) => ({ f: cue(shot.at), shot })).sort((a, b) => a.f - b.f);

  return { fps, duration: total, set, people, props, chairs, screen, display, sounds, shots };
}
