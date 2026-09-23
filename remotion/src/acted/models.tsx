/*
 * Loading the furniture, and making it look like it belongs in this film.
 *
 * The models are Kenney's Furniture Kit (CC0, public/models/kenney). Two things
 * are done to every one of them on the way in:
 *
 *  - It is re-centred on its own footprint. Kenney models sit with their
 *    origin at one corner, which makes "put the desk at x=0" put a corner of
 *    it there instead. After this, `at` is the middle of the thing on the
 *    floor, and `yaw` is the way its front faces in the scene's convention
 *    (0 = +x) — the kit's fronts all face +z, hence the quarter turn.
 *
 *  - Its materials are swapped for toon materials in the set's own palette.
 *    Kenney's tan wood and salmon upholstery are a different film; the
 *    Bürgerbüro is grey-green and beech, like the drawn one.
 */

import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ------------------------------------------------------------------ */
/* Shading                                                             */
/* ------------------------------------------------------------------ */

/*
 * Three bands of light and no more. The drawn films are flat colour with one
 * shade, and a smooth PBR falloff next to them looks like a different
 * renderer; the step is what makes the 3D read as the same illustration.
 */
let gradient: THREE.DataTexture | null = null;
export function toonGradient() {
  if (gradient) return gradient;
  const data = new Uint8Array([150, 150, 150, 255, 205, 205, 205, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.generateMipmaps = false;
  gradient.needsUpdate = true;
  return gradient;
}

const toonCache = new Map<string, THREE.MeshToonMaterial>();
/** One shared material per colour: hundreds of meshes, a dozen materials. */
export function toon(color: string, opts: { transparent?: boolean; opacity?: number; side?: THREE.Side } = {}) {
  const key = color + JSON.stringify(opts);
  let m = toonCache.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), ...opts });
    toonCache.set(key, m);
  }
  return m;
}

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

const loaded = new Map<string, Promise<THREE.Group>>();

function load(name: string) {
  let p = loaded.get(name);
  if (!p) {
    p = new GLTFLoader()
      .loadAsync(staticFile(`models/kenney/${name}.glb`))
      .then((g) => g.scene);
    loaded.set(name, p);
  }
  return p;
}

/**
 * Every model the set needs, loaded before the first frame renders. A frame
 * drawn with half the furniture missing would be a frame of a different film,
 * so the render waits.
 */
export function useModels(names: string[]) {
  const [models, setModels] = useState<Record<string, THREE.Group> | null>(null);
  const [handle] = useState(() => delayRender("loading furniture: " + names.join(", ")));
  const key = names.join(",");
  useEffect(() => {
    let live = true;
    Promise.all(names.map((n) => load(n).then((g) => [n, g] as const)))
      .then((all) => {
        if (!live) return;
        setModels(Object.fromEntries(all));
        continueRender(handle);
      })
      .catch((err) => {
        throw err;
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, handle]);
  return models;
}

/* ------------------------------------------------------------------ */
/* Placing                                                             */
/* ------------------------------------------------------------------ */

type Placed = {
  model: THREE.Group | undefined;
  /** middle of the footprint, on the floor or on whatever `y` says */
  at: [number, number];
  y?: number;
  /** which way the front faces; 0 = +x */
  yaw: number;
  /** a number, or per-axis in the model's own frame before it is turned */
  scale?: number | [number, number, number];
  /** Kenney material name -> colour. Unlisted materials keep a toon of their own colour. */
  paint?: Record<string, string>;
  shadows?: boolean;
};

const NO_PAINT: Record<string, string> = {};

export const Model: React.FC<Placed> = ({ model, at, y = 0, yaw, scale = 2, paint = NO_PAINT, shadows = true }) => {
  /* keyed by value: an inline [x, y, z] is a new array every frame, and a
     re-clone per frame is a render measured in hours */
  const scaleKey = typeof scale === "number" ? String(scale) : scale.join(",");
  const obj = useMemo(() => {
    if (!model) return null;
    const inner = model.clone(true);
    const s = typeof scale === "number" ? [scale, scale, scale] : scale;
    inner.scale.set(s[0], s[1], s[2]);
    inner.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const swap = (m: THREE.Material) => {
        const std = m as THREE.MeshStandardMaterial;
        const color = paint[std.name] ?? "#" + std.color.getHexString();
        return toon(color);
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
      mesh.castShadow = shadows;
      mesh.receiveShadow = true;
    });
    /* turn, then measure, then move the footprint's middle to the origin */
    const turned = new THREE.Group();
    turned.add(inner);
    turned.rotation.y = yaw + Math.PI / 2;
    turned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(turned);
    const c = box.getCenter(new THREE.Vector3());
    const outer = new THREE.Group();
    turned.position.set(-c.x, -box.min.y, -c.z);
    outer.add(turned);
    return outer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, yaw, scaleKey, paint, shadows]);
  if (!obj) return null;
  return <primitive object={obj} position={[at[0], y, at[1]]} />;
};
