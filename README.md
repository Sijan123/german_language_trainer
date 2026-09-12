# A2 Sprachtrainer

A German A2 trainer that runs entirely in the browser. No build step, no backend,
no API keys — every word, dialogue and grammar note ships as a JavaScript module,
and the only runtime dependency is the browser's own speech synthesis.

Four modes:

| Mode | What it does |
|---|---|
| **Gespräche** | 108 everyday dialogues between Shruti and Sijan. Play any sentence on its own, or the whole conversation with the current line highlighted. English under every line. |
| **Vokabeln** | 1009 words in 20 themes. Each opens to a simple sentence, the same sentence in the Perfekt, and again as a `weil` subordinate clause — plus chips linking to the grammar topic behind it. |
| **Quiz** | A random word, four English meanings, one right. Running score kept in the browser. |
| **Grammatik** | 24 A2 topics: the rule, the pattern, five examples, and the mistake people actually make. |

One switch hides every English string at once, which turns all three lists into a
self-test.

## Running it

It's static. Open it however you like:

```bash
python serve.py          # http://localhost:5173
```

A plain `python -m http.server` works too, but `serve.py` sends
`Cache-Control: no-store`, which saves you from editing a file and seeing no
change because Chrome cached the old one.

Opening `index.html` straight off disk (`file://`) will **not** work — ES modules
have to be served over HTTP.

## Hosting on GitHub Pages

Nothing special is required — push the repo and switch Pages on.

1. `Settings → Pages → Source: Deploy from a branch`
2. Branch `main`, folder `/ (root)`
3. Save. The site appears at `https://<user>.github.io/<repo>/` within a minute.

Every path in the app is relative, so it works from a repo subpath without
changes. `.nojekyll` is there so Pages copies the files as-is instead of running
them through Jekyll.

## Layout

```
index.html              the whole UI — four sections, one per mode
css/style.css           one stylesheet, light and dark via CSS custom properties
js/
  app.js                modes, state, rendering, playback
  conversations.js      108 dialogues, 1352 turns, 16 topics
  vocab.js              1009 words in 20 themes
  sentences-en.js       English for every example sentence and main clause
  grammar-topics.js     24 grammar topics with examples
  speech.js             German text-to-speech
serve.py                local preview only
```

## Notes on the data

**Nebensatz examples are complete sentences built with `weil`,** and the main
clause in front of each one was written for that specific example — the
subordinate clause has to be a real reason for it:

> Ich brauche gute Schuhe, **weil ich jeden Morgen laufe.**

When adding entries, watch for reversed causality (the main clause is really the
cause, not the effect) and for repeating the vocabulary word in both halves.
Repeating a *time* word is fine and natural.

**English glosses for Nebensatz examples are derived, not stored** — the
`weil`-clause says the same thing as the simple sentence, so the gloss is built
at runtime from `MAIN_EN[main clause] + " because " + EN[simple sentence]`.

**Quiz distractors come from the same word type** where the pool allows it. A
lone verb among three nouns is pickable without knowing the word.

**Shruti and Sijan are a couple**, and at least 5% of the dialogues sound like it
— flagged `couple: true` in the data.

**Dialogues run 10–15 alternating turns** and stay inside A2 grammar: Präsens,
Perfekt, modals, simple `weil`/`dass`, Akkusativ and Dativ. No Passiv, no Genitiv,
no Präteritum beyond `war` and `hatte`.

## Previously

The app used to have a *Sprechen* mode with microphone input, Whisper
transcription (in the browser and through a local whisper.cpp server) and grammar
correction via a self-hosted LanguageTool with Claude as a second stage. Speech
recognition never got accurate enough at A2 to be worth the machinery, so that
mode was removed — and with it the entire backend. Anything in the git history
under `server.py`, `server.js`, `functions/` or `setup-*.ps1` belongs to that era.
