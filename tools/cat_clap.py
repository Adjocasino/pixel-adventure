"""Cotton's clapping animation (draft, pictures only): standing on her back legs, big toothy grin,
clapping her front paws like the trending AI cat clip. Same art style as tools/cats.py.
Output: assets/characters/cats/cotton_clap.png (frames), cotton_clap.gif (preview)."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from cats import B, CATS, head, OUT, C

TEETH = C('#fffaf0'); GUM = C('#c8586a'); PAD = C('#f4b6b0')

k_nose=[None]
def grin(b, hx, hy, wide):
    """big human-ish grin under the nose: dark mouth outline, row of teeth."""
    nx, ny = int(hx - 1), int(hy + 1)
    w = 2 if wide else 1
    for dx in range(-w, w + 2):
        b.sp(nx + dx, ny + 1, TEETH); b.sp(nx + dx, ny + 2, OUT)
    b.sp(nx - w - 1, ny, OUT); b.sp(nx + w + 2, ny, OUT); b.sp(nx - w - 1, ny + 1, OUT); b.sp(nx + w + 2, ny + 1, OUT)
    b.sp(nx - w, ny, OUT); b.sp(nx + w + 1, ny, OUT)
    for dx in range(-w + 1, w + 1, 2): b.sp(nx + dx, ny + 1, C('#e2d6c2'))   # tooth gaps
    b.sp(nx, ny, k_nose[0]); b.sp(nx + 1, ny, k_nose[0])

def arm(b, k, sx, sy, px, py, inner):
    # thick arm (3px) from shoulder to paw, drawn on its own layer so it keeps an outline over the white body
    n = int(max(abs(px - sx), abs(py - sy))) + 1
    for i in range(n + 1):
        u = i / n; x = sx + (px - sx) * u; y = sy + (py - sy) * u
        b.sp(x, y, k['body']); b.sp(x, y + 1, k['bodyS']); b.sp(x + 1, y, k['body'])
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1): b.sp(px + dx, py + dy, k['paw'])
    b.sp(px + inner, py, PAD); b.sp(px + inner, py + 1, PAD)

# arm poses (paw x offset from body center, paw y) : open wide -> clap
POSES = {'open': (10, -6), 'mid': (6, -5), 'clap': (2, -4), 'up': (9, -10)}   # (paw x from center, paw y from body center)

def stand(name, pose, bob=0, blink=False, wide=True, tail=0):
    k = CATS[name]; b = B(26, 32); cx = 13; by = 21 + bob
    # tail behind, swishing
    for t in range(14):
        u = t / 13; x = cx + 4 + u * 5 + math.sin(u * 3 + tail) * 2; y = 28 - u * 13
        b.sp(x, y, k['tail']); b.sp(x + 1, y, k['tail'])
    # back legs (standing): two stubby legs, big feet
    for lx in (cx - 4, cx + 2):
        for y in range(by + 3, 30): b.sp(lx, y, k['point']); b.sp(lx + 1, y, k['point']); b.sp(lx + 2, y, k['pointS'])
        for dx in range(-1, 3): b.sp(lx + dx, 30, k['paw'])
    # body: upright oval, belly shade
    b.ell(cx, by, 5.5, 7.5, lambda x, y, dx, dy: k['bodyS'] if dx > .55 or dy > .7 else k['body'])
    head(b, k, cx, by - 10, blink=blink)
    k_nose[0] = k['nose']; grin(b, cx, by - 10, wide)
    b.outline()
    ox, py = POSES[pose]
    for side in (-1, 1):
        a = B(26, 32)
        sx = cx - 5 if side < 0 else cx + 4
        px = cx - 1 - ox if side < 0 else cx + ox
        arm(a, k, sx, by - 3, px, by + py, 1 if side < 0 else -1)
        a.outline(); b.im.alpha_composite(a.im)
    return b.im

def frames(name='cotton'):
    seq = []
    # a beat = open, mid, clap, (hold) ... with a little bounce on the clap, like the clip
    for beat in range(4):
        seq += [stand(name, 'open', 0, tail=beat), stand(name, 'mid', 0, tail=beat + .3),
                stand(name, 'clap', 1, tail=beat + .6), stand(name, 'clap', 1, wide=True, tail=beat + .8),
                stand(name, 'mid', 0, tail=beat + 1)]
    return seq

if __name__ == '__main__':
    O = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'cats')
    uniq = [stand('cotton', p, b) for p, b in (('open', 0), ('mid', 0), ('clap', 1))] + [stand('cotton', 'open', 0, blink=True), stand('cotton', 'up', 0)]
    sh = Image.new('RGBA', (26 * len(uniq), 32), (0, 0, 0, 0))
    for i, im in enumerate(uniq): sh.alpha_composite(im, (i * 26, 0))
    sh.save(os.path.join(O, 'cotton_clap.png'))
    S = 8; bg = (0, 230, 64, 255)
    gif = []
    for im in frames():
        f = Image.new('RGBA', (26 * S + 40, 32 * S + 40), bg); f.alpha_composite(im.resize((26 * S, 32 * S), Image.NEAREST), (20, 20)); gif.append(f.convert('RGB'))
    gif[0].save(os.path.join(O, 'cotton_clap.gif'), save_all=True, append_images=gif[1:], duration=[90, 70, 110, 70, 70] * 4, loop=0)
    big = Image.new('RGBA', (len(uniq) * (26 * S + 20) + 20, 32 * S + 40), bg)
    for i, im in enumerate(uniq): big.alpha_composite(im.resize((26 * S, 32 * S), Image.NEAREST), (20 + i * (26 * S + 20), 20))
    big.convert('RGB').save('/tmp/cc/sheet.png'); print('ok')
