/*
 * The bathroom, with the washing machine in it.
 *
 * c011 is the standing example in the handoff of a dialogue with nowhere to
 * point: "Die Waschmaschine ist voll" scaffolded onto the living room, which
 * has no washing machine, and reported one callout in twelve lines. This set
 * exists to fix that, and German flats put the machine in the bathroom often
 * enough that it is also where the dialogue says to hang the washing — "Dann
 * häng sie im Bad auf".
 *
 * Drawn for the LEFT half (viewBox from x=0). Left-capable sets are the scarce
 * ones: before this there were two, the bedroom and the supermarket, so every
 * two-room film at home had to be the bedroom. The machine and the airer sit
 * either side of the figure at x≈258, not behind it.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.bath;

/** Everything on this set a callout can point at. */
/*
 * Everything a callout can point at, and all of it right of x=410.
 *
 * The figure in this room stands at x≈258 and covers about 123-393 for the
 * whole film. The first cut put the washing machine at x=24-220 — "far left
 * and clear of the figure", which it is not: a third of it sat behind his
 * shoulder and the ring round "die Maschine" was clipped by his head. Same
 * mistake as the living-room radiator, and it is always the same mistake.
 *
 * The basin lost its anchor in the reshuffle. There is no room for a fifth
 * box in the clear band, c011 never points at it, and a keyword list that
 * can route a callout to a box nobody can see is worse than not having one.
 */
export const badAnchors: Record<string, Anchor> = {
  waschmaschine: { x: 430, y: 402, w: 196, h: 224 },
  waesche: { x: 652, y: 398, w: 290, h: 232 },
  spiegel: { x: 700, y: 168, w: 134, h: 164 },
  fenster: { x: 470, y: 150, w: 150, h: 186 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const badKeywords: Record<string, string[]> = {
  waschmaschine: ["waschmaschine", "maschine", "waschen", "wasche", "schleudern",
                  "waschmittel", "trommel", "fertig"],
  waesche: ["wäsche", "aufhängen", "häng", "ständer", "trocken", "trocknen",
            "hemd", "socken", "sachen", "handtuch"],
  spiegel: ["spiegel", "aussehen", "gesicht"],
  fenster: ["fenster", "draußen", "regnet", "regen", "lüften", "wetter"]
};

const A = badAnchors;

export const Bad: React.FC = () => (
  <svg
    viewBox="0 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} ceiling={120} />
    <Floor x={0} palette={c} vanishAt={340} />

    {/* Tiling to the dado, which is most of what says "bathroom" rather than
        "utility cupboard". Drawn as a grid of lines, not 60 rectangles. */}
    <rect x={0} y={330} width={960} height={HORIZON - 330} fill={c.tile} />
    {Array.from({ length: 13 }, (_, i) => (
      <line key={`v${i}`} x1={i * 76} y1={330} x2={i * 76} y2={HORIZON} stroke={c.tileLine} strokeWidth={3} />
    ))}
    {[330, 400, 470, 540, 610].map((y) => (
      <line key={`h${y}`} x1={0} y1={y} x2={960} y2={y} stroke={c.tileLine} strokeWidth={3} />
    ))}
    <rect x={0} y={322} width={960} height={10} fill={c.trim} />
    <rect x={0} y={HORIZON - 14} width={960} height={14} fill={c.trim} />

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.frame} />

    {/* ------------------------------------------------------ anchor: spiegel */}
    <rect x={A.spiegel.x} y={A.spiegel.y} width={A.spiegel.w} height={A.spiegel.h} rx={8} fill={c.frame} />
    <rect
      x={A.spiegel.x + 9}
      y={A.spiegel.y + 9}
      width={A.spiegel.w - 18}
      height={A.spiegel.h - 18}
      rx={5}
      fill={c.mirror}
    />
    {/* a diagonal glint, so the glass is not a grey hole */}
    <path
      d={`M${A.spiegel.x + 16} ${A.spiegel.y + A.spiegel.h - 30} l46 -${A.spiegel.h - 40} h26 l-46 ${A.spiegel.h - 40} z`}
      fill={c.mirrorGlint}
      opacity={0.6}
    />

    {/* The basin, decoration only — no anchor, so it is allowed to sit in the
        strip at the far left that the figure stands in front of. */}
    <rect x={30} y={404} width={150} height={34} rx={12} fill={c.porcelain} />
    <rect x={52} y={412} width={106} height={16} rx={8} fill={c.porcelainShade} />
    <rect x={84} y={438} width={42} height={58} fill={c.porcelain} />
    <rect x={92} y={370} width={11} height={38} rx={5} fill={c.chrome} />
    <path d="M97 370 q0 -18 22 -18" fill="none" stroke={c.chrome} strokeWidth={11} strokeLinecap="round" />

    {/* ------------------------------------------------ anchor: waschmaschine */}
    {/* Front loader, door open-ish and full — the line is "Ist die Maschine
        schon fertig?" so it has to look loaded, not idle. */}
    <rect x={A.waschmaschine.x} y={A.waschmaschine.y} width={A.waschmaschine.w} height={A.waschmaschine.h} rx={10} fill={c.machine} />
    <rect x={A.waschmaschine.x} y={A.waschmaschine.y} width={A.waschmaschine.w} height={46} rx={10} fill={c.machineDark} opacity={0.5} />
    {/* control dial and two buttons */}
    <circle cx={A.waschmaschine.x + 38} cy={A.waschmaschine.y + 23} r={13} fill={c.chrome} />
    <circle cx={A.waschmaschine.x + 38} cy={A.waschmaschine.y + 23} r={5} fill={c.machineDark} />
    {[0, 1].map((i) => (
      <circle key={i} cx={A.waschmaschine.x + 76 + i * 22} cy={A.waschmaschine.y + 23} r={6} fill={c.chrome} opacity={0.8} />
    ))}
    {/* the door */}
    <circle cx={A.waschmaschine.x + A.waschmaschine.w / 2} cy={A.waschmaschine.y + 132} r={62} fill={c.chrome} />
    <circle cx={A.waschmaschine.x + A.waschmaschine.w / 2} cy={A.waschmaschine.y + 132} r={50} fill={c.drum} />
    {/* laundry visible through the glass */}
    <path
      d={`M${A.waschmaschine.x + A.waschmaschine.w / 2 - 46} ${A.waschmaschine.y + 150}
          q24 -30 46 -6 q22 24 46 0 v32 h-92 z`}
      fill={c.linen}
      opacity={0.9}
    />
    <circle cx={A.waschmaschine.x + A.waschmaschine.w / 2 - 16} cy={A.waschmaschine.y + 140} r={13} fill={c.red} opacity={0.85} />

    {/* --------------------------------------------------------- anchor: waesche */}
    {/* A concertina airer with things on it. The X legs are what stop it
        reading as a radiator, which is what the first draft looked like. */}
    <path
      d={`M${A.waesche.x + 16} ${A.waesche.y + A.waesche.h} L${A.waesche.x + 74} ${A.waesche.y + 30}
          M${A.waesche.x + 74} ${A.waesche.y + A.waesche.h} L${A.waesche.x + 16} ${A.waesche.y + 30}
          M${A.waesche.x + A.waesche.w - 74} ${A.waesche.y + A.waesche.h} L${A.waesche.x + A.waesche.w - 16} ${A.waesche.y + 30}
          M${A.waesche.x + A.waesche.w - 16} ${A.waesche.y + A.waesche.h} L${A.waesche.x + A.waesche.w - 74} ${A.waesche.y + 30}`}
      stroke={c.chrome}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    {[0, 1, 2, 3].map((r) => (
      <line
        key={r}
        x1={A.waesche.x + 10}
        y1={A.waesche.y + 34 + r * 34}
        x2={A.waesche.x + A.waesche.w - 10}
        y2={A.waesche.y + 34 + r * 34}
        stroke={c.chrome}
        strokeWidth={5}
      />
    ))}
    {/* the washing itself: a shirt, a towel, and the two pink socks */}
    <path
      d={`M${A.waesche.x + 34} ${A.waesche.y + 36} h72 l-8 58 q-28 12 -56 0 z`}
      fill={c.linen}
    />
    <rect x={A.waesche.x + 128} y={A.waesche.y + 36} width={62} height={92} rx={5} fill={c.towel} />
    <rect x={A.waesche.x + 204} y={A.waesche.y + 70} width={30} height={54} rx={9} fill={c.pink} />
    <rect x={A.waesche.x + 240} y={A.waesche.y + 70} width={30} height={54} rx={9} fill={c.pink} />
    <path
      d={`M${A.waesche.x + 40} ${A.waesche.y + 138} h80 l-10 66 q-30 12 -60 0 z`}
      fill={c.red}
      opacity={0.85}
    />
  </svg>
);
