/*
 * A hotel reception, drawn full frame.
 *
 * c032 is checking in: a counter, a person behind it, and three objects the
 * dialogue turns on — the room keys, the card with the wifi password, and the
 * luggage they ask to leave. Same shape as the Bürgerbüro and the pharmacy,
 * which is why the counter sits at the same height and the things on it sit
 * in the same band above the speech card.
 *
 * Anchors avoid x 285-555 and 1365-1635. Everything pointable is above y=648.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall, Picture, Plant } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.rezeption;

/** Everything on this set a callout can point at. */
export const rezeptionAnchors: Record<string, Anchor> = {
  /* the pigeonholes of room keys behind the desk */
  schluessel: { x: 620, y: 186, w: 340, h: 240 },
  /* the REZEPTION sign on the wall */
  schild: { x: 1040, y: 196, w: 300, h: 96 },
  /* the card with the wifi password, lying on the counter */
  karte: { x: 1080, y: 512, w: 140, h: 76 },
  /* two cases parked at the end of the desk */
  koffer: { x: 1660, y: 420, w: 220, h: 214 },
  /* the counter itself */
  tresen: { x: 600, y: 566, w: 740, h: 74 }
};

/** Which German words should send a callout here. */
export const rezeptionKeywords: Record<string, string[]> = {
  schluessel: ["schlüssel", "zimmer", "doppelzimmer", "einzelzimmer", "stock", "etage"],
  schild: ["rezeption", "empfang", "hotel"],
  karte: ["karte", "passwort", "wlan", "internet", "code"],
  koffer: ["koffer", "gepäck", "tasche", "rucksack"],
  tresen: ["tresen", "theke", "anmelden", "einchecken"]
};

const A = rezeptionAnchors;

export const Rezeption: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />
    <rect x={0} y={452} width={1920} height={12} fill={c.wallDark} opacity={0.7} />

    {/* ------------------------------------------------- anchor: schluessel */}
    {/* Pigeonholes, with a key hanging in some of them. The empty ones are
        the rooms that are occupied, which is a detail nobody will read and
        which stops the grid looking printed. */}
    <rect x={A.schluessel.x} y={A.schluessel.y} width={A.schluessel.w} height={A.schluessel.h} rx={6} fill={c.fach} />
    {Array.from({ length: 20 }, (_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = A.schluessel.x + 12 + col * 64;
      const y = A.schluessel.y + 12 + row * 56;
      return (
        <React.Fragment key={i}>
          <rect x={x} y={y} width={54} height={46} rx={4} fill={c.fachDark} />
          {i % 3 !== 1 ? (
            <>
              <circle cx={x + 27} cy={y + 16} r={8} fill="none" stroke={c.schluessel} strokeWidth={5} />
              <rect x={x + 24} y={y + 22} width={6} height={18} fill={c.schluessel} />
              <rect x={x + 30} y={y + 32} width={8} height={5} fill={c.schluessel} />
            </>
          ) : null}
        </React.Fragment>
      );
    })}

    {/* ----------------------------------------------------- anchor: schild */}
    <rect x={A.schild.x} y={A.schild.y} width={A.schild.w} height={A.schild.h} rx={8} fill={c.tresenDark} />
    <text
      x={A.schild.x + A.schild.w / 2}
      y={A.schild.y + A.schild.h / 2}
      fill={c.lampe}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={38}
      letterSpacing={6}
      textAnchor="middle"
      dominantBaseline="central"
    >
      REZEPTION
    </text>

    <Picture x={200} y={236} w={186} h={148} tint="#9aa88f" frame={c.rahmen} />

    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />

    <Plant x={120} y={HORIZON - 12} s={0.95} />

    {/* ----------------------------------------------------- anchor: koffer */}
    {/* Two cases standing at the end of the desk, one behind the other. */}
    <rect x={A.koffer.x + 96} y={A.koffer.y + 30} width={112} height={186} rx={12} fill={c.kofferDark} />
    <rect x={A.koffer.x + 132} y={A.koffer.y + 6} width={44} height={28} rx={12} fill="none" stroke={c.chrome} strokeWidth={9} />
    <rect x={A.koffer.x + 8} y={A.koffer.y + 62} width={120} height={160} rx={12} fill={c.koffer} />
    <rect x={A.koffer.x + 46} y={A.koffer.y + 38} width={44} height={28} rx={12} fill="none" stroke={c.chrome} strokeWidth={9} />
    <rect x={A.koffer.x + 8} y={A.koffer.y + 122} width={120} height={16} fill={c.kofferDark} />
    <rect x={A.koffer.x + 46} y={A.koffer.y + 92} width={44} height={14} rx={5} fill={c.papier} opacity={0.75} />

    {/* ----------------------------------------------------- anchor: tresen */}
    <rect x={A.tresen.x - 40} y={A.tresen.y + A.tresen.h} width={A.tresen.w + 80} height={1080 - A.tresen.y - A.tresen.h} fill={c.tresen} />
    <rect x={A.tresen.x - 40} y={A.tresen.y} width={A.tresen.w + 80} height={A.tresen.h} rx={8} fill={c.tresenTop} />
    <rect x={A.tresen.x - 40} y={A.tresen.y + A.tresen.h} width={A.tresen.w + 80} height={14} fill={c.tresenDark} opacity={0.6} />
    {[0, 1, 2].map((i) => (
      <line
        key={i}
        x1={A.tresen.x + 110 + i * 220}
        y1={A.tresen.y + A.tresen.h + 14}
        x2={A.tresen.x + 110 + i * 220}
        y2={1080}
        stroke={c.tresenDark}
        strokeWidth={3}
        opacity={0.45}
      />
    ))}

    {/* a desk lamp at the left end, so the counter is not a bare slab */}
    <rect x={A.tresen.x + 30} y={A.tresen.y - 12} width={54} height={12} rx={5} fill={c.chrome} />
    <rect x={A.tresen.x + 52} y={A.tresen.y - 66} width={10} height={56} fill={c.chrome} />
    <path d={`M${A.tresen.x + 24} ${A.tresen.y - 66} h68 l-14 -38 h-40 z`} fill={c.lampe} />

    {/* ------------------------------------------------------ anchor: karte */}
    {/* The card the wifi password is printed on. */}
    <rect x={A.karte.x} y={A.karte.y} width={A.karte.w} height={A.karte.h} rx={6} fill={c.papier} stroke={c.papierInk} strokeWidth={2} />
    <rect x={A.karte.x + 14} y={A.karte.y + 14} width={64} height={8} rx={4} fill={c.tresenDark} opacity={0.8} />
    {[0, 1].map((i) => (
      <rect
        key={i}
        x={A.karte.x + 14}
        y={A.karte.y + 34 + i * 16}
        width={A.karte.w - 28 - i * 34}
        height={7}
        rx={3}
        fill={c.papierInk}
        opacity={0.55}
      />
    ))}
  </svg>
);
