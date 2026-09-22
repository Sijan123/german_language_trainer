/*
 * Staging for c020 — "Eine Wohnung besichtigen".
 *
 * Viewing a flat, so the two are walking through it rather than standing in
 * one room — which is exactly what the split frame already looks like.
 *
 * Note the room order: wohnzimmer is room 0 even though it is drawn on the
 * right. `findAnchor` searches the list in order and both rooms own a
 * `fenster`, so listing the living room first is what sends "Balkon" to its
 * window rather than the bedroom's. Room order is search order, not screen
 * order.
 *
 * This is the one film that is shot rather than staged — see `film` at the
 * bottom and `cameraAt` in SceneDialogue. The two rooms are still here and
 * still side by side; the difference is that the camera is almost never
 * looking at both of them at once.
 */

import type { Scene } from "../types";

export const c020: Scene = {
  id: "c020",

  call: false,

  rooms: [
    { set: "wohnzimmer", from: 960, to: 1920 },
    { set: "schlafzimmer", from: 0, to: 960 }
  ],

  cast: {
    Shruti: {
      room: 1,
      x: 258,
      headY: 470,
      scale: 1,
      skin: "#c48b64",
      skinShade: "#a97148",
      hair: "#40291f",
      hairLight: "#8a5733",
      hairStyle: "long",
      beard: false,
      brows: "normal",
      top: "#9c5068",
      topDark: "#89455a",
      basket: false
    },
    Sijan: {
      room: 0,
      x: 1664,
      headY: 470,
      scale: 1,
      skin: "#b9805a",
      skinShade: "#9d6741",
      hair: "#241b17",
      hairLight: "#4a382e",
      hairStyle: "short",
      beard: true,
      brows: "thick",
      top: "#3f6b8f",
      topDark: "#355b7a",
      basket: false
    }
  },

  callouts: {
    4: { at: "fenster", label: "der Balkon", word: "Balkon" }
  },

  thoughts: {
    2: { icon: "geld", label: "die Miete", word: "Miete" },
    7: { icon: "gebaeude", label: "der dritte Stock", word: "dritten" }
  },

  /*
   * Shot like a viewing: a wide of the whole place, then coverage that sits
   * on whoever is talking, and back out wide when there is something to look
   * at. Thirteen setups over fifty seconds is ordinary dialogue cutting.
   *
   * Every window is written in full-frame coordinates and every one of them
   * is inside the room it belongs to with margin to spare, because the float
   * in `handheld` moves the camera about 0.6% of the window width and a shot
   * flush against a room's edge drifts off the drawing and shows the join.
   * The left room is x 0-960 and the right room x 960-1920, so a 900-wide
   * window centred on 480 or 1440 has thirty pixels of slack each side.
   *
   * Three sizes and no others, which is what stops it looking like a zoom
   * demo: 1840 is the whole flat, 900 is one room, 700-720 is one person.
   */
  film: {
    /* The background goes soft as the camera closes in. The people are drawn
       in another layer and stay sharp, which is the whole illusion — at 3.4
       the widest shot blurs by a seventh of a pixel and the tightest by four,
       so the film never announces the effect. */
    focus: 3.4,

    /* Under the title card, before anyone speaks: the whole flat. */
    open: { x: 960, y: 540, w: 1840, move: "push", label: "Die Wohnung" },

    shots: {
      /* "Wie viele Zimmer hat die Wohnung?" — cut in to her. */
      0: { x: 480, y: 545, w: 900, move: "push", label: "Schlafzimmer" },
      /* "Drei, plus Küche und Bad." — the answer, in the other room. */
      1: { x: 1450, y: 545, w: 900, move: "left", label: "Wohnzimmer" },
      /*
       * "Und wie hoch ist die Miete?" — wide, because of the thought cloud.
       *
       * A thought is not staged in the room the way a callout is: `Thought`
       * puts the cloud at a fixed y=236 in *frame* coordinates, so its top
       * lobe reaches y≈58 no matter where the camera is. Holding that and
       * the speaker's face clear of the card needs about 745 pixels of window
       * height, which is a window 1320 wide at the very least. Anything
       * tighter framed her chin and the bottom third of a cloud.
       */
      2: { x: 940, y: 520, w: 1800, move: "push", label: "Die Wohnung" },
      /* "Achthundert warm." Two words, so the tightest thing in the film so
         far. He faces left, so he is framed right of centre with the room in
         front of him. */
      3: { x: 1550, y: 531, w: 700, move: "push", label: null },
      /*
       * "Gibt es einen Balkon?" — the one line that has to go wide.
       *
       * The window she is asking about is the living room's `fenster`, at
       * x 985, which is twenty-five pixels inside a room that starts at 960.
       * With the ring's padding the callout begins at x 971, so no shot that
       * stays inside the right-hand room can hold it. Going out to the full
       * flat is the honest answer and it is also the better one: she asks
       * what the place has, and the cut shows the place.
       */
      4: { x: 960, y: 540, w: 1840, move: "push", label: "Die Wohnung" },
      /* "Ja, nach Süden" — back in, easing out of the wide. */
      5: { x: 1440, y: 545, w: 900, move: "pull", label: "Wohnzimmer" },
      6: { x: 370, y: 531, w: 720, move: "push", label: null },
      /*
       * "Im dritten, leider ohne Aufzug." Wide for the same reason as line 2,
       * tracking right rather than pushing so the two thought shots are not
       * the same move twice. Note that a shot this wide can only push or
       * track: pulling grows the window past the top of the drawing, and
       * there is nothing above y=0 to show.
       */
      7: { x: 960, y: 520, w: 1700, move: "right", label: "Die Wohnung" },
      /* "Das wird beim Umzug anstrengend." The pan drifts right by 27px,
         which is why this one is centred on 470 and not 480. */
      8: { x: 470, y: 545, w: 900, move: "right", label: "Schlafzimmer" },
      9: { x: 1440, y: 545, w: 900, move: "push", label: "Wohnzimmer" },
      /* The last exchange is the closest the film gets to either of them. */
      10: { x: 370, y: 525, w: 720, move: "push", label: null },
      11: { x: 1550, y: 525, w: 700, move: "push", label: null },
      /* "Mir gefällt sie." — opening out, into the Wortschatz card. */
      12: { x: 480, y: 545, w: 900, move: "pull", label: "Schlafzimmer" }
    }
  },

  wortschatz: [
    { de: "die Wohnung", en: "flat" },
    { de: "die Miete", en: "rent" },
    { de: "der Balkon", en: "balcony" },
    { de: "der Stock", en: "floor, storey" },
    { de: "der Aufzug", en: "lift" },
    { de: "der Umzug", en: "move, removal" }
  ]
};
