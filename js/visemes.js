/*
 * German text → a timed sequence of mouth shapes.
 *
 * Why this can be done from the spelling at all: German orthography is close to
 * phonemic. Where English "ough" is six different sounds, German <sch> is /ʃ/
 * every time, <ei> is /aɪ/ every time, and <v> is /f/ nearly every time. So a
 * few dozen digraph rules get within a viseme of the truth, and a viseme is a
 * much coarser target than a phoneme — /p/, /b/ and /m/ all look like closed
 * lips, so the three ways this could be wrong about them all look identical.
 *
 * What it cannot do is *time* the result. The estimate here is relative
 * duration only — a long vowel lasts longer than a stop — and the caller scales
 * the whole track to the clip's real length. That assumes an even speaking pace
 * across the sentence, which is false in the small: a comma slows Piper down
 * more than the model here predicts. Drift of a syllable or two is normal and
 * survivable, because lipsync.js gates the mouth on the audio's actual loudness.
 * Estimated *shapes* with measured *energy* reads as correct far more reliably
 * than the timing alone deserves.
 *
 * The output alphabet is the 15 Oculus visemes, which is what Ready Player Me
 * and most glTF avatars ship as morph targets. Nothing here knows that, though —
 * a viseme is just a name until a character decides how to draw it.
 */

/* The 15. `sil` is a closed, resting mouth. */
export const VISEMES = [
  "sil", "PP", "FF", "TH", "DD", "kk", "CH", "SS", "nn", "RR",
  "aa", "E", "I", "O", "U"
];

/*
 * How each viseme looks, as four independent numbers rather than a mesh.
 *
 * This indirection is the whole reason a procedural character and a downloaded
 * glTF avatar can share one driver. A rigged avatar takes the viseme weights
 * straight to its morph targets and ignores this table; a character drawn in
 * code has no morph targets and reads the table instead. Adding a third kind of
 * character means writing neither a new phonemiser nor a new driver.
 *
 *   open   jaw drop, 0 shut … 1 wide
 *   wide   corners pulled apart (a grin shape), 0 neutral … 1 spread
 *   round  corners pushed forward (a kiss shape), 0 neutral … 1 pursed
 *   press  lips actively squeezed together — only /p b m/ really do this
 */
export const VISEME_SHAPE = {
  sil: { open: 0.00, wide: 0.00, round: 0.00, press: 0.00 },
  PP:  { open: 0.00, wide: 0.00, round: 0.00, press: 1.00 },
  FF:  { open: 0.12, wide: 0.30, round: 0.00, press: 0.45 },
  TH:  { open: 0.28, wide: 0.20, round: 0.00, press: 0.00 },
  DD:  { open: 0.22, wide: 0.20, round: 0.00, press: 0.00 },
  kk:  { open: 0.30, wide: 0.10, round: 0.00, press: 0.00 },
  CH:  { open: 0.22, wide: 0.00, round: 0.65, press: 0.00 },
  SS:  { open: 0.14, wide: 0.55, round: 0.00, press: 0.00 },
  nn:  { open: 0.18, wide: 0.15, round: 0.00, press: 0.10 },
  RR:  { open: 0.32, wide: 0.05, round: 0.25, press: 0.00 },
  aa:  { open: 1.00, wide: 0.25, round: 0.00, press: 0.00 },
  E:   { open: 0.55, wide: 0.55, round: 0.00, press: 0.00 },
  I:   { open: 0.28, wide: 0.80, round: 0.00, press: 0.00 },
  O:   { open: 0.60, wide: 0.00, round: 0.75, press: 0.00 },
  U:   { open: 0.26, wide: 0.00, round: 1.00, press: 0.00 }
};

/*
 * Relative durations, not milliseconds — the track is rescaled to the real clip
 * length, so only the ratios between these matter. A stop is a flicker, a long
 * vowel is where the mouth actually sits and is seen.
 */
const DUR = {
  longVowel: 1.65,
  vowel: 1.00,
  glide: 0.62,      // one half of a diphthong
  fricative: 0.88,
  nasal: 0.70,
  stop: 0.48,
  schwa: 0.62
};

/* Which bucket a viseme's duration comes from when nothing more specific says. */
const CLASS_DUR = {
  sil: DUR.vowel, PP: DUR.stop, FF: DUR.fricative, TH: DUR.fricative,
  DD: DUR.stop, kk: DUR.stop, CH: DUR.fricative, SS: DUR.fricative,
  nn: DUR.nasal, RR: DUR.nasal, aa: DUR.vowel, E: DUR.vowel,
  I: DUR.vowel, O: DUR.vowel, U: DUR.vowel
};

const VOWELS = "aeiouäöüy";

function isVowel(ch) { return VOWELS.indexOf(ch) >= 0; }

/*
 * Rules, longest match first.
 *
 * Each entry is [pattern, visemes, options]. The scanner walks the word left to
 * right and takes the first rule that matches at the cursor, so `tsch` has to be
 * listed above `sch`, which has to be above `ch`. Order is load-bearing; the
 * table is sorted by length within each group to keep it that way by eye.
 *
 * Options:
 *   at: "start" | "end"   only match at a word boundary
 *   dur: [..]             per-viseme duration override
 *   long: true            treat a following consonant cluster as not shortening
 */
const RULES = [
  /* --- four and three letters ------------------------------------------- */
  // -tion is /tsi̯oːn/: the <t> is an /ts/, and the <i> is a glide onto a long o.
  ["tion", ["SS", "I", "O", "nn"], { at: "end", dur: [DUR.fricative, DUR.glide, DUR.longVowel, DUR.nasal] }],
  ["tsch", ["DD", "CH"], { dur: [DUR.stop, DUR.fricative] }],
  // <chs> is /ks/ in "sechs", "Fuchs", "wachsen" — but "Bauch|schmerzen" is a
  // compound whose halves happen to spell <chs> across the seam, and there the
  // /ʃ/ belongs to the second half. Matching the longer pattern first keeps the
  // seam intact without needing to know where compounds split.
  ["chsch", ["kk", "CH"], {}],
  ["chs",  ["kk", "SS"], {}],
  ["sch",  ["CH"], {}],

  /* --- vowel + h: the h is silent and lengthens the vowel ---------------- */
  ["aah", ["aa"], { dur: [DUR.longVowel] }],
  ["ah",  ["aa"], { dur: [DUR.longVowel] }],
  ["äh",  ["E"],  { dur: [DUR.longVowel] }],
  ["eh",  ["E"],  { dur: [DUR.longVowel] }],
  ["ih",  ["I"],  { dur: [DUR.longVowel] }],
  ["oh",  ["O"],  { dur: [DUR.longVowel] }],
  ["öh",  ["O"],  { dur: [DUR.longVowel] }],
  ["uh",  ["U"],  { dur: [DUR.longVowel] }],
  ["üh",  ["U"],  { dur: [DUR.longVowel] }],

  /* --- doubled vowels ---------------------------------------------------- */
  ["aa", ["aa"], { dur: [DUR.longVowel] }],
  ["ee", ["E"],  { dur: [DUR.longVowel] }],
  ["oo", ["O"],  { dur: [DUR.longVowel] }],

  /* --- diphthongs, as two shapes because the lips really do travel ------- */
  ["ei", ["aa", "I"], { dur: [DUR.glide, DUR.glide] }],
  ["ai", ["aa", "I"], { dur: [DUR.glide, DUR.glide] }],
  ["ey", ["aa", "I"], { dur: [DUR.glide, DUR.glide] }],
  ["ay", ["aa", "I"], { dur: [DUR.glide, DUR.glide] }],
  ["au", ["aa", "U"], { dur: [DUR.glide, DUR.glide] }],
  ["eu", ["O", "U"],  { dur: [DUR.glide, DUR.glide] }],
  ["äu", ["O", "U"],  { dur: [DUR.glide, DUR.glide] }],

  // <ie> is a long /iː/, not a diphthong — "Liebe" is not "lie-be".
  ["ie", ["I"], { dur: [DUR.longVowel] }],

  /* --- consonant digraphs ------------------------------------------------ */
  // <st->/<sp-> are /ʃt/ /ʃp/ at the start of a word, /st/ /sp/ inside one.
  ["st", ["CH", "DD"], { at: "start" }],
  ["sp", ["CH", "PP"], { at: "start" }],
  ["ck", ["kk"], {}],
  ["ch", ["CH"], {}],          // refined below: ach-laut after a back vowel
  ["ng", ["kk"], { dur: [DUR.nasal] }],
  ["nk", ["kk"], { dur: [DUR.nasal] }],
  ["pf", ["PP", "FF"], {}],
  ["ph", ["FF"], {}],
  ["qu", ["kk", "FF"], {}],
  ["th", ["DD"], {}],
  ["sz", ["SS"], {}],
  ["tz", ["SS"], {}],
  ["zz", ["SS"], {}],          // only in loanwords — "Pizza", "Skizze"
  ["ss", ["SS"], {}],
  ["ll", ["nn"], {}],
  ["mm", ["PP"], {}],
  ["nn", ["nn"], {}],
  ["tt", ["DD"], {}],
  ["pp", ["PP"], {}],
  ["bb", ["PP"], {}],
  ["dd", ["DD"], {}],
  ["ff", ["FF"], {}],
  ["gg", ["kk"], {}],
  ["rr", ["RR"], {}],

  /* --- single letters ---------------------------------------------------- */
  ["a", ["aa"], {}],
  ["ä", ["E"],  {}],
  ["e", ["E"],  {}],
  ["i", ["I"],  {}],
  ["o", ["O"],  {}],
  ["ö", ["O"],  {}],
  ["u", ["U"],  {}],
  ["ü", ["U"],  {}],
  ["y", ["U"],  {}],           // German <y> is mostly /yː/: "Typ", "Physik"
  ["b", ["PP"], {}],
  ["c", ["kk"], {}],
  ["d", ["DD"], {}],
  ["f", ["FF"], {}],
  ["g", ["kk"], {}],
  ["h", null,   {}],           // silent unless it opened a syllable; close enough
  ["j", ["I"],  { dur: [DUR.glide] }],
  ["k", ["kk"], {}],
  ["l", ["nn"], {}],
  ["m", ["PP"], {}],
  ["n", ["nn"], {}],
  ["p", ["PP"], {}],
  ["r", ["RR"], {}],
  ["s", ["SS"], {}],
  ["ß", ["SS"], {}],
  ["t", ["DD"], {}],
  ["v", ["FF"], {}],
  ["w", ["FF"], {}],
  ["x", ["kk", "SS"], {}],
  ["z", ["SS"], {}]
];

/* Sorted once so the longest pattern always wins at a given cursor. */
const SORTED = RULES.slice().sort((a, b) => b[0].length - a[0].length);

/* <ch> after a back vowel is the ach-laut /x/ — lips open, not pursed. */
const BACK_VOWEL = "aou";

/**
 * One word → a list of { v, d }: viseme name and relative duration.
 *
 * Runs the rule table over the lowercased word. Anything unmatched (a digit, a
 * stray letter) is skipped rather than guessed at.
 */
function phonemiseWord(word) {
  const w = word.toLowerCase();
  const out = [];
  let i = 0;

  while (i < w.length) {
    let matched = null;

    for (let r = 0; r < SORTED.length; r++) {
      const [pattern, visemes, opts] = SORTED[r];
      if (w.startsWith(pattern, i) === false) continue;
      if (opts.at === "start" && i !== 0) continue;
      if (opts.at === "end" && i + pattern.length !== w.length) continue;
      matched = { pattern, visemes, opts };
      break;
    }

    if (!matched) { i += 1; continue; }

    const { pattern, opts } = matched;
    let visemes = matched.visemes;

    // The one context rule worth having: "Buch" and "ich" do different things
    // with the lips, and they are not rare words.
    if (pattern === "ch" && i > 0 && BACK_VOWEL.indexOf(w[i - 1]) >= 0) {
      visemes = ["kk"];
    }

    if (visemes) {
      for (let k = 0; k < visemes.length; k++) {
        const v = visemes[k];
        let d = (opts.dur && opts.dur[k]) || CLASS_DUR[v] || DUR.vowel;

        // A vowel before two consonants is short: "Bett" not "Beet". Cheap
        // approximation of German's closed-syllable shortening, and it is what
        // keeps every second word from looking drawled.
        const isLast = k === visemes.length - 1;
        if (isLast && isVowel(pattern[pattern.length - 1]) && !opts.dur) {
          const after = w.slice(i + pattern.length);
          if (/^[^aeiouäöüy]{2}/.test(after)) d = Math.min(d, DUR.vowel * 0.8);
        }

        out.push({ v, d });
      }
    }

    i += pattern.length;
  }

  // An unstressed final -e / -en / -er is a schwa, not a full vowel. German
  // ends a great many words this way, so leaving them full-length makes the
  // mouth hang open at the end of nearly every word.
  if (out.length > 1 && /(?:e|en|er|el|em)$/.test(w)) {
    const tail = out[out.length - 1];
    tail.d = Math.min(tail.d, DUR.schwa);
    if (out.length > 2 && /(?:en|er|el|em)$/.test(w)) {
      out[out.length - 2].d = Math.min(out[out.length - 2].d, DUR.schwa);
    }
  }

  return out;
}

/* How long the mouth rests at punctuation, in the same relative units. */
function pauseFor(mark) {
  if (/[.!?]/.test(mark)) return 2.0;
  if (/[;:]/.test(mark)) return 1.4;
  if (/[,–—]/.test(mark)) return 1.1;
  return 0;
}

/**
 * German sentence → a viseme track scaled to `duration` seconds.
 *
 * Returns `{ track, words }`:
 *   track  [{ v, t0, t1 }]  mouth shapes in seconds from the start of the clip
 *   words  [{ i, t0, t1 }]  where each word sits, so a boundary event from the
 *                           browser voice can resynchronise the whole track
 *
 * `duration` may be 0 or unknown at call time — pass 0 and rescale later with
 * `rescale()`, which is what the clip path does, since an <audio> element does
 * not know its own length until metadata arrives.
 */
export function trackFor(text, duration) {
  if (!text) return { track: [], words: [], units: 0 };

  const tokens = String(text).split(/\s+/).filter(Boolean);
  const units = [];        // { v, d } plus word markers
  const words = [];

  tokens.forEach((token, wi) => {
    const bare = token.replace(/[^0-9A-Za-zÄÖÜäöüß]/g, "");
    const trailing = token.slice(token.replace(/[.,;:!?–—]+$/, "").length);

    const phones = bare ? phonemiseWord(bare) : [];
    if (!phones.length) return;

    words.push({ i: wi, from: units.length, to: units.length + phones.length });
    for (const p of phones) units.push(p);

    const pause = pauseFor(trailing);
    if (pause) units.push({ v: "sil", d: pause });
    else if (wi < tokens.length - 1) units.push({ v: "sil", d: 0.18 });  // word gap
  });

  const total = units.reduce((sum, u) => sum + u.d, 0) || 1;
  const build = (seconds) => {
    const scale = seconds > 0 ? seconds / total : 0;
    const track = [];
    let t = 0;
    for (const u of units) {
      track.push({ v: u.v, t0: t, t1: t + u.d * scale });
      t += u.d * scale;
    }
    const wordSpans = words.map((w) => ({
      i: w.i,
      t0: track[w.from] ? track[w.from].t0 : 0,
      t1: track[w.to - 1] ? track[w.to - 1].t1 : 0
    }));
    return { track, words: wordSpans, units: total };
  };

  const result = build(duration || 0);
  result.rescale = (seconds) => build(seconds);
  return result;
}

/**
 * Sample a track at time `t`, with a short crossfade between neighbours.
 *
 * Returns weights per viseme rather than one winning name. Real lips are always
 * between two shapes; snapping from viseme to viseme at phoneme boundaries is
 * the single thing that makes cheap lip sync look like a glove puppet.
 *
 * `blend` is the crossfade in seconds. 40–60 ms is about right: shorter reads as
 * a snap, longer and the shapes average out into a permanently half-open mouth.
 */
export function sampleTrack(track, t, blend) {
  const weights = {};
  if (!track || !track.length) return weights;

  const fade = blend || 0.05;

  // Linear scan from a hint would be faster, but a sentence is a few hundred
  // entries and this runs once a frame — binary search is already overkill.
  let lo = 0;
  let hi = track.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (track[mid].t1 <= t) lo = mid + 1; else hi = mid;
  }

  const cur = track[lo];
  if (!cur) return weights;

  const add = (v, w) => { if (w > 0) weights[v] = (weights[v] || 0) + w; };

  // Inside the entry: full weight, tapering into whichever neighbour is near.
  const intoStart = t - cur.t0;
  const untilEnd = cur.t1 - t;

  if (intoStart < fade && lo > 0) {
    const k = Math.max(0, intoStart) / fade;         // 0 at the boundary, 1 clear of it
    add(track[lo - 1].v, 1 - k);
    add(cur.v, k);
  } else if (untilEnd < fade && lo < track.length - 1) {
    const k = Math.max(0, untilEnd) / fade;
    add(track[lo + 1].v, 1 - k);
    add(cur.v, k);
  } else {
    add(cur.v, 1);
  }

  return weights;
}

/** Viseme weights → the four shape numbers a character can draw. */
export function shapeFor(weights) {
  const shape = { open: 0, wide: 0, round: 0, press: 0 };
  let sum = 0;
  for (const v in weights) {
    const w = weights[v];
    const s = VISEME_SHAPE[v];
    if (!s || !w) continue;
    shape.open += s.open * w;
    shape.wide += s.wide * w;
    shape.round += s.round * w;
    shape.press += s.press * w;
    sum += w;
  }
  if (sum > 1) {                 // crossfades can overlap; keep the scale honest
    shape.open /= sum; shape.wide /= sum; shape.round /= sum; shape.press /= sum;
  }
  return shape;
}
