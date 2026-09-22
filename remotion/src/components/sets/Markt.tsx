/*
 * A market stall, outdoors.
 *
 * c015 is a couple shopping together on a Saturday — "Die Erdbeeren sehen
 * richtig gut aus", "Hast du genug Bargeld dabei?" — so it is one place, not
 * two, and it is emphatically not the supermarket the topic mapping proposed.
 * The whole point of the dialogue is that you pay cash at a market.
 *
 * Full frame. Figures at x≈420 and x≈1500, so anchors avoid 285-555 and
 * 1365-1635 — which here means the produce lives in the middle, under the
 * awning, and the cheese stall sits out on the right.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.markt;

/** Everything on this set a callout can point at. */
export const marktAnchors: Record<string, Anchor> = {
  erdbeeren: { x: 610, y: 430, w: 240, h: 150 },
  kartoffeln: { x: 890, y: 430, w: 240, h: 150 },
  kaesestand: { x: 1658, y: 356, w: 210, h: 224 },
  /* the price board hanging off the awning */
  preis: { x: 1160, y: 232, w: 176, h: 118 },
  /* the trestle the crates stand on */
  stand: { x: 580, y: 574, w: 580, h: 66 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const marktKeywords: Record<string, string[]> = {
  erdbeeren: ["erdbeeren", "erdbeere", "obst", "schale", "beeren", "früchte"],
  kartoffeln: ["kartoffeln", "kartoffel", "kilo", "gemüse", "suppe", "zwiebeln"],
  kaesestand: ["käsestand", "käse", "stand", "wenig", "theke"],
  preis: ["kostet", "preis", "euro", "teuer", "günstig", "bargeld", "karte", "zahlen"],
  stand: ["markt", "stand", "tisch", "samstag"]
};

const A = marktAnchors;

/** A shallow wooden crate, seen slightly from above. */
const Kiste: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <>
    <path d={`M${x} ${y + 26} l18 -26 h${w - 36} l18 26 z`} fill={c.crateDark} />
    <rect x={x} y={y + 26} width={w} height={h - 26} rx={5} fill={c.crate} />
    <rect x={x + 8} y={y + 34} width={w - 16} height={8} fill={c.crateDark} opacity={0.35} />
  </>
);

export const Markt: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* sky and a row of roofs, so it is a square and not a warehouse */}
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={140} fill={c.wallDark} />
    {[-40, 250, 540, 1180, 1480, 1780].map((x, i) => (
      <React.Fragment key={x}>
        <rect x={x} y={250 - (i % 3) * 22} width={280} height={HORIZON - 250} fill={c.wallDark} opacity={0.5} />
        <polygon
          points={`${x - 16},${250 - (i % 3) * 22} ${x + 140},${208 - (i % 3) * 22} ${x + 296},${250 - (i % 3) * 22}`}
          fill={c.wallDark}
          opacity={0.7}
        />
      </React.Fragment>
    ))}

    {/* the ground */}
    <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} fill={c.floor} />
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={i * 274} y1={1080} x2={900 + (i * 274 - 900) * 0.14} y2={HORIZON} stroke={c.floorLine} strokeWidth={3} />
    ))}
    {[716, 810, 910, 1016].map((y) => (
      <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={c.floorLine} strokeWidth={3} />
    ))}

    {/* the awning over the main stall, and its poles */}
    <rect x={540} y={150} width={660} height={20} rx={7} fill={c.pole} />
    {Array.from({ length: 11 }, (_, i) => (
      <path
        key={i}
        d={`M${548 + i * 60} 170 h60 v42 q-30 20 -60 0 z`}
        fill={i % 2 === 0 ? c.awning : c.awningAlt}
      />
    ))}
    <rect x={552} y={170} width={13} height={HORIZON - 170} fill={c.pole} />
    <rect x={1174} y={170} width={13} height={HORIZON - 170} fill={c.pole} />

    {/* -------------------------------------------------------- anchor: preis */}
    {/* A chalk board. The strawberry price is the second line of the dialogue,
        so it is written where a ring can land on it. */}
    <rect x={A.preis.x} y={A.preis.y} width={A.preis.w} height={A.preis.h} rx={7} fill={c.sign} />
    <rect x={A.preis.x + 8} y={A.preis.y + 8} width={A.preis.w - 16} height={A.preis.h - 16} rx={4} fill="none" stroke={c.signInk} strokeWidth={3} opacity={0.5} />
    <text
      x={A.preis.x + A.preis.w / 2}
      y={A.preis.y + 44}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={26}
      textAnchor="middle"
      dominantBaseline="central"
    >
      ERDBEEREN
    </text>
    <text
      x={A.preis.x + A.preis.w / 2}
      y={A.preis.y + 84}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={32}
      textAnchor="middle"
      dominantBaseline="central"
    >
      3,50 €
    </text>

    {/* -------------------------------------------------------- anchor: stand */}
    <rect x={A.stand.x - 30} y={A.stand.y} width={A.stand.w + 60} height={A.stand.h} rx={6} fill={c.cloth} />
    <rect x={A.stand.x - 30} y={A.stand.y + A.stand.h} width={A.stand.w + 60} height={1080 - A.stand.y - A.stand.h} fill={c.cloth} opacity={0.75} />
    <rect x={A.stand.x - 30} y={A.stand.y} width={A.stand.w + 60} height={12} fill={c.crateDark} opacity={0.3} />

    {/* ---------------------------------------------------- anchor: erdbeeren */}
    <Kiste x={A.erdbeeren.x} y={A.erdbeeren.y + 64} w={A.erdbeeren.w} h={A.erdbeeren.h - 64} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const cx = A.erdbeeren.x + 34 + (i % 4) * 58;
      const cy = A.erdbeeren.y + 86 + Math.floor(i / 4) * 40;
      return (
        <React.Fragment key={i}>
          <path d={`M${cx - 18} ${cy - 10} q18 -16 36 0 q-4 34 -18 40 q-14 -6 -18 -40 z`} fill={c.erdbeere} />
          <path d={`M${cx - 13} ${cy - 12} q13 -9 26 0 q-13 7 -26 0 z`} fill={c.erdbeereLeaf} />
        </React.Fragment>
      );
    })}

    {/* --------------------------------------------------- anchor: kartoffeln */}
    <Kiste x={A.kartoffeln.x} y={A.kartoffeln.y + 64} w={A.kartoffeln.w} h={A.kartoffeln.h - 64} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <ellipse
        key={i}
        cx={A.kartoffeln.x + 36 + (i % 4) * 56 + (i % 2) * 8}
        cy={A.kartoffeln.y + 92 + Math.floor(i / 4) * 34}
        rx={26}
        ry={19}
        fill={i % 3 === 0 ? c.kartoffelDark : c.kartoffel}
        transform={`rotate(${(i * 23) % 40 - 20}, ${A.kartoffeln.x + 36 + (i % 4) * 56}, ${A.kartoffeln.y + 92 + Math.floor(i / 4) * 34})`}
      />
    ))}

    {/* -------------------------------------------------- anchor: kaesestand */}
    {/* Deliberately sparse: "Der Käsestand hat heute sehr wenig." Three wheels
        on a mostly empty counter, because the set has to agree with the line. */}
    <rect x={A.kaesestand.x - 14} y={A.kaesestand.y + 150} width={A.kaesestand.w + 28} height={20} rx={7} fill={c.cloth} />
    <rect x={A.kaesestand.x - 14} y={A.kaesestand.y + 170} width={A.kaesestand.w + 28} height={HORIZON - A.kaesestand.y - 170} fill={c.cloth} opacity={0.75} />
    <rect x={A.kaesestand.x - 20} y={A.kaesestand.y} width={A.kaesestand.w + 40} height={16} rx={6} fill={c.pole} />
    <rect x={A.kaesestand.x - 8} y={A.kaesestand.y + 16} width={11} height={140} fill={c.pole} />
    <rect x={A.kaesestand.x + A.kaesestand.w - 3} y={A.kaesestand.y + 16} width={11} height={140} fill={c.pole} />
    {[0, 1].map((i) => (
      <React.Fragment key={i}>
        <ellipse cx={A.kaesestand.x + 52 + i * 96} cy={A.kaesestand.y + 132} rx={40} ry={16} fill={c.kaeseDark} />
        <rect x={A.kaesestand.x + 12 + i * 96} y={A.kaesestand.y + 108} width={80} height={26} fill={c.kaese} />
        <ellipse cx={A.kaesestand.x + 52 + i * 96} cy={A.kaesestand.y + 108} rx={40} ry={16} fill={c.kaese} />
      </React.Fragment>
    ))}
    <path
      d={`M${A.kaesestand.x + 118} ${A.kaesestand.y + 148} l54 0 l-27 -34 z`}
      fill={c.kaese}
    />
  </svg>
);
