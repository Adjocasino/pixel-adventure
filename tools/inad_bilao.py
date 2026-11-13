"""Inad in Fruit Catch (picture only, not in the game or demos yet).
Inad is a witch, so the bilao floats above her hat by magic: hands raised, sparkles linking them to it.
Standing: down idle with both hands raised. Running: her broom ride (side), near hand raised, far hand on the broom.
Base frames come from the game's own makeGirl() (loaded in headless Chrome), arms/bilao/sparkles are added here.
Output: assets/characters/inad_fruit_catch.gif (+ inad_fruit_catch_frames.png)."""
import base64, io, math, os, random
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'assets', 'characters')

def grab():
    exprs = {'down4': "makeGirl('down',4)", 'down5': "makeGirl('down',5)"}
    exprs.update({f'ride{f}': f"makeGirl('side',{f},{{ride:1}})" for f in range(4)})
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = b.new_page(); pg.goto('file://' + os.path.join(ROOT, 'app/src/main/assets/index.html')); pg.wait_for_timeout(1200)
        for k, e in exprs.items():
            u = pg.evaluate(f"(()=>{{const c={e},k=document.createElement('canvas');k.width=c.width;k.height=c.height;k.getContext('2d').drawImage(c,0,0);return k.toDataURL()}})()")
            out[k] = Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
        b.close()
    return out

H = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
DR, DRS, TRIM, SKIN, SKINS, OUTL = H('#1c2c7c'), H('#15205c'), H('#6a8ed8'), H('#f6d2b0'), H('#e3b08e'), H('#0f1744')

def put(px, w, h, x, y, c):
    if 0 <= x < w and 0 <= y < h: px[x, y] = c

def carry_down(base, breath):
    """pad to 30 wide, remove the hanging sleeves/hands, draw short arms raised palms-up"""
    im = Image.new('RGBA', (30, 31)); im.alpha_composite(base, (3, 0)); px = im.load()
    Y = -1 if breath else 0
    for y in range(18, 25):
        for x in (7, 8, 9, 20, 21, 22): px[x, y] = (0, 0, 0, 0)
    for x in (9, 10, 19, 20): px[x, 23 + Y] = (0, 0, 0, 0)
    for side in (-1, 1):
        sx = 10 if side < 0 else 19
        path = [(sx, 19 + Y), (sx + side, 18 + Y), (sx + 2 * side, 17 + Y), (sx + 3 * side, 16 + Y), (sx + 3 * side, 15 + Y)]
        for x, y in path:
            for a in (-1, 0, 1):
                for b2 in (-1, 0, 1):
                    if px[x + a, y + b2][3] == 0: px[x + a, y + b2] = OUTL
        for x, y in path: px[x, y] = DR if side < 0 else DRS
        cx = sx + 3 * side; px[cx, 14 + Y] = TRIM; px[cx + side, 14 + Y] = TRIM
        for hx in (cx, cx + side):
            px[hx, 13 + Y] = SKIN if side < 0 else SKINS
        px[cx + side, 12 + Y] = SKIN if side < 0 else SKINS          # fingers up
    return im, ((6 + 24) / 2, 12 + Y)                             # hand anchor (centre between hands, fingertips)

def carry_ride(base, f):
    """broom ride side frame: add the near arm raised forward-up (far hand stays on the broom)"""
    im = Image.new('RGBA', (32, 33)); im.alpha_composite(base, (2, 0)); px = im.load()
    Y = -1 if f % 2 else 0
    ox, oy = 6 + 2, 7
    path = [(ox + 10, oy + 13 + Y), (ox + 11, oy + 12 + Y), (ox + 12, oy + 11 + Y), (ox + 13, oy + 10 + Y), (ox + 14, oy + 9 + Y)]
    for x, y in path:
        for a in (-1, 0, 1):
            for b2 in (-1, 0, 1):
                if 0 <= x + a < 32 and 0 <= y + b2 < 33 and px[x + a, y + b2][3] == 0: px[x + a, y + b2] = OUTL
    for x, y in path: px[x, y] = DRS
    hx, hy = ox + 14, oy + 8 + Y
    px[hx, hy] = TRIM; px[hx + 1, hy] = TRIM; px[hx, hy - 1] = SKIN; px[hx + 1, hy - 1] = SKIN; px[hx + 1, hy - 2] = SKIN
    return im, (hx + .5, hy - 2)

# ---------- preview scene ----------
SW, SHH, K, GROUND = 170, 96, 4, 84
def bilao(t, fruit):
    b = Image.new('RGBA', (48, 22)); d = ImageDraw.Draw(b)
    cx, base = 24, 16
    for x in range(-22, 23):
        y = 6 * (abs(x) / 22) ** 2.2
        top = int(base - y)
        d.line([(cx + x, top), (cx + x, base + 3 - int(y * .5))], fill=H('#8a5a2b'))
        d.point((cx + x, top), fill=H('#e0b876') if x % 3 else H('#b98a4c'))
        d.point((cx + x, base + 3 - int(y * .5)), fill=H('#2a1d14'))
    for x in (-23, 22): d.rectangle([cx + x, base - 7, cx + x + 1, base - 6], fill=H('#b98a4c'))
    cols = [H('#f6c844'), H('#a7d36a'), H('#e08a2c'), H('#7fbf3a'), H('#f6c844'), H('#a7d36a')]
    for i in range(fruit):
        fx = cx - 12 + (i % 4) * 7 + (i // 4) * 3; fy = base - 4 - (i // 4) * 5
        d.ellipse([fx - 3, fy - 3, fx + 3, fy + 3], fill=cols[i % 6], outline=H('#2a1d14'))
    return b

def background():
    im = Image.new('RGBA', (SW, SHH)); d = ImageDraw.Draw(im)
    for y in range(GROUND):
        t = y / GROUND; d.line([(0, y), (SW, y)], fill=(int(111 + 90 * t), int(182 + 54 * t), int(236 + 19 * t), 255))
    for x in range(SW):
        h = 60 + math.sin(x * .05) * 5 + math.sin(x * .02 + 1) * 6; d.line([(x, int(h)), (x, GROUND)], fill=H('#9fd08a'))
    d.rectangle([0, GROUND, SW, SHH], fill=H('#5fa64a')); d.line([(0, GROUND), (SW, GROUND)], fill=H('#4f8f3d'))
    return im

def main():
    fr = grab()
    down = [carry_down(fr['down4'], 0), carry_down(fr['down5'], 1)]
    ride = [carry_ride(fr[f'ride{f}'], f) for f in range(4)]
    BG = background(); random.seed(4)
    frames = []; x = 40.0; fruit = 2; sparks = []
    plan = [('idle', 14), ('right', 26), ('idle', 10), ('left', 26), ('idle', 12)]
    t = 0
    for mode, n in plan:
        for i in range(n):
            im = BG.copy(); d = ImageDraw.Draw(im)
            if mode == 'right': x += 2.6
            if mode == 'left': x -= 2.6
            if mode == 'idle':
                spr, (hx, hy) = down[(t // 6) % 2]; flip = False
                left = int(x - 15); top = GROUND - 31 + 1
                d.ellipse([x - 7, GROUND - 1, x + 7, GROUND + 1], fill=(40, 70, 30, 255))
            else:
                spr, (hx, hy) = ride[(t // 2) % 4]; flip = mode == 'left'
                if flip: spr = spr.transpose(Image.FLIP_LEFT_RIGHT); hx = spr.width - 1 - hx
                hover = 4 + (1 if (t // 3) % 2 else 0)
                left = int(x - 16); top = GROUND - 33 + 1 - hover
                d.ellipse([x - 8, GROUND - 1, x + 8, GROUND + 1], fill=(40, 70, 30, 255))
            im.alpha_composite(spr, (left, top))
            hand = (left + hx, top + hy)
            # bilao floats above the hat, gently bobbing; follows Inad
            bob = math.sin(t * .35) * 1.2
            bx, by = int(x - 24), int(top - 22 + bob)
            if mode != 'idle': bx += (-3 if flip else 3)
            im.alpha_composite(bilao(t, fruit), (bx, by))
            # magic: sparkles drift from the raised hand(s) up to the bilao
            if t % 2 == 0:
                sparks.append([hand[0] + random.uniform(-6 if mode == 'idle' else -1, 6 if mode == 'idle' else 1), hand[1], 0])
            for s in sparks:
                s[2] += 1; s[1] -= 1.1; s[0] += math.sin(s[2] * .8) * .4
                c = H('#dcefff') if s[2] % 4 < 2 else H('#9cd1f8')
                if s[2] < 10: d.point((int(s[0]), int(s[1])), fill=c)
            sparks[:] = [s for s in sparks if s[2] < 10]
            # glow under the bilao
            for k in range(3):
                gx = bx + 12 + k * 12 + int(math.sin(t * .5 + k) * 2); d.point((gx, by + 21), fill=H('#9cd1f8'))
            # a fruit drops in once while idle at the start, and once at the end
            if mode == 'idle' and fruit < 6 and i == n // 2: fruit += 1
            frames.append(im.resize((SW * K, SHH * K), Image.NEAREST).convert('RGB'))
            t += 1
    frames[0].save(os.path.join(OUT, 'inad_fruit_catch.gif'), save_all=True, append_images=frames[1:], duration=90, loop=0)
    # close-up sheet: idle x2, ride x4 (x6)
    parts = [im for im, _ in down] + [im for im, _ in ride]
    W = sum(p.width for p in parts) + 4 * len(parts); Hh = max(p.height for p in parts)
    sh = Image.new('RGBA', (W, Hh), H('#5a8c5a')); xx = 0
    for p in parts: sh.alpha_composite(p, (xx, 0)); xx += p.width + 4
    sh.resize((W * 6, Hh * 6), Image.NEAREST).save(os.path.join(OUT, 'inad_fruit_catch_frames.png'))
    print('frames', len(frames))

if __name__ == '__main__':
    main()
