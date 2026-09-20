/*
 * A thought bubble, for the things a room cannot hold.
 *
 * A callout rings something that is actually drawn in the set. That only
 * works while the dialogue talks about what is in front of it — and c005
 * does not. "Der erste Tag im Büro" is the evening *after* the first day, so
 * the desk, the boss, the canteen and tomorrow's bus are all named and none
 * of them is anywhere near the flat. Before this the film had one pointer in
 * thirteen lines and the rest of the vocabulary went by unillustrated.
 *
 * So: a cloud over the speaker's head with a drawing of the thing inside it.
 * The trailing dots are what make it read as *imagining* rather than as a
 * second speech bubble — without them it competes with the subtitle card for
 * the same job.
 *
 * It is deliberately not a callout. Nothing is being pointed at, so there is
 * no ring and no arrow: the drawing is the whole content.
 */

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ThoughtIcon } from "./ThoughtIcons";
import type { ThoughtName } from "./ThoughtIcons";

const BUBBLE_W = 330;
const BUBBLE_H = 252;

type Props = {
  icon: ThoughtName;
  label: string;
  /** x of the head this thought belongs to, in frame coordinates */
  at: number;
  /** top of that head, so the dots start just above it */
  headTop: number;
  from: number;
  to: number;
};

export const Thought: React.FC<Props> = ({ icon, label, at, headTop, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame - from;
  if (t < 0) return null;

  const enter = spring({ frame: t, fps, config: theme.spring.snap, durationInFrames: 20 });
  const leave = interpolate(frame, [to - 8, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in
  });
  const shown = enter * (1 - leave);
  if (shown <= 0.002) return null;

  /*
   * The cloud sits above the speaker and inboard of them, towards the middle
   * of the frame — straight up would put it half off the edge for a figure
   * standing at x=258. Then it is clamped so it cannot leave the frame at
   * all, the same lesson the callout tag taught.
   */
  const inboard = at < 960 ? 214 : -214;
  const cx = Math.min(Math.max(at + inboard, BUBBLE_W / 2 + 28), 1920 - BUBBLE_W / 2 - 28);
  const cy = 236;

  /* A slow bob, so it hangs rather than sits. */
  const bob = Math.sin((frame / (fps * 2.6)) * Math.PI * 2) * 4;

  /*
   * The dots run diagonally from beside the temple to the underside of the
   * cloud — not straight up. The cloud hangs beside the head rather than far
   * above it (its underside is at y≈362 against a head top of y≈374), so a
   * vertical run had about twelve pixels to play with and all three dots
   * landed on top of each other in the bubble's bottom lobe.
   */
  const dir = cx >= at ? 1 : -1;
  const x0 = at + dir * 66;
  const y0 = headTop + 28;
  const x1 = cx - dir * 96;
  const y1 = cy + BUBBLE_H / 2 - 28;
  const dots = [0.1, 0.46, 0.8];

  return (
    <g opacity={shown}>
      {dots.map((f, i) => {
        const dx = x0 + (x1 - x0) * f;
        const dy = y0 + (y1 - y0) * f;
        /* each dot arrives a beat after the one below it */
        const pop = interpolate(enter, [i * 0.18, i * 0.18 + 0.45], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });
        return (
          <circle
            key={i}
            cx={dx}
            cy={dy + bob * f}
            r={(7 + i * 5) * pop}
            fill={theme.color.surface}
            stroke={theme.color.attention}
            strokeWidth={3}
          />
        );
      })}

      <g
        transform={`translate(${cx}, ${cy + bob})`}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center"
        }}
      >
        {/* The cloud: one rounded body plus lobes around the rim. A plain
            rounded rectangle here read as a sticker, not a thought. */}
        <g
          transform={`scale(${interpolate(enter, [0, 1], [0.84, 1])})`}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <g fill={theme.color.surface} stroke={theme.color.attention} strokeWidth={4}>
            <rect
              x={-BUBBLE_W / 2}
              y={-BUBBLE_H / 2}
              width={BUBBLE_W}
              height={BUBBLE_H}
              rx={62}
            />
            <circle cx={-BUBBLE_W / 2 + 54} cy={-BUBBLE_H / 2 + 16} r={40} />
            <circle cx={-26} cy={-BUBBLE_H / 2 - 4} r={46} />
            <circle cx={BUBBLE_W / 2 - 62} cy={-BUBBLE_H / 2 + 22} r={36} />
            <circle cx={BUBBLE_W / 2 - 14} cy={12} r={38} />
            <circle cx={-BUBBLE_W / 2 + 14} cy={24} r={34} />
            <circle cx={-14} cy={BUBBLE_H / 2 - 6} r={42} />
          </g>
          {/* the same shapes again with no stroke, to erase the seams where
              the lobes cross the body */}
          <g fill={theme.color.surface}>
            <rect
              x={-BUBBLE_W / 2 + 3}
              y={-BUBBLE_H / 2 + 3}
              width={BUBBLE_W - 6}
              height={BUBBLE_H - 6}
              rx={60}
            />
            <circle cx={-BUBBLE_W / 2 + 54} cy={-BUBBLE_H / 2 + 16} r={37} />
            <circle cx={-26} cy={-BUBBLE_H / 2 - 4} r={43} />
            <circle cx={BUBBLE_W / 2 - 62} cy={-BUBBLE_H / 2 + 22} r={33} />
            <circle cx={BUBBLE_W / 2 - 14} cy={12} r={35} />
            <circle cx={-BUBBLE_W / 2 + 14} cy={24} r={31} />
            <circle cx={-14} cy={BUBBLE_H / 2 - 6} r={39} />
          </g>

          {/* the icon sits high in the cloud, the word underneath it — at
              translate(0,-26) the desk's legs ran into the label */}
          <g transform="translate(0, -44)">
            <ThoughtIcon name={icon} />
          </g>

          <text
            x={0}
            y={BUBBLE_H / 2 - 38}
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
    </g>
  );
};
