/*
 * The handful of helpers every mode needs.
 *
 * They lived in app.js while there were four modes and one file. Diktat and
 * Satzbau are separate modules, and two modules importing from app.js — which
 * imports them — is a cycle. So the shared parts moved down here instead.
 */

export function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

export function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const SPEAKER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>' +
  '<path d="M15.5 8.5a5 5 0 0 1 0 7"></path></svg>';

/*
 * German spelling, folded three ways.
 *
 * Each fold is separate on purpose: Diktat has to tell a learner *which* kind
 * of mistake they made, and "für -> fuer" (a keyboard workaround), "Schuhe ->
 * schuhe" (a real grammar error, nouns are capitalised) and "Schuhe, -> Schuhe"
 * (a missing comma) are three different lessons.
 */
export function foldCase(s) {
  return s.toLowerCase();
}

export function foldUmlaut(s) {
  return s
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss");
}

export function foldPunct(s) {
  return s.replace(/[.,!?;:…„“”‚‘’"'»«\-–—]/g, "");
}

/** Everything folded at once — the loosest match Diktat will still call "nearly". */
export function foldAll(s) {
  return foldPunct(foldUmlaut(foldCase(s)));
}

/*
 * Typed text is never quite what the data holds: phone keyboards produce curly
 * quotes and en dashes, and a stray double space is not a spelling mistake.
 */
export function normaliseTyped(s) {
  return String(s == null ? "" : s)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
