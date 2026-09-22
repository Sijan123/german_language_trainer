/*
 * A residential street with somewhere to park, drawn full frame.
 *
 * One set for three dialogues, which is why it carries a car, a sign and a
 * bicycle rather than just the one of them each film needs:
 *
 *   c029  a noise from the front right, and a call to the garage
 *   c030  a parking ticket under the wiper
 *   c031  buying a second-hand bike off someone's drive
 *
 * All three are two people standing outdoors beside a vehicle, which is the
 * same reason the bus stop, the platform and the Bürgerbüro are full frame:
 * the speakers are in one place and there is no second room to cut to.
 *
 * Outdoors, so the palette calls the sky `wall` and the tarmac `floor`, and
 * the horizon stays at y=648 like every other room — that is what lets `Wall`
 * and `Floor` from the kit draw a street at all.
 *
 * The cost of sharing it: the parking slip is under the wiper in all three
 * films, including c029 and c031 where nobody mentions it. A set is a
 * `React.FC` with no props, so there is no way to leave a prop out for one
 * film without giving every set a props type — and an unexplained slip of
 * paper on a parked car is a smaller wrong than three near-identical streets.
 * If sets ever take props, this is the first thing to reach for.
 *
 * `bremse` is the one anchor in this project whose box crosses the horizon:
 * its bottom is y=664, because the car stands on the road. That is fine. The
 * limit that matters is the top of the speech card at y≈738, not the horizon
 * — the horizon rule is about where scenery reads, the card is about what
 * gets covered up.
 *
 * Anchors avoid x 285-555 and 1365-1635, where the two figures stand.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall } from "./kit";
import type { Anchor } from "../../types";

/* `parkstrasse`, not `strasse` — the bus stop owns that palette. See theme.ts. */
const c = theme.set.parkstrasse;

/** Everything on this set a callout can point at. */
export const strasseAnchors: Record<string, Anchor> = {
  /* the bicycle, propped by the garage door, left band */
  fahrrad: { x: 58, y: 430, w: 214, h: 196 },
  /* the parked car, the wide centre band */
  auto: { x: 600, y: 396, w: 640, h: 272 },
  /*
   * The windscreen, with a slip of paper under the wiper. It is inside the
   * car's own box on purpose, the way the restaurant's plates sit inside its
   * table — c030 needs to ring the screen and c029 needs to ring the car, and
   * those are two different shots of the same object.
   */
  scheibe: { x: 722, y: 418, w: 170, h: 100 },
  /* the parking sign, right band */
  schild: { x: 1672, y: 208, w: 168, h: 226 },
  /*
   * The front brake, which is where c029's noise is coming from. Its box
   * bottom is at y=664, sixteen pixels below the horizon — which is correct,
   * because the car is standing on the road in front of the kerb, and the
   * limit that actually matters is the top of the speech card at y≈738 rather
   * than the horizon itself.
   */
  bremse: { x: 676, y: 556, w: 108, h: 108 }
};

/** Which German words should send a callout here. */
export const strasseKeywords: Record<string, string[]> = {
  fahrrad: ["fahrrad", "rad", "räder", "schloss", "sattel"],
  auto: ["auto", "wagen", "transporter", "motor", "fahren", "parken"],
  scheibe: ["scheibe", "windschutzscheibe", "zettel", "strafzettel", "parkschein", "wischer"],
  schild: ["schild", "schilder", "parkschein", "halten", "verbot"],
  bremse: ["bremse", "bremsen", "geräusch", "reifen", "vorne", "rad"]
};

const A = strasseAnchors;

export const Strasse: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* sky */}
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />

    {/* a terrace of houses along the back, with the garage the bike leans on */}
    <rect x={0} y={300} width={430} height={HORIZON - 300} fill={c.haus} />
    <path d="M-10 300 L215 196 L440 300 z" fill={c.dach} />
    <rect x={40} y={368} width={300} height={HORIZON - 368} rx={6} fill={c.tor} />
    {Array.from({ length: 5 }, (_, i) => (
      <line key={i} x1={40} y1={392 + i * 46} x2={340} y2={392 + i * 46} stroke={c.torDark} strokeWidth={4} />
    ))}

    <rect x={470} y={340} width={520} height={HORIZON - 340} fill={c.hausDark} />
    <path d="M460 340 L730 232 L1000 340 z" fill={c.dach} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={520 + i * 150} y={392} width={92} height={110} rx={5} fill={c.glas} />
    ))}

    <rect x={1030} y={318} width={560} height={HORIZON - 318} fill={c.haus} />
    <path d="M1020 318 L1310 214 L1600 318 z" fill={c.dach} />
    {[0, 1, 2].map((i) => (
      <rect key={`w${i}`} x={1080 + i * 170} y={376} width={100} height={116} rx={5} fill={c.glas} />
    ))}

    {/* a tree between the houses and the sign, well right of the figures */}
    <rect x={1612} y={470} width={26} height={HORIZON - 470} fill="#8d7f6e" />
    <circle cx={1625} cy={442} r={64} fill={c.baum} />
    <circle cx={1585} cy={472} r={44} fill={c.baum} />
    <circle cx={1668} cy={476} r={46} fill={c.baum} />

    {/* ----------------------------------------------------- anchor: schild */}
    {/* A blue parking sign on a post, with a supplementary plate under it.
        c030 turns on "nur mit Parkschein, steht auf dem Schild", so the two
        plates have to be visibly two plates. */}
    <rect x={A.schild.x + A.schild.w / 2 - 7} y={A.schild.y + 120} width={14} height={HORIZON - A.schild.y - 120} fill={c.chrome} />
    <rect x={A.schild.x} y={A.schild.y} width={A.schild.w} height={124} rx={8} fill={c.schild} />
    <rect x={A.schild.x + 14} y={A.schild.y + 14} width={A.schild.w - 28} height={96} rx={5} fill="none" stroke={c.schildInk} strokeWidth={6} />
    <text
      x={A.schild.x + A.schild.w / 2}
      y={A.schild.y + 64}
      fill={c.schildInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={58}
      textAnchor="middle"
      dominantBaseline="central"
    >
      P
    </text>
    <rect x={A.schild.x + 18} y={A.schild.y + 134} width={A.schild.w - 36} height={62} rx={5} fill={c.zettel} />
    {[0, 1].map((i) => (
      <rect key={i} x={A.schild.x + 32} y={A.schild.y + 150 + i * 18} width={A.schild.w - 64 - i * 30} height={8} rx={4} fill={c.zettelInk} opacity={0.6} />
    ))}

    {/* road */}
    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />
    {/* a kerb line, so the tarmac is a road and not just a grey floor */}
    <rect x={0} y={HORIZON} width={1920} height={10} fill={c.floorLine} />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={40 + i * 330} y={880} width={180} height={12} rx={5} fill={c.zettel} opacity={0.55} />
    ))}

    {/* ---------------------------------------------------- anchor: fahrrad */}
    {/* Propped against the garage door. Two wheels and a frame — the same
        drawing as the thought icon, at three times the size. */}
    <g fill="none" stroke={c.rad} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={A.fahrrad.x + 52} cy={A.fahrrad.y + 132} r={52} />
      <circle cx={A.fahrrad.x + 166} cy={A.fahrrad.y + 132} r={52} />
      <path d={`M${A.fahrrad.x + 52} ${A.fahrrad.y + 132} L${A.fahrrad.x + 98} ${A.fahrrad.y + 46} h38 L${A.fahrrad.x + 166} ${A.fahrrad.y + 132}`} />
      <path d={`M${A.fahrrad.x + 98} ${A.fahrrad.y + 46} L${A.fahrrad.x + 130} ${A.fahrrad.y + 132} H${A.fahrrad.x + 52}`} />
      <path d={`M${A.fahrrad.x + 84} ${A.fahrrad.y + 28} h34`} />
      <path d={`M${A.fahrrad.x + 140} ${A.fahrrad.y + 34} h30`} />
    </g>

    {/* ------------------------------------------------------- anchor: auto */}
    {/* A car from the side, facing left. The bonnet is at the left end, which
        is why the front wheel — c029's "vorne rechts" — is the left one. */}
    <path
      d={`M${A.auto.x + 20} ${A.auto.y + 150}
          L${A.auto.x + 96} ${A.auto.y + 40}
          a24 24 0 0 1 20 -12
          h300
          a24 24 0 0 1 20 12
          L${A.auto.x + 620} ${A.auto.y + 150} z`}
      fill={c.auto}
    />
    <rect x={A.auto.x} y={A.auto.y + 140} width={A.auto.w - 30} height={96} rx={26} fill={c.autoDark} />
    {/* windscreen and side glass */}
    <path
      d={`M${A.auto.x + 122} ${A.auto.y + 140} L${A.auto.x + 182} ${A.auto.y + 44} h108 v96 z`}
      fill={c.glas}
    />
    <path
      d={`M${A.auto.x + 310} ${A.auto.y + 140} v-96 h96 L${A.auto.x + 470} ${A.auto.y + 140} z`}
      fill={c.glas}
    />
    {/* wheels */}
    <circle cx={A.auto.x + 130} cy={A.auto.y + 234} r={54} fill={c.reifen} />
    <circle cx={A.auto.x + 130} cy={A.auto.y + 234} r={24} fill={c.chrome} />
    <circle cx={A.auto.x + 466} cy={A.auto.y + 234} r={54} fill={c.reifen} />
    <circle cx={A.auto.x + 466} cy={A.auto.y + 234} r={24} fill={c.chrome} />
    {/* headlight and door line */}
    <rect x={A.auto.x + 6} y={A.auto.y + 158} width={38} height={26} rx={9} fill="#f2efe6" opacity={0.9} />
    <line x1={A.auto.x + 300} y1={A.auto.y + 44} x2={A.auto.x + 300} y2={A.auto.y + 200} stroke={c.autoDark} strokeWidth={4} />

    {/* ---------------------------------------------------- anchor: scheibe */}
    {/* The slip of paper under the wiper. It sits on the windscreen, tilted,
        because a rectangle lying flat on the glass read as a sticker. */}
    <line
      x1={A.scheibe.x + 10}
      y1={A.scheibe.y + 88}
      x2={A.scheibe.x + 140}
      y2={A.scheibe.y + 26}
      stroke={c.reifen}
      strokeWidth={7}
      strokeLinecap="round"
    />
    <g transform={`rotate(-14, ${A.scheibe.x + 88}, ${A.scheibe.y + 50})`}>
      <rect x={A.scheibe.x + 46} y={A.scheibe.y + 18} width={88} height={64} rx={5} fill={c.zettel} stroke={c.zettelInk} strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={A.scheibe.x + 58}
          y={A.scheibe.y + 32 + i * 14}
          width={64 - i * 16}
          height={7}
          rx={3}
          fill={c.zettelInk}
          opacity={0.6}
        />
      ))}
    </g>

    {/* ----------------------------------------------------- anchor: bremse */}
    {/* A ring of brake disc behind the front wheel's spokes. It is what c029
        is about and it has to be findable at 720p, so it is drawn as a plain
        light annulus rather than as a caliper. */}
    <circle
      cx={A.bremse.x + A.bremse.w / 2}
      cy={A.bremse.y + A.bremse.h / 2}
      r={34}
      fill="none"
      stroke={c.chrome}
      strokeWidth={12}
      opacity={0.95}
    />
  </svg>
);
