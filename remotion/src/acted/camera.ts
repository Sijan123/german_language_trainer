/*
 * Where the camera is, and where a 3D point lands on the frame.
 *
 * A shot is a setup that holds until the next one: a position, a point to
 * look at, a lens. While it holds it drifts towards `to` (or pushes in a
 * little, if there is no `to`) and floats like a camera on a shoulder rather
 * than a tripod. A shot marked `glide` eases in from the previous framing
 * instead of cutting to it — use it when the camera follows someone, not when
 * the edit changes angle.
 *
 * The overlays are drawn in 2D over the render (the subtitle card, the
 * callout rings, the thought bubbles), so they need to know where things are
 * on screen. `project` answers that from the same camera the renderer used,
 * so a ring stays on a passport as it crosses the desk.
 */

import * as THREE from "three";
import type { Program } from "./timeline";
import type { World } from "./world";
import type { Vec3 } from "./types";
import { add, dist, lerp, lerp3, mjerk, mul, smooth, sub, wobble } from "./math";

export type CamPose = { pos: Vec3; look: Vec3; fov: number };

export const W = 1920;
export const H = 1080;

export function cameraAt(prog: Program, world: World, f: number, depth = 0): CamPose {
  const shots = prog.shots;
  if (!shots.length) return { pos: [0, 1.3, 4], look: [0, 1, 0], fov: 32 };
  let i = shots.length - 1;
  while (i > 0 && shots[i].f > f) i--;
  const { f: at, shot } = shots[i];
  const end = i + 1 < shots.length ? shots[i + 1].f : prog.duration;
  const u = smooth(Math.max(0, Math.min(1, (f - at) / Math.max(1, end - at))));

  const pos0 = shot.pos;
  const look0 = shot.look;
  const pos1 = shot.to?.pos ?? add(pos0, mul(sub(look0, pos0), 0.045));
  const look1 = shot.to?.look ?? look0;
  const fov1 = shot.to?.fov ?? shot.fov;
  let pos = lerp3(pos0, pos1, u);
  let look = lerp3(look0, look1, u);
  const fov = lerp(shot.fov, fov1, u);

  /* follow a walking figure sideways, the way an operator pans with them */
  if (shot.track) {
    const b = world.core(shot.track, f);
    const dx = (b.pelvis[0] - look[0]) * (shot.follow ?? 0.7);
    look = [look[0] + dx, look[1], look[2]];
    pos = [pos[0] + dx * 0.85, pos[1], pos[2]];
  }

  let pose: CamPose = { pos, look, fov };

  if (shot.glide && i > 0 && depth < 3) {
    const g = (f - at) / (shot.glide * prog.fps);
    if (g < 1) {
      const prev = cameraAt(prog, world, at - 1, depth + 1);
      const e = mjerk(g);
      pose = { pos: lerp3(prev.pos, pos, e), look: lerp3(prev.look, look, e), fov: lerp(prev.fov, fov, e) };
    }
  }

  /* the float: a few millimetres at the lens, scaled with the distance to
     the subject so a close-up and a wide shot drift by the same amount on
     screen */
  const t = f / prog.fps;
  const d = dist(pose.pos, pose.look);
  const amp = 0.0045 * d;
  pose = {
    ...pose,
    look: add(pose.look, [amp * wobble(t * 0.8, 3.1), amp * 0.7 * wobble(t * 0.65, 5.7), 0]),
    pos: add(pose.pos, [0, amp * 0.3 * wobble(t * 0.5, 8.2), 0])
  };
  return pose;
}

/* ------------------------------------------------------------------ */
/* Projection                                                          */
/* ------------------------------------------------------------------ */

const cam = new THREE.PerspectiveCamera(32, W / H, 0.05, 60);
const v = new THREE.Vector3();

function setup(pose: CamPose) {
  cam.fov = pose.fov;
  cam.position.set(...pose.pos);
  cam.lookAt(...pose.look);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}

/** Frame pixels for a world point; `behind` if it is behind the lens. */
export function project(pose: CamPose, p: Vec3) {
  setup(pose);
  v.set(p[0], p[1], p[2]).project(cam);
  return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, behind: v.z > 1 };
}

/**
 * The screen box of a thing of half-size (sx, sy) metres at p, facing the
 * camera. Good enough for a callout ring, which is round anyway.
 */
export function projectBox(pose: CamPose, p: Vec3, size: [number, number]) {
  setup(pose);
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const corners = [
    [-1, -1], [1, -1], [1, 1], [-1, 1]
  ].map(([a, b]) => {
    const q = new THREE.Vector3(p[0], p[1], p[2])
      .addScaledVector(right, a * size[0])
      .addScaledVector(up, b * size[1])
      .project(cam);
    return { x: (q.x * 0.5 + 0.5) * W, y: (-q.y * 0.5 + 0.5) * H };
  });
  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
