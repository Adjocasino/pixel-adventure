"""Jao, market NPC draft: old man with thick black hair and a short aluminum vape stick (picture only).
He hangs around the stalls and says dumb-philosophy quotes; also says a line after you close the sell menu.
Frames (front view, 24x36 like the farmer): idle, breath, raise, inhale (eyes shut, tip glows), exhale (mouth 'o').
Output: assets/characters/tito/jao_draft.gif + jao_frames.png"""
import os, sys, math
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from farmer import B, C

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'jao')
os.makedirs(OUT, exist_ok=True)
Q = dict(skin=C('#c98e62'), skinS=C('#a8714a'), skinL=C('#dba67a'), wr=C('#8e5a3a'),
         hair=C('#1a1414'), hairL=C('#3a3236'), hairS=C('#0e0a0a'),
         sw=C('#f2efe8'), swS=C('#d2cdc2'), swL=C('#ffffff'), swR=C('#c2bcae'), col=C('#e6e2d8'), shorts=C('#2a2a32'), shortsS=C('#17171c'),
         shoe=C('#f6f6f2'), shoeS=C('#cfcfc8'), sole=C('#9a9a94'), vape=C('#e8b93a'), vapeL=C('#fff2a8'), vapeD=C('#a8781c'),
         glow=C('#e8b93a'), eye=C('#241a16'), mouth=C('#6a3a2a'))

def jao(pose):
    """pose: idle | breath | raise | inhale | exhale.  Old, hunched (head sunk 2px into the shoulders), cane in the left hand."""
    b = B(24, 38, 4, 8); X, R = b.X, b.R
    Y = -1 if pose == 'breath' else 0
    H = Y + 2                      # head sits lower: hunched back
    CANE, CANEL, CANED = C('#7a4a26'), C('#9a6438'), C('#5a3418')
    WATCH, WATCHL = C('#b8bec8'), C('#eef2f6')
    GL, LENS = C('#3c3e46'), C('#dbe7ee')
    # cane (behind the left hand): crook handle on top, shaft to the ground
    R(0, 20 + Y, 1, 9 - Y, CANE); X(0, 22 + Y, CANEL); X(0, 28, CANED)
    X(0, 19 + Y, CANE); X(1, 18 + Y, CANE); X(2, 18 + Y, CANEL); X(3, 19 + Y, CANED)
    # legs + white shoes
    for lx in (4, 9):
        R(lx, 24, 3, 3, Q['skin']); X(lx + 2, 25, Q['skinS'])
        R(lx - 1, 26, 5, 2, Q['shoe']); X(lx + 3, 26, Q['shoeS']); R(lx - 1, 28, 5, 1, Q['sole']); X(lx, 26, Q['shoeS'])
    # black shorts to the knee
    R(3, 18 + Y, 10, 6, Q['shorts']); R(3, 23 + Y, 4, 1, Q['shortsS']); R(9, 23 + Y, 4, 1, Q['shortsS'])
    for y in range(19, 24): X(7 + (1 if y > 20 else 0), y + Y, Q['shortsS'])
    # white sweater, rounded shoulders (hump) because of the hunch
    for y in range(10, 19):
        w = 1 if 13 <= y <= 17 else 0
        a, z = (4, 11) if y == 10 else (3 - w, 12 + w)
        R(a, y + Y, z - a + 1, 1, Q['sw']); X(z, y + Y, Q['swS']); X(a, y + Y, Q['swL'])
    R(3, 18 + Y, 10, 1, Q['swR'])                                              # ribbed hem
    for (x, y) in ((5, 15), (9, 14), (6, 17), (10, 16)): X(x, y + Y, Q['swS'])  # knit texture
    # left arm: 3/4 sleeve, bare forearm, silver watch, hand on the cane
    R(1, 12 + Y, 2, 4, Q['sw']); X(1, 13 + Y, Q['swL']); R(1, 16 + Y, 2, 1, Q['swR'])
    R(1, 17 + Y, 2, 2, Q['skin']); X(2, 17 + Y, Q['skinS'])
    X(1, 18 + Y, WATCH); X(2, 18 + Y, WATCHL)
    R(1, 19 + Y, 2, 1, Q['skin']); X(0, 19 + Y, Q['skin'])                     # gripping the cane
    # right arm + gold vape (by pose)
    if pose in ('idle', 'breath', 'exhale'):
        R(13, 12 + Y, 2, 3, Q['sw']); R(13, 15 + Y, 2, 1, Q['swR']); R(12, 16 + Y, 2, 1, Q['skin']); X(13, 15 + Y, Q['skin'])
        R(11, 15 + Y, 1, 2, Q['skin']); R(11, 12 + Y, 1, 3, Q['vape']); X(11, 12 + Y, Q['vapeL']); X(11, 14 + Y, Q['vapeD'])
    elif pose == 'raise':
        R(13, 12 + Y, 2, 2, Q['sw']); R(13, 14 + Y, 2, 1, Q['swR']); R(12, 12 + Y, 1, 2, Q['skin'])
        R(11, 11 + Y, 1, 3, Q['skin']); R(12, 9 + Y, 1, 3, Q['vape']); X(12, 9 + Y, Q['vapeL'])
    else:  # inhale: hand at the mouth
        R(13, 12 + Y, 2, 2, Q['sw']); R(13, 14 + Y, 2, 1, Q['swR']); R(12, 12 + Y, 1, 1, Q['skin']); R(11, 11 + Y, 2, 1, Q['skin'])
    # head (2px lower than before)
    for y, (a, z) in enumerate([(5, 10), (4, 11), (4, 11), (4, 11), (4, 11), (4, 11), (4, 11), (5, 10)]):
        R(a, 2 + y + H, z - a + 1, 1, Q['skin'])
    for y in range(3, 10): X(11, y + H, Q['skinS'])
    X(3, 6 + H, Q['skin']); X(12, 6 + H, Q['skinS'])                      # ears
    # thick black hair
    for y, (a, z) in enumerate([(4, 11), (2, 13), (1, 14), (1, 14), (2, 13), (3, 12)]):
        R(a, -4 + y + H, z - a + 1, 1, Q['hair'])
    R(3, 2 + H, 1, 4, Q['hair']); R(12, 2 + H, 1, 4, Q['hair'])
    for (x, y) in ((5, -3), (6, -3), (4, -2), (9, -2), (10, -3)): X(x, y + H, Q['hairL'])
    X(1, 0 + H, Q['hairS']); X(14, 0 + H, Q['hairS'])
    # deep wrinkles: forehead line, eye bags, cheek folds, chin
    X(5, 2 + H, Q['skinS']); X(6, 2 + H, Q['skinS']); X(9, 2 + H, Q['skinS']); X(10, 2 + H, Q['skinS'])   # forehead lines
    X(4, 7 + H, Q['wr']); X(11, 7 + H, Q['wr'])
    X(5, 8 + H, Q['wr']); X(10, 8 + H, Q['wr']); X(5, 9 + H, Q['wr']); X(10, 9 + H, Q['wr'])
    X(7, 9 + H, Q['skinS']); X(8, 9 + H, Q['skinS'])
    # eyes (no glasses): heavy lids over small dark eyes
    R(5, 4 + H, 2, 1, Q['wr']); R(9, 4 + H, 2, 1, Q['wr'])
    if pose == 'inhale':
        R(5, 5 + H, 2, 1, Q['wr']); R(9, 5 + H, 2, 1, Q['wr'])             # eyes shut
    else:
        X(6, 5 + H, Q['eye']); X(9, 5 + H, Q['eye']); X(5, 5 + H, C('#f4ece0')); X(10, 5 + H, C('#f4ece0'))
    X(7, 7 + H, Q['skinS'])                                                  # nose
    if pose == 'exhale': R(7, 8 + H, 2, 1, Q['mouth']); X(7, 9 + H, Q['mouth'])
    else: R(6, 8 + H, 4, 1, Q['mouth'])
    if pose == 'inhale':   # gold stick across the lips
        R(8, 8 + H, 4, 1, Q['vape']); X(8, 8 + H, Q['vapeL']); X(11, 8 + H, Q['vapeD'])
    b.outline()
    return b.im

# ---------- preview scene ----------
SW, SHH, K, GROUND = 150, 80, 5, 70
def halo(im, p, sx, sy, t):
    """soft pulsing gold glow around the vape stick; sx,sy = sprite top-left on the canvas"""
    if p in ('idle', 'breath', 'exhale'): cx, cy = sx + 15, sy + 21 + (-1 if p == 'breath' else 0)
    elif p == 'raise': cx, cy = sx + 15, sy + 18
    else: cx, cy = sx + 14, sy + 16
    g = Image.new('RGBA', im.size); gd = ImageDraw.Draw(g); r = 4 + (1 if (t // 3) % 2 else 0)
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 200, 60, 110)); gd.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=(255, 235, 130, 170))
    im.alpha_composite(g)
    if (t // 4) % 3 == 0: ImageDraw.Draw(im).point((cx + 2, cy - 4), fill=(255, 246, 190, 255))   # twinkle

def scene_bg():
    im = Image.new('RGBA', (SW, SHH), C('#d9c49a')); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, SW, 30], fill=C('#bfe3f5'))
    # stall behind: awning + counter
    for i in range(10): d.rectangle([60 + i * 8, 14, 67 + i * 8, 20], fill=C('#e8434f') if i % 2 else C('#f2efe6'))
    d.rectangle([62, 20, 138, 22], fill=C('#8a5a30')); d.rectangle([64, 22, 66, 56], fill=C('#6e4626')); d.rectangle([134, 22, 136, 56], fill=C('#6e4626'))
    d.rectangle([62, 44, 138, 56], fill=C('#d0803c')); d.line([(62, 44), (138, 44)], fill=C('#9a5a28'))
    d.text((100, 49), 'STALL', fill=C('#5a3416'), anchor='mm')
    for y in range(31, SHH, 6): d.line([(0, y), (SW, y)], fill=C('#cdb68a'))
    return im

def bubble(big, text, x, y):
    d = ImageDraw.Draw(big); f = ImageFont.load_default(size=19)
    lines = text.split('\n'); w = max(d.textlength(l, font=f) for l in lines) + 28; h = 26 * len(lines) + 18
    x0, y0 = max(6, min(big.width - w - 6, x - w / 2)), y - h
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], 10, fill=(255, 255, 255), outline=(40, 30, 30), width=3)
    d.polygon([(x - 10, y0 + h - 2), (x + 6, y0 + h - 2), (x - 4, y0 + h + 14)], fill=(255, 255, 255), outline=(40, 30, 30))
    d.line([(x - 9, y0 + h - 2), (x + 5, y0 + h - 2)], fill=(255, 255, 255), width=4)
    for i, l in enumerate(lines): d.text((x0 + 14, y0 + 10 + i * 26), l, font=f, fill=(30, 20, 20))

def main():
    poses = ['idle', 'breath', 'raise', 'inhale', 'exhale']
    S = {p: jao(p) for p in poses}
    # close-up frames sheet
    sh = Image.new('RGBA', (len(poses) * 28, 40), C('#d9c49a'))
    for i, p in enumerate(poses): sh.alpha_composite(S[p], (i * 28 + 2, 1))
    sh.resize((sh.width * 8, sh.height * 8), Image.NEAREST).save(os.path.join(OUT, 'jao_frames.png'))
    # timeline: idle/breath, then raise, inhale (hold), exhale with a cloud, back to idle; a quote bubble
    tl = ['idle'] * 6 + ['breath'] * 6 + ['idle'] * 6 + ['raise'] * 3 + ['inhale'] * 10 + ['raise'] * 2 + ['exhale'] * 4 + ['idle'] * 14 + ['breath'] * 6 + ['idle'] * 6
    quotes = ['The moon never goes to the gym.\nStill full.', 'You are not late.\nEveryone else is just early.']
    BG = scene_bg(); frames = []; puffs = []; x0 = 30
    for t, p in enumerate(tl):
        im = BG.copy(); d = ImageDraw.Draw(im)
        d.ellipse([x0 + 3, GROUND - 1, x0 + 19, GROUND + 2], fill=(150, 125, 85, 255))
        im.alpha_composite(S[p], (x0, GROUND - 37))
        if p == 'exhale' and tl[t - 1] != 'exhale':
            for k in range(14): puffs.append([x0 + 11 + k * .9, GROUND - 28 + (k % 3), 2 + k * .35, 0, 46])
        # permanent linger: a wisp always rising from the stick + slow haze around his head
        tip = (x0 + 4 + 11, GROUND - 37 + 8 + 12) if p in ('idle', 'breath', 'exhale') else (x0 + 4 + 12, GROUND - 37 + 8 + 8)
        if t % 2 == 0: puffs.append([tip[0], tip[1], .8, 0, 26])
        if t % 5 == 0: puffs.append([x0 + 6 + (t * 7) % 14, GROUND - 40 + (t % 3), 3.5, 0, 60])
        g = Image.new('RGBA', im.size); gd = ImageDraw.Draw(g)
        for pf in puffs:
            life = pf[4]; pf[3] += 1; pf[0] += .45 + math.sin(pf[3] * .3 + pf[2]) * .35; pf[1] -= .45; pf[2] += .22
            a = int(max(0, 170 * (1 - pf[3] / life)))
            gd.ellipse([pf[0] - pf[2], pf[1] - pf[2], pf[0] + pf[2], pf[1] + pf[2]], fill=(232, 236, 244, a))
        puffs[:] = [pf for pf in puffs if pf[3] < pf[4]]
        im.alpha_composite(g)
        big = im.resize((SW * K, SHH * K), Image.NEAREST)
        q = quotes[0] if t < len(tl) // 2 else quotes[1]
        if 8 <= t % (len(tl) // 2) <= len(tl) // 2 - 2: bubble(big, q, (x0 + 12) * K, (GROUND - 40) * K)
        frames.append(big.convert('RGB'))
    frames[0].save(os.path.join(OUT, 'jao_draft.gif'), save_all=True, append_images=frames[1:], duration=120, loop=0)
    print('ok', len(frames))

def closeup():
    """clean loop: only Jao and the smoke, big, seamless timing"""
    poses = ['idle', 'breath', 'raise', 'inhale', 'exhale']; S = {p: jao(p) for p in poses}
    W2, H2, K2 = 84, 84, 6; gx, gy = 26, 80
    tl = ['idle'] * 5 + ['breath'] * 5 + ['idle'] * 5 + ['breath'] * 5 + ['raise'] * 3 + ['inhale'] * 10 + ['raise'] * 2 + ['exhale'] * 5 + ['idle'] * 5 + ['breath'] * 5 + ['idle'] * 5 + ['breath'] * 5
    frames = []; puffs = []
    for warm in (0, 1):                       # run twice, keep the 2nd pass so the haze is already there (seamless loop)
        for t, p in enumerate(tl):
            im = Image.new('RGBA', (W2, H2), C('#d9c49a')); d = ImageDraw.Draw(im)
            d.ellipse([gx + 3, gy - 1, gx + 19, gy + 2], fill=(150, 125, 85, 255))
            im.alpha_composite(S[p], (gx, gy - 37))
            if p == 'exhale' and tl[t - 1] != 'exhale':
                for k in range(14): puffs.append([gx + 11 + k * .9, gy - 26 + (k % 3), 2 + k * .35, 0, 46])
            tip = (gx + 15, gy - 17) if p in ('idle', 'breath', 'exhale') else (gx + 16, gy - 20)
            if t % 2 == 0: puffs.append([tip[0], tip[1], .8, 0, 26])
            if t % 5 == 0: puffs.append([gx + 6 + (t * 7) % 14, gy - 40 + (t % 3), 3.5, 0, 60])
            g = Image.new('RGBA', im.size); gd = ImageDraw.Draw(g)
            for pf in puffs:
                life = pf[4]; pf[3] += 1; pf[0] += .45 + math.sin(pf[3] * .3 + pf[2]) * .35; pf[1] -= .45; pf[2] += .22
                a = int(max(0, 170 * (1 - pf[3] / life)))
                gd.ellipse([pf[0] - pf[2], pf[1] - pf[2], pf[0] + pf[2], pf[1] + pf[2]], fill=(232, 236, 244, a))
            puffs[:] = [pf for pf in puffs if pf[3] < pf[4]]
            im.alpha_composite(g)
            if warm: frames.append(im.resize((W2 * K2, H2 * K2), Image.NEAREST).convert('RGB'))
    frames[0].save(os.path.join(OUT, 'jao_loop.gif'), save_all=True, append_images=frames[1:], duration=120, loop=0)
    print('loop', len(frames))

if __name__ == '__main__':
    main(); closeup()
