# Jao

> "The moon never goes to the gym. Still full." *puff*

## Overview
- **Role:** market NPC. He hangs around the **SELL FISH** stall in the Palengke (market) map, which is planned west of Willow Village.
- **He is not the seller.** The stall itself handles selling. Jao is just there: talk to him for a quote, and he says a line when you close the sell menu.
- **Personality:** a very old, very relaxed man. He takes his time, vapes, and hands out "dumb philosophy": fake-deep lines and real wisdom that sounds dumb.
- **Status:** design draft (pictures only). Not in the game yet; waits for the user's "go".

## Look
| Part | Description |
|---|---|
| Age / build | Very old. **Hunched back**: his head sits 2 px lower, sunk into round, raised shoulders. Same total height as Bins. |
| Hair | Thick, full **black** hair, big volume on top, short sideburns. |
| Face | **Deep wrinkles**: forehead lines, crow's feet, eye bags, cheek folds, chin line. Heavy eyelids over small dark eyes. **No mustache, no glasses.** |
| Top | **White collared sweater** (polo-style collar points + short placket), ribbed hem, **3/4 sleeves** so the forearms show. |
| Accessories | **Silver watch** on the left wrist. **Wooden cane** with a curved handle in the left hand. A short **gold vape stick** (plain gold, no glow) in the right hand. |
| Bottom | **Black shorts** to the knee. |
| Shoes | **White shoes.** |

### Palette
| Use | Hex |
|---|---|
| Skin / shade / light | `#c98e62` / `#a8714a` / `#dba67a` |
| Wrinkles | `#8e5a3a` |
| Hair / shine / deep | `#1a1414` / `#3a3236` / `#0e0a0a` |
| Sweater / shade / light / rib | `#f2efe8` / `#d2cdc2` / `#ffffff` / `#c2bcae` |
| Collar | `#e6e2d8` |
| Shorts / shade | `#2a2a32` / `#17171c` |
| Shoes / shade / sole | `#f6f6f2` / `#cfcfc8` / `#9a9a94` |
| Vape (gold) / light / dark | `#e8b93a` / `#fff2a8` / `#a8781c` |
| Watch / shine | `#b8bec8` / `#eef2f6` |
| Cane / light / dark | `#7a4a26` / `#9a6438` / `#5a3418` |
| Smoke | `#e8ecf4` (semi-transparent) |

## Sprite
- **Size:** 24×38 px frame (front view), feet at the bottom, same scale as the other characters.
- **Frames (5):**
  1. `idle`: standing hunched, vape held upright at his chest.
  2. `breath`: body 1 px lower (breathing).
  3. `raise`: lifts the vape toward his face.
  4. `inhale`: stick across his lips, eyes shut, enjoying it.
  5. `exhale`: mouth opens into an "o", a big cloud comes out.

## Animation loop (~7 s)
idle and breath for a few seconds, then raise, inhale (holds about 1 s), raise, exhale, then back to idle. 120 ms per frame.

## Smoke (always on)
- **Exhale:** a big cloud of about 14 puffs that drifts up and to the side, growing and fading over about 5 s.
- **Permanent linger:** a thin wisp always rises from the vape stick, and a slow haze always hangs around his head. He is never without smoke.

## Dialogue
- **Talk to him:** a random line from `docs/JAO_QUOTES.md`.
- **After you close the sell menu:** a random "after sell" line from the same file.
- **Style (user-approved):** short, confident lines about ordinary things, with a dumb twist. Three shapes:
  - "X never does Y. Still Z." (*The moon never goes to the gym. Still full.*)
  - "You are not A. B is just C." (*You are not late. Everyone else is just early.*)
  - "Be like X. Good thing. ...Bad thing. Hmm." (*Be like a chair. Always supportive. ...People also sit on you. Hmm.*)
- **Rules:** original lines only (no copied memes), nothing about fish, `*puff*` marks a vape beat.

## Files
| What | Path |
|---|---|
| Sprite generator | `tools/jao.py` |
| Close-up loop | `assets/characters/jao/jao_loop.gif` |
| Frames sheet | `assets/characters/jao/jao_frames.png` |
| Scene with stall + quote bubble | `assets/characters/jao/jao_draft.gif` |
| Market mockup (with Bins + Turon) | `docs/mockups/market_stalls.gif` (`tools/market_mock.py`) |
| Quotes | `docs/JAO_QUOTES.md` |

## Open
- Side/back views and walking frames (only needed if he ever moves).
- Final quote list (user to cut lines).
