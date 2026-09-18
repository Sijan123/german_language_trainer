/*
 * The two cards that open and close the film.
 *
 * Both sit on a frosted panel over the set rather than on a colour fill. The
 * set is the thing that tells you where you are before a word is spoken, so
 * covering it flat throws that away; blurring it keeps the room legible as a
 * room while making the type on top unambiguous.
 */

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/* Shared shell: the frost, the lift, and the timing. */
const Panel: React.FC<{
  t: number;
  life: number;
  tone: string;
  width: number;
  children: React.ReactNode;
}> = ({ t, life, tone, width, children }) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;

  const enter = spring({ frame: t, fps, config: theme.spring.settle, durationInFrames: 24 });
  const leave = interpolate(t, [life - 12, life], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in
  });
  const shown = enter * (1 - leave);
  if (shown <= 0.002) return null;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: shown,
        /* Blurring the backdrop rather than veiling it: at any opacity that
           still lets the room through, drawn shelves read as ghost text behind
           the headline. */
        backdropFilter: `blur(${interpolate(shown, [0, 1], [0, 22])}px) saturate(0.78)`,
        background: `rgba(244,245,240,${0.34 * shown})`
      }}
    >
      <div
        style={{
          width,
          background: "rgba(255,255,255,0.94)",
          borderRadius: 30,
          padding: "58px 72px 64px",
          textAlign: "center",
          boxShadow: "0 3px 6px rgba(31,42,60,.06), 0 40px 90px rgba(31,42,60,.22)",
          borderTop: `5px solid ${tone}`,
          transform:
            `translateY(${interpolate(enter, [0, 1], [40, 0]) + leave * 16}px) ` +
            `scale(${interpolate(enter, [0, 1], [0.94, 1])})`
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** The rule under a heading. It draws itself on, left to right. */
const Rule: React.FC<{ t: number; tone: string }> = ({ t, tone }) => {
  const { fps } = useVideoConfig();
  const grow = spring({
    frame: t - 8,
    fps,
    config: theme.spring.settle,
    durationInFrames: 22
  });
  return (
    <div
      style={{
        width: interpolate(grow, [0, 1], [0, 132]),
        height: 7,
        borderRadius: 999,
        background: tone,
        margin: "22px auto 0"
      }}
    />
  );
};

export const TitleCard: React.FC<{
  startAt: number; life: number; title: string; titleEn: string; topic: string; tone: string;
}> = ({ startAt, life, title, titleEn, topic, tone }) => {
  const frame = useCurrentFrame();
  const t = frame - startAt;

  return (
    <Panel t={t} life={life} tone={tone} width={1180}>
      <div
        style={{
          fontFamily: theme.font.mono,
          fontSize: 24,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: tone,
          marginBottom: 20
        }}
      >
        {topic}
      </div>
      <h1
        style={{
          margin: 0,
          fontFamily: theme.font.display,
          fontWeight: 600,
          fontSize: 82,
          lineHeight: 1.06,
          letterSpacing: "-0.022em",
          color: theme.color.ink
        }}
      >
        {title}
      </h1>
      <Rule t={t} tone={theme.color.attention} />
      <p
        style={{
          margin: "24px 0 0",
          fontFamily: theme.font.body,
          fontStyle: "italic",
          fontSize: 34,
          color: theme.color.inkFaint
        }}
      >
        {titleEn}
      </p>
    </Panel>
  );
};

export const WortschatzCard: React.FC<{
  startAt: number; life: number; words: { de: string; en: string }[]; tone: string;
}> = ({ startAt, life, words, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - startAt;

  return (
    <Panel t={t} life={life} tone={tone} width={1280}>
      <h2
        style={{
          margin: 0,
          fontFamily: theme.font.display,
          fontWeight: 600,
          fontSize: 66,
          letterSpacing: "-0.02em",
          color: theme.color.ink
        }}
      >
        Wortschatz
      </h2>
      <Rule t={t} tone={theme.color.attention} />

      <div
        style={{
          marginTop: 38,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          textAlign: "left"
        }}
      >
        {words.map((w, i) => {
          /* Tiles arrive one after another, five frames apart. Six of them
             landing together is a table appearing; six in sequence is a list
             being read to you. */
          const in_ = spring({
            frame: t - 16 - i * 5,
            fps,
            config: theme.spring.settle,
            durationInFrames: 20
          });
          return (
            <div
              key={w.de}
              style={{
                background: theme.color.sunken,
                borderLeft: `5px solid ${theme.color.attention}`,
                borderRadius: 12,
                padding: "18px 24px",
                opacity: in_,
                transform: `translateX(${interpolate(in_, [0, 1], [-18, 0])}px)`
              }}
            >
              <div
                style={{
                  fontFamily: theme.font.body,
                  fontWeight: 600,
                  fontSize: 36,
                  color: theme.color.ink
                }}
              >
                {w.de}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: theme.font.body,
                  fontStyle: "italic",
                  fontSize: 25,
                  color: theme.color.inkFaint
                }}
              >
                {w.en}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
