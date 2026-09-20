/*
 * A Bürgerbüro counter.
 *
 * c010 is the only dialogue here between an official and a member of the
 * public rather than two people who know each other, and the counter is what
 * says so: one of them is behind it and one in front, and nobody has to be
 * drawn sitting down for that to read.
 *
 * It borrows the restaurant's trick. The counter runs across the frame at the
 * height the speech bubble starts, so the documents on it — the passport, the
 * form — sit in the narrow band above the bubble and below the faces, which
 * is exactly where this dialogue's nouns live. Everything a callout points at
 * is above y=640.
 *
 * Anchors avoid x 285-555 and 1365-1635, where the two figures stand.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Picture, Plant } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.amt;

/** Everything on this set a callout can point at. */
export const buergerbueroAnchors: Record<string, Anchor> = {
  /* waiting chairs, left band */
  wartebereich: { x: 60, y: 446, w: 214, h: 154 },
  /* the passport lying on the counter, centre band */
  ausweis: { x: 686, y: 516, w: 152, h: 76 },
  /* the form beside it */
  formular: { x: 884, y: 508, w: 176, h: 84 },
  /* the number display on the wall */
  nummer: { x: 1122, y: 186, w: 232, h: 136 },
  /*
   * An out-tray of franked envelopes, on the clear stretch of counter to the
   * right of the form. The last line is "Die Bestätigung kommt per Post" and
   * the scaffolder had nowhere to send it but the waiting chairs.
   */
  post: { x: 1104, y: 512, w: 152, h: 80 },
  /* the counter itself; it contains the two document anchors, the way the
     restaurant's table contains the plates */
  tresen: { x: 600, y: 566, w: 740, h: 74 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const buergerbueroKeywords: Record<string, string[]> = {
  ausweis: ["ausweis", "pass", "reisepass", "dokument", "papiere", "personalausweis"],
  formular: ["formular", "unterschreiben", "unterschrift", "ausfüllen", "blatt",
             "antrag", "bestätigung", "wohnungsgeberbestätigung"],
  nummer: ["nummer", "termin", "aufgerufen", "warten", "uhr", "zehn"],
  tresen: ["schalter", "tresen", "anmelden", "anmeldung", "bürgerbüro", "amt"],
  /* "post" belongs to the out-tray, not here. Before that tray existed the
     scaffolder had only the chairs to offer and duly proposed a ring round
     the waiting area labelled "die Post". */
  wartebereich: ["warten", "stuhl", "platz", "wartebereich"],
  post: ["post", "brief", "bestätigung", "umschlag", "schicken", "zuschicken"]
};

const A = buergerbueroAnchors;

export const Buergerbuero: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={134} fill={c.wallDark} />
    {/* a band of institutional skirting-height panelling along the back */}
    <rect x={0} y={470} width={1920} height={14} fill={c.wallDark} opacity={0.8} />

    {/* ------------------------------------------------- anchor: wartebereich */}
    {/* Three joined chairs, which is what a waiting area looks like anywhere
        an appointment is involved. */}
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <rect
          x={A.wartebereich.x + 6 + i * 68}
          y={A.wartebereich.y + 4}
          width={56}
          height={62}
          rx={9}
          fill={c.stuhl}
        />
        <rect
          x={A.wartebereich.x + 6 + i * 68}
          y={A.wartebereich.y + 70}
          width={56}
          height={18}
          rx={6}
          fill={c.stuhlDark}
        />
      </React.Fragment>
    ))}
    <rect x={A.wartebereich.x} y={A.wartebereich.y + 88} width={A.wartebereich.w} height={12} rx={5} fill={c.chrome} />
    <rect x={A.wartebereich.x + 20} y={A.wartebereich.y + 100} width={12} height={A.wartebereich.h - 100} fill={c.chrome} />
    <rect x={A.wartebereich.x + A.wartebereich.w - 32} y={A.wartebereich.y + 100} width={12} height={A.wartebereich.h - 100} fill={c.chrome} />

    {/* ------------------------------------------------------- anchor: nummer */}
    {/* The called-number display. "Haben Sie einen Termin?" is the second line
        of the film, so the thing that answers it should be on the wall. */}
    <rect
      x={A.nummer.x}
      y={A.nummer.y}
      width={A.nummer.w}
      height={A.nummer.h}
      rx={10}
      fill={c.anzeige}
    />
    <text
      x={A.nummer.x + A.nummer.w / 2}
      y={A.nummer.y + 40}
      fill={c.anzeigeInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={20}
      letterSpacing={3}
      textAnchor="middle"
      dominantBaseline="central"
      opacity={0.8}
    >
      SCHALTER 3
    </text>
    <text
      x={A.nummer.x + A.nummer.w / 2}
      y={A.nummer.y + 94}
      fill={c.anzeigeInk}
      fontFamily={theme.font.mono}
      fontWeight={700}
      fontSize={54}
      letterSpacing={4}
      textAnchor="middle"
      dominantBaseline="central"
    >
      B 042
    </text>

    <Picture x={1664} y={212} w={162} h={126} tint="#7a97ad" frame={c.rahmen} />

    {/* floor */}
    <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} fill={c.floor} />
    {Array.from({ length: 8 }, (_, i) => (
      <line
        key={i}
        x1={i * 274}
        y1={1080}
        x2={900 + (i * 274 - 900) * 0.14}
        y2={HORIZON}
        stroke={c.floorLine}
        strokeWidth={3}
      />
    ))}
    {[714, 808, 908, 1014].map((y) => (
      <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={c.floorLine} strokeWidth={3} />
    ))}

    <Plant x={1846} y={HORIZON - 26} s={0.86} />

    {/* ------------------------------------------------------- anchor: tresen */}
    {/* Drawn after the floor and before the things lying on it. The front
        panel runs down past the bottom of the frame so the figure in front of
        it is cut off at the waist and reads as standing at a counter. */}
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

    {/* ------------------------------------------------------ anchor: ausweis */}
    {/* A German passport is burgundy with gold on it, and at this size that
        colour pair is the whole of the recognition. */}
    <rect
      x={A.ausweis.x}
      y={A.ausweis.y}
      width={A.ausweis.w}
      height={A.ausweis.h}
      rx={7}
      fill={c.pass}
    />
    <rect
      x={A.ausweis.x + 14}
      y={A.ausweis.y + 12}
      width={A.ausweis.w - 28}
      height={9}
      rx={4}
      fill={c.passInk}
      opacity={0.85}
    />
    <circle cx={A.ausweis.x + A.ausweis.w / 2} cy={A.ausweis.y + 42} r={15} fill="none" stroke={c.passInk} strokeWidth={4} opacity={0.85} />
    <rect
      x={A.ausweis.x + 34}
      y={A.ausweis.y + A.ausweis.h - 18}
      width={A.ausweis.w - 68}
      height={7}
      rx={3}
      fill={c.passInk}
      opacity={0.7}
    />

    {/* --------------------------------------------------------- anchor: post */}
    {/* A wire tray with three franked envelopes leaning in it. The stamp
        corner is the detail that makes them letters rather than paper. */}
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <rect
          x={A.post.x + 14 + i * 12}
          y={A.post.y + 6 + i * 5}
          width={110}
          height={54}
          rx={4}
          fill={c.papier}
          stroke={c.papierInk}
          strokeWidth={2}
          opacity={0.95}
        />
        <rect
          x={A.post.x + 14 + i * 12 + 84}
          y={A.post.y + 10 + i * 5}
          width={20}
          height={16}
          rx={2}
          fill={c.pass}
          opacity={0.8}
        />
      </React.Fragment>
    ))}
    <rect x={A.post.x} y={A.post.y + A.post.h - 22} width={A.post.w} height={12} rx={5} fill={c.chrome} />
    {[0, 1].map((i) => (
      <rect
        key={`leg${i}`}
        x={i === 0 ? A.post.x + 6 : A.post.x + A.post.w - 16}
        y={A.post.y + A.post.h - 12}
        width={10}
        height={12}
        fill={c.chrome}
      />
    ))}

    {/* ----------------------------------------------------- anchor: formular */}
    {/* The form, with a signature line at the bottom — "Muss ich hier unten
        unterschreiben?" is a question about a specific place on a specific
        piece of paper, so the line has to be drawn. */}
    <rect
      x={A.formular.x}
      y={A.formular.y}
      width={A.formular.w}
      height={A.formular.h}
      rx={4}
      fill={c.papier}
    />
    <rect x={A.formular.x + 14} y={A.formular.y + 12} width={72} height={8} rx={4} fill={c.papierInk} />
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={A.formular.x + 14}
        y={A.formular.y + 30 + i * 13}
        width={A.formular.w - 28 - (i % 2) * 34}
        height={6}
        rx={3}
        fill={c.papierInk}
        opacity={0.5}
      />
    ))}
    <line
      x1={A.formular.x + 14}
      y1={A.formular.y + A.formular.h - 14}
      x2={A.formular.x + A.formular.w - 44}
      y2={A.formular.y + A.formular.h - 14}
      stroke={c.papierInk}
      strokeWidth={3}
    />
    {/* a pen lying across the corner of it */}
    <rect
      x={A.formular.x + A.formular.w - 40}
      y={A.formular.y + 18}
      width={9}
      height={58}
      rx={4}
      fill={c.anzeige}
      transform={`rotate(18, ${A.formular.x + A.formular.w - 36}, ${A.formular.y + 47})`}
    />
  </svg>
);
