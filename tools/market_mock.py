"""Market mockup (picture only): the fish stall (Jao hangs around beside it) and the animal shop (Bins + Turon).
Output: docs/mockups/market_stalls.gif (+ market_stalls.png still)."""
import os, sys, math, random
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from farmer import C
from jao import jao
from bins import seller as bins
from turon import turon

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'mockups')
W, H, K = 230, 132, 4
GROUND_TOP = 34

def label(d, x, y, text, col, bg, size=7):
    f = ImageFont.load_default(size=size); w = d.textlength(text, font=f)
    d.rectangle([x - w / 2 - 3, y - 5, x + w / 2 + 3, y + 5], fill=bg, outline=C('#3a2414'))
    d.text((x, y), text, font=f, fill=col, anchor='mm')

def stall(im, x0, y0, w, stripeA, stripeB, sign, sign_bg):
    """3/4 view stall: striped awning, two posts, a counter; returns the counter's top y"""
    d = ImageDraw.Draw(im)
    # back wall/shelf
    d.rectangle([x0 + 4, y0 + 12, x0 + w - 4, y0 + 34], fill=C('#b98a4c')); d.line([(x0 + 4, y0 + 22), (x0 + w - 4, y0 + 22)], fill=C('#8a5a30'))
    # posts
    for px_ in (x0 + 2, x0 + w - 5): d.rectangle([px_, y0 + 8, px_ + 2, y0 + 58], fill=C('#6e4626'))
    # awning (front face) with scalloped edge
    for i in range(0, w, 8):
        d.rectangle([x0 + i, y0, x0 + min(i + 7, w), y0 + 9], fill=stripeA if (i // 8) % 2 == 0 else stripeB)
        d.ellipse([x0 + i, y0 + 7, x0 + min(i + 7, w), y0 + 12], fill=stripeA if (i // 8) % 2 == 0 else stripeB)
    d.line([(x0, y0), (x0 + w, y0)], fill=C('#3a2414'))
    label(d, x0 + w / 2, y0 - 6, sign, C('#fff6e0'), sign_bg)
    return y0 + 36

def counter(im, x0, y, w):
    d = ImageDraw.Draw(im)
    d.rectangle([x0, y, x0 + w, y + 3], fill=C('#d0803c')); d.line([(x0, y), (x0 + w, y)], fill=C('#e8a058'))
    d.rectangle([x0 + 1, y + 4, x0 + w - 1, y + 20], fill=C('#9a6438'))
    for yy in range(y + 8, y + 20, 4): d.line([(x0 + 1, yy), (x0 + w - 1, yy)], fill=C('#7a4a26'))
    d.line([(x0, y + 20), (x0 + w, y + 20)], fill=C('#5a3418'))

def tiny_fish(d, x, y, body, belly, flip=False):
    s = -1 if flip else 1
    d.rectangle([x, y, x + 4, y + 1], fill=body); d.line([(x, y + 2), (x + 4, y + 2)], fill=belly)
    tx = x - 1 if not flip else x + 5
    d.point((tx, y), fill=body); d.point((tx, y + 2), fill=body); d.point((x + (4 if not flip else 0), y), fill=C('#1c1c1c'))

def background():
    im = Image.new('RGBA', (W, H), C('#bfe3f5')); d = ImageDraw.Draw(im)
    for x in range(W):
        h = 22 + math.sin(x * .05) * 3 + math.sin(x * .02 + 1) * 4; d.line([(x, int(h)), (x, GROUND_TOP)], fill=C('#9fd08a'))
    d.rectangle([0, GROUND_TOP, W, H], fill=C('#d9c49a'))
    random.seed(2)
    for i in range(160): d.point((random.randrange(W), random.randrange(GROUND_TOP + 2, H)), fill=C('#c8b086'))
    for y in range(GROUND_TOP + 6, H, 10): d.line([(0, y), (W, y)], fill=C('#d2bb8e'))
    # FISH STALL (left)
    cy = stall(im, 12, 26, 86, C('#3f6fb5'), C('#f2efe6'), 'SELL FISH', C('#2f568f'))
    counter(im, 10, cy + 20, 90)
    # ice tray with fish on the counter
    d.rectangle([16, cy + 15, 94, cy + 20], fill=C('#dff2fb')); d.line([(16, cy + 15), (94, cy + 15)], fill=C('#ffffff'))
    cols = [(C('#8fa3b8'), C('#dfe8ee')), (C('#c9a06a'), C('#f2e2c0')), (C('#5a7a5a'), C('#c8d8b8')), (C('#b0b8c4'), C('#ffffff'))]
    for i in range(10):
        b, be = cols[i % 4]; tiny_fish(d, 19 + i * 7, cy + 16 + (i % 2), b, be, flip=i % 3 == 0)
    # price chalkboard + scale
    d.rectangle([22, cy - 2, 40, cy + 9], fill=C('#2e3a2e'), outline=C('#6e4626'))
    for k in range(3): d.line([(25, cy + 1 + k * 3), (36 - k * 2, cy + 1 + k * 3)], fill=C('#dfe8ee'))
    d.rectangle([76, cy + 5, 88, cy + 14], fill=C('#c4cad2'), outline=C('#5d636c')); d.ellipse([78, cy + 1, 86, cy + 6], fill=C('#dfe4ea'), outline=C('#5d636c'))
    # ANIMAL SHOP (right)
    cy2 = stall(im, 128, 26, 90, C('#4f8a3c'), C('#f2efe6'), 'ANIMALS', C('#3d6e2f'))
    # small chick pen to the right of the counter (front)
    return im, cy, cy2

def chick(d, x, y, f):
    d.ellipse([x, y, x + 4, y + 3], fill=C('#f6d84a')); d.point((x + 4 if f else x - 1, y + 1), fill=C('#e08a2c'))
    d.point((x + 3 if f else x + 1, y + 1), fill=C('#1c1c1c')); d.point((x + 1, y + 4), fill=C('#e08a2c')); d.point((x + 3, y + 4), fill=C('#e08a2c'))

def main():
    BG, cy, cy2 = background()
    jt = ['idle'] * 6 + ['breath'] * 6 + ['idle'] * 4 + ['raise'] * 3 + ['inhale'] * 9 + ['raise'] * 2 + ['exhale'] * 5 + ['idle'] * 6 + ['breath'] * 6 + ['idle'] * 5
    bt = ['idle'] * 8 + ['breath'] * 6 + ['idle'] * 4 + ['blink'] * 2 + ['idle'] * 6 + ['push'] * 2 + ['push2'] * 5 + ['push'] * 2 + ['idle'] * 6 + ['breath'] * 6 + ['blink'] * 2 + ['idle'] * 3
    tt = ['idle'] * 6 + ['breath'] * 6 + ['wag', 'idle'] * 3 + ['idle'] * 4 + ['blink'] * 2 + ['idle'] * 4 + ['breath'] * 6 + ['wag', 'idle'] * 3 + ['idle'] * 7 + ['breath'] * 4
    n = max(len(jt), len(bt), len(tt)); frames = []; puffs = []
    JX, JY = 100, cy + 44                      # Jao stands just right of the fish stall (feet y)
    chicks = [[176, cy2 + 40, 1], [186, cy2 + 43, 0], [196, cy2 + 39, 1]]
    for warm in (0, 1):
        for t in range(n):
            im = BG.copy(); d = ImageDraw.Draw(im)
            # Bins behind the animal counter (counter hides his legs)
            bp = bt[t % len(bt)]; im.alpha_composite(bins(bp), (158, cy2 - 13))
            counter(im, 132, cy2 + 14, 84)
            # little sign on the counter + feed sack
            d.rectangle([140, cy2 + 6, 156, cy2 + 14], fill=C('#f2efe6'), outline=C('#6e4626'))
            d.text((148, cy2 + 10), 'BUY', font=ImageFont.load_default(size=6), fill=C('#3d6e2f'), anchor='mm')
            d.rectangle([196, cy2 + 4, 206, cy2 + 14], fill=C('#d8c48a'), outline=C('#8a6a35')); d.line([(198, cy2 + 6), (204, cy2 + 6)], fill=C('#8a6a35'))
            # chick pen (in front, right)
            px0, py0 = 168, cy2 + 36
            d.rectangle([px0, py0, px0 + 40, py0 + 14], fill=C('#cdb68a'))
            for k in range(0, 41, 5): d.line([(px0 + k, py0 - 3), (px0 + k, py0 + 15)], fill=C('#8a5a30'))
            d.line([(px0, py0), (px0 + 40, py0)], fill=C('#9a6438')); d.line([(px0, py0 + 8), (px0 + 40, py0 + 8)], fill=C('#9a6438'))
            for c in chicks:
                if warm == 1 and t % 6 == 0: c[2] = 1 - c[2] if random.random() < .5 else c[2]
                hop = 1 if (t + int(c[0])) % 8 < 2 else 0
                chick(d, int(c[0]) + (1 if c[2] else -1) * ((t // 6) % 3), int(c[1]) - hop, c[2])
            # Turon sitting in front of the animal counter
            d.ellipse([140, cy2 + 51, 158, cy2 + 54], fill=C('#b8a078')); im.alpha_composite(turon(tt[t % len(tt)]), (137, cy2 + 30))
            # Jao beside the fish stall
            jp = jt[t % len(jt)]
            d.ellipse([JX + 4, JY - 1, JX + 20, JY + 2], fill=C('#b8a078')); im.alpha_composite(jao(jp), (JX, JY - 37))
            if jp == 'exhale' and jt[(t - 1) % len(jt)] != 'exhale':
                for k in range(14): puffs.append([JX + 11 + k * .9, JY - 26 + (k % 3), 2 + k * .35, 0, 46])
            tip = (JX + 15, JY - 17) if jp in ('idle', 'breath', 'exhale') else (JX + 16, JY - 20)
            if t % 2 == 0: puffs.append([tip[0], tip[1], .8, 0, 26])
            if t % 5 == 0: puffs.append([JX + 6 + (t * 7) % 14, JY - 40 + (t % 3), 3.5, 0, 60])
            g = Image.new('RGBA', im.size); gd = ImageDraw.Draw(g)
            for pf in puffs:
                pf[3] += 1; pf[0] += .45 + math.sin(pf[3] * .3 + pf[2]) * .35; pf[1] -= .45; pf[2] += .22
                a = int(max(0, 170 * (1 - pf[3] / pf[4])))
                gd.ellipse([pf[0] - pf[2], pf[1] - pf[2], pf[0] + pf[2], pf[1] + pf[2]], fill=(232, 236, 244, a))
            puffs[:] = [pf for pf in puffs if pf[3] < pf[4]]
            im.alpha_composite(g)
            if warm: frames.append(im.resize((W * K, H * K), Image.NEAREST).convert('RGB'))
    frames[0].save(os.path.join(OUT, 'market_stalls.gif'), save_all=True, append_images=frames[1:], duration=120, loop=0)
    frames[24].save(os.path.join(OUT, 'market_stalls.png'))
    print('ok', len(frames))

if __name__ == '__main__':
    main()
