/*
 * English for a German example sentence.
 *
 * Moved out of app.js so Satzbau can put the English above a scrambled sentence
 * without importing the whole app.
 *
 * A Nebensatz gloss is derived rather than stored: the weil-clause says the same
 * thing as its `simple` sentence, only with the verb at the end. So
 * "Ich brauche gute Schuhe, weil ich jeden Morgen laufe" is the English for the
 * main clause, plus "because", plus the gloss of "Ich laufe jeden Morgen".
 */

import { EN, MAIN_EN } from "./sentences-en.js";

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

export function glossFor(sentence, simpleSentence) {
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
