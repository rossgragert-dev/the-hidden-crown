/* ================= ART ================= */
const PALS={
 day:{sky:['#5f8fc8','#7fa7d2','#9fbfd6','#bfd2c8','#dcdcb4','#efdc9c','#f6d68a'],cel:'sun',celC:'#fff4c0',celH:'#f8e6a4',cloud:'#fff7e0',cloud2:'#e4d8b0',mtn:'#7d8cb0',snow:'#eef2f8',forest:'#3f6a3c',hill:'#7ea04c',field:['#b9ad5a','#9fb45a'],wall:'#e8d8ac',beam:'#6a4a30',roof:'#b8553a',stone:'#9a9488',path:'#d4b274',grass:'#6a9a3a',win:'#3a4a6a',glow:0,smk:'120,120,100',birds:1,haze:'#f6e2a0',near:1},
 fen:{sky:['#16303e','#22495a','#336a72','#4f8f88','#7db39c','#a9cdaa','#cfe0b8'],cel:'moon',celC:'#e8f4e8',celH:'#9cc8bc',cloud:'#8fb8b0',cloud2:'#6a9690',mtn:'#3b6670',snow:'#9cc0c0',forest:'#22503c',hill:'#34705a',field:['#3f7a5a','#4a8a62'],wall:'#a89a7c',beam:'#3a2a20',roof:'#5a4a40',stone:'#6a7468',path:'#6e7a58',grass:'#2f6a4a',win:'#e8d28a',glow:1,smk:'120,150,140',fireflies:1,mist:1,haze:'#9cc8b8',near:1},
 night:{sky:['#080c1e','#0e1630','#16244a','#203462','#2d4678','#42598c','#5a70a0'],cel:'moon',celC:'#f4f0dc',celH:'#8a9ac4',cloud:'#2a3a64',cloud2:'#1e2c50',mtn:'#26345e',snow:'#6a7aa8',forest:'#14243a',hill:'#1e3a40',field:['#24404a','#2a4a50'],wall:'#8a8296',beam:'#2a2024',roof:'#4a3044',stone:'#555a66',path:'#5c5a68',grass:'#1e3a3c',win:'#ffc861',glow:1,smk:'60,70,100',stars:1,haze:'#566a9a'},
 ash:{sky:['#120814','#24101e','#421422','#7a1e1e','#b03a1a','#e0701f','#f6a040'],cel:'sun',celC:'#ff9a3a',celH:'#c8461c',cloud:'#5a2428',cloud2:'#3a1620',mtn:'#4a1d2c',snow:'#7a3a3a',forest:'#2a1018',hill:'#34161f',field:['#3a1a1a','#44201c'],wall:'#6a3a32',beam:'#1c1010',roof:'#2c1216',stone:'#4a3030',path:'#4a2c26',grass:'#2a1818',win:'#ffb347',glow:1,smk:'30,12,16',embers:1,haze:'#e0701f',nospire:1}
};
PALS.wood={env:'wood',bg:['#0e2a1c','#143824','#1a4a2c','#235a34'],rock:'#1a3a24',rockL:'#2f6a3a',grass:'#2a6a34',path:'#6a5a3a',tint:'rgba(20,50,20,.14)',fireflies:1,trunk:'#4a3220',leaf:'#2f7a3c'};
PALS.cave={env:'cave',bg:['#080a16','#0e1224','#141a32','#1a2240'],rock:'#232a44',rockL:'#36406a',grass:'#2a3a4a',path:'#3a3e56',tint:'rgba(40,80,140,.12)',crys:'#5ae0ff',crys2:'#b070ff'};
PALS.mine={env:'mine',bg:['#120e0e','#1c1614','#261e1a','#30261e'],rock:'#3a2e28',rockL:'#5a4a3c',grass:'#3a322c',path:'#5a4a38',tint:'rgba(120,60,10,.10)',wood:'#7a5230',lamp:'#ffb347'};
PALS.keep={env:'keep',bg:['#0c0c18','#14142a','#1c1c38','#262648'],rock:'#4a4a5a',rockL:'#6a6a7c',grass:'#4a4858',path:'#6a2a34',tint:'rgba(30,20,50,.12)',flame:'#ffb347'};
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];};
const RC=(x,X,Y,w,h,c)=>{x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
function circC(x,cx,cy,r,c){for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+.5));RC(x,cx-w,cy+dy,2*w+1,1,c);}}
function cone(x,cx,y,w,h,col,hi){for(let j=0;j<h;j++){const ww=Math.max(2,Math.round(w*(1-j/h)));RC(x,cx-ww/2,y-j-1,ww,1,col);if(hi)RC(x,cx-ww/2,y-j-1,1,1,hi);}}
function pine(x,cx,by,h,col,hi){for(let j=0;j<h;j++){const t=j%6<2,w=Math.max(1,Math.round((1-j/h)*(h*.3)+(t?2:0)));RC(x,cx-w,by-j,w*2+1,1,t?hi:col);}RC(x,cx-1,by,2,3,'#3a2a1a');}
function tree(x,cx,by,h,p){const c0=sh(p.forest,.12),c1=sh(p.forest,.3),c2=sh(p.forest,-.2),r=Math.round(h*.38);
  RC(x,cx-1,by-h*.45,3,h*.45,'#4a3320');RC(x,cx+1,by-h*.45,1,h*.45,'#33241a');
  circC(x,cx,by-h*.62,r,c2);circC(x,cx-1,by-h*.66,r-1,c0);circC(x,cx-r*.3,by-h*.78,Math.max(2,r*.45),c1);
  for(let i=0;i<5;i++)RC(x,cx-r+3+i*(r*.4),by-h*.55+(i%2)*3,2,1,c2);}
function house(x,X,by,w,h,p,r){
  const wall=r()>.5?p.wall:sh(p.wall,-.1),beam=p.beam,top=by-h,rh=Math.round((w+8)*.46),rc=r()>.5?p.roof:sh(p.roof,.14);
  RC(x,X,by-5,w,5,p.stone);for(let i=2;i<w;i+=6)RC(x,X+i,by-3,3,1,sh(p.stone,-.2));
  RC(x,X,top,w,h-5,wall);RC(x,X+w-4,top,4,h-5,sh(wall,-.15));RC(x,X,top,2,h-5,sh(wall,.1));
  const step=Math.max(10,Math.round(w/4));for(let i=0;i<=w-2;i+=step)RC(x,X+i,top,2,h-5,beam);RC(x,X+w-2,top,2,h-5,beam);
  RC(x,X,top,w,2,beam);RC(x,X,top+Math.round((h-5)/2),w,2,beam);
  const chx=X+Math.round(w*.68);
  for(let j=0;j<rh;j++){const ww=Math.round((w+8)*(1-j/rh)),x0=X-4+Math.round(((w+8)-ww)/2),band=Math.floor(j/3)%2;
    RC(x,x0,top-1-j,ww,1,band?sh(rc,-.16):rc);RC(x,x0,top-1-j,1,1,sh(rc,.3));if(j<2)RC(x,x0,top-1-j,ww,1,sh(rc,-.35));}
  CHIM.push({x:chx+3,y:top-rh+5});
  RC(x,chx,top-rh+8,6,Math.round(rh*.55),'#8a4a3a');RC(x,chx-1,top-rh+6,8,3,'#6a3a2e');RC(x,chx+1,top-rh+10,2,4,'#a8604a');
  RC(x,X-4,top,w+8,2,sh(wall,-.4));
  const dx=X+Math.round(w/2)-4;RC(x,dx-1,by-18,10,13,beam);RC(x,dx,by-17,8,12,'#5a3a22');RC(x,dx+3,by-17,1,12,'#43291a');RC(x,dx+6,by-11,1,1,'#e6c860');
  const acc=r()>.5?'#3a6a8a':'#8a3a3a';
  for(const wx of [X+5,X+w-13]){RC(x,wx-1,top+7,9,10,beam);RC(x,wx,top+8,7,8,p.win);if(p.glow)RC(x,wx,top+8,7,8,p.win);else RC(x,wx+1,top+9,2,2,sh(p.win,.45));RC(x,wx+3,top+8,1,8,beam);RC(x,wx,top+12,7,1,beam);RC(x,wx-3,top+7,2,9,acc);RC(x,wx+8,top+7,2,9,acc);}
  RC(x,X+5-1,top+17,9,2,'#5a3a22');RC(x,X+5,top+16,2,1,'#e87aa0');RC(x,X+8,top+16,2,1,'#f4d84a');
}
function castle(x,cx,by,p,k){
  k=k||1;
  const stone=mix(p.mtn,p.haze,.42),sD=sh(stone,-.18),sL=sh(stone,.16),roofC=mix(p.roof,p.haze,.35),lit=p.glow?p.win:sh(p.mtn,-.25),cb=by-6*k;
  const Q=(dx,dy,w,h,c)=>RC(x,cx+dx*k,cb+dy*k,w*k,h*k,c);
  const cone2=(dx,dy,w,h,col,hi)=>{const hh=Math.round(h*k);for(let j=0;j<hh;j++){const ww=Math.max(2,Math.round(w*k*(1-j/hh)));RC(x,cx+dx*k-ww/2,cb+dy*k-j-1,ww,1,col);if(hi)RC(x,cx+dx*k-ww/2,cb+dy*k-j-1,1,1,hi);}};
  const mr=Math.round(70*k);for(let i=-mr;i<=mr;i++){const m=Math.round(16*k*(1-(i/mr)*(i/mr)));RC(x,cx+i,by-m,1,m+40,p.hill);}
  Q(-46,-26,92,26,stone);Q(-46,-26,92,2,sL);Q(36,-26,10,26,sD);
  for(let i=0;i<92;i+=7)Q(-46+i,-31,4,5,stone);
  for(let i=8;i<90;i+=14)Q(-46+i,-18,2,6,sD);
  for(const sx of [-56,48]){Q(sx,-52,16,52,stone);Q(sx+12,-52,4,52,sD);Q(sx,-52,2,52,sL);for(let i=0;i<16;i+=6)Q(sx+i,-57,4,5,stone);Q(sx+6,-38,3,7,lit);cone2(sx+8,-57,20,18,roofC,sh(roofC,.25));}
  Q(-18,-70,36,70,stone);Q(10,-70,8,70,sD);Q(-18,-70,2,70,sL);
  for(let i=0;i<36;i+=7)Q(-18+i,-75,4,5,stone);
  for(const wx of [-12,-2,6]){Q(wx,-58,4,9,lit);Q(wx+1,-60,2,2,lit);}Q(-8,-42,4,8,lit);Q(4,-42,4,8,lit);
  Q(-7,-18,14,18,'#2a2230');Q(-5,-20,10,2,'#2a2230');Q(-1,-18,2,18,'#3a3040');
  Q(-8,-100,16,30,stone);Q(4,-100,4,30,sD);Q(-3,-90,3,7,lit);cone2(0,-100,22,24,roofC,sh(roofC,.25));
  Q(0,-130,1,10,'#444');Q(1,-130,8,4,'#b02a3a');Q(1,-126,5,2,'#8a1f2c');
  Q(-54,-70,1,8,'#444');Q(-53,-70,6,3,'#2a5aa8');
}
function spire(x,sx,by,p,k){
  k=k||1;const col=mix('#2a2924',p.mtn,.25),hi=sh(col,.16),lo=sh(col,-.3);
  const Q=(dx,dy,w,h,c)=>RC(x,sx+dx*k,by+dy*k,w*k,h*k,c);
  for(let j=0;j<108*k;j++){const jj=j/k,w=Math.max(3,Math.round((24-jj*.17+Math.sin(jj*.7)*1.5)*k));RC(x,sx-w/2,by-j,w,1,Math.floor(jj)%9<2?hi:col);RC(x,sx+w/2-3,by-j,3,1,lo);}
  for(let q=0;q<4;q++)Q(-12+q*7,-96-(q%2)*6-12,3,12,col);
  Q(-2,-124,4,18,col);Q(-9,-110,3,10,col);Q(6,-114,3,12,col);
  Q(-1,-40,2,6,'#9acd32');Q(3,-64,2,5,'#9acd32');Q(-4,-80,2,4,'#b6e04a');
  x.globalAlpha=.55;Q(-26,-116,52,8,'#262618');Q(-18,-124,36,8,'#20200f');x.globalAlpha=1;
}
function mkGround(p){
    const P0=128,top=GY-11,[c,x]=mkc(P0,H-top+4),r=mkr(33),gr=p.grass,gl=sh(gr,.2),gd=sh(gr,-.22),pa=p.path;
    RC(x,0,3,P0,H,gr);
    for(let i=0;i<P0;i+=1){const h=1+Math.floor(r()*3);RC(x,i,3-h+1,1,h,r()>.5?gl:gd);}
    RC(x,0,6,P0,14,pa);
    for(let i=0;i<P0;i++)for(let j=6;j<20;j++)if(r()<.16)RC(x,i,j,1,1,r()>.5?sh(pa,.12):sh(pa,-.14));
    for(let k=0;k<7;k++)RC(x,Math.floor(r()*P0),8+Math.floor(r()*10),2,1,'#cfc6a8');
    for(let i=0;i<P0;i+=6){RC(x,i,11,4,1,sh(pa,-.2));RC(x,i+2,17,4,1,sh(pa,-.2));}
    for(let i=0;i<P0;i++){const h=r()>.6?2:1;RC(x,i,20,1,h,gd);}
    for(let j=22;j<H-top+4;j++){for(let i=0;i<P0;i++){const q=r();if(q<.1)RC(x,i,j,1,1,gl);else if(q<.2)RC(x,i,j,1,1,gd);}}
    for(let k=0;k<30;k++){const X=Math.floor(r()*P0),Y=24+Math.floor(r()*(H-top-30));RC(x,X,Y,1,2,gl);RC(x,X+1,Y+1,1,1,gl);RC(x,X-1,Y+1,1,1,gl);}
    for(let k=0;k<12;k++){const X=Math.floor(r()*P0),Y=24+Math.floor(r()*(H-top-30));RC(x,X,Y,1,1,['#fff','#f4d84a','#e87aa0'][k%3]);}
    x.globalAlpha=.4;const gh=H-top+4;for(let j=22;j<gh;j++){x.fillStyle='rgba(0,0,0,'+(((j-22)/gh)*.5).toFixed(3)+')';x.fillRect(0,j,P0,1);}x.globalAlpha=1;
    return {c,top};
}
function mkFg(p){
    const P0=520,[c,x]=mkc(P0,H),r=mkr(41),gl=sh(p.grass,.1),gd=sh(p.grass,-.3);if(p.env==='cave'||p.env==='mine'||p.env==='keep'){for(let k=0;k<9;k++){const X=Math.floor(r()*P0),Y=GY+16+Math.floor(r()*Math.max(1,H-GY-20)),rr=3+Math.floor(r()*3);circC(x,X,Y,rr,sh(p.rock,-.1));circC(x,X-1,Y-1,Math.max(1,rr-1),p.rockL);}return c;}
    for(let i=0;i<P0;i+=Math.floor(16+r()*34)){const h=7+Math.floor(r()*9),y=GY+14+Math.floor(r()*Math.max(1,H-GY-16));
      for(let b=0;b<5;b++){const bh=h-Math.abs(b-2)*2;RC(x,i+b*2,y-bh,1,bh,b%2?gd:gl);}}
    for(let k=0;k<5;k++){const X=Math.floor(r()*P0),Y=GY+16+Math.floor(r()*Math.max(1,H-GY-20));circC(x,X,Y,3,'#6a665c');RC(x,X-2,Y-2,3,1,'#9a968a');}
    return c;
}
let LAY=null,LAYKEY='',CHIM=[],GLOW=[],TORCH=[];
const rgba=(h,a)=>{const c=hex2(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';};

function stalac(x,cx,y,w,h,col,down){for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*(1-j/h)));RC(x,cx-ww/2,down?y+j:y-j,ww,1,col);}}
function crystal(x,cx,by,h,col){for(let j=0;j<h;j++){const ww=Math.max(1,Math.round((h-j)*.34+1));RC(x,cx-ww/2,by-j,ww,1,j>h*.7?sh(col,.5):col);}RC(x,cx,by-h+2,1,h-3,sh(col,.7));}
function buildEnvLayers(p){
  const L={},env=p.env;GLOW=[];TORCH=[];
  {const [c,x]=mkc(W,H),n=p.bg.length,bh=Math.ceil(H/n),r=mkr(51);
    for(let i=0;i<n;i++)RC(x,0,i*bh,W,bh+1,p.bg[i]);
    for(let k=0;k<W*H/30;k++)RC(x,r()*W,r()*H,1,1,sh(p.rock,r()<.5?.12:-.25));
    if(env==='keep'||env==='wood'){for(let k=0;k<60;k++)RC(x,r()*W,r()*GY*.6,1,1,'#c8d0ff');}
    L.sky=c;}
  {const P0=480,[c,x]=mkc(P0,H),r=mkr(61),rD=sh(p.rock,-.35);
    if(env==='cave'||env==='mine'){
      RC(x,0,0,P0,22,rD);for(let i=0;i<P0;i+=Math.floor(8+r()*14))stalac(x,i,18,5+r()*8,12+r()*38,rD,true);
      for(let i=0;i<P0;i+=Math.floor(16+r()*26)){const h=10+r()*30;stalac(x,i,GY-4,10+r()*10,h,sh(p.rock,-.2),false);}
      RC(x,0,GY-12,P0,H,sh(p.rock,-.3));
      if(env==='mine')for(let k=0;k<14;k++){const X=r()*P0,Y=40+r()*(GY-90);RC(x,X,Y,2,1,'#e8c040');RC(x,X+2,Y+1,1,1,'#e8c040');RC(x,X-1,Y+2,2,1,'#c07a2a');}
      else for(let k=0;k<7;k++){const X=30+r()*(P0-60),cc=k%2?p.crys:p.crys2;crystal(x,X,GY-10,8+r()*10,cc);GLOW.push({x:X,y:GY-18,col:cc,f:.15,P:P0,r:14,ph:k});}
    }else if(env==='keep'){
      RC(x,0,0,P0,H,sh(p.rock,-.45));for(let by=0;by<GY;by+=8)for(let bx=((by/8)%2)*10;bx<P0;bx+=20)RC(x,bx,by,19,7,sh(p.rock,-.4+((bx+by)%3)*.04));
      for(let i=20;i<P0;i+=120){RC(x,i-2,GY-130,40,110,p.rockL);circC(x,i+18,GY-130,20,p.rockL);RC(x,i,GY-126,36,106,'#0e1030');circC(x,i+18,GY-126,18,'#0e1030');
        for(let q=0;q<10;q++)RC(x,i+4+r()*28,GY-124+r()*70,1,1,'#fff');circC(x,i+26,GY-100,6,'#e8f0e0');RC(x,i+18,GY-126,1,106,p.rockL);RC(x,i,GY-80,36,1,p.rockL);}
    }else{
      for(let i=0;i<P0;i+=Math.floor(14+r()*18)){const w=8+Math.floor(r()*9);RC(x,i,0,w,GY,sh(p.trunk,-.45));RC(x,i,0,2,GY,sh(p.trunk,-.2));}
      x.globalAlpha=.1;for(let k=0;k<6;k++){const X=k*90+20;for(let j=0;j<GY;j++)RC(x,X+j*.35,j,16,1,'#d8f0a0');}x.globalAlpha=1;
      RC(x,0,0,P0,26,sh(p.leaf,-.5));for(let i=0;i<P0;i+=10)circC(x,i,22+r()*12,10+r()*6,sh(p.leaf,-.3-r()*.15));
    }
    L.far=c;}
  {const P0=420,[c,x]=mkc(P0,H),r=mkr(71),pg=GY-4;
    if(env==='cave'){
      for(let cx=40;cx<P0;cx+=140){RC(x,cx,0,24,pg,p.rock);RC(x,cx,0,7,pg,p.rockL);RC(x,cx+17,0,7,pg,sh(p.rock,-.3));stalac(x,cx+12,0,40,26,p.rock,true);RC(x,cx-4,pg-12,32,12,p.rock);
        for(let k=0;k<3;k++){const cc=k%2?p.crys:p.crys2;crystal(x,cx+28+k*5,pg,10+k*5,cc);}GLOW.push({x:cx+34,y:pg-14,col:p.crys,f:.45,P:P0,r:18,ph:cx});}
      for(let i=0;i<P0;i+=Math.floor(20+r()*20))RC(x,i,0,3,r()*16,sh(p.rock,-.2));
    }else if(env==='mine'){
      for(let cx=30;cx<P0;cx+=96){RC(x,cx,GY-118,6,pg-(GY-118),p.wood);RC(x,cx+60,GY-118,6,pg-(GY-118),p.wood);RC(x,cx-6,GY-122,78,7,sh(p.wood,-.1));RC(x,cx-6,GY-122,78,2,sh(p.wood,.3));
        RC(x,cx,GY-118,2,pg-(GY-118),sh(p.wood,.3));for(let j=0;j<8;j++)RC(x,cx+10+j*5,GY-115+j*2,2,2,sh(p.wood,-.2));
        RC(x,cx+30,GY-114,1,10,'#444');circC(x,cx+30,GY-102,4,p.lamp);GLOW.push({x:cx+30,y:GY-102,col:p.lamp,f:.45,P:P0,r:30,ph:cx});}
      RC(x,60,pg-14,30,12,'#4a4a52');RC(x,60,pg-14,30,2,'#8a8a92');RC(x,66,pg-2,4,3,'#222');RC(x,80,pg-2,4,3,'#222');
    }else if(env==='keep'){
      for(let cx=30;cx<P0;cx+=140){RC(x,cx,0,28,pg,p.rock);RC(x,cx,0,28,3,p.rockL);RC(x,cx,0,6,pg,p.rockL);RC(x,cx+22,0,6,pg,sh(p.rock,-.3));RC(x,cx-4,pg-10,36,10,p.rock);RC(x,cx-4,0,36,8,p.rockL);
        RC(x,cx+36,20,22,48,'#8a2230');RC(x,cx+36,20,22,2,'#e8b84a');for(let q=0;q<4;q++)RC(x,cx+36+q*6,68,4,4+(q%2)*5,'#8a2230');RC(x,cx+43,34,8,10,'#e8b84a');
        RC(x,cx+12,pg-60,3,5,'#3a2a22');TORCH.push({x:cx+13,y:pg-62,f:.45,P:P0});}
    }else{
      for(let cx=20;cx<P0;cx+=110+Math.floor(r()*40)){const w=14+Math.floor(r()*6);RC(x,cx,0,w,pg,p.trunk);RC(x,cx,0,3,pg,sh(p.trunk,.25));RC(x,cx+w-4,0,4,pg,sh(p.trunk,-.35));
        for(let j=0;j<pg;j+=7)RC(x,cx+3+r()*(w-6),j,2,3,sh(p.trunk,-.2));RC(x,cx-5,pg-8,w+10,8,p.trunk);RC(x,cx-9,pg-3,w+18,3,sh(p.trunk,-.2));
        for(let q=0;q<4;q++)circC(x,cx+w/2+(q-1.5)*10,12+r()*14,12+r()*6,sh(p.leaf,-.1-r()*.2));
        for(let q=0;q<5;q++)RC(x,cx-8+q*5,pg-6-q%3*2,2,5+q%2*3,p.leaf);}
    }
    L.mid=c;}
  if(env==='wood'){const P0=760,[c,x]=mkc(P0,H),r=mkr(81);for(const tx of [160,520]){const w=26;RC(x,tx,0,w,GY+2,sh(p.trunk,-.1));RC(x,tx,0,5,GY+2,sh(p.trunk,.25));RC(x,tx+w-8,0,8,GY+2,sh(p.trunk,-.4));RC(x,tx-8,GY-10,w+16,12,sh(p.trunk,-.1));for(let j=0;j<GY;j+=9)RC(x,tx+4+r()*(w-9),j,3,4,sh(p.trunk,-.25));}L.near=c;}
  {const gd=mkGround(p);L.ground=gd.c;L.gtop=gd.top;}
  L.fg=mkFg(p);return L;
}
function glowAt(X,Y,R0,col,t,ph){const al=.30+.12*Math.sin(t*3+ph),gr=g.createRadialGradient(X,Y,0,X,Y,R0);gr.addColorStop(0,rgba(col,al));gr.addColorStop(1,rgba(col,0));g.fillStyle=gr;g.fillRect(Math.round(X-R0),Math.round(Y-R0),R0*2,R0*2);}
function envBackdrop(cam,t,p){
  g.drawImage(LAY.sky,0,0);lyr(LAY.far,.15,cam);lyr(LAY.mid,.45,cam);if(LAY.near)lyr(LAY.near,.9,cam);
  for(const o of GLOW){const P0=o.P,sx=(((o.x-cam*o.f)%P0)+P0)%P0;for(const X of [sx,sx-P0]){if(X<-40||X>W+40)continue;glowAt(X,o.y,o.r,o.col,t,o.ph);}}
  for(const o of TORCH){const P0=o.P,sx=(((o.x-cam*o.f)%P0)+P0)%P0;for(const X of [sx,sx-P0]){if(X<-20||X>W+20)continue;
    const fl=Math.floor(t*10+o.x)%3;R(X-2,o.y-6-fl,5,6+fl,'#e8802a');R(X-1,o.y-8-fl,3,6+fl,'#ffd04a');R(X,o.y-9-fl,1,3,'#fff6c0');glowAt(X,o.y-4,26,'#ffb347',t,o.x);}}
  lyr(LAY.ground,1,cam,LAY.gtop);
}

function buildLayers(pk){
  const key=pk+'|'+W+'x'+H+'|'+GY;if(key===LAYKEY)return;LAYKEY=key;
  const p=PALS[pk],L={},BY=GY-6;
  if(p.env){LAY=buildEnvLayers(p);return;}
  { // sky
    const [c,x]=mkc(W,H),n=p.sky.length,bh=Math.ceil((HZ+50)/(n-1));
    for(let i=0;i<n;i++)RC(x,0,i*bh,W,bh+2,p.sky[i]);
    for(let i=1;i<n;i++){const y0=i*bh;for(let r=0;r<3;r++){const st=[2,4,8][r];for(let X=(r%2)*1;X<W;X+=st)RC(x,X,y0-1-r*2,1,1,p.sky[i]);}}
    if(p.stars){const r=mkr(5);for(let i=0;i<90;i++){const X=r()*W,Y=r()*HZ*.8;RC(x,X,Y,1,1,i%7?'#c8d4ff':'#fff');if(i%9===0){RC(x,X-1,Y,3,1,'#9fb0e8');RC(x,X,Y-1,1,3,'#9fb0e8');}}}
    L.sky=c;
  }
  { // very far pale peaks
    const P0=800,[c,x]=mkc(P0,H),by=HZ+10,pc=mix(p.mtn,p.sky[4],.55);
    const mh=i=>{const u=i/P0*Math.PI*2;return 120+50*Math.sin(u*2+2.1)+30*Math.sin(u*5+.7)+14*Math.sin(u*13+1.1);};
    for(let i=0;i<P0;i+=2){const h=mh(i),y=by-h,lit=mh(i+2)>h;RC(x,i,y,2,h+20,lit?pc:sh(pc,-.1));if(h>150)RC(x,i,y,2,(h-150)*.9+2,lit?sh(p.snow,-.05):sh(p.snow,-.2));}
    L.peaks=c;
  }
  { // far mountains + castle + spire
    const P0=640,[c,x]=mkc(P0,H),by=HZ+18;
    const mh=i=>{const u=i/P0*Math.PI*2;return 78+30*Math.sin(u*2+.4)+18*Math.sin(u*5+1.7)+9*Math.sin(u*11+.3);};
    const mL=sh(p.mtn,.14),mD=sh(p.mtn,-.18);
    for(let i=0;i<P0;i+=2){const h=mh(i),y=by-h,s=mh(i+2)-h,lit=s>0;
      RC(x,i,y,2,h+40,lit?mL:mD);
      if(h>104){const sn=(h-104)*.9+2+((i%6)<2?2:0);RC(x,i,y,2,sn,lit?p.snow:sh(p.snow,-.14));}
      if(i%8===0)RC(x,i,y+h*.45,2,3,sh(lit?mL:mD,-.08));}
    x.globalAlpha=.4;RC(x,0,by-34,P0,80,p.haze);x.globalAlpha=1;
    castle(x,340,by+6,p,1.5);
    if(!p.nospire)spire(x,110,by+8,p,1.35);
    L.far=c;
  }
  { // distant pine forest
    const P0=400,[c,x]=mkc(P0,H),r=mkr(7),fy=HZ+34;
    for(let i=0;i<P0;i+=5){const h=26+Math.floor(r()*24),col=r()>.5?p.forest:sh(p.forest,-.14);pine(x,i,fy,h,col,sh(col,.18));}
    RC(x,0,fy,P0,H-fy,p.forest);x.globalAlpha=.18;RC(x,0,fy-50,P0,60,p.haze);x.globalAlpha=1;
    L.forest=c;
  }
  { // rolling hills + fields
    const P0=480,[c,x]=mkc(P0,H),r=mkr(9),hy=HZ+52;
    const hh=i=>{const u=i/P0*Math.PI*2;return 24+12*Math.sin(u*2+1)+8*Math.sin(u*3+2.2)+4*Math.sin(u*7);};
    for(let i=0;i<P0;i++){const h=hh(i);RC(x,i,hy-h,1,H,p.hill);if(h>28)RC(x,i,hy-h,1,3,sh(p.hill,.16));}
    for(let k=0;k<5;k++){const x0=30+k*92+Math.floor(r()*20),w=48+Math.floor(r()*30);
      for(let i=x0;i<x0+w&&i<P0;i++){const y=hy-hh(i)+5;for(let j=0;j<24;j+=3)RC(x,i,y+j+((i>>3)&1),1,2,p.field[((j/3)|0)%2]);}
      RC(x,x0,hy-hh(x0)+3,1,26,sh(p.forest,-.1));RC(x,x0+w,hy-hh(x0+w)+3,1,26,sh(p.forest,-.1));}
    for(let i=4;i<P0;i+=13)if(r()>.35)tree(x,i,hy-hh(i)+4,12+Math.floor(r()*8),p);
    L.hills=c;
  }
  { // village layer
    const P0=560,[c,x]=mkc(P0,H),r=mkr(21);let cx=8;CHIM=[];
    while(cx<P0-80){const k=r();
      if(k<.6){const w=42+Math.floor(r()*22),h=28+Math.floor(r()*14);if(cx+w>P0-14)break;house(x,cx,BY,w,h,p,r);cx+=w+10+Math.floor(r()*14);}
      else if(k<.82){tree(x,cx+14,BY,40+Math.floor(r()*16),p);cx+=30;}
      else if(k<.92){circC(x,cx+10,BY-6,8,'#d8b85a');circC(x,cx+8,BY-9,6,'#ecd070');RC(x,cx+2,BY-3,16,3,'#a88a3a');cx+=26;}
      else{RC(x,cx,BY-9,14,9,p.stone);RC(x,cx+2,BY-7,10,3,'#2a3a4a');RC(x,cx+1,BY-22,2,13,p.beam);RC(x,cx+11,BY-22,2,13,p.beam);cone(x,cx+7,BY-22,20,9,p.roof,sh(p.roof,.25));cx+=28;}}
    L.village=c;
  }
  if(p.near){ // big foreground trees
    const P0=760,[c,x]=mkc(P0,H),r=mkr(13);
    for(const tx of [150,520]){const th=100+Math.floor(r()*30),by=GY-3;
      RC(x,tx-5,by-th*.55,10,th*.55,'#4a3320');RC(x,tx+2,by-th*.55,3,th*.55,'#33241a');RC(x,tx-7,by-6,14,6,'#4a3320');
      const rr=Math.round(th*.3),cy=by-th*.78;
      circC(x,tx-rr*.8,cy+8,rr*.7,sh(p.forest,-.28));circC(x,tx+rr*.8,cy+10,rr*.7,sh(p.forest,-.28));circC(x,tx,cy,rr,sh(p.forest,-.12));
      circC(x,tx-rr*.25,cy-rr*.25,rr*.66,p.forest);circC(x,tx-rr*.4,cy-rr*.45,rr*.34,sh(p.forest,.22));
      for(let i=0;i<14;i++)RC(x,tx-rr+r()*rr*2,cy-rr*.6+r()*rr*1.4,3,2,sh(p.forest,r()>.5?.28:-.3));}
    L.near=c;
  }
  {const gd=mkGround(p);L.ground=gd.c;L.gtop=gd.top;}
  L.fg=mkFg(p);
  LAY=L;
}
function lyr(cn,f,cam,y){const P0=cn.width,off=-Math.floor((((cam*f)%P0)+P0)%P0);for(let X=off;X<W;X+=P0)g.drawImage(cn,X,y||0);}
function cloudShape(px,py,s,p){const rows=[[4,6],[2,12],[0,16],[1,15],[3,9]];rows.forEach((r,i)=>{R(px+r[0]*s,py+i*2*s,r[1]*s,2*s,i===4?p.cloud2:p.cloud);});}
const CLOUDS=[[.1,.1,2,4],[.45,.2,1.5,6],[.78,.07,2.2,3],[.25,.33,1.2,8],[.62,.28,1,7]];
function drawBackdrop(cam,t,pk){
  const p=PALS[pk];if(!LAY)return;
  if(p.env){envBackdrop(cam,t,p);return;}
  g.drawImage(LAY.sky,0,0);
  const cx=Math.round(W*.72-cam*.02),cy=Math.round(HZ*.4);
  if(p.cel==='sun'){for(const [r0,c0] of [[24,p.celH],[16,p.celH],[11,p.celC]]){g.fillStyle=c0;for(let dy=-r0;dy<=r0;dy++){const w=Math.floor(Math.sqrt(r0*r0-dy*dy));g.fillRect(cx-w,cy+dy,2*w+1,1);}}}
  else{g.fillStyle=p.celH;for(let dy=-18;dy<=18;dy++){const w=Math.floor(Math.sqrt(324-dy*dy));g.globalAlpha=.18;g.fillRect(cx-w,cy+dy,2*w+1,1);}g.globalAlpha=1;
    g.fillStyle=p.celC;for(let dy=-10;dy<=10;dy++){const w=Math.floor(Math.sqrt(100-dy*dy));g.fillRect(cx-w,cy+dy,2*w+1,1);}
    g.fillStyle=p.celH;g.fillRect(cx-3,cy-3,3,2);g.fillRect(cx+2,cy+3,3,2);g.fillRect(cx-6,cy+2,2,2);}
  if(p.stars){for(let i=0;i<6;i++){if(Math.sin(t*2+i*3.1)>.3)R(((i*53+17)%W),((i*37+9)%Math.max(10,HZ*.7)),2,1,'#fff');}}
  CLOUDS.forEach((c0,i)=>{const sp=c0[3],X=((c0[0]*W*1.6+t*sp-cam*.04)%(W*1.6+80)+W*1.6+80)%(W*1.6+80)-60;cloudShape(Math.round(X),Math.round(HZ*c0[1]),c0[2],p);});
  if(p.birds){for(let i=0;i<3;i++){const bx=((t*14+i*60+30)%(W+60))-20,by=HZ*.55+Math.sin(t*2+i*2)*6+i*8,f=Math.floor(t*6+i)%2;R(bx,by,2,1,'#3a3a3a');R(bx-2,by+(f?1:-1),2,1,'#3a3a3a');R(bx+2,by+(f?1:-1),2,1,'#3a3a3a');}}
  lyr(LAY.peaks,.04,cam);lyr(LAY.far,.1,cam);lyr(LAY.forest,.3,cam);lyr(LAY.hills,.5,cam);
  if(p.mist){g.fillStyle=p.haze;g.globalAlpha=.14;for(let i=0;i<4;i++){const X=((t*5*(i+1)+i*80)%(W+120))-100;g.fillRect(X,HZ+30+i*10,120,5);g.fillRect(X-60,HZ+36+i*10,160,3);}g.globalAlpha=1;}
  lyr(LAY.village,.72,cam);
  if(LAY.near)lyr(LAY.near,.95,cam);
  lyr(LAY.ground,1,cam,LAY.gtop);
}

/* ---------- characters ---------- */
function drawBevel(pl,px,py,face,cfg){
  px=Math.round(px);py=Math.round(py);const k=cfg.k||1,wh=cfg.white;
  const rect=q=>{const w=Math.max(1,Math.round(q[2]*k)),h=Math.max(1,Math.round(q[3]*k)),x=face>0?px+Math.round(q[0]*k):px-Math.round(q[0]*k)-w;return [x,py+Math.round(q[1]*k),w,h];};
  for(const q of pl){const [x,y,w,h]=rect(q);g.fillStyle=(wh&&q[5]!=='f')?'#ffffff':q[4];g.fillRect(x,y,w,h);
    if(wh||q[5]==='f'||q[5]==='n'||!cfg.bevel)continue;
    if(w>=3&&h>=3){g.fillStyle=sh(q[4],.42);g.fillRect(x,y,w,1);g.fillRect(x,y,1,h);g.fillStyle=sh(q[4],-.32);g.fillRect(x,y+h-1,w,1);g.fillRect(x+w-1,y+1,1,h-1);}}
}
function drawParts(pl,px,py,face,k,white){drawBevel(pl,px,py,face,{bevel:true,k:k||1,white});}
function shadowAt(px,py,w){R(px-w/2,py-1,w,3,'rgba(0,0,0,.28)');R(px-w/2+2,py+2,w-4,1,'rgba(0,0,0,.18)');}
/* Characters. Colors/looks are data (o.*) so armor and outfit options can plug in later. */
const NPCS={
 corin:{col:'#2f5fd0',metal:'#aeb8cc',trim:'#e8b84a',tab:'#2f5fd0',hair:'#6b3f1f',cape:'#b02a3a',iris:'#2a5aa8'},
 halv:{col:'#4a6ab8',metal:'#b8c4d8',trim:'#e8b84a',tab:'#e8e8f2',beard:'#e6e6e6',hair:'#e6e6e6',cape:'#3a3a52',helm:'#b8c4d8',crest:'plume',crestC:'#e8e8f2',iris:'#5a7aa8',look:2},
 lysa:{col:'#3f8a4e',metal:'#8a6a42',trim:'#c9a24a',hair:'#d0762d',cape:'#2f6a3a',crest:'hood',leg:'#6a5a3a',iris:'#2a8a4a',look:0,quiver:1},
 ione:{col:'#6a3fa8',metal:'#c8b8e8',trim:'#e8c860',hair:'#d8d8e8',skin:'#ecd4bc',robe:1,iris:'#7a4ac8',look:0},
 wren:{col:'#5a4a32',metal:'#8a7a5a',trim:'#9a8a5a',hair:'#8a8a7a',skin:'#d8b48c',robe:1,antler:1,iris:'#4a6a3a',crest:'hood',look:0},
 brannoch:{col:'#8a2a3a',metal:'#b8c0cc',trim:'#e8b84a',tab:'#2a2a34',hair:'#1c1c24',cape:'#22222c',iris:'#3a3a4a',look:1},
 guard:{col:'#8a2f2f',metal:'#8a8f9a',trim:'#c9a24a',hair:'#333',helm:'#8a8f9a',iris:'#4a3a2a',look:1},
 vill:{col:'#a78a56',metal:'#8a7a5a',trim:'#c9ad78',hair:'#8a8a8a',skin:'#e8bd94',iris:'#5a4a3a',look:0,cloth:1},
 armorer:{col:'#6a4a2a',metal:'#7a7a82',trim:'#9a7a4a',hair:'#3a2a1a',beard:'#3a2a1a',skin:'#d8a880',iris:'#3a2a1a',look:0,cloth:1},
 child:{col:'#7aa8c8',metal:'#8a9ab0',trim:'#e8d8a0',hair:'#c8a058',iris:'#3a5a8a',look:0,cloth:1},
 veska:{col:'#3a2030',metal:'#4a3844',trim:'#c0402a',hair:'#d8d0e0',crest:'hood',mask:1,leg:'#2a1a24',look:0,iris:'#ff4a3a'},
 cmdr:{col:'#6a7a98',metal:'#c4cad4',trim:'#e8b84a',tab:'#2f5fd0',beard:'#aaaaaa',hair:'#aaaaaa',helm:'#c4cad4',crest:'plume',crestC:'#2f5fd0',cape:'#2a5aa8',iris:'#5a6a7a',look:2}
};
function personParts(o){
  const P0=[],A=(x,y,w,h,c,f)=>P0.push([x,y,w,h,c,f]);
  const col=o.col||'#2f5fd0',metal=o.metal||'#aeb8cc',trim=o.trim||'#e8b84a',skin=o.skin||'#f0c9a0',hair=o.hair||'#6b3f1f',boot=o.boot||'#4a3426',leg=o.leg||sh(metal,.25);
  const cL=sh(col,.3),cLL=sh(col,.62),cD=sh(col,-.3),mL=sh(metal,.35),look=o.look||0;
  const st=o.mv?Math.floor(S.t*9+(o.ph||0))%2:0,stride=o.mv?(st?1:-1):0,bb=o.mv&&st?1:0,lh=13,T=lh+4;
  const Au=(x,y,w,h,c,f)=>A(x,y-bb,w,h,c,f);
  if(o.aura){A(-12,-52,24,54,rgba(o.aura,.07),'f');A(-9,-50,18,50,rgba(o.aura,.09),'f');}
  const a=o.atk>0?1-o.atk:0,att=o.atk>0;
  if(o.cape){Au(-12,-T-14,5,T+10,o.cape);Au(-12,-T-14,5,2,sh(o.cape,.35),'n');A(-13+(o.mv?-1:0),-5,6,4,sh(o.cape,-.3),'n');}
  if(o.quiver)Au(-9,-T-18,3,10,'#6b4423');
  if(o.w===0&&!o.nosh&&!o.robe){Au(-13,-T-8,7,9,o.shield||'#2a4a9a');Au(-13,-T-8,7,2,trim,'n');Au(-11,-T-5,2,5,'#f0f0f8','n');}
  // legs / robe
  if(o.robe){
    A(-6,-T-12-bb,12,T+9,col);A(-6,-T-12-bb,12,2,cL,'n');A(-7,-5,14,3,cD);A(-3,-2,3,2,boot,'n');A(1+stride,-2,3,2,boot,'n');A(-6,-T-1-bb,12,2,trim,'n');
  }else{
    if(o.mounted){ // seated: far leg behind, thigh across the saddle, shin down to the stirrup
      const lg=o.leg||'#3b2f3a';
      A(-3,-14,10,5,sh(lg,-.25));A(3,-10,3,8,sh(lg,-.25));A(2,-3,5,3,sh(boot,-.2),'n');
      A(-4,-15,12,6,lg);A(-4,-15,12,1,sh(lg,.3),'n');A(5,-10,4,7,lg);A(4,-4,6,4,boot);A(4,-4,6,1,sh(boot,.3),'n');A(8,-1,3,1,'#c8c0b0','n');
    }else{
    A(-3-stride,-lh,2,lh-3,leg,'n');A(2+stride,-lh,2,lh-3,leg,'n');
    A(-4-stride,-3-(stride>0?1:0),4,3,boot);A(1+stride,-3-(stride<0?1:0),5,3,boot);
    }
    Au(-5,-T,10,5,cD);Au(-4,-T,2,5,col,'n');Au(1,-T,2,5,col,'n');
    Au(-6,-T-12,12,12,col);Au(-5,-T-11,4,5,cL,'n');
    if(look>=1&&!o.cloth){for(let i=0;i<4;i++)Au(-2+(i%2)*3,-T-11+i*3,2,1,cL,'n');}
    if(look>=2){Au(-5,-T-11,10,2,mL,'n');Au(-1,-T-12,2,12,sh(col,.45),'n');}
    Au(0,-T-12,2,12,trim,'n');Au(-6,-T-1,12,2,'#3a2a1a');Au(-1,-T-1,3,2,trim,'n');
    if(o.tab){Au(-3,-T+1,6,8,o.tab);Au(-1,-T+3,2,4,'#f0f0f8','n');}
  }
  // A slim relaxed off-hand for Corin replaces the oversized always-visible
  // shield slab. The real equipped shield is drawn only while actively guarding.
  if(o.hero&&!o.mounted){
    Au(-8,-T-9,3,9,o.cloth?col:metal);
    Au(-8,-T-2,3,3,skin);
    Au(-9,-T-9,1,6,sh(o.cloth?col:metal,.28),'n');
  }
  // shoulders
  if(!o.cloth){const big=look>=1?9:7,pc=look>=1?sh(metal,.1):cL;
    Au(-11,-T-15,big,look>=2?9:8,pc);Au(-11,-T-15,big,2,mL,'n');Au(-11,-T-8,big,1,cD,'n');if(look>=1)Au(-9,-T-13,3,2,trim,'n');
    Au(3,-T-13,6,6,look>=1?metal:col);}
  else Au(-7,-T-13,5,4,cL);
  // arm / hand
  Au(5,-T-9,o.robe?4:3,9,o.robe?cL:col);Au(5,-T-1,3,3,(look>=1&&!o.cloth)?metal:skin);
  // head (face)
  const hw=8,hh=8,x0=-4,hy=T+12,ey=-hy-5,ex=x0+hw-4;
  Au(x0,-hy-hh,hw,hh,skin);Au(x0+hw-2,-hy-hh+2,2,hh-3,sh(skin,.1),'n');Au(x0,-hy-1,hw,1,sh(skin,-.2),'n');Au(x0,-hy-4,1,2,sh(skin,-.14),'n');
  if(o.mask){Au(x0,-hy-4,hw,4,'#1a1620');Au(ex,ey,2,1,'#ff4a3a','n');Au(ex-1,ey-1,4,1,'#0c0a10','n');}
  else{Au(ex,ey,2,2,'#ffffff','n');Au(ex+1,ey,1,2,o.iris||'#2a5aa8','n');Au(ex+1,ey,1,1,'#0c0c14','n');Au(ex-1,ey-1,4,1,sh(hair,-.2),'n');
    Au(x0+hw,ey+2,1,2,sh(skin,-.1),'n');Au(ex,ey+4,2,1,'#a8584a','n');Au(ex-2,ey+3,1,1,'#e89a8a','n');}
  const hc=o.helm||null;
  if(hc){Au(x0-1,-hy-hh-3,hw+2,5,hc);Au(x0-1,-hy-hh-3,hw+2,1,mL,'n');Au(x0-1,-hy-hh,2,hh-1,sh(hc,-.12));
    if(o.crest==='plume'){Au(x0-2,-hy-hh-7,6,4,o.crestC||'#c43a3a','n');Au(x0-4,-hy-hh-6,3,5,sh(o.crestC||'#c43a3a',-.2),'n');}
    if(o.crest==='horns'){Au(x0-1,-hy-hh-7,2,5,'#e8e0c8','n');Au(x0+hw-1,-hy-hh-7,2,5,'#e8e0c8','n');}}
  else if(o.crest==='hood'){Au(x0-2,-hy-hh-3,hw+4,5,col);Au(x0-2,-hy-hh-3,hw+4,1,cL,'n');Au(x0-2,-hy-hh,3,hh+3,col);Au(x0-2,-hy-hh,1,hh+3,cL,'n');Au(x0+hw-2,-hy-hh-1,3,3,sh(col,-.2),'n');}
  else{Au(x0-1,-hy-hh-2,hw+2,4,hair);Au(x0-1,-hy-hh-2,hw+2,1,sh(hair,.4),'n');Au(x0-1,-hy-hh+1,3,hh,hair);Au(x0+hw-3,-hy-hh+1,3,1,hair,'n');if(o.pony)Au(x0-5,-hy-hh,4,hh+3,hair);}
  if(o.beard){Au(x0+1,-hy-3,hw-1,4,o.beard);Au(x0+1,-hy-3,hw-1,1,sh(o.beard,.25),'n');Au(ex,ey+4,2,1,'#a8584a','n');}
  if(o.scar)Au(ex-1,ey+1,1,3,'#c06060','n');
  if(o.antler){Au(-3,-hy-hh-12,1,8,'#c8b890','n');Au(-5,-hy-hh-12,3,1,'#c8b890','n');Au(2,-hy-hh-12,1,8,'#c8b890','n');Au(2,-hy-hh-12,3,1,'#c8b890','n');}
  if(o.carry){Au(3,-T-9,8,6,'#f2e6d0');Au(8,-T-10,3,3,'#f0c9a0');}
  // weapons
  const wc=o.wcol||'#eef2fa',wg=o.wglow;
  if(o.w===0){
    if(!att){Au(8,-T-26,2,24,wc,'n');Au(8,-T-26,1,24,sh(wc,.5),'n');Au(6,-T-3,6,2,trim,'n');Au(8,-T-1,2,3,'#4a3020','n');if(wg)A(7,-T-27-bb,4,26,wg,'f');}
    else if(a<.3){A(3,-T-36,2,22,wc,'n');A(1,-T-16,6,2,trim,'n');}
    else if(a<.7){A(6,-T-12,24,3,wc,'n');A(6,-T-12,24,1,'#ffffff','n');A(4,-T-14,2,7,trim,'n');A(10,-T-22,20,2,'rgba(255,255,255,.55)','f');A(14,-T-6,14,2,'rgba(255,255,255,.35)','f');if(wg)A(8,-T-14,24,7,wg,'f');}
    else{A(6,-T-4,18,2,wc,'n');A(4,-T-6,2,6,trim,'n');}
  }else if(o.w===1){
    A(8,-T-32-bb,2,T+32,'#7a5230','n');A(8,-T-32-bb,1,T+32,'#9a7040','n');for(let i=0;i<4;i++)A(7,-T-24+i*8-bb,4,1,'#5a3a1a','n');
    const oc=o.orb||'#fff3a0',dk=oc==='#c070ff';A(6,-T-38-bb,6,6,oc,'n');A(7,-T-37-bb,2,2,'#ffffff','n');
    if(att)A(2,-T-44,14,14,dk?'rgba(210,122,255,.45)':'rgba(255,246,176,.45)','f');else A(4,-T-40-bb,10,10,dk?'rgba(210,122,255,.2)':'rgba(255,246,176,.2)','f');
  }else if(o.w===2){
    const bw=o.wcol||'#9a6a32';
    Au(9,-T-22,2,5,bw,'n');Au(10,-T-17,2,14,bw,'n');Au(9,-T-4,2,5,bw,'n');
    if(att&&a<.5){A(3,-T-12,12,1,'#d8c8a0','n');A(2,-T-13,1,3,'#a33','n');A(5,-T-12,1,1,'#ccc','n');A(8,-T-21,1,19,'#eee','n');}
    else if(!att)Au(8,-T-21,1,19,'#eee','n');
    if(att&&a>=.5)A(8,-T-21,1,19,'#eee','n');
  }else if(o.w===4){
    Au(8,-T-9,8,2,'#cfd6e0','n');Au(7,-T-10,2,4,'#4a3020','n');if(att&&a>.25&&a<.75)A(10,-T-16,12,2,'rgba(255,255,255,.55)','f');
  }
  return P0;
}
function drawPerson(x,y,face,o,k){shadowAt(Math.round(x),Math.round(y),14);drawBevel(personParts(o),x,y,face,{bevel:true,k:k||1,white:o.hurt>0&&Math.floor(S.t*30)%2});}
function blightParts(e,def){
  const P0=[],A=(x,y,w,h,c,f)=>P0.push([x,y,w,h,c,f]);
  const hit=e.hurt>0,body=def.big?'#38501e':'#3f5a22',dk=sh(body,-.35),lt=sh(body,.2),st=e.mv?Math.floor(S.t*8+e.t*3)%2:0,wd=e.wind>0;
  A(-9,-12,16,8,body);A(-9,-12,16,2,lt);A(-9,-6,16,2,dk);A(5,-13,6,9,body);
  A(8,-17+(wd?-2:0),9,8,body);A(8,-17+(wd?-2:0),9,2,lt);A(14,-13+(wd?-2:0),6,4,body);
  A(13,-9+(wd?1:0),7,2,dk);A(14,-10+(wd?1:0),1,2,'#fff');A(17,-10+(wd?1:0),1,2,'#fff');
  A(12,-15+(wd?-2:0),2,2,wd?'#ff3a2a':'#e8ff4a');A(9,-20+(wd?-2:0),3,4,dk);A(12,-19+(wd?-2:0),2,3,dk);
  A(-8,-16,2,4,'#26381a');A(-4,-17,2,5,'#26381a');A(0,-16,2,4,'#26381a');
  A(-14,-11,6,2,dk);A(-15,-12,2,2,dk);
  A(5,-5+(st?-1:0),3,5,dk);A(1,-5+(st?0:-1),3,5,dk);A(-8,-5+(st?0:-1),3,5,dk);A(-4,-5+(st?-1:0),3,5,dk);
  A(-3,-13,3,3,'#9acd32');A(2,-11,2,2,'#c8e060');A(-6,-9,2,2,'#9acd32');
  return P0;
}
function drawRat(e,px,py,hit){
  px=Math.round(px);const f=e.face>=0?1:-1,st=e.mv?Math.floor(S.t*14+e.t*3)%2:0;
  const Q=(dx,dy,w,h,c)=>R(f>0?px+dx:px-dx-w,py+dy,w,h,hit?'#fff':c);
  shadowAt(px,py,9);
  Q(-12,-4,7,1,'#c49a8a');Q(-17,-6+st,5,1,'#c49a8a');Q(-19,-8+st,2,2,'#c49a8a'); // tail
  Q(-7,-7,13,6,'#6b5a4c');Q(-7,-7,13,2,'#8a7462');Q(-7,-3,13,2,'#4a3c32');Q(-5,-9,8,2,'#7a6656'); // body
  Q(5,-8,6,5,'#7a6656');Q(10,-6,3,3,'#9a7a6a');Q(12,-6,1,1,'#e89aa0');Q(7,-11,3,3,'#b08a7a');Q(8,-10,1,1,'#e8b0b0'); // head, ear
  Q(8,-7,1,1,e.wind>0?'#ff3a2a':'#2a1a1a');Q(11,-4,3,1,'#ddd');Q(11,-6,4,1,'rgba(255,255,255,.5)'); // eye, whiskers
  Q(-5,-2+(st?-1:0),2,3,'#3a2e28');Q(-1,-2+(st?0:-1),2,3,'#3a2e28');Q(3,-2+(st?-1:0),2,3,'#3a2e28');Q(7,-2+(st?0:-1),2,3,'#3a2e28');
}
function drawRegionCreature(e,px,py,def){
  px=Math.round(px);py=Math.round(py);
  if(def.creature==='wisp'){
    const b=Math.sin(S.t*5+e.t*2)*3,cy=py-34+b;
    const gr=g.createRadialGradient(px,cy,1,px,cy,24);
    gr.addColorStop(0,'rgba(178,245,213,.65)');gr.addColorStop(1,'rgba(61,196,185,0)');
    g.fillStyle=gr;g.fillRect(px-25,cy-25,50,50);
    R(px-8,cy-11,16,21,'#5db1aa');R(px-5,cy-16,10,24,'#a1e6d1');
    R(px-3,cy-15,6,13,'#e3fcdb');R(px-10,cy+9,5,5,'#6c998d');
    R(px+4,cy+11,3,6,'#90c7ad');R(px-3,cy+13,2,8,'#d4f7db');
    for(let i=0;i<3;i++){const dx=Math.sin(S.t*3+i*2+e.t)*18,dy=Math.cos(S.t*4+i*3)*12;R(px+dx,cy+dy,2,2,'#d5f9dd');}
  }else{
    // The bog lurker has a broad squat body, low stalking legs and reeds on
    // its moss-covered shell: visually unlike a wolf, rat or soldier.
    const bob=e.mv?(Math.floor(S.t*9+e.t)%2):0;
    const face=e.face>=0?1:-1;
    const Q=(dx,dy,w,h,col)=>R(face>0?px+dx:px-dx-w,py+dy-bob,w,h,col);
    shadowAt(px,py,24);
    Q(-22,-24,42,18,'#36534c');Q(-19,-27,38,8,'#608067');
    Q(-16,-35,25,11,'#4c6758');Q(-4,-38,13,7,'#526f5b');
    Q(10,-22,17,15,'#405b57');Q(23,-18,10,6,'#658974');
    Q(23,-16,3,2,'#f4d47e');Q(26,-12,4,2,'#dfd8b8');
    Q(-20,-10,9,12,'#344b41');Q(11,-10,9,12,'#344b41');
    Q(-16,-2,6,3,'#7e8268');Q(14,-2,6,3,'#7e8268');
    for(let i=0;i<5;i++){const sx=-16+i*8;Q(sx,-33-i%2*7,2,10+i%3*5,'#749b67');}
    if(e.wind>0)Q(20,-22,5,3,'#f3b14f');
  }
}
function drawEnemy(e,cam,def){
  const px=e.x-cam,py=GY,k=def.k||1,hit=e.hurt>0&&Math.floor(S.t*30)%2;
  if(def.rat){drawRat(e,px,py,hit);return;}
  if(def.creature){drawRegionCreature(e,px,py,def);return;}
  if(def.h){const o={...def.sp,mv:e.mv,ph:e.t,w:def.w,atk:e.atkA>0?e.atkA:0};shadowAt(Math.round(px),py,14);
    drawBevel(personParts(o),px,py,e.face,{bevel:true,white:hit});
    // Faction equipment gives the new humanoid archetypes readable silhouettes.
    const f=e.face>=0?1:-1;
    if(def.weapon==='spear'){R(px+f*14-1,py-66,3,62,'#b2a08b');R(px+f*14-3,py-72,7,9,'#d1dae1');}
    else if(def.weapon==='crossbow'){R(px+f*11-8,py-27,26,5,'#7d6243');R(px+f*13-3,py-30,11,10,'#b4a28a');R(px+f*14,py-28,3,18,'#d0d4ce');}
    else if(def.weapon==='torch'){R(px+f*12,py-43,3,23,'#a58a61');R(px+f*11-3,py-48,10,8,'#e47f32');R(px+f*12,py-52-Math.sin(S.t*9)*3,6,8,'#f3bd55');}
    else if(def.weapon==='sapper'){R(px-15,py-30,13,16,'#7e7157');R(px-13,py-27,9,4,'#d7aa6b');R(px+f*12,py-36,12,4,'#9e9c9c');}
    else if(def.weapon==='shield'){R(px+f*12-8,py-33,15,25,'#a0a4b2');R(px+f*12-5,py-29,9,17,'#4b5267');R(px+f*12-2,py-24,4,7,'#ddc18b');}
    else if(def.weapon==='staff'){R(px+f*14,py-50,3,40,'#69618d');R(px+f*11,py-59,9,12,'#ae87cc');R(px+f*13,py-55,5,6,'#e9d4fd');}

    if(e.wind>0)R(px-3,py-52,6,2,'#ff3a2a');
    return;}
  shadowAt(Math.round(px),py,Math.round(22*k));
  drawBevel(blightParts(e,def),px,py,e.face,{bevel:true,k,white:hit});
}
function drawChest(x,open,t){x=Math.round(x);const y=GY;shadowAt(x,y,16);
  const c='#7a4a22',cd='#5a3416',m='#c9a24a';
  R(x-8,y-8,16,8,cd);R(x-8,y-8,16,2,c);R(x-8,y-8,1,8,'#33200c');R(x+7,y-8,1,8,'#33200c');R(x-8,y-5,16,1,m);R(x-1,y-6,3,4,m);
  if(open){R(x-8,y-14,16,6,c);R(x-8,y-14,16,1,m);R(x-6,y-12,12,2,'#ffe27a');R(x-3,y-22-Math.sin(t*4)*2,6,6,'rgba(255,240,150,.5)');}
  else{R(x-8,y-12,16,4,c);R(x-8,y-12,16,1,sh(c,.3));R(x-8,y-12,16,4,'rgba(0,0,0,0)');R(x-8,y-9,16,1,m);R(x-1,y-10,3,3,m);}
}
