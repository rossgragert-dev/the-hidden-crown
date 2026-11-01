/* Character style experiments. Parts: [x,y,w,h,color,flag]. Feet at y=0, +x = forward. */
const mkp=()=>{const P=[];return [P,(x,y,w,h,c,f)=>P.push([x,y,w,h,c,f])];};
function drawPartsEx(pl,px,py,face,mode){
  px=Math.round(px);py=Math.round(py);
  const rx=(x,w)=>face>0?px+x:px-(x+w);
  for(const q of pl){if(q[5]==='f')continue;
    g.fillStyle=mode==='black'?'#17101a':mode==='sel'?sh(q[4],-.62):sh(q[4],-.5);
    g.fillRect(Math.round(rx(q[0],q[2]))-1,Math.round(py+q[1])-1,Math.round(q[2])+2,Math.round(q[3])+2);}
  for(const q of pl){g.fillStyle=q[4];g.fillRect(Math.round(rx(q[0],q[2])),Math.round(py+q[1]),Math.max(1,Math.round(q[2])),Math.max(1,Math.round(q[3])));}
}
/* ---- B: Heroic proportions (classic 16-bit RPG), black outline ---- */
function figB(o){const [P,A]=mkp();const col=o.col,cL=sh(col,.25),cD=sh(col,-.3),skin=o.skin||'#f0c9a0',hair=o.hair||'#6b3f1f',metal=o.look>=1?'#aab2c0':null,mD=metal&&sh(metal,-.25);
  if(o.cape){A(-11,-36,5,32,o.cape);A(-11,-36,1,32,sh(o.cape,.25));A(-12,-7,6,3,sh(o.cape,-.3));}
  A(-4,-18,4,13,'#3a3040');A(-5,-5,6,5,'#4a2e1a');A(-5,-5,6,1,'#7a5030');
  A(1,-18,4,13,'#463a52');A(0,-5,6,5,'#4a2e1a');A(0,-5,6,1,'#7a5030');
  if(metal){A(1,-13,4,3,metal);A(-4,-13,4,3,mD);}
  A(-6,-34,12,17,col);A(-6,-34,12,3,cL);A(3,-34,3,17,cD);
  if(metal){A(-5,-32,10,9,metal);A(-5,-32,10,2,sh(metal,.3));A(2,-32,3,9,mD);A(-1,-31,1,8,sh(metal,.15));}
  A(-6,-18,12,2,'#3a2412');A(-1,-18,3,2,'#e6c860');
  if(o.tab){A(-3,-16,6,13,o.tab);A(-3,-16,6,1,sh(o.tab,.3));A(-1,-13,2,6,'#e8e8f0');A(-2,-11,4,1,'#e8e8f0');}
  A(-9,-37,6,5,metal||cL);A(3,-37,6,5,metal||cL);A(-9,-37,6,1,'#ffffff');A(3,-37,6,1,'#ffffff');
  A(-8,-33,3,12,cD);A(5,-33,4,11,col);A(5,-33,4,2,cL);A(5,-23,4,4,metal||'#6a4a2a');A(5,-19,4,3,skin);
  A(-1,-39,3,3,sh(skin,-.12));A(-4,-48,8,10,skin);A(1,-44,2,2,'#fff');A(2,-44,1,2,'#2a4a8a');A(2,-40,2,1,'#b46a5a');
  if(o.helm){A(-5,-51,10,7,o.helm);A(-5,-51,10,1,'#ffffff');A(1,-46,5,1,'#222');A(-5,-45,2,8,o.helm);A(-2,-56,3,5,'#c43a3a');}
  else{A(-5,-50,10,4,hair);A(-5,-48,2,9,hair);A(-3,-50,6,1,sh(hair,.3));if(o.pony){A(-9,-47,4,13,hair);A(-9,-47,1,13,sh(hair,.3));}}
  if(o.beard)A(-3,-41,7,5,o.beard);
  if(o.hood){A(-5,-51,11,13,o.hood);A(0,-45,5,5,'#0c0810');}
  if(o.w===0){A(9,-52,2,26,'#e9eef5');A(9,-52,1,26,'#ffffff');A(6,-27,8,2,'#d6b04a');A(9,-25,2,4,'#5a3a1a');A(-12,-30,6,11,'#2a4a9a');A(-12,-30,6,1,'#e6c860');}
  else if(o.w===2){A(10,-48,2,5,'#8a5a2a');A(11,-43,2,18,'#8a5a2a');A(10,-25,2,5,'#8a5a2a');A(9,-47,1,26,'#ddd');A(-8,-40,3,13,'#6b4423');}
  return P;}
/* ---- C: Dark fantasy (hooded, gaunt, desaturated, one accent) ---- */
function figC(o){const [P,A]=mkp();const cl=o.cloak||sh(mix(o.col,'#303038',.7),-.1),cL=sh(cl,.2),cD=sh(cl,-.3),acc=o.accent||'#a8242e',sw=Math.sin(S.t*2)*1.2,skin=o.skin||'#d8b898';
  A(-9,-38,17,32,cl);A(-9,-38,3,32,cL);A(5,-38,3,32,cD);
  for(let i=0;i<6;i++)A(-9+i*3,-6,3,3+((i*7)%5),cl);
  A(-3,-7,3,7,'#26222a');A(1,-7,3,7,'#26222a');A(-4,-3,5,3,'#3a2a22');A(1,-3,5,3,'#3a2a22');
  A(-4,-35,8,15,mix(o.col,'#3a3a40',.5));A(-4,-30,8,1,'#3a2a22');A(-4,-24,8,1,'#3a2a22');A(-1,-21,3,2,'#8a8a90');
  A(-7,-37,13,3,acc);A(-7,-37,13,1,sh(acc,.3));A(-11+sw,-36,5,2,acc);A(-14+sw*1.6,-34,4,2,sh(acc,-.25));A(-16+sw*2,-32,3,2,sh(acc,-.4));
  A(-6,-47,12,11,cl);A(-6,-47,12,2,cL);A(-10,-45,5,10,cD);A(-8,-50,9,4,cl);A(-3,-52,5,3,cl);
  A(0,-44,6,7,'#0c0810');A(3,-42,2,1,o.eye||'#ffb347');A(1,-38,4,1,sh(skin,-.25));
  A(4,-34,4,12,cD);A(4,-23,4,3,'#5a4030');
  if(o.helm){A(-6,-50,12,8,'#6a6e78');A(-6,-50,12,1,'#a0a4ae');A(0,-44,6,2,'#0c0810');A(2,-44,2,1,'#ff5a3a');if(o.beard)A(-3,-41,7,5,sh(o.beard,-.35));}
  if(o.w===0){A(8,-50,3,26,'#7a808c');A(8,-50,1,26,'#b8bcc8');A(10,-45,1,3,'#3a3e48');A(10,-36,1,2,'#3a3e48');A(5,-26,9,2,'#3a2a22');A(8,-24,3,5,'#2a1a14');}
  else if(o.w===2){A(9,-46,2,5,'#4a3220');A(10,-41,2,18,'#4a3220');A(9,-23,2,5,'#4a3220');A(8,-45,1,22,'#aaa');A(-9,-44,3,12,'#3a2a1a');}
  return P;}
/* ---- D: Storybook (big head, tiny body, coloured outlines) ---- */
function figD(o){const [P,A]=mkp();const col=o.col,cL=sh(col,.25),cD=sh(col,-.3),skin=o.skin||'#f6d0a6',hair=o.hair||'#7a4a26',st=Math.floor(S.t*2)%2;
  if(o.cape){A(-9,-19,4,12,o.cape);A(-9,-19,1,12,sh(o.cape,.3));}
  A(-4,-6,3,6,'#4a3a5a');A(-5,-3,5,3,'#7a4a2a');A(1,-6,3,6,'#4a3a5a');A(0,-3,5,3,'#7a4a2a');
  A(-4,-16,8,11,col);A(-4,-16,8,2,cL);A(3,-16,2,11,cD);A(-4,-8,8,2,'#4a2e1a');A(-1,-8,3,2,'#f0d060');
  if(o.look>=1){A(-5,-16,10,5,'#b8c0cc');A(-5,-16,10,1,'#fff');A(-6,-17,3,3,'#b8c0cc');A(3,-17,3,3,'#b8c0cc');}
  A(-6,-15,2,7,cD);A(4,-15,3,6,col);A(4,-9,3,3,skin);
  A(-7,-33,14,16,skin);A(-7,-18,14,1,sh(skin,-.12));A(5,-30,2,10,sh(skin,.1));
  if(o.helm){A(-8,-36,16,9,o.helm);A(-8,-36,16,2,'#ffffff');A(-8,-29,3,12,o.helm);A(-2,-41,4,6,'#d04a4a');}
  else{A(-8,-36,16,7,hair);A(-8,-33,4,12,hair);A(-5,-36,9,2,sh(hair,.3));A(-1,-40,4,5,hair);A(1,-42,3,3,hair);if(o.pony){A(-12,-32,5,13,hair);A(-12,-32,1,13,sh(hair,.3));}}
  A(1,-27,4,6,'#2a1a2a');A(2,-27,2,2,'#fff');A(-4,-26,2,4,'#2a1a2a');A(4,-20,2,1,'#e8806a');A(3,-17,3,1,'#a04a3a');
  if(o.beard)A(-4,-21,10,6,o.beard);
  if(o.w===0){A(7,-30,3,20,'#f0f4fa');A(7,-30,1,20,'#fff');A(4,-11,9,2,'#e6b84a');A(7,-9,3,4,'#5a3a1a');A(-11,-17,6,9,'#2a4a9a');A(-11,-17,6,1,'#f0d060');}
  else if(o.w===2){A(8,-33,2,5,'#9a6a32');A(9,-28,2,14,'#9a6a32');A(8,-14,2,5,'#9a6a32');A(7,-32,1,22,'#eee');A(-10,-22,3,10,'#6b4423');}
  return P;}
/* ---- E: Hi-bit painterly (selective outlines, banded shading, rim light) ---- */
function figE(o){const [P,A]=mkp();const col=o.col,cH=sh(col,.35),cL=sh(col,.15),cD=sh(col,-.22),cX=sh(col,-.4),skin=o.skin||'#efc39b',sL=sh(skin,.15),sD=sh(skin,-.18),hair=o.hair||'#6b3f1f',metal=o.look>=1,sw=Math.sin(S.t*2.2);
  const band=(x,y,w,h,c0,c1,c2)=>{const a=Math.max(1,Math.round(w*.38)),b=Math.max(1,Math.round(w*.34));A(x,y,a,h,c0);A(x+a,y,b,h,c1);A(x+a+b,y,w-a-b,h,c2);};
  if(o.cape){band(-10+sw,-33,5,28,sh(o.cape,.15),o.cape,sh(o.cape,-.3));A(-11+sw*1.4,-6,6,3,sh(o.cape,-.35));A(-10+sw,-33,5,1,sh(o.cape,.4));}
  band(-4,-15,4,11,'#4a4260','#3a3450','#2a2640');A(-5,-4,6,4,'#5a3a22');A(-5,-4,6,1,'#9a6a40');A(-5,-1,6,1,'#2a1a10');
  band(1,-15,4,11,'#554c72','#443e5c','#322e48');A(0,-4,6,4,'#5a3a22');A(0,-4,6,1,'#9a6a40');A(0,-1,6,1,'#2a1a10');
  if(metal){A(1,-11,4,3,'#c0c8d4');A(-4,-11,4,3,'#8a92a0');}
  band(-5,-31,10,16,metal?'#d4dae4':cH,metal?'#aab2c0':col,metal?'#7a8292':cD);A(-5,-31,10,2,metal?'#f4f8ff':cH);A(4,-31,1,16,cH);
  A(-5,-16,10,2,'#3a2412');A(-1,-16,3,2,'#f0d060');A(-1,-16,1,1,'#fff6c0');
  if(o.tab){band(-3,-14,6,12,sh(o.tab,.2),o.tab,sh(o.tab,-.25));A(-1,-11,2,6,'#f0f0f8');A(-2,-9,4,1,'#f0f0f8');}
  band(-8,-34,5,5,metal?'#e4e8f0':cH,metal?'#aab2c0':cL,metal?'#7a8292':cD);band(3,-34,5,5,metal?'#e4e8f0':cH,metal?'#aab2c0':cL,metal?'#7a8292':cD);
  A(-7,-30,3,11,cX);band(5,-30,3,10,cL,col,cD);A(5,-21,3,3,metal?'#9aa2b0':'#6a4a2a');A(5,-18,3,3,skin);A(7,-18,1,3,sL);
  A(-1,-36,3,3,sD);A(-3,-44,7,9,skin);A(3,-44,1,9,sL);A(-3,-38,7,1,sD);A(1,-41,2,2,'#fff');A(2,-41,1,2,'#3a7ac8');A(1,-42,2,1,hair);A(2,-37,2,1,'#c0786a');
  if(o.helm){A(-4,-47,9,6,o.helm);A(-4,-47,9,1,'#fff');A(1,-42,4,1,'#222');A(-4,-42,2,7,sh(o.helm,-.2));A(-2,-52,3,5,'#d04040');}
  else{A(-4,-47,9,4,hair);A(-4,-47,9,1,sh(hair,.35));A(-4,-45,2,9,hair);A(-3,-45,1,7,sh(hair,.25));A(4,-46,1,3,sh(hair,.4));if(o.pony){A(-8+sw,-44,4,13,hair);A(-8+sw,-44,1,13,sh(hair,.35));}}
  if(o.beard){A(-2,-38,6,4,o.beard);A(-2,-38,6,1,sh(o.beard,.2));}
  if(o.w===0){A(8,-48,2,23,'#eef2f8');A(8,-48,1,23,'#fff');A(9,-48,1,23,'#aab4c4');A(5,-25,8,2,'#e6b84a');A(5,-25,8,1,'#fff0a0');A(8,-23,2,4,'#5a3a1a');A(-12,-30,6,11,'#2a4a9a');A(-12,-30,6,1,'#f0d060');A(-10,-27,2,5,'#eef');}
  else if(o.w===2){A(9,-46,2,5,'#9a6a32');A(10,-41,2,17,'#9a6a32');A(9,-24,2,5,'#9a6a32');A(8,-45,1,24,'#eee');A(-8,-40,3,12,'#6b4423');A(-8,-41,3,2,'#e8e0c8');}
  return P;}
const CHAR={
 halv:{col:'#7a808c',hair:'#e6e6e6',beard:'#e6e6e6',look:1,cape:'#4a4a5a',skin:'#e8bd94',w:0,helm:null},
 corin:{col:'#3a63b8',tab:'#3a63b8',hair:'#6b3f1f',cape:'#a82f3a',w:0,look:0},
 lysa:{col:'#3f8a4e',hair:'#c4762d',pony:1,cape:'#2f6a3a',w:2,look:0},
 reaver:{col:'#7a3a2a',hair:'#222',cape:'#4a2a22',look:1,w:0,accent:'#d0802a',eye:'#ff5a3a'}
};
const FIG={B:figB,C:figC,D:figD,E:figE},OUT={B:'black',C:'black',D:'col',E:'sel'};
