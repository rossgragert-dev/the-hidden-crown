/* Video-style sprites: chunky, no black outline, bevel highlights, thin legs, big pauldrons */
function drawBevel(pl,px,py,face,cfg){
  px=Math.round(px);py=Math.round(py);
  const rect=q=>{const w=Math.max(1,Math.round(q[2])),h=Math.max(1,Math.round(q[3])),x=face>0?px+Math.round(q[0]):px-Math.round(q[0])-w;return [x,py+Math.round(q[1]),w,h];};
  if(cfg.outline){g.fillStyle=cfg.outline;for(const q of pl){if(q[5]==='f')continue;const [x,y,w,h]=rect(q);g.fillRect(x-1,y-1,w+2,h+2);}}
  for(const q of pl){const [x,y,w,h]=rect(q);g.fillStyle=q[4];g.fillRect(x,y,w,h);
    if(q[5]==='f'||q[5]==='n'||!cfg.bevel)continue;
    if(w>=3&&h>=3){g.fillStyle=sh(q[4],cfg.hi||.42);g.fillRect(x,y,w,1);g.fillRect(x,y,1,h);g.fillStyle=sh(q[4],-.32);g.fillRect(x,y+h-1,w,1);g.fillRect(x+w-1,y+1,1,h-1);}}
}
function figV(o,cfg){
  const [P,A]=mkp();
  const col=o.col,cL=sh(col,.3),cLL=sh(col,.62),cD=sh(col,-.3),trim=o.trim||'#e8b84a',metal=o.metal||'#aeb8cc',mL=sh(metal,.35),skin=o.skin||'#f0c9a0',hair=o.hair||'#6b3f1f',boot=o.boot||'#4a3426',leg=o.leg||sh(metal,.25);
  const lh=cfg.legs,T=lh+4,bob=0;
  if(o.cape){A(-12,-T-14,5,T+10,o.cape);A(-12,-T-14,5,2,sh(o.cape,.35));A(-13,-5,6,4,sh(o.cape,-.3),'n');}
  // legs: thin and light
  A(-3,-lh,2,lh-3,leg,'n');A(2,-lh,2,lh-3,leg,'n');A(-4,-3,4,3,boot);A(1,-3,5,3,boot);
  // hips + torso
  A(-5,-T,10,5,cD);A(-4,-T,2,5,col,'n');A(1,-T,2,5,col,'n');
  A(-6,-T-12,12,12,col);A(-5,-T-11,4,5,cL,'n');A(0,-T-12,2,12,trim,'n');
  A(-6,-T-1,12,2,'#3a2a1a');A(-1,-T-1,3,2,trim,'n');
  if(o.tab){A(-3,-T+1,6,8,o.tab);A(-1,-T+3,2,4,'#f0f0f8','n');}
  // pauldrons
  A(-11,-T-15,9,8,cL);A(-11,-T-15,9,2,cLL,'n');A(-11,-T-8,9,1,cD,'n');A(-9,-T-13,3,2,trim,'n');
  A(3,-T-13,6,6,col);
  // arms
  A(5,-T-9,3,9,col);A(5,-T-1,3,3,metal);
  if(o.hands)A(5,-T-1,3,3,skin);
  // head
  const hy=T+12;
  if(cfg.head==='helm'){
    A(-4,-hy-8,8,8,o.helm||metal);A(-4,-hy-8,8,2,mL,'n');A(0,-hy-5,5,2,'#10141c');A(1,-hy-5,1,1,o.glow||'#5aff7a','n');A(3,-hy-5,1,1,o.glow||'#5aff7a','n');
    if(o.crest==='spikes'){A(-3,-hy-13,1,5,'#f4f0e0','n');A(1,-hy-13,1,5,'#f4f0e0','n');}
    else if(o.crest==='plume'){A(-4,-hy-12,6,4,o.crestC||'#c43a3a','n');A(-6,-hy-11,3,5,sh(o.crestC||'#c43a3a',-.2),'n');}
    else if(o.crest==='horns'){A(-5,-hy-12,2,5,'#e8e0c8','n');A(4,-hy-12,2,5,'#e8e0c8','n');}
    else if(o.crest==='hood'){A(-5,-hy-9,10,10,col);A(-5,-hy-9,10,2,cL,'n');A(0,-hy-6,5,5,'#0c0810');A(2,-hy-5,1,1,'#ffd04a','n');}
  }else if(cfg.head==='open'){
    A(-3,-hy-7,7,7,skin);A(-3,-hy-3,7,1,sh(skin,-.1),'n');A(2,-hy-5,1,2,'#fff','n');A(3,-hy-5,1,2,'#2a2a3a','n');A(2,-hy-2,2,1,'#b46a5a','n');
    if(o.helm){A(-4,-hy-10,8,5,o.helm);A(-4,-hy-10,8,1,mL,'n');A(-4,-hy-6,2,7,sh(o.helm,-.15));if(o.crest==='plume')A(-4,-hy-13,6,4,o.crestC||'#c43a3a','n');}
    else if(o.crest==='hood'){A(-5,-hy-10,10,11,col);A(-5,-hy-10,10,2,cL,'n');A(-3,-hy-7,7,7,skin);A(2,-hy-5,1,2,'#fff','n');A(3,-hy-5,1,2,'#2a2a3a','n');}
    else{A(-4,-hy-9,8,4,hair);A(-4,-hy-9,8,1,sh(hair,.35),'n');A(-4,-hy-6,2,7,hair);if(o.pony)A(-8,-hy-7,4,10,hair);}
    if(o.beard)A(-2,-hy-2,6,4,o.beard);
  }else if(cfg.head==='face'){
    const hw=cfg.hw||8,hh=hw,x0=-Math.floor(hw/2),ey=-hy-Math.round(hh*.62),ex=x0+hw-4,hc=o.helm||null;
    A(x0,-hy-hh,hw,hh,skin);A(x0+hw-2,-hy-hh+2,2,hh-3,sh(skin,.1),'n');A(x0,-hy-1,hw,1,sh(skin,-.2),'n');A(x0,-hy-4,1,2,sh(skin,-.14),'n');
    A(ex,ey,2,2,'#ffffff','n');A(ex+1,ey,1,2,o.iris||'#2a5aa8','n');A(ex+1,ey,1,1,'#0c0c14','n');A(ex-1,ey-1,4,1,sh(hair,-.2),'n');
    A(x0+hw,ey+2,1,2,sh(skin,-.1),'n');A(ex,ey+4,2,1,'#a8584a','n');A(ex-2,ey+3,1,1,'#e89a8a','n');
    if(hc){A(x0-1,-hy-hh-3,hw+2,5,hc);A(x0-1,-hy-hh-3,hw+2,1,mL,'n');A(x0-1,-hy-hh,2,hh-1,sh(hc,-.12));if(o.crest==='plume'){A(x0-2,-hy-hh-7,6,4,o.crestC||'#c43a3a','n');A(x0-4,-hy-hh-6,3,5,sh(o.crestC||'#c43a3a',-.2),'n');}if(o.crest==='horns'){A(x0-1,-hy-hh-7,2,5,'#e8e0c8','n');A(x0+hw-1,-hy-hh-7,2,5,'#e8e0c8','n');}}
    else if(o.crest==='hood'){A(x0-2,-hy-hh-3,hw+4,5,col);A(x0-2,-hy-hh-3,hw+4,1,cL,'n');A(x0-2,-hy-hh,3,hh+3,col);A(x0-2,-hy-hh,1,hh+3,cL,'n');A(x0+hw-2,-hy-hh-1,3,3,sh(col,-.2),'n');}
    else{A(x0-1,-hy-hh-2,hw+2,4,hair);A(x0-1,-hy-hh-2,hw+2,1,sh(hair,.4),'n');A(x0-1,-hy-hh+1,3,hh,hair);A(x0+hw-3,-hy-hh+1,3,1,hair,'n');if(o.pony)A(x0-5,-hy-hh,4,hh+3,hair);}
    if(o.beard){A(x0+1,-hy-3,hw-1,4,o.beard);A(x0+1,-hy-3,hw-1,1,sh(o.beard,.25),'n');A(ex,ey+4,2,1,'#a8584a','n');}
    if(o.scar)A(ex-1,ey+1,1,3,'#c06060','n');
  }else{ // big head
    A(-5,-hy-9,10,9,skin);A(-5,-hy-1,10,1,sh(skin,-.12),'n');A(2,-hy-6,3,3,'#1c1420','n');A(3,-hy-6,1,1,'#fff','n');A(3,-hy-2,2,1,'#c0786a','n');A(-3,-hy-4,2,1,'#e8806a','n');
    if(o.helm){A(-6,-hy-13,12,6,o.helm);A(-6,-hy-13,12,1,mL,'n');A(-6,-hy-8,3,9,sh(o.helm,-.15));if(o.crest==='plume')A(-5,-hy-17,7,4,o.crestC||'#c43a3a','n');}
    else if(o.crest==='hood'){A(-6,-hy-13,12,14,col);A(-6,-hy-13,12,2,cL,'n');A(-5,-hy-9,10,9,skin);A(2,-hy-6,3,3,'#1c1420','n');A(3,-hy-6,1,1,'#fff','n');}
    else{A(-6,-hy-12,12,6,hair);A(-6,-hy-12,12,1,sh(hair,.35),'n');A(-6,-hy-8,3,9,hair);if(o.pony)A(-10,-hy-9,4,11,hair);}
    if(o.beard)A(-3,-hy-3,8,5,o.beard);
  }
  // weapons (held forward)
  if(o.w===0){A(8,-T-26,2,24,'#eef2fa','n');A(8,-T-26,1,24,'#fff','n');A(6,-T-3,6,2,trim,'n');A(8,-T-1,2,3,'#4a3020','n');
    if(cfg.shield!==false){A(-13,-T-8,7,9,o.shield||'#2a4a9a');A(-13,-T-8,7,2,trim,'n');A(-11,-T-5,2,5,'#f0f0f8','n');}}
  else if(o.w===2){A(9,-T-22,2,5,'#9a6a32','n');A(10,-T-17,2,14,'#9a6a32','n');A(9,-T-4,2,5,'#9a6a32','n');A(8,-T-21,1,19,'#eee','n');A(-9,-T-18,3,10,'#6b4423');}
  return P;
}
const CASTV={
 halv:{iris:'#5a7aa8',col:'#4a6ab8',metal:'#b8c4d8',trim:'#e8b84a',tab:'#e8e8f2',beard:'#e6e6e6',hair:'#e6e6e6',cape:'#3a3a52',w:0,crest:'plume',crestC:'#e8e8f2',helm:'#b8c4d8',shield:'#4a6ab8',glow:'#5aff7a'},
 corin:{iris:'#2a5aa8',col:'#2f5fd0',metal:'#aeb8cc',trim:'#e8b84a',hair:'#6b3f1f',cape:'#b02a3a',w:0,crest:'spikes',tab:'#2f5fd0',glow:'#5aff7a'},
 lysa:{iris:'#2a8a4a',col:'#3f8a4e',metal:'#8a6a42',trim:'#c9a24a',hair:'#d0762d',pony:1,cape:'#2f6a3a',w:2,crest:'hood',leg:'#6a5a3a',glow:'#ffd04a'},
 reaver:{col:'#8a3a2a',metal:'#6a6e78',trim:'#d0802a',hair:'#222',cape:'#3a2a22',w:0,crest:'horns',glow:'#ff5a3a',helm:'#6a6e78',leg:'#3a3036',shield:'#5a2a1a',scar:1,iris:'#8a2a1a'}
};
const OPT={
 H2:{cfg:{legs:13,head:'face',hw:8,bevel:true},note:'H2'},
 H3:{cfg:{legs:12,head:'face',hw:10,bevel:true},note:'H3'},
 F:{cfg:{legs:10,head:'helm',bevel:true},note:'F - Order Knight (closest to video)'},
 G:{cfg:{legs:10,head:'helm',bevel:true,outline:'#12161f'},note:'G - Same, with dark outline'},
 H:{cfg:{legs:13,head:'open',bevel:true},note:'H - Taller, faces visible'},
 I:{cfg:{legs:7,head:'big',bevel:true},note:'I - Big head, chunky'}
};
