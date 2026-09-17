/*
 * What the mouth is doing, right now.
 *
 * One line is ever being spoken, so this is a singleton rather than something
 * you construct — the same shape as the reused <audio> element in speech.js and
 * for the same reason.
 *
 * It sits between two things that must not know about each other: speech.js,
 * which owns playback and has never heard of WebGL, and stage.js, which draws
 * and has never heard of audio. The stage calls `read()` once a frame and gets
 * four numbers and a name. Nothing else crosses.
 *
 *
 * TIMING vs ENERGY
 *
 * Two independent signals, and the combination is what makes this work without
 * forced alignment:
 *
 *   timing   from visemes.js — estimated from spelling, so the *shapes* are
 *            right and their order is right, but the clock drifts.
 *   energy   measured off the real waveform through an AnalyserNode — knows
 *            nothing about which shape, but is never wrong about whether
 *            someone is speaking at all.
 *
 * Multiply them and the failure modes cancel. Where the estimate drifts a
 * syllable, you get the neighbouring vowel instead of the right one, which is a
 * shape nobody can see is wrong at conversational speed. What people *do* see
 * instantly is a mouth flapping through a silence or clamped shut through a
 * word, and energy alone is enough to prevent both.
 *
 * The browser-voice path gets no waveform — speechSynthesis exposes no audio —
 * so it runs on the estimate alone, resynchronised on every word boundary event
 * where the browser fires them.
 */

import { trackFor, sampleTrack, shapeFor, VISEMES } from "./visemes.js";

/*
 * Off until a stage asks for it.
 *
 * This is not an optimisation. Routing the shared <audio> element through Web
 * Audio changes how every clip in the app reaches the speakers, permanently and
 * irreversibly for the life of the page. Someone who never opens the stage —
 * which is everyone by default — must not have their audio path quietly
 * rebuilt underneath them for a feature they are not looking at.
 */
let enabled = false;

export function setEnabled(on) {
  enabled = !!on;
  if (!enabled) end();
}

/* ------------------------------------------------------------------ */
/* Web Audio: measuring how loud the clip is, right now                */
/* ------------------------------------------------------------------ */

let ctx = null;
let analyser = null;
let sourced = null;       // the one element already routed through the graph
let buffer = null;

/*
 * Routing an <audio> element through Web Audio is a one-way door in two ways:
 * createMediaElementSource can be called once per element for the life of the
 * page, and from that moment the element's sound reaches the speakers *only*
 * through the graph. So if the context is suspended — which is the state every
 * AudioContext is born in until a user gesture — connecting would silence the
 * app rather than merely failing to animate it.
 *
 * Hence the order here: resume first, verify it is actually running, and only
 * then connect. A context that will not start leaves playback completely
 * untouched and the mouth falls back to the estimate.
 */
function ensureAnalyser(audio) {
  if (!audio || analyser) return analyser;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  try {
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    if (ctx.state !== "running") return null;      // try again on a later line

    const node = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.35;
    node.connect(analyser);
    analyser.connect(ctx.destination);             // or the clip goes silent
    sourced = audio;
    buffer = new Uint8Array(analyser.fftSize);
    return analyser;
  } catch (e) {
    analyser = null;
    return null;                                    // already sourced, or blocked
  }
}

/*
 * Loudness as a 0..1 number, with the gain worked out as we go.
 *
 * A fixed threshold cannot work here: the Piper clips, the browser voices and
 * whatever the device volume is set to differ by more than an order of
 * magnitude. So the peak is tracked and decays, which normalises a quiet clip
 * up and a loud one down within about a second of speech.
 */
let peak = 0.06;

function energyNow() {
  if (!analyser || !buffer) return -1;             // -1 = no measurement available
  analyser.getByteTimeDomainData(buffer);

  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / buffer.length);

  peak = Math.max(rms, peak * 0.995);              // slow decay, fast attack
  peak = Math.max(peak, 0.02);                     // never divide by ~nothing

  // A little headroom under the peak so ordinary syllables reach full open
  // rather than only the loudest one in the sentence does.
  return Math.min(1, rms / (peak * 0.75));
}

/* ------------------------------------------------------------------ */
/* The current line                                                    */
/* ------------------------------------------------------------------ */

const live = {
  speaking: false,
  speaker: null,
  track: [],
  words: [],
  built: null,        // the trackFor result, kept so it can be rescaled
  audio: null,        // the <audio> element, when a clip is playing
  startedAt: 0,       // wall clock, for the browser-voice path
  estimated: 0,       // guessed duration for the browser-voice path
  offset: 0           // correction applied by word-boundary resync
};

/* Smoothed output, so a dropped frame cannot make the jaw jump. */
const out = { open: 0, wide: 0, round: 0, press: 0, energy: 0 };

/*
 * The same mouth, described twice, because the two kinds of character want
 * different things and neither should have to convert.
 *
 *   the four numbers   for a character drawn in code, which has no morph
 *                      targets and needs open/wide/round/press
 *   viseme weights     for a rigged glTF avatar, which has a morph target per
 *                      viseme and wants them set directly
 *
 * Ready Player Me, Avaturn and Avatar SDK all export exactly the 15 Oculus
 * visemes under exactly the names visemes.js emits, so the second form is a
 * straight assignment with no mapping table in between. Smoothed in place, and
 * every viseme is held in the object so a weight that drops out of the sample
 * decays instead of snapping to zero.
 */
const outVisemes = {};
for (const v of VISEMES) outVisemes[v] = 0;

/*
 * German at LINE_RATE, in seconds per relative unit of the visemes.js duration
 * model. Only used where nothing can be measured — the browser-voice path
 * before the first word boundary arrives.
 */
const SECONDS_PER_UNIT = 0.052;

/**
 * Begin animating a line.
 *
 * `audio` is the element speech.js is about to play, or null for the browser
 * voice. Duration is unknown for both at this moment — a clip has not loaded its
 * metadata yet and an utterance has no duration at all — so the track is built
 * unscaled and fixed up as soon as something authoritative turns up.
 */
export function begin(text, speaker, audio) {
  if (!enabled || !text) return;
  const built = trackFor(text, 0);

  live.speaking = true;
  live.speaker = speaker || null;
  live.built = built;
  live.audio = audio || null;
  live.startedAt = now();
  live.offset = 0;
  live.estimated = built.units * SECONDS_PER_UNIT;

  // The estimate goes in first and unconditionally. Carrying the previous
  // line's track over — which is what testing `live.track.length` here would
  // do — mouths the wrong sentence for as long as the clip takes to report its
  // duration, and does it silently, because a wrong sentence at the right
  // moment looks very much like a right one.
  const guess = built.rescale(live.estimated);
  live.track = guess.track;
  live.words = guess.words;

  if (audio) {
    ensureAnalyser(audio);

    // `loadedmetadata` may be for a line that has already been abandoned — a
    // fast tap on ↻ starts two lines inside one network round trip — so the
    // handler checks it is still the current one before touching anything.
    const mine = built;
    const fit = () => {
      if (live.built !== mine) return;
      const d = audio.duration;
      if (!isFinite(d) || d <= 0) return;
      const scaled = mine.rescale(d);
      live.track = scaled.track;
      live.words = scaled.words;
    };
    if (isFinite(audio.duration) && audio.duration > 0) fit();
    else audio.addEventListener("loadedmetadata", fit, { once: true });
  }
}

/**
 * Resynchronise on a word the browser voice says it has just reached.
 *
 * `speechSynthesis` fires `boundary` with a character offset for local voices in
 * most browsers — not all, and essentially never for remote ones, which is why
 * this is a correction rather than the clock itself. Nudged rather than snapped,
 * because a hard jump mid-word is more visible than the drift it fixes.
 */
export function syncWord(wordIndex) {
  if (!live.speaking || live.audio) return;
  const span = live.words.find((w) => w.i === wordIndex);
  if (!span) return;
  const elapsed = now() - live.startedAt;
  live.offset += (span.t0 - (elapsed + live.offset)) * 0.5;
}

export function end() {
  live.speaking = false;
  live.speaker = null;
  live.track = [];
  live.words = [];
  live.audio = null;
  live.built = null;      // invalidates any metadata handler still in flight
}

function now() { return (window.performance ? performance.now() : Date.now()) / 1000; }

/** Where playback stands, in seconds from the start of the line. */
function clock() {
  if (live.audio) return live.audio.currentTime;
  return now() - live.startedAt + live.offset;
}

/**
 * The current mouth, sampled and smoothed. Called once per animation frame.
 *
 * Returns `{ speaking, speaker, open, wide, round, press, energy }`, all
 * numbers 0..1. Safe to call when nothing is speaking — it decays to a closed
 * mouth rather than snapping shut, which is what a person's face does.
 */
export function read() {
  const target = { open: 0, wide: 0, round: 0, press: 0 };
  const wanted = {};
  let energy = 0;

  const playing = live.speaking && !(live.audio && live.audio.paused);

  if (playing) {
    const t = clock();
    const weights = sampleTrack(live.track, t, 0.05);
    const shape = shapeFor(weights);
    const measured = energyNow();

    // No analyser (browser voice, or a context that never started): trust the
    // estimate completely. With one: let measured energy scale the opening, but
    // never quite to zero — consonants are quiet and still move the lips.
    energy = measured < 0 ? 1 : 0.25 + 0.75 * measured;

    target.open = shape.open * energy;
    target.wide = shape.wide;
    target.round = shape.round;
    target.press = shape.press;

    // Gated by energy for the same reason the jaw is: through a silence every
    // weight goes to zero, and on a morph-target rig zero across the board is
    // a closed, resting mouth.
    for (const v in weights) wanted[v] = weights[v] * energy;
  }

  // Asymmetric smoothing: the mouth opens faster than it closes, which is both
  // true of real jaws and the difference between crisp and mushy on screen.
  const k = (cur, want) => {
    const rate = want > cur ? 0.45 : 0.25;
    return cur + (want - cur) * rate;
  };

  out.open = k(out.open, target.open);
  out.wide = k(out.wide, target.wide);
  out.round = k(out.round, target.round);
  out.press = k(out.press, target.press);
  out.energy = k(out.energy, energy);

  for (const v of VISEMES) outVisemes[v] = k(outVisemes[v], wanted[v] || 0);

  return {
    speaking: playing,
    speaker: live.speaking ? live.speaker : null,
    open: out.open,
    wide: out.wide,
    round: out.round,
    press: out.press,
    energy: out.energy,
    visemes: outVisemes
  };
}

/** Whether a waveform is actually being measured — the stage says so in the UI. */
export function hasAnalyser() { return !!analyser; }
