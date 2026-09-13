/*
 * Satzbau · Gespräch — hold up one side of a real conversation.
 *
 * You pick a dialogue and a person to be. Their partner's lines arrive spoken,
 * the way they do in Gespräche; when your turn comes, your line is on the table
 * in pieces and you have to build it before the conversation can go on.
 *
 * Why this is worth having on top of the single-sentence drill: a sentence with
 * no context is a puzzle, and you solve it by looking at the words. A sentence
 * that has to answer the question you just heard is a reply, and you build it by
 * working out what you would say — which is the thing that is actually hard at
 * A2 and the thing no amount of isolated word order teaches. It also means the
 * same grammar comes round in the register people really use it in.
 *
 * The pieces, the three levels and the marking are the same as the single-
 * sentence drill; they live in chips.js and are shared rather than copied.
 */

import { CONV_TOPICS, CONVERSATIONS } from "./conversations.js";
import { clipFor } from "./clips.js";
import { avatarFor, SPEAKERS } from "./avatars.js";
import { escapeHtml, SPEAKER_SVG } from "./util.js";
import {
  bareWords, buildPieces, markOrder, pieceHtml, renderLevelButtons
} from "./chips.js";
import { sayLine, stopSpeaking } from "./speech.js";
import * as srs from "./srs.js";

/* ------------------------------------------------------------------ */
/* The pool                                                            */
/* ------------------------------------------------------------------ */

/*
 * Every line of every dialogue, with its words already pulled out. A dialogue is
 * a fixed script, so unlike the sentence drill nothing can be filtered out for
 * being too short or too long — a two-word "Ja, gern" is part of the
 * conversation and skipping it would leave a hole in the exchange. Short lines
 * are trivial to build, which is fine: they are the beat between the hard ones.
 */
const LINES = (() => {
  const out = {};
  CONVERSATIONS.forEach((c) => {
    out[c.id] = c.lines.map((line, i) => ({
      i: i,
      s: line.s,
      de: line.de,
      en: line.en,
      target: bareWords(line.de),
      clip: clipFor(c.id, i)
    }));
  });
  return out;
})();

/** One record per line you personally build, kept apart from every other mode. */
const keyOf = (convId, index) => "c:" + convId + ":" + index;

/** Every line the chosen role would have to build, across all dialogues. */
function rolePool(role) {
  const out = [];
  CONVERSATIONS.forEach((c) => {
    LINES[c.id].forEach((line) => {
      if (line.s === role) out.push({ cid: c.id, i: line.i });
    });
  });
  return out;
}

const poolKey = (it) => keyOf(it.cid, it.i);

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const dlg = {
  topic: "alle",
  role: "Shruti",
  conv: null,
  index: 0,          // the line we are standing on
  level: 1,
  usedHelp: false,
  pieces: [],
  bank: [],
  placed: [],
  answered: false,
  done: false,
  right: 0, near: 0, wrong: 0
};

let deps = { getMode: () => "", getSub: () => "", isSoundOn: () => true };
let el = {};

function lines() {
  return dlg.conv ? LINES[dlg.conv.id] : [];
}

function currentLine() {
  const all = lines();
  return dlg.index < all.length ? all[dlg.index] : null;
}

/* ------------------------------------------------------------------ */
/* Setup screen                                                        */
/* ------------------------------------------------------------------ */

function topicById(id) {
  return CONV_TOPICS.find((t) => t.id === id) || { name: id, tone: "var(--accent)" };
}

/**
 * How many lines each role has to build in a given dialogue.
 *
 * Worth showing on the card: the two roles are not always an even split, and
 * "7 Sätze" versus "6 Sätze" is the difference between the two buttons meaning
 * something and being decoration.
 */
function turnsFor(conv, role) {
  return LINES[conv.id].filter((l) => l.s === role).length;
}

function renderRoles() {
  el.roles.innerHTML = SPEAKERS.map((name) =>
    '<button type="button" class="dlg-role" data-role="' + escapeHtml(name) + '"' +
      ' aria-pressed="' + String(dlg.role === name) + '" data-who="' + escapeHtml(name) + '">' +
      avatarFor(name) +
      '<span class="dlg-role-name">' + escapeHtml(name) + '</span>' +
      '<span class="dlg-role-note">Du antwortest als ' + escapeHtml(name) + '</span>' +
    '</button>').join("");
}

function renderTopics() {
  const counts = {};
  CONVERSATIONS.forEach((c) => { counts[c.topic] = (counts[c.topic] || 0) + 1; });
  const chips = [{ id: "alle", name: "Alle", tone: "var(--accent)", n: CONVERSATIONS.length }]
    .concat(CONV_TOPICS.filter((t) => counts[t.id])
      .map((t) => ({ id: t.id, name: t.name, tone: t.tone, n: counts[t.id] })));

  el.topics.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + chip.n + ")";
    btn.style.setProperty("--tone", chip.tone);
    btn.setAttribute("aria-pressed", String(dlg.topic === chip.id));
    btn.addEventListener("click", () => { dlg.topic = chip.id; renderSetup(); });
    el.topics.appendChild(btn);
  });
}

function renderStrip() {
  el.strip.innerHTML = srs.stripHtml(srs.stats(rolePool(dlg.role), poolKey));
}

function renderList() {
  const list = dlg.topic === "alle"
    ? CONVERSATIONS
    : CONVERSATIONS.filter((c) => c.topic === dlg.topic);

  el.count.textContent = list.length === CONVERSATIONS.length
    ? CONVERSATIONS.length + " Gespräche"
    : list.length + " von " + CONVERSATIONS.length;

  el.list.innerHTML = list.map((c) => {
    const topic = topicById(c.topic);
    const mine = turnsFor(c, dlg.role);
    const done = LINES[c.id].filter((l) => l.s === dlg.role && srs.boxOf(keyOf(c.id, l.i)) >= 4).length;
    return '<button type="button" class="conv-card" data-id="' + c.id + '" style="--tone:' + topic.tone + '">' +
      '<span class="conv-card-top">' +
        '<span class="conv-card-topic">' + escapeHtml(topic.name) + '</span>' +
        '<span class="conv-card-len">' + mine + ' Sätze für dich' +
          (done ? ' · ' + done + ' sicher' : '') + '</span>' +
      '</span>' +
      '<span class="conv-card-title">' + escapeHtml(c.title) + '</span>' +
      '<span class="conv-card-en gloss">' + escapeHtml(c.titleEn) + '</span>' +
    '</button>';
  }).join("") || '<div class="vocab-empty">Nichts gefunden.</div>';
}

function renderSetup() {
  el.setup.hidden = false;
  el.run.hidden = true;
  renderRoles();
  renderTopics();
  renderStrip();
  renderList();
}

/* ------------------------------------------------------------------ */
/* Running a dialogue                                                  */
/* ------------------------------------------------------------------ */

/** The transcript so far: everything already said, in order. */
function renderTranscript(upto) {
  const all = lines();
  el.lines.innerHTML = all.slice(0, upto).map((line) => {
    const mine = line.s === dlg.role;
    return '<div class="conv-line" data-who="' + escapeHtml(line.s) + '"' + (mine ? ' data-mine="true"' : '') + '>' +
      '<span class="conv-who">' + avatarFor(line.s) +
        '<span class="conv-name">' + escapeHtml(line.s) + '</span>' +
      '</span>' +
      '<span class="conv-bubble">' +
        '<span class="conv-de">' + escapeHtml(line.de) + '</span>' +
        '<span class="conv-en gloss">' + escapeHtml(line.en) + '</span>' +
      '</span>' +
      '<span class="conv-actions">' +
        '<button type="button" class="speak-btn" data-say="' + line.i + '" title="Satz vorlesen">' +
          SPEAKER_SVG + '</button>' +
      '</span>' +
    '</div>';
  }).join("");
}

function speakLine(line) {
  if (!line || !deps.isSoundOn()) return;
  stopSpeaking();
  sayLine({ de: line.de, s: line.s, clip: line.clip }, null);
}

function renderProgress() {
  const all = lines();
  const mine = all.filter((l) => l.s === dlg.role);
  const doneCount = mine.filter((l) => l.i < dlg.index).length;
  el.progress.textContent = dlg.done
    ? mine.length + " von " + mine.length
    : Math.min(doneCount + 1, mine.length) + " von " + mine.length;
}

function renderPieces() {
  el.answer.innerHTML = dlg.placed.length
    ? dlg.placed.map((id) => pieceHtml(pieceById(id), true)).join("")
    : '<span class="wchip-empty">Tippe die Wörter der Reihe nach an.</span>';
  el.bank.innerHTML = dlg.bank.map((id) => pieceHtml(pieceById(id), false)).join("");
  el.check.disabled = dlg.bank.length > 0;
  el.clear.disabled = dlg.placed.length === 0;
}

function pieceById(id) {
  return dlg.pieces.find((p) => p.id === id) || { id: id, words: [], text: "" };
}

function layOutPieces() {
  const line = currentLine();
  dlg.pieces = line ? buildPieces(line.target, dlg.level) : [];
  dlg.bank = dlg.pieces.map((p) => p.id);
  dlg.placed = [];
}

function renderLevels() {
  const line = currentLine();
  renderLevelButtons(el.levels, line ? line.target : null, dlg.level, dlg.answered);
}

/**
 * Move forward until it is the chosen role's turn, speaking whatever the other
 * person says on the way.
 *
 * Dialogues alternate, so in practice this reveals exactly one partner line —
 * but it loops rather than assuming, because a dialogue that ever put two turns
 * together would otherwise swallow one of them.
 */
function advanceToMyTurn() {
  const all = lines();
  let spoke = null;

  while (dlg.index < all.length && all[dlg.index].s !== dlg.role) {
    spoke = all[dlg.index];
    dlg.index++;
  }

  if (dlg.index >= all.length) return finish();

  renderTranscript(dlg.index);
  speakLine(spoke);

  dlg.level = 1;            // every line starts at the hard end again
  dlg.usedHelp = false;
  dlg.answered = false;
  layOutPieces();

  el.builder.hidden = false;
  el.summary.hidden = true;
  el.turn.innerHTML =
    '<span class="dlg-turn-who">' + avatarFor(dlg.role) + '</span>' +
    '<span class="dlg-turn-text">Du bist <b>' + escapeHtml(dlg.role) + '</b> — was sagst du?</span>';
  el.en.hidden = true;
  el.en.textContent = currentLine().en || "";
  el.hint.hidden = false;
  el.result.hidden = true;
  el.check.hidden = false;
  el.clear.hidden = false;
  el.next.hidden = true;

  renderProgress();
  renderLevels();
  renderPieces();
}

function startConversation(id) {
  const conv = CONVERSATIONS.find((c) => c.id === id);
  if (!conv) return;

  stopSpeaking();
  dlg.conv = conv;
  dlg.index = 0;
  dlg.done = false;
  dlg.right = dlg.near = dlg.wrong = 0;

  el.setup.hidden = true;
  el.run.hidden = false;
  el.title.textContent = conv.title;
  el.meta.innerHTML =
    '<span class="conv-topic-chip">' + escapeHtml(topicById(conv.topic).name) + '</span>' +
    '<span class="conv-card-en gloss">' + escapeHtml(conv.titleEn) + '</span>';
  el.run.style.setProperty("--tone", topicById(conv.topic).tone);

  advanceToMyTurn();
}

/* ------------------------------------------------------------------ */
/* Answering                                                           */
/* ------------------------------------------------------------------ */

function setLevel(level) {
  if (dlg.answered || !currentLine()) return;
  if (level === dlg.level) return;
  dlg.level = level;
  if (level > 1) dlg.usedHelp = true;
  layOutPieces();
  renderLevels();
  renderPieces();
}

function checkLine() {
  const line = currentLine();
  if (dlg.answered || !line || dlg.bank.length) return;

  const placedWords = dlg.placed.reduce((all, id) => all.concat(pieceById(id).words), []);
  const marked = markOrder(placedWords, line.target);
  dlg.answered = true;

  /* A line assembled out of pre-joined pieces was partly assembled for you, so a
     right answer below level 1 holds its box rather than being promoted — the
     same treatment a near miss gets, for the same reason. */
  const helped = marked.grade === "right" && dlg.usedHelp;
  srs.grade(keyOf(dlg.conv.id, line.i), helped ? "near" : marked.grade);

  if (marked.grade === "right") dlg.right++;
  else if (marked.grade === "near") dlg.near++;
  else dlg.wrong++;

  const tone = marked.grade === "right" ? "ok" : (marked.grade === "near" ? "neutral" : "bad");
  const verdict = marked.grade === "right" ? "Genau das sagt " + dlg.role + "."
    : marked.grade === "near" ? "Das Verb steht richtig — gesagt wird aber das:"
    : "Nicht ganz. " + dlg.role + " sagt:";

  el.result.className = "feedback " + tone;
  el.result.innerHTML =
    '<div class="feedback-head">' + escapeHtml(verdict) + '</div>' +
    '<div class="wo-answer">' +
      '<span class="correction-line">' + escapeHtml(line.de) + '</span>' +
      '<button type="button" class="speak-btn" id="dlg-say" title="Vorlesen">' + SPEAKER_SVG + '</button>' +
    '</div>' +
    '<div class="tip-line">' + escapeHtml(line.en) + '</div>' +
    (helped
      ? '<div class="wo-tip">Mit Stufe&nbsp;' + dlg.level +
        ' gelöst — das Fach bleibt, wo es war. Auf Stufe&nbsp;1 zählt der Satz voll.</div>'
      : "");
  el.result.hidden = false;

  // The line joins the transcript as soon as it has been answered, right or
  // wrong, because the conversation has to make sense to go on from.
  renderTranscript(dlg.index + 1);
  speakLine(line);

  el.check.hidden = true;
  el.clear.hidden = true;
  el.hint.hidden = true;
  el.en.hidden = true;
  el.next.hidden = false;
  renderLevels();
  el.next.focus();
}

function skipToAnswer() {
  if (dlg.answered || !currentLine()) return;
  dlg.placed = [];
  dlg.bank = [];
  checkLine();
}

function nextLine() {
  if (!dlg.answered) return;
  dlg.index++;
  advanceToMyTurn();
}

/* ------------------------------------------------------------------ */
/* Finishing                                                           */
/* ------------------------------------------------------------------ */

function finish() {
  dlg.done = true;
  stopSpeaking();
  renderTranscript(lines().length);
  el.builder.hidden = true;
  el.summary.hidden = false;
  renderProgress();

  const total = dlg.right + dlg.near + dlg.wrong;
  const message = dlg.wrong === 0 && dlg.near === 0
    ? "Jeden Satz auf Anhieb. Nimm dir das nächste Gespräch."
    : dlg.wrong === 0
      ? "Alles richtig gebaut — ein paar Sätze mit Hilfe oder in anderer Reihenfolge."
      : "Die Sätze, die nicht saßen, kommen im Quiz und hier von selbst wieder.";

  el.summary.innerHTML =
    '<div class="summary-score">' + dlg.right + '<span class="summary-of">/ ' + total + '</span></div>' +
    '<div class="summary-label">Sätze als ' + escapeHtml(dlg.role) + '</div>' +
    '<div class="score" style="justify-content:center;margin-top:14px">' +
      '<span class="score-pill right">Richtig <b>' + dlg.right + '</b></span>' +
      '<span class="score-pill near">Fast <b>' + dlg.near + '</b></span>' +
      '<span class="score-pill wrong">Falsch <b>' + dlg.wrong + '</b></span>' +
    '</div>' +
    '<p class="summary-msg">' + escapeHtml(message) + '</p>' +
    '<div class="summary-actions">' +
      '<button type="button" class="btn btn-primary" data-again="same">Noch einmal</button>' +
      '<button type="button" class="btn btn-ghost" data-again="swap">Als ' +
        escapeHtml(dlg.role === "Shruti" ? "Sijan" : "Shruti") + '</button>' +
      '<button type="button" class="btn btn-ghost" data-again="list">Anderes Gespräch</button>' +
    '</div>';
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

export function initDialogue(options) {
  deps = Object.assign(deps, options || {});

  const $ = (id) => document.getElementById(id);
  el = {
    setup: $("dlg-setup"),
    roles: $("dlg-roles"),
    topics: $("dlg-topics"),
    strip: $("dlg-strip"),
    count: $("dlg-count"),
    list: $("dlg-list"),

    run: $("dlg-run"),
    back: $("dlg-back"),
    title: $("dlg-title"),
    meta: $("dlg-meta"),
    progress: $("dlg-progress"),
    lines: $("dlg-lines"),

    builder: $("dlg-builder"),
    turn: $("dlg-turn"),
    levels: $("dlg-levels"),
    answer: $("dlg-answer"),
    bank: $("dlg-bank"),
    hint: $("dlg-hint"),
    en: $("dlg-en"),
    clear: $("dlg-clear"),
    check: $("dlg-check"),
    skip: $("dlg-skip"),
    next: $("dlg-next"),
    result: $("dlg-result"),
    summary: $("dlg-summary")
  };

  el.roles.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-role]");
    if (!btn || btn.dataset.role === dlg.role) return;
    dlg.role = btn.dataset.role;
    renderSetup();
  });

  el.list.addEventListener("click", (event) => {
    const card = event.target.closest(".conv-card");
    if (card) startConversation(card.dataset.id);
  });

  el.back.addEventListener("click", () => { stopSpeaking(); renderSetup(); });

  el.levels.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-level]");
    if (btn) setLevel(Number(btn.dataset.level));
  });

  el.answer.addEventListener("click", (event) => {
    const chip = event.target.closest(".wchip");
    if (chip) takeBack(Number(chip.dataset.chip));
  });

  el.bank.addEventListener("click", (event) => {
    const chip = event.target.closest(".wchip");
    if (chip) place(Number(chip.dataset.chip));
  });

  el.check.addEventListener("click", checkLine);
  el.next.addEventListener("click", nextLine);
  el.skip.addEventListener("click", skipToAnswer);
  el.clear.addEventListener("click", () => {
    if (dlg.answered) return;
    dlg.bank = dlg.pieces.map((p) => p.id);
    dlg.placed = [];
    renderPieces();
  });

  el.hint.addEventListener("click", () => {
    if (!currentLine()) return;
    el.en.hidden = false;
    el.hint.hidden = true;
  });

  el.result.addEventListener("click", (event) => {
    if (event.target.closest("#dlg-say")) speakLine(currentLine());
  });

  // Any line already said can be heard again — the whole point of the transcript
  // is that you can go back over what was actually being talked about.
  el.lines.addEventListener("click", (event) => {
    const btn = event.target.closest(".speak-btn");
    if (!btn) return;
    const line = lines()[Number(btn.dataset.say)];
    if (line) { stopSpeaking(); sayLine({ de: line.de, s: line.s, clip: line.clip }, null); }
  });

  el.summary.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-again]");
    if (!btn) return;
    if (btn.dataset.again === "list") return renderSetup();
    if (btn.dataset.again === "swap") dlg.role = dlg.role === "Shruti" ? "Sijan" : "Shruti";
    startConversation(dlg.conv.id);
  });

  document.addEventListener("keydown", (event) => {
    if (deps.getMode() !== "wordorder" || deps.getSub() !== "dialogue") return;
    if (event.target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName)) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      if (!dlg.answered && dlg.placed.length) takeBack(dlg.placed[dlg.placed.length - 1]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (dlg.answered) nextLine();
      else if (!dlg.bank.length) checkLine();
    }
  });
}

function place(id) {
  if (dlg.answered) return;
  const at = dlg.bank.indexOf(id);
  if (at < 0) return;
  dlg.bank.splice(at, 1);
  dlg.placed.push(id);
  renderPieces();
}

function takeBack(id) {
  if (dlg.answered) return;
  const at = dlg.placed.indexOf(id);
  if (at < 0) return;
  dlg.placed.splice(at, 1);
  // Back into the bank where it started, so the bank does not reshuffle itself
  // under the hand every time something is taken out of the answer.
  const home = dlg.pieces.findIndex((p) => p.id === id);
  let insert = dlg.bank.length;
  for (let i = 0; i < dlg.bank.length; i++) {
    if (dlg.pieces.findIndex((p) => p.id === dlg.bank[i]) > home) { insert = i; break; }
  }
  dlg.bank.splice(insert, 0, id);
  renderPieces();
}

export function enterDialogue() {
  if (dlg.conv && !dlg.done) { renderProgress(); return; }
  renderSetup();
}

export function leaveDialogue() {
  stopSpeaking();
}
