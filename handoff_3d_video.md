# Handoff — the acted 3D films

How to make, change and check an **acted film**: a Gespräch played out by
Sijan and Shruti as 3D characters with bodies, in a 3D room, doing the
physical business the dialogue implies. c010 ("Anmeldung beim Bürgerbüro")
is the pilot and the worked example for everything below.

This document stands on its own. For the drawn 2D films (the other 49), see
`handoff.md`; section 9 there is a short summary of this one.

---

## 1. What an acted film is

The same dialogue, the same Piper voices and the same printed layer as a drawn
film — subtitle card with word-by-word karaoke, orange callout rings, thought
bubbles, title card, Wortschatz card, grade, grain — but underneath it:

- **people with bodies**: they walk, sit, stand, lean, reach, hand things over,
  write, nod, blink, and look at whoever is speaking or whatever is being
  handled;
- **mouths shaped from the sounds**: per-letter timings from the aligner drive
  jaw, width and lip rounding (m/b/p close the lips);
- **a 3D room** built from Kenney's CC0 furniture plus hand-built pieces
  (number display, monitor with a live screen, wall clock, signs);
- **props** that move between hands, desk, pocket and folder: passport,
  clear folder, landlord's confirmation, form (with real German printed on it
  and real ink from the pen), pen;
- **a camera that cuts**: a side-on master across the desk, with close-ups for
  the business;
- **room sound**: footsteps, chair, paper, typing, pen, the waiting-room chime.

Everything happens against the dialogue, not the clock: a beat says "when
Shruti says *Ausweis*, Sijan reaches into his inside pocket". Re-record a line
and its business moves with it.

### Decisions already taken (from the pilot's planning)

These were chosen deliberately; keep them unless the user says otherwise.

| question | decision |
|---|---|
| how bodies are made | **rigged models built by a Blender script** (`remotion/blender/cast.py`, `npm run cast`): skinned, five-finger hands, jaw, lids, shape keys; still all code, nothing sculpted by hand or downloaded. The old Three.js primitive people (`Person.tsx`) remain the fallback when a look has no `model` |
| how motion is made | **all keyframed in code**: beats compile to channels, IK solves limbs |
| look | **stylised, like the 2D cast**: same skin, hair, clothes colours, head a little large |
| view | **full side profile** master across the desk, **plus cuts** on actions |
| mouths | **visemes from the aligner's letters** |
| room | **Kenney Furniture Kit (CC0)**, repainted in the set's palette |
| shading | **flat and fast**: 3-band toon shading, one shadow-casting light |
| overlays | karaoke card, callout rings, title + Wortschatz cards, thought bubbles — all kept |
| pacing | **add silences** before lines where the action needs time |
| where it ships | **replaces** the drawn film at `video/<id>.mp4` |
| architecture | **reusable action vocabulary**, not a one-off |
| acting | **rich**: gaze, blinks, nods, brows on questions, smiles, idle breath and sway |
| camera | **moves only when needed** (user, 2026-09-24): an establishing shot, one steady master per room, glides (not cuts) when someone walks out of frame. No close-up coverage |
| footsteps | **none** (user, 2026-09-24): the automatic footstep sounds are off |

---

## 2. Making one: the short version

```
cd remotion
npm install                     # once; includes three, @react-three/fiber, @remotion/three
# 1. write src/scenes/<id>.acted.ts   (copy c010.acted.ts as the template)
# 2. add `acted: <id>Acted` to src/scenes/<id>.ts
# 3. check stills and a quarter-size preview (section 8)
npm run film <id>               # timings, alignment, sfx, 1080p master, 720p ship, poster, manifest
```

`npm run film` is the same command as for drawn films. For an acted scene it
additionally generates the sound effects and measures the finished file for
the manifest's duration (the added silences make it longer than
`dialogues.json` says).

To go back to the drawn version of a film, delete the `acted:` line from its
scene file. The drawn staging is kept intact underneath.

---

## 3. Where everything is

```
remotion/
  src/
    acted/
      types.ts        the vocabulary: Beat, Cue, Target, LookTarget, Shot3D, Holder, Acted
      timeline.ts     compile(): beats -> per-person channels (the reusable core)
      rig.ts          solveCore()/solveBody(): gait, sitting, spine, IK arms/legs, gaze, blinks
      world.ts        World: memoised solver for bodies, props, ink, room state
      visemes.ts      mouthAt(): open / wide / round from letter timings
      camera.ts       cameraAt(), project(), projectBox()
      Person3D.tsx    poses a rigged cast model (public/models/cast/) from a solved Body
      Person.tsx      the older primitive person, used when a look has no `model`
      Props.tsx       draws passport, folder, sheet, form (+ ink), pen
      models.tsx      Kenney GLB loading, re-centring, toon repaint, <Model>
      sets/
        index.ts      SETS3D registry; SetLayout / SetState types
        buergerbuero.tsx   the Bürgerbüro: layout (data) + component
      SceneActed.tsx  the composition (3D canvas + all 2D overlays + audio)
    scenes/
      c010.ts         scene file; `acted: c010Acted` switches it to 3D
      c010.acted.ts   the pilot's choreography, camera, cast, props, callouts
    data.ts           joins timing + words + scenes; applies an acted scene's gaps
    Root.tsx          picks SceneActed or SceneDialogue per scene
  scripts/
    align.py          forced alignment; now also writes per-letter timings ("c")
    make-sfx.mjs      synthesises public/sfx/*.wav (npm run sfx)
    render.mjs        the pipeline; runs make-sfx; manifest duration from ffprobe
  public/models/kenney/   the furniture GLBs + licence (committed)
  public/models/cast/     sijan.glb, shruti.glb — built by npm run cast (committed)
  blender/cast.py         the cast builder (see section 7b)
  scripts/cast.mjs        runs it in Blender headless (npm run cast)
  remotion.config.ts  sets the ANGLE GL renderer (needed for WebGL headless on Windows)
```

`remotion/public/` is gitignored except `public/models/`. The audio copies and
`public/sfx/` are generated.

---

## 4. The scene file

An acted scene is an `Acted` object (see `src/scenes/c010.acted.ts`):

```ts
export const c010Acted: Acted = {
  set: "buergerbuero",                 // key of SETS3D
  cast: {
    Sijan:  { look: {...}, start: { x, z, yaw, seated: "bench" } },
    Shruti: { look: {...}, start: { x, z, yaw, seated: "official" } }
  },
  gaps: { 0: 5.3, 1: 3.7, 3: 1.4, ... },   // seconds of silence added BEFORE line i
  tail: 9.0,                               // seconds after the last line, before Wortschatz
  props: {
    passport: { kind: "passport", start: { pocket: "Sijan" } },
    folder:   { kind: "folder",   start: { spot: "benchFolder" } },
    sheet:    { kind: "sheet",    start: { inside: "folder" } },
    form:     { kind: "form",     start: { spot: "formTray" } },
    pen:      { kind: "pen",      start: { spot: "penRest" } }
  },
  beats: [ ... ],      // the choreography, section 5
  shots: [ ... ],      // the camera, section 6
  callouts: { 4: { at: "passport", label: "der Pass", word: "Pass", size: [0.08, 0.07] } }
};
```

And in `src/scenes/<id>.ts`:

```ts
import { c010Acted } from "./c010.acted";
export const c010: Scene = {
  id: "c010",
  acted: c010Acted,
  thoughts: { 11: { icon: "brief", label: "die Post", word: "Post" } },
  ...                  // the drawn staging stays below, unused while `acted` is set
  wortschatz: [...]    // still read from here
};
```

**Look (`Look3D`)**: `model` (a cast GLB name, e.g. `"sijan"`), `height` (m), `skin`, `skinShade`, `hair`,
`hairStyle: "short" | "long"`, `beard`, `brows: "normal" | "thick"`, `top`,
`topDark`, optional `jacket: { color, dark, shirt }` (the inside pocket needs
one), `trousers`, `shoes`, optional `lanyard`. The pilot's values for both
characters are in `c010.acted.ts`; reuse them so the cast looks the same
across films.

**Changes of clothes**: `cast.<name>.changes: [{ at: Cue, look: Partial<Look3D> }]`
swaps colours from that cue on (c001: pyjamas → suit while he is behind the
bathroom wall). The model stays the same.

**Start**: `{ x, z, yaw, seated? }`. With `seated: "<chair>"` the person starts
sat on that chair and x/z are worked out from it.

**Gaps.** `data.ts` shifts every later line, word and letter by the added
silence, so karaoke and mouths stay on the voice. Use a gap wherever
something takes longer to do than to say (walking in, finding a pocket,
signing). c010 went from 48.5 s to 82.8 s this way.

---

## 5. The beat vocabulary

Every beat is `{ who, do, at: Cue, ...fields }`. In the scene file, helpers
make it read like a script:

```ts
const sij = (b: Verb): Beat => ({ ...b, who: "Sijan" }) as Beat;
const shr = (b: Verb): Beat => ({ ...b, who: "Shruti" }) as Beat;
const room = (b: Verb): Beat => ({ ...b, who: "Shruti" }) as Beat;  // for room events
```

### Cues — when a beat starts

| cue | meaning |
|---|---|
| `{ line: 3 }` | line 3's voice starts |
| `{ line: 3, end: true }` | line 3's voice stops |
| `{ line: 3, word: "Ausweis" }` | that word starts sounding (punctuation and case ignored) |
| `{ line: 3, word: "Ausweis", end: true }` | that word stops |
| `{ gap: 4 }` | start of the silence added before line 4 |
| `{ t: 1.5 }` | seconds from the first frame |
| `{ after: "someId" }` | when the beat with `id: "someId"` ends |

Any cue takes `plus` (seconds, either sign). Lines are 0-indexed. A cue naming
a word that is not in the line throws, with the line printed.

### Verbs

Durations are seconds; defaults in brackets.

**Whole body**

| verb | fields | notes |
|---|---|---|
| `walk` | `path: [x,z][]`, `face?`, `speed?` (1.1 m/s) | real gait: planted feet, alternating steps, pelvis bob, arm swing, closing step; turns to face travel; footstep sounds automatic |
| `step` | `to: [x,z]`, `dur?` (0.8) | a step or two keeping the current facing (sidestep in front of a chair) |
| `turn` | `yaw`, `dur?` (0.5) | turn on the spot |
| `sit` | `chair`, `dur?` (1.15) | hips back then down, hip hinge forward; stand in front of the seat first (`step`) |
| `stand` | `dur?` (1.05) | reverse of sit |
| `scoot` | `chair`, `by` (m, + = forward), `dur?` (0.5) | shuffle the chair in/out while sat |
| `lean` | `amount` (rad), `dur?` (0.6) | forward lean, additive to posture; **needed for reaching across a desk** |
| `twist` | `amount` (rad), `dur?` (0.6) | turn the chest; + turns left |

**Head and face**

| verb | fields | notes |
|---|---|---|
| `look` | `to: LookTarget`, `dur?` (0.32), `hold?` | eyes jump first, head follows over `dur`; with `hold` it returns to the default (the other person's face) afterwards |
| `nod` | `times?` (1), `size?` (1), `dur?` (0.75) | |
| `shake` | `times?` (2), `dur?` (0.8) | |
| `smile` | `amount` 0..1 | stays until changed (resting value 0.15) |
| `eyes` | `open` 0..1, `dur?` (0.25) | eyes shut for dozing; blinks still happen when open |
| `brows` | `amount` 0..1 | stays until changed; questions raise them automatically |

**Hands**

| verb | fields | notes |
|---|---|---|
| `reach` | `hand: "L"/"R"`, `to: Target`, `dur?` (0.7), `arc?` (0.04 m), `palm?`, `grip?` 0..1, `point?` 0..1, `hold?` | minimum-jerk path from wherever the hand is; with `hold` it returns to rest afterwards |
| `rest` | `hand: "L"/"R"/"both"`, `dur?` (0.6) | hanging when standing, on the desk when sat at one, in the lap otherwise |
| `type` | `dur` | both hands to the keyboard spots with typing motion; typing sound automatic |
| `gesture` | `hand`, `kind: "offer"`, `toward: Target`, `dur?` (1.3) | open palm towards something ("please sit") |
| `scribble` | `hand`, `on: <paper prop>`, `style: "fill" | "sign"`, `dur` | the pen tip is solved onto the paper; ink is recorded from where it actually touched; pen sound automatic. The hand must be holding a `pen` prop |
| `tap` | `hand`, `times?` (2) | small up-down taps at the current target (use with `point: 1`) |

**Jacket and props**

| verb | fields | notes |
|---|---|---|
| `jacket` | `open` 0..1, `dur?` (0.35) | left front panel swings open (for the inside pocket) |
| `take` | `prop`, `hand`, `grip?: "keep" | "carry"` | `keep` holds it exactly as it was when the fingers closed (hand-overs); `carry` settles it into a natural hold (picking up to carry) |
| `put` | `prop`, `spot` **or** `into` + `off?`, `blend?` (5 frames) | onto a set spot, or into another prop (`off` in that prop's frame): rolls into a bag, a card into a wallet. A spot marked `hidden` in the layout hides the prop once it lands (coins into the till drawer) |
| `stow` | `prop`, `into: <person>` | into that person's inside pocket; hidden once in |
| `open` | `prop`, `amount` 0..1, `dur?` (0.55) | the passport's cover |

**Room**

| verb | fields | notes |
|---|---|---|
| `chair` | `chair`, `to: [x,z]`, `yaw?`, `dur?` (0.7) | move a chair (pushing it back in) |
| `screen` | `state`, `dur?` (0.9) | the monitor: `list`, `search` (types the name over `dur`), `found` (10:00 row highlighted), `entry` (registration form), `done` |
| `display` | `text` | the called-number display, e.g. `"B 042"`; it flashes when it changes |
| `sound` | `name`, `volume?` (0.5), `dur?` | `ding`, `step`, `chair`, `paper`, `typing`, `pen`, `bell` (shop door), `slicer`, `till`, `coins` |
| `room` | `name`, `value`, `dur?` (0.4) | a named value the set reads from `SetState.values` (the bakery's `drawer` and `slicer`) |

`sit`, `stand`, `scoot`, `chair` and `type` add their own sounds. (`take` and `put`
used to add a paper rustle; removed at the user's request.)

### Targets — where a hand goes (`Target`)

Hand targets are the **middle of the palm**. They are resolved on every frame,
so "the lap" follows the lap when the person sits.

| target | meaning |
|---|---|
| `{ body: "rest" }` | default resting place (see `rest`) |
| `{ body: "lap" | "thigh" | "pocketIn" | "pocketOut" | "present" | "read" | "carry" | "drink" }` | spots on the person's own body (`BODY_SPOTS` in `rig.ts`); `drink` is a cup at the lips |
| `{ spot: "exchange", off?: [x,y,z] }` | a named spot the set publishes, plus a world offset |
| `{ prop: "form", off?: [x,y,z] }` | where a prop is, offset in **the prop's own frame** (so "bottom of the form" stays the bottom however it lies) |
| `{ world: [x,y,z] }` | a literal point |

`palm`: `"down" | "up" | "in" | "out" | "forward" | "back"` in the person's
own frame (`in` = towards their midline), or a vector.

### Look targets (`LookTarget`)

`{ face: "Shruti" }`, `{ hand: "Sijan.R" }`, `{ spot, off? }`, `{ prop }`,
`{ world }`, `{ ahead: true }`. The default gaze is the other person's face.

### Acting nobody has to write

`compile()` adds these automatically:

- blinks every 2.6–5.4 s, plus one on most gaze shifts;
- (no footsteps — removed at the user's request);
- a small head bob on stressed words while speaking, and a gentle drift;
- brows raised on the last word of a question;
- a small listener nod after the other person's statements (skipped where the
  scene already nods);
- breathing, weight shift and sway; a slight lean-in while speaking seated;
- footsteps on every footfall.

### Standard patterns (copy these)

**Hand something across the desk** (both must lean; the desk is 0.7 m deep):

```ts
sij({ do: "lean", amount: 0.3, dur: 0.7, at: CUE }),
sij({ do: "reach", hand: "R", to: { spot: "exchange" }, palm: "in", dur: 0.75, at: CUE }),
shr({ do: "lean", amount: 0.28, dur: 0.6, at: CUE2 }),
shr({ do: "reach", hand: "L", to: { prop: "passport", off: [0.035, 0, 0] }, palm: "in", grip: 0.75, dur: 0.6, at: CUE2 }),
shr({ do: "take", prop: "passport", hand: "L", grip: "keep", at: CUE2_plus_0.6 }),
sij({ do: "rest", hand: "R", at: just_after }),
sij({ do: "lean", amount: 0, at: just_after }),
```

**Take something out of the inside pocket**: `jacket open 1` → `reach body:pocketOut`
→ `reach body:pocketIn, grip 0.85` → `take keep` → `reach body:pocketOut` →
`jacket open 0` → `reach body:present`. Put it back the same way with `stow`.

**Pick up a pen and write**: `reach {prop: pen}` → `take grip: "carry"` →
optionally the other hand on the paper → `scribble on: "form", style: "fill"`
→ `scribble ... style: "sign"`.

**Sit down at the desk**: walk to beside the chair → `step` to in front of the
seat → `sit chair` → `scoot by 0.08`.

---

## 6. The camera (`shots`)

A shot holds until the next one starts.

```ts
{ at: CUE, pos: [x,y,z], look: [x,y,z], fov: 30,
  to?: { pos?, look?, fov? },     // where it drifts to by the next shot (default: 4.5% push-in)
  glide?: 1.2,                    // ease in from the previous framing over 1.2 s instead of cutting
  track?: "Sijan", follow?: 0.45  // pan with a walking person
}
```

It always floats a little, like a handheld camera. The pilot's coverage, which
works well:

| shot | pos | look | fov |
|---|---|---|---|
| master, side-on across the desk | [-0.05, 1.28, 4.0] | [-0.05, 1.0, -0.05] | 30 |
| opening wide of the room | [-1.35, 1.6, 6.2] | [-1.45, 1.05, -0.55] | 38 |
| her screen, over her shoulder | [1.2, 1.4, 0.05] | [0.05, 1.07, -0.46] | 30 |
| inside-pocket close-up, 3/4 on him | [0.3, 1.18, 1.25] | [-0.64, 1.02, -0.02] | 30 |
| hand-over, low profile | [0.0, 1.06, 2.05] | [-0.02, 0.98, 0.05] | 32 |
| her face 3/4 (checking) | [-0.62, 1.3, 1.55] | [0.72, 1.12, -0.05] | 29 |
| over his shoulder onto her | [-1.55, 1.42, 0.95] | [0.66, 1.15, -0.05] | 27 |
| over her shoulder onto him | [1.55, 1.42, 0.95] | [-0.7, 1.12, -0.05] | 27 |
| the form, above his shoulder | [-0.02, 1.45, 0.85] | [-0.2, 0.68, 0.02] | 34 |

Rules learned:
- Cut to a close-up for the business, and cut **back to the master before a
  thought bubble** fires. The bubble sits over the speaker's head, and a
  close-up may not have one in frame.
- Keep a person's face towards the lens. A glance at something behind them
  shows the back of their head. The pilot had one and it was cut.
- The subtitle card covers the bottom ~30% of the frame. Aim close-ups low
  (`look` y lower) so the thing being handled sits above it.

**Callouts** (`acted.callouts`, keyed by line index): `at` is a **prop name**
or a set **anchor**, and the ring is projected from 3D every frame, so it
follows a passport across the desk. `size` is the half-size in metres. The
ring waits for `word`. A callout for a prop still in a pocket would ring
nothing. Put it on the line where the prop is visible.

**Thoughts** (in the scene file's `thoughts`) work as in drawn films and hang
over the speaker's projected head. The icons are listed in `handoff.md`
section 4b.

---

## 7. Sets (rooms)

A set is `src/acted/sets/<name>.tsx` exporting a **layout** (plain data the rig
solves against) and a **component**, registered in `sets/index.ts`
(`SETS3D`).

### Coordinates

Metres. **+x** is screen right in the side-on master, **+z** is towards the
camera, the floor is y = 0. **Yaw 0 faces +x** (the right hand is nearest the
lens); yaw π faces −x (the left hand is nearest the lens); yaw −π/2 faces the
camera.

### Layout

```ts
chairs:  { visitor: { at: [-0.8, 0], yaw: 0, seat: 0.46, desk: true }, ... }
         // seat centre, which way a sitter faces, seat height, at a desk?
spots:   { exchange: { p: [x,y,z] }, formSijan: { p, yaw }, ... }
         // places for hands and props; `yaw` orients a prop lying there
anchors: { screen: [x,y,z], clock: [...], ... }   // gaze targets and callout rings
```

### The Bürgerbüro (`buergerbuero`)

- desk centred at x = 0, 0.7 m deep (x −0.35..0.35), 1.47 m wide, top at 0.77 m;
- **chairs**: `visitor` (x −0.8, faces +x), `official` (x 0.74, faces −x),
  `bench` (back left, faces the camera);
- **spots**: `exchange` (mid-desk hand-over point), `keyL` / `keyR`
  (her keyboard), `formSijan`, `formMiddle`, `formShruti`, `formTray`,
  `folderSijan`, `docShruti`, `passportShruti`, `penRest`, `penSijan`,
  `benchFolder`;
- **anchors**: `screen`, `display`, `clock`, `door`, `visitorChair`;
- **live state**: number display text (`display`), monitor (`screen`), wall
  clock (just before ten).

### The Bäckerei (`baeckerei`, c018)

Counter along z at x = 0 (top 0.92): glass case on the far half (rolls on his
side, cake stand on hers, side by side because the side-on camera looks
along the case), bare worktop on the near half with the money dish, till and
card reader. Back counter with the bread slicer and bread shelves behind her.
Spots include `roll1/2`, `slice1/2`, `bagPack`, `bagOut`, `boxStart`,
`boxOut`, `loafShelf`, `slicerIn`, `slicerSwitch`, `dish`, `tillKeys`,
`tillDrawer` (hidden), `sticker`, `exchange`. The till display shows the
`display` text; `room` values `drawer` and `slicer`. The price board adds up
to the dialogue's 8,20 €.

### The flat (`wohnung`, c001)

Bedroom (x < 0) and kitchen (x > 0.15) side by side, the partition seen
end-on, its doorway at the back. Doors are dark openings on the back wall:
walking through one is walking behind the wall. Chair `bed` (sitting on its
edge facing the camera); spots `clockTable`, `board`, `keyL/keyR` (at the
board, so `type` reads as working there), `lunchbox`, `lunchOut`, `mug`,
`key`, `exchange`. Both clocks say half past seven.

### Making a new room

1. Pick furniture from the Kenney Furniture Kit (CC0; downloaded from
   kenney.nl/assets/furniture-kit; 140 models, GLTF folder). Copy the GLBs
   you need into `remotion/public/models/kenney/`.
2. Place each one with `<Model model={m.desk} at={[x, z]} yaw={facing} scale={2} paint={PALETTE} />`.
   Kenney units are about half scale, so **scale 2** gives real sizes (desk
   0.77 m high, door 2.0 m). `yaw` is which way its front faces, in the
   convention above. Palettes map Kenney material names (`wood`, `metal`,
   `metalDark`, `carpet`, `plant`, …) to colours. Define them **at module
   level**, never inline.
3. Build walls, floor, signs and screens as simple meshes. Text goes on canvas
   textures (see `Display`, `Screen` and `Sign` in `buergerbuero.tsx`).
4. Write the layout: chairs with correct seat heights, spots where hands and
   props go, anchors for callouts.
5. Register it in `SETS3D`, then render stills and adjust positions by eye.

To find an unknown model's orientation, render it next to red (+x) and blue
(+z) axis bars. All Kenney models face +z with their origin at a corner;
`<Model>` handles both.

### New props

A prop kind needs a size in `PROP_SIZE` and a carry grip in `CARRY`
(`world.ts`), a drawing (`Props.tsx`, `BakeryProps.tsx`, `FlatProps.tsx`),
and the kind added to `PropKind` (`types.ts`). Frame: x along the long side,
y out of the face (for upright things — bag, mug, alarm clock — y is the
height), z across. Kinds so far: passport, folder, sheet, form, pen; roll,
loaf (`open` = sliced), bag, box (`open` = lid), slice, wallet (`open`),
card, coins; clock, sandwich, lunchbox (`open` = lid), mug, key.

---

## 7b. The cast models (Blender)

`blender/cast.py` builds each character; `npm run cast` (or `npm run cast --
sijan --preview <dir>` for front/side/face PNGs) rebuilds both in about a
minute and writes `public/models/cast/<name>.glb`. Blender 5.2 is at
`C:/Program Files/Blender Foundation/Blender 5.2/` (or set `BLENDER`).

- **Shapes are distance fields**: ellipsoids and capsules blended with a
  smooth minimum, meshed with surface nets, projected onto the surface and
  decimated. Per-character differences are in `CAST` (build, hair, beard,
  brows, jacket, lanyard) and `BUILDS` (m/f proportions).
- **The skeleton is rig.ts's**: bones sit on the joints `P` describes (arms
  40° out at rest, palms in, thumbs forward). Hands have three bones per
  finger and thumb; the head has `jaw`, `eye_L/R`, `lid_L/R`; the jacket has
  `jacket_L` for the pocket panel.
- **Weights and colours come from the shapes**: each vertex is weighted to
  the bones of the nearest primitives; each face gets the material *name*
  of its nearest primitive (`skin`, `sleeve`, `top`, `cuff`, `trousers`,
  `shoes`, `jacket`, `lining`, `hair`, `lips`, `mouth` …). `Person3D.tsx`
  paints those from the Look3D, so colours stay in the scene file.
- **Shape keys**: `wide`, `round`, `smile` (mouth), `brows`.
- **Posing** (`Person3D.tsx`): every bone gets a basis from the solved Body;
  the same function on the rest pose gives the rest basis, and the bone is
  turned by the difference. Rig joints (pelvis, shoulders, elbows, wrists,
  hips, knees, ankles, neck) are placed exactly, so props stay in the hands.
  `JAW` and `LID` set how far the jaw drops and the lids close.
- `rig.ts`'s `pocketIn` spot moved forward (0.07 → 0.12) so the hand goes
  under the jacket panel instead of into the chest.

---

## 8. Checking a film (do this before shipping)

Stills are cheap once bundled (about 10 s each):

```
cd remotion
npx remotion bundle src/index.ts --out-dir=<tmp>/bundle
npx remotion still <tmp>/bundle c010 <tmp>/f860.png --frame 860 --scale=0.5
```

Re-bundle after every code change. A stale bundle shows the old film.

**Motion needs a preview.** Render the whole film at quarter size (about
3 minutes for 80 s on this laptop), then tile every 8th frame into contact
sheets. A pop in a hand-over, a skating foot or a hand through the desk shows
in a sheet where a single still hides it.

```
npx remotion render <tmp>/bundle c010 out/c010-preview-quarter.mp4 --scale=0.25 --crf=28
ffmpeg -i out/c010-preview-quarter.mp4 -vf "select='between(n\,830\,925)*not(mod(n-830\,8))',scale=480:270,tile=4x3" -frames:v 1 -fps_mode vfr sheet.png
```

(On Windows, `drawtext` needs a local copy of a font file (e.g. `arial.ttf`)
passed as `fontfile=arial.ttf`; a `C:/` path breaks the filter parser.)

**Frame numbers.** The film is longer than `dialogues.json` because of the
gaps. Line i's new start = its old `enterAt` + the sum of gaps 0..i, in
frames. For c010 (gaps shortened by 0.5 s each on 2026-09-24): line 0 at 206,
3 at 623, 4 at 772, 7 at 1176, 8 at 1268, 9 at 1366, 10 at 1591, 11 at 1685,
12 at 1844; the film is 2347 frames.

**Measuring instead of guessing.** The solver runs in Node. Bundle a small
script with esbuild and print positions, e.g. how high the pen tip sits
above the paper:

```
npx esbuild src/acted/debug.ts --bundle --platform=node --format=esm --outfile=<tmp>/dbg.mjs --loader:.json=json
node <tmp>/dbg.mjs
```

(`import { FILMS } from "../data"`, `compile`, `World`, `SETS3D`, then call
`world.body(name, frame)`, `world.prop(name, frame)`, `world.ink(...)`.)
Delete the debug file afterwards.

After `npm run film`, check the shipped file: `ffprobe` should show
1280×720, yuv420p, tv range, and the right duration; then make a contact sheet
from `video/<id>.mp4` itself.

---

## 9. How it works inside (for changing the engine)

- **Compile** (`timeline.ts`): beats are processed in order. Each writes keys
  onto channels: number tracks (sit, lean, twist, smile, brows, jacket, grip,
  point, chair x/z/yaw), path segments (walks, steps, scoots), hand segments,
  look segments, pulses (nods, bobs), prop holders. **A new move overrides
  everything after its start** on that channel, and **starts from wherever the
  channel is at that frame**. That is why beats can be written without knowing
  about each other.
- **Solve** (`rig.ts`): per frame, the core is solved first (root, gait feet,
  sitting pelvis, spine lean and twist, shoulders, legs by two-bone IK with the
  knees pointing forward). Then the hands: target, then palm orientation,
  then two-bone IK with the elbow down and out. Writing corrects the hand
  until the pen tip is on the paper. Then the gaze: the head turns ~80% of the
  way, the eyes do the rest.
- **World** (`world.ts`): everything is a memoised function of (who, frame),
  so dependencies resolve lazily. A prop in a hand stores the offset it had
  when taken; a prop being put down blends from where it was to its spot.
  Ink samples the pen tip every quarter frame and keeps the points where the
  tip touched the paper, in the paper's own frame, so the ink moves with the
  form.
- **Render** (`SceneActed.tsx`): `ThreeCanvas` with `flat` (no tone mapping,
  so the palette colours stay true), a hemisphere light plus one shadowed
  directional light, toon materials everywhere; overlays are projected
  through the same camera.

---

## 9b. Smoothness (measure it)

The user found the films "not smooth"; the causes were real jolts, found by
measuring rather than watching. A debug script (section 8) that records
pelvis, head, head-forward, wrists, ankles and every prop per frame and
lists the biggest second differences (mm/frame²) finds them in seconds.
What they were, and what fixed them (all in the engine now):

- **Gaze by point**: the look point slid in a straight line between targets
  and could pass the head; now the *direction* turns (`slerpDir`).
- **Head yaw/pitch**: a steep look down to one side swung the yaw across; the
  head now takes the single rotation from chest-forward to the target.
- **Targets behind or at the head** (a partner walked past, a doorway being
  walked through) settle to straight ahead instead of flipping.
- **Walk corners** are rounded (Chaikin) and the turn into/out of a walk takes
  0.32 s per radian; wide looks take 0.3 s per radian at least.
- **Carry** settles over 20 frames, not 10.
- In a scene: don't send a hand to a body spot while the body spins round
  under it — finish the reach, `turn`, then `walk`.

Hand-overs where a prop jumps between a world spot and a body spot still
show ~0.2 m/f² for a frame or two (c010's sheet); not yet fixed.

## 9c. Best practices for smooth video (write scenes this way)

A checklist for anyone writing or changing an acted film. Each rule comes
from a jolt that was measured and fixed on c010, c018 or c001.

**Timing**

- Give a move time in proportion to its size. As a guide: a reach of 0.5 m
  takes 0.5–0.7 s; a turn takes about 0.3 s per radian (a half turn, 0.9–1.0 s);
  a look across a wide angle takes 0.4 s or more. The engine sets minimums
  for turns and looks, but the scene should not rely on them.
- One thing at a time for the body. **Finish a reach, then `turn`, then
  `walk`.** Starting a walk with a big turn while a hand is travelling to a
  body spot (`present`, `read`) whips the hand round: the hand is heading for
  a point that swings with the body.
- Leave 0.05–0.1 s between the end of one hand move and the next on the
  same hand (`take` at the reach's end + 0.02 s, then the next `reach`).
  Moves that start exactly as the last ends are fine; moves that start in
  the middle of the previous one change direction abruptly.
- Add a silence (`gaps`) rather than squeezing business under a line. If
  it takes longer to do than to say, the film gets longer, not faster.

**Where people and things are**

- **Keep targets within reach.** Arm length is about 0.6 m from the
  shoulder (less for Shruti, k = 0.94). Anything further needs a `lean`
  (0.2–0.3) or a `step` closer. Check with the solver: at each `take` the
  palm should be within ~5 cm of the prop (about 10 cm for tiny props like a
  key).
- Put things where the hand that takes them is: facing -x, the right hand
  is on the -z side; facing +x, on the +z side; facing the camera, on the
  -x side.
- Don't look at a point you are about to walk through (a doorway). The
  engine now settles such a gaze to straight ahead, but it is cleaner to
  `look` somewhere else before the walk.
- Walk paths: give a few points round obstacles and let the engine round
  the corners; don't zig-zag. Leave 0.3 m between a path and furniture.
- Never `step` or `walk` to where the person already stands (it is skipped
  now, but it means a beat is wrong).

**Props**

- Use `grip: "keep"` for hand-overs (it holds the prop as the fingers
  closed), `grip: "carry"` to pick something up and walk off with it, or
  for a thing whose hold matters (a mug stays upright only with `carry`).
- Put a prop down with the hand already at the spot (reach there first,
  `put` at the reach's end): the prop blends only the last few centimetres.
- Things inside other things (`put … into`) move with their container;
  reaching into something the other hand holds works (the other hand is
  solved first).

**Camera**

- **Move the camera only when needed** (the user's direction): one
  establishing shot, one master per room, and a `glide` (1.2–2.6 s) when
  someone walks out of frame or the action moves rooms. No cuts for
  coverage.
- Check that the master shows every object a callout rings. In c018 the
  till stood in front of the cake stand until it was moved to her edge of
  the counter and the camera went 0.2 m left.

**Sound**

- No footsteps (the user's direction). Room sounds (bell, slicer, till,
  coins, chair, typing, pen) stay low under the voices (volume 0.25–0.45).

**Check before rendering**

1. Solve every frame in Node and print the biggest jolts (section 9b).
   Anything over ~0.15 m/frame² on a head, wrist or prop is worth a look.
   The first three frames (under the title card and the fade) don't matter.
2. Render stills at the key moments (a hand-over, each walk, each callout).
3. Only then run `npm run film`. Studio's live playback can stutter on a 3D
   scene because it renders in real time; that is not the film. Judge
   smoothness from a rendered file or a quarter-size render.

## 10. Traps (each cost a render)

- **A zero-length `step` or `walk`** (stepping to where you already stand)
  used to divide by zero in the gait and NaN every body after it; they are
  skipped now.
- **Reaching into something the other hand holds** (the card in the wallet
  in his other hand) solves that hand first and reads the prop through it
  (`propVia`); before that it overflowed the stack.
- **The jacket panel only lifts** (0.32 rad at `open: 1`). Swung wider it came
  out like a door and hid his face in a close-up.
- **Reaching for a prop and then taking it** makes the hand chase itself: the
  target is the prop, and the prop is now in the hand. The rig freezes the
  target at the frame before the take. Keep that if you touch `resolveTarget`.
- **Looking at a prop in your own hand** is the same loop through the gaze.
  `lookPoint` reads the hand directly for that case. The symptom of either
  loop is `RangeError: Maximum call stack size exceeded` on some frames.
- **The look verb's target is `to`, not `at`.** `at` is every beat's cue;
  giving `look` an `at` target made them collide.
- **Brows sloping in towards the nose read as anger**, and a heavy lid in the
  shade colour reads as a scowl. Both faces looked furious in the first
  render.
- **A shade-coloured nose is a clown's nose** from the front. Use the skin
  colour and let the toon shading give it form.
- **Finger curl is a positive angle about the hand's z**, towards the palm.
  The other sign bends the fingers backwards and every resting hand reads
  palm-up.
- **The inside pocket is at chest height** (0.25 m below the shoulder line),
  not at the collar, or the hand ends up in the beard.
- **The pen tip needs several correction passes.** With two it hovered 5 mm
  up and the ink came out as dots.
- **Reach is limited.** Across the 0.7 m desk a hand-over only works with both
  leaning (0.25–0.3). She can't reach the signature line on his side, so at
  "Genau" she points rather than taps.
- **`<Model>` memoises on the value of `scale`.** An inline array that
  re-cloned the mesh every frame would make a render take hours.
- **Rendering needs ANGLE** (`remotion.config.ts`) for WebGL headless on
  Windows.
- **`remotion/public/` is gitignored** apart from `public/models/`. A GLB
  referenced but not copied gives a 404 at render time; add the model to
  `public/models/kenney/`.
- **three.js warnings** in the render log (`PCFSoftShadowMap has been
  removed`, `THREE.Clock deprecated`) are harmless.

---

## 11. Current state

**2026-09-24: three acted films, all using the Blender cast, none rendered
yet** — the user reviews each in Studio first, then `npm run film c010 c018
c001`. Frame numbers (after gaps):

- c010: lines at 206 623 772 … 1844, 2347 frames
- c018: 0:194 1:306 2:556 3:642 4:834 5:942 6:1029 7:1105 8:1324 9:1516
  10:1595 11:1771 12:1956, 2386 frames
- c001: 0:224 1:336 2:443 3:543 4:660 5:769 6:1000 7:1077 8:1319 9:1425
  10:1556 11:1677, 2097 frames

To check a film solves on every frame before rendering, bundle a debug
script as in section 8 that runs `world.body` / `world.prop` over every frame
and prints the palm-to-prop distance at each `take`.

### Earlier state (the pilot)


- **c010** is acted and shipped: `video/c010.mp4` (82.8 s, 720p, 6.4 MB),
  poster `video/c010.jpg`, manifest updated. Deleting `acted:` in
  `src/scenes/c010.ts` and re-rendering brings back the drawn version.
- The other 49 films are drawn and unaffected.
- One 3D room exists: `buergerbuero`. The drawn Bürgerbüro set is also used
  by c038, c039 (as a bank), c041 (a practice), c043 (an office) and c044
  (customer service). Those could reuse the 3D room with new spots and props.

### Known limits

- Colour edges that are not a straight cut (the lips, where the neck meets
  the shirt) are slightly ragged in close-ups; the cuffs and waistband are
  cut clean (`Family.cuts`).
- The thumb's grip is approximate; fingers curl about the hand's own axis.
- Seated legs pass into the desk's side panel.
- Mean loudness is about −21.7 dB against the drawn films' −19, because of
  the added silences; the voices themselves are unchanged.
- Installing the 3D packages printed 16 npm audit warnings, not yet reviewed.

### Ideas not done

- A proper knee-hole desk so seated legs don't clip.
- More rooms (office, Apotheke, Bahnhof) and a shared prop library.
- Shot presets per room, so a new scene only chooses shot names.
