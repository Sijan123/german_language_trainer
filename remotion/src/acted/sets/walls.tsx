/*
 * Walls with real doorways, and the doors in them.
 *
 * The first rooms painted a door onto a flat back wall and let a person walk
 * "through" it by walking behind the wall. From the front that looks like a
 * body sliced by a closed door (the editor's review of c001: "his head floats
 * above a pair of legs"). So a wall here is built from boxes around its
 * openings, a doorway has a frame and a leaf that is open (or opens), and the
 * space behind it is a small room with a floor and walls. A person walks in
 * through the opening and then sideways behind the solid wall, where they go
 * out of sight the way they would.
 *
 * Coordinates as everywhere: +z towards the camera; the wall's room-side face
 * is at `z`, its thickness goes back from there.
 */

import React from "react";

export type Opening = { x: number; w: number; h: number };
export type Band = { y0: number; y1: number; color: string; proud?: number };

const Box: React.FC<{ at: [number, number, number]; size: [number, number, number]; color: string; shadow?: boolean }> = ({
  at, size, color, shadow = true
}) => (
  <mesh position={at} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} />
    <meshToonMaterial color={color} />
  </mesh>
);

/** The x-ranges of [x0, x1] left over at height y once the openings are cut out. */
function spans(x0: number, x1: number, openings: Opening[], y0: number, y1: number): [number, number][] {
  const cuts = openings.filter((o) => y0 < o.h).map((o) => [o.x - o.w / 2, o.x + o.w / 2] as [number, number]);
  cuts.sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  let at = x0;
  for (const [a, b] of cuts) {
    if (a > at) out.push([at, Math.min(a, x1)]);
    at = Math.max(at, b);
  }
  if (at < x1) out.push([at, x1]);
  return out.filter(([a, b]) => b - a > 0.001);
}

/**
 * A wall from x0 to x1 with holes for doors. `bands` are horizontal strips on
 * its face (a tiled dado, a skirting, a rail), cut round the doors too.
 */
export const Wall: React.FC<{
  x0: number; x1: number; z: number; height: number; color: string;
  openings?: Opening[]; bands?: Band[]; thick?: number;
}> = ({ x0, x1, z, height, color, openings = [], bands = [], thick = 0.1 }) => {
  const zc = z - thick / 2;
  const parts: React.ReactNode[] = [];
  /* full height between the openings */
  spans(x0, x1, openings, 0, height).forEach(([a, b], i) =>
    parts.push(<Box key={"w" + i} at={[(a + b) / 2, height / 2, zc]} size={[b - a, height, thick]} color={color} shadow={false} />)
  );
  /* over each opening, the lintel */
  openings.forEach((o, i) =>
    parts.push(<Box key={"l" + i} at={[o.x, (o.h + height) / 2, zc]} size={[o.w, height - o.h, thick]} color={color} shadow={false} />)
  );
  bands.forEach((bd, j) =>
    spans(x0, x1, openings, bd.y0, bd.y1).forEach(([a, b], i) =>
      parts.push(
        <Box key={`b${j}-${i}`} at={[(a + b) / 2, (bd.y0 + bd.y1) / 2, z + (bd.proud ?? 0.004) / 2]} size={[b - a, bd.y1 - bd.y0, bd.proud ?? 0.004]} color={bd.color} shadow={false} />
      )
    )
  );
  return <group>{parts}</group>;
};

/** A door's frame: two jambs and a head, standing a little proud of the wall. */
export const DoorFrame: React.FC<{ x: number; w: number; h: number; z: number; color: string }> = ({ x, w, h, z, color }) => (
  <group>
    {[-1, 1].map((s) => (
      <Box key={s} at={[x + (s * (w + 0.06)) / 2, h / 2, z + 0.01]} size={[0.06, h, 0.14]} color={color} />
    ))}
    <Box at={[x, h + 0.03, z + 0.01]} size={[w + 0.12, 0.06, 0.14]} color={color} />
  </group>
);

/**
 * A door leaf hinged on one side of an opening, swinging into the room
 * (towards +z) by `open` × 100°. Glass doors get a pane and a sign.
 */
export const DoorLeaf: React.FC<{
  x: number; w: number; h: number; z: number; open: number; hinge: "left" | "right";
  color: string; glass?: boolean; handle?: string;
}> = ({ x, w, h, z, open, hinge, color, glass, handle = "#c9ced1" }) => {
  const hx = hinge === "left" ? x - w / 2 : x + w / 2;
  const dir = hinge === "left" ? 1 : -1;
  /* a turn about +y carries +x towards -z, so into the room is negative for a left hinge */
  const ang = open * 1.75 * (hinge === "left" ? -1 : 1);
  const lw = w - 0.01;
  return (
    <group position={[hx, 0, z - 0.03]} rotation={[0, ang, 0]}>
      <group position={[(dir * lw) / 2, 0, 0]}>
        {glass ? (
          <>
            {/* the frame round the glass */}
            <Box at={[0, h - 0.06, 0]} size={[lw, 0.12, 0.04]} color={color} />
            <Box at={[0, 0.12, 0]} size={[lw, 0.24, 0.04]} color={color} />
            {[-1, 1].map((s) => (
              <Box key={s} at={[(s * (lw - 0.08)) / 2, h / 2, 0]} size={[0.08, h, 0.04]} color={color} />
            ))}
            <mesh position={[0, h / 2 + 0.06, 0]}>
              <boxGeometry args={[lw - 0.16, h - 0.36, 0.01]} />
              <meshToonMaterial color="#cfe0e8" transparent opacity={0.28} depthWrite={false} />
            </mesh>
          </>
        ) : (
          <>
            <Box at={[0, h / 2, 0]} size={[lw, h, 0.04]} color={color} />
            {/* two panels, so it reads as a door and not a board */}
            {[0.3, 0.72].map((fy) => (
              <Box key={fy} at={[0, h * fy, 0.022]} size={[lw * 0.72, h * 0.3, 0.004]} color={color} />
            ))}
          </>
        )}
        {/* the handle, on the side away from the hinge */}
        <Box at={[(dir * (lw / 2 - 0.08)), 1.0, 0.035]} size={[0.12, 0.02, 0.02]} color={handle} />
      </group>
    </group>
  );
};

/**
 * The space behind a doorway: floor, back wall and two side walls, so what
 * you see through an open door is a room and not a hole in the world.
 */
export const Behind: React.FC<{
  x: number; w: number; z: number; depth: number; height?: number; wall: string; floor: string;
  children?: React.ReactNode;
}> = ({ x, w, z, depth, height = 2.6, wall, floor, children }) => (
  <group>
    <mesh position={[x, 0.0015, z - depth / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, depth]} />
      <meshToonMaterial color={floor} />
    </mesh>
    <mesh position={[x, height / 2, z - depth]}>
      <planeGeometry args={[w, height]} />
      <meshToonMaterial color={wall} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[x + (s * w) / 2, height / 2, z - depth / 2]} rotation={[0, -s * Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshToonMaterial color={wall} />
      </mesh>
    ))}
    {children}
  </group>
);
