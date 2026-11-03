/* ================= OPENING VISTAS (v0.7.0 art pass) =================
   Hand-authored, layered open-air scenes for the practice ring, the training
   yard and the storm-struck bridge / Ione's garden. Each scene has its own
   palette, landmarks and parallax so no two chapters share silhouettes.
   Helpers: vRidge, vBlob, vOak, vFir, vSky. y = ground line.
*/
function vN(i,seed){return (worldHash(i,seed)%1000)/1000;}
function vRidge(cam,f,base,amp,seed,c1,c2,step){
  step=step||4;const off=Math.floor(cam*f);
  for(let sx=-step;sx<W+step;sx+=step){
    const wx=Math.floor((sx+off)/step),i0=Math.floor(wx/6),t=(((wx%6)+6)%6)/6;
    const h=Math.round(amp*(vN(i0,seed)*(1-t)+vN(i0+1,seed)*t)+amp*.3*Math.sin(wx*.31+seed));
    R(sx,base-h,step,h+3,c1);R(sx,base-h,step,1,c2);
  }
}
function vBlob(cx,cy,rx,ry,c,hi,lo){
  for(let r=-ry;r<=ry;r+=1){
    const w=Math.round(rx*Math.sqrt(1-(r/ry)*(r/ry)));if(w<=0)continue;
    R(Math.round(cx-w),Math.round(cy+r),w*2,1,r<-ry*.45?hi:(r>ry*.45?lo:c));
  }
}
function vOak(x,y,s,seed,pal){
  pal=pal||['#3f6f3a','#5c9448','#2c5030'];x=Math.round(x);const h=Math.round(30*s);
  woodB(x-Math.ceil(2*s),y-Math.round(h*.6),Math.ceil(4*s),Math.round(h*.6),'#5a4128',true);
  vBlob(x,y-h,Math.round(14*s),Math.round(11*s),pal[0],pal[1],pal[2]);
  vBlob(x-Math.round(9*s),y-h+Math.round(5*s),Math.round(9*s),Math.round(7*s),pal[0],pal[1],pal[2]);
  vBlob(x+Math.round(9*s),y-h+Math.round(4*s),Math.round(9*s),Math.round(7*s),pal[0],pal[1],pal[2]);
  R(x-Math.round(5*s),y-h-Math.round(5*s),Math.round(5*s),2,pal[1]);
}
function vFir(x,y,s,pal){
  pal=pal||['#2f5a3a','#4c8050','#1f3d2a'];x=Math.round(x);const h=Math.round(46*s);
  R(x-1,y-Math.round(h*.18),3,Math.round(h*.18),'#4a3524');
  for(let k=0;k<5;k++){const ry=Math.round((5+k*1.2)*s),rx=Math.round((15-k*2.4)*s),cy=y-Math.round(h*.18)-Math.round(k*h*.17);vBlob(x,cy-ry*.4,rx,ry,pal[0],pal[1],pal[2]);}
}
/* Static parallax layers are painted once into an offscreen canvas (cam = 0) and blitted with an
   offset each frame. This keeps the new, denser art cheap on phones. Key includes viewport geometry. */
const VCACHE={};
function vLayer(name,f,cam,paint){
  const wid=Math.ceil(((S.adv&&S.adv.length)||1300)*f)+W+60,key=name+'|'+GY+'|'+H+'|'+W;let c=VCACHE[key];
  if(!c){
    if(Object.keys(VCACHE).length>28)for(const k in VCACHE)delete VCACHE[k];
    c=document.createElement('canvas');c.width=wid;c.height=H;
    const og=g,ow=W;g=c.getContext('2d');W=wid;try{paint(GY);}finally{g=og;W=ow;}
    VCACHE[key]=c;
  }
  g.drawImage(c,-Math.floor(cam*f),0);
}
function vSky(top,mid,bot,y){
  const gr=g.createLinearGradient(0,0,0,y);gr.addColorStop(0,top);gr.addColorStop(.55,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,W,y+2);
}
function vCloud(x,y,w,a){R(x,y,w,5,'rgba(255,255,255,'+a+')');R(x+6,y-4,w-14,5,'rgba(255,255,255,'+a+')');R(x+3,y+5,w-8,3,'rgba(205,220,235,'+(a*.8)+')');}
function vClouds(cam,n,span,y0,a,spd){for(let k=0;k<n;k++){const w=34+vN(k,3)*30,cx=((k*span/n+S.t*spd-cam*.06)%(W+140)+W+140)%(W+140)-70;vCloud(Math.round(cx),y0+Math.round(vN(k,9)*34),Math.round(w),a);}}
function vTiles(x,y,w,h,c,c2){ // tiled roof, 2-pixel courses
  for(let r=0;r<h;r+=3){const sh2=(r/3)%2?4:0;R(x,y+r,w,3,r%6?c:sh(c,.08));for(let k=sh2;k<w;k+=8)R(x+k,y+r,1,3,sh(c,-.22));}
  R(x,y,w,1,sh(c,.35));R(x,y+h-1,w,1,sh(c,-.4));
}
function vStoneWall(x,y,w,h,c,seed){
  bv(x,y,w,h,c);for(let r=0;r<h;r+=7){R(x,y+r,w,1,sh(c,-.22));for(let k=((r/7)%2)*6;k<w;k+=12)R(x+k,y+r,1,7,sh(c,-.2));}
  for(let k=0;k<w;k+=9){if(worldHash(k+seed,1)%5===0)R(x+k,y+((k*7)%h),4,2,sh(c,.16));}
}
/* ---------------- Chapter 5: Halvard's Practice Ring ---------------- */
function scenePractice(cam,y){
  vSky('#76a8d0','#bfd2d4','#e4dcc0',y);
  vClouds(cam,4,420,18,.55,2.2);
  vLayer('pr-r1',.10,cam,y=>vRidge(0,.10,y-70,26,5,'#9ab4b6','#b4cac8'));
  vLayer('pr-r2',.2,cam,y=>vRidge(0,.2,y-52,20,9,'#7ea48a','#96bb98'));
  vLayer('pr-oak',.26,cam,y=>{for(let k=-1;k<Math.ceil(W/46)+2;k++){const wx=k,x=wx*46;if(vN(wx,4)>.35)vOak(x,y-48,.55+vN(wx,6)*.3,wx,['#4a7a58','#6a9a6a','#34603f']);}});
  vLayer('pr-wall',.42,cam,y=>{
  const wc=0;
  for(let i=Math.floor(wc/520)-1;i<=Math.ceil((wc+W)/520)+1;i++){
    const x=i*520-wc;
    vStoneWall(x,y-112,320,64,'#8a8478',i);
    for(let k=0;k<320;k+=14)bv(x+k,y-120,9,8,'#a29a88');
    vStoneWall(x+110,y-150,64,102,'#9a9486',i+3);                   // gatehouse keep
    for(let k=0;k<64;k+=12)bv(x+110+k,y-158,8,8,'#aca594');
    bv(x+130,y-100,24,52,'#3a3636');R(x+132,y-98,20,50,'#241f22');R(x+134,y-96,16,3,'#3a3636');  // gate arch
    R(x+139,y-92,2,44,'#4a3a2c');                                    // portcullis bar
    bv(x+120,y-118,8,12,'#241f22');bv(x+156,y-118,8,12,'#241f22');   // arrow slits
    R(x+150,y-182,2,32,'#4f3626');R(x+152,y-182,14,9,'#2c567e');R(x+156,y-180,6,5,'#e2b84a'); // pennant
    // tournament roofs beyond the wall (distinct from the walls)
    for(let k=0;k<5;k++)R(x+210+k*18,y-132-(k%2)*4,18,10,k%2?'#efe3c4':'#c9453d');
    R(x+206,y-124,98,3,'#6a4a2e');
  }});
  // Timber stable block, world-anchored, with tiled roof and hayloft door
  const sx=60-cam;
  if(sx>-360&&sx<W+40){
    vTiles(sx-8,y-92,316,18,'#9a5a3a');
    bv(sx,y-74,300,74,'#7a5a3a');for(let k=0;k<300;k+=6)R(sx+k,y-72,1,70,'#6a4a2e');
    for(let k=0;k<4;k++){const dx=sx+14+k*72;bv(dx,y-50,40,50,'#2a1e18');woodB(dx+2,y-48,16,48,'#5a3c26',true);woodB(dx+22,y-48,16,48,'#5a3c26',true);R(dx+20,y-44,1,44,'#1a110d');}
    bv(sx+110,y-72,34,20,'#2a1e18');strawTuft(sx+112,y-52,30,4,'#d8b86a','#b8963a');      // hayloft hatch
    R(sx+125,y-76,2,8,'#4f3626');R(sx+120,y-80,12,2,'#4f3626');                              // loading hoist
    for(let k=0;k<300;k+=60)R(sx+k,y-74,3,74,'#4a3322');
    // trough, hay, bucket
    bv(sx+80,y-12,40,12,'#6a4a2e');R(sx+82,y-10,36,4,'#3a6a8a');R(sx+84,y-10,12,1,'#8ac0d8');
    bv(sx+250,y-16,34,16,'#c9a85a');strawTuft(sx+250,y-16,34,8,'#e2c77e','#a98a3e');
    propBarrel(sx+232,y,'#6a4a2e');
  }
  // Quintain: a swinging shield-and-sandbag target
  const qx=360-cam;
  if(qx>-60&&qx<W+60){
    woodB(qx-3,y-62,6,62,'#6a4a2e',true);woodB(qx-18,y-6,36,6,'#4f3626');ground(qx-20,40,y);
    const sw=Math.sin(S.t*1.4)*.12;
    g.save();g.translate(qx,y-58);g.rotate(sw);
    woodB(-26,-3,52,5,'#7a5a3a');bv(-30,-12,12,18,'#2c567e');R(-26,-8,4,10,'#e8d8a0');R(-30,-3,12,2,'#e8d8a0');
    bv(18,0,12,16,'#c9a85a');strawTuft(18,0,12,3,'#e2c77e','#a98a3e');R(23,-3,2,4,'#4f3626');
    g.restore();
  }
  // Ring fence: double timber rails
  for(let i=Math.floor(cam/28)-1;i<=Math.ceil((cam+W)/28)+1;i++){
    const x=i*28-cam;woodB(x,y-32,5,32,'#7a5a3a',true);R(x-2,y-33,9,2,sh('#7a5a3a',.25));
  }
  woodB(0,y-26,W,4,'#a07a4a');woodB(0,y-14,W,4,'#a07a4a');R(0,y-27,W,1,'#d6b27a');R(0,y-15,W,1,'#d6b27a');
  for(let i=Math.floor(cam/84);i<=Math.ceil((cam+W)/84);i++){const x=i*84-cam;iron(x+1,y-27,3,5);iron(x+1,y-15,3,5);}
  // Packed earth with raked arcs and hoof prints
  const gr=g.createLinearGradient(0,y,0,H);gr.addColorStop(0,'#c8ad7c');gr.addColorStop(1,'#a58a5e');g.fillStyle=gr;g.fillRect(0,y,W,H-y);
  R(0,y,W,2,'#dcc590');
  for(let k=0;k<12;k++){const wx=Math.floor(cam/70)+k-1,x=wx*70-cam;R(x+vN(wx,2)*30,y+4+vN(wx,7)*6,26,1,'#b89c6a');R(x+vN(wx,5)*40,y+9+vN(wx,3)*7,18,1,'#b89c6a');}
  for(let k=0;k<20;k++){const wx=Math.floor(cam/37)+k-1,x=wx*37-cam;if(vN(wx,12)>.4){R(x+5,y+3+Math.floor(vN(wx,13)*14),3,2,'#8e7549');R(x+9,y+3+Math.floor(vN(wx,13)*14),3,2,'#8e7549');}}
}
/* ---------------- Chapter 6: Ranger and Sword training yard ---------------- */
function sceneTrainingYard(cam,y){
  vSky('#5f9fd6','#a9d0e4','#dde8d0',y);
  vClouds(cam,5,520,10,.7,1.6);
  vLayer('ty-r1',.08,cam,y=>vRidge(0,.08,y-80,34,31,'#86a6b8','#a6c2cc'));
  vLayer('ty-r2',.16,cam,y=>vRidge(0,.16,y-60,26,33,'#6f9a86','#8cb69a'));
  vLayer('ty-trees',.34,cam,y=>{for(let k=-1;k<Math.ceil(W/30)+2;k++){
    const wx=k,x=wx*30,v=vN(wx,8);
    if(v>.62)vFir(x,y-34,.75+vN(wx,2)*.3,['#244a38','#3c7048','#183626']);else if(v>.2)vOak(x,y-34,.8+vN(wx,2)*.4,wx,['#386a3a','#54904a','#27502e']);
  }});
  R(0,y-36,W,36,'#6a9a4e');R(0,y-36,W,2,'#8cbf68');
  // --- world-anchored set pieces ---
  const P=(wx,fn)=>{const x=Math.round(wx-cam);if(x>-190&&x<W+190)fn(x);};
  // Elowen's ranger camp: leaf-green lean-to, fire, pelts, bow rack
  P(60,x=>{
    ground(x-6,126,y,.3);
    for(let k=0;k<4;k++)R(x+k*30,y-52+k*2,32,3,'#3c6a44');                                     // canvas roof slope
    g.fillStyle='#4a7a50';g.beginPath();g.moveTo(x,y-50);g.lineTo(x+110,y-50);g.lineTo(x+122,y-6);g.lineTo(x-4,y-6);g.fill();
    g.fillStyle='#3a6642';g.beginPath();g.moveTo(x+10,y-46);g.lineTo(x+60,y-46);g.lineTo(x+40,y-6);g.lineTo(x+4,y-6);g.fill();
    R(x-4,y-56,6,56,'#5a4128');R(x+118,y-56,6,56,'#5a4128');R(x-6,y-58,134,3,'#6a5036');
    bv(x+30,y-32,60,26,'#1f2a22');R(x+34,y-14,52,8,'#7a6038');R(x+40,y-20,36,6,'#c9b890');          // bedroll inside
    for(let k=0;k<3;k++){bv(x+96+k*6,y-48+k*2,5,22,'#8a6a4a');}                                  // hung pelts
    // fire pit with stew pot
    const fx=x+148;ground(fx-12,26,y,.3);for(let k=0;k<6;k++)bv(fx-10+k*3,y-4-(k%2),5,4,'#6e6a64');
    const fl=6+Math.round(Math.sin(S.t*9)*2);R(fx-4,y-4-fl,8,fl,'#f2a546');R(fx-2,y-4-fl*.6,4,fl*.6,'#ffe09a');
    woodB(fx-12,y-20,2,18,'#5a4128');woodB(fx+10,y-20,2,18,'#5a4128');R(fx-12,y-21,24,2,'#4a3524');bv(fx-5,y-16,10,7,'#3a3a40');
    worldGlow(fx,y-8,34,'rgba(255,170,80,.16)');
    // log seat
    woodB(x+118,y-9,28,8,'#7a5a3a');
  });
  P(300,x=>{ // long bow rack and quiver barrel by the range line
    woodB(x,y-30,3,30,'#5a4128');woodB(x+34,y-30,3,30,'#5a4128');woodB(x-2,y-30,40,3,'#7a5a3a');ground(x-4,44,y);
    for(let k=0;k<3;k++){g.strokeStyle='#a97c4a';g.lineWidth=2;g.beginPath();g.moveTo(x+7+k*10,y-28);g.quadraticCurveTo(x+13+k*10,y-14,x+7+k*10,y-2);g.stroke();}
    propBarrel(x+54,y,'#5a4128');for(let k=0;k<4;k++){R(x+49+k*3,y-26,1,10,'#b88a52');R(x+48+k*3,y-28,3,3,'#c43a3a');}
  });
  // Archery lane: distance posts and a rope shooting line, decorative butts far downrange
  P(380,x=>{for(let k=0;k<3;k++){const px=x+k*80;woodB(px,y-16,3,16,'#6a4a2e');R(px+3,y-16,8,5,k%2?'#c43a3a':'#efe3c4');}R(x,y-9,170,1,'#c9b890');});
  P(500,x=>{ // second, shorter butt line with hay bales for the squire to stand behind
    for(let k=0;k<2;k++){bv(x+k*40,y-14,36,14,'#c9a85a');strawTuft(x+k*40,y-14,36,k+2,'#e2c77e','#a98a3e');R(x+k*40+10,y-12,1,12,'#8a6a2e');R(x+k*40+26,y-12,1,12,'#8a6a2e');}
    bv(x+18,y-28,36,14,'#c9a85a');strawTuft(x+18,y-28,36,6,'#e2c77e','#a98a3e');
  });
  // Halvard's stone wall with a gate and heraldic banners (the keep-world connection)
  P(560,x=>{
    vStoneWall(x,y-96,230,96,'#8d877a',7);for(let k=0;k<230;k+=15)bv(x+k,y-104,10,8,'#a8a190');
    bv(x+92,y-80,46,80,'#3a3636');R(x+95,y-76,40,76,'#241f22');R(x+95,y-76,40,6,'#3a3636');
    for(const bx of [x+30,x+170]){woodB(bx,y-130,3,40,'#4f3626');bv(bx+3,y-128,22,34,'#283b61');R(bx+11,y-124,5,26,'#d8b45a');R(bx+6,y-114,15,4,'#d8b45a');}
    // shield rack and wooden swords against the wall
    woodB(x+150,y-26,60,4,'#6a4a2e');for(let k=0;k<4;k++){R(x+155+k*14,y-48,3,22,'#c9a05a');R(x+153+k*14,y-30,7,2,'#7a5a3a');}
  });
  P(790,x=>{ // sword yard: hay-and-timber dummies, tyre-like rope rings, weapon barrel
    for(let k=0;k<2;k++){const dx=x+k*46;woodB(dx,y-40,3,40,'#6a4a2e');bv(dx-8,y-34,19,16,'#c9a85a');strawTuft(dx-8,y-34,19,k+9,'#e2c77e','#a98a3e');bv(dx-5,y-48,13,12,'#d8c08a');}
    propBarrel(x+110,y,'#5a4128');for(let k=0;k<4;k++){R(x+105+k*3,y-30,2,12,'#c9a05a');R(x+104+k*3,y-31,4,2,'#7a5a3a');}
  });
  P(1060,x=>{ // gate to ride home: two stone posts with heraldic caps
    for(const dx of [0,70]){vStoneWall(x+dx,y-66,14,66,'#8d877a',dx);bv(x+dx-3,y-72,20,7,'#a8a190');bv(x+dx+3,y-80,8,8,'#a8a190');}
    woodB(x+14,y-52,56,5,'#6a4a2e');
    bv(x+24,y-46,36,14,'#283b61');R(x+40,y-44,4,10,'#d8b45a');R(x+35,y-39,14,3,'#d8b45a');
  });
  // Ground: trodden grass with a dirt training lane
  const lane=g.createLinearGradient(0,y,0,H);lane.addColorStop(0,'#a58a5e');lane.addColorStop(1,'#8a7048');g.fillStyle=lane;g.fillRect(0,y-4,W,H-y+4);
  R(0,y-4,W,3,'#7aa855');
  for(let k=0;k<30;k++){const wx=Math.floor(cam/23)+k-1,x=wx*23-cam;R(x+vN(wx,2)*16,y+3+vN(wx,5)*9,10,1,'#b89c6a');if(vN(wx,9)>.6)R(x,y-6-Math.floor(vN(wx,4)*3),1,4,'#5f9040');}
}
/* ---------------- Chapter 7: storm gorge, broken bridge and Ione's grove ---------------- */
function sceneStormGorge(cam,y){
  const gr=g.createLinearGradient(0,0,0,y);gr.addColorStop(0,'#1d2133');gr.addColorStop(.5,'#3c4660');gr.addColorStop(1,'#6a7a8a');g.fillStyle=gr;g.fillRect(0,0,W,y+2);
  // heavy storm clouds
  vLayer('sg-cloud',.05,cam,y=>{for(let k=-1;k<Math.ceil(W/40)+2;k++){vBlob(k*40,38+vN(k,2)*26,34,13,'#2c3347','#454e66','#1c2130');}});
  const fl=((S.t*.37)%6.5);const flash=fl<.14?1:(fl>.3&&fl<.38?.6:0);
  if(flash){g.fillStyle='rgba(215,225,255,'+(.22*flash)+')';g.fillRect(0,0,W,y);
    if(flash===1){const bx=Math.round(((Math.floor(S.t*.37/6.5)*131)%W+W)%W);g.strokeStyle='#f4f6ff';g.lineWidth=2;g.beginPath();g.moveTo(bx,0);g.lineTo(bx-10,22);g.lineTo(bx+2,34);g.lineTo(bx-14,64);g.lineTo(bx-6,y-70);g.stroke();}}
  vLayer('sg-r1',.1,cam,y=>vRidge(0,.1,y-72,36,41,'#3a4456','#566275'));
  vLayer('sg-r2',.2,cam,y=>vRidge(0,.2,y-52,28,43,'#2f3b4a','#47586a'));
  vLayer('sg-fir',.3,cam,y=>{for(let k=-1;k<Math.ceil(W/26)+2;k++){const wx=k,x=wx*26;if(vN(wx,6)>.3)vFir(x,y-34,.8+vN(wx,2)*.5,['#1c3a34','#2f5a4c','#10241f']);}});
  R(0,y-34,W,34,'#35503e');R(0,y-34,W,2,'#4f7455');
  const B=S.adv&&S.adv.bridge;
  // Hidden garden beyond the river (right bank): arch, standing stones, glowing flora
  const grove=G.flags.ionePathMade?G.flags.ionePathChoice:null;
  const gx=Math.round(790-cam);
  if(gx>-420&&gx<W+120){
    // stone arch overgrown with vines
    bv(gx,y-104,14,104,'#6c7a76');bv(gx+176,y-112,14,112,'#6c7a76');
    for(let k=0;k<190;k+=10)bv(gx+k,y-118-Math.round(Math.sin(k/190*Math.PI)*14),12,10,k%20?'#7a8a84':'#86968f');
    for(let k=0;k<20;k++){const vx=gx+4+k*9,vy=y-112+Math.round(Math.sin(k)*3);R(vx,vy,2,14+(k%5)*5,'#2c674d');R(vx,vy+10+(k%4)*4,4,3,'#4e8b67');}
    // rune bands that pulse
    const pu=.5+.5*Math.sin(S.t*2),rc=grove==='dusk'?'#c79aff':'#bfffd0';
    for(let k=0;k<5;k++){R(gx+6,y-96+k*14,2,5,rc);R(gx+182,y-102+k*14,2,5,rc);}
    worldGlow(gx+95,y-84,90,grove==='dusk'?'rgba(185,110,240,.2)':'rgba(166,240,190,.2)');
    // luminous planting beds
    for(let i=0;i<6;i++){const fx=gx+14+i*29;bv(fx,y-18,24,18,'#4a6a50');
      for(let k=0;k<5;k++){const hh=6+(worldHash(i,k)%9),cc=(k+i)%3===0?'#e8c0f0':(k+i)%3===1?'#f0e098':'#a8e0c0';R(fx+2+k*5,y-18-hh,2,hh,'#3a8a58');R(fx+1+k*5,y-20-hh,4,4,cc);if(Math.floor(S.t*2+i+k)%7===0)R(fx+k*5,y-24-hh,1,1,'#fff');}}
    // willow and mossy standing stones
    for(const [dx,h] of [[-30,40],[212,46]]){R(gx+dx,y-h-12,6,h+12,'#4a3a2a');for(let k=0;k<7;k++){const wv=Math.round(Math.sin(S.t*1.3+k)*2);R(gx+dx-14+k*5+wv,y-h-8,2,34+(k%3)*8,'#3c7a54');R(gx+dx-14+k*5+wv,y-h-8+30+(k%3)*8,2,3,'#7ac898');}}
  }
  // River gorge under the broken bridge, banks and wreckage
  if(B){
    const e=Math.round(B.edge-cam),r=Math.round(B.to-cam);
    if(e<W+80&&r>-80){
      // cliff faces dropping to the water
      for(let k=0;k<30;k+=3){const d=H-y;R(e-28+k,y,3,Math.min(d,(k*1.5)|0)+0,'#4a4a52');}
      g.fillStyle='#252a36';g.fillRect(e-4,y-2,r-e+8,H-y+4);
      // dark water with moving foam streaks
      const wg=g.createLinearGradient(0,y,0,H);wg.addColorStop(0,'#2d4a58');wg.addColorStop(1,'#14222c');g.fillStyle=wg;g.fillRect(e,y+3,r-e,H-y);
      for(let k=0;k<26;k++){const fx=e+((k*17+S.t*(26+k%5*9))%(r-e)),fy=y+8+(k%6)*9;R(Math.round(fx),fy,8+(k%4)*3,1,'rgba(205,230,235,.55)');}
      for(let k=0;k<4;k++){const fx=e+((k*61+S.t*40)%(r-e));R(Math.round(fx),y+3,14,2,'rgba(230,240,245,.65)');}
      // rock walls with moss
      for(let k=0;k<5;k++){bv(e-6,y+4+k*12,10,12,k%2?'#52525a':'#44444c');bv(r-4,y+4+k*12,10,12,k%2?'#52525a':'#44444c');}
      // spray mist
      for(let k=0;k<10;k++){const mx=e+((k*13+S.t*8)%(r-e)),my=y-2-((S.t*20+k*9)%18);R(Math.round(mx),Math.round(my),3,1,'rgba(220,235,245,.35)');}
    }
  }
  // Wrecked wayfarer's cart and spilled cargo on the near bank: the road is not safe
  const wc=Math.round(430-cam);
  if(wc>-80&&wc<W+40){
    ground(wc-4,70,y,.4);bv(wc,y-22,44,12,'#6a4a2e');R(wc+2,y-20,40,2,'#8a6a42');
    g.save();g.translate(wc+10,y-4);g.rotate(-.6);bv(-9,-9,18,18,'#4f3626');R(-6,-6,12,12,'#6a4a2e');R(-1,-9,2,18,'#4f3626');R(-9,-1,18,2,'#4f3626');g.restore();
    bv(wc+36,y-12,14,12,'#8a6a42');bv(wc+50,y-8,10,8,'#7a5a3a');R(wc+26,y-6,6,6,'#c9a85a');R(wc+60,y-3,5,3,'#c9a85a');
  }
  // Muddy road and grass on the near bank, stone flags in the grove
  R(0,y,Math.round(((B&&B.edge)||0)-cam)+0,H-y,'#5a4a3a');
  const rb=B?Math.round(B.to-cam):0;if(rb<W)R(Math.max(0,rb),y,W-Math.max(0,rb),H-y,'#4a5a4a');
  const bl=Math.round(((B&&B.edge)||0)-cam);
  if(bl>0){R(0,y,Math.min(W,bl),2,'#7a6a52');for(let k=0;k<Math.min(W,bl);k+=9)R(k,y+4+(k*7)%12,6,1,'#46372a');}
  if(rb<W){const x0=Math.max(0,rb);R(x0,y,W-x0,2,'#6a8a68');for(let k=x0;k<W;k+=9)R(k,y+4+(k*5)%12,6,1,'#35503e');}
}
// Wreckage, Dawn stepping stones and the Dusk causeway (drawn in the playable layer).
function sceneBridgeWorld(a,cam,y){
  const B=a.bridge,edge=Math.round(B.edge-cam),right=Math.round(B.to-cam),w=B.to-B.edge;
  if(edge>W+80||right<-80)return;
  // stone abutments with torn masonry
  bv(edge-30,y-26,34,26,'#7a7468');for(let k=0;k<3;k++)R(edge-30,y-20+k*7,34,1,'#524e46');R(edge-26,y-26,10,3,'#9a948a');R(edge-8,y-26,12,4,'#6a645a');
  bv(right-2,y-26,34,26,'#7a7468');for(let k=0;k<3;k++)R(right-2,y-20+k*7,34,1,'#524e46');R(right+12,y-26,12,3,'#9a948a');R(right+26,y-26,6,4,'#6a645a');
  // splintered planks and a snapped rope hanging into the gorge
  g.strokeStyle='#70523f';g.lineWidth=3;g.beginPath();g.moveTo(edge-12,y-14);g.lineTo(edge+12,y+12);g.moveTo(edge-8,y-18);g.lineTo(edge+18,y+6);g.moveTo(right+10,y-14);g.lineTo(right-14,y+13);g.stroke();
  g.strokeStyle='#cbb98c';g.lineWidth=1;g.beginPath();g.moveTo(edge-4,y-16);g.quadraticCurveTo(edge+6,y+12,edge+2,y+24);g.stroke();
  for(let k=0;k<4;k++){R(edge+8+k*5,y+18+(k%2)*9+Math.round(Math.sin(S.t*2+k)*1),8,3,'#5a4128');}
  const route=G.flags.ionePathMade&&G.flags.ionePathChoice;
  if(route==='dawn'){
    // Light reveals ancient stepping stones, rimmed in gold, with drifting petals of light.
    for(let k=0;k<6;k++){
      const xx=Math.round(edge+k*(w-18)/5+4),top=y-8+(k%2)*2;
      bv(xx,top,20,12,'#9aaeb0');R(xx+1,top,18,3,'#e8f6ee');R(xx+3,top-3,12,2,'rgba(255,245,170,.85)');R(xx+7,top+4,6,1,'rgba(255,245,170,.55)');
      worldGlow(xx+10,top,24,'rgba(255,240,170,.17)');
      for(let m=0;m<2;m++){const py2=top-6-((S.t*14+k*9+m*21)%24);R(xx+4+m*9+Math.round(Math.sin(S.t*2+k+m)*2),Math.round(py2),2,2,'rgba(255,250,200,.8)');}
    }
    for(let k=0;k<8;k++){R(edge+((k*31+S.t*16)%(w)),y-34-((S.t*18+k*7)%26),1,5,'rgba(255,245,190,.22)');}
  }else if(route==='dusk'){
    // Dusk raises a jagged basalt causeway threaded with violet light.
    for(let k=0;k<9;k++){
      const xx=Math.round(edge+3+k*(w-6)/9),top=y-12-(k%3)*3,hh=24-(k%3)*3;
      bv(xx,top,15,hh,k%3?'#4a3a62':'#352a4a');R(xx+2,top,10,2,'#a789ae');R(xx+5,top+4,2,hh-8,'rgba(200,140,255,.55)');
      worldGlow(xx+7,top,20,'rgba(185,110,240,.16)');
    }
    for(let k=0;k<7;k++){R(edge+((k*29+S.t*12)%(w)),y-10-((S.t*16+k*9)%30),2,2,'rgba(210,150,255,.7)');}
  }
  if(!route){bv(edge+w*.47,y-34,8,22,'#7e6a58');R(edge+w*.47+2,y-38,4,4,'#ba9b71');}
}
