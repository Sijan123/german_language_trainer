/*
 * A bakery counter.
 *
 * c018 scaffolded onto the restaurant, which is the right *kind* of place and
 * the wrong one: you sit down in a restaurant and you queue at a Bäckerei, and
 * every noun in the dialogue — Brötchen, Vollkornbrot, Käsekuchen — is behind
 * glass rather than on a table.
 *
 * Full frame, like the restaurant and the Bürgerbüro: the customer and the
 * person serving are in the same place. The counter runs across at the height
 * the speech bubble starts, so the goods sit in the band above it.
 *
 * Figures stand at x≈420 and x≈1500, so anchors keep out of 285-555 and
 * 1365-1635.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Sign } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.baeckerei;

/** Everything on this set a callout can point at. */
export const baeckereiAnchors: Record<string, Anchor> = {
  /* the bread shelf behind the counter, centre band */
  brot: { x: 600, y: 196, w: 300, h: 176 },
  /* rolls in the display case */
  broetchen: { x: 636, y: 468, w: 220, h: 104 },
  /* cake, the other end of the case */
  kuchen: { x: 900, y: 462, w: 210, h: 110 },
  /* the till, right band */
  kasse: { x: 1666, y: 404, w: 172, h: 170 },
  /* the case itself, which contains the two food anchors */
  theke: { x: 604, y: 574, w: 720, h: 70 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const baeckereiKeywords: Record<string, string[]> = {
  brot: ["brot", "vollkornbrot", "vollkorn", "laib", "geschnitten", "stück", "roggen"],
  broetchen: ["brötchen", "semmel", "gebäck", "croissant", "frisch"],
  kuchen: ["kuchen", "käsekuchen", "torte", "stücke", "süß", "gebacken"],
  kasse: ["kasse", "zahlen", "karte", "bar", "euro", "geld", "bezahlen", "passend"],
  theke: ["theke", "auslage", "vitrine", "gern", "wünschen"]
};

const A = baeckereiAnchors;

/** One loaf, seen end-on with slashes across the top. */
const Laib: React.FC<{ x: number; y: number; w: number; h: number; dark?: boolean }> = ({
  x, y, w, h, dark
}) => (
  <>
    <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={dark ? c.brotDark : c.brot} />
    {[0, 1, 2].map((i) => (
      <line
        key={i}
        x1={x + 14 + i * (w - 34) / 3}
        y1={y + 8}
        x2={x + 24 + i * (w - 34) / 3}
        y2={y + h - 8}
        stroke={c.brotDark}
        strokeWidth={4}
        opacity={0.75}
      />
    ))}
  </>
);

export const Baeckerei: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={128} fill={c.wallDark} />
    <Floor x={0} palette={c} vanishAt={900} />
    <rect x={960} y={0} width={0} height={0} />

    <Sign x={210} y={150} w={250} h={62} text="BÄCKEREI" palette={c} />

    {/* --------------------------------------------------------- anchor: brot */}
    {/* The shelf of loaves behind the counter. Two rows, because one row of
        identical ovals reads as a pattern rather than as bread. */}
    <rect x={A.brot.x - 16} y={A.brot.y - 14} width={A.brot.w + 32} height={A.brot.h + 28} rx={8} fill={c.shelf} />
    <rect x={A.brot.x - 8} y={A.brot.y - 6} width={A.brot.w + 16} height={A.brot.h + 12} fill={c.shelfDark} opacity={0.3} />
    {[0, 1].map((r) => (
      <React.Fragment key={r}>
        {[0, 1, 2].map((i) => (
          <Laib
            key={i}
            x={A.brot.x + 10 + i * 96}
            y={A.brot.y + 8 + r * 88}
            w={82}
            h={60}
            dark={(i + r) % 2 === 1}
          />
        ))}
        <rect x={A.brot.x - 8} y={A.brot.y + 74 + r * 88} width={A.brot.w + 16} height={10} fill={c.shelf} />
      </React.Fragment>
    ))}

    {/* ------------------------------------------------------- anchor: kasse */}
    <rect x={A.kasse.x} y={A.kasse.y + 52} width={A.kasse.w} height={A.kasse.h - 52} rx={10} fill={c.kasse} />
    <rect x={A.kasse.x + 18} y={A.kasse.y} width={A.kasse.w - 36} height={62} rx={7} fill={c.kasseDark} />
    <rect x={A.kasse.x + 28} y={A.kasse.y + 10} width={A.kasse.w - 56} height={40} rx={4} fill={c.glass} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((k) => (
        <rect
          key={`${r}-${k}`}
          x={A.kasse.x + 24 + k * 42}
          y={A.kasse.y + 76 + r * 28}
          width={32}
          height={20}
          rx={4}
          fill={c.kasseDark}
        />
      ))
    )}
    <rect x={A.kasse.x + A.kasse.w / 2 - 9} y={A.kasse.y + A.kasse.h} width={18} height={HORIZON - A.kasse.y - A.kasse.h} fill={c.chrome} />

    {/* -------------------------------------------------------- anchor: theke */}
    {/* The glass case. Drawn before the goods so they sit inside it, and the
        front panel runs past the bottom of the frame so both figures are cut
        off at the waist and read as standing at a counter. */}
    <rect x={A.theke.x - 44} y={A.theke.y + A.theke.h} width={A.theke.w + 88} height={1080 - A.theke.y - A.theke.h} fill={c.counter} />
    <rect x={A.theke.x - 44} y={A.theke.y} width={A.theke.w + 88} height={A.theke.h} rx={7} fill={c.counterTop} />
    <rect x={A.theke.x - 44} y={A.theke.y + A.theke.h} width={A.theke.w + 88} height={14} fill={c.counterTop} opacity={0.5} />
    {/* the glass front of the case, above the worktop */}
    <rect x={A.theke.x - 30} y={A.theke.y - 148} width={A.theke.w + 60} height={150} rx={6} fill={c.glass} opacity={0.5} />
    <rect
      x={A.theke.x - 30}
      y={A.theke.y - 148}
      width={A.theke.w + 60}
      height={150}
      rx={6}
      fill="none"
      stroke={c.glassEdge}
      strokeWidth={5}
    />

    {/* --------------------------------------------------- anchor: broetchen */}
    {/* A tray of rolls. Each gets a slash so it is a Brötchen and not a stone. */}
    <rect x={A.broetchen.x - 8} y={A.broetchen.y + A.broetchen.h - 14} width={A.broetchen.w + 16} height={14} rx={5} fill={c.shelf} />
    {[0, 1].map((r) =>
      [0, 1, 2, 3].map((i) => (
        <React.Fragment key={`${r}-${i}`}>
          <ellipse
            cx={A.broetchen.x + 30 + i * 54 - r * 20}
            cy={A.broetchen.y + 30 + r * 42}
            rx={25}
            ry={19}
            fill={c.broetchen}
          />
          <line
            x1={A.broetchen.x + 18 + i * 54 - r * 20}
            y1={A.broetchen.y + 30 + r * 42}
            x2={A.broetchen.x + 42 + i * 54 - r * 20}
            y2={A.broetchen.y + 30 + r * 42}
            stroke={c.brotDark}
            strokeWidth={3}
            opacity={0.7}
          />
        </React.Fragment>
      ))
    )}

    {/* ------------------------------------------------------- anchor: kuchen */}
    {/* Two slices left on the stand, which is what line 6 says: "Nur noch zwei
        Stücke." The set agrees with the dialogue or it contradicts it. */}
    <rect x={A.kuchen.x - 6} y={A.kuchen.y + A.kuchen.h - 16} width={A.kuchen.w + 12} height={16} rx={6} fill={c.chrome} />
    <rect x={A.kuchen.x + A.kuchen.w / 2 - 8} y={A.kuchen.y + A.kuchen.h - 40} width={16} height={26} fill={c.chrome} />
    {/* Two slices seen side on: a wedge that is tall at the back and thin at
        the front, with a crust along the bottom and a glazed top. The first
        pass tapered them the other way and they came out as two cream cones
        standing on a shelf. */}
    {[0, 1].map((i) => {
      const bx = A.kuchen.x + 22 + i * 98;
      const by = A.kuchen.y + A.kuchen.h - 42;
      return (
        <React.Fragment key={i}>
          <path d={`M${bx} ${by} l78 0 l0 -62 z`} fill={c.kuchen} />
          <path d={`M${bx} ${by} l78 0 l0 -10 l-78 0 z`} fill={c.brotDark} opacity={0.75} />
          <path d={`M${bx + 46} ${by - 24} l32 0 l0 -38 z`} fill={c.kuchenTop} opacity={0.9} />
        </React.Fragment>
      );
    })}
  </svg>
);
