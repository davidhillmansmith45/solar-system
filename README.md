# Solar System — Observatory (phone-first)

Interactive 3D orrery built with Vite, React, TypeScript, React Three Fiber, Drei, and Tailwind CSS v4. Portrait-first UI (~390px): full-bleed WebGL canvas, horizontal world chips, peekable bottom sheet, compact time bar, and settings behind a gear icon.

- **App name:** Solar System  
- **Application ID:** `com.davidsmith.solarsystem`  
- **Web assets:** Vite `dist/` (Capacitor `webDir`)  
- **Native project:** `android/`

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

## Run locally (web)

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Android (Capacitor)

Prerequisites on your PC:

- Node.js 20+ (project uses Capacitor 7)
- [Android Studio](https://developer.android.com/studio) (recent stable recommended)
- Android SDK with **API 36** (target/compile SDK) via SDK Manager

### Sync and open in Android Studio

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Or open the `android/` folder directly in Android Studio (**File → Open → select `android/`**).

After changing web source, rebuild and sync before running on device:

```bash
npm run build
npx cap sync android
```

### Run on a device / emulator

1. Open `android/` in Android Studio  
2. Wait for Gradle sync  
3. Select a device or emulator  
4. Click **Run**

### Generate a signed AAB for Google Play

Do **not** commit keystores or passwords to this repo.

1. In Android Studio: **Build → Generate Signed Bundle / APK…**  
2. Choose **Android App Bundle**  
3. Create a new keystore (or use an existing one) and store it **outside** the repo  
4. Select the **release** build type  
5. Build the `.aab` (output under something like `android/app/release/`)  
6. Upload the AAB in [Google Play Console](https://play.google.com/console) for app `com.davidsmith.solarsystem`

CLI alternative (after configuring signing in `android/app/build.gradle` with a local `keystore.properties` that is gitignored):

```bash
cd android
./gradlew bundleRelease
```

## Play Console notes

- A Play Console developer account (**$25** one-time) is still required.  
- Create the app listing with package name **`com.davidsmith.solarsystem`**.  
- Provide store listing assets (icon, screenshots, description).  
- Complete content rating, target audience, and data safety forms before production release.  
- This repo does not include signing keys — create and back up your own upload keystore securely.

## Project layout

```
src/                 # React + R3F app source
dist/                # Vite production build (Capacitor webDir)
android/             # Native Android / Capacitor project
capacitor.config.json
package.json
```

## Stack

- Vite + React 19 + TypeScript
- `@react-three/fiber` + `@react-three/drei` + Three.js
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Capacitor 7 (`@capacitor/android`)
- Fonts: Cormorant Garamond + Outfit (Google Fonts)

## License

Private / educational observatory model.
