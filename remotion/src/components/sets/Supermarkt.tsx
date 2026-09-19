/*
 * The shop. One aisle seen head-on, drawn flat.
 *
 * The set owns its anchors. A callout says "point at the kuehlregal" and the
 * ring lands on the same constant the fridge is drawn from, so it cannot drift
 * off the thing it is naming. The boxes used to be written out a second time
 * in the scene file, and the first time this set moved, the callouts stayed
 * behind.
 *
 * Shared parts come from ./kit — wall, floor, shelves, signs — so a new room
 * is assembled rather than drawn from nothing.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, Products, Shelf, Sign, Wall } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.shop;

/** Everything on this set a callout can point at. */
export const supermarktAnchors: Record<string, Anchor> = {
  kuehlregal: { x: 424, y: 330, w: 372, h: 268 },
  auslage: { x: 812, y: 536, w: 138, h: 104 },
  kasse: { x: 818, y: 168, w: 132, h: 62 }
};

/*
 * Which German words should send a callout here.
 *
 * scripts/new-scene.mjs matches the words of a dialogue against these to
 * propose callouts, so a new shop scene arrives with "die Milch" already
 * pointing at the fridge instead of with an empty list to fill in by hand.
 * Matching is case-insensitive and ignores punctuation.
 */
export const supermarktKeywords: Record<string, string[]> = {
  kuehlregal: ["milch", "hafermilch", "butter", "käse", "joghurt", "kühlregal", "sahne", "quark", "eis"],
  auslage: ["brot", "brötchen", "ei", "eier", "tomate", "tomaten", "obst", "gemüse",
            "salat", "apfel", "äpfel", "banane", "kuchen", "auslage"],
  kasse: ["kasse", "selbstbedienungskasse", "schlange", "bezahlen", "bon", "kassenbon", "kassiererin"]
};

const A = supermarktAnchors;

export const Supermarkt: React.FC = () => (
  <svg
    viewBox="0 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Floor x={0} palette={c} vanishAt={700} />

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

    {/* the aisle on the left, going back in two steps */}
    <Shelf x={-30} y={210} w={210} h={438} rows={4} per={5} seed={1} palette={c} />
    <rect x={172} y={230} width={16} height={418} fill={c.shelfDark} opacity={0.35} />
    <Shelf x={188} y={268} w={132} h={380} rows={4} per={4} seed={6} palette={c} />

    {/* --------------------------------------------------- anchor: kuehlregal */}
    <rect x={A.kuehlregal.x} y={A.kuehlregal.y} width={A.kuehlregal.w} height={A.kuehlregal.h} fill={c.chrome} />
    <rect
      x={A.kuehlregal.x + 10}
      y={A.kuehlregal.y + 10}
      width={A.kuehlregal.w - 20}
      height={A.kuehlregal.h - 20}
      fill={c.glass}
    />
    {[0, 1, 2, 3].map((col) => (
      <React.Fragment key={col}>
        <rect
          x={A.kuehlregal.x + 14 + col * 88}
          y={A.kuehlregal.y + 14}
          width={80}
          height={A.kuehlregal.h - 28}
          fill={c.glassDark}
          opacity={0.35}
        />
        {[0, 1, 2].map((row) => (
          <Products
            key={row}
            x={A.kuehlregal.x + 20 + col * 88}
            y={A.kuehlregal.y + 22 + row * 78}
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
    {/* The header band sits on the fridge rather than floating above it: above
        it, the callout ring collided with the lettering on every line that
        pointed here, and the arrow ran through it. */}
    <Sign x={500} y={344} w={220} h={40} text="KÜHLREGAL" palette={c} />

    {/* ------------------------------------------------------ anchor: auslage */}
    {/* Bread, eggs and tomatoes share one table, which is why three different
        lines send their callout to the same box. */}
    <rect x={A.auslage.x + 14} y={640} width={14} height={120} fill={c.woodDark} />
    <rect x={A.auslage.x + 110} y={640} width={14} height={120} fill={c.woodDark} />
    <rect x={A.auslage.x} y={624} width={A.auslage.w} height={18} rx={3} fill={c.wood} />
    <rect x={A.auslage.x} y={A.auslage.y} width={A.auslage.w} height={90} rx={6} fill={c.woodDark} opacity={0.22} />
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={A.auslage.x + 28 + i * 35} cy={608} rx={19} ry={12} fill={c.bread} />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={A.auslage.x + 20 + i * 30} cy={572} r={13} fill="#c4614f" />
    ))}
    <rect x={A.auslage.x + 6} y={A.auslage.y + 4} width={126} height={20} rx={4} fill="#e6e2d6" />

    {/* -------------------------------------------------------- anchor: kasse */}
    <Sign x={A.kasse.x} y={A.kasse.y} w={A.kasse.w} h={A.kasse.h} text="KASSE" drop={104} palette={c} />
  </svg>
);
