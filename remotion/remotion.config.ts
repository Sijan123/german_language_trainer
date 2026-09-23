import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
/* The audio is 22 kHz mono speech; there is nothing above 128 kbps to keep. */
Config.setAudioCodec("aac");
/* The acted films are WebGL (src/acted/). ANGLE is the renderer that works
   headless on Windows; the drawn films do not care either way. */
Config.setChromiumOpenGlRenderer("angle");
