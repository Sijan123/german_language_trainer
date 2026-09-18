/*
 * The line being spoken, as a card with a tail pointing at whoever said it.
 *
 * The karaoke is the point of this component. Each German word darkens on the
 * frame the aligner says the voice reaches it, so a learner can see which
 * sound belongs to which word — the thing a flat subtitle cannot teach, and
 * the reason the film is worth more than the transcript.
 *
 * A word does not snap from grey to black. It crosses over about four frames
 * and lifts a pixel as it goes, because a hard switch at 30fps reads as a
 * flicker rather than as a word arriving. The English underneath does not
 * animate at all: it is there to be glanced at, and a moving translation pulls
 * the eye off the German.
 */

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, speakerColor } from "../theme";
import type { Line } from "../types";

const WIDTH = 1080;
const PAD_X = 42;
const PAD_Y = 34;

type Props = {
  line: Line;
  /** where the tail should point, in frame coordinates */
  tailX: number;
  index: number;
  total: number;
  /** the bubble's own left edge and bottom edge in the frame */
  left: number;
  bottom: number;
};

export const SpeechBubble: React.FC<Props> = ({ line, tailX, index, total, left, bottom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = speakerColor(line.s);

  const t = frame - line.enterAt;
  const enter = spring({ frame: t, fps, config: theme.spring.settle, durationInFrames: 20 });

  /* Out faster than in, and out of the way before the next one opens. */
  const leave = interpolate(frame, [line.endAt - 9, line.endAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in
  });

  const shown = enter * (1 - leave);
  if (shown <= 0.002) return null;

  /* The tail is a triangle pinned to the bubble's bottom edge and aimed at the
     speaker. Clamped inside the card so a wide frame cannot detach it. */
  const tailAt = Math.max(70, Math.min(WIDTH - 70, tailX - left));

  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width: WIDTH,
        opacity: shown,
        transform:
          `translateY(${interpolate(enter, [0, 1], [46, 0]) + leave * 20}px) ` +
          `scale(${interpolate(enter, [0, 1], [0.95, 1]) * (1 - leave * 0.02)})`,
        transformOrigin: `${tailAt}px 100%`
      }}
    >
      {/* the tail, drawn under the card so the card's edge hides its base */}
      <svg
        width={WIDTH}
        height={40}
        viewBox={`0 0 ${WIDTH} 40`}
        style={{ position: "absolute", left: 0, bottom: -33, overflow: "visible" }}
      >
        <path
          d={`M${tailAt - 34} 0 L${tailAt + 6} 38 L${tailAt + 30} 0 Z`}
          fill={theme.color.surface}
        />
      </svg>

      <div
        style={{
          position: "relative",
          background: theme.color.surface,
          borderRadius: 26,
          padding: `${PAD_Y}px ${PAD_X}px`,
          boxShadow: `0 2px 4px rgba(31,42,60,.07), 0 26px 64px rgba(31,42,60,.19)`
        }}
      >
        {/* who is talking, and where we are */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: color.ink,
              color: "#ffffff",
              borderRadius: 999,
              padding: "7px 18px 8px",
              fontFamily: theme.font.body,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "0.02em"
            }}
          >
            {/* a phone glyph, because every line in this dialogue is one end of
                a call and the chip is where that belongs */}
            <svg width={17} height={17} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1a11.4 11.4 0 0 0 .57 3.6a1 1 0 0 1-.25 1z"
                fill="#ffffff"
              />
            </svg>
            {line.s}
          </span>

          <span
            style={{
              fontFamily: theme.font.mono,
              fontSize: 21,
              letterSpacing: "0.06em",
              color: theme.color.inkFaint
            }}
          >
            {index + 1} / {total}
          </span>
        </div>

        {/* ------------------------------------------------------- the German */}
        <div
          style={{
            fontFamily: theme.font.body,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: "70px",
            letterSpacing: "-0.012em",
            /* Words are inline-block so each can lift on its own; the row gap
               has to be a px value, because an em gap in a flex container
               resolves against the parent font size and not this one. */
            display: "flex",
            flexWrap: "wrap",
            columnGap: 15,
            rowGap: 0
          }}
        >
          {line.words.map((w, i) => {
            const lit = interpolate(frame, [w.from - 1, w.from + 3], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: theme.ease.out
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: lit > 0.5 ? theme.color.ink : "#b3b7c2",
                  opacity: interpolate(lit, [0, 1], [0.85, 1]),
                  transform: `translateY(${interpolate(lit, [0, 1], [2, 0])}px)`,
                  transition: "none"
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>

        {/* ------------------------------------------------------ the English */}
        <div
          style={{
            marginTop: 14,
            fontFamily: theme.font.body,
            fontStyle: "italic",
            fontSize: 30,
            lineHeight: "40px",
            color: theme.color.inkFaint
          }}
        >
          {line.en}
        </div>
      </div>
    </div>
  );
};

export const BUBBLE_WIDTH = WIDTH;
