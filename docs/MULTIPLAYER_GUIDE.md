# Cottage Meadow — Multiplayer guide (v1.0)

Play with a friend on **two phones**. All you need is the **CottageMeadow.apk** file. There's no internet, no account and no server: the phones talk to each other directly over a **hotspot** or the **same Wi-Fi**.

## 1. Install the same APK on both phones
1. Download **CottageMeadow.apk** from the latest GitHub release (*Cottage Meadow v1.0*).
2. Send the file to your friend's phone (Messenger, Bluetooth/Nearby Share, a USB cable, anything works).
3. Open the file on each phone and tap **Install**. If Android asks, allow "Install unknown apps" for the app you opened it from.
4. Both phones should have the **same version**. Check the release title, for example *v1.0 (build 13)*.

## 2. Put both phones on the same network
Pick **one** of these:
- **Hotspot (works anywhere):** Phone A turns on **Mobile hotspot** (Settings → Hotspot). Phone B connects to that hotspot's Wi-Fi. Mobile data can be off; the game doesn't use the internet.
- **Same Wi-Fi:** both phones join the same home Wi-Fi.

## 3. Connect in the game
On both phones, open Cottage Meadow and tap the **⇄ (Multiplayer)** button at the top right.

**Phone A (the host):**
1. Tap **Host a game**.
2. It shows **"Waiting for a friend to join…"** and your address (for example `192.168.43.1`).

**Phone B (joining):**
1. Tap **Search for a game**. After a few seconds a button **"Join Adjo (192.168.43.1)"** appears. Tap it.
2. If nothing shows up, type the **address shown on Phone A** in the box and tap **Join**.

When it works, both phones say **"Connected!"** and the ⇄ button turns green.

> The **host** runs the shared minigames, so the host phone should stay on the screen (don't switch apps).

## 4. What you can do together
| Where | How | What happens |
|---|---|---|
| Anywhere | Just walk around | You see your friend's character walking on the same map, with a name tag. |
| **Fruit Catch: Co-op** | Big mango tree in Sunny Meadow → **Co-op**, or ⇄ → *Fruit Catch Co-op* | One tree, one shared score. If a friend runs out of hearts they're **DOWN**: stand next to them and press **A, B, A, B on the beat** (the pulsing heart) for CPR. 8 good beats = **revived with 1 heart**. If a friend is **stunned** (bee/buko), stand next to them and press **A** to steady them. Hold **Tilt** to tip your bilao and **pour fruit into your friend's bilao**. |
| **Fruit Catch: Versus** | Mango tree → **Versus** | P1 banks in the **left crate**, P2 in the **right crate**. Run into the other player fast to **BUMP** their pile. Catch a banana to get a **peel**, then press **A** to drop it behind you. Highest score wins. |
| **Barn together** | Barn clipboard → **Together**, or ⇄ → *Barn together* | Both players go into the barn and tend Ginger and Rocky in the same shift. Both get the eggs in the **storage box outside the barn**. |

The other player gets a **"Your friend invites you"** pop-up and taps **Join**.

## 5. Controls in Fruit Catch
- **Move:** drag left/right on the screen (or ← → on a keyboard).
- **A:** start / CPR / steady / drop a peel.
- **B:** CPR (co-op), or leave when the round is over.
- **⤵ Tilt (hold):** tip your bilao.
- **✕ (top left):** leave.

## 6. Troubleshooting
| Problem | Fix |
|---|---|
| Search finds nothing | Type the host's address shown on Phone A. Some hotspots block searching but still allow joining. |
| "Could not join" | Make sure Phone B is on Phone A's hotspot / the same Wi-Fi, and Phone A pressed **Host a game** first. Try again. |
| Guest Wi-Fi / office Wi-Fi | Many of these block phones from seeing each other. Use a **hotspot** instead. |
| It disconnects | Keep both screens on and the app open. To reconnect, Host again on Phone A and Join on Phone B. |
| Different versions | Install the same APK on both phones. |

## 7. Technical notes (for later)
- Port **47777** (TCP game connection) and **47778** (UDP "I'm here" search beacon).
- The host phone simulates the shared minigames; the other phone sends its controls and draws the host's updates (about 20 per second).
- Code: `app/src/main/java/com/pixeladventure/game/LanBridge.java` (Android) and `app/src/main/assets/mp.js` (game).
