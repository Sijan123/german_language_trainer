/*
 * The stage: two characters, a light, and a loop that reads the mouth.
 *
 * Everything three.js knows about lives in this file, and it is loaded by
 * dynamic import the first time someone switches the stage on. Someone who only
 * ever does Diktat never downloads a renderer. That is also why app.js talks to
 * this module through `mount`/`unmount` rather than importing the scene: a
 * static import at the top of app.js would pull three.js into the initial load
 * for every visitor and undo the whole arrangement.
 *
 * The loop is deliberately one-directional. It reads lipsync, it draws. It never
 * calls back into playback, never touches the transcript, and holds no state
 * that matters — so it can be torn down mid-sentence, or fail to start at all on
 * a device without WebGL, and the dialogue carries on being a dialogue.
 */

import * as lipsync from "./lipsync.js";
import { makeCharacter } from "./characters.js";
import { makeGlbCharacter } from "./glbcharacter.js";
import { AVATAR_FILES } from "./avatar-manifest.js";

let THREE = null;
let renderer = null;
let scene = null;
let camera = null;
let host = null;
let cast = [];
let raf = 0;
let last = 0;
let observer = null;
let ground = null;
let key = null;
let fill = null;
let avatarWarning = null;

/* Where the two stand. Far enough apart to read as two people, close enough
 * that both faces still fill a strip on a phone. */
const SPOTS = [
  { name: "Shruti", x: -1.78, hair: "long",  facing: -1, tintVar: "--t-familie" },
  { name: "Sijan",  x:  1.78, hair: "short", facing:  1, tintVar: "--accent" }
];

function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** True if this browser can actually give us a context — checked before loading 383 KB. */
export function supported() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

export function isMounted() { return !!renderer; }

/**
 * Build the scene into `element` and start drawing.
 *
 * Resolves false rather than throwing if three.js will not load or WebGL will
 * not start — the caller turns the toggle back off and says so, instead of the
 * stage silently occupying space it cannot draw in.
 */
export async function mount(element) {
  if (renderer) return true;
  if (!supported()) return false;

  try {
    THREE = await import("three");
  } catch (e) {
    return false;
  }

  host = element;

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  } catch (e) {
    renderer = null;
    return false;
  }

  // Capped at 2: a phone at devicePixelRatio 3 is drawing nine times the pixels
  // for a difference nobody can see on a face this size.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = false;
  host.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, -0.35, 8);

  buildLights();
  await buildCast();
  applyTheme();
  resize();

  // A canvas that keeps rendering while scrolled out of sight is a battery
  // leak on the one device this app is mostly used on.
  if (window.ResizeObserver) {
    observer = new ResizeObserver(resize);
    observer.observe(host);
  } else {
    window.addEventListener("resize", resize);
  }
  document.addEventListener("visibilitychange", onVisibility);

  last = performance.now();
  loop();
  return true;
}

export function unmount() {
  if (!renderer) return;

  cancelAnimationFrame(raf);
  raf = 0;
  document.removeEventListener("visibilitychange", onVisibility);
  if (observer) { observer.disconnect(); observer = null; }
  else window.removeEventListener("resize", resize);

  // Geometries and textures are not garbage collected — they are GPU
  // allocations with a JS handle, and dropping the handle leaks them. Mounting
  // and unmounting a few dozen times across a session is entirely normal here.
  scene.traverse((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      (Array.isArray(node.material) ? node.material : [node.material])
        .forEach((m) => m.dispose());
    }
  });
  renderer.dispose();
  if (renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  renderer = null; scene = null; camera = null; cast = []; host = null;
  ground = null; key = null; fill = null;
}

function buildLights() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));

  // Slightly off-axis and slightly warm, so the face has a lit side and a
  // shaded one. Lit flat from the camera, a sphere with features on it looks
  // like a sticker rather than a head.
  //
  // Kept well under the first pass's intensities, which washed both faces out
  // to nearly white — a blown-out face loses the shadow under the lower lip,
  // and that shadow is how an open mouth reads as open.
  key = new THREE.DirectionalLight(0xfff4e6, 1.45);
  key.position.set(-2.4, 3.2, 4.5);
  scene.add(key);

  fill = new THREE.DirectionalLight(0xdfe9ff, 0.45);
  fill.position.set(3.0, 0.4, 2.2);
  scene.add(fill);

  const groundGeo = new THREE.PlaneGeometry(40, 40);
  ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ roughness: 1 }));
  ground.position.z = -4.5;
  scene.add(ground);
}

/*
 * One character per speaker: a rigged avatar where the manifest names a file,
 * spheres where it does not.
 *
 * Per speaker rather than all-or-nothing, and a failed load falls back rather
 * than failing the stage. Someone who has made one avatar and not the other
 * gets one of each and a working dialogue, which is a better place to be than
 * either "no stage" or "stage with one invisible person in it".
 */
async function buildCast() {
  avatarWarning = null;
  let loader = null;
  const needed = SPOTS.some((spot) => AVATAR_FILES[spot.name]);
  if (needed) {
    try {
      const mod = await import("three/addons/loaders/GLTFLoader.js");
      loader = new mod.GLTFLoader();
    } catch (e) {
      loader = null;                  // fall through to spheres for everyone
    }
  }

  cast = [];
  for (const spot of SPOTS) {
    let character = null;
    const file = AVATAR_FILES[spot.name];

    if (loader && file) {
      try {
        const gltf = await loader.loadAsync(file);
        character = makeGlbCharacter(THREE, gltf, { facing: spot.facing });
        // An avatar exported without the viseme morph targets loads perfectly
        // and then sits there with its mouth shut, which looks like a broken
        // driver rather than a missing export option. Better to say so.
        if (!character.info.visemes) avatarWarning = spot.name;
      } catch (e) {
        character = null;
      }
    }

    if (!character) {
      character = makeCharacter(THREE, {
        hair: spot.hair,
        tint: cssVar(spot.tintVar, "#888888"),
        facing: spot.facing
      });
    }

    character.group.position.x = spot.x;
    scene.add(character.group);
    cast.push({ spot, character });
  }
}

/** Which speaker's avatar loaded without visemes, if any. The UI reports it. */
export function warning() {
  return avatarWarning
    ? avatarWarning + ": Avatar ohne Viseme — beim Export „Oculus Visemes“ wählen"
    : null;
}

/**
 * Repaint to the current theme.
 *
 * Called on mount and whenever the app's theme changes — the palette is read
 * from CSS custom properties rather than duplicated here, so a colour edited in
 * style.css moves the stage with it and cannot drift out of step.
 */
export function applyTheme() {
  if (!renderer) return;
  const surface = new THREE.Color(cssVar("--surface-sunken", "#ecede6"));
  renderer.setClearColor(surface, 1);
  if (ground) ground.material.color.copy(surface).multiplyScalar(1.02);

  const dark = surface.r + surface.g + surface.b < 1.2;
  key.intensity = dark ? 1.15 : 1.45;
  fill.intensity = dark ? 0.32 : 0.45;
  scene.children.forEach((c) => {
    if (c.isAmbientLight) c.intensity = dark ? 0.68 : 0.95;
  });
}

/** Per-topic tinting of the backdrop, so a dialogue's colour carries onto the stage. */
export function setTopicTint(tint) {
  if (!renderer || !ground || !tint) return;
  const surface = new THREE.Color(cssVar("--surface-sunken", "#ecede6"));
  const topic = new THREE.Color(tint);
  ground.material.color.copy(surface).lerp(topic, 0.14);
}

/*
 * How much of a head has to be in frame vertically, in the same units the
 * characters are built in. A head is about 1.05 from crown to chin, so 1.5
 * leaves a margin above the hair and takes the shot down to the collarbone.
 */
const HALF_HEIGHT = 1.36;

function resize() {
  if (!renderer || !host) return;
  const w = host.clientWidth;
  const h = host.clientHeight;
  if (!w || !h) return;

  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  /*
   * Distance is set by height alone, then the two are moved apart to use
   * whatever width that leaves.
   *
   * Doing it the other way round — a fixed spacing, camera pulled back far
   * enough to fit it — is what the first attempt did, and it gives away the
   * whole frame: this strip is about five times wider than it is tall, so
   * fitting the pair horizontally shrinks both faces to nothing. The faces are
   * the content. Height decides the shot, and the spacing adapts.
   */
  const vFov = (camera.fov * Math.PI) / 180;
  camera.position.z = HALF_HEIGHT / Math.tan(vFov / 2);
  camera.lookAt(0, -0.30, 0);

  const halfWidth = Math.tan(vFov / 2) * camera.aspect * camera.position.z;

  // 1.25 is roughly a head-and-hair's half-width, so this keeps both of them
  // fully inside the frame however narrow it gets, and spreads them out to the
  // edges when there is room. On a phone they end up nearly cheek to cheek.
  const spread = Math.min(2.9, Math.max(1.35, halfWidth - 1.25));
  cast.forEach((member) => {
    member.character.group.position.x = Math.sign(member.spot.x) * spread;
  });
}

function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
  } else if (renderer && !raf) {
    last = performance.now();
    loop();
  }
}

function loop() {
  raf = requestAnimationFrame(loop);
  if (!renderer) return;

  const t = performance.now();
  // Clamped: a backgrounded tab hands back a delta of several seconds, and every
  // eased value in the character would snap to its target in one frame.
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;

  const mouth = lipsync.read();

  for (const member of cast) {
    const active = mouth.speaking && mouth.speaker === member.spot.name;
    member.character.update(dt, {
      open: active ? mouth.open : 0,
      wide: active ? mouth.wide : 0,
      round: active ? mouth.round : 0,
      press: active ? mouth.press : 0,
      energy: active ? mouth.energy : 0,
      active,
      // Both turn towards each other; the one talking stays a little more open
      // to the viewer, which is where the mouth needs to be visible from.
      look: -member.spot.facing * (active ? 0.45 : 1)
    });
  }

  renderer.render(scene, camera);
}
