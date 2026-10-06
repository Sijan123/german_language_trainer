"""
Render an acted film in Blender, from what the browser captured.

    blender -b -P blender/film.py -- --glb out/blender/c003/anim.glb
        --camera out/blender/c003/camera.json --out out/blender/c003/render
        [--res 1280x720] [--frames 0-400] [--still 900] [--samples 32]
    (or: npm run blender -- c003, which runs every step; see scripts/blender.mjs)

anim.glb is the three.js scene of the film exported from the browser, with
every moving thing (people's bones, their mouths, the props, the chairs, the
doors) keyed on every frame. This file adds what the toon render fakes:

  - light: the set's own lamps (SetLayout.lights) as real lights, a soft key
    from the camera side, a cool rim through the window, a dim night sky;
  - surfaces: the flat toon colours become matte, slightly glossy materials,
    so cloth, skin and wood take the light differently;
  - the camera: the film's camera on every frame, with a shallow depth of
    field focused where it looks, and motion blur.

Coordinates: the film's world is +y up, +z towards the camera. The glTF
importer turns that into Blender's +z up as (x, -z, y), and the camera and
lamps below go through the same turn (`bl`).

Frames are written as PNG, and frames already on disk are skipped, so a long
render can be stopped and started again.
"""

import json
import math
import os
import sys
import time

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def arg(name, default=None):
    return argv[argv.index("--" + name) + 1] if "--" + name in argv else default


GLB = arg("glb")
CAMERA = arg("camera")
OUT = os.path.abspath(arg("out"))
RES = [int(v) for v in arg("res", "1280x720").split("x")]
STILL = arg("still")
FRAMES = arg("frames")
SAMPLES = int(arg("samples", "8"))

cam_data = json.load(open(CAMERA, encoding="utf-8"))
FPS = cam_data["fps"]
N = cam_data["frames"]


def bl(v):
    """film (x right, y up, z to camera) -> Blender (x, y, z up)"""
    return Vector((v[0], -v[2], v[1]))


def srgb(hexcol):
    h = hexcol.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]


# ----------------------------------------------------------------------------
# The scene
# ----------------------------------------------------------------------------

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = FPS
sc.frame_start = 0
sc.frame_end = N - 1

bpy.ops.import_scene.gltf(filepath=GLB)
sc.frame_start = 0
sc.frame_end = N - 1

# the browser's own lights go: this file lights the room properly
for ob in list(bpy.data.objects):
    if ob.type == "LIGHT":
        bpy.data.objects.remove(ob, do_unlink=True)

# ----------------------------------------------------------------------------
# Surfaces: the toon colours, as matte materials that take light
# ----------------------------------------------------------------------------

for mat in bpy.data.materials:
    if not mat.node_tree:
        continue
    bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        continue  # unlit: signs, the street, the bulbs keep their own colour
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.62
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.3
    base = bsdf.inputs["Base Color"].default_value
    # near-white things (plates, cloth, the waiter's shirt) a touch glossier
    if min(base[0], base[1], base[2]) > 0.7:
        bsdf.inputs["Roughness"].default_value = 0.45
    # a little sheen on skin-like warm mid tones reads as skin, not plastic
    if bsdf.inputs["Alpha"].default_value < 0.999 or (mat.blend_method if hasattr(mat, "blend_method") else "") == "BLEND":
        bsdf.inputs["Roughness"].default_value = 0.08
        if hasattr(mat, "surface_render_method"):
            mat.surface_render_method = "BLENDED"

for ob in bpy.data.objects:
    if ob.type == "MESH":
        for poly in ob.data.polygons:
            poly.use_smooth = True if len(ob.data.polygons) > 60 else poly.use_smooth

# ----------------------------------------------------------------------------
# Light
# ----------------------------------------------------------------------------


def light(name, kind, at, energy, color="#ffffff", size=0.1, aim=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = srgb(color)
    if kind == "AREA":
        ld.size = size
    else:
        ld.shadow_soft_size = size
    ob = bpy.data.objects.new(name, ld)
    sc.collection.objects.link(ob)
    ob.location = bl(at)
    if aim is not None:
        d = bl(aim) - bl(at)
        ob.rotation_mode = "QUATERNION"
        ob.rotation_quaternion = d.to_track_quat("-Z", "Y")
    return ob


LAMP_GAIN = float(arg("lamp-gain", "2.5"))
for i, L in enumerate(cam_data.get("lights", [])):
    light(f"lamp{i}", "POINT", L["p"], L["power"] * LAMP_GAIN, L["color"], size=0.15)

# the key: soft, warm, high on the camera side, so faces are lit
cams = cam_data["cams"]
look0 = cams[len(cams) // 2]["look"]
light("key", "AREA", [look0[0] + 1.2, 2.7, 2.2], 260, "#ffe8cc", size=2.5, aim=look0)
# the fill: from the other side, low and dim
light("fill", "AREA", [look0[0] - 2.2, 1.6, 1.6], 70, "#dfe6ff", size=3.0, aim=look0)
# night through the glass: a cool rim on hair and shoulders
light("rim", "AREA", [look0[0] - 0.4, 2.2, -3.2], 140, "#9fb6ff", size=2.0, aim=[look0[0], 1.1, -1.2])

world = bpy.data.worlds.new("night")
sc.world = world
bg = world.node_tree.nodes.get("Background")
bg.inputs["Color"].default_value = (*srgb("#2a3144"), 1)
bg.inputs["Strength"].default_value = 0.55

# ----------------------------------------------------------------------------
# The camera
# ----------------------------------------------------------------------------

cd = bpy.data.cameras.new("film")
cd.sensor_fit = "VERTICAL"
cd.sensor_height = 24.0
cd.clip_start = 0.05
cd.clip_end = 60
cd.dof.use_dof = True
cd.dof.aperture_fstop = float(arg("fstop", "2.8"))
cam = bpy.data.objects.new("film", cd)
sc.collection.objects.link(cam)
sc.camera = cam
cam.rotation_mode = "QUATERNION"

for f, c in enumerate(cams):
    pos, look = bl(c["pos"]), bl(c["look"])
    cam.location = pos
    cam.rotation_quaternion = (look - pos).to_track_quat("-Z", "Y")
    cd.lens = 12.0 / math.tan(math.radians(c["fov"]) / 2)
    cd.dof.focus_distance = (look - pos).length
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_quaternion", frame=f)
    cd.keyframe_insert("lens", frame=f)
    cd.keyframe_insert("dof.focus_distance", frame=f)

# ----------------------------------------------------------------------------
# Render settings
# ----------------------------------------------------------------------------

for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        sc.render.engine = engine
        break
    except TypeError:
        continue
ee = sc.eevee
for attr, val in (
    ("taa_render_samples", SAMPLES),
    ("use_raytracing", arg("rt", "1") == "1"),
    ("use_shadows", True),
    ("shadow_ray_count", 2),
    ("shadow_step_count", 8),
    ("use_fast_gi", True),
    ("fast_gi_distance", 1.5),
    ("use_gtao", True),
):
    if hasattr(ee, attr):
        try:
            setattr(ee, attr, val)
        except Exception:
            pass
if hasattr(ee, "ray_tracing_options"):
    try:
        ee.ray_tracing_options.resolution_scale = "2"
    except Exception:
        pass
sc.render.use_motion_blur = True
if hasattr(sc.render, "motion_blur_shutter"):
    sc.render.motion_blur_shutter = 0.4

sc.render.resolution_x, sc.render.resolution_y = RES
sc.render.resolution_percentage = 100
sc.render.film_transparent = False
sc.view_settings.view_transform = "AgX"
try:
    sc.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    pass
sc.view_settings.exposure = float(arg("exposure", "-0.3"))
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
sc.render.use_overwrite = False
sc.render.use_placeholder = True

os.makedirs(OUT, exist_ok=True)
_t = [time.time()]


def _tick(scene, *_):
    now = time.time()
    print(f"FILM frame {scene.frame_current}: {now - _t[0]:.1f}s", flush=True)
    _t[0] = now


bpy.app.handlers.render_post.append(_tick)
print(f"FILM: {N} frames at {RES[0]}x{RES[1]}, engine {sc.render.engine}, {SAMPLES} samples")

if STILL is not None:
    sc.frame_set(int(STILL))
    sc.render.filepath = os.path.join(OUT, f"still_{int(STILL):04d}.png")
    bpy.ops.render.render(write_still=True)
else:
    if FRAMES:
        a, b = [int(v) for v in FRAMES.split("-")]
        sc.frame_start, sc.frame_end = a, b
    sc.render.filepath = os.path.join(OUT, "####")
    bpy.ops.render.render(animation=True)
