/*
 * One composition per dialogue that has both a timeline and a scene.
 *
 * Registering them from the data rather than by hand means adding a film is
 * writing src/scenes/<id>.ts and running the two build scripts — the Studio
 * and the renderer both pick it up with nothing else to edit.
 */

import React from "react";
import { Composition } from "remotion";
import { loadFont as loadBody } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { SceneDialogue } from "./SceneDialogue";
import { FILMS } from "./data";
import { SceneActed } from "./acted/SceneActed";

/* Hero type must never fall back to a system font: the trainer is set in
   Fraunces and IBM Plex, and a video in Arial is a video from somewhere else. */
loadBody("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadDisplay("normal", { weights: ["600"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const RemotionRoot: React.FC = () => (
  <>
    {FILMS.map(({ dialogue, scene }) => (
      <Composition
        key={dialogue.id}
        id={dialogue.id}
        /* a scene with an `acted` block is played by people in a 3D room */
        component={scene.acted ? SceneActed : SceneDialogue}
        durationInFrames={dialogue.durationInFrames}
        fps={dialogue.fps}
        width={1920}
        height={1080}
        defaultProps={{ dialogue, scene }}
      />
    ))}
  </>
);
