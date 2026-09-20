/*
 * The orange pointer: a ring round the thing being talked about, an arrow, and
 * the word for it.
 *
 * It is the only thing in the film allowed to use theme.color.attention, and
 * at most one is ever on screen. That is what makes it work — a frame with two
 * things shouting has nothing being pointed at.
 *
 * It waits for its word. The scene file names the German word the callout
 * belongs to and the aligner says when the voice reaches it, so the ring lands
 * on the fridge on the syllable "Milch" rather than when the bubble opened.
 * That one detail is most of the teaching: the learner hears the word, and the
 * object lights up under it.
 */

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { Anchor } from "../types";

type Props = {
  box: Anchor;
  label: string;
  /** frame the word is reached */
  from: number;
  /** frame the callout goes away — the end of the line it belongs to */
  to: number;
  /** push the tag to the other side when the box is near the frame edge */
  side: "above" | "below";
};

const PAD = 14;

export const Callout: React.FC<Props> = ({ box, label, from, to, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame - from;
  if (t < -2 || frame > to) return null;

  const enter = spring({ frame: t, fps, config: theme.spring.snap, durationInFrames: 18 });
  const leave = interpolate(frame, [to - 8, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in
  });
  const shown = enter * (1 - leave);
  if (shown <= 0.002) return null;

  /* The ring breathes once it has landed, so it keeps drawing the eye for the
     two or three seconds the line is up. */
  const pulse = Math.sin(((frame - from) / (fps * 1.35)) * Math.PI * 2);

  const x = box.x - PAD;
  const y = box.y - PAD;
  const w = box.w + PAD * 2;
  const h = box.h + PAD * 2;

  /* The arrow comes in from whichever side the tag is on and stops short of
     the ring. */
  const arrowLen = 62;
  const tagH = 54;
  const gap = 16;
  const arrowY = side === "above" ? y - gap : y + h + gap;
  const tagY = side === "above" ? arrowY - arrowLen - tagH : arrowY + arrowLen;
  const cx = x + w / 2;

  /*
   * The tag is centred on the ring, but a long word over a box near the edge
   * of the frame runs off it — "die andere Straßenseite" over the crossing at
   * the Haltestelle started at x=-92 and lost its first two words. So the tag
   * slides back inside the frame while the arrow stays on the ring, which is
   * the thing it has to keep pointing at. The arrow still comes out from
   * under the tag, because a tag this wide is wider than the slide.
   */
  const tagW = label.length * 21 + 44;
  const tagCx = Math.min(Math.max(cx, tagW / 2 + 24), 1920 - tagW / 2 - 24);

  return (
    <g opacity={shown}>
      {/* the ring */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill="none"
        stroke={theme.color.attention}
        strokeWidth={6 + pulse * 1.2}
        opacity={0.92}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `scale(${interpolate(enter, [0, 1], [1.12, 1])})`
        }}
      />
      {/* a soft wash inside it, so the object itself lifts rather than just
          being fenced off */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={theme.color.attention}
        opacity={0.1 + pulse * 0.025}
      />

      {/* the arrow, drawn from the tag towards the ring */}
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `translateY(${interpolate(enter, [0, 1], [side === "above" ? -18 : 18, 0])}px)`
        }}
      >
        <line
          x1={cx}
          y1={side === "above" ? arrowY - arrowLen : arrowY + arrowLen}
          x2={cx}
          y2={arrowY}
          stroke={theme.color.attention}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={
            side === "above"
              ? `M${cx - 17} ${arrowY - 20} L${cx} ${arrowY} L${cx + 17} ${arrowY - 20} Z`
              : `M${cx - 17} ${arrowY + 20} L${cx} ${arrowY} L${cx + 17} ${arrowY + 20} Z`
          }
          fill={theme.color.attention}
        />
      </g>

      {/* the word */}
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `scale(${interpolate(enter, [0, 1], [0.86, 1])})`
        }}
      >
        <rect
          x={tagCx - tagW / 2}
          y={tagY}
          width={tagW}
          height={tagH}
          rx={12}
          fill={theme.color.surface}
          stroke={theme.color.attention}
          strokeWidth={3}
        />
        <text
          x={tagCx}
          y={tagY + tagH / 2 + 1}
          fill={theme.color.ink}
          fontFamily={theme.font.body}
          fontWeight={600}
          fontSize={30}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {label}
        </text>
      </g>
    </g>
  );
};
