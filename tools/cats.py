from PIL import Image
import math
OUT=(43,29,58,255)
def C(h):return (int(h[1:3],16),int(h[3:5],16),int(h[5:7],16),255)
class B:
    def __init__(s,w,h):s.w,s.h=w,h;s.im=Image.new('RGBA',(w,h),(0,0,0,0));s.p=s.im.load()
    def sp(s,x,y,c):
        x,y=int(round(x)),int(round(y))
        if 0<=x<s.w and 0<=y<s.h:s.p[x,y]=c
    def get(s,x,y):return s.p[x,y] if 0<=x<s.w and 0<=y<s.h else (0,0,0,0)
    def ell(s,cx,cy,rx,ry,fn):
        for y in range(s.h):
            for x in range(s.w):
                dx,dy=(x+.5-cx)/rx,(y+.5-cy)/ry
                if dx*dx+dy*dy<=1:
                    c=fn(x,y,dx,dy)
                    if c:s.p[x,y]=c
    def outline(s):
        add=[]
        for y in range(s.h):
            for x in range(s.w):
                if s.p[x,y][3]==0 and any(s.get(x+a,y+b)[3]>0 and s.get(x+a,y+b)!=OUT for a,b in((1,0),(-1,0),(0,1),(0,-1))):add.append((x,y))
        for x,y in add:s.p[x,y]=OUT
CATS={
 'precious':dict(body=C('#ecdcc6'),bodyS=C('#d8c3a6'),point=C('#5b4033'),pointS=C('#4a3328'),paw=C('#fbf7f1'),tail=C('#4a3328'),face=C('#e8d6bf'),
   mask=[C('#3a261c'),C('#4a3328'),C('#6e4e3a'),C('#a07e64')],ear=C('#4a3328'),earIn=C('#b88a7c'),bib=C('#fbf7f1'),eyes=[C('#8fb6ff'),C('#8fb6ff')],nose=C('#2b1d3a'),
   whisk=C('#ffffff'),thick=0,grumpy=0,mouth='w',uwu=0),
 'cotton':dict(body=C('#ffffff'),bodyS=C('#e9e6ef'),point=C('#ffffff'),pointS=C('#e9e6ef'),paw=C('#ffffff'),tail=C('#ffffff'),face=C('#ffffff'),mask=None,
   ear=C('#ffffff'),earIn=C('#f4b6b0'),bib=None,eyes=[C('#5d8fe8'),(C('#5d8fe8'),C('#c3cf55'))],nose=C('#f4a6b4'),whisk=C('#a59cad'),thick=0,grumpy=0,mouth='w',uwu=0),
 'collete':dict(body=C('#ffffff'),bodyS=C('#e9e6ef'),point=C('#ffffff'),pointS=C('#e9e6ef'),paw=C('#ffffff'),tail=C('#ffffff'),face=C('#ffffff'),mask=None,
   ear=C('#ffffff'),earIn=C('#e9a9a4'),bib=None,eyes=[C('#6f93c4'),C('#6f93c4')],nose=C('#f4a6b4'),whisk=C('#a59cad'),thick=0,grumpy=1,mouth='flat'),
}
DARK=C('#1a1024');WH=C('#ffffff');SH2=C('#cfcadb')
def head(b,cat,hx,hy,blink=False):
    k=cat
    # ears: clean triangles, apex leaning outward
    hxi,hyi=int(round(hx)),int(round(hy))
    L=[(-5,-4),(-4,-4),(-3,-4),(-2,-4),(-5,-5),(-4,-5),(-3,-5),(-5,-6),(-4,-6),(-5,-7)]
    for (px,py) in L:
        b.sp(hxi+px,hyi+py,k['ear']);b.sp(hxi-1-px,hyi+py,k['ear'])
    for (px,py) in [(-4,-5),(-4,-4),(-3,-4)]:
        b.sp(hxi+px,hyi+py,k['earIn']);b.sp(hxi-1-px,hyi+py,k['earIn'])
    # face
    def f(x,y,dx,dy):
        if k['mask']:
            d=math.hypot(dx,(dy-.25)*1.1)
            return k['mask'][0] if d<.35 else k['mask'][1] if d<.6 else k['mask'][2] if d<.82 else k['face']
        return k['face'] if not(dy>.55 and dx>.2) else (k['bodyS'] if k['face']==WH else k['face'])
    b.ell(hx,hy,6,5,f)
    # eyes
    ey=int(hy-1)
    if k.get('uwu'):
        lc=k['eyes'][0] if k['mask'] else OUT
        for x0 in(int(hx-4),int(hx+1)):
            b.sp(x0,ey,lc);b.sp(x0+1,ey+1,lc);b.sp(x0+2,ey,lc)
        bl=C('#f29aa8')
        b.sp(int(hx-6),ey+2,bl);b.sp(int(hx-5),ey+2,bl);b.sp(int(hx+4),ey+2,bl);b.sp(int(hx+5),ey+2,bl)
    for i,ex in enumerate(() if k.get('uwu') else (int(hx-3),int(hx+1))):
        col=k['eyes'][i]
        if blink:
            b.sp(ex,ey+1,OUT);b.sp(ex+1,ey+1,OUT);continue
        c1,c2=(col if isinstance(col[0],tuple) else (col,col))
        b.sp(ex,ey,c1);b.sp(ex+1,ey,c2);b.sp(ex,ey+1,c1);b.sp(ex+1,ey+1,c2)
        b.sp(ex+1,ey+1,DARK) if not k['mask'] else b.sp(ex,ey+1,DARK)
        b.sp(ex,ey,WH) if not k['grumpy'] else None
        if k['grumpy']:
            b.sp(ex,ey,OUT);b.sp(ex+1,ey,OUT)
    # nose & mouth
    nx,ny=int(hx-1),int(hy+1)
    b.sp(nx,ny,k['nose']);b.sp(nx+1,ny,k['nose'])
    mc=C('#f3e6d6') if k['mask'] else OUT
    m=k['mouth']
    if m=='w':
        for (dx,dy) in((-1,2),(0,1),(1,1),(2,2)):b.sp(nx+dx,ny+dy,mc)
    elif m=='flat':b.sp(nx,ny+2,mc);b.sp(nx+1,ny+2,mc)
    elif m=='pout':b.sp(nx-1,ny+3,mc);b.sp(nx,ny+2,mc);b.sp(nx+1,ny+2,mc);b.sp(nx+2,ny+3,mc)
    else:b.sp(nx-1,ny+1,mc);b.sp(nx,ny+2,mc);b.sp(nx+1,ny+2,mc);b.sp(nx+2,ny+1,mc)
    # whiskers
    for s in(-1,1):
        for j in range(3):b.sp(hx+s*(6+j)-(1 if s<0 else 0)*0,hy+1+(j//2)*s*0,k['whisk']) if j<2 else None
def side(name,f):
    k=CATS[name];b=B(28,22)
    bob=1 if f%2 else 0;ry=5 if k['thick'] else 4.3
    bx,by=12,14+bob
    # tail (behind)
    sw=[0,1,0,-1][f]
    for t in range(0,13):
        u=t/12;x=bx-8-math.sin(u*2.6)*3+sw*u*u*2;y=by-1-u*10
        b.sp(x,y,k['tail']);b.sp(x+1,y,k['tail'])
    # legs: far pair then near pair
    st=[(1,-1),(0,0),(-1,1),(0,0)][f]
    for far in(1,0):
        for (lx,phase) in((bx-5+far*2,st[0]),(bx+5+far*1,st[1])):
            col=(k['pointS'] if far else k['point'])
            x=lx+phase*(1 if far else -1)
            for y in range(int(by+2),20):b.sp(x,y,col);b.sp(x+1,y,col)
            b.sp(x,20,k['paw']);b.sp(x+1,20,k['paw']);b.sp(x+2,20,k['paw'] if not far else k['pointS'])
    # body
    def bf(x,y,dx,dy):
        c=k['body']
        if dy>.45:c=k['bodyS']
        if k['mask'] and dx<-.35:c=k['point'] if dx<-.7 else C('#b8987a')
        if k['bib'] and dx>.55 and dy>-.2:c=k['bib']
        return c
    b.ell(bx,by,9,ry,bf)
    head(b,k,bx+8,by-6+(0 if f%2 else 0))
    b.outline();return b.im
def sit(name,f):
    k=CATS[name];b=B(22,24)
    cx=11
    # tail curled around the side, tip flicks on frame 2
    for t in range(0,12):
        u=t/11;x=cx+5+u*4-(u**2)*2;y=21-u*2-(u**3)*5*(1.4 if f==2 else 1)
        b.sp(x,y,k['tail']);b.sp(x,y+1,k['tail'])
    def bf(x,y,dx,dy):
        c=k['body'] if dx<.45 else k['bodyS']
        if k['mask'] and abs(dx)>.65:c=C('#b8987a')
        if k['bib'] and abs(dx)<.45 and dy<.1:c=k['bib']
        return c
    b.ell(cx,17,6,5.5,bf)
    for px in(cx-3,cx+1):
        for y in(20,21):b.sp(px,y,k['point']);b.sp(px+1,y,k['point'])
        b.sp(px,22,k['paw']);b.sp(px+1,22,k['paw'])
    head(b,k,cx+1,9,blink=(f==1))
    b.outline();return b.im
if __name__=='__main__':
    import os;O='/home/claude/tests/cats/';S=8;bg=(95,172,114,255)
    names=['precious','cotton','collete']
    sheet=Image.new('RGBA',(7*28*S+80,3*24*S+40),bg)
    for r,n in enumerate(names):
        fr=[side(n,f) for f in range(4)]+[sit(n,f) for f in range(3)]
        for c,im in enumerate(fr):sheet.alpha_composite(im.resize((im.width*S,im.height*S),Image.NEAREST),(10+c*(28*S+10),10+r*(24*S+10)+(24-im.height)*S))
        for f,im in enumerate(fr[:4]):im.save(f'{O}{n}_walk{f}.png')
        for f,im in enumerate(fr[4:]):im.save(f'{O}{n}_sit{f}.png')
    sheet.convert('RGB').save(O+'cats_frames.png')
