/*
 * A clothes shop, at the returns counter.
 *
 * c014 is a customer exchanging a pair of trousers, which the topic mapping
 * sent to the supermarket because the topic is "einkaufen". A food shop has
 * no fitting rooms and nothing to try on, and the dialogue turns on both.
 *
 * Full frame: the customer and the assistant are at one counter. Figures at
 * x≈420 and x≈1500, so the rail, the cabins and the counter goods keep out of
 * 285-555 and 1365-1635.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Sign } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.bekleidung;

/** Everything on this set a callout can point at. */
export const bekleidungAnchors: Record<string, Anchor> = {
  /* the trousers being exchanged, lying on the counter */
  hose: { x: 640, y: 486, w: 196, h: 104 },
  /* the receipt beside them */
  kassenbon: { x: 880, y: 512, w: 118, h: 78 },
  /* the jacket rail, centre-right */
  jacken: { x: 1046, y: 220, w: 286, h: 300 },
  /* the fitting rooms, right band — "Hinten links, neben den Jacken" */
  kabine: { x: 1662, y: 208, w: 200, h: 372 },
  theke: { x: 600, y: 572, w: 700, h: 70 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const bekleidungKeywords: Record<string, string[]> = {
  hose: ["hose", "eng", "größe", "hüfte", "vierzig", "achtunddreißig", "schwarz", "passt"],
  kassenbon: ["kassenbon", "bon", "beleg", "quittung", "rechnung"],
  jacken: ["jacken", "jacke", "mantel", "pullover", "hemd", "kleidung", "stange"],
  kabine: ["kabine", "kabinen", "anprobieren", "umkleide", "probieren", "hinten"],
  theke: ["umtauschen", "tauschen", "theke", "kasse", "zurückgeben"]
};

const A = bekleidungAnchors;

/** A garment on a hanger, seen flat. */
const Buegel: React.FC<{ x: number; y: number; w: number; h: number; fill: string }> = ({
  x, y, w, h, fill
}) => (
  <>
    <path
      d={`M${x + w / 2} ${y} q-14 8 -22 18 l-${w / 2 - 22} 14`}
      fill="none"
      stroke={c.chrome}
      strokeWidth={4}
    />
    <path
      d={`M${x + w / 2} ${y} q14 8 22 18 l${w / 2 - 22} 14`}
      fill="none"
      stroke={c.chrome}
      strokeWidth={4}
    />
    <path
      d={
        `M${x + 6} ${y + 32} l${w / 2 - 6} -8 l${w / 2 - 6} 8 ` +
        `l-10 26 l-12 -8 l0 ${h - 58} l-${w - 36} 0 l0 -${h - 58} l-12 8 z`
      }
      fill={fill}
    />
  </>
);

export const Bekleidung: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={128} fill={c.wallDark} />
    <Floor x={0} palette={c} vanishAt={880} />

    <Sign x={196} y={158} w={268} h={60} text="MODE" palette={c} />
    {/* a mirror on the left wall, which is what a clothes shop has that a
        food shop does not */}
    <rect x={188} y={252} width={148} height={260} rx={9} fill={c.railDark} />
    <rect x={198} y={262} width={128} height={240} rx={5} fill={c.mirror} />

    {/* ------------------------------------------------------- anchor: jacken */}
    <rect x={A.jacken.x - 20} y={A.jacken.y} width={A.jacken.w + 40} height={13} rx={6} fill={c.rail} />
    <rect x={A.jacken.x - 12} y={A.jacken.y + 13} width={11} height={HORIZON - A.jacken.y - 13} fill={c.railDark} />
    <rect x={A.jacken.x + A.jacken.w + 1} y={A.jacken.y + 13} width={11} height={HORIZON - A.jacken.y - 13} fill={c.railDark} />
    {[0, 1, 2, 3].map((i) => (
      <Buegel
        key={i}
        x={A.jacken.x + 8 + i * 68}
        y={A.jacken.y + 8}
        w={66}
        h={250}
        fill={i % 2 === 0 ? c.jacke : c.hoseDark}
      />
    ))}

    {/* ------------------------------------------------------- anchor: kabine */}
    {/* Two cubicles with curtains, one drawn back. The gap is what says these
        are fitting rooms and not lockers. */}
    <rect x={A.kabine.x} y={A.kabine.y} width={A.kabine.w} height={A.kabine.h} rx={8} fill={c.kabine} />
    <rect x={A.kabine.x} y={A.kabine.y} width={A.kabine.w} height={22} rx={8} fill={c.kabineDark} />
    <rect x={A.kabine.x + 10} y={A.kabine.y + 28} width={84} height={A.kabine.h - 38} rx={5} fill={c.kabineDark} opacity={0.55} />
    {/* the drawn curtain on the near cubicle */}
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={A.kabine.x + 104 + i * 18}
        y={A.kabine.y + 28}
        width={15}
        height={A.kabine.h - 38}
        rx={6}
        fill={c.curtain}
      />
    ))}
    <rect x={A.kabine.x + 6} y={A.kabine.y + 24} width={A.kabine.w - 12} height={9} rx={4} fill={c.chrome} />

    {/* -------------------------------------------------------- anchor: theke */}
    <rect x={A.theke.x - 40} y={A.theke.y + A.theke.h} width={A.theke.w + 80} height={1080 - A.theke.y - A.theke.h} fill={c.counter} />
    <rect x={A.theke.x - 40} y={A.theke.y} width={A.theke.w + 80} height={A.theke.h} rx={7} fill={c.counterTop} />
    <rect x={A.theke.x - 40} y={A.theke.y + A.theke.h} width={A.theke.w + 80} height={13} fill={c.counterTop} opacity={0.55} />

    {/* --------------------------------------------------------- anchor: hose */}
    {/* Folded on the counter, waist at the top, two legs below — the shape
        that reads as trousers rather than as a towel. */}
    {/* Hung over the front of the counter rather than folded on it: waistband
        at the top, a fly, then two legs falling over the edge. Folded flat
        they were a waistband rectangle above two shorter rectangles, which
        read as a stack of boxes and not as trousers at all. */}
    <rect x={A.hose.x} y={A.hose.y} width={A.hose.w} height={30} rx={8} fill={c.hose} />
    <rect x={A.hose.x + 10} y={A.hose.y + 7} width={A.hose.w - 20} height={7} rx={3} fill={c.hoseDark} opacity={0.75} />
    {/* belt loops */}
    {[0.18, 0.5, 0.82].map((f) => (
      <rect key={f} x={A.hose.x + A.hose.w * f - 4} y={A.hose.y - 5} width={9} height={14} rx={3} fill={c.hoseDark} />
    ))}
    <path
      d={
        `M${A.hose.x + 4} ${A.hose.y + 30} ` +
        `l${A.hose.w / 2 - 12} 0 l-6 ${A.hose.h + 34} l-${A.hose.w / 2 - 34} 0 z`
      }
      fill={c.hose}
    />
    <path
      d={
        `M${A.hose.x + A.hose.w / 2 + 8} ${A.hose.y + 30} ` +
        `l${A.hose.w / 2 - 12} 0 l-2 ${A.hose.h + 34} l-${A.hose.w / 2 - 34} 0 z`
      }
      fill={c.hoseDark}
    />
    {/* the fly, which is the detail that settles it */}
    <path
      d={`M${A.hose.x + A.hose.w / 2 - 2} ${A.hose.y + 30} l0 38`}
      stroke={c.hoseDark}
      strokeWidth={4}
      fill="none"
    />

    {/* ---------------------------------------------------- anchor: kassenbon */}
    <rect x={A.kassenbon.x} y={A.kassenbon.y} width={A.kassenbon.w} height={A.kassenbon.h} rx={3} fill="#f7f5ee" />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={A.kassenbon.x + 12}
        y={A.kassenbon.y + 14 + i * 14}
        width={A.kassenbon.w - 24 - (i % 2) * 26}
        height={6}
        rx={3}
        fill="#9a948a"
        opacity={0.75}
      />
    ))}
    {/* the torn bottom edge */}
    <path
      d={
        `M${A.kassenbon.x} ${A.kassenbon.y + A.kassenbon.h} ` +
        `l14 -8 l14 8 l14 -8 l14 8 l14 -8 l14 8 l14 -8 l14 8 z`
      }
      fill="#f7f5ee"
    />
  </svg>
);
