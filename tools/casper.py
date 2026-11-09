"""Casper: the user's white Aspin (Filipino street dog). Lean build, short white coat, cream-tan floppy
ear tips, amber eyes with pink rims, pink nose, happy open mouth with a pink tongue, brown toenails.
He barks when you interact with him and does a backflip. Picture only, not in game.
Outputs assets/characters/casper/: casper_sheet.png, casper_frames.png, casper_demo.gif/.png"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFont
from farmer import B, C

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O = os.path.join(ROOT, 'assets', 'characters', 'casper') + '/'
os.makedirs(O, exist_ok=True)
K = dict(w=C('#f7f3ea'), wS=C('#e2d9c8'), wD=C('#c9bda8'), ear=C('#ecd1a6'), earS=C('#d3ad7c'),
         nose=C('#c98686'), noseD=C('#9f6060'), eye=C('#c98a34'), eyeD=C('#5a3a1e'), rim=C('#eaa49a'),
         tongue=C('#f08c9c'), mouth=C('#7a3a44'), nail=C('#6b4a3a'), shine=C('#ffffff'))


def ell(X, cx, cy, rx, ry, col):
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1: X(x, y, col(x, y) if callable(col) else col)


def head(X, R, hx, hy, mode, f, blink):
    """right-facing Aspin head: wedge skull, long snout, folded cream ear, amber eye, pink nose"""
    ell(X, 25 + hx, 6 + hy, 4.1, 3.7, K['w'])
    R(26 + hx, 5 + hy, 5, 3, K['w']); R(26 + hx, 7 + hy, 5, 1, K['wS'])           # snout
    X(31 + hx, 5 + hy, K['nose']); X(31 + hx, 6 + hy, K['noseD']); X(30 + hx, 5 + hy, K['nose'])
    # semi-floppy ear on the side of the head: white base, cream-tan flap folding down, darker tip
    for y, x0, x1 in ((2, 22, 24), (3, 21, 24), (4, 21, 24), (5, 21, 23), (6, 22, 23)):
        for x in range(x0, x1 + 1): X(x + hx, y + hy, K['w'] if y < 3 else K['ear'] if x > x0 else K['earS'])
    X(24 + hx, 1 + hy, K['w']); X(23 + hx, 1 + hy, K['w']); X(22 + hx, 7 + hy, K['earS'])
    if blink: R(26 + hx, 4 + hy, 2, 1, K['rim'])
    else: X(27 + hx, 4 + hy, K['eye']); X(26 + hx, 4 + hy, K['eyeD']); X(27 + hx, 3 + hy, K['rim'])
    my = 8 + hy
    if mode == 'bark' and f % 2 == 0:      # jaw drops: big bark
        R(26 + hx, my, 5, 1, K['mouth']); R(27 + hx, my + 1, 3, 1, K['tongue']); R(26 + hx, my + 2, 4, 1, K['w'])
    else:                                  # happy pant, little tongue
        R(27 + hx, my, 4, 1, K['mouth']); X(28 + hx, my + 1, K['tongue']); X(29 + hx, my + 1, K['tongue'])
        if f % 2 == 0: X(28 + hx, my + 2, K['tongue'])
        R(25 + hx, my, 2, 1, K['wS'])


def side(f=0, mode='walk', blink=False):
    """facing right. mode: walk | stand | sit | bark | crouch | tuck (for the flip)"""
    b = B(38, 30, 2, 3); X, R = b.X, b.R
    G = 25
    if mode == 'tuck':           # balled up mid-flip: legs tucked under, head in
        ell(X, 16, 14, 7.6, 5.8, lambda x, y: K['wS'] if y > 15 else K['w'])
        R(11, 17, 3, 2, K['wS']); R(18, 17, 3, 2, K['wS']); X(11, 19, K['nail']); X(20, 19, K['nail'])
        ell(X, 22, 10, 3.4, 3, K['w']); R(23, 10, 4, 2, K['w']); X(27, 10, K['nose']); X(26, 10, K['nose'])
        R(20, 7, 2, 2, K['ear']); X(23, 9, K['eye'])
        X(9, 11, K['w']); X(8, 10, K['w']); X(8, 9, K['w'])
        b.outline(.45); return b.im
    if mode == 'sit':
        ell(X, 11, 19, 5.8, 5.2, lambda x, y: K['wS'] if y > 20 else K['w'])        # haunch
        R(7, G - 2, 6, 2, K['wS']); X(7, G - 1, K['nail']); X(9, G - 1, K['nail'])
        R(13, 13, 6, 8, K['w'])
        ell(X, 17, 13, 4.8, 5.2, K['w'])                                            # upright chest
        R(15, 16, 3, G - 16, K['wS']); R(18, 16, 3, G - 16, K['w']); X(16, G - 1, K['nail']); X(18, G - 1, K['nail'])
        for i in range(4): R(18 + i, 9 - i, 3, 4, K['w'])                         # neck
        wag = f % 2
        for i, (dx, dy) in enumerate(((0, 0), (-1, 0), (-2, -1), (-3, -1), (-4, -2 + wag), (-5, -3 + wag))): X(6 + dx, 21 + dy, K['w'] if i < 4 else K['wS'])
        head(X, R, -2, -1, mode, f, blink)
        b.outline(.45); return b.im
    crouch = 2 if mode == 'crouch' else 0
    bob = [0, -1, 0, -1][f] if mode == 'walk' else 0
    by = bob + crouch + 2                  # shorter legs, sturdier Aspin
    sw = [2, 1, -2, -1][f] if mode == 'walk' else 0
    def leg(x, dx, col, lift=0):
        top = 13 + by
        R(x + dx, top, 3, G - top - lift, col); X(x + dx, G - 1 - lift, K['nail']); X(x + dx + 2, G - 1 - lift, K['nail'])
    # far legs (shaded), diagonal pairs swing together
    leg(11, -sw, K['wS'], lift=1 if sw < 0 else 0); leg(21, sw, K['wS'], lift=1 if sw > 0 else 0)
    # lean body: deep chest, tucked waist, narrow hips
    ell(X, 20, 11.5 + by, 4.8, 4.6, K['w']); ell(X, 10.5, 11 + by, 4.8, 4.2, K['w'])      # a bit more weight
    R(11, 8 + by, 9, 6, K['w']); R(11, 14 + by, 9, 1, K['wS']); R(17, 15 + by, 5, 1, K['wS']); R(7, 14 + by, 6, 1, K['wS'])
    # near legs
    leg(9, sw, K['w'], lift=1 if sw > 0 else 0); leg(19, -sw, K['w'], lift=1 if sw < 0 else 0)
    # thin tail curving up
    wag = (f % 2) if mode in ('bark', 'stand') else 0
    for i, (dx, dy) in enumerate(((0, 0), (-1, -1), (-2, -2), (-2, -3), (-2 + wag, -4), (-1 + wag * 2, -5))): X(7 + dx, 10 + by + dy, K['w'] if i < 4 else K['wS'])
    # neck angled up-forward, head out front
    lift = -1 if mode == 'bark' else 0
    for i in range(4): R(20 + i, 9 - i + by + lift, 4, 5, K['w'])
    head(X, R, 0, by + lift, mode, f, blink)
    b.outline(.45)
    return b.im


def front(f=0, blink=False):
    b = B(26, 30, 2, 2); X, R = b.X, b.R
    G = 25; bob = [0, -1, 0, -1][f]; sw = [1, 0, -1, 0][f]
    # legs (back pair behind, front pair)
    R(6, 18, 2, G - 18 - (sw < 0), K['wS']); R(14, 18, 2, G - 18 - (sw > 0), K['wS'])
    ell(X, 11, 16 + bob, 6.6, 5.8, lambda x, y: K['wS'] if y > 17 + bob else K['w'])
    R(7, 17 + bob, 3, G - 17 - bob - (sw > 0), K['w']); R(12, 17 + bob, 3, G - 17 - bob - (sw < 0), K['w'])
    for x0, l in ((7, sw > 0), (12, sw < 0)): X(x0, G - 1 - l, K['nail']); X(x0 + 2, G - 1 - l, K['nail'])
    # head: long face, ears flopping out at the sides with cream tips
    hy = bob
    ell(X, 11, 7 + hy, 5, 4.6, K['w'])
    R(9, 8 + hy, 5, 5, K['w']); R(9, 12 + hy, 5, 1, K['wS'])
    for ex, d in ((5, -1), (16, 1)):
        R(ex, 3 + hy, 2, 2, K['w']); R(ex + d, 4 + hy, 2, 3, K['ear']); X(ex + d * 2, 6 + hy, K['earS']); X(ex + d, 7 + hy, K['earS'])
    if blink: R(8, 7 + hy, 2, 1, K['rim']); R(13, 7 + hy, 2, 1, K['rim'])
    else:
        for ex in (8, 13): X(ex, 7 + hy, K['eye']); X(ex + 1, 7 + hy, K['eyeD']); X(ex, 6 + hy, K['rim']); X(ex + 1, 6 + hy, K['rim'])
    R(10, 10 + hy, 3, 2, K['nose']); X(11, 11 + hy, K['noseD']); X(10, 10 + hy, K['shine'])
    R(9, 13 + hy, 5, 1, K['mouth']); X(11, 14 + hy, K['tongue']); X(12, 14 + hy, K['tongue'])
    b.outline(.45)
    return b.im


def back(f=0):
    b = B(26, 30, 2, 2); X, R = b.X, b.R
    G = 25; bob = [0, -1, 0, -1][f]; sw = [1, 0, -1, 0][f]
    R(7, 17 + bob, 2, G - 17 - bob - (sw > 0), K['wS']); R(13, 17 + bob, 2, G - 17 - bob - (sw < 0), K['wS'])
    ell(X, 11, 14 + bob, 6.6, 6.2, lambda x, y: K['wS'] if y > 16 + bob else K['w'])
    ell(X, 11, 6 + bob, 4.5, 4, K['w'])
    for ex, d in ((5, -1), (16, 1)): R(ex, 3 + bob, 2, 3, K['w']); R(ex + d, 4 + bob, 2, 2, K['ear'])
    R(6, 19 + bob, 3, G - 19 - bob - (sw < 0), K['w']); R(13, 19 + bob, 3, G - 19 - bob - (sw > 0), K['w'])
    t = [0, 1, 0, -1][f]
    for i in range(6): X(11 + (t if i > 2 else 0), 16 + bob - i, K['w'] if i < 4 else K['wS'])
    b.outline(.45)
    return b.im


if __name__ == '__main__':
    FL = lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)
    WR = [side(f) for f in range(4)]; WL = [FL(i) for i in WR]
    D = [front(f) for f in range(4)]; U = [back(f) for f in range(4)]
    SIT = [side(0, 'sit'), side(1, 'sit'), side(0, 'sit', blink=True)]
    BARK = [side(0, 'bark'), side(1, 'bark')]
    STAND, CROUCH, TUCK = side(0, 'stand'), side(0, 'crouch'), side(0, 'tuck')
    # sheet: rows walk right / left / down / up (4 each), sit+bark row, flip parts row
    sh = Image.new('RGBA', (38 * 4, 30 * 6))
    for r, row in enumerate((WR, WL, D, U, SIT[:2] + BARK, [STAND, CROUCH, TUCK, SIT[2]])):
        for c, im in enumerate(row): sh.alpha_composite(im, (c * 38, r * 30))
    sh.save(O + 'casper_sheet.png')
    S = 6; bg = (95, 172, 114, 255)
    lab = Image.new('RGBA', (4 * (38 * S + 10) + 10, 6 * (30 * S + 10) + 10), bg)
    for r, row in enumerate((WR, WL, D, U, SIT[:2] + BARK, [STAND, CROUCH, TUCK, SIT[2]])):
        for c, im in enumerate(row): lab.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (10 + c * (38 * S + 10), 10 + r * (30 * S + 10)))
    lab.convert('RGB').save(O + 'casper_frames.png')

    # ---------- demo: walk in, sit, get interacted with -> barks, then BACKFLIP, lands, happy bark
    W, H, GY = 130, 64, 58
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    frames = []   # (small image, caption text, text pos)
    def scene(spr, x, y, txt=None, bubble=False):
        im = Image.new('RGBA', (W, H), bg)
        for i in range(W): im.putpixel((i, GY), (70, 140, 95, 255))
        im.alpha_composite(spr, (int(x), int(y)))
        d = ImageDraw.Draw(im)
        if bubble:          # little "!" pop above his head
            d.rectangle((x + 23, y - 4, x + 27, y + 1), fill=(255, 255, 255, 255), outline=(43, 29, 58, 255))
            d.line((x + 25, y - 3, x + 25, y - 1), fill=(200, 60, 60, 255)); d.point((x + 25, y + 0), fill=(200, 60, 60, 255))
        frames.append((im, txt, (x + 30, y - 2)))
    base = GY - 26
    for k in range(16): scene(WR[k % 4], -30 + k * 4, base)
    for k in range(6): scene(STAND if k < 3 else SIT[k % 2], 34, base)
    scene(SIT[2], 34, base)
    for k in range(3): scene(STAND, 34, base, bubble=True)                 # you press A
    for k in range(8): scene(BARK[k % 2], 34, base, txt='Arf! Arf!' if k % 4 < 2 else None)
    # backflip: crouch, launch, spin backwards in an arc, land, happy bark
    for k in range(2): scene(CROUCH, 34, base)
    N = 10
    for k in range(N + 1):
        u = k / N; ang = 360 * u                                               # backflip = head goes up and back
        hgt = math.sin(u * math.pi) * 26
        spr = TUCK if 0 < k < N else STAND
        rot = spr.rotate(ang, resample=Image.NEAREST, expand=False, center=(16, 16))
        scene(rot, 34 - math.sin(u * math.pi) * 3, base - hgt)
    scene(CROUCH, 34, base)
    for k in range(6): scene(BARK[k % 2], 34, base, txt='Arf!' if k < 3 else None)
    for k in range(4): scene(SIT[k % 2], 34, base)
    big = []
    for im, txt, (tx, ty) in frames:
        bi = im.resize((W * 5, H * 5), Image.NEAREST)
        if txt:
            d = ImageDraw.Draw(bi); d.text((tx * 5, ty * 5 - 30), txt, font=font, fill='white', stroke_width=4, stroke_fill=(43, 29, 58))
        big.append(bi)
    big[0].save(O + 'casper_demo.png', save_all=True, append_images=big[1:], duration=95, loop=0)
    pf = [f.convert('RGB').convert('P', palette=Image.ADAPTIVE) for f in big]
    pf[0].save(O + 'casper_demo.gif', save_all=True, append_images=pf[1:], duration=95, loop=0)
    # flip key frames strip
    keys = [i for i, (im, t, p) in enumerate(frames)][37:52:2]
    st = Image.new('RGBA', (len(keys) * W * 3, H * 3), bg)
    for i, k in enumerate(keys): st.alpha_composite(frames[k][0].resize((W * 3, H * 3), Image.NEAREST), (i * W * 3, 0))
    st.crop((0, 0, st.width, st.height)).save(O + 'casper_flip_strip.png')
    print('ok', len(frames))
