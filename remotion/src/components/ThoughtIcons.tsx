/*
 * The things a thought bubble can contain.
 *
 * Each icon is drawn inside roughly a 150x120 box centred on the origin, flat
 * and in the same palette as the sets, so a thought looks like it belongs to
 * the same film rather than like clip art dropped on top of it.
 *
 * They are drawn large and plain on purpose. A thought bubble is about 330px
 * wide in a 1920 frame, and the finished video is transcoded to 720p — an
 * icon with any fine detail in it turns to mush at that size. Same rule as
 * the sets: if it needs a thin line to be recognisable, it is the wrong
 * drawing.
 */

import React from "react";

export type ThoughtName =
  | "schreibtisch"
  | "chef"
  | "kantine"
  | "bus"
  | "besprechung"
  | "gebaeude"
  | "paket"
  | "briefkasten"
  | "tonne"
  | "geld"
  | "ausweis";

const c = {
  wood: "#b98a54",
  woodDark: "#95663a",
  metal: "#9aa2a8",
  metalDark: "#7f878d",
  screen: "#2b3440",
  screenLit: "#7fabc6",
  skin: "#c98f63",
  skinDark: "#a9744f",
  shirt: "#4d7aa0",
  shirtAlt: "#9c5068",
  tie: "#b8474a",
  plate: "#f2efe6",
  food: "#d99a4e",
  greens: "#7faa78",
  bus: "#c8523f",
  busDark: "#a8422f",
  glass: "#cfe2ec",
  wall: "#d8d3c6",
  wallDark: "#bfb8a8"
};

/** A desk with a monitor on it. */
const Schreibtisch: React.FC = () => (
  <g>
    <rect x={-66} y={-52} width={104} height={68} rx={7} fill={c.screen} />
    <rect x={-58} y={-44} width={88} height={48} rx={4} fill={c.screenLit} />
    <rect x={-22} y={16} width={16} height={16} fill={c.metalDark} />
    <rect x={-44} y={30} width={60} height={9} rx={4} fill={c.metalDark} />
    <rect x={-80} y={40} width={160} height={14} rx={5} fill={c.wood} />
    <rect x={-72} y={54} width={13} height={44} fill={c.woodDark} />
    <rect x={59} y={54} width={13} height={44} fill={c.woodDark} />
    {/* a mug, because an empty desk reads as furniture rather than a job */}
    <rect x={44} y={16} width={26} height={24} rx={4} fill={c.plate} />
    <path d="M70 22 a9 9 0 0 1 0 12" fill="none" stroke={c.plate} strokeWidth={5} />
  </g>
);

/** A person in a shirt and tie. */
const Chef: React.FC = () => (
  <g>
    <circle cx={0} cy={-38} r={34} fill={c.skin} />
    <path d="M-34 -46 a34 34 0 0 1 68 0 q-34 -22 -68 0 z" fill="#3a2f28" />
    <circle cx={-12} cy={-40} r={4.5} fill="#242c38" />
    <circle cx={12} cy={-40} r={4.5} fill="#242c38" />
    <path d="M-11 -24 q11 9 22 0" fill="none" stroke={c.skinDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M0 4 c-44 0 -62 26 -66 64 h132 c-4 -38 -22 -64 -66 -64 z" fill={c.shirt} />
    {/* collar and tie */}
    <path d="M-22 4 l22 22 l22 -22 l-10 -6 l-12 12 l-12 -12 z" fill={c.plate} />
    <path d="M0 26 l11 12 l-6 30 h-10 l-6 -30 z" fill={c.tie} />
  </g>
);

/** A canteen tray: plate, veg, and a drink. */
const Kantine: React.FC = () => (
  <g>
    <rect x={-84} y={22} width={168} height={22} rx={9} fill={c.metal} />
    <rect x={-84} y={22} width={168} height={8} rx={4} fill={c.metalDark} opacity={0.5} />
    <ellipse cx={-30} cy={2} rx={50} ry={24} fill={c.plate} />
    <ellipse cx={-30} cy={-2} rx={38} ry={17} fill={c.food} />
    <circle cx={-44} cy={-4} r={9} fill={c.greens} />
    <circle cx={-20} cy={-8} r={8} fill={c.greens} opacity={0.8} />
    <rect x={38} y={-34} width={38} height={54} rx={6} fill={c.glass} />
    <rect x={38} y={-34} width={38} height={12} rx={6} fill={c.screenLit} opacity={0.7} />
    {/* cutlery */}
    <rect x={-88} y={-26} width={7} height={44} rx={3} fill={c.metalDark} />
  </g>
);

/** A bus, side on. */
const Bus: React.FC = () => (
  <g>
    <rect x={-84} y={-44} width={168} height={92} rx={16} fill={c.bus} />
    <rect x={-84} y={-34} width={168} height={18} rx={7} fill={c.busDark} opacity={0.5} />
    <rect x={-72} y={-38} width={62} height={16} rx={4} fill={c.screen} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-72 + i * 42} y={-10} width={32} height={28} rx={5} fill={c.glass} />
    ))}
    <rect x={54} y={-10} width={24} height={46} rx={5} fill={c.busDark} />
    <circle cx={-48} cy={50} r={16} fill="#3c3b38" />
    <circle cx={48} cy={50} r={16} fill="#3c3b38" />
  </g>
);

/** A meeting: a table with three heads round it. */
const Besprechung: React.FC = () => (
  <g>
    <ellipse cx={0} cy={26} rx={86} ry={30} fill={c.wood} />
    <ellipse cx={0} cy={20} rx={86} ry={30} fill={c.woodDark} opacity={0.35} />
    {[
      { x: -56, y: -18, f: c.shirt },
      { x: 0, y: -34, f: c.shirtAlt },
      { x: 56, y: -18, f: c.shirt }
    ].map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r={22} fill={c.skin} />
        <path d={`M${p.x - 22} ${p.y - 6} a22 22 0 0 1 44 0 q-22 -15 -44 0 z`} fill="#3a2f28" />
        <path d={`M${p.x} ${p.y + 24} c-26 0 -34 14 -36 30 h72 c-2 -16 -10 -30 -36 -30 z`} fill={p.f} />
      </g>
    ))}
  </g>
);

/** An office block, with the third floor lit. */
const Gebaeude: React.FC = () => (
  <g>
    <rect x={-62} y={-58} width={124} height={130} rx={6} fill={c.wall} />
    <rect x={-62} y={-58} width={124} height={14} rx={6} fill={c.wallDark} />
    {[0, 1, 2, 3].map((r) =>
      [0, 1, 2].map((k) => (
        <rect
          key={`${r}-${k}`}
          x={-48 + k * 34}
          y={-38 + r * 28}
          width={24}
          height={18}
          rx={3}
          /* the third floor up is the one he works on */
          fill={r === 1 ? c.screenLit : c.glass}
          opacity={r === 1 ? 1 : 0.75}
        />
      ))
    )}
    <rect x={-14} y={48} width={28} height={24} rx={3} fill={c.woodDark} />
  </g>
);

/** A cardboard parcel, taped across the middle. */
const Paket: React.FC = () => (
  <g>
    <rect x={-70} y={-34} width={140} height={100} rx={6} fill={c.wood} />
    <rect x={-70} y={-34} width={140} height={26} rx={5} fill={c.woodDark} opacity={0.45} />
    <rect x={-12} y={-34} width={24} height={100} fill={c.plate} opacity={0.85} />
    <path d="M-70 -34 l70 -26 l70 26 z" fill={c.woodDark} opacity={0.6} />
    <rect x={18} y={2} width={44} height={30} rx={3} fill={c.plate} />
    <rect x={26} y={12} width={28} height={4} rx={2} fill={c.metalDark} />
    <rect x={26} y={20} width={20} height={4} rx={2} fill={c.metalDark} opacity={0.7} />
  </g>
);

/** A letterbox on a post, with a note sticking out. */
const Briefkasten: React.FC = () => (
  <g>
    <rect x={-58} y={-40} width={116} height={80} rx={8} fill={c.metal} />
    <rect x={-58} y={-40} width={116} height={20} rx={8} fill={c.metalDark} opacity={0.6} />
    <rect x={-38} y={-6} width={76} height={10} rx={5} fill={c.metalDark} />
    {/* the Zettel */}
    <rect x={-26} y={-62} width={52} height={30} rx={3} fill={c.plate} transform="rotate(-9, 0, -48)" />
    <rect x={-14} y={16} width={28} height={8} rx={4} fill={c.metalDark} opacity={0.7} />
    <rect x={-9} y={40} width={18} height={54} fill={c.metalDark} />
  </g>
);

/** A wheelie bin, lid slightly up. */
const Tonne: React.FC = () => (
  <g>
    <path d="M-52 -24 l10 96 h84 l10 -96 z" fill={c.shirt} />
    <rect x={-60} y={-40} width={120} height={20} rx={7} fill={c.shirt} />
    <rect x={-60} y={-40} width={120} height={9} rx={5} fill="#3c5f80" opacity={0.6} />
    <rect x={-30} y={-6} width={60} height={7} rx={3} fill="#3c5f80" opacity={0.45} />
    <circle cx={-40} cy={78} r={13} fill="#3a3937" />
    <circle cx={40} cy={78} r={13} fill="#3a3937" />
  </g>
);

/** Notes and a couple of coins. */
const Geld: React.FC = () => (
  <g>
    <rect x={-74} y={-22} width={126} height={66} rx={7} fill="#8fae86" transform="rotate(-8, -10, 10)" />
    <rect x={-62} y={-32} width={126} height={66} rx={7} fill="#a6c39c" />
    <circle cx={1} cy={1} r={20} fill="#8fae86" />
    <circle cx={1} cy={1} r={12} fill="#c2d9ba" opacity={0.7} />
    <circle cx={44} cy={52} r={22} fill={c.food} />
    <circle cx={44} cy={52} r={14} fill="#e8b96c" />
    <circle cx={12} cy={60} r={18} fill={c.metal} />
    <circle cx={12} cy={60} r={11} fill="#b6bdc2" />
  </g>
);

/** An ID card with a photo on it. */
const Ausweis: React.FC = () => (
  <g>
    <rect x={-76} y={-48} width={152} height={96} rx={9} fill={c.shirtAlt} />
    <rect x={-66} y={-38} width={132} height={76} rx={5} fill={c.plate} opacity={0.25} />
    <rect x={-56} y={-28} width={46} height={56} rx={4} fill={c.plate} />
    <circle cx={-33} cy={-10} r={12} fill={c.skinDark} />
    <path d="M-53 28 a20 20 0 0 1 40 0 z" fill={c.skinDark} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={2} y={-22 + i * 18} width={56 - i * 12} height={8} rx={4} fill={c.plate} opacity={0.85} />
    ))}
  </g>
);

const ICONS: Record<ThoughtName, React.FC> = {
  schreibtisch: Schreibtisch,
  chef: Chef,
  kantine: Kantine,
  bus: Bus,
  besprechung: Besprechung,
  gebaeude: Gebaeude,
  paket: Paket,
  briefkasten: Briefkasten,
  tonne: Tonne,
  geld: Geld,
  ausweis: Ausweis
};

export const ThoughtIcon: React.FC<{ name: ThoughtName }> = ({ name }) => {
  const Icon = ICONS[name];
  return Icon ? <Icon /> : null;
};
