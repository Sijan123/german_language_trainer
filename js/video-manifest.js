/*
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
  "c001": { seconds: 49, lines: 12 },
  "c002": { seconds: 54.4, lines: 13 },
  "c003": { seconds: 52.87, lines: 13 },
  "c004": { seconds: 49.1, lines: 12 },
  "c005": { seconds: 51.07, lines: 13 },
  "c006": { seconds: 50.7, lines: 13 },
  "c007": { seconds: 48.33, lines: 12 },
  "c008": { seconds: 56.37, lines: 13 },
  "c009": { seconds: 48.03, lines: 12 },
  "c010": { seconds: 48.5, lines: 13 }
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
