/*
 * Render a dialogue and put it where the trainer can play it.
 *
 *   node scripts/render.mjs c002 [c007 ...]
 *   node scripts/render.mjs --all
 *
 * Five steps, because the file Remotion produces is not the file a page should
 * load. Remotion renders a 1080p master at visually lossless quality; the master
 * of a fifty-second dialogue is around 45 MB, which is absurd for a repo that is
 * also the website. So the master stays in remotion/out/ (git-ignored) and what
 * ships is a 720p transcode of it — about 3 MB, and still sharper than the
 * 720-pixel column it is played in.
 *
 * The poster matters more than it looks. Without one the player is a black
 * rectangle until someone presses play, and `preload="none"` means it stays
 * black; with one the video looks like part of the page before it has loaded a
 * single byte. It is taken from a frame with the conversation already running
 * rather than from frame 0, which is nearly empty.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const root = path.resolve(proj, "..");

const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: proj, stdio: "inherit", shell: process.platform === "win32" });

const SHIP = path.join(root, "video");

/* 720p: the detail panel is 720 CSS pixels wide, so anything above this is
   bytes nobody sees. crf 24 with the slow preset holds up against the grain. */
const WIDTH = 1280;
const HEIGHT = 720;
const CRF = 24;

function ship(id) {
  const master = path.join(proj, "out", id + ".mp4");
  const mp4 = path.join(SHIP, id + ".mp4");
  const jpg = path.join(SHIP, id + ".jpg");

  run("npx", ["remotion", "render", "src/index.ts", id, "out/" + id + ".mp4",
    "--codec", "h264", "--crf", "20", "--overwrite"]);

  fs.mkdirSync(SHIP, { recursive: true });

  run("ffmpeg", ["-v", "error", "-y", "-i", master,
    /* Remotion renders JPEG frames, so the master is full-range yuvj420p with
       an ICC profile stapled to it. `-pix_fmt yuv420p` on its own does not
       undo that - the filter chain has to convert and the range has to be
       tagged - and full-range video is the kind of thing that plays fine in
       one player and comes out washed or refused in another. */
    "-vf", `scale=${WIDTH}:${HEIGHT}:flags=lanczos:out_range=tv,format=yuv420p`,
    "-color_range", "tv", "-map_metadata", "-1",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(CRF),
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    /* the index up front, so the browser can start playing before it has the
       whole file - without this a 3 MB video will not stream at all */
    "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "96k", "-ac", "1",
    mp4]);

  const d = JSON.parse(fs.readFileSync(path.join(proj, "src", "data", "dialogues.json"), "utf8"))[id];
  /*
   * The length comes from the file, not from dialogues.json: an acted film
   * (src/acted/) adds silences for its business on top of the timing data,
   * and c010 runs half a minute longer than the data says.
   */
  const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
    "-of", "csv=p=0", mp4], { encoding: "utf8" }).trim());
  /* A third of the way in: the chat is full, somebody is mid-sentence, and the
     outro has not started. */
  const at = (d.intro / d.fps) + (seconds - (d.intro + d.outro) / d.fps) / 3;

  run("ffmpeg", ["-v", "error", "-y", "-ss", at.toFixed(2), "-i", mp4,
    "-frames:v", "1", "-q:v", "4", jpg]);

  return {
    id,
    seconds: Number(seconds.toFixed(2)),
    lines: d.lines.length,
    bytes: fs.statSync(mp4).size
  };
}

/* ------------------------------------------------------------------ */
/* The manifest                                                        */
/* ------------------------------------------------------------------ */

/*
 * Rewritten rather than appended to, from whatever is actually in video/ — the
 * manifest is a description of the folder, and one that has to be kept in step
 * by hand is one that will eventually lie about a file that is not there.
 */
function writeManifest(fresh) {
  const file = path.join(root, "js", "video-manifest.js");

  const known = {};
  if (fs.existsSync(file)) {
    const old = fs.readFileSync(file, "utf8");
    const re = /"(c\d+)":\s*\{\s*seconds:\s*([\d.]+),\s*lines:\s*(\d+)\s*\}/g;
    let m;
    while ((m = re.exec(old))) known[m[1]] = { seconds: Number(m[2]), lines: Number(m[3]) };
  }
  for (const f of fresh) known[f.id] = { seconds: f.seconds, lines: f.lines };

  const ids = Object.keys(known)
    .filter((id) => fs.existsSync(path.join(SHIP, id + ".mp4")))
    .sort();

  const body = ids
    .map((id) => `  "${id}": { seconds: ${known[id].seconds}, lines: ${known[id].lines} }`)
    .join(",\n");

  fs.writeFileSync(
    file,
    `/*
 * Which Gespräche have a rendered film, and how long each one runs.
 *
 * The third way to watch a dialogue: instead of stepping through it or letting
 * it run, you watch it played out - the bubbles arriving, the speaker lighting
 * up, the recorded voices. It is the same script and the same audio as the other
 * two modes, so nothing here has to agree with anything except the files.
 *
 * Written by remotion/scripts/render.mjs from what is actually in video/. Edit
 * that, not this. A dialogue with no entry simply has no Video button.
 *
 * video/<id>.mp4, video/<id>.jpg
 */

export const VIDEO = {
${body}
};

/** What the player needs for this dialogue, or null if it has no film. */
export function videoFor(conversationId) {
  const entry = VIDEO[conversationId];
  if (!entry) return null;
  return {
    src: "video/" + conversationId + ".mp4",
    poster: "video/" + conversationId + ".jpg",
    seconds: entry.seconds,
    lines: entry.lines
  };
}
`
  );
  return ids;
}

/* ------------------------------------------------------------------ */

let ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (process.argv.includes("--all")) {
  const data = JSON.parse(
    fs.readFileSync(path.join(proj, "src", "data", "dialogues.json"), "utf8")
  );
  ids = Object.keys(data);
}
if (!ids.length) {
  console.error("usage: node scripts/render.mjs c002 [c007 ...] | --all  [--no-align]");
  process.exit(1);
}

/* Timings and clips first: rendering a composition against a stale data file is
   the one mistake here that produces a video that looks fine and is wrong. */
run("node", ["scripts/build-data.mjs", ...ids]);

/* The room sounds the acted films play (footsteps, paper, the chime). They
   are generated, not committed, and take a second to make. */
run("node", ["scripts/make-sfx.mjs"]);

/*
 * Then the word boundaries the karaoke is cut to. This needs Python with torch
 * installed and it is the slow part of the pipeline, so it can be skipped —
 * the composition falls back to lighting each line up in one go, which is
 * wrong but not broken, and says so in the data rather than crashing.
 *
 *   node scripts/render.mjs c002 --no-align
 */
if (!process.argv.includes("--no-align")) {
  try {
    run("python", ["scripts/align.py", ...ids]);
  } catch (err) {
    console.warn(
      "\n  ! forced alignment failed - rendering without word timings." +
      "\n    the karaoke will light whole lines at once. see scripts/align.py.\n"
    );
  }
}

const done = ids.map(ship);
const shipped = writeManifest(done);

console.log("");
for (const f of done) {
  console.log(
    "  " + f.id,
    String(f.lines).padStart(2) + " lines",
    f.seconds.toFixed(1) + "s",
    (f.bytes / 1024 / 1024).toFixed(1) + " MB"
  );
}
console.log("\n  video/ now holds: " + shipped.join(", "));
