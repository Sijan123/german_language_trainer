/*
 * Making a line audible — a recorded clip if one exists, the browser's own
 * voice otherwise.
 *
 * Two things matter here that a naive `speechSynthesis.speak()` gets wrong.
 *
 * First, a dialogue needs *two* voices. Reading both halves of a conversation
 * in one voice is the main reason synthesised dialogue sounds flat, and it also
 * makes it harder to follow who is speaking. We pick a female voice for Shruti
 * and a male one for Sijan from whatever the device has installed, and fall
 * back to pitch separation when there is only one German voice to work with.
 *
 * Second, playback has to report when it has actually finished, because the
 * next line starts then — a timer guessed from sentence length drifts badly.
 * Every failure path still fires the callback, so nothing can strand playback
 * half way down a conversation.
 */

/* ------------------------------------------------------------------ */
/* Voice selection                                                     */
/* ------------------------------------------------------------------ */

/*
 * Voice names are the only clue a browser gives about who is speaking — there
 * is no gender field in the Web Speech API. These are the German voices that
 * actually ship on Windows, macOS, iOS, Android and Chrome, plus the Piper
 * speaker names, so the same hints work if the clips are ever replaced.
 */
const FEMALE_HINTS = [
  "katja", "hedda", "anna", "helena", "petra", "marlene", "vicki", "steffi",
  "eva", "kerstin", "ramona", "female", "weiblich", "frau"
];
const MALE_HINTS = [
  "stefan", "markus", "yannick", "viktor", "conrad", "killian", "bernd",
  "thorsten", "karlsson", "pavoque", "male", "männlich", "mann"
];

let cachedVoices = [];
let picked = { Shruti: null, Sijan: null, pitchSplit: false };

function germanVoices() {
  return cachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("de"));
}

function matches(voice, hints) {
  const name = (voice.name || "").toLowerCase();
  return hints.some((h) => name.indexOf(h) >= 0);
}

/**
 * Assign one voice per speaker.
 *
 * The order matters: a name that clearly reads female or male is trusted first,
 * then anything still unassigned fills the gap, and only if the device has a
 * single German voice do we fall back to pitch. Pitch alone is a poor imitation
 * of a second speaker, so it is the last resort rather than the default.
 */
function pickVoices() {
  const voices = germanVoices();
  picked = { Shruti: null, Sijan: null, pitchSplit: false };
  if (!voices.length) return;

  picked.Shruti = voices.find((v) => matches(v, FEMALE_HINTS)) || null;
  picked.Sijan = voices.find((v) => matches(v, MALE_HINTS) && v !== picked.Shruti) || null;

  const spare = voices.filter((v) => v !== picked.Shruti && v !== picked.Sijan);
  if (!picked.Shruti) picked.Shruti = spare.shift() || voices[0];
  if (!picked.Sijan) picked.Sijan = spare.shift() || null;

  if (!picked.Sijan || picked.Sijan === picked.Shruti) {
    picked.Sijan = picked.Shruti;
    picked.pitchSplit = true;      // one voice for both — separate them by pitch
  }
}

export function initVoices() {
  if (!("speechSynthesis" in window)) return;
  const refresh = () => {
    cachedVoices = window.speechSynthesis.getVoices();
    pickVoices();
  };
  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;   // voices arrive late in Chrome
}

/** What the UI shows, so a bad-sounding voice is at least identifiable. */
export function voiceLabels() {
  const short = (v) => (v ? v.name.replace(/^(Microsoft|Google|Apple)\s+/i, "").split(/[\s(]/)[0] : null);
  if (!picked.Shruti) return null;
  if (picked.pitchSplit) return short(picked.Shruti) + " (eine Stimme)";
  return short(picked.Shruti) + " · " + short(picked.Sijan);
}

/* ------------------------------------------------------------------ */
/* Speaking                                                            */
/* ------------------------------------------------------------------ */

/*
 * Slower than the browser's default, because this is listening practice at A2.
 * Rate 1.0 is conversational German, which is too fast to follow when you are
 * still parsing word by word. The rendered clips use the matching length_scale
 * in make-audio.py, so both paths sound about the same pace.
 */
const LINE_RATE = 0.82;
const WORD_RATE = 0.88;

function utteranceFor(text, speaker, rate) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  const voice = picked[speaker] || picked.Shruti;
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  if (picked.pitchSplit) utterance.pitch = speaker === "Sijan" ? 0.75 : 1.2;
  return utterance;
}

/* One element, reused. Creating an Audio per line leaks them on long dialogues. */
let clipPlayer = null;

function player() {
  if (!clipPlayer) clipPlayer = new Audio();
  return clipPlayer;
}

/**
 * Say one line and call back when it is done.
 *
 * `line.clip` is a URL to a rendered audio file. When one exists it wins — it is
 * a real neural voice rather than whatever the operating system ships. If it
 * fails to load for any reason, we fall through to the browser voice rather than
 * leaving a silent gap.
 */
export function sayLine(line, onEnd) {
  const done = typeof onEnd === "function" ? onEnd : function () {};
  if (!line || !line.de) { done(); return; }

  if (line.clip) {
    const audio = player();
    let settled = false;
    const finish = () => { if (!settled) { settled = true; done(); } };
    const fallBack = () => {
      if (settled) return;
      settled = true;
      speakWithBrowser(line.de, line.s, done);      // clip missing or unplayable
    };
    audio.onended = finish;
    audio.onerror = fallBack;
    audio.src = line.clip;
    const started = audio.play();
    if (started && typeof started.catch === "function") started.catch(fallBack);
    return;
  }

  speakWithBrowser(line.de, line.s, done);
}

function speakWithBrowser(text, speaker, done) {
  if (!("speechSynthesis" in window)) { done(); return; }
  try {
    window.speechSynthesis.cancel();
    const utterance = utteranceFor(text, speaker, LINE_RATE);

    let settled = false;
    const finish = () => { if (!settled) { settled = true; done(); } };
    utterance.onend = finish;
    utterance.onerror = finish;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    done();
  }
}

/** Fire and forget: one word or sentence, no callback. Used by the speak buttons. */
export function sayOnce(text, speaker, enabled) {
  if (enabled === false || !text) return;
  stopSpeaking();
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.speak(utteranceFor(text, speaker || "Shruti", WORD_RATE));
  } catch (e) {
    /* speech synthesis is a nice-to-have; never let it break the flow */
  }
}

/** Same, but prefers a recorded clip when the line has one. */
export function sayLineOnce(line) {
  stopSpeaking();
  sayLine(line, null);
}

/**
 * Hold the current line where it is.
 *
 * Returns whether the pause is *exact* — whether continuing will pick up mid
 * sentence rather than starting the line again.
 *
 * A rendered clip pauses exactly: the element keeps its position and its `ended`
 * handler, so resuming finishes the line and the normal callback still fires.
 * The browser voice does not. `speechSynthesis.pause()` is a long-standing mess
 * — it is ignored on several Android builds, resumes at the wrong word on
 * others, and Chrome has shipped versions where a paused utterance can never be
 * resumed at all. Cancelling and speaking the line again from the top is one
 * repeated sentence, which for listening practice is no loss.
 */
export function pauseSpeaking() {
  if (clipPlayer && clipPlayer.src && !clipPlayer.paused && !clipPlayer.ended) {
    clipPlayer.pause();
    return true;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  return false;
}

/** Continue a clip paused by pauseSpeaking(). False if there is nothing to continue. */
export function resumeClip() {
  if (!clipPlayer || !clipPlayer.src || clipPlayer.ended) return false;
  const started = clipPlayer.play();
  if (started && typeof started.catch === "function") started.catch(() => {});
  return true;
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (clipPlayer) {
    clipPlayer.onended = null;
    clipPlayer.onerror = null;
    clipPlayer.pause();
    try { clipPlayer.currentTime = 0; } catch (e) { /* not always seekable */ }
  }
}
