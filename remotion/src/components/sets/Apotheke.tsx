/*
 * A pharmacy counter, drawn full frame.
 *
 * c026 is a customer describing a cough to a pharmacist, which is the same
 * shape as the Bürgerbüro and the bakery: two strangers either side of a
 * counter, one of them holding the thing being discussed. So the counter runs
 * across the frame at the height the speech bubble starts, and the two objects
 * the dialogue turns on — the prescription he does not have and the syrup she
 * recommends — sit on top of it, in the band above the card and below the
 * faces.
 *
 * Anchors avoid x 285-555 and 1365-1635, where the two figures stand.
 * Everything pointable is above y=648.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall, Plant } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.apotheke;

/** Everything on this set a callout can point at. */
export const apothekeAnchors: Record<string, Anchor> = {
  /* the wall of boxes behind the counter, centre band */
  regal: { x: 620, y: 186, w: 384, h: 246 },
  /* the prescription lying on the counter */
  rezept: { x: 700, y: 512, w: 150, h: 78 },
  /* the bottle of cough syrup she pushes across */
  saft: { x: 1066, y: 494, w: 96, h: 100 },
  /* the green cross on the wall, right band */
  kreuz: { x: 1664, y: 172, w: 176, h: 176 },
  /* the counter itself, which contains the two objects on it */
  tresen: { x: 600, y: 566, w: 740, h: 74 }
};

/** Which German words should send a callout here. */
export const apothekeKeywords: Record<string, string[]> = {
  regal: ["regal", "medikament", "medikamente", "tablette", "tabletten", "packung", "schachtel"],
  rezept: ["rezept", "arzt", "verschreiben", "papier"],
  saft: ["saft", "hustensaft", "flasche", "husten", "tropfen", "medizin"],
  kreuz: ["apotheke", "kreuz", "notdienst"],
  tresen: ["tresen", "theke", "kasse", "zahlen"]
};

const A = apothekeAnchors;

export const Apotheke: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />

    {/* ------------------------------------------------------ anchor: kreuz */}
    {/* The green cross. It is the one thing that says "pharmacy" and nothing
        else, so it is drawn large and flat with no detail in it at all. */}
    <rect
      x={A.kreuz.x + A.kreuz.w * 0.34}
      y={A.kreuz.y}
      width={A.kreuz.w * 0.32}
      height={A.kreuz.h}
      rx={10}
      fill={c.kreuz}
    />
    <rect
      x={A.kreuz.x}
      y={A.kreuz.y + A.kreuz.h * 0.34}
      width={A.kreuz.w}
      height={A.kreuz.h * 0.32}
      rx={10}
      fill={c.kreuz}
    />
    <rect
      x={A.kreuz.x + A.kreuz.w * 0.34}
      y={A.kreuz.y + A.kreuz.h - 14}
      width={A.kreuz.w * 0.32}
      height={14}
      fill={c.kreuzDark}
      opacity={0.7}
    />

    {/* ------------------------------------------------------ anchor: regal */}
    {/* Four shelves of boxes. Medicine packaging at this size is a pale
        rectangle with one coloured band across it, and that is enough. */}
    <rect x={A.regal.x} y={A.regal.y} width={A.regal.w} height={A.regal.h} rx={5} fill={c.shelf} />
    {[0, 1, 2, 3].map((row) => (
      <React.Fragment key={row}>
        <rect
          x={A.regal.x}
          y={A.regal.y + 52 + row * 60}
          width={A.regal.w}
          height={9}
          fill={c.shelfEdge}
        />
        {Array.from({ length: 9 }, (_, i) => {
          const tint = [c.schachtel, c.schachtelAlt, c.schachtelAlt2][(row * 2 + i) % 3];
          return (
            <React.Fragment key={i}>
              <rect
                x={A.regal.x + 12 + i * 41}
                y={A.regal.y + 12 + row * 60}
                width={32}
                height={40}
                rx={3}
                fill={tint}
              />
              <rect
                x={A.regal.x + 12 + i * 41}
                y={A.regal.y + 28 + row * 60}
                width={32}
                height={7}
                fill={c.kreuz}
                opacity={0.55}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ))}

    {/* a second, narrower bay of shelves on the left, purely to stop the wall
        reading as empty — nothing points at it */}
    <rect x={196} y={236} width={190} height={196} rx={5} fill={c.shelf} />
    {[0, 1, 2].map((row) => (
      <React.Fragment key={`l${row}`}>
        <rect x={196} y={236 + 52 + row * 60} width={190} height={9} fill={c.shelfEdge} />
        {Array.from({ length: 4 }, (_, i) => (
          <rect
            key={i}
            x={196 + 12 + i * 43}
            y={236 + 12 + row * 60}
            width={34}
            height={40}
            rx={3}
            fill={[c.schachtelAlt, c.schachtel, c.schachtelAlt2][(row + i) % 3]}
          />
        ))}
      </React.Fragment>
    ))}

    {/* floor */}
    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />

    <Plant x={1856} y={HORIZON - 20} s={0.88} />

    {/* ----------------------------------------------------- anchor: tresen */}
    {/* Drawn after the floor and before the things lying on it. The front
        panel runs to the bottom of the frame so both figures are cut off at
        the waist and read as standing at a counter. */}
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

    {/* ----------------------------------------------------- anchor: rezept */}
    {/* A prescription slip. Line 1 is "Haben Sie ein Rezept?" and line 2 is
        "Nein" — it is drawn anyway, because the ring lands on the thing being
        asked about whether or not he has one. */}
    <rect x={A.rezept.x} y={A.rezept.y} width={A.rezept.w} height={A.rezept.h} rx={4} fill={c.papier} />
    <rect x={A.rezept.x + 12} y={A.rezept.y + 12} width={66} height={8} rx={4} fill={c.kreuz} opacity={0.8} />
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={A.rezept.x + 12}
        y={A.rezept.y + 30 + i * 13}
        width={A.rezept.w - 24 - (i % 2) * 36}
        height={6}
        rx={3}
        fill={c.papierInk}
        opacity={0.5}
      />
    ))}

    {/* ------------------------------------------------------- anchor: saft */}
    {/* The bottle: a dark body, a pale label, a cap. Three blocks. */}
    <rect x={A.saft.x + 30} y={A.saft.y} width={36} height={22} rx={5} fill={c.chrome} />
    <rect x={A.saft.x + 40} y={A.saft.y + 20} width={16} height={14} fill={c.flasche} />
    <rect x={A.saft.x + 8} y={A.saft.y + 32} width={80} height={68} rx={10} fill={c.flasche} />
    <rect x={A.saft.x + 18} y={A.saft.y + 50} width={60} height={34} rx={4} fill={c.papier} />
    <rect x={A.saft.x + 26} y={A.saft.y + 60} width={44} height={6} rx={3} fill={c.papierInk} opacity={0.6} />
    <rect x={A.saft.x + 26} y={A.saft.y + 72} width={28} height={6} rx={3} fill={c.papierInk} opacity={0.45} />
  </svg>
);
