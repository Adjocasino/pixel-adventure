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
