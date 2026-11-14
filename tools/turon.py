"""Turon: Bins' dog (husky x golden retriever), from the user's photo. Picture only.
Sits beside Bins' animal shop. Idle only (no interaction): breathing, blinking, a small tail wag.
Look: gray husky saddle and head cap, white blaze down the face, white chest/legs/paws, tan cheeks/brows/ears,
floppy ears (his right ear flips up), brown eyes, black nose, red collar with a silver ring.
Output: assets/characters/turon/turon_frames.png (and used in bins.py's loop)."""
import os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from farmer import B, C

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'turon')
os.makedirs(OUT, exist_ok=True)
T = dict(g=C('#666a72'), gD=C('#45484f'), gL=C('#82868e'), w=C('#f4f0e8'), wS=C('#d8d2c6'),
         t=C('#c99a62'), tL=C('#e2bd88'), tD=C('#9c7040'), nose=C('#1c1a1c'), eye=C('#5a3216'), eyeL=C('#e8c27a'),
         col=C('#b02a2a'), colD=C('#7e1c1c'), ring=C('#c4cad2'))

def turon(pose):
    """pose: idle | breath | blink | wag"""
    b = B(22, 24, 2, 2); X, R = b.X, b.R
    Y = -1 if pose == 'breath' else 0
    # tail (curled around his right side), wag shifts it
    tx = 1 if pose == 'wag' else 0
    for (x, y) in ((15, 16), (16, 15), (17, 14), (17, 13), (16, 12)): X(x + tx, y, T['g'])
    X(16 + tx, 16, T['g']); X(17 + tx, 15, T['gL']); X(16 + tx, 11, T['w']); X(17 + tx, 12, T['w'])
    # haunches (gray, sitting)
    R(3, 15, 13, 5, T['g']); R(3, 15, 1, 5, T['gL']); R(14, 16, 2, 4, T['gD'])
    # front legs + paws (white)
    for lx in (6, 10):
        R(lx, 14, 3, 6, T['w']); X(lx + 2, 15, T['wS']); X(lx + 2, 17, T['wS'])
        R(lx - 0, 20, 3, 1, T['w']); X(lx + 1, 20, T['wS'])
    # chest (white) with gray sides
    R(5, 10 + Y, 9, 6, T['w']); R(4, 10 + Y, 1, 6, T['g']); R(14, 10 + Y, 1, 6, T['gD'])
    X(5, 11 + Y, T['g']); X(13, 11 + Y, T['gD']); X(9, 13 + Y, T['wS'])
    # collar
    R(5, 10 + Y, 9, 1, T['col']); X(13, 10 + Y, T['colD']); X(9, 11 + Y, T['ring'])
    # head
    H = Y
    for y, (a, z) in enumerate([(6, 13), (5, 14), (5, 14), (5, 14), (5, 14), (5, 14), (6, 13), (7, 12)]):
        R(a, 2 + y + H, z - a + 1, 1, T['g'])
    # white blaze down the middle + white lower face
    R(9, 2 + H, 2, 3, T['w']); R(8, 5 + H, 4, 1, T['w']); R(7, 6 + H, 6, 3, T['w']); R(8, 9 + H, 4, 1, T['w'])
    # tan cheeks, tan brow dots
    X(6, 6 + H, T['t']); X(13, 6 + H, T['t']); X(6, 7 + H, T['tL']); X(13, 7 + H, T['tD'])
    X(7, 4 + H, T['tL']); X(12, 4 + H, T['tL'])
    # eyes
    if pose == 'blink': R(7, 5 + H, 2, 1, T['gD']); R(11, 5 + H, 2, 1, T['gD'])
    else:
        X(7, 5 + H, T['eye']); X(8, 5 + H, T['eye']); X(11, 5 + H, T['eye']); X(12, 5 + H, T['eye'])
        X(7, 5 + H, T['eyeL']); X(11, 5 + H, T['eyeL'])
    # nose + mouth
    R(9, 7 + H, 2, 1, T['nose']); X(9, 8 + H, T['wS']); X(10, 8 + H, T['wS'])
    # ears: left (viewer's) flops down, right flips up and out
    for (x, y) in ((4, 3), (3, 4), (3, 5), (4, 5), (4, 6), (3, 6)): X(x, y + H, T['t'])
    X(4, 4 + H, T['tD']); X(5, 3 + H, T['tD'])
    for (x, y) in ((14, 2), (15, 1), (16, 1), (16, 2), (15, 2), (17, 2), (15, 3)): X(x, y + H, T['t'])
    X(16, 2 + H, T['tL']); X(14, 3 + H, T['tD'])
    b.outline()
    return b.im

if __name__ == '__main__':
    poses = ['idle', 'breath', 'blink', 'wag']
    sh = Image.new('RGBA', (len(poses) * 26, 26), C('#d9c49a'))
    for i, p in enumerate(poses): sh.alpha_composite(turon(p), (i * 26 + 2, 1))
    sh.resize((sh.width * 10, sh.height * 10), Image.NEAREST).save(os.path.join(OUT, 'turon_frames.png'))
    print('ok')
