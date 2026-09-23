/*
 * A body, solved from scratch on every frame.
 *
 * There is no animation data here and no bones in the three.js sense. For a
 * given frame the channels written by timeline.ts say where the feet are, how
 * far the person is sat down, how far forward they lean, where each hand is
 * headed and what the eyes are after. This file turns that into joint
 * positions:
 *
 *   1. the core: root, pelvis, chest, shoulders, neck — forward kinematics
 *      from the channels, plus breath and sway
 *   2. the limbs: each hand's target is resolved (it may be a point on the
 *      person's own body, on the desk, or on a prop moving in someone else's
 *      hand), then the arm is solved with two-bone IK; the legs likewise, to
 *      feet that are either planted, mid-stride or set down in front of a chair
 *   3. the head: turned towards what the eyes are after, most of the way;
 *      the eyes do the rest, and get there first
 *
 * Because everything comes from targets and IK rather than from stored
 * angles, a beat can say "hand to the passport" and the arm works out how to
 * get there from wherever the body happens to be — sat, leaning, twisted.
 *
 * Proportions are for a stylised adult of 1.76 m with a head a little large,
 * like the drawn cast. `k` scales the lot for a shorter person.
 */

import type { Palm, Target, LookTarget, Vec3 } from "./types";
import type { PersonProg, HandSeg, Motion } from "./timeline";
import { pathAt, pathDist } from "./timeline";
import {
  add, angleDiff, basis, bump, clamp, cross, dot, easeOut, ik2, len, lerp, lerp3, mjerk, mul,
  norm, rotAxis, rotY, smooth, sub, wobble, type Xform, xbasis
} from "./math";

/* ------------------------------------------------------------------ */
/* Proportions (metres, for 1.76 m)                                   */
/* ------------------------------------------------------------------ */

export const P = {
  ankle: 0.08,
  shin: 0.43,
  thigh: 0.43,
  hipHalf: 0.095,
  /** pelvis (the point between the hip joints) above the floor, standing */
  pelvisStand: 0.905,
  /** pelvis above the seat when sat */
  pelvisSeat: 0.095,
  spine: 0.5,
  shoulderHalf: 0.19,
  neck: 0.035,
  headUp: 0.145,
  headR: 0.125,
  upper: 0.28,
  fore: 0.26,
  /** wrist to the middle of the palm */
  palm: 0.055,
  footHalf: 0.1
};

/** The pen tip in the hand's frame: x along the fingers, y out of the palm. */
export const PEN_TIP: Vec3 = [0.095, 0.06, 0.012];

const DESK_TOP = 0.77;

/* ------------------------------------------------------------------ */
/* What the solver produces                                            */
/* ------------------------------------------------------------------ */

export type Side = "L" | "R";

export type Body = {
  name: string;
  k: number;
  yaw: number;
  root: Vec3;
  pelvis: Vec3;
  /** the person's own axes at the hips: forward, up, right */
  hipF: Vec3;
  hipR: Vec3;
  chestTop: Vec3;
  chestF: Vec3;
  chestU: Vec3;
  chestR: Vec3;
  neck: Vec3;
  head: Vec3;
  headF: Vec3;
  headU: Vec3;
  headR: Vec3;
  /** where each eye is aimed, as a world point */
  gaze: Vec3;
  shoulder: Record<Side, Vec3>;
  elbow: Record<Side, Vec3>;
  wrist: Record<Side, Vec3>;
  /** hand frame at the wrist: x along the fingers, y out of the palm */
  hand: Record<Side, Xform>;
  handAxes: Record<Side, { x: Vec3; y: Vec3; z: Vec3 }>;
  grip: Record<Side, number>;
  point: Record<Side, number>;
  hip: Record<Side, Vec3>;
  knee: Record<Side, Vec3>;
  ankle: Record<Side, Vec3>;
  /** the way each foot points */
  footF: Record<Side, Vec3>;
  sit: number;
  walking: number;
  face: {
    blink: number;
    smile: number;
    brows: number;
    jacket: number;
  };
};

/** What the solver needs from the rest of the world. */
export type Ctx = {
  fps: number;
  chair(name: string, f: number): { at: [number, number]; yaw: number; seat: number; desk: boolean };
  spot(name: string): { p: Vec3; yaw: number };
  anchor(name: string): Vec3;
  prop(name: string, f: number): Xform;
  /** who is holding a prop at frame f, if anyone: [person, hand, since frame] */
  heldBy(name: string, f: number): [string, Side, number] | null;
  /** another person, solved at this frame (their head, their hands) */
  body(name: string, f: number): Body;
  /** the core only — for a gaze aimed at someone, no limbs needed */
  core(name: string, f: number): Core;
};

type Core = Omit<Body, "gaze" | "elbow" | "wrist" | "hand" | "handAxes" | "grip" | "point" | "headF" | "headU" | "headR" | "head"> & {
  head0: Vec3;
  armSwing: number;
};

/* ------------------------------------------------------------------ */
/* Body spots                                                          */
/* ------------------------------------------------------------------ */

/*
 * Places on a person a hand can be sent, as [forward, up, right] from the
 * middle of the shoulders (chest) or from between the hips (pelvis).
 * `mirror` flips the sideways part for the left hand, so "rest" means each
 * hand's own side.
 */
const BODY_SPOTS: Record<string, { from: "chest" | "pelvis"; off: Vec3; mirror: boolean; palm: Palm }> = {
  lap: { from: "pelvis", off: [0.27, 0.075, 0.12], mirror: true, palm: "down" },
  /* the inside breast pocket on the left, reached across by the right hand */
  /* at chest height, a hand's width below the collarbone — not at the
     collar, where the first try put it and the hand ended up in the beard */
  pocketIn: { from: "chest", off: [0.07, -0.25, -0.07], mirror: false, palm: "back" },
  /* just in front of the jacket at pocket height: the way in and out */
  pocketOut: { from: "chest", off: [0.2, -0.27, -0.02], mirror: false, palm: "in" },
  /* holding something up in front of the chest to hand it over */
  present: { from: "chest", off: [0.34, -0.2, 0.08], mirror: true, palm: "in" },
  /* holding a document up to read it */
  /* holding a document up to read it: chest high, where the camera can see
     it — lower and she reads her lap */
  read: { from: "chest", off: [0.3, -0.17, 0.03], mirror: true, palm: "up" },
  /* carrying something at the side while walking */
  carry: { from: "chest", off: [0.02, -0.56, 0.23], mirror: true, palm: "in" },
  /* hand on the thigh, sitting */
  thigh: { from: "pelvis", off: [0.2, 0.08, 0.14], mirror: true, palm: "down" }
};

function palmVec(p: Palm, side: Side): Vec3 {
  if (Array.isArray(p)) return p;
  const s = side === "R" ? 1 : -1;
  switch (p) {
    case "down": return [0, -1, 0];
    case "up": return [0, 1, 0];
    case "forward": return [1, 0, 0];
    case "back": return [-1, 0, 0];
    case "in": return [0, 0, -s];
    case "out": return [0, 0, s];
  }
}

/* ------------------------------------------------------------------ */
/* 1. The core                                                         */
/* ------------------------------------------------------------------ */

export function solveCore(p: PersonProg, f: number, ctx: Ctx): Core {
  const k = p.look.height / 1.76;
  const t = f / ctx.fps;

  /* ---- where the feet are, and are they walking */
  let root: [number, number] = p.startPos;
  let yaw = p.yaw.at(f);
  let walking = 0;
  let bob = 0;
  let armSwing = 0;
  let feet: Record<Side, Vec3> | null = null;

  let seg = null as PersonProg["path"][number] | null;
  for (const s of p.path) {
    if (f < s.f0) break;
    seg = s;
    const d = pathDist(s, f);
    const at = pathAt(s, d);
    root = [at.x, at.z];
  }
  if (seg && f <= seg.f1) {
    const d = pathDist(seg, f);
    if (seg.faceTravel) {
      /* turn into the direction of travel over the first few frames and out
         of it into the final facing over the last few */
      const ahead = pathAt(seg, Math.min(seg.D, d + 0.3)).heading;
      const y0 = p.yaw.at(seg.f0 - 1);
      const inW = smooth((f - seg.f0) / (ctx.fps * 0.45));
      const outW = smooth((f - (seg.f1 - ctx.fps * 0.45)) / (ctx.fps * 0.45));
      let y = y0 + angleDiff(y0, ahead) * inW;
      y = y + angleDiff(y, seg.face) * outW;
      yaw = y;
    }
    if (seg.gait) {
      feet = gaitFeet(seg, d, p.yaw.at(seg.f0 - 1), k);
      const speedish = clamp(Math.min(f - seg.f0, seg.f1 - f) / (ctx.fps * 0.35));
      walking = speedish;
      /* the pelvis is lowest as the weight lands and highest mid-stance */
      bob = -0.018 * k * Math.cos((2 * Math.PI * d) / seg.step) * speedish;
      armSwing = Math.sin((Math.PI * d) / seg.step) * speedish;
    }
  }
  const rootV: Vec3 = [root[0], 0, root[1]];
  const hipF = rotY([1, 0, 0], yaw);
  const hipR = rotY([0, 0, 1], yaw);
  const up: Vec3 = [0, 1, 0];

  /* ---- sitting */
  const s = p.sit.at(f);
  let seatPelvis: Vec3 | null = null;
  const seat = [...p.seats].reverse().find((x) => x.f <= f);
  if (seat) {
    const ch = ctx.chair(seat.chair, f);
    seatPelvis = add([ch.at[0], ch.seat + P.pelvisSeat * k, ch.at[1]], mul(hipF, -0.02));
  }

  /* weight shifting from foot to foot while standing; almost nothing seated */
  const sway = wobble(t * 0.9, p.seed) * (1 - s);
  const standPelvis = add(add(rootV, [0, P.pelvisStand * k + bob, 0]), mul(hipR, 0.012 * sway));
  let pelvis = standPelvis;
  if (seatPelvis && s > 0) {
    /* the hips go back before they go down, which is how a person sits */
    const hs = clamp(s * 1.25);
    const vs = s;
    pelvis = [
      lerp(standPelvis[0], seatPelvis[0], mjerk(hs)),
      lerp(standPelvis[1], seatPelvis[1], vs),
      lerp(standPelvis[2], seatPelvis[2], mjerk(hs))
    ];
  }

  /* ---- the spine */
  const speaking = p.speech.some((x) => f >= x.from - 6 && f < x.to + 6) ? 1 : 0;
  const lean =
    lerp(0.03, 0.09, s) +
    /* the hip hinge: forward while going down or getting up */
    0.5 * bump(s) * (s > 0.001 && s < 0.999 ? 1 : 0) +
    0.05 * walking +
    p.lean.at(f) +
    0.025 * speaking * s +
    0.012 * wobble(t * 0.6, p.seed + 4);
  const twist = p.twist.at(f) + 0.02 * wobble(t * 0.5, p.seed + 9);

  const chestU = rotAxis(up, hipR, -lean);
  const chestR = rotAxis(hipR, chestU, twist);
  const chestF = cross(chestU, chestR);
  const breath = Math.sin((t / 3.6) * Math.PI * 2 + p.seed);
  const chestTop = add(add(pelvis, mul(chestU, P.spine * k)), mul(chestU, 0.004 * breath));
  const shoulder = {
    L: add(add(chestTop, mul(chestR, -P.shoulderHalf * k)), mul(chestU, -0.02 * k + 0.002 * breath)),
    R: add(add(chestTop, mul(chestR, P.shoulderHalf * k)), mul(chestU, -0.02 * k + 0.002 * breath))
  };
  const neck = add(chestTop, mul(chestU, P.neck * k));
  const head0 = add(neck, mul(chestU, P.headUp * k));

  /* ---- the legs */
  const hip = {
    L: add(pelvis, mul(hipR, -P.hipHalf * k)),
    R: add(pelvis, mul(hipR, P.hipHalf * k))
  };
  if (!feet) {
    feet = {
      L: add(rootV, mul(hipR, -P.footHalf * k)),
      R: add(rootV, mul(hipR, P.footHalf * k))
    };
  }
  const knee = {} as Record<Side, Vec3>;
  const ankle = {} as Record<Side, Vec3>;
  const footF = {} as Record<Side, Vec3>;
  for (const side of ["L", "R"] as const) {
    const a: Vec3 = [feet[side][0], feet[side][1] + P.ankle * k, feet[side][2]];
    const pole = add(mul(hipF, 1), mul(hipR, (side === "R" ? 0.15 : -0.15)));
    const sol = ik2(hip[side], a, P.thigh * k, P.shin * k, pole);
    knee[side] = sol.mid;
    ankle[side] = sol.tip;
    footF[side] = hipF;
  }

  const jacket = p.jacket.at(f);
  return {
    name: p.name, k, yaw, root: rootV, pelvis, hipF, hipR,
    chestTop, chestF, chestU, chestR, neck, head0,
    shoulder, hip, knee, ankle, footF, sit: s, walking, armSwing,
    face: { blink: 1, smile: p.smile.at(f), brows: p.brows.at(f), jacket }
  };
}

/*
 * Where the feet are, part way along a walk.
 *
 * Steps land at even distances along the path, alternating feet, a little
 * ahead of the pelvis; a foot stays exactly where it landed until it is its
 * turn to swing, which is the whole difference between walking and skating.
 * The last step is followed by the trailing foot closing up beside it, so
 * the walk ends standing rather than mid-stride.
 */
function gaitFeet(seg: PersonProg["path"][number], d: number, startYaw: number, k: number): Record<Side, Vec3> {
  const lat = (side: Side, yaw: number): Vec3 => rotY([0, 0, (side === "R" ? 1 : -1) * P.footHalf * k], yaw);
  const yawAt = (dist: number) => (seg.faceTravel ? pathAt(seg, Math.min(seg.D, dist + 0.01)).heading : seg.face);
  const at = (dist: number): Vec3 => {
    const q = pathAt(seg, dist);
    return [q.x, 0, q.z];
  };
  const first: Side = "L";
  const other: Side = "R";
  type Print = { land: number; swing: number; pos: Vec3 };
  const prints: Record<Side, Print[]> = {
    L: [{ land: -1e9, swing: 1, pos: add(at(0), lat("L", startYaw)) }],
    R: [{ land: -1e9, swing: 1, pos: add(at(0), lat("R", startYaw)) }]
  };
  const n = seg.steps;
  for (let i = 1; i <= n; i++) {
    const foot = i % 2 === 1 ? first : other;
    const F = i * seg.step;
    const land = F - 0.35 * seg.step;
    const yaw = i === n ? seg.face : yawAt(F);
    prints[foot].push({ land, swing: i === 1 ? land : seg.step, pos: add(at(F), lat(foot, yaw)) });
  }
  /* the closing step */
  const closer = n % 2 === 1 ? other : first;
  prints[closer].push({ land: seg.D, swing: 0.35 * seg.step, pos: add(at(seg.D), lat(closer, seg.face)) });

  const out = {} as Record<Side, Vec3>;
  for (const side of ["L", "R"] as const) {
    const list = prints[side];
    let j = 0;
    while (j + 1 < list.length && list[j + 1].land <= d) j++;
    const cur = list[j];
    const next = list[j + 1];
    if (next && d > next.land - next.swing) {
      const u = clamp((d - (next.land - next.swing)) / next.swing);
      const e = mjerk(u);
      const pos = lerp3(cur.pos, next.pos, e);
      pos[1] = 0.09 * k * bump(u);
      out[side] = pos;
    } else {
      out[side] = cur.pos;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 2. Hands                                                            */
/* ------------------------------------------------------------------ */

type HandAim = { p: Vec3; n: Vec3 };

/** A body spot as a world point, and the palm's default for it. */
function bodySpot(c: Core, name: string, side: Side, off?: Vec3): HandAim {
  const k = c.k;
  if (name === "rest") return restSpot(c, side);
  const spot = BODY_SPOTS[name];
  if (!spot) throw new Error(`no body spot "${name}"`);
  const o = spot.off;
  const r = spot.mirror && side === "L" ? -o[2] : o[2];
  const local: Vec3 = [o[0] + (off?.[0] ?? 0), o[1] + (off?.[1] ?? 0), r + (off?.[2] ?? 0)];
  const [F, U, R, origin] =
    spot.from === "chest"
      ? [c.chestF, c.chestU, c.chestR, c.chestTop]
      : [c.hipF, [0, 1, 0] as Vec3, c.hipR, c.pelvis];
  const pnt = add(origin, add(mul(F, local[0] * k), add(mul(U, local[1] * k), mul(R, local[2] * k))));
  const pv = palmVec(spot.palm, side);
  const n = norm(add(mul(F, pv[0]), add(mul(U, pv[1]), mul(R, pv[2]))));
  return { p: pnt, n };
}

/*
 * Where a hand goes when it has nothing to do: hanging at the side when
 * standing (and swinging if walking), on the desk when sat at one, in the lap
 * otherwise.
 */
function restSpot(c: Core, side: Side): HandAim {
  const k = c.k;
  const s = side === "R" ? 1 : -1;
  const swing = c.armSwing * (side === "R" ? 1 : -1) * 0.16 * k;
  const hang = add(
    c.chestTop,
    add(mul(c.chestF, 0.04 * k + swing), add(mul(c.chestU, -0.585 * k), mul(c.chestR, s * 0.225 * k)))
  );
  const hangN = norm(add(mul(c.chestR, -s), mul(c.chestF, 0.15)));
  if (c.sit < 0.01) return { p: hang, n: hangN };

  const seated = (c as Core & { atDesk?: boolean }).atDesk
    ? {
        p: add(add(c.pelvis, mul(c.hipF, 0.44 * k)), add([0, DESK_TOP + 0.03 - c.pelvis[1], 0], mul(c.hipR, s * 0.12 * k))),
        n: [0, -1, 0] as Vec3
      }
    : {
        p: add(c.pelvis, add(mul(c.hipF, 0.27 * k), add([0, 0.075 * k, 0], mul(c.hipR, s * 0.12 * k)))),
        n: [0, -1, 0] as Vec3
      };
  const w = smooth(c.sit);
  return { p: lerp3(hang, seated.p, w), n: norm(lerp3(hangN, seated.n, w)) };
}

function palmWorld(c: Core, palm: Palm, side: Side): Vec3 {
  const v = palmVec(palm, side);
  return norm(add(mul(c.chestF, v[0]), add(mul(c.chestU, v[1]), mul(c.chestR, v[2]))));
}

function resolveTarget(c: Core, t: Target, palm: Palm | "auto", side: Side, f: number, ctx: Ctx): HandAim {
  let aim: HandAim;
  if ("body" in t) {
    aim = bodySpot(c, t.body, side, t.off);
  } else if ("spot" in t) {
    const s = ctx.spot(t.spot);
    aim = { p: add(s.p, t.off ?? [0, 0, 0]), n: [0, -1, 0] };
  } else if ("prop" in t) {
    /*
     * Reaching for a prop and then taking it is how every hand-over is
     * written, and once the fingers close the prop is wherever this hand is
     * — so "go to the prop" would chase itself. From the moment it is taken,
     * the target is where the prop was the frame before.
     */
    const held = ctx.heldBy(t.prop, f);
    const at = held && held[0] === c.name ? held[2] - 1 : f;
    const x = ctx.prop(t.prop, at);
    const off = t.off ?? [0, 0, 0];
    const q = x.q;
    /* the offset is in the prop's own frame, so "the bottom of the form"
       stays the bottom of the form however it is lying */
    const u: Vec3 = [q[0], q[1], q[2]];
    const tt = mul(cross(u, off), 2);
    const rotated = add(add(off, mul(tt, q[3])), cross(u, tt));
    aim = { p: add(x.p, rotated), n: [0, -1, 0] };
  } else {
    aim = { p: t.world, n: [0, -1, 0] };
  }
  if (palm !== "auto") aim.n = palmWorld(c, palm, side);
  return aim;
}

function evalHand(c: Core, segs: HandSeg[], i: number, side: Side, f: number, ctx: Ctx, depth = 0): HandAim {
  if (i < 0 || depth > 5) return restSpot(c, side);
  const seg = segs[i];
  const B = resolveTarget(c, seg.to, seg.palm, side, f, ctx);
  if (f >= seg.f1) return B;
  const A = evalHand(c, segs, i - 1, side, f, ctx, depth + 1);
  const u = clamp((f - seg.f0) / Math.max(1, seg.f1 - seg.f0));
  const e = mjerk(u);
  const p = add(lerp3(A.p, B.p, e), [0, seg.arc * bump(u), 0]);
  return { p, n: norm(lerp3(A.n, B.n, e)) };
}

/* ---- writing ---------------------------------------------------- */

/*
 * The pen's path over the paper, in the paper's own frame: x towards the top
 * of the page, z to the writer's right, y up off the paper. Lifted between
 * words; the ink is taken from where the tip actually went, so a lift is a
 * gap in the line.
 */
function writingPath(kind: "fill" | "sign", u: number): Vec3 {
  if (kind === "sign") {
    const approach = 0.14;
    if (u < approach) {
      const v = u / approach;
      return [-0.09 + 0.02 * (1 - v), 0.012 * (1 - v) + 0.0005, -0.05 - 0.02 * (1 - v)];
    }
    const v = (u - approach) / (1 - approach);
    const z = -0.05 + 0.11 * v + 0.009 * Math.sin(v * Math.PI * 2 * 5.5);
    const x = -0.095 + 0.011 * Math.sin(v * Math.PI * 2 * 5.5 + 1.2) * (1 - 0.6 * v) + 0.004 * v;
    const lift = v > 0.93 ? 0.012 * (v - 0.93) / 0.07 : 0;
    return [x, 0.0005 + lift, z];
  }
  const fields = [0.065, 0.025, -0.015];
  const n = fields.length;
  const which = Math.min(n - 1, Math.floor(u * n));
  const v = u * n - which;
  const travel = 0.28;
  const x0 = fields[which];
  const zStart = -0.045 + (which % 2) * 0.01;
  const span = 0.055 + (which === 1 ? 0.02 : 0);
  if (v < travel) {
    /* lifted, from the end of the last word to the start of this one */
    const w = v / travel;
    const prevX = which === 0 ? x0 + 0.03 : fields[which - 1];
    const prevZ = which === 0 ? zStart - 0.03 : -0.045 + ((which - 1) % 2) * 0.01 + 0.055;
    return [lerp(prevX, x0, mjerk(w)), 0.012 * bump(w) + 0.004 + 0.0005 * (1 - w), lerp(prevZ, zStart, mjerk(w))];
  }
  const w = (v - travel) / (1 - travel);
  const z = zStart + span * w;
  const x = x0 + 0.004 * Math.sin(w * Math.PI * 2 * 7) + 0.0015 * Math.sin(w * 53);
  /* the tip leaves the paper for a moment between letters groups */
  const gap = Math.sin(w * Math.PI * 3) > 0.96 ? 0.004 : 0;
  return [x, 0.0005 + gap, z];
}

function motionOffset(m: Motion, f: number, side: Side, fps: number): Vec3 {
  const t = f / fps;
  const env = smooth((f - m.f0) / 5) * smooth((m.f1 - f) / 5);
  if (m.kind === "type") {
    const phase = side === "L" ? 0 : 1.9;
    const tap = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 3.7 + phase)), 3);
    return [0.012 * wobble(t * 3, phase) * env, 0.016 * tap * env, 0.02 * wobble(t * 1.7, phase + 3) * env];
  }
  if (m.kind === "tap") {
    const u = clamp((f - m.f0) / (m.f1 - m.f0));
    return [0, 0.03 * Math.abs(Math.sin(Math.PI * (m.times ?? 2) * u)) * env, 0];
  }
  return [0, 0, 0];
}

/* ------------------------------------------------------------------ */
/* 3. Everything                                                       */
/* ------------------------------------------------------------------ */

export function solveBody(p: PersonProg, f: number, ctx: Ctx): Body {
  const c = ctx.core(p.name, f) as Core & { atDesk?: boolean };
  const k = c.k;

  const shoulderOut: Record<Side, Vec3> = { L: c.shoulder.L, R: c.shoulder.R };
  const elbow = {} as Record<Side, Vec3>;
  const wrist = {} as Record<Side, Vec3>;
  const hand = {} as Record<Side, Xform>;
  const handAxes = {} as Body["handAxes"];

  for (const side of ["L", "R"] as const) {
    const segs = p.hands[side];
    let i = segs.length - 1;
    while (i >= 0 && segs[i].f0 > f) i--;
    let aim = evalHand(c, segs, i, side, f, ctx);

    /* motions on top: typing, tapping, and writing, which replaces the aim */
    let penGoal: Vec3 | null = null;
    for (const m of p.motions[side]) {
      if (f < m.f0 || f > m.f1) continue;
      if ((m.kind === "fill" || m.kind === "sign") && m.on) {
        const u = clamp((f - m.f0) / (m.f1 - m.f0));
        const local = writingPath(m.kind, u);
        const paper = ctx.prop(m.on, f);
        const q = paper.q;
        const uq: Vec3 = [q[0], q[1], q[2]];
        const tt = mul(cross(uq, local), 2);
        const world = add(paper.p, add(add(local, mul(tt, q[3])), cross(uq, tt)));
        const blend = smooth((f - m.f0) / 6) * smooth((m.f1 - f) / 6);
        penGoal = world;
        aim = { p: lerp3(aim.p, world, blend), n: aim.n };
      } else {
        aim = { p: add(aim.p, motionOffset(m, f, side, ctx.fps)), n: aim.n };
      }
    }

    const sh = shoulderOut[side];
    const sgn = side === "R" ? 1 : -1;
    const pole = add(add(mul(c.chestF, -0.35), mul(c.chestU, -0.7)), mul(c.chestR, sgn * 0.75));

    const solveFor = (palmTarget: Vec3) => {
      let fingers = norm(sub(palmTarget, sh));
      fingers = norm(sub(fingers, mul(aim.n, dot(fingers, aim.n))));
      const wristT = sub(palmTarget, mul(fingers, P.palm * k));
      const sol = ik2(sh, wristT, P.upper * k, P.fore * k, pole);
      const fore = norm(sub(sol.tip, sol.mid));
      let fx = sub(fore, mul(aim.n, dot(fore, aim.n)));
      if (len(fx) < 1e-4) fx = fingers;
      const [bx, by, bz] = basis(fx, aim.n);
      return { sol, bx, by, bz };
    };

    let r = solveFor(aim.p);
    if (penGoal) {
      /* put the pen's tip, not the palm, on the paper: measure where the tip
         ended up and move the hand by the miss. The wrist turns a little with
         every correction, so it takes a few rounds to settle — two left the
         tip hovering 5 mm up and the ink came out as dots. */
      let palmT = aim.p;
      for (let it = 0; it < 6; it++) {
        const tip = add(r.sol.tip, add(mul(r.bx, PEN_TIP[0] * k), add(mul(r.by, PEN_TIP[1] * k), mul(r.bz, PEN_TIP[2] * k))));
        palmT = add(palmT, sub(penGoal, tip));
        r = solveFor(palmT);
      }
    }
    elbow[side] = r.sol.mid;
    wrist[side] = r.sol.tip;
    hand[side] = xbasis(r.sol.tip, r.bx, r.by, r.bz);
    handAxes[side] = { x: r.bx, y: r.by, z: r.bz };
  }

  /* ---- the head and the eyes */
  const look = gazeAt(p, c, f, ctx, { wrist, hand, handAxes });
  const toH = sub(look.head, c.head0);
  const fl = dot(toH, c.chestF);
  const ul = dot(toH, c.chestU);
  const rl = dot(toH, c.chestR);
  let hy = clamp(Math.atan2(-rl, Math.max(1e-4, fl)) * 0.82, -1.25, 1.25);
  if (fl < 0) hy = clamp(Math.sign(-rl) * 1.25, -1.25, 1.25);
  let hp = clamp(Math.atan2(ul, Math.hypot(fl, rl)) * 0.78, -0.75, 0.45);
  hp += pulsesPitch(p, f, ctx.fps);
  hy += pulsesYaw(p, f, ctx.fps);

  const r1 = rotAxis(c.chestR, c.chestU, hy);
  const f1 = rotAxis(c.chestF, c.chestU, hy);
  const headF = rotAxis(f1, r1, hp);
  const headU = rotAxis(c.chestU, r1, hp);
  const headR = r1;
  const head = add(c.neck, mul(headU, P.headUp * k));

  return {
    ...c,
    head, headF, headU, headR,
    gaze: look.eyes,
    elbow, wrist, hand, handAxes,
    grip: { L: p.grip.L.at(f), R: p.grip.R.at(f) },
    point: { L: p.point.L.at(f), R: p.point.R.at(f) },
    face: { ...c.face, blink: blinkAt(p, f) }
  };
}

/* ---- gaze ------------------------------------------------------- */

function lookPoint(p: PersonProg, c: Core, to: LookTarget | "default", f: number, ctx: Ctx, own: Pick<Body, "wrist" | "hand" | "handAxes">): Vec3 {
  if (to === "default") {
    if (p.partner) return faceOf(p.partner, f, ctx);
    return add(c.head0, mul(c.chestF, 2));
  }
  if ("face" in to) return faceOf(to.face, f, ctx);
  if ("hand" in to) {
    const [who, side] = to.hand.split(".") as [string, Side];
    if (who === p.name) return add(own.wrist[side], mul(own.handAxes[side].x, 0.06 * c.k));
    return ctx.body(who, f).wrist[side];
  }
  if ("spot" in to) return add(ctx.spot(to.spot).p, to.off ?? [0, 0, 0]);
  if ("prop" in to) {
    /* a thing in this person's own hand: read the hand, which is solved
       already — asking the world would ask for this body again, which is
       still being solved, and go round for ever */
    const held = ctx.heldBy(to.prop, f);
    if (held && held[0] === p.name) {
      const side = held[1];
      return add(own.wrist[side], add(mul(own.handAxes[side].x, 0.1 * c.k), mul(own.handAxes[side].y, 0.02)));
    }
    return ctx.prop(to.prop, f).p;
  }
  if ("world" in to) return to.world;
  return add(c.head0, mul(c.hipF, 2));
}

function faceOf(name: string, f: number, ctx: Ctx): Vec3 {
  const o = ctx.core(name, f);
  return add(o.head0, [0, -0.01, 0]);
}

function gazeAt(p: PersonProg, c: Core, f: number, ctx: Ctx, own: Pick<Body, "wrist" | "hand" | "handAxes">) {
  const looks = p.looks;
  let i = looks.length - 1;
  while (i >= 0 && looks[i].f0 > f) i--;
  const cur = i >= 0 ? looks[i] : null;
  const B = lookPoint(p, c, cur ? cur.to : "default", f, ctx, own);
  let head = B;
  let eyes = B;
  if (cur) {
    const prev = i > 0 ? looks[i - 1].to : "default";
    const A = lookPoint(p, c, prev, f, ctx, own);
    /* the eyes jump in a few frames; the head follows over the beat's duration */
    eyes = lerp3(A, B, easeOut((f - cur.f0) / 4));
    head = lerp3(A, B, mjerk((f - cur.f0) / Math.max(1, cur.dur)));
  }
  /* a little restlessness in the eyes: nobody holds a point dead still */
  const t = f / ctx.fps;
  const dd = len(sub(eyes, c.head0));
  eyes = add(eyes, [0, 0.012 * dd * wobble(t * 2.3, p.seed + 1), 0.015 * dd * wobble(t * 1.9, p.seed + 2)]);
  return { head, eyes };
}

function pulsesPitch(p: PersonProg, f: number, fps: number) {
  let v = 0;
  for (const q of p.pulses) {
    if (f < q.f0 || f > q.f0 + q.dur) continue;
    const u = (f - q.f0) / q.dur;
    if (q.kind === "nod") v -= 0.2 * q.size * Math.pow(Math.sin(Math.PI * q.times * u), 2) * (1 - 0.3 * u);
    if (q.kind === "bob") v -= 0.05 * q.size * bump(u);
  }
  /* the talking head: a small drift while speaking */
  if (p.speech.some((s) => f >= s.from && f < s.to)) v += 0.025 * wobble(f / fps * 1.4, p.seed + 7);
  return v;
}

function pulsesYaw(p: PersonProg, f: number, fps: number) {
  let v = 0;
  for (const q of p.pulses) {
    if (q.kind !== "shake" || f < q.f0 || f > q.f0 + q.dur) continue;
    const u = (f - q.f0) / q.dur;
    v += 0.22 * Math.sin(Math.PI * 2 * q.times * u) * bump(u);
  }
  return v + 0.03 * wobble(f / fps * 0.7, p.seed + 11);
}

function blinkAt(p: PersonProg, f: number) {
  for (const b of p.blinks) {
    const u = f - b;
    if (u >= 0 && u < 6) return [0.55, 0.08, 0.05, 0.3, 0.7, 0.92][Math.floor(u)];
  }
  return 1;
}

export { BODY_SPOTS };
