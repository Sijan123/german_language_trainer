/*
 * An open-plan office, drawn full frame.
 *
 * The first set in this project where one of the two speakers is at work.
 * c023 is an employee asking his manager for two weeks in August and c024 is
 * him phoning in sick to the same office, so the room has to work twice: once
 * with both figures in it, and once as the far end of a telephone line.
 *
 * That second use is what fixes the layout. A full-frame set dropped into the
 * right-hand half shows its own x 0-960, with the figure landing at x=704 —
 * so the desk has to run far enough left that she is standing behind it in
 * the half view, while everything a callout points at stays in the stretches
 * the full view leaves clear.
 *
 * Anchors avoid x 285-555 and 1365-1635 (where c023 stands its two figures)
 * and x 570-840 (where c024's single figure lands). That leaves 0-285,
 * 840-1365 and 1635-1920, which is where all five of them are.
 *
 * Everything pointable is above y=648, as everywhere else.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall, Window, Plant } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.buero;

/** Everything on this set a callout can point at. */
export const bueroAnchors: Record<string, Anchor> = {
  /* the wall planner, left band — the one anchor the half-frame view keeps */
  kalender: { x: 90, y: 180, w: 170, h: 178 },
  /* the window over the desk, centre band */
  fenster: { x: 900, y: 150, w: 340, h: 232 },
  /* the working end of the desk: monitor, keyboard, papers */
  schreibtisch: { x: 880, y: 456, w: 400, h: 164 },
  /* wall clock, right band */
  uhr: { x: 1700, y: 150, w: 124, h: 124 },
  /* the shelf of ring binders under it */
  regal: { x: 1648, y: 300, w: 232, h: 300 }
};

/** Which German words should send a callout here. */
export const bueroKeywords: Record<string, string[]> = {
  kalender: ["kalender", "urlaub", "august", "woche", "wochen", "termin", "montag", "freitag", "monat"],
  fenster: ["fenster", "wetter", "draußen", "sonne", "regen"],
  schreibtisch: ["schreibtisch", "tisch", "computer", "rechner", "bildschirm", "antrag", "mail", "papier"],
  uhr: ["uhr", "zeit", "spät", "früh", "stunde"],
  regal: ["regal", "ordner", "akte", "akten", "unterlagen", "bewerbung", "schrank"]
};

const A = bueroAnchors;

/* The desk runs from x=300 to x=1300. It is much wider than the anchor on it,
   on purpose: in the half-frame view the visible part is its left end, and a
   desk that stopped at 880 would leave the person on the phone standing in an
   empty room. */
const DESK_X = 300;
const DESK_W = 1000;
const DESK_Y = 486;

export const Buero: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />
    {/* a shallow band of wall panelling, the office equivalent of skirting */}
    <rect x={0} y={452} width={1920} height={12} fill={c.wallDark} opacity={0.75} />

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.metal} />

    {/* ----------------------------------------------------- anchor: kalender */}
    {/* A wall planner: a red header, a grid of days, one of them ringed. It
        is the thing c023 is actually about — two weeks in August — so it is
        drawn big enough to read as a calendar at 720p. */}
    <rect x={A.kalender.x} y={A.kalender.y} width={A.kalender.w} height={A.kalender.h} rx={8} fill={c.papier} />
    <rect x={A.kalender.x} y={A.kalender.y} width={A.kalender.w} height={38} rx={8} fill={c.ordner} />
    <rect x={A.kalender.x} y={A.kalender.y + 24} width={A.kalender.w} height={14} fill={c.ordner} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect
        key={i}
        x={A.kalender.x + 18 + (i % 4) * 36}
        y={A.kalender.y + 58 + Math.floor(i / 4) * 34}
        width={24}
        height={20}
        rx={4}
        fill={c.papierInk}
        opacity={0.42}
      />
    ))}
    <circle
      cx={A.kalender.x + 30 + 2 * 36}
      cy={A.kalender.y + 68 + 34}
      r={20}
      fill="none"
      stroke={c.ordner}
      strokeWidth={5}
    />

    {/* ---------------------------------------------------------- anchor: uhr */}
    <circle cx={A.uhr.x + A.uhr.w / 2} cy={A.uhr.y + A.uhr.h / 2} r={A.uhr.w / 2} fill={c.papier} stroke={c.screen} strokeWidth={7} />
    <line
      x1={A.uhr.x + A.uhr.w / 2}
      y1={A.uhr.y + A.uhr.h / 2}
      x2={A.uhr.x + A.uhr.w / 2 - 22}
      y2={A.uhr.y + A.uhr.h / 2 - 20}
      stroke={c.screen}
      strokeWidth={7}
      strokeLinecap="round"
    />
    <line
      x1={A.uhr.x + A.uhr.w / 2}
      y1={A.uhr.y + A.uhr.h / 2}
      x2={A.uhr.x + A.uhr.w / 2 + 20}
      y2={A.uhr.y + A.uhr.h / 2 - 26}
      stroke={c.screen}
      strokeWidth={5}
      strokeLinecap="round"
    />
    <circle cx={A.uhr.x + A.uhr.w / 2} cy={A.uhr.y + A.uhr.h / 2} r={7} fill={c.screen} />

    {/* -------------------------------------------------------- anchor: regal */}
    {/* Three shelves of ring binders. Binders are the one office object that
        is unmistakable as a block of colour with a white label on it. */}
    <rect x={A.regal.x} y={A.regal.y} width={A.regal.w} height={A.regal.h} rx={5} fill={c.shelf} />
    {[0, 1, 2].map((row) => (
      <React.Fragment key={row}>
        <rect
          x={A.regal.x}
          y={A.regal.y + 88 + row * 100}
          width={A.regal.w}
          height={12}
          fill={c.shelfEdge}
        />
        {Array.from({ length: 7 }, (_, i) => {
          const tint = [c.ordner, c.ordnerAlt, c.ordnerAlt2][(row * 3 + i) % 3];
          return (
            <React.Fragment key={i}>
              <rect
                x={A.regal.x + 14 + i * 29}
                y={A.regal.y + 16 + row * 100}
                width={22}
                height={72}
                rx={3}
                fill={tint}
              />
              <rect
                x={A.regal.x + 14 + i * 29}
                y={A.regal.y + 38 + row * 100}
                width={22}
                height={16}
                fill={c.papier}
                opacity={0.9}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ))}

    {/* floor */}
    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />

    <Plant x={120} y={HORIZON - 14} s={0.92} />

    {/* -------------------------------------------------- anchor: schreibtisch */}
    {/* The desk runs well past its own anchor in both directions; the anchor
        covers the worked end of it. The front panel drops to the bottom of
        the frame so a figure standing at it is cut off at the waist. */}
    <rect x={DESK_X} y={DESK_Y + 26} width={DESK_W} height={1080 - DESK_Y - 26} fill={c.desk} />
    <rect x={DESK_X - 16} y={DESK_Y} width={DESK_W + 32} height={26} rx={6} fill={c.deskTop} />
    <rect x={DESK_X - 16} y={DESK_Y + 26} width={DESK_W + 32} height={10} fill={c.deskDark} opacity={0.65} />
    {[0, 1, 2].map((i) => (
      <line
        key={i}
        x1={DESK_X + 180 + i * 300}
        y1={DESK_Y + 36}
        x2={DESK_X + 180 + i * 300}
        y2={1080}
        stroke={c.deskDark}
        strokeWidth={3}
        opacity={0.4}
      />
    ))}

    {/* the monitor, standing on the worked end */}
    <rect x={A.schreibtisch.x + 30} y={A.schreibtisch.y - 30} width={196} height={128} rx={8} fill={c.screen} />
    <rect x={A.schreibtisch.x + 40} y={A.schreibtisch.y - 20} width={176} height={104} rx={4} fill={c.screenLit} />
    <rect x={A.schreibtisch.x + 112} y={A.schreibtisch.y + 98} width={30} height={18} fill={c.metalDark} />
    <rect x={A.schreibtisch.x + 84} y={A.schreibtisch.y + 112} width={88} height={10} rx={5} fill={c.metalDark} />

    {/* keyboard and a mug beside it */}
    <rect x={A.schreibtisch.x + 258} y={A.schreibtisch.y + 92} width={118} height={30} rx={5} fill={c.metal} />
    {[0, 1].map((r) => (
      <line
        key={r}
        x1={A.schreibtisch.x + 268}
        y1={A.schreibtisch.y + 102 + r * 10}
        x2={A.schreibtisch.x + 366}
        y2={A.schreibtisch.y + 102 + r * 10}
        stroke={c.metalDark}
        strokeWidth={3}
      />
    ))}
    <rect x={A.schreibtisch.x + 6} y={A.schreibtisch.y + 82} width={44} height={44} rx={6} fill={c.ordnerAlt} />
    <path
      d={`M${A.schreibtisch.x + 50} ${A.schreibtisch.y + 94} a14 14 0 0 1 0 22`}
      fill="none"
      stroke={c.ordnerAlt}
      strokeWidth={7}
    />

    {/* a stack of paper on the far left of the desk, so the half-frame view
        has something on it too */}
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={DESK_X + 74 + i * 5}
        y={DESK_Y - 16 - i * 5}
        width={132}
        height={20}
        rx={3}
        fill={c.papier}
        stroke={c.papierInk}
        strokeWidth={2}
        opacity={0.95}
      />
    ))}
  </svg>
);
