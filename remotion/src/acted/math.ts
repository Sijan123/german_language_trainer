/*
 * Small vector maths on plain tuples.
 *
 * The rig is solved from scratch on every frame and a frame solves a few
 * hundred points; allocating THREE.Vector3s for that is fine, but tuples keep
 * the solver free of three.js so it can run in the overlay pass (projecting
 * callouts) and in the timeline compiler without a scene existing.
 */

import type { Vec3 } from "./types";

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
export const len = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: Vec3): Vec3 => {
  const l = len(a);
  return l < 1e-9 ? [0, 1, 0] : [a[0] / l, a[1] / l, a[2] / l];
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t
];
export const dist = (a: Vec3, b: Vec3) => len(sub(a, b));
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** Rotate a vector about +y. */
export const rotY = (v: Vec3, yaw: number): Vec3 => {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
};

/** Rotate a vector about an arbitrary unit axis (Rodrigues). */
export const rotAxis = (v: Vec3, axis: Vec3, angle: number): Vec3 => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const k = axis;
  const kv = cross(k, v);
  const kd = dot(k, v);
  return [
    v[0] * c + kv[0] * s + k[0] * kd * (1 - c),
    v[1] * c + kv[1] * s + k[1] * kd * (1 - c),
    v[2] * c + kv[2] * s + k[2] * kd * (1 - c)
  ];
};

/* ------------------------------------------------------------------ */
/* Timing curves                                                       */
/* ------------------------------------------------------------------ */

/*
 * Minimum jerk: the curve a human hand actually follows between two points
 * (Flash & Hogan). It is what makes a reach look like a reach rather than a
 * tween. Everything the body does goes through this or one of its halves.
 */
export const mjerk = (t: number) => {
  const x = clamp(t);
  return x * x * x * (10 - 15 * x + 6 * x * x);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** 0 → 1 → 0 across t in [0,1]; an arc or a pulse. */
export const bump = (t: number) => Math.sin(Math.PI * clamp(t));

/** Angle difference folded into (-π, π]. */
export const angleDiff = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d <= -Math.PI) d += Math.PI * 2;
  return d;
};

/* ------------------------------------------------------------------ */
/* Two-bone IK                                                         */
/* ------------------------------------------------------------------ */

/**
 * Where the middle joint of a two-bone chain goes.
 *
 * The root and the tip target are given; the elbow (or knee) sits on the
 * circle of points `a` from the root and `b` from the target, and the pole
 * chooses the point on that circle: the elbow bends towards it. A target out
 * of reach is pulled in to 99.5% of full length, because a limb solved to
 * exactly straight flips its bend direction from one frame to the next.
 */
export function ik2(root: Vec3, target: Vec3, a: number, b: number, pole: Vec3) {
  let d = sub(target, root);
  let L = len(d);
  const maxL = (a + b) * 0.995;
  const minL = Math.abs(a - b) + 1e-3;
  if (L > maxL) {
    d = mul(d, maxL / L);
    L = maxL;
  }
  if (L < minL) {
    d = mul(norm(d), minL);
    L = minL;
  }
  const tip = add(root, d);
  const dir = norm(d);
  /* the distance along the root→tip line to the foot of the joint */
  const x = (a * a - b * b + L * L) / (2 * L);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  /* the pole, with its component along the chain removed */
  let p = sub(pole, mul(dir, dot(pole, dir)));
  if (len(p) < 1e-6) p = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  p = norm(p);
  const mid = add(root, add(mul(dir, x), mul(p, h)));
  return { mid, tip };
}

/* ------------------------------------------------------------------ */
/* Orientation                                                         */
/* ------------------------------------------------------------------ */

/**
 * An orthonormal frame from a primary axis and a hint for a second one,
 * returned as the three columns (x, y, z). `primary` becomes x exactly;
 * `hint` is made perpendicular to it and becomes y.
 */
export function basis(primary: Vec3, hint: Vec3): [Vec3, Vec3, Vec3] {
  const x = norm(primary);
  let y = sub(hint, mul(x, dot(hint, x)));
  if (len(y) < 1e-6) y = Math.abs(x[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  y = norm(y);
  const z = cross(x, y);
  return [x, y, z];
}

/** Quaternion [x, y, z, w] from a basis given as columns. */
export function quatFromBasis(bx: Vec3, by: Vec3, bz: Vec3): [number, number, number, number] {
  const m00 = bx[0], m01 = by[0], m02 = bz[0];
  const m10 = bx[1], m11 = by[1], m12 = bz[1];
  const m20 = bx[2], m21 = by[2], m22 = bz[2];
  const tr = m00 + m11 + m22;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    return [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s];
  }
  if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    return [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  }
  if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    return [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s];
  }
  const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
  return [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s];
}

/** Quaternion turning +y onto a direction; for capsules drawn between two points. */
export function quatYTo(dir: Vec3): [number, number, number, number] {
  const d = norm(dir);
  const up: Vec3 = [0, 1, 0];
  const c = dot(up, d);
  if (c > 0.99999) return [0, 0, 0, 1];
  if (c < -0.99999) return [1, 0, 0, 0];
  const ax = norm(cross(up, d));
  const half = Math.acos(clamp(c, -1, 1)) / 2;
  const s = Math.sin(half);
  return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(half)];
}

/* ------------------------------------------------------------------ */
/* Deterministic noise                                                 */
/* ------------------------------------------------------------------ */

/**
 * Smooth 1D noise in [-1, 1]: a sum of three incommensurate sines. Not
 * Perlin, but it never repeats inside a film, it is continuous and it is
 * the same on every render, which is all idle motion needs.
 */
export const wobble = (t: number, seed: number) =>
  (Math.sin(t * 1.13 + seed * 7.1) * 0.5 +
    Math.sin(t * 0.71 + seed * 3.3) * 0.3 +
    Math.sin(t * 2.37 + seed * 1.9) * 0.2);

/* ------------------------------------------------------------------ */
/* Rigid transforms                                                    */
/* ------------------------------------------------------------------ */

export type Quat = [number, number, number, number];
/** A position and an orientation: where a prop is and which way up. */
export type Xform = { p: Vec3; q: Quat };

export const QI: Quat = [0, 0, 0, 1];

export const qmul = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];
export const qconj = (a: Quat): Quat => [-a[0], -a[1], -a[2], a[3]];
export const qrot = (q: Quat, v: Vec3): Vec3 => {
  const u: Vec3 = [q[0], q[1], q[2]];
  const t = mul(cross(u, v), 2);
  return add(add(v, mul(t, q[3])), cross(u, t));
};
export const qyaw = (yaw: number): Quat => [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)];
export const qaxis = (axis: Vec3, angle: number): Quat => {
  const s = Math.sin(angle / 2);
  const a = norm(axis);
  return [a[0] * s, a[1] * s, a[2] * s, Math.cos(angle / 2)];
};
export function qslerp(a: Quat, b: Quat, t: number): Quat {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let bb = b;
  if (d < 0) {
    d = -d;
    bb = [-b[0], -b[1], -b[2], -b[3]];
  }
  if (d > 0.9995) {
    const r: Quat = [
      a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t,
      a[2] + (bb[2] - a[2]) * t, a[3] + (bb[3] - a[3]) * t
    ];
    const l = Math.hypot(r[0], r[1], r[2], r[3]);
    return [r[0] / l, r[1] / l, r[2] / l, r[3] / l];
  }
  const th = Math.acos(d);
  const s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s;
  const wb = Math.sin(t * th) / s;
  return [
    a[0] * wa + bb[0] * wb, a[1] * wa + bb[1] * wb,
    a[2] * wa + bb[2] * wb, a[3] * wa + bb[3] * wb
  ];
}

/** parent ∘ child: the child's transform expressed in the parent's space, made world. */
export const xmul = (parent: Xform, child: Xform): Xform => ({
  p: add(parent.p, qrot(parent.q, child.p)),
  q: qmul(parent.q, child.q)
});
export const xinv = (x: Xform): Xform => {
  const qi = qconj(x.q);
  return { p: mul(qrot(qi, x.p), -1), q: qi };
};
export const xlerp = (a: Xform, b: Xform, t: number): Xform => ({
  p: lerp3(a.p, b.p, t),
  q: qslerp(a.q, b.q, t)
});
/** A transform from a position and a basis given as columns. */
export const xbasis = (p: Vec3, bx: Vec3, by: Vec3, bz: Vec3): Xform => ({
  p,
  q: quatFromBasis(bx, by, bz)
});
