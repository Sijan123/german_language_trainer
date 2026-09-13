#!/usr/bin/env python3
"""
Render dialogue audio with Piper, a free neural text-to-speech engine that runs
offline on your own machine.

Why this exists: the browser's built-in German voices are mediocre, and they
differ on every device. Rendering the lines once means everyone hears the same
thing, including phones with no German voice installed at all.

    pip install piper-tts
    python make-audio.py                 # renders c001-c010
    python make-audio.py --first 20      # the first twenty
    python make-audio.py c001-c020       # a range
    python make-audio.py --all           # every dialogue
    python make-audio.py c001 c042       # just these
    python make-audio.py --clean         # wipe audio/ and render again from scratch
    python make-audio.py --tidy          # just delete the demo folder and orphans
    python make-audio.py --demo          # audition voices before committing
    python make-audio.py --speed 1.3     # slower still
    python make-audio.py --list-voices

Re-rendering overwrites clips in place, so a plain re-run is enough after a voice
change. Use --clean when the format changed (a run without ffmpeg leaves WAVs) or
when you want to be certain nothing old survives.

Voice models download on first run into voices/ (about 60 MB each).

MP3 needs ffmpeg on PATH. Without it the WAVs are kept, which works but is
roughly eight times the size — on Windows, `winget install Gyan.FFmpeg` is the
quickest fix.
"""

import argparse
import glob
import os
import re
import shutil
import subprocess
import sys
import wave

ROOT = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(ROOT, "audio")
VOICE_DIR = os.path.join(ROOT, "voices")
MANIFEST = os.path.join(ROOT, "js", "audio-manifest.js")

# Shruti gets a female voice, Sijan a male one. Settled by ear: kerstin was
# preferred over ramona back to back.
#
# Piper's German set is lopsided - thorsten (male) has low/medium/high while
# every named female voice stops at low or x_low - so the two sides will not be
# equally polished. de_DE-mls-medium is the alternative: one model, 236 speakers,
# 22 kHz, written as NAME#ID to pick one. Run --demo to audition.
VOICES = {
    "Shruti": "de_DE-kerstin-low",
    "Sijan": "de_DE-thorsten-medium",
}

# Slower than natural, because this is listening practice at A2. length_scale
# multiplies duration, so 1.0 is the voice's own pace and higher is slower.
DEFAULT_SPEED = 1.2

DEMO_TEXT = "Guten Morgen! Wie war dein Tag? Ich habe heute lange gearbeitet."
DEMO_NAMED = ["de_DE-kerstin-low", "de_DE-ramona-low", "de_DE-eva_k-x_low",
              "de_DE-thorsten-medium"]
DEMO_MLS = [0, 12, 27, 41, 58, 73, 96, 120, 145, 170, 199, 228]

DEFAULT_IDS = ["c%03d" % n for n in range(1, 11)]


def die(message):
    print("\n  " + message + "\n")
    sys.exit(1)


def load_conversations():
    """
    Read the dialogues out of the JS module.

    The data lives in conversations.js because that is where the app wants it;
    rather than keep a second copy in JSON, we pull the object literals out with
    a regex. It is narrow on purpose — it only has to understand the one shape
    that file is written in.
    """
    path = os.path.join(ROOT, "js", "conversations.js")
    if not os.path.isfile(path):
        die("js/conversations.js not found - run this from the project folder.")

    source = open(path, encoding="utf-8").read()
    out = []
    for block in re.finditer(r'\{\s*id:\s*"(c\d+)"(.*?)\n  \}', source, re.S):
        cid, body = block.group(1), block.group(2)
        lines = []
        for line in re.finditer(r'\{\s*s:\s*"(\w+)",\s*de:\s*"((?:[^"\\]|\\.)*)"', body):
            lines.append({"s": line.group(1), "de": line.group(2).replace('\\"', '"')})
        if lines:
            out.append({"id": cid, "lines": lines})
    if not out:
        die("Could not read any dialogues out of js/conversations.js.")
    return out


def find_model(name):
    """
    Locate a voice model on disk.

    Piper stopped auto-downloading voices, and where `download_voices` puts them
    depends on the version, so look in the obvious places rather than assuming.
    """
    candidates = [
        os.path.join(VOICE_DIR, name + ".onnx"),
        os.path.join(ROOT, name + ".onnx"),
    ]
    candidates += glob.glob(os.path.join(os.path.expanduser("~"), "**", name + ".onnx"),
                            recursive=False)
    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def download_model(name):
    """Fetch a voice, showing Piper's own output so a failure is diagnosable."""
    os.makedirs(VOICE_DIR, exist_ok=True)
    print("  Downloading %s (about 60 MB) ..." % name)
    result = subprocess.run(
        [sys.executable, "-m", "piper.download_voices", name, "--data-dir", VOICE_DIR],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "").strip()
        die("Downloading %s failed.\n\n  Piper said:\n  %s" % (name, detail.replace("\n", "\n  ")))

    path = find_model(name)
    if not path:
        die("%s downloaded but no .onnx turned up. Look in %s" % (name, VOICE_DIR))
    return path


def expand_ids(ids, order):
    """Accept single ids and `c001-c020` ranges, keeping the file's own order."""
    out = []
    for item in ids:
        if "-" in item:
            first, last = item.split("-", 1)
            if first not in order or last not in order:
                die("Range %s: unknown id." % item)
            lo, hi = order.index(first), order.index(last)
            if lo > hi:
                lo, hi = hi, lo
            out.extend(order[lo:hi + 1])
        else:
            out.append(item)
    seen = set()
    return [i for i in out if not (i in seen or seen.add(i))]


def parse_spec(spec):
    """`de_DE-mls-medium#42` -> ("de_DE-mls-medium", 42). No # means no speaker."""
    if "#" in spec:
        name, sid = spec.split("#", 1)
        return name, int(sid)
    return spec, None


def piper_voice(name, cache):
    """Load a model once and reuse it — speakers of one model share the model."""
    if name in cache:
        return cache[name]
    try:
        from piper import PiperVoice
    except ImportError:
        die("Piper is not installed. Run:  pip install piper-tts")
    path = find_model(name) or download_model(name)
    print("  Loading %s" % os.path.basename(path))
    cache[name] = PiperVoice.load(path)
    return cache[name]


def synth_config(speed, speaker_id):
    from piper import SynthesisConfig
    return SynthesisConfig(length_scale=speed, speaker_id=speaker_id)


def to_mp3(wav_path, mp3_path):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
         "-ac", "1", "-b:a", "64k", mp3_path],
        check=True,
    )
    os.remove(wav_path)


def write_manifest(counts, ext):
    """
    Merge into whatever is already rendered, so partial runs accumulate.

    The extension is recorded per dialogue because a run without ffmpeg leaves
    WAVs behind, and the app has to know which file to ask for.
    """
    existing = {}
    if os.path.isfile(MANIFEST):
        for hit in re.finditer(r'"(c\d+)":\s*\{\s*n:\s*(\d+),\s*ext:\s*"(\w+)"',
                               open(MANIFEST, encoding="utf-8").read()):
            existing[hit.group(1)] = (int(hit.group(2)), hit.group(3))
    for cid, n in counts.items():
        existing[cid] = (n, ext)

    body = ",\n".join('  "%s": { n: %d, ext: "%s" }' % (k, existing[k][0], existing[k][1])
                      for k in sorted(existing))
    open(MANIFEST, "w", encoding="utf-8").write(
        "/*\n"
        " * Which dialogues have rendered audio, how many lines, and in what format.\n"
        " *\n"
        " * The app checks this before building a clip URL, so a dialogue without audio\n"
        " * never fires a 404 - it just uses the browser voice. Written by make-audio.py;\n"
        " * edit that, not this.\n"
        " *\n"
        " * audio/<id>/01.<ext>, 02.<ext> ...\n"
        " */\n\n"
        "export const AUDIO = {\n" + body + "\n};\n"
    )


def wipe_audio():
    """Start from nothing — the only honest way to re-render with a new voice."""
    if os.path.isdir(AUDIO_DIR):
        shutil.rmtree(AUDIO_DIR)
        print("  Removed audio/ entirely.")
    if os.path.isfile(MANIFEST):
        open(MANIFEST, "w", encoding="utf-8").write(
            "/*\n"
            " * Which dialogues have rendered audio, how many lines, and in what format.\n"
            " *\n"
            " * Written by make-audio.py; edit that, not this.\n"
            " */\n\n"
            "export const AUDIO = {};\n"
        )
        print("  Reset js/audio-manifest.js.")


def manifest_entries():
    if not os.path.isfile(MANIFEST):
        return {}
    return {
        hit.group(1): (int(hit.group(2)), hit.group(3))
        for hit in re.finditer(r'"(c\d+)":\s*\{\s*n:\s*(\d+),\s*ext:\s*"(\w+)"',
                               open(MANIFEST, encoding="utf-8").read())
    }


def prune_folder(cid, keep_count, keep_ext):
    """
    Drop anything in a dialogue's folder that the current render did not write.

    Two things end up stale: the other extension, when a run without ffmpeg left
    WAVs behind and a later run produced MP3s; and high-numbered files, when a
    dialogue lost a line since it was last rendered.
    """
    folder = os.path.join(AUDIO_DIR, cid)
    if not os.path.isdir(folder):
        return 0
    removed = 0
    for name in os.listdir(folder):
        stem, ext = os.path.splitext(name)
        ext = ext.lstrip(".")
        keep = ext == keep_ext and stem.isdigit() and 1 <= int(stem) <= keep_count
        if not keep:
            os.remove(os.path.join(folder, name))
            removed += 1
    return removed


def tidy(verbose=True):
    """Remove the demo scratch and any dialogue folder the manifest no longer lists."""
    removed = []
    demo = os.path.join(AUDIO_DIR, "_demo")
    if os.path.isdir(demo):
        shutil.rmtree(demo)
        removed.append("_demo/")

    known = manifest_entries()
    if os.path.isdir(AUDIO_DIR):
        for name in sorted(os.listdir(AUDIO_DIR)):
            path = os.path.join(AUDIO_DIR, name)
            if not os.path.isdir(path):
                continue
            if name not in known:
                shutil.rmtree(path)
                removed.append(name + "/")
            else:
                count, ext = known[name]
                n = prune_folder(name, count, ext)
                if n:
                    removed.append("%s/ (%d stale file%s)" % (name, n, "" if n == 1 else "s"))

    if verbose:
        if removed:
            print("\n  Removed: " + ", ".join(removed))
        else:
            print("\n  Nothing to remove.")
    return removed


def folder_size(path):
    return sum(
        os.path.getsize(os.path.join(dirpath, f))
        for dirpath, _, files in os.walk(path) for f in files
    )


def render_demo(speed, have_ffmpeg):
    """
    Render one sentence in every candidate voice, so the choice is made by ear.

    Which of 236 anonymous audiobook readers sounds female is not something a
    name can tell you, and it is not something I should guess on your behalf.
    """
    folder = os.path.join(AUDIO_DIR, "_demo")
    os.makedirs(folder, exist_ok=True)
    cache = {}
    made = []

    for name in DEMO_NAMED:
        voice = piper_voice(name, cache)
        stem = os.path.join(folder, name)
        with wave.open(stem + ".wav", "wb") as handle:
            voice.synthesize_wav(DEMO_TEXT, handle, syn_config=synth_config(speed, None))
        if have_ffmpeg:
            to_mp3(stem + ".wav", stem + ".mp3")
        made.append(name)
        print("\r  %d rendered" % len(made), end="", flush=True)

    mls = piper_voice("de_DE-mls-medium", cache)
    for sid in DEMO_MLS:
        stem = os.path.join(folder, "de_DE-mls-medium-%03d" % sid)
        with wave.open(stem + ".wav", "wb") as handle:
            mls.synthesize_wav(DEMO_TEXT, handle, syn_config=synth_config(speed, sid))
        if have_ffmpeg:
            to_mp3(stem + ".wav", stem + ".mp3")
        made.append(sid)
        print("\r  %d rendered" % len(made), end="", flush=True)

    print("\n\n  Listen to audio/_demo/ and pick one.")
    print("  A file named de_DE-mls-medium-042 means the voice spec is")
    print("  de_DE-mls-medium#42 — put that in VOICES at the top of this file,")
    print("  or pass it as --shruti de_DE-mls-medium#42\n")


def main():
    parser = argparse.ArgumentParser(description="Render dialogue audio with Piper.")
    parser.add_argument("ids", nargs="*", help="conversation ids (default: the first ten)")
    parser.add_argument("--all", action="store_true", help="render every dialogue")
    parser.add_argument("--first", type=int, metavar="N",
                        help="render the first N dialogues")
    parser.add_argument("--demo", action="store_true",
                        help="render one sentence in each candidate voice and stop")
    parser.add_argument("--speed", type=float, default=DEFAULT_SPEED,
                        help="higher is slower; 1.0 is the voice's own pace (default %.2f)"
                             % DEFAULT_SPEED)
    parser.add_argument("--shruti", help="voice spec for Shruti, e.g. de_DE-mls-medium#42")
    parser.add_argument("--sijan", help="voice spec for Sijan")
    parser.add_argument("--clean", action="store_true",
                        help="delete audio/ and the manifest first, then render from scratch")
    parser.add_argument("--tidy", action="store_true",
                        help="remove the demo folder and any orphaned clips, then stop")
    parser.add_argument("--list-voices", action="store_true", help="show the German voices and exit")
    args = parser.parse_args()

    if args.list_voices:
        print("\n  German Piper voices (quality tiers as published):\n")
        for name in ["de_DE-thorsten-low", "de_DE-thorsten-medium", "de_DE-thorsten-high",
                     "de_DE-thorsten_emotional-medium", "de_DE-karlsson-low",
                     "de_DE-pavoque-low", "de_DE-kerstin-low", "de_DE-ramona-low",
                     "de_DE-eva_k-x_low", "de_DE-mls-medium"]:
            print("    " + name)
        print("\n  de_DE-mls-medium has 236 speakers: write de_DE-mls-medium#42.")
        print("  Run --demo to hear a sample of them.\n")
        return

    if args.tidy:
        print("\n  Tidying audio/ ...")
        tidy()
        print()
        return

    voices_wanted = dict(VOICES)
    if args.shruti:
        voices_wanted["Shruti"] = args.shruti
    if args.sijan:
        voices_wanted["Sijan"] = args.sijan

    have_ffmpeg = shutil.which("ffmpeg") is not None
    ext = "mp3" if have_ffmpeg else "wav"
    if not have_ffmpeg:
        print("\n  ffmpeg not found - keeping WAV files, roughly eight times larger.")
        print("  On Windows:  winget install Gyan.FFmpeg   (then run this again)")

    if args.demo:
        print("\n  Rendering %d sample voices at speed %.2f ...\n"
              % (len(DEMO_NAMED) + len(DEMO_MLS), args.speed))
        render_demo(args.speed, have_ffmpeg)
        return

    if args.clean:
        print("\n  Clean rebuild:")
        wipe_audio()

    conversations = load_conversations()
    by_id = {c["id"]: c for c in conversations}

    order = [c["id"] for c in conversations]

    if args.all:
        wanted = order
    elif args.first:
        wanted = order[:args.first]
    elif args.ids:
        wanted = expand_ids(args.ids, order)
    else:
        wanted = [i for i in DEFAULT_IDS if i in by_id]

    unknown = [i for i in wanted if i not in by_id]
    if unknown:
        die("Unknown ids: " + ", ".join(unknown))
    if not wanted:
        die("Nothing to render.")

    total_lines = sum(len(by_id[i]["lines"]) for i in wanted)
    print("\n  Rendering %d lines across %d dialogues at speed %.2f."
          % (total_lines, len(wanted), args.speed))
    print("  Shruti: %s\n  Sijan:  %s\n" % (voices_wanted["Shruti"], voices_wanted["Sijan"]))

    cache = {}
    setup = {}
    for speaker, spec in voices_wanted.items():
        name, sid = parse_spec(spec)
        setup[speaker] = (piper_voice(name, cache), synth_config(args.speed, sid))
    print()

    counts = {}
    done = 0
    for cid in wanted:
        folder = os.path.join(AUDIO_DIR, cid)
        os.makedirs(folder, exist_ok=True)
        for index, line in enumerate(by_id[cid]["lines"], start=1):
            stem = os.path.join(folder, "%02d" % index)
            voice, config = setup.get(line["s"]) or setup["Shruti"]
            try:
                with wave.open(stem + ".wav", "wb") as handle:
                    voice.synthesize_wav(line["de"], handle, syn_config=config)
                if have_ffmpeg:
                    to_mp3(stem + ".wav", stem + ".mp3")
            except Exception as error:               # noqa: BLE001 - show the real cause
                die("Failed on %s line %d (%s)\n\n  %s: %s"
                    % (cid, index, line["de"][:40], type(error).__name__, error))
            done += 1
            print("\r  %d / %d" % (done, total_lines), end="", flush=True)
        counts[cid] = len(by_id[cid]["lines"])
        prune_folder(cid, counts[cid], ext)      # drop the other extension, stale indices

    write_manifest(counts, ext)
    tidy(verbose=False)                          # demo scratch and orphaned dialogues
    print("\n\n  Done. audio/ is now %.1f MB." % (folder_size(AUDIO_DIR) / 1024 / 1024))
    print("  js/audio-manifest.js updated - reload the page and the clips are used.\n")


if __name__ == "__main__":
    main()
