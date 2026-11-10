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
  - **Song and chart:** **120 BPM** chiptune (changed from 240 at the user's request); the melody follows the notes. 2 bars of count-in, then **exactly 100 notes** that get harder bar by bar.
  - **Scoring:** Perfect 1 pt (±50 ms), Great 0.75 (±90 ms), Good 0.4 (±130 ms), Miss 0. The total points are the % score.
  - **Fish by result:** Iron <50%, Bronze 50%+, Silver 70%+, Platinum 85%+, Gold 95%+. This assumes the user's order, iron → bronze → silver → platinum → gold. It's a simple fish colored by rank.
  - **Result screen:** fish caught, %, Perfect/Great/Good/Miss counts, max combo. A = fish again, B = back to the dock.
