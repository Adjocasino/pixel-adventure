"""Barn Ranch layout wireframe (draft, grayscale). Top-down 3/4 view, 16 px tiles, 20x12 tiles.
Output: docs/mockups/barn_wireframe.png"""
import os
from PIL import Image, ImageDraw, ImageFont
T, COLS, ROWS, S = 16, 20, 12, 3          # tile, grid, upscale
W, H = COLS * T * S, ROWS * T * S + 110
im = Image.new('RGB', (W, H), (245, 245, 242)); d = ImageDraw.Draw(im)
F = lambda n: ImageFont.load_default(size=n)
def R(c, r, w, h): return [c * T * S, r * T * S, (c + w) * T * S, (r + h) * T * S]
def box(c, r, w, h, label='', fill=(225, 225, 222), out=(60, 60, 60), dash=False, size=14, lw=3):
    x0, y0, x1, y1 = R(c, r, w, h)
    d.rectangle([x0, y0, x1, y1], fill=fill)
    if dash:
        for x in range(x0, x1, 14): d.line([(x, y0), (min(x + 7, x1), y0)], fill=out, width=lw); d.line([(x, y1), (min(x + 7, x1), y1)], fill=out, width=lw)
        for y in range(y0, y1, 14): d.line([(x0, y), (x0, min(y + 7, y1))], fill=out, width=lw); d.line([(x1, y), (x1, min(y + 7, y1))], fill=out, width=lw)
    else: d.rectangle([x0, y0, x1, y1], outline=out, width=lw)
    if label:
        for i, line in enumerate(label.split('\n')):
            d.text(((x0 + x1) / 2, (y0 + y1) / 2 + (i - (label.count('\n')) / 2) * (size + 2)), line, font=F(size), fill=(30, 30, 30), anchor='mm')
def path(pts, col=(120, 120, 120), dash=True):
    P = [((c + .5) * T * S, (r + .5) * T * S) for c, r in pts]
    for (x0, y0), (x1, y1) in zip(P, P[1:]):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) // 12) or 1
        for k in range(0, n, 2 if dash else 1):
            a, b = k / n, min(1, (k + 1) / n)
            d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b, y0 + (y1 - y0) * b)], fill=col, width=3)
    (xa, ya), (xb, yb) = P[-2], P[-1]
    import math; ang = math.atan2(yb - ya, xb - xa)
    for s in (2.6, -2.6): d.line([(xb, yb), (xb - 14 * math.cos(ang + s / 6), yb - 14 * math.sin(ang + s / 6))], fill=col, width=3)

# floor grid
for c in range(COLS):
    for r in range(ROWS):
        d.rectangle(R(c, r, 1, 1), outline=(228, 228, 224), width=1)
# walls: top wall shows its face (2 tiles tall, 3/4 view), side/bottom walls are thin
box(0, 0, COLS, 2, '', fill=(185, 185, 180))
d.rectangle([0, 0, W - 1, ROWS * T * S - 1], outline=(40, 40, 40), width=6)
d.text((R(0, 0, COLS, 1)[0] + 10, 10), 'BACK WALL (front face visible, 3/4 view)', font=F(15), fill=(60, 60, 60))
# zone dividers
for c in (7, 14): d.line([(c * T * S, 2 * T * S), (c * T * S, ROWS * T * S)], fill=(160, 160, 155), width=2)
for c, w, t in ((0, 7, 'LEFT WING: COOP (base)'), (7, 7, 'MIDDLE: WORK AREA'), (14, 6, 'RIGHT WING: STALLS (locked)')):
    x0, y0, x1, y1 = R(c, 11, w, 1); d.text(((x0 + x1) / 2, ROWS * T * S + 8), t, font=F(14), fill=(80, 80, 80), anchor='ma')

# --- coop (left wing)
for i in range(3): box(1 + i * 2, 1, 2, 1, f'NEST {i+1}', fill=(210, 210, 205), size=13)
box(1, 3, 5, 1, 'ROOST BAR', fill=(232, 232, 228), size=13)
box(1, 6, 2, 1, 'FEEDER', size=13); box(4, 6, 2, 1, 'WATERER', size=13)
d.line([(R(0, 7, 1, 1)[0], R(0, 7, 1, 1)[3]), (R(6, 7, 1, 1)[0], R(6, 7, 1, 1)[3])], fill=(90, 90, 90), width=4)
for c in range(0, 6): d.line([(R(c, 7, 1, 1)[0] + 24, R(c, 7, 1, 1)[3] - 10), (R(c, 7, 1, 1)[0] + 24, R(c, 7, 1, 1)[3] + 10)], fill=(90, 90, 90), width=3)
box(6, 7, 1, 1, 'GATE', fill=(250, 250, 248), dash=True, size=12)
d.text((R(0, 8, 1, 1)[0] + 6, R(0, 8, 1, 1)[1] - 22), 'low fence', font=F(12), fill=(90, 90, 90))
for nm, c, r in (('Ginger', 2, 4), ('Rocky', 4, 5)):
    x0, y0, x1, y1 = R(c, r, 1, 1); d.ellipse([x0 + 8, y0 + 8, x1 - 8, y1 - 8], fill=(255, 255, 255), outline=(30, 30, 30), width=3)
    d.text(((x0 + x1) / 2, y1 + 6), nm, font=F(13), fill=(30, 30, 30), anchor='ma')
box(1, 9, 2, 2, 'EGG\nCRATE', fill=(210, 210, 205), size=14)

# --- middle work area
box(8, 0, 1, 2, 'LAD-\nDER', fill=(200, 200, 195), dash=True, size=11)
box(12, 3, 2, 1, 'HAY (later)', fill=(238, 238, 234), dash=True, size=12)
box(12, 0, 2, 2, 'TOOL\nWALL', fill=(200, 200, 195), size=13)
box(10, 1, 1, 1, '', fill=(255, 255, 255)); d.text(((R(10, 1, 1, 1)[0] + R(10, 1, 1, 1)[2]) / 2, R(10, 1, 1, 1)[1] + 6), 'CLIP-\nBOARD', font=F(10), fill=(0, 0, 0), anchor='ma')
d.text(((R(10, 1, 1, 1)[0] + R(10, 1, 1, 1)[2]) / 2, R(10, 2, 1, 1)[1] + 26), '"Tend the animals?"\nStart / Not now', font=F(12), fill=(30, 30, 30), anchor='ma')
box(8, 6, 2, 2, 'WATER\nPUMP', fill=(215, 215, 210), size=14)
box(12, 6, 2, 2, 'CORN\nBIN', fill=(215, 215, 210), size=14)
# door (gap in bottom wall)
x0, y0, x1, y1 = R(9, 11, 3, 1); d.rectangle([x0, y1 - 8, x1, y1 + 2], fill=(245, 245, 242))
d.text(((x0 + x1) / 2, y1 - 14), 'BARN DOOR', font=F(14), fill=(30, 30, 30), anchor='md')
xs, ys, xe, ye = R(10, 9, 1, 1); d.ellipse([xs + 10, ys + 10, xe - 10, ye - 10], outline=(30, 30, 30), width=3); d.text(((xs + xe) / 2, ys - 2), 'player start', font=F(12), fill=(30, 30, 30), anchor='md')

# --- right wing (locked stalls)
for (c, r, nm) in ((14, 2, 'GOAT'), (17, 2, 'PIG'), (14, 6, 'COW /\nCARABAO'), (17, 6, 'SHEEP')):
    box(c, r, 3, 3, f'{nm}\nFOR SALE', fill=(232, 232, 228), dash=True, size=13)
x0, y0, x1, y1 = R(19, 9, 1, 2); d.rectangle([x1 - 8, y0, x1 + 2, y1], fill=(245, 245, 242))
d.text((x0 - 4, (y0 + y1) / 2), 'back door\nto yard\n(later)', font=F(12), fill=(30, 30, 30), anchor='rm')

# --- task routes (the panic loop)
path([(12.5, 6), (11, 5.2), (6, 5.2), (2, 6)], col=(80, 80, 80))        # corn bin -> feeder
path([(8.5, 8), (7, 8.6), (5, 7.4)], col=(80, 80, 80))                   # pump -> waterer (through gate)
path([(3, 1.5), (3.3, 5), (2, 8.7)], col=(80, 80, 80))                   # nest -> egg crate
path([(4.4, 5.4), (6.5, 9.5), (10, 11.3)], col=(170, 170, 165))          # runaway chicken -> door
d.text((R(5, 9, 1, 1)[0] + 14, R(5, 9, 1, 1)[1] + 6), 'runaway chicken\nheads for the door', font=F(12), fill=(120, 120, 120))

# legend
ly = ROWS * T * S + 36
d.text((14, ly), 'DRAFT WIREFRAME, 20x12 tiles (16 px), top-down 3/4 view.  Solid box = base level.  Dashed box = later / locked.', font=F(14), fill=(30, 30, 30))
d.text((14, ly + 22), 'Dark dashed arrows = task routes (corn to feeder, pump to waterer, nest to egg crate).  Light arrow = runaway chicken to the door.', font=F(14), fill=(30, 30, 30))
d.text((14, ly + 44), 'Panic by design: corn bin and pump sit on opposite sides, nests are at the back wall, the egg crate is near the coop door.', font=F(14), fill=(30, 30, 30))
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'mockups', 'barn_wireframe.png')
im.save(out); print(out, im.size)
