/*
 * The shop. One aisle seen head-on, drawn flat.
 *
 * Everything is one 960x1080 SVG in full-frame coordinates, which is why the
 * viewBox starts at 0 and the room is placed by its wrapper rather than by
 * translating the art. A callout in src/scenes/c002.ts points at boxes in the
 * same coordinates, so the orange ring lands on the fridge because both agree
 * on where the fridge is — not because anything measured it.
 *
 * Flat, not shaded: the set is a backdrop for text, and every gradient and
 * drop shadow put behind a subtitle is contrast taken away from it. The only
 * depth here comes from the shelves getting darker as they go back, which is
 * enough to read as a room.
 */

import React from "react";
import { theme } from "../../theme";

const c = theme.set.shop;
const P = theme.set.products;

/* A deterministic shuffle, so the shelves look random and render identically
   every time. Math.random() here would make every frame a different shop. */
const pick = (n: number) => P[(n * 7 + 3) % P.length];

/** One run of product blocks along a shelf board. */
const Products: React.FC<{
  x: number; y: number; w: number; h: number; n: number; seed: number;
}> = ({ x, y, w, h, n, seed }) => {
  const gap = 4;
  const bw = (w - gap * (n - 1)) / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = seed * 13 + i;
        /* Boxes are not all the same height or a shelf looks like a bar chart. */
        const bh = h * (0.68 + ((k * 17) % 5) / 14);
        return (
          <rect
            key={i}
            x={x + i * (bw + gap)}
            y={y + h - bh}
            width={bw}
            height={bh}
            rx={2}
            fill={pick(k)}
          />
        );
      })}
    </>
  );
};

/** A shelf unit: the carcass, its boards, and what is standing on them. */
const Shelf: React.FC<{
  x: number; y: number; w: number; h: number; rows: number; per: number; seed: number;
}> = ({ x, y, w, h, rows, per, seed }) => {
  const rowH = h / rows;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={c.shelf} />
      {Array.from({ length: rows }, (_, r) => (
        <React.Fragment key={r}>
          <Products
            x={x + 7}
            y={y + r * rowH + 6}
            w={w - 14}
            h={rowH - 15}
            n={per}
            seed={seed + r}
          />
          <rect x={x} y={y + (r + 1) * rowH - 7} width={w} height={7} fill={c.shelfEdge} />
        </React.Fragment>
      ))}
    </>
  );
};

/** The hanging signs. Dark plate, white type — readable at any size. */
const Sign: React.FC<{
  x: number; y: number; w: number; h: number; text: string; drop?: number;
}> = ({ x, y, w, h, text, drop }) => (
  <>
    {drop ? (
      <rect x={x + w / 2 - 2} y={y - drop} width={4} height={drop} fill={c.chrome} />
    ) : null}
    <rect x={x} y={y} width={w} height={h} rx={6} fill={c.sign} />
    <text
      x={x + w / 2}
      y={y + h / 2}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={h * 0.5}
      letterSpacing={h * 0.06}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {text}
    </text>
  </>
);

export const Supermarkt: React.FC = () => (
  <svg
    viewBox="0 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* wall, then floor: the horizon is the only line that says "room" */}
    <rect x={0} y={0} width={960} height={648} fill={c.wall} />
    <rect x={0} y={0} width={960} height={140} fill={c.wallDark} />
    <rect x={0} y={648} width={960} height={432} fill={c.floor} />

    {/* Floor joints, converging on a vanishing point off to the right of the
        room so the aisle reads as running away from the camera. */}
    {Array.from({ length: 7 }, (_, i) => {
      const vx = 700;
      const x0 = -260 + i * 300;
      return (
        <line
          key={i}
          x1={x0}
          y1={1080}
          x2={vx + (x0 - vx) * 0.12}
          y2={648}
          stroke={c.floorLine}
          strokeWidth={3}
        />
      );
    })}
    {[700, 790, 880, 980].map((y, i) => (
      <line key={i} x1={0} y1={y} x2={960} y2={y} stroke={c.floorLine} strokeWidth={3} />
    ))}

    {/* ceiling strip lights */}
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={150 + i * 230}
        y={44 + i * 14}
        width={170 - i * 22}
        height={16}
        rx={8}
        fill="#ffffff"
        opacity={0.75}
      />
    ))}

    {/* the aisle on the left, going back in three steps */}
    <Shelf x={-30} y={210} w={210} h={438} rows={4} per={5} seed={1} />
    <rect x={172} y={230} width={16} height={418} fill={c.shelfDark} opacity={0.35} />
    <Shelf x={188} y={268} w={132} h={380} rows={4} per={4} seed={6} />

    {/* KÜHLREGAL - the fridge run. This box is the `kuehlregal` anchor. */}
    <rect x={424} y={330} width={372} height={268} fill={c.chrome} />
    <rect x={434} y={340} width={352} height={248} fill={c.glass} />
    {[0, 1, 2, 3].map((col) => (
      <React.Fragment key={col}>
        <rect x={438 + col * 88} y={344} width={80} height={240} fill={c.glassDark} opacity={0.35} />
        {[0, 1, 2].map((row) => (
          <Products
            key={row}
            x={444 + col * 88}
            y={352 + row * 78}
            w={68}
            h={58}
            n={3}
            seed={col * 3 + row + 20}
          />
        ))}
      </React.Fragment>
    ))}
    {/* the sheen that says "glass" without a gradient */}
    <polygon points="450,344 500,344 470,584 434,584" fill="#ffffff" opacity={0.22} />
    {/* The header band sits on the fridge rather than floating above it. Above
        it, the callout ring round the fridge collided with it on every line
        that pointed here, and the arrow ran straight through the lettering. */}
    <Sign x={500} y={344} w={220} h={40} text="KÜHLREGAL" />

    {/* the produce table - the `auslage` anchor. Eggs, bread and tomatoes all
        live here, which is why the callout for three different lines lands on
        the same box. */}
    <rect x={826} y={640} width={14} height={120} fill={c.woodDark} />
    <rect x={922} y={640} width={14} height={120} fill={c.woodDark} />
    <rect x={812} y={624} width={138} height={18} rx={3} fill={c.wood} />
    <rect x={812} y={536} width={138} height={90} rx={6} fill={c.woodDark} opacity={0.22} />
    {/* bread */}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={840 + i * 35} cy={608} rx={19} ry={12} fill={c.bread} />
    ))}
    {/* tomatoes */}
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={832 + i * 30} cy={572} r={13} fill="#c4614f" />
    ))}
    {/* egg tray */}
    <rect x={818} y={540} width={126} height={20} rx={4} fill="#e6e2d6" />

    {/* KASSE, away at the top of the aisle - the `kasse` anchor */}
    <Sign x={818} y={168} w={132} h={62} text="KASSE" drop={104} />
  </svg>
);
