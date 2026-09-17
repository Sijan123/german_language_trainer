/*
 * Two heads, built in code.
 *
 * These are placeholders in the sense that a downloaded avatar will eventually
 * replace them, and permanent in the sense that they define the interface it
 * has to satisfy: a character is anything with a `group` to put in a scene and
 * an `update(dt, state)` that takes the four mouth numbers. Swapping in a glTF
 * avatar means writing a second module with that shape, not touching the stage,
 * the driver, or the phonemiser.
 *
 * Building them rather than downloading them is also what makes the whole thing
 * judgeable today. A face drawn from spheres is not photoreal, but it answers
 * the only question that matters first — does a mouth moving in time with the
 * German make the dialogues better to listen to — for the cost of one file and
 * no assets. If the answer is no, nobody has bought an avatar.
 *
 * The two are told apart the way the SVG silhouettes in avatars.js tell them
 * apart: by hair, not by face. At the size a phone shows this, outline is all
 * that survives, and two faces differing in nose shape would read as one person
 * drawn twice.
 */

/*
 * FACE LANDMARKS, in skull radii from the skull's own centre.
 *
 *     +0.47   hairline — the rim of the hair cap
 *     +0.24   brows
 *     +0.06   eyes
 *     -0.20   nose
 *     -0.54   mouth
 *     -1.02   chin
 *
 * Written out because the first version of this file had them scattered
 * through the geometry as literals, put the hairline at +0.34 and the eyes at
 * +0.14, and so drew two people whose hair covered their entire faces. As a
 * list they can be checked against each other; as magic numbers they could not.
 */
const HAIRLINE = 0.47;
const BROW_Y = 0.21;
const EYE_Y = 0.06;
const NOSE_Y = -0.20;
const MOUTH_Y = -0.54;

/*
 * Skin is warm and shared; only a trace of the speaker's tint gets into it.
 *
 * Deriving it from the tint the way the hair and shirt are derived was the
 * obvious thing and produced a corpse: Sijan's colour is --accent, a blue, and
 * a desaturated blue face is a dead face no matter how the lightness is
 * adjusted. Identity is already carried three times over by hair, shirt and the
 * name in the transcript, so the face can afford to just be a face.
 */
const SKIN_BASE = 0xdda884;

function skinFor(THREE, tint) {
  return new THREE.Color(SKIN_BASE).lerp(new THREE.Color(tint), 0.10);
}

function hairFor(THREE, tint) {
  const c = new THREE.Color(tint);
  const hsl = {};
  c.getHSL(hsl);
  return new THREE.Color().setHSL(hsl.h, Math.min(hsl.s, 0.42), 0.20);
}

/**
 * One character.
 *
 * `opts.hair` is "long" or "short"; `opts.tint` is the speaker's colour as a CSS
 * value; `opts.facing` is which way they stand, -1 or +1, so the pair angle
 * slightly towards each other rather than both staring down the camera.
 */
export function makeCharacter(THREE, opts) {
  const tint = opts.tint || "#888888";
  const facing = opts.facing || 1;

  const skin = new THREE.MeshStandardMaterial({
    color: skinFor(THREE, tint), roughness: 0.84, metalness: 0.0
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairFor(THREE, tint), roughness: 0.66, metalness: 0.0
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x2a2320, roughness: 0.5, metalness: 0.0
  });
  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0x4a1f25, roughness: 0.62, metalness: 0.0
  });
  const lipMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinFor(THREE, tint)).offsetHSL(0, 0.10, -0.14),
    roughness: 0.5, metalness: 0.0
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(tint), roughness: 0.9, metalness: 0.0
  });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf6f2ec, roughness: 0.35, metalness: 0.0
  });

  const group = new THREE.Group();

  /* --- body ------------------------------------------------------------- */

  const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.92, 0.7, 6, 20), shirtMat);
  shoulders.position.y = -2.15;
  shoulders.scale.set(1.35, 1, 0.85);
  group.add(shoulders);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.38, 0.75, 20), skin);
  neck.position.y = -1.20;
  group.add(neck);

  /* --- head ------------------------------------------------------------- */

  // Everything above the neck hangs off this, so a nod or a turn moves the
  // whole face together instead of sliding the features across a still skull.
  const head = new THREE.Group();
  head.position.y = -0.28;
  group.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 30), skin);
  skull.scale.set(0.90, 1.04, 0.88);
  head.add(skull);

  // Small, and tucked inside the skull's own silhouette — the jaw is here to
  // *move* with the mouth, not to be looked at. Made big enough to see, it
  // stops reading as a chin and starts reading as a bib.
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 20), skin);
  jaw.position.set(0, -0.60, 0.08);
  jaw.scale.set(1.0, 0.80, 0.88);
  head.add(jaw);

  /* --- hair ------------------------------------------------------------- */

  /*
   * The cap is the top slice of a sphere slightly larger than the skull, so it
   * rests on it rather than intersecting it at the temples. `thetaLength` is
   * how far down from the crown the slice reaches, and its rim *is* the
   * hairline — which makes it the one number in this file that has to be right:
   *
   *     rim y = cos(thetaLength) · radius · yScale
   *
   * Solved for HAIRLINE, so moving the landmark moves the hair with it.
   */
  const CAP_R = 1.02;
  const CAP_YS = 1.07;
  const capTheta = Math.acos(Math.min(1, HAIRLINE / (CAP_R * CAP_YS)));
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(CAP_R, 40, 26, 0, Math.PI * 2, 0, capTheta),
    hairMat
  );
  cap.scale.set(0.93, CAP_YS, 0.91);
  head.add(cap);

  if (opts.hair === "long") {
    // Two masses either side of the face and one behind it, falling past the
    // jaw — the same shape as the SVG silhouette, and what still reads at 40px.
    [-1, 1].forEach((side) => {
      const fall = new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 1.05, 5, 16), hairMat);
      fall.position.set(side * 0.76, -0.40, -0.14);
      fall.scale.set(1.0, 1.0, 0.74);
      fall.rotation.z = side * 0.05;
      head.add(fall);
    });
    const back = new THREE.Mesh(new THREE.SphereGeometry(0.86, 24, 18), hairMat);
    back.position.set(0, -0.36, -0.40);
    back.scale.set(1.0, 1.22, 0.70);
    head.add(back);
  } else {
    // Short: the cap, plus enough at the back of the skull that the silhouette
    // does not go bald in profile when the head turns.
    const back = new THREE.Mesh(new THREE.SphereGeometry(0.82, 24, 18), hairMat);
    back.position.set(0, 0.10, -0.34);
    back.scale.set(1.0, 0.90, 0.76);
    head.add(back);
  }

  /* --- eyes, brows, nose ------------------------------------------------ */

  const eyes = [];
  const brows = [];

  [-1, 1].forEach((side) => {
    /*
     * z = 0.80 puts the eye *on* the skull, not in it.
     *
     * The skull is an ellipsoid of z-radius 0.88, so its surface at the eye's
     * x and y is at z ≈ 0.82 — and the two earlier attempts both sat behind
     * that. The first appeared to work only because the eyeball was wide
     * enough for its outer edge to break through the surface further out, where
     * the skull curves away; that protruding sliver was the googly white
     * crescent. A flattened lens seated just proud of the surface has no such
     * accident in it.
     */
    const socket = new THREE.Group();
    socket.position.set(side * 0.33, EYE_Y, 0.80);
    head.add(socket);

    /*
     * One dark lens, not a white eyeball with a pupil on it.
     *
     * The anatomical version was tried first and went googly: the sclera is
     * wider than the iris, so on a head lit from one side you see a white
     * crescent on the outside of one eye and the inside of the other, and the
     * face reads as looking in two directions. A single dark almond is what the
     * SVG silhouettes in avatars.js already do, is consistent under any light,
     * and at this size loses nothing — nobody is reading gaze off it. The one
     * highlight is placed dead centre so it stays symmetrical.
     */
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 14), darkMat);
    lens.scale.set(1, 0.86, 0.35);
    socket.add(lens);

    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), eyeWhiteMat);
    glint.position.set(0, 0.022, 0.035);
    socket.add(glint);

    eyes.push(socket);

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.030, 0.23, 3, 8), hairMat);
    brow.position.set(side * 0.34, BROW_Y, 0.74);
    brow.rotation.z = Math.PI / 2 + side * 0.12;
    head.add(brow);
    brows.push(brow);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), skin);
  nose.position.set(0, NOSE_Y, 0.80);
  nose.scale.set(0.85, 1.35, 1.0);
  head.add(nose);

  /* --- mouth ------------------------------------------------------------ */

  /*
   * Two pieces on one group, and the four numbers from the driver move them
   * together:
   *
   *   open   opens the cavity vertically, and drops the jaw with it
   *   wide   stretches the corners apart
   *   round  pulls the corners in and pushes the whole group forward
   *   press  flattens the cavity to nothing and thickens the lips
   *
   * Scaling a single mesh would have been simpler and looks wrong: an open
   * mouth is a dark hole with lips around its edge, and a mouth that is only a
   * stretched lip shape reads as a drawn line whatever it does.
   */
  const mouth = new THREE.Group();
  mouth.position.set(0, MOUTH_Y, 0.70);
  head.add(mouth);

  const cavity = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 18), mouthMat);
  cavity.scale.set(1, 1, 0.5);
  mouth.add(cavity);

  const lips = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.058, 10, 28), lipMat);
  lips.position.z = 0.03;
  mouth.add(lips);

  /* --- state ------------------------------------------------------------ */

  group.rotation.y = -facing * 0.22;

  let blinkAt = 1 + Math.random() * 3;
  let blink = 0;
  let clock = Math.random() * 6;      // so the two do not breathe in lockstep
  let turn = 0;
  let lean = 0;

  /**
   * One frame.
   *
   * `state` is what lipsync.read() returned, plus `active` (is this the one
   * speaking) and `look` (-1..1, which way to turn the head).
   */
  function update(dt, state) {
    clock += dt;

    const open = state.open || 0;
    const wide = state.wide || 0;
    const round = state.round || 0;
    const press = state.press || 0;

    /*
     * Mouth. The resting height is what matters most here and it is easy to get
     * wrong in the direction of "always a bit open": at 0.20 the dark cavity
     * stayed visible through the lip ring, so the listener sat there with their
     * mouth ajar for the whole dialogue. At 0.12 the torus hole closes over the
     * cavity completely and a silent mouth is a pair of lips.
     */
    const h = 0.12 + open * 1.45 - press * 0.10;
    const w = 1.0 + wide * 0.44 - round * 0.46;
    cavity.scale.set(Math.max(0.16, w * 0.90), Math.max(0.04, h * 0.84), 0.5);
    lips.scale.set(Math.max(0.2, w), Math.max(0.10, h), 1 + press * 0.5);
    mouth.position.z = 0.70 + round * 0.07;
    mouth.position.y = MOUTH_Y - open * 0.05;

    // The jaw goes with it. Without this the face is a mask with a moving hole
    // in it — the chin dropping is most of what makes speech read as speech.
    jaw.position.y = -0.60 - open * 0.15;
    jaw.scale.y = 0.80 + open * 0.06;

    // Brows lift a little on loud syllables. Tiny, and the difference between
    // a talking head and a talking mannequin.
    const lift = (state.energy || 0) * (state.active ? 0.05 : 0);
    brows.forEach((b, i) => {
      b.position.y = BROW_Y + lift + Math.sin(clock * 0.7 + i) * 0.004;
    });

    // Blink: fast, and not on a metronome.
    blinkAt -= dt;
    if (blinkAt <= 0) { blink = 0.16; blinkAt = 1.8 + Math.random() * 4.0; }
    if (blink > 0) blink -= dt;
    const lid = blink > 0 ? Math.max(0.06, Math.abs(blink - 0.08) / 0.08) : 1;
    eyes.forEach((e) => { e.scale.y = lid; });

    // Head turn towards whoever is talking, and a small lean in when it is this
    // character's turn. Both eased, because a snap looks like a glitch.
    const wantTurn = (state.look || 0) * 0.30;
    const wantLean = state.active ? 1 : 0;
    turn += (wantTurn - turn) * Math.min(1, dt * 4);
    lean += (wantLean - lean) * Math.min(1, dt * 4);

    head.rotation.y = turn;
    head.rotation.x = Math.sin(clock * 0.55) * 0.018 - open * 0.03;
    group.rotation.y = -facing * 0.22 + turn * 0.35;
    group.position.z = lean * 0.28;
    group.position.y = Math.sin(clock * 0.8) * 0.022;          // breathing

    // The listener sits back a touch. Dimming them would be the obvious way to
    // do this and is wrong — the point of the stage is seeing a mouth, and a
    // face you have dimmed is a face you have made harder to read.
    group.scale.setScalar(1 + lean * 0.045);
  }

  return { group, update };
}
