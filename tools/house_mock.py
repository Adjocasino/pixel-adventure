"""Cottage interior layout mockups (picture only, not in game).
3/4 top-down like the outdoor maps, 16px tiles, with the three cats placed inside.
Outputs assets/ui/house_layout_1.png, house_layout_2.png, house_layouts.png"""
import os, random
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'ui'); os.makedirs(OUT, exist_ok=True)
T, S = 16, 4
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
F_T, F_N, F_L = ImageFont.truetype(FB, 34), ImageFont.truetype(FB, 22), ImageFont.truetype(FB, 24)
def C(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)
def sh(c, k): return tuple(max(0, min(255, int(v * k))) for v in c[:3]) + (255,)
OUTL = C('#2b1d3a')

class Room:
    def __init__(s, tw, th):
        s.W, s.H = tw * T, th * T
        s.im = Image.new('RGBA', (s.W, s.H), C('#1d1b22')); s.d = ImageDraw.Draw(s.im)
        s.tags = []  # (num, x, y) in px
    # ---- primitives
    def box(s, x, y, w, h, top, front_h=0, front=None):
        """furniture block: top face w*h, front face below it"""
        d = s.d; front = front or sh(top, .72)
        d.rectangle((x, y, x + w - 1, y + h + front_h - 1), fill=OUTL)
        d.rectangle((x + 1, y + 1, x + w - 2, y + h - 1), fill=top)
        d.line((x + 1, y + 1, x + w - 2, y + 1), fill=sh(top, 1.18))
        if front_h: d.rectangle((x + 1, y + h, x + w - 2, y + h + front_h - 2), fill=front)
    def tag(s, n, x, y): s.tags.append((n, x, y))
    # ---- room shell
    def floor(s, x0, y0, x1, y1, kind='wood'):
        rnd = random.Random(x0 * 7 + y0); px = s.im.load()
        for y in range(y0, y1):
            for x in range(x0, x1):
                if kind == 'wood':
                    plank = (y - y0) // 6
                    c = C('#b07a4a') if plank % 2 else C('#a46f42')
                    if (x + plank * 11) % 32 == 0 or (y - y0) % 6 == 5: c = C('#8a5a34')
                else:  # tile
                    c = C('#d9cdb4') if ((x // 8) + (y // 8)) % 2 else C('#cbbd9f')
                    if x % 8 == 0 or y % 8 == 0: c = C('#b5a688')
                if rnd.random() < .04: c = sh(c, .93)
                px[x, y] = c
    def wall(s, x0, x1, y0, h=2 * T, paper=C('#6f8f7a')):
        d = s.d
        d.rectangle((x0, y0, x1 - 1, y0 + h - 1), fill=paper)
        for x in range(x0 + 4, x1, 8): d.line((x, y0 + 3, x, y0 + h - 8), fill=sh(paper, .9))   # stripes
        d.rectangle((x0, y0 + h - 6, x1 - 1, y0 + h - 1), fill=C('#7a4f30'))                  # wainscot
        d.line((x0, y0 + h - 6, x1 - 1, y0 + h - 6), fill=C('#9c6a42'))
        d.line((x0, y0 + h - 1, x1 - 1, y0 + h - 1), fill=OUTL)
    def window(s, x, y, w=24):
        d = s.d
        d.rectangle((x, y, x + w - 1, y + 16), fill=OUTL)
        d.rectangle((x + 1, y + 1, x + w - 2, y + 15), fill=C('#e8d6b0'))
        d.rectangle((x + 3, y + 3, x + w - 4, y + 13), fill=C('#8fd0f0'))
        d.line((x + w // 2, y + 3, x + w // 2, y + 13), fill=C('#e8d6b0')); d.line((x + 3, y + 8, x + w - 4, y + 8), fill=C('#e8d6b0'))
        d.line((x + 4, y + 4, x + 7, y + 4), fill=C('#d6f2ff'))
        d.rectangle((x - 2, y + 16, x + w + 1, y + 19), fill=OUTL); d.rectangle((x - 1, y + 16, x + w, y + 18), fill=C('#c79a62'))  # sill
    # ---- furniture
    def bed(s, x, y):
        s.box(x, y, 26, 34, C('#7a4f30'), 4)
        d = s.d
        d.rectangle((x + 2, y + 3, x + 23, y + 10), fill=C('#f2ece0'))               # pillow
        d.rectangle((x + 2, y + 12, x + 23, y + 32), fill=C('#3f6fb8'))              # blanket
        for k in range(14, 32, 4): d.line((x + 2, y + k, x + 23, y + k), fill=C('#5a8ad0'))
        d.line((x + 2, y + 12, x + 23, y + 12), fill=C('#8fb6e8'))
    def fireplace(s, x, y):
        d = s.d
        d.rectangle((x, y, x + 31, y + 30), fill=OUTL)
        d.rectangle((x + 1, y + 1, x + 30, y + 29), fill=C('#8c8794'))
        for yy in range(y + 4, y + 29, 5):
            off = 0 if (yy // 5) % 2 else 4
            for xx in range(x + 1 + off, x + 30, 8): d.line((xx, yy - 4, xx, yy), fill=C('#6f6a78'))
            d.line((x + 1, yy, x + 30, yy), fill=C('#6f6a78'))
        d.rectangle((x - 2, y + 4, x + 33, y + 7), fill=C('#7a4f30'))                # mantle
        d.rectangle((x + 8, y + 14, x + 23, y + 29), fill=C('#2a1a14'))              # opening
        for i, c in enumerate(['#ffd060', '#ff8a3a', '#e04a2a']):
            d.polygon([(x + 10 + i * 2, y + 29), (x + 15 + (i % 2), y + 17 + i * 3), (x + 21 - i * 2, y + 29)], fill=C(c))
    def kitchen(s, x, y, n=3):
        for i in range(n):
            s.box(x + i * 16, y, 16, 10, C('#d9c7a2'), 12, C('#8a5a34'))
            s.d.rectangle((x + i * 16 + 6, y + 15, x + i * 16 + 9, y + 15), fill=C('#e8d6b0'))  # handle
        sx = x + 16   # stove top
        for (a, b) in ((4, 3), (10, 6)): s.d.ellipse((sx + a - 2, y + b - 2, sx + a + 2, y + b + 2), fill=C('#3a3438'))
        s.d.rectangle((x + 36, y + 2, x + 43, y + 7), fill=C('#9fb8c8'))             # sink
    def table(s, x, y, w=28):
        s.box(x, y, w, 16, C('#c48a52'), 5)
        d = s.d
        d.ellipse((x + 6, y + 4, x + 11, y + 8), fill=C('#f2ece0'))                  # plate
        d.ellipse((x + w - 12, y + 5, x + w - 7, y + 9), fill=C('#f2ece0'))
        d.rectangle((x + w // 2 - 1, y + 2, x + w // 2 + 1, y + 6), fill=C('#e05a6a'))   # flower vase
    def chair(s, x, y): s.box(x, y, 9, 8, C('#a46f42'), 4)
    def shelf(s, x, y, w=24):
        s.box(x, y, w, 6, C('#7a4f30'), 24, C('#5e3c24'))
        d = s.d; rnd = random.Random(x)
        for row in (y + 8, y + 18):
            d.line((x + 1, row + 8, x + w - 2, row + 8), fill=C('#3e2716'))
            bx = x + 2
            while bx < x + w - 3:
                bw = rnd.choice((2, 3)); col = rnd.choice(['#c84a4a', '#4a7fd0', '#5aa860', '#e0b050', '#8a5ab0'])
                d.rectangle((bx, row + rnd.choice((1, 2)), bx + bw - 1, row + 7), fill=C(col)); bx += bw + 1
    def rug(s, x, y, w, h, col=C('#b8485a')):
        d = s.d
        d.rounded_rectangle((x, y, x + w - 1, y + h - 1), 4, fill=col)
        d.rounded_rectangle((x + 3, y + 3, x + w - 4, y + h - 4), 3, outline=C('#f0c8a0'))
        d.rounded_rectangle((x + 6, y + 6, x + w - 7, y + h - 7), 2, outline=sh(col, .8))
    def plant(s, x, y):
        s.box(x + 2, y + 9, 8, 4, C('#c06a3a'), 4)
        d = s.d
        for (a, b) in ((6, 2), (2, 5), (10, 5), (4, 8), (8, 8)): d.ellipse((x + a - 3, y + b - 3, x + a + 3, y + b + 3), fill=OUTL)
        for (a, b) in ((6, 2), (2, 5), (10, 5), (4, 8), (8, 8)): d.ellipse((x + a - 2, y + b - 2, x + a + 2, y + b + 2), fill=C('#4fa85a'))
    def catbed(s, x, y):
        d = s.d
        d.ellipse((x, y, x + 21, y + 13), fill=OUTL); d.ellipse((x + 1, y + 1, x + 20, y + 12), fill=C('#9a6ab8'))
        d.ellipse((x + 4, y + 3, x + 17, y + 10), fill=C('#e8d6f0'))
    def bowls(s, x, y):
        d = s.d
        for i, c in enumerate(['#d8a050', '#8fd0f0']):
            d.ellipse((x + i * 9, y, x + i * 9 + 7, y + 5), fill=OUTL)
            d.ellipse((x + i * 9 + 1, y + 1, x + i * 9 + 6, y + 4), fill=C('#e05a6a') if i == 0 else C('#4a7fd0'))
            d.ellipse((x + i * 9 + 2, y + 1, x + i * 9 + 5, y + 3), fill=C(c))
    def tower(s, x, y):   # cat scratching tower
        d = s.d
        d.rectangle((x + 6, y + 6, x + 10, y + 34), fill=OUTL); d.rectangle((x + 7, y + 6, x + 9, y + 34), fill=C('#d8c49a'))
        for k in range(y + 9, y + 34, 3): d.line((x + 7, k, x + 9, k), fill=C('#b8a07a'))
        s.box(x, y, 17, 6, C('#8a6ab0'), 2)
        s.box(x - 2, y + 32, 21, 6, C('#8a6ab0'), 3)
    def door(s, x, y):
        d = s.d
        d.rectangle((x, y, x + 15, y + 5), fill=C('#5e3c24')); d.rectangle((x + 2, y + 1, x + 13, y + 5), fill=C('#8a5a34'))
    def chest(s, x, y):
        s.box(x, y, 16, 8, C('#a06a38'), 6)
        s.d.rectangle((x + 6, y + 9, x + 9, y + 11), fill=C('#e0c070'))
    def divider(s, x, y0, y1, gap):
        d = s.d
        for y in range(y0, y1):
            if gap[0] <= y < gap[1]: continue
            d.line((x, y, x + 5, y), fill=C('#7a4f30'))
        for (a, b) in ((y0, gap[0] - 1), (gap[1], y1)):
            d.line((x, a, x, b), fill=OUTL); d.line((x + 5, a, x + 5, b), fill=OUTL)
            d.line((x, b, x + 5, b), fill=OUTL)
    def frame(s, x, y):
        d = s.d; d.rectangle((x, y, x + 11, y + 9), fill=OUTL); d.rectangle((x + 1, y + 1, x + 10, y + 8), fill=C('#e8d6b0'))
        d.rectangle((x + 2, y + 2, x + 9, y + 7), fill=C('#9ed0a0')); d.ellipse((x + 4, y + 3, x + 7, y + 6), fill=C('#f0f0f0'))

# ---- cat sprites from the approved sheets
def cat(name, kind='sit', flip=False):
    sh_ = Image.open(os.path.join(ROOT, f'assets/characters/cats/{name}_sheet.png')).convert('RGBA')
    im = sh_.crop((112, 0, 134, 24)) if kind == 'sit' else sh_.crop((0, 0, 28, 24))
    im = im.crop(im.getbbox())
    return im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
def put_cat(r, name, x, y, kind='sit', flip=False):
    c = cat(name, kind, flip)
    sd = ImageDraw.Draw(r.im, 'RGBA'); sd.ellipse((x + 2, y + c.height - 3, x + c.width - 2, y + c.height + 1), fill=(30, 20, 30, 70))
    r.im.alpha_composite(c, (x, y))

def finish(r, title, legend, fname):
    big = r.im.resize((r.W * S, r.H * S), Image.NEAREST)
    d = ImageDraw.Draw(big)
    for n, x, y in r.tags:
        cx, cy = x * S, y * S
        d.ellipse((cx - 17, cy - 17, cx + 17, cy + 17), fill=(255, 255, 255, 235), outline=(30, 30, 30), width=3)
        d.text((cx, cy), str(n), font=F_N, fill=(30, 30, 30), anchor='mm')
    lw = 470; pad = 30
    out = Image.new('RGBA', (big.width + lw + pad * 3, big.height + 110), C('#1d1b22'))
    od = ImageDraw.Draw(out)
    od.text((pad, 30), title, font=F_T, fill='white')
    out.alpha_composite(big, (pad, 90))
    y = 100
    for n, txt in legend:
        if n != '':
            od.ellipse((big.width + pad * 2, y, big.width + pad * 2 + 30, y + 30), fill='white')
            od.text((big.width + pad * 2 + 15, y + 15), str(n), font=F_N, fill=(30, 30, 30), anchor='mm')
        od.text((big.width + pad * 2 + 44, y + 2), txt, font=F_L, fill='white'); y += 44
    out.save(os.path.join(OUT, fname)); return out

# ================= Layout 1: one cozy room (open plan) =================
def layout1():
    r = Room(15, 11)
    r.floor(8, 32, r.W - 8, r.H - 8); r.wall(8, r.W - 8, 0)
    d = r.d
    d.rectangle((0, 0, 7, r.H), fill=C('#2b2833')); d.rectangle((r.W - 8, 0, r.W, r.H), fill=C('#2b2833')); d.rectangle((0, r.H - 8, r.W, r.H), fill=C('#2b2833'))
    r.window(44, 6); r.window(150, 6); r.frame(134, 10)
    r.bed(14, 26); r.tag(1, 27, 44)
    r.shelf(74, 18); r.tag(2, 86, 30)
    r.fireplace(100, 2); r.tag(3, 116, 20)
    r.kitchen(176, 22); r.tag(4, 200, 36)
    r.rug(76, 64, 74, 46); r.tag(5, 90, 100)
    r.table(176, 82); r.chair(166, 86); r.chair(206, 86); r.tag(6, 190, 112)
    r.catbed(18, 118); r.bowls(46, 128); r.tower(18, 72); r.tag(7, 50, 120); r.tag(8, 26, 80)
    r.plant(206, 134); r.chest(140, 26); r.tag(9, 148, 46)
    r.door(112, r.H - 8); r.tag(10, 120, r.H - 14)
    # cats
    put_cat(r, 'collete', 22, 104)            # in the cat bed
    put_cat(r, 'cotton', 104, 76)             # on the rug by the fire
    put_cat(r, 'precious', 48, 2)             # on the window sill
    # farmer
    far = Image.open(os.path.join(ROOT, 'assets/characters/farmer/farmer_sheet.png')).convert('RGBA').crop((0, 0, 22, 36))
    r.im.alpha_composite(far, (130, 88))
    return finish(r, 'House layout 1: one cozy open room', [
        (1, 'Bed (sleep = next day + save)'), (2, 'Bookshelf'), (3, 'Fireplace'),
        (4, 'Kitchen: counter, stove, sink'), (5, 'Rug (Cotton naps here)'), (6, 'Dining table + 2 chairs'),
        (7, 'Cat bed + food/water bowls'), (8, 'Cat scratching tower'), (9, 'Storage chest'), (10, 'Front door'),
        ('', ''), ('', 'Cats:'), ('', 'Precious: on the window sill'), ('', 'Collete: in her cat bed'), ('', 'Cotton: by the fire')], 'house_layout_1.png')

# ================= Layout 2: bedroom + living/kitchen, cat corner =================
def layout2():
    r = Room(17, 11)
    r.floor(8, 32, 96, r.H - 8, 'wood'); r.floor(102, 32, r.W - 8, r.H - 8, 'wood')
    r.floor(176, 32, r.W - 8, 92, 'tile')
    r.wall(8, r.W - 8, 0)
    d = r.d
    d.rectangle((0, 0, 7, r.H), fill=C('#2b2833')); d.rectangle((r.W - 8, 0, r.W, r.H), fill=C('#2b2833')); d.rectangle((0, r.H - 8, r.W, r.H), fill=C('#2b2833'))
    r.floor(96, 110, 102, 136); r.divider(96, 30, r.H - 8, (110, 136))
    # bedroom (left)
    r.window(40, 6); r.bed(14, 26); r.tag(1, 27, 44)
    r.shelf(64, 18, 24); r.tag(2, 76, 30)
    r.rug(18, 82, 60, 36, C('#4a7fd0')); r.tag(3, 30, 112)
    r.catbed(50, 92); put_cat(r, 'collete', 54, 78); r.tag(4, 76, 104)
    r.plant(14, 132)
    # living (middle)
    r.fireplace(118, 2); r.tag(5, 134, 20)
    r.rug(110, 64, 60, 40); put_cat(r, 'cotton', 128, 72); r.tag(6, 160, 98)
    r.tower(110, 112); put_cat(r, 'precious', 109, 99); r.tag(7, 130, 140)
    r.bowls(150, 138); r.tag(8, 170, 140)
    r.frame(160, 9)
    # kitchen (right, tiled)
    r.window(232, 6, 20); r.kitchen(186, 22, 3); r.tag(9, 210, 36)
    r.table(196, 70); r.chair(186, 74); r.chair(226, 74); r.tag(10, 210, 98)
    r.chest(236, 130); r.tag(11, 244, 150)
    r.door(150, r.H - 8); r.tag(12, 158, r.H - 14)
    far = Image.open(os.path.join(ROOT, 'assets/characters/farmer/farmer_sheet.png')).convert('RGBA').crop((0, 0, 22, 36))
    r.im.alpha_composite(far, (196, 112))
    return finish(r, 'House layout 2: bedroom + living + kitchen', [
        (1, 'Bed (sleep = next day + save)'), (2, 'Bookshelf'), (3, 'Bedroom rug'), (4, 'Collete\'s bed (her own room)'),
        (5, 'Fireplace'), (6, 'Living rug (Cotton)'), (7, 'Cat tower (Precious on top)'), (8, 'Food + water bowls'),
        (9, 'Kitchen: counter, stove, sink'), (10, 'Dining table'), (11, 'Storage chest'), (12, 'Front door')], 'house_layout_2.png')

a, b = layout1(), layout2()
W = max(a.width, b.width)
both = Image.new('RGBA', (W, a.height + b.height + 20), C('#1d1b22'))
both.paste(a, (0, 0)); both.paste(b, (0, a.height + 20))
both.save(os.path.join(OUT, 'house_layouts.png'))
print('ok')
