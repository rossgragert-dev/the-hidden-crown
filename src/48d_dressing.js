/* ================= WORLD-LOCKED SET DRESSING (v0.7.0 art pass) =================
   Drawn in the playable layer (before objects and the hero) so each chapter has
   floor texture, landmarks and clutter that move 1:1 with the camera.
*/
function dressAt(wx,cam,fn,span){const x=Math.round(wx-cam);if(x>-(span||120)&&x<W+(span||120))fn(x);}
/* ---- Chapter 1: the road from Halvard's keep to Hearthmoor ---- */
function roadWorld(cam,y){
  // dirt road with wheel ruts, pebbles and grass verge
  const gr=g.createLinearGradient(0,y,0,H);gr.addColorStop(0,'#b79a68');gr.addColorStop(1,'#8d744d');g.fillStyle=gr;g.fillRect(0,y-1,W,H-y+2);
  R(0,y-1,W,2,'#d0b888');
  for(let i=Math.floor(cam/60)-1;i<=Math.ceil((cam+W)/60)+1;i++){const x=i*60-cam,v=vN(i,5);
    R(x+Math.round(v*20),y+8,34+Math.round(v*14),2,'#7d6642');R(x+8+Math.round(v*14),y+9,30,1,'#a68c5c');
    R(x+Math.round(vN(i,8)*22),y+22,40,2,'#7d6642');
    if(vN(i,3)>.5)R(x+Math.round(vN(i,4)*50),y+14+Math.round(vN(i,6)*14),3,2,'#6e5a3c');
    if(vN(i,11)>.62){const fx=x+Math.round(vN(i,12)*50);R(fx,y+30+Math.round(vN(i,13)*10),1,3,'#5a8a3a');R(fx-1,y+29+Math.round(vN(i,13)*10),3,2,['#f0e098','#e8c0f0','#fff'][i%3]);}
  }
  // Halvard's keep gate (the start of the journey)
  dressAt(8,cam,x=>{
    vStoneWall(x-6,y-78,18,78,'#8a8478',3);bv(x-9,y-84,24,8,'#aaa391');vStoneWall(x+74,y-78,18,78,'#8a8478',5);bv(x+71,y-84,24,8,'#aaa391');
    woodB(x+12,y-70,62,5,'#6a4a2e');bv(x+26,y-66,34,16,'#283b61');R(x+41,y-64,4,12,'#d8b45a');R(x+35,y-59,16,3,'#d8b45a');
    bv(x-14,y-8,10,8,'#7a7468');bv(x+90,y-8,10,8,'#7a7468');
  },140);
  // roadside landmarks: milestones, hedges, a wayside shrine, a stack of firewood
  for(const [wx,k] of [[150,0],[345,1],[520,2],[730,0],[905,1],[1085,2]]){
    dressAt(wx,cam,x=>{
      if(k===0){bv(x-7,y-20,14,20,'#8d877a');bv(x-5,y-26,10,8,'#a8a190');R(x-3,y-17,6,1,'#4a463e');R(x-3,y-14,4,1,'#4a463e');ground(x-9,18,y);}
      else if(k===1){for(let j=0;j<5;j++)vBlob(x-16+j*8,y-8-(j%2)*2,7,7,'#3f6f3a','#5c9448','#2c5030');ground(x-24,50,y,.2);for(let j=0;j<7;j++)R(x-20+j*6,y-14-(j%3)*3,2,2,j%2?'#d8603a':'#f0e098');}
      else{woodB(x-2,y-34,4,34,'#5a4128');bv(x-10,y-42,20,10,'#7a5a3a');R(x-8,y-40,16,5,'#2a1e18');R(x-1,y-38,2,3,'#ffd98a');worldGlow(x,y-36,16,'rgba(255,210,130,.18)');ground(x-8,16,y);}
    },60);
  }
  dressAt(430,cam,x=>{for(let k=0;k<6;k++)woodB(x+k*5,y-12-(k%2)*8,5,12+(k%2)*8,'#7a5a3a',true);ground(x-2,34,y);},50);
  // Hearthmoor inn facade behind the arrival marker
  dressAt(1105,cam,x=>{
    vTiles(x-6,y-112,124,22,'#8a4a3a');bv(x,y-90,112,90,'#b8a888');for(let k=0;k<112;k+=14)R(x+k,y-88,2,86,'#8a7a5a');
    for(let k=0;k<3;k++){bv(x+10+k*34,y-72,20,26,'#37444b');R(x+11+k*34,y-71,18,24,'#d6c38a');R(x+19+k*34,y-71,2,24,'#4f4538');}
    bv(x+80,y-110,12,26,'#7a7468');R(x+84,y-122-Math.round((S.t*6)%10),6,5,'rgba(220,220,220,.45)');
    woodB(x+46,y-44,4,18,'#5a4128');bv(x+34,y-30,28,12,'#8a6a42');R(x+38,y-28,20,2,'#2a1a12');R(x+38,y-24,12,2,'#2a1a12');   // hanging sign
    worldGlow(x+25,y-60,28,'rgba(255,200,110,.14)');
  },160);
}
/* ---- Chapter 3: stables ---- */
function stableWorld(cam,y){
  // straw-strewn dirt floor with cobbled drainage and hoof marks
  const gr=g.createLinearGradient(0,y,0,H);gr.addColorStop(0,'#6d5636');gr.addColorStop(1,'#4f3f2a');g.fillStyle=gr;g.fillRect(0,y-2,W,H-y+2);
  R(0,y-2,W,2,'#a8844f');
  for(let i=Math.floor(cam/46)-1;i<=Math.ceil((cam+W)/46)+1;i++){const x=i*46-cam,v=vN(i,2);
    for(let k=0;k<4;k++){const sx=x+Math.round(vN(i,k+3)*44),sy=y+2+Math.round(vN(i,k+8)*(H-y-6));R(sx,sy,6+(k%3)*3,1,k%2?'#d6b46a':'#a88a4a');}
    if(v>.55){R(x+6,y+Math.round(vN(i,5)*16)+4,3,2,'#3a2c1c');R(x+11,y+Math.round(vN(i,5)*16)+4,3,2,'#3a2c1c');}
  }
  for(let i=Math.floor(cam/120)-1;i<=Math.ceil((cam+W)/120)+1;i++){const x=i*120-cam;if(vN(i,7)>.45){for(let k=0;k<5;k++)for(let j=0;j<3;j++)bv(x+k*8+(j%2)*4,y+4+j*6,7,5,['#6a6a6a','#7a7468','#5a5a5e'][(k+j)%3]);}}
  R(0,y+22,W,1,'rgba(0,0,0,.18)');
  // clutter: tack wall, wheelbarrow, pitchfork, feed sacks, lantern
  dressAt(100,cam,x=>{woodB(x-34,y-62,70,6,'#7a5a3a');for(let k=0;k<4;k++){const px=x-26+k*18;R(px,y-56,2,4,'#4f3626');g.strokeStyle='#4a2e1c';g.lineWidth=1;g.beginPath();g.moveTo(px+1,y-54);g.quadraticCurveTo(px+7,y-34,px+1,y-30);g.stroke();bv(px-2,y-32,6,4,'#9aa3b0');}},60);
  dressAt(330,cam,x=>{ground(x-18,40,y);g.strokeStyle='#5a4128';g.lineWidth=3;g.beginPath();g.moveTo(x-14,y-8);g.lineTo(x-4,y-14);g.lineTo(x+22,y-14);g.stroke();
    bv(x-6,y-18,26,10,'#6a4a2e');strawTuft(x-4,y-19,22,5,'#d8b86a','#b8963a');bv(x-18,y-4,6,4,'#3a3a3a');R(x-16,y-10,2,8,'#5a4128');vBlob(x+12,y-4,5,5,'#2a2a2a','#444','#1a1a1a');
    woodB(x+30,y-36,3,36,'#6a4a2e');for(let k=0;k<3;k++)R(x+27+k*3,y-38,1,6,'#9aa3b0');R(x+27,y-38,7,1,'#9aa3b0');},60);
  dressAt(500,cam,x=>{for(let k=0;k<3;k++)bv(x+k*16,y-22+(k===1?-10:0)+(k===1?10:0),16,22,k%2?'#a8946a':'#b8a47a');R(x+4,y-18,8,1,'#6a5a3a');R(x+20,y-18,8,1,'#6a5a3a');R(x+36,y-18,8,1,'#6a5a3a');
    for(let k=0;k<2;k++)bv(x+8+k*16,y-40,16,18,k?'#b8a47a':'#a8946a');ground(x-2,52,y,.3);},60);
  dressAt(700,cam,x=>{woodB(x-1,y-90,2,30,'#3a2a20');bv(x-6,y-60,12,14,'#5a4a3a');R(x-4,y-58,8,10,'#ffd98a');R(x-1,y-56,2,6,'#fff6c0');worldGlow(x,y-52,50,'rgba(255,200,110,.17)');},60);
  dressAt(880,cam,x=>{bv(x-14,y-12,28,12,'#6a4a2e');R(x-12,y-10,24,4,'#3a6a8a');R(x-10,y-10,10,1,'#8ac0d8');propBarrel(x+30,y,'#5a4128');ground(x-16,32,y);},60);
}
/* ---- Chapter 2: inn storeroom ---- */
function innWorld(cam,y){
  // worn plank floor with a woven rug and stains
  const gr=g.createLinearGradient(0,y,0,H);gr.addColorStop(0,'#6a5640');gr.addColorStop(1,'#43372b');g.fillStyle=gr;g.fillRect(0,y-1,W,H-y+1);
  for(let i=Math.floor(cam/26)-1;i<=Math.ceil((cam+W)/26)+1;i++){const x=i*26-cam;R(x,y,1,H-y,'rgba(20,12,8,.35)');R(x+4+Math.round(vN(i,4)*14),y+4+Math.round(vN(i,5)*14),10,1,'rgba(255,225,170,.1)');}
  R(0,y-1,W,2,'#9a7f58');
  dressAt(40,cam,x=>{bv(x,y+4,150,12,'#7a2a30');R(x+4,y+7,142,2,'#e2b84a');for(let k=0;k<15;k++)R(x+6+k*9,y+11,4,2,'#b0505a');R(x,y+4,150,1,'#a84a52');},170);
  dressAt(470,cam,x=>{bv(x,y+4,230,12,'#2a4a62');R(x+4,y+7,222,2,'#e2b84a');for(let k=0;k<22;k++)R(x+6+k*10,y+11,4,2,'#4a7a9a');},260);
  // hanging herbs, hams and pots from the beams, lanterns with warm light
  for(const wx of [90,260,470,640,900,1010])dressAt(wx,cam,x=>{
    woodB(x-20,38,44,4,'#4f3626');R(x-14,42,1,10+(wx%4)*3,'#c9b890');R(x+6,42,1,14,'#c9b890');
    for(let k=0;k<5;k++){R(x-17+k*3,52+(wx%4)*3-(k%2),2,8,['#6a9a4a','#8a6a3a','#4a7a3a'][k%3]);}
    bv(x+3,56,7,9,'#a85a3a');R(x+4,57,2,3,'#d8907a');
    worldGlow(x+22,48,26,'rgba(255,190,100,.1)');
  },60);
  for(const wx of [180,590,880])dressAt(wx,cam,x=>{R(x,24,1,18,'#2a2a2a');bv(x-5,42,10,12,'#4a4a52');R(x-3,44,6,8,'#ffd98a');R(x-1,46,2,4,'#fff6c0');worldGlow(x,48,58,'rgba(255,200,110,.17)');},70);
  // casks, stools, table with mugs, coat pegs with cloaks
  dressAt(70,cam,x=>{propBarrel(x,y,'#6a4a2e');propBarrel(x+22,y,'#5a4128');bv(x+8,y-34,16,16,'#6a4a2e');R(x+9,y-33,14,2,'#9aa3b0');},50);
  dressAt(300,cam,x=>{woodB(x-2,y-30,3,30,'#4f3626');woodB(x-18,y-34,38,4,'#6a4a2e');for(let k=0;k<3;k++){bv(x-14+k*13,y-62+(k%2)*2,10,22,['#5a3a5a','#3a5a5a','#7a4a2a'][k]);R(x-14+k*13,y-62+(k%2)*2,10,2,'#2a1a1a');}},50);
  dressAt(520,cam,x=>{propBench(x-26,y,26,'#7a5a3a');propBench(x+26,y,26,'#7a5a3a');woodB(x-18,y-22,36,4,'#8a6a42');woodB(x-14,y-18,4,18,'#6a4a2e');woodB(x+10,y-18,4,18,'#6a4a2e');
    bv(x-10,y-30,6,8,'#9a5a32');bv(x+2,y-28,6,6,'#9a5a32');R(x+8,y-27,1,5,'#e8e0c0');R(x+8,y-31,2,3,'#ffd98a');ground(x-30,64,y,.28);},80);
  dressAt(930,cam,x=>{for(let k=0;k<3;k++)propCrate(x+k*20,y,k%2?'#8a6a42':'#7a5a3a');propCrate(x+10,y-16,'#9a7a4a');propSign(x+70,y,'',' #6a4a2e');},80);
}
/* ---- Chapter 4: tournament grounds foreground ---- */
function listsWorld(cam,y){
  // trampled sand, rake lines, heraldic shields on the barrier and banner poles
  for(let i=Math.floor(cam/74)-1;i<=Math.ceil((cam+W)/74)+1;i++){const x=i*74-cam;R(x+Math.round(vN(i,2)*30),y+10+Math.round(vN(i,3)*16),30,1,'#a8925a');if(vN(i,7)>.5){R(x+20,y+6+Math.round(vN(i,8)*12),3,2,'#8a7440');R(x+25,y+6+Math.round(vN(i,8)*12),3,2,'#8a7440');}}
  const cols=[['#b7463e','#efe3c4'],['#2c567e','#e2b55f'],['#3f7a4a','#efe3c4'],['#6a3a7a','#e2b55f'],['#e2b55f','#283b61']];
  for(let i=Math.floor(cam/48)-1;i<=Math.ceil((cam+W)/48)+1;i++){
    const x=i*48-cam,c=cols[((i%5)+5)%5];
    if(i%2===0){bv(x+14,y-44,14,16,c[0]);bv(x+15,y-28,12,4,c[0]);R(x+19,y-26,2,3,c[0]);R(x+20,y-43,2,14,c[1]);R(x+16,y-37,10,2,c[1]);}
  }
  for(const wx of [60,300,640,880])dressAt(wx,cam,x=>{woodB(x-1,y-78,3,78,'#5a4128');ground(x-6,14,y);
    for(let k=0;k<6;k++){const wv=Math.round(Math.sin(S.t*3+k*.6+wx)*1);const [c1,c2]=cols[(wx/10|0)%5];R(x+2+k*3,y-76+wv+k,3,14,k%2?c1:c2);}
    R(x-2,y-80,7,3,'#d8b45a');},40);
  dressAt(640,cam,x=>{R(x-80,y-64,160,1,'#6a4a2e');for(let k=0;k<12;k++){const tx=x-78+k*14;R(tx,y-63,1,4,'#6a4a2e');R(tx-3,y-62,8,6,k%2?'#c9453d':k%3?'#efe3c4':'#2c567e');}},100);
}
function worldDressing(a,cam,y){
  if(a.scenery==='road')roadWorld(cam,y);
  else if(a.scenery==='stable')stableWorld(cam,y);
  else if(a.scenery==='inn')innWorld(cam,y);
  else if(a.scenery==='lists')listsWorld(cam,y);
}
