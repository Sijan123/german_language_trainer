#!/usr/bin/env python3
"""
Local preview server. Only needed for working on the app — GitHub Pages serves
these files directly, and nothing in the app talks to a backend.

A plain `python -m http.server` would also work, except for one thing: it sends
Last-Modified and no Cache-Control, so Chrome applies heuristic freshness and
happily serves an edited file for hours. That cost a whole debugging session
once. The no-store header below is the entire reason this file exists.

    python serve.py            → http://localhost:5173
    python serve.py 8080       → another port
"""

import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass                       # keep the console readable


if __name__ == "__main__":
    print("A2 Sprachtrainer  ->  http://localhost:%d" % PORT)
    print("Strg+C zum Beenden.")
    try:
        http.server.HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\nServer beendet.")
