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
  "c001": { seconds: 68.05, lines: 12 },
  "c002": { seconds: 63.74, lines: 13 },
  "c003": { seconds: 52.87, lines: 13 },
  "c004": { seconds: 49.1, lines: 12 },
  "c005": { seconds: 51.07, lines: 13 },
  "c006": { seconds: 50.7, lines: 13 },
  "c007": { seconds: 48.33, lines: 12 },
  "c008": { seconds: 56.37, lines: 13 },
  "c009": { seconds: 48.03, lines: 12 },
  "c010": { seconds: 78.29, lines: 13 },
  "c011": { seconds: 44.87, lines: 12 },
  "c012": { seconds: 45.1, lines: 12 },
  "c013": { seconds: 44.4, lines: 12 },
  "c014": { seconds: 49.57, lines: 13 },
  "c015": { seconds: 50.13, lines: 13 },
  "c016": { seconds: 47.2, lines: 12 },
  "c017": { seconds: 47.67, lines: 13 },
  "c018": { seconds: 78.78, lines: 13 },
  "c019": { seconds: 43.57, lines: 12 },
  "c020": { seconds: 46.1, lines: 13 },
  "c021": { seconds: 45.87, lines: 12 },
  "c022": { seconds: 46.3, lines: 12 },
  "c023": { seconds: 47.53, lines: 13 },
  "c024": { seconds: 47.23, lines: 12 },
  "c025": { seconds: 46.77, lines: 13 },
  "c026": { seconds: 45.73, lines: 13 },
  "c027": { seconds: 43.73, lines: 12 },
  "c028": { seconds: 45.43, lines: 12 },
  "c029": { seconds: 47.07, lines: 12 },
  "c030": { seconds: 48.27, lines: 13 },
  "c031": { seconds: 48.83, lines: 13 },
  "c032": { seconds: 52.07, lines: 13 },
  "c033": { seconds: 48.93, lines: 13 }
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
