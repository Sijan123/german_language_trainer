/*
 * A restaurant, and the first set that fills the whole frame on its own.
 *
 * Every other room is half the picture, because the usual shape here is two
 * people in two places on a phone. c003 is not that — "Wir sind zu zweit",
 * "Sollen wir noch einen Nachtisch nehmen?" — they are sitting at one table,
 * so there is one room, 1920 wide, and no seam down the middle.
 *
 * The table between them is doing two jobs. It is what the dialogue is about
 * (the menu, the food, the drinks, the bill), and it is what makes two
 * standing figures read as two people seated: their bodies disappear behind
 * it and behind the speech bubble, which is the cheapest possible way to sit
 * somebody down.
 *
 * Everything a callout can point at lives above y=660, because the bubble
 * covers the frame below that. That is why the table is set high and seen
 * almost side-on rather than from above.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Plant, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.restaurant;

/** Everything on this set a callout can point at. */
export const restaurantAnchors: Record<string, Anchor> = {
  fenster: { x: 672, y: 132, w: 576, h: 306 },
  speisekarte: { x: 648, y: 512, w: 116, h: 92 },
  essen: { x: 812, y: 540, w: 232, h: 66 },
  getraenk: { x: 1092, y: 508, w: 152, h: 98 },
  tisch: { x: 636, y: 588, w: 648, h: 88 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const restaurantKeywords: Record<string, string[]> = {
  speisekarte: ["speisekarte", "karte", "menü", "rechnung", "kellner", "bedienung", "trinkgeld"],
  essen: ["essen", "suppe", "gemüsesuppe", "salat", "nudeln", "tomatensoße", "nachtisch",
          "eis", "teller", "vorspeise", "hauptgericht", "pizza", "fleisch", "fisch"],
  getraenk: ["bier", "wasser", "wein", "saft", "glas", "getränk", "cola", "kaffee", "tee"],
  fenster: ["fenster", "aussicht", "draußen", "terrasse", "abend"],
  tisch: ["tisch", "platz", "reserviert", "reservierung", "stuhl", "zweit"]
};

const A = restaurantAnchors;

/** A pendant lamp on a flex, the thing that says "restaurant" fastest. */
const Pendant: React.FC<{ x: number; drop: number }> = ({ x, drop }) => (
  <>
    <line x1={x} y1={0} x2={x} y2={drop} stroke={c.metal} strokeWidth={4} />
    <path d={`M${x - 46} ${drop + 40} q46 -52 92 0 z`} fill={c.lamp} />
    <ellipse cx={x} cy={drop + 40} rx={46} ry={9} fill={c.lampGlow} />
  </>
);

export const Restaurant: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* The kit's Wall and Floor draw one 960-wide room, so the full-width set
        lays two of them side by side rather than growing the helpers. */}
    <Wall x={0} palette={c} ceiling={126} />
    <Wall x={960} palette={c} ceiling={126} />
    <Floor x={0} palette={c} vanishAt={960} />
    <Floor x={960} palette={c} vanishAt={960} />
    <rect x={0} y={HORIZON - 16} width={1920} height={16} fill={c.rail} />

    {/* Wainscot along the back wall. Lower and paler than the first attempt,
        which ran a heavy brown band across the whole frame at eye level and
        read as a fence rather than as panelling. */}
    <rect x={0} y={486} width={1920} height={146} fill={c.panel} />
    {Array.from({ length: 20 }, (_, i) => (
      <rect key={i} x={26 + i * 96} y={502} width={62} height={112} rx={4} fill={c.panelDark} opacity={0.35} />
    ))}
    <rect x={0} y={478} width={1920} height={11} fill={c.rail} />

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.frame} />

    <Pendant x={430} drop={150} />
    <Pendant x={960} drop={110} />
    <Pendant x={1490} drop={150} />

    {/* the bar, off to the right and well behind the diners */}
    <rect x={1636} y={432} width={284} height={44} rx={5} fill={c.bar} />
    <rect x={1636} y={476} width={284} height={172} fill={c.barDark} />
    <rect x={1636} y={424} width={284} height={10} rx={4} fill={c.rail} />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={1660 + i * 52} y={352} width={30} height={72} rx={3} fill={c.bottle} opacity={0.5 + i * 0.08} />
    ))}
    <Plant x={120} y={HORIZON - 10} s={0.9} />

    {/* -------------------------------------------------------- anchor: tisch */}
    {/*
     * An ellipse, not a rectangle. The first version was a flat band the full
     * width between them and read as a bar counter they were standing behind;
     * an oval top with the cloth falling away underneath is what says "table"
     * and, with the bubble covering the legs, what seats the two of them.
     *
     * Set high on purpose: everything below y=660 is under the speech bubble,
     * so a table in true perspective would put the food where nobody sees it.
     */}
    <path
      d={`M${A.tisch.x + 40} ${A.tisch.y + 44} h${A.tisch.w - 80} l-46 190 h-${A.tisch.w - 172} z`}
      fill={c.clothShade}
    />
    <ellipse cx={960} cy={A.tisch.y + 44} rx={A.tisch.w / 2} ry={44} fill={c.cloth} />
    <ellipse cx={960} cy={A.tisch.y + 36} rx={A.tisch.w / 2 - 10} ry={36} fill="#ffffff" opacity={0.55} />

    {/* --------------------------------------------------- anchor: speisekarte */}
    {/* Standing open on the table — she is still choosing when line 4 arrives. */}
    <g transform={`rotate(-6, ${A.speisekarte.x + 58}, ${A.speisekarte.y + 46})`}>
      <rect
        x={A.speisekarte.x}
        y={A.speisekarte.y}
        width={A.speisekarte.w}
        height={A.speisekarte.h}
        rx={5}
        fill={c.menu}
      />
      <rect
        x={A.speisekarte.x + 10}
        y={A.speisekarte.y + 12}
        width={A.speisekarte.w - 20}
        height={6}
        rx={3}
        fill={c.menuInk}
        opacity={0.55}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={A.speisekarte.x + 10}
          y={A.speisekarte.y + 30 + i * 14}
          width={A.speisekarte.w - (i % 2 ? 34 : 20)}
          height={5}
          rx={2.5}
          fill={c.menuInk}
          opacity={0.3}
        />
      ))}
    </g>

    {/* -------------------------------------------------------- anchor: essen */}
    {/* Two plates: soup and a salad on one side, pasta on the other. */}
    <ellipse cx={A.essen.x + 58} cy={A.essen.y + 42} rx={58} ry={19} fill={c.plate} />
    <ellipse cx={A.essen.x + 58} cy={A.essen.y + 38} rx={40} ry={12} fill={c.soup} />
    <ellipse cx={A.essen.x + 176} cy={A.essen.y + 44} rx={56} ry={18} fill={c.plate} />
    <ellipse cx={A.essen.x + 176} cy={A.essen.y + 40} rx={38} ry={11} fill={c.pasta} />
    <ellipse cx={A.essen.x + 168} cy={A.essen.y + 36} rx={15} ry={7} fill={c.sauce} />

    {/* ----------------------------------------------------- anchor: getraenk */}
    {/* A beer glass and a water glass, which is exactly the choice in line 8. */}
    <path
      d={`M${A.getraenk.x + 14} ${A.getraenk.y + 12} h56 l-7 76 h-42 z`}
      fill={c.beer}
      opacity={0.9}
    />
    <rect x={A.getraenk.x + 14} y={A.getraenk.y + 12} width={56} height={16} rx={4} fill="#f3e6c4" />
    <path
      d={`M${A.getraenk.x + 92} ${A.getraenk.y + 26} h46 l-6 62 h-34 z`}
      fill={c.water}
      opacity={0.75}
    />

    {/* a small vase, so the table is laid rather than just loaded */}
    <path d={`M${1252} ${A.tisch.y - 34} h26 l-4 34 h-18 z`} fill={c.vase} />
    <circle cx={1258} cy={A.tisch.y - 48} r={11} fill="#c9738a" />
    <circle cx={1274} cy={A.tisch.y - 54} r={10} fill="#d98aa0" />
  </svg>
);
