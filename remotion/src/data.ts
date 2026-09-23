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
import { c005 } from "./scenes/c005";
import { c006 } from "./scenes/c006";
import { c007 } from "./scenes/c007";
import { c008 } from "./scenes/c008";
import { c009 } from "./scenes/c009";
import { c010 } from "./scenes/c010";
import { c011 } from "./scenes/c011";
import { c012 } from "./scenes/c012";
import { c013 } from "./scenes/c013";
import { c014 } from "./scenes/c014";
import { c015 } from "./scenes/c015";
import { c016 } from "./scenes/c016";
import { c017 } from "./scenes/c017";
import { c018 } from "./scenes/c018";
import { c019 } from "./scenes/c019";
import { c020 } from "./scenes/c020";
import { c021 } from "./scenes/c021";
import { c022 } from "./scenes/c022";
import { c023 } from "./scenes/c023";
import { c024 } from "./scenes/c024";
import { c025 } from "./scenes/c025";
import { c026 } from "./scenes/c026";
import { c027 } from "./scenes/c027";
import { c028 } from "./scenes/c028";
import { c029 } from "./scenes/c029";
import { c030 } from "./scenes/c030";
import { c031 } from "./scenes/c031";
import { c032 } from "./scenes/c032";
import { c033 } from "./scenes/c033";
import { c034 } from "./scenes/c034";
import { c035 } from "./scenes/c035";
import { c036 } from "./scenes/c036";
import { c037 } from "./scenes/c037";
import { c038 } from "./scenes/c038";
import { c039 } from "./scenes/c039";
import { c040 } from "./scenes/c040";
import { c041 } from "./scenes/c041";
import { c042 } from "./scenes/c042";
import { c043 } from "./scenes/c043";
import { c044 } from "./scenes/c044";
import { c045 } from "./scenes/c045";
import { c046 } from "./scenes/c046";
import { c047 } from "./scenes/c047";
import { c048 } from "./scenes/c048";
import { c049 } from "./scenes/c049";
import { c050 } from "./scenes/c050";
import type { Dialogue, Line, Scene, Word } from "./types";

type RawWord = { w: string; a: number; b: number; ok: boolean; c?: [string, number, number][] };

const SCENES: Record<string, Scene> = { c001, c002, c003, c004, c005, c006, c007, c008, c009, c010, c011, c012, c013, c014, c015, c016, c017, c018, c019, c020, c021, c022, c023, c024, c025, c026, c027, c028, c029, c030, c031, c032, c033, c034, c035, c036, c037, c038, c039, c040, c041, c042, c043, c044, c045, c046, c047, c048, c049, c050 };

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
    aligned: w.ok,
    /* left fractional: a letter is shorter than a frame, and rounding them
       would stack three onto one frame and leave the next one empty */
    letters: w.c?.map(([ch, a, b]) => ({ ch, from: line.audioAt + a * fps, to: line.audioAt + b * fps }))
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
  .map((d) => ({ dialogue: withGaps(d, SCENES[d.id]), scene: SCENES[d.id] }));

/*
 * An acted film needs silences the dialogue does not have. Walking from the
 * waiting bench to the desk takes four seconds and nobody says anything
 * during it; finding a passport in an inside pocket takes two. The scene asks
 * for those as seconds before a given line, and every line from there on
 * moves later by that much — words and letters with it, so the karaoke and
 * the mouths stay on the voice.
 *
 * Done here rather than in build-data.mjs because the gaps are staging, and
 * staging lives in the scene file: re-running the timing script must not be
 * able to lose them.
 */
function withGaps(d: Dialogue, scene: Scene): Dialogue {
  const acted = scene.acted;
  if (!acted) return d;
  const sec = (s: number) => Math.round(s * d.fps);
  let shift = 0;
  const lines = d.lines.map((l) => {
    shift += sec(acted.gaps[l.i] ?? 0);
    const by = shift;
    return {
      ...l,
      enterAt: l.enterAt + by,
      audioAt: l.audioAt + by,
      endAt: l.endAt + by,
      words: l.words.map((w) => ({
        ...w,
        from: w.from + by,
        to: w.to + by,
        letters: w.letters?.map((c) => ({ ...c, from: c.from + by, to: c.to + by }))
      }))
    };
  });
  return { ...d, lines, durationInFrames: d.durationInFrames + shift + sec(acted.tail ?? 0) };
}

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
