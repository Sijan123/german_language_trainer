/*
 * Render an acted film in Blender instead of the browser's toon renderer.
 *
 *   node scripts/blender.mjs c003                 all four steps
 *   node scripts/blender.mjs c003 --step render   one step (capture | assemble | render | composite)
 *   node scripts/blender.mjs c003 --still 900     one Blender frame, to check the look
 *   options: --res 1280x720  --frames 0-400  --samples 32
 *
 * (npm run blender -- c003 ...)
 *
 * The film is not staged twice. The browser already builds the room, poses
 * the people and points the camera for every frame; this captures that and
 * hands it over, so Blender renders exactly what Studio shows:
 *
 *   1. capture    Remotion renders the composition with `blender.capture` set
 *                 (acted/capture.tsx). A still exports the three.js scene as
 *                 out/blender/<id>/scene.glb; a full render posts every
 *                 frame's transforms, shape keys and camera to a small server
 *                 here, which writes them to frames/<f>.bin.
 *   2. assemble   The frames become glTF animation on the scene: anim.glb,
 *                 plus camera.json. Only what moves is animated.
 *   3. render     blender/film.py imports anim.glb, lights it (the set's own
 *                 lamps, a key and a fill, a night sky through the window),
 *                 and renders PNG frames with EEVEE; ffmpeg makes them
 *                 public/blender/<id>.mp4. Frames already on disk are kept,
 *                 so a stopped render picks up where it was.
 *   4. composite  Remotion renders the film again with `blender.plate`: the
 *                 Blender frames under the subtitles, callouts, cards and
 *                 sound. Out comes out/<id>-blender.mp4. Nothing is shipped;
 *                 video/<id>.mp4 is left alone.
 */

import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const proj = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const id = args.find((a) => /^c\d+$/.test(a));
if (!id) {
  console.error("usage: node scripts/blender.mjs c003 [--step capture|assemble|render|composite] [--still F] [--res WxH] [--frames A-B] [--samples N]");
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : dflt;
};
const step = opt("step", "all");
const still = opt("still", null);
const res = opt("res", "1280x720");
const PORT = 7788;

const dir = path.join(proj, "out", "blender", id);
const framesDir = path.join(dir, "frames");
const renderDir = path.join(dir, "render");
const bundle = path.join(proj, "out", "blender", "bundle");
fs.mkdirSync(framesDir, { recursive: true });

const run = (cmd, a) => execFileSync(cmd, a, { cwd: proj, stdio: "inherit", shell: process.platform === "win32" });
/* the same, without blocking: the capture server runs in this process and
   has to answer the browser while Remotion renders */
const runAsync = (cmd, a) =>
  new Promise((ok, fail) => {
    const p = spawn(cmd, a, { cwd: proj, stdio: "inherit", shell: process.platform === "win32" });
    p.on("exit", (code) => (code === 0 ? ok() : fail(new Error(`${cmd} ${a.join(" ")} exited with ${code}`))));
  });
const blender = [
  process.env.BLENDER,
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe",
  "/Applications/Blender.app/Contents/MacOS/Blender",
  "blender"
].filter(Boolean).find((c) => c === "blender" || fs.existsSync(c));

function propsFile(name, blenderProps) {
  const f = path.join(dir, name + ".props.json");
  fs.writeFileSync(f, JSON.stringify({ blender: blenderProps }));
  return f;
}

/* ------------------------------------------------------------------ */
/* 1. capture                                                          */
/* ------------------------------------------------------------------ */

function server() {
  const s = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.end();
      return;
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const url = new URL(req.url, "http://x");
      if (url.pathname === "/scene") fs.writeFileSync(path.join(dir, "scene.glb"), body);
      else if (url.pathname === "/meta") fs.writeFileSync(path.join(dir, "meta.json"), body);
      else if (url.pathname === "/frame") fs.writeFileSync(path.join(framesDir, url.searchParams.get("f") + ".bin"), body);
      else {
        res.statusCode = 404;
      }
      res.end();
    });
  });
  return new Promise((ok) => s.listen(PORT, () => ok(s)));
}

async function capture() {
  run("npx", ["remotion", "bundle", "src/index.ts", "--out-dir", bundle]);
  for (const f of fs.readdirSync(framesDir)) fs.unlinkSync(path.join(framesDir, f));
  const s = await server();
  const url = `http://localhost:${PORT}`;
  try {
    await runAsync("npx", ["remotion", "still", bundle, id, path.join(dir, "export.png"), "--frame", "0", "--scale", "0.25", "--timeout", "300000",
      "--props", propsFile("export", { capture: url, exportScene: true })]);
    await runAsync("npx", ["remotion", "render", bundle, id, path.join(dir, "capture.mp4"), "--scale", "0.1", "--crf", "40", "--muted",
      "--props", propsFile("capture", { capture: url })]);
  } finally {
    s.close();
  }
  console.log(`captured ${fs.readdirSync(framesDir).length} frames -> ${framesDir}`);
}

/* ------------------------------------------------------------------ */
/* 2. assemble                                                         */
/* ------------------------------------------------------------------ */

function readGlb(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error(file + " is not a GLB");
  let off = 12;
  let json;
  let bin = Buffer.alloc(0);
  while (off < b.length) {
    const len = b.readUInt32LE(off);
    const type = b.readUInt32LE(off + 4);
    const data = b.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
    else if (type === 0x004e4942) bin = Buffer.from(data);
    off += 8 + len;
  }
  return { json, bin };
}

function writeGlb(file, json, bin) {
  const pad = (buf, byte) => (buf.length % 4 ? Buffer.concat([buf, Buffer.alloc(4 - (buf.length % 4), byte)]) : buf);
  const j = pad(Buffer.from(JSON.stringify(json), "utf8"), 0x20);
  const bn = pad(bin, 0);
  const head = Buffer.alloc(12);
  head.writeUInt32LE(0x46546c67, 0);
  head.writeUInt32LE(2, 4);
  head.writeUInt32LE(12 + 8 + j.length + 8 + bn.length, 8);
  const chunk = (type, data) => {
    const h = Buffer.alloc(8);
    h.writeUInt32LE(data.length, 0);
    h.writeUInt32LE(type, 4);
    return Buffer.concat([h, data]);
  };
  fs.writeFileSync(file, Buffer.concat([head, chunk(0x4e4f534a, j), chunk(0x004e4942, bn)]));
}

function assemble() {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  const { json, bin } = readGlb(path.join(dir, "scene.glb"));
  const F = meta.frames;
  const N = meta.nodes.length;

  /* which glTF node each captured object became */
  const gl = new Map();
  json.nodes.forEach((n, i) => {
    if (n.name && /^n\d+$/.test(n.name)) gl.set(Number(n.name.slice(1)), i);
  });

  const T = new Float32Array(F * N * 3);
  const R = new Float32Array(F * N * 4);
  const S = new Float32Array(F * N * 3);
  const V = new Uint8Array(F * N);
  const morph = new Map(); // node -> Float32Array(F * k)
  const cams = [];
  for (let f = 0; f < F; f++) {
    const file = path.join(framesDir, f + ".bin");
    if (!fs.existsSync(file)) throw new Error(`frame ${f} was not captured (${file})`);
    const raw = fs.readFileSync(file);
    const a = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
    let k = 0;
    if (a[k++] !== f) throw new Error(`frame file ${f} holds frame ${a[0]}`);
    const n = a[k++];
    if (n !== N) throw new Error(`frame ${f} has ${n} objects, the scene had ${N}: something mounted or unmounted during the film`);
    cams.push({ pos: [a[k], a[k + 1], a[k + 2]], look: [a[k + 3], a[k + 4], a[k + 5]], fov: a[k + 6] });
    k += 7;
    for (let i = 0; i < N; i++) {
      T.set(a.subarray(k, k + 3), (f * N + i) * 3);
      R.set(a.subarray(k + 3, k + 7), (f * N + i) * 4);
      S.set(a.subarray(k + 7, k + 10), (f * N + i) * 3);
      k += 10;
    }
    for (let i = 0; i < N; i++) V[f * N + i] = a[k++];
    const M = a[k++];
    for (let m = 0; m < M; m++) {
      const node = a[k++];
      const c = a[k++];
      let arr = morph.get(node);
      if (!arr) morph.set(node, (arr = new Float32Array(F * c)));
      arr.set(a.subarray(k, k + c), f * c);
      k += c;
    }
  }

  /* the animation's buffers go after the scene's own */
  const parts = [bin];
  let length = bin.length;
  json.bufferViews ??= [];
  json.accessors ??= [];
  const addAccessor = (arr, type, withMinMax) => {
    const pad = (4 - (length % 4)) % 4;
    if (pad) {
      parts.push(Buffer.alloc(pad));
      length += pad;
    }
    const buf = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    json.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: buf.length });
    parts.push(buf);
    length += buf.length;
    const comps = { SCALAR: 1, VEC3: 3, VEC4: 4 }[type];
    const acc = { bufferView: json.bufferViews.length - 1, componentType: 5126, count: arr.length / comps, type };
    if (withMinMax) {
      let lo = Infinity;
      let hi = -Infinity;
      for (const v of arr) {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
      acc.min = [lo];
      acc.max = [hi];
    }
    json.accessors.push(acc);
    return json.accessors.length - 1;
  };

  const times = new Float32Array(F);
  for (let f = 0; f < F; f++) times[f] = f / meta.fps;
  const input = addAccessor(times, "SCALAR", true);
  const channels = [];
  const samplers = [];
  const channel = (node, pathName, arr, type) => {
    samplers.push({ input, output: addAccessor(arr, type, false), interpolation: "LINEAR" });
    channels.push({ sampler: samplers.length - 1, target: { node, path: pathName } });
  };
  const varies = (arr, comps, i, stride) => {
    for (let f = 1; f < F; f++) {
      for (let c = 0; c < comps; c++) {
        if (Math.abs(arr[(f * N + i) * comps + c] - arr[i * comps + c]) > 1e-5) return true;
      }
    }
    return false;
  };

  let moving = 0;
  for (let i = 0; i < N; i++) {
    const node = gl.get(i);
    if (node === undefined) continue;
    /* quaternions: keep each on the same side as the last, or the
       interpolation between two frames goes the long way round */
    for (let f = 1; f < F; f++) {
      const p = ((f - 1) * N + i) * 4;
      const q = (f * N + i) * 4;
      if (R[p] * R[q] + R[p + 1] * R[q + 1] + R[p + 2] * R[q + 2] + R[p + 3] * R[q + 3] < 0) {
        for (let c = 0; c < 4; c++) R[q + c] = -R[q + c];
      }
    }
    let hides = false;
    for (let f = 0; f < F; f++) if (!V[f * N + i]) hides = true;
    const pick = (src, comps, hide) => {
      const out = new Float32Array(F * comps);
      for (let f = 0; f < F; f++) {
        for (let c = 0; c < comps; c++) {
          out[f * comps + c] = hide && !V[f * N + i] ? 1e-4 : src[(f * N + i) * comps + c];
        }
      }
      return out;
    };
    let any = false;
    if (varies(T, 3, i)) {
      channel(node, "translation", pick(T, 3, false), "VEC3");
      any = true;
    }
    if (varies(R, 4, i)) {
      channel(node, "rotation", pick(R, 4, false), "VEC4");
      any = true;
    }
    if (varies(S, 3, i) || hides) {
      channel(node, "scale", pick(S, 3, true), "VEC3");
      any = true;
    }
    if (any) moving++;
  }
  let keyed = 0;
  for (const [i, arr] of morph) {
    const node = gl.get(i);
    if (node === undefined) continue;
    const mesh = json.meshes[json.nodes[node].mesh];
    const k = arr.length / F;
    if (!mesh || (mesh.primitives[0].targets ?? []).length !== k) continue;
    let moves = false;
    for (let j = k; j < arr.length && !moves; j++) if (Math.abs(arr[j] - arr[j % k]) > 1e-5) moves = true;
    if (!moves) continue;
    channel(node, "weights", arr, "SCALAR");
    keyed++;
  }

  json.animations = [{ name: id, channels, samplers }];
  json.buffers = [{ byteLength: length }];
  writeGlb(path.join(dir, "anim.glb"), json, Buffer.concat(parts));
  fs.writeFileSync(path.join(dir, "camera.json"), JSON.stringify({ fps: meta.fps, frames: F, width: meta.width, height: meta.height, lights: meta.lights, cams }));
  console.log(`assembled: ${F} frames, ${moving} moving objects, ${keyed} faces with shape keys -> ${path.join(dir, "anim.glb")}`);
}

/* ------------------------------------------------------------------ */
/* 3. render                                                           */
/* ------------------------------------------------------------------ */

function render() {
  const a = ["-b", "-P", path.join(proj, "blender", "film.py"), "--",
    "--glb", path.join(dir, "anim.glb"), "--camera", path.join(dir, "camera.json"),
    "--out", renderDir, "--res", res];
  if (still) a.push("--still", still);
  if (opt("frames")) a.push("--frames", opt("frames"));
  for (const o of ["samples", "rt", "exposure", "lamp-gain", "fstop"]) if (opt(o)) a.push("--" + o, opt(o));
  execFileSync(blender, a, { cwd: proj, stdio: "inherit" });
  if (still) return;
  const plate = path.join(proj, "public", "blender", id + ".mp4");
  fs.mkdirSync(path.dirname(plate), { recursive: true });
  run("ffmpeg", ["-v", "error", "-y", "-framerate", "30", "-start_number", "0", "-i", path.join(renderDir, "%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", plate]);
  console.log("plate -> " + plate);
}

/* ------------------------------------------------------------------ */
/* 4. composite                                                        */
/* ------------------------------------------------------------------ */

function composite() {
  run("npx", ["remotion", "bundle", "src/index.ts", "--out-dir", bundle]);
  const out = path.join(proj, "out", id + "-blender.mp4");
  const [w] = res.split("x").map(Number);
  run("npx", ["remotion", "render", bundle, id, out, "--codec", "h264", "--crf", "18", "--scale", String(w / 1920),
    "--props", propsFile("plate", { plate: `blender/${id}.mp4` })]);
  console.log("film -> " + out);
}

if (step === "all" || step === "capture") await capture();
if (step === "all" || step === "assemble") assemble();
if (step === "all" || step === "render") render();
if ((step === "all" && !still) || step === "composite") composite();
