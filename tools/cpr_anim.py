"""CPR revive animation (picture only, multiplayer idea; not in the game or demos).
Adjo (player 1) kneels behind a downed player 2 (blue overalls) and does chest compressions
on the beat (~110 BPM), alternating A and B. A durian lands nearby mid-revive to show the risk.
Output: assets/minigames/cpr_revive.gif (+ cpr_revive_frames.png)."""
import os, sys, math, random
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import farmer as FM
from farmer import C, farmer

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'minigames')
os.makedirs(OUT, exist_ok=True)
SW, SH, K = 120, 76, 5          # scene size, upscale
GROUND = 66
random.seed(3)

def p2(fn, *a, **k):
    """draw with player-2 colors (blue overalls, teal hat band)"""
    keep = dict(FM.P)
    FM.P.update(ov=C('#3f6fb5'), ovS=C('#2f568f'), ovL=C('#5f8fd0'), ovD=C('#23406b'), stitch=C('#9cc4f0'),
                band=C('#2f8f8a'), bandL=C('#47b0aa'))
    try: return fn(*a, **k)
    finally: FM.P.clear(); FM.P.update(keep)

# --- sprites ---
stand1 = farmer('down', 0)
stand2 = p2(farmer, 'down', 0)
lying = p2(farmer, 'down', 0, {'blink': 1}).rotate(-90, expand=True)   # head to the right, eyes closed
# reviver: down sprite cut at the hips (the lower body is hidden behind the downed teammate = kneeling)
kneel = farmer('down', 0).crop((0, 0, 22, 27))
SKIN, SKINS, SLEEVE, OUTL = FM.P['skin'], FM.P['skinS'], FM.P['shirt'], (40, 28, 22, 255)

def arms(im, rx, ry, hx, hy):
    """forearms continue straight down past the sides, then angle in to the hands on the chest"""
    d = im.load()
    def put(x, y, c, only_empty=False):
        if 0 <= x < im.width and 0 <= y < im.height and (not only_empty or d[x, y][3] == 0 or d[x, y] in ((95,166,74,255),)): d[x, y] = c
    paths = []
    for sx, side in ((rx + 5, -1), (rx + 15, 1)):
        top = ry + 22; pts = []
        bend = hy - 3
        for y in range(top, bend + 1): pts += [(sx, y), (sx + 1, y)]
        x = sx
        tx = hx - 2 if side < 0 else hx + 1
        y = bend
        while x != tx:
            x += 1 if tx > x else -1; y = min(hy, y + 1); pts += [(x, y), (x + 1, y)]
        paths.append(pts)
    for pts in paths:
        for x, y in pts:
            for a in (-1, 0, 1):
                for b in (-1, 0, 1): put(x + a, y + b, OUTL, True)
    for k, pts in enumerate(paths):
        for x, y in pts: put(x, y, SKIN if k == 0 else SKINS)
    for x in (hx - 2, hx - 1, hx, hx + 1):   # hands stacked on the chest
        for y in (hy, hy + 1): put(x, y, SKIN)
        put(x, hy + 2, OUTL)

def heart_px(d, cx, cy, s, col):
    for y in range(-s, s + 1):
        for x in range(-2 * s, 2 * s + 1):
            X, Y = x / s, -y / s
            if (X * X + Y * Y - 1) ** 3 - X * X * Y ** 3 <= 0: d.point((cx + x, cy + y), fill=col)

# durian (same as the demo)
DUR = ['.k..k..k..k.','..kgkgkgkk..','kkgcgcgcgkk.','.kgcgcgcgck.','kkcgcgcgcgkk','.kgcgcgcgck.','kkcgcgcgcgkk','.kgcgcgcgck.','kkgcgcgcgkk.','..kgcgcgck..','..kkkgkkk...','.k..k..k..k.']
PAL = {'k': (42, 29, 20, 255), 'g': (90, 160, 74, 255), 'c': (127, 191, 58, 255)}
durian = Image.new('RGBA', (12, 12))
for j, r in enumerate(DUR):
    for i, ch in enumerate(r):
        if ch != '.': durian.putpixel((i, j), PAL[ch])

def background():
    im = Image.new('RGBA', (SW, SH), (126, 196, 236, 255)); d = ImageDraw.Draw(im)
    for y in range(GROUND - 26):
        t = y / (GROUND - 26); d.line([(0, y), (SW, y)], fill=(int(111 + 90 * t), int(182 + 54 * t), int(236 + 19 * t), 255))
    for x in range(SW):
        h = 36 + math.sin(x * .07) * 4 + math.sin(x * .023 + 1) * 5
        d.line([(x, int(h)), (x, SH)], fill=(159, 208, 138, 255))
    d.rectangle([0, 44, SW, SH], fill=(95, 166, 74, 255))
    for i in range(60):
        gx, gy = (i * 37) % SW, 46 + (i * 13) % (SH - 48); d.point((gx, gy), fill=(120, 191, 90, 255)); d.point((gx + 1, gy - 1), fill=(120, 191, 90, 255))
    return im
BG = background()

BEATS, BEAT_FR = 8, 4            # 8 good beats to revive; 4 frames per beat
BPM = 110; FRAME_MS = round(60000 / BPM / BEAT_FR)   # ~136 ms
INTRO, OUTRO = 10, 16
PX, PY = 34, 46                   # patient (lying) position
CHEST = (PX + 15, PY + 10)         # where the hands land
RX = CHEST[0] - 11                # reviver sprite x so hands meet in the middle
DUR_X, DUR_LAND = 14, 3 * BEAT_FR + 2   # durian lands left of them during beat ~3

def frame(i):
    im = BG.copy(); d = ImageDraw.Draw(im)
    phase = 'intro' if i < INTRO else 'cpr' if i < INTRO + BEATS * BEAT_FR else 'out'
    c = i - INTRO; beat = c // BEAT_FR if phase == 'cpr' else (BEATS if phase == 'out' else -1); sub = c % BEAT_FR
    press = phase == 'cpr' and sub in (0, 1)
    # durian (danger): shadow grows, lands beside, dust
    if phase == 'cpr':
        dt = c - (DUR_LAND - 8)
        if 0 <= dt < 8:
            p = dt / 8; w = int(3 + p * 10)
            d.rectangle([DUR_X + 6 - w // 2, GROUND - 1, DUR_X + 6 + w // 2, GROUND], fill=(40, 70, 30, int(90 + 100 * p)))
            im.alpha_composite(durian, (DUR_X, int(-12 + p * (GROUND - 11 + 12))))
        elif dt >= 8:
            im.alpha_composite(durian, (DUR_X, GROUND - 11))
            if dt < 12:
                for k in range(6):
                    a = k * 1.05; r = 3 + (dt - 8) * 3
                    d.point((DUR_X + 6 + int(math.cos(a) * r), GROUND - 2 - int(abs(math.sin(a)) * r * .5)), fill=(200, 180, 140, 255))
    if phase != 'out':
        # reviver (kneeling behind, body dips on each press)
        ry = PY - 19 + (1 if press else 0) if phase == 'cpr' else PY - 19
        if phase == 'intro':
            # runs in from the left over the intro, then kneels
            t = min(1, i / (INTRO - 3)); x = int(-20 + (RX + 20) * t)
            if t < 1:
                body = farmer('side', i % 4); im.alpha_composite(body, (x, GROUND - 35))
            else:
                im.alpha_composite(kneel, (RX, ry))
        else:
            im.alpha_composite(kneel, (RX, ry))
        # downed teammate
        squash = 1 if press else 0
        im.alpha_composite(lying, (PX, PY + squash))
        # dizzy stars over the head while down
        if phase == 'intro' or (phase == 'cpr' and beat < BEATS - 2):
            for k in range(3):
                a = i * .7 + k * 2.1
                d.point((PX + 31 + int(math.cos(a) * 5), PY - 2 + int(math.sin(a) * 2)), fill=(255, 246, 160, 255))
        # arms reaching down to the chest (drawn over the patient)
        if not (phase == 'intro' and i < INTRO - 3):
            arms(im, RX, ry, CHEST[0], CHEST[1] + squash)
            if press:   # little press lines
                for a in (-6, 6): d.point((CHEST[0] + a, CHEST[1] - 1 + squash), fill=(255, 255, 255, 255))
    else:
        # revived: both standing, sparkles, P2 blinks (short invincibility)
        o = i - (INTRO + BEATS * BEAT_FR)
        im.alpha_composite(stand1, (RX - 6, GROUND - 35))
        if not (o > 3 and (o // 2) % 2):
            im.alpha_composite(stand2, (PX + 18, GROUND - 35 - (2 if o < 3 else 0)))
        for k in range(8):
            a = k * .785 + o * .2; r = 6 + o * 1.4
            if r < 26: d.point((PX + 29 + int(math.cos(a) * r), GROUND - 20 + int(math.sin(a) * r * .7)), fill=(255, 240, 160, 255))
    return im, phase, beat, sub, press, (c - DUR_LAND) if phase == 'cpr' else -99

FONT = lambda s: ImageFont.load_default(size=s)
def ui(big, phase, beat, sub, press, dur, i):
    d = ImageDraw.Draw(big); W, H = big.size
    def t(s, x, y, size, col, anchor='la'):
        d.text((x + 2, y + 2), s, font=FONT(size), fill=(20, 20, 20), anchor=anchor); d.text((x, y), s, font=FONT(size), fill=col, anchor=anchor)
    # hearts of player 2 (empty until revived)
    for k in range(3):
        col = (232, 67, 79) if (phase == 'out' and k == 0) else (110, 110, 118)
        heart_px(d, 24 + k * 30, 22, 9, col)
    t('P2', 108, 12, 18, (156, 196, 240))
    if phase == 'intro':
        t('TEAMMATE DOWN!', W // 2, 64, 30, (255, 154, 160), 'ma')
        if i >= INTRO - 4: t('Revive: A, B, A, B on the beat', W // 2, 100, 20, (255, 255, 255), 'ma')
    elif phase == 'cpr':
        # beat heart (pulses on the press)
        s = 22 if press else 16
        heart_px(d, W // 2, 70, s, (232, 67, 79)); heart_px(d, W // 2 - s // 3, 70 - s // 3, max(2, s // 5), (255, 154, 160))
        # A / B prompts, the one to press now is lit
        want = 'A' if beat % 2 == 0 else 'B'
        for k, (lab, x) in enumerate((('A', W // 2 - 90), ('B', W // 2 + 90))):
            on = lab == want; r = 26 if (on and press) else 22
            col = ((79, 168, 90) if lab == 'A' else (216, 135, 58)) if on else (70, 78, 70)
            d.ellipse([x - r, 70 - r, x + r, 70 + r], fill=col, outline=(20, 20, 20), width=3)
            d.text((x, 70), lab, font=FONT(26), fill=(255, 255, 255) if on else (150, 150, 150), anchor='mm')
            if on and press: t('PRESS!', x, 104, 16, (255, 246, 160), 'ma')
        # progress: 8 beats
        bw = 34
        for k in range(BEATS):
            x0 = W // 2 - BEATS * bw // 2 + k * bw
            done = k < beat or (k == beat and press)
            d.rectangle([x0 + 3, H - 34, x0 + bw - 3, H - 18], fill=(143, 216, 138) if done else (40, 60, 45), outline=(20, 20, 20), width=2)
        t(f'CPR  {min(beat + (1 if press else 0), BEATS)}/{BEATS}', W - 16, 12, 20, (255, 255, 255), 'ra')
        if 0 <= dur < 6: t('WATCH OUT!', 70, H // 2 + 50, 18, (255, 120, 110), 'ma')
    else:
        t('REVIVED!', W // 2, 64, 34, (255, 240, 160), 'ma')
        t('+1 heart, short invincibility', W // 2, 106, 20, (255, 255, 255), 'ma')

frames = []
total = INTRO + BEATS * BEAT_FR + OUTRO
for i in range(total):
    im, phase, beat, sub, press, dur = frame(i)
    big = im.resize((SW * K, SH * K), Image.NEAREST)
    ui(big, phase, beat, sub, press, dur, i)
    frames.append(big.convert('RGB'))
durs = [180] * INTRO + [FRAME_MS] * (BEATS * BEAT_FR) + [120] * (OUTRO - 1) + [1400]
frames[0].save(os.path.join(OUT, 'cpr_revive.gif'), save_all=True, append_images=frames[1:], duration=durs, loop=0)
# contact sheet of key frames
keys = [2, INTRO - 1, INTRO, INTRO + 1, INTRO + DUR_LAND, INTRO + 6 * BEAT_FR, INTRO + BEATS * BEAT_FR + 2, total - 1]
sheet = Image.new('RGB', (SW * K * 2 // 2 * 2, SH * K * 4), (20, 20, 20))
sheet = Image.new('RGB', (SW * K * 2, SH * K * 4))
for n, k in enumerate(keys): sheet.paste(frames[k], ((n % 2) * SW * K, (n // 2) * SH * K))
sheet.resize((sheet.width // 2, sheet.height // 2), Image.NEAREST).save(os.path.join(OUT, 'cpr_revive_frames.png'))
print('frames', total, 'ms/frame in CPR', FRAME_MS)
