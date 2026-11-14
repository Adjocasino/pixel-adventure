# Barn Ranch: minigame concept (plan, not built)

Status: concept only. Nothing goes into the game until the user says "go".
Inspired by "Animal Ranch Panic" + "Bee & Honey Farm" from the minigame ideas list.

## 1. Entry flow
1. The player walks into the **barn** (an interior map, like the house).
2. Near the animals a prompt appears: **"Tend the animals?"**  options: **Start** / **Not now**.
   - The prompt also shows small need icons (hungry, thirsty, eggs ready) so the player sees why to start.
3. **Start** begins one **shift** (about 90 seconds). **Not now** lets the player walk around the barn freely.
4. After the shift: a results screen (products collected, animal happiness, stars, coins).

## 2. Core loop (one shift)
- Every animal has **need bars** that drain over time (2 to 3 needs per animal).
- The player runs between stations and does **short task mechanics** to refill needs and collect products.
- An empty need makes the animal unhappy: it makes fewer or worse products, or acts out (escapes, kicks the bucket, stings).
- Chaos grows during the shift (needs drain faster, random events).
- Controls (Option B): **A** use / grab, **hold A**, **mash A**, **A/B alternating on a beat** (like the CPR revive), **B** dash, **Item** throw/drop.

## 3. Base level
- Start with **2 chickens** only.
- Tasks: feed, water, collect eggs, sweep the coop, catch a runaway chicken.
- This is the proof of concept and the tutorial.

## 4. Animals and their tasks (unlock by buying)

| # | Animal | Tasks (mechanic) | Product | Chaos |
|---|---|---|---|---|
| 0 | **Chicken (manok)**, start with 2 | Feed: hold A to scatter corn in an arc. Water: pump the well (mash A), carry, pour. Eggs: grab from nests before they cool (timer). Sweep coop (back-and-forth). | Eggs | Unhappy chicken runs out the barn door: chase and grab it. A rat sneaks in to steal eggs. |
| 1 | **Duck (itik)** | Refill the pond (carry buckets). Herd ducks back into the pen (walk behind them, they move away from you). Collect duck eggs near the water. | Duck eggs (salted egg later) | Ducks follow one leader and wander off as a line. |
| 2 | **Goat (kambing)** | Milk: alternate A/B on a beat. Feed hay (carry bales). Trim hooves (timing taps). | Goat milk | Eats anything left on the floor (your hay, egg basket). Head-butts you (knockback). Climbs on crates. |
| 3 | **Pig (baboy)** | Carry the slop bucket (spills if you dash). Keep the mud wallow wet. Wash with water (hold A). | Truffles / fertilizer (manure for crops) | Piglets slip out between your legs. Pig shoves you into the mud (slow). |
| 4 | **Bees (bubuyog)**, apiary just outside the barn door | **Suit up** first (equip step). **Smoke** the hive (hold A, keep the smoke meter in the green). **Pull a frame** slowly (move too fast = bees angry). **Spin the extractor** (crank: rotate the stick / circle swipe). **Bottle** the honey. Plant flowers nearby to keep the hive happy. | Honey, beeswax | Anger meter: if it fills, bees chase whoever is near (stun). No suit = stung instantly. |
| 5 | **Carabao (kalabaw)** or **cow** | Milk: squeeze with a pressure bar (too hard = it kicks the bucket over). Brush (rub back and forth). Keep its mud wallow / water trough full (carabao gets hot). | Milk (kesong puti later) | Kicks the bucket. Wanders into the doorway and blocks it. |
| 6 | **Sheep (tupa)** | Shear: trace along the wool path (swipe/move). Bag the wool. Calm it first (gentle taps) or it runs. | Wool | Scared sheep bolt in a straight line and knock over buckets. |
| 7 | **Rabbit (kuneho)** | Feed carrots, refill water bottle, clean the hutch. | Fertilizer / fur | They **multiply** during the shift. Babies escape through gaps. |
| 8 | **Goose (gansa)** | Feed, collect big eggs. | Goose eggs | Guard animal: chases and pecks the player if you get too close to its nest. Also scares off the rat and the fox. |
| 9 | **Horse (kabayo)** | Brush, feed, give water, replace horseshoe (timed hammer taps). | Unlocks riding / fast travel (main game) | Spooks at bees or loud events and rears up. |
| 10 | **Tilapia pond** (by the barn) | Feed fish (throw pellets), keep water clean (net leaves), net the grown fish. | Fish | Links to the Mirror Lake fishing minigame. |
| — | **Pets as helpers** | **Casper** herds runaways back (helper upgrade). **Sprocket** sleeps in the hay and barks when a need is red (alarm). **Cats** catch the rat. | — | Casper sometimes chases the chickens instead. |

Suggested unlock order: chicken, duck, goat, pig, bees, carabao, sheep, rabbit, goose, horse, tilapia.

## 5. Progression
- **Coins** from selling products (or using them in cooking) buy new animals at the market.
- Buying an animal **adds its pen/station to the barn**, so the barn layout grows (coop wing, stable wing, apiary outside, pond).
- **Barn upgrades** (bought with coins): auto-waterer (water drains slower), bigger nests, egg basket (carry more), bee suit (needed for bees), milking stool (wider sweet spot), lanterns (night shifts).
- **Animal happiness carries over** between days: happy animals make more/better products (golden egg, premium honey).
- Shift difficulty scales with how many animals you own, so more animals = more income but more panic.

## 6. Proof of concept (first demo)
Scope, single screen, no shop:
- Barn interior, Adjo (stand-in for the chosen avatar).
- **"Tend the animals?" Start / Not now** prompt.
- **2 chickens** with 3 needs: food, water, eggs ready.
- Tasks: scatter corn (hold A), pump + carry + pour water, grab eggs.
- One chaos event: an unhappy chicken escapes and must be caught.
- 90-second shift, results screen with eggs, happiness and stars.
- A mock "Market" panel on the results screen showing **Buy chicken / Buy duck (locked)** to show the unlock flow.
Next step after that: add the **bees** as the second station to test a very different mechanic (suit, smoke, extractor).

## 7. Open questions
- Is a shift time-limited (panic) or relaxed (do it at your own pace, needs drain per in-game day)? Possibly both: normal tending is relaxed, "rush hour" is the timed minigame.
- Do animals have names and personalities (like the pets)?
- Do products feed into cooking/market in the main game, or only coins?
- Multiplayer: later, only when the user says "include in the multiplayer".
