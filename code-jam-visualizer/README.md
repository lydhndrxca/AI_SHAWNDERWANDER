# Code Jam Visualizer

A full-screen audio visualizer that converts any audio file into ToeJam & Earl-style FM funk, then plays it back with audio-reactive GLSL shaders. Behaves like a screensaver — move the mouse and it stops.

## Quick Start

```bash
cd code-jam-visualizer
npm install
npm start
```

## How It Works

1. **Drop an audio file** (MP3, WAV, FLAC, etc.) onto the menu screen
2. The app analyzes the file — detects BPM, musical key, and energy profile
3. A procedural ToeJam & Earl-style funk track is generated matching the detected BPM and key
4. Click **PLAY** to go full-screen with the audio-reactive visualizer
5. **Move the mouse** to stop and return to the menu
6. Or click **PLAY DEFAULT** to skip file loading and hear a random funk jam

## The Funkifier

When you load an audio file, the app:
- **Detects BPM** using spectral flux onset detection + autocorrelation
- **Detects key** using chroma features + the Krumhansl-Schmuckler algorithm
- **Generates a brand new funk track** in that BPM and key, styled after ToeJam & Earl's Sega Genesis soundtrack:
  - FM synthesis slap bass (YM2612-inspired FMSynth patches)
  - Wah-wah lead with AutoFilter modulation
  - Jazzy chord stabs (m7, m9, dom7, 7#9 voicings) in offbeat funk patterns
  - Breakbeat drums with ghost snare hits and open hi-hat accents
  - Dorian/blues scale melodies with call-and-response phrasing
  - Funk chord progressions inspired by Herbie Hancock and The Headhunters

## Tech Stack

- **Electron** — Desktop shell, full-screen management
- **Three.js** — Full-screen WebGL shader quad
- **Tone.js** — FM synthesis engine, procedural composition
- **Web Audio API** — FFT analysis, audio file decoding
- **GLSL** — Custom fragment shader (plasma, tunnel, beat flash, chromatic aberration)

## The Visualizer

A fragment shader driven by real-time FFT analysis of the generated music:
- Plasma interference with audio-reactive distortion
- Tunnel distortion with bass-driven scroll speed
- FBM noise warp modulated by kick energy
- Beat flash on snare/RMS spikes
- Treble sparkle from hi-hat energy
- Chromatic aberration + vignette
