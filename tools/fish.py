"""Ten lake fish sprites for the Mirror Lake fishing minigame (pictures only, not in game).
Side view, facing right, 2 swim frames each. Outputs assets/fish/: fish_sheet.png, fish_samples.png, fish_swim.gif"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFont
from farmer import B, C

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O = os.path.join(ROOT, 'assets', 'fish') + '/'; os.makedirs(O, exist_ok=True)
CW, CH, OX, OY, CY = 48, 28, 10, 4, 10
EYE, WHITE = C('#1c1820'), C('#ffffff')


def prof(u, H, p=1.3, q=.8, ped=.28):
    return H * max(ped * (1 - u) ** .5, math.sin(math.pi * u ** p) ** q, .12)


def build(s, f=0):
    b = B(CW, CH, OX, OY); X = b.X; L = s['L']
    top = lambda u: prof(u, s['Ht'], s.get('p', 1.3), s.get('q', .8), s.get('ped', .28))
    bot = lambda u: prof(u, s['Hb'], s.get('p', 1.3), s.get('q', .8), s.get('ped', .28))
    back, mid, belly, fin = (C(c) for c in s['cols'])
    wag = [0, 1][f]
    # tail
    T = s.get('tail', 6); kind = s.get('tailkind', 'fork')
    for i in range(1, T + 1):
        spread = round(1 + i * s.get('tslope', .8)); dy = wag if i > T // 2 else 0
        for y in range(-spread, spread + 1):
            if kind == 'fork' and i > T * .45 and abs(y) < spread - 1 - (i > T * .7): continue
            X(-i, CY + y + dy, fin if abs(y) < spread else back)
    # dorsal / anal fins (drawn first so the body overlaps their base)
    for (u0, u1, h, side, spiky) in s.get('fins', []):
        x0, x1 = round(u0 * (L - 1)), round(u1 * (L - 1))
        for x in range(x0, x1 + 1):
            u = x / (L - 1); k = (x - x0) / max(1, x1 - x0)
            hh = h * math.sin(math.pi * min(1, k * 1.15 + .12)) ** .6
            if spiky and x % 2: hh -= 1
            base = CY - top(u) if side < 0 else CY + bot(u)
            for j in range(0, round(hh) + 1):
                X(x, round(base) + side * j, fin if j < round(hh) or not spiky else back)
    # body
    for x in range(L):
        u = x / (L - 1); t, bt = top(u), bot(u); y0, y1 = round(CY - t), round(CY + bt)
        for y in range(y0, y1 + 1):
            fr = (y - y0) / max(1, y1 - y0)
            col = back if fr < .3 else mid if fr < .68 else belly
            pc = s['pat'](x, y, u, fr) if 'pat' in s else None
            X(x, y, C(pc) if pc else col)
    # gill, pectoral fin, eye, mouth
    gx = round(.76 * (L - 1))
    for y in range(-1, 3): X(gx - (1 if y in (-1, 2) else 0), CY + y, back)
    px_ = round(.66 * (L - 1))
    for i in range(3): X(px_ - i, CY + 2 + i - (wag and i == 2), fin)
    ex = round(s.get('eye', .87) * (L - 1)); ey = CY - 1 + s.get('eyey', 0)
    X(ex, ey, EYE); X(ex - 1, ey, WHITE); X(ex, ey - 1, WHITE) if s.get('bigeye') else None
    X(L - 1, CY + 1 + s.get('mouthy', 0), EYE)
    if 'extra' in s: s['extra'](b, X, L, f)
    b.outline(.42)
    if 'post' in s: s['post'](b, L, f)
    return b.im


def eel(f=0):
    b = B(CW, CH, OX, OY); X = b.X
    back, belly, fin = C('#5a6238'), C('#d9c779'), C('#3e4528')
    for x in range(-8, 30):
        yc = CY + 2.4 * math.sin(x / 4.2 + f * 1.6) * (1 - max(0, x - 22) / 10)
        th = 1 if x < -4 else 2 if x < 24 else 3
        y0 = round(yc) - th + 1
        X(x, y0 - 1, fin) if x < 22 else None
        for j in range(th + 1): X(x, y0 + j, back if j < th else belly)
    X(27, CY - 2, EYE); X(26, CY - 2, WHITE); X(29, CY, EYE)
    b.outline(.42); return b.im


def bars(cols, every=4, w=1): return lambda x, y, u, fr: cols if (x % every) < w and .12 < u < .78 and fr < .75 else None
def scales(col): return lambda x, y, u, fr: col if (x + y) % 3 == 0 and .15 < u < .76 and .15 < fr < .8 else None
def spots(col): return lambda x, y, u, fr: col if (x * 7 + y * 13) % 11 < 2 and u < .8 else None
def blotch(col): return lambda x, y, u, fr: col if ((x // 3) + (y // 2)) % 3 == 0 and .1 < u < .8 and fr < .7 else None
def stripe(col): return lambda x, y, u, fr: col if y in (CY - 1, CY + 1) and .1 < u < .75 and x % 3 else None


def whiskers(b, L, f):
    d = (40, 30, 34, 255)
    for dx, dy in ((0, -2), (1, -3), (2, -3), (0, 3), (1, 4), (2, 4), (3, 5), (0, 1), (1, 2)):
        x, y = L - 1 + dx + b.ox, CY + dy + b.oy
        if 0 <= x < b.w and 0 <= y < b.h: b.p[x, y] = d


def sucker(b, X, L, f):          # janitor fish: mouth underneath + spread pectoral fin
    X(L - 3, CY + 3, C('#e8d6b0')); X(L - 4, CY + 3, C('#e8d6b0'))
    for i in range(5): X(round(.6 * L) - i, CY + 3 + i // 2, C('#5a4634'))


def thread(b, X, L, f):          # gourami: long thread-like ventral fin
    for i in range(9): X(round(.62 * L) - i, CY + 6 + (i // 3) + (f and i > 5), C('#c9a070'))


FISH = [
 ('Tilapia', dict(L=22, Ht=6.5, Hb=6, p=1.25, cols=('#5f6b5a', '#8f9a86', '#e6d8cc', '#6f7a66'), tail=5, tailkind='fan', tslope=.9,
                  fins=[(.18, .72, 3.2, -1, 1), (.2, .45, 2.2, 1, 0)], pat=bars('#4a5446', 4))),
 ('Bangus', dict(L=26, Ht=4.2, Hb=4, p=1.35, cols=('#7f95a8', '#d8e2ea', '#f6f8fa', '#8fa2b3'), tail=8, tslope=.95,
                 fins=[(.42, .58, 3, -1, 0), (.22, .32, 1.6, 1, 0)], bigeye=1)),
 ('Hito', dict(L=27, Ht=3.6, Hb=3.4, p=1.7, q=.55, ped=.5, cols=('#3f3a3c', '#5c5456', '#b8a99a', '#4a4446'), tail=4, tailkind='fan', tslope=.7,
               fins=[(.05, .6, 1.8, -1, 0), (.05, .5, 1.6, 1, 0)], eye=.9, post=whiskers)),
 ('Dalag', dict(L=28, Ht=3.6, Hb=3.4, p=1.5, q=.5, ped=.55, cols=('#4d4a34', '#77704c', '#d9cfa8', '#5a563a'), tail=4, tailkind='fan', tslope=.8,
                fins=[(.08, .68, 2, -1, 0), (.1, .5, 1.6, 1, 0)], pat=blotch('#36341f'), eye=.9)),
 ('Karpa', dict(L=24, Ht=5.6, Hb=5.2, p=1.3, cols=('#8a6a2c', '#c79a3e', '#f0d890', '#b06a3a'), tail=6, tslope=.9,
                fins=[(.35, .66, 2.6, -1, 0), (.22, .36, 2, 1, 0)], pat=scales('#a67c2e'))),
 ('Tawilis', dict(L=16, Ht=2.6, Hb=2.6, p=1.3, cols=('#3f7f8f', '#bcd6dc', '#f4f8f8', '#5a94a2'), tail=4, tslope=.9,
                  fins=[(.45, .6, 1.6, -1, 0)], bigeye=1, eye=.84)),
 ('Ayungin', dict(L=18, Ht=4.2, Hb=3.8, p=1.3, cols=('#8a94a0', '#cfd6dc', '#f2f2ee', '#9aa2aa'), tail=4, tslope=.9,
                  fins=[(.3, .72, 2.6, -1, 1), (.22, .4, 1.8, 1, 0)], pat=stripe('#7a8490'))),
 ('Gurami', dict(L=20, Ht=6.8, Hb=6.8, p=1.15, q=.7, cols=('#7a5a3c', '#b08a5c', '#e2c79a', '#8a6a48'), tail=4, tailkind='fan', tslope=1,
                 fins=[(.15, .6, 2.4, -1, 0), (.12, .62, 2.6, 1, 0)], pat=bars('#94724a', 5), extra=thread, eye=.86)),
 ('Igat', None),
 ('Janitor fish', dict(L=24, Ht=5, Hb=2.2, p=1.5, q=.6, ped=.4, cols=('#3a2c22', '#5a4634', '#7a6248', '#4a3828'), tail=6, tailkind='fan', tslope=.9,
                       fins=[(.4, .7, 5.5, -1, 1)], pat=spots('#8a7250'), extra=sucker, eye=.84, eyey=-1, mouthy=1)),
]
SUB = ['', '(milkfish)', '(catfish)', '(mudfish)', '(carp)', '(lake sardine)', '(silver perch)', '(gourami)', '(eel)', '']

if __name__ == '__main__':
    fr = [[(eel(f) if s is None else build(s, f)) for f in (0, 1)] for _, s in FISH]
    sh = Image.new('RGBA', (CW * 2, CH * len(FISH)))
    for r, (a, b_) in enumerate(fr): sh.alpha_composite(a, (0, r * CH)); sh.alpha_composite(b_, (CW, r * CH))
    sh.save(O + 'fish_sheet.png')
    S = 6; PW, PH = CW * S + 20, CH * S + 54
    f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    def board(k):
        im = Image.new('RGBA', (PW * 5, PH * 2), (30, 92, 128, 255)); d = ImageDraw.Draw(im)
        for i, (name, _) in enumerate(FISH):
            x, y = (i % 5) * PW, (i // 5) * PH
            d.rounded_rectangle((x + 6, y + 6, x + PW - 6, y + PH - 6), 10, fill=(44, 120, 160, 255))
            im.alpha_composite(fr[i][k].resize((CW * S, CH * S), Image.NEAREST), (x + 10, y + 8))
            d.text((x + PW // 2, y + PH - 36), f'{i + 1}. {name}', font=f1, fill='white', anchor='mm')
            d.text((x + PW // 2, y + PH - 17), SUB[i], font=f2, fill=(200, 230, 245), anchor='mm')
        return im
    b0, b1 = board(0), board(1)
    b0.convert('RGB').save(O + 'fish_samples.png')
    pf = [b.convert('RGB').convert('P', palette=Image.ADAPTIVE) for b in (b0, b1)]
    pf[0].save(O + 'fish_swim.gif', save_all=True, append_images=pf[1:], duration=260, loop=0)
    print('ok')
