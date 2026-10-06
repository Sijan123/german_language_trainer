/*
 * Handing an acted film to Blender.
 *
 * The toon render in the browser and the Blender render (blender/film.py)
 * must show the same film: the same room, the same people in the same poses,
 * the same camera. So nothing is rebuilt for Blender. The scene the browser
 * draws is captured from the browser, while scripts/blender.mjs renders the
 * composition with `blender.capture` set:
 *
 *  - once, as a still, the whole three.js scene is exported as a GLB
 *    (GLTFExporter), every object renamed "n<i>" by its place in a
 *    depth-first walk of the scene, so the file's nodes can be matched back;
 *
 *  - on every frame, the same walk records each object's local position,
 *    rotation and scale, whether it is visible, the weights of every shape
 *    key (the mouths), and the camera. That goes to the same local server as
 *    a block of floats.
 *
 * The script then turns the frames into glTF animation on the GLB, and
 * Blender imports it as an ordinary animated scene.
 *
 * This only works if the walk finds the same objects in the same order on
 * every frame, so in capture mode a prop out of sight is hidden rather than
 * unmounted, and nothing in a set may mount or unmount as the film runs.
 */

import React, { useLayoutEffect } from "react";
import { cancelRender, continueRender } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import type { CamPose } from "./camera";

export type BlenderMode = {
  /** the capture server (scripts/blender.mjs), e.g. http://localhost:7788 */
  capture?: string;
  /** this run also exports the scene itself as a GLB */
  exportScene?: boolean;
  /** the rendered plate from Blender, under public/, drawn instead of the toon render */
  plate?: string;
};

/** Every object in the scene, in the order the capture numbers them. */
function walk(scene: THREE.Object3D) {
  const out: THREE.Object3D[] = [];
  scene.traverse((o) => out.push(o));
  return out;
}

async function post(url: string, body: BodyInit) {
  const r = await fetch(url, { method: "POST", body });
  if (!r.ok) throw new Error(`blender capture: ${url} said ${r.status}`);
}

/*
 * `handle` is a delayRender() the composition took out for this frame while
 * rendering (SceneActed), not here: the canvas commits on its own schedule,
 * and a handle taken in this effect could come after Remotion had already
 * decided the frame was done. Clearing it is this component's job.
 */
export const Capture: React.FC<{
  url: string;
  exportScene: boolean;
  frame: number;
  handle: number;
  pose: CamPose;
  meta: unknown;
}> = ({ url, exportScene, frame, handle, pose, meta }) => {
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    (async () => {
      /* the furniture and the cast load behind their own delayRender; the
         scene is not the film's scene until they are in it. Wait until this
         capture is the only thing still holding the frame, then give React
         a moment to commit what arrived. */
      const pending = () => ((window as unknown as { remotion_delayRenderHandles?: unknown[] }).remotion_delayRenderHandles ?? []).length;
      for (let i = 0; i < 1200 && pending() > 1; i++) await new Promise((ok) => setTimeout(ok, 50));
      await new Promise((ok) => setTimeout(ok, 120));
      const nodes = walk(scene);

      if (exportScene) {
        const names = nodes.map((o) => o.name);
        nodes.forEach((o, i) => {
          o.name = "n" + i;
        });
        let glb: ArrayBuffer;
        try {
          glb = (await new GLTFExporter().parseAsync(scene, {
            binary: true,
            onlyVisible: false,
            trs: true
          })) as ArrayBuffer;
        } finally {
          nodes.forEach((o, i) => {
            o.name = names[i];
          });
        }
        await post(`${url}/scene`, glb);
        await post(
          `${url}/meta`,
          JSON.stringify({
            ...(meta as object),
            nodes: nodes.map((o, i) => ({ i, name: names[i], type: o.type, parent: o.parent ? nodes.indexOf(o.parent) : -1 }))
          })
        );
      }

      /* the frame: [frame, nodes, cam pos, cam look, fov], then 10 floats per
         node (position, quaternion, scale), one per node for visibility,
         then the shape keys as [count, (node, n, weights...)...] */
      const morphs = nodes
        .map((o, i) => [i, (o as THREE.Mesh).morphTargetInfluences] as const)
        .filter(([, w]) => w && w.length);
      const size = 9 + nodes.length * 11 + 1 + morphs.reduce((n, [, w]) => n + 2 + w!.length, 0);
      const buf = new Float32Array(size);
      let k = 0;
      buf[k++] = frame;
      buf[k++] = nodes.length;
      buf.set(pose.pos, k);
      k += 3;
      buf.set(pose.look, k);
      k += 3;
      buf[k++] = pose.fov;
      for (const o of nodes) {
        buf[k++] = o.position.x;
        buf[k++] = o.position.y;
        buf[k++] = o.position.z;
        buf[k++] = o.quaternion.x;
        buf[k++] = o.quaternion.y;
        buf[k++] = o.quaternion.z;
        buf[k++] = o.quaternion.w;
        buf[k++] = o.scale.x;
        buf[k++] = o.scale.y;
        buf[k++] = o.scale.z;
      }
      for (const o of nodes) buf[k++] = o.visible ? 1 : 0;
      buf[k++] = morphs.length;
      for (const [i, w] of morphs) {
        buf[k++] = i;
        buf[k++] = w!.length;
        for (const v of w!) buf[k++] = v;
      }
      await post(`${url}/frame?f=${frame}`, buf.buffer);
      continueRender(handle);
    })().catch((err) => cancelRender(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame]);

  return null;
};
