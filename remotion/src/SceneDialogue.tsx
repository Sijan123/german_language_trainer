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
import type { Dialogue, Scene } from "./types";

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
const Rooms: React.FC<{ scene: Scene; drift: number }> = ({ scene, drift }) => (
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

    {/* which room is which, small, top corners */}
    {scene.rooms.map((room, i) => (
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
    ))}
  </AbsoluteFill>
);

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

  return (
    <AbsoluteFill style={{ background: theme.color.bg, overflow: "hidden" }}>
      {/* --------------------------------------------------------- audio */}
      {d.lines.map((l) => (
        <Sequence key={l.i} from={l.audioAt} durationInFrames={l.audioFrames} layout="none">
          <Audio src={staticFile(l.clip)} />
        </Sequence>
      ))}

      {/* ---------------------------------------------------------- rooms */}
      <div style={{ opacity: arrive }}>
        <Rooms scene={scene} drift={drift} />
      </div>

      {/* --------------------------------------------- people and pointer */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0 }}
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
