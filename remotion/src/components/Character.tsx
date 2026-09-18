/*
 * A person, drawn flat and animated from the outside.
 *
 * The component knows nothing about the dialogue. It is told whether this
 * character is speaking, whether a word is sounding at this exact frame, and
 * whether the line is a question — everything it does follows from those
 * three. The timing logic stays in the composition, which has the aligner's
 * output; the drawing just reacts.
 *
 * On the mouth. This is a talking cycle, not lip-sync: the shapes rotate while
 * a word is sounding and the mouth closes in the gaps between words, which the
 * forced alignment gives us for free. The gaps are real, so the mouth stops in
 * the right places, without pretending to know which phoneme is in the air.
 *
 * On the hair. Everything on the face is drawn inside a clip of the head
 * circle, so a fringe or a beard is a plain ellipse cut to the shape of the
 * skull. Hand-written arcs trying to trace a jaw were what made the first
 * attempt look like a motorcycle helmet.
 *
 * On proportion. The head is the unit and everything is a multiple of it:
 * shoulders a little over one and a half heads across, the body a wedge rather
 * than a triangle. Getting that ratio wrong is what made the first pass read
 * as a small face on a beanbag.
 *
 * Drawn around a head centred on (0,0) and placed by the caller.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Actor } from "../types";

const R = 96;                       // head radius — the unit for everything
const SHOULDER = R + 36;
const MOUTH_Y = 41;

type Props = {
  /** unique per character: clip paths need ids that do not collide */
  id: string;
  actor: Actor;
  /** which way the phone and the lean face: +1 towards screen right */
  facing: 1 | -1;
  active: boolean;
  voicing: boolean;
  asking: boolean;
  enter: number;
  /** keeps the blink and sway of the two characters out of step */
  seed: number;
};

export const Character: React.FC<Props> = ({
  id, actor, facing, active, voicing, asking, enter, seed
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Idle sway and breath. Both are on screen for the whole film; without this
     they are cardboard cut-outs standing in a drawn room. */
  const sway = Math.sin((frame / (fps * 3.9)) * Math.PI * 2 + seed);
  const breath = Math.sin((frame / (fps * 2.7)) * Math.PI * 2 + seed * 1.7);

  /* Blink: roughly every four seconds, three frames, never in step with the
     other character. */
  const blinkEvery = Math.round(fps * 4.1);
  const blink = (frame + Math.round(seed * 37)) % blinkEvery < 3 ? 0.1 : 1;

  /* About seven mouth shapes a second while a word sounds; closed between. */
  const shape = voicing ? 1 + Math.floor(((frame * 7.5) / fps) % 3) : 0;

  const lift = active ? 1 : 0;
  const scale = actor.scale * (1 + lift * 0.035) * (1 + breath * 0.006);
  const dim = active ? 1 : 0.82;
  const brow = asking && active ? -8 : 0;

  const clip = "head-" + id;
  const mouthW = shape === 1 ? 18 : shape === 2 ? 22 : 25;
  const mouthH = shape === 1 ? 8 : shape === 2 ? 15 : 20;

  return (
    <g
      transform={
        `translate(${actor.x + sway * 1.8 + facing * lift * 6}, ${actor.headY + breath * 3}) ` +
        `scale(${scale * interpolate(enter, [0, 1], [0.95, 1])})`
      }
      opacity={interpolate(enter, [0, 1], [0, dim])}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx={0} cy={0} r={R} />
        </clipPath>
      </defs>

      {/* ---------------------------------------------------------- the body */}
      {/* Before the head, so the neck tucks under the jaw. It runs past the
          bottom of the frame; the composition clips it. */}
      <rect x={-26} y={R - 18} width={52} height={58} fill={actor.skinShade} />
      <path
        d={
          `M0 ${SHOULDER} ` +
          `c -82 6 -120 60 -128 146 ` +
          `L-130 700 h260 l-2 -404 ` +
          `c -8 -86 -46 -140 -128 -146 z`
        }
        fill={actor.top}
      />
      {/* collar */}
      <path d={`M-48 ${SHOULDER + 2} q48 52 96 0 q-48 32 -96 0 z`} fill={actor.topDark} />

      {actor.basket ? (
        /* The basket is the one piece of staging that says which of the two is
           standing in the shop. It hangs off the arm that is not holding the
           phone, so it never collides with the hand. */
        <g transform={`translate(${-facing * 150}, ${SHOULDER + 214})`}>
          <path d="M-48 0 h96 l-12 84 h-72 z" fill="#b8843f" />
          <rect x={-48} y={0} width={96} height={13} fill="#9d6f32" />
          <path d="M-27 0 a27 24 0 0 1 54 0" fill="none" stroke="#9d6f32" strokeWidth={7} />
          <rect x={-31} y={19} width={28} height={36} rx={4} fill="#a9bd93" />
          <rect x={3} y={26} width={25} height={29} rx={4} fill="#d8907f" />
        </g>
      ) : null}

      {/* the arm that reaches for the ear: in front of the torso, behind the
          head, so the hand can then come back over the jaw */}
      <g transform={`scale(${facing}, 1)`}>
        {/* Starts inside the torso and finishes under the hand. An earlier
            version stopped sixty pixels short and read as a sleeve lying on
            the floor beside them. */}
        <path
          d="M130 300 Q196 158 96 48"
          fill="none"
          stroke={actor.top}
          strokeWidth={34}
          strokeLinecap="round"
        />
      </g>

      {/* --------------------------------------------------- hair behind head */}
      {actor.hairStyle === "bun" ? (
        <>
          {/* wider than the head and barely longer, so it frames the face
              instead of hanging under the chin like a beard */}
          <ellipse cx={0} cy={R * 0.06} rx={R * 1.24} ry={R * 1.13} fill={actor.hair} />
          <circle cx={0} cy={-R * 1.04} r={R * 0.4} fill={actor.hair} />
        </>
      ) : null}

      {/* --------------------------------------------------------- the head */}
      <ellipse cx={-R + 3} cy={5} rx={16} ry={22} fill={actor.skin} />
      <ellipse cx={R - 3} cy={5} rx={16} ry={22} fill={actor.skin} />

      <g clipPath={`url(#${clip})`}>
        {/*
         * Hair first, over the whole skull, and then the face punched back out
         * of it with a circle pushed down. The hairline that leaves is high in
         * the middle and lower at the temples, which is what a hairline does.
         * Drawing the hair as its own ellipse instead gave a shape that tapered
         * to a point over the forehead — a widow's peak nobody asked for.
         */}
        <circle cx={0} cy={0} r={R} fill={actor.hair} />
        <circle
          cx={0}
          cy={actor.hairStyle === "bun" ? R * 0.26 : R * 0.2}
          r={R * 0.96}
          fill={actor.skin}
        />
        {/* the beard sits on the jaw, below the nose */}
        {actor.beard ? (
          <ellipse cx={0} cy={R * 0.96} rx={R * 0.9} ry={R * 0.8} fill={actor.hair} />
        ) : null}
      </g>

      {/* cheeks */}
      <ellipse cx={-55} cy={30} rx={21} ry={12} fill="#e08f80" opacity={0.38} />
      <ellipse cx={55} cy={30} rx={21} ry={12} fill="#e08f80" opacity={0.38} />

      {/* brows */}
      <rect
        x={-52} y={-40 + brow} width={38} height={10} rx={5} fill={actor.hair}
        transform={`rotate(${-4 + (asking && active ? -6 : 0)}, -33, -36)`}
      />
      <rect
        x={14} y={-40 + brow} width={38} height={10} rx={5} fill={actor.hair}
        transform={`rotate(${4 + (asking && active ? 6 : 0)}, 33, -36)`}
      />

      {/* eyes: the blink squashes the whole eye, lids and all */}
      {[-33, 33].map((ex) => (
        <g key={ex} transform={`translate(${ex}, -7) scale(1, ${blink})`}>
          <ellipse cx={0} cy={0} rx={16} ry={18} fill="#ffffff" />
          <circle cx={facing * 2} cy={2} r={8.5} fill="#242c38" />
          <circle cx={facing * 2 - 3} cy={-2.2} r={2.8} fill="#ffffff" />
        </g>
      ))}

      {/* nose */}
      <path
        d="M-3 6 q-10 19 5 23"
        fill="none"
        stroke={actor.skinShade}
        strokeWidth={4.4}
        strokeLinecap="round"
      />

      {/* --------------------------------------------------------- the mouth */}
      {shape === 0 ? (
        <path
          d={`M-19 ${MOUTH_Y} q19 ${active ? 17 : 13} 38 0`}
          fill="none"
          stroke="#8f4a44"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ) : (
        <g>
          <ellipse cx={0} cy={MOUTH_Y + 4} rx={mouthW} ry={mouthH} fill="#8c3a38" />
          {/* the teeth strip is what makes an open mouth read as speech rather
              than as a hole in the face */}
          <rect
            x={-mouthW + 3}
            y={MOUTH_Y + 4 - mouthH + 1}
            width={(mouthW - 3) * 2}
            height={7}
            rx={3}
            fill="#ffffff"
          />
        </g>
      )}

      {/* ------------------------------------------------- the phone and hand */}
      {/* Last, so they sit over the ear and the jaw the way a hand actually
          does. Both characters hold one — it is the only thing on screen that
          says these two rooms are in the same conversation. */}
      <g transform={`scale(${facing}, 1)`}>
        <rect x={R - 20} y={-42} width={30} height={78} rx={9} fill="#39414e" />
        <rect x={R - 15} y={-35} width={20} height={58} rx={5} fill="#626b7a" />
        <ellipse cx={R - 4} cy={30} rx={24} ry={29} fill={actor.skin} />
        <ellipse cx={R - 8} cy={12} rx={13} ry={11} fill={actor.skin} />
      </g>
    </g>
  );
};
