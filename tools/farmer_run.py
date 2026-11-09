import math,sys
sys.path.insert(0,__import__('os').path.dirname(__file__))
from farmer import P,B,C
from PIL import Image
SWEAT=C('#8fd3f5');SWEATH=C('#ffffff');SPEED=(235,248,240,255);DUST=C('#d9c79a')
def line(b,x0,y0,x1,y1,c,w=2):
    n=int(max(abs(x1-x0),abs(y1-y0))*2)+1
    for i in range(n+1):
        t=i/n;x=x0+(x1-x0)*t;y=y0+(y1-y0)*t
        for dx in range(w):
            for dy in range(w):b.X(int(round(x-.5))+dx,int(round(y-.5))+dy,c)
def head_side(b,hx,hy,f,air):
    X,R=b.X,b.R
    for i,(a,z) in enumerate([(5,10),(4,11),(3,12),(3,12),(3,12),(3,12),(3,12),(4,11),(5,10)]):
        for x in range(a,z+1):X(x+hx,2+i+hy,P['skinS'] if x>10 else P['skin'])
    for x in range(4,12):X(x+hx,3+hy,P['hair']);X(x+hx,4+hy,P['hair'])
    for y in range(5,10):
        for x in range(3,7):X(x+hx,y+hy,P['hair'])
    for x in(9,11,12):X(x+hx,5+hy,P['hair'])
    X(6+hx,6+hy,P['skinS']);X(6+hx,7+hy,P['skinS']);X(5+hx,6+hy,P['skin']);X(5+hx,7+hy,P['skinS'])
    R(10+hx,6+hy,2,1,P['frameD']);X(9+hx,7+hy,P['frame']);X(12+hx,7+hy,P['frame']);X(9+hx,8+hy,P['frame']);X(12+hx,8+hy,P['frame'])
    X(11+hx,7+hy,P['lens']);X(11+hx,8+hy,P['lens']);X(7+hx,7+hy,P['frameD']);X(8+hx,7+hy,P['frameD'])
    X(10+hx,7+hy,P['eye']);X(10+hx,8+hy,P['eye'])
    # strained brow + gritted teeth
    X(10+hx,5+hy,P['hair']);X(11+hx,5+hy,P['hair']);X(12+hx,6+hy,P['hair'])
    TD=C('#3a2226');TW=C('#f6f2ea')
    X(9+hx,9+hy,TD);X(10+hx,9+hy,TD);X(11+hx,9+hy,TD);X(12+hx,9+hy,TD)
    X(10+hx,10+hy,TW);X(11+hx,10+hy,TD);X(12+hx,10+hy,TW);X(9+hx,10+hy,TD)
    # hat lifts off on airborne frames
    hy2=hy-(1 if air else 0)
    for y,a,z in((-2,5,10),(-1,4,11),(0,4,11)):
        for x in range(a,z+1):X(x+hx,y+hy2,P['hatL'] if x<6 else P['hatS'] if x>9 else P['hat'])
    for x in range(4,12):X(x+hx,1+hy2,P['bandL'] if x<6 else P['band'])
    for x in range(-1,17):X(x+hx,2+hy2+(1 if (air and x<2) else 0),P['hatL'] if x<3 else P['hatS'] if x>13 else P['hat'])
    for x in range(-2,18):X(x+hx,3+hy2+(1 if (air and x<2) else 0),P['hatS'])
def run_side(f,N=6,fx=True):
    b=B(34,40,9,8);X,R=b.X,b.R
    t=f/N;ph=2*math.pi*t
    air=abs(math.sin(ph))>.7
    bob=-round(1.5*abs(math.sin(ph)))
    hip=(7,20+bob);lean=3
    sh=(hip[0]+lean,13+bob)
    L1,L2=4.5,4.5
    def leg(tt,col,colS,far):
        p=2*math.pi*tt
        th=math.radians(15+80*math.cos(p))                 # thigh: up to ~95° forward (very high knee)
        kb=math.radians(20+110*max(0,math.sin(p))+40*max(0,math.cos(p)))  # tucked shin under the raised knee
        kx,ky=hip[0]+L1*math.sin(th),hip[1]+L1*math.cos(th)
        a2=th-kb;fx_,fy_=kx+L2*math.sin(a2),ky+L2*math.cos(a2)
        line(b,hip[0],hip[1],kx,ky,colS if far else col,3)
        line(b,kx,ky,fx_,fy_,colS if far else col,2)
        bx,by=int(round(fx_)),int(round(fy_))
        R(bx-1,by,4,2,P['bootS'] if far else P['boot']);X(bx+2,by,P['bootL'] if not far else P['bootS'])
        return fx_,fy_
    def arm(tt,col,far):
        p=2*math.pi*tt
        a=math.radians(-60*math.cos(p))                    # pumping, opposite the leg
        ex,ey=sh[0]+3.5*math.sin(a),sh[1]+1+3.5*math.cos(a)
        a2=a+math.radians(100) if math.cos(a)>0 else a+math.radians(100)
        hx,hy=ex+3*math.sin(a2)*(-1),ey-3*abs(math.cos(a2))
        hx,hy=ex+3*math.sin(a+math.radians(90))*(-1 if a<0 else 1)*0+3*math.cos(a)*(1 if a>0 else -0.2), ey-2.5
        line(b,sh[0],sh[1]+1,ex,ey,P['shirtS'] if far else P['shirt'],2)
        line(b,ex,ey,hx,hy,P['skinS'] if far else P['skin'],2)
    # far side first
    arm(t,None,True);leg(t+.5,P['ovS'],P['ovD'],True)
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
    foot=leg(t,P['ov'],P['ovS'],False)
    arm(t+.5,None,False)
    head_side(b,lean-1,bob,f,air)
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
    return b.im
def run_front(d,f):
    b=B(24,38,4,8);X,R=b.X,b.R
    up=(d=='up');Y=-1 if f%2 else 0
    knee=[1,0,2,0][f]   # 1: left knee up, 2: right knee up
    for lx,side in((4,1),(9,2)):
        if knee==side:
            R(lx,17+Y,3,2,P['ovL']);R(lx,19+Y,3,1,P['ov']);R(lx,20+Y,3,2,P['boot']);R(lx,21+Y,3,1,P['bootS'])
        else:
            R(lx,20,3,5,P['ov']);R(lx,20,1,5,P['ovL']);R(lx,25,3,1,P['ovL']);R(lx,26,3,3,P['boot']);R(lx,28,3,1,P['bootS'])
    R(4,12+Y,8,6,P['shirt']);R(4,18+Y,8,3,P['ov']);R(4,18+Y,1,3,P['ovL'])
    if not up:
        R(5,14+Y,6,4,P['ov']);R(6,15+Y,4,2,P['ovS']);X(5,14+Y,P['btn']);X(10,14+Y,P['btn']);X(5,12+Y,P['ov']);X(5,13+Y,P['ov']);X(10,12+Y,P['ovS']);X(10,13+Y,P['ovS'])
        for px in(4,10):R(px,18+Y,2,2,P['ovS']);X(px,18+Y,P['stitch']);X(px+1,18+Y,P['stitch'])
    else:
        for i in range(5):X(5+i,13+i+Y,P['ov']);X(10-i,13+i+Y,P['ovS'])
    # pumping arms: one fist up by the chest, one swung low
    for ax,hi in((2,knee==2),(12,knee==1)):
        R(ax,12+Y,2,2,P['shirt'])
        if hi:R(ax+(1 if ax<5 else -1),14+Y,2,1,P['skin']);R(ax+(1 if ax<5 else -1),13+Y,2,1,P['skin'])
        else:R(ax,14+Y,2,4,P['skin']);X(ax,17+Y,P['skinS'])
    R(6,11+Y,4,1,P['skinS'])
    for i,(a,z) in enumerate([(5,10),(4,11),(3,12),(3,12),(3,12),(3,12),(3,12),(4,11),(5,10)]):
        for x in range(a,z+1):X(x,2+i+Y,P['skinS'] if x>10 else P['skin'])
    if not up:
        for x in range(4,12):X(x,3+Y,P['hair']);X(x,4+Y,P['hair'])
        for x in(4,5,7,8,10,11):X(x,5+Y,P['hair'])
        for y in(5,6):X(3,y+Y,P['hair']);X(12,y+Y,P['hair'])
        X(2,6+Y,P['skin']);X(2,7+Y,P['skinS']);X(13,6+Y,P['skinS']);X(13,7+Y,P['skinS'])
        for x0 in(3,9):
            R(x0+1,6+Y,2,1,P['frameD']);X(x0,7+Y,P['frame']);X(x0+3,7+Y,P['frame']);X(x0,8+Y,P['frame']);X(x0+3,8+Y,P['frame'])
            X(x0+1,7+Y,P['lens']);X(x0+2,7+Y,P['lens']);X(x0+1,8+Y,P['lens']);X(x0+2,8+Y,P['lens'])
        X(7,7+Y,P['frameD']);X(8,7+Y,P['frameD']);X(5,7+Y,P['eye']);X(5,8+Y,P['eye']);X(10,7+Y,P['eye']);X(10,8+Y,P['eye'])
        TD=C('#3a2226');TW=C('#f6f2ea')
        for x in range(6,10):X(x,9+Y,TD);X(x,10+Y,TW)
        X(5,10+Y,TD);X(10,10+Y,TD);X(8,10+Y,TD)
    else:
        for y in range(3,11):
            for x in range(3,13):X(x,y+Y,P['hair'])
        X(2,6+Y,P['skinS']);X(13,6+Y,P['skinS'])
    hl=-1 if f%2 else 0
    for y,a,z in((-2,5,10),(-1,4,11),(0,4,11)):
        for x in range(a,z+1):X(x,y+Y+hl,P['hatL'] if x<6 else P['hatS'] if x>9 else P['hat'])
    for x in range(4,12):X(x,1+Y+hl,P['band'])
    for x in range(-1,17):X(x,2+Y+hl,P['hat'])
    for x in range(-2,18):X(x,3+Y+hl,P['hatS'])
    b.outline()
    # sweat flying off both sides
    for k,s in enumerate((-1,1)):
        u=((f+k*2)%4)/4;x=int(7.5+s*(7+u*4));y=int(5+u*3+Y)
        X(x,y,SWEAT);X(x,y-1,SWEATH)
    return b.im
if __name__=='__main__':
    O='/home/claude/tests/farmer/';S=7;bg=(95,172,114,255)
    side=[run_side(f) for f in range(6)];left=[i.transpose(Image.FLIP_LEFT_RIGHT) for i in side]
    down=[run_front('down',f) for f in range(4)];up=[run_front('up',f) for f in range(4)]
    sheet=Image.new('RGBA',(6*34*S+80,3*40*S+40),bg)
    for c,im in enumerate(side):sheet.alpha_composite(im.resize((34*S,40*S),Image.NEAREST),(10+c*(34*S+10),10))
    for r,row in enumerate((down,up)):
        for c,im in enumerate(row):sheet.alpha_composite(im.resize((24*S,38*S),Image.NEAREST),(10+c*(34*S+10),20+40*S+r*(40*S+10)))
    sheet.convert('RGB').save(O+'farmer_run_frames.png')
    # gif: run across the screen right, then left, then toward camera, then away
    W,H=150,48;frames=[]
    def scene(sprite,x,y):
        im=Image.new('RGBA',(W,H),bg)
        for i in range(W):im.putpixel((i,H-6),(70,140,95,255))
        im.alpha_composite(sprite,(int(x),int(y)));return im
    for k in range(24):frames.append(scene(side[k%6],-34+k*7,H-6-35))
    for k in range(24):frames.append(scene(left[k%6],W-k*7,H-6-35))
    for k in range(12):frames.append(scene(down[k%4],63,H-6-33))
    for k in range(12):frames.append(scene(up[k%4],63,H-6-33))
    big=[f.resize((W*5,H*5),Image.NEAREST) for f in frames]
    big[0].save(O+'farmer_run.png',save_all=True,append_images=big[1:],duration=65,loop=0)
    pf=[f.convert('P',palette=Image.ADAPTIVE) for f in big];pf[0].save(O+'farmer_run.gif',save_all=True,append_images=pf[1:],duration=65,loop=0,disposal=2)
    sh=Image.new('RGBA',(34*6,40+38*2))
    for c,im in enumerate(side):sh.alpha_composite(im,(c*34,0))
    for r,row in enumerate((down,up)):
        for c,im in enumerate(row):sh.alpha_composite(im,(c*34,40+r*38))
    sh.save(O+'farmer_run_sheet.png')
