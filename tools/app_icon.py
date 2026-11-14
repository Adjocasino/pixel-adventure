"""App icon options: pixel-art cottage (32x32, scaled to 512). Pictures only, the app icon is unchanged.
A = wood (dark-to-light browns), B = meadow day, C = night (lit windows).
Output: assets/icon_options/icon_A_wood.png, icon_B_meadow.png, icon_C_night.png, icon_options.png"""
import os, math, random
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'icon_options')
os.makedirs(OUT, exist_ok=True)
N = 32
C = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5)) + (255,)

def rounded_mask(n, r=6):
    m = Image.new('L', (n, n), 0); d = ImageDraw.Draw(m); d.rounded_rectangle([0, 0, n - 1, n - 1], r, fill=255); return m

def cottage(im, P, logs=False, glow=False):
    d = ImageDraw.Draw(im); px = im.load()
    # body
    d.rectangle([8, 16, 23, 25], fill=P['wall'])
    if logs:
        for y in range(16, 26):
            col = P['wallL'] if y % 2 == 0 else P['wall']
            d.line([(8, y), (23, y)], fill=col)
            px[8, y] = P['wallD']; px[23, y] = P['wallD']
        for y in range(16, 26, 2): px[7, y] = P['wallL']; px[24, y] = P['wallL']   # log ends
    else:
        d.line([(8, 17), (23, 17)], fill=P['wallL'])
        d.line([(8, 24), (23, 24)], fill=P['wallS'])
        for x in (8, 15, 16, 23): d.line([(x, 17), (x, 25)], fill=P['beam'])     # timber frame
        d.line([(8, 21), (23, 21)], fill=P['beam'])
    d.rectangle([7, 16, 24, 25], outline=P['out'])
    # chimney
    d.rectangle([19, 7, 21, 12], fill=P['chim']); d.rectangle([18, 6, 22, 7], fill=P['chimT'])
    d.rectangle([18, 6, 22, 12], outline=P['out'])
    # roof
    roof = [(15.5, 4), (26, 16), (5, 16)]
    d.polygon(roof, fill=P['roof'])
    for y in range(6, 16, 2):                                   # shingle rows
        half = (y - 4) * 10.5 / 12
        d.line([(15.5 - half + 1, y), (15.5 + half - 1, y)], fill=P['roofS'])
    for y in range(5, 16):                                      # lit edge on the left slope
        half = (y - 4) * 10.5 / 12; px[int(15.5 - half) + 1, y] = P['roofL']
    d.line([(15.5, 4), (26, 16)], fill=P['out']); d.line([(15.5, 4), (5, 16)], fill=P['out'])
    d.line([(4, 16), (27, 16)], fill=P['out']); d.line([(5, 17), (26, 17)], fill=P['roofS'])
    # door
    d.rectangle([14, 19, 17, 25], fill=P['door']); d.rectangle([14, 19, 17, 25], outline=P['out'])
    px[16, 22] = P['knob']; d.line([(15, 20), (16, 20)], fill=P['doorL'])
    # windows
    for x0 in (9, 19):
        d.rectangle([x0, 18, x0 + 3, 21], fill=P['win'])
        d.line([(x0 + 1, 18), (x0 + 1, 21)], fill=P['winX']); d.line([(x0, 19), (x0 + 3, 19)], fill=P['winX'])
        px[x0 + 2, 20] = P['winL']; px[x0 + 3, 21] = P['winL']
        d.rectangle([x0 - 1, 17, x0 + 4, 22], outline=P['out'])
        d.line([(x0 - 1, 23), (x0 + 4, 23)], fill=P['sill'])
    # gable window (round)
    d.ellipse([14, 9, 17, 12], fill=P['win'], outline=P['out']); px[15, 10] = P['winL']
    if glow:   # small pixel glow: one warm pixel under each window sill
        for x0 in (9, 19):
            for x in range(x0, x0 + 4): px[x, 23] = P['glow']
    return im

def smoke(im, col, x=20, y=5):
    d = ImageDraw.Draw(im)
    for i, (dx, dy, r) in enumerate(((0, 0, 1), (1, -2, 1), (3, -4, 2))):
        d.ellipse([x + dx - r, y + dy - r, x + dx + r, y + dy + r], fill=col)

def option_A():
    """WOOD: everything in browns, dark to light, with warm amber windows"""
    im = Image.new('RGBA', (N, N)); d = ImageDraw.Draw(im)
    for y in range(N):                                           # wood-plank background
        band = (y // 4) % 2
        d.line([(0, y), (N, y)], fill=C('#d8ac72') if band else C('#c99a5e'))
        if y % 4 == 0: d.line([(0, y), (N, y)], fill=C('#b5844c'))
    for (x, y) in ((5, 2), (25, 7), (3, 13), (28, 21)): d.point((x, y), fill=C('#a0703c'))   # knots
    d.rectangle([0, 26, N, N], fill=C('#8a5a30')); d.line([(0, 26), (N, 26)], fill=C('#6e4626'))
    P = dict(wall=C('#7a4e2c'), wallL=C('#9a6638'), wallS=C('#6b4528'), wallD=C('#4a2e1a'), beam=C('#4a2e1a'),
             roof=C('#4a2c18'), roofS=C('#36200f'), roofL=C('#6b4528'), chim=C('#6b4528'), chimT=C('#8a5a30'),
             door=C('#2e1c0e'), doorL=C('#4a2e1a'), knob=C('#e0b876'), win=C('#ffcf73'), winX=C('#4a2e1a'), winL=C('#fff0c0'),
             sill=C('#9a6638'), out=C('#22140a'), glow=C('#e8b060'))
    cottage(im, P, logs=True, glow=True)
    smoke(im, C('#f2e2c6'))
    return im

def option_B():
    """MEADOW DAY: sky, hills, cream walls, red roof, flowers"""
    im = Image.new('RGBA', (N, N)); d = ImageDraw.Draw(im)
    for y in range(N):
        t = y / 26; d.line([(0, y), (N, y)], fill=(int(120 + 90 * t), int(196 + 40 * t), int(240 + 10 * t), 255))
    for x in range(N):
        h = 22 + math.sin(x * .3) * 1.5; d.line([(x, int(h)), (x, N)], fill=C('#9fd08a'))
    d.rectangle([0, 26, N, N], fill=C('#6fbf4f')); d.line([(0, 26), (N, 26)], fill=C('#4f8f3d'))
    for (x, y) in ((3, 2), (4, 2), (5, 3), (2, 3)): d.point((x, y), fill=(255, 255, 255, 255))   # cloud
    d.rectangle([2, 3, 6, 4], fill=(255, 255, 255, 255))
    P = dict(wall=C('#f4ead2'), wallL=C('#fffaf0'), wallS=C('#dccfb0'), wallD=C('#b8a888'), beam=C('#8a5a30'),
             roof=C('#c8553d'), roofS=C('#9e3d2c'), roofL=C('#e2775a'), chim=C('#b07a5a'), chimT=C('#d09a78'),
             door=C('#7a4a2a'), doorL=C('#9a6a40'), knob=C('#f2c56b'), win=C('#9fd8f4'), winX=C('#ffffff'), winL=C('#e8f8ff'),
             sill=C('#8a5a30'), out=C('#3a2418'))
    cottage(im, P)
    for (x, y, c) in ((4, 28, '#ff8fa3'), (7, 29, '#fff06a'), (26, 28, '#ff8fa3'), (28, 30, '#ffffff'), (2, 30, '#fff06a'), (24, 30, '#9ab8ff')):
        d.point((x, y), fill=C(c))
    smoke(im, (255, 255, 255, 230))
    return im

def option_C():
    """NIGHT: deep blue-violet sky, moon, stars, glowing windows"""
    im = Image.new('RGBA', (N, N)); d = ImageDraw.Draw(im)
    for y in range(N):
        t = y / 26; d.line([(0, y), (N, y)], fill=(int(30 + 40 * t), int(34 + 30 * t), int(80 + 50 * t), 255))
    random.seed(3)
    for _ in range(14):
        x, y = random.randrange(N), random.randrange(18); d.point((x, y), fill=(230, 236, 255, 255 if random.random() < .5 else 150))
    d.ellipse([24, 2, 29, 7], fill=C('#f6efc8')); d.ellipse([26, 1, 31, 6], fill=(42, 46, 94, 255))   # crescent moon
    for x in range(N):
        h = 23 + math.sin(x * .25 + 1) * 1.5; d.line([(x, int(h)), (x, N)], fill=C('#2f4a3a'))
    d.rectangle([0, 26, N, N], fill=C('#24402c')); d.line([(0, 26), (N, 26)], fill=C('#1a3020'))
    P = dict(wall=C('#b8a890'), wallL=C('#cfc0a6'), wallS=C('#968872'), wallD=C('#7a6e5c'), beam=C('#5a3e2a'),
             roof=C('#2a42a6'), roofS=C('#1c2c7c'), roofL=C('#4a64c4'), chim=C('#7a6e5c'), chimT=C('#968872'),
             door=C('#4a2e1a'), doorL=C('#6b4528'), knob=C('#ffd36a'), win=C('#ffd36a'), winX=C('#8a5a2b'), winL=C('#fff4c0'),
             sill=C('#5a3e2a'), out=C('#14182e'), glow=C('#c9a24a'))
    cottage(im, P, glow=True)
    # warm light spilling on the grass
    for x in range(10, 22): d.point((x, 27), fill=C('#3e5a3a'))   # faint light on the grass
    smoke(im, (200, 205, 230, 200))
    return im

def option_B2():
    """MEADOW + a bit of wood orange: orange timber frame, door, sills and a little wooden fence"""
    im = option_B(); d = ImageDraw.Draw(im); px = im.load()
    WO, WOL, WOD = C('#d0803c'), C('#e8a058'), C('#9a5a28')
    # re-colour the timber frame, door and sills to warm orange wood
    for y in range(N):
        for x in range(N):
            c = px[x, y]
            if c == C('#8a5a30'): px[x, y] = WO          # beams + sills
            elif c == C('#7a4a2a'): px[x, y] = WOD       # door
            elif c == C('#9a6a40'): px[x, y] = WOL       # door highlight
    # little wooden fence in front of the grass
    for x in range(2, 30):
        if x in range(13, 19): continue                  # gap at the door path
        d.point((x, 27), fill=WO if x % 3 else WOD)
        if x % 3 == 0: d.line([(x, 26), (x, 29)], fill=WOD); d.point((x, 25), fill=WOL)
    d.line([(2, 28), (12, 28)], fill=WO); d.line([(19, 28), (29, 28)], fill=WO)
    d.line([(14, 26), (17, 26)], fill=C('#e0c08a')); d.rectangle([14, 27, 17, 31], fill=C('#e0c08a'))   # dirt path
    return im

def finish(im):
    m = rounded_mask(N, 6); out = Image.new('RGBA', (N, N)); out.paste(im, (0, 0), m); return out

if __name__ == '__main__':
    opts = {'A_wood': option_A(), 'B_meadow': option_B(), 'C_night': option_C()}
    if os.environ.get('B2'): opts = {'B_meadow': option_B(), 'B2_meadow_wood': option_B2()}
    big = {}
    for k, im in opts.items():
        im = finish(im); b = im.resize((512, 512), Image.NEAREST); b.save(os.path.join(OUT, f'icon_{k}.png')); big[k] = (im, b)
    # comparison sheet: big + launcher-size previews (48 and 96 px) on a phone-like background
    sheet = Image.new('RGBA', (len(opts) * 300 + 40, 470), C('#2b2f36')); d = ImageDraw.Draw(sheet)
    from PIL import ImageFont
    names = {'A_wood': 'A  Wood', 'B_meadow': 'B  Meadow', 'C_night': 'C  Night', 'B2_meadow_wood': 'B2  Meadow + wood'}
    for i, k in enumerate(opts):
        im, b = big[k]; x = 20 + i * 300
        sheet.alpha_composite(b.resize((256, 256), Image.NEAREST), (x + 12, 20))
        sheet.alpha_composite(im.resize((96, 96), Image.NEAREST), (x + 40, 300))
        sheet.alpha_composite(im.resize((48, 48), Image.NEAREST), (x + 170, 324))
        d.text((x + 140, 420), names[k], font=ImageFont.load_default(size=22), fill=(255, 255, 255), anchor='ma')
    sheet.save(os.path.join(OUT, 'icon_B_vs_B2.png' if os.environ.get('B2') else 'icon_options.png'))
    print('ok')
