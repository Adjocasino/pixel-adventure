# Bugs & feature notes

## Open bugs (reported by the user, build-10)
1. **Adjo feels laggy.** Still need to find out exactly what feels slow (choppy animation vs low speed vs frame drops).
   - Suspects:
     - The walk animation is only 4 frames at a slow rate.
     - Adjo's idle has no breathing frame (idle[0] and idle[1] are the same image).
     - Movement speed and animation speed may not match, so his feet slide.
2. **Adjo's sprint floats.** The side sprint frames are anchored to the dust/lowest pixel (row 37), but his boots are at rows 30–33, so he hovers 4–7 px above his shadow.
   - Fix: crop the frames so the planted foot sits on the bottom row, and draw the dust/speed lines as particles instead of baking them into the frames.
   - The front and back sprint frames are fine (boots on row 36).

## Feature notes
- **Adjo's own emote** (picture only: `assets/characters/farmer/adjo_emote.*`, `tools/adjo_emote.py`):
  - A dramatic kabuki-style pose inspired by the user's anime reference: arms crossed wind-up, then a pop with impact lines into the pose.
  - The pose: one arm thrust out with an open palm, the other hand raised by the hat, one knee up, and a cheeky grin.
  - Right after the pop he does a head roll like the reference video: the head dips down (hat over the eyes), swings right, rolls back with the chin up and a grin, swings left, then settles front with the grin. The hand stays thrust out the whole time.
  - Two little frogs pop in and hop side to side, crossing in front of him, then hop away. They replace the jellyfish for Adjo.
- **Pets wander once in a while** (user's request): pets shouldn't just stay put. Each one rests most of the time, then now and then gets up, walks somewhere nearby with its walk animation, and settles again.
  - **Cats** (in game now, but they only sit): walk between favorite spots (window, rug, cat bed, cat tower, food bowls) using their 4-frame side walk. Sometimes they come to you.
  - **Sprocket:** mostly naps. Once in a while he gets up and limps slowly (the labored 3-leg walk) to the water bowl or over to you, then lies back down.
  - **Casper:** the most active. He wanders more often and further, sometimes follows you for a bit, and sits when he stops.
  - **Where they live:**
    - **Cats stay indoors** and wander only inside the house (Home map).
    - **Dogs live outside** in a small radius around the cottage in Willow Village: the front yard by the door, stepping stones and fence. They never leave that area.
    - Sprocket naps by the front door; Casper roams the yard.
  - Petting or interacting interrupts the wander. Pets walk around furniture and never through it.
