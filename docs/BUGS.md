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

## Music demos (not in the game; original, generated in code)
- **All versions on one page:** `demos/compare_all.html` (artifact "Song demos: compare all versions").
- **Willow Village** (`demos/village_piano.html`): current game version, solo piano, piano + strings; keys Original / Lower / Much lower.
- **Quiet Field** (`demos/quiet_field.html`): E minor, 48 BPM. Solo piano, piano + soft pad, piano + low harp, piano + mid harp; keys Normal / Lower.
- **Porch Light** (`demos/porch_light.html`): F major 6/8, 72 BPM, "sitting on the porch with your wife". Solo piano, porch version (pad, flute, birds), piano + low harp.
- Waiting for the user's listening feedback on all of them.

## Pictures made (not in the game)
- `assets/minigames/cpr_revive.gif`: CPR revive animation (multiplayer idea).
- `assets/characters/inad_fruit_catch.gif`: Inad in Fruit Catch (magic floating bilao, broom ride).
- `docs/mockups/barn_wireframe.png`: Barn Ranch layout (user: "perfect").

## Barn Ranch minigame: full plan in `docs/BARN_RANCH.md`
- Animals tended inside a barn; start with 2 chickens (Ginger and Rocky); buy and name more animals later.
- Timed panic by default; hybrid scoring (approved); layout approved.

## Idea list (not built; wait for the user's "go")

### General (wait for "go")
- **Minigames use the player's chosen avatar** (Adjo, Inad, ...). The demos only use Adjo as a stand-in. Each avatar needs its own minigame poses (for Fruit Catch: bilao-carry sprint + arms-up idle, like `tools/adjo_bilao.py`).
- **App icon: option B (Meadow cottage)**, updated to **B2** with a bit of orange wood (door, sills, small wooden fence + dirt path): `assets/icon_options/icon_B2_meadow_wood.png` (`B2=1 python3 tools/app_icon.py`). Set it as the launcher icon on "go".
- **Remove the kid** character from the game (and from anything that references it, e.g. vs CPU ideas).

### Market map + two stores (proposed, wait for "go")
- All 5 maps are in use; the free spot is **west of Willow Village** (no west exit yet). Proposed new map: **Palengke (market)**.
- **Fish stall:** sell fish caught in the Mirror Lake minigame (price by fish + tier).
- **Animal shop:** buy animals for the Barn Ranch; on buying, a prompt asks you to name the animal.

### Jao: market NPC (concept, user's idea)
- **Name: Jao.** An old man with thick black hair, no mustache, in a white collared sweater, knee-length black shorts and white shoes. He holds a short aluminum vape stick and now and then inhales (eyes shut, tip glows) and puffs out a big cloud. **Smoke always lingers** around him (a wisp from the stick + slow haze around his head).
- **Not the seller.** The stalls handle buying/selling. Jao just hangs around the market and gives a random "dumb philosophy" quote when you talk to him, and says a line after you close a sell menu.
- **Quotes are not fish-related.** Internet-style fake-deep lines plus real wisdom that sounds dumb. Original lines only (not copied memes).
- Draft sprite: `assets/characters/jao/jao_draft.gif`, `jao_frames.png` (`tools/jao.py`): idle, breath, raise, inhale, exhale.
- Quotes: `docs/JAO_QUOTES.md` (25 talk lines + 6 after-sell lines, draft). Loop preview: `assets/characters/jao/jao_loop.gif`.

### Fruit catch minigame (inspired by the old PS2 loading-screen catch game; all art and music our own)
- Adjo with a basket under a fruit tree, moving left/right to catch falling fruit. Could be a loading screen, an orchard minigame, or both (not decided).
- 8-bit music (minigame rule).
- Bad items, each with a warning (sound, color, shadow or odd path):
  rotten fruit (−points, breaks combo), bee (1 s stun), durian (−1 heart), bird poop (covers part of the screen), pebble (knocks a fruit out of the basket).
- Good items: golden mango (double points for 5 s).
- Hearts: the user likes the heart system. Solo: 3 hearts.
- **Demo v2 (physics):** `demos/fruit_catch.html`, built from `tools/fruit_catch_src.html` by `tools/build_fruit_demo.py`. Adjo pose art: `tools/adjo_bilao.py` (sprint with arms up holding the bilao like a tray, plus a standing arms-up idle).
  Fruit lands in a physics bilao and piles up. v3 (user feedback): no sliding run (Adjo stops right away), the bilao follows a smooth anchor (no jolt when starting/stopping), fruit settles once inside, deeper/wider bilao. Normal moves don't spill; spills come from durian, wind, overfilling. Heavier load = slower Adjo. User likes the wind.
  v3.1 (user: "don't snap, rely on gravity"): pure gravity + contact. The bilao is a solid two-sided shell (fruit only gets in over the rim; hitting the outside bounces off), Coulomb friction, no glue damping. Stable via heavier gravity (1200) and quick but not instant stops (accel 900). Deeper bilao. No auto-lean (it flung fruit).
  v3.2: weight matters more (full load = half speed and slower turning) with a weight bar. Bananas (user idea): 20 pts; a banana that hits the ground leaves a peel for 12 s, and running over it makes Adjo slip and slide out of control for ~0.75 s.
  Buko (user idea, max damage): only after 25 s, rare. Warning: leaves shake + rustle with a "!" for ~1.1 s, then a big shadow. Hit: −2 hearts, 1.2 s stun, big shake, launches the whole pile outward; the buko bounces off.
  Points only when banked in a crate (both edges; the bilao tips in). Load multiplier: +0.15 per extra fruit (max x3); golden mango doubles the dump; rotten banked = -25 each.
  Fruit values: mango 10, guava 15, calamansi 25, golden 50. Heart fruit +1 heart on landing. Durian -1 heart and flings the pile. Bee stun, poop splat, pebble heavy/bouncy.
  2-minute round, wind gusts after 40 s, fruit storm in the last 15 s. Titles: Sprout, Picker 400, Farmer 1200, Orchard Keeper 2500, Mango Master 4000.

- Demo also has (user asked): **watermelon** (80 pts, mass 6 = half the weight bar) and **crow** (from 20 s: CAW, flies in, swoops at the bilao with a ground shadow, steals the top fruit).
#### Fruit catch: approved for the game (APK), not the demo (wait for "go")
- **Watermelon** and **crow** (as in the demo).
- **Tilt control:** tilt the phone (or hold a button) to tilt the bilao yourself and balance the pile.

### MULTIPLAYER: only build when the user says "include in the multiplayer"
- Planned connection: **LAN only** (phone hotspot or same Wi-Fi). No internet server.
  Tech note: a WebView page can't open LAN sockets by itself, so the Android side needs a small native bridge (local socket/WebSocket server + discovery) that the page talks to.
- Fruit catch modes: versus (shared tree, steal catches), co-op (shared goal), vs CPU (Inad).
- Versus items: chili (sends the next bad item to the opponent's side), slingshot (knock a fruit off the other player's path).
- **No game over in co-op: downed + revive (CPR).**
  - At 0 hearts a player is downed instead of the game ending.
  - The teammate revives them by alternating A and B on a steady beat at about 100–120 BPM (real CPR pace, the "Stayin' Alive" tempo). Beat shown on screen, 8-bit metronome tune of our own, not the real song.
  - While reviving, the reviver can't move and items keep falling, so they can get hit too.
  - Open questions: how many good beats to revive; whether a miss resets or only slows progress; whether the revived player comes back with 1 heart; game over only if both are downed at once.
- **Fruit catch co-op (user picks):**
  - **Bonk rescue:** when a buko stuns your partner, stand next to them to steady their bilao so the pile doesn't spill.
  - **Pour to teammate** (instead of "pass the bilao"): hold a button to tilt your own bilao and pour fruit into your teammate's bilao (or a crate). Same tilt control as the APK tilt feature.
