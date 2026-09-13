/*
 * Which dialogues have rendered audio, how many lines, and in what format.
 *
 * The app checks this before building a clip URL, so a dialogue without audio
 * never fires a 404 - it just uses the browser voice. Written by make-audio.py;
 * edit that, not this.
 *
 * audio/<id>/01.<ext>, 02.<ext> ...
 */

export const AUDIO = {
  "c001": { n: 12, ext: "wav" },
  "c002": { n: 13, ext: "wav" },
  "c003": { n: 13, ext: "wav" },
  "c004": { n: 12, ext: "wav" },
  "c005": { n: 13, ext: "wav" },
  "c006": { n: 13, ext: "wav" },
  "c007": { n: 12, ext: "wav" },
  "c008": { n: 13, ext: "wav" },
  "c009": { n: 12, ext: "wav" },
  "c010": { n: 13, ext: "wav" },
  "c011": { n: 12, ext: "wav" },
  "c012": { n: 12, ext: "wav" },
  "c013": { n: 12, ext: "wav" },
  "c014": { n: 13, ext: "wav" },
  "c015": { n: 13, ext: "wav" },
  "c016": { n: 12, ext: "wav" },
  "c017": { n: 13, ext: "wav" },
  "c018": { n: 13, ext: "wav" },
  "c019": { n: 12, ext: "wav" },
  "c020": { n: 13, ext: "wav" }
};
