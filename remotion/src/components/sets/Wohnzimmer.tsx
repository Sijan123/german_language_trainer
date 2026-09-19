/*
 * The living room. The other half of home, for the dialogues that are not
 * about food.
 *
 * Authored for the right-hand room (viewBox from x=960), same as the kitchen,
 * because in practice the person at home is the one being phoned.
 *
 * It carries more anchors than the other sets and that is deliberate: the
 * everyday dialogues are the ones that name ordinary objects — the key, the
 * heating, the washing, the sofa — and a set with nothing to point at turns
 * every callout off.
 */

import React from "react";
import { theme } from "../../theme";
import { Floor, HORIZON, Picture, Plant, Wall, Window } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.living;

/** Everything on this set a callout can point at. */
export const wohnzimmerAnchors: Record<string, Anchor> = {
  sofa: { x: 1030, y: 452, w: 330, h: 196 },
  regal: { x: 1404, y: 268, w: 214, h: 232 },
  fenster: { x: 1660, y: 180, w: 226, h: 250 },
  heizung: { x: 1660, y: 470, w: 226, h: 116 },
  tisch: { x: 1108, y: 596, w: 190, h: 52 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const wohnzimmerKeywords: Record<string, string[]> = {
  sofa: ["sofa", "couch", "sitzen", "setz", "kissen", "decke", "fernsehen", "fernseher", "sessel"],
  regal: ["regal", "buch", "bücher", "schlüssel", "lampe", "foto", "bild", "vase", "schrank"],
  fenster: ["fenster", "wetter", "regnet", "regen", "sonne", "draußen", "schnee", "lüften", "balkon"],
  heizung: ["heizung", "warm", "kalt", "frier", "temperatur", "grad", "heizen", "thermostat"],
  tisch: ["tisch", "zeitung", "tasse", "kaffee", "tee", "post", "brief", "handy", "fernbedienung"]
};

const A = wohnzimmerAnchors;

export const Wohnzimmer: React.FC = () => (
  <svg
    viewBox="960 0 960 1080"
    width={960}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    <Wall x={960} palette={c} ceiling={116} />
    <Floor x={960} palette={c} vanishAt={1300} />
    {/* skirting, which is most of what says "this is a home and not an office" */}
    <rect x={960} y={HORIZON - 16} width={960} height={16} fill={c.skirting} />

    <Picture x={1046} y={228} w={150} h={116} tint={c.art} />
    <Picture x={1218} y={252} w={110} h={92} tint={c.artAlt} />

    {/* -------------------------------------------------------- anchor: regal */}
    <rect x={A.regal.x} y={A.regal.y} width={A.regal.w} height={A.regal.h} fill={c.wood} />
    <rect x={A.regal.x + 8} y={A.regal.y + 8} width={A.regal.w - 16} height={A.regal.h - 16} fill={c.woodDark} opacity={0.3} />
    {[0, 1, 2].map((r) => {
      const y = A.regal.y + 16 + r * 72;
      return (
        <React.Fragment key={r}>
          {/* books, leaning at the end of each row the way they do */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={A.regal.x + 20 + i * 30}
              y={y + 8 + ((i * 7 + r * 3) % 9)}
              width={20}
              height={46 - ((i * 7 + r * 3) % 9)}
              rx={2}
              fill={theme.set.products[(r * 5 + i * 3) % theme.set.products.length]}
            />
          ))}
          <rect x={A.regal.x + 8} y={y + 58} width={A.regal.w - 16} height={8} fill={c.wood} />
        </React.Fragment>
      );
    })}

    {/* ------------------------------------------------------ anchor: fenster */}
    <Window x={A.fenster.x} y={A.fenster.y} w={A.fenster.w} h={A.fenster.h} palette={c} frame={c.frame} />
    {/* a curtain down one side, so the window is dressed */}
    <path
      d={`M${A.fenster.x - 26} ${A.fenster.y - 14} h44 v${A.fenster.h + 40} q-22 10 -44 0 z`}
      fill={c.curtain}
    />

    {/* ------------------------------------------------------ anchor: heizung */}
    {/* A radiator under the window — where it is in every German flat, and the
        thing "Die Heizung wird nicht warm" is about. */}
    <rect x={A.heizung.x} y={A.heizung.y} width={A.heizung.w} height={A.heizung.h} rx={6} fill={c.radiator} />
    {Array.from({ length: 9 }, (_, i) => (
      <rect
        key={i}
        x={A.heizung.x + 10 + i * 24}
        y={A.heizung.y + 10}
        width={13}
        height={A.heizung.h - 20}
        rx={4}
        fill={c.radiatorDark}
        opacity={0.55}
      />
    ))}
    <circle cx={A.heizung.x - 6} cy={A.heizung.y + A.heizung.h - 24} r={13} fill={c.radiatorDark} />

    {/* --------------------------------------------------------- anchor: sofa */}
    <rect x={A.sofa.x} y={A.sofa.y + 58} width={A.sofa.w} height={A.sofa.h - 58} rx={16} fill={c.sofa} />
    <rect x={A.sofa.x + 6} y={A.sofa.y} width={A.sofa.w - 12} height={84} rx={16} fill={c.sofaDark} />
    {[0, 1].map((i) => (
      <rect
        key={i}
        x={A.sofa.x + 28 + i * 160}
        y={A.sofa.y + 26}
        width={116}
        height={72}
        rx={12}
        fill={c.cushion}
      />
    ))}
    <rect x={A.sofa.x - 16} y={A.sofa.y + 44} width={34} height={A.sofa.h - 44} rx={12} fill={c.sofaDark} />
    <rect x={A.sofa.x + A.sofa.w - 18} y={A.sofa.y + 44} width={34} height={A.sofa.h - 44} rx={12} fill={c.sofaDark} />

    {/* -------------------------------------------------------- anchor: tisch */}
    <rect x={A.tisch.x} y={A.tisch.y} width={A.tisch.w} height={16} rx={5} fill={c.wood} />
    <rect x={A.tisch.x + 16} y={A.tisch.y + 16} width={12} height={40} fill={c.woodDark} />
    <rect x={A.tisch.x + A.tisch.w - 28} y={A.tisch.y + 16} width={12} height={40} fill={c.woodDark} />
    {/* a mug and a folded newspaper on it */}
    <rect x={A.tisch.x + 30} y={A.tisch.y - 28} width={30} height={30} rx={5} fill="#e4ded0" />
    <path d={`M${A.tisch.x + 60} ${A.tisch.y - 20} a10 10 0 0 1 0 16`} fill="none" stroke="#e4ded0" strokeWidth={6} />
    <rect x={A.tisch.x + 96} y={A.tisch.y - 12} width={72} height={12} rx={3} fill="#ded8c8" />

    <Plant x={1876} y={HORIZON - 34} s={0.82} />
  </svg>
);
