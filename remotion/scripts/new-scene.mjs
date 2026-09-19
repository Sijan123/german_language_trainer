/*
 * Scaffold the staging for a dialogue.
 *
 *   node scripts/new-scene.mjs c007
 *   node scripts/new-scene.mjs c007 --force     # overwrite an existing scene
 *
 * A film needs two things: a timeline, which is generated from the audio, and
 * staging, which is a judgement call — which rooms, who stands where, which
 * word points at which object. This writes a first draft of the judgement
 * call so the job becomes editing rather than typing.
 *
 * What it works out on its own:
 *
 *   rooms      from the dialogue's topic, via TOPIC_ROOMS
 *   cast       both speakers, one per room, at the positions that work
 *   callouts   by matching the words of each line against the keyword lists
 *              the sets publish — "die Milch" finds the fridge by itself
 *   Wortschatz nouns from the dialogue looked up in the app's own js/vocab.js,
 *              so the film and the Vokabeln tab give the same translation
 *
 * What it cannot: whether the two are in the same place or on the phone,
 * whether the rooms it picked are right, and whether a proposed callout is
 * worth having. It marks those and leaves them.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");

const { CONVERSATIONS, CONV_TOPICS } = await import(
  new URL("../../js/conversations.js", import.meta.url)
);
const { VOCAB } = await import(new URL("../../js/vocab.js", import.meta.url));

/*
 * The registry is TypeScript, and this is a plain node script, so the keyword
 * lists and room defaults are read out of the source rather than imported.
 * Ugly, but the alternative is a build step in front of a scaffolder, and the
 * shapes it is looking for are simple enough to fail loudly if they change.
 */
function readRegistry() {
  const src = fs.readFileSync(path.join(proj, "src", "components", "sets", "index.ts"), "utf8");

  const topicRooms = {};
  const tr = src.match(/export const TOPIC_ROOMS[^{]*\{([\s\S]*?)\n\};/);
  if (tr) {
    /* One room or two: a topic where the speakers share a place — a
       restaurant table rather than a phone call — names a single full-width
       set, so the list has one entry. */
    for (const m of tr[1].matchAll(/(\w+):\s*\[([^\]]+)\]/g)) {
      topicRooms[m[1]] = m[2]
        .split(",")
        .map((r) => r.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    }
  }

  const fb = src.match(/FALLBACK_ROOMS[^=]*=\s*\["([^"]+)",\s*"([^"]+)"\]/);
  const fallback = fb ? [fb[1], fb[2]] : ["wohnzimmer", "kueche"];

  const sets = {};
  for (const file of fs.readdirSync(path.join(proj, "src", "components", "sets"))) {
    if (!file.endsWith(".tsx") || file === "kit.tsx") continue;
    const text = fs.readFileSync(path.join(proj, "src", "components", "sets", file), "utf8");
    const name = file.replace(/\.tsx$/, "").toLowerCase();
    const kw = text.match(/Keywords: Record<string, string\[\]> = \{([\s\S]*?)\n\};/);
    const anchors = {};
    if (kw) {
      for (const m of kw[1].matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
        anchors[m[1]] = m[2]
          .split(",")
          .map((w) => w.trim().replace(/^"|"$/g, ""))
          .filter(Boolean);
      }
    }
    sets[name] = anchors;
  }
  return { topicRooms, fallback, sets };
}

/* ------------------------------------------------------------------ */

const strip = (w) => w.toLowerCase().replace(/[.,!?;:„“"»«()]/g, "");

/** Every vocab entry, flattened, keyed by its headword without the article. */
function vocabIndex() {
  const index = new Map();
  for (const theme of Object.keys(VOCAB)) {
    for (const entry of VOCAB[theme]) {
      // "die Kasse (die Kassen)" -> key "kasse", shown as "die Kasse"
      const clean = entry.de.replace(/\s*\(.*\)\s*$/, "").trim();
      const bare = clean.replace(/^(der|die|das)\s+/i, "").toLowerCase();
      if (!index.has(bare)) {
        index.set(bare, {
          de: clean,
          en: entry.en,
          noun: entry.type === "noun" || /^(der|die|das)\s/i.test(clean)
        });
      }
    }
  }
  return index;
}

/**
 * Propose one callout per line, at most.
 *
 * The first keyword hit in a line wins, and a line that repeats an object
 * already pointed at in the previous line is skipped — a pointer that fires on
 * every line is wallpaper, and the same ring twice in a row reads as a stutter.
 */
function proposeCallouts(conv, rooms, sets, vocab) {
  const out = {};
  let previous = null;

  conv.lines.forEach((line, i) => {
    const words = line.de.split(/\s+/);
    let hit = null;

    for (const word of words) {
      const bare = strip(word);
      if (bare.length < 3) continue;
      /* Nouns only, and the test is the app's own vocabulary rather than
         capitalisation: German capitalises its nouns, but it also capitalises
         the first word of every sentence, and that is how the first version
         put a ring round "Draußen". A callout label is a vocabulary item, so
         if js/vocab.js does not know the word as a noun it does not get one. */
      const known = vocab.get(bare);
      if (!known || !known.noun) continue;
      for (const roomName of rooms) {
        const anchors = sets[roomName] || {};
        for (const [anchor, keywords] of Object.entries(anchors)) {
          if (keywords.includes(bare)) {
            hit = { at: anchor, word: word.replace(/[.,!?;:]$/, ""), bare };
            break;
          }
        }
        if (hit) break;
      }
      if (hit) break;
    }

    if (!hit || hit.at === previous) {
      if (hit) previous = hit.at;
      return;
    }
    previous = hit.at;
    out[i] = { at: hit.at, label: vocab.get(hit.bare).de, word: hit.word };
  });

  return out;
}

/** Six words from the dialogue that the app already has translations for. */
function proposeWortschatz(conv, vocab) {
  const seen = new Set();
  const found = [];
  for (const line of conv.lines) {
    for (const word of line.de.split(/\s+/)) {
      const bare = strip(word);
      if (bare.length < 4 || seen.has(bare)) continue;
      // Nouns are capitalised in German, which is the cheapest filter there is.
      if (!/^[A-ZÄÖÜ]/.test(word)) continue;
      seen.add(bare);
      const known = vocab.get(bare);
      if (known && known.noun) found.push({ de: known.de, en: known.en });
      if (found.length >= 6) return found;
    }
  }
  return found;
}

/*
 * Rewrite the scene imports in src/data.ts from what is actually in
 * src/scenes/.
 *
 * Generated from the directory rather than patched in place: the first version
 * spliced a new import next to the last one with a regular expression, and on
 * the second scene it added the entry to the registry without the import to
 * go with it. A list you can regenerate cannot drift from the files it
 * describes.
 */
function registerScenes() {
  const dir = path.join(proj, "src", "scenes");
  const names = fs
    .readdirSync(dir)
    .filter((f) => /^c\d+\.ts$/.test(f))
    .map((f) => f.replace(/\.ts$/, ""))
    .sort();

  const file = path.join(proj, "src", "data.ts");
  let src = fs.readFileSync(file, "utf8");

  /*
   * Match and write the file's own line ending. This is a Windows repo and
   * data.ts has CRLF in it; a pattern ending in ";\n" matched none of the
   * import lines, so the registry gained an entry while the imports it needed
   * silently did not, and the next typecheck failed on a name that was never
   * imported.
   */
  const eol = src.includes("\r\n") ? "\r\n" : "\n";

  const imports = names.map((n) => `import { ${n} } from "./scenes/${n}";${eol}`).join("");
  const importBlock = /(?:import \{ c\d+ \} from "\.\/scenes\/c\d+";\r?\n)+/;
  if (!importBlock.test(src)) {
    throw new Error("src/data.ts: cannot find the scene imports to rewrite");
  }
  src = src.replace(importBlock, imports);

  const registry = /const SCENES: Record<string, Scene> = \{[^}]*\};/;
  if (!registry.test(src)) {
    throw new Error("src/data.ts: cannot find the SCENES registry to rewrite");
  }
  src = src.replace(registry, `const SCENES: Record<string, Scene> = { ${names.join(", ")} };`);

  fs.writeFileSync(file, src);
  return names;
}

/* ------------------------------------------------------------------ */

const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const force = process.argv.includes("--force");
if (!ids.length) {
  console.error("usage: node scripts/new-scene.mjs c007 [--force]");
  process.exit(1);
}

const { topicRooms, fallback, sets } = readRegistry();
const vocab = vocabIndex();

for (const id of ids) {
  const conv = CONVERSATIONS.find((c) => c.id === id);
  if (!conv) {
    console.error("unknown dialogue: " + id);
    process.exit(1);
  }

  const file = path.join(proj, "src", "scenes", id + ".ts");
  if (fs.existsSync(file) && !force) {
    console.error(id + ": src/scenes/" + id + ".ts already exists (use --force)");
    process.exit(1);
  }

  const topic = CONV_TOPICS.find((t) => t.id === conv.topic);
  const guessed = !topicRooms[conv.topic];
  const rooms = topicRooms[conv.topic] || fallback;

  /* Whoever speaks first takes the left-hand room, so the film opens on the
     side the eye starts at. */
  const first = conv.lines[0].s;
  const other = conv.lines.find((l) => l.s !== first)?.s || (first === "Sijan" ? "Shruti" : "Sijan");

  const callouts = proposeCallouts(conv, rooms, sets, vocab);
  const words = proposeWortschatz(conv, vocab);

  const look = {
    Sijan: {
      skin: "#c98f63", skinShade: "#b67f56", hair: "#2f2723",
      hairStyle: "short", beard: true, top: "#3f6b8f", topDark: "#355b7a"
    },
    Shruti: {
      skin: "#cf9a72", skinShade: "#bc8862", hair: "#3a2a26",
      hairStyle: "bun", beard: false, top: "#9c5068", topDark: "#89455a"
    }
  };

  const shared = rooms.length === 1;

  const actor = (name, roomIndex, seat) => {
    const l = look[name];
    /* In one shared room they sit either side of whatever is between them; in
       two rooms each is pushed to the outer edge of their own half. */
    const x = shared ? (seat === 0 ? 420 : 1500) : roomIndex === 0 ? 258 : 1664;
    return `    ${name}: {
      room: ${roomIndex},
      x: ${x},
      headY: 470,
      scale: 1,
      skin: "${l.skin}",
      skinShade: "${l.skinShade}",
      hair: "${l.hair}",
      hairStyle: "${l.hairStyle}",
      beard: ${l.beard},
      top: "${l.top}",
      topDark: "${l.topDark}",
      basket: false
    }`;
  };

  const calloutLines = Object.entries(callouts).map(([i, c]) =>
    `    ${i}: { at: "${c.at}", label: "${c.label}", word: "${c.word}" }`
  );

  const body = `/*
 * Staging for ${id} — "${conv.title}".
 *
 * Scaffolded by scripts/new-scene.mjs from the dialogue, the set registry and
 * js/vocab.js. Read it before rendering: the parts it cannot know are marked
 * TODO, and a first draft that nobody read is how a film ends up set in the
 * wrong room.
 *
${shared
  ? ` * This topic has a single set, so the two share one room and nobody is on
 *      the phone. Check that is right for this dialogue.
`
  : ` * TODO Are these two in the same place, or on the phone? The scaffolder
 *      splits them into two rooms because that is right more often than not.
 *      If they are together, give the scene a full-width set instead, put
 *      both in room 0, and set call: false.
`}${guessed ? ` * TODO Topic "${conv.topic}" has no rooms of its own yet, so this fell back
 *      to ${rooms.join(" + ")}. Either draw the room it wants in
 *      components/sets/ or accept the fallback knowingly.\n` : ""} * TODO Check each callout actually earns its place, and that the labels read
 *      the way you would say them.
 */

import type { Scene } from "../types";

export const ${id}: Scene = {
  id: "${id}",
${shared ? "  call: false,\n" : ""}
  rooms: [
${shared
  ? `    { set: "${rooms[0]}", from: 0, to: 1920 }`
  : `    { set: "${rooms[0]}", from: 0, to: 960 },\n    { set: "${rooms[1]}", from: 960, to: 1920 }`}
  ],

  /* \`x\` is the centre of the head. Both are pushed towards the outer edges so
     the speech bubble can sit across the middle without covering a face. */
  cast: {
${actor(first, 0, 0)},
${actor(other, shared ? 0 : 1, 1)}
  },

  /* One callout per line at most, and most lines have none. \`word\` is the
     word in the German the ring waits for before it appears. */
  callouts: {
${calloutLines.join(",\n")}${calloutLines.length ? "\n" : ""}  },

  /* The card at the end. Six reads at a glance; ten is a list you skip. */
  wortschatz: [
${words.map((w) => `    { de: "${w.de}", en: "${w.en.replace(/"/g, '\\"')}" }`).join(",\n")}
  ]
};
`;

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);

  registerScenes();

  console.log(
    "\n" + id + "  " + conv.title +
    "\n  topic     " + (topic ? topic.name : conv.topic) + (guessed ? "  (no rooms defined - fell back)" : "") +
    "\n  rooms     " + rooms.join("  +  ") +
    "\n  cast      " + first + " left, " + other + " right" +
    "\n  callouts  " + Object.keys(callouts).length + " of " + conv.lines.length + " lines" +
    "\n  wortschatz " + words.length + " of 6 found in vocab.js" +
    "\n  -> src/scenes/" + id + ".ts   (read the TODOs, then: node scripts/render.mjs " + id + ")"
  );
}
