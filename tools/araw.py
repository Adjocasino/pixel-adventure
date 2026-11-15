"""Araw: Jao's orange cat (Cottage Meadow). Plain orange tabby, orange eyes, very light white stripes.
Same art style and size as the house cats (tools/cats.py). Sits next to Jao in Market Square.
Output: assets/characters/araw/araw_sheet.png (sit 0-2 + groom), araw_preview.png/.gif"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
import cats
from cats import B, C, head, OUT

cats.CATS['araw'] = dict(body=C('#e8862e'), bodyS=C('#c8681f'), point=C('#e8862e'), pointS=C('#c8681f'), paw=C('#f0a35a'),
    tail=C('#d9772a'), face=C('#ec8e38'), mask=None, ear=C('#e8862e'), earIn=C('#f2b0a0'), bib=None,
    eyes=[C('#ff9e1f'), C('#ff9e1f')], nose=C('#e8828c'), whisk=C('#fbe6cf'), thick=0, grumpy=0, mouth='none', uwu=0)
K = cats.CATS['araw']
STRIPE = C('#f7cfa2')     # very light, almost white stripes

def stripes(b, pts):
    for x, y in pts: b.sp(x, y, STRIPE)

def sit(f):
    b = B(22, 24); cx = 11
    for t in range(0, 12):
        u = t / 11; x = cx + 5 + u * 4 - (u ** 2) * 2; y = 21 - u * 2 - (u ** 3) * 5 * (1.4 if f == 2 else 1)
        b.sp(x, y, K['tail']); b.sp(x, y + 1, K['tail'])
        if t in (3, 6, 9): b.sp(x, y, STRIPE)           # rings on the tail
    b.ell(cx, 17, 6, 5.5, lambda x, y, dx, dy: K['body'] if dx < .45 else K['bodyS'])
    # soft side stripes on the body (curved, light)
    stripes(b, [(cx - 4, 14), (cx - 4, 15), (cx - 3, 16), (cx - 5, 17), (cx - 5, 18),
                (cx + 3, 14), (cx + 3, 15), (cx + 4, 16), (cx + 4, 18), (cx + 5, 19), (cx, 13), (cx + 1, 13)])
    for px in (cx - 3, cx + 1):
        for y in (20, 21): b.sp(px, y, K['point']); b.sp(px + 1, y, K['point'])
        b.sp(px, 22, K['paw']); b.sp(px + 1, 22, K['paw'])
    head(b, K, cx + 1, 9, blink=(f == 1))
    hx = cx + 1
    stripes(b, [(hx - 1, 5), (hx, 5), (hx + 1, 5), (hx - 1, 6), (hx + 1, 6)])   # little forehead "M"
    b.outline(); return b.im

if __name__ == '__main__':
    O = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'araw')
    fr = [sit(f) for f in range(3)]
    sh = Image.new('RGBA', (22 * 3, 24), (0, 0, 0, 0))
    for i, im in enumerate(fr): sh.alpha_composite(im, (i * 22, 0))
    sh.save(os.path.join(O, 'araw_sheet.png'))
    S = 10; bg = (95, 172, 114, 255)
    pv = Image.new('RGBA', (3 * (22 * S + 20) + 20, 24 * S + 40), bg)
    for i, im in enumerate(fr): pv.alpha_composite(im.resize((22 * S, 24 * S), Image.NEAREST), (20 + i * (22 * S + 20), 20))
    pv.convert('RGB').save(os.path.join(O, 'araw_preview.png'))
    seq = [0] * 6 + [1] + [0] * 5 + [2, 2, 0] * 2
    gif = []
    for f in seq:
        g = Image.new('RGBA', (22 * S + 40, 24 * S + 40), bg); g.alpha_composite(fr[f].resize((22 * S, 24 * S), Image.NEAREST), (20, 20)); gif.append(g.convert('RGB'))
    gif[0].save(os.path.join(O, 'araw_idle.gif'), save_all=True, append_images=gif[1:], duration=180, loop=0)
    print('ok')
