"""Animal seller NPC draft (picture only). Same height as Jao, but standing straight.
Black sleeveless shirt (cut-off sleeves, not a tank top), short hair with a curly front, big oval glasses, square jaw.
Frames: idle, breath, blink, push (hand up), push2 (finger pushes the glasses up).
Output: assets/characters/animal_seller/seller_frames.png, seller_loop.gif (with Jao beside him for height)."""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from farmer import B, C
from jao import jao

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'animal_seller')
os.makedirs(OUT, exist_ok=True)
Q = dict(skin=C('#d9a07a'), skinS=C('#b87e5a'), skinL=C('#ebb894'), eye=C('#241a16'),
         hair=C('#2b1e19'), hairL=C('#4a3529'), hairS=C('#1a120e'),
         shirt=C('#26262c'), shirtS=C('#16161a'), shirtL=C('#3a3a44'),
         jean=C('#3f5f8f'), jeanS=C('#2f4870'), jeanL=C('#5576a8'),
         boot=C('#6b4226'), bootS=C('#4e2f1a'), bootL=C('#8a5a36'),
         frame=C('#2a2226'), lens=C('#cfe3ef'), lensL=C('#f2fafe'), mouth=C('#8a4a3a'))

def seller(pose):
    """pose: idle | breath | blink | push | push2"""
    b = B(24, 38, 4, 8); X, R = b.X, b.R
    Y = -1 if pose == 'breath' else 0
    # boots + jeans
    for lx in (3, 9):
        R(lx, 25, 4, 3, Q['boot']); X(lx, 25, Q['bootL']); R(lx, 28, 4, 1, Q['bootS'])
        R(lx, 19, 4, 6, Q['jean']); X(lx, 20, Q['jeanL']); X(lx + 3, 22, Q['jeanS'])
    R(3, 18 + Y, 10, 2, Q['jean']); X(8, 19, Q['jeanS'])
    R(3, 18 + Y, 10, 1, C('#5a3a22'))                                            # belt
    X(7, 18 + Y, C('#c9b24a')); X(8, 18 + Y, C('#c9b24a'))                       # buckle
    # black sleeveless shirt: covers the shoulders (cut-off sleeves), arms bare
    for y in range(10, 18):
        a, z = (1, 14) if y <= 11 else (3, 12)
        R(a, y + Y, z - a + 1, 1, Q['shirt']); X(z, y + Y, Q['shirtS'])
    X(1, 12 + Y, Q['shirtS']); X(14, 12 + Y, Q['shirtS'])                        # frayed cut edge
    R(5, 10 + Y, 6, 1, Q['shirtL']); R(6, 10 + Y, 4, 1, Q['skin'])               # crew neck
    for (x, y) in ((6, 13), (9, 15)): X(x, y + Y, Q['shirtL'])
    # arms (bare, a bit muscular)
    R(0, 12 + Y, 2, 6, Q['skin']); X(0, 13 + Y, Q['skinL']); X(1, 15 + Y, Q['skinS']); R(0, 18 + Y, 2, 2, Q['skinS'])
    if pose in ('push', 'push2'):
        R(14, 12 + Y, 2, 3, Q['skin']); X(15, 13 + Y, Q['skinS'])                 # upper arm
        R(12, 9 + Y, 2, 3, Q['skin'])                                          # forearm up to the face
        if pose == 'push2': X(8, 4 + Y, Q['skin']); X(9, 5 + Y, Q['skin']); X(10, 6 + Y, Q['skin']); X(11, 7 + Y, Q['skin'])
        else: X(11, 8 + Y, Q['skin']); X(12, 8 + Y, Q['skin'])
    else:
        R(14, 12 + Y, 2, 6, Q['skin']); X(15, 13 + Y, Q['skinS']); X(14, 15 + Y, Q['skinL']); R(14, 18 + Y, 2, 2, Q['skinS'])
    # head: square jaw, 10 wide
    rows = [(4, 11), (3, 12), (3, 12), (3, 12), (3, 12), (3, 12), (3, 12), (3, 12), (3, 12), (4, 11)]
    gy = -1 if pose == 'push2' else 0                                            # glasses nudged up
    for y, (a, z) in enumerate(rows): R(a, y + Y, z - a + 1, 1, Q['skin'])
    for y in range(1, 9): X(12, y + Y, Q['skinS'])
    X(3, 8 + Y, Q['skinS']); X(12, 8 + Y, Q['skinS']); R(4, 9 + Y, 8, 1, Q['skinS'])    # jaw line
    X(2, 5 + Y, Q['skin']); X(13, 5 + Y, Q['skinS'])                              # ears
    # hair: short sides, small curly front
    R(3, -2 + Y, 10, 2, Q['hair']); R(2, -1 + Y, 1, 4, Q['hair']); R(13, -1 + Y, 1, 4, Q['hair'])
    # one big curl falling on the forehead (a 'C' loop) + a smaller one
    for (x, y) in ((6, 0), (5, 1), (5, 2), (6, 3), (7, 3), (7, 0)): X(x, y + Y, Q['hair'])
    X(6, 1 + Y, Q['skin']); X(6, 2 + Y, Q['skin'])                              # forehead showing inside the curl
    for (x, y) in ((9, 0), (10, 1), (9, 1)): X(x, y + Y, Q['hair'])
    for (x, y) in ((5, -1), (8, -2), (10, -1), (7, 0)): X(x, y + Y, Q['hairL'])
    # big oval glasses
    for x0 in (3, 8):
        for (x, y) in ((1, 0), (2, 0), (3, 0), (0, 1), (4, 1), (0, 2), (4, 2), (1, 3), (2, 3), (3, 3)): X(x0 + x, 3 + y + Y + gy, Q['frame'])
        R(x0 + 1, 4 + Y + gy, 3, 2, Q['lens']); X(x0 + 1, 4 + Y + gy, Q['lensL'])
    X(7, 4 + Y + gy, Q['frame'])                                                   # bridge (frames share x=7/8 edge)
    # eyes (inside the lenses)
    if pose == 'blink': R(5, 5 + Y + gy, 2, 1, Q['eye']); R(9, 5 + Y + gy, 2, 1, Q['eye'])
    else: X(5, 5 + Y + gy, Q['eye']); X(10, 5 + Y + gy, Q['eye'])
    # brows, nose, mouth
    X(7, 7 + Y, Q['skinS']); R(6, 8 + Y, 4, 1, Q['mouth']) if pose != 'push2' else (R(6, 8 + Y, 3, 1, Q['mouth']), X(9, 7 + Y, Q['mouth']))
    b.outline()
    return b.im

def main():
    poses = ['idle', 'breath', 'blink', 'push', 'push2']; S = {p: seller(p) for p in poses}
    sh = Image.new('RGBA', (len(poses) * 28 + 30, 42), C('#d9c49a'))
    for i, p in enumerate(poses): sh.alpha_composite(S[p], (i * 28 + 2, 2))
    sh.alpha_composite(jao('idle'), (len(poses) * 28 + 4, 2))                     # Jao for height
    sh.resize((sh.width * 8, sh.height * 8), Image.NEAREST).save(os.path.join(OUT, 'seller_frames.png'))
    tl = ['idle'] * 8 + ['breath'] * 6 + ['idle'] * 4 + ['blink'] * 2 + ['idle'] * 8 + ['breath'] * 6 + ['push'] * 2 + ['push2'] * 5 + ['push'] * 2 + ['idle'] * 6 + ['blink'] * 2 + ['idle'] * 4
    J = ['idle'] * 10 + ['breath'] * 10
    frames = []
    for t, p in enumerate(tl):
        im = Image.new('RGBA', (64, 48), C('#d9c49a')); d = ImageDraw.Draw(im)
        for x, sp in ((6, S[p]), (34, jao(J[t % len(J)]))):
            d.ellipse([x + 4, 44, x + 20, 47], fill=(150, 125, 85, 255)); im.alpha_composite(sp, (x, 46 - 37))
        frames.append(im.resize((64 * 7, 48 * 7), Image.NEAREST).convert('RGB'))
    frames[0].save(os.path.join(OUT, 'seller_loop.gif'), save_all=True, append_images=frames[1:], duration=120, loop=0)
    print('ok', len(frames))

if __name__ == '__main__':
    main()
