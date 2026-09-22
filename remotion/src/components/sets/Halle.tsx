/*
 * A sports hall, drawn full frame.
 *
 * c036 is someone asking to join in at a club training session, and topic
 * "freizeit" had put it in a living room. It is a conversation between two
 * people standing on a court, so this is the court: a wooden floor with lines
 * painted on it, a goal at the back, a bench with a pair of indoor shoes on
 * it, and the training times pinned to the wall.
 *
 * The painted floor lines are the one place in this project where something
 * below the horizon matters, and they are scenery rather than an anchor.
 *
 * Anchors avoid x 285-555 and 1365-1635. Everything pointable is above y=648.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Floor, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.halle;

/** Everything on this set a callout can point at. */
export const halleAnchors: Record<string, Anchor> = {
  /* the training times pinned to the wall, left band */
  schild: { x: 78, y: 198, w: 196, h: 186 },
  /* the goal at the back of the court */
  tor: { x: 620, y: 372, w: 380, h: 250 },
  /* a ball sitting on the floor in front of it */
  ball: { x: 1086, y: 542, w: 98, h: 98 },
  /* the bench, right band */
  bank: { x: 1652, y: 466, w: 234, h: 176 },
  /* the indoor shoes on it, which is what line 9 is about */
  schuhe: { x: 1686, y: 484, w: 136, h: 62 }
};

/** Which German words should send a callout here. */
export const halleKeywords: Record<string, string[]> = {
  schild: ["plan", "training", "dienstag", "donnerstag", "zeit", "zeiten"],
  tor: ["tor", "halle", "spielen", "mitspielen", "spiel"],
  ball: ["ball", "spielen", "mitspielen", "probetraining"],
  bank: ["bank", "umkleide", "sitzen"],
  schuhe: ["schuhe", "hallenschuhe", "turnschuhe"]
};

const A = halleAnchors;

export const Halle: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={0} palette={c} />
    <Wall x={960} palette={c} />

    {/* high windows along the back wall, which is what a hall has instead of
        a view */}
    <Window x={1084} y={150} w={250} h={150} palette={c} frame={c.chrome} />
    <Window x={352} y={150} w={250} h={150} palette={c} frame={c.chrome} />

    {/* ----------------------------------------------------- anchor: schild */}
    {/* The training times. A red header and rows of two columns — days and
        hours — which is what line 3 answers. */}
    <rect x={A.schild.x} y={A.schild.y} width={A.schild.w} height={A.schild.h} rx={8} fill={c.netz} />
    <rect x={A.schild.x} y={A.schild.y} width={A.schild.w} height={36} rx={8} fill={c.linie} />
    <rect x={A.schild.x} y={A.schild.y + 22} width={A.schild.w} height={14} fill={c.linie} />
    {[0, 1, 2, 3].map((i) => (
      <React.Fragment key={i}>
        <rect x={A.schild.x + 16} y={A.schild.y + 56 + i * 32} width={82} height={12} rx={5} fill={c.ballInk} opacity={0.5} />
        <rect x={A.schild.x + 112} y={A.schild.y + 56 + i * 32} width={62} height={12} rx={5} fill={c.linieAlt} opacity={0.6} />
      </React.Fragment>
    ))}

    {/* floor */}
    <Floor x={0} palette={c} vanishAt={860} />
    <Floor x={960} palette={c} vanishAt={1060} />

    {/* the painted court lines. Scenery, not an anchor — but they are what
        turns a wooden floor into a hall. */}
    <path d="M40 1060 L720 664 H1200 L1880 1060" fill="none" stroke={c.linie} strokeWidth={7} opacity={0.8} />
    <path d="M330 900 L810 690 H1110 L1590 900" fill="none" stroke={c.linieAlt} strokeWidth={6} opacity={0.65} />
    <line x1={0} y1={1012} x2={1920} y2={1012} stroke={c.linie} strokeWidth={7} opacity={0.6} />

    {/* -------------------------------------------------------- anchor: tor */}
    {/* A handball goal seen straight on: two posts, a crossbar and a net. */}
    <rect x={A.tor.x} y={A.tor.y} width={A.tor.w} height={A.tor.h} fill={c.netz} opacity={0.14} />
    {Array.from({ length: 9 }, (_, i) => (
      <line
        key={`v${i}`}
        x1={A.tor.x + 18 + i * 44}
        y1={A.tor.y + 16}
        x2={A.tor.x + 18 + i * 44}
        y2={A.tor.y + A.tor.h - 8}
        stroke={c.netz}
        strokeWidth={3}
        opacity={0.75}
      />
    ))}
    {Array.from({ length: 5 }, (_, i) => (
      <line
        key={`h${i}`}
        x1={A.tor.x + 12}
        y1={A.tor.y + 46 + i * 46}
        x2={A.tor.x + A.tor.w - 12}
        y2={A.tor.y + 46 + i * 46}
        stroke={c.netz}
        strokeWidth={3}
        opacity={0.75}
      />
    ))}
    <rect x={A.tor.x} y={A.tor.y} width={A.tor.w} height={16} rx={6} fill={c.tor} />
    <rect x={A.tor.x} y={A.tor.y} width={16} height={A.tor.h} rx={6} fill={c.tor} />
    <rect x={A.tor.x + A.tor.w - 16} y={A.tor.y} width={16} height={A.tor.h} rx={6} fill={c.tor} />
    <rect x={A.tor.x} y={A.tor.y + A.tor.h - 14} width={A.tor.w} height={14} fill={c.torDark} opacity={0.55} />

    {/* ------------------------------------------------------- anchor: ball */}
    <circle cx={A.ball.x + A.ball.w / 2} cy={A.ball.y + A.ball.h / 2} r={A.ball.w / 2} fill={c.ball} stroke={c.ballInk} strokeWidth={4} />
    <path
      d={`M${A.ball.x + A.ball.w / 2} ${A.ball.y + 8}
          L${A.ball.x + A.ball.w - 12} ${A.ball.y + 42}
          L${A.ball.x + A.ball.w - 26} ${A.ball.y + 84}
          h-46
          L${A.ball.x + 12} ${A.ball.y + 42} z`}
      fill={c.ballInk}
    />

    {/* ------------------------------------------------------- anchor: bank */}
    <rect x={A.bank.x} y={A.bank.y + 62} width={A.bank.w} height={22} rx={7} fill={c.bank} />
    <rect x={A.bank.x + 16} y={A.bank.y + 84} width={16} height={72} fill={c.bankDark} />
    <rect x={A.bank.x + A.bank.w - 32} y={A.bank.y + 84} width={16} height={72} fill={c.bankDark} />

    {/* ----------------------------------------------------- anchor: schuhe */}
    {/* A pair of trainers on the bench. Two rounded wedges with a pale sole
        is the whole of it at this size. */}
    {[0, 1].map((i) => (
      <React.Fragment key={i}>
        <path
          d={`M${A.schuhe.x + 4 + i * 70} ${A.schuhe.y + 44}
              v-20
              a14 14 0 0 1 14 -14
              h10
              l32 24
              h6
              a8 8 0 0 1 0 16
              z`}
          fill={c.linieAlt}
        />
        <rect x={A.schuhe.x + 4 + i * 70} y={A.schuhe.y + 44} width={62} height={10} rx={5} fill={c.netz} />
      </React.Fragment>
    ))}
  </svg>
);
