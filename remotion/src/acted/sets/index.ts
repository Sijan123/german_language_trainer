/*
 * The rooms an acted film can be set in.
 *
 * A set is two things, kept together so they cannot drift apart: a layout
 * the rig solves against (where the chairs are, where a hand puts a form
 * down, what a callout can ring) and a component that draws it. The layout
 * is plain numbers so the solver never needs three.js.
 */

import type React from "react";
import type { Vec3 } from "../types";
import { Buergerbuero3D, buergerbueroLayout } from "./buergerbuero";
import { Baeckerei3D, baeckereiLayout } from "./baeckerei";
import { Wohnung3D, wohnungLayout } from "./wohnung";

export type ChairDef = {
  /** seat centre on the floor plan */
  at: [number, number];
  /** the way someone sitting on it faces; 0 = +x */
  yaw: number;
  /** height of the top of the seat */
  seat: number;
  /** at a desk: a seated person rests their hands on it rather than in their lap */
  desk?: boolean;
};

export type SetLayout = {
  chairs: Record<string, ChairDef>;
  /** named places on surfaces: where a thing is put down, where a hand goes */
  spots: Record<string, { p: Vec3; yaw?: number; hidden?: boolean }>;
  /** named points for a gaze or a callout */
  anchors: Record<string, Vec3>;
};

/** What changes in the room during the film, as of one frame. */
export type SetState = {
  chairs: Record<string, { at: [number, number]; yaw: number }>;
  display: string;
  /** 0 when steady; counts up from 0 to 1 while a new number flashes */
  displayFlash: number;
  screen: string;
  screenProgress: number;
  /** minutes past nine on the wall clock */
  clock: number;
  /** named room values set by the `room` verb (a drawer, a machine) */
  values: Record<string, number>;
};

export const SETS3D: Record<string, { layout: SetLayout; Component: React.FC<{ state: SetState }> }> = {
  buergerbuero: { layout: buergerbueroLayout, Component: Buergerbuero3D },
  baeckerei: { layout: baeckereiLayout, Component: Baeckerei3D },
  wohnung: { layout: wohnungLayout, Component: Wohnung3D }
};
