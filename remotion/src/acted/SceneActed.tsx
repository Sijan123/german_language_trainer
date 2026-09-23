/*
 * A Gespräch acted out in a 3D room.
 *
 * The drawn films (SceneDialogue) and this share everything that is printed
 * on the film rather than filmed: the subtitle card with its karaoke, the
 * orange callout rings, the thought bubbles, the title and Wortschatz cards,
 * the grade and the grain. What differs is underneath — people with bodies,
 * furniture with depth, a camera that cuts between setups.
 *
 * Layer order, bottom to top: the 3D render, callout, thought, bubble, cards,
 * grade, grain, vignette, fades. As in the drawn films, the overlays never
 * move with the camera; they are told where things are on screen by
 * projecting through it.
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { theme } from "../theme";
import { Grade, Grain, Vignette } from "../components/Layers";
import { SpeechBubble, BUBBLE_WIDTH } from "../components/SpeechBubble";
import { Callout } from "../components/Callout";
import { Thought } from "../components/Thought";
import type { ThoughtName } from "../components/ThoughtIcons";
import { TitleCard, WortschatzCard } from "../components/Cards";
import type { Dialogue, Scene } from "../types";
import { SETS3D } from "./sets";
import { compile } from "./timeline";
import { World } from "./world";
import { Person } from "./Person";
import { Prop } from "./Props";
import { mouthAt } from "./visemes";
import { cameraAt, project, projectBox, W, H, type CamPose } from "./camera";
import { add, mul } from "./math";

/* One World per film, kept for the life of the page, so the memo of solved
   frames (and the ink laid down so far) carries from one frame to the next. */
const worlds = new Map<string, World>();
function worldFor(d: Dialogue, scene: Scene) {
  const key = d.id + ":" + d.durationInFrames;
  let w = worlds.get(key);
  if (!w) {
    const acted = scene.acted!;
    const set = SETS3D[acted.set];
    if (!set) throw new Error(`scenes/${d.id}.ts: no 3D set "${acted.set}"`);
    w = new World(compile(acted, d, set.layout));
    worlds.set(key, w);
  }
  return w;
}

/** Points the renderer's camera; runs inside the canvas on every frame. */
const CameraRig: React.FC<{ pose: CamPose }> = ({ pose }) => {
  const { camera } = useThree();
  const c = camera as import("three").PerspectiveCamera;
  c.fov = pose.fov;
  c.near = 0.05;
  c.far = 60;
  c.position.set(...pose.pos);
  c.lookAt(...pose.look);
  c.updateProjectionMatrix();
  return null;
};

export const SceneActed: React.FC<{ dialogue: Dialogue; scene: Scene }> = ({ dialogue: d, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acted = scene.acted!;
  const world = useMemo(() => worldFor(d, scene), [d, scene]);
  const prog = world.prog;
  const Set = SETS3D[acted.set].Component;

  /* ------------------------------------------------------- the clock */
  const line = d.lines.find((l) => frame >= l.enterAt && frame < l.endAt) ?? null;
  const outroAt = d.durationInFrames - d.outro;
  const inScene = frame < outroAt;

  /* ------------------------------------------------------- the world */
  const names = Object.keys(prog.people);
  const bodies = names.map((n) => world.body(n, frame));
  const mouths = names.map((n) => {
    const p = prog.people[n];
    const letters = p.speech.flatMap((s) => s.letters);
    return mouthAt(letters, frame);
  });
  const setState = world.setState(frame);
  const props = Object.entries(prog.props).map(([name, pr]) => ({
    name, kind: pr.kind, ...world.prop(name, frame),
    ink: pr.kind === "form" ? world.ink(name, frame) : undefined
  }));
  const pose = cameraAt(prog, world, frame);

  /* ------------------------------------------------------- overlays */
  const callout = line ? acted.callouts[line.i] : undefined;
  const calloutWord = callout && line
    ? line.words.find((w) => w.text.replace(/[.,!?;:]/g, "") === callout.word)
    : undefined;
  let calloutBox: { x: number; y: number; w: number; h: number } | null = null;
  if (callout) {
    const at = prog.props[callout.at]
      ? world.prop(callout.at, frame).x.p
      : prog.set.anchors[callout.at];
    if (!at) throw new Error(`scenes/${d.id}.ts: callout at "${callout.at}", which is neither a prop nor an anchor`);
    calloutBox = projectBox(pose, at, callout.size ?? [0.09, 0.06]);
  }

  const thought = line && !callout ? scene.thoughts?.[line.i] : undefined;
  const thoughtWord = thought && line
    ? line.words.find((w) => w.text.replace(/[.,!?;:]/g, "") === thought.word)
    : undefined;
  const speakerBody = line ? bodies[names.indexOf(line.s)] : undefined;
  const headPx = speakerBody ? project(pose, speakerBody.head) : null;
  const headTopPx = speakerBody ? project(pose, add(speakerBody.head, mul(speakerBody.headU, 0.17 * speakerBody.k))) : null;

  return (
    <AbsoluteFill style={{ background: theme.color.bg, overflow: "hidden" }}>
      {/* --------------------------------------------------- the voices */}
      {d.lines.map((l) => (
        <Sequence key={l.i} from={l.audioAt} durationInFrames={l.audioFrames} layout="none">
          <Audio src={staticFile(l.clip)} />
        </Sequence>
      ))}
      {/* the room: footsteps, the chair, paper, the keyboard, the pen */}
      {prog.sounds.map((s, i) => (
        <Sequence key={"sfx" + i} from={Math.max(0, s.f)} durationInFrames={s.frames ?? fps * 2} layout="none">
          <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.volume} />
        </Sequence>
      ))}

      {/* --------------------------------------------------- the room */}
      <ThreeCanvas width={W} height={H} shadows flat style={{ position: "absolute", inset: 0 }}>
        <CameraRig pose={pose} />
        <hemisphereLight args={["#fbf8f1", "#b9b4a8", 1.25]} />
        <directionalLight
          position={[2.6, 5.2, 3.4]}
          intensity={1.7}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0006}
          shadow-normalBias={0.02}
          shadow-camera-left={-6}
          shadow-camera-right={5}
          shadow-camera-top={4}
          shadow-camera-bottom={-3}
          shadow-camera-near={0.5}
          shadow-camera-far={16}
        />
        <directionalLight position={[-3, 2.5, 4]} intensity={0.35} />
        <Set state={setState} />
        {bodies.map((b, i) => (
          <Person key={names[i]} body={b} look={prog.people[names[i]].look} mouth={mouths[i]} />
        ))}
        {props.map((p) =>
          p.visible ? <Prop key={p.name} kind={p.kind} x={p.x} open={p.open} ink={p.ink} /> : null
        )}
      </ThreeCanvas>

      {/* --------------------------------------------------- pointer */}
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {inScene && line && callout && calloutBox && calloutWord ? (
          <Callout
            box={calloutBox}
            label={callout.label}
            from={calloutWord.from}
            to={line.endAt}
            side={calloutBox.y - 130 > 40 ? "above" : "below"}
          />
        ) : null}
        {inScene && line && thought && thoughtWord && headPx && headTopPx ? (
          <Thought
            icon={thought.icon as ThoughtName}
            label={thought.label}
            at={headPx.x}
            headTop={headTopPx.y}
            from={thoughtWord.from}
            to={line.endAt}
          />
        ) : null}
      </svg>

      {/* --------------------------------------------------- the card */}
      {inScene && line ? (
        (() => {
          const tailX = headPx ? Math.min(W - 80, Math.max(80, headPx.x)) : W / 2;
          const lean = tailX < W / 2 ? -96 : 96;
          return (
            <SpeechBubble
              line={line}
              index={line.i}
              total={d.lines.length}
              left={(W - BUBBLE_WIDTH) / 2 + lean}
              bottom={70}
              tailX={tailX}
              call={false}
            />
          );
        })()
      ) : null}

      <TitleCard startAt={6} life={d.intro - 6} title={d.title} titleEn={d.titleEn} topic={d.topic} tone={d.tone} />
      <WortschatzCard startAt={outroAt} life={d.outro} words={scene.wortschatz} tone={d.tone} />

      <Grade />
      <Grain opacity={0.1} />
      <Vignette />

      <AbsoluteFill
        style={{
          background: "#1f2a3c",
          pointerEvents: "none",
          opacity:
            interpolate(frame, [0, 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out }) +
            interpolate(frame, [d.durationInFrames - 16, d.durationInFrames - 1], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.in
            })
        }}
      />
    </AbsoluteFill>
  );
};
