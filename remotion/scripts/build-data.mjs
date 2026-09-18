/*
 * Turn a dialogue from the trainer into the timeline the film is cut to.
 *
 * The app is the source of truth for the script and make-audio.py is the source
 * of truth for the clips; this reads both and writes one JSON the composition
 * can consume without touching the filesystem at render time. Run it again
 * whenever a dialogue or its audio changes.
 *
 *   node scripts/build-data.mjs c002 [c007 ...]
 *
 * Word boundaries are not computed here — scripts/align.py does that with a
 * forced aligner and writes src/data/words.json alongside. The two files are
 * joined in src/data.ts rather than merged on disk, so re-running either one
 * never invalidates the other.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");

const { CONVERSATIONS, CONV_TOPICS } = await import(
  new URL("../../js/conversations.js", import.meta.url)
);
const { AUDIO } = await import(new URL("../../js/audio-manifest.js", import.meta.url));

const FPS = 30;

/*
 * Pacing. A dialogue read with no air between the turns is a wall of German;
 * these are the pauses that make it a conversation you can follow.
 *
 *   LEAD  the bubble is open and settled before the voice starts
 *   TAIL  the line stays up after the voice stops, to be read
 *   TURN  extra breath as the turn passes to the other person
 *
 * INTRO covers the title card, OUTRO the Wortschatz card at the end. OUTRO is
 * generous - a card you have to pause the video to read is a card that failed -
 * but INTRO is kept tight on purpose. It is silent, and a silent head on a
 * video reads as a video that is not working: at 96 frames the first voice did
 * not arrive until three and a half seconds in, which is long enough to press
 * play, hear nothing, and conclude the thing has no sound.
 */
const LEAD = 9;
const TAIL = 16;
const TURN = 8;
const INTRO = 62;
const OUTRO = 150;

/* css/style.css :root, light mode. The topic tint is a CSS variable in the app
   and the video needs the value, so it is the one thing resolved by hand. */
const TONES = {
  alltag: "#2f5d8a", essen: "#906925", freizeit: "#3f7c52", reisen: "#2a7c79",
  familie: "#a8455f", wohnen: "#7a4fa0", wetter: "#3a6b7a", koerper: "#b45248",
  gesundheit: "#b45248", arbeit: "#4a6fa5", lernen: "#7a5ba6", stadt: "#4e7869",
  unterwegs: "#4e7869", amt: "#886b3a", technik: "#3a6b8a", paar: "#a65e2b",
  telefon: "#2f7a86", einkaufen: "#677639"
};

function clipPath(id, index) {
  const entry = AUDIO[id];
  if (!entry) return null;
  const count = typeof entry === "number" ? entry : entry.n;
  const ext = typeof entry === "number" ? "mp3" : entry.ext || "mp3";
  if (!count || index >= count) return null;
  return path.posix.join("audio", id, String(index + 1).padStart(2, "0") + "." + ext);
}

function durationOf(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" }
  );
  const seconds = Number(out.trim());
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error("no duration for " + file);
  return seconds;
}

function buildOne(id) {
  const conv = CONVERSATIONS.find((c) => c.id === id);
  if (!conv) throw new Error("unknown dialogue: " + id);
  const topic = CONV_TOPICS.find((t) => t.id === conv.topic);

  let frame = INTRO;
  const lines = conv.lines.map((line, i) => {
    const rel = clipPath(id, i);
    if (!rel) throw new Error(id + " line " + (i + 1) + " has no rendered clip");

    const src = path.join(root, rel);
    const audioFrames = Math.ceil(durationOf(src) * FPS);

    /* Copy the clip in beside the composition. staticFile() only reaches into
       public/, and a video that read straight out of the app's audio folder
       would break the moment either one moved. */
    const dest = path.join(here, "..", "public", rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);

    const enterAt = frame;
    const audioAt = frame + LEAD;
    const endAt = audioAt + audioFrames + TAIL + TURN;
    frame = endAt;

    return { i, s: line.s, de: line.de, en: line.en, clip: rel, enterAt, audioAt, audioFrames, endAt };
  });

  return {
    id,
    title: conv.title,
    titleEn: conv.titleEn,
    topic: topic ? topic.name : conv.topic,
    tone: TONES[conv.topic] ?? "#2f5d8a",
    fps: FPS,
    intro: INTRO,
    outro: OUTRO,
    durationInFrames: frame + OUTRO,
    lines
  };
}

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("usage: node scripts/build-data.mjs c002 [c007 ...]");
  process.exit(1);
}

const file = path.join(here, "..", "src", "data", "dialogues.json");
const out = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

for (const id of ids) {
  out[id] = buildOne(id);
  const d = out[id];
  console.log(
    id.padEnd(5),
    String(d.lines.length).padStart(2) + " lines",
    (d.durationInFrames / FPS).toFixed(1) + "s",
    d.title
  );
}

fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log("->", path.relative(process.cwd(), file));
