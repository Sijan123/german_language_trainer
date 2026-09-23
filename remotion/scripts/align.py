#!/usr/bin/env python3
"""
Word boundaries for the rendered dialogue clips, by forced alignment.

The karaoke in the film darkens each German word as it is actually spoken, and
that needs to know when each word starts. Piper writes one WAV per line and
tells us nothing about what happens inside it, so this puts the audio and the
text it is known to contain through torchaudio's MMS_FA aligner and reads the
boundaries back out.

Forced alignment, not recognition: the words are given, and the only question
is where in the waveform each one sits. That is a much easier problem than
transcription and it does not get the words wrong, which matters — a karaoke
highlight that disagrees with the subtitle under it is worse than none.

    python scripts/align.py c002 [c007 ...]

Writes remotion/src/data/words.json:

    { "c002": [ [ {"w": "Die", "a": 0.00, "b": 0.19, "ok": true,
                  "c": [["d", 0.00, 0.06], ["i", 0.06, 0.12], ...]}, ... ], ... ] }

Times are seconds from the start of that clip. `ok` is false where the aligner
could not place a token and the span was filled in from its neighbours, so the
renderer can tell an estimate from a measurement. `c` is the same thing one
letter at a time (romanized, so "ü" arrives as "u", "e"); the acted films
shape the mouths from it.

Needs torch + torchaudio:
    pip install torch torchaudio numpy --index-url https://download.pytorch.org/whl/cpu
The model (~1 GB) downloads itself on first run and is cached by torch.
"""

import json
import os
import subprocess
import sys
import unicodedata
import wave as wavefile

import numpy as np

import torch
import torchaudio
from torchaudio.pipelines import MMS_FA

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
ROOT = os.path.dirname(PROJ)


def dialogues():
    """The generated timing file, which already knows every clip's path."""
    with open(os.path.join(PROJ, "src", "data", "dialogues.json"), encoding="utf-8") as f:
        return json.load(f)


# The aligner's lexicon is lowercase latin letters and an apostrophe. German
# needs folding before it will match anything: umlauts to vowel+e is what a
# German speaker would write without the keys, and it is what the multilingual
# model was trained to expect.
FOLD = {"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss",
        "Ä": "ae", "Ö": "oe", "Ü": "ue"}


def romanize(word):
    out = []
    for ch in word:
        if ch in FOLD:
            out.append(FOLD[ch])
            continue
        ch = ch.lower()
        if ch.isalpha():
            # strip any remaining accents rather than dropping the letter
            plain = unicodedata.normalize("NFD", ch)
            plain = "".join(c for c in plain if unicodedata.category(c) != "Mn")
            out.append(plain if plain.isalpha() else "")
        elif ch == "'":
            out.append(ch)
    return "".join(out)


def decode_with_ffmpeg(path):
    """
    Anything that is not a PCM WAV, decoded to 16-bit mono PCM by ffmpeg.

    make-audio.py writes MP3 whenever ffmpeg is on PATH, and prunes the other
    extension afterwards — so the moment the audio is re-rendered on a machine
    with ffmpeg, every clip this script is asked to open is an MP3. The `wave`
    module cannot read those.

    ffmpeg is already a hard dependency of the render pipeline, so decoding
    through it costs nothing new. This is deliberately *not* TorchCodec: the
    point of reading the samples by hand is to keep one media stack in the
    project, and that has not changed.
    """
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path,
         "-f", "s16le", "-acodec", "pcm_s16le", "-ac", "1", "-"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    if out.returncode != 0 or not out.stdout:
        raise SystemExit("could not decode " + path + "\n" + out.stderr.decode("utf-8", "replace"))

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=sample_rate", "-of", "csv=p=0", path],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    rate = int(probe.stdout.decode().strip() or 22050)

    data = np.frombuffer(out.stdout, dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(data.copy()).unsqueeze(0), rate


def read_wav(path):
    """
    A clip as a mono float tensor.

    A PCM WAV is read with the standard library. torchaudio.load() went through
    TorchCodec in 2.11 and now refuses to open anything without it, and these
    are 16-bit PCM WAVs written by Piper, which the `wave` module has always
    been able to read — so there is no reason to add a second media stack to
    the project just to get samples out of them.

    Anything else goes through ffmpeg. See decode_with_ffmpeg.
    """
    if os.path.splitext(path)[1].lower() != ".wav":
        return decode_with_ffmpeg(path)

    with wavefile.open(path, "rb") as f:
        channels = f.getnchannels()
        width = f.getsampwidth()
        rate = f.getframerate()
        raw = f.readframes(f.getnframes())

    if width != 2:
        raise SystemExit("expected 16-bit PCM in " + path + ", got " + str(width * 8) + "-bit")

    data = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0
    if channels > 1:
        data = data.reshape(-1, channels).mean(axis=1)
    return torch.from_numpy(data.copy()).unsqueeze(0), rate


def align_clip(path, text, bundle, model, tokenizer, aligner, device):
    """Return [(word, start_s, end_s, aligned_bool, letters)] for one clip.

    `letters` is [[letter, start_s, end_s], ...] in the romanized spelling, or
    empty for a token the aligner could not place."""
    words = text.split()
    romanized = [romanize(w) for w in words]

    # Numerals and pure punctuation romanize to nothing. They still have to
    # occupy a slot in the output so the renderer can print the line as written,
    # so they are dropped from the alignment and filled in afterwards.
    keep = [i for i, r in enumerate(romanized) if r]
    if not keep:
        return [(w, 0.0, 0.0, False, []) for w in words]

    wave, sr = read_wav(path)
    if sr != bundle.sample_rate:
        wave = torchaudio.functional.resample(wave, sr, bundle.sample_rate)
    wave = wave.to(device)

    with torch.inference_mode():
        emission, _ = model(wave)
        tokens = tokenizer([romanized[i] for i in keep])
        spans = aligner(emission[0], tokens)

    # One frame of the emission covers this many seconds of audio.
    ratio = wave.shape[1] / emission.shape[1] / bundle.sample_rate

    placed = {}
    letters = {}
    for slot, span in zip(keep, spans):
        placed[slot] = (span[0].start * ratio, span[-1].end * ratio, True)
        # Each token of the span is one romanized letter. The acted films
        # shape the mouth from these; the karaoke only ever wanted the word.
        letters[slot] = [
            [romanized[slot][k], round(float(t.start * ratio), 4), round(float(t.end * ratio), 4)]
            for k, t in enumerate(span)
        ]

    total = wave.shape[1] / bundle.sample_rate
    out = []
    for i, w in enumerate(words):
        if i in placed:
            a, b, ok = placed[i]
        else:
            # Sit an unplaced token in the gap between its placed neighbours,
            # or against the end of the clip if there is no neighbour after it.
            before = max((j for j in placed if j < i), default=None)
            after = min((j for j in placed if j > i), default=None)
            a = placed[before][1] if before is not None else 0.0
            b = placed[after][0] if after is not None else total
            if b < a:
                b = a
            ok = False
        out.append((w, round(float(a), 4), round(float(b), 4), ok, letters.get(i, [])))

    # A word that ends after the next one starts makes the highlight jump
    # backwards. Clamp each end to the next start; the aligner rarely needs it.
    for i in range(len(out) - 1):
        w, a, b, ok, c = out[i]
        nxt = out[i + 1][1]
        if b > nxt:
            out[i] = (w, a, nxt, ok, c)

    return out


def main(ids):
    data = dialogues()

    print("loading MMS_FA (first run downloads ~1 GB) ...")
    bundle = MMS_FA
    device = torch.device("cpu")
    model = bundle.get_model().to(device)
    tokenizer = bundle.get_tokenizer()
    aligner = bundle.get_aligner()

    out_path = os.path.join(PROJ, "src", "data", "words.json")
    words = {}
    if os.path.exists(out_path):
        with open(out_path, encoding="utf-8") as f:
            words = json.load(f)

    for cid in ids:
        if cid not in data:
            raise SystemExit("no timing data for " + cid + " - run build-data.mjs first")
        d = data[cid]
        per_line = []
        shaky = 0
        for line in d["lines"]:
            clip = os.path.join(ROOT, line["clip"].replace("/", os.sep))
            got = align_clip(clip, line["de"], bundle, model, tokenizer, aligner, device)
            shaky += sum(1 for g in got if not g[3])
            per_line.append([{"w": w, "a": a, "b": b, "ok": ok, "c": c} for w, a, b, ok, c in got])
            print("  {} line {:>2}  {:>2} words  {}".format(
                cid, line["i"] + 1, len(got), line["de"][:46]))
        words[cid] = per_line
        print("{}: {} lines aligned, {} words fell back to interpolation".format(
            cid, len(per_line), shaky))

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("->", os.path.relpath(out_path, os.getcwd()))


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        raise SystemExit("usage: python scripts/align.py c002 [c007 ...]")
    main(args)
