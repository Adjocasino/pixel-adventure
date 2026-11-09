"""Mobile control layout mockups for Pixel Adventure (picture only, not in game).
Renders a 16-bit style landscape phone screen with joystick + 4 buttons.
Outputs assets/ui/controls_option_a.png (diamond) and controls_option_b.png (arc)."""
import os, math, random
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'ui'); os.makedirs(OUT, exist_ok=True)
W, H, S = 256, 136, 5
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
FONT_S = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)

def C(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)

# 9x9 icons: '#' = icon colour, '.' = empty
ICONS = {  # 11x11
 'hand': ["...#.#.#...", "...#.#.#...", ".#.#.#.#...", ".#.#.#.#...", ".#######.#.", ".#######.#.", ".#########.", ".########..", "..#######..", "...#####...", "...#####..."],
 'dash': ["...........", "......###..", ".....#####.", "##...#####.", "......####.", "###..#####.", "....######.", "##.#######.", "...#######.", "...........", "..........."],
 'heart': ["...........", ".###...###.", "#####.#####", "###########", "###########", "###########", ".#########.", "..#######..", "...#####...", "....###....", ".....#....."],
 'bag':  ["....###....", "...#...#...", "...#...#...", ".#########.", "###########", "#####.#####", "####...####", "#####.#####", "###########", ".#########.", "..........."],
}
BTN = {  # name: (fill, light, icon, letter, label)
 'A': (C('#4fa85a'), C('#8fd88a'), 'hand', 'A', 'Action'),
 'B': (C('#d8873a'), C('#f4c07a'), 'dash', 'B', 'Run'),
 'X': (C('#d55a7a'), C('#f39ab2'), 'heart', 'X', 'Emote'),
 'Y': (C('#4a7fd0'), C('#93bdf2'), 'bag', 'Y', 'Item'),
}

def background():
    im = Image.new('RGBA', (W, H)); px = im.load(); rnd = random.Random(3)
    g = [C('#5c9e4a'), C('#68ad52'), C('#548f43')]
    for y in range(H):
        for x in range(W):
            px[x, y] = g[(x // 8 + y // 8) % 2] if rnd.random() > .08 else g[2]
    for y in range(52, 84):                     # dirt path
        for x in range(W):
            if 56 + int(3 * math.sin(x / 14)) <= y <= 78 + int(3 * math.sin(x / 11)):
                px[x, y] = C('#c9a46a') if rnd.random() > .1 else C('#b58f58')
    for (tx, ty) in [(20, 14), (60, 22), (200, 18), (230, 100), (150, 104)]:   # flower dots
        for dx, dy in [(0, 0), (2, 1), (-1, 2)]:
            px[tx + dx, ty + dy] = C('#f4e6a0') if (dx + dy) % 2 else C('#f2a0b8')
    return im

def farmer(im):
    sh = Image.open(os.path.join(ROOT, 'assets/characters/farmer/farmer_sheet.png')).convert('RGBA')
    im.alpha_composite(sh.crop((0, 0, 22, 36)), (W // 2 - 11, 36))

def disc(d, cx, cy, r, fill, rim, light=None):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=rim)
    d.ellipse((cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1), fill=fill)
    if light: d.arc((cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2), 200, 300, fill=light)

def icon(im, name, cx, cy, col):
    rows = ICONS[name]; px = im.load()
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == '#': px[cx - 5 + i, cy - 5 + j] = col

def joystick(im, d):
    cx, cy = 30, H - 30
    ov = Image.new('RGBA', (W, H)); od = ImageDraw.Draw(ov)
    od.ellipse((cx - 20, cy - 20, cx + 20, cy + 20), fill=(255, 255, 255, 40), outline=(255, 255, 255, 120))
    for a in range(4):                            # direction notches
        ang = a * math.pi / 2; nx, ny = cx + 16 * math.cos(ang), cy + 16 * math.sin(ang)
        od.polygon([(nx + 3 * math.cos(ang), ny + 3 * math.sin(ang)),
                    (nx + 2 * math.cos(ang + 2.1), ny + 2 * math.sin(ang + 2.1)),
                    (nx + 2 * math.cos(ang - 2.1), ny + 2 * math.sin(ang - 2.1))], fill=(255, 255, 255, 150))
    im.alpha_composite(ov)
    disc(d, cx + 4, cy - 3, 9, C('#e8e4d8'), C('#5a5048'), C('#ffffff'))

def button(im, d, key, cx, cy, r):
    fill, light, ic, _, _ = BTN[key]
    dark = tuple(int(v * .45) for v in fill[:3]) + (255,)
    d.ellipse((cx - r, cy - r + 2, cx + r, cy + r + 2), fill=(20, 30, 20, 120))   # drop shadow
    disc(d, cx, cy, r, fill, dark, light)
    icon(im, ic, cx, cy, C('#ffffff'))

def label_layer(big, places):
    d = ImageDraw.Draw(big)
    for key, cx, cy, r in places:
        _, _, _, letter, lab = BTN[key]
        # letter badge top-left of the button
        d.text((cx * S, (cy + r) * S + 16), lab, font=FONT_S, fill='white', anchor='mm', stroke_width=4, stroke_fill=(30, 30, 30))

def hud(d):
    for i, (x, col) in enumerate([(W - 18, C('#ffffff')), (W - 36, C('#ffffff'))]):   # top-right menu buttons
        d.rounded_rectangle((x - 7, 4, x + 7, 18), 3, fill=(255, 255, 255, 60), outline=(255, 255, 255, 160))
    d.rounded_rectangle((4, 4, 60, 12), 2, fill=(0, 0, 0, 90))
    for i in range(5): d.rectangle((7 + i * 10, 6, 14 + i * 10, 10), fill=C('#e05050'))   # hearts bar

def phone(im, title, places):
    frame = Image.new('RGBA', ((W + 16) * S, (H + 16) * S + 70), C('#1d1b22'))
    fd = ImageDraw.Draw(frame)
    fd.rounded_rectangle((0, 70, frame.width - 1, frame.height - 1), 60, fill=C('#2b2833'))
    big = im.resize((W * S, H * S), Image.NEAREST)
    label_layer(big, places)
    frame.alpha_composite(big, (8 * S, 70 + 8 * S))
    fd.text((frame.width // 2, 36), title, font=FONT, fill='white', anchor='mm')
    return frame

def render(layout, title, fname):
    im = background(); farmer(im)
    ov = Image.new('RGBA', (W, H)); od = ImageDraw.Draw(ov); hud(od); im.alpha_composite(ov)
    d = ImageDraw.Draw(im)
    joystick(im, d)
    for key, cx, cy, r in layout: button(im, d, key, cx, cy, r)
    out = phone(im, title, layout)
    out.save(os.path.join(OUT, fname)); return out

# Option A: classic diamond, all same size
bx, by = W - 44, H - 52
A = [('A', bx + 25, by, 11), ('B', bx, by + 25, 11), ('X', bx - 25, by, 11), ('Y', bx, by - 25, 11)]
# Option B: big A + three smaller buttons on an arc around it
ax, ay = W - 30, H - 34
Bl = [('A', ax, ay, 14)] + [(k, ax + int(36 * math.cos(math.radians(t))), ay + int(36 * math.sin(math.radians(t))), 10)
                             for k, t in (('B', 175), ('X', 225), ('Y', 275))]
a = render(A, 'Option A: diamond (all equal)', 'controls_option_a.png')
b = render(Bl, 'Option B: big Action + arc', 'controls_option_b.png')
both = Image.new('RGBA', (a.width, a.height * 2 + 20), C('#1d1b22'))
both.paste(a, (0, 0)); both.paste(b, (0, a.height + 20))
both.save(os.path.join(OUT, 'controls_options.png'))
print('ok')
