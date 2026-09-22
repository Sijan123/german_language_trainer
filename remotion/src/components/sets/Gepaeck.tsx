/*
 * An arrivals baggage hall, drawn full frame.
 *
 * c033 was scaffolded onto the railway platform, which is the nearest thing
 * that existed and still wrong: the dialogue is about a carousel that has
 * stopped, a case that is not on it and a desk to report it at. A platform
 * has none of those.
 *
 * The carousel runs across the middle of the frame at the same height the
 * other counters do, so the cases on it sit above the speech card. The
 * reporting desk is on the right, past the second figure.
 *
 * Anchors avoid x 285-555 and 1365-1635. Everything pointable is above y=648.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.gepaeck;

/** Everything on this set a callout can point at. */
export const gepaeckAnchors: Record<string, Anchor> = {
  /* the flight display on the wall */
  anzeige: { x: 620, y: 172, w: 360, h: 148 },
  /* the carousel itself */
  band: { x: 560, y: 470, w: 800, h: 110 },
  /*
   * The cases riding on it. Inside the belt's own box, the way the
   * restaurant's plates sit inside its table — c033 rings the belt on line 2
   * and a case on line 0, and they are two readings of the same object.
   */
  koffer: { x: 700, y: 384, w: 210, h: 96 },
  /* the rucksack at their feet, left band */
  rucksack: { x: 62, y: 448, w: 178, h: 186 },
  /* the desk they report it at, right band */
  schalter: { x: 1652, y: 432, w: 236, h: 206 }
};

/** Which German words should send a callout here. */
export const gepaeckKeywords: Record<string, string[]> = {
  anzeige: ["anzeige", "anzeigetafel", "flug", "tafel"],
  band: ["band", "laufband", "gepäckband"],
  koffer: ["koffer", "gepäck", "tasche", "gepäckaufkleber"],
  rucksack: ["rucksack", "zahnbürste", "tasche"],
  schalter: ["schalter", "melden", "ticket", "formular"]
};

const A = gepaeckAnchors;

export const Gepaeck: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />

    {/* strip lighting across the ceiling band, which is most of what an
        arrivals hall looks like */}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={120 + i * 460} y={54} width={300} height={16} rx={7} fill={c.anzeigeInk} opacity={0.28} />
    ))}

    {/* ---------------------------------------------------- anchor: anzeige */}
    <rect x={A.anzeige.x} y={A.anzeige.y} width={A.anzeige.w} height={A.anzeige.h} rx={10} fill={c.anzeige} />
    <text
      x={A.anzeige.x + 24}
      y={A.anzeige.y + 34}
      fill={c.anzeigeInk}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={22}
      letterSpacing={3}
      opacity={0.85}
    >
      GEPÄCKAUSGABE
    </text>
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <rect x={A.anzeige.x + 24} y={A.anzeige.y + 54 + i * 30} width={96} height={13} rx={4} fill={c.anzeigeInk} opacity={0.75} />
        <rect x={A.anzeige.x + 140} y={A.anzeige.y + 54 + i * 30} width={180 - i * 40} height={13} rx={4} fill={c.anzeigeInk} opacity={0.5} />
      </React.Fragment>
    ))}

    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />

    {/* --------------------------------------------------- anchor: schalter */}
    {/* A small reporting desk with a screen on it. */}
    <rect x={A.schalter.x} y={A.schalter.y + 76} width={A.schalter.w} height={1080 - A.schalter.y - 76} fill={c.schalter} />
    <rect x={A.schalter.x - 14} y={A.schalter.y + 56} width={A.schalter.w + 28} height={24} rx={7} fill={c.schalterTop} />
    <rect x={A.schalter.x + 46} y={A.schalter.y - 6} width={132} height={64} rx={7} fill={c.anzeige} />
    <rect x={A.schalter.x + 54} y={A.schalter.y + 2} width={116} height={48} rx={4} fill={c.anzeigeInk} opacity={0.35} />
    <rect x={A.schalter.x + 30} y={A.schalter.y + 84} width={110} height={26} rx={5} fill={c.papier} />

    {/* -------------------------------------------------- anchor: rucksack */}
    <rect x={A.rucksack.x + 22} y={A.rucksack.y + 40} width={132} height={146} rx={22} fill={c.kofferAlt2} />
    <rect x={A.rucksack.x + 44} y={A.rucksack.y + 14} width={88} height={44} rx={18} fill={c.kofferAlt2} />
    <path
      d={`M${A.rucksack.x + 46} ${A.rucksack.y + 48} a30 30 0 0 1 84 0`}
      fill="none"
      stroke={c.bandDark}
      strokeWidth={9}
    />
    <rect x={A.rucksack.x + 46} y={A.rucksack.y + 96} width={84} height={44} rx={9} fill={c.band} opacity={0.5} />

    {/* -------------------------------------------------------- anchor: band */}
    {/* The carousel: a slab with a moving-looking top and slats down the
        front. It is drawn after the floor and before the cases on it. */}
    <rect x={A.band.x - 40} y={A.band.y + 34} width={A.band.w + 80} height={1080 - A.band.y - 34} fill={c.band} />
    <rect x={A.band.x - 40} y={A.band.y} width={A.band.w + 80} height={34} rx={9} fill={c.bandTop} />
    <rect x={A.band.x - 40} y={A.band.y + 34} width={A.band.w + 80} height={12} fill={c.bandDark} opacity={0.7} />
    {Array.from({ length: 9 }, (_, i) => (
      <line
        key={i}
        x1={A.band.x - 20 + i * 100}
        y1={A.band.y + 46}
        x2={A.band.x - 20 + i * 100}
        y2={1080}
        stroke={c.bandDark}
        strokeWidth={4}
        opacity={0.5}
      />
    ))}

    {/* ----------------------------------------------------- anchor: koffer */}
    {/* Two cases left on the belt — not theirs, which is the point. */}
    <rect x={A.koffer.x} y={A.koffer.y + 24} width={104} height={72} rx={10} fill={c.kofferAlt} />
    <rect x={A.koffer.x + 32} y={A.koffer.y + 6} width={40} height={22} rx={10} fill="none" stroke={c.chrome} strokeWidth={8} />
    <rect x={A.koffer.x + 116} y={A.koffer.y + 12} width={92} height={84} rx={10} fill={c.koffer} />
    <rect x={A.koffer.x + 142} y={A.koffer.y - 8} width={40} height={22} rx={10} fill="none" stroke={c.chrome} strokeWidth={8} />
    <rect x={A.koffer.x + 116} y={A.koffer.y + 48} width={92} height={13} fill={c.bandDark} opacity={0.55} />
  </svg>
);
