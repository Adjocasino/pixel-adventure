"""Adjo carrying the bilao overhead (for the Fruit Catch demo).
carry_side: the sprint run (from farmer_run.py) with both arms raised holding the bilao.
carry_front: standing idle with both arms raised. Exports a sheet + hand anchors."""
import math,sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from farmer import P,B,C,farmer
from farmer_run import line,head_side,SWEAT,SWEATH,SPEED,DUST
from PIL import Image
def carry_side(f,N=6):
    b=B(38,46,12,10);X,R=b.X,b.R
    t=f/N;ph=2*math.pi*t
    air=abs(math.sin(ph))>.7
    bob=-3-round(2*abs(math.sin(ph)))
    hip=(5,20+bob);lean=1
    sh=(hip[0]+lean,13+bob)
    L1,L2=7,6
    def leg(tt,col,colS,far):
        p=2*math.pi*tt
        c=math.cos(p)
        th=math.radians(30+95*c)                          # knee driven up in front of the chest (~125°) / thigh swung back (-65°)
        kb=math.radians(102+8*c)                          # shin hangs under the raised knee; back heel kicks up to the butt
        kx,ky=hip[0]+L1*math.sin(th),hip[1]+L1*math.cos(th)
        a2=th-kb;fx_,fy_=kx+L2*math.sin(a2),ky+L2*math.cos(a2)
        line(b,hip[0],hip[1],kx,ky,colS if far else col,3)
        line(b,kx,ky,fx_,fy_,colS if far else col,2)
        if not far:
            # dark crease line so the raised leg separates from the body
            n=8
            for i in range(1,n):
                u=i/n;b.X(int(round(hip[0]+(kx-hip[0])*u)),int(round(hip[1]+(ky-hip[1])*u))+2,P['ovD'])
        bx,by=int(round(fx_)),int(round(fy_))
        R(bx-1,by,4,2,P['bootS'] if far else P['boot']);X(bx+2,by,P['bootL'] if not far else P['bootS'])
        return fx_,fy_
    HANDS=[]
    def arm(far):
        if far: e,h=(13,13+bob),(15,-4+bob)
        else:   e,h=(15,14+bob),(18,-4+bob)
        s0=(sh[0]-1,sh[1]+1) if far else (sh[0]+1,sh[1]+1)
        line(b,s0[0],s0[1],e[0],e[1],P['shirtS'] if far else P['shirt'],2)
        line(b,e[0],e[1],h[0],h[1],P['skinS'] if far else P['skin'],2)
        HANDS.append(h)
    # far side first
    arm(True);leg(t+.5,P['ovD'],P['ovD'],True)
    # torso leaning forward (overalls over brown shirt)
    for y in range(12,22):
        off=round((21-y)*lean/9);yy=y+bob
        for x in range(4,10):
            c=P['shirt'] if y<15 else P['ov']
            if y>=15 and x==4:c=P['ovL']
            if y<15 and x==9:c=P['shirtS']
            X(x+off,yy,c)
        if 15<=y<=17:X(8+off,yy,P['ov'] if y>15 else P['btn'])
    R(5+1,18+bob,3,2,P['ovS']);X(6,18+bob,P['stitch']);X(7,18+bob,P['stitch'])
    foot=leg(t,P['ovL'],P['ovS'],False)
    head_side(b,lean-1,bob,f,air)
    arm(False)
    b.outline()
    # sweat drops flying back off the head
    for k in range(3):
        u=((f+k*2)%N)/N
        x=int(round(lean+2-u*9-k));y=int(round(4+bob+u*5+k-(1-u)*2))
        X(x,y,SWEAT);X(x,y-1,SWEATH if k==0 else SWEAT)
    X(lean+12,4+bob,SWEAT);X(lean+12,3+bob,SWEATH)
    # speed lines + dust at contact
    for k,(yy,ln) in enumerate(((11,5),(16,7),(21,4))):
        sx=-3-((f+k)%3)
        for i in range(ln):X(sx-i,yy+bob,SPEED)
    if abs(math.cos(2*math.pi*t))>.8:
        for i,(dx,dy) in enumerate(((-3,27),(-5,26),(-2,26),(-6,27))):X(dx,dy,DUST)
    hx=(HANDS[0][0]+HANDS[1][0])/2+b.ox;hy=min(HANDS[0][1],HANDS[1][1])+b.oy
    return b.im,(hx,hy)

def carry_front(breath=0):
    base=farmer('down',0)
    im=Image.new('RGBA',(26,36));im.alpha_composite(base,(2,0));px=im.load()
    for y in range(17,27):
        for x in list(range(4,9))+list(range(17,22)):px[x,y]=(0,0,0,0)
    b=B(26,36,0,0);b.im=im;b.p=im.load()
    dy=breath
    for sx,ex,hx,col,colS in((7,4,3,P['shirt'],P['skin']),(18,21,22,P['shirtS'],P['skinS'])):
        line(b,sx,18,ex,14,col,2);line(b,ex,14,hx,1+dy,colS,2)
    # re-outline just the arms
    out=[]
    for y in range(36):
        for x in range(26):
            if px[x,y][3]:continue
            for a,c in((0,1),(0,-1),(1,0),(-1,0)):
                X,Y=x+a,y+c
                if 0<=X<26 and 0<=Y<36 and px[X,Y][3]>128 and (X<7 or X>18) and Y<19:
                    k=px[X,Y];out.append((x,y,(int(k[0]*.32),int(k[1]*.32),int(k[2]*.37)+6,255)));break
    for x,y,c in out:px[x,y]=c
    return im,(13,1+dy)
def feet(im):
    a=im.split()[3];bb=a.getbbox();return bb[3]
if __name__=='__main__':
    O=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','assets','characters','farmer')
    frames=[carry_side(f) for f in range(6)]+[carry_front(0),carry_front(1)]
    W=sum(im.width for im,_ in frames);H=max(im.height for im,_ in frames)
    sheet=Image.new('RGBA',(W,H));meta=[];x=0
    for im,(hx,hy) in frames:
        sheet.alpha_composite(im,(x,0));gy=feet(im) if im.width==26 else 43
        meta.append(dict(x=x,w=im.width,h=im.height,ground=gy,hx=round(hx,1),hy=hy));x+=im.width
    sheet.save(os.path.join(O,'adjo_bilao_sheet.png'))
    json.dump(meta,open(os.path.join(O,'adjo_bilao_sheet.json'),'w'))
    sheet.resize((W*6,H*6),Image.NEAREST).save('/tmp/cmp/bilao_big.png')
    print(meta)
