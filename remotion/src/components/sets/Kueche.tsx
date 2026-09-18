/*
 * The kitchen at home, where the other half of the phone call is standing.
 *
 * Same trick as the shop: one SVG whose viewBox is already in full-frame
 * coordinates — it starts at x=960 rather than 0 — so the callout boxes in
 * src/scenes/c002.ts can be written once and land in either room without
 * anyone converting anything.
 *
 * It is warmer than the shop on purpose. The two rooms are on screen together
 * for the whole film and the only thing telling you they are different places
 * is how they are lit, so the shop is cool and fluorescent and this is not.
 *
 * The worktop sits on the same horizon as the shop floor, at y=648. That is
 * not decoration: everything below it is hidden by the speech bubble, so every
 * object a callout can point at - the jars, the baking - has to live above it.
 * The first version put the worktop at 748 and the cake spent the whole film
 * behind the subtitle that was naming it.
 */

import React from "react";
import { theme } from "../../theme";

const c = theme.set.kitchen;
const P = theme.set.products;

const COUNTER_Y = 648;

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
    <rect x={960} y={0} width={960} height={1080} fill={c.wall} />
    <rect x={960} y={0} width={960} height={120} fill={c.wallDark} />

    {/* the tiled strip behind the worktop */}
    <rect x={960} y={472} width={960} height={176} fill={c.tile} />
    {Array.from({ length: 17 }, (_, i) => (
      <line
        key={i}
        x1={960 + i * 58}
        y1={472}
        x2={960 + i * 58}
        y2={COUNTER_Y}
        stroke={c.wallDark}
        strokeWidth={2}
        opacity={0.55}
      />
    ))}
    <line x1={960} y1={560} x2={1920} y2={560} stroke={c.wallDark} strokeWidth={2} opacity={0.55} />

    {/* wall cabinets */}
    {[0, 1].map((i) => (
      <React.Fragment key={i}>
        <rect x={990 + i * 158} y={206} width={150} height={172} rx={6} fill={c.cabinet} />
        <rect x={1002 + i * 158} y={218} width={126} height={148} rx={4} fill={c.cabinetDark} opacity={0.35} />
        <rect x={i === 0 ? 1112 : 1148} y={286} width={12} height={44} rx={6} fill="#8d9389" />
      </React.Fragment>
    ))}

    {/* the open shelf under them - the `vorrat` anchor, where the jam lives */}
    <rect x={1012} y={462} width={278} height={9} rx={3} fill={c.wood} />
    <Jar x={1026} y={400} w={40} h={62} fill={c.jar} />
    <Jar x={1076} y={408} w={36} h={54} fill="#a8623f" />
    <Jar x={1122} y={404} w={38} h={58} fill="#cf9a4e" />
    <Jar x={1170} y={414} w={34} h={48} fill="#8f6f4a" />
    <Jar x={1214} y={402} w={40} h={60} fill="#b8523f" />

    {/* the window - the daylight that makes this room not the shop */}
    <rect x={1332} y={196} width={252} height={214} rx={4} fill="#cbbfa8" />
    <rect x={1344} y={208} width={228} height={190} fill={c.sky} />
    <rect x={1344} y={312} width={228} height={86} fill={c.skyLow} />
    {/* a couple of roofs across the way, so it is a window and not a blue card */}
    <polygon points="1360,346 1404,312 1448,346 1448,398 1360,398" fill="#b9c3c0" opacity={0.75} />
    <polygon points="1466,358 1512,320 1558,358 1558,398 1466,398" fill="#c6cfcb" opacity={0.75} />
    <circle cx={1530} cy={250} r={22} fill="#f2e6c8" opacity={0.85} />
    <line x1={1458} y1={208} x2={1458} y2={398} stroke="#cbbfa8" strokeWidth={9} />
    <line x1={1344} y1={306} x2={1572} y2={306} stroke="#cbbfa8" strokeWidth={9} />

    {/* worktop and the units under it */}
    <rect x={960} y={COUNTER_Y} width={960} height={22} fill={c.counterTop} />
    <rect x={960} y={COUNTER_Y + 22} width={960} height={1080 - COUNTER_Y - 22} fill={c.counter} />
    {[1000, 1240, 1480, 1720].map((x, i) => (
      <line key={i} x1={x} y1={COUNTER_Y + 22} x2={x} y2={1080} stroke={c.wood} strokeWidth={3} opacity={0.4} />
    ))}
    {[1100, 1340, 1580, 1820].map((x, i) => (
      <rect key={i} x={x} y={730} width={64} height={9} rx={4} fill={c.wood} opacity={0.75} />
    ))}

    {/* the baking in progress - the `kuchen` anchor. A bowl, a whisk and a tin:
        she says she is baking a cake at the weekend, so it is set out, not
        finished. */}
    <ellipse cx={1176} cy={COUNTER_Y - 4} rx={52} ry={12} fill={c.wood} opacity={0.22} />
    <path
      d={`M1126 ${COUNTER_Y - 68} h100 l-13 60 a37 16 0 0 1 -74 0 z`}
      fill={c.pot}
    />
    <ellipse cx={1176} cy={COUNTER_Y - 68} rx={50} ry={13} fill="#96a29e" />
    <ellipse cx={1176} cy={COUNTER_Y - 68} rx={40} ry={9} fill="#e8e2d2" />
    <line x1={1206} y1={COUNTER_Y - 116} x2={1194} y2={COUNTER_Y - 72} stroke={c.wood} strokeWidth={7} strokeLinecap="round" />
    <rect x={1250} y={COUNTER_Y - 44} width={58} height={44} rx={5} fill="#b0b6b2" />
    <rect x={1258} y={COUNTER_Y - 36} width={42} height={30} rx={3} fill="#d8b47e" />

    {/* a fruit bowl and a mug, because an empty worktop looks like a showroom */}
    <ellipse cx={1452} cy={COUNTER_Y - 14} rx={44} ry={16} fill="#c8cec6" />
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={1428 + i * 16} cy={COUNTER_Y - 24} r={12} fill={P[(i * 3 + 1) % P.length]} />
    ))}
    <rect x={1546} y={COUNTER_Y - 42} width={36} height={42} rx={5} fill="#e4ded0" />
    <path
      d={`M1582 ${COUNTER_Y - 32} a13 13 0 0 1 0 22`}
      fill="none"
      stroke="#e4ded0"
      strokeWidth={7}
    />
  </svg>
);
