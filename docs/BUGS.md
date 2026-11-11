# Bugs & feature notes

## Fixed in v3.6 (build-12)
1. **Adjo's sprint floated.** The side sprint frames were anchored on the dust under his feet, not his boots. They're now cropped so the planted boot sits on the ground.
2. **Adjo felt laggy.** His walk cycle now runs faster to match his speed (`walkK 1.35`), and his idle has a real breathing frame (before, it showed the same image twice, so he looked frozen). If he still feels laggy on the phone, report what it looks like.

## Built in v3.6
- **Adjo's own emote** replaces the jellyfish for him: arms-crossed wind-up, a pop into the kabuki pose with impact lines, a head roll (dip, swing right, chin up, swing left, grin) with a swoosh, and two frogs that hop side to side and then hop away. It has pose, ribbit sounds and twinkles. Moving cancels it. Other characters keep the jellyfish dodge.
- **Pets wander:**
  - **Cats stay indoors** and walk between spots: Collete's bed, the bedroom rug, the red rug, by the fire, the bowls, under the table, by the chest, and the cat tower (they hop up and down). They route through the bedroom doorway, around the tower, and never pick a spot another cat is using.
  - **Sprocket** naps by the cottage door. Now and then he gets up, limps (labored 3-leg lurch) somewhere in a small radius, then lies back down.
  - **Casper** sits in the yard, trots around a small radius, and sometimes follows you a little before heading back.
- **Interactions (press Action facing a pet):**
  - **Cats:** they stop, purr and show hearts.
  - **Sprocket napping:** one eye opens, big yawn, tail thumps with dust, a heart, then back to sleep.
  - **Sprocket awake:** leans into your hand with his eyes shut, tail wagging, hearts.
  - **Casper:** "Arf! Arf!", then a backflip (crouch, spin in the air, land with a dust ring) and a happy bark.
- **Option B controls:**
  - A big green **Action** button (hand icon).
  - Arc buttons: orange **Run** (dash), pink **Emote** (heart), blue **Item** (bag). Item shows "No item in your hands yet" for now.
  - Keyboard: Q or I = Item.

## Designing (demo only, not in the game)
- **Mirror Lake fishing: a rhythm minigame (Muse Dash style)**. Demo: `demos/fishing_rhythm.html`, also published as an artifact.
  - **Getting in:** a sparkling fishing spot at the end of the dock. Press A there and a ripple wipe opens a new fishing screen.
  - **Two lanes:**
    - top lane = **A** (leaping orange fish; keys J/X/↑/Space)
    - bottom lane = **B** (blue bubble fish; keys F/Z/↓)
    - double notes = press both at once
  - **Song and chart:** chiptune whose **tempo ramps from 120 to 200 BPM** across the song (each bar a little faster; a BPM readout on screen; the user asked for this after trying 240 and then 120); the melody follows the notes. 2 bars of count-in, then **exactly 100 notes** that get harder bar by bar.
  - **Scoring:** Perfect 1 pt (±50 ms), Great 0.75 (±90 ms), Good 0.4 (±130 ms), Miss 0. The total points are the % score.
  - **Fish by result:** Iron <50%, Bronze 50%+, Silver 70%+, Platinum 85%+, Gold 95%+. This assumes the user's order, iron → bronze → silver → platinum → gold. It's a simple fish colored by rank.
  - **Result screen:** fish caught, %, Perfect/Great/Good/Miss counts, max combo. A = fish again, B = back to the dock.
- **Fishing minigame music (user's choice):** the fishing rhythm minigame keeps its **old-school 8-bit chiptune sound** (NES-style square leads, triangle bass and noise drums, generated in code). This applies only to this minigame; the rest of the game's music style isn't decided by this.
- **Lake fish samples** (pictures only: `assets/fish/`, `tools/fish.py`): ten side-view fish with 2 swim frames each, for the fishing minigame's catches. Tilapia, Bangus, Hito, Dalag, Karpa, Tawilis, Ayungin, Gurami, Igat, Janitor fish. Which ones to use, and how they map to the Iron–Gold ranks, isn't decided yet.
- **Fish catch chart (user's design):** the score picks the fish pair, then where you land inside that pair's band picks its quality tier (Iron → Gold, five equal steps). One of the two fish is chosen at random.
  | Score band | Fish | Iron | Bronze | Silver | Platinum | Gold |
  |---|---|---|---|---|---|---|
  | 0–49% | Janitor fish / Ayungin | 0–9 | 10–19 | 20–29 | 30–39 | 40–49 |
  | 50–69% | Tilapia / Tawilis | 50–53 | 54–57 | 58–61 | 62–65 | 66–69 |
  | 70–84% | Hito / Gurami | 70–72 | 73–75 | 76–78 | 79–81 | 82–84 |
  | 85–94% | Dalag / Bangus | 85–86 | 87–88 | 89–90 | 91–92 | 93–94 |
  | 95–100% | Karpa / Igat | 95 | 96 | 97 | 98–99 | 100 (perfect run only) |

## Idea list (not built; wait for the user's "go")

### Fruit catch minigame (inspired by the old PS2 loading-screen catch game; all art and music our own)
- Adjo with a basket under a fruit tree, moving left/right to catch falling fruit. Could be a loading screen, an orchard minigame, or both (not decided).
- 8-bit music (minigame rule).
- Bad items, each with a warning (sound, color, shadow or odd path):
  rotten fruit (−points, breaks combo), bee (1 s stun), durian (−1 heart), bird poop (covers part of the screen), pebble (knocks a fruit out of the basket).
- Good items: golden mango (double points for 5 s).
- Hearts: the user likes the heart system. Solo: 3 hearts.

### MULTIPLAYER: only build when the user says "include in the multiplayer"
- Planned connection: **LAN only** (phone hotspot or same Wi-Fi). No internet server.
  Tech note: a WebView page can't open LAN sockets by itself, so the Android side needs a small native bridge (local socket/WebSocket server + discovery) that the page talks to.
- Fruit catch modes: versus (shared tree, steal catches), co-op (shared goal), vs CPU (Inad or the kid).
- Versus items: chili (sends the next bad item to the opponent's side), slingshot (knock a fruit off the other player's path).
- **No game over in co-op: downed + revive (CPR).**
  - At 0 hearts a player is downed instead of the game ending.
  - The teammate revives them by alternating A and B on a steady beat at about 100–120 BPM (real CPR pace, the "Stayin' Alive" tempo). Beat shown on screen, 8-bit metronome tune of our own, not the real song.
  - While reviving, the reviver can't move and items keep falling, so they can get hit too.
  - Open questions: how many good beats to revive; whether a miss resets or only slows progress; whether the revived player comes back with 1 heart; game over only if both are downed at once.
