/*
 * Diktat — hear a line from a dialogue, type what you heard.
 *
 * Why this mode exists: everything else in the app is recognition. You read the
 * German, or you pick an English meaning from four. Dictation is the only
 * exercise that tests listening, spelling, umlauts and noun capitalisation at
 * once, and it needs no new content — the 108 dialogues and their rendered
 * clips are already here.
 *
 * The marking is the interesting part. Pass/fail would be useless: "Schuhe" for
 * "schuhe" is a grammar error (German capitalises nouns), "fuer" for "für" is a
 * keyboard workaround, and a missing comma is neither. So an answer is diffed
 * word by word, the near misses are named, and only a genuinely different word
 * counts as wrong.
 */

import { CONV_TOPICS, CONVERSATIONS } from "./conversations.js";
import { clipFor } from "./clips.js";
import {
  escapeHtml, SPEAKER_SVG, normaliseTyped,
  foldAll, foldCase, foldUmlaut, foldPunct
} from "./util.js";
import { sayLine, stopSpeaking } from "./speech.js";
import * as srs from "./srs.js";

/* ------------------------------------------------------------------ */
/* The pool                                                            */
/* ------------------------------------------------------------------ */

/*
 * Not every line makes a dictation. "Ja, gern." teaches nothing and a
 * twenty-word line is a memory test rather than a listening one — by the time
 * you have typed the first half you have forgotten the second. Between four and
 * sixteen words is what you can hold in your head after one or two plays.
 */
const MIN_CHARS = 14;
const MAX_CHARS = 95;
const MAX_WORDS = 16;
const MIN_WORDS = 4;

export const ITEMS = (() => {
  const out = [];
  CONVERSATIONS.forEach((c) => {
    c.lines.forEach((line, i) => {
      const de = line.de.trim();
      const words = de.split(/\s+/).length;
      if (de.length < MIN_CHARS || de.length > MAX_CHARS) return;
      if (words < MIN_WORDS || words > MAX_WORDS) return;
      out.push({
        cid: c.id, topic: c.topic, title: c.title, i: i,
        de: de, en: line.en, s: line.s, clip: clipFor(c.id, i)
      });
    });
  });
  return out;
})();

const RECORDED = ITEMS.filter((it) => it.clip);

const keyOf = (it) => "d:" + it.cid + ":" + it.i;

/* ------------------------------------------------------------------ */
/* Marking                                                             */
/* ------------------------------------------------------------------ */

/**
 * Which kinds of difference separate two words that are otherwise the same
 * word.
 *
 * Each test folds away everything *except* the dimension being tested: if two
 * words still differ once case is the only thing left un-folded, then case is
 * one of the differences. That reports a word wrong in two ways as wrong in two
 * ways, which a chain of else-ifs would not.
 */
function mismatchKinds(got, want) {
  if (got === want) return [];
  const kinds = [];
  if (foldPunct(foldUmlaut(got)) !== foldPunct(foldUmlaut(want))) kinds.push("case");
  if (foldPunct(foldCase(got)) !== foldPunct(foldCase(want))) kinds.push("umlaut");
  if (foldUmlaut(foldCase(got)) !== foldUmlaut(foldCase(want))) kinds.push("punct");
  return kinds.length ? kinds : ["spelling"];
}

const KIND_LABEL = {
  case: "Groß- und Kleinschreibung",
  umlaut: "Umlaute und ß",
  punct: "Zeichensetzung",
  spelling: "Schreibweise"
};

/**
 * Line up what was typed against what was said.
 *
 * A plain position-by-position comparison is no good: drop one word early on and
 * every word after it reads as wrong, which buries the one real mistake in
 * fifteen false ones. So the two word lists are aligned on their longest common
 * subsequence first, and only then compared — a missing word then shows up as
 * exactly one missing word.
 *
 * The alignment matches on the loosest fold, so "fuer" still lines up with
 * "für" and is reported as a near miss rather than as one deletion plus one
 * insertion.
 */
function alignWords(got, want) {
  const n = got.length, m = want.length;
  const eq = (a, b) => foldAll(a) === foldAll(b);

  const table = [];
  for (let i = 0; i <= n; i++) table.push(new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = eq(got[i], want[j])
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (eq(got[i], want[j])) { ops.push({ t: "same", got: got[i], want: want[j] }); i++; j++; }
    else if (table[i + 1][j] >= table[i][j + 1]) { ops.push({ t: "extra", got: got[i] }); i++; }
    else { ops.push({ t: "missing", want: want[j] }); j++; }
  }
  while (i < n) ops.push({ t: "extra", got: got[i++] });
  while (j < m) ops.push({ t: "missing", want: want[j++] });
  return ops;
}

/**
 * Mark one answer: the aligned words, an overall grade, and — when the answer
 * was only nearly right — what kind of nearly.
 */
export function markDictation(typed, target) {
  const got = normaliseTyped(typed);
  const want = normaliseTyped(target);
  if (!got) {
    return { grade: "wrong", empty: true, ops: [], kinds: [] };
  }

  const ops = alignWords(got.split(" "), want.split(" "));
  const kinds = new Set();
  let broken = false;

  ops.forEach((op) => {
    if (op.t !== "same") { broken = true; return; }
    op.kinds = mismatchKinds(op.got, op.want);
    op.kinds.forEach((k) => kinds.add(k));
  });

  const grade = broken ? "wrong" : (kinds.size ? "near" : "right");
  return { grade: grade, empty: false, ops: ops, kinds: Array.from(kinds) };
}

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const dict = {
  topic: "alle",
  recordedOnly: false,
  item: null,
  plays: 0,
  playing: false,
  answered: false,
  recent: [],
  right: 0, near: 0, wrong: 0
};

let deps = { getMode: () => "", isSoundOn: () => true };
let el = {};

function pool() {
  const base = dict.recordedOnly ? RECORDED : ITEMS;
  return dict.topic === "alle" ? base : base.filter((it) => it.topic === dict.topic);
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function topicName(id) {
  const t = CONV_TOPICS.find((x) => x.id === id);
  return t ? t.name : id;
}

function topicTone(id) {
  const t = CONV_TOPICS.find((x) => x.id === id);
  return t ? t.tone : "var(--accent)";
}

function renderTopics() {
  const base = dict.recordedOnly ? RECORDED : ITEMS;
  const counts = {};
  base.forEach((it) => { counts[it.topic] = (counts[it.topic] || 0) + 1; });

  const chips = [{ id: "alle", name: "Alle", tone: "var(--accent)", n: base.length }]
    .concat(CONV_TOPICS.filter((t) => counts[t.id])
      .map((t) => ({ id: t.id, name: t.name, tone: t.tone, n: counts[t.id] })));

  el.topics.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + chip.n + ")";
    btn.style.setProperty("--tone", chip.tone);
    btn.setAttribute("aria-pressed", String(dict.topic === chip.id));
    btn.addEventListener("click", () => {
      dict.topic = chip.id;
      dict.recent = [];
      nextItem();
    });
    el.topics.appendChild(btn);
  });
}

function renderStrip() {
  el.strip.innerHTML = srs.stripHtml(srs.stats(pool(), keyOf));
}

function renderSession() {
  const done = dict.right + dict.near + dict.wrong;
  el.session.innerHTML = done
    ? '<span class="score-pill right">Richtig <b>' + dict.right + '</b></span>' +
      '<span class="score-pill near">Fast <b>' + dict.near + '</b></span>' +
      '<span class="score-pill wrong">Falsch <b>' + dict.wrong + '</b></span>'
    : '<span class="score-pill rate">Diese Sitzung: noch nichts</span>';
}

function renderPlays() {
  el.plays.textContent = dict.plays === 0 ? ""
    : dict.plays + "× gehört";
}

/**
 * The answer as typed, and the line as it was said, word by word.
 *
 * Both rows are shown even when the answer was right, because seeing the line
 * written out is half of what makes dictation stick.
 */
function opsHtml(ops, side) {
  return ops.map((op) => {
    if (op.t === "same") {
      const word = side === "got" ? op.got : op.want;
      const near = op.kinds && op.kinds.length;
      const title = near ? ' title="' + escapeHtml(op.kinds.map((k) => KIND_LABEL[k]).join(", ")) + '"' : "";
      return '<span class="dw' + (near ? " near" : "") + '"' + title + '>' + escapeHtml(word) + '</span>';
    }
    if (op.t === "extra") {
      return side === "got"
        ? '<span class="dw bad" title="steht nicht im Satz">' + escapeHtml(op.got) + '</span>'
        : "";
    }
    // missing
    return side === "got"
      ? '<span class="dw gap" title="hier fehlt ein Wort">···</span>'
      : '<span class="dw add" title="das hat gefehlt">' + escapeHtml(op.want) + '</span>';
  }).join(" ");
}

function renderCard() {
  const item = dict.item;

  if (!item) {
    el.source.textContent = "";
    el.play.disabled = true;
    el.input.disabled = true;
    el.result.hidden = false;
    el.result.className = "feedback neutral";
    el.result.innerHTML = '<div class="feedback-head">Keine Sätze</div>' +
      '<div>Dieses Thema hat keine passenden Sätze. Wähle ein anderes' +
      (dict.recordedOnly ? ' oder schalte „nur Aufnahmen“ aus' : '') + '.</div>';
    el.check.hidden = true;
    el.next.hidden = true;
    el.skip.hidden = true;
    el.hint.hidden = true;
    return;
  }

  el.play.disabled = false;
  el.input.disabled = false;
  el.source.textContent = topicName(item.topic);
  el.source.style.setProperty("--tone", topicTone(item.topic));
  el.card.style.setProperty("--tone", topicTone(item.topic));
  el.en.hidden = true;
  el.en.textContent = "";
  el.hint.hidden = false;
  el.result.hidden = true;
  el.check.hidden = false;
  el.skip.hidden = false;
  el.next.hidden = true;
  el.input.value = "";
  renderPlays();
  renderSession();
}

/* ------------------------------------------------------------------ */
/* Playing                                                             */
/* ------------------------------------------------------------------ */

function playItem() {
  if (!dict.item || dict.playing) return;
  if (!deps.isSoundOn()) {
    el.plays.textContent = "Ton ist aus";
    return;
  }
  stopSpeaking();
  dict.playing = true;
  dict.plays++;
  el.play.dataset.state = "playing";
  el.play.textContent = "♪  Läuft …";
  renderPlays();

  sayLine({ de: dict.item.de, s: dict.item.s, clip: dict.item.clip }, () => {
    dict.playing = false;
    el.play.dataset.state = "idle";
    el.play.textContent = dict.plays ? "▶  Nochmal" : "▶  Anhören";
  });
}

/* ------------------------------------------------------------------ */
/* Asking and answering                                                */
/* ------------------------------------------------------------------ */

function nextItem() {
  stopSpeaking();
  dict.playing = false;
  dict.answered = false;
  dict.plays = 0;
  dict.item = srs.pick(pool(), keyOf, dict.recent);

  if (dict.item) {
    dict.recent.push(keyOf(dict.item));
    while (dict.recent.length > 12) dict.recent.shift();
  }

  renderTopics();
  renderStrip();
  renderCard();
  el.play.dataset.state = "idle";
  el.play.textContent = "▶  Anhören";

  if (dict.item) {
    playItem();
    el.input.focus();
  }
}

function checkAnswer() {
  if (dict.answered || !dict.item) return;

  const marked = markDictation(el.input.value, dict.item.de);
  dict.answered = true;

  srs.grade(keyOf(dict.item), marked.grade);
  if (marked.grade === "right") dict.right++;
  else if (marked.grade === "near") dict.near++;
  else dict.wrong++;

  const tone = marked.grade === "right" ? "ok" : (marked.grade === "near" ? "neutral" : "bad");
  const verdict = marked.grade === "right" ? "Richtig."
    : marked.grade === "near" ? "Fast — nur die Schreibung."
    : (marked.empty ? "Nichts geschrieben." : "Nicht ganz.");

  const kindTags = marked.kinds.length
    ? marked.kinds.map((k) => '<span class="feedback-type">' + escapeHtml(KIND_LABEL[k]) + '</span>').join("")
    : "";

  const yours = marked.empty
    ? ""
    : '<div class="dict-row"><span class="dict-row-label">Du</span>' +
      '<span class="dict-row-text">' + opsHtml(marked.ops, "got") + '</span></div>';

  el.result.className = "feedback " + tone;
  el.result.innerHTML =
    '<div class="feedback-head">' + escapeHtml(verdict) + kindTags + '</div>' +
    yours +
    '<div class="dict-row"><span class="dict-row-label">Gesagt</span>' +
      '<span class="dict-row-text">' +
        (marked.empty ? escapeHtml(dict.item.de) : opsHtml(marked.ops, "want")) +
      '</span>' +
      '<button type="button" class="speak-btn" id="dict-replay" title="Noch einmal hören">' + SPEAKER_SVG + '</button>' +
    '</div>' +
    '<div class="dict-row"><span class="dict-row-label">Englisch</span>' +
      '<span class="dict-row-text gloss-always">' + escapeHtml(dict.item.en) + '</span></div>' +
    '<div class="dict-src">' + escapeHtml(dict.item.s) + ' · ' + escapeHtml(dict.item.title) +
      (dict.item.clip ? ' · Aufnahme' : ' · Browserstimme') + '</div>';
  el.result.hidden = false;

  el.check.hidden = true;
  el.skip.hidden = true;
  el.next.hidden = false;
  el.next.focus();
  renderStrip();
  renderSession();
}

/** Give up on this one. It counts as wrong — not knowing it is the same event. */
function skipItem() {
  if (dict.answered || !dict.item) return;
  el.input.value = "";
  checkAnswer();
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

export function initDictation(options) {
  deps = Object.assign(deps, options || {});

  const $ = (id) => document.getElementById(id);
  el = {
    strip: $("dict-strip"),
    session: $("dict-session"),
    topics: $("dict-topics"),
    recorded: $("dict-recorded"),
    card: $("dict-card"),
    source: $("dict-source"),
    play: $("dict-play"),
    plays: $("dict-plays"),
    hint: $("dict-hint"),
    en: $("dict-en"),
    input: $("dict-input"),
    check: $("dict-check"),
    skip: $("dict-skip"),
    next: $("dict-next"),
    result: $("dict-result"),
    reset: $("dict-reset")
  };

  el.recorded.textContent = "Nur Aufnahmen (" + RECORDED.length + ")";
  el.recorded.addEventListener("click", () => {
    dict.recordedOnly = !dict.recordedOnly;
    el.recorded.dataset.on = String(dict.recordedOnly);
    el.recorded.setAttribute("aria-pressed", String(dict.recordedOnly));
    dict.recent = [];
    nextItem();
  });

  el.play.addEventListener("click", playItem);
  el.check.addEventListener("click", checkAnswer);
  el.skip.addEventListener("click", skipItem);
  el.next.addEventListener("click", nextItem);

  /* The translation is a real hint, so it costs a deliberate tap rather than
     riding along with the global English switch. */
  el.hint.addEventListener("click", () => {
    if (!dict.item) return;
    el.en.textContent = dict.item.en;
    el.en.hidden = false;
    el.hint.hidden = true;
  });

  el.result.addEventListener("click", (event) => {
    if (event.target.closest("#dict-replay")) playItem();
  });

  el.reset.addEventListener("click", () => {
    dict.right = dict.near = dict.wrong = 0;
    renderSession();
  });

  /*
   * Enter is the only shortcut that can live inside the textarea — everything
   * else you might press is a letter someone is trying to type. Alt+R replays,
   * because reaching for the mouse mid-sentence is exactly what loses you the
   * second half of the line.
   */
  el.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (dict.answered) nextItem(); else checkAnswer();
    } else if (event.altKey && (event.key === "r" || event.key === "R")) {
      event.preventDefault();
      playItem();
    }
  });

  /* BUTTON is excluded along with the fields: once an answer is in, focus sits
     on "Weiter", and a shortcut that swallowed Enter there would stop the
     button doing the one thing it is for. */
  document.addEventListener("keydown", (event) => {
    if (deps.getMode() !== "dictation") return;
    if (event.target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName)) return;

    if (event.key === "Enter" && dict.answered) { event.preventDefault(); nextItem(); }
    else if (event.altKey && (event.key === "r" || event.key === "R")) { event.preventDefault(); playItem(); }
  });
}

export function enterDictation() {
  if (!dict.item) nextItem();
  else { renderTopics(); renderStrip(); renderSession(); }
}

export function leaveDictation() {
  stopSpeaking();
  dict.playing = false;
  if (el.play) { el.play.dataset.state = "idle"; el.play.textContent = dict.plays ? "▶  Nochmal" : "▶  Anhören"; }
}
