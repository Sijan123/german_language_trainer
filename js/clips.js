/*
 * Where a dialogue line's rendered audio lives, if it has any.
 *
 * The manifest says how many lines of each dialogue were rendered, so a missing
 * clip is known in advance rather than discovered through a 404. Files are
 * one-based and zero-padded to match what make-audio.py writes.
 *
 * Gespräche and Diktat both need this, which is why it is its own module.
 */

import { AUDIO } from "./audio-manifest.js";

export function clipFor(conversationId, index) {
  const entry = AUDIO[conversationId];
  if (!entry) return null;
  // A run without ffmpeg leaves WAVs, so the format is recorded per dialogue
  // rather than assumed. A bare number is accepted as an older manifest.
  const count = typeof entry === "number" ? entry : entry.n;
  const ext = typeof entry === "number" ? "mp3" : (entry.ext || "mp3");
  if (!count || index >= count) return null;
  return "audio/" + conversationId + "/" + String(index + 1).padStart(2, "0") + "." + ext;
}

/** How many lines of this dialogue were rendered — 0 if none were. */
export function clipCount(conversationId) {
  const entry = AUDIO[conversationId];
  if (!entry) return 0;
  return (typeof entry === "number" ? entry : entry.n) || 0;
}
