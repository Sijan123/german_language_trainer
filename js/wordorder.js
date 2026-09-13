/*
 * Satzbau — put a scrambled sentence back in order.
 *
 * Word order is where A2 actually breaks. Two patterns account for most of it:
 * the verb goes to the very end of a `weil` clause, and the Perfekt splits into
 * a bracket with haben/sein in second place and the participle at the end. Both
 * are already written out for all 1009 vocabulary entries, so the exercise needs
 * no new content — it takes the `nebensatz` and `perfekt` sentences apart and
 * asks you to put them back.
 *
 * Two decisions worth knowing about:
 *
 * Punctuation is stripped from the chips. Leaving the full stop on would hand
 * over the answer — in a weil-clause the last word *is* the thing being tested.
 * The comma goes for the same reason, more mildly. The finished sentence is
 * shown with its punctuation once you have answered.
 *
 * German allows more orders than one. "Ich habe heute geduscht" and "Heute habe
 * ich geduscht" are both right, and marking the second one wrong would be a lie.
 * So a sentence that differs from the target but still ends on the same word is
 * graded as a near miss with the verb credited, because final position is the
 * thing the exercise trains and the thing the variants preserve.
 */

import { VOCAB_THEMES, allWords } from "./vocab.js";
import { glossFor } from "./gloss.js";
import { escapeHtml, SPEAKER_SVG } from "./util.js";
import {
  bareWords, buildPieces, markOrder, pieceHtml, renderLevelButtons
} from "./chips.js";
import { sayOnce } from "./speech.js";
import * as srs from "./srs.js";

/* ------------------------------------------------------------------ */
/* The pool                                                            */
/* ------------------------------------------------------------------ */

/*
 * Below four chips there is nothing to arrange; above eleven it stops being a
 * word-order exercise and becomes a jigsaw.
 */
const MIN_TOKENS = 4;
const MAX_TOKENS = 11;

const ALL_WORDS = allWords(VOCAB_THEMES);

const KINDS = [
  { id: "nebensatz", name: "Nebensatz (weil)", topic: "nebensatz" },
  { id: "perfekt", name: "Perfekt", topic: "perfekt" }
];

export const ITEMS = (() => {
  const out = [];
  const seen = new Set();

  ALL_WORDS.forEach((word) => {
    KINDS.forEach((kind) => {
      const sentence = word[kind.id];
      if (!sentence || seen.has(sentence)) return;

      const target = bareWords(sentence);
      if (target.length < MIN_TOKENS || target.length > MAX_TOKENS) return;

      seen.add(sentence);
      out.push({
        kind: kind.id,
        de: sentence,
        target: target,
        word: word,
        themeId: word.themeId,
        themeName: word.themeName,
        tone: word.tone,
        en: kind.id === "nebensatz" ? glossFor(sentence, word.simple) : glossFor(sentence)
      });
    });
  });
  return out;
})();

const keyOf = (it) => "s:" + it.de;

/* ------------------------------------------------------------------ */
/* Marking                                                            */
/* ------------------------------------------------------------------ */

const TIPS = {
  nebensatz: "Im Nebensatz mit <em>weil</em> steht das konjugierte Verb ganz am Ende.",
  perfekt: "Perfekt ist eine Klammer: <em>haben</em> oder <em>sein</em> an Position zwei, das Partizip am Satzende."
};


/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

/*
 * The levels themselves live in chips.js, because the Gespräch sub-mode uses the
 * same three. What belongs here is the rule about when they reset: every
 * sentence starts at level 1 again, since the level says how much help *this*
 * sentence needed and carrying it over would quietly turn one hard sentence
 * into a permanently easier mode.
 */
const order = {
  theme: "alle",
  kind: "alle",
  level: 1,
  item: null,
  chips: [],        // { id, words, text } in bank order
  bank: [],         // chip ids still unplaced
  placed: [],       // chip ids in the answer row
  answered: false,
  usedHelp: false,  // did this sentence get solved below level 1
  recent: [],
  right: 0, near: 0, wrong: 0
};

/** Lay the pieces out for the current level. */
function buildChips() {
  order.chips = order.item ? buildPieces(order.item.target, order.level) : [];
  order.bank = order.chips.map((c) => c.id);
  order.placed = [];
}

function chipWords(id) {
  const chip = order.chips.find((c) => c.id === id);
  return chip ? chip.words : [];
}

/**
 * Change level mid-sentence.
 *
 * The answer row is cleared rather than translated: the pieces you had placed no
 * longer exist at the new level, and half-converting them would leave a row that
 * looks like your work but is not.
 */
function setLevel(level) {
  if (order.answered || !order.item) return;
  if (level === order.level) return;
  order.level = level;
  if (level > 1) order.usedHelp = true;
  buildChips();
  renderLevels();
  renderChips();
}

let deps = { getMode: () => "", getSub: () => "sentences", isSoundOn: () => true, openGrammarTopic: () => {} };
let el = {};

function pool() {
  return ITEMS.filter((it) => {
    if (order.kind !== "alle" && it.kind !== order.kind) return false;
    if (order.theme !== "alle" && it.themeId !== order.theme) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function renderKinds() {
  const counts = { alle: 0 };
  ITEMS.forEach((it) => {
    if (order.theme !== "alle" && it.themeId !== order.theme) return;
    counts.alle++;
    counts[it.kind] = (counts[it.kind] || 0) + 1;
  });

  const chips = [{ id: "alle", name: "Beide" }].concat(KINDS.map((k) => ({ id: k.id, name: k.name })));
  el.kinds.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + (counts[chip.id] || 0) + ")";
    btn.setAttribute("aria-pressed", String(order.kind === chip.id));
    btn.addEventListener("click", () => {
      order.kind = chip.id;
      order.recent = [];
      nextItem();
    });
    el.kinds.appendChild(btn);
  });
}

function renderThemes() {
  const counts = {};
  ITEMS.forEach((it) => {
    if (order.kind !== "alle" && it.kind !== order.kind) return;
    counts[it.themeId] = (counts[it.themeId] || 0) + 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const chips = [{ id: "alle", name: "Alle", tone: "var(--accent)", n: total }]
    .concat(VOCAB_THEMES.filter((t) => counts[t.id])
      .map((t) => ({ id: t.id, name: t.name, tone: t.tone, n: counts[t.id] })));

  el.themes.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + chip.n + ")";
    btn.style.setProperty("--tone", chip.tone);
    btn.setAttribute("aria-pressed", String(order.theme === chip.id));
    btn.addEventListener("click", () => {
      order.theme = chip.id;
      order.recent = [];
      nextItem();
    });
    el.themes.appendChild(btn);
  });
}

function renderStrip() {
  el.strip.innerHTML = srs.stripHtml(srs.stats(pool(), keyOf));
}

function renderSession() {
  const done = order.right + order.near + order.wrong;
  el.session.innerHTML = done
    ? '<span class="score-pill right">Richtig <b>' + order.right + '</b></span>' +
      '<span class="score-pill near">Fast <b>' + order.near + '</b></span>' +
      '<span class="score-pill wrong">Falsch <b>' + order.wrong + '</b></span>'
    : '<span class="score-pill rate">Diese Sitzung: noch nichts</span>';
}

function chipText(id) {
  const chip = order.chips.find((c) => c.id === id);
  return chip ? chip.text : "";
}

function renderLevels() {
  renderLevelButtons(el.levels, order.item ? order.item.target : null, order.level, order.answered);
}

function pieceById(id) {
  return order.chips.find((c) => c.id === id) || { id: id, words: [], text: "" };
}

function renderChips() {
  el.answer.innerHTML = order.placed.length
    ? order.placed.map((id) => pieceHtml(pieceById(id), true)).join("")
    : '<span class="wchip-empty">Tippe die Wörter der Reihe nach an.</span>';

  el.bank.innerHTML = order.bank.map((id) => pieceHtml(pieceById(id), false)).join("");

  el.check.disabled = order.bank.length > 0;
  el.clear.disabled = order.placed.length === 0;
}

function renderCard() {
  const item = order.item;

  if (!item) {
    el.prompt.textContent = "";
    el.en.textContent = "";
    el.en.hidden = true;
    el.hint.hidden = true;
    el.answer.innerHTML = "";
    el.bank.innerHTML = "";
    el.result.hidden = false;
    el.result.className = "feedback neutral";
    el.result.innerHTML = '<div class="feedback-head">Keine Sätze</div>' +
      '<div>Diese Auswahl hat keine passenden Sätze. Wähle ein anderes Thema.</div>';
    el.check.hidden = true;
    el.next.hidden = true;
    el.clear.hidden = true;
    renderLevels();
    return;
  }

  el.card.style.setProperty("--tone", item.tone);
  el.prompt.textContent = item.kind === "nebensatz" ? "Nebensatz mit weil" : "Perfekt";

  /* The English says what the sentence means, which for a short sentence is
     most of the way to the word order — so it starts hidden and costs a
     deliberate tap, the same bargain Diktat offers. Every question starts it
     folded away again. */
  el.en.textContent = item.en || "";
  el.en.hidden = true;
  el.hint.hidden = !item.en;

  el.result.hidden = true;
  el.check.hidden = false;
  el.clear.hidden = false;
  el.next.hidden = true;
  renderLevels();
  renderChips();
  renderSession();
}

/* ------------------------------------------------------------------ */
/* Playing                                                             */
/* ------------------------------------------------------------------ */

function nextItem() {
  order.answered = false;
  order.level = 1;            // every sentence starts at the hard end again
  order.usedHelp = false;
  order.item = srs.pick(pool(), keyOf, order.recent);

  if (order.item) {
    order.recent.push(keyOf(order.item));
    while (order.recent.length > 12) order.recent.shift();
  }
  buildChips();

  renderKinds();
  renderThemes();
  renderStrip();
  renderCard();
}

function placeChip(id) {
  if (order.answered) return;
  const at = order.bank.indexOf(id);
  if (at < 0) return;
  order.bank.splice(at, 1);
  order.placed.push(id);
  renderChips();
}

function takeBackChip(id) {
  if (order.answered) return;
  const at = order.placed.indexOf(id);
  if (at < 0) return;
  order.placed.splice(at, 1);
  // Back into the bank where it started, so the bank does not reshuffle itself
  // under the hand every time something is taken out of the answer.
  const home = order.chips.findIndex((c) => c.id === id);
  let insert = order.bank.length;
  for (let i = 0; i < order.bank.length; i++) {
    if (order.chips.findIndex((c) => c.id === order.bank[i]) > home) { insert = i; break; }
  }
  order.bank.splice(insert, 0, id);
  renderChips();
}

function checkAnswer() {
  if (order.answered || !order.item || order.bank.length) return;

  const item = order.item;
  // Marking works on words, never on pieces: at level 3 the same sentence is
  // three chips rather than nine words, and the verb-final test has to look at
  // the last *word* either way.
  const placedWords = order.placed.reduce((all, id) => all.concat(chipWords(id)), []);
  const marked = markOrder(placedWords, item.target);
  order.answered = true;

  /*
   * A sentence assembled out of pre-joined pieces was partly assembled for you,
   * so a right answer below level 1 holds its box rather than being promoted —
   * the same treatment a near miss gets, for the same reason. Getting it wrong
   * is getting it wrong at any level.
   */
  const helped = marked.grade === "right" && order.usedHelp;
  srs.grade(keyOf(item), helped ? "near" : marked.grade);

  if (marked.grade === "right") order.right++;
  else if (marked.grade === "near") order.near++;
  else order.wrong++;

  const tone = marked.grade === "right" ? "ok" : (marked.grade === "near" ? "neutral" : "bad");
  const verdict = marked.grade === "right" ? "Richtig."
    : marked.grade === "near" ? "Das Verb steht richtig — der Satz lautet aber so:"
    : "Nicht ganz. So lautet der Satz:";

  const topicId = item.kind === "nebensatz" ? "nebensatz" : "perfekt";

  el.result.className = "feedback " + tone;
  el.result.innerHTML =
    '<div class="feedback-head">' + escapeHtml(verdict) + '</div>' +
    '<div class="wo-answer">' +
      '<span class="correction-line">' + escapeHtml(item.de) + '</span>' +
      '<button type="button" class="speak-btn" id="wo-say" title="Vorlesen">' + SPEAKER_SVG + '</button>' +
    '</div>' +
    (item.en ? '<div class="tip-line">' + escapeHtml(item.en) + '</div>' : "") +
    (helped
      ? '<div class="wo-tip">Mit Stufe&nbsp;' + order.level +
        ' gelöst — das Fach bleibt, wo es war. Auf Stufe&nbsp;1 zählt der Satz voll.</div>'
      : "") +
    (marked.grade === "right" ? "" : '<div class="wo-tip">' + TIPS[item.kind] + '</div>') +
    '<div class="topic-chips wo-chips">' +
      '<button type="button" class="topic-chip" data-topic="' + topicId + '">Grammatik: ' +
        escapeHtml(item.kind === "nebensatz" ? "Nebensatz" : "Perfekt") + '</button>' +
      '<button type="button" class="topic-chip" data-topic="wortstellung">Wortstellung</button>' +
    '</div>' +
    '<div class="dict-src">' + escapeHtml(item.word.de) + ' · ' + escapeHtml(item.themeName) + '</div>';
  el.result.hidden = false;

  el.check.hidden = true;
  el.clear.hidden = true;
  el.next.hidden = false;
  // The feedback carries the English from here on, so the hint and its line go
  // away rather than saying the same thing twice.
  el.hint.hidden = true;
  el.en.hidden = true;
  renderLevels();
  el.next.focus();

  if (deps.isSoundOn()) sayOnce(item.de, "Shruti", true);
  renderStrip();
  renderSession();
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

export function initWordOrder(options) {
  deps = Object.assign(deps, options || {});

  const $ = (id) => document.getElementById(id);
  el = {
    strip: $("wo-strip"),
    session: $("wo-session"),
    kinds: $("wo-kinds"),
    themes: $("wo-themes"),
    card: $("wo-card"),
    prompt: $("wo-prompt"),
    hint: $("wo-hint"),
    levels: $("wo-levels"),
    en: $("wo-en"),
    answer: $("wo-answer"),
    bank: $("wo-bank"),
    check: $("wo-check"),
    clear: $("wo-clear"),
    next: $("wo-next"),
    result: $("wo-result"),
    reset: $("wo-reset")
  };

  el.answer.addEventListener("click", (event) => {
    const chip = event.target.closest(".wchip");
    if (chip) takeBackChip(Number(chip.dataset.chip));
  });

  el.bank.addEventListener("click", (event) => {
    const chip = event.target.closest(".wchip");
    if (chip) placeChip(Number(chip.dataset.chip));
  });

  el.levels.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-level]");
    if (btn) setLevel(Number(btn.dataset.level));
  });

  el.hint.addEventListener("click", () => {
    if (!order.item) return;
    el.en.hidden = false;
    el.hint.hidden = true;
  });

  el.check.addEventListener("click", checkAnswer);
  el.next.addEventListener("click", nextItem);
  el.clear.addEventListener("click", () => {
    if (order.answered) return;
    order.bank = order.chips.map((c) => c.id);
    order.placed = [];
    renderChips();
  });

  el.reset.addEventListener("click", () => {
    order.right = order.near = order.wrong = 0;
    renderSession();
  });

  el.result.addEventListener("click", (event) => {
    if (event.target.closest("#wo-say")) {
      if (order.item) sayOnce(order.item.de, "Shruti", true);
      return;
    }
    const chip = event.target.closest(".topic-chip");
    if (chip) deps.openGrammarTopic(chip.dataset.topic);
  });

  /*
   * Backspace takes the last word back, which is what you reach for when you
   * have just put the wrong one down — the same key it would be if you were
   * typing the sentence out.
   */
  document.addEventListener("keydown", (event) => {
    // Both halves of Satzbau live under one tab and both listen for Enter, so
    // each has to check which half is actually on screen.
    if (deps.getMode() !== "wordorder" || deps.getSub() !== "sentences") return;
    /* The word chips are buttons. Swallowing Enter here would stop a keyboard
       user placing a word at all, so a focused button keeps its own key. */
    if (event.target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName)) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      if (!order.answered && order.placed.length) takeBackChip(order.placed[order.placed.length - 1]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (order.answered) nextItem();
      else if (!order.bank.length) checkAnswer();
    }
  });
}

export function enterWordOrder() {
  if (!order.item) nextItem();
  else { renderKinds(); renderThemes(); renderStrip(); renderSession(); }
}
