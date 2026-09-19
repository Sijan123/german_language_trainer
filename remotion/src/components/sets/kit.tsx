/*
 * The parts every room is built from.
 *
 * A set is a 960x1080 SVG authored in full-frame coordinates — the left room's
 * viewBox starts at x=0, the right room's at x=960 — so a callout box written
 * once lands in either room with nothing to convert. These helpers take that
 * `x` offset and draw relative to it.
 *
 * Two rules hold across every set, and breaking either one has already cost a
 * re-render:
 *
 *   The horizon is at y=648 in every room. Two rooms side by side with floors
 *   at different heights look like a collage, not a place.
 *
 *   Nothing a callout can point at may sit below y=648. The speech bubble
 *   covers the bottom third of the frame, so an object down there is named by
 *   a subtitle that is drawn on top of it.
 */

import React from "react";
import { theme } from "../../theme";

export const HORIZON = 648;
export const ROOM_W = 960;

const P = theme.set.products;

/* A deterministic shuffle: the shelves look random and render identically
   every time. Math.random() here would make every frame a different shop. */
const pick = (n: number) => P[(n * 7 + 3) % P.length];

type Palette = { wall: string; wallDark: string; floor: string; [k: string]: string };

/** Back wall, with a darker band where the ceiling would be. */
export const Wall: React.FC<{ x: number; palette: Palette; ceiling?: number }> = ({
  x, palette, ceiling = 140
}) => (
  <>
    <rect x={x} y={0} width={ROOM_W} height={HORIZON} fill={palette.wall} />
    <rect x={x} y={0} width={ROOM_W} height={ceiling} fill={palette.wallDark} />
  </>
);

/**
 * Floor in perspective.
 *
 * `vanishAt` is where the joints converge. Off-centre reads as a room you are
 * standing to one side of, which is what stops two flat rooms looking like the
 * same room twice.
 */
export const Floor: React.FC<{
  x: number; palette: Palette & { floorLine?: string }; vanishAt: number;
}> = ({ x, palette, vanishAt }) => {
  const line = palette.floorLine || palette.wallDark;
  return (
    <>
      <rect x={x} y={HORIZON} width={ROOM_W} height={1080 - HORIZON} fill={palette.floor} />
      {Array.from({ length: 7 }, (_, i) => {
        const x0 = x - 260 + i * 300;
        return (
          <line
            key={i}
            x1={x0}
            y1={1080}
            x2={vanishAt + (x0 - vanishAt) * 0.12}
            y2={HORIZON}
            stroke={line}
            strokeWidth={3}
          />
        );
      })}
      {[700, 790, 880, 980].map((y) => (
        <line key={y} x1={x} y1={y} x2={x + ROOM_W} y2={y} stroke={line} strokeWidth={3} />
      ))}
    </>
  );
};

/** One run of product blocks along a shelf board. */
export const Products: React.FC<{
  x: number; y: number; w: number; h: number; n: number; seed: number;
}> = ({ x, y, w, h, n, seed }) => {
  const gap = 4;
  const bw = (w - gap * (n - 1)) / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = seed * 13 + i;
        /* Not all the same height, or a shelf looks like a bar chart. */
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
export const Shelf: React.FC<{
  x: number; y: number; w: number; h: number; rows: number; per: number;
  seed: number; palette: { shelf: string; shelfEdge: string };
}> = ({ x, y, w, h, rows, per, seed, palette }) => {
  const rowH = h / rows;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={palette.shelf} />
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
          <rect x={x} y={y + (r + 1) * rowH - 7} width={w} height={7} fill={palette.shelfEdge} />
        </React.Fragment>
      ))}
    </>
  );
};

/** A hanging sign. Dark plate, white type — readable at any size. */
export const Sign: React.FC<{
  x: number; y: number; w: number; h: number; text: string; drop?: number;
  palette: { sign: string; signInk: string; chrome?: string };
}> = ({ x, y, w, h, text, drop, palette }) => (
  <>
    {drop ? (
      <rect x={x + w / 2 - 2} y={y - drop} width={4} height={drop} fill={palette.chrome || palette.sign} />
    ) : null}
    <rect x={x} y={y} width={w} height={h} rx={6} fill={palette.sign} />
    <text
      x={x + w / 2}
      y={y + h / 2}
      fill={palette.signInk}
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

/** A window with daylight and a couple of roofs across the way. */
export const Window: React.FC<{
  x: number; y: number; w: number; h: number;
  palette: { sky: string; skyLow: string }; frame?: string;
}> = ({ x, y, w, h, palette, frame = "#cbbfa8" }) => {
  const ix = x + 12;
  const iy = y + 12;
  const iw = w - 24;
  const ih = h - 24;
  const sill = iy + ih * 0.55;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={frame} />
      <rect x={ix} y={iy} width={iw} height={ih} fill={palette.sky} />
      <rect x={ix} y={sill} width={iw} height={iy + ih - sill} fill={palette.skyLow} />
      <polygon
        points={`${ix + 16},${sill + 34} ${ix + 60},${sill} ${ix + 104},${sill + 34} ${ix + 104},${iy + ih} ${ix + 16},${iy + ih}`}
        fill="#b9c3c0"
        opacity={0.75}
      />
      <polygon
        points={`${ix + 122},${sill + 46} ${ix + 168},${sill + 8} ${ix + 214},${sill + 46} ${ix + 214},${iy + ih} ${ix + 122},${iy + ih}`}
        fill="#c6cfcb"
        opacity={0.75}
      />
      <circle cx={ix + iw - 42} cy={iy + 42} r={22} fill="#f2e6c8" opacity={0.85} />
      <line x1={ix + iw / 2} y1={iy} x2={ix + iw / 2} y2={iy + ih} stroke={frame} strokeWidth={9} />
      <line x1={ix} y1={sill - 6} x2={ix + iw} y2={sill - 6} stroke={frame} strokeWidth={9} />
    </>
  );
};

/** A run of worktop with units under it, along the back of a room. */
export const Counter: React.FC<{
  x: number; palette: { counter: string; counterTop: string; wood: string }; top?: number;
}> = ({ x, palette, top = HORIZON }) => (
  <>
    <rect x={x} y={top} width={ROOM_W} height={22} fill={palette.counterTop} />
    <rect x={x} y={top + 22} width={ROOM_W} height={1080 - top - 22} fill={palette.counter} />
    {[40, 280, 520, 760].map((d) => (
      <line
        key={d}
        x1={x + d}
        y1={top + 22}
        x2={x + d}
        y2={1080}
        stroke={palette.wood}
        strokeWidth={3}
        opacity={0.4}
      />
    ))}
    {[140, 380, 620, 860].map((d) => (
      <rect key={d} x={x + d} y={top + 82} width={64} height={9} rx={4} fill={palette.wood} opacity={0.75} />
    ))}
  </>
);

/** Two cupboard doors with handles. */
export const Cabinets: React.FC<{
  x: number; y: number; w: number; h: number;
  palette: { cabinet: string; cabinetDark: string };
}> = ({ x, y, w, h, palette }) => {
  const half = w / 2;
  return (
    <>
      {[0, 1].map((i) => (
        <React.Fragment key={i}>
          <rect x={x + i * (half + 4)} y={y} width={half - 4} height={h} rx={6} fill={palette.cabinet} />
          <rect
            x={x + i * (half + 4) + 12}
            y={y + 12}
            width={half - 28}
            height={h - 24}
            rx={4}
            fill={palette.cabinetDark}
            opacity={0.35}
          />
          <rect
            x={i === 0 ? x + half - 22 : x + half + 12}
            y={y + h / 2 - 22}
            width={12}
            height={44}
            rx={6}
            fill="#8d9389"
          />
        </React.Fragment>
      ))}
    </>
  );
};

/** A picture or poster on the wall. */
export const Picture: React.FC<{
  x: number; y: number; w: number; h: number; tint: string; frame?: string;
}> = ({ x, y, w, h, tint, frame = "#b9ae97" }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={3} fill={frame} />
    <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} fill="#f2efe6" />
    <circle cx={x + w * 0.36} cy={y + h * 0.42} r={Math.min(w, h) * 0.17} fill={tint} opacity={0.7} />
    <polygon
      points={`${x + 12},${y + h - 12} ${x + w * 0.55},${y + h * 0.42} ${x + w - 12},${y + h - 12}`}
      fill={tint}
      opacity={0.45}
    />
  </>
);

/** A pot plant, for a corner that would otherwise be a blank wall. */
export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${s})`}>
    <path d="M-34 0 h68 l-9 88 h-50 z" fill="#b5785a" />
    <rect x={-38} y={-10} width={76} height={16} rx={5} fill="#c4886a" />
    {[-1, 0, 1].map((i) => (
      <ellipse
        key={i}
        cx={i * 26}
        cy={-58 - Math.abs(i) * 8}
        rx={19}
        ry={44}
        fill={i === 0 ? "#6d9b6a" : "#7faa78"}
        transform={`rotate(${i * 22}, ${i * 26}, -58)`}
      />
    ))}
  </g>
);
