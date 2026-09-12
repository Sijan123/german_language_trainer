/*
 * German text-to-speech, built on the browser's own SpeechSynthesis.
 *
 * This is everything that survived of the old speech module. The rest of it —
 * Whisper model loading, the microphone recorder, WAV encoding, WebGPU probing
 * and the calls to a local transcription server — went with the Sprechen mode,
 * and with it the app's last dependency on a backend. What is left needs no
 * network at all, which is why the app can be served as static files.
 *
 * A German voice has to be installed on the device for any of this to sound
 * German; if none is, the browser falls back to its default voice rather than
 * failing, so nothing here throws.
 */

let cachedVoices = [];

/**
 * Voices load asynchronously and the first call often returns an empty list,
 * so we cache them and refresh on the event the browser fires when they arrive.
 */
export function initVoices() {
  if (!("speechSynthesis" in window)) return;
  const refresh = () => { cachedVoices = window.speechSynthesis.getVoices(); };
  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;
}

function germanUtterance(text, rate) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  const german = cachedVoices.find((v) => v.lang && v.lang.startsWith("de"));
  if (german) utterance.voice = german;
  utterance.rate = rate;
  return utterance;
}

/**
 * Speak one line and call back when it has actually finished.
 *
 * `speak` below is fire-and-forget, which is fine for a single word but cannot
 * drive a dialogue: the next line has to start when this one ends, and utterance
 * length is not predictable from character count. Every failure path — no voice
 * installed, a throwing synth, a browser that never fires the event — still
 * calls back, so playback can't stall half way down a conversation.
 */
export function speakLine(text, onEnd) {
  const done = typeof onEnd === "function" ? onEnd : function () {};
  if (!("speechSynthesis" in window) || !text) { done(); return; }
  try {
    window.speechSynthesis.cancel();
    const utterance = germanUtterance(text, 0.92);   // a shade slower than single words

    let settled = false;
    const finish = () => { if (!settled) { settled = true; done(); } };
    utterance.onend = finish;
    utterance.onerror = finish;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    done();
  }
}

/** Fire-and-forget: a single word or sentence, with no callback. */
export function speak(text, enabled) {
  if (!enabled || !("speechSynthesis" in window) || !text) return;
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(germanUtterance(text, 0.95));
  } catch (e) {
    /* speech synthesis is a nice-to-have; never let it break the flow */
  }
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
