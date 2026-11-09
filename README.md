# Pixel Adventure

A tiny Game Boy–style top-down adventure: 160×144 screen, 4 shades, D-pad + A/B + Start/Select.

- The whole game is `app/src/main/assets/index.html` (HTML/CSS/JS, no libraries).
- A thin Android WebView app wraps it.
- Every push to `main` builds a debug APK and publishes it as a GitHub Release named `build-<N>` (`PixelAdventure.apk`).

## Controls

| Button | Touch | Keyboard |
|---|---|---|
| D-pad | on-screen cross | Arrows / WASD |
| A: sword, talk, open | A | X or K |
| B: dash | B | Z or J |
| Start: pause | START | Enter / Space |
| Select: color palette | SELECT | Shift |

## Releases

Bump `versionCode` and `versionName` in `app/build.gradle.kts` for each release so the APK installs over the old one.
