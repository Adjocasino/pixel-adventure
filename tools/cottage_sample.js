function makeCottage(){
  /* The cottage from the app icon (B2): steep terracotta shingle roof with a round attic window, tan chimney,
     dark timber frame, blue-white cross windows, orange wood plank boxes, brown door with an orange header.
     Same footprint and door spot as the old house (120x112, origin 60,106). */
  const W=120,H=112,b=buf(W,H);
  const roof=P(['#5e2219','#8a3426','#b2462f','#cf5f43','#e88565']),tim=P(['#24150e','#3a2318','#563422','#74482c']),
    org=P(['#8e4416','#b9612a','#d97f3a','#ef9f58','#f8c488']),tan=P(['#7c5640','#a47658','#c99a76','#e6c09a']),
    cream=P(['#b9a888','#d8c9a6','#efe4c8']),glass=P(['#5d9fd0','#8cc6ee','#c4e6fb','#f4fbff']);
  const PEAK=4,EAVE=60;   // roof y range
  // chimney (behind roof, right slope)
  for(let y=6;y<34;y++)for(let x=84;x<96;x++)sp(b,x,y,pick(tan,.75-(x-84)/12*.45+(((y>>2)+(x>>2))%2?.08:-.06),x,y));
  R_(b,82,4,16,3,tan[0]);R_(b,83,4,14,1,tan[2]);
  // roof: steep A-frame, shingle rows, lit left / shaded right
  for(let y=PEAK;y<EAVE;y++){const hw=2+(y-PEAK)*1.02,row=((y-PEAK)/4)|0;
    for(let x=Math.round(60-hw);x<=Math.round(60+hw);x++){if(x<0||x>=W)continue;const off=(row%2)*5,side=(x-60)/(hw+1);
      let v=.62-side*.28+((y-PEAK)%4===3?-.3:0)+((x+off)%10===0?-.18:0);
      if(Math.abs(x-60)>hw-2)v-=.35;                      // dark rim along the edges
      sp(b,x,y,pick(roof,v,x,y));}}
  // ridge highlight
  for(let y=PEAK;y<EAVE-4;y++){const hw=2+(y-PEAK)*1.02;sp(b,Math.round(60-hw)+2,y,roof[4]);}
  // round attic window
  for(let y=-8;y<=8;y++)for(let x=-8;x<=8;x++){const d=x*x+y*y;if(d>64)continue;sp(b,60+x,26+y,d>40?tim[1]:pick(glass,.6-(x+y)/20,60+x,26+y));}
  R_(b,59,19,2,15,tim[1]);R_(b,53,25,15,2,tim[1]);sp(b,57,22,glass[3]);sp(b,56,23,glass[3]);
  // eave board + little overhang shadows
  R_(b,2,EAVE,116,3,tim[1]);R_(b,2,EAVE,116,1,tim[3]);R_(b,10,EAVE+3,100,2,tim[0]);
  R_(b,4,EAVE-3,18,3,roof[1]);R_(b,98,EAVE-3,18,3,roof[1]);
  // wall: cream plaster between dark timber posts
  for(let y=EAVE+5;y<106;y++)for(let x=12;x<108;x++)sp(b,x,y,pick(cream,.8-(x/W)*.35,x,y));
  for(const x of[12,40,46,74,80,106])R_(b,x,EAVE+5,2,41,tim[1]);
  R_(b,12,EAVE+5,96,2,tim[1]);R_(b,12,104,96,2,tim[0]);
  // windows: blue-white glass with a cross
  for(const wx of[18,86]){R_(b,wx-2,EAVE+9,20,20,tim[1]);
    for(let y=EAVE+10;y<EAVE+28;y++)for(let x=wx-1;x<wx+17;x++)sp(b,x,y,pick(glass,.75-(x-wx)/40-(y-EAVE-10)/50,x,y));
    R_(b,wx+7,EAVE+10,2,18,tim[2]);R_(b,wx-1,EAVE+18,18,2,tim[2]);
    sp(b,wx+1,EAVE+12,glass[3]);sp(b,wx+2,EAVE+12,glass[3]);sp(b,wx+1,EAVE+13,glass[3]);sp(b,wx+11,EAVE+21,glass[3]);
    // orange plank flower box with cream sill
    R_(b,wx-4,EAVE+28,24,2,cream[2]);
    for(let y=EAVE+30;y<EAVE+38;y++)for(let x=wx-3;x<wx+19;x++)sp(b,x,y,pick(org,.7-(x-wx)/45+((y-EAVE-30)%4===3?-.3:0),x,y));
    for(let i=0;i<20;i+=2)if(hash(i,wx,3)<.75)sp(b,wx-2+i,EAVE+27-(hash(i,wx,4)*2|0),pick([C('#e86a7a'),C('#ffffff'),C('#7fb6e8')],hash(i,wx,5),0,0));}
  // door: brown planks, orange header, gold knob
  R_(b,48,EAVE+8,24,6,org[1]);R_(b,49,EAVE+9,22,4,pick(org,.75,0,0));R_(b,58,EAVE+10,4,2,cream[2]);
  for(let y=EAVE+14;y<106;y++)for(let x=48;x<72;x++){const edge=x===48||x===71;sp(b,x,y,edge?tim[0]:pick(tim,((x-48)>>2)%2?.85:.7,x,y));}
  R_(b,49,EAVE+26,22,1,tim[0]);sp(b,67,EAVE+28,C('#f0c050'));sp(b,67,EAVE+29,C('#c99a30'));
  // step
  R_(b,46,104,28,2,tan[1]);
  outline(b,.38);return{c:cvs(b),ox:60,oy:106};
}
