/*
 * The bedroom, early. Drawn for the left-hand room (viewBox from x=0).
 *
 * It exists for the morning dialogues, and the object it is really built
 * around is the alarm clock: "Der Wecker hat nicht geklingelt" is a whole
 * conversation about one small thing on a nightstand, so that thing is drawn
 * big enough to survive a callout ring round it at 720p.
 *
 * Cooler and dimmer than the kitchen. Two rooms of the same flat need to read
 * as different places, and the light is the only thing doing that work.
 *
 * The wardrobe sits far left, behind where the character stands — the set has
 * to leave the middle of its half clear, because a figure stands there for
 * the whole film.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.bedroom;

/** Everything on this set a callout can point at. */
export const schlafzimmerAnchors: Record<string, Anchor> = {
  bett: { x: 418, y: 404, w: 404, h: 244 },
  wecker: { x: 850, y: 440, w: 84, h: 62 },
  fenster: { x: 500, y: 150, w: 244, h: 214 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const schlafzimmerKeywords: Record<string, string[]> = {
  wecker: ["wecker", "akku", "handy", "uhr", "klingeln", "geklingelt", "gestellt", "batterie", "alarm"],
  bett: ["bett", "schlafen", "geschlafen", "müde", "aufstehen", "decke", "kissen", "traum"],
  fenster: ["fenster", "draußen", "wetter", "regnet", "sonne", "morgen", "dunkel", "hell"]
};

const A = schlafzimmerAnchors;

export const Schlafzimmer: React.FC = () => (
  <svg
    viewBox="0 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} ceiling={118} />
    <Floor x={0} palette={c} vanishAt={360} />
    <rect x={0} y={HORIZON - 16} width={960} height={16} fill={c.skirting} />

    {/* the wardrobe, far left and mostly behind whoever is standing here */}
    <rect x={-30} y={176} width={224} height={HORIZON - 176} fill={c.wardrobe} />
    <rect x={-20} y={188} width={100} height={HORIZON - 200} rx={4} fill={c.wardrobeDark} opacity={0.4} />
    <rect x={88} y={188} width={96} height={HORIZON - 200} rx={4} fill={c.wardrobeDark} opacity={0.4} />
    <rect x={72} y={380} width={10} height={54} rx={5} fill={c.woodDark} />
    <rect x={92} y={380} width={10} height={54} rx={5} fill={c.woodDark} />

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.frame} />

    {/* --------------------------------------------------------- anchor: bett */}
    {/* Headboard, then the mattress, then a duvet thrown back — he has just
        got out of it, and a made bed would contradict the whole dialogue. */}
    <rect x={A.bett.x - 6} y={A.bett.y} width={A.bett.w + 12} height={70} rx={8} fill={c.wood} />
    <rect x={A.bett.x} y={A.bett.y + 62} width={A.bett.w} height={54} fill={c.sheet} />
    <rect x={A.bett.x + 26} y={A.bett.y + 30} width={150} height={52} rx={14} fill={c.pillow} />
    <rect x={A.bett.x + 188} y={A.bett.y + 34} width={140} height={48} rx={14} fill={c.pillow} opacity={0.8} />
    <path
      d={
        `M${A.bett.x} ${A.bett.y + 112} h${A.bett.w} v96 ` +
        `q-${A.bett.w * 0.28} 26 -${A.bett.w * 0.55} 0 ` +
        `q-${A.bett.w * 0.24} -24 -${A.bett.w * 0.45} 0 z`
      }
      fill={c.duvet}
    />
    <path
      d={`M${A.bett.x + 30} ${A.bett.y + 112} q90 40 196 8`}
      fill="none"
      stroke={c.duvetDark}
      strokeWidth={9}
      strokeLinecap="round"
    />
    {/* bed legs */}
    <rect x={A.bett.x + 10} y={A.bett.y + 206} width={16} height={38} fill={c.woodDark} />
    <rect x={A.bett.x + A.bett.w - 26} y={A.bett.y + 206} width={16} height={38} fill={c.woodDark} />

    {/* the nightstand the clock stands on */}
    <rect x={836} y={506} width={112} height={142} rx={5} fill={c.wood} />
    <rect x={848} y={524} width={88} height={40} rx={4} fill={c.woodDark} opacity={0.45} />
    <rect x={848} y={576} width={88} height={40} rx={4} fill={c.woodDark} opacity={0.45} />

    {/* ------------------------------------------------------- anchor: wecker */}
    {/* The reason this room exists. Drawn large for its size and with a face
        that reads at a glance, because a ring is about to go round it. */}
    <rect x={A.wecker.x} y={A.wecker.y} width={A.wecker.w} height={A.wecker.h} rx={9} fill={c.clock} />
    <rect
      x={A.wecker.x + 8}
      y={A.wecker.y + 9}
      width={A.wecker.w - 16}
      height={A.wecker.h - 18}
      rx={5}
      fill={c.clockFace}
    />
    <text
      x={A.wecker.x + A.wecker.w / 2}
      y={A.wecker.y + A.wecker.h / 2 + 1}
      fill={c.clock}
      fontFamily={theme.font.mono}
      fontWeight={500}
      fontSize={26}
      textAnchor="middle"
      dominantBaseline="central"
    >
      7:30
    </text>
    {/* the two bells on top */}
    <circle cx={A.wecker.x + 13} cy={A.wecker.y - 5} r={11} fill={c.clock} />
    <circle cx={A.wecker.x + A.wecker.w - 13} cy={A.wecker.y - 5} r={11} fill={c.clock} />

    {/* There was a bedside lamp here. It stood exactly where the clock does
        and read as part of it, so at a glance the alarm had a lampshade on
        top. The clock is the one object in this room a callout points at, and
        it has to be unmistakable; the lamp was worth less than that. */}
  </svg>
);
