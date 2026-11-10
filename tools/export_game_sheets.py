"""Pack the approved draft sprites into small atlases for the game.
Each group is cropped to a shared height so the feet sit on the bottom row (the game anchors sprites
bottom-centre). Writes build/game_sheets.json: {name: {png: base64, groups: {group: [[x,y,w,h],...]}}}"""
import os, sys, json, base64, io
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from PIL import Image

ROOT = os.path.dirname(HERE)
FL = lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)


def load_partial(fname, marker):
    src = open(os.path.join(HERE, fname)).read().split(marker)[0]
    g = {'__file__': os.path.join(HERE, fname), '__name__': 'partial'}
    exec(compile(src, fname, 'exec'), g); return g


def pack(groups):
    """groups: {name: [PIL images]} -> atlas image + rects. Crop every frame in a group to the group's
    lowest content row (shared feet line) and to the group's max width, centred."""
    out = {}
    for name, ims in groups.items():
        bottom = max(im.getbbox()[3] for im in ims)
        top = min(im.getbbox()[1] for im in ims)
        out[name] = [im.crop((0, top, im.width, bottom)) for im in ims]
    W = max(sum(i.width for i in ims) for ims in out.values())
    H = sum(max(i.height for i in ims) for ims in out.values())
    atlas = Image.new('RGBA', (W, H)); rects = {}; y = 0
    for name, ims in out.items():
        x = 0; rects[name] = []
        for im in ims: atlas.alpha_composite(im, (x, y)); rects[name].append([x, y, im.width, im.height]); x += im.width
        y += max(i.height for i in ims)
    buf = io.BytesIO(); atlas.save(buf, 'PNG', optimize=True)
    return atlas, rects, base64.b64encode(buf.getvalue()).decode()


res = {}


def breath(r):
    """Adjo idle breathing frame: head + torso sink 1px, legs stay planted (rows: down/right/up/left)"""
    sh = Image.open(os.path.join(ROOT, 'assets/characters/farmer/farmer_sheet.png')).convert('RGBA')
    im = sh.crop((4 * 22, r * 36, 5 * 22, r * 36 + 36)); out = Image.new('RGBA', im.size)
    out.alpha_composite(im.crop((0, 27, 22, 36)), (0, 27)); out.alpha_composite(im.crop((0, 0, 22, 27)), (0, 1))
    return out

# ---- Adjo emote: pose / head roll / frogs
ae = load_partial('adjo_emote.py', '# ---------------- animation')
A = ae['adjo']
atlas, rects, b64 = pack({
    'body': [A('idle'), A('idle', blink=True), A('windup'), A('pose'), A('pose', blink=True),
             A('pose', hx=-2, hy=1, look='down'), A('pose', hx=2, hy=0), A('pose', hx=0, hy=-2, look='up'), A('pose', hx=-2, hy=0)],
    'frog': [ae['frog'](0), ae['frog'](1)],
    'breath': [breath(r) for r in range(4)]})
res['adjoEmote'] = {'png': b64, 'groups': rects}; atlas.save('/tmp/atlas_adjo_emote.png')

# ---- Sprocket
sp = load_partial('sprocket.py', "if __name__ == '__main__':")
S = sp['side']; Fr = sp['front']; Bk = sp['back']; Lie = sp['lie']
atlas, rects, b64 = pack({
    'right': [S(f, near_missing=False) for f in range(6)],
    'left': [FL(S(f)) for f in range(6)],
    'down': [FL(Fr(f)) for f in range(6)],
    'up': [FL(Bk(f)) for f in range(6)],
    'idleR': [S(0, near_missing=False, idle=True), S(0, near_missing=False, idle=True, wag=1), S(0, near_missing=False, idle=True, blink=True)],
    'idleL': [FL(S(0, idle=True)), FL(S(0, idle=True, wag=1)), FL(S(0, idle=True, blink=True))],
    'idleD': [FL(Fr(0)), FL(Fr(0)), FL(Fr(0, blink=True))],
    'lie': [Lie('sleep'), Lie('peek'), Lie('yawn'), Lie('happy'), Lie('happy', tail=1)]})
res['sprocket'] = {'png': b64, 'groups': rects}; atlas.save('/tmp/atlas_sprocket.png')

# ---- Casper
cs = load_partial('casper.py', "if __name__ == '__main__':")
Sd = cs['side']
atlas, rects, b64 = pack({
    'right': [Sd(f) for f in range(4)],
    'down': [cs['front'](f) for f in range(4)],
    'up': [cs['back'](f) for f in range(4)],
    'downIdle': [cs['front'](0), cs['front'](0), cs['front'](0, blink=True)],
    'sit': [Sd(0, 'sit'), Sd(1, 'sit'), Sd(0, 'sit', blink=True)],
    'bark': [Sd(0, 'bark'), Sd(1, 'bark')],
    'stand': [Sd(0, 'stand'), Sd(1, 'stand'), Sd(0, 'stand', blink=True)],
    'crouch': [Sd(0, 'crouch')],
    'tuck': [Sd(0, 'tuck')]})
res['casper'] = {'png': b64, 'groups': rects}; atlas.save('/tmp/atlas_casper.png')

os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
json.dump(res, open(os.path.join(ROOT, 'build', 'game_sheets.json'), 'w'))
print({k: {g: len(v) for g, v in d['groups'].items()} for k, d in res.items()}, [len(d['png']) for d in res.values()])
