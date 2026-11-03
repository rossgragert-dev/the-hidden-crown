/* ================= HANDCRAFTED PROP LIBRARY (v0.7.0 art pass) =================
   Every playable object uses the same language as the characters and horses:
   edge-lit bevels (light top/left, dark bottom/right), material grain, and a
   contact shadow so nothing floats. Coordinates: x = centre, py = ground line.
*/
function bv(x,y,w,h,c){
  if(w<=0||h<=0)return;x=Math.round(x);y=Math.round(y);R(x,y,w,h,c);
  if(h>=3)R(x,y,w,1,sh(c,.3));if(w>=3)R(x,y,1,h,sh(c,.15));
  if(h>=3)R(x,y+h-1,w,1,sh(c,-.32));if(w>=3)R(x+w-1,y,1,h,sh(c,-.22));
}
function woodB(x,y,w,h,c,vert){
  bv(x,y,w,h,c);const d=sh(c,-.16);
  if(vert){for(let k=3;k<w-1;k+=4)R(x+k,y+1,1,h-2,d);}else{for(let k=3;k<h-1;k+=4)R(x+1,y+k,w-2,1,d);}
}
function ground(x,w,py,a){R(Math.round(x),py-1,w,2,'rgba(8,5,4,'+(a||.34)+')');R(Math.round(x)+2,py+1,w-4,1,'rgba(8,5,4,'+((a||.34)*.55)+')');}
function iron(x,y,w,h){bv(x,y,w,h,'#4a4d58');if(w>3&&h>3)R(x+1,y+1,1,1,'#8a8e9a');}
function glint(x,y,ph){if(Math.floor(S.t*1.6+ph)%5===0){R(x,y-1,1,3,'#fff6c8');R(x-1,y,3,1,'#fff6c8');}}
function strawTuft(x,y,w,seed,c1,c2){for(let k=0;k<w;k+=2){const h=worldHash(seed,k);R(x+k,y-(h%3),1,3+(h%3),(h&4)?c1:c2);}}

function propChest(x,py,o){
  const gold=(o&&o.rarity>=2),b=gold?'#7a4a22':'#6a4426',band=gold?'#e2b84a':'#4f5360';
  ground(x-14,28,py,.38);
  woodB(x-13,py-13,26,13,b);                         // body
  woodB(x-13,py-20,26,8,sh(b,.12));                  // lid
  R(x-11,py-22,22,2,sh(b,.1));R(x-9,py-23,18,1,sh(b,.2)); // curved lid top
  bv(x-12,py-20,3,20,band);bv(x+9,py-20,3,20,band);  // straps
  bv(x-2,py-15,5,6,gold?'#f4d56a':'#c9a24a');R(x,py-13,1,3,'#2a1a12'); // lock plate
  R(x-13,py-8,26,1,sh(b,-.28));
  if(gold)glint(x+7,py-22,x);
}
function propKey(x,py){
  // key ring on a wall peg board
  woodB(x-9,py-30,18,5,'#6a4a2e');R(x-7,py-26,2,3,'#3a281c');R(x+5,py-26,2,3,'#3a281c');
  R(x-1,py-25,2,5,'#8a8e9a');
  bv(x-4,py-21,9,3,'#d4b24a');bv(x-5,py-19,4,4,'#d4b24a');R(x-4,py-18,2,2,'#2a1a12'); // ring head
  R(x+1,py-18,1,9,'#d4b24a');bv(x+1,py-12,4,2,'#d4b24a');bv(x+1,py-9,3,2,'#d4b24a'); // shaft + teeth
  glint(x-3,py-21,x);
}
function propBreastplate(x,py){
  woodB(x-2,py-14,4,14,'#6a4a2e');woodB(x-9,py-3,18,3,'#4f3626');ground(x-10,20,py);
  bv(x-11,py-38,22,24,'#8e96a4');R(x-11,py-38,22,2,'#d6dde6');R(x-1,py-36,2,20,'#c3cad6');
  bv(x-14,py-36,6,10,'#a6aebb');bv(x+8,py-36,6,10,'#a6aebb');
  R(x-8,py-24,16,1,'#5b6270');R(x-6,py-18,12,3,'#d8b45a');
  glint(x+4,py-32,x);
}
function propHelm(x,py){
  woodB(x-1,py-9,3,9,'#6a4a2e');woodB(x-8,py-3,16,3,'#4f3626');ground(x-9,18,py);
  bv(x-8,py-26,16,17,'#a6aebb');R(x-8,py-26,16,2,'#e4eaf2');R(x+2,py-24,5,14,'#7a8290');
  R(x-6,py-19,12,2,'#15151c');R(x-6,py-15,12,1,'#2a2c36'); // visor slit + vents
  bv(x-1,py-32,3,6,'#b02a3a');R(x-2,py-34,5,3,'#d04a5a'); // plume
  glint(x-4,py-24,x+1);
}
function propOil(x,py){
  ground(x-9,18,py);
  bv(x-5,py-14,10,14,'#9a5a32');R(x-4,py-12,3,10,'#c98a5a');R(x-3,py-17,6,3,'#7a4a28');R(x-2,py-19,4,2,'#d8c08a'); // jar + cork
  bv(x-4,py-9,8,4,'#e8dcc0');R(x-3,py-8,6,1,'#9a5a32'); // label
  bv(x+6,py-5,7,5,'#d8d0c0');R(x+7,py-3,5,1,'#a89a82'); // polishing rag
  glint(x-2,py-14,x+2);
}
function propSaddle(x,py){
  woodB(x-14,py-15,4,15,'#5a3d28');woodB(x+10,py-15,4,15,'#5a3d28');woodB(x-16,py-18,32,4,'#6a4a2e');ground(x-16,32,py);
  bv(x-12,py-27,24,9,'#7a4a2a');R(x-12,py-27,24,2,'#a8683a');
  bv(x-12,py-31,6,6,'#6a3e22');bv(x+6,py-34,6,9,'#6a3e22');            // pommel / cantle
  bv(x-4,py-26,8,6,'#b02a3a');R(x-3,py-25,6,1,'#e2b84a');             // tourney pad
  R(x+12,py-24,2,10,'#5a3d28');bv(x+10,py-14,6,3,'#9aa3b0');          // stirrup
  glint(x-9,py-27,x);
}
function propLances(x,py,n){
  ground(x-14,28,py);woodB(x-14,py-5,28,5,'#5a3d28');
  for(let k=0;k<(n||5);k++){
    const lx=x-11+k*5,tilt=(k-2)*1.2;
    for(let t=0;t<44;t+=2){R(Math.round(lx+tilt*t/18),py-6-t,3,2,(Math.floor(t/6)%2)?'#e8e0cc':'#2f5fd0');}
    R(Math.round(lx+tilt*2.4),py-52,3,5,'#cfd6df');
  }
}
function propShieldRack(x,py,col){
  woodB(x-14,py-4,28,4,'#4f3626');woodB(x-11,py-34,3,31,'#6a4a2e');woodB(x+8,py-34,3,31,'#6a4a2e');ground(x-15,30,py);
  woodB(x-13,py-32,26,3,'#8a6a42');
  const c=col||'#2c567e';
  bv(x-9,py-29,18,3,'#2a2028');bv(x-9,py-27,18,10,c);bv(x-8,py-17,16,5,c);bv(x-6,py-12,12,4,c);bv(x-3,py-8,6,3,c);
  R(x-1,py-27,2,18,'#e8d8a0');R(x-6,py-22,12,2,'#e8d8a0');
}
function propDoor(x,py,locked,kind){
  const wd=kind==='barn'?'#6a4a2c':kind==='gate'?'#6a5036':'#5a3c26',fr=kind==='stone'?'#7a7a80':'#3a2a20';
  ground(x-15,30,py);
  bv(x-14,py-54,28,54,fr);                                     // frame
  for(let k=0;k<5;k++)woodB(x-11+k*5,py-50,5,50,sh(wd,(k%2)*.08),true);
  R(x-11,py-50,22,2,sh(wd,-.3));
  bv(x-12,py-52,24,6,fr);R(x-10,py-58,20,5,fr);R(x-7,py-61,14,4,fr);   // arch
  iron(x-11,py-42,22,3);iron(x-11,py-18,22,3);
  R(x-1,py-48,2,48,'#2a1a12');
  bv(x+4,py-26,3,5,locked?'#8a3a3a':'#d8b45a');
  if(locked){bv(x-3,py-30,6,6,'#4f5360');R(x-1,py-28,2,2,'#1a1a1e');}
  R(x-12,py-1,24,1,'rgba(255,230,160,.18)');
}
function propArcheryButt(x,py,hit){
  ground(x-18,36,py);
  woodB(x-16,py-8,4,8,'#4f3626');woodB(x+12,py-8,4,8,'#4f3626');
  woodB(x-13,py-34,3,28,'#6a4a2e');woodB(x+10,py-34,3,28,'#6a4a2e');
  // straw boss with painted rings
  bv(x-14,py-46,28,28,'#c9a85a');strawTuft(x-14,py-46,28,11,'#e2c77e','#a98a3e');strawTuft(x-14,py-18,28,17,'#a98a3e','#e2c77e');
  R(x-11,py-43,22,22,'#efe3c4');R(x-9,py-41,18,18,'#b7463e');R(x-6,py-38,12,12,'#efe3c4');R(x-3,py-35,6,6,'#d8b45a');R(x-1,py-33,2,2,'#7a2a26');
  for(const [dx,dy,l] of [[-8,-30,5],[6,-40,4],[-3,-24,6]]){R(x+dx,py+dy,l,1,'#8a6a42');R(x+dx+l,py+dy-1,2,3,'#e8e0cc');}
  if(hit)glint(x+2,py-34,x);
}
function propDummy(x,py){
  ground(x-14,28,py);
  woodB(x-10,py-5,20,5,'#4f3626');woodB(x-2,py-48,4,44,'#6a4a2e');
  woodB(x-17,py-42,34,4,'#6a4a2e');                                  // cross arm
  bv(x-9,py-40,18,22,'#c9a85a');strawTuft(x-9,py-40,18,5,'#e2c77e','#a98a3e'); // padded torso
  R(x-9,py-30,18,2,'#6a4a2e');R(x-9,py-24,18,2,'#6a4a2e');                    // rope bindings
  bv(x-7,py-54,14,13,'#d8c08a');R(x-6,py-52,12,2,'#e8d8a8');R(x-4,py-47,2,2,'#4a3a26');R(x+2,py-47,2,2,'#4a3a26'); // sack head
  bv(x-17,py-45,5,5,'#c9a85a');bv(x+12,py-45,5,5,'#c9a85a');                   // straw arms
  bv(x-6,py-20,12,3,'#7a4a2e');                                                // belt
  R(x+5,py-36,5,1,'#8a2a2a');R(x+7,py-35,1,4,'#8a2a2a');                       // old strike mark
}
function propGuardStand(x,py){
  ground(x-14,28,py);woodB(x-11,py-4,22,4,'#4f3626');woodB(x-2,py-44,4,40,'#6a4a2e');
  woodB(x-14,py-36,28,3,'#6a4a2e');
  bv(x-11,py-48,22,22,'#9aa3b0');R(x-11,py-48,22,2,'#d6dde6');                // padded gambeson torso with plate
  bv(x-8,py-44,16,14,'#3b5b7a');R(x-1,py-42,2,10,'#d8c08a');R(x-5,py-38,10,2,'#d8c08a');
  bv(x-6,py-58,12,11,'#aab0b8');R(x-6,py-58,12,2,'#e4eaf2');R(x-4,py-53,8,2,'#15151c'); // helm
}
function propWeapon(x,py,kind){
  woodB(x-9,py-4,18,4,'#4f3626');ground(x-10,20,py);woodB(x-1,py-40,3,36,'#6a4a2e');R(x-8,py-30,16,2,'#8a6a42');
  if(kind==='bow'){
    g.strokeStyle='#a97c4a';g.lineWidth=3;g.beginPath();g.moveTo(x,py-42);g.quadraticCurveTo(x+16,py-22,x,py-3);g.stroke();
    g.strokeStyle='#e8dcc0';g.lineWidth=1;g.beginPath();g.moveTo(x,py-42);g.lineTo(x,py-3);g.stroke();
    for(let k=0;k<3;k++){R(x-7-k*2,py-30+k*3,1,12,'#b88a52');R(x-8-k*2,py-32+k*3,3,3,'#c43a3a');}
  }else if(kind==='staff'){
    woodB(x-2,py-46,4,44,'#7a5a3a');bv(x-5,py-52,10,9,'#5a8a6a');R(x-3,py-50,6,5,'#bfe8c8');R(x-1,py-49,2,3,'#fff');
    for(let k=0;k<4;k++)R(x-4+k*3,py-57-(k%2)*2,2,5,'#6aa85a');
    worldGlow(x,py-48,16,'rgba(170,230,190,.18)');
  }else{
    bv(x-3,py-46,6,22,'#aab4c4');R(x-1,py-46,2,22,'#e4eaf2');R(x-1,py-48,2,3,'#cfd6df');
    bv(x-9,py-25,18,4,'#8a6a42');bv(x-2,py-21,4,10,'#4a3020');bv(x-3,py-11,6,3,'#d8b45a');
    glint(x,py-40,x);
  }
}
function propReins(x,py){
  ground(x-24,48,py);
  // hitching rail with reins ring and a water trough
  woodB(x-22,py-26,4,26,'#6a4a2e');woodB(x+18,py-26,4,26,'#6a4a2e');woodB(x-24,py-28,48,5,'#8a6a42');
  bv(x-6,py-11,28,11,'#5a4a3a');R(x-4,py-9,24,3,'#3a6a8a');R(x-3,py-9,8,1,'#8ac0d8');
  g.strokeStyle='#4a2e1c';g.lineWidth=1;g.beginPath();g.moveTo(x-12,py-24);g.quadraticCurveTo(x-5,py-12,x+2,py-24);g.stroke();
  bv(x-14,py-24,4,4,'#9aa3b0');bv(x,py-24,4,4,'#9aa3b0');
}
function propRuneStone(x,py,act){
  ground(x-16,32,py);
  bv(x-13,py-42,26,42,'#6c7a76');bv(x-10,py-50,20,10,'#7a8a84');bv(x-6,py-55,12,6,'#86968f');
  R(x-9,py-36,2,30,'#566460');R(x+6,py-30,2,22,'#566460');
  const c=act?'#bfffd0':'#8ad8b0',n=Math.floor(S.t*2)%3;
  for(const [dx,dy,w,h] of [[-3,-40,6,2],[-1,-40,2,12],[-5,-28,10,2],[-4,-22,2,8],[2,-22,2,8],[-3,-14,6,2]])R(x+dx,py+dy,w,h,c);
  worldGlow(x,py-28,26+(n?0:4),'rgba(150,240,190,.15)');
}
function propBarrel(x,py,c){
  c=c||'#6a4a2e';ground(x-9,18,py);
  woodB(x-8,py-18,16,18,c,true);bv(x-9,py-16,18,2,'#4f5360');bv(x-9,py-6,18,2,'#4f5360');R(x-6,py-19,12,2,sh(c,.2));
}
function propCrate(x,py,c){
  c=c||'#8a6a42';ground(x-11,22,py);woodB(x-10,py-16,20,16,c);
  R(x-10,py-16,20,2,sh(c,.2));R(x-9,py-15,2,14,sh(c,-.25));R(x+7,py-15,2,14,sh(c,-.25));
  for(let k=0;k<12;k++){R(x-8+k,py-14+k,1,1,sh(c,-.28));}
}
function propSign(x,py,txt,col){
  woodB(x-2,py-34,4,34,'#5a3d28');ground(x-8,16,py);
  bv(x-16,py-42,32,12,col||'#8a6a42');R(x-14,py-40,28,1,sh(col||'#8a6a42',.3));
  R(x-12,py-37,8,1,'#2a1a12');R(x-12,py-35,14,1,'#2a1a12');R(x+4,py-37,8,1,'#2a1a12');
}
function propBench(x,py,w,c){
  c=c||'#7a5a3a';ground(x-w/2,w,py);
  woodB(x-w/2,py-14,w,4,c);woodB(x-w/2+3,py-10,4,10,sh(c,-.15));woodB(x+w/2-7,py-10,4,10,sh(c,-.15));
}
function propBanner(x,py,col,col2){
  woodB(x-1,py-50,3,50,'#4f3626');ground(x-8,16,py);R(x-2,py-52,5,3,'#d8b45a');
  for(let k=0;k<16;k++){const w=Math.round(Math.sin(S.t*4+k*.5+x)*1);R(x+2+k,py-48+w+(k>>2),1,12-(k>>1),k%6<1?col2:col);}
  bv(x-6,py-6,13,6,'#6a4a2e');
}
