/*
 * A Gespräch played out on a drawn set.
 *
 * Two rooms side by side, one person standing in each, and a card at the
 * bottom carrying whatever is being said. For c002 that is a shop and a
 * kitchen, because the script is a phone call — see src/scenes/c002.ts for why.
 *
 * The composition owns all the timing. It works out, for the current frame,
 * which line is up, which word of it the voice has reached and whether it is
 * mid-word or in a gap; everything under it is told the answer rather than
 * working it out again. That is what keeps the mouth, the karaoke and the
 * callout agreeing with each other — they are three readings of one clock.
 *
 * Layer order, bottom to top: rooms, characters, callout, bubble, cards,
 * grade, grain, vignette. The grade has to sit above the drawn sets or the
 * shop and the kitchen never quite look like they are lit by the same film.
 */

import React from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig
} from "remotion";
import { theme } from "./theme";
import { Grade, Grain, Vignette } from "./components/Layers";
import { SETS, findAnchor } from "./components/sets";
import { Character } from "./components/Character";
import { SpeechBubble, BUBBLE_WIDTH } from "./components/SpeechBubble";
import { Callout } from "./components/Callout";
import { Thought } from "./components/Thought";
import type { ThoughtName } from "./components/ThoughtIcons";
import { TitleCard, WortschatzCard } from "./components/Cards";
import type { Dialogue, Film, Scene, Shot } from "./types";

const W = 1920;
const H = 1080;

/* Roughly what a callout's arrow plus its tag need above the ring: the ring's
   padding, the gap, the 62px arrow and the tag itself. Used to decide which
   side of the box the tag goes on. */
const CALLOUT_TAG_SPACE = 130;

/* ------------------------------------------------------------------ */
/* Rooms                                                               */
/* ------------------------------------------------------------------ */

/*
 * The two sets, and the seam between them.
 *
 * A hard butt join reads as a rendering mistake, so the seam is drawn: a
 * shadow falling into the gap from both sides and a thin light line down the
 * middle. It is the one piece of the frame that is not trying to be a place.
 */
const Rooms: React.FC<{ scene: Scene; drift: number; labels?: boolean }> = ({
  scene,
  drift,
  labels = true
}) => (
  <AbsoluteFill>
    {scene.rooms.map((room, i) => {
      const def = SETS[room.set];
      const Set = def.Component;
      const width = room.to - room.from;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: room.from,
            top: 0,
            width,
            height: H,
            overflow: "hidden"
          }}
        >
          {/* A very slow push, opposite in the two rooms, so a fifty-second
              static shot is never quite static. */}
          <div
            style={{
              /* The set's own width, not the room's: a half-frame drawing
                 dropped into a full-frame room would leave the other half
                 blank rather than stretching to fill it. */
              width: def.width,
              height: H,
              transformOrigin: i === 0 ? "70% 55%" : "30% 55%",
              transform: `scale(${1.02 + drift * (i === 0 ? 0.012 : -0.012)})`
              /* No offset here on purpose: each set's viewBox is already
                 written in full-frame coordinates, so the kitchen's starts at
                 x=960 and lands itself. Translating it as well drew it off the
                 side of its own room and left the right half of the frame
                 empty. */
            }}
          >
            <Set />
          </div>
        </div>
      );
    })}

    {/* The seam, only where two rooms actually meet. A single full-width set
        is one place, and a line down the middle of it would invent a wall. */}
    {scene.rooms.length > 1 ? (
    <div
      style={{
        position: "absolute",
        left: scene.rooms[0].to - 26,
        top: 0,
        width: 52,
        height: H,
        background:
          "linear-gradient(90deg, rgba(31,42,60,0) 0%, rgba(31,42,60,.13) 45%," +
          " rgba(255,255,255,.26) 50%, rgba(31,42,60,.13) 55%, rgba(31,42,60,0) 100%)"
      }}
    />
    ) : null}

    {/* which room is which, small, top corners. A filmed scene turns these
        off and prints one chip for the current shot instead: these are placed
        against the seam, and there is no seam once the camera is inside a
        single room. */}
    {labels ? scene.rooms.map((room, i) => (
      <div
        key={room.set + i}
        style={{
          position: "absolute",
          top: 38,
          left: i === 0 ? room.from + 40 : undefined,
          right: i === 0 ? undefined : W - room.to + 40,
          fontFamily: theme.font.mono,
          fontSize: 20,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: theme.color.inkSoft,
          background: "rgba(255,255,255,.72)",
          borderRadius: 999,
          padding: "8px 18px"
        }}
      >
        {room.label ?? SETS[room.set].label}
      </div>
    )) : null}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* The camera                                                          */
/* ------------------------------------------------------------------ */

/*
 * Where the camera is on this frame, for a scene that carries a `film` block.
 *
 * A shot belongs to the line that names it and is held until a later line
 * names another, so the span a move is spread across is "until the next
 * setup", not "until the next line". That is what lets a two-shot cover the
 * first two lines and still push for the whole eight seconds rather than
 * snapping back at the line break.
 *
 * Returns the window it is looking at, in full-frame coordinates. Turning
 * that into a transform is the caller's job because the people and the rooms
 * are in different layers and have to be given the same one.
 */
function cameraAt(
  film: Film,
  lines: Dialogue["lines"],
  frame: number
): { x: number; y: number; w: number } {
  /* Every setup in the film, in the order it is cut to, with the frame it
     lands on. The opening shot runs under the title card from frame 0. */
  const setups: { at: number; shot: Shot }[] = [];
  if (film.open) setups.push({ at: 0, shot: film.open });
  for (const l of lines) {
    const shot = film.shots[l.i];
    if (shot) setups.push({ at: l.enterAt, shot });
  }
  if (!setups.length) return { x: W / 2, y: H / 2, w: W };

  let k = 0;
  while (k + 1 < setups.length && frame >= setups[k + 1].at) k++;
  const cur = setups[k];
  const end = k + 1 < setups.length ? setups[k + 1].at : lines[lines.length - 1].endAt;
  /* How far through this setup we are. A one-frame setup would divide by
     zero, which is a staging mistake rather than something to survive, but a
     NaN camera is invisible in a still and obvious in a render, so clamp. */
  const span = Math.max(1, end - cur.at);
  const t = Math.min(1, Math.max(0, (frame - cur.at) / span));

  const s = cur.shot;
  const move = s.move ?? "push";
  /* The move, as a fraction of the window. Small on purpose: 4% across four
     seconds is the drift of an operator holding a shot, and anything more
     across a fifty-second film reads as a zoom effect. */
  const glide = theme.ease.inOut(t);
  let w = s.w;
  let x = s.x;
  const y = s.y;
  if (move === "push") w = s.w * (1 - 0.04 * glide);
  if (move === "pull") w = s.w * (1 + 0.04 * glide);
  if (move === "left") x = s.x - s.w * 0.03 * glide;
  if (move === "right") x = s.x + s.w * 0.03 * glide;

  /* A cut is a discontinuity and is left as one. A shot marked `cut: false`
     is a move, so it is eased out of the previous framing over half a second
     — the camera following something rather than the edit changing angle. */
  if (s.cut === false && k > 0) {
    const prev = setups[k - 1].shot;
    const g = theme.ease.inOut(Math.min(1, (frame - cur.at) / 15));
    return {
      x: prev.x + (x - prev.x) * g,
      y: prev.y + (y - prev.y) * g,
      w: prev.w + (w - prev.w) * g
    };
  }
  return { x, y, w };
}

/*
 * The float that makes it an operator rather than a tripod.
 *
 * Two sine waves whose periods do not divide into each other, so the path
 * never repeats inside a film's length and never crosses its own start. The
 * amplitude is in window-fractions so a tight shot floats by the same visible
 * amount as a wide one — a fixed pixel wobble is invisible when wide and
 * seasick when close.
 */
function handheld(frame: number, fps: number) {
  const a = (frame / (fps * 6.3)) * Math.PI * 2;
  const b = (frame / (fps * 4.1)) * Math.PI * 2;
  return {
    dx: Math.sin(a) * 0.006 + Math.sin(b * 0.37) * 0.003,
    dy: Math.cos(b) * 0.005 + Math.sin(a * 0.53) * 0.002
  };
}

/* ------------------------------------------------------------------ */

export const SceneDialogue: React.FC<{ dialogue: Dialogue; scene: Scene }> = ({
  dialogue: d,
  scene
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* A split scene is usually a phone call, but not always - see Scene.call. */
  const isCall = scene.call !== false;

  /* ---------------------------------------------------------- the clock */

  /* The line on screen: the last one that has opened and not yet closed. */
  const line =
    d.lines.find((l) => frame >= l.enterAt && frame < l.endAt) ??
    (frame >= d.lines[d.lines.length - 1].endAt ? null : null);

  /* Is a word sounding right now? The gaps between words are real — they come
     from the aligner — so the mouth can close in them. */
  const voicing = !!line && line.words.some((w) => frame >= w.from && frame < w.to);

  const outroAt = d.durationInFrames - d.outro;
  const inScene = frame < outroAt;

  /* The whole set arrives once, under the title card, so the film does not
     open on a hard cut to a finished drawing. */
  const arrive = spring({ frame, fps, config: theme.spring.settle, durationInFrames: 34 });
  const drift = Math.sin((frame / (fps * 19)) * Math.PI * 2);

  /* ------------------------------------------------------- the callout */

  const callout = line ? scene.callouts[line.i] : undefined;
  const box = callout ? findAnchor(scene.rooms, callout.at) : null;
  /* It waits for its word. Falls back to the start of the line if the scene
     file names a word that is not in it, which is a typo rather than a crash. */
  const calloutWord = callout && line
    ? line.words.find((w) => w.text.replace(/[.,!?;:]/g, "") === callout.word)
    : undefined;

  /* ------------------------------------------------------- the thought */
  /* Same trigger as a callout, but for something that is not in the room.
     A line never gets both: the callout wins, because a ring on the real
     object beats a drawing of it. */
  const thought = line && !callout ? scene.thoughts?.[line.i] : undefined;
  const thoughtWord = thought && line
    ? line.words.find((w) => w.text.replace(/[.,!?;:]/g, "") === thought.word)
    : undefined;
  const thinker = thought && line ? scene.cast[line.s] : undefined;

  /* -------------------------------------------------------- the camera */

  /*
   * A scene with no `film` block gets the identity transform, not a
   * near-identity one: `scale(1) translate(0,0)` still promotes the layer and
   * still resamples it, and the twenty films already rendered have to stay
   * exactly as they are. So the whole camera collapses to null and the two
   * layers are handed `undefined`, which is what they were given before.
   */
  const cam = scene.film ? cameraAt(scene.film, d.lines, frame) : null;
  let camStyle: React.CSSProperties | undefined;
  let roomBlur = 0;
  if (cam && scene.film) {
    const float = handheld(frame, fps);
    const w = cam.w;
    const s = W / w;
    const cx = cam.x + w * float.dx;
    const cy = cam.y + w * float.dy;
    /* transformOrigin is the frame's own top-left, so the window maps by
       scaling about 0,0 and then sliding the window's centre to the centre of
       the frame. Doing it the other way round - origin at the centre - means
       the translation is in post-scale pixels and every shot has to be
       written twice. */
    camStyle = {
      transformOrigin: "0 0",
      transform: `translate(${W / 2 - cx * s}px, ${H / 2 - cy * s}px) scale(${s})`,
      willChange: "transform"
    };
    /* Depth of field, faked the only way a flat drawing allows: the rooms
       soften as the camera closes in and the people, who are in their own
       layer, do not. Scaled by 1/s as well, because the blur is applied
       before the transform and would otherwise be magnified with it. */
    const focus = scene.film.focus ?? 0;
    roomBlur = focus > 0 ? (focus * Math.max(0, s - 1)) / Math.max(1, s) : 0;
  }

  /* The chip in the corner, for a filmed scene: one label for the current
     shot rather than one per room. `null` means the shot asked for none. */
  const shotLabel = (() => {
    if (!scene.film) return undefined;
    const setups: Shot[] = [];
    const ats: number[] = [];
    if (scene.film.open) { setups.push(scene.film.open); ats.push(0); }
    for (const l of d.lines) {
      const sh = scene.film.shots[l.i];
      if (sh) { setups.push(sh); ats.push(l.enterAt); }
    }
    let k = -1;
    for (let j = 0; j < ats.length; j++) if (frame >= ats[j]) k = j;
    return k >= 0 ? setups[k].label ?? null : null;
  })();

  return (
    <AbsoluteFill style={{ background: theme.color.bg, overflow: "hidden" }}>
      {/* --------------------------------------------------------- audio */}
      {d.lines.map((l) => (
        <Sequence key={l.i} from={l.audioAt} durationInFrames={l.audioFrames} layout="none">
          <Audio src={staticFile(l.clip)} />
        </Sequence>
      ))}

      {/* ---------------------------------------------------------- rooms */}
      {/* The camera is applied to the rooms and to the people separately, and
          never to the card, the chips or the grade: those are the things
          printed on the film rather than things in front of the lens. Giving
          them the same transform is what keeps a callout on its object while
          the shot moves. */}
      {/* Both wrappers carry the frame's own box explicitly. A `transform` or
          a `filter` makes an element the containing block for the absolutely
          positioned things inside it, so an auto-sized wrapper would collapse
          to nothing and take the rooms with it - the layer was a bare
          `<div style={{opacity}}>` before there was a camera, and it could
          afford to be. */}
      <div style={{ position: "absolute", inset: 0, width: W, height: H, ...camStyle, opacity: arrive }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: W,
            height: H,
            ...(roomBlur > 0 ? { filter: `blur(${roomBlur.toFixed(2)}px)` } : null)
          }}
        >
          <Rooms scene={scene} drift={drift} labels={!scene.film} />
        </div>
      </div>

      {/* --------------------------------------------- people and pointer */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, ...camStyle }}
      >
        {Object.entries(scene.cast).map(([name, actor], i) => (
          <Character
            key={name}
            id={name}
            actor={actor}
            /* both phones face the middle, which is where the call is */
            facing={actor.x < W / 2 ? 1 : -1}
            active={!!line && line.s === name}
            voicing={voicing && !!line && line.s === name}
            asking={!!line && line.s === name && line.de.trim().endsWith("?")}
            phone={isCall}
            enter={arrive}
            seed={i * 2.7 + 1}
          />
        ))}

        {inScene && line && callout && box && calloutWord ? (
          <Callout
            box={box}
            label={callout.label}
            from={calloutWord.from}
            to={line.endAt}
            /*
             * Which side of the ring the tag sits on.
             *
             * It goes above unless there is not enough headroom for the arrow
             * and the tag, in which case it points down instead. This used to
             * test `box.y < 320` alone, which reads the top of the box and so
             * says nothing about how tall it is: the bus at the Haltestelle
             * starts at y=292 and is 308 high, so it was sent "below" and its
             * tag landed at y≈700, underneath the speech bubble. Anything
             * bigger than a kettle hit this.
             */
            side={box.y - CALLOUT_TAG_SPACE > 40 ? "above" : "below"}
          />
        ) : null}

        {inScene && line && thought && thoughtWord && thinker ? (
          <Thought
            icon={thought.icon as ThoughtName}
            label={thought.label}
            at={thinker.x}
            /* the head is a 96px circle centred on headY, scaled by the actor */
            headTop={thinker.headY - 96 * thinker.scale}
            from={thoughtWord.from}
            to={line.endAt}
          />
        ) : null}
      </svg>

      {/* ------------------------------------------------ the shot's chip */}
      {/* Printed on the film, so it sits outside the camera and does not
          drift, scale or soften with the room behind it. */}
      {scene.film && shotLabel ? (
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 40,
            opacity: arrive,
            fontFamily: theme.font.mono,
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: theme.color.inkSoft,
            background: "rgba(255,255,255,.72)",
            borderRadius: 999,
            padding: "8px 18px"
          }}
        >
          {shotLabel}
        </div>
      ) : null}

      {/* --------------------------------------------------------- bubble */}
      {inScene && line ? (
        (() => {
          const who = scene.cast[line.s];
          const tailX = who ? who.x : W / 2;
          /* The card shifts a little towards the speaker rather than sitting
             dead centre. Both of them stand outside its width, so without the
             lean the tail is pinned to a corner every time and stops reading
             as a tail at all. */
          const lean = tailX < W / 2 ? -96 : 96;
          return (
            <SpeechBubble
              line={line}
              index={line.i}
              total={d.lines.length}
              left={(W - BUBBLE_WIDTH) / 2 + lean}
              bottom={92}
              tailX={tailX}
              call={isCall}
            />
          );
        })()
      ) : null}

      {/* ---------------------------------------------------------- cards */}
      <TitleCard
        startAt={6}
        life={d.intro - 6}
        title={d.title}
        titleEn={d.titleEn}
        topic={d.topic}
        tone={d.tone}
      />
      <WortschatzCard
        startAt={outroAt}
        life={d.outro}
        words={scene.wortschatz}
        tone={d.tone}
      />

      {/* ------------------------------------------------- finish and grain */}
      <Grade />
      <Grain opacity={0.13} />
      <Vignette />

      {/* Open from black and close to it, so the film has ends. */}
      <AbsoluteFill
        style={{
          background: "#1f2a3c",
          pointerEvents: "none",
          opacity:
            interpolate(frame, [0, 14], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: theme.ease.out
            }) +
            interpolate(frame, [d.durationInFrames - 16, d.durationInFrames - 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: theme.ease.in
            })
        }}
      />
    </AbsoluteFill>
  );
};
