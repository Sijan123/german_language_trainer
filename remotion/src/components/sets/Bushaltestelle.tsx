/*
 * A bus stop, and the first set that is outdoors.
 *
 * c007 is two strangers at a kerb — "Entschuldigung, fährt dieser Bus zum
 * Bahnhof?" — so it fills the frame like the restaurant does, with no seam
 * and no handsets. What the restaurant's table does for seating, the kerb
 * does here: both figures stand on the same pavement, which is why the road
 * is drawn behind them rather than under them.
 *
 * The figures stand at x≈420 and x≈1500 and cover roughly 285-555 and
 * 1365-1635 for the whole film, so every anchor lives in one of the three
 * bands between and beside them. That is a lesson from the living room,
 * which was drawn with its radiator exactly where a person stands.
 */

import React from "react";
import { theme } from "../../theme";
import { HORIZON, Sign } from "./kit";
import type { Anchor } from "../../types";

const c = theme.set.strasse;

/** Everything on this set a callout can point at. */
export const bushaltestelleAnchors: Record<string, Anchor> = {
  /* the crossing and the pavement it lands on, left band */
  strasse: { x: 62, y: 430, w: 218, h: 168 },
  /* the bus itself, centre band */
  bus: { x: 600, y: 292, w: 420, h: 308 },
  /* the H-plate on its pole */
  haltestelle: { x: 1078, y: 248, w: 124, h: 182 },
  /* the timetable case in the shelter */
  fahrplan: { x: 1228, y: 300, w: 124, h: 164 },
  /* ticket machine, right band */
  automat: { x: 1662, y: 376, w: 158, h: 224 }
};

/** Which German words should send a callout here. See Supermarkt for why. */
export const bushaltestelleKeywords: Record<string, string[]> = {
  bus: ["bus", "fährt", "fahren", "linie", "vier", "sieben", "kommt", "nehmen"],
  haltestelle: ["haltestelle", "hält", "halt", "stelle", "einsteigen", "aussteigen"],
  fahrplan: ["fahrplan", "plan", "minuten", "dauert", "fahrt", "abfahrt", "uhrzeit"],
  automat: ["fahrkarte", "karte", "ticket", "automat", "schein", "geld", "app",
            "fahrer", "kaufe", "kaufen", "bezahlen"],
  strasse: ["straßenseite", "straße", "seite", "richtung", "gegenüber", "drüben"]
};

const A = bushaltestelleAnchors;

/*
 * Where the far side of the street stands. The houses sit on the far
 * pavement, not on the horizon — the horizon here is our own kerb, 200px
 * nearer the camera, and building to it put every roof under the tarmac.
 */
const FAR_BASE = 436;

/** A house across the road. Roofline only — it is scenery, never a target. */
const Haus: React.FC<{ x: number; w: number; h: number; tone?: boolean }> = ({
  x, w, h, tone
}) => (
  <>
    <rect x={x} y={FAR_BASE - h} width={w} height={h} fill={tone ? c.hausDark : c.haus} />
    <polygon
      points={`${x - 14},${FAR_BASE - h} ${x + w / 2},${FAR_BASE - h - 54} ${x + w + 14},${FAR_BASE - h}`}
      fill={c.dach}
    />
    {Array.from({ length: Math.floor(w / 64) }, (_, i) => (
      <rect
        key={i}
        x={x + 22 + i * 64}
        y={FAR_BASE - h + 40}
        width={34}
        height={44}
        rx={3}
        fill={c.glass}
        opacity={0.8}
      />
    ))}
  </>
);

export const Bushaltestelle: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ display: "block" }}
    shapeRendering="geometricPrecision"
  >
    {/* sky, then the far side of the street, then the road, then our kerb */}
    <rect x={0} y={0} width={1920} height={HORIZON} fill={c.wall} />
    <rect x={0} y={0} width={1920} height={150} fill={c.wallDark} />
    <circle cx={1540} cy={96} r={40} fill="#f2e6c8" opacity={0.8} />

    <Haus x={-40} w={300} h={214} />
    <Haus x={286} w={252} h={178} tone />
    <Haus x={1120} w={268} h={196} tone />
    <Haus x={1420} w={300} h={228} />
    <Haus x={1748} w={240} h={170} tone />

    {/*
     * Depth, in the order it has to be painted: the far pavement, then the
     * road over the bottom of it, then the crossing stripes on top of the
     * road. The first cut drew the pavement first and the full-width road
     * after it, which simply buried the anchor — a ring for "die andere
     * Straßenseite" round a rectangle of tarmac.
     */}
    <rect x={0} y={436} width={1920} height={68} fill={c.kerb} />
    <rect x={0} y={436} width={1920} height={12} fill={c.roadLine} opacity={0.5} />

    {/* the road surface, from the far kerb down to ours */}
    <rect x={0} y={504} width={1920} height={HORIZON - 18 - 504} fill={c.road} />
    {Array.from({ length: 13 }, (_, i) => (
      <rect key={i} x={40 + i * 150} y={570} width={86} height={9} rx={4} fill={c.roadLine} opacity={0.85} />
    ))}

    {/* ------------------------------------------------------ anchor: strasse */}
    {/* The crossing, and the pavement it lands on. Drawn last of the three so
        nothing covers it, and wide enough to survive a ring at 720p. */}
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={A.strasse.x + 14 + i * 52}
        y={A.strasse.y + 74}
        width={32}
        height={A.strasse.h - 86}
        rx={2}
        fill={c.roadLine}
        opacity={0.9}
      />
    ))}
    <rect x={A.strasse.x} y={A.strasse.y} width={A.strasse.w} height={62} fill={c.kerb} />
    <rect x={A.strasse.x} y={A.strasse.y + 56} width={A.strasse.w} height={10} fill={c.floorLine} opacity={0.8} />

    {/* ---------------------------------------------------------- anchor: bus */}
    {/* Side-on, because a bus coming towards you is a rectangle with a face on
        it and reads as nothing at all at this size. */}
    <rect x={A.bus.x} y={A.bus.y} width={A.bus.w} height={A.bus.h} rx={26} fill={c.bus} />
    <rect x={A.bus.x} y={A.bus.y + 20} width={A.bus.w} height={54} rx={14} fill={c.busDark} opacity={0.45} />
    {/* destination blind: the film is about which bus goes where */}
    <rect x={A.bus.x + 28} y={A.bus.y + 26} width={188} height={42} rx={5} fill={c.sign} />
    <text
      x={A.bus.x + 122}
      y={A.bus.y + 47}
      fill={c.signInk}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={24}
      letterSpacing={1}
      textAnchor="middle"
      dominantBaseline="central"
    >
      4 STADT
    </text>
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={A.bus.x + 34 + i * 124}
        y={A.bus.y + 96}
        width={100}
        height={92}
        rx={7}
        fill={c.busGlass}
      />
    ))}
    {/* doors, in the darker body colour so they read as a gap not a window */}
    <rect x={A.bus.x + 300} y={A.bus.y + 96} width={86} height={164} rx={7} fill={c.busDark} />
    <line
      x1={A.bus.x + 343}
      y1={A.bus.y + 96}
      x2={A.bus.x + 343}
      y2={A.bus.y + 260}
      stroke={c.busGlass}
      strokeWidth={3}
      opacity={0.6}
    />
    <circle cx={A.bus.x + 96} cy={A.bus.y + A.bus.h - 6} r={38} fill="#3c3b38" />
    <circle cx={A.bus.x + 96} cy={A.bus.y + A.bus.h - 6} r={16} fill={c.chrome} />
    <circle cx={A.bus.x + 330} cy={A.bus.y + A.bus.h - 6} r={38} fill="#3c3b38" />
    <circle cx={A.bus.x + 330} cy={A.bus.y + A.bus.h - 6} r={16} fill={c.chrome} />

    {/* our kerb */}
    <rect x={0} y={HORIZON - 18} width={1920} height={18} fill={c.kerb} />
    <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} fill={c.floor} />
    {Array.from({ length: 8 }, (_, i) => (
      <line
        key={i}
        x1={i * 274}
        y1={1080}
        x2={860 + (i * 274 - 860) * 0.14}
        y2={HORIZON}
        stroke={c.floorLine}
        strokeWidth={3}
      />
    ))}
    {[712, 806, 906, 1010].map((y) => (
      <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={c.floorLine} strokeWidth={3} />
    ))}

    {/* the shelter, behind the stop sign and the timetable */}
    <rect x={1040} y={214} width={388} height={16} rx={6} fill={c.shelter} />
    <rect x={1046} y={230} width={376} height={286} fill={c.glass} opacity={0.5} />
    <rect x={1040} y={230} width={12} height={418} fill={c.shelterDark} />
    <rect x={1416} y={230} width={12} height={418} fill={c.shelterDark} />

    {/* A bench inside the shelter. Not an anchor — c007 never mentions it —
        but an empty glass box behind two people waiting looked like a bus
        stop nobody had finished building. A bin drawn beside it at x=1440
        was deleted: that is inside the right-hand figure's 1365-1635 band,
        so all it did was put half an object behind her elbow. */}
    <rect x={1064} y={498} width={330} height={16} rx={6} fill={c.shelterDark} />
    <rect x={1064} y={520} width={330} height={12} rx={5} fill={c.shelter} />
    {[1088, 1360].map((bx) => (
      <rect key={bx} x={bx} y={532} width={13} height={100} fill={c.shelterDark} />
    ))}

    {/* -------------------------------------------------- anchor: haltestelle */}
    {/* The German bus-stop H on a pole. Big and plain on purpose — rule 4:
        a ring at 720p round something fiddly reads as a smudge. */}
    <rect x={A.haltestelle.x + A.haltestelle.w / 2 - 6} y={A.haltestelle.y} width={12} height={434} fill={c.chrome} />
    <rect
      x={A.haltestelle.x}
      y={A.haltestelle.y}
      width={A.haltestelle.w}
      height={124}
      rx={10}
      fill={c.signInk}
      stroke={c.sign}
      strokeWidth={7}
    />
    <text
      x={A.haltestelle.x + A.haltestelle.w / 2}
      y={A.haltestelle.y + 64}
      fill={c.sign}
      fontFamily={theme.font.body}
      fontWeight={700}
      fontSize={74}
      textAnchor="middle"
      dominantBaseline="central"
    >
      H
    </text>

    {/* ----------------------------------------------------- anchor: fahrplan */}
    <rect
      x={A.fahrplan.x}
      y={A.fahrplan.y}
      width={A.fahrplan.w}
      height={A.fahrplan.h}
      rx={5}
      fill={c.plan}
      stroke={c.shelterDark}
      strokeWidth={5}
    />
    <rect x={A.fahrplan.x + 14} y={A.fahrplan.y + 16} width={A.fahrplan.w - 28} height={9} rx={4} fill={c.sign} />
    {Array.from({ length: 7 }, (_, i) => (
      <React.Fragment key={i}>
        <rect
          x={A.fahrplan.x + 14}
          y={A.fahrplan.y + 38 + i * 16}
          width={22}
          height={7}
          rx={3}
          fill={c.planInk}
        />
        <rect
          x={A.fahrplan.x + 44}
          y={A.fahrplan.y + 38 + i * 16}
          width={A.fahrplan.w - 58}
          height={7}
          rx={3}
          fill={c.planInk}
          opacity={0.55}
        />
      </React.Fragment>
    ))}

    {/* ------------------------------------------------------ anchor: automat */}
    {/* The ticket machine, which is where "Direkt beim Fahrer oder mit der App"
        lands — the alternative to it, so it has to be visible to be refused. */}
    <rect
      x={A.automat.x}
      y={A.automat.y}
      width={A.automat.w}
      height={A.automat.h}
      rx={12}
      fill={c.automat}
    />
    <rect x={A.automat.x + 16} y={A.automat.y + 20} width={A.automat.w - 32} height={78} rx={6} fill={c.plan} />
    <rect x={A.automat.x + 28} y={A.automat.y + 36} width={62} height={8} rx={4} fill={c.planInk} />
    <rect x={A.automat.x + 28} y={A.automat.y + 54} width={94} height={8} rx={4} fill={c.planInk} opacity={0.6} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((k) => (
        <rect
          key={`${r}-${k}`}
          x={A.automat.x + 26 + k * 38}
          y={A.automat.y + 118 + r * 30}
          width={28}
          height={20}
          rx={4}
          fill={c.automatDark}
        />
      ))
    )}
    <rect x={A.automat.x + 26} y={A.automat.y + A.automat.h - 30} width={A.automat.w - 52} height={14} rx={6} fill={c.automatDark} />
    <rect x={A.automat.x + A.automat.w / 2 - 7} y={A.automat.y + A.automat.h} width={14} height={HORIZON - A.automat.y - A.automat.h} fill={c.chrome} />

    <Sign x={1444} y={96} w={196} h={52} text="LINIE 4 · 7" drop={96} palette={c} />
  </svg>
);
