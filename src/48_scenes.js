/* ================= AUTHORED SCENES: armory bays + tournament lists =================
   Pure drawing helpers called from adventureBackdrop(). All coordinates are screen
   pixels in the internal low-res canvas; y is the ground line (GY).
*/
const STEEL='#9aa3b0',STEEL_D='#5b6270',STEEL_L='#d6dde6',GOLD='#d8b45a',NAVY='#283b61';
function sHash(a,b){let h=(Math.imul(a+101,73856093)^Math.imul(b+7,19349663))>>>0;h^=h>>>13;return h>>>0;}
// A full plate-armour suit on a stand. cx = centre x, y = ground.
function plateStand(cx,y,o){
  o=o||{};const tab=o.tab||NAVY,plume=o.plume||'#b02a3a';
  R(cx-1,y-34,3,34,'#4a3a2c');R(cx-10,y-3,21,3,'#3a2c22');R(cx-10,y-3,21,1,'#5a4634');
  R(cx-7,y-40,6,24,STEEL_D);R(cx+2,y-40,6,24,STEEL_D);R(cx-7,y-40,2,24,STEEL);R(cx+2,y-40,2,24,STEEL);
  R(cx-8,y-18,7,5,'#3a3a44');R(cx+2,y-18,7,5,'#3a3a44');
  R(cx-9,y-66,19,28,STEEL);R(cx-9,y-66,19,2,STEEL_L);R(cx-9,y-66,2,28,STEEL_L);R(cx+7,y-66,3,28,STEEL_D);R(cx-9,y-40,19,2,STEEL_D);
  R(cx,y-64,1,22,STEEL_L);
  if(tab){R(cx-5,y-58,11,26,tab);R(cx-1,y-55,3,14,GOLD);R(cx-4,y-50,9,3,GOLD);}
  R(cx-14,y-68,7,9,STEEL);R(cx-14,y-68,7,2,STEEL_L);R(cx+8,y-68,7,9,STEEL);R(cx+8,y-68,7,2,STEEL_L);
  R(cx-13,y-58,4,20,STEEL_D);R(cx-13,y-58,1,20,STEEL);R(cx+10,y-58,4,20,STEEL_D);R(cx+10,y-58,1,20,STEEL);
  R(cx-5,y-80,11,14,STEEL);R(cx-5,y-80,11,2,STEEL_L);R(cx-5,y-80,2,14,STEEL_L);R(cx+4,y-80,2,14,STEEL_D);
  R(cx-4,y-74,9,2,'#15151c');R(cx,y-80,1,6,STEEL_D);
  R(cx-1,y-90,3,10,plume);R(cx-2,y-92,5,4,sh(plume,.25));
}
function swordProp(x,y,len,col){R(x,y-len,2,len,col||'#d3d8de');R(x,y-len,1,len,'#fff');R(x-4,y,10,2,'#8a6a2a');R(x,y+2,2,7,'#4a3020');R(x,y+9,2,2,GOLD);}
function axeProp(x,y,len){R(x,y-len,2,len,'#7a5a3a');R(x-6,y-len+2,8,10,STEEL);R(x-6,y-len+2,8,2,STEEL_L);R(x-7,y-len+4,2,6,STEEL_D);}
function maceProp(x,y,len){R(x,y-len,2,len,'#6a4a2a');R(x-3,y-len-5,8,8,STEEL_D);R(x-3,y-len-5,8,2,STEEL);R(x-5,y-len-2,2,2,STEEL);R(x+5,y-len-2,2,2,STEEL);}
function heaterShield(x,y,col,col2){R(x,y,14,3,'#2a2028');R(x,y+3,14,9,col);R(x+1,y+12,12,4,col);R(x+3,y+16,8,3,col);R(x+5,y+19,4,2,col);R(x+1,y+3,2,12,sh(col,.25));R(x+11,y+3,2,12,sh(col,-.25));R(x+6,y+3,2,16,col2);R(x+3,y+8,8,2,col2);}
function torchBracket(x,y,n){
  R(x,y+6,3,22,'#987e57');R(x-5,y+3,13,5,'#a6a6a2');
  const fl=Math.round(Math.sin(S.t*11+n)*2);
  R(x-1,y-14-fl,6,17+fl,'#f2a546');R(x+1,y-10-fl,3,10,'#ffe09a');R(x+1,y-18-fl,1,4,'#f2a546');
  const gl=g.createRadialGradient(x+2,y-4,2,x+2,y-4,64);gl.addColorStop(0,'rgba(245,151,63,.2)');gl.addColorStop(1,'rgba(245,151,63,0)');
  g.fillStyle=gl;g.fillRect(x-62,y-68,128,128);
}
function armoryBay(x,y,n,style){
  if(style===0){ // heraldry hall: long banner, crossed lances, shields
    R(x+44,y-176,70,5,'#b49561');R(x+44,y-176,70,1,'#e0cc90');
    for(let k=0;k<5;k++)R(x+49+k*14,y-171,2,6,'#8a7040');
    R(x+50,y-170,58,92,NAVY);R(x+50,y-170,3,92,sh(NAVY,.2));R(x+105,y-170,3,92,sh(NAVY,-.25));
    R(x+76,y-156,6,52,'#d8b45a');R(x+63,y-139,32,6,'#d8b45a');R(x+78,y-152,2,44,'#f0d890');
    for(let k=0;k<6;k++)R(x+50+k*10,y-78,6,4,k%2?GOLD:'#a88a42');
    R(x+20,y-130,2,96,'#bfa681');R(x+18,y-134,6,5,'#9aa3b0');R(x+124,y-130,2,96,'#bfa681');R(x+122,y-134,6,5,'#9aa3b0');
    heaterShield(x+22,y-70,'#a83a3a','#e8d8a0');heaterShield(x+112,y-70,'#2c567e','#e8d8a0');
    R(x+60,y-22,56,22,'#4a3a2c');R(x+60,y-22,56,3,'#6a5238');R(x+64,y-19,3,19,'#2f241c');R(x+109,y-19,3,19,'#2f241c');
  }else if(style===1){ // weapon wall
    R(x+24,y-130,124,5,'#34272c');R(x+24,y-130,124,1,'#5a4048');R(x+24,y-88,124,5,'#34272c');
    for(let k=0;k<7;k++){const q=x+34+k*17,t=k%4;
      if(t===0)swordProp(q,y-92,36);else if(t===1)axeProp(q,y-30,60);else if(t===2)maceProp(q,y-30,52);else swordProp(q,y-92,30,'#c4cbd4');}
    R(x+26,y-62,120,4,'#34272c');
    for(let k=0;k<5;k++)R(x+34+k*22,y-120+(k%2)*2,3,28,'#7a5a3a');
    R(x+40,y-22,96,6,'#6a5038');R(x+44,y-16,5,16,'#3a2c22');R(x+127,y-16,5,16,'#3a2c22');
    R(x+56,y-30,8,8,'#9aa3b0');R(x+70,y-28,12,6,'#7a5a3a');R(x+96,y-31,10,9,STEEL_D);
  }else if(style===2){ // forge
    R(x+30,y-92,96,92,'#3e353b');R(x+30,y-92,96,3,'#6a5c62');R(x+34,y-88,88,84,'#4d4248');
    for(let r=0;r<6;r++)for(let c=0;c<4;c++){R(x+36+c*22+(r%2)*10,y-86+r*14,19,11,['#5a4e54','#4a3f45','#625559'][(r+c)%3]);}
    R(x+46,y-62,64,50,'#1d1518');R(x+42,y-66,72,6,'#2c2226');
    R(x+60,y-132,36,44,'#4a3f45');R(x+66,y-150,24,22,'#3e353b');R(x+72,y-160,12,14,'#34292e'); // hood + chimney
    const fl=8+Math.round(Math.sin(S.t*8+n)*3);
    R(x+54,y-28,48,14,'#2a1c1a');R(x+58,y-34,40,8,'#a8481e');R(x+64,y-22-fl,26,fl,'#eb9b3e');R(x+70,y-18-fl,14,fl,'#ffde70');R(x+74,y-14-fl*0.5,6,fl*.5,'#fff4c0');
    for(let e=0;e<4;e++){const p=((S.t*.9+e*.25+n*.1)%1);R(x+62+e*9+Math.round(Math.sin(S.t*3+e)*4),y-48-Math.round(p*34),2,2,p<.7?'#ffb04a':'#a06a3a');}
    const wg=g.createRadialGradient(x+78,y-30,4,x+78,y-30,70);wg.addColorStop(0,'rgba(255,150,60,.26)');wg.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=wg;g.fillRect(x+8,y-100,140,110);
    // anvil on stump
    R(x+136,y-12,20,12,'#5a4330');R(x+136,y-12,20,2,'#7a5a40');
    R(x+130,y-26,34,6,'#4d525c');R(x+130,y-26,34,1,'#8d93a0');R(x+160,y-24,10,3,'#4d525c');R(x+138,y-20,16,8,'#3d424c');
    R(x+10,y-70,2,30,'#8a8a92');R(x+16,y-70,2,30,'#8a8a92');R(x+8,y-44,12,4,'#6a6a72'); // hanging tongs
    R(x+4,y-28,18,28,'#5a4330');R(x+4,y-28,18,3,'#8a6a40');R(x+4,y-18,18,2,'#2a2a30');R(x+5,y-30,16,2,'#3a6a8a');
  }else{ // armour stands + helm shelf
    plateStand(x+36,y,{tab:NAVY});
    plateStand(x+112,y,{tab:'#8a2a3a',plume:'#e8e8f2'});
    R(x+62,y-110,40,4,'#4a3a2c');R(x+62,y-110,40,1,'#7a6048');
    for(let k=0;k<3;k++){const hx=x+66+k*13;R(hx,y-126,10,16,STEEL);R(hx,y-126,10,2,STEEL_L);R(hx+1,y-120,8,2,'#15151c');}
    R(x+130,y-24,34,24,'#67503e');R(x+130,y-24,34,3,'#b08e58');R(x+130,y-14,34,2,'#3a2a20');R(x+144,y-18,6,6,GOLD);
  }
}
function sceneArmory(cam,backCam,y){
  // wall light falloff: dim ceiling, warm band at torch height
  const gr=g.createLinearGradient(0,0,0,y);gr.addColorStop(0,'rgba(8,8,16,.62)');gr.addColorStop(.45,'rgba(8,8,16,0)');gr.addColorStop(1,'rgba(40,18,8,.14)');
  g.fillStyle=gr;g.fillRect(0,0,W,y);
  const first=Math.floor(backCam/170)-1,last=Math.ceil((backCam+W)/170)+1;
  for(let n=first;n<=last;n++){
    const x=n*170-backCam;
    // pillars + vault
    R(x+2,24,15,y-24,'#302d39');R(x+5,25,8,y-25,'#6a6266');R(x+5,25,2,y-25,'#8a8086');
    R(x-1,20,21,8,'#938179');R(x+2,14,15,6,'#6b5e63');
    R(x+16,30,45,6,'#76717a');R(x+61,35,47,5,'#5d5661');R(x+108,30,45,6,'#76717a');R(x+150,20,21,8,'#938179');
    R(x+155,24,12,y-24,'#302d39');R(x+158,26,6,y-26,'#655d65');R(x+158,26,2,y-26,'#85808a');
    armoryBay(x,y,n,((n%4)+4)%4);
    torchBracket(x+137,y-147,n);
    // floor light pool under each torch
    const fp=g.createRadialGradient(x+139,y+4,2,x+139,y+4,56);fp.addColorStop(0,'rgba(245,170,80,.18)');fp.addColorStop(1,'rgba(245,170,80,0)');
    g.fillStyle=fp;g.fillRect(x+80,y-4,120,40);
    // contact shadow where furniture meets floor
    R(x+10,y-2,150,3,'rgba(0,0,0,.22)');
  }
  // floor: worn runner rug with gold border
  const ry=y+8;R(0,ry,W,20,'#5a2a30');R(0,ry,W,2,'#d0a850');R(0,ry+18,W,2,'#d0a850');
  for(let k=-(Math.floor(cam*.9)%24);k<W;k+=24)R(k+9,ry+7,6,6,'#8a4a4a');
  R(0,y-12,W,2,'#8a7a70');
}
function crowdPerson(px,py,i,j,cheer){
  const h=sHash(i,j),cols=['#b7463e','#2c567e','#e2b55f','#4a7a4a','#7a4a8a','#d8d0c0','#8a5a3a'],sk=['#e8bd94','#d8a880','#c89870','#f0cfa8'],hr=['#3a2a1a','#8a5a2a','#c8a058','#6a6a6a','#1c1c24'];
  const c=cols[h%7],bob=cheer?(Math.floor(S.t*6+i*.7+j)%2):0;
  R(px,py-9-bob,6,9+bob,c);R(px,py-9-bob,6,2,sh(c,.3));
  R(px+1,py-14-bob,4,5,sk[(h>>3)%4]);R(px+1,py-15-bob,4,2,hr[(h>>5)%5]);
  if(h%5===0)R(px,py-17-bob,6,3,sh(c,-.2)); // hat
  if(cheer){R(px-1,py-15-bob,1,5,sk[(h>>3)%4]);R(px+6,py-14-bob+(bob?0:3),1,4,sk[(h>>3)%4]);}
}
function pennant(x,y,col,n){
  R(x,y-22,2,24,'#654733');
  for(let k=0;k<12;k++){const w=Math.round(Math.sin(S.t*5-k*.5+n)*1.5);R(x+2+k,y-21+w+Math.floor(k*.5),1,Math.max(1,9-k*.7),col);}
}
function tiltStand(x,y,i,cheer){
  R(x+8,y-96,176,72,'#3a2a20');R(x+8,y-96,176,2,'#5a4230');
  for(let t=2;t>=0;t--){
    const ty=y-34-t*19,ix=x+10+t*5,w=172-t*10;
    for(let k=0;k<11-t;k++){const px=ix+6+k*Math.floor((w-14)/(11-t));crowdPerson(px+(sHash(i,k+t*20)%4),ty,i*7+t,k,cheer);}
    R(ix,ty,w,4,'#a07a4a');R(ix,ty,w,1,'#c4a06a');R(ix,ty+4,w,14,'#4a3424');
    for(let k=0;k<w;k+=30)R(ix+k,ty+4,3,14,'#2f2018');
  }
  R(x+6,y-110,5,88,'#4a3424');R(x+181,y-110,5,88,'#4a3424');
  R(x,y-112,192,5,'#3a2a20');
  for(let s=0;s<10;s++){const c=s%2?'#efe3c4':'#c9453d';R(x+s*19+1,y-128,19,16,c);R(x+s*19+1,y-128,19,2,sh(c,.25));R(x+s*19+5,y-112,11,4,c);}
  R(x,y-130,192,3,'#7a2a26');
  pennant(x+1,y-130,'#c9453d',i);pennant(x+190,y-130,'#2c567e',i+2);
  for(let k=0;k<16;k++){const bx=x+10+k*11,by=y-100+Math.round(Math.sin(k*.4)*3);R(bx,by,2,1,'#2a2020');R(bx,by+1,4,4,k%3===0?'#e2b55f':k%3===1?'#b7463e':'#2c567e');}
}
function tiltPavilion(x,y,i){
  const c1=NAVY,c2='#efe3c4';
  for(let k=0;k<10;k++){const c=k%2?c1:c2;R(x+14+k*15,y-100,15,72,c);R(x+14+k*15,y-100,15,2,sh(c,.2));R(x+14+k*15,y-30,15,2,sh(c,-.3));}
  for(let r=0;r<14;r++){const hw=82-r*5;R(x+89-hw,y-114+r,hw*2,2,r%2?c1:'#2c4a7a');}
  R(x+86,y-136,6,24,'#8a7040');pennant(x+88,y-132,'#e2b55f',i);
  for(let k=0;k<10;k++)R(x+14+k*15,y-30,15,5,k%2?'#e2b55f':'#a88a42');
  R(x+70,y-70,38,42,'#1c1620');R(x+66,y-72,10,44,c1);R(x+102,y-72,10,44,c1);R(x+70,y-74,38,4,'#e2b55f');
  R(x+76,y-48,26,3,'#4a3a2c');R(x+82,y-62,14,12,'#2a2028');R(x+85,y-60,8,2,'#c9a24a');
  plateStand(x+168,y,{tab:'#2c567e',plume:'#e2b55f'});
  for(let k=0;k<5;k++){const lx=x-12-k*5;R(lx,y-96+k*2,3,92-k*2,k%2?'#e8e0cc':'#2f5fd0');R(lx,y-98+k*2,3,4,'#cfd6df');}
  R(x-34,y-8,28,8,'#4a3a2c');
}
function sceneLists(cam,backCam,y){
  const joust=S.joust,cheer=!!(joust&&(joust.phase==='approach'||joust.phase==='resolve'));
  const sky=g.createLinearGradient(0,0,0,y);sky.addColorStop(0,'#5f8cb4');sky.addColorStop(1,'#cfe0d4');g.fillStyle=sky;g.fillRect(0,0,W,y);
  // clouds drift slowly
  for(let k=0;k<5;k++){const cx=((k*97+S.t*3-cam*.1)%(W+120))-40,cy=22+k*17%60;R(cx,cy,34,6,'rgba(255,255,255,.7)');R(cx+8,cy-4,22,5,'rgba(255,255,255,.7)');R(cx+4,cy+5,28,2,'rgba(200,215,230,.6)');}
  // far hills and castle silhouette
  const hc=Math.floor(cam*.18);
  for(let k=-1;k<Math.ceil(W/60)+2;k++){const hx=k*60-(hc%60),hh=30+(sHash(k+Math.floor(hc/60),3)%22);R(hx,y-hh-40,64,hh+4,'#7d9fa0');R(hx+6,y-hh-44,48,6,'#7d9fa0');}
  const cc=Math.floor(cam*.32);
  for(let k=Math.floor(cc/340)-1;k<=Math.ceil((cc+W)/340);k++){
    const x=k*340-cc+60;R(x,y-104,90,64,'#6a7f93');R(x+8,y-122,16,22,'#6a7f93');R(x+66,y-130,16,30,'#6a7f93');R(x+34,y-114,22,14,'#6a7f93');
    for(let m=0;m<4;m++){R(x+6+m*7,y-126,4,5,'#6a7f93');}
    R(x+40,y-84,10,24,'#4a5a70');R(x+14,y-96,4,8,'#4a5a70');R(x+72,y-104,4,8,'#4a5a70');R(x+72,y-134,2,8,'#8a6a6a');
  }
  R(0,y-44,W,44,'#7da060');R(0,y-44,W,2,'#9ac078');
  for(let k=0;k<W;k+=7)R(k+((sHash(k+Math.floor(backCam),1)%4)),y-42+(k%3),2,3,'#5f8448');
  // mid-ground: stands and pavilions alternating (parallax .74)
  const bay=210;
  for(let i=Math.floor(backCam/bay)-1;i<Math.ceil((backCam+W)/bay)+1;i++){
    const x=i*bay-backCam;
    if(((i%2)+2)%2===0)tiltStand(x,y,i,cheer);else tiltPavilion(x,y,i);
  }
  // sand floor with hoof tracks
  R(0,y,W,H-y,'#bba67b');R(0,y,W,2,'#d0bd90');
  for(let k=-(Math.floor(cam)%11);k<W;k+=11)R(k,y+3+(k%5),6,2,'#ad9469');
  for(let k=-(Math.floor(cam)%29);k<W;k+=29){R(k,y+18+(k%7),4,2,'#9d8658');R(k+7,y+19+(k%7),4,2,'#9d8658');}
  // striped tilt barrier running down the lists (foreground, behind hero)
  const bx=-(Math.floor(cam)%24);
  R(0,y-26,W,4,'#e8dcc0');R(0,y-26,W,1,'#fff');R(0,y-16,W,4,'#e8dcc0');R(0,y-26,W,0,'#000');
  for(let k=bx-24;k<W+24;k+=24){R(k,y-26,12,4,'#b7463e');R(k+12,y-16,12,4,'#2c567e');R(k+2,y-30,5,30,'#654733');R(k+2,y-30,2,30,'#8a6a48');R(k+1,y-34,7,4,'#7a5a3a');}
  R(0,y-1,W,2,'rgba(60,40,20,.28)');
}
