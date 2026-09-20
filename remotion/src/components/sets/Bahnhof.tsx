/*
 * A station platform.
 *
 * c008 is two people travelling together — "Unser Zug hat zwanzig Minuten
 * Verspätung" — so it fills the frame, like the restaurant and the bus stop.
 *
 * The departure board is the point of this set. Every other room here is
 * built round a physical object; this one is built round a number that
 * changes, because the dialogue is about a delay and a platform change and
 * nothing else in a station says either of those things.
 *
 * Anchors avoid x 285-555 and 1365-1635, where the two figures stand.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.bahnhof;

/** Everything on this set a callout can point at. */
export const bahnhofAnchors: Record<string, Anchor> = {
  /* stairs and lift, left band */
  treppe: { x: 58, y: 372, w: 224, h: 228 },
  /* the train standing at the platform, centre band */
  zug: { x: 596, y: 326, w: 470, h: 266 },
  /* the departure board hanging over the platform */
  anzeigetafel: { x: 1100, y: 196, w: 252, h: 152 },
  /* the platform-number plate, right band */
  gleis: { x: 1664, y: 200, w: 152, h: 116 },
  /* bench with a rucksack on it, right band under the plate */
  rucksack: { x: 1648, y: 424, w: 206, h: 176 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const bahnhofKeywords: Record<string, string[]> = {
  zug: ["zug", "bahn", "anschluss", "verbindung", "einfahrt", "abfahrt", "wagen"],
  anzeigetafel: ["verspätung", "anzeige", "tafel", "minuten", "später", "app", "uhr"],
  gleis: ["gleis", "bahnsteig", "fünf", "drei", "seite"],
  treppe: ["treppe", "aufzug", "stufen", "hoch", "runter", "unterführung"],
  rucksack: ["rucksack", "tasche", "bank", "äpfel", "apfel", "nüsse", "essen", "brot"]
};

const A = bahnhofAnchors;

export const Bahnhof: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* the hall: a pale wall, a steel roof band, and the platform floor */}
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={168} fill={c.wallDark} />

    {/* roof trusses, which is most of what says "station" rather than "street" */}
    {Array.from({ length: 6 }, (_, i) => (
      <React.Fragment key={i}>
        <rect x={112 + i * 330} y={0} width={14} height={168} fill={c.stahl} opacity={0.7} />
        <polygon
          points={`${112 + i * 330 - 54},168 ${112 + i * 330 + 7},124 ${112 + i * 330 + 68},168`}
          fill={c.stahlDark}
          opacity={0.45}
        />
      </React.Fragment>
    ))}
    <rect x={0} y={160} width={1920} height={10} fill={c.stahlDark} opacity={0.6} />

    {/* ------------------------------------------------------- anchor: treppe */}
    {/* Stairs beside a lift shaft — the last line is "wir nehmen die Treppe,
        der Aufzug dauert zu lange", so both have to be in shot together. */}
    {/* A stepped silhouette, not a stack of bars. Drawn as one polygon rising
        to the left, because six separate rectangles on a panel read as a
        notice board — which is exactly what the first cut of this looked
        like. The handrail is what settles it. */}
    <polygon
      points={
        Array.from({ length: 6 }, (_, i) => {
          const sx = A.treppe.x + 6 + i * 21;
          const sy = A.treppe.y + A.treppe.h - i * 34;
          return `${sx},${sy} ${sx},${sy - 34} ${sx + 21},${sy - 34}`;
        }).join(" ") +
        ` ${A.treppe.x + 132},${A.treppe.y + A.treppe.h} `
      }
      fill={c.stahl}
    />
    {Array.from({ length: 6 }, (_, i) => (
      <rect
        key={i}
        x={A.treppe.x + 6 + i * 21}
        y={A.treppe.y + A.treppe.h - 34 - i * 34}
        width={21}
        height={5}
        fill={c.stahlDark}
        opacity={0.8}
      />
    ))}
    {/* handrail, parallel to the nosings */}
    <line
      x1={A.treppe.x + 10}
      y1={A.treppe.y + A.treppe.h - 60}
      x2={A.treppe.x + 132}
      y2={A.treppe.y + A.treppe.h - 60 - 5 * 34}
      stroke={c.stahlDark}
      strokeWidth={7}
      strokeLinecap="round"
    />
    {/* the lift: a glass box with a rail, tall enough to read as one */}
    <rect x={A.treppe.x + 146} y={A.treppe.y + 14} width={70} height={A.treppe.h - 14} rx={5} fill={c.zugGlass} opacity={0.85} />
    <rect x={A.treppe.x + 146} y={A.treppe.y + 14} width={70} height={A.treppe.h - 14} rx={5} fill="none" stroke={c.stahlDark} strokeWidth={5} />
    <line
      x1={A.treppe.x + 181}
      y1={A.treppe.y + 14}
      x2={A.treppe.x + 181}
      y2={A.treppe.y + A.treppe.h}
      stroke={c.stahlDark}
      strokeWidth={3}
      opacity={0.5}
    />
    <rect x={A.treppe.x} y={A.treppe.y - 16} width={A.treppe.w} height={16} fill={c.stahlDark} opacity={0.5} />

    {/* A platform clock on a bracket. Not an anchor — nothing in c008 points
        at it — but a station without one is a shed, and the wall above the
        train was the one large empty area left. */}
    <rect x={650} y={218} width={12} height={54} fill={c.pfosten} />
    <circle cx={700} cy={244} r={42} fill={c.wall} stroke={c.pfosten} strokeWidth={7} />
    <circle cx={700} cy={244} r={4} fill={c.tafel} />
    <line x1={700} y1={244} x2={700} y2={216} stroke={c.tafel} strokeWidth={5} strokeLinecap="round" />
    <line x1={700} y1={244} x2={722} y2={254} stroke={c.tafel} strokeWidth={4} strokeLinecap="round" />

    {/* ---------------------------------------------------------- anchor: zug */}
    {/* Side-on, doors open, standing at the platform. A train nose-on is a
        rectangle at this size and reads as a wall. */}
    <rect x={A.zug.x} y={A.zug.y + 14} width={A.zug.w} height={A.zug.h - 14} rx={30} fill={c.zug} />
    <rect x={A.zug.x + 10} y={A.zug.y} width={A.zug.w - 20} height={46} rx={20} fill={c.zugRoof} />
    <rect x={A.zug.x} y={A.zug.y + 58} width={A.zug.w} height={40} fill={c.zugDark} opacity={0.4} />
    {/* windows, with a door-shaped gap between the pairs */}
    {[0, 1].map((g) =>
      [0, 1, 2].map((i) => (
        <rect
          key={`${g}-${i}`}
          x={A.zug.x + 30 + g * 250 + i * 66}
          y={A.zug.y + 108}
          width={54}
          height={76}
          rx={7}
          fill={c.zugGlass}
        />
      ))
    )}
    <rect x={A.zug.x + 228} y={A.zug.y + 104} width={74} height={150} rx={8} fill={c.zugDark} />
    <line
      x1={A.zug.x + 265}
      y1={A.zug.y + 104}
      x2={A.zug.x + 265}
      y2={A.zug.y + 254}
      stroke={c.zugGlass}
      strokeWidth={3}
      opacity={0.65}
    />
    {/* a yellow stripe, because German regional stock has one and it dates the
        drawing to somewhere rather than nowhere */}
    <rect x={A.zug.x} y={A.zug.y + 206} width={A.zug.w} height={12} fill={c.tafelInk} opacity={0.8} />
    {[80, 200, 330, 420].map((d) => (
      <circle key={d} cx={A.zug.x + d} cy={A.zug.y + A.zug.h - 4} r={22} fill="#3a3937" />
    ))}

    {/* ------------------------------------------------ anchor: anzeigetafel */}
    {/* The delay itself. Amber on near-black, which is what every one of these
        boards in Germany looks like and reads at 720p. */}
    <rect x={A.anzeigetafel.x + A.anzeigetafel.w / 2 - 6} y={0} width={12} height={A.anzeigetafel.y} fill={c.pfosten} />
    <rect
      x={A.anzeigetafel.x}
      y={A.anzeigetafel.y}
      width={A.anzeigetafel.w}
      height={A.anzeigetafel.h}
      rx={9}
      fill={c.tafel}
    />
    <text
      x={A.anzeigetafel.x + 18}
      y={A.anzeigetafel.y + 34}
      fill={c.tafelInk}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={26}
      dominantBaseline="central"
    >
      18:05  ULM
    </text>
    <text
      x={A.anzeigetafel.x + 18}
      y={A.anzeigetafel.y + 76}
      fill={c.tafelInk}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={26}
      dominantBaseline="central"
    >
      +20 MIN
    </text>
    <text
      x={A.anzeigetafel.x + 18}
      y={A.anzeigetafel.y + 118}
      fill={c.tafelInk}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={26}
      opacity={0.75}
      dominantBaseline="central"
    >
      GLEIS 5
    </text>

    {/* -------------------------------------------------------- anchor: gleis */}
    {/* The platform-number plate: white on DB blue. */}
    <rect x={A.gleis.x + A.gleis.w / 2 - 6} y={A.gleis.y} width={12} height={HORIZON - A.gleis.y} fill={c.pfosten} />
    <rect x={A.gleis.x} y={A.gleis.y} width={A.gleis.w} height={A.gleis.h} rx={8} fill={c.sign} />
    <text
      x={A.gleis.x + A.gleis.w / 2}
      y={A.gleis.y + 34}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={22}
      letterSpacing={2}
      textAnchor="middle"
      dominantBaseline="central"
    >
      GLEIS
    </text>
    <text
      x={A.gleis.x + A.gleis.w / 2}
      y={A.gleis.y + 80}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={52}
      textAnchor="middle"
      dominantBaseline="central"
    >
      5
    </text>

    {/* platform floor, with the tactile edge strip along the front */}
    <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} fill={c.floor} />
    <rect x={0} y={HORIZON} width={1920} height={20} fill={c.kante} />
    <rect x={0} y={HORIZON + 20} width={1920} height={12} fill={c.kanteWarn} opacity={0.85} />
    {Array.from({ length: 8 }, (_, i) => (
      <line
        key={i}
        x1={i * 274}
        y1={1080}
        x2={880 + (i * 274 - 880) * 0.14}
        y2={HORIZON + 32}
        stroke={c.floorLine}
        strokeWidth={3}
      />
    ))}
    {[728, 820, 916, 1020].map((y) => (
      <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={c.floorLine} strokeWidth={3} />
    ))}

    {/* ----------------------------------------------------- anchor: rucksack */}
    {/* A bench with the rucksack on it. The bag is the anchor and the bench is
        what stops it floating — "Hast du noch etwas zu essen im Rucksack?" */}
    <rect x={A.rucksack.x} y={A.rucksack.y + 96} width={A.rucksack.w} height={18} rx={6} fill={c.bank} />
    <rect x={A.rucksack.x + 8} y={A.rucksack.y + 118} width={A.rucksack.w - 16} height={14} rx={5} fill={c.bankDark} />
    <rect x={A.rucksack.x + 18} y={A.rucksack.y + 132} width={14} height={A.rucksack.h - 132} fill={c.bankDark} />
    <rect x={A.rucksack.x + A.rucksack.w - 32} y={A.rucksack.y + 132} width={14} height={A.rucksack.h - 132} fill={c.bankDark} />
    {/* the rucksack itself, sitting on the bench */}
    <rect x={A.rucksack.x + 52} y={A.rucksack.y + 8} width={98} height={92} rx={18} fill={c.rucksack} />
    <rect x={A.rucksack.x + 68} y={A.rucksack.y + 36} width={66} height={40} rx={10} fill={c.rucksackDark} />
    <path
      d={`M${A.rucksack.x + 74} ${A.rucksack.y + 10} q26 -26 52 0`}
      fill="none"
      stroke={c.rucksackDark}
      strokeWidth={9}
      strokeLinecap="round"
    />
  </svg>
);
