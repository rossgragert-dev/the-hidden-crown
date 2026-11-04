/* ================= HORSE ENTITY (v0.6.1) =================
   The horse is authored as a small vector rig (articulated legs, neck, head, mane,
   tail, tack) and baked into crisp palette-true pixel frames that are cached.
   One rig serves Halvard's warhorse, the groomable stable horse, ambient mounts and
   Corin's future mount. Rider attachment points come from the pose, so riders and
   lances stay locked to the saddle in every gait.
   Local space: feet at y=0 (ground), +x forward, y negative = up, origin under saddle. */
const HCOATS={
 charger:{c:'#a4adb8',d:'#737c88',l:'#d2d8de',mane:'#f0f2f5',hoof:'#3a3138',blaze:1,socks:0,dapple:1},
 bay:{c:'#80482a',d:'#522e1c',l:'#aa6a3c',mane:'#241a1c',hoof:'#2a2024',blaze:0,socks:1},
 chestnut:{c:'#a85a2c',d:'#733b1b',l:'#cf8248',mane:'#e2c892',hoof:'#3a2a22',blaze:1,socks:2},
 black:{c:'#3a3842',d:'#1e1d25',l:'#5e5b6a',mane:'#121116',hoof:'#18161b',blaze:0,socks:0},
 palomino:{c:'#d6aa5c',d:'#a47c3a',l:'#eecb84',mane:'#f6ecd2',hoof:'#4a3a2a',blaze:1,socks:0}
};
const HLIV={
 hearth:{a:'#2f5fd0',b:'#e8b84a',e:'cross'},vale:{a:'#6a2a9a',b:'#ece4d2',e:'chev'},
 thorn:{a:'#2f7a3c',b:'#f0e8c0',e:'band'},crimson:{a:'#b0302e',b:'#f0e0b0',e:'diag'}
};
const HGAIT={idle:{n:10,stride:0,lift:0,duty:1},walk:{n:12,stride:15,lift:5,duty:.64},trot:{n:10,stride:21,lift:8,duty:.5},
 canter:{n:12,stride:27,lift:10,duty:.42},gallop:{n:12,stride:34,lift:12,duty:.34},charge:{n:12,stride:36,lift:12,duty:.33},
 halt:{n:6,stride:0,lift:0,duty:1},recoil:{n:8,stride:0,lift:0,duty:1},groom:{n:10,stride:0,lift:0,duty:1}};
const HPH={walk:{bl:0,fl:.25,br:.5,fr:.75},trot:{fl:0,br:0,fr:.5,bl:.5},canter:{bl:0,br:.14,fl:.34,fr:.46},gallop:{bl:0,br:.12,fl:.3,fr:.42},charge:{bl:0,br:.12,fl:.3,fr:.42}};
// Speed in px/s -> gait name; used by the joust engine and by roaming horses.
/* Free-riding speeds (px/s). 'canter' sits inside gaitForSpeed's canter band (95-150) so holding forward really reaches it. */
const MOUNT_CFG={canter:124,accel:1.3,canterHold:1.0};
function gaitForSpeed(v){v=Math.abs(v);return v<8?'idle':v<50?'walk':v<95?'trot':v<150?'canter':'gallop';}
// Stride cycles per second for a gait at a given speed (keeps hooves roughly planted).
function strideRate(gait,v){const g=HGAIT[gait];if(!g||!g.stride)return 1.1;return clamp(Math.abs(v)/(g.stride*1.35),.7,5.2);}

function ik2(hx,hy,fx,fy,a,b,bend,straight){
  let dx=fx-hx,dy=fy-hy,d=Math.hypot(dx,dy)||1;const m=a+b-.05;
  if(d>m){const k=m/d;dx*=k;dy*=k;d=m;fx=hx+dx;fy=hy+dy;}
  const x=(d*d+a*a-b*b)/(2*d),h=Math.sqrt(Math.max(0,a*a-x*x)),ux=dx/d,uy=dy/d;
  let kx=hx+ux*x-uy*h*bend,ky=hy+uy*x+ux*h*bend;
  if(straight){const mx=hx+dx/2,my=hy+dy/2;kx=lerp(kx,mx,straight);ky=lerp(ky,my,straight);}
  return {kx,ky,fx,fy};
}
function footPos(gp,p,hipX){
  if(!gp.stride)return {x:hipX,y:0};
  const a=gp.stride*.9;
  if(p<gp.duty){const u=p/gp.duty;return {x:hipX+a*(.5-u)+gp.stride*.06,y:0,st:1};}
  const u=(p-gp.duty)/(1-gp.duty),e=u<.5?2*u*u:1-2*(1-u)*(1-u);
  return {x:hipX+a*(-.5+e)+gp.stride*.06,y:-gp.lift*Math.sin(Math.PI*Math.min(1,u*1.05)),st:0};
}
function horsePose(gait,ph){
  const gp=HGAIT[gait]||HGAIT.idle,T=Math.PI*2,s=Math.sin(ph*T);
  let bob=0,pitch=0,an=33,ah=118,tail=.05,ear=0,wind=0;
  switch(gait){
   case 'idle':bob=s*.45;an=32+s*1.2;ah=118+s*2;tail=.05+Math.sin(ph*T*.5)*.06;ear=Math.sin(ph*T*2)*.5;break;
   case 'walk':bob=-Math.abs(Math.sin(ph*T))*.9;an=36+s*3;ah=114+s*3;tail=.14+s*.05;break;
   case 'trot':bob=-Math.abs(Math.sin(ph*T*2))*1.5;an=40;ah=110+s*1.5;tail=.3+s*.06;wind=.3;break;
   case 'canter':bob=-(1-Math.cos(ph*T))*.9;pitch=s*1.3;an=47+s*2;ah=106;tail=.55;wind=.55;break;
   case 'gallop':bob=-(1-Math.cos(ph*T))*1.2;pitch=s*2;an=54+s*3;ah=101;tail=.9;wind=.85;ear=-1;break;
   case 'charge':bob=-(1-Math.cos(ph*T))*1.1;pitch=s*1.6;an=62;ah=96;tail=1;wind=1;ear=-1.5;break;
   case 'halt':bob=0;an=30;ah=121;tail=.2;ear=0;break;
   case 'recoil':bob=-1.2;pitch=-3*(1-ph);an=18+ph*12;ah=142-ph*24;tail=.55;wind=.4;ear=-2;break;
   case 'groom':bob=s*.3;an=50+s*5;ah=146+s*4;tail=.1+s*.1;ear=s;break;
  }
  const yW=-42+bob-pitch,yC=-41+bob+pitch,offs=HPH[gait]||{bl:0,fl:0,br:0,fr:0};
  const hips={fl:[15,yW+17],fr:[12,yW+17],bl:[-21,yC+14],br:[-18,yC+14]},legs={};
  for(const k of ['fl','fr','bl','br']){
    const front=k[0]==='f',hp=hips[k];
    const fp=footPos(gp,((ph+(offs[k]||0))%1+1)%1,hp[0]+(front?2:-2));
    let fx=fp.x,fy=fp.y;
    if(gait==='recoil'&&front){fx=hp[0]+9-ph*4;fy=0;}
    if(gait==='groom'&&k==='fr'){fx=hp[0]+8;fy=-7-Math.max(0,s)*3;}
    const kn=ik2(hp[0],hp[1],fx,fy,16,16,front?-1:1,fp.st||!gp.stride?.55:.15);
    legs[k]={hx:hp[0],hy:hp[1],kx:kn.kx,ky:kn.ky,fx:kn.fx,fy:kn.fy};
  }
  return {yW,yC,yS:-39.5+bob,an,ah,tail,ear,wind,legs,seat:{x:-4,y:-39.5+bob},stir:{x:4,y:-22.5+bob}};
}
function horseVec(ctx,v,tk,L,P,st){
  const c=st.dirty?mix(v.c,'#6a5a46',.28):v.c,d=st.dirty?mix(v.d,'#4a3c30',.3):v.d,l=st.dirty?mix(v.l,'#8a7a62',.3):v.l;
  const poly=(pts,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill();};
  const seg=(a,b,w,col)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const leg=(lg,col,hi,far)=>{
    seg([lg.hx,lg.hy],[lg.kx,lg.ky],far?4.6:5.4,col);seg([lg.kx,lg.ky],[lg.fx,lg.fy-2.4],far?2.7:3.1,col);
    if(!far){seg([lg.hx+.7,lg.hy+1.5],[lg.kx+.5,lg.ky],1.2,hi);}
    if(v.socks&&lg.fy>-30){seg([lg.kx*.35+lg.fx*.65,lg.ky*.35+(lg.fy-2.4)*.65],[lg.fx,lg.fy-2.4],2.7,'#efeee8');}
    ctx.fillStyle=far?sh(v.hoof,-.15):v.hoof;ctx.fillRect(lg.fx-1.9,lg.fy-2.5,4,2.5);
    if(st.dirty){ctx.fillStyle='rgba(70,52,34,.55)';ctx.fillRect(lg.fx-2,lg.fy-5,4,3);}
  };
  leg(P.legs.fr,d,l,1);leg(P.legs.br,d,l,1);
  // body
  const yW=P.yW,yC=P.yC,yS=P.yS,yB=-22+(yW+yC+80)/2;
  const body=()=>{ctx.beginPath();ctx.moveTo(12,yW);ctx.quadraticCurveTo(4,yS-1,-4,yS);ctx.quadraticCurveTo(-14,yS-1,-22,yC);
    ctx.quadraticCurveTo(-32,yC+1,-31,yC+11);ctx.quadraticCurveTo(-31,yC+20,-24,yB-2);ctx.quadraticCurveTo(-12,yB+2,2,yB+1);
    ctx.quadraticCurveTo(14,yB,22,yB-5);ctx.quadraticCurveTo(30,yB-12,28,yW+11);ctx.quadraticCurveTo(24,yW+2,12,yW);ctx.closePath();};
  ctx.fillStyle=c;body();ctx.fill();
  ctx.save();body();ctx.clip();
  ctx.fillStyle=d;ctx.globalAlpha=.55;ctx.fillRect(-34,yB-6,70,20);ctx.globalAlpha=1;
  ctx.fillStyle=l;ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(-2,yS+1,22,4.5,0,0,7);ctx.fill();ctx.globalAlpha=.4;
  ctx.beginPath();ctx.ellipse(16,yW+10,7,9,.3,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-21,yC+9,8,10,-.2,0,7);ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle=d;ctx.lineWidth=1;ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(-13,yC+4);ctx.quadraticCurveTo(-9,yC+14,-15,yC+19);ctx.moveTo(8,yW+4);ctx.quadraticCurveTo(12,yW+12,9,yW+19);ctx.stroke();ctx.globalAlpha=1;
  if(v.dapple){const r=mkr(77);ctx.fillStyle=l;ctx.globalAlpha=.5;for(let i=0;i<22;i++){const x=-28+r()*54,y=yW+2+r()*20;ctx.beginPath();ctx.arc(x,y,1.1+r()*.8,0,7);ctx.fill();}
    ctx.fillStyle=d;ctx.globalAlpha=.28;for(let i=0;i<14;i++){const x=-28+r()*54,y=yW+3+r()*20;ctx.beginPath();ctx.arc(x,y,1+r()*.8,0,7);ctx.fill();}ctx.globalAlpha=1;}
  if(st.dirty){ctx.fillStyle='rgba(76,56,36,.5)';const r=mkr(5);for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(-26+r()*50,yB-9+r()*12,1.6+r()*1.4,0,7);ctx.fill();}ctx.fillStyle='#c9a85a';for(let i=0;i<5;i++)ctx.fillRect(-24+r()*46,yS+4+r()*14,3,.8);}
  ctx.restore();
  // near legs
  leg(P.legs.fl,c,l,0);leg(P.legs.bl,c,l,0);
  // neck + head
  const an=P.an*Math.PI/180,ah=P.ah*Math.PI/180,ax=Math.sin(an),ay=-Math.cos(an),nx=-ay,ny=ax;
  const W0=[12,yW],th=[27,yW+12],Ln=19,N1=[17+Ln*ax,yW+9+Ln*ay],crestTop=[N1[0]-nx*3.9,N1[1]-ny*3.9],throatTop=[N1[0]+nx*3.9,N1[1]+ny*3.9];
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(W0[0]-2,W0[1]+2);ctx.quadraticCurveTo((W0[0]+crestTop[0])/2-nx*3,(W0[1]+crestTop[1])/2-ny*3,crestTop[0],crestTop[1]);
  ctx.lineTo(throatTop[0],throatTop[1]);ctx.quadraticCurveTo((th[0]+throatTop[0])/2+nx*1.5,(th[1]+throatTop[1])/2+ny*1.5,th[0],th[1]);ctx.lineTo(18,yW+14);ctx.closePath();ctx.fill();
  ctx.fillStyle=d;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(throatTop[0],throatTop[1]);ctx.lineTo(th[0],th[1]);ctx.lineTo(th[0]-3,th[1]-1);ctx.lineTo(throatTop[0]-1.5*nx,throatTop[1]-1.5*ny);ctx.fill();ctx.globalAlpha=1;
  const hx=Math.sin(ah),hy=-Math.cos(ah),hpx=-hy,hpy=hx,Lh=17,P0=[N1[0]+ax*.6,N1[1]+ay*.6];
  const at=(t,w)=>[P0[0]+hx*t+hpx*w,P0[1]+hy*t+hpy*w];
  const headPts=[at(-1.5,-3),at(Lh*.5,-3.4),at(Lh,-2.2),at(Lh+.6,.8),at(Lh,2.6),at(Lh*.62,3.6),at(5,5.2),at(-1.2,3.6)];
  poly(headPts,c);
  ctx.save();ctx.beginPath();headPts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
  ctx.fillStyle=d;ctx.globalAlpha=.45;poly([at(2,3),at(Lh,1.5),at(Lh,4),at(2,6)],d);ctx.globalAlpha=.5;ctx.fillStyle=l;poly([at(-1,-3.2),at(Lh*.6,-3.5),at(Lh*.6,-1.6),at(0,-1.2)],l);ctx.globalAlpha=1;ctx.restore();
  if(v.blaze)seg(at(1.5,-1.5),at(Lh*.92,-.2),1.5,'#f2f1eb');
  // ears
  const ea=an-.15+P.ear*.16;const ex=Math.sin(ea),ey=-Math.cos(ea);
  poly([[P0[0]-nx*1.5+1,P0[1]-ny*1.5],[P0[0]-nx*1.5+ex*5.2+1.4,P0[1]-ny*1.5+ey*5.2],[P0[0]-nx*1.5+3.4,P0[1]-ny*1.5+.4]],d);
  poly([[P0[0]-nx*2.8,P0[1]-ny*2.8],[P0[0]-nx*2.8+ex*5.6,P0[1]-ny*2.8+ey*5.6],[P0[0]-nx*2.8+2.8,P0[1]-ny*2.8+.2]],c);
  // eye, nostril, mouth
  const e0=at(Lh*.34,-.6);ctx.fillStyle='#17101a';ctx.beginPath();ctx.arc(e0[0],e0[1],1.05,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(e0[0]-.2,e0[1]-.8,.7,.7);
  const nz=at(Lh*.96,-.9);ctx.fillStyle='#2a1a1c';ctx.fillRect(nz[0]-.4,nz[1],1.2,1);
  seg(at(Lh*.7,2.3),at(Lh*.97,1.6),.7,'#3a2a2c');
  // mane + forelock
  ctx.globalAlpha=1;const cw=P.wind;
  for(let i=0;i<9;i++){const t=i/8,p=[lerp(crestTop[0],W0[0],t)-nx*(1.2+(1-t)*.4),lerp(crestTop[1],W0[1],t)-ny*(1.2+(1-t)*.4)];
    seg(p,[p[0]-1.2-cw*3.4*(.5+t*.5),p[1]+2.6+t*1.2-cw*.7],2.8,v.mane);seg([p[0],p[1]],[p[0]-.6-cw*1.6,p[1]+1.2],1.6,sh(v.mane,.18));}
  seg(at(-1,-3.4),at(4.2,-4.4),2.4,v.mane);
  // tail
  const tb=[-30,yC+3],f=P.tail,sw=Math.sin(P.yC*3.1)*.6,tc=[tb[0]-4-8*f,tb[1]+9-8*f],te=[tb[0]-2-17*f+sw,tb[1]+24-21*f];
  ctx.lineCap='round';ctx.strokeStyle=v.mane;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(tb[0],tb[1]);ctx.quadraticCurveTo(tc[0],tc[1],te[0],te[1]);ctx.stroke();
  ctx.strokeStyle=sh(v.mane,.16);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(tb[0]-.8,tb[1]+1);ctx.quadraticCurveTo(tc[0]-.8,tc[1],te[0]-.6,te[1]-1);ctx.stroke();
  // ---- tack ----
  const bit=at(Lh*.97,2.3);P.bit={x:bit[0],y:bit[1]};
  const strapC='#4a2e1c',brass='#d8b050';
  if(tk==='halter'||tk==='blanket'||tk==='saddled'||tk==='tourney'||tk==='knight'||tk==='stable'){
    const rope=tk==='stable'||tk==='halter';
    seg(at(1,-3.2),at(4.5,4.8),1.1,rope?'#c9ad74':strapC);seg(at(Lh*.66,-2.4),at(Lh*.66,3),1.2,rope?'#c9ad74':strapC);seg(at(4.5,4.8),at(Lh*.66,3),.9,rope?'#c9ad74':strapC);
    if(!rope){seg(at(Lh*.97,-1.5),bit,.9,strapC);ctx.fillStyle=brass;ctx.fillRect(bit[0]-.9,bit[1]-.9,1.8,1.8);}
    else{ctx.fillStyle='#b0903e';ctx.fillRect(at(Lh*.66,3)[0]-.8,at(Lh*.66,3)[1]-.8,1.6,1.6);}
  }
  if(tk==='blanket'||tk==='saddled'||tk==='tourney'||tk==='knight'||tk==='stable'){
    const kn=tk==='tourney'||tk==='knight',pad=kn?L.a:tk==='stable'?'#7a2f2f':tk==='saddled'?'#6a5440':'#3a5a8a',trim=kn?L.b:tk==='saddled'?'#b0a07a':'#d8c08a';
    if(kn){ // caparison: heraldic cloth over the barrel with scalloped hem
      const hem=yB+(tk==='knight'?2:6);ctx.fillStyle=pad;ctx.beginPath();ctx.moveTo(-26,yC+3);ctx.quadraticCurveTo(-4,yS-3,11,yW+1);ctx.lineTo(25,yW+10);ctx.lineTo(26,hem-3);
      if(tk==='knight'){ctx.lineTo(-26,hem+1);}else{for(let i=0;i<8;i++){const x=26-i*7.4;ctx.lineTo(x-3.7,hem+3);ctx.lineTo(x-7.4,hem-.5);}}ctx.lineTo(-30,yC+12);ctx.closePath();ctx.fill();
      ctx.fillStyle=trim;ctx.fillRect(-30,hem-4,57,1.8);
      if(tk==='knight')ctx.fillRect(-26,hem+.5,52,1.4);
      if(tk==='tourney')for(let i=0;i<8;i++){const x=26-i*7.4;ctx.beginPath();ctx.moveTo(x,hem-1);ctx.lineTo(x-3.7,hem+3);ctx.lineTo(x-7.4,hem-1);ctx.fillStyle=trim;ctx.fill();}
      ctx.fillStyle=trim;
      if(L.e==='cross'){ctx.fillRect(-8,yS+6,3.2,14);ctx.fillRect(-13.5,yS+10.5,14.4,3.2);}
      else if(L.e==='chev'){ctx.beginPath();ctx.moveTo(-14,yS+8);ctx.lineTo(-7,yS+16);ctx.lineTo(0,yS+8);ctx.lineTo(0,yS+11);ctx.lineTo(-7,yS+19);ctx.lineTo(-14,yS+11);ctx.fill();}
      else if(L.e==='band'){ctx.fillRect(-16,yS+9,18,3);ctx.fillRect(-16,yS+15,18,3);}
      else{ctx.beginPath();ctx.moveTo(-14,yS+19);ctx.lineTo(-4,yS+8);ctx.lineTo(0,yS+11);ctx.lineTo(-10,yS+22);ctx.fill();}
      // peytral (chest cloth) and steel chamfron with plume
      ctx.fillStyle=pad;ctx.beginPath();ctx.moveTo(23,yW+6);ctx.lineTo(31,yW+14);ctx.lineTo(25,yB-2);ctx.lineTo(19,yW+12);ctx.fill();ctx.fillStyle=trim;ctx.fillRect(26,yW+14,3,1.4);
      poly([at(.6,-3.1),at(Lh*.55,-3.5),at(Lh*.8,-2.5),at(Lh*.55,-.2),at(1.2,-.4)],'#b9c1cc');seg(at(2,-1.8),at(Lh*.7,-2),.9,'#e8edf3');
      ctx.fillStyle=L.a;ctx.beginPath();ctx.ellipse(P0[0]-nx*3+ex*5,P0[1]-ny*3+ey*5,1.6,4,ea,0,7);ctx.fill();
    }else{
      ctx.fillStyle=pad;ctx.beginPath();ctx.moveTo(-14,yS-1);ctx.lineTo(8,yS-1);ctx.lineTo(10,yS+17);ctx.lineTo(-16,yS+17);ctx.fill();ctx.fillStyle=trim;ctx.fillRect(-16,yS+15,26,1.6);
    }
    if(tk!=='stable'){ // tournament saddle
      poly([[-11,yS-1],[-12.5,yS-8],[-9,yS-9],[-5,yS-2.5],[2,yS-2.5],[6,yS-6.5],[9,yS-5],[8,yS+1]],'#5d3b24');
      ctx.fillStyle=brass;ctx.fillRect(-11,yS-7,1.2,1.2);ctx.fillRect(7,yS-5,1.2,1.2);
      seg([-2,yS+1],[P.stir.x,P.stir.y-2],.9,strapC);ctx.strokeStyle='#cfd6df';ctx.lineWidth=1;ctx.strokeRect(P.stir.x-2,P.stir.y-2,4,3.4);
      seg([0,yS+3],[0,yB+8],1.1,'#3a2418');
    }
  }
  if(st.groomed){ctx.fillStyle='rgba(255,255,255,.32)';ctx.beginPath();ctx.ellipse(-3,yS+2,16,1.6,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(15,yW+9,3,5,.3,0,7);ctx.fill();}
  return P;
}
const HCACHE=new Map();
function bakeHorse(vn,tk,liv,gait,fr,st){
  const K=4,BW=116,BH=84,ox=52,oy=78,hc=document.createElement('canvas');hc.width=BW*K;hc.height=BH*K;
  const cx=hc.getContext('2d',{willReadFrequently:true});cx.translate(ox*K,oy*K);cx.scale(K,K);
  const gp=HGAIT[gait]||HGAIT.idle,pose=horsePose(gait,fr/gp.n);
  horseVec(cx,HCOATS[vn]||HCOATS.charger,tk,HLIV[liv]||HLIV.hearth,pose,st||{});
  const src=cx.getImageData(0,0,BW*K,BH*K).data,oc=document.createElement('canvas');oc.width=BW;oc.height=BH;
  const o2=oc.getContext('2d'),img=o2.createImageData(BW,BH),d=img.data,al=new Uint8Array(BW*BH);
  for(let y=0;y<BH;y++)for(let x=0;x<BW;x++){const i=((y*K+2)*BW*K+(x*K+2))*4;if(src[i+3]>112){const j=(y*BW+x)*4;d[j]=src[i];d[j+1]=src[i+1];d[j+2]=src[i+2];d[j+3]=255;al[y*BW+x]=1;}}
  const A=(x,y)=>x>=0&&y>=0&&x<BW&&y<BH&&al[y*BW+x];
  const tint=(j,f)=>{const t=f<0?0:255,p=Math.abs(f);d[j]+=(t-d[j])*p;d[j+1]+=(t-d[j+1])*p;d[j+2]+=(t-d[j+2])*p;};
  const snap=d.slice();
  for(let y=0;y<BH;y++)for(let x=0;x<BW;x++)if(al[y*BW+x]){const j=(y*BW+x)*4;
    d[j]=snap[j];d[j+1]=snap[j+1];d[j+2]=snap[j+2];
    if(!A(x,y-1))tint(j,.26);else if(!A(x-1,y))tint(j,.12);
    if(!A(x,y+1))tint(j,-.38);else if(!A(x+1,y))tint(j,-.2);}
  o2.putImageData(img,0,0);
  return {c:oc,ox,oy,pose};
}
// h: {v:coat, tk:tack, liv:livery, gait, ph:0..1 stride phase, st:{dirty,groomed}}; returns world anchors.
function drawHorse(x,y,face,h){
  const gait=h.gait||'idle',gp=HGAIT[gait]||HGAIT.idle,nf=gp.n,fr=Math.floor((((h.ph||0)%1)+1)%1*nf)%nf,st=h.st||{};
  const key=[h.v||'charger',h.tk||'none',h.liv||'hearth',gait,fr,st.dirty?1:0,st.groomed?1:0].join('|');
  let f=HCACHE.get(key);if(!f){f=bakeHorse(h.v||'charger',h.tk||'none',h.liv||'hearth',gait,fr,st);HCACHE.set(key,f);}
  const px=Math.round(x),py=Math.round(y);
  R(px-30,py-1,60,3,'rgba(0,0,0,.26)');R(px-24,py+2,48,1,'rgba(0,0,0,.16)');
  if(face>0)g.drawImage(f.c,px-f.ox,py-f.oy);
  else{g.save();g.translate(px,py);g.scale(-1,1);g.drawImage(f.c,-f.ox,-f.oy);g.restore();}
  const P=f.pose;
  return {seat:{x:px+face*P.seat.x,y:py+P.seat.y},stir:{x:px+face*P.stir.x,y:py+P.stir.y},bit:{x:px+face*P.bit.x,y:py+P.bit.y},pose:P,face};
}
function prebakeHorse(vn,tk,liv,gaits){for(const g0 of gaits){const n=HGAIT[g0].n;for(let i=0;i<n;i++){const k=[vn,tk,liv,g0,i,0,0].join('|');if(!HCACHE.has(k))HCACHE.set(k,bakeHorse(vn,tk,liv,g0,i,{}));}}}

/* ---- pixel lines, lances and mounted riders ---- */
function pxLine(x0,y0,x1,y1,col,w){
  x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;w=w||1;g.fillStyle=col;
  for(let n=0;n<700;n++){g.fillRect(x0,y0,w,w);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
}
// Lance: grip at (gx,gy); ang in degrees below horizontal (positive = tip down); face = facing sign.
function drawLance(gx,gy,face,ang,o){
  o=o||{};const a=ang*Math.PI/180,dx=face*Math.cos(a),dy=Math.sin(a),front=o.broken?o.broken:62,back=o.back==null?18:o.back;
  const c1=o.c1||'#e8e0cc',c2=o.c2||'#2f5fd0';
  for(let t=-back;t<=front;t+=1){const x=gx+dx*t,y=gy+dy*t,stripe=Math.floor((t+40)/4)%2;
    g.fillStyle=stripe?c1:c2;const th=t<-6?3:2;g.fillRect(Math.round(x),Math.round(y),th,th);}
  if(o.broken){for(let k=0;k<4;k++){g.fillStyle='#d8c8a0';g.fillRect(Math.round(gx+dx*front+face*k*.7),Math.round(gy+dy*front-1+k%2*2),2,1);}}
  else{const tx=gx+dx*front,ty=gy+dy*front;g.fillStyle='#cfd6df';g.fillRect(Math.round(tx),Math.round(ty),3,2);g.fillStyle='#8a929c';g.fillRect(Math.round(tx+dx*2),Math.round(ty+dy*2),2,2);
    g.fillStyle='#fff';g.fillRect(Math.round(tx+dx*3),Math.round(ty+dy*3-1),1,1);}
  const vx=gx+dx*9,vy=gy+dy*9;g.fillStyle='#b9c1cc';g.fillRect(Math.round(vx-1),Math.round(vy-3),3,7);g.fillStyle='#e8edf3';g.fillRect(Math.round(vx-1),Math.round(vy-3),1,7);
  return {tip:{x:gx+dx*front,y:gy+dy*front},grip:{x:gx,y:gy}};
}
// Rider seated on a horse. rider: personParts options; lance: {ang,broken,none,c1,c2} or null.
function drawMounted(x,y,face,h,rider,lance){
  const a=drawHorse(x,y,face,h),ox=a.seat.x,oy=a.seat.y+17;
  const o=Object.assign({},rider,{mounted:1,mv:false});
  drawBevel(personParts(o),ox,oy,face,{bevel:true,k:1,white:rider&&rider.hurt>0&&Math.floor(S.t*30)%2});
  const hx=ox+face*7,hy=oy-19;
  if(a.bit){const sag=h.gait==='idle'?4:1;pxLine(a.bit.x,a.bit.y,hx-face*2,hy+3,'#4a2e1c',1);if(sag>1)pxLine(a.bit.x,a.bit.y+1,hx,hy+2,'#4a2e1c',1);}
  let tip=null;
  if(lance&&!lance.none){const r=drawLance(hx,hy,face,lance.ang==null?-12:lance.ang,lance);tip=r.tip;}
  return {a,hand:{x:hx,y:hy},tip};
}
