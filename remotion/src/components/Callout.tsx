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
  /**
   * Screen boxes the tag must stay off — the acted films pass the people's
   * heads and the subtitle card, because a label over a face hides the face
   * the learner is watching. Without it the tag goes where `side` says, as it
   * always has in the drawn films.
   */
  avoid?: Anchor[];
};

const PAD = 14;

const overlaps = (a: Anchor, b: Anchor, m: number) =>
  a.x < b.x + b.w + m && a.x + a.w > b.x - m && a.y < b.y + b.h + m && a.y + a.h > b.y - m;

export const Callout: React.FC<Props> = ({ box, label, from, to, side, avoid }) => {
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

  /* A label may be written on two lines ("die Wohnungsgeber-\nbestätigung"):
     a long compound across the frame covered a face. */
  const lines = label.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  const tagW = longest * 21 + 44;
  const tagH = 54 + (lines.length - 1) * 36;
  const gap = 16;
  const cx = x + w / 2;
  const slideIn = (c: number) => Math.min(Math.max(c, tagW / 2 + 24), 1920 - tagW / 2 - 24);

  /* The arrow comes in from whichever side the tag is on and stops short of
     the ring. With boxes to avoid, try the preferred side, then further out,
     then the other side, then slide the tag sideways off whatever it hits. */
  let where = side;
  let arrowLen = 62;
  let tagCx = slideIn(cx);
  if (avoid && avoid.length) {
    const other = side === "above" ? "below" : "above";
    const tries: ["above" | "below", number][] = [[side, 62], [side, 120], [other, 62], [side, 180], [other, 120]];
    const rectFor = (sd: "above" | "below", len: number, c: number): Anchor => {
      const ay = sd === "above" ? y - gap : y + h + gap;
      const ty = sd === "above" ? ay - len - tagH : ay + len;
      return { x: c - tagW / 2, y: ty, w: tagW, h: tagH };
    };
    const clear = (r: Anchor) => r.y > 8 && r.y + r.h < 1072 && !avoid.some((a) => overlaps(r, a, 20));
    const hit = tries.find(([sd, len]) => clear(rectFor(sd, len, tagCx)));
    if (hit) {
      [where, arrowLen] = hit;
    } else {
      /* nowhere clear straight above or below: move sideways, away from the
         first thing in the way, on the preferred side */
      const r = rectFor(side, 62, tagCx);
      const block = avoid.find((a) => overlaps(r, a, 20));
      if (block) {
        const left = slideIn(block.x - 20 - tagW / 2);
        const right = slideIn(block.x + block.w + 20 + tagW / 2);
        const lr = rectFor(side, 62, left);
        const rr = rectFor(side, 62, right);
        tagCx = clear(lr) && (!clear(rr) || Math.abs(left - cx) < Math.abs(right - cx)) ? left : right;
      }
    }
  }
  const arrowY = where === "above" ? y - gap : y + h + gap;
  const tagY = where === "above" ? arrowY - arrowLen - tagH : arrowY + arrowLen;
  /* the arrow leaves from under the tag and points at the ring's middle */
  const ax = avoid ? Math.min(Math.max(cx, tagCx - tagW / 2 + 26), tagCx + tagW / 2 - 26) : cx;
  const ay0 = where === "above" ? arrowY - arrowLen : arrowY + arrowLen;
  const ang = Math.atan2(arrowY - ay0, cx - ax);
  const head = (sx: number) => {
    const bx = cx - Math.cos(ang) * 20;
    const by = arrowY - Math.sin(ang) * 20;
    return [bx + sx * Math.sin(ang) * 17, by - sx * Math.cos(ang) * 17];
  };

  /*
   * The tag is centred on the ring, but a long word over a box near the edge
   * of the frame runs off it — "die andere Straßenseite" over the crossing at
   * the Haltestelle started at x=-92 and lost its first two words. So the tag
   * slides back inside the frame (slideIn, above) while the arrow stays on
   * the ring, which is the thing it has to keep pointing at.
   */

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
          transform: `translateY(${interpolate(enter, [0, 1], [where === "above" ? -18 : 18, 0])}px)`
        }}
      >
        <line
          x1={ax}
          y1={ay0}
          x2={cx}
          y2={arrowY}
          stroke={theme.color.attention}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={`M${head(1).join(" ")} L${cx} ${arrowY} L${head(-1).join(" ")} Z`}
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
        {lines.map((l, i) => (
          <text
            key={i}
            x={tagCx}
            y={tagY + 27 + 1 + i * 36}
            fill={theme.color.ink}
            fontFamily={theme.font.body}
            fontWeight={600}
            fontSize={30}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {l}
          </text>
        ))}
      </g>
    </g>
  );
};
