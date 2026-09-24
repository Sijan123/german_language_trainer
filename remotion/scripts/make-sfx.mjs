/*
 * The room's sounds, synthesised.
 *
 * An acted film with only the two voices on it sounds like a radio play in a
 * vacuum: a man walks four metres across a tiled office and nothing lands. So
 * the footsteps, the chair, the paper, the keyboard, the pen and the
 * number-display chime are made here, from noise and sine waves, into
 * public/sfx/. No downloads and no licences, and the same bytes every run.
 *
 *   node scripts/make-sfx.mjs
 *
 * They sit well under the voices — the timeline gives each a volume — and
 * none of them is meant to be noticed, only missed.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "public", "sfx");
fs.mkdirSync(out, { recursive: true });

const RATE = 22050;

let seed = 12345;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const noise = () => rnd() * 2 - 1;

function write(name, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  let peak = 1e-9;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = 0.89 / peak;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * gain)) * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(out, name + ".wav"), buf);
  console.log("  sfx/" + name + ".wav", (n / RATE).toFixed(2) + "s");
}

const secs = (s) => new Float32Array(Math.round(s * RATE));

/** one-pole filters, run in place */
function lowpass(x, hz) {
  const a = 1 - Math.exp((-2 * Math.PI * hz) / RATE);
  let y = 0;
  for (let i = 0; i < x.length; i++) x[i] = y += a * (x[i] - y);
  return x;
}
function highpass(x, hz) {
  const a = Math.exp((-2 * Math.PI * hz) / RATE);
  let px = 0;
  let py = 0;
  for (let i = 0; i < x.length; i++) {
    const y = a * (py + x[i] - px);
    px = x[i];
    py = y;
    x[i] = y;
  }
  return x;
}

/* ---- the chime: ding, then dong, like every waiting room in Germany */
{
  const x = secs(2.2);
  const tone = (at, hz, amp) => {
    for (let i = Math.round(at * RATE); i < x.length; i++) {
      const t = i / RATE - at;
      const env = Math.exp(-t * 2.6) * Math.min(1, t * 400);
      x[i] += amp * env * (Math.sin(2 * Math.PI * hz * t) + 0.28 * Math.sin(2 * Math.PI * hz * 2.01 * t) + 0.1 * Math.sin(2 * Math.PI * hz * 3.02 * t));
    }
  };
  tone(0, 659.25, 1);
  tone(0.42, 523.25, 1);
  write("ding", x);
}

/* ---- a footstep on hard flooring: heel thump and a scuff */
{
  const x = secs(0.22);
  for (let i = 0; i < x.length; i++) {
    const t = i / RATE;
    x[i] = Math.sin(2 * Math.PI * 70 * t) * Math.exp(-t * 55) * 0.9 + noise() * Math.exp(-t * 38) * 0.5;
  }
  lowpass(x, 1800);
  write("step", x);
}

/* ---- a chair: a short scrape with the judder of stick-slip in it */
{
  const x = secs(0.45);
  for (let i = 0; i < x.length; i++) {
    const t = i / RATE;
    const env = Math.sin(Math.PI * Math.min(1, t / 0.42)) ** 0.7;
    const judder = 0.55 + 0.45 * Math.sin(2 * Math.PI * 38 * t + Math.sin(t * 20));
    x[i] = noise() * env * judder;
  }
  highpass(lowpass(x, 1400), 250);
  write("chair", x);
}

/* ---- paper: three soft crinkles */
{
  const x = secs(0.4);
  for (const at of [0, 0.09, 0.2]) {
    for (let i = Math.round(at * RATE); i < x.length; i++) {
      const t = i / RATE - at;
      x[i] += noise() * Math.exp(-t * 30) * (0.6 + 0.4 * rnd());
    }
  }
  highpass(x, 1800);
  lowpass(x, 7000);
  write("paper", x);
}

/* ---- typing: irregular key clicks, a little over three seconds of them */
{
  const x = secs(3.6);
  let at = 0.02;
  while (at < 3.5) {
    const amp = 0.5 + 0.5 * rnd();
    for (let i = Math.round(at * RATE); i < Math.min(x.length, Math.round((at + 0.03) * RATE)); i++) {
      const t = i / RATE - at;
      x[i] += amp * (noise() * Math.exp(-t * 400) + 0.4 * Math.sin(2 * Math.PI * 2300 * t) * Math.exp(-t * 300));
    }
    at += 0.075 + rnd() * 0.12 + (rnd() < 0.1 ? 0.25 : 0);
  }
  highpass(x, 600);
  write("typing", x);
}

/* ---- a pen writing: fine scratch, in bursts the length of short words */
{
  const x = secs(4);
  for (let i = 0; i < x.length; i++) {
    const t = i / RATE;
    const word = Math.sin(2 * Math.PI * 1.6 * t) > -0.3 ? 1 : 0.1;
    const stroke = 0.6 + 0.4 * Math.sin(2 * Math.PI * 9 * t + Math.sin(t * 3));
    x[i] = noise() * word * stroke;
  }
  highpass(x, 2500);
  lowpass(x, 8000);
  write("pen", x);
}

/* ---- a shop-door bell: a small brass bell on a spring, three bright hits */
{
  const x = secs(1.6);
  const partials = [2093, 2637, 3520, 4186];
  for (const [at, amp] of [[0, 1], [0.11, 0.6], [0.24, 0.35]]) {
    for (let i = Math.round(at * RATE); i < x.length; i++) {
      const t = i / RATE - at;
      const env = Math.exp(-t * 4.2) * Math.min(1, t * 900);
      let s = 0;
      partials.forEach((hz, k) => (s += Math.sin(2 * Math.PI * hz * (1 + 0.003 * k) * t) / (k + 1)));
      x[i] += amp * env * s;
    }
  }
  write("bell", x);
}

/* ---- the bread slicer: a motor spinning up, a steady hum with the blade's
   rasp through the crust, spinning down */
{
  const x = secs(2.4);
  for (let i = 0; i < x.length; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.25) * Math.min(1, (2.4 - t) / 0.35);
    const hum = Math.sin(2 * Math.PI * 100 * t) + 0.5 * Math.sin(2 * Math.PI * 200 * t) + 0.25 * Math.sin(2 * Math.PI * 300 * t);
    const rasp = noise() * (0.5 + 0.5 * Math.sin(2 * Math.PI * 7 * t)) * (t > 0.4 && t < 2.0 ? 1 : 0.15);
    x[i] = env * (0.35 * hum + 0.5 * rasp);
  }
  lowpass(x, 3500);
  write("slicer", x);
}

/* ---- the till: the drawer's clunk and a bright bell */
{
  const x = secs(1.4);
  for (let i = 0; i < x.length; i++) {
    const t = i / RATE;
    x[i] += Math.sin(2 * Math.PI * 90 * t) * Math.exp(-t * 30) * 0.8 + noise() * Math.exp(-t * 60) * 0.4;
    const b = t - 0.05;
    if (b > 0) x[i] += 0.5 * Math.exp(-b * 3.5) * (Math.sin(2 * Math.PI * 2600 * b) + 0.4 * Math.sin(2 * Math.PI * 3900 * b));
  }
  write("till", x);
}

/* ---- coins put down on a dish: a few small metallic clinks */
{
  const x = secs(0.7);
  for (const [at, hz] of [[0, 4100], [0.07, 5200], [0.16, 4600], [0.23, 6100], [0.3, 4900]]) {
    for (let i = Math.round(at * RATE); i < x.length; i++) {
      const t = i / RATE - at;
      const env = Math.exp(-t * 28) * Math.min(1, t * 2000);
      x[i] += env * (Math.sin(2 * Math.PI * hz * t) + 0.6 * Math.sin(2 * Math.PI * hz * 1.51 * t));
    }
  }
  highpass(x, 1500);
  write("coins", x);
}
