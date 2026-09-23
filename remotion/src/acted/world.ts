/*
 * Everything in the room, at any frame, computed on demand.
 *
 * The pieces depend on each other in ways that are awkward to order by hand:
 * a hand reaches for a passport that is lying on the desk, or sitting in
 * someone else's hand, or in a pocket that moves with the chest it is in; a
 * gaze follows another person's hand; a prop that was just picked up keeps
 * the exact offset it had at the moment the fingers closed, which means
 * knowing where the hand and the prop were on an earlier frame.
 *
 * So nothing is computed in an order. Every quantity is a function of (who,
 * frame), memoised, and asks for whatever else it needs. The dependencies
 * run backwards in time or sideways between people but never in a circle,
 * because the choreography never has two hands each reaching for what the
 * other is holding at the same moment.
 *
 * One World per film. Remotion renders the frames of a film in the same page,
 * so the memo carries across frames — which matters for ink, where the line
 * on frame 900 is every pen position since frame 860.
 */

import type { Holder, PropKind, Vec3 } from "./types";
import type { Program, PersonProg } from "./timeline";
import { solveBody, solveCore, PEN_TIP, type Body, type Ctx } from "./rig";
import {
  add, basis, clamp, cross, mul, norm, QI, qyaw, smooth, xbasis, xinv, xlerp, xmul, type Xform
} from "./math";

/* ------------------------------------------------------------------ */
/* How each kind of prop sits in a hand                                */
/* ------------------------------------------------------------------ */

/*
 * In the hand's frame: x along the fingers, y out of the palm. A prop's own
 * frame is x along its long side, y out of its face, z across. The "carry"
 * hold is what a thing settles into when picked up to be taken somewhere; a
 * hand-over keeps whatever offset the fingers closed on instead.
 */
const CARRY: Record<PropKind, Xform> = {
  passport: { p: [0.1, 0.018, 0], q: QI },
  folder: { p: [0.15, 0.02, 0.02], q: QI },
  sheet: { p: [0.17, 0.012, 0.02], q: QI },
  form: { p: [0.17, 0.012, 0.02], q: QI },
  /* the pen: tip at PEN_TIP, the barrel running back up past the knuckles */
  pen: (() => {
    const dir = norm([-0.55, -0.8, 0.12]);
    const [bx, by, bz] = basis(dir, [0, 0, 1]);
    const centre = add(PEN_TIP, mul(dir, 0.07));
    return xbasis(centre, bx, by, bz);
  })()
};

/** Prop sizes: long side, thickness, short side. */
export const PROP_SIZE: Record<PropKind, Vec3> = {
  passport: [0.125, 0.009, 0.088],
  folder: [0.32, 0.012, 0.235],
  sheet: [0.297, 0.0015, 0.21],
  form: [0.297, 0.0015, 0.21],
  pen: [0.14, 0.011, 0.011]
};

export type PropState = { x: Xform; visible: boolean; open: number };
export type Ink = [number, number][][];

export class World {
  private cores = new Map<string, ReturnType<typeof solveCore>>();
  private bodies = new Map<string, Body>();
  private propX = new Map<string, Xform>();
  private inkCache = new Map<string, { g: number; pts: ([number, number] | null) }[]>();
  readonly ctx: Ctx;

  constructor(readonly prog: Program) {
    const self = this;
    this.ctx = {
      fps: prog.fps,
      chair: (name, f) => self.chair(name, f),
      spot: (name) => {
        const s = prog.set.spots[name];
        if (!s) throw new Error(`no spot "${name}" in the set`);
        return { p: s.p, yaw: s.yaw ?? 0 };
      },
      anchor: (name) => prog.set.anchors[name],
      prop: (name, f) => self.prop(name, f).x,
      heldBy: (name, f) => {
        const { h } = self.holderAt(name, f);
        return "hand" in h.h ? [h.h.hand[0], h.h.hand[1], h.f] : null;
      },
      body: (name, f) => self.body(name, f),
      core: (name, f) => self.core(name, f)
    };
  }

  person(name: string): PersonProg {
    const p = this.prog.people[name];
    if (!p) throw new Error(`nobody called "${name}"`);
    return p;
  }

  chair(name: string, f: number) {
    const def = this.prog.set.chairs[name];
    const tr = this.prog.chairs[name];
    return {
      at: [tr.x.at(f), tr.z.at(f)] as [number, number],
      yaw: tr.yaw.at(f),
      seat: def.seat,
      desk: !!def.desk
    };
  }

  core(name: string, f: number) {
    const key = name + "@" + f;
    let c = this.cores.get(key);
    if (!c) {
      c = solveCore(this.person(name), f, this.ctx);
      /* a seated person at a desk rests their hands on it */
      const p = this.person(name);
      const seat = [...p.seats].reverse().find((s) => s.f <= f);
      (c as typeof c & { atDesk: boolean }).atDesk = !!seat && !!this.prog.set.chairs[seat.chair]?.desk;
      this.cores.set(key, c);
    }
    return c;
  }

  body(name: string, f: number): Body {
    const key = name + "@" + f;
    let b = this.bodies.get(key);
    if (!b) {
      b = solveBody(this.person(name), f, this.ctx);
      this.bodies.set(key, b);
    }
    return b;
  }

  /* ---------------------------------------------------------- props */

  private holderAt(name: string, f: number) {
    const hs = this.prog.props[name].holders;
    let i = hs.length - 1;
    while (i > 0 && hs[i].f > f) i--;
    return { i, h: hs[i] };
  }

  private rest(name: string, h: Holder, f: number): Xform {
    const kind = this.prog.props[name].kind;
    if ("spot" in h) {
      const s = this.ctx.spot(h.spot);
      const lift = PROP_SIZE[kind][1] / 2;
      return { p: add(s.p, [0, lift, 0]), q: qyaw(s.yaw) };
    }
    if ("pocket" in h) {
      /* standing upright in the inside pocket on the left of the chest */
      const c = this.core(h.pocket, f);
      const k = c.k;
      const p = add(c.chestTop, add(mul(c.chestF, 0.075 * k), add(mul(c.chestU, -0.27 * k), mul(c.chestR, -0.08 * k))));
      return xbasis(p, c.chestU, c.chestF, mul(c.chestR, -1));
    }
    if ("inside" in h) {
      const parent = this.prop(h.inside, f).x;
      return xmul(parent, { p: h.off ?? [0, 0.004, 0], q: QI });
    }
    /* a hand, holding it the carry way */
    const b = this.body(h.hand[0], f);
    return xmul(b.hand[h.hand[1]], CARRY[kind]);
  }

  prop(name: string, f: number): PropState {
    const pr = this.prog.props[name];
    if (!pr) throw new Error(`no prop "${name}"`);
    const key = name + "@" + f;
    let x = this.propX.get(key);
    const { i, h } = this.holderAt(name, f);
    const holder = h.h;
    if (!x) {
      if (i === 0 || h.blend <= 0) {
        x = this.rest(name, holder, f);
      } else if ("hand" in holder) {
        /* the offset the fingers closed on, captured the frame before */
        const before = this.prop(name, h.f - 1).x;
        const handThen = this.body(holder.hand[0], h.f).hand[holder.hand[1]];
        const rel0 = xmul(xinv(handThen), before);
        const kind = pr.kind;
        const rel =
          holder.grip === "carry"
            ? xlerp(rel0, CARRY[kind], smooth((f - h.f) / Math.max(1, h.blend * 2)))
            : rel0;
        const handNow = this.body(holder.hand[0], f).hand[holder.hand[1]];
        x = xmul(handNow, rel);
      } else {
        const target = this.rest(name, holder, f);
        const u = (f - h.f) / h.blend;
        if (u >= 1) x = target;
        else x = xlerp(this.prop(name, h.f - 1).x, target, smooth(u));
      }
      this.propX.set(key, x);
    }
    const hidden = "pocket" in holder && f >= h.f + h.blend && i > 0 ? true : "pocket" in holder && i === 0;
    return { x, visible: !hidden, open: pr.open.at(f) };
  }

  /* ---------------------------------------------------------- ink */

  /**
   * Every line the pen has drawn on this paper by frame f, in the paper's
   * own frame (x up the page, z across), split wherever the tip left the
   * paper.
   */
  ink(paper: string, f: number): Ink {
    const strokes: Ink = [];
    for (const p of Object.values(this.prog.people)) {
      for (const side of ["L", "R"] as const) {
        for (const m of p.motions[side]) {
          if (m.on !== paper || m.f0 > f) continue;
          const key = `${p.name}${side}${m.f0}`;
          let samples = this.inkCache.get(key);
          if (!samples) {
            samples = [];
            const pen = Object.keys(this.prog.props).find((n) => {
              if (this.prog.props[n].kind !== "pen") return false;
              const hh = this.holderAt(n, m.f0 + 1).h.h;
              return "hand" in hh && hh.hand[0] === p.name && hh.hand[1] === side;
            });
            if (pen) {
              for (let g = m.f0; g <= m.f1; g += 0.25) {
                const b = this.body(p.name, g);
                const k = b.k;
                const ax = b.handAxes[side];
                const tip = add(b.wrist[side], add(mul(ax.x, PEN_TIP[0] * k), add(mul(ax.y, PEN_TIP[1] * k), mul(ax.z, PEN_TIP[2] * k))));
                const local = xmul(xinv(this.prop(paper, Math.floor(g)).x), { p: tip, q: QI }).p;
                const onPaper = local[1] < 0.0025 && Math.abs(local[0]) < 0.15 && Math.abs(local[2]) < 0.105;
                samples.push({ g, pts: onPaper ? [local[0], local[2]] : null });
              }
            }
            this.inkCache.set(key, samples);
          }
          let cur: [number, number][] = [];
          for (const s of samples) {
            if (s.g > f) break;
            if (s.pts) cur.push(s.pts);
            else if (cur.length) {
              strokes.push(cur);
              cur = [];
            }
          }
          if (cur.length) strokes.push(cur);
        }
      }
    }
    return strokes.filter((s) => s.length > 1);
  }

  /* ---------------------------------------------------------- the room */

  setState(f: number) {
    const prog = this.prog;
    const chairs: Record<string, { at: [number, number]; yaw: number }> = {};
    for (const name of Object.keys(prog.chairs)) {
      const c = this.chair(name, f);
      chairs[name] = { at: c.at, yaw: c.yaw };
    }
    const disp = [...prog.display].reverse().find((d) => d.f <= f);
    const scr = [...prog.screen].reverse().find((s) => s.f <= f);
    return {
      chairs,
      display: disp ? disp.text : "B 041",
      displayFlash: disp ? (f - disp.f < prog.fps * 1.4 ? (f - disp.f) / (prog.fps * 1.4) : 0) : 0,
      screen: scr ? scr.state : "list",
      screenProgress: scr ? clamp((f - scr.f) / Math.max(1, scr.dur)) : 0,
      clock: 58.5 + f / prog.fps / 60
    };
  }
}

export { cross };
