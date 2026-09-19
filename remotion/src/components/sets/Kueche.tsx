/*
 * The kitchen at home.
 *
 * Its viewBox starts at x=960, so it is authored in full-frame coordinates and
 * drops into the right-hand room with nothing to convert.
 *
 * Warmer than the shop on purpose. The two rooms are on screen together for
 * the whole film and the only thing telling you they are different places is
 * how they are lit, so the shop is cool and fluorescent and this is not.
 *
 * The worktop sits on the shared horizon at y=648. Everything below that is
 * covered by the speech bubble, so every object a callout can point at — the
 * jars, the baking — has to live above it. The first version put the worktop
 * at 748 and the cake spent the whole film behind the subtitle naming it.
 */

import React from "react";
import { theme } from "../../theme";
import { Cabinets, Counter, HORIZON, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.kitchen;
const P = theme.set.products;

/** Everything on this set a callout can point at. */
export const kuecheAnchors: Record<string, Anchor> = {
  vorrat: { x: 1016, y: 396, w: 270, h: 70 },
  kuchen: { x: 1120, y: 528, w: 196, h: 120 },
  fruehstueck: { x: 1392, y: 556, w: 214, h: 92 },
  fenster: { x: 1332, y: 196, w: 252, h: 214 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const kuecheKeywords: Record<string, string[]> = {
  vorrat: ["marmelade", "glas", "zucker", "mehl", "salz", "kaffee", "tee", "vorrat", "regal", "honig", "öl"],
  kuchen: ["kuchen", "backen", "backe", "teig", "schüssel", "topf", "kochen", "koche", "essen", "form"],
  fruehstueck: ["brot", "brötchen", "frühstück", "kaffee", "tee", "tasse", "butter",
                "marmelade", "müsli", "teller", "messer"],
  fenster: ["fenster", "wetter", "regnet", "regen", "sonne", "draußen", "kalt", "warm", "schnee"]
};

const A = kuecheAnchors;

/** A jar on the store shelf. The marmalade is one of these. */
const Jar: React.FC<{ x: number; y: number; w: number; h: number; fill: string }> = ({
  x, y, w, h, fill
}) => (
  <>
    <rect x={x} y={y + 7} width={w} height={h - 7} rx={3} fill={fill} />
    <rect x={x + 2} y={y} width={w - 4} height={9} rx={2} fill="#8d7f6b" />
  </>
);

export const Kueche: React.FC = () => (
  <svg
    viewBox="960 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={960} palette={c} ceiling={120} />

    {/* the tiled strip behind the worktop */}
    <rect x={960} y={472} width={960} height={176} fill={c.tile} />
    {Array.from({ length: 17 }, (_, i) => (
      <line
        key={i}
        x1={960 + i * 58}
        y1={472}
        x2={960 + i * 58}
        y2={HORIZON}
        stroke={c.wallDark}
        strokeWidth={2}
        opacity={0.55}
      />
    ))}
    <line x1={960} y1={560} x2={1920} y2={560} stroke={c.wallDark} strokeWidth={2} opacity={0.55} />

    <Cabinets x={990} y={206} w={310} h={172} palette={c} />

    {/* ------------------------------------------------------- anchor: vorrat */}
    <rect x={A.vorrat.x - 4} y={A.vorrat.y + 66} width={278} height={9} rx={3} fill={c.wood} />
    <Jar x={A.vorrat.x + 10} y={A.vorrat.y + 4} w={40} h={62} fill={c.jar} />
    <Jar x={A.vorrat.x + 60} y={A.vorrat.y + 12} w={36} h={54} fill="#a8623f" />
    <Jar x={A.vorrat.x + 106} y={A.vorrat.y + 8} w={38} h={58} fill="#cf9a4e" />
    <Jar x={A.vorrat.x + 154} y={A.vorrat.y + 18} w={34} h={48} fill="#8f6f4a" />
    <Jar x={A.vorrat.x + 198} y={A.vorrat.y + 6} w={40} h={60} fill="#b8523f" />

    {/* ------------------------------------------------------ anchor: fenster */}
    {/* the daylight that makes this room not the shop */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} />

    <Counter x={960} palette={c} />

    {/* ------------------------------------------------------- anchor: kuchen */}
    {/* A bowl, a whisk and a tin: she says she is baking at the weekend, so it
        is set out, not finished. */}
    <ellipse cx={1176} cy={HORIZON - 4} rx={52} ry={12} fill={c.wood} opacity={0.22} />
    <path d={`M1126 ${HORIZON - 68} h100 l-13 60 a37 16 0 0 1 -74 0 z`} fill={c.pot} />
    <ellipse cx={1176} cy={HORIZON - 68} rx={50} ry={13} fill="#96a29e" />
    <ellipse cx={1176} cy={HORIZON - 68} rx={40} ry={9} fill="#e8e2d2" />
    <line
      x1={1206} y1={HORIZON - 116} x2={1194} y2={HORIZON - 72}
      stroke={c.wood} strokeWidth={7} strokeLinecap="round"
    />
    <rect x={1250} y={HORIZON - 44} width={58} height={44} rx={5} fill="#b0b6b2" />
    <rect x={1258} y={HORIZON - 36} width={42} height={30} rx={3} fill="#d8b47e" />

    {/* -------------------------------------------------- anchor: fruehstueck */}
    {/* A board with bread on it and a mug beside it. An empty worktop looks
        like a showroom, and the morning dialogues need somewhere to point
        when somebody offers to make you a sandwich. */}
    <rect x={A.fruehstueck.x} y={HORIZON - 26} width={132} height={14} rx={4} fill={c.wood} />
    {[0, 1, 2].map((i) => (
      <ellipse
        key={i}
        cx={A.fruehstueck.x + 30 + i * 36}
        cy={HORIZON - 38}
        rx={20}
        ry={13}
        fill="#d8a45e"
      />
    ))}
    <rect x={A.fruehstueck.x + 6} y={HORIZON - 62} width={44} height={24} rx={4} fill="#efe7d6" />
    <rect x={A.fruehstueck.x + 150} y={HORIZON - 54} width={38} height={44} rx={5} fill="#e4ded0" />
    <path
      d={`M${A.fruehstueck.x + 188} ${HORIZON - 44} a13 13 0 0 1 0 22`}
      fill="none"
      stroke="#e4ded0"
      strokeWidth={7}
    />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={A.fruehstueck.x + 20 + i * 15} cy={HORIZON - 72} r={9} fill={P[(i * 3 + 1) % P.length]} />
    ))}
  </svg>
);
