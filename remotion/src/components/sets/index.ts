/*
 * Every room that exists, and which topics they suit.
 *
 * A set is a drawing plus the boxes on it a callout can point at plus the
 * words that should send a callout to each box. Keeping the three together
 * means the scaffolder can look at a dialogue, pick rooms, and propose
 * callouts without anyone typing a coordinate.
 *
 * Adding a room: draw it in a file here, export the three things, add one line
 * to SETS, and put it in front of the topics it suits in TOPIC_ROOMS.
 */

import type React from "react";
import type { Anchor } from "../../types";
import { Supermarkt, supermarktAnchors, supermarktKeywords } from "./Supermarkt";
import { Kueche, kuecheAnchors, kuecheKeywords } from "./Kueche";
import { Wohnzimmer, wohnzimmerAnchors, wohnzimmerKeywords } from "./Wohnzimmer";
import { Schlafzimmer, schlafzimmerAnchors, schlafzimmerKeywords } from "./Schlafzimmer";
import { Restaurant, restaurantAnchors, restaurantKeywords } from "./Restaurant";
import { Bushaltestelle, bushaltestelleAnchors, bushaltestelleKeywords } from "./Bushaltestelle";
import { Bahnhof, bahnhofAnchors, bahnhofKeywords } from "./Bahnhof";
import { Buergerbuero, buergerbueroAnchors, buergerbueroKeywords } from "./Buergerbuero";

export type SetDef = {
  Component: React.FC;
  /** what the chip in the corner of the room says, unless the scene overrides it */
  label: string;
  /**
   * Where this set's art is authored: its viewBox starts at x=0 or x=960.
   *
   * A set can still be used in the other half — the drawing lands wherever
   * its wrapper puts it — but its anchors are written in the coordinates it
   * was drawn in, so they have to be shifted by the difference. Forgetting
   * that put a living room on the left of the frame with its callouts
   * pointing into the kitchen on the right.
   */
  origin: 0 | 960;
  /**
   * How wide the drawing is. 960 for a half-frame room, 1920 for a set that
   * fills the frame on its own — which is what a scene needs when the two
   * speakers are in the same place rather than at two ends of a phone.
   */
  width: 960 | 1920;
  anchors: Record<string, Anchor>;
  keywords: Record<string, string[]>;
};

export const SETS: Record<string, SetDef> = {
  supermarkt: {
    Component: Supermarkt,
    label: "Supermarkt",
    origin: 0,
    width: 960,
    anchors: supermarktAnchors,
    keywords: supermarktKeywords
  },
  kueche: {
    Component: Kueche,
    label: "Küche",
    origin: 960,
    width: 960,
    anchors: kuecheAnchors,
    keywords: kuecheKeywords
  },
  restaurant: {
    Component: Restaurant,
    label: "Restaurant",
    origin: 0,
    width: 1920,
    anchors: restaurantAnchors,
    keywords: restaurantKeywords
  },
  schlafzimmer: {
    Component: Schlafzimmer,
    label: "Schlafzimmer",
    origin: 0,
    width: 960,
    anchors: schlafzimmerAnchors,
    keywords: schlafzimmerKeywords
  },
  wohnzimmer: {
    Component: Wohnzimmer,
    label: "Wohnzimmer",
    origin: 960,
    width: 960,
    anchors: wohnzimmerAnchors,
    keywords: wohnzimmerKeywords
  },
  bushaltestelle: {
    Component: Bushaltestelle,
    label: "Haltestelle",
    origin: 0,
    width: 1920,
    anchors: bushaltestelleAnchors,
    keywords: bushaltestelleKeywords
  },
  bahnhof: {
    Component: Bahnhof,
    label: "Bahnhof",
    origin: 0,
    width: 1920,
    anchors: bahnhofAnchors,
    keywords: bahnhofKeywords
  },
  buergerbuero: {
    Component: Buergerbuero,
    label: "Bürgerbüro",
    origin: 0,
    width: 1920,
    anchors: buergerbueroAnchors,
    keywords: buergerbueroKeywords
  }
};

/*
 * The rooms to reach for, per topic.
 *
 * Two entries means a split frame, which is the usual shape. One entry means
 * a single set filling the whole frame, for dialogues where the two are in
 * the same place - a restaurant table, not a phone call.
 *
 * A default, not a rule — the scaffolder writes it into the scene file and you
 * change it there. Topics with no entry fall back to the last line, which is
 * two rooms of home; that is wrong for a dialogue set in an office, and the
 * scaffolder says so rather than pretending otherwise.
 */
export const TOPIC_ROOMS: Record<string, string[]> = {
  einkaufen: ["supermarkt", "kueche"],
  essen: ["restaurant"],
  alltag: ["schlafzimmer", "kueche"],
  wohnen: ["wohnzimmer", "kueche"],
  /* Three topics where the two speakers are strangers or fellow travellers
     standing in one place, so each names a single full-frame set. */
  unterwegs: ["bushaltestelle"],
  reisen: ["bahnhof"],
  amt: ["buergerbuero"],
  /* Both of these are couples at home talking *about* somewhere else — an
     office, a surgery — so they get rooms of a flat, not the place they are
     discussing. The bedroom is the only home set drawn for the left half. */
  arbeit: ["schlafzimmer", "wohnzimmer"],
  gesundheit: ["schlafzimmer", "kueche"],
  paar: ["wohnzimmer", "kueche"],
  familie: ["wohnzimmer", "kueche"],
  freizeit: ["wohnzimmer", "kueche"],
  telefon: ["wohnzimmer", "kueche"],
  wetter: ["wohnzimmer", "kueche"]
};

export const FALLBACK_ROOMS: string[] = ["wohnzimmer", "kueche"];

/**
 * Look an anchor up across the rooms a scene is using, in frame coordinates.
 *
 * The shift is the whole point: a set drawn for the right-hand half and then
 * placed on the left keeps its art (the wrapper moves that) but its anchor
 * boxes are still written in right-hand numbers, and a ring drawn at those
 * would land in the other room.
 */
export function findAnchor(
  rooms: { set: string; from: number }[],
  id: string
): Anchor | null {
  for (const room of rooms) {
    const set = SETS[room.set];
    if (!set || !set.anchors[id]) continue;
    const shift = room.from - set.origin;
    const box = set.anchors[id];
    return shift === 0 ? box : { ...box, x: box.x + shift };
  }
  return null;
}
