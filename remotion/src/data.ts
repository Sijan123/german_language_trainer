/*
 * The three files that describe a film, joined into one object.
 *
 *   data/dialogues.json  the timeline      (scripts/build-data.mjs)
 *   data/words.json      word boundaries   (scripts/align.py)
 *   scenes/<id>.ts       the staging       (written by hand)
 *
 * They are kept apart on disk because they are produced by three different
 * things at three different times, and merging them there would mean
 * re-running the aligner every time a clip's length changed. They are joined
 * here, once, at module load.
 *
 * Word times arrive in seconds from the start of their own clip and leave in
 * frames from the start of the composition, because that is the only unit
 * anything downstream ever wants.
 */

import dialoguesJson from "./data/dialogues.json";
import wordsJson from "./data/words.json";
import { SETS, findAnchor } from "./components/sets";
import { c001 } from "./scenes/c001";
import { c002 } from "./scenes/c002";
import { c003 } from "./scenes/c003";
import { c004 } from "./scenes/c004";
import type { Dialogue, Line, Scene, Word } from "./types";

type RawWord = { w: string; a: number; b: number; ok: boolean };

const SCENES: Record<string, Scene> = { c001, c002, c003, c004 };

const raw = dialoguesJson as unknown as Record<string, Omit<Dialogue, "lines"> & {
  lines: Omit<Line, "words">[];
}>;
const rawWords = wordsJson as unknown as Record<string, RawWord[][]>;

function wordsFor(line: Omit<Line, "words">, aligned: RawWord[] | undefined, fps: number): Word[] {
  const spoken = line.de.split(" ");

  /*
   * No alignment for this line yet: fall back to one span covering the whole
   * clip, which makes the karaoke light the line up in one go rather than
   * crashing. Running scripts/align.py fixes it; nothing else has to change.
   */
  if (!aligned || aligned.length !== spoken.length) {
    return spoken.map((text) => ({
      text,
      from: line.audioAt,
      to: line.audioAt + line.audioFrames,
      aligned: false
    }));
  }

  return aligned.map((w) => ({
    text: w.w,
    from: line.audioAt + Math.round(w.a * fps),
    to: line.audioAt + Math.round(w.b * fps),
    aligned: w.ok
  }));
}

export const DIALOGUES: Record<string, Dialogue> = Object.fromEntries(
  Object.entries(raw).map(([id, d]) => [
    id,
    {
      ...d,
      lines: d.lines.map((line) => ({
        ...line,
        words: wordsFor(line, rawWords[id]?.[line.i], d.fps)
      }))
    }
  ])
);

/**
 * The dialogues that can actually be rendered.
 *
 * A dialogue with timings but no scene file has no room to stand in and no
 * character to speak, so it is not a film yet — it is left out of the
 * compositions rather than registered as one that fails on open.
 */
export const FILMS = Object.values(DIALOGUES)
  .filter((d) => SCENES[d.id])
  .map((d) => ({ dialogue: d, scene: SCENES[d.id] }));

/*
 * A callout that names an anchor none of its rooms has used to do nothing at
 * all - the ring simply never appeared, and you found out by watching fifty
 * seconds of finished video and noticing an absence. A typo in a scene file
 * should stop the render instead, with the name of the file that has it.
 */
for (const { dialogue, scene } of FILMS) {
  const rooms = scene.rooms;
  for (const [index, callout] of Object.entries(scene.callouts)) {
    if (!findAnchor(rooms, callout.at)) {
      throw new Error(
        `scenes/${dialogue.id}.ts line ${index}: no anchor "${callout.at}" in ` +
        `${rooms.map((r) => r.set).join(" or ")}. Available: ` +
        rooms.flatMap((r) => Object.keys(SETS[r.set]?.anchors ?? {})).join(", ")
      );
    }
    if (!dialogue.lines[Number(index)]) {
      throw new Error(`scenes/${dialogue.id}.ts: callout on line ${index}, which does not exist`);
    }
  }
}
