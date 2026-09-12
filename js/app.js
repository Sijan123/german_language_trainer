import { VOCAB, VOCAB_THEMES, allWords, TYPE_LABEL } from "./vocab.js";
import { GRAMMAR, grammarById } from "./grammar-topics.js";
import { CONV_TOPICS, CONVERSATIONS } from "./conversations.js";
import { EN, MAIN_EN } from "./sentences-en.js";
import { initVoices, speak, speakLine, stopSpeaking } from "./speech.js";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const state = {
  ttsOn: true,
  mode: "conversation",     // "conversation" | "vocab" | "quiz" | "grammar"
  vocabTheme: "alle",
  vocabQuery: "",
  convTopic: "alle",
  convQuery: "",
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

  screenVocab: $("screen-vocab"),
  vocabSearch: $("vocab-search"),
  vocabCount: $("vocab-count"),
  vocabThemes: $("vocab-themes"),
  vocabList: $("vocab-list"),

  screenQuiz: $("screen-quiz"),
  quizThemes: $("quiz-themes"),
  quizScore: $("quiz-score"),
  quizReset: $("quiz-reset"),
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
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}


/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  state.mode = mode;
  document.body.dataset.mode = mode;   // the English switch keys off this
  Array.prototype.forEach.call(el.modeTabs.querySelectorAll("button"), (b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });

  stopPlayback();

  el.screenConv.hidden = mode !== "conversation";
  el.screenVocab.hidden = mode !== "vocab";
  el.screenQuiz.hidden = mode !== "quiz";
  el.screenGrammar.hidden = mode !== "grammar";

  if (mode === "conversation") renderConvList();
  if (mode === "vocab") renderVocab();
  if (mode === "quiz") { if (quiz.word) renderQuiz(); else nextQuestion(); }
  if (mode === "grammar") renderGrammar();
}

/* ------------------------------------------------------------------ */
/* Vocabs                                                              */
/* ------------------------------------------------------------------ */

const SPEAKER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>' +
  '<path d="M15.5 8.5a5 5 0 0 1 0 7"></path></svg>';

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


/**
 * English gloss for a German example sentence.
 *
 * A Nebensatz gloss is derived rather than stored: the weil-clause says the same
 * thing as its `simple` sentence, only with the verb at the end. So
 * "Ich brauche gute Schuhe, weil ich jeden Morgen laufe" is the English for the
 * main clause, plus "because", plus the gloss of "Ich laufe jeden Morgen".
 */

/*
 * Embedding a sentence drops its opening capital — "My family is big" becomes
 * "… that my family is big" — except for words English capitalises anywhere in
 * a sentence. Three kinds have to survive: "I" and its contractions; the days
 * and months; and proper nouns, which we don't list by hand but read off the
 * glosses themselves — a name like "Berlin" or "December" also shows up
 * capitalised in the middle of some other sentence, an ordinary word never does.
 */
const ALWAYS_CAPITAL = (() => {
  const set = new Set([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
    "january", "february", "march", "april", "may", "june", "july",
    "august", "september", "october", "november", "december"
  ]);
  for (const value of Object.values(EN)) {
    const words = value.split(/\s+/);
    for (let i = 1; i < words.length; i++) {
      const w = words[i].replace(/[^A-Za-z0-9']/g, "");
      if (w && w[0] >= "A" && w[0] <= "Z") set.add(w.toLowerCase());
    }
  }
  return set;
})();

function uncapitalise(text) {
  const end = text.search(/[^A-Za-z0-9']/);
  const first = end === -1 ? text : text.slice(0, end);
  const key = first.toLowerCase();
  if (key === "i" || key.startsWith("i'") || ALWAYS_CAPITAL.has(key)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function glossFor(sentence, simpleSentence) {
  if (!sentence) return "";
  const direct = EN[sentence];
  if (direct) return direct;

  const split = sentence.indexOf(", weil ");
  if (split > 0 && simpleSentence) {
    const base = EN[simpleSentence];
    const main = MAIN_EN[sentence.slice(0, split)];
    if (base && main) return main + " because " + uncapitalise(base);
  }
  return "";
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
    speak(sayBtn.dataset.say, true);        // explicit request: always audible
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
  if (!open) speak(item.querySelector(".vocab-de").textContent, state.ttsOn);
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

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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

function nextQuestion() {
  const pool = quizPool();
  if (pool.length < 4) {
    quiz.word = null;
    renderQuiz();
    return;
  }

  const avoid = Math.min(25, Math.floor(pool.length / 3));
  let word = pickOne(pool);
  for (let tries = 0; tries < 12 && quiz.recent.indexOf(word.de) >= 0; tries++) word = pickOne(pool);

  quiz.recent.push(word.de);
  while (quiz.recent.length > avoid) quiz.recent.shift();

  quiz.word = word;
  quiz.answered = false;
  quiz.options = shuffle([word].concat(distractorsFor(word, pool)));
  renderQuiz();
  speak(word.de, state.ttsOn);
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

function renderQuiz() {
  renderThemeChips(el.quizThemes, quiz.theme, (id) => {
    quiz.theme = id;
    quiz.recent = [];
    nextQuestion();
  });
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
  saveScore();
  renderScore();

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
    (gloss ? '<span class="example-en">' + escapeHtml(gloss) + '</span>' : "");
  el.quizFeedback.hidden = false;
  el.quizNext.hidden = false;
  el.quizNext.focus();

  if (!correct) speak(quiz.word.de, state.ttsOn);
}

el.quizOptions.addEventListener("click", (event) => {
  const btn = event.target.closest(".quiz-opt");
  if (btn) answerQuiz(Number(btn.dataset.i));
});

el.quizNext.addEventListener("click", nextQuestion);
el.quizSay.addEventListener("click", () => quiz.word && speak(quiz.word.de, true));

el.quizReset.addEventListener("click", () => {
  quiz.right = 0;
  quiz.wrong = 0;
  saveScore();
  renderScore();
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
  if (sayBtn) { event.stopPropagation(); speak(sayBtn.dataset.say, true); return; }

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

const play = { id: null, index: -1, running: false };

function stopPlayback() {
  play.running = false;
  play.index = -1;
  stopSpeaking();
  if (el.convPlay) el.convPlay.dataset.on = "false";
  if (el.convPlay) el.convPlay.textContent = "▶  Ganzes Gespräch";
  Array.prototype.forEach.call(document.querySelectorAll(".conv-line[data-now]"), (n) => {
    delete n.dataset.now;
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

  el.convLines.innerHTML = c.lines.map((line, i) =>
    '<div class="conv-line" data-i="' + i + '" data-who="' + escapeHtml(line.s) + '">' +
      '<span class="conv-who">' + escapeHtml(line.s) + '</span>' +
      '<span class="conv-bubble">' +
        '<span class="conv-de">' + escapeHtml(line.de) + '</span>' +
        '<span class="conv-en gloss">' + escapeHtml(line.en) + '</span>' +
      '</span>' +
      '<button type="button" class="speak-btn" data-say="' + escapeHtml(line.de) + '" ' +
        'title="Satz vorlesen" aria-label="Satz vorlesen">' + SPEAKER_SVG + '</button>' +
    '</div>'
  ).join("");

  el.convDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Play the whole dialogue, one line at a time.
 *
 * Sequencing has to hang off the utterance's own `end` event — a timer guessed
 * from sentence length drifts badly, and the two voices read at different
 * speeds. A line that fails to speak still advances, so a missing German voice
 * cannot strand the playback half way down the conversation.
 */
function playFrom(index) {
  const c = CONVERSATIONS.find((x) => x.id === play.id);
  if (!c || !play.running) return stopPlayback();
  if (index >= c.lines.length) return stopPlayback();

  play.index = index;
  Array.prototype.forEach.call(el.convLines.querySelectorAll(".conv-line"), (n) => {
    if (Number(n.dataset.i) === index) n.dataset.now = "true";
    else delete n.dataset.now;
  });

  const node = el.convLines.querySelector('.conv-line[data-i="' + index + '"]');
  if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });

  speakLine(c.lines[index].de, () => {
    if (!play.running) return;
    setTimeout(() => play.running && playFrom(index + 1), 350);   // a beat between turns
  });
}

function togglePlayback() {
  if (play.running) return stopPlayback();
  play.running = true;
  el.convPlay.dataset.on = "true";
  el.convPlay.textContent = "■  Stopp";
  playFrom(0);
}

el.convList.addEventListener("click", (event) => {
  const card = event.target.closest(".conv-card");
  if (card) openConversation(card.dataset.id);
});

el.convLines.addEventListener("click", (event) => {
  const btn = event.target.closest(".speak-btn");
  if (!btn) return;
  stopPlayback();
  speak(btn.dataset.say, true);       // an explicit tap always speaks
});

el.convBack.addEventListener("click", renderConvList);
el.convPlay.addEventListener("click", togglePlayback);

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
  if (!state.ttsOn) stopPlayback();
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

initVoices();
document.body.dataset.hideEn = state.showEn ? "false" : "true";
setMode(state.mode);
