# Inad

> A cute (not evil) witch in royal blue: open robe, droopy hat, broom ready.

## Overview
- **Role:** playable character. She's the **default avatar** in Cottage Meadow (since v3.0). The other choices are Adjo and the Kid (the Kid is set to be removed).
- **Vibe:** a cute, friendly witch. Nothing evil or spooky: soft blues, a sparkly ice-blue charm and a magic broom instead of a cauldron.
- **Status:** **in the game.** Generated in code by `makeGirl()` in `app/src/main/assets/index.html` (the art lives in the code, not in image files).

## Look
| Part | Description |
|---|---|
| Hair | Straight, **rose-brown with a touch of red**, to just above the chest. **No bangs**: a soft middle part that shows the forehead. Based on the user's reference photo. |
| Face | Big blue eyes, red blush on the cheeks. |
| Hat | Short, low witch hat: a tilted cone that **folds over and droops to one side**, wide brim, soft-blue band, a silvery **ice-blue star charm**. |
| Robe | **Royal-blue outer robe** that hangs **open** from the shoulders, soft-blue trimmed edges, **flared sleeves**, long flared hem. |
| Inner clothes | **Black** inner top with subtle lacing down the front. |
| Chest details | Small **royal-blue bow** at the collar, **ice-blue gem pendant**. (These are in the pictures; not all of them are in the game build yet.) |
| Legs | **Black tights and black boots.** |
| Rule | **No yellow** in her outfit (the charm is silver/ice-blue). Only the broom straw is natural yellow-gold. |

### Palette
| Use | Hex |
|---|---|
| Skin / shade | `#f6d2b0` / `#e3b08e` |
| Hair / shade / dark / highlight / sheen | `#7a4338` / `#602e26` / `#3c1a15` / `#9a5a4c` / `#c48676` |
| Eyes (blue / dark) | `#42a3f1` / `#1a1630` |
| Blush | `#e8565c` |
| Robe / shade / deep / light | `#1c2c7c` / `#15205c` / `#0f1744` / `#2a42a6` |
| Robe trim | `#6a8ed8` |
| Inner black / dark blue-black | `#14121f` / `#2a234d` |
| Lacing | `#3a3554` |
| Ice-blue (pendant, charm) / light | `#9cd1f8` / `#e6f6ff` |
| Star charm (silver) / shade | `#dcefff` / `#8fb0e0` |
| Clip accent | `#60c1ee` |

## Sprites
### Walking and idle (`inad_sheet.png`)
- **Frame:** 24×31 px (the hat needs headroom; character origin offset 4,7). Boots sit on the bottom row, feet at the bottom center.
- **Rows:** down, right, up, left.
- **Columns:** walk 0–3, then idle 0 (stand), idle 1 (breath), idle 2 (blink).
- Preview: `inad_preview.gif`.

### Broom ride (`inad_broom_sheet.png`)
- Her **Run** button: hold B (or the orange Run button) and she **flies on her broom** instead of sprinting.
- 4 frames of 28×33 px per direction (origin offset 6,7). Rows: down, up, right (left = mirrored right).
  - Down: handle points at you, bristles peek out on both sides.
  - Up: a big bristle fan toward you.
  - Side: side-saddle.
- Hover bob, hair blown back, fluttering straw with a soft-blue tie, boots dangling.
- In the game: hovers about 4 px above her shadow, moves 2.3 px per frame, leaves a sparkle trail and makes a soft whoosh.
- Previews: `inad_broom_all_dirs.png` / `.gif`.

## Emote: two-jellyfish dodge
- Two jellyfish pop out beside her head. She hops and **reaches** for the right one, which zips away (afterimage + sparkle), then the left one, which dodges too. They drift back to tease her, swirl over her hat and float off while fading (~1.8 s).
- Her own reach poses: `makeGirl(..., {reach:'r'|'l', look:1})`.
- Trigger: the small oval button above A, or the E key.
- Previews: `inad_jellyfish_dodge.png` / `.gif`, `inad_jellyfish_emote.gif`.

## In the minigames
- **Fruit Catch:** she rides her broom and her bilao **floats by magic above her hat** (higher than Adjo's, which he holds). Little ice-blue sparkles drift around it. Her name tag sits higher to clear the hat.
- **Fishing and the barn:** she appears as the player character.
- **Multiplayer:** whoever plays Inad shows up as Inad on the other phone, with a name tag.
- Minigames always use the player's chosen avatar; Adjo is only the stand-in in the demos.

## Files
| What | Path |
|---|---|
| Game code (all her frames) | `makeGirl()` in `app/src/main/assets/index.html` |
| Walk/idle sheet + preview | `assets/characters/inad_sheet.png`, `inad_preview.gif` |
| Broom ride | `assets/characters/inad_broom_sheet.png`, `inad_broom_all_dirs.png` / `.gif` |
| Jellyfish emote | `assets/characters/inad_jellyfish_dodge.png` / `.gif`, `inad_jellyfish_emote.gif`, `jellyfish_emote.png` |
| Fruit Catch look | `assets/characters/inad_fruit_catch.gif`, `inad_fruit_catch_frames.png` (`tools/inad_bilao.py`) |
| Character list | `assets/characters/README.md` |

## Open
- Chest details (bow, pendant, lacing) are in the pictures but not all in the game build.
- Personality and dialogue lines: none yet. Inad is the player, so she doesn't talk on her own.
