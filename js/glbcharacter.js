/*
 * A rigged glTF avatar, wearing the same interface as the spheres.
 *
 * `characters.js` defined the contract: something with a `group` to put in the
 * scene and an `update(dt, state)`. This is the second implementation of it, and
 * the reason writing the first one was worth the trouble — the stage, the
 * driver and the phonemiser are untouched by this file existing.
 *
 *
 * WHY THERE IS NO MAPPING TABLE
 *
 * visemes.js emits the 15 Oculus visemes. Ready Player Me, Avaturn and Avatar
 * SDK all export morph targets named `viseme_sil` … `viseme_U` — the same 15,
 * under the same names. So the lip sync here is a straight assignment of
 * lipsync's weights onto morph target influences, with a `viseme_` prefix and
 * nothing else in between. That is not luck; it is why that alphabet was chosen
 * as the phonemiser's output in the first place.
 *
 * The four shape numbers are ignored on this path. They exist for a character
 * that has no morph targets, and an avatar that has them does not need a face
 * approximated out of four scalars.
 *
 *
 * WHAT IS NORMALISED
 *
 * An exported avatar is about 1.7 units tall, because it is modelled in metres.
 * The spheres are built at head-radius ≈ 1, roughly 15 units tall, because that
 * made the geometry readable to write. Rather than teach the stage two scales,
 * the avatar is measured on load and scaled and shifted so its head lands
 * exactly where the procedural head sits. The camera, the framing and the
 * speaker spacing then need no knowledge of which kind of character they got.
 */

/*
 * Framing targets, in the units the procedural characters are built in.
 *
 * Scaled by HEAD size, not by body height. Body height was the first attempt
 * and it crops: a Ready Player Me avatar is slightly stylised and its head is
 * more than the textbook one-seventh of its height, so normalising the body to
 * a fixed height made the head too big and cut the hair off at the top of the
 * strip. The head is the only part this stage ever shows, so the head is what
 * gets measured.
 *
 * Measured from the head bone — which sits at the top of the neck, not at the
 * middle of the skull — up to the crown, because those are the two landmarks
 * every humanoid rig actually has.
 */
const TARGET_CROWN_ABOVE_BONE = 1.45;
const TARGET_HEAD_BONE_Y = -0.55;

/* ARKit names differ slightly between exporters; try each in turn. */
const BLINK = [
  ["eyeBlinkLeft", "eyeBlinkRight"],
  ["eyeBlink_L", "eyeBlink_R"],
  ["eyesClosed", null]
];
const BROW_UP = ["browInnerUp", "browOuterUpLeft", "browOuterUp_L"];

/**
 * Wrap a loaded glTF.
 *
 * `gltf` is what GLTFLoader resolved. `opts.facing` is -1 or +1, as for the
 * procedural character. The scene graph is used as-is — no retargeting, no
 * animation clips — so anything the exporter got right stays right.
 */
export function makeGlbCharacter(THREE, gltf, opts) {
  const facing = opts.facing || 1;

  // A wrapper, so scale and offset can be applied without fighting whatever
  // transform the exporter put on its own root node.
  const group = new THREE.Group();
  const inner = gltf.scene;
  group.add(inner);

  /* --- find the bones and the morph-target meshes ----------------------- */

  let headBone = null;
  let neckBone = null;
  const faces = [];          // every mesh carrying morph targets

  inner.traverse((node) => {
    if (node.isBone || node.isObject3D) {
      if (!headBone && /^head$/i.test(node.name)) headBone = node;
      if (!neckBone && /^neck$/i.test(node.name)) neckBone = node;
    }
    if (node.isMesh || node.isSkinnedMesh) {
      // Shadows are off on this stage, but frustum culling on a skinned mesh
      // whose bounding box was computed in bind pose makes heads vanish when
      // they turn. Cheaper to disable than to recompute every frame.
      node.frustumCulled = false;
      if (node.morphTargetDictionary && node.morphTargetInfluences) faces.push(node);
    }
  });

  /* --- normalise scale and position ------------------------------------- */

  /*
   * Both measurements are taken while the wrapper is still untransformed, and
   * that ordering is the whole trick.
   *
   * `getWorldPosition` calls `updateWorldMatrix` on the ancestors first, so it
   * reports a position that already includes whatever scale the wrapper is
   * carrying. Measuring the head *after* setting the scale and then multiplying
   * by it again squares the factor — 1.56 m became 118 units, and both avatars
   * sat far below the frame with the stage looking simply empty. So: measure,
   * then transform, never the other way round.
   */
  inner.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(inner);
  const size = new THREE.Vector3();
  box.getSize(size);

  // The head bone where the rig has one; a fraction down from the crown
  // otherwise, which is about where a neck joint would be on a human figure.
  let boneY;
  if (headBone) {
    const p = new THREE.Vector3();
    headBone.getWorldPosition(p);
    boneY = p.y;
  } else {
    boneY = box.max.y - size.y * 0.13;
  }

  const crownAbove = Math.max(0.001, box.max.y - boneY);
  const k = TARGET_CROWN_ABOVE_BONE / crownAbove;
  group.scale.setScalar(k);
  group.position.y = TARGET_HEAD_BONE_Y - boneY * k;

  /* --- morph target plumbing -------------------------------------------- */

  /*
   * One name can appear on several meshes — an RPM avatar carries the same 72
   * targets on the head, the teeth and both eyeballs, and they have to move
   * together or the teeth stay behind in a closed mouth while the lips open.
   * So an index is built per name across every mesh that has it.
   */
  const slots = new Map();
  faces.forEach((mesh) => {
    for (const name in mesh.morphTargetDictionary) {
      if (!slots.has(name)) slots.set(name, []);
      slots.get(name).push([mesh, mesh.morphTargetDictionary[name]]);
    }
  });

  function setMorph(name, value) {
    const targets = slots.get(name);
    if (!targets) return false;
    for (const [mesh, index] of targets) mesh.morphTargetInfluences[index] = value;
    return true;
  }

  /* Which of the alternative spellings this particular export actually uses. */
  const blinkPair = BLINK.find((pair) => slots.has(pair[0])) || null;
  const browName = BROW_UP.find((name) => slots.has(name)) || null;
  const visemeCount = Array.from(slots.keys()).filter((n) => /^viseme_/.test(n)).length;

  /* --- state ------------------------------------------------------------ */

  group.rotation.y = -facing * 0.22;

  let blinkAt = 1 + Math.random() * 3;
  let blink = 0;
  let clock = Math.random() * 6;
  let turn = 0;
  let lean = 0;

  function update(dt, state) {
    clock += dt;

    // Visemes, straight across.
    const weights = state.visemes;
    if (weights) {
      for (const v in weights) setMorph("viseme_" + v, weights[v]);
    }

    // Blink. The lid closes and opens inside about a sixth of a second, which
    // is why this is driven by a countdown rather than eased like the rest.
    blinkAt -= dt;
    if (blinkAt <= 0) { blink = 0.16; blinkAt = 1.8 + Math.random() * 4.0; }
    if (blink > 0) blink -= dt;
    const shut = blink > 0 ? 1 - Math.max(0, Math.abs(blink - 0.08) / 0.08) : 0;
    if (blinkPair) {
      setMorph(blinkPair[0], shut);
      if (blinkPair[1]) setMorph(blinkPair[1], shut);
    }

    if (browName) setMorph(browName, (state.energy || 0) * (state.active ? 0.28 : 0));

    // Head turn, split between the neck and the head so it reads as a person
    // looking rather than a bust rotating on a plinth.
    const wantTurn = (state.look || 0) * 0.30;
    const wantLean = state.active ? 1 : 0;
    turn += (wantTurn - turn) * Math.min(1, dt * 4);
    lean += (wantLean - lean) * Math.min(1, dt * 4);

    if (headBone) {
      headBone.rotation.y = turn * 0.6;
      headBone.rotation.x = Math.sin(clock * 0.55) * 0.02;
    }
    if (neckBone) neckBone.rotation.y = turn * 0.4;

    group.rotation.y = -facing * 0.22 + turn * 0.35;
    group.position.z = lean * 0.28;
    group.scale.setScalar(k * (1 + lean * 0.045));
  }

  /* Reported so the stage can say in the UI when an avatar loaded but has no
   * visemes on it — a silent still face is otherwise indistinguishable from a
   * broken driver. */
  const info = { visemes: visemeCount, blink: !!blinkPair, bones: !!headBone };

  return { group, update, info };
}
