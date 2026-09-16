# Solar System — Observatory (phone-first)

Interactive 3D orrery built with Vite, React, TypeScript, React Three Fiber, Drei, and Tailwind CSS v4. Portrait-first UI (~390px): full-bleed WebGL canvas, horizontal world chips, peekable bottom sheet, compact time bar, and settings behind a gear icon.

## Features

- Sun, Mercury–Neptune, Ceres, Pluto, moons (Moon, Io, Europa, Ganymede, Callisto, Titan, Triton, Charon), Halley’s Comet
- OrbitControls: drag to look, scroll / pinch to zoom
- Select a world → bottom sheet with description + stats
- Play/pause and time scales: 1 day, 1 week, 1 month, 1 year, 10 yr, 100 yr
- Toggles: orbits, labels, moons, theatre/compact scale (**compact default on**)
- Guided tour visiting several worlds
- **Reset to today** — simulation always initializes to the real current date
- Intro splash + first-run tip (“Drag to look · Pinch to zoom”)
- Prefs (orbits / labels / moons / scale) persisted in `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Capacitor note

The Vite `dist/` output is ready to copy into a Capacitor app’s `www/` folder later. Capacitor is **not** wired up in this repo yet — keep the web build portable.

## Stack

- Vite + React 19 + TypeScript
- `@react-three/fiber` + `@react-three/drei` + Three.js
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Fonts: Cormorant Garamond + Outfit (Google Fonts)

## License

Private / educational observatory model.
