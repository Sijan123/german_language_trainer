/*
 * Which speakers have a rigged 3D avatar, and where it lives.
 *
 * Same arrangement as audio-manifest.js, and for the same reason: the stage
 * checks here before asking for a file, so a speaker without an avatar never
 * fires a 404 — it just gets the character that is drawn in code instead. The
 * two can be mixed; an entry here is per speaker, not all-or-nothing.
 *
 * Empty is a working configuration, and the one the repo ships: the stage draws
 * both speakers out of spheres and needs no assets at all.
 *
 *
 * ADDING ONE
 *
 * Any exporter that writes the 15 Oculus visemes as morph targets will work —
 * Ready Player Me, Avaturn and Avatar SDK all do, under exactly the names
 * visemes.js emits, so there is nothing to map. Ready Player Me is free and
 * browser-based:
 *
 *   1. readyplayerme.com → create an avatar (a photo, or build one by hand)
 *   2. copy the model URL it gives you; it ends in <id>.glb
 *   3. download it with the morph targets asked for explicitly — they are not
 *      included by default:
 *
 *        https://models.readyplayer.me/<id>.glb
 *          ?morphTargets=Oculus%20Visemes,ARKit
 *          &textureAtlas=1024
 *          &lod=1
 *
 *      `textureAtlas` merges the outfit's textures into one and is the
 *      difference between about 2 MB and about 5 MB. `lod=1` halves the
 *      triangles, which nothing can see on a head-and-shoulders shot. The
 *      stage only ever frames the head, so the trousers and shoes are pure
 *      download — asking for the smaller atlas is worth it.
 *
 *   4. save as assets/avatars/<name>.glb and add the line below.
 *
 * The file is served as-is, so whatever size it is, is what visitors fetch.
 */

export const AVATAR_FILES = {
  // Shruti: "assets/avatars/shruti.glb",
  // Sijan:  "assets/avatars/sijan.glb"
};
