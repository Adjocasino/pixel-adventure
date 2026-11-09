# Pixel Adventure

A 16-bit style top-down sandbox (landscape). All art is generated in code. There are no image files.

- The whole game is `app/src/main/assets/index.html` (HTML/CSS/JS, no libraries).
- A thin Android WebView app wraps it, locked to landscape.
- Every push to `main` builds a debug APK and publishes it as a GitHub Release named `build-<N>` (`PixelAdventure.apk`).

## Maps (sandbox, no story yet)

| Map | Connects to |
|---|---|
| Willow Village (hub) | north: Whisperwood, south: Mirror Lake, east: Sunny Meadow |
| Whisperwood (dark forest, fireflies) | south: Village |
| Mirror Lake (beach, dock, ducks) | north: Village |
| Sunny Meadow (farm, scarecrow, butterflies) | west: Village |

The ⌖ button opens a travel menu that jumps straight to any map.

## Controls

| Action | Touch | Keyboard |
|---|---|---|
| Move | floating joystick (left half of the screen) | Arrows / WASD |
| A: swing stick, read signs, interact | A | X, J, Space, Enter |
| B: run (hold) | B | Shift, Z, K |
| Travel menu | ⌖ | M |

## Releases

Bump `versionCode` and `versionName` in `app/build.gradle.kts` for each release so the APK installs over the old one.
