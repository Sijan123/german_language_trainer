#!/usr/bin/env python3
"""
Local preview server. Only needed for working on the app — GitHub Pages serves
these files directly, and nothing in the app talks to a backend.

A plain `python -m http.server` would also work, except for two things.

One: it sends Last-Modified and no Cache-Control, so Chrome applies heuristic
freshness and happily serves an edited file for hours. That cost a whole
debugging session once, and the no-store header below is the original reason
this file exists.

Two: it does not do Range requests. It answers `Range: bytes=...` with a plain
200 and the whole file, over HTTP/1.0. A browser will tolerate that for a
script or an image, but Chrome will not play a <video> off it — the media
element asks for a byte range, gets the entire file with no 206, and either
refuses to start or plays without ever being able to seek. That cost a second
debugging session, this time blaming the video. So this serves 206 Partial
Content properly and speaks HTTP/1.1.

    python serve.py            → http://localhost:5173
    python serve.py 8080       → another port
"""

import http.server
import os
import re
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.dirname(os.path.abspath(__file__))

RANGE_RE = re.compile(r"^bytes=(\d*)-(\d*)$")

# Media is big and is not what you are editing, so it keeps the browser cache.
# Everything else stays uncacheable, which is the point of this server.
CACHEABLE = (".mp4", ".webm", ".m4a", ".mp3", ".wav", ".jpg", ".jpeg", ".png", ".woff2")


class Handler(http.server.SimpleHTTPRequestHandler):
    # HTTP/1.1, so connections are kept alive and 206 works the way Chrome
    # expects. Every response below sends an accurate Content-Length, which
    # 1.1 requires.
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ------------------------------------------------------------------ #

    def _cacheable(self):
        return self.path.split("?")[0].lower().endswith(CACHEABLE)

    def end_headers(self):
        if self._cacheable():
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "no-store, must-revalidate")
        # Tell the browser ranges are on offer before it has to guess.
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass                       # keep the console readable

    # ------------------------------------------------------------------ #

    def do_GET(self):
        served = self._send_range()
        if served is None:
            super().do_GET()

    def do_HEAD(self):
        # A HEAD never has a body, so the range machinery does not apply.
        super().do_HEAD()

    def _send_range(self):
        """
        Answer a Range request with 206, or return None to fall through.

        Returns None for anything it does not understand, so an odd header can
        only cost the client a full download rather than an error.
        """
        header = self.headers.get("Range")
        if not header:
            return None

        match = RANGE_RE.match(header.strip())
        if not match:
            return None

        path = self.translate_path(self.path)
        if os.path.isdir(path) or not os.path.isfile(path):
            return None

        size = os.path.getsize(path)
        first, last = match.group(1), match.group(2)

        if first == "":
            # "bytes=-500" means the last 500 bytes.
            if last == "":
                return None
            length = min(int(last), size)
            start = size - length
            end = size - 1
        else:
            start = int(first)
            end = int(last) if last else size - 1
            end = min(end, size - 1)

        if start >= size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return True

        length = end - start + 1
        try:
            f = open(path, "rb")
        except OSError:
            return None

        with f:
            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
            self.send_header("Content-Length", str(length))
            self.end_headers()

            f.seek(start)
            remaining = length
            try:
                while remaining > 0:
                    chunk = f.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                # A media element abandons ranges all the time — it is how
                # seeking works, and it is not worth a traceback.
                pass
        return True


class Server(http.server.ThreadingHTTPServer):
    """
    ThreadingHTTPServer, not HTTPServer: with keep-alive on, one video
    connection would otherwise hold the only thread and the rest of the page
    would never load.

    `allow_reuse_address` is off, and that matters more than it looks.
    HTTPServer turns it on, which means starting a second copy of this script
    on a port that already has one does not fail — it quietly adds a second
    listener, and from then on each request goes to whichever process the OS
    feels like. Edit a file, reload, and you get the answer from whichever
    server happens to take the connection. An afternoon disappeared into that
    once, blaming a video for being silent when the real problem was four
    stale servers stacked on one port. Better to refuse to start.
    """
    allow_reuse_address = False
    daemon_threads = True


if __name__ == "__main__":
    try:
        server = Server(("0.0.0.0", PORT), Handler)
    except OSError as exc:
        # Plain ASCII: the Windows console is not UTF-8 by default and an
        # error message that comes out as mojibake is a second problem on top
        # of the first one.
        print("Port %d is already in use (%s)." % (PORT, exc.strerror or exc))
        print("A server is already running there. Use it, stop it, or pick")
        print("another port:  python serve.py %d" % (PORT + 1))
        sys.exit(1)

    print("A2 Sprachtrainer  ->  http://localhost:%d" % PORT)
    print("Strg+C zum Beenden.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer beendet.")
    finally:
        server.server_close()
