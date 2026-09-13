# A2 Sprachtrainer

A German A2 trainer that runs entirely in the browser. No build step, no backend,
no API keys — every word, dialogue and grammar note ships as a JavaScript module,
and the only runtime dependency is the browser's own speech synthesis.

Six modes — two of them reading, four of them practice:

| Mode | What it does |
|---|---|
| **Gespräche** | 108 everyday dialogues between Shruti and Sijan. Play any sentence on its own, or the whole conversation — the transcript stays hidden and arrives line by line as you hear it. Two ways to run one: **Satz für Satz**, which stops after every line until you ask for the next, and **Automatisch**, which plays it through. The ↻ beside any line takes playback back to it and carries on from there, and `←`/`→` step a sentence at a time. English under every line. |
| **Diktat** | 1231 dialogue lines, played one at a time with nothing on screen — you type what you hear. The answer is diffed word by word, so a dropped word shows up as one dropped word rather than as everything after it being wrong. Umlauts, ß and noun capitalisation are marked and named; an answer that fails on those alone counts as *fast*, not wrong. |
| **Vokabeln** | 1009 words in 20 themes. Each opens to a simple sentence, the same sentence in the Perfekt, and again as a `weil` subordinate clause — plus chips linking to the grammar topic behind it. |
| **Quiz** | A word, four English meanings, one right. Running score kept in the browser. |
| **Satzbau** | Two halves. **Einzelsätze**: 1792 sentences with the words shuffled — tap them back into order, half `weil` clauses and half Perfekt, the two places A2 word order actually goes wrong. **Gespräch**: pick a dialogue and a person to be, hear the other side, and build your own lines out of the pieces. Three levels of help either way, and the English behind *Übersetzung zeigen*. |
| **Grammatik** | 24 A2 topics: the rule, the pattern, five examples, and the mistake people actually make. |

One switch hides every English string at once, which turns the lists into a
self-test.

Diktat, Quiz and Satzbau share one spaced-repetition schedule; see
[Lernfächer](#lernfächer) below.

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
  app.js                modes, state, Gespräche, Vokabeln, Quiz, Grammatik
  dictation.js          Diktat: the pool, the word diff, the marking
  wordorder.js          Satzbau · Einzelsätze: the sentence pool and the drill
  dialogue.js           Satzbau · Gespräch: role-play through a whole dialogue
  chips.js              pieces, the three levels, and word-order marking
  avatars.js            the two drawn speaker silhouettes
  srs.js                the five Leitner boxes every practice mode shares
  conversations.js      108 dialogues, 1352 turns, 16 topics
  vocab.js              1009 words in 20 themes
  sentences-en.js       English for every example sentence and main clause
  grammar-topics.js     24 grammar topics with examples
  speech.js             German text-to-speech
  clips.js              where a dialogue line's rendered audio lives
  gloss.js              English for a German example sentence
  util.js               escaping, shuffling, and the German spelling folds
serve.py                local preview only
make-audio.py           renders dialogue audio with Piper (optional)
audio/                  rendered clips, if you have run it
voices/                 downloaded Piper models (gitignored)
```

## Better voices

The dialogues use the browser's own German voice by default, which is mediocre
on Windows and varies by device. Two ways to improve it:

**Free, no code.** Open the app in **Edge**, which exposes Microsoft's online
neural voices to the Web Speech API where Chrome does not. On iOS, Settings →
Accessibility → Spoken Content → Voices → Deutsch → download the *Enhanced*
voice.

**Render the lines properly.** [Piper](https://github.com/rhasspy/piper) is a
free offline neural TTS; `de_DE-thorsten` is one of the better open German
voices.

```bash
pip install piper-tts
python make-audio.py            # renders the first ten dialogues
python make-audio.py --first 20 # the first twenty
python make-audio.py c001-c020  # the same, by range
python make-audio.py --all      # all 108, about 27 MB
python make-audio.py --clean    # wipe audio/ and render again from scratch
python make-audio.py --tidy     # delete the demo folder and orphaned clips
python make-audio.py --list-voices
```

Re-rendering overwrites clips in place, so a plain re-run is enough after a voice
change. `--clean` is for when the format changed — a run without ffmpeg leaves
WAVs behind — or when you want to be sure nothing old survived. Every run also
prunes as it goes: the other extension, files past the end of a dialogue that
lost a line, folders the manifest no longer lists, and the `--demo` scratch.

Voice models download into `voices/` on first run, ~60 MB each. MP3 needs
**ffmpeg** on PATH (`winget install Gyan.FFmpeg` on Windows); without it the
WAVs are kept instead, which works but is about eight times the size.

That writes `audio/<id>/01.mp3 …` and updates `js/audio-manifest.js`. The app
prefers a rendered clip over the browser voice wherever one exists and falls
back silently where it doesn't, so a partial render is fine. Shruti and Sijan
get different voices either way.

Piper's German set is lopsided: `thorsten` (male) comes in low, medium and high,
but the named female voices — `kerstin`, `ramona`, `eva_k` — stop at low or
x_low, and at 16 kHz they can sound androgynous rather than female.

The way out is `de_DE-mls-medium`: one model, **236 speakers**, 22 kHz. Pick a
speaker with `#`:

```bash
python make-audio.py --demo                        # sample voices side by side
python make-audio.py --shruti de_DE-mls-medium#42  # use the one you liked
```

The pairing in the repo is **`de_DE-kerstin-low` for Shruti** and
**`de_DE-thorsten-medium` for Sijan**, settled by ear against `ramona`.

```bash
```

`--demo` renders the same sentence in every candidate into `audio/_demo/`, which
is the only honest way to find a female-sounding speaker among 236 anonymous
audiobook readers. Once you've chosen, put the spec in `VOICES` at the top of
`make-audio.py`.

Everything renders slower than natural by default (`length_scale` 1.2), because
A2 listening at conversational speed is hopeless. `--speed 1.35` slows it
further; `--speed 1.0` is the voice's own pace.

## Satz für Satz, or automatically

A dialogue plays one of two ways, and the switch sits above the transcript.

**Satz für Satz** is the default. Each line appears, is spoken, and then
everything stops until you press *Nächster Satz*. This is the mode that makes the
transcript worth having: played straight through, an A2 dialogue goes past at a
speed where you catch about half of it and have nowhere to stand and look at the
rest.

The advance sits **under the transcript**, not in the bar at the top — by the
fourth line the top bar has scrolled off a phone screen, and it is the control
you press a dozen times per dialogue. It is sticky, so once the conversation
outgrows the screen it pins to the bottom edge instead of scrolling away. Only
one advance is ever on offer: while it is down there the top button is gone
rather than sitting there saying the same thing. The last line offers
*Gespräch beenden* instead.

**Automatisch** is the old behaviour, the whole dialogue end to end with a beat
between turns, pausable with the button or the space bar.

Switching mid-dialogue does the obvious thing in both directions. Going
automatic releases a line that was waiting and carries on; going manual cancels
the gap before the next line, so the dialogue stops where it stands rather than
one line further on.

The choice is remembered in `a2trainer.conv.mode`, so *manual* is what a first
visit gets rather than something re-imposed on someone who has already decided
otherwise. `←`/`→` and the ↻ beside each line work the same in both.

## Satzbau levels

Three levels, and they work by gluing the answer back together rather than by
changing the sentence:

| Level | What you get |
|---|---|
| 1 | every word shuffled on its own |
| 2 | the words already in correct **pairs** |
| 3 | the words already in correct **threes** |

So the ladder runs from hard to helped, which is the direction you actually climb
it — you start at the top and take a rung down if the sentence will not come. Each
button shows how many pieces it leaves, so "easier" is a number you can see before
you decide to take it. A piece holding more than one word is drawn with a dashed
edge and a dot, so the joins you were *given* stay distinguishable from the ones
you made.

**Every sentence starts at level 1 again.** The level records how much help this
particular sentence needed, so carrying it forward would quietly turn one hard
sentence into a permanently easier mode.

**Help costs the promotion.** A right answer built from pre-joined pieces is
graded `near` rather than `right` — it holds its box instead of moving up, the
same treatment a near miss gets and for the same reason. The feedback says so
rather than withholding it quietly. Getting it wrong is wrong at any level.

One consequence worth knowing: level 3 collapses 53% of the pool to just two
pieces, because 4-to-6-word sentences are common and `ceil(6/3)` is 2. At that
point it is closer to a coin flip than an exercise — which is arguably fine for
the maximum-help rung nobody is scored on, but if you would rather level 3 never
went below three pieces, that is a one-line floor in `chunkWords`.

## Satzbau · Gespräch

The other half of Satzbau is the same mechanic pointed at a dialogue. You pick
one of the 108 conversations and decide whether you are Shruti or Sijan. Their
partner's lines arrive spoken, the way they do in Gespräche; when your turn
comes, your line is on the table in pieces and the conversation cannot go on
until you have built it.

Why it earns its place next to the sentence drill: a sentence with no context is
a puzzle, and you solve it by looking at the words. A sentence that has to answer
the question you just heard is a reply, and you build it by working out what you
would say — which is the thing that is actually hard at A2, and the thing no
amount of isolated word order teaches.

A few consequences of it being a fixed script rather than a pool:

- **Nothing is filtered out.** The single-sentence drill throws away anything
  under four or over eleven words; a dialogue cannot, because a two-word *"Ja,
  gern"* is part of the exchange and skipping it would leave a hole. Short lines
  are trivial to build. They are the beat between the hard ones.
- **Lines are keyed per dialogue** (`c:<id>:<line>`), so the boxes know you can
  produce *this* line in *this* conversation. The same words as a vocabulary
  sentence are a separate record, as they are between every other pair of modes.
- **Both roles are worth playing.** The two are not always an even split, so each
  card shows how many lines fall to you, and the end-of-dialogue summary offers
  to run it again from the other side.

Levels work exactly as in the sentence drill, including resetting to 1 for every
line and costing the promotion when used.

## Lernfächer

Diktat, Quiz and Satzbau do not pick at random. Every item sits in one of five
Leitner boxes, and the box decides how long it goes away for:

| Box | Comes back after |
|---|---|
| 1 | straight away, later in the same session |
| 2 | 1 day |
| 3 | 3 days |
| 4 | 7 days |
| 5 | 21 days |

A right answer promotes one box. A wrong answer goes all the way back to box 1,
not one step down — an item you have just failed is not *slightly less known*,
it is unknown, and the schedule should say so.

**Grades are three-valued.** `right`, `wrong`, and `near` for an answer that was
correct except for how it was written — an umlaut typed as `ue`, a missing
comma, a noun in lower case. A near miss holds its box rather than being
promoted, because it is neither "knew it" nor "didn't". Satzbau uses the same
grade for a word order that differs from the target but still ends on the same
word: German allows more orders than one, and marking *Heute habe ich geduscht*
wrong would be a lie.

**What gets asked next** is the most overdue item from the lowest box, drawn at
random from the top eight so the sequence never becomes something you answer
from memory of the order. One question in four is a new item even when reviews
are outstanding — a queue that serves the backlog first and only first means a
learner with forty overdue words meets nothing new for a week.

The same word tracked by two modes is deliberately two records: recognising
*der Wecker* in the Quiz and being able to spell it from dictation are not the
same thing to have learnt. Keys carry the mode — `v:` for a vocabulary word,
`d:` for a dialogue line, `s:` for a sentence.

Everything lives in one `localStorage` key, `a2trainer.srs.v1`, so it is
per-browser and never leaves the machine. *Lernfortschritt löschen* in the Quiz
bar wipes it, and asks first.

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
