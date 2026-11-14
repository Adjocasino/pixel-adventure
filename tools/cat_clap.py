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
        b.sp(x, y, k['point']); b.sp(x, y + 1, k['pointS']); b.sp(x + 1, y, k['point'])
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1): b.sp(px + dx, py + dy, k['paw'])
    b.sp(px + inner, py, PAD); b.sp(px + inner, py + 1, PAD)

# Full clip, in order: grin + wide claps -> grin gone, paws clasped -> head ducks to lick a paw
# -> looks up with curled paws -> big arm swoosh and a wide-eyed hold.
# pose: (left paw, right paw) as (dx, dy) from body center, + options
POSES = {
 'open':   dict(L=(-12, -7), R=(11, -8), splay=1, face='grin'),
 'mid':    dict(L=(-7, -5), R=(6, -5), face='grin'),
 'clap':   dict(L=(-2, -4), R=(1, -4), face='grin', bob=1),
 'rub':    dict(L=(-1, -3), R=(1, -5), face='grin', bob=1),
 'clasp':  dict(L=(-1, -2), R=(1, -2), face='plain'),
 'groom1': dict(L=(-2, -1), R=(0, -6), face='closed', head=(-1, 2)),
 'groom2': dict(L=(-2, -1), R=(1, -7), face='closed', head=(-1, 1)),
 'curl':   dict(L=(-3, -5), R=(2, -6), face='plain', curl=1),
 'swoosh1':dict(L=(-11, -1), R=(2, -3), face='plain', splay=1, head=(1, 0)),
 'swoosh2':dict(L=(-12, 6), R=(3, -4), face='plain', head=(1, 0)),
 'swoosh2b':dict(L=(-12, 6), R=(3, -4), face='closed', head=(1, 0)),
 'up':     dict(L=(-10, -11), R=(9, -11), splay=1, face='grin'),
}
ORDER = list(POSES)

def paw_toes(b, k, px, py, side):
    for dx, dy in ((side * 2, -1), (side * 2, 0), (side * 2, 1), (side, -2), (side, 2)):
        b.sp(px + dx, py + dy, k['paw'])

def stand(name, pose, tail=0):
    P = POSES[pose]; k = CATS[name]; b = B(30, 32); cx = 15; by = 21 + P.get('bob', 0)
    for t in range(14):
        u = t / 13; x = cx + 4 + u * 5 + math.sin(u * 3 + tail) * 2; y = 28 - u * 13
        b.sp(x, y, k['tail']); b.sp(x + 1, y, k['tail'])
    for lx in (cx - 4, cx + 2):
        for y in range(by + 3, 30): b.sp(lx, y, k['point']); b.sp(lx + 1, y, k['point']); b.sp(lx + 2, y, k['pointS'])
        for dx in range(-1, 3): b.sp(lx + dx, 30, k['paw'])
    b.ell(cx, by, 5.5, 7.5, lambda x, y, dx, dy: k['bodyS'] if dx > .55 or dy > .7 else k['body'])
    hdx, hdy = P.get('head', (0, 0))
    hx, hy = cx + hdx, by - 10 + hdy
    head(b, k, hx, hy, blink=P['face'] == 'closed')
    if P['face'] == 'grin': k_nose[0] = k['nose']; grin(b, hx, hy, True)
    b.outline()
    for side in (-1, 1):
        a = B(30, 32)
        sx = cx - 5 if side < 0 else cx + 4
        dx, dy = P['L'] if side < 0 else P['R']
        px, py = cx + dx - (1 if side < 0 else 0), by + dy
        arm(a, k, sx, by - 3, px, py, 1 if side < 0 else -1)
        if P.get('splay'): paw_toes(a, k, px, py, side)
        if P.get('curl'): a.sp(px, py - 2, k['paw']); a.sp(px + side, py - 2, k['paw'])
        a.outline(); b.im.alpha_composite(a.im)
    return b.im

# timeline in ms, mirrors the clip (6.8 s)
TIMELINE = ([('open', 120), ('mid', 70), ('clap', 110), ('rub', 160), ('mid', 70)] * 5
            + [('clasp', 420)] + [('groom1', 200), ('groom2', 200)] * 3 + [('clasp', 150), ('curl', 550)]
            + [('swoosh1', 160), ('swoosh2', 700), ('swoosh2b', 140), ('swoosh2', 650)])

if __name__ == '__main__':
    O = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'cats')
    S = 8; bg = (0, 230, 64, 255); rows = []
    for name in ('cotton', 'collete', 'precious'):
        fr = [stand(name, p) for p in ORDER]; rows.append(fr)
        sh = Image.new('RGBA', (30 * len(fr), 32), (0, 0, 0, 0))
        for i, im in enumerate(fr): sh.alpha_composite(im, (i * 30, 0))
        sh.save(os.path.join(O, f'{name}_clap.png'))
        gif = []; d = []
        for n, (p, ms) in enumerate(TIMELINE):
            im = stand(name, p, tail=n * .4)
            f = Image.new('RGBA', (30 * S + 40, 32 * S + 40), bg); f.alpha_composite(im.resize((30 * S, 32 * S), Image.NEAREST), (20, 20)); gif.append(f.convert('RGB')); d.append(ms)
        gif[0].save(os.path.join(O, f'{name}_clap.gif'), save_all=True, append_images=gif[1:], duration=d, loop=0)
    s2 = 4; big = Image.new('RGBA', (len(ORDER) * (30 * s2 + 4) + 8, 3 * (32 * s2 + 6) + 8), bg)
    for r, fr in enumerate(rows):
        for i, im in enumerate(fr): big.alpha_composite(im.resize((30 * s2, 32 * s2), Image.NEAREST), (6 + i * (30 * s2 + 4), 6 + r * (32 * s2 + 6)))
    big.convert('RGB').save('/tmp/cc/all.png'); print('ok')
