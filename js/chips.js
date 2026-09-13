/*
 * Taking a sentence apart into pieces, and judging it once it has been put back
 * together.
 *
 * Satzbau does this to a vocabulary sentence and the Gespräch sub-mode does it
 * to one speaker's lines in a dialogue. Same mechanic, same three levels, same
 * marking — so it lives here rather than twice over.
 */

import { shuffle, escapeHtml } from "./util.js";

/*
 * Three levels, and they work by gluing the answer back together rather than by
 * changing the sentence.
 *
 * Level 1 shuffles every word on its own. Level 2 hands you the words already in
 * correct pairs, level 3 in correct threes — fewer pieces, and each piece
 * carries a bit of the order you were being asked for. So the ladder runs from
 * hard to helped, which is the direction you actually climb it: you start at the
 * top, and if the sentence will not come you take a rung down.
 */
export const LEVELS = [
  { n: 1, name: "Wort für Wort" },
  { n: 2, name: "Zweiergruppen" },
  { n: 3, name: "Dreiergruppen" }
];

/*
 * Pieces carry no punctuation. Leaving the full stop on would hand over the
 * answer — in a weil-clause the last word *is* the thing being tested — and the
 * comma marks the clause boundary for the same reason, more mildly. The
 * finished sentence is shown with all of it once you have answered.
 */
const PUNCT = /[.,!?;:„“”»«…]/g;

export function bareWords(sentence) {
  return String(sentence || "")
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(PUNCT, ""))
    .filter(Boolean);          // a token that was nothing but punctuation is no piece
}

/** The sentence cut into runs of `size` adjacent words, left to right. */
export function chunkWords(words, size) {
  const out = [];
  const step = Math.max(1, size);
  for (let i = 0; i < words.length; i += step) out.push(words.slice(i, i + step));
  return out;
}

/** How many pieces a level leaves you with — shown on the level buttons. */
export function pieceCount(target, level) {
  return chunkWords(target, level).length;
}

/**
 * Lay the pieces out for a level.
 *
 * Ids are the piece's position in the *correct* order, assigned before the
 * shuffle, so restoring the bank to its original arrangement stays simple.
 */
export function buildPieces(target, level) {
  return shuffle(chunkWords(target, level)
    .map((words, i) => ({ id: i, words: words, text: words.join(" ") })));
}

/**
 * Judge an assembled sentence.
 *
 * German allows more orders than one. "Ich habe heute geduscht" and "Heute habe
 * ich geduscht" are both right, and marking the second one wrong would be a lie.
 * So a sentence that differs from the target but still ends on the same word is
 * a near miss with the verb credited — final position is the thing the exercise
 * trains and the thing the legitimate variants preserve.
 *
 * Marking always works on words, never on pieces: at level 3 the same sentence
 * is three pieces rather than nine words, and the verb-final test has to look at
 * the last *word* either way.
 */
export function markOrder(placedWords, target) {
  const got = placedWords.join(" ");
  const want = target.join(" ");
  if (got === want) return { grade: "right", verbPlaced: true };

  const verbPlaced = placedWords.length === target.length &&
    placedWords[placedWords.length - 1] === target[target.length - 1];

  return { grade: verbPlaced ? "near" : "wrong", verbPlaced: verbPlaced };
}

/*
 * A piece knows how many words it holds, so a pre-joined one can be marked as
 * what it is. Seeing which pieces came glued together is the difference between
 * "I built this sentence" and "I built most of this sentence", and the learner
 * should be the one who knows which.
 */
export function pieceHtml(piece, placed) {
  return '<button type="button" class="wchip' + (placed ? " placed" : "") + '"' +
    ' data-chip="' + piece.id + '" data-words="' + piece.words.length + '">' +
    escapeHtml(piece.text) + '</button>';
}

/**
 * The level buttons, each carrying how many pieces it leaves.
 *
 * The count is the honest version of "easier": you can see nine words become
 * five pieces become three, and decide whether you want that much help before
 * you take it.
 */
export function renderLevelButtons(container, target, level, disabled) {
  if (!container) return;
  container.innerHTML = "";
  LEVELS.forEach((lv) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.level = String(lv.n);
    btn.textContent = lv.n + " · " + lv.name + " (" + (target ? pieceCount(target, lv.n) : 0) + ")";
    btn.setAttribute("aria-pressed", String(level === lv.n));
    btn.disabled = !!disabled || !target;
    container.appendChild(btn);
  });
}
