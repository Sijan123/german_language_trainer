/*
 * The three layers that sit over every scene: a colour grade, grain, and a
 * vignette.
 *
 * The drawn rooms underneath are flat vector fills, and flat vector fills at
 * 1920x1080 look like a diagram. These are what make them look photographed
 * instead: a warm lift in the highlights and a cool foot in the shadows, grain
 * that moves, and corners that fall away. They also do the job of tying two
 * separately drawn rooms into one picture, which is why the grade sits above
 * the sets rather than being baked into their colours.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * A warm lift in the highlights and a cool foot in the shadows — the same trick
 * a colourist uses, and the reason the white cards read as paper rather than as
 * #ffffff.
 */
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, rgba(255,243,220,.20) 0%, rgba(255,255,255,0) 48%)",
        mixBlendMode: "soft-light",
        pointerEvents: "none"
      }}
    />
    <AbsoluteFill
      style={{
        background: "linear-gradient(200deg, rgba(0,0,0,0) 55%, rgba(31,42,60,.22) 100%)",
        mixBlendMode: "multiply",
        opacity: 0.34,
        pointerEvents: "none"
      }}
    />
  </>
);

/* One tile of fractal noise, inlined so nothing has to be fetched mid-render. */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="180" height="180" filter="url(#n)"/>
     </svg>`
  );

/**
 * Film grain. It has to move, or it is dirt on the lens rather than grain — the
 * tile is nudged a couple of pixels on a three-frame cycle, which at 30fps
 * reads as the real thing.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => {
  const frame = useCurrentFrame();
  const step = frame % 5;
  const shift = [
    [0, 0], [-37, 19], [23, -41], [-13, -27], [41, 33]
  ][step] as [number, number];

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "180px 180px",
        backgroundPosition: `${shift[0]}px ${shift[1]}px`,
        mixBlendMode: "multiply",
        opacity,
        pointerEvents: "none"
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(128% 90% at 50% 46%, rgba(0,0,0,0) 50%, rgba(31,42,60,.17) 100%)",
      pointerEvents: "none"
    }}
  />
);
