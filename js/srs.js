/*
 * Spaced repetition — five Leitner boxes over everything that can be practised.
 *
 * The problem this solves: a uniform random draw from 1009 words never
 * converges. You answer "der Wecker" for the twentieth time and still have not
 * met the twelve words you actually don't know. A box system fixes that by
 * making the interval a function of how well you already know the item — get it
 * right and it goes away for longer, get it wrong and it comes straight back.
 *
 * One store serves all three practising modes, with the item kind in the key:
 *
 *   v:<headword>        a vocabulary word   (Quiz)
 *   d:<conv id>:<line>  a dialogue line     (Diktat)
 *   s:<sentence>        a sentence          (Satzbau)
 *
 * Knowing a word well enough to recognise it in the Quiz says nothing about
 * being able to spell it from dictation, so the same word tracked by two modes
 * is deliberately two records rather than one.
 *
 * Grades are three-valued, not two. "near" exists because a dictation that is
 * right except for an umlaut and a comma is not the same event as not knowing
 * the sentence at all: it holds its box instead of being promoted, and comes
 * back on that box's own schedule.
 */

const KEY = "a2trainer.srs.v1";
const DAY = 86400000;

/*
 * Days until an item in each box is due again. Box 1 is due immediately — a
 * wrong answer should come back inside the same session, once a few other items
 * have been in between, which is what the `recent` list in pick() arranges.
 */
const INTERVALS = [0, 1, 3, 7, 21];
export const MAX_BOX = INTERVALS.length;

function today() {
  return Math.floor(Date.now() / DAY);
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

/*
 * Record shape, kept short because there is one per practised item and they all
 * ride in a single localStorage string:
 *
 *   b    box, 1..5
 *   due  day number this item is next wanted
 *   r/w  right and wrong tallies, for the strip and for finding leeches
 *   k    "nearly" tallies
 *   n    day last seen
 */
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    const items = raw && typeof raw === "object" ? raw.items : null;
    return items && typeof items === "object" ? items : {};
  } catch (e) {
    return {};            // private window, blocked storage — practise anyway
  }
}

let store = load();
let saveTimer = null;

function flush() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, items: store }));
  } catch (e) {
    /* Progress is a convenience. A full or blocked store must not break a
       session that is otherwise working. */
  }
}

/* Answers arrive one keystroke apart at worst; writing the whole store on each
   one is wasteful, and losing the last 400 ms of it costs a single grade. */
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(flush, 400);
}

window.addEventListener("pagehide", () => { if (saveTimer) flush(); });

/* ------------------------------------------------------------------ */
/* Grading                                                             */
/* ------------------------------------------------------------------ */

export function recordFor(key) {
  return store[key] || null;
}

export function boxOf(key) {
  const rec = store[key];
  return rec ? rec.b : 0;         // 0 means never seen
}

/**
 * Grade an answer. `result` is "right", "near" or "wrong".
 *
 * Right promotes one box, wrong drops all the way back to box 1 rather than one
 * step down. That is the whole point of a Leitner system: an item you have just
 * failed is not "slightly less known", it is unknown, and the schedule should
 * treat it that way.
 */
export function grade(key, result) {
  const t = today();
  const rec = store[key] || { b: 1, due: t, r: 0, w: 0, k: 0, n: t };

  if (result === "right") {
    rec.r++;
    rec.b = Math.min(MAX_BOX, rec.b + 1);
  } else if (result === "wrong") {
    rec.w++;
    rec.b = 1;
  } else {
    rec.k++;                       // "near" — hold the box, come back on its own schedule
  }

  rec.n = t;
  rec.due = t + INTERVALS[rec.b - 1];
  store[key] = rec;
  save();
  return rec;
}

/**
 * When this item comes back, in words.
 *
 * Worth showing after every answer: the box number on its own means nothing to
 * a learner, but "Fach 3 von 5 · in 3 Tagen wieder" explains the whole system
 * in passing and makes a promotion feel like the progress it is.
 */
export function dueLabel(rec) {
  if (!rec) return "";
  const days = rec.due - today();
  if (days <= 0) return "gleich noch einmal";
  if (days === 1) return "morgen wieder";
  return "in " + days + " Tagen wieder";
}

/** Forget one item. */
export function forget(key) {
  if (store[key]) { delete store[key]; save(); }
}

/** Wipe everything. The UI asks first. */
export function resetAll() {
  store = {};
  flush();
}

/* ------------------------------------------------------------------ */
/* Choosing what to ask next                                           */
/* ------------------------------------------------------------------ */

/** Sort a pool into the three buckets the picker chooses from. */
function buckets(items, keyOf) {
  const t = today();
  const due = [], fresh = [], later = [];
  for (const item of items) {
    const rec = store[keyOf(item)];
    if (!rec) fresh.push(item);
    else if (rec.due <= t) due.push(item);
    else later.push(item);
  }
  return { due, fresh, later };
}

/**
 * The next item to practise.
 *
 * Review wins most of the time but not every time. A queue that serves reviews
 * until the last one is cleared means a learner with 40 overdue words meets no
 * new material for a week, which is how people quit; one new item in four keeps
 * the pool growing without letting the backlog rot.
 *
 * Within the due bucket the lowest box goes first — the words you keep getting
 * wrong — and among equals, the longest overdue. The head of that order is then
 * drawn from at random, because an exactly predictable sequence is one you start
 * answering from memory of the order rather than of the word.
 *
 * `recent` is a list of keys asked lately, so a wrong answer that lands back in
 * box 1 and is due immediately does not reappear as the very next question.
 */
export function pick(items, keyOf, recent) {
  if (!items || !items.length) return null;

  const { due, fresh, later } = buckets(items, keyOf);
  const avoid = new Set(recent || []);
  const free = (list) => list.filter((item) => !avoid.has(keyOf(item)));

  /*
   * Which bucket to draw from, in order of preference. Reviews normally come
   * first; one time in four a new item jumps the queue, which is what stops a
   * backlog of 40 overdue words from blocking new material for a week.
   */
  const newFirst = due.length && fresh.length && Math.random() >= 0.75;
  const order = newFirst ? [fresh, due, later] : [due, fresh, later];
  const kindOf = (bucket) => (bucket === fresh ? "fresh" : bucket === later ? "later" : "due");

  // A bucket emptied by the recency filter falls through to the next one rather
  // than repeating itself: asking the word you just missed as the very next
  // question tests short-term memory, not learning.
  for (const bucket of order) {
    const pool = free(bucket);
    if (pool.length) return choose(pool, kindOf(bucket), keyOf);
  }
  // Everything on offer was asked recently — which happens on a pool of three.
  // Something still has to be asked.
  for (const bucket of order) {
    if (bucket.length) return choose(bucket, kindOf(bucket), keyOf);
  }
  return null;
}

/**
 * One item out of a bucket.
 *
 * New items are drawn at random. Within a bucket of reviews the weakest goes
 * first, and among equals the longest overdue — but only the head of that order
 * is drawn from, because an exactly predictable sequence is one you start
 * answering from memory of the order rather than of the word.
 */
function choose(pool, kind, keyOf) {
  if (kind === "fresh") return pool[Math.floor(Math.random() * pool.length)];

  const sorted = pool.slice().sort((a, b) => {
    const ra = store[keyOf(a)], rb = store[keyOf(b)];
    if (kind === "later") return ra.due - rb.due;                // soonest first
    if (ra.b !== rb.b) return ra.b - rb.b;                       // weakest first
    return ra.due - rb.due;                                      // then longest overdue
  });
  const head = sorted.slice(0, Math.min(8, sorted.length));
  return head[Math.floor(Math.random() * head.length)];
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

/**
 * What the strip above each practising mode reports.
 *
 * "Sicher" is box 4 and up rather than box 5 alone, because box 4 already means
 * a week between correct answers — far enough along to feel like progress, and
 * counting only the top box makes the number crawl.
 */
export function stats(items, keyOf) {
  const t = today();
  let fresh = 0, due = 0, learning = 0, known = 0, wrong = 0;

  for (const item of items) {
    const rec = store[keyOf(item)];
    if (!rec) { fresh++; continue; }
    if (rec.due <= t) due++;
    if (rec.b >= 4) known++; else learning++;
    wrong += rec.w;
  }
  return { total: items.length, fresh, due, learning, known, wrong };
}

/**
 * The items you keep getting wrong — worst first.
 *
 * A word answered wrong four times and right once belongs on such a list; a word
 * missed once on the day you met it does not. Hence the ratio test alongside the
 * count.
 */
export function leeches(items, keyOf, limit) {
  const scored = [];
  for (const item of items) {
    const rec = store[keyOf(item)];
    if (!rec || rec.w < 2) continue;
    if (rec.w <= rec.r / 2) continue;
    scored.push({ item: item, wrong: rec.w, box: rec.b });
  }
  scored.sort((a, b) => (b.wrong - a.wrong) || (a.box - b.box));
  return scored.slice(0, limit || 10);
}

/**
 * The progress strip, as HTML.
 *
 * Three modes show the same strip, so it is built here rather than three times
 * over. Everything in it is a number, so nothing needs escaping.
 */
export function stripHtml(s) {
  const practised = s.total - s.fresh;
  const pct = s.total ? Math.round((s.known / s.total) * 100) : 0;
  return '<div class="srs-bar" role="img" aria-label="' +
      s.known + ' von ' + s.total + ' sicher, ' + s.due + ' heute fällig">' +
      '<span class="srs-seg known" style="flex:' + s.known + '"></span>' +
      '<span class="srs-seg learning" style="flex:' + s.learning + '"></span>' +
      '<span class="srs-seg fresh" style="flex:' + s.fresh + '"></span>' +
    '</div>' +
    '<div class="srs-legend">' +
      '<span class="srs-key known">Sicher <b>' + s.known + '</b></span>' +
      '<span class="srs-key learning">Am Lernen <b>' + s.learning + '</b></span>' +
      '<span class="srs-key due">Heute fällig <b>' + s.due + '</b></span>' +
      '<span class="srs-key rest">' + practised + ' von ' + s.total + ' begonnen · ' + pct + '%</span>' +
    '</div>';
}
