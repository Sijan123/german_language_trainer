"""
The cast of the acted films, built in Blender.

    blender -b -P blender/cast.py -- [sijan shruti] [--preview <dir>]
    (or: npm run cast)

Writes public/models/cast/<name>.glb: one skinned mesh per character, rigged
to bones that match the joints src/acted/rig.ts solves, with shape keys for
the mouth and brows. Nothing is sculpted by hand and nothing is downloaded:
every surface is a signed distance field made of ellipsoids and capsules,
blended where they meet, turned into a mesh here and decimated. Re-run this
after changing it; the films pick up the new GLB on their next render.

Why distance fields: a body made of blended primitives has no seams at the
shoulders and elbows the way the old sphere-and-cylinder people did, and the
same distances that make the surface also say which bone each vertex belongs
to (the nearest primitive's) and which colour it is. Skinning weights and
materials come out of the shape rather than being painted.

Colours are not baked in. Each face carries a material *name* ("skin",
"sleeve", "trousers" ...) and Person3D.tsx paints it from the scene's Look3D,
so one model serves any costume.

Coordinates: everything below is written in the film's frame, the one rig.ts
uses: metres, x forward (the way the person faces), y up, z to their right,
feet at y = 0 (well, the ankle 4.5 cm up; see REST). Blender's own axes
differ (z up); `bl()` converts at the last moment, and the glTF exporter's
+Y-up conversion turns it back.

The rest pose: standing straight, arms 40 degrees out from the sides, palms
facing in and a little down, thumbs forward, fingers straight. Person3D.tsx
reads the rest pose back from the file, so nothing on that side assumes it.
"""

import math
import os
import sys

import bmesh
import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(PROJ, "public", "models", "cast")

# ----------------------------------------------------------------------------
# Who: the shape of each character. Colours live in the scene (Look3D).
# ----------------------------------------------------------------------------

CAST = {
    "sijan": dict(build="m", hair="short", beard=True, brows="thick", jacket=True, lanyard=False),
    "shruti": dict(build="f", hair="long", beard=False, brows="normal", jacket=False, lanyard=True),
}

# ----------------------------------------------------------------------------
# The skeleton at rest (1.76 m; rig.ts's P)
# ----------------------------------------------------------------------------

A = math.radians(40)  # arms out from the sides
CA, SA = math.cos(A), math.sin(A)

PELVIS = np.array([0.0, 0.905, 0.0])
CHEST_TOP = PELVIS + [0, 0.5, 0]
NECK = CHEST_TOP + [0, 0.035, 0]
HEAD = NECK + [0, 0.145, 0]  # the centre of the head
SPINE_MID = PELVIS + [0, 0.25, 0]


def side_sign(s):
    return 1.0 if s == "R" else -1.0


def shoulder(s):
    return CHEST_TOP + [0, -0.02, 0.19 * side_sign(s)]


def arm_dir(s):
    return np.array([0.0, -CA, SA * side_sign(s)])


def elbow(s):
    return shoulder(s) + 0.28 * arm_dir(s)


def wrist(s):
    return elbow(s) + 0.26 * arm_dir(s)


def hip(s):
    return PELVIS + [0, 0, 0.095 * side_sign(s)]


def knee(s):
    return hip(s) + [0, -0.43, 0]


def ankle(s):
    return knee(s) + [0, -0.43, 0]


def hand_frame(s):
    """Rest hand axes: x along the fingers, y out of the palm, z = x cross y.
    Same convention as rig.ts's Body.hand; the right thumb is on +z."""
    x = arm_dir(s)
    fwd = np.array([1.0, 0, 0])
    y = np.cross(fwd, x) if s == "R" else np.cross(x, fwd)
    y /= np.linalg.norm(y)
    z = np.cross(x, y)
    return np.stack([x, y, z], 1)  # columns


# ----------------------------------------------------------------------------
# Small maths
# ----------------------------------------------------------------------------


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def rot(axis, ang):
    axis = np.asarray(axis, float)
    axis = axis / np.linalg.norm(axis)
    x, y, z = axis
    c, s = math.cos(ang), math.sin(ang)
    C = 1 - c
    return np.array([
        [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
        [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
        [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
    ])


def bl(v):
    """film (x fwd, y up, z right) -> Blender (x, y, z up)"""
    v = np.asarray(v, float)
    return np.stack([v[..., 0], -v[..., 2], v[..., 1]], -1)


# ----------------------------------------------------------------------------
# Primitives
# ----------------------------------------------------------------------------


class Ell:
    """An ellipsoid. `R` turns its axes (columns) into the film frame."""

    def __init__(self, c, r, bone, mat, R=None):
        self.c = np.asarray(c, float)
        self.r = np.asarray(r, float)
        self.R = np.eye(3) if R is None else np.asarray(R, float)
        self.bone, self.mat = bone, mat

    def d(self, P):
        p = (P - self.c) @ self.R
        k0 = np.linalg.norm(p / self.r, axis=1)
        k1 = np.linalg.norm(p / (self.r * self.r), axis=1)
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-9)


class Cap:
    """A tapered capsule from a (radius ra) to b (radius rb)."""

    def __init__(self, a, b, ra, rb, bone, mat):
        self.a, self.b = np.asarray(a, float), np.asarray(b, float)
        self.ra, self.rb = ra, rb
        self.bone, self.mat = bone, mat

    def t(self, P):
        ba = self.b - self.a
        return np.clip(((P - self.a) @ ba) / (ba @ ba), 0.0, 1.0)

    def d(self, P):
        t = self.t(P)
        q = self.a + t[:, None] * (self.b - self.a)
        return np.linalg.norm(P - q, axis=1) - (self.ra + (self.rb - self.ra) * t)


class Fn:
    """Anything else: a distance function written out."""

    def __init__(self, f, bone, mat):
        self.f, self.bone, self.mat = f, bone, mat

    def d(self, P):
        return self.f(P)


class Family:
    """
    One surface. `field(P)` is the blended distance; `prims` are the parts it
    was made from, for deciding what bone and colour each point belongs to.
    `bones(P)` and `mats(P)` may be overridden where the nearest part is not
    the whole story (a waistband, a jaw).
    """

    def __init__(self, name, prims, field, lo, hi, h, faces, sigma=0.012):
        self.name, self.prims, self.field = name, prims, field
        self.lo, self.hi, self.h = np.asarray(lo, float), np.asarray(hi, float), h
        self.faces, self.sigma = faces, sigma
        self.bone_fn = None
        self.mat_fn = None
        self.keys = {}  # shape key name -> displacement function
        # planes (point, normal) along which colours change: the mesh is cut
        # along each before it is painted, so the edge is a clean line and
        # not the staircase of whatever faces happen to straddle it
        self.cuts = []

    def distances(self, P):
        return np.stack([p.d(P) for p in self.prims], 1)

    def weights(self, P):
        """{bone: weight array}, at most four bones per vertex, summing to 1"""
        if self.bone_fn:
            return self.bone_fn(P)
        D = self.distances(P)
        W = np.exp(-(D - D.min(1, keepdims=True)) / self.sigma)
        out = {}
        for i, p in enumerate(self.prims):
            if callable(p.bone):
                for b, w in p.bone(P).items():
                    out[b] = out.get(b, 0) + W[:, i] * w
            else:
                out[p.bone] = out.get(p.bone, 0) + W[:, i]
        return limit4(out)

    def materials(self, P):
        if self.mat_fn:
            return self.mat_fn(P)
        D = self.distances(P)
        best = D.argmin(1)
        names = np.empty(len(P), object)
        for i, p in enumerate(self.prims):
            m = best == i
            if not m.any():
                continue
            names[m] = p.mat(P[m]) if callable(p.mat) else p.mat
        return names


def limit4(out):
    names = list(out)
    W = np.stack([np.broadcast_to(out[n], out[names[0]].shape) for n in names], 1).astype(float)
    if W.shape[1] > 4:
        cut = np.argsort(-W, 1)[:, 4:]
        np.put_along_axis(W, cut, 0.0, 1)
    W /= np.maximum(W.sum(1, keepdims=True), 1e-9)
    return {n: W[:, i] for i, n in enumerate(names)}


# ----------------------------------------------------------------------------
# Distance field -> mesh (surface nets, then projected onto the surface)
# ----------------------------------------------------------------------------

CORNERS = [(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, 0), (0, 0, 1), (1, 0, 1), (0, 1, 1), (1, 1, 1)]
EDGES = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 2), (1, 3), (4, 6), (5, 7), (0, 4), (1, 5), (2, 6), (3, 7)]


def sample(field, lo, h, n):
    xs = lo[0] + h * np.arange(n[0])
    ys = lo[1] + h * np.arange(n[1])
    zs = lo[2] + h * np.arange(n[2])
    Y, Z = np.meshgrid(ys, zs, indexing="ij")
    F = np.empty(n, np.float32)
    per = max(1, 250_000 // Y.size)
    for i0 in range(0, n[0], per):
        i1 = min(n[0], i0 + per)
        X = np.repeat(xs[i0:i1], Y.size)
        P = np.stack([X, np.tile(Y.ravel(), i1 - i0), np.tile(Z.ravel(), i1 - i0)], 1)
        F[i0:i1] = field(P).reshape(i1 - i0, n[1], n[2])
    return F


def gradient(field, P, e=2e-4):
    g = np.zeros_like(P)
    for a in range(3):
        d = np.zeros(3)
        d[a] = e
        g[:, a] = (field(P + d) - field(P - d)) / (2 * e)
    n = np.linalg.norm(g, axis=1, keepdims=True)
    return g / np.maximum(n, 1e-9)


def polygonise(fam):
    lo, h = fam.lo, fam.h
    n = (np.ceil((fam.hi - lo) / h) + 1).astype(int)
    F = sample(fam.field, lo, h, n)
    ins = F < 0
    nc = n - 1
    sl = lambda a, b, c: (slice(a, a + nc[0]), slice(b, b + nc[1]), slice(c, c + nc[2]))
    anyin = np.zeros(nc, bool)
    allin = np.ones(nc, bool)
    for c in CORNERS:
        anyin |= ins[sl(*c)]
        allin &= ins[sl(*c)]
    active = anyin & ~allin
    act = np.nonzero(active)
    m = len(act[0])
    ids = -np.ones(nc, np.int64)
    ids[act] = np.arange(m)
    fv = [F[sl(*c)][act] for c in CORNERS]
    acc = np.zeros((m, 3))
    cnt = np.zeros(m)
    for e0, e1 in EDGES:
        f0, f1 = fv[e0], fv[e1]
        x = (f0 < 0) != (f1 < 0)
        t = np.where(x, f0 / np.where(x, f0 - f1, 1.0), 0.0)
        p0, p1 = np.array(CORNERS[e0], float), np.array(CORNERS[e1], float)
        acc += (p0 + t[:, None] * (p1 - p0)) * x[:, None]
        cnt += x
    V = lo + (np.stack(act, 1) + acc / cnt[:, None]) * h

    quads = []
    # edges along x, y, z; the four cells round each, in order
    e = ins[:-1, 1:-1, 1:-1] != ins[1:, 1:-1, 1:-1]
    I, J, K = np.nonzero(e)
    J, K = J + 1, K + 1
    quads.append(np.stack([ids[I, J - 1, K - 1], ids[I, J, K - 1], ids[I, J, K], ids[I, J - 1, K]], 1))
    e = ins[1:-1, :-1, 1:-1] != ins[1:-1, 1:, 1:-1]
    I, J, K = np.nonzero(e)
    I, K = I + 1, K + 1
    quads.append(np.stack([ids[I - 1, J, K - 1], ids[I, J, K - 1], ids[I, J, K], ids[I - 1, J, K]], 1))
    e = ins[1:-1, 1:-1, :-1] != ins[1:-1, 1:-1, 1:]
    I, J, K = np.nonzero(e)
    I, J = I + 1, J + 1
    quads.append(np.stack([ids[I - 1, J - 1, K], ids[I, J - 1, K], ids[I, J, K], ids[I - 1, J, K]], 1))
    Q = np.concatenate(quads)
    Q = Q[(Q >= 0).all(1)]

    # onto the surface: two Newton steps along the gradient
    for _ in range(3):
        V = V - fam.field(V)[:, None] * gradient(fam.field, V)

    # every quad facing out: compare its normal with the field's gradient
    c = V[Q].mean(1)
    nrm = np.cross(V[Q[:, 2]] - V[Q[:, 0]], V[Q[:, 3]] - V[Q[:, 1]])
    flip = (nrm * gradient(fam.field, c)).sum(1) < 0
    Q[flip] = Q[flip][:, ::-1]
    return V, Q


# ----------------------------------------------------------------------------
# Blender objects
# ----------------------------------------------------------------------------


def mesh_object(name, V, faces):
    me = bpy.data.meshes.new(name)
    me.from_pydata(bl(V).tolist(), [], [list(map(int, f)) for f in faces])
    me.validate()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def evaluated_copy(ob):
    """The object's mesh with its modifiers applied, as a plain mesh."""
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    ob.modifiers.clear()
    old = ob.data
    ob.data = me
    bpy.data.meshes.remove(old)
    return ob


def verts(ob):
    co = np.empty(len(ob.data.vertices) * 3)
    ob.data.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    return np.stack([co[:, 0], co[:, 2], -co[:, 1]], 1)  # back to the film frame


def face_centres(ob):
    co = np.empty(len(ob.data.polygons) * 3)
    ob.data.polygons.foreach_get("center", co)
    co = co.reshape(-1, 3)
    return np.stack([co[:, 0], co[:, 2], -co[:, 1]], 1)


MATERIALS = {}


def material(name):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
        m.diffuse_color = PREVIEW.get(name, (0.8, 0.8, 0.8, 1))
    return m


# only for the preview renders; the film paints from Look3D
PREVIEW = {
    "skin": (0.49, 0.22, 0.10, 1), "hair": (0.02, 0.012, 0.009, 1), "lips": (0.47, 0.13, 0.11, 1),
    "mouth": (0.10, 0.015, 0.02, 1), "teeth": (0.9, 0.88, 0.83, 1), "eyeWhite": (1, 1, 1, 1),
    "iris": (0.02, 0.015, 0.013, 1), "blush": (0.58, 0.22, 0.16, 1), "top": (0.84, 0.88, 0.9, 1),
    "sleeve": (0.05, 0.15, 0.27, 1), "cuff": (1, 1, 1, 1), "collar": (1, 1, 1, 1),
    "trousers": (0.03, 0.035, 0.05, 1), "shoes": (0.04, 0.027, 0.02, 1), "jacket": (0.05, 0.15, 0.27, 1),
    "lining": (0.025, 0.07, 0.13, 1), "lanyard": (0.03, 0.11, 0.25, 1), "card": (0.9, 0.88, 0.83, 1),
    "cardStripe": (0.03, 0.11, 0.25, 1), "brow": (0.02, 0.012, 0.009, 1),
}


def assign_materials(ob, names):
    order = sorted(set(names))
    for n in order:
        ob.data.materials.append(material(n))
    idx = np.array([order.index(n) for n in names], np.int32)
    ob.data.polygons.foreach_set("material_index", idx)


def set_normals(ob, N):
    ob.data.normals_split_custom_set_from_vertices(bl(N).tolist())


def set_weights(ob, W):
    for bone, w in W.items():
        vg = ob.vertex_groups.get(bone) or ob.vertex_groups.new(name=bone)
        for i in np.nonzero(w > 1e-3)[0]:
            vg.add([int(i)], float(w[i]), "REPLACE")


def add_keys(ob, keys, V):
    if not keys:
        return
    ob.shape_key_add(name="Basis", from_mix=False)
    for name, fn in keys.items():
        k = ob.shape_key_add(name=name, from_mix=False)
        k.data.foreach_set("co", bl(V + fn(V)).ravel())


def decimate(ob, faces):
    have = len(ob.data.polygons)
    if have <= faces:
        return
    mod = ob.modifiers.new("dec", "DECIMATE")
    mod.ratio = faces / (2 * have)  # the ratio is of triangles; these are quads
    mod.use_collapse_triangulate = True
    evaluated_copy(ob)


def build_family(fam, arm):
    """Distance field -> decimated, skinned, painted mesh parented to `arm`."""
    V, Q = polygonise(fam)
    ob = mesh_object(fam.name, V, Q)
    decimate(ob, fam.faces)
    cut(ob, fam.cuts)
    finish(ob, fam, arm, fam.field)
    return ob


def cut(ob, planes):
    if not planes:
        return
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    for co, no in planes:
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-5, plane_co=bl(co).tolist(), plane_no=bl(no).tolist())
    bm.to_mesh(ob.data)
    bm.free()


def finish(ob, fam, arm, field=None):
    V = verts(ob)
    if field is not None:
        set_normals(ob, gradient(field, V))
    assign_materials(ob, fam.materials(face_centres(ob)))
    set_weights(ob, fam.weights(V))
    add_keys(ob, fam.keys, V)
    skin(ob, arm)


def skin(ob, arm):
    ob.parent = arm
    mod = ob.modifiers.new("skin", "ARMATURE")
    mod.object = arm


# ----------------------------------------------------------------------------
# The skeleton
# ----------------------------------------------------------------------------

FINGERS = ["index", "middle", "ring", "pinky"]


def hand_parts(s, g):
    """
    The hand in its own frame (x along the fingers, y out of the palm, z
    across, this hand's thumb on +t z). Returns the palm and each finger as
    a chain of (start, end, radius) in hand-local metres.
    """
    t = side_sign(s)
    k = g["hand"]
    fingers = {}
    spec = {  # knuckle z, spread about y, phalanx lengths, radius
        "index": (0.027, 0.07, [0.036, 0.024, 0.02], 0.0098),
        "middle": (0.009, 0.0, [0.041, 0.027, 0.021], 0.0101),
        "ring": (-0.009, -0.06, [0.038, 0.025, 0.02], 0.0096),
        "pinky": (-0.026, -0.14, [0.029, 0.02, 0.018], 0.0086),
    }
    for f, (z, spread, L, r) in spec.items():
        d = rot([0, 1, 0], spread * t) @ np.array([1.0, 0, 0])
        p = np.array([0.088 - abs(z) * 0.25, 0.0, z * t]) * k
        chain = []
        for i, l in enumerate(L):
            q = p + d * l * k
            chain.append((p, q, r * k * (1 - 0.08 * i)))
            p = q
        fingers[f] = chain
    d = np.array([0.72, 0.28, 0.63 * t])
    d /= np.linalg.norm(d)
    p = np.array([0.012, 0.006, 0.02 * t]) * k
    chain = []
    for i, (l, r) in enumerate([(0.042, 0.0145), (0.032, 0.0112), (0.027, 0.0100)]):
        q = p + d * l * k
        chain.append((p, q, r * k))
        p = q
        d = rot([0, 1, 0], 0.12 * t) @ d  # the thumb curves in towards the fingers
    fingers["thumb"] = chain
    return fingers


def build_armature(name, g):
    ad = bpy.data.armatures.new(name + "_rig")
    arm = bpy.data.objects.new(name + "_rig", ad)
    bpy.context.scene.collection.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    eb = ad.edit_bones

    def bone(n, head, tail, parent=None):
        b = eb.new(n)
        b.head = bl(head).tolist()
        b.tail = bl(tail).tolist()
        if parent:
            b.parent = eb[parent]
        b.use_connect = False
        return b

    bone("pelvis", PELVIS, PELVIS + [0, 0.1, 0])
    bone("spine1", PELVIS + [0, 0.0001, 0], SPINE_MID, "pelvis")
    bone("spine2", SPINE_MID, CHEST_TOP, "spine1")
    bone("neck", CHEST_TOP, NECK, "spine2")
    bone("head", NECK, HEAD + [0, 0.14, 0], "neck")
    bone("jaw", HEAD + [-0.02, -0.035, 0], HEAD + [0.1, -0.09, 0], "head")
    for s in "LR":
        t = side_sign(s)
        eye = HEAD + [0.098, 0.03, 0.047 * t]
        bone("eye_" + s, eye, eye + [0.03, 0, 0], "head")
        bone("lid_" + s, eye + [0, 0.0001, 0], eye + [0.03, 0.01, 0], "head")
        bone("clav_" + s, CHEST_TOP + [0, 0.0001, 0], shoulder(s), "spine2")
        bone("upperarm_" + s, shoulder(s), elbow(s), "clav_" + s)
        bone("forearm_" + s, elbow(s), wrist(s), "upperarm_" + s)
        H = hand_frame(s)
        bone("hand_" + s, wrist(s), wrist(s) + H @ np.array([0.088, 0, 0]) * g["hand"], "forearm_" + s)
        for f, chain in hand_parts(s, g).items():
            parent = "hand_" + s
            for i, (a, b, _) in enumerate(chain):
                n = f"{f}{i + 1}_{s}"
                bone(n, wrist(s) + H @ a, wrist(s) + H @ b, parent)
                parent = n
        bone("thigh_" + s, hip(s), knee(s), "pelvis")
        bone("shin_" + s, knee(s), ankle(s), "thigh_" + s)
        bone("foot_" + s, ankle(s), ankle(s) + [0.12, -0.04, 0], "shin_" + s)
    if g["jacket"]:
        bone("jacket_L", JACKET_HINGE, JACKET_HINGE + [0, 0.12, 0], "spine2")
    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


# ----------------------------------------------------------------------------
# Proportions by build
# ----------------------------------------------------------------------------

BUILDS = {
    "m": dict(
        pelvis=([0, 0.93, 0], [0.12, 0.12, 0.175]),
        waist=([0, 1.07, 0], [0.108, 0.14, 0.158]),
        chest=([0.005, 1.25, 0], [0.118, 0.17, 0.178]),
        upper=([0, 1.36, 0], [0.095, 0.07, 0.2]),
        bust=None,
        shoulder=0.058, upperarm=(0.05, 0.044), forearm=(0.043, 0.036),
        thigh=(0.078, 0.06), shin=(0.058, 0.047), neck=0.047, hand=1.0,
        waistband=0.955, jaw=0.08, chin=0.036,
    ),
    "f": dict(
        pelvis=([0, 0.93, 0], [0.12, 0.125, 0.18]),
        waist=([0, 1.075, 0], [0.095, 0.13, 0.135]),
        chest=([0.0, 1.24, 0], [0.105, 0.16, 0.162]),
        upper=([0, 1.355, 0], [0.085, 0.065, 0.18]),
        bust=([0.06, 1.235, 0.07], [0.056, 0.06, 0.062]),
        shoulder=0.05, upperarm=(0.045, 0.04), forearm=(0.038, 0.031),
        thigh=(0.076, 0.057), shin=(0.055, 0.043), neck=0.041, hand=0.92,
        waistband=0.975, jaw=0.074, chin=0.03,
    ),
}

JACKET_HINGE = np.array([0.065, 1.1, -0.17])


def body_family(g):
    b = BUILDS[g["build"]]
    torso = [
        Ell(*b["pelvis"], "pelvis", None),
        Ell(*b["waist"], "spine1", None),
        Ell(*b["chest"], "spine2", None),
        Ell(*b["upper"], "spine2", None),
    ]
    if b["bust"]:
        c, r = b["bust"]
        torso += [Ell([c[0], c[1], c[2]], r, "spine2", None), Ell([c[0], c[1], -c[2]], r, "spine2", None)]

    waistband = b["waistband"]

    def torso_mat(P):
        m = np.where(P[:, 1] < waistband, "trousers", "top").astype(object)
        return m

    for p in torso:
        p.mat = torso_mat

    neck = Cap(CHEST_TOP + [0, -0.03, 0], NECK + [0, 0.1, 0], b["neck"], b["neck"] * 0.96, None, "skin")

    def neck_bones(P):
        t = neck.t(P)
        w = smoothstep(0.05, 0.4, t)
        return {"spine2": 1 - w, "neck": w}

    neck.bone = neck_bones

    arms = {}
    for s in "LR":
        sh = Ell(shoulder(s), [b["shoulder"]] * 3, None, "sleeve")
        sh.bone = (lambda s: lambda P: {"clav_" + s: 0.35, "upperarm_" + s: 0.65})(s)
        ua = Cap(shoulder(s), elbow(s), *b["upperarm"], "upperarm_" + s, "sleeve")
        fa = Cap(elbow(s), wrist(s) + arm_dir(s) * 0.004, *b["forearm"], "forearm_" + s, None)
        fa.mat = (lambda fa: lambda P: np.where(fa.t(P) > 0.9, "cuff", "sleeve").astype(object))(fa)
        arms[s] = [sh, ua, fa]

    legs = {}
    for s in "LR":
        th = Cap(hip(s), knee(s), *b["thigh"], "thigh_" + s, "trousers")
        sh = Cap(knee(s), ankle(s) + [0, -0.01, 0], *b["shin"], "shin_" + s, "trousers")
        a = ankle(s)

        def shoe_d(P, a=a):
            e = Ell(a + [0.055, -0.045, 0], [0.13, 0.05, 0.056], None, None).d(P)
            return np.maximum(e, (a[1] - 0.082) - P[:, 1])

        shoe = Fn(shoe_d, "foot_" + s, "shoes")
        legs[s] = [th, sh, shoe]

    prims = torso + [neck] + arms["L"] + arms["R"] + legs["L"] + legs["R"]

    def field(P):
        t = torso[0].d(P)
        for p in torso[1:]:
            t = smin(t, p.d(P), 0.05)
        d = smin(t, neck.d(P), 0.02)
        for s in "LR":
            sh, ua, fa = arms[s]
            a = smin(smin(sh.d(P), ua.d(P), 0.02), fa.d(P), 0.015)
            d = np.minimum(d, smin(t, a, 0.025))
            th, sn, shoe = legs[s]
            l = smin(th.d(P), sn.d(P), 0.02)
            l = smin(l, shoe.d(P), 0.004)
            d = np.minimum(d, smin(t, l, 0.03))
        return d

    fam = Family("body", prims, field, [-0.2, -0.06, -0.62], [0.24, 1.62, 0.62], 0.0055, 16000, sigma=0.014)
    fam.cuts.append((np.array([0.0, waistband, 0.0]), np.array([0.0, 1.0, 0.0])))
    for s in "LR":
        fa = arms[s][2]
        fam.cuts.append((fa.a + 0.9 * (fa.b - fa.a), arm_dir(s)))
    return fam, torso


def hand_family(s, g):
    H = hand_frame(s)
    W = wrist(s)
    k = g["hand"]
    t = side_sign(s)
    world = lambda p: W + H @ p
    palm = Ell(world(np.array([0.045, 0.0, 0.0]) * k), np.array([0.052, 0.019, 0.044]) * k, "hand_" + s, "skin", H)
    heel = Ell(world(np.array([0.018, 0.004, 0.012 * t]) * k), np.array([0.03, 0.02, 0.034]) * k, "hand_" + s, "skin", H)
    prims = [palm, heel]
    for f, chain in hand_parts(s, g).items():
        for i, (a, b, r) in enumerate(chain):
            prims.append(Cap(world(a), world(b), r, r * 0.94, f"{f}{i + 1}_{s}", "skin"))

    chains = {}
    for p in prims[2:]:
        chains.setdefault(p.bone.split("_")[0][:-1], []).append(p)

    def field(P):
        base = smin(palm.d(P), heel.d(P), 0.012)
        d = base
        # each finger joins the palm softly, but not its neighbours
        for f, ps in chains.items():
            c = ps[0].d(P)
            for p in ps[1:]:
                c = smin(c, p.d(P), 0.004)
            d = np.minimum(d, smin(base, c, 0.012 if f == "thumb" else 0.008))
        return d

    c = W + H @ (np.array([0.06, 0, 0]) * k)
    fam = Family("hand_" + s, prims, field, c - 0.13, c + 0.13, 0.0016, 4500, sigma=0.004)
    return fam


# ----------------------------------------------------------------------------
# The head
# ----------------------------------------------------------------------------

MOUTH_Y = -0.058
SLIT = dict(c=[0.13, MOUTH_Y, 0.0], r=[0.022, 0.0036, 0.029])


def hl(P):
    """world -> head-local (the head is not turned at rest)"""
    return P - HEAD


def jaw_weight(P):
    x, y, z = hl(P).T
    width = 0.0022 + 0.028 * smoothstep(0.022, 0.075, np.abs(z)) + 0.02 * smoothstep(0.1, 0.03, x)
    w = smoothstep(MOUTH_Y + width, MOUTH_Y - width, y)
    return w * smoothstep(-0.06, 0.03, x)


def head_bones(P):
    w = jaw_weight(P)
    return {"head": 1 - w, "jaw": w}


def mouth_keys():
    """Shape keys, as displacement functions of the rest position."""

    def corner(P):
        x, y, z = hl(P).T
        dz = np.abs(z) - 0.029
        r2 = (dz / 0.014) ** 2 + ((y - MOUTH_Y) / 0.013) ** 2 + ((x - 0.125) / 0.03) ** 2
        return np.exp(-r2), np.sign(z)

    def centre(P):
        x, y, z = hl(P).T
        r2 = (z / 0.03) ** 2 + ((y - MOUTH_Y) / 0.016) ** 2 + ((x - 0.13) / 0.03) ** 2
        return np.exp(-r2)

    def wide(P):
        g, sz = corner(P)
        return np.stack([-0.002 * g, 0 * g, 0.011 * g * sz], 1)

    def round_(P):
        g, sz = corner(P)
        c = centre(P)
        return np.stack([0.007 * c - 0.002 * g, 0.0 * g, -0.014 * g * sz * (1 - 0.3 * c)], 1)

    def smile(P):
        g, sz = corner(P)
        x, y, z = hl(P).T
        cheek = np.exp(-(((np.abs(z) - 0.06) / 0.022) ** 2 + ((y + 0.03) / 0.02) ** 2 + ((x - 0.1) / 0.03) ** 2))
        return np.stack([-0.004 * g, 0.008 * g + 0.004 * cheek, 0.006 * g * sz], 1)

    return {"wide": wide, "round": round_, "smile": smile}


def head_family(g):
    b = BUILDS[g["build"]]
    H = HEAD
    E = lambda c, r, mat="skin", R=None: Ell(H + np.array(c), r, head_bones, mat, R)
    skull = E([0, 0, 0], [0.125, 0.132, 0.118])
    mid = E([0.052, -0.04, 0], [0.086, 0.066, 0.092])
    jaw = E([0.048, -0.077, 0], [0.078, 0.046, b["jaw"]])
    chin = E([0.1, -0.098, 0], [0.028, 0.024, b["chin"]])
    ridge = E([0.086, 0.062, 0], [0.04, 0.018, 0.088])
    nose = E([0.121, -0.003, 0], [0.028, 0.026, 0.019])
    tip = E([0.139, -0.014, 0], [0.016, 0.015, 0.018])
    ears = [E([-0.006, -0.008, 0.113 * t], [0.022, 0.034, 0.015]) for t in (1, -1)]
    cheeks = [E([0.07, -0.02, 0.06 * t], [0.05, 0.04, 0.045]) for t in (1, -1)]
    sockets = [Ell(H + [0.104, 0.03, 0.047 * t], [0.024] * 3, None, None) for t in (1, -1)]
    slit = Ell(H + SLIT["c"], SLIT["r"], None, None)
    prims = [skull, mid, jaw, chin, ridge, nose, tip] + ears + cheeks

    def field(P):
        d = smin(skull.d(P), mid.d(P), 0.03)
        d = smin(d, jaw.d(P), 0.03)
        d = smin(d, chin.d(P), 0.02)
        d = smin(d, ridge.d(P), 0.02)
        for c in cheeks:
            d = smin(d, c.d(P), 0.02)
        d = smin(d, smin(nose.d(P), tip.d(P), 0.012), 0.012)
        for e in ears:
            d = smin(d, e.d(P), 0.008)
        for s in sockets:
            d = smax(d, -s.d(P), 0.008)
        return smax(d, -slit.d(P), 0.003)

    fam = Family("head", prims, field, H - [0.16, 0.17, 0.16], H + [0.18, 0.16, 0.16], 0.0019, 11000)
    fam.bone_fn = head_bones

    def mats(P):
        m = np.full(len(P), "skin", object)
        x, y, z = hl(P).T
        ds = slit.d(P)
        lips = ((z / 0.033) ** 2 + ((y - MOUTH_Y) / 0.0105) ** 2 < 1) & (x > 0.112)
        m[lips] = "lips"
        m[(ds < 0.0006) & (x > 0.1)] = "mouth"
        return m

    fam.mat_fn = mats
    fam.keys = mouth_keys()
    fam.cuts = [(H + [0, MOUTH_Y + 0.0105 * 0.8, 0], np.array([0, 1.0, 0])),
                (H + [0, MOUTH_Y - 0.0105 * 0.8, 0], np.array([0, 1.0, 0]))]
    return fam


def hair_family(g):
    H = HEAD
    if g["hair"] == "short":
        parts = [
            ([-0.025, 0.032, 0], [0.128, 0.13, 0.125]),
            ([0.035, 0.1, 0.04], [0.07, 0.05, 0.06]),
            ([0.03, 0.105, -0.04], [0.07, 0.05, 0.06]),
            ([-0.04, 0.115, 0], [0.08, 0.05, 0.08]),
            ([0.085, 0.078, 0], [0.04, 0.03, 0.07]),
            ([0.03, -0.02, 0.105], [0.03, 0.05, 0.016]),
            ([0.03, -0.02, -0.105], [0.03, 0.05, 0.016]),
        ]
    else:
        parts = [
            ([-0.022, 0.028, 0], [0.132, 0.138, 0.128]),
            ([0.075, 0.085, 0.04], [0.055, 0.04, 0.065]),
            ([0.075, 0.085, -0.04], [0.055, 0.04, 0.065]),
            ([-0.07, -0.13, 0], [0.075, 0.2, 0.125]),
            ([0.0, -0.1, 0.112], [0.055, 0.14, 0.03]),
            ([0.0, -0.1, -0.112], [0.055, 0.14, 0.03]),
        ]
    prims = [Ell(H + np.array(c), r, "head", "hair") for c, r in parts]
    # keep the face clear: nothing of the hair in front of the forehead line
    face = Ell(H + [0.105, -0.025, 0], [0.095, 0.132, 0.1], None, None)

    def field(P):
        d = prims[0].d(P)
        for p in prims[1:]:
            d = smin(d, p.d(P), 0.025)
        return smax(d, -face.d(P), 0.01)

    lo = H - [0.2, 0.36 if g["hair"] == "long" else 0.14, 0.17]
    fam = Family("hair", prims, field, lo, H + [0.17, 0.2, 0.17], 0.0025, 5000)
    if g["hair"] == "long":
        def bones(P):
            y = hl(P)[:, 1]
            w = smoothstep(-0.08, -0.26, y) * 0.7
            return {"head": 1 - w, "spine2": w}
        fam.bone_fn = bones
    else:
        fam.bone_fn = lambda P: {"head": np.ones(len(P))}
    return fam


def beard_family(g):
    H = HEAD
    parts = [
        ([0.038, -0.085, 0], [0.098, 0.058, 0.104]),
        ([0.08, -0.11, 0], [0.05, 0.036, 0.06]),
    ]
    prims = [Ell(H + np.array(c), r, head_bones, "hair") for c, r in parts]
    mous = Ell(H + [0.13, -0.036, 0], [0.018, 0.012, 0.038], head_bones, "hair")
    # the lips and the mouth stay clear of it
    clear = Ell(H + [0.14, MOUTH_Y - 0.004, 0], [0.024, 0.012, 0.03], None, None)
    prims.append(mous)

    def field(P):
        d = smin(prims[0].d(P), prims[1].d(P), 0.02)
        d = smax(d, -clear.d(P), 0.006)
        return smin(d, mous.d(P), 0.006)

    fam = Family("beard", prims, field, H - [0.1, 0.19, 0.14], H + [0.17, 0.0, 0.14], 0.002, 4500)
    fam.bone_fn = head_bones
    fam.keys = mouth_keys()
    return fam


# ----------------------------------------------------------------------------
# Small parts, made directly
# ----------------------------------------------------------------------------


def uv_sphere(seg=24, rings=16):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    V = np.array([v.co[:] for v in bm.verts])
    F = [[v.index for v in f.verts] for f in bm.faces]
    bm.free()
    # bmesh's sphere has its poles on z; turn them onto x (a rotation, so the
    # faces keep facing out)
    return np.stack([V[:, 2], V[:, 1], -V[:, 0]], 1), F


class Plain:
    """A part with fixed bone weights and one material per face."""

    def __init__(self, mats, bones, keys=None):
        self._m, self._b = mats, bones
        self.keys = keys or {}

    def materials(self, P):
        return self._m(P) if callable(self._m) else np.full(len(P), self._m, object)

    def weights(self, P):
        return {b: np.full(len(P), w) for b, w in self._b.items()}


def part(name, V, F, spec, arm, normals=None):
    ob = mesh_object(name, V, F)
    if normals is not None:
        set_normals(ob, normals)
    else:
        for p in ob.data.polygons:
            p.use_smooth = True
    finish(ob, spec, arm)
    return ob


def eyes_and_lids(arm, g):
    S, F = uv_sphere(32, 20)
    GS, GF = uv_sphere(10, 6)
    for s in "LR":
        t = side_sign(s)
        c = HEAD + [0.098, 0.03, 0.047 * t]
        r = np.array([0.026, 0.026, 0.026])
        V = c + S * r
        cosang = S[:, 0]

        def mats(P, c=c):
            d = P - c
            d /= np.linalg.norm(d, axis=1, keepdims=True)
            m = np.full(len(P), "eyeWhite", object)
            m[d[:, 0] > 0.84] = "iris"
            return m

        part("eye_" + s, V, F, Plain(mats, {"eye_" + s: 1.0}), arm, normals=S)
        # the catch-light, fixed in the eye
        cl = c + np.array([0.0245, 0.007, 0.004]) + GS * 0.0034
        part("glint_" + s, cl, GF, Plain("eyeWhite", {"eye_" + s: 1.0}), arm, normals=GS)

        # the upper lid: a cap of skin a little larger than the eye, reaching
        # below its middle, turned up out of the way (open) at rest. Made with
        # its poles up and down and cut along a ring, so the rim is a clean
        # circle rather than a staircase of faces.
        U = S @ rot([1, 0, 0], math.pi / 2).T
        UF = F
        keep = U[:, 1] > -0.33
        idx = -np.ones(len(U), int)
        idx[keep] = np.arange(keep.sum())
        LF = [[idx[i] for i in f] for f in UF if all(keep[i] for i in f)]
        Rz = rot([0, 0, 1], math.radians(62))  # open: the lid's edge well up
        L = c + (U[keep] * (r * 1.1)) @ Rz.T
        part("lid_" + s, L, LF, Plain("skin", {"lid_" + s: 1.0}), arm, normals=U[keep] @ Rz.T)


def brows(arm, g):
    S, F = uv_sphere(16, 10)
    thick = g["brows"] == "thick"
    r = np.array([0.011, 0.0095 if thick else 0.0068, 0.03 if thick else 0.027])
    for s in "LR":
        t = side_sign(s)
        c = HEAD + [0.1, 0.074, 0.05 * t]
        R = rot([1, 0, 0], t * -0.08) @ rot([0, 0, 1], 0.18)
        V = S * r
        # a gentle arch: the ends lower than the middle
        V[:, 1] -= 18 * (V[:, 2] ** 2) * 0.35
        V = c + V @ R.T

        def up(P, c=c, t=t):
            z = (P - c)[:, 2] * t
            return np.stack([0 * z, 0.014 - 0.1 * z * 0.12, 0 * z], 1)

        part("brow_" + s, V, F, Plain("hair", {"head": 1.0}, {"brows": up}), arm)


def mouth_inside(arm):
    S, F = uv_sphere(16, 10)
    # teeth: along the top of the mouth, just inside the lips
    V = HEAD + [0.112, MOUTH_Y + 0.004, 0] + S * [0.012, 0.0055, 0.024]
    part("teeth", V, F, Plain("teeth", {"head": 1.0}), arm)
    # the dark of the mouth behind them, split between head and jaw
    V = HEAD + [0.095, MOUTH_Y - 0.004, 0] + S * [0.03, 0.02, 0.03]

    part("mouthInside", V, F, Plain("mouth", {"head": 0.5, "jaw": 0.5}), arm)


def blush(arm):
    S, F = uv_sphere(12, 8)
    for s in "LR":
        t = side_sign(s)
        c = HEAD + [0.096, -0.024, 0.066 * t]
        V = c + S * [0.008, 0.01, 0.017] @ rot([0, 1, 0], t * 0.55).T
        up = lambda P: np.tile([0.0, 0.006, 0.0], (len(P), 1))
        part("blush_" + s, V, F, Plain("blush", {"head": 1.0}, {"smile": up}), arm)


def collar(arm, g):
    """a shirt collar under a jacket, a neckline otherwise: a flattened ring"""
    n = 40
    m = 8
    b = BUILDS[g["build"]]
    R0 = b["neck"] + 0.01
    V = []
    for i in range(n):
        a = 2 * math.pi * i / n
        # tilted: lower at the front
        cx, cz = math.cos(a), math.sin(a)
        for j in range(m):
            u = 2 * math.pi * j / m
            rr = R0 + 0.008 * math.cos(u)
            y = 0.012 * math.sin(u) - 0.018 * max(0.0, cx)
            V.append(CHEST_TOP + [rr * cx * 1.05, y + 0.03, rr * cz * 1.08])
    V = np.array(V)
    F = [[i * m + j, i * m + (j + 1) % m, ((i + 1) % n) * m + (j + 1) % m, ((i + 1) % n) * m + j]
         for i in range(n) for j in range(m)]
    part("collar", V, F, Plain("collar", {"spine2": 0.6, "neck": 0.4}), arm)


def lanyard(arm, torso_field):
    """the official's ID on its ribbon, lying on the chest"""
    def on_chest(y, z, lift):
        # march in from the front to the chest's surface at this height
        x = np.full(len(y), 0.3)
        for _ in range(40):
            P = np.stack([x, y, z], 1)
            x = x - torso_field(P) * 0.9
        return np.stack([x + lift, y, z], 1)

    card_y = 1.13
    V, F = [], []
    for t in (1, -1):
        ys = np.linspace(1.40, card_y + 0.03, 14)
        zs = t * np.linspace(0.055, 0.01, 14)
        mid = on_chest(ys, zs, 0.004)
        base = len(V)
        for i, p in enumerate(mid):
            V.append(p + [0, 0, -0.006])
            V.append(p + [0, 0, 0.006])
        for i in range(13):
            a = base + 2 * i
            F.append([a, a + 1, a + 3, a + 2])
    V = np.array(V)
    part("lanyard", V, F, Plain("lanyard", {"spine2": 1.0}), arm)

    c = on_chest(np.array([card_y]), np.array([0.0]), 0.006)[0]
    card = [[0, 0.026, 0.02], [0, 0.026, -0.02], [0, -0.026, -0.02], [0, -0.026, 0.02]]
    Vc = np.array([c + p for p in card] + [c + [-0.003, 0, 0] + p for p in card])
    Fc = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
    part("card", Vc, Fc, Plain("card", {"spine2": 1.0}), arm)
    s = c + [0.0008, 0.012, 0]
    stripe = np.array([s + [0, 0.004, 0.016], s + [0, 0.004, -0.016], s + [0, -0.004, -0.016], s + [0, -0.004, 0.016]])
    part("cardStripe", stripe, [[0, 3, 2, 1]], Plain("cardStripe", {"spine2": 1.0}), arm)


def jacket(arm, g, torso, body):
    """
    A jacket: a thin solid shell a little outside the torso, cut open in a V
    at the front, at the hem and round the neck. It closes over the shoulders
    and the arms come out through it: the sleeves are the body's own arms,
    painted the same colour, so the join does not show (a hole cut there
    showed from above). All the cuts are made in
    the distance field, so the edges come out clean.

    The left front panel has a narrow seam cut round it, along the side and
    across the top, which leaves it a separate piece on its own bone: it
    swings open on that side seam for the inside pocket. Faces on the inside
    of the shell are the lining.
    """
    PANEL = (math.pi / 2 + 0.1, math.pi / 2 + 1.0)  # round the body from the front, to the left
    PANEL_TOP = 1.27  # below the armhole

    def base(P):
        t = torso[0].d(P)
        for p in torso[1:]:
            t = smin(t, p.d(P), 0.05)
        for s in "LR":
            t = smin(t, Ell(shoulder(s) + [0, 0.005, 0], [0.062] * 3, None, None).d(P), 0.03)
        return t - 0.013

    def phi(P):
        return np.arctan2(P[:, 0] / 0.72, P[:, 2] / 1.2)

    def field(P):
        x, y, z = P.T
        d = np.abs(base(P)) - 0.0035
        vw = 0.018 + 0.075 * smoothstep(1.12, 1.4, y)
        d = smax(d, -np.maximum(np.abs(z) - vw, -x), 0.004)            # the V
        d = np.maximum(d, 0.84 - y)                                      # the hem
        d = smax(d, -np.maximum(np.hypot(x, z) - 0.075, 1.37 - y), 0.004)  # the neck
        # the panel's seams: down the side, and across the top
        r = np.hypot(x / 0.72, z / 1.2)
        side = np.abs(phi(P) - PANEL[1]) * r - 0.0025
        top = np.maximum(np.abs(y - PANEL_TOP) - 0.0025, np.maximum(PANEL[0] - phi(P), phi(P) - PANEL[1]) * r)
        d = np.maximum(d, -np.maximum(side, PANEL_TOP - y + 0.003) * 1.0)
        d = np.maximum(d, -top)
        return d

    fam = Family("jacket", torso, field, [-0.19, 0.8, -0.28], [0.19, 1.46, 0.28], 0.0022, 12000)
    V, Q = polygonise(fam)
    ob = mesh_object("jacket", V, Q)
    decimate(ob, fam.faces)
    V = verts(ob)
    set_normals(ob, gradient(field, V))

    # inside or out: the inner skin is where the base field is negative
    C = face_centres(ob)
    lining = base(C) < 0
    ob.data.materials.append(material("jacket"))
    ob.data.materials.append(material("lining"))
    ob.data.polygons.foreach_set("material_index", lining.astype(np.int32))

    # which pieces are the panel: connected parts whose middle is in it
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bm.verts.ensure_lookup_table()
    part_of = -np.ones(len(bm.verts), int)
    n = 0
    for v in bm.verts:
        if part_of[v.index] >= 0:
            continue
        stack = [v]
        part_of[v.index] = n
        while stack:
            u = stack.pop()
            for e in u.link_edges:
                w = e.other_vert(u)
                if part_of[w.index] < 0:
                    part_of[w.index] = n
                    stack.append(w)
        n += 1
    bm.free()
    onpanel = np.zeros(len(V), bool)
    for i in range(n):
        m = part_of == i
        c = V[m].mean(0, keepdims=True)
        if PANEL[0] < phi(c)[0] < PANEL[1] and c[0, 1] < PANEL_TOP:
            onpanel |= m

    # the body's own weights, from the parts the shell sits on (the shoulders
    # follow the arms)
    near = [p for p in body.prims if p.mat != "shoes"]
    W = Family("t", near, None, [0, 0, 0], [0, 0, 0], 1, 0, sigma=0.02).weights(V)
    for bname in W:
        W[bname] = np.where(onpanel, 0.0, W[bname])
    W["jacket_L"] = onpanel.astype(float)
    set_weights(ob, W)
    skin(ob, arm)
    return ob


# ----------------------------------------------------------------------------
# One character
# ----------------------------------------------------------------------------


def build(name, preview=None):
    g = CAST[name]
    g = dict(g, hand=BUILDS[g["build"]]["hand"])
    bpy.ops.wm.read_factory_settings(use_empty=True)
    arm = build_armature(name, g)

    body, torso = body_family(g)
    build_family(body, arm)
    for s in "LR":
        build_family(hand_family(s, g), arm)
    build_family(head_family(g), arm)
    build_family(hair_family(g), arm)
    if g["beard"]:
        build_family(beard_family(g), arm)
    eyes_and_lids(arm, g)
    brows(arm, g)
    mouth_inside(arm)
    if not g["beard"]:
        blush(arm)
    collar(arm, g)
    if g["jacket"]:
        jacket(arm, g, torso, body)
    if g["lanyard"]:
        def tf(P):
            t = torso[0].d(P)
            for p in torso[1:]:
                t = smin(t, p.d(P), 0.05)
            return t
        lanyard(arm, tf)

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name + ".glb")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_yup=True,
        export_apply=False,
        export_skins=True,
        export_morph=True,
        export_morph_normal=False,
        export_animations=False,
        export_materials="EXPORT",
        export_normals=True,
        export_texcoords=False,
    )
    faces = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == "MESH")
    for o in bpy.data.objects:
        if o.type == "MESH":
            print(f"  {o.name}: {len(o.data.polygons)}")
    print(f"CAST {name}: {path} ({os.path.getsize(path) / 1e6:.1f} MB, {faces} faces)")
    if preview:
        render_preview(name, preview)


def render_preview(name, out):
    """front, three-quarter and side, flat-lit, for checking the shape"""
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_WORKBENCH"
    sc.display.shading.light = "STUDIO"
    sc.display.shading.color_type = "MATERIAL"
    sc.render.resolution_x, sc.render.resolution_y = 900, 1200
    sc.render.film_transparent = False
    world = bpy.data.worlds.new("w")
    sc.world = world
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    sc.collection.objects.link(cam)
    sc.camera = cam
    cam.data.lens = 50
    views = {"front": (0, 1.05, 4.2), "threeq": (40, 1.05, 4.2), "side": (90, 1.05, 4.2), "face": (25, 1.6, 0.9)}
    for vn, (ang, h, dist) in views.items():
        a = math.radians(ang)
        tgt = np.array([0.0, h if vn != "face" else 1.6, 0.0])
        pos = tgt + np.array([math.cos(a) * dist, 0.0 if vn != "face" else 0.03, math.sin(a) * dist])
        cam.location = bl(pos).tolist()
        d = bl(tgt - pos)
        cam.rotation_mode = "QUATERNION"
        from mathutils import Vector
        cam.rotation_quaternion = Vector(d.tolist()).to_track_quat("-Z", "Y")
        sc.render.filepath = os.path.join(out, f"{name}-{vn}.png")
        bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    preview = None
    if "--preview" in argv:
        i = argv.index("--preview")
        preview = argv[i + 1]
        del argv[i:i + 2]
    names = argv or list(CAST)
    for n in names:
        build(n, preview)
