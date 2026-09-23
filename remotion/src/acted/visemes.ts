/*
 * Mouth shapes from the aligner's letters.
 *
 * The drawn films cycle three mouth shapes while a word sounds. An acted film
 * is close enough to a face that a cycle reads as a puppet, so here the mouth
 * follows the actual sounds: every letter the aligner placed becomes a target
 * shape at that moment, and the mouth is a weighted blend of the targets
 * around the current frame. The blend is what makes it look like speech —
 * real mouths are already moving towards the next sound while making this
 * one (coarticulation), and a mouth that snapped from shape to shape on each
 * letter would chatter.
 *
 * Three numbers describe a mouth, which is all a stylised face can show:
 *
 *   open   jaw drop, 0 shut .. 1 as wide as an "a"
 *   wide   corners pulled back, "i" and "e"
 *   round  lips pushed out and together, "o" and "u"
 *
 * m, b and p close the lips completely, whatever is around them — that is
 * the one shape a viewer notices when it is missing — so they are applied as
 * a clamp after the blend rather than as one more target in it. f, v and w
 * tuck the lower lip, which at this size reads as nearly closed.
 */

type Shape = { open: number; wide: number; round: number };

const V: Record<string, Shape> = {
  a: { open: 0.95, wide: 0.35, round: 0 },
  e: { open: 0.55, wide: 0.7, round: 0 },
  i: { open: 0.32, wide: 0.95, round: 0 },
  j: { open: 0.3, wide: 0.8, round: 0 },
  o: { open: 0.65, wide: 0, round: 0.85 },
  u: { open: 0.35, wide: 0, round: 1 },
  y: { open: 0.32, wide: 0.2, round: 0.8 }
};
const CONSONANT: Shape = { open: 0.22, wide: 0.35, round: 0 };
const OPENISH: Shape = { open: 0.32, wide: 0.3, round: 0 };     // h, r, l: the jaw stays loose
const SIBILANT: Shape = { open: 0.14, wide: 0.6, round: 0 };    // s, z, c, t, d, n: teeth together
const FV: Shape = { open: 0.1, wide: 0.3, round: 0 };
const REST: Shape = { open: 0, wide: 0.2, round: 0 };

function shapeOf(ch: string): Shape {
  if (V[ch]) return V[ch];
  if ("szctdnx".includes(ch)) return SIBILANT;
  if ("hrlg".includes(ch)) return OPENISH;
  if ("fvw".includes(ch)) return FV;
  return CONSONANT;
}

export type Letter = { ch: string; from: number; to: number };

/**
 * The mouth at frame f, given every letter of everything this person says.
 * `letters` must be sorted by time; it is scanned from a window around f.
 */
export function mouthAt(letters: Letter[], f: number): Shape & { talking: number } {
  if (!letters.length) return { ...REST, talking: 0 };
  /* the kernel: how far a sound reaches into its neighbours, in frames */
  const reach = 2.4;
  let wsum = 0;
  let open = 0;
  let wide = 0;
  let round = 0;
  let closure = 0;
  let near = Infinity;
  for (const l of letters) {
    if (l.to < f - 8) continue;
    if (l.from > f + 8) break;
    const mid = (l.from + l.to) / 2;
    const half = Math.max(0.6, (l.to - l.from) / 2);
    const dist = Math.max(0, Math.abs(f - mid) - half);
    near = Math.min(near, dist);
    const w = Math.exp(-(dist * dist) / (2 * reach * reach));
    if ("mbp".includes(l.ch)) {
      /* a closure is sharp: full at its own frames, gone a frame and a half away */
      closure = Math.max(closure, Math.exp(-(dist * dist) / (2 * 0.9 * 0.9)));
      continue;
    }
    const s = shapeOf(l.ch);
    wsum += w;
    open += s.open * w;
    wide += s.wide * w;
    round += s.round * w;
  }
  /* between words and after the last one, fall back towards rest */
  const talking = Math.exp(-(near * near) / (2 * 3.5 * 3.5));
  if (wsum < 1e-6) return { ...REST, talking: 0 };
  let o = (open / wsum) * talking;
  const w = (wide / wsum) * talking + REST.wide * (1 - talking);
  const r = (round / wsum) * talking;
  o *= 1 - closure;
  return { open: o, wide: w, round: r, talking };
}
