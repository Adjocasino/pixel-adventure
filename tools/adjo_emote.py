"""Adjo's emote (picture only, not in game): a big dramatic kabuki-style pose (one arm thrust out with an
open palm, the other hand raised, one knee up, cheeky grin) while two little frogs hop side to side.
Outputs into assets/characters/farmer/: adjo_emote.gif, adjo_emote.png (APNG), adjo_emote_frames.png"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from farmer import P, B, C

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O = os.path.join(ROOT, 'assets', 'characters', 'farmer') + '/'
TD, TW = C('#3a2226'), C('#f6f2ea')
SPARK, SPARK2 = C('#fff6c8'), C('#ffffff')


def adjo(pose='idle', f=0, blink=False, head='front', hx=0, hy=0, look='front'):
    """front view. pose: idle | windup | pose. local coords match farmer.py (feet row 28)."""
    b = B(48, 44, 16, 10); X, R = b.X, b.R
    Y = 1 if pose == 'windup' else 0          # crouch a little before the pop
    # ---- legs
    if pose == 'pose':
        # standing leg (viewer left)
        R(4, 22, 3, 4, P['ov']); R(4, 22, 1, 4, P['ovL']); R(4, 25, 3, 1, P['ovL'])
        R(4, 26, 3, 3, P['boot']); X(4, 26, P['bootL']); R(4, 28, 3, 1, P['bootS'])
        # raised knee (viewer right): thigh out to the side, shin hanging, boot lifted
        R(9, 20, 5, 3, P['ov']); R(9, 20, 5, 1, P['ovL']); R(13, 20, 2, 5, P['ov']); R(14, 21, 1, 4, P['ovS'])
        R(12, 24, 4, 3, P['boot']); X(12, 24, P['bootL']); R(12, 26, 4, 1, P['bootS'])
    else:
        for lx in (4, 9):
            R(lx, 22, 3, 4 - Y, P['ov']); R(lx, 22, 1, 4 - Y, P['ovL']); R(lx, 25 - Y, 3, 1, P['ovL'])
            R(lx, 26 - Y, 3, 3, P['boot']); X(lx, 26 - Y, P['bootL']); R(lx, 28 - Y, 3, 1, P['bootS'])
        if pose == 'windup': R(3, 27, 3, 2, P['boot']); R(10, 27, 3, 2, P['boot']); R(3, 28, 3, 1, P['bootS']); R(10, 28, 3, 1, P['bootS'])
    # ---- hips, torso, bib (same as the walk sheet's front view)
    R(4, 18 + Y, 8, 4, P['ov']); R(4, 18 + Y, 1, 4, P['ovL']); R(10, 18 + Y, 2, 4, P['ovS']); X(7, 21 + Y, P['ovD']); X(8, 21 + Y, P['ovD'])
    R(4, 12 + Y, 8, 6, P['shirt']); R(4, 12 + Y, 1, 6, P['shirtL']); R(11, 12 + Y, 1, 6, P['shirtS'])
    R(5, 14 + Y, 6, 4, P['ov']); R(5, 14 + Y, 1, 4, P['ovL']); R(6, 15 + Y, 4, 2, P['ovS']); R(7, 15 + Y, 2, 1, P['ov'])
    X(5, 12 + Y, P['ov']); X(5, 13 + Y, P['ov']); X(10, 12 + Y, P['ovS']); X(10, 13 + Y, P['ovS']); X(5, 14 + Y, P['btn']); X(10, 14 + Y, P['btn'])
    for px in (4, 10): R(px, 18 + Y, 2, 2, P['ovS']); X(px, 18 + Y, P['stitch']); X(px + 1, 18 + Y, P['stitch'])
    X(7, 15 + Y, P['stitch']); X(8, 15 + Y, P['stitch'])
    # ---- arms
    if pose == 'idle':
        R(2, 12, 2, 3, P['shirt']); R(12, 12, 2, 3, P['shirtS']); R(2, 15, 2, 4, P['skin']); R(12, 15, 2, 4, P['skinS'])
    elif pose == 'windup':   # arms crossed in front of the chest, gathering power
        R(2, 13, 2, 3, P['shirt']); R(12, 13, 2, 3, P['shirtS'])
        R(3, 16, 10, 2, P['skin']); R(3, 17, 10, 1, P['skinS']); X(7, 16, P['skinS']); X(8, 17, P['skin'])
    else:
        # thrust arm (viewer left): straight out at shoulder height, big open palm, fingers spread
        R(1, 12, 3, 3, P['shirt']); R(-7, 12, 8, 2, P['skin']); R(-7, 13, 8, 1, P['skinS'])
        R(-11, 10, 4, 5, P['skin']); R(-11, 14, 4, 1, P['skinS'])
        for fx, fy in ((-12, 8), (-10, 7), (-8, 8)):            # three spread fingers up
            X(fx, fy, P['skin']); X(fx, fy + 1, P['skin']); X(fx + (1 if fx < -9 else 0), fy + 2, P['skin'])
        X(-13, 11, P['skin']); X(-14, 10, P['skin'])            # pinky out to the side
        X(-8, 15, P['skin']); X(-7, 16, P['skin'])             # thumb down
        X(-10, 12, P['skinS'])                                  # palm crease
        # raised arm (viewer right): bent up beside the hat, palm out
        R(12, 12, 3, 3, P['shirtS']); R(14, 6, 2, 7, P['skin']); R(15, 6, 1, 7, P['skinS'])
        R(14, 2, 4, 4, P['skin']); X(17, 3, P['skinS']); X(14, 1, P['skin']); X(16, 0, P['skin']); X(16, 1, P['skin']); X(18, 2, P['skin'])
    # ---- head (front), glasses, cheeky grin in the pose
    R(6, 11 + Y, 4, 1, P['skinS'])
    if hy < 0: R(6, 11 + Y + hy, 4, -hy + 1, P['skinS'])   # neck stretches when the chin goes up
    X0, R0 = X, R                      # head roll: shift the whole head + hat
    X = lambda x, y, c: X0(x + hx, y + hy, c)
    R = lambda x, y, w, h, c: R0(x + hx, y + hy, w, h, c)
    gy = -1 if look == 'up' else 0
    for i, (a, z) in enumerate([(5, 10), (4, 11), (3, 12), (3, 12), (3, 12), (3, 12), (3, 12), (4, 11), (5, 10)]):
        for x in range(a, z + 1): X(x, 2 + i + Y, P['skinS'] if x > 10 else P['skin'])
    mir = head == 'left'
    HX = (lambda x, y, c: X(15 - x, y, c)) if mir else X
    H = lambda x, y, c=P['hair']: HX(x, y + Y, c)
    Y += gy
    if head == 'front':
        for x in range(4, 12): H(x, 3); H(x, 4)
        for x in (4, 5, 7, 8, 10, 11): H(x, 5)
        H(6, 4, P['hairL']); H(9, 4, P['hairL'])
        for y in (5, 6): H(3, y); H(12, y)
        X(2, 6 + Y, P['skin']); X(2, 7 + Y, P['skinS']); X(13, 6 + Y, P['skinS']); X(13, 7 + Y, P['skinS'])
        for x0 in (3, 9):
            R(x0 + 1, 6 + Y, 2, 1, P['frameD']); X(x0, 7 + Y, P['frame']); X(x0 + 3, 7 + Y, P['frame']); X(x0, 8 + Y, P['frame']); X(x0 + 3, 8 + Y, P['frame'])
            X(x0 + 1, 7 + Y, P['lens']); X(x0 + 2, 7 + Y, P['lens']); X(x0 + 1, 8 + Y, P['lens']); X(x0 + 2, 8 + Y, P['lens'])
        X(7, 7 + Y, P['frameD']); X(8, 7 + Y, P['frameD'])
        if look == 'down': blink = True
        if blink: X(5, 8 + Y, P['skinS']); X(10, 8 + Y, P['skinS'])
        else: X(5, 7 + Y, P['eye']); X(5, 8 + Y, P['eye']); X(10, 7 + Y, P['eye']); X(10, 8 + Y, P['eye'])
        if pose == 'pose' and look != 'down':          # big confident grin (same teeth style as the sprint)
            X(5, 9, TD); R(6, 9, 4, 1, TW); X(10, 9, TD); X(7, 10, TD); X(8, 10, TD)
    elif head == 'back':
        for y in range(3, 11):
            for x in range(3 if y < 10 else 4, 13 if y < 10 else 12): H(x, y, P['hairL'] if (x + y) % 5 == 0 else P['hair'])
        X(2, 6 + Y, P['skinS']); X(2, 7 + Y, P['skinS']); X(13, 6 + Y, P['skinS']); X(13, 7 + Y, P['skinS'])
    else:   # side profile (right, or mirrored for left)
        for x in range(4, 12): H(x, 3); H(x, 4)
        for y in range(5, 10):
            for x in range(3, 7): H(x, y)
        H(9, 5); H(11, 5); H(12, 5); H(4, 5, P['hairL'])
        HX(6, 6 + Y, P['skinS']); HX(6, 7 + Y, P['skinS']); HX(5, 6 + Y, P['skin']); HX(5, 7 + Y, P['skinS'])
        for (x, y, c) in ((10, 6, 'frameD'), (11, 6, 'frameD'), (9, 7, 'frame'), (12, 7, 'frame'), (9, 8, 'frame'), (12, 8, 'frame'),
                          (11, 7, 'lens'), (11, 8, 'lens'), (7, 7, 'frameD'), (8, 7, 'frameD'), (10, 7, 'eye'), (10, 8, 'eye')):
            HX(x, y + Y, P[c])
        if pose == 'pose': HX(10, 9 + Y, TD); HX(11, 9 + Y, TW); HX(12, 9 + Y, TW); HX(11, 10 + Y, TD)
    Y -= gy
    # ---- straw hat (tilted back a touch in the pose)
    hty = Y - (1 if pose == 'pose' else 0) + (1 if look == 'down' else -1 if look == 'up' else 0)
    for y, a, z in ((-2, 5, 10), (-1, 4, 11), (0, 4, 11)):
        for x in range(a, z + 1): X(x, y + hty, P['hatL'] if x < 6 else P['hatS'] if x > 9 else P['hat'])
    for x in range(4, 12): X(x, 1 + hty, P['bandL'] if x < 6 else P['band'])
    for x in range(-1, 17): X(x, 2 + hty, P['hatL'] if x < 3 else P['hatS'] if x > 13 else P['hat'])
    for x in range(-2, 18): X(x, 3 + hty, P['hatD'] if x in (-2, 17) else P['hatS'])
    for x in range(0, 16, 3): X(x + (f % 2), 2 + hty, P['hatS'])
    X, R = X0, R0
    if pose == 'pose':   # raised hand goes in front of the brim
        R(14, 2, 4, 2, P['skin']); X(17, 3, P['skinS'])
    b.outline()
    return b.im


def frog(f):
    """little green frog, 12x10. f=0 sitting, 1 leaping (legs stretched)"""
    b = B(14, 12, 1, 1); X, R = b.X, b.R
    g, gL, gS, belly = C('#5cb85a'), C('#8ed46e'), C('#3d8a44'), C('#d8e8a0')
    if f == 0:
        R(1, 4, 10, 4, g); R(2, 3, 8, 1, g); R(1, 7, 10, 1, gS); R(3, 6, 6, 2, belly)
        R(0, 6, 2, 2, gS); R(10, 6, 2, 2, gS)                      # folded back legs
        R(2, 8, 2, 1, gS); R(8, 8, 2, 1, gS)                       # front feet
    else:
        R(2, 2, 8, 4, g); R(3, 1, 6, 1, g); R(4, 4, 4, 2, belly)
        R(0, 6, 2, 3, gS); R(10, 6, 2, 3, gS); X(0, 9, gS); X(11, 9, gS)   # legs stretched down
        R(3, 6, 2, 1, gS); R(7, 6, 2, 1, gS)
    ey = 2 if f == 0 else 0
    for ex in (2, 7):                                           # big frog eyes on top
        R(ex, ey, 3, 2, gL); X(ex + 1, ey, C('#ffffff')); X(ex + 1, ey + 1, C('#1e1a24'))
    X(5, ey + 3, C('#2b1d3a')) if f == 0 else None
    R(4, ey + 4, 4, 1, gS) if f == 0 else None                  # smile line
    X(3, ey + 3, C('#f08a9a')); X(8, ey + 3, C('#f08a9a'))      # blush
    b.outline(.35)
    return b.im


# ---------------- animation ----------------
W, H, GROUND = 96, 60, 52
BG = (95, 172, 114, 255)
IDLE, BLINK, WIND, POSE, POSEB = adjo('idle'), adjo('idle', blink=True), adjo('windup'), adjo('pose'), adjo('pose', blink=True)
ROLL = [adjo('pose', hx=-2, hy=1, look='down'), adjo('pose', hx=2, hy=0), adjo('pose', hx=0, hy=-2, look='up'), adjo('pose', hx=-2, hy=0)]
FROG = [frog(0), frog(1)]
FROGL = [i.transpose(Image.FLIP_LEFT_RIGHT) for i in FROG]
AX = W // 2 - 24      # Adjo sprite x (48 wide; local x0 = canvas 16)
AY = GROUND - 39      # feet row (local 28 + oy 10 = 38) sits on the ground


def put(im, spr, x, y): im.alpha_composite(spr, (int(round(x)), int(round(y))))


def burst(im, k, cx, cy):
    """impact lines + sparkles radiating out when the pose pops"""
    px = im.load()
    for i in range(12):
        a = i / 12 * 2 * math.pi + .13
        for r in range(int(10 + k * 6), int(16 + k * 10)):
            x, y = int(cx + math.cos(a) * r), int(cy + math.sin(a) * r * .8)
            if 0 <= x < W and 0 <= y < H: px[x, y] = SPARK2 if r % 3 else SPARK


def sparkle(im, x, y, s=1):
    px = im.load()
    for dx, dy in ((0, 0), (s, 0), (-s, 0), (0, s), (0, -s)):
        if 0 <= x + dx < W and 0 <= y + dy < H: px[x + dx, y + dy] = SPARK2 if (dx, dy) == (0, 0) else SPARK


def scene(t):
    im = Image.new('RGBA', (W, H), BG)
    for x in range(W): im.putpixel((x, GROUND + 1), (70, 140, 95, 255))
    # shadow
    for x in range(-7, 8): im.putpixel((W // 2 + x, GROUND), (60, 120, 82, 255))
    # ---- Adjo timeline (t = frame, 12 fps): 0-3 idle, 4-7 windup, 8 pop, 8-37 hold, 38-41 settle
    if t < 4: spr, dy = IDLE, 0
    elif t < 8: spr, dy = WIND, 0
    elif t < 38:
        spr = POSEB if t in (30, 31) else POSE
        if 10 <= t < 22: spr = ROLL[(t - 10) // 3]   # head roll: dip down, swing right, back (chin up), left, then the grin
        dy = -3 if t == 8 else -1 if t == 9 else 0
        dy += 0 if (t // 6) % 2 else 0
    elif t < 42: spr, dy = (WIND if t < 40 else IDLE), 0
    else: spr, dy = (BLINK if t == 44 else IDLE), 0
    put(im, spr, AX, AY + dy)
    if 8 <= t <= 11: burst(im, (t - 8) / 3, W // 2 - 4, GROUND - 22)
    if 10 <= t < 22:            # swoosh arc following the head roll
        px = im.load(); a0 = 2.4 + (t - 10) * .55
        for k in range(7):
            a = a0 - k * .22; x = int(W // 2 + math.cos(a) * 11); y = int(GROUND - 31 + math.sin(a) * 4)
            if 0 <= x < W and 0 <= y < H: px[x, y] = SPARK2 if k < 3 else SPARK
    if 10 <= t < 38:             # twinkle on the glasses + the open palm
        if t % 6 < 2: sparkle(im, W // 2 - 4, GROUND - 23, 1)
        if (t + 3) % 8 < 2: sparkle(im, W // 2 - 21, GROUND - 23, 2)
    # ---- two frogs: pop in at the feet, hop side to side crossing each other, then hop off
    if 10 <= t < 46:
        for i, (x0, x1) in enumerate(((W // 2 - 26, W // 2 + 14), (W // 2 + 14, W // 2 - 26))):
            k = t - 10
            if t >= 40:                                   # final hops off-screen
                side = -1 if i == 0 else 1
                kk = (t - 40) / 6
                x = (x0 if (5 % 2 == 0) else x1) + side * kk * 40
                hop = (t - 40) % 3
                y = GROUND - 9 - (4 if hop == 1 else 0)
                fr = (FROG if side > 0 else FROGL)[1 if hop == 1 else 0]
                put(im, fr, x, y); continue
            seg, ph = divmod(k, 6)                        # one hop every 6 frames
            a, bb = (x0, x1) if seg % 2 == 0 else (x1, x0)
            u = min(1, ph / 4)
            x = a + (bb - a) * u
            hgt = math.sin(u * math.pi) * 9 if ph < 4 else 0
            moving_right = bb > a
            fr = (FROG if moving_right else FROGL)[1 if 0 < ph < 4 else 0]
            if k < 2:                                     # pop-in puff
                for dx in (-3, 0, 3): sparkle(im, int(a + 6 + dx), GROUND - 6 - (k * 2), 1)
            put(im, fr, x, GROUND - 9 - hgt)
    return im


frames = [scene(t) for t in range(48)]
S = 5
big = [f.resize((W * S, H * S), Image.NEAREST) for f in frames]
big[0].save(O + 'adjo_emote.png', save_all=True, append_images=big[1:], duration=85, loop=0)
pf = [f.convert('RGB').convert('P', palette=Image.ADAPTIVE) for f in big]
pf[0].save(O + 'adjo_emote.gif', save_all=True, append_images=pf[1:], duration=85, loop=0)
# key frames strip: idle, windup, pop, hold, frogs mid-hop, settle
keys = [6, 8, 11, 14, 17, 20, 24, 41]
strip = Image.new('RGBA', (W * len(keys) * 4 + 10 * (len(keys) - 1), H * 4), (29, 27, 34, 255))
for i, t in enumerate(keys): strip.alpha_composite(frames[t].resize((W * 4, H * 4), Image.NEAREST), (i * (W * 4 + 10), 0))
strip.save(O + 'adjo_emote_frames.png')
# big close-up of the pose sprite
POSE.resize((48 * 10, 44 * 10), Image.NEAREST).save(O + 'adjo_pose_zoom.png')
print('ok')
