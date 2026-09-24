/*
 * Rebuild the acted films' characters in Blender.
 *
 *   npm run cast                 both
 *   npm run cast -- sijan        one
 *   npm run cast -- --preview <dir>   also render front/side/face PNGs
 *
 * Runs blender/cast.py headless and writes public/models/cast/<name>.glb.
 * Blender is found at $BLENDER, or at the usual Windows install path.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const proj = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  process.env.BLENDER,
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe",
  "/Applications/Blender.app/Contents/MacOS/Blender",
  "blender"
].filter(Boolean);
const blender = candidates.find((c) => c === "blender" || fs.existsSync(c));

execFileSync(blender, ["-b", "-P", path.join(proj, "blender", "cast.py"), "--", ...process.argv.slice(2)], {
  cwd: proj,
  stdio: "inherit"
});
