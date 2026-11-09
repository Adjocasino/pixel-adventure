from PIL import Image
def C(h):return (int(h[1:3],16),int(h[3:5],16),int(h[5:7],16),255)
P=dict(skin=C('#eec6a0'),skinS=C('#d8a982'),hair=C('#2b1e19'),hairL=C('#4a3529'),
 hat=C('#d2ad62'),hatL=C('#e6c67e'),hatS=C('#a98443'),hatD=C('#8a6a35'),band=C('#a8382e'),bandL=C('#c9493c'),
 frame=C('#7a7387'),frameD=C('#5c5568'),stitch=C('#8cc46c'),lens=C('#dcebf5'),eye=C('#2a1d22'),
 shirt=C('#7a5236'),shirtS=C('#5e3e28'),shirtL=C('#946645'),
 ov=C('#4f8a3c'),ovS=C('#3d6e2f'),ovL=C('#6aa84f'),ovD=C('#2f5824'),btn=C('#c9ccd4'),
 boot=C('#6b4226'),bootS=C('#4e2f1a'),bootL=C('#8a5a36'))
class B:
    def __init__(s,w,h,ox,oy):s.w,s.h,s.ox,s.oy=w,h,ox,oy;s.im=Image.new('RGBA',(w,h),(0,0,0,0));s.p=s.im.load()
    def X(s,x,y,c):
        x,y=x+s.ox,y+s.oy
        if 0<=x<s.w and 0<=y<s.h:s.p[x,y]=c
    def R(s,x,y,w,h,c):
        for j in range(h):
            for i in range(w):s.X(x+i,y+j,c)
    def outline(s,k=.32):
        add=[]
        for y in range(s.h):
            for x in range(s.w):
                if s.p[x,y][3]:continue
                for a,b in((0,1),(0,-1),(1,0),(-1,0)):
                    X,Y=x+a,y+b
                    if 0<=X<s.w and 0<=Y<s.h and s.p[X,Y][3]>128:
                        c=s.p[X,Y];add.append((x,y,(int(c[0]*k),int(c[1]*k),min(255,int(c[2]*k*1.15+6)),255)));break
        for x,y,c in add:s.p[x,y]=c
def farmer(d,f,o={}):
    b=B(22,36,3,6);X,R=b.X,b.R  # feet bottom y28 -> row 34, outline row 35
    lift=1 if f==1 else 2 if f==3 else 0;Y=-1 if f%2 else 0
    # legs + boots (thin)
    if d!='side':
        for lx,up in((4,1 if lift==1 else 0),(9,1 if lift==2 else 0)):
            R(lx,22-up,3,4,P['ov']);R(lx,22-up,1,4,P['ovL']);R(lx,25-up,3,1,P['ovS'])
            R(lx,25-up,3,1,P['ovL']);R(lx,26-up,3,3,P['boot']);X(lx,26-up,P['bootL']);R(lx,28-up,3,1,P['bootS'])
    else:
        if f%2:
            for lx,dy in((3,0),(9,-1)):R(lx,22,3,4,P['ov']);R(lx,25,3,1,P['ovS']);R(lx-1+(lx>5)*2-1,26+dy,4,3,P['boot']);R(lx-1+(lx>5)*2-1,28+dy,4,1,P['bootS'])
        else:R(6,22,4,4,P['ov']);R(6,25,4,1,P['ovS']);R(6,26,5,3,P['boot']);X(6,26,P['bootL']);R(6,28,5,1,P['bootS'])
    # overalls pants/hips
    R(4,18+Y,8,4,P['ov']);R(4,18+Y,1,4,P['ovL']);R(10,18+Y,2,4,P['ovS'])
    if d!='side':X(7,21+Y,P['ovD']);X(8,21+Y,P['ovD'])
    # shirt torso (thin)
    R(4,12+Y,8,6,P['shirt']);R(4,12+Y,1,6,P['shirtL']);R(11,12+Y,1,6,P['shirtS'])
    if d=='down':
        # bib + pocket + straps + buttons
        R(5,14+Y,6,4,P['ov']);R(5,14+Y,1,4,P['ovL']);R(6,15+Y,4,2,P['ovS']);R(7,15+Y,2,1,P['ov'])
        X(5,12+Y,P['ov']);X(5,13+Y,P['ov']);X(10,12+Y,P['ovS']);X(10,13+Y,P['ovS']);X(5,14+Y,P['btn']);X(10,14+Y,P['btn'])
        X(7,12+Y,P['shirtS']);X(8,12+Y,P['shirtS'])
    elif d=='up':
        for i in range(5):X(5+i,13+i+Y,P['ov']);X(10-i,13+i+Y,P['ovS'])
    else:
        R(8,14+Y,3,4,P['ov']);X(8,14+Y,P['ovL']);X(9,12+Y,P['ov']);X(9,13+Y,P['ov']);X(9,14+Y,P['btn'])
    # outfit details: side pockets with stitching, center seam, rolled cuffs, collar
    if d=='down':
        for px in(4,10):R(px,18+Y,2,2,P['ovS']);X(px,18+Y,P['stitch']);X(px+1,18+Y,P['stitch'])
        X(7,20+Y,P['ovS']);X(8,20+Y,P['ovS'])
        X(6,12+Y,P['shirtL']);X(9,12+Y,P['shirtL'])
        X(7,15+Y,P['stitch']);X(8,15+Y,P['stitch'])
    elif d=='up':
        for px in(5,9):R(px,19+Y,2,2,P['ovS']);X(px,19+Y,P['stitch']);X(px+1,19+Y,P['stitch'])
    else:
        R(5,18+Y,3,2,P['ovS']);X(5,18+Y,P['stitch']);X(6,18+Y,P['stitch']);X(7,18+Y,P['stitch'])
    # arms: short brown sleeves, thin skin forearms
    if d=='side':
        sw=[0,1,0,-1][f];R(6,12+Y,3,3,P['shirtS']);R(7+sw,15+Y,2,4,P['skin']);X(7+sw,18+Y,P['skinS'])
    else:
        R(2,12+Y,2,3,P['shirt']);R(12,12+Y,2,3,P['shirtS']);R(2,14+Y,2,1,P['shirtL']);R(12,14+Y,2,1,P['shirt'])
        R(2,15+Y,2,4,P['skin']);R(12,15+Y,2,4,P['skinS'])
    # neck + head
    R(6,11+Y,4,1,P['skinS'])
    for i,(a,z) in enumerate([(5,10),(4,11),(3,12),(3,12),(3,12),(3,12),(3,12),(4,11),(5,10)]):
        for x in range(a,z+1):X(x,2+i+Y,P['skinS'] if x>10 else P['skin'])
    H=lambda x,y,c=P['hair']:X(x,y+Y,c)
    if d=='down':
        for x in range(4,12):H(x,3);H(x,4)
        for x in(4,5,7,8,10,11):H(x,5)          # short noticeable bangs
        H(6,4,P['hairL']);H(9,4,P['hairL'])
        for y in(5,6):H(3,y);H(12,y)            # sideburns
        X(2,6+Y,P['skin']);X(2,7+Y,P['skinS']);X(13,6+Y,P['skinS']);X(13,7+Y,P['skinS'])   # ears stick out
        # square professor glasses, no mouth
        for x0 in(3,9):
            R(x0+1,6+Y,2,1,P['frameD']);X(x0,7+Y,P['frame']);X(x0+3,7+Y,P['frame']);X(x0,8+Y,P['frame']);X(x0+3,8+Y,P['frame'])
            X(x0+1,7+Y,P['lens']);X(x0+2,7+Y,P['lens']);X(x0+1,8+Y,P['lens']);X(x0+2,8+Y,P['lens'])
        X(7,7+Y,P['frameD']);X(8,7+Y,P['frameD'])
        if o.get('blink'):X(5,8+Y,P['skinS']);X(10,8+Y,P['skinS'])
        else:X(5,7+Y,P['eye']);X(5,8+Y,P['eye']);X(10,7+Y,P['eye']);X(10,8+Y,P['eye'])
    elif d=='up':
        for y in range(3,11):
            for x in range(3 if y<10 else 4,13 if y<10 else 12):H(x,y,P['hairL'] if (x+y)%5==0 else P['hair'])
        X(2,6+Y,P['skinS']);X(2,7+Y,P['skinS']);X(13,6+Y,P['skinS']);X(13,7+Y,P['skinS'])
    else:
        for x in range(4,12):H(x,3);H(x,4)
        for y in range(5,10):
            for x in range(3,7):H(x,y)
        H(9,5);H(11,5);H(12,5);H(4,5,P['hairL'])
        X(6,6+Y,P['skinS']);X(6,7+Y,P['skinS']);X(5,6+Y,P['skin']);X(5,7+Y,P['skinS'])   # ear
        R(10,6+Y,2,1,P['frameD']);X(9,7+Y,P['frame']);X(12,7+Y,P['frame']);X(9,8+Y,P['frame']);X(12,8+Y,P['frame'])
        X(11,7+Y,P['lens']);X(11,8+Y,P['lens']);X(7,7+Y,P['frameD']);X(8,7+Y,P['frameD'])
        X(10,8+Y,P['skinS']) if o.get('blink') else (X(10,7+Y,P['eye']),X(10,8+Y,P['eye']))
    # straw hat with red band
    for y,a,z in((-2,5,10),(-1,4,11),(0,4,11)):
        for x in range(a,z+1):X(x,y+Y,P['hatL'] if x<6 else P['hatS'] if x>9 else P['hat'])
    for x in range(4,12):X(x,1+Y,P['bandL'] if x<6 else P['band'])
    for x in range(-1,17):X(x,2+Y,P['hatL'] if x<3 else P['hatS'] if x>13 else P['hat'])
    for x in range(-2,18):X(x,3+Y,P['hatD'] if x in(-2,17) else P['hatS'])
    for x in range(0,16,3):X(x+(f%2),2+Y,P['hatS'])   # straw weave texture
    if o.get('breath'):
        im=b.im;top=im.crop((0,0,22,6+18));b.im.paste((0,0,0,0),(0,0,22,1));b.im.alpha_composite(top,(0,1)) if False else None
    b.outline();return b.im
if __name__=='__main__':
    O='/home/claude/tests/farmer/';S=8;bg=(95,172,114,255)
    dirs=['down','right','up','left']
    fr={}
    for d in['down','up','side']:
        fr[d]=[farmer(d,f) for f in range(4)]+[farmer(d,0),farmer(d,0,{'blink':1})]
    fr['right']=fr.pop('side');fr['left']=[i.transpose(Image.FLIP_LEFT_RIGHT) for i in fr['right']]
    sheet=Image.new('RGBA',(6*22*S+70,4*36*S+50),bg)
    for r,d in enumerate(dirs):
        for c,im in enumerate(fr[d]):sheet.alpha_composite(im.resize((22*S,36*S),Image.NEAREST),(10+c*(22*S+10),10+r*(36*S+10)))
    sheet.convert('RGB').save(O+'farmer_frames.png')
    raw=Image.new('RGBA',(22*6,36*4))
    for r,d in enumerate(dirs):
        for c,im in enumerate(fr[d]):raw.alpha_composite(im,(c*22,r*36))
    raw.save(O+'farmer_sheet.png')
    # walk gif
    frames=[]
    for d in dirs:
        for k in range(8):
            im=Image.new('RGBA',(22,36),bg);im.alpha_composite(fr[d][k%4]);frames.append(im.resize((22*S,36*S),Image.NEAREST))
    for k in [4,4,4,5,4,4]:
        im=Image.new('RGBA',(22,36),bg);im.alpha_composite(fr['down'][k]);frames.append(im.resize((22*S,36*S),Image.NEAREST))
    pf=[f.convert('P',palette=Image.ADAPTIVE) for f in frames];pf[0].save(O+'farmer_walk.gif',save_all=True,append_images=pf[1:],duration=140,loop=0,disposal=2)
    # side by side with Inad (feet on the same ground line)
    inad=Image.open('/home/claude/tests/inad/down_idle0.png');me=fr['down'][4]
    cmp=Image.new('RGBA',(60,44),bg)
    for dx in range(-24,25):cmp.putpixel((30+dx,40),(70,140,95,255)) if abs(dx)<25 else None
    cmp.alpha_composite(inad,(6,40-inad.height+1));cmp.alpha_composite(me,(32,40-me.height+1))
    cmp.resize((60*8,44*8),Image.NEAREST).convert('RGB').save(O+'farmer_with_inad.png')
