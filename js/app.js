import { VOCAB, VOCAB_THEMES, allWords, TYPE_LABEL } from "./vocab.js";
import { GRAMMAR, grammarById } from "./grammar-topics.js";
import { CONV_TOPICS, CONVERSATIONS } from "./conversations.js";
import { AUDIO } from "./audio-manifest.js";
import { clipFor } from "./clips.js";
import { videoFor } from "./video-manifest.js";
import { avatarFor } from "./avatars.js";
import { escapeHtml, pickOne, shuffle, SPEAKER_SVG } from "./util.js";
import { glossFor } from "./gloss.js";
import * as srs from "./srs.js";
import { initDictation, enterDictation, leaveDictation } from "./dictation.js";
import { initWordOrder, enterWordOrder } from "./wordorder.js";
import { initDialogue, enterDialogue, leaveDialogue } from "./dialogue.js";
import {
  initVoices, sayLine, sayLineOnce, sayOnce, voiceLabels,
  stopSpeaking, pauseSpeaking, resumeClip
} from "./speech.js";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const state = {
  ttsOn: true,
  // "conversation" | "dictation" | "vocab" | "quiz" | "wordorder" | "grammar"
  mode: "conversation",
  vocabTheme: "alle",
  vocabQuery: "",
  convTopic: "alle",
  convQuery: "",
  // "manual" stops after every line, "auto" runs on, "video" plays the film
  convMode: "manual",
  woSub: "sentences",       // Satzbau: "sentences" drill or "dialogue" role-play
  showEn: true              // show the English under every German line
};


/* ------------------------------------------------------------------ */
/* DOM                                                                 */
/* ------------------------------------------------------------------ */

const $ = (id) => document.getElementById(id);

const el = {
  soundToggle: $("sound-toggle"),
  soundToggleLabel: $("sound-toggle-label"),
  modeTabs: $("mode-tabs"),
  showEnToggle: $("show-en"),

  screenConv: $("screen-conv"),
  convListWrap: $("conv-list-wrap"),
  convTopics: $("conv-topics"),
  convSearch: $("conv-search"),
  convCount: $("conv-count"),
  convList: $("conv-list"),
  convDetail: $("conv-detail"),
  convBack: $("conv-back"),
  convTitle: $("conv-title"),
  convMeta: $("conv-meta"),
  convLines: $("conv-lines"),
  convPlay: $("conv-play"),
  convStop: $("conv-stop"),
  convPrev: $("conv-prev"),
  convNext: $("conv-next"),
  convMode: $("conv-mode"),
  convAdvance: $("conv-advance"),
  convAdvanceBtn: $("conv-advance-btn"),
  convVoices: $("conv-voices"),
  convControls: $("conv-controls"),
  convFilm: $("conv-film"),
  convVideo: $("conv-video"),
  convFilmNote: $("conv-film-note"),
  convModeVideo: $("conv-mode-video"),

  screenVocab: $("screen-vocab"),
  vocabSearch: $("vocab-search"),
  vocabCount: $("vocab-count"),
  vocabThemes: $("vocab-themes"),
  vocabList: $("vocab-list"),

  screenDictation: $("screen-dictation"),
  screenWordOrder: $("screen-wordorder"),
  woSub: $("wo-sub"),
  woSentences: $("wo-sentences"),
  woDialogue: $("wo-dialogue"),

  screenQuiz: $("screen-quiz"),
  quizThemes: $("quiz-themes"),
  quizStrip: $("quiz-strip"),
  quizScore: $("quiz-score"),
  quizReset: $("quiz-reset"),
  srsReset: $("srs-reset"),
  quizWord: $("quiz-word"),
  quizType: $("quiz-type"),
  quizSay: $("quiz-say"),
  quizOptions: $("quiz-options"),
  quizFeedback: $("quiz-feedback"),
  quizNext: $("quiz-next"),

  screenGrammar: $("screen-grammar"),
  grammarList: $("grammar-list")
};

/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  const leaving = state.mode;
  state.mode = mode;
  document.body.dataset.mode = mode;   // the English switch keys off this
  Array.prototype.forEach.call(el.modeTabs.querySelectorAll("button"), (b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });

  stopPlayback();
  if (leaving === "dictation" && mode !== "dictation") leaveDictation();
  if (leaving === "wordorder" && mode !== "wordorder") leaveDialogue();

  el.screenConv.hidden = mode !== "conversation";
  el.screenDictation.hidden = mode !== "dictation";
  el.screenVocab.hidden = mode !== "vocab";
  el.screenQuiz.hidden = mode !== "quiz";
  el.screenWordOrder.hidden = mode !== "wordorder";
  el.screenGrammar.hidden = mode !== "grammar";

  if (mode === "conversation") renderConvList();
  if (mode === "dictation") enterDictation();
  if (mode === "vocab") renderVocab();
  if (mode === "quiz") { if (quiz.word) renderQuiz(); else nextQuestion(); }
  if (mode === "wordorder") setWordOrderSub(state.woSub);
  if (mode === "grammar") renderGrammar();
}

/*
 * Satzbau has two halves: the single-sentence drill and the dialogue role-play.
 * They share the piece mechanic and the three levels but nothing else, so they
 * are two modules behind one tab rather than one module with a flag in it.
 */
function setWordOrderSub(sub) {
  state.woSub = sub;
  document.body.dataset.woSub = sub;
  Array.prototype.forEach.call(el.woSub.querySelectorAll("button"), (b) => {
    b.setAttribute("aria-pressed", String(b.dataset.sub === sub));
  });

  if (sub !== "dialogue") leaveDialogue();
  el.woSentences.hidden = sub !== "sentences";
  el.woDialogue.hidden = sub !== "dialogue";

  if (sub === "dialogue") enterDialogue();
  else enterWordOrder();
}

el.woSub.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-sub]");
  if (btn && btn.dataset.sub !== state.woSub) setWordOrderSub(btn.dataset.sub);
});

/* ------------------------------------------------------------------ */
/* Vocabs                                                              */
/* ------------------------------------------------------------------ */

/* The reload sign: play the dialogue again from this line down. */
const REPEAT_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"></polyline>' +
  '<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>';


const ALL_WORDS = allWords(VOCAB_THEMES);

/**
 * The same chip row serves Vokabeln and Quiz, so which theme is selected and
 * what happens on a click are passed in rather than baked in.
 */
function renderThemeChips(container, selectedId, onPick) {
  const chips = [{ id: "alle", name: "Alle", tone: "var(--accent)", n: ALL_WORDS.length }]
    .concat(VOCAB_THEMES.map((t) => ({ id: t.id, name: t.name, tone: t.tone, n: (VOCAB[t.id] || []).length })));

  container.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + chip.n + ")";
    btn.style.setProperty("--tone", chip.tone);
    btn.setAttribute("aria-pressed", String(selectedId === chip.id));
    btn.addEventListener("click", () => onPick(chip.id));
    container.appendChild(btn);
  });
}

/**
 * Bold the headword inside its example sentence, so the Perfekt pattern is
 * visible at a glance rather than something you have to hunt for.
 *
 * Three German-specific wrinkles are handled: multi-word entries put the verb
 * last ("zur Arbeit fahren"), reflexives start with a meaningless "sich", and
 * separable verbs hide a "ge" inside the participle (aufstehen ->
 * aufgestanden) which no prefix match can find. For a Perfekt sentence the
 * final word is the participle by construction, so that is the fallback.
 */
function highlight(sentence, headword, isPerfekt) {
  const core = headword
    .replace(/\s*\(.*?\)\s*/g, "")
    .replace(/^(der|die|das)\s+/i, "")
    .replace(/^sich\s+/i, "")
    .trim();

  const parts = core.split(/\s+/);
  const stem = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const escaped = escapeHtml(sentence);

  if (stem.length >= 4) {
    const root = stem.slice(0, Math.max(4, stem.length - 2)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      const hit = escaped.replace(new RegExp("(\\b\\w*" + root + "\\w*\\b)", "i"), "<em>$1</em>");
      if (hit !== escaped) return hit;
    } catch (e) { /* fall through to the participle fallback */ }
  }

  if (isPerfekt) {
    return escaped.replace(/(\b[\wÄÖÜäöüß]+\b)(\s*[.!?]*)$/, "<em>$1</em>$2");
  }
  return escaped;
}

function vocabMatches() {
  const query = state.vocabQuery.trim().toLowerCase();
  return ALL_WORDS.filter((w) => {
    if (state.vocabTheme !== "alle" && w.themeId !== state.vocabTheme) return false;
    if (!query) return true;
    return (w.de + " " + w.en + " " + w.simple + " " + w.perfekt).toLowerCase().indexOf(query) >= 0;
  });
}


function vocabRow(label, text, html, tone, gloss) {
  return '<div class="vocab-row">' +
    '<span class="vocab-label">' + label + '</span>' +
    '<span class="vocab-sentence"' + (tone ? ' style="color:var(--tone);font-size:.82rem"' : '') + '>' + html +
      (gloss ? '<span class="gloss">' + escapeHtml(gloss) + '</span>' : '') +
    '</span>' +
    (text ? '<button type="button" class="speak-btn" data-say="' + escapeHtml(text) + '" title="Vorlesen">' + SPEAKER_SVG + '</button>' : '') +
    '</div>';
}

function renderVocab() {
  renderThemeChips(el.vocabThemes, state.vocabTheme, (id) => {
    state.vocabTheme = id;
    renderVocab();
  });
  const words = vocabMatches();

  el.vocabCount.textContent = words.length === ALL_WORDS.length
    ? ALL_WORDS.length + " Wörter"
    : words.length + " von " + ALL_WORDS.length;

  if (!words.length) {
    el.vocabList.innerHTML = '<div class="vocab-empty">Nichts gefunden.</div>';
    return;
  }

  // One innerHTML write instead of hundreds of DOM insertions, and one
  // delegated listener on the container instead of a listener per row.
  el.vocabList.innerHTML = words.map((w) => {
    const type = TYPE_LABEL[w.type] || "";
    return '<div class="vocab-item" data-open="false" style="--tone:' + w.tone + '">' +
      '<button type="button" class="vocab-head" aria-expanded="false">' +
        '<span class="vocab-de">' + escapeHtml(w.de) + '</span>' +
        (type ? '<span class="vocab-type">' + type + '</span>' : '') +
        '<span class="vocab-en">' + escapeHtml(w.en) + '</span>' +
      '</button>' +
      '<div class="vocab-detail" hidden>' +
        vocabRow("Wort", w.de, escapeHtml(w.de), false, "") +
        vocabRow("Einfach", w.simple, highlight(w.simple, w.de, false), false, glossFor(w.simple)) +
        vocabRow("Perfekt", w.perfekt, highlight(w.perfekt, w.de, true), false, glossFor(w.perfekt)) +
        (w.nebensatz ? vocabRow("Nebensatz", w.nebensatz, highlight(w.nebensatz, w.de, false), false, glossFor(w.nebensatz, w.simple)) : "") +
        vocabRow("Thema", "", escapeHtml(w.themeName), true) +
        (w.topics && w.topics.length
          ? '<div class="vocab-row"><span class="vocab-label">Grammatik</span><span class="vocab-sentence"><span class="topic-chips">' +
            w.topics.map((id) => {
              const g = grammarById(id);
              return g ? '<button type="button" class="topic-chip" data-topic="' + id + '">' + escapeHtml(g.name) + '</button>' : "";
            }).join("") + '</span></span></div>'
          : "") +
      '</div>' +
    '</div>';
  }).join("");
}

el.vocabList.addEventListener("click", (event) => {
  const chip = event.target.closest(".topic-chip");
  if (chip) { event.stopPropagation(); openGrammarTopic(chip.dataset.topic); return; }

  const sayBtn = event.target.closest(".speak-btn");
  if (sayBtn) {
    event.stopPropagation();
    sayOnce(sayBtn.dataset.say, "Shruti", true);        // explicit request: always audible
    return;
  }

  const head = event.target.closest(".vocab-head");
  if (!head) return;
  const item = head.parentElement;
  const detail = item.querySelector(".vocab-detail");
  const open = item.dataset.open === "true";

  item.dataset.open = String(!open);
  detail.hidden = open;
  head.setAttribute("aria-expanded", String(!open));
  if (!open) sayOnce(item.querySelector(".vocab-de").textContent, "Shruti", state.ttsOn);
});

el.showEnToggle.addEventListener("click", () => {
  state.showEn = !state.showEn;
  el.showEnToggle.dataset.on = String(state.showEn);
  el.showEnToggle.setAttribute("aria-pressed", String(state.showEn));
  el.showEnToggle.textContent = state.showEn ? "Englisch an" : "Englisch aus";
  document.body.dataset.hideEn = state.showEn ? "false" : "true";
});

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

const SCORE_KEY = "a2trainer.quiz.score";

function loadScore() {
  try {
    const raw = JSON.parse(localStorage.getItem(SCORE_KEY) || "{}");
    return { right: Number(raw.right) || 0, wrong: Number(raw.wrong) || 0 };
  } catch (e) {
    return { right: 0, wrong: 0 };   // private window, blocked storage — just start over
  }
}

function saveScore() {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify({ right: quiz.right, wrong: quiz.wrong }));
  } catch (e) { /* the counter is a convenience, never load-bearing */ }
}

const quiz = Object.assign({
  theme: "alle",
  word: null,
  options: [],
  answered: false,
  recent: []      // headwords asked lately, so the same one doesn't come round twice in a row
}, loadScore());

function quizPool() {
  return ALL_WORDS.filter((w) => w.en && (quiz.theme === "alle" || w.themeId === quiz.theme));
}

/* The Quiz's own record of a word. Diktat and Satzbau key the same word
   differently on purpose — recognising "der Wecker" and being able to spell it
   from dictation are not the same thing to have learnt. */
const quizKey = (w) => "v:" + w.de;

/**
 * Three wrong answers, drawn from the same word type where possible.
 *
 * Mixing types gives the answer away — if the question is a verb and the other
 * three options are nouns, you can pick it without knowing the word. Same-type
 * distractors force an actual translation. Falls back to the whole pool when a
 * type is too thin (a theme may hold only two adverbs).
 */
function distractorsFor(word, pool) {
  const taken = new Set([word.en.toLowerCase()]);
  const usable = (list) => list.filter((w) => {
    const key = w.en.toLowerCase();
    if (taken.has(key)) return false;
    taken.add(key);
    return true;
  });

  const sameType = shuffle(usable(pool.filter((w) => w.type === word.type && w.de !== word.de)));
  const picked = sameType.slice(0, 3);

  if (picked.length < 3) {
    const rest = shuffle(usable(pool.filter((w) => w.de !== word.de)));
    picked.push(...rest.slice(0, 3 - picked.length));
  }
  return picked;
}

/*
 * Which word to ask next.
 *
 * This used to be a uniform random draw, which never converges: with 1009 words
 * you answer the easy ones over and over and the dozen you actually don't know
 * come round no more often than the rest. The box system in srs.js decides
 * instead — overdue first, weakest of those first, one new word in four — and
 * `recent` keeps a word that just went back to box 1 from reappearing
 * immediately.
 */
function nextQuestion() {
  const pool = quizPool();
  if (pool.length < 4) {
    quiz.word = null;
    renderQuiz();
    return;
  }

  const word = srs.pick(pool, quizKey, quiz.recent) || pickOne(pool);
  const avoid = Math.min(25, Math.floor(pool.length / 3));
  quiz.recent.push(quizKey(word));
  while (quiz.recent.length > avoid) quiz.recent.shift();

  quiz.word = word;
  quiz.answered = false;
  quiz.options = shuffle([word].concat(distractorsFor(word, pool)));
  renderQuiz();
  sayOnce(word.de, "Shruti", state.ttsOn);
}

function renderScore() {
  const total = quiz.right + quiz.wrong;
  const rate = total ? Math.round((quiz.right / total) * 100) : 0;
  el.quizScore.innerHTML =
    '<span class="score-pill right">Richtig <b>' + quiz.right + '</b></span>' +
    '<span class="score-pill wrong">Falsch <b>' + quiz.wrong + '</b></span>' +
    (total
      ? '<span class="score-pill rate">' + total + ' Fragen · <b>' + rate + '%</b></span>'
      : '<span class="score-pill rate">noch keine Frage</span>');
}

function renderQuizStrip() {
  el.quizStrip.innerHTML = srs.stripHtml(srs.stats(quizPool(), quizKey));
}

function renderQuiz() {
  renderThemeChips(el.quizThemes, quiz.theme, (id) => {
    quiz.theme = id;
    quiz.recent = [];
    nextQuestion();
  });
  renderQuizStrip();
  renderScore();

  if (!quiz.word) {
    el.quizWord.textContent = "Zu wenige Wörter";
    el.quizType.textContent = "";
    el.quizOptions.innerHTML = '<div class="vocab-empty">Dieses Thema hat weniger als vier Wörter. Wähle ein anderes.</div>';
    el.quizFeedback.hidden = true;
    el.quizNext.hidden = true;
    return;
  }

  el.quizWord.textContent = quiz.word.de;
  el.quizType.textContent = TYPE_LABEL[quiz.word.type] || "";
  el.quizSay.innerHTML = SPEAKER_SVG;

  el.quizOptions.innerHTML = quiz.options.map((opt, i) =>
    '<button type="button" class="quiz-opt" data-i="' + i + '">' +
      '<span class="num">' + (i + 1) + '</span>' +
      '<span>' + escapeHtml(opt.en) + '</span>' +
    '</button>'
  ).join("");

  el.quizFeedback.hidden = true;
  el.quizNext.hidden = true;
}

function answerQuiz(index) {
  if (quiz.answered || !quiz.word) return;
  const chosen = quiz.options[index];
  if (!chosen) return;

  quiz.answered = true;
  const correct = chosen.en === quiz.word.en;
  if (correct) quiz.right++; else quiz.wrong++;
  const rec = srs.grade(quizKey(quiz.word), correct ? "right" : "wrong");
  saveScore();
  renderScore();
  renderQuizStrip();

  Array.prototype.forEach.call(el.quizOptions.querySelectorAll(".quiz-opt"), (btn) => {
    const i = Number(btn.dataset.i);
    btn.disabled = true;
    if (quiz.options[i].en === quiz.word.en) btn.dataset.state = "right";
    else if (i === index) btn.dataset.state = "wrong";
    else btn.dataset.state = "dim";
  });

  const gloss = glossFor(quiz.word.simple);
  el.quizFeedback.innerHTML =
    '<span class="verdict ' + (correct ? "right" : "wrong") + '">' +
      (correct ? "Richtig." : "Leider falsch — richtig ist „" + escapeHtml(quiz.word.en) + "“.") +
    '</span>' +
    '<span class="example">' + highlight(quiz.word.simple, quiz.word.de, false) + '</span>' +
    (gloss ? '<span class="example-en">' + escapeHtml(gloss) + '</span>' : "") +
    '<span class="srs-note">Fach ' + rec.b + ' von ' + srs.MAX_BOX + ' · ' + srs.dueLabel(rec) + '</span>';
  el.quizFeedback.hidden = false;
  el.quizNext.hidden = false;
  el.quizNext.focus();

  if (!correct) sayOnce(quiz.word.de, "Shruti", state.ttsOn);
}

el.quizOptions.addEventListener("click", (event) => {
  const btn = event.target.closest(".quiz-opt");
  if (btn) answerQuiz(Number(btn.dataset.i));
});

el.quizNext.addEventListener("click", nextQuestion);
el.quizSay.addEventListener("click", () => quiz.word && sayOnce(quiz.word.de, "Shruti", true));

el.quizReset.addEventListener("click", () => {
  quiz.right = 0;
  quiz.wrong = 0;
  saveScore();
  renderScore();
});

/*
 * Throwing away the boxes throws away weeks of answers, and it is one button
 * along from the harmless counter reset — so it asks first.
 */
el.srsReset.addEventListener("click", () => {
  const ok = window.confirm(
    "Der gesamte Lernfortschritt wird gelöscht: alle Fächer in Quiz, Diktat und Satzbau. " +
    "Das lässt sich nicht rückgängig machen."
  );
  if (!ok) return;
  srs.resetAll();
  quiz.recent = [];
  renderQuizStrip();
});

document.addEventListener("keydown", (event) => {
  if (state.mode !== "quiz") return;
  if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;

  if (!quiz.answered && event.key >= "1" && event.key <= "4") {
    event.preventDefault();
    answerQuiz(Number(event.key) - 1);
  } else if (quiz.answered && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    nextQuestion();
  }
});

let vocabSearchTimer = null;
el.vocabSearch.addEventListener("input", () => {
  clearTimeout(vocabSearchTimer);
  vocabSearchTimer = setTimeout(() => {
    state.vocabQuery = el.vocabSearch.value;
    renderVocab();
  }, 150);
});

el.modeTabs.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-mode]");
  if (btn) setMode(btn.dataset.mode);
});


/* ------------------------------------------------------------------ */
/* Grammatik                                                           */
/* ------------------------------------------------------------------ */

function renderGrammar() {
  if (el.grammarList.dataset.rendered === "true") return;   // static content
  el.grammarList.innerHTML = GRAMMAR.map((g) => {
    const examples = g.examples.map((ex) =>
      '<div class="grammar-ex">' +
        '<div class="grammar-ex-text">' +
          '<span class="grammar-de">' + escapeHtml(ex.de) + '</span>' +
          '<span class="grammar-en">' + escapeHtml(ex.en) + '</span>' +
        '</div>' +
        '<button type="button" class="speak-btn" data-say="' + escapeHtml(ex.de) + '" title="Vorlesen">' + SPEAKER_SVG + '</button>' +
      '</div>').join("");

    return '<div class="grammar-item" id="g-' + g.id + '" data-open="false" style="--tone:' + g.tone + '">' +
      '<button type="button" class="grammar-head" aria-expanded="false">' +
        '<span class="grammar-name">' + escapeHtml(g.name) + '</span>' +
        '<span class="grammar-short">' + escapeHtml(g.short) + '</span>' +
      '</button>' +
      '<div class="grammar-body" hidden>' +
        '<div class="grammar-summary">' + escapeHtml(g.summary) + '</div>' +
        '<div class="grammar-pattern">' + escapeHtml(g.pattern) + '</div>' +
        '<div class="grammar-examples">' + examples + '</div>' +
        '<div class="grammar-watch"><strong>Achtung:</strong> ' + escapeHtml(g.watch) + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
  el.grammarList.dataset.rendered = "true";
}

el.grammarList.addEventListener("click", (event) => {
  const sayBtn = event.target.closest(".speak-btn");
  if (sayBtn) { event.stopPropagation(); sayOnce(sayBtn.dataset.say, "Shruti", true); return; }

  const head = event.target.closest(".grammar-head");
  if (!head) return;
  const item = head.parentElement;
  const body = item.querySelector(".grammar-body");
  const open = item.dataset.open === "true";
  item.dataset.open = String(!open);
  body.hidden = open;
  head.setAttribute("aria-expanded", String(!open));
});

/** Jump from a vocab word's topic chip straight to that grammar topic. */
function openGrammarTopic(id) {
  setMode("grammar");
  const item = document.getElementById("g-" + id);
  if (!item) return;
  const body = item.querySelector(".grammar-body");
  const head = item.querySelector(".grammar-head");
  item.dataset.open = "true";
  body.hidden = false;
  head.setAttribute("aria-expanded", "true");
  item.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/* Konversation                                                        */
/* ------------------------------------------------------------------ */

/*
 * Playback state.
 *
 * `phase` says what the dialogue is doing right now, which is what makes pause
 * work: the phases stop and continue in different ways. "beat" is the typing
 * pause before a line appears, "speaking" is the line itself, "gap" is the
 * breath between turns, and "waiting" is a finished line in Satz-für-Satz mode
 * holding still until you ask for the next one. `exact` records whether the
 * paused line can continue mid-sentence (a rendered clip) or has to be spoken
 * again (the browser voice).
 */
const play = {
  id: null, index: -1, running: false, paused: false,
  phase: null, exact: false, timer: null
};

/*
 * How a dialogue plays.
 *
 * "manual" stops after every line and waits; "auto" runs the whole thing
 * through. Manual is the default because the automatic version is a listening
 * exercise, not a reading one — the line goes past, you catch about half of it,
 * and there is nowhere to stand and look at the rest. Stopping after each turn
 * is what makes the transcript worth having.
 *
 * The choice is remembered, so the default applies to a first visit rather than
 * being re-imposed on someone who has already decided otherwise.
 */
const CONV_MODE_KEY = "a2trainer.conv.mode";

function loadConvMode() {
  try {
    const saved = localStorage.getItem(CONV_MODE_KEY);
    return saved === "auto" || saved === "video" ? saved : "manual";
  } catch (e) {
    return "manual";
  }
}

function saveConvMode() {
  try { localStorage.setItem(CONV_MODE_KEY, state.convMode); } catch (e) { /* optional */ }
}

function currentConversation() {
  return CONVERSATIONS.find((x) => x.id === play.id) || null;
}

/** True once the line on screen is the last one there is. */
function atLastLine() {
  const c = currentConversation();
  return !!c && play.index >= c.lines.length - 1;
}

/** The film for the dialogue currently open, or null if it has none. */
function openFilm() {
  return play.id ? videoFor(play.id) : null;
}

/*
 * What the page is actually doing, as opposed to what you last asked for.
 *
 * Only a handful of dialogues have been rendered, so "Video" is a preference
 * that some conversations cannot honour. Keeping the preference and resolving it
 * per dialogue means opening one without a film shows you the transcript and
 * leaves your choice alone — open one that has a film and you are back in the
 * mode you picked, without having to pick it again.
 */
function effectiveConvMode() {
  if (state.convMode === "video" && !openFilm()) return "manual";
  return state.convMode;
}

function renderConvMode() {
  if (!el.convMode) return;
  const effective = effectiveConvMode();
  Array.prototype.forEach.call(el.convMode.querySelectorAll("button"), (b) => {
    b.setAttribute("aria-pressed", String(b.dataset.cmode === effective));
  });

  /* The Video button only exists where there is something to play. It is
     disabled rather than hidden once any film exists, so the row does not
     change width as you move between dialogues. */
  if (el.convModeVideo) {
    const film = openFilm();
    el.convModeVideo.hidden = false;
    el.convModeVideo.disabled = !film;
    el.convModeVideo.title = film
      ? "Das Gespräch als Film ansehen"
      : "Für dieses Gespräch ist noch kein Film gerendert";
  }
}

/**
 * Put the film's sound where the rest of the app's sound is.
 *
 * Two reasons this is not left to the <video> element alone. The header switch
 * says "Ton an" and governs every other sound the app makes, so a film that
 * ignored it would be the one thing in the trainer that keeps talking after you
 * asked for quiet. And Chrome remembers mute and volume per origin: mute the
 * player once with its own controls and every <video> loaded from that origin
 * afterwards starts muted, across reloads, with nothing on screen to say so.
 * That is a silent film and no obvious reason for it, which is exactly the
 * thing this function exists to make impossible.
 */
function syncFilmSound(reset) {
  if (!el.convVideo) return;
  el.convVideo.muted = !state.ttsOn;
  // Only on entering the mode: mid-playback this would fight the volume
  // slider, but arriving on a video that is silently at zero is the bug.
  if (reset) el.convVideo.volume = 1;
}

/**
 * Watching or reading — one or the other, never both.
 *
 * The film carries the whole conversation, subtitles included, so leaving the
 * transcript underneath it would put the same sentences on screen twice and
 * hand you the answers to a listening exercise. The transport goes too: the
 * video element has its own, and two sets of play buttons on one panel is a
 * question about which one is in charge.
 */
function renderConvDisplay() {
  const film = openFilm();
  const watching = effectiveConvMode() === "video" && !!film;

  if (el.convFilm) el.convFilm.hidden = !watching;
  if (el.convLines) el.convLines.hidden = watching;
  if (el.convControls) el.convControls.hidden = watching;

  if (el.convVideo) {
    if (watching) {
      const src = film.src;
      /* Only touch src when it actually changes: reassigning it reloads the
         video and throws away where you had got to. */
      if (el.convVideo.getAttribute("src") !== src) {
        el.convVideo.setAttribute("src", src);
        el.convVideo.setAttribute("poster", film.poster);
        el.convVideo.load();
      }
      syncFilmSound(true);
    } else if (!el.convVideo.paused) {
      el.convVideo.pause();
    }
  }

  renderFilmNote();
}

/** The line under the player. Redrawn by the sound switch, so "Ton ist aus"
    appears next to the thing that has gone quiet rather than only in the
    header. */
function renderFilmNote() {
  const film = openFilm();
  if (!el.convFilmNote || !film) return;
  const mins = Math.floor(film.seconds / 60);
  const secs = Math.round(film.seconds % 60);
  el.convFilmNote.textContent =
    film.lines + " Sätze · " + mins + ":" + String(secs).padStart(2, "0") +
    " · gespielt, mit den Aufnahmen — jedes Wort wird dunkel, sobald es gesprochen ist" +
    (state.ttsOn ? "" : " · Ton ist aus");
}

/**
 * The play button says what pressing it will do, not what is happening.
 *
 * Once a dialogue is stepping, the advance moves out of the top bar and down
 * under the transcript: it is pressed a dozen times per dialogue, and the bar it
 * used to live in gets pushed off a phone screen by the third or fourth line.
 * The starting press is the one that stays at the top, because until something
 * is playing there is no last line to sit under.
 *
 * There is no pause state in Satz-für-Satz mode — a dialogue that stops after
 * every line has nothing to pause — and the last line offers to finish instead
 * of to advance.
 */
function renderPlayControls() {
  if (!el.convPlay) return;
  /* In video mode the whole transport belongs to the video element; nothing
     below this point has anything to drive. */
  if (effectiveConvMode() === "video") {
    el.convPlay.hidden = true;
    if (el.convAdvance) el.convAdvance.hidden = true;
    if (el.convStop) el.convStop.hidden = true;
    if (el.convPrev) el.convPrev.hidden = true;
    if (el.convNext) el.convNext.hidden = true;
    return;
  }
  const manual = state.convMode === "manual";
  const phase = !play.running ? "idle" : (play.paused ? "paused" : "playing");
  const stepping = manual && play.running;

  el.convPlay.dataset.on = String(phase === "playing");
  el.convPlay.dataset.state = phase;

  if (!play.running) {
    el.convPlay.textContent = manual ? "▶︎  Gespräch starten" : "▶︎  Ganzes Gespräch";
  } else if (!manual) {
    el.convPlay.textContent = phase === "playing" ? "❚❚  Pause" : "▶︎  Weiter";
  }

  // One advance control, never two: while it is down by the transcript the top
  // one is gone rather than sitting there saying the same thing.
  el.convPlay.hidden = stepping;
  if (el.convAdvance) el.convAdvance.hidden = !stepping;
  if (el.convAdvanceBtn && stepping) {
    el.convAdvanceBtn.textContent =
      atLastLine() && play.phase === "waiting" ? "✓  Gespräch beenden" : "Nächster Satz →";
  }

  if (el.convStop) el.convStop.hidden = !play.running;
  if (el.convPrev) el.convPrev.hidden = !play.running;
  // Forward is what the advance button already does in manual mode; two
  // controls for one move is just a thing to wonder about.
  if (el.convNext) el.convNext.hidden = !play.running || manual;
}

/**
 * Switch between stepping and running through, without losing your place.
 *
 * Flipping mid-dialogue does the obvious thing in both directions: going
 * automatic releases a line that was waiting, and going manual cancels the gap
 * before the next line so the dialogue stops where it stands.
 */
function setConvMode(mode) {
  if (mode !== "manual" && mode !== "auto" && mode !== "video") return;
  if (mode === "video" && !openFilm()) return;
  if (mode === state.convMode) return;
  const leaving = effectiveConvMode();
  state.convMode = mode;
  saveConvMode();
  renderConvMode();

  /* Going to the film stops whatever the voices were doing: two readings of the
     same dialogue at once is the one thing this panel must never do. Coming back
     from it leaves the transcript where it was, unplayed. */
  if (mode === "video") stopPlayback();
  renderConvDisplay();
  if (leaving === "video" && mode !== "video") {
    renderPlayControls();
    return;
  }

  if (play.running && !play.paused) {
    if (mode === "manual" && play.phase === "gap") {
      clearTimeout(play.timer);
      play.timer = null;
      play.phase = "waiting";
    } else if (mode === "auto" && play.phase === "waiting") {
      scheduleNextLine(play.index);
    }
  }
  renderPlayControls();
}

function stopPlayback() {
  /* Whatever stops the voices stops the film: this is what the mode tabs and
     the back link both go through, and a video still talking from a panel you
     have navigated away from is a bug you hear before you find. */
  if (el.convVideo && !el.convVideo.paused) el.convVideo.pause();

  play.running = false;
  play.paused = false;
  play.phase = null;
  play.exact = false;
  play.index = -1;
  clearTimeout(play.timer);
  stopSpeaking();
  renderPlayControls();
  // Leaving reveal mode puts every line back on screen, so the dialogue can
  // still be read and searched when it is not playing.
  if (el.convLines) {
    delete el.convLines.dataset.reveal;
    delete el.convLines.dataset.paused;
    delete el.convLines.dataset.waiting;
  }
  Array.prototype.forEach.call(document.querySelectorAll(".conv-line"), (n) => {
    delete n.dataset.now;
    delete n.dataset.pending;
    delete n.dataset.typing;
  });
}

function convMatches() {
  const query = state.convQuery.trim().toLowerCase();
  return CONVERSATIONS.filter((c) => {
    if (state.convTopic !== "alle" && c.topic !== state.convTopic) return false;
    if (!query) return true;
    if ((c.title + " " + c.titleEn).toLowerCase().indexOf(query) >= 0) return true;
    return c.lines.some((l) => (l.de + " " + l.en).toLowerCase().indexOf(query) >= 0);
  });
}

function topicById(id) {
  return CONV_TOPICS.find((t) => t.id === id) || { name: id, tone: "var(--accent)" };
}

function renderConvTopics() {
  const counts = {};
  CONVERSATIONS.forEach((c) => { counts[c.topic] = (counts[c.topic] || 0) + 1; });
  const chips = [{ id: "alle", name: "Alle", tone: "var(--accent)", n: CONVERSATIONS.length }]
    .concat(CONV_TOPICS.filter((t) => counts[t.id])
      .map((t) => ({ id: t.id, name: t.name, tone: t.tone, n: counts[t.id] })));

  el.convTopics.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = chip.name + " (" + chip.n + ")";
    btn.style.setProperty("--tone", chip.tone);
    btn.setAttribute("aria-pressed", String(state.convTopic === chip.id));
    btn.addEventListener("click", () => { state.convTopic = chip.id; renderConvList(); });
    el.convTopics.appendChild(btn);
  });
}

function renderConvList() {
  stopPlayback();
  el.convDetail.hidden = true;
  el.convListWrap.hidden = false;
  renderConvTopics();

  const list = convMatches();
  el.convCount.textContent = list.length === CONVERSATIONS.length
    ? CONVERSATIONS.length + " Gespräche"
    : list.length + " von " + CONVERSATIONS.length;

  if (!list.length) {
    el.convList.innerHTML = '<div class="vocab-empty">Nichts gefunden.</div>';
    return;
  }

  el.convList.innerHTML = list.map((c) => {
    const topic = topicById(c.topic);
    return '<button type="button" class="conv-card" data-id="' + c.id + '" style="--tone:' + topic.tone + '">' +
      '<span class="conv-card-top">' +
        '<span class="conv-card-topic">' + escapeHtml(topic.name) + '</span>' +
        '<span class="conv-card-len">' + c.lines.length + ' Sätze</span>' +
      '</span>' +
      '<span class="conv-card-title">' + escapeHtml(c.title) + '</span>' +
      '<span class="conv-card-en gloss">' + escapeHtml(c.titleEn) + '</span>' +
    '</button>';
  }).join("");
}

function openConversation(id) {
  const c = CONVERSATIONS.find((x) => x.id === id);
  if (!c) return;
  stopPlayback();
  play.id = id;

  const topic = topicById(c.topic);
  el.convListWrap.hidden = true;
  el.convDetail.hidden = false;
  el.convDetail.style.setProperty("--tone", topic.tone);
  el.convTitle.textContent = c.title;
  el.convMeta.innerHTML =
    '<span class="conv-topic-chip">' + escapeHtml(topic.name) + '</span>' +
    '<span class="conv-card-en gloss">' + escapeHtml(c.titleEn) + '</span>';

  const voices = voiceLabels();
  const recorded = !!AUDIO[c.id];
  el.convVoices.textContent = recorded
    ? "Aufnahme"
    : (voices ? "Stimmen: " + voices : "keine deutsche Stimme installiert");
  el.convVoices.dataset.recorded = String(recorded);

  el.convLines.innerHTML = c.lines.map((line, i) =>
    '<div class="conv-line" data-i="' + i + '" data-who="' + escapeHtml(line.s) + '">' +
      '<span class="conv-who">' + avatarFor(line.s) +
        '<span class="conv-name">' + escapeHtml(line.s) + '</span>' +
      '</span>' +
      '<span class="conv-bubble">' +
        '<span class="conv-typing" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="conv-de">' + escapeHtml(line.de) + '</span>' +
        '<span class="conv-en gloss">' + escapeHtml(line.en) + '</span>' +
      '</span>' +
      // Two different things, so two buttons: hear this one sentence, or take
      // the dialogue back to it and carry on from there.
      '<span class="conv-actions">' +
        '<button type="button" class="speak-btn" data-i="' + i + '" ' +
          'title="Satz vorlesen" aria-label="Satz vorlesen">' + SPEAKER_SVG + '</button>' +
        '<button type="button" class="speak-btn repeat-btn" data-repeat="' + i + '" ' +
          'title="Ab hier wiederholen" aria-label="Ab hier wiederholen">' + REPEAT_SVG + '</button>' +
      '</span>' +
    '</div>'
  ).join("");

  /* The Video button and the transcript both depend on which dialogue this is,
     so they are settled after the panel is filled and before it is scrolled to. */
  renderConvMode();
  renderConvDisplay();
  renderPlayControls();

  el.convDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** The line as the speech module wants it: text, speaker, and a clip if rendered. */
function audibleLine(conversation, index) {
  const line = conversation.lines[index];
  return { de: line.de, s: line.s, clip: clipFor(conversation.id, index) };
}

/**
 * Play the whole dialogue, one line at a time.
 *
 * Two things are deliberate here. Sequencing hangs off the utterance's own end
 * event rather than a timer, because sentence length is a poor predictor of
 * speaking time and the two voices differ. And each line gets a short "typing"
 * beat before it appears: it paces the conversation like a real exchange, and
 * it stops you reading the reply before you have heard the question, which is
 * what makes a fully visible transcript useless as listening practice.
 */
function playFrom(index) {
  const c = CONVERSATIONS.find((x) => x.id === play.id);
  if (!c || !play.running) return stopPlayback();
  if (index >= c.lines.length) return stopPlayback();

  play.index = index;
  const node = el.convLines.querySelector('.conv-line[data-i="' + index + '"]');
  if (!node) return stopPlayback();

  Array.prototype.forEach.call(el.convLines.querySelectorAll(".conv-line"), (n) => {
    delete n.dataset.now;
  });

  // Show the bubble with dots in it, then swap the dots for the line.
  delete node.dataset.pending;
  node.dataset.typing = "true";
  if (el.convLines) delete el.convLines.dataset.waiting;
  node.scrollIntoView({ behavior: "smooth", block: "center" });

  play.phase = "beat";
  const beat = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 420;
  play.timer = setTimeout(() => {
    if (!play.running || play.paused) return;
    delete node.dataset.typing;
    node.dataset.now = "true";
    speakCurrent();
  }, beat);
}

/** The breath between two turns, after which the next line starts by itself. */
function scheduleNextLine(index) {
  play.phase = "gap";
  clearTimeout(play.timer);
  play.timer = setTimeout(() => {
    if (play.running && !play.paused) playFrom(index + 1);
  }, 350);
}

/**
 * Speak the line playback is standing on, then either move on or stand still.
 *
 * Which of the two is the whole difference between the modes, and it is decided
 * here rather than at the start, so switching mode mid-dialogue takes effect on
 * the very next line instead of at the next restart.
 */
function speakCurrent() {
  const c = currentConversation();
  if (!c || !play.running) return;
  const index = play.index;

  play.phase = "speaking";
  renderPlayControls();
  sayLine(audibleLine(c, index), () => {
    // A pause cancels the browser voice, which fires this callback on its way
    // out — so the guard has to check both flags, or pausing would skip a line.
    if (!play.running || play.paused) return;

    if (state.convMode === "manual") {
      play.phase = "waiting";
      if (el.convLines) el.convLines.dataset.waiting = "true";
      renderPlayControls();
      return;
    }
    scheduleNextLine(index);
  });
}

function startPlayback() {
  play.running = true;
  play.paused = false;
  renderPlayControls();

  // Hide the whole transcript, then let playback bring it back line by line.
  el.convLines.dataset.reveal = "true";
  Array.prototype.forEach.call(el.convLines.querySelectorAll(".conv-line"), (n) => {
    n.dataset.pending = "true";
    delete n.dataset.typing;
    delete n.dataset.now;
  });

  playFrom(0);
}

function pausePlayback() {
  if (!play.running || play.paused) return;
  play.paused = true;
  clearTimeout(play.timer);
  play.timer = null;
  // Only a line that is actually being spoken can be held mid-sentence; during
  // the typing beat or the gap there is nothing playing to hold.
  play.exact = play.phase === "speaking" ? pauseSpeaking() : false;
  if (play.phase !== "speaking") stopSpeaking();
  if (el.convLines) el.convLines.dataset.paused = "true";
  renderPlayControls();
}

function resumePlayback() {
  if (!play.running || !play.paused) return;
  play.paused = false;
  if (el.convLines) delete el.convLines.dataset.paused;
  renderPlayControls();

  if (play.phase === "speaking") {
    if (play.exact && resumeClip()) return;   // a clip continues mid-sentence
    return speakCurrent();                    // the browser voice repeats the line
  }
  // Paused between turns: carry on with the line that comes next. Paused during
  // the typing beat: that line has not been heard yet, so it still starts here.
  playFrom(play.phase === "gap" ? play.index + 1 : play.index);
}

/**
 * What the main button and the space bar do.
 *
 * Three different jobs behind one control, but only one of them is ever on
 * offer at a time: start it, step it on, or hold it. Stepping on while a line is
 * still being spoken cuts it short and moves — an impatient tap should not have
 * to wait for the sentence to finish.
 */
function togglePlayback() {
  if (!play.running) return startPlayback();
  if (state.convMode === "manual") return stepLine(1);
  return play.paused ? resumePlayback() : pausePlayback();
}

/**
 * Go back (or forward) to a line and carry on from there.
 *
 * This is the thing you actually want from listening practice: you missed a
 * sentence two turns ago and you want to hear it again *in context*, not as an
 * isolated clip. So the reload button restarts playback at that line rather than
 * replaying it on its own — the speaker button beside it is there for the
 * one-sentence case.
 *
 * Lines after the target go back into hiding. If they stayed on screen the
 * reveal would be pointless from then on: you would be reading ahead of what you
 * are hearing, which is exactly what the mode exists to prevent.
 */
function repeatFrom(index) {
  const c = CONVERSATIONS.find((x) => x.id === play.id);
  if (!c) return;
  if (index < 0 || index >= c.lines.length) return stopPlayback();

  clearTimeout(play.timer);
  stopSpeaking();

  play.running = true;
  play.paused = false;
  play.exact = false;
  if (el.convLines) {
    delete el.convLines.dataset.paused;
    el.convLines.dataset.reveal = "true";
  }
  Array.prototype.forEach.call(el.convLines.querySelectorAll(".conv-line"), (n) => {
    delete n.dataset.typing;
    delete n.dataset.now;
    if (Number(n.dataset.i) >= index) n.dataset.pending = "true";
    else delete n.dataset.pending;
  });

  renderPlayControls();
  playFrom(index);
}

/** One line back, one line on — the same move as the reload buttons, from the bar. */
function stepLine(delta) {
  if (!play.running) return;
  repeatFrom(play.index + delta);
}

el.convList.addEventListener("click", (event) => {
  const card = event.target.closest(".conv-card");
  if (card) openConversation(card.dataset.id);
});

el.convLines.addEventListener("click", (event) => {
  const repeat = event.target.closest(".repeat-btn");
  if (repeat) return repeatFrom(Number(repeat.dataset.repeat));

  const btn = event.target.closest(".speak-btn");
  if (!btn) return;
  const c = CONVERSATIONS.find((x) => x.id === play.id);
  if (!c) return;
  stopPlayback();
  sayLineOnce(audibleLine(c, Number(btn.dataset.i)));   // an explicit tap always speaks
});

el.convBack.addEventListener("click", renderConvList);
el.convPlay.addEventListener("click", togglePlayback);
if (el.convAdvanceBtn) el.convAdvanceBtn.addEventListener("click", togglePlayback);
if (el.convMode) {
  el.convMode.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-cmode]");
    if (btn) setConvMode(btn.dataset.cmode);
  });
}
if (el.convStop) el.convStop.addEventListener("click", stopPlayback);
if (el.convPrev) el.convPrev.addEventListener("click", () => stepLine(-1));
if (el.convNext) el.convNext.addEventListener("click", () => stepLine(1));

/*
 * Space pauses. It is the one shortcut every media player shares, and pausing is
 * the thing you reach for mid-sentence — repeating a line you did not catch —
 * which is exactly when hunting for a button is worst.
 */
document.addEventListener("keydown", (event) => {
  if (state.mode !== "conversation" || !play.running) return;
  if (event.target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName)) return;

  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault();
    togglePlayback();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepLine(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    stepLine(1);
  }
});

let convSearchTimer = null;
el.convSearch.addEventListener("input", () => {
  clearTimeout(convSearchTimer);
  convSearchTimer = setTimeout(() => {
    state.convQuery = el.convSearch.value;
    renderConvList();
  }, 150);
});

/* ------------------------------------------------------------------ */
/* Global controls                                                     */
/* ------------------------------------------------------------------ */

el.soundToggle.addEventListener("click", () => {
  state.ttsOn = !state.ttsOn;
  el.soundToggle.dataset.on = String(state.ttsOn);
  el.soundToggle.setAttribute("aria-pressed", String(state.ttsOn));
  el.soundToggleLabel.textContent = state.ttsOn ? "Ton an" : "Ton aus";
  // Turning the sound off stops the voices, but a film is also a picture:
  // it keeps running with the subtitles and goes quiet, rather than halting.
  if (effectiveConvMode() === "video") { syncFilmSound(false); renderFilmNote(); }
  else if (!state.ttsOn) stopPlayback();
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

initVoices();

state.convMode = loadConvMode();
renderConvMode();
renderPlayControls();

/*
 * Diktat and Satzbau own their screens, so they get the handles they need and
 * the few things only app.js knows — which mode is showing, whether sound is
 * on, and how to open a grammar topic.
 */
initDictation({
  getMode: () => state.mode,
  isSoundOn: () => state.ttsOn
});
initWordOrder({
  getMode: () => state.mode,
  getSub: () => state.woSub,
  isSoundOn: () => state.ttsOn,
  openGrammarTopic: openGrammarTopic
});
initDialogue({
  getMode: () => state.mode,
  getSub: () => state.woSub,
  isSoundOn: () => state.ttsOn
});

document.body.dataset.hideEn = state.showEn ? "false" : "true";
setMode(state.mode);
