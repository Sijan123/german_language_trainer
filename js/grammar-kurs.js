/*
 * Grammatik → Kurs — the Schritte plus Neu 3 half of the Grammatik screen.
 *
 * The data lives in grammar-course.js; this file is the screen. Two levels of
 * navigation only: a row of chapter chips, and under it the open chapter with
 * its Lernschritte, its Vertiefung and its test. No list/detail page change,
 * because a chapter is one long read and pushing a whole screen for it would
 * cost a back button for nothing.
 *
 * The test is the part worth reading carefully.
 *
 * Marking is per gap and happens only when you press Prüfen. A gap you got
 * right turns green and locks — there is nothing left to do with it. A gap you
 * got wrong turns red, keeps every one of its options, and opens a Hinweis
 * underneath the sentence: the rule in one line plus one worked example of the
 * same structure in different words, so the example cannot be copied into the
 * gap. The answer itself is not there.
 *
 * Next to the Hinweis sits Antwort zeigen, in red, styled as the destructive
 * button it is. Pressing it fills the right option in and locks the gap as
 * `revealed` — a third state, counted apart from the ones you earned, because
 * a score that folds revealed answers into the total is a score that lies.
 * The chapter footer keeps the three numbers visible: richtig, offen, gezeigt.
 *
 * Option order is shuffled per render, so position never carries information,
 * and reshuffled by Nochmal, which also clears every mark including the
 * revealed ones — a chapter can always be started clean.
 *
 * Nothing is persisted. Grammar practice is not vocabulary: there is no
 * interval worth tracking here, and a half-finished test that survives a
 * reload is a half-finished test you will never finish.
 */

import { COURSE, lektionByNr, gapCount, hintFor, SOURCES } from "./grammar-course.js";
import { escapeHtml, shuffle, SPEAKER_SVG } from "./util.js";
import { sayOnce } from "./speech.js";

const $ = (id) => document.getElementById(id);

let el = null;
let openNr = 1;          // which chapter is on screen
let openTest = false;    // chapters open on the lesson; the test is a choice

/* ------------------------------------------------------------------ */
/* Kleine Bausteine                                                    */
/* ------------------------------------------------------------------ */

/*
 * Grammar text carries markup on purpose — <b> for the ending under
 * discussion, <em> for an aside. It is written by us and never by a learner,
 * so it is inserted as HTML; everything that comes from a test item or a
 * sentence goes through escapeHtml instead.
 */
const rich = (s) => String(s == null ? "" : s);

function speakBtn(de) {
  return '<button type="button" class="speak-btn" data-say="' + escapeHtml(de) +
    '" title="Vorlesen" aria-label="Satz vorlesen">' + SPEAKER_SVG + "</button>";
}

function examplesHtml(list) {
  return '<div class="grammar-examples">' + list.map((ex) =>
    '<div class="grammar-ex">' +
      '<div class="grammar-ex-text">' +
        '<span class="grammar-de">' + escapeHtml(ex.de) + "</span>" +
        '<span class="grammar-en">' + escapeHtml(ex.en) + "</span>" +
      "</div>" + speakBtn(ex.de) +
    "</div>").join("") + "</div>";
}

function tableHtml(t) {
  const head = t.cols && t.cols.some((c) => c)
    ? "<thead><tr>" + t.cols.map((c) => "<th>" + rich(c) + "</th>").join("") + "</tr></thead>"
    : "";
  const body = "<tbody>" + t.rows.map((r) =>
    "<tr>" + r.map((c) => "<td>" + rich(c) + "</td>").join("") + "</tr>").join("") + "</tbody>";
  return '<figure class="gk-table-wrap">' +
    (t.caption ? "<figcaption>" + escapeHtml(t.caption) + "</figcaption>" : "") +
    '<div class="gk-table-scroll"><table class="gk-table">' + head + body + "</table></div>" +
    "</figure>";
}

function notesHtml(list) {
  return '<ul class="gk-notes">' + list.map((n) => "<li>" + rich(n) + "</li>").join("") + "</ul>";
}

/* ------------------------------------------------------------------ */
/* Ein Lernschritt                                                     */
/* ------------------------------------------------------------------ */

function stepHtml(step) {
  const isWord = step.kind === "wortschatz";

  const label = isWord
    ? '<span class="gk-step-kind">Wortschatz &amp; Redemittel</span>'
    : '<span class="gk-step-grammar">' + escapeHtml(step.grammar) + "</span>";

  const link = step.topic
    ? '<button type="button" class="gk-topic-link" data-topic="' + escapeHtml(step.topic) +
      '">Thema nachschlagen →</button>'
    : "";

  return '<article class="gk-step" data-kind="' + (isWord ? "wortschatz" : "grammatik") + '">' +
    '<header class="gk-step-head">' +
      '<span class="gk-step-letter">' + escapeHtml(step.letter) + "</span>" +
      '<div class="gk-step-titles">' +
        '<h4 class="gk-step-title">' + escapeHtml(step.head) + "</h4>" +
        label +
      "</div>" +
    "</header>" +
    '<p class="gk-goal"><span>Lernziel</span> ' + escapeHtml(step.goal) + "</p>" +
    (step.summary ? '<p class="gk-summary">' + rich(step.summary) + "</p>" : "") +
    (step.pattern ? '<div class="grammar-pattern">' + escapeHtml(step.pattern) + "</div>" : "") +
    (step.tables ? step.tables.map(tableHtml).join("") : "") +
    (step.notes ? notesHtml(step.notes) : "") +
    (step.examples ? examplesHtml(step.examples) : "") +
    (step.watch ? '<div class="grammar-watch"><strong>Achtung:</strong> ' + rich(step.watch) + "</div>" : "") +
    link +
  "</article>";
}

function deepenHtml(block) {
  return '<article class="gk-step gk-deepen">' +
    '<header class="gk-step-head">' +
      '<span class="gk-step-letter gk-plus">+</span>' +
      '<div class="gk-step-titles">' +
        '<h4 class="gk-step-title">' + escapeHtml(block.head) + "</h4>" +
        '<span class="gk-step-grammar">' + escapeHtml(block.grammar) + "</span>" +
      "</div>" +
    "</header>" +
    '<p class="gk-source">Nach ' + escapeHtml(block.source) + "</p>" +
    '<p class="gk-summary">' + rich(block.summary) + "</p>" +
    (block.pattern ? '<div class="grammar-pattern">' + escapeHtml(block.pattern) + "</div>" : "") +
    (block.tables ? block.tables.map(tableHtml).join("") : "") +
    (block.notes ? notesHtml(block.notes) : "") +
    (block.examples ? examplesHtml(block.examples) : "") +
    (block.watch ? '<div class="grammar-watch"><strong>Achtung:</strong> ' + rich(block.watch) + "</div>" : "") +
  "</article>";
}

/* ------------------------------------------------------------------ */
/* Der Test                                                            */
/* ------------------------------------------------------------------ */

/*
 * One <select> per gap. A select rather than a text field because the answer
 * has to be among the options — this is a grammar test, not a spelling test,
 * and typing „vermise“ should not read as a grammar mistake.
 *
 * The empty first option matters: without it the browser pre-selects the first
 * real option, which would mark an untouched gap as an attempt.
 */
function gapHtml(gap, qi, gi) {
  const opts = shuffle(gap.options);
  const width = Math.max.apply(null, gap.options.map((o) => o.length));
  return '<select class="gk-gap" data-q="' + qi + '" data-g="' + gi +
    '" style="--ch:' + width + 'ch" aria-label="Lücke ' + (gi + 1) + '">' +
    '<option value="">…</option>' +
    opts.map((o) => '<option value="' + escapeHtml(o) + '">' + escapeHtml(o) + "</option>").join("") +
  "</select>";
}

function questionHtml(item, qi) {
  let gi = -1;
  const line = item.parts.map((p) => {
    if (typeof p === "string") return escapeHtml(p);
    gi += 1;
    return gapHtml(p, qi, gi);
  }).join("");

  return '<li class="gk-q" data-q="' + qi + '" data-state="open">' +
    '<div class="gk-q-line">' + line + "</div>" +
    '<p class="gk-q-en">' + escapeHtml(item.en) + "</p>" +
    '<div class="gk-q-hint" hidden></div>' +
  "</li>";
}

function testHtml(lektion) {
  return '<section class="gk-test" id="gk-test">' +
    '<header class="gk-test-head">' +
      "<h3>Test — Lektion " + lektion.nr + ": " + escapeHtml(lektion.title) + "</h3>" +
      '<p class="gk-test-note">Wähle in jedem Satz die richtige Form. <strong>Prüfen</strong> markiert ' +
        "jede Lücke richtig oder falsch — und sagt bei einer falschen Lücke nur, welche Regel gilt, " +
        "mit einem Beispiel. Die Antwort selbst steht erst da, wenn du sie dir zeigen lässt.</p>" +
    "</header>" +
    '<ol class="gk-qs">' + lektion.test.map(questionHtml).join("") + "</ol>" +
    '<div class="gk-test-actions">' +
      '<button type="button" class="btn btn-ghost" id="gk-again">Nochmal</button>' +
      '<button type="button" class="btn btn-primary" id="gk-check">Prüfen</button>' +
    "</div>" +
    '<div class="gk-score" id="gk-score" aria-live="polite"></div>' +
  "</section>";
}

/* ------------------------------------------------------------------ */
/* Prüfen, Hinweis, Antwort zeigen                                     */
/* ------------------------------------------------------------------ */

function gapOf(lektion, qi, gi) {
  let n = -1;
  for (const p of lektion.test[qi].parts) {
    if (typeof p === "string") continue;
    n += 1;
    if (n === gi) return p;
  }
  return null;
}

/*
 * The hint. Deliberately NOT the answer: the rule in one line, then one worked
 * example of the same structure in other words. Reading it tells you what to
 * think about; it does not tell you what to pick.
 */
function hintHtml(rule) {
  const h = hintFor(rule);
  if (!h) return "";
  return '<div class="gk-hint-body">' +
      '<p class="gk-hint-tip"><span class="gk-hint-label">Hinweis</span> ' + rich(h.tip) + "</p>" +
      '<p class="gk-hint-ex"><span class="gk-hint-label">So geht es</span> ' + rich(h.ex) + "</p>" +
    "</div>" +
    '<button type="button" class="btn btn-danger gk-reveal">Antwort zeigen</button>';
}

function markQuestion(lektion, li) {
  const qi = Number(li.dataset.q);
  const item = lektion.test[qi];
  const gaps = Array.prototype.slice.call(li.querySelectorAll(".gk-gap"));

  let wrong = 0, blank = 0;
  gaps.forEach((sel) => {
    if (sel.dataset.state === "ok" || sel.dataset.state === "revealed") return;
    const want = gapOf(lektion, qi, Number(sel.dataset.g)).answer;
    if (!sel.value) { blank += 1; sel.dataset.state = ""; return; }
    if (sel.value === want) {
      sel.dataset.state = "ok";
      sel.disabled = true;
    } else {
      sel.dataset.state = "bad";
      wrong += 1;
    }
  });

  const hint = li.querySelector(".gk-q-hint");
  if (wrong) {
    li.dataset.state = "bad";
    // Rebuilt rather than toggled, so Antwort zeigen is always a fresh button
    // bound to the gaps that are still wrong right now.
    hint.innerHTML = hintHtml(item.rule);
    hint.hidden = false;
  } else {
    hint.hidden = true;
    hint.innerHTML = "";
    li.dataset.state = blank ? "open" : "ok";
  }
}

/* Reveal fills in and locks every gap in this question that is still wrong. */
function revealQuestion(lektion, li) {
  const qi = Number(li.dataset.q);
  Array.prototype.forEach.call(li.querySelectorAll(".gk-gap"), (sel) => {
    if (sel.dataset.state === "ok") return;
    sel.value = gapOf(lektion, qi, Number(sel.dataset.g)).answer;
    sel.dataset.state = "revealed";
    sel.disabled = true;
  });
  const hint = li.querySelector(".gk-q-hint");
  hint.innerHTML = hintHtml(lektion.test[qi].rule).replace(
    /<button[\s\S]*$/,
    '<p class="gk-revealed-note">Antwort gezeigt — dieser Satz zählt nicht als richtig. ' +
    "Mit <strong>Nochmal</strong> kannst du ihn später neu versuchen.</p>"
  );
  li.dataset.state = "revealed";
}

function updateScore(lektion) {
  const all = gapCount(lektion);
  const sels = el.body.querySelectorAll(".gk-gap");
  let ok = 0, revealed = 0, bad = 0;
  Array.prototype.forEach.call(sels, (s) => {
    if (s.dataset.state === "ok") ok += 1;
    else if (s.dataset.state === "revealed") revealed += 1;
    else if (s.dataset.state === "bad") bad += 1;
  });
  const open = all - ok - revealed;

  const score = $("gk-score");
  if (!score) return;

  if (ok === all) {
    score.dataset.tone = "ok";
    score.innerHTML = "<strong>" + all + " von " + all + " richtig.</strong> " +
      "Die ganze Lektion sitzt — nichts gezeigt, nichts offen.";
    return;
  }
  if (!ok && !revealed && !bad) {
    score.dataset.tone = "neutral";
    score.textContent = all + " Lücken. Noch nichts geprüft.";
    return;
  }

  score.dataset.tone = bad ? "bad" : "neutral";
  score.innerHTML =
    '<span class="gk-count gk-count-ok">' + ok + " richtig</span>" +
    '<span class="gk-count gk-count-bad">' + bad + " falsch</span>" +
    '<span class="gk-count">' + Math.max(0, open - bad) + " offen</span>" +
    (revealed ? '<span class="gk-count gk-count-rev">' + revealed + " gezeigt</span>" : "") +
    (bad ? '<span class="gk-score-note">Die roten Lücken noch einmal — der Hinweis steht darunter.</span>' : "");
}

/* ------------------------------------------------------------------ */
/* Rendern                                                             */
/* ------------------------------------------------------------------ */

function renderChips() {
  el.chips.innerHTML = COURSE.map((l) =>
    '<button type="button" data-nr="' + l.nr + '" style="--tone:' + l.tone + '"' +
    ' aria-pressed="' + (l.nr === openNr) + '">' +
      "Lektion " + l.nr + '<span class="gk-chip-title">' + escapeHtml(l.title) + "</span>" +
    "</button>").join("");
}

function renderChapter() {
  const l = lektionByNr(openNr);
  if (!l) return;

  const grammarSteps = l.steps.filter((s) => s.kind !== "wortschatz").length;

  el.body.innerHTML =
    '<div class="gk-chapter" style="--tone:' + l.tone + '">' +
      '<header class="gk-chapter-head">' +
        '<span class="gk-kicker">Schritte plus Neu 3 · A2.1 · Lektion ' + l.nr + "</span>" +
        "<h3>" + escapeHtml(l.title) + '<small>' + escapeHtml(l.en) + "</small></h3>" +
        '<p class="gk-focus">' + escapeHtml(l.focus) + "</p>" +
        '<p class="gk-chapter-meta">' + grammarSteps + " Grammatik-Schritte · " +
          l.deepen.length + " Vertiefungen · " + gapCount(l) + " Testlücken</p>" +
      "</header>" +

      '<div class="gk-sub" role="group" aria-label="Lernen oder testen">' +
        '<button type="button" data-view="lernen" aria-pressed="' + !openTest + '">Lernen</button>' +
        '<button type="button" data-view="test" aria-pressed="' + openTest + '">Test</button>' +
      "</div>" +

      (openTest
        ? testHtml(l)
        : '<div class="gk-steps">' + l.steps.map(stepHtml).join("") +
          '<h4 class="gk-deepen-head">Vertiefung' +
            '<small>Dieselben Themen, weiter gefasst — aus den anderen A2.1-Lehrwerken</small>' +
          "</h4>" +
          l.deepen.map(deepenHtml).join("") + "</div>") +
    "</div>";

  if (openTest) updateScore(l);
}

function renderSources() {
  el.sources.innerHTML =
    '<button type="button" class="gk-sources-toggle" aria-expanded="false">Lernmaterial &amp; Quellen</button>' +
    '<div class="gk-sources-body" hidden><ul>' +
    SOURCES.map((s) =>
      "<li><a href=" + '"' + escapeHtml(s.url) + '" target="_blank" rel="noopener">' +
        escapeHtml(s.name) + "</a>" +
        '<span class="gk-src-pub">' + escapeHtml(s.pub) + "</span>" +
        '<span class="gk-src-role">' + escapeHtml(s.role) + "</span></li>").join("") +
    "</ul></div>";
}

/* ------------------------------------------------------------------ */
/* Verdrahten                                                          */
/* ------------------------------------------------------------------ */

export function initGrammarKurs(hooks) {
  el = {
    root: $("gk-root"),
    chips: $("gk-chips"),
    body: $("gk-body"),
    sources: $("gk-sources")
  };
  if (!el.root) return;

  el.chips.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-nr]");
    if (!btn) return;
    openNr = Number(btn.dataset.nr);
    openTest = false;
    renderChips();
    renderChapter();
    el.root.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  el.sources.addEventListener("click", (event) => {
    const t = event.target.closest(".gk-sources-toggle");
    if (!t) return;
    const body = el.sources.querySelector(".gk-sources-body");
    const open = t.getAttribute("aria-expanded") === "true";
    t.setAttribute("aria-expanded", String(!open));
    body.hidden = open;
  });

  el.body.addEventListener("click", (event) => {
    const say = event.target.closest(".speak-btn");
    if (say) { sayOnce(say.dataset.say, "Shruti", true); return; }

    const topic = event.target.closest(".gk-topic-link");
    if (topic && hooks && hooks.openTopic) { hooks.openTopic(topic.dataset.topic); return; }

    const sub = event.target.closest(".gk-sub button[data-view]");
    if (sub) {
      openTest = sub.dataset.view === "test";
      renderChapter();
      return;
    }

    const l = lektionByNr(openNr);

    if (event.target.closest("#gk-check")) {
      Array.prototype.forEach.call(el.body.querySelectorAll(".gk-q"), (li) => markQuestion(l, li));
      updateScore(l);
      const firstBad = el.body.querySelector('.gk-q[data-state="bad"]');
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (event.target.closest("#gk-again")) {
      renderChapter();            // fresh selects, reshuffled options, all marks gone
      return;
    }

    const reveal = event.target.closest(".gk-reveal");
    if (reveal) {
      revealQuestion(l, reveal.closest(".gk-q"));
      updateScore(l);
      return;
    }
  });

  // Choosing a new option clears that gap's red mark, so the colour always
  // reflects the last thing you were told and not the last thing you tried.
  el.body.addEventListener("change", (event) => {
    const sel = event.target.closest(".gk-gap");
    if (!sel || sel.dataset.state !== "bad") return;
    sel.dataset.state = "";
    const li = sel.closest(".gk-q");
    if (!li.querySelector('.gk-gap[data-state="bad"]')) {
      li.dataset.state = "open";
      const hint = li.querySelector(".gk-q-hint");
      hint.hidden = true;
      hint.innerHTML = "";
    }
    updateScore(lektionByNr(openNr));
  });
}

export function renderGrammarKurs() {
  if (!el || !el.root) return;
  if (el.root.dataset.rendered !== "true") {
    renderChips();
    renderSources();
    el.root.dataset.rendered = "true";
  }
  if (!el.body.firstChild) renderChapter();
}

/** Open a chapter from outside — used by the chapter links in the Themen list. */
export function openLektion(nr) {
  openNr = Number(nr);
  openTest = false;
  renderChips();
  renderChapter();
}
