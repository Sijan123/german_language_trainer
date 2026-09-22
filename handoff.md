# Handoff — the Gespräch films

How to make a video of a dialogue, what exists already, and the traps that
have already cost a re-render. If you want the *why* behind the design, the
README's **The films** section has it; this is the operational half.

---

## 1. What the thing is

A film is a Gespräch acted out: drawn rooms, two characters, a card along the
bottom with the German large and each word darkening on the frame the voice
reaches it, English in italic underneath. When a line names something you can
see, an orange ring and a label land on it.

It is **not a separate dataset**. The renderer reads the app's own
`js/conversations.js`, `js/audio-manifest.js` and `js/vocab.js`, and plays the
same Piper recordings the other two playback modes use. A film cannot
disagree with the dialogue it came from.

The renderer lives in `remotion/` and is **not part of the website**. Delete
the whole folder and the site still works; what ships is `video/<id>.mp4` plus
a poster, and one generated line in `js/video-manifest.js`.

---

## 2. Before you start

```
cd remotion
npm install
pip install torch torchaudio numpy --index-url https://download.pytorch.org/whl/cpu
```

`ffmpeg` and `ffprobe` must be on the PATH. Remotion downloads its own
Chromium on first run; torchaudio downloads a ~1 GB alignment model on first
run. Both cache.

Known-good versions at time of writing: Remotion 4.0.407, React 19.2.0,
Node 24.21, torch 2.14.0+cpu, torchaudio 2.11.0+cpu, ffmpeg 9.0.1.

> `torchaudio.load()` is **not** used — since 2.11 it demands TorchCodec.
> `scripts/align.py` reads the WAVs with Python's stdlib `wave` module
> instead. Don't "fix" that by adding TorchCodec.

---

## 3. Making one

Two commands and a file to read in between.

```
cd remotion
npm run new  c007          # scaffold the staging
                           # -> open src/scenes/c007.ts, answer the TODOs
npm run film c007          # align, render, transcode, poster, manifest
```

`npm run film c007 --no-align` skips forced alignment while you iterate on the
look. The karaoke then lights whole lines at once — wrong, but not broken, and
it saves a few minutes per pass.

`npm run studio` opens Remotion Studio to scrub a composition while editing.

### What `npm run new` decides for you

| it works out | from |
|---|---|
| which rooms | the dialogue's topic, via `TOPIC_ROOMS` |
| one room or two | a topic with a single set gets one full-width room and `call: false` |
| who stands where | first speaker on the left; both sides of the table if shared |
| callouts | each line's nouns matched against the keyword lists the sets publish |
| Wortschatz | the dialogue's nouns looked up in `js/vocab.js` |

A callout is only proposed for a word `vocab.js` knows **as a noun**. German
capitalises nouns *and* the first word of every sentence, so matching on
capitals alone put a ring round "Draußen".

### What you must decide

The scaffolder marks these `TODO`. Read them; a draft nobody read is how a
film ends up set in the wrong room.

- **Together, or on the phone?** It splits them into two rooms by default
  because that is right more often. It is wrong for c001 — a couple at half
  past seven, her in the kitchen, him just out of bed — which is why that
  scene sets `call: false`. With `call: false` nobody holds a handset and the
  name chip drops its phone glyph.
- **Is the right person in the right room?** It puts whoever speaks first on
  the left. In c001 that is Shruti, but the left room is the bedroom and the
  person in it has to be the one whose alarm failed. Swapped by hand.
- **Does each callout earn its place?** Four on a twelve-line dialogue is
  plenty. One every line is wallpaper. Watch for greetings matching a keyword
  — "Guten **Abend**" hit the restaurant window before it was moved.

---

## 4. Where everything lives

```
remotion/
  scripts/
    new-scene.mjs      scaffolds src/scenes/<id>.ts, registers it in data.ts
    build-data.mjs     probes clips with ffprobe -> data/dialogues.json
    align.py           forced alignment          -> data/words.json
    render.mjs         the whole pipeline, and rewrites js/video-manifest.js
  src/
    data.ts            joins the three files; validates callout anchors
    SceneDialogue.tsx  the composition — owns all timing
    theme.ts           every colour and easing curve
    components/
      Character.tsx    the people: mouth, blink, sway, optional phone
      SpeechBubble.tsx the card, the karaoke, the tail
      Callout.tsx      the orange ring, arrow and label
      Cards.tsx        title card and Wortschatz card
      Layers.tsx       grade, grain, vignette
      sets/            the rooms (see below)
    scenes/<id>.ts     hand-edited staging, one per film
video/<id>.mp4 + .jpg  what ships
js/video-manifest.js   generated; the app reads this to offer the Video button
```

### Three files describe a film

| file | written by | holds |
|---|---|---|
| `src/data/dialogues.json` | `build-data.mjs` | when each line opens, when its clip starts |
| `src/data/words.json` | `align.py` | where every word sits inside its clip |
| `src/scenes/<id>.ts` | `npm run new`, then you | rooms, cast, callouts, Wortschatz |

They stay apart because three different things produce them at three
different times — merging would mean re-running the aligner whenever a clip's
length changed. `src/data.ts` joins them at load and **throws** if a scene
names an anchor none of its rooms has.

---

## 4b. Callouts and thoughts

Two ways to illustrate a word, and which one you get is decided by whether
the thing is in the room.

| | rings | use when |
|---|---|---|
| **callout** | an `anchor` on a set | the object is drawn in the room |
| **thought** | nothing — it draws the object in a cloud | the object is somewhere else entirely |

Both hang off the same trigger: a `word` in the line, found by the aligner, so
they land on the syllable. Both live in `src/scenes/<id>.ts` keyed by line
index. A line never gets both — the composition drops the thought if that line
also has a callout, because a ring on the real object beats a drawing of it.

**A thought is not a fallback for a lazy callout.** It exists for dialogues
that are *about* somewhere else. c005 is the case it was built for: "Der erste
Tag im Büro" is the evening after the first day, so the desk, the boss, the
canteen and tomorrow's bus are all named and none of them is within a
kilometre of the flat. Before thoughts that film ran thirteen lines on one
pointer — the alarm clock, in the last line.

```ts
thoughts: {
  6: { icon: "schreibtisch", label: "der Schreibtisch", word: "Schreibtisch" }
}
```

`icon` is a key of `ICONS` in `components/ThoughtIcons.tsx`. Six exist:
`schreibtisch` `chef` `kantine` `bus` `besprechung` `gebaeude`. **Naming an
icon that does not exist draws nothing** — there is no throw, unlike a callout
naming a missing anchor, so check the bubble actually has something in it.

Drawing a new icon is the cost here, the way a new room is the cost of a
callout somewhere new — but it is a much smaller cost: an icon is a flat
drawing in a 150x120 box with no anchors, no keywords and no registry beyond
one line in `ICONS`. Keep them plain. The bubble is 330px wide in a 1920 frame
and the ship is 720p, so anything needing a thin line to be recognisable is
the wrong drawing.

The cloud hangs beside the speaker's head, inboard towards the middle of the
frame, and is clamped so it cannot leave the frame. The trailing dots run
**diagonally** from beside the temple, not straight up: the cloud's underside
sits about level with the top of the head, so a vertical run had twelve pixels
to work with and put all three dots inside the bubble's bottom lobe.

---

## 5. The sets

A set is one file holding three things: the drawing, the boxes a callout can
point at (`anchors`), and the words that route a callout to each box
(`keywords`). All three together, because they used to be split and the first
time a room moved its callouts stayed behind.

| set | width | anchors |
|---|---|---|
| `supermarkt` | left half | `kuehlregal` `auslage` `kasse` |
| `schlafzimmer` | left half | `bett` `wecker` `fenster` |
| `kueche` | right half | `vorrat` `kuchen` `fruehstueck` `fenster` |
| `wohnzimmer` | right half | `sofa` `regal` `fenster` `heizung` `tisch` |
| `restaurant` | **full frame** | `tisch` `speisekarte` `essen` `getraenk` `fenster` |
| `bushaltestelle` | **full frame** | `bus` `haltestelle` `fahrplan` `automat` `strasse` |
| `bahnhof` | **full frame** | `zug` `anzeigetafel` `gleis` `treppe` `rucksack` |
| `buergerbuero` | **full frame** | `tresen` `ausweis` `formular` `nummer` `wartebereich` |
| `bad` | **left half** | `waschmaschine` `waesche` `spiegel` `fenster` |
| `kuecheGross` | **full frame** | `topf` `brett` `vorrat` `tisch` `fenster` |
| `baeckerei` | **full frame** | `brot` `broetchen` `kuchen` `kasse` `theke` |
| `markt` | **full frame** | `erdbeeren` `kartoffeln` `kaesestand` `preis` `stand` |
| `bekleidung` | **full frame** | `hose` `kassenbon` `jacken` `kabine` `theke` |

`bad` is only the **third left-half set**. Until it existed every two-room
film set at home had to use the bedroom, because the kitchen and the living
room are both drawn for the right — which is why c001, c005, c006 and c009 all
open on a bed. If you draw one more room, make it a left-hand one.

`kuecheGross` is the same kitchen as `kueche`, in the same palette, drawn full
frame. Use the half-frame one when a person in the kitchen is talking to
someone who is not, and the full-frame one when both are cooking.

The last three are outdoors or public rather than rooms of a flat, so their
palettes call the sky `wall` and the pavement `floor` — that way `Wall` and
`Floor` from the kit still draw them and the horizon stays at y=648.

In a full-frame set the figures stand at **x≈420 and x≈1500**, not 258/1664,
so the bands to keep clear are x 285-555 and 1365-1635.

### Adding a room

Draw it in `src/components/sets/` using the parts in `kit.tsx` (`Wall`,
`Floor`, `Shelf`, `Products`, `Sign`, `Window`, `Counter`, `Cabinets`,
`Picture`, `Plant`). Export the component, its anchors and its keywords, add a
line to `SETS` in `sets/index.ts`, and list it in `TOPIC_ROOMS`.

**This is the real cost of a new film.** Everything else is data.

Rules a room must respect — every one of these was learned by rendering
something wrong first:

1. **The horizon is y=648 in every room.** Two rooms side by side with floors
   at different heights look like a collage.
2. **Nothing a callout points at may sit below y≈648.** The speech bubble
   covers the bottom third. The kitchen's first worktop was at y=748 and the
   cake spent the whole film hidden behind the subtitle naming it.
3. **Leave the middle of each half clear.** A figure stands at x≈258 (left)
   and x≈1664 (right) for the entire film. Put scenery beside them, not
   behind them.
4. **A callout target must be big enough to survive a ring at 720p.** The
   bedroom is built around an alarm clock for exactly that reason.
5. **Don't crowd a callout target.** A bedside lamp drawn next to the alarm
   clock ended up inside the ring and read as part of it. It was deleted.
6. `origin` is which half the `viewBox` starts in (0 or 960). A set can be
   used in the other half — `findAnchor` shifts its boxes — but forgetting
   that put a living room on the left with its callouts landing on the right.
7. A full-frame set declares `width: 1920`, a half-frame one `960`. The room
   honours the **set's** width, not its own.

---

## 6. Current state

20 of 108 dialogues have films, and **all 108 now have audio** (1352 MP3
clips, 22.5 MB). 57 MB in `video/` total.

| id | topic | title | |
|---|---|---|---|
| c001-c010 | various | see git history | ✅ |
| c011 | alltag | Die Waschmaschine ist voll | ✅ |
| c012 | alltag | Wer bringt den Müll raus? | ✅ |
| c013 | alltag | Der Schlüssel ist weg | ✅ |
| c014 | einkaufen | Die Hose ist zu eng | ✅ |
| c015 | einkaufen | Samstag auf dem Markt | ✅ |
| c016 | einkaufen | Das Paket ist nicht angekommen | ✅ |
| c017 | essen | Zusammen kochen | ✅ |
| c018 | essen | Beim Bäcker | ✅ |
| c019 | essen | Gäste kommen zum Essen | ✅ |
| c020 | wohnen | Eine Wohnung besichtigen | ✅ |
| c021-c108 | various | 88 left | no scene yet |

Of the 88 remaining, 16 are topics with no room mapping at all (`lernen`,
`technik`). The other 72 map to a topic that has rooms — but read §6 below
before trusting that.

**The topic mapping is a blunt instrument and it gets worse the further you
go.** Of c011-c020, scaffolded straight from `TOPIC_ROOMS`, **six of ten were
in the wrong place**:

| id | proposed | actually |
|---|---|---|
| c011 | living room | a bathroom — it is about a washing machine |
| c014 | supermarket | a clothes shop — a food shop has no fitting rooms |
| c015 | supermarket + kitchen | a market, and the whole point is that it is not a supermarket |
| c016 | supermarket + kitchen | at home; **the scaffolder reported 0 of 12 callouts** |
| c017 | restaurant | their own kitchen — they are cooking, not eating out |
| c018 | restaurant | a bakery — you sit down in one and queue in the other |

**`0 of N` is the strongest signal this project produces.** It does not mean
the dialogue has nothing to illustrate; it means the dialogue has been put
somewhere that has nothing to do with it. c016 went on to get four pointers
once it was staged at home with thought bubbles.

**"Needs a room" is a claim about the topic, not about the dialogue.** c005
and c006 were both listed here as needing an office and a surgery. Neither
does: c005 is the evening *after* the first day and c006 is a phone call
*to* a surgery, so both are couples at home and both scaffolded onto rooms
that already existed. Read the lines before you draw anything — a set is the
expensive part, and twice now the expensive part was not needed.

The three that genuinely were new — the bus stop, the platform and the
Bürgerbüro — are the three where the two speakers are strangers or fellow
travellers standing in one place, which is also why all three are full frame.

The twelve marked "rooms exist" should scaffold onto existing sets — but check
the callout count the scaffolder reports. If it says `0 of 12`, the set has
nothing that dialogue talks about, and you either add anchors to the set or
accept a film with no pointers. c011 (a washing machine) is the standing
example: the living room has no washing machine.

Only 20 of 108 dialogues have rendered audio at all. The rest need
`make-audio.py` run first.

At ~3 MB each, all 20 would be ~60 MB committed into a repo that *is* the
website. Decide that deliberately.

---

## 7. Traps

**The master is thrown away.** Remotion renders visually lossless; a 50s 1080p
master is 25–45 MB. `remotion/out/` is gitignored. What ships is a 720p
transcode at ~3 MB, still sharper than the 720-pixel column it plays in.

**The pixel format needs forcing.** Remotion renders JPEG frames, so the
master is full-range `yuvj420p` with an ICC profile. `-pix_fmt yuv420p` alone
does not undo that — the filter chain must convert (`out_range=tv,format=yuv420p`)
and the range must be tagged. Full-range video plays fine in one player and
comes out wrong in another.

**`serve.py` had no Range support** and that is why a video once looked broken.
Python's `SimpleHTTPRequestHandler` answers `Range:` with a plain 200 over
HTTP/1.0, and Chrome cannot seek a `<video>` off that — scrubbing threw you
back to the start. It now serves real 206s over HTTP/1.1.

**`serve.py` refuses to double-bind.** `HTTPServer` sets
`allow_reuse_address = 1`, so a second copy on a busy port silently stacks
another listener and requests go to whichever process the OS picks — you get
answers from a stale server running old code. It now sets it to `False` and
exits with a message. **If you start servers in scripts, kill them.**

**The film obeys the app's "Ton an" switch.** Chrome remembers mute and volume
per origin, so a once-muted player starts muted forever with nothing on screen
saying why. Entering Video mode forces `muted = false, volume = 1`.

**A room drawn before anything was filmed in it has not been reviewed.** The
living room stacked its window and radiator at x=1660 — exactly where the
right-hand figure stands for the whole film — and shipped like that because
c001-c003 use the bedroom, the kitchen, the shop and the restaurant. The first
film to actually stand someone in it, c004, rang "die Heizung" round Sijan's
face. Everything in that room now lives left of x=1520. The kitchen has a
milder version of the same thing: `fruehstueck` and `fenster` run to x=1606
and x=1584, so a ring on either is clipped by the figure's shoulder. c001
shipped that way and c009 does too. Fixing it means moving the art and
re-rendering c001 and c002, so it is left alone deliberately.

**The callout tag needs room on the side it is put.** `SceneDialogue` used to
pick that side from `box.y` alone, which says nothing about how tall the box
is: the bus at the Haltestelle starts at y=292 and is 308 high, so it was sent
"below" and its label landed at y≈700, under the speech bubble. It now
reserves `CALLOUT_TAG_SPACE` and measures from there. Separately, `Callout`
centred the tag on the ring with no clamp, so "die andere Straßenseite" over a
box near the left edge started at x=-92 and lost two words. The tag now slides
back inside the frame while the arrow stays on the ring.

**Chromium crashes on long batches.** Rendering c007, c008 and c010 back to
back killed the browser at frame 745 of the second one; the shell `for` loop
carried on to the third and exited 0, so the failure was invisible in the exit
status. A plain retry in a fresh process worked first time. **Check `video/`
for the files you asked for, not the exit code.**

**The clip format changes under you when ffmpeg appears.** `make-audio.py`
picks its output from `shutil.which("ffmpeg")` — MP3 when it is on PATH, WAV
when it is not — and then `prune_folder` **deletes the other extension**. So
the first full audio re-render on a machine with ffmpeg silently converts
every clip to MP3 and removes the WAVs.

That used to break forced alignment outright. `align.py` reads samples by hand
with the stdlib `wave` module, on purpose, to avoid adding TorchCodec — and
`wave` cannot open an MP3, so every clip would have failed the moment the
audio was re-rendered. It now sniffs the extension and sends anything that is
not a `.wav` through `decode_with_ffmpeg`, which pipes 16-bit mono PCM out of
ffmpeg. ffmpeg is already a hard dependency of the render pipeline, so this
adds nothing new, and **it is still not TorchCodec** — the rule above stands.

Worth knowing which way round you want it: 1352 lines is about 113 MB as WAV
and about 14 MB as 64k mono MP3, in a repo that *is* the website.

**Windows line endings.** `data.ts` is CRLF. A regex ending `;\n` matched none
of its import lines, so the scene registry gained an entry without the import
to go with it. Anything rewriting a source file must match `\r?\n` and write
back the file's own EOL.

**Don't patch JS with shell heredocs.** Escaping mangled a regex literal and a
template string in `new-scene.mjs` twice — both syntax errors that only
surfaced on the next run. Use an editor, and `node --check` afterwards.

---

## 8. Verifying a render

Never ship one you have not looked at.

```
# stills at chosen frames, without a full render
npx remotion still src/index.ts c007 out/check.png --frame 300 --overwrite

# after rendering, check the shipped file
ffprobe -v error -select_streams v -show_entries stream=pix_fmt,color_range \
        -of default=nw=1 video/c007.mp4          # expect yuv420p / tv
ffmpeg  -i video/c007.mp4 -af volumedetect -f null -   # expect ~-19 dB mean
ffmpeg  -i video/c007.mp4 -af silencedetect=noise=-45dB:d=0.3 -f null -
```

Compare the first `silence_end` against `lines[0].audioAt / 30` from
`dialogues.json`; they should agree within ~0.1s (the gap is the WAV's own
lead-in).

Check the alignment actually ran — `--no-align` fails soft:

```
node -e "const w=require('./src/data/words.json');console.log(Object.keys(w))"
```

To see a callout fire on its word, compute the moment and sample either side:

```
node -e "const d=require('./src/data/dialogues.json').c007,\
w=require('./src/data/words.json').c007;\
const i=3,x=w[i].find(t=>t.w.startsWith('Wort'));\
console.log(((d.lines[i].audioAt/30)+x.a).toFixed(2))"
```

Then `ffmpeg -ss <t-0.3>` and `-ss <t+0.4>`: the ring should be absent in the
first and landed in the second.
