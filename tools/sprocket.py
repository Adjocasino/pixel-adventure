"""Sprocket: the user's three-legged Shih Tzu (white + gray, no front-left leg) with a navy scarf
draped over his left shoulder like a sling, hiding the missing leg. Picture only, not in game.
Outputs assets/characters/sprocket/: sprocket_sheet.png, sprocket_walk.gif/.png, sprocket_frames.png"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from farmer import B, C

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O = os.path.join(ROOT, 'assets', 'characters', 'sprocket') + '/'
os.makedirs(O, exist_ok=True)
K = dict(
    gD=C('#5c595b'), g=C('#7f7b79'), gL=C('#a39e97'), gX=C('#c9c3b8'),      # gray coat
    w=C('#ece7dc'), wS=C('#d2cbbd'), wL=C('#faf8f2'),                        # white / cream fur
    beard=C('#e3d6b8'), nose=C('#1c1719'), eye=C('#1e1a1c'), shine=C('#ffffff'),
    sc=C('#22346b'), scS=C('#172552'), scL=C('#33498a'), scP=C('#c9d6f0'),   # navy scarf + white print
)


def ell(X, cx, cy, rx, ry, col):
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1: X(x, y, col(x, y) if callable(col) else col)


def side(f, near_missing=True, idle=False, blink=False, wag=0):
    """facing right. near_missing=True: the near (left) front leg is the missing one and the scarf
    drapes over the near shoulder. False is used (then mirrored) for facing left."""
    b = B(32, 26, 2, 2); X, R = b.X, b.R
    # gait: one front leg does a little hop; front end bobs; back legs alternate
    # labored 3-legged gait (6 frames): plant, push off the back legs, hop the one front leg,
    # heavy landing where the head and chest dip hard, recover, a tiny pause before the next hop
    bob = [0, 0, -1, 2, 1, 0][f] if not idle else 0
    fdx, flift = ([0, 0, 1, 2, 1, 0][f], [0, 0, 2, 0, 0, 0][f]) if not idle else (0, 0)
    bdx = [1, 1, -1, -1, 0, 0][f] if not idle else 0
    G = 21                                                    # ground row (paw bottoms)
    # far-side legs (darker): far back leg + far front leg if the far one is the real leg
    R(9 - bdx, 15, 2, 5, K['gD']); R(9 - bdx, G - 1, 3, 1, K['wS'])
    if near_missing:
        R(19 + fdx, 13 + bob, 2, G - 13 - bob - flift, K['gD']); R(19 + fdx, G - 1 - flift, 3, 1, K['wS'])
    # tail: fluffy curl over the back, white tip
    ty = -1 if wag else 0
    ell(X, 6, 7 + ty, 3.2, 3, K['gL']); ell(X, 5.5, 6 + ty, 2.4, 2, K['w']); ell(X, 7.5, 5 + ty, 1.6, 1.4, K['wL'])
    # body: gray back, lighter belly
    ell(X, 13, 13 + bob * .5, 8.5, 4.8, lambda x, y: K['w'] if y > 14 + bob * .5 else K['gL'] if y > 12 else K['g'])
    for x in range(7, 19, 3): X(x, 10 + (x % 2), K['gD'])            # fur texture
    for x in range(8, 18, 2): X(x, 17, K['wS'])
    # near back leg (fluffy white bottom)
    R(7 + bdx, 15, 3, 4, K['w']); R(6 + bdx, G - 2, 4, 2, K['w']); X(6 + bdx, G - 1, K['wS'])
    # near front leg only when it exists (facing left case)
    if not near_missing:
        R(19 + fdx, 13 + bob, 3, G - 15 - bob - flift, K['w']); R(18 + fdx, G - 2 - flift, 4, 2, K['w']); X(18 + fdx, G - 1 - flift, K['wS'])
    # head: round fluffy Shih Tzu head, white forehead blaze, long floppy ears, short snout, beard
    hy = bob
    ell(X, 22, 7 + hy, 5.2, 4.8, lambda x, y: K['gD'] if x < 19 else K['g'] if y < 6 + hy else K['gL'])
    R(21, 3 + hy, 3, 2, K['gX'])                                       # light streak on the forehead
    ell(X, 19.8, 8.5 + hy, 1.7, 2.8, K['gD']); X(19, 11 + hy, K['g'])   # ear hanging down
    ell(X, 25, 9.5 + hy, 2.2, 2, K['w'])                               # short white muzzle (flat face)
    X(26, 8 + hy, K['nose']); X(27, 8 + hy, K['nose']); X(26, 9 + hy, K['nose'])
    ell(X, 24.5, 12 + hy, 2.4, 1.8, K['beard']); X(23, 13 + hy, K['beard']); X(25, 14 + hy, K['beard'])   # beard
    R(22, 4 + hy, 4, 2, K['gX']); X(25, 6 + hy, K['wL']); X(22, 10 + hy, K['gX']); X(21, 9 + hy, K['gX'])   # graying face
    R(23, 5 + hy, 3, 1, K['wL'])                                       # white senior eyebrow tuft
    # forehead detail: wispy top-knot, fur strands, white blaze running down to the muzzle
    X(21, 1 + hy, K['gX']); X(23, 1 + hy, K['gL']); X(22, 2 + hy, K['wL'])
    X(19, 3 + hy, K['gL']); X(20, 4 + hy, K['gD']); X(21, 3 + hy, K['gD']); X(23, 3 + hy, K['g']); X(24, 4 + hy, K['gD'])
    X(25, 3 + hy, K['wL']); X(25, 4 + hy, K['wL']); X(26, 5 + hy, K['w']); X(26, 6 + hy, K['w'])
    if blink: X(23, 7 + hy, K['gD']); X(24, 7 + hy, K['gD'])
    else: X(23, 6 + hy, K['gD']); X(24, 6 + hy, K['gD']); X(23, 7 + hy, K['eye']); X(24, 7 + hy, K['eye'])   # droopy, half-closed
    # scarf: navy band around the neck + drape over the shoulder, white print
    for y in range(9, 14):
        for x in range(17, 21): X(x, y + hy, K['sc'] if (x + y) % 5 else K['scP'])
    if near_missing:   # sling drape covers the near shoulder where the leg would be
        for i, (a, z) in enumerate([(16, 21), (16, 22), (16, 22), (17, 22), (17, 21), (18, 21), (19, 20)]):
            for x in range(a, z + 1): X(x, 13 + i + hy, K['scS'] if x == a else K['scL'] if x == z else K['sc'])
        X(18, 15 + hy, K['scP']); X(20, 16 + hy, K['scP']); X(19, 18 + hy, K['scP']); X(21, 14 + hy, K['scP'])
        R(20, 11 + hy, 2, 2, K['scL']); X(22, 12 + hy, K['sc'])          # little knot on the shoulder
    else:              # facing left: we only see the band and the drape's edge behind the leg
        R(16, 13 + hy, 2, 4, K['scS']); X(16, 17 + hy, K['scS'])
    b.outline(.4)
    if f == 3 and not idle:     # heavy landing: little dust puff under the front paw
        for dx, dy in ((-2, 0), (3, 0), (-3, -1), (4, -1)):
            x, y = 19 + fdx + dx + b.ox, G + dy + b.oy
            if 0 <= x < b.w and 0 <= y < b.h: b.p[x, y] = C('#d9cfb4')
    return b.im


def front(f, blink=False):
    """facing the viewer. The dog's left is the viewer's right: that side has the scarf sling, no leg."""
    b = B(24, 26, 2, 2); X, R = b.X, b.R
    bob = [0, 0, -1, 2, 1, 0][f]; lift = [0, 0, 2, 0, 0, 0][f]; bk = [0, 1, 1, -1, -1, 0][f]
    G = 21
    # back legs peeking behind
    R(6 + (bk > 0), G - 3, 3, 3, K['w']); R(12 - (bk < 0), G - 3, 3, 3, K['w']); R(6, G - 1, 3, 1, K['wS']); R(12, G - 1, 3, 1, K['wS'])
    # body
    ell(X, 10, 15 + bob * .5, 6, 4.5, lambda x, y: K['w'] if y > 15 else K['gL'])
    # the one front leg (dog's right = viewer's left)
    R(5, 14 + bob, 3, G - 15 - bob - lift, K['w']); R(4, G - 2 - lift, 4, 2, K['w']); X(4, G - 1 - lift, K['wS'])
    # head
    hy = bob
    ell(X, 10, 7 + hy, 6.2, 5.3, lambda x, y: K['gL'] if 7 < x < 13 else K['g'])
    R(9, 3 + hy, 3, 3, K['gX'])                                        # forehead streak
    ell(X, 4.4, 8.5 + hy, 1.5, 2.8, K['gD']); ell(X, 15.6, 8.5 + hy, 1.5, 2.8, K['gD'])   # floppy ears
    ell(X, 10, 10 + hy, 3.2, 2.2, K['w'])
    R(8, 8 + hy, 1, 1, K['wL']); R(12, 8 + hy, 1, 1, K['wL'])
    R(9, 9 + hy, 3, 1, K['nose']); X(10, 10 + hy, K['nose'])
    ell(X, 10, 12.5 + hy, 2.6, 1.8, K['beard'])                         # beard
    R(7, 4 + hy, 7, 2, K['gX']); R(6, 8 + hy, 2, 2, K['gX']); R(13, 8 + hy, 2, 2, K['gX'])    # graying face
    R(5, 5 + hy, 3, 1, K['wL']); R(13, 5 + hy, 3, 1, K['wL'])           # white senior eyebrows
    # forehead detail: white blaze down the middle, fur parting strands, wispy tufts on top
    R(9, 2 + hy, 2, 7, K['wL']); X(9, 1 + hy, K['w']); X(10, 8 + hy, K['w'])
    X(7, 3 + hy, K['gD']); X(8, 2 + hy, K['gL']); X(12, 3 + hy, K['gD']); X(11, 2 + hy, K['gL'])
    X(6, 4 + hy, K['g']); X(14, 4 + hy, K['g']); X(8, 4 + hy, K['gL']); X(12, 4 + hy, K['gL'])
    X(7, 1 + hy, K['gX']); X(12, 1 + hy, K['gX']); X(10, 0 + hy, K['gX'])
    if blink: R(6, 7 + hy, 2, 1, K['gD']); R(13, 7 + hy, 2, 1, K['gD'])
    else: R(6, 6 + hy, 2, 1, K['gD']); R(13, 6 + hy, 2, 1, K['gD']); R(6, 7 + hy, 2, 1, K['eye']); R(13, 7 + hy, 2, 1, K['eye'])   # sleepy lids
    # scarf band + sling over the dog's left shoulder (viewer's right)
    for x in range(5, 16): X(x, 12 + hy, K['sc'] if x % 4 else K['scP']); X(x, 13 + hy, K['scS'])
    for i, (a, z) in enumerate([(10, 16), (11, 17), (11, 17), (12, 17), (12, 16), (13, 16)]):
        for x in range(a, z + 1): X(x, 14 + i + hy, K['scS'] if x == a else K['scL'] if x == z else K['sc'])
    X(13, 15 + hy, K['scP']); X(15, 17 + hy, K['scP']); X(14, 18 + hy, K['scP'])
    R(8, 13 + hy, 2, 2, K['scL'])                                         # knot
    b.outline(.4)
    return b.im


def back(f):
    """facing away. Dog's left = viewer's left: no front leg there, the scarf tail hangs over it."""
    b = B(24, 26, 2, 2); X, R = b.X, b.R
    bob = [0, 0, -1, 2, 1, 0][f]; lift = [0, 0, 2, 0, 0, 0][f]; bk = [0, 1, 1, -1, -1, 0][f]
    G = 21
    R(13, 14 + bob, 3, G - 15 - bob - lift, K['gD']); R(13, G - 2 - lift, 4, 2, K['wS'])      # far front leg (right)
    ell(X, 10, 13 + bob * .5, 6.5, 5, lambda x, y: K['gL'] if y > 13 else K['g'])
    ell(X, 10, 4.5 + bob, 5.5, 3.8, K['g']); R(8, 2 + bob, 4, 2, K['gX']); X(9, 1 + bob, K['wL']); X(11, 1 + bob, K['gX']); X(7, 3 + bob, K['gD']); X(13, 3 + bob, K['gD']); X(10, 3 + bob, K['wL'])                                   # back of the head
    ell(X, 5, 6 + bob, 1.4, 2.8, K['gD']); ell(X, 15, 6 + bob, 1.4, 2.8, K['gD'])
    # back legs, fluffy white
    R(5 + (bk > 0), G - 5, 3, 5, K['w']); R(12 - (bk < 0), G - 5, 3, 5, K['w'])
    R(4 + (bk > 0), G - 2, 4, 2, K['w']); R(12 - (bk < 0), G - 2, 4, 2, K['w'])
    # scarf: band + tie at the back of the neck, tails hanging over the left shoulder
    for x in range(5, 16): X(x, 8 + bob, K['sc'] if x % 4 else K['scP']); X(x, 9 + bob, K['scS'])
    R(4, 10 + bob, 3, 5, K['sc']); X(4, 15 + bob, K['scS']); X(5, 12 + bob, K['scP'])
    # tail curled up, white tip, wags
    w = [0, 1, 1, 0, -1, -1][f]
    ell(X, 10 + w, 12 + bob, 2.8, 2.6, K['w']); ell(X, 10 + w, 11 + bob, 1.6, 1.4, K['wL'])
    b.outline(.4)
    return b.im


if __name__ == '__main__':
    FL = lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)
    R_ = [side(f, near_missing=False) for f in range(6)]          # facing right: his real front leg is the near one
    L_ = [FL(side(f)) for f in range(6)]                          # facing left: sling on the near shoulder
    D_ = [FL(front(f)) for f in range(6)]
    U_ = [FL(back(f)) for f in range(6)]
    IDLE = [FL(side(0, idle=True)), FL(side(0, idle=True, wag=1)), FL(side(0, idle=True, blink=True))]
    FI = [FL(front(0)), FL(front(0, blink=True))]
    # raw sheet: rows right / left / down / up, 4 walk frames each (side 32x26, front/back 24x26), + idle row
    sh = Image.new('RGBA', (32 * 6, 26 * 5))
    for r, row in enumerate((R_, L_, D_, U_)):
        for c, im in enumerate(row): sh.alpha_composite(im, (c * 32, r * 26))
    for c, im in enumerate(IDLE + FI[1:]): sh.alpha_composite(im, (c * 32, 4 * 26))
    sh.save(O + 'sprocket_sheet.png')
    # zoomed frames sheet
    S = 7; bg = (95, 172, 114, 255)
    lab = Image.new('RGBA', (6 * (32 * S + 10) + 10, 5 * (26 * S + 10) + 10), bg)
    for r, row in enumerate((R_, L_, D_, U_, IDLE + FI)):
        for c, im in enumerate(row): lab.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (10 + c * (32 * S + 10), 10 + r * (26 * S + 10)))
    lab.convert('RGB').save(O + 'sprocket_frames.png')
    # walk gif: trots right, left, toward camera, away, then sits and wags
    W, H = 120, 40; frames = []
    def scene(spr, x, y):
        im = Image.new('RGBA', (W, H), bg)
        for i in range(W): im.putpixel((i, H - 6), (70, 140, 95, 255))
        im.alpha_composite(spr, (int(x), int(y))); return im
    STEP = [1, 1, 5, 3, 1, 0]          # lurching progress: most of the distance happens on the hop
    x = -30
    for k in range(36): frames.append(scene(R_[k % 6], x, H - 6 - 23)); x += STEP[k % 6]
    x = W
    for k in range(36): frames.append(scene(L_[k % 6], x, H - 6 - 23)); x -= STEP[k % 6]
    for k in range(12): frames.append(scene(D_[k % 6], 48, H - 6 - 23))
    for k in range(12): frames.append(scene(U_[k % 6], 48, H - 6 - 23))
    for k in range(12): frames.append(scene(IDLE[[0, 1, 0, 1, 0, 2][k % 6]], 44, H - 6 - 23))
    big = [f.resize((W * 5, H * 5), Image.NEAREST) for f in frames]
    big[0].save(O + 'sprocket_walk.png', save_all=True, append_images=big[1:], duration=150, loop=0)
    pf = [f.convert('RGB').convert('P', palette=Image.ADAPTIVE) for f in big]
    pf[0].save(O + 'sprocket_walk.gif', save_all=True, append_images=pf[1:], duration=150, loop=0)
    # size check next to Adjo
    far = Image.open(os.path.join(ROOT, 'assets/characters/farmer/farmer_sheet.png')).convert('RGBA').crop((22 * 4, 36, 22 * 5, 72))
    cmp = Image.new('RGBA', (70, 44), bg); cmp.alpha_composite(far, (8, 4)); cmp.alpha_composite(L_[0], (30, 44 - 4 - 23 - 1))
    cmp.resize((70 * 8, 44 * 8), Image.NEAREST).convert('RGB').save(O + 'sprocket_with_adjo.png')
    print('ok')
