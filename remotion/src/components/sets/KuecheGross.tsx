/*
 * The kitchen again, this time filling the frame.
 *
 * `kueche` is half a picture, drawn for the right-hand room, and that is the
 * right shape when one person is in the kitchen and the other is somewhere
 * else. It is the wrong shape for c017 and c019, where the two are cooking
 * together in one room: "Soll ich sie klein schneiden?" / "Ja, und den
 * Knoblauch auch bitte" is said across a worktop, not across a flat.
 *
 * Same palette as the half-frame kitchen on purpose, so the two read as the
 * same place seen twice rather than as two different kitchens.
 *
 * Figures at x≈420 and x≈1500, so everything a callout points at lives in the
 * middle band or out at the edges — never in 285-555 or 1365-1635.
 */

import React from "react";
import { theme } from "../../theme";
import { Cabinets, Counter, HORIZON, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.kitchen;

/** Everything on this set a callout can point at. */
export const kuecheGrossAnchors: Record<string, Anchor> = {
  /* pan on the hob, centre — the thing both dialogues are built round */
  topf: { x: 700, y: 452, w: 190, h: 130 },
  /* chopping board with the onions and garlic on it */
  brett: { x: 940, y: 500, w: 240, h: 86 },
  /* the store shelf, above and left of centre */
  vorrat: { x: 616, y: 268, w: 280, h: 76 },
  /* the laid table, right band */
  tisch: { x: 1648, y: 470, w: 232, h: 118 },
  fenster: { x: 1000, y: 166, w: 252, h: 214 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const kuecheGrossKeywords: Record<string, string[]> = {
  topf: ["topf", "kochen", "koche", "kocht", "wasser", "linsen", "reis", "suppe",
         "nudeln", "aufsetzen", "salz", "probier"],
  brett: ["zwiebeln", "knoblauch", "schneiden", "brett", "messer", "gemüse", "klein"],
  vorrat: ["reis", "salz", "gewürz", "öl", "mehl", "vorrat", "regal", "glas"],
  tisch: ["tisch", "decke", "decken", "teller", "gedeckt", "gäste", "stuhl", "vorspeise"],
  fenster: ["fenster", "draußen", "wetter", "abend", "sonne", "lüften"]
};

const A = kuecheGrossAnchors;

export const KuecheGross: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={132} fill={c.wallDark} />

    {/* splashback tiling behind the worktop */}
    <rect x={0} y={392} width={1920} height={HORIZON - 392} fill={c.tile} />
    {Array.from({ length: 25 }, (_, i) => (
      <line key={i} x1={i * 80} y1={392} x2={i * 80} y2={HORIZON} stroke={c.wallDark} strokeWidth={2} opacity={0.5} />
    ))}
    {[392, 462, 532, 602].map((y) => (
      <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={c.wallDark} strokeWidth={2} opacity={0.5} />
    ))}

    <Cabinets x={200} y={182} w={280} h={190} palette={c} />
    <Cabinets x={1420} y={182} w={280} h={190} palette={c} />

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.wood} />

    {/* ------------------------------------------------------- anchor: vorrat */}
    <rect x={A.vorrat.x} y={A.vorrat.y + A.vorrat.h - 12} width={A.vorrat.w} height={12} rx={4} fill={c.wood} />
    {[0, 1, 2, 3, 4].map((i) => (
      <React.Fragment key={i}>
        <rect
          x={A.vorrat.x + 16 + i * 52}
          y={A.vorrat.y + 18}
          width={38}
          height={46}
          rx={5}
          fill={i % 2 === 0 ? c.jar : c.pot}
        />
        <rect
          x={A.vorrat.x + 20 + i * 52}
          y={A.vorrat.y + 12}
          width={30}
          height={10}
          rx={3}
          fill={c.wood}
        />
      </React.Fragment>
    ))}

    {/* the worktop runs the full width */}
    <Counter x={0} palette={c} top={HORIZON} />
    <Counter x={960} palette={c} top={HORIZON} />

    {/* --------------------------------------------------------- anchor: topf */}
    {/* Hob rings first, then the pan on top of them, with steam — the steam is
        what says it is cooking rather than stored. */}
    <rect x={A.topf.x - 36} y={A.topf.y + 96} width={A.topf.w + 130} height={44} rx={8} fill={c.counterTop} />
    {[0, 1].map((i) => (
      <circle key={i} cx={A.topf.x + 36 + i * 148} cy={A.topf.y + 118} r={26} fill={c.pot} opacity={0.45} />
    ))}
    <rect x={A.topf.x} y={A.topf.y + 34} width={A.topf.w} height={82} rx={10} fill={c.pot} />
    <ellipse cx={A.topf.x + A.topf.w / 2} cy={A.topf.y + 34} rx={A.topf.w / 2} ry={17} fill="#94a09c" />
    <ellipse cx={A.topf.x + A.topf.w / 2} cy={A.topf.y + 30} rx={A.topf.w / 2 - 14} ry={11} fill="#6f7c78" />
    <rect x={A.topf.x - 34} y={A.topf.y + 54} width={38} height={12} rx={6} fill="#6f7c78" />
    <rect x={A.topf.x + A.topf.w - 4} y={A.topf.y + 54} width={38} height={12} rx={6} fill="#6f7c78" />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={
          `M${A.topf.x + 48 + i * 46} ${A.topf.y + 18} ` +
          `q-14 -24 0 -44 q14 -20 0 -40`
        }
        fill="none"
        stroke="#ffffff"
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.5}
      />
    ))}

    {/* -------------------------------------------------------- anchor: brett */}
    <rect x={A.brett.x} y={A.brett.y + 28} width={A.brett.w} height={26} rx={7} fill={c.wood} />
    <rect x={A.brett.x + A.brett.w - 30} y={A.brett.y + 34} width={22} height={14} rx={7} fill={c.wood} />
    {/* onion halves and garlic cloves on it */}
    {[0, 1].map((i) => (
      <React.Fragment key={i}>
        <ellipse cx={A.brett.x + 46 + i * 62} cy={A.brett.y + 16} rx={28} ry={22} fill="#e2d2b8" />
        <ellipse cx={A.brett.x + 46 + i * 62} cy={A.brett.y + 16} rx={17} ry={13} fill="#d3bf9f" />
        <ellipse cx={A.brett.x + 46 + i * 62} cy={A.brett.y + 16} rx={7} ry={5} fill="#c2ab86" />
      </React.Fragment>
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={A.brett.x + 168 + i * 24} cy={A.brett.y + 20} rx={11} ry={15} fill="#efe8d8" />
    ))}
    {/* the knife */}
    <rect x={A.brett.x + 34} y={A.brett.y - 16} width={124} height={10} rx={4} fill="#c8ced1" transform={`rotate(-7, ${A.brett.x + 96}, ${A.brett.y - 11})`} />
    <rect x={A.brett.x + 150} y={A.brett.y - 20} width={46} height={13} rx={5} fill="#5d4a3a" transform={`rotate(-7, ${A.brett.x + 173}, ${A.brett.y - 14})`} />

    {/* -------------------------------------------------------- anchor: tisch */}
    {/* Laid for two — "Ich decke schon mal den Tisch". In c019 it is the table
        that is too small for four, so it is drawn small on purpose. */}
    <rect x={A.tisch.x} y={A.tisch.y} width={A.tisch.w} height={20} rx={7} fill={c.wood} />
    <rect x={A.tisch.x + 18} y={A.tisch.y + 20} width={14} height={A.tisch.h - 20} fill={c.wood} opacity={0.7} />
    <rect x={A.tisch.x + A.tisch.w - 32} y={A.tisch.y + 20} width={14} height={A.tisch.h - 20} fill={c.wood} opacity={0.7} />
    {[0, 1].map((i) => (
      <React.Fragment key={i}>
        <ellipse cx={A.tisch.x + 62 + i * 108} cy={A.tisch.y - 6} rx={40} ry={14} fill="#ffffff" />
        <ellipse cx={A.tisch.x + 62 + i * 108} cy={A.tisch.y - 9} rx={26} ry={9} fill="#eceadf" />
      </React.Fragment>
    ))}
    <rect x={A.tisch.x + 106} y={A.tisch.y - 44} width={20} height={34} rx={4} fill="#cfe0e8" />
  </svg>
);
