/*
 * Speaker avatars.
 *
 * Drawn rather than loaded: two inline SVGs cost nothing, need no files in the
 * repo, and take their colour from the speaker's own tint through currentColor,
 * so they stay right in dark mode and if the palette changes. They are
 * silhouettes — the two differ in outline, not in detail, which is what still
 * reads at 34 pixels on a phone.
 *
 * The face is drawn in the card colour, not in the tint. With one fill for hair
 * and face the whole thing collapses into a blob — the shapes only read when the
 * face is punched out of the hair, which is also what keeps the two silhouettes
 * apart at this size.
 *
 * Gespräche and the Gespräch sub-mode of Satzbau both draw them, which is why
 * they are their own module.
 */

function avatar(hair) {
  return '<svg class="conv-avatar" viewBox="0 0 40 40" aria-hidden="true">' +
    '<circle class="av-bg" cx="20" cy="20" r="20"/>' +
    '<path class="av-fg" d="' + hair + '"/>' +
    '<circle class="av-face" cx="20" cy="17.5" r="6.2"/>' +
    '<path class="av-fg" d="' + SHOULDERS + '"/>' +
  '</svg>';
}

/*
 * The two hair shapes on their own. The video renderer in remotion/ draws the
 * same silhouettes at 400 pixels rather than 34, so it needs the paths without
 * the 34-pixel markup around them - one drawing, two renderers, no drift.
 */
export const HAIR = {
  // long hair falling either side of the face
  Shruti: "M20 8.6c-5 0-8.5 3.4-8.5 8.2 0 2.6.5 5.1 1.4 7l2.9-1c-.7-1.6-1.1-3.6-1.1-5.6 0-3.2 2.3-5.2 5.3-5.2s5.3 2 5.3 5.2c0 2-.4 4-1.1 5.6l2.9 1c.9-1.9 1.4-4.4 1.4-7 0-4.8-3.5-8.2-8.5-8.2z",
  // a short cap with the sides cut in
  Sijan: "M20 8.2c-4.6 0-8 3.2-8 7.6 0 .8.1 1.5.3 2.1l2.6-1.2c-.1-.4-.1-.7-.1-1 0-2.6 2.4-4.3 5.2-4.3s5.2 1.7 5.2 4.3c0 .3 0 .6-.1 1l2.6 1.2c.2-.6.3-1.3.3-2.1 0-4.4-3.4-7.6-8-7.6z"
};

/** The shoulders, shared by both. */
export const SHOULDERS = "M9.4 34.6C11 29.9 15.1 26.5 20 26.5s9 3.4 10.6 8.1z";

export const AVATARS = {
  Shruti: avatar(HAIR.Shruti),
  Sijan: avatar(HAIR.Sijan)
};

export const SPEAKERS = ["Shruti", "Sijan"];

export function avatarFor(speaker) {
  return AVATARS[speaker] || AVATARS.Shruti;
}
