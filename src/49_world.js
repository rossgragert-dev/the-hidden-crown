/* ================= LIVING WORLD / STORY-BOUND SCENERY =================
 * Every story chapter has a distinct geographical identity. No shared
 * castle/tower/moon-window tile is drawn in these scenes. The same authored
 * landmarks can be repeated only where it is narratively appropriate.
 * Weather and time are separate layers, preserving deterministic saves.
 */
const WORLD_ID={
 m0:{style:'farmroad',period:'morning',weather:'breeze',accent:'#d7a95b'},
 m1:{style:'gate',period:'dawn',weather:'breeze',accent:'#b5b6aa'},
 m2:{style:'farmroad',period:'noon',weather:'clouds',accent:'#9d8f65'},
 m3:{style:'granary',period:'late-afternoon',weather:'haze',accent:'#c8a164'},
 m4:{style:'fen',period:'dusk',weather:'fog',accent:'#78ab95'},
 m5:{style:'courtyard',period:'noon',weather:'breeze',accent:'#a9aa98'},
 m6:{style:'library',period:'night',weather:'storm',accent:'#8c79c5'},
 m7:{style:'rampart',period:'night',weather:'wind',accent:'#a4b0ca'},
 m8:{style:'training',period:'noon',weather:'clear',accent:'#cbb778'},
 m9:{style:'chapel',period:'night',weather:'clear',accent:'#b6a077'},
 m10:{style:'siege',period:'dusk',weather:'embers',accent:'#d96739'},
 m11:{style:'forest',period:'night',weather:'rain',accent:'#6f90a6'},
 m12:{style:'frontier',period:'sunset',weather:'wind',accent:'#d8b075'},
 s1:{style:'training',period:'morning',weather:'clear'},
 s2:{style:'forest',period:'noon',weather:'breeze'},
 s3:{style:'farmroad',period:'cloudy',weather:'rain'},
 s4:{style:'fen',period:'night',weather:'fog'},
 s5:{style:'forge',period:'dusk',weather:'haze'},
 d1:{style:'forest',period:'dusk',weather:'fog'},
 d2:{style:'cave',period:'night',weather:'drips'},
 d3:{style:'mine',period:'night',weather:'drips'},
 d4:{style:'ruins',period:'dusk',weather:'embers'}
};
const WORLD_AREAS={
 outskirts:{style:'fieldsiege',period:'dusk',weather:'breeze'},
 gatehouse:{style:'drawbridge',period:'dusk',weather:'embers'},
 village:{style:'cityfire',period:'night',weather:'embers'},
 chapel:{style:'chapelfire',period:'night',weather:'embers'},
 keep:{style:'burningkeep',period:'night',weather:'embers'},
 cellar:{style:'cellar',period:'night',weather:'drips'},
 magegarden:{style:'magegarden',period:'late-afternoon',weather:'breeze'},
 greenroad:{style:'farmroad',period:'sunset',weather:'breeze'}
};
const WORLD_PALETTE={
 morning:['#809cb5','#c9c4ab','#e4bc87'],
 dawn:['#5e82ad','#b3abc2','#edb77e'],
 noon:['#5787b3','#8cb5d0','#e2d5a8'],
 'late-afternoon':['#7193aa','#c2ac9b','#eac29b'],
 cloudy:['#607c8f','#879b9d','#b6ada0'],
 dusk:['#384965','#a26f67','#d69765'],
 sunset:['#3d496d','#b16a5c','#e5a55d'],
 night:['#111b38','#273556','#46526c']
};
function worldConfig(){
  if(S.mode!=='play'||!S.mission)return null;
  if(S.adv&&['armory','stable','lists'].indexOf(S.adv.scenery)>=0)return null;
  const area=S.areaData;
  if(area&&WORLD_AREAS[area.id])return {...WORLD_AREAS[area.id],seed:S.adv?S.adv.seed:13};
  if(S.mission.type==='travel'){
    const a=S.adv||{},i=S.areaIndex||0,total=S.mission.areas.length;
    const prog=(i+Math.min(1,P.x/(a.length||900)))/Math.max(1,total);
    const phase=prog<.14?'dawn':prog<.56?'noon':prog<.8?'sunset':'night';
    return {style:a.scenery==='marsh'?'fen':a.scenery==='forest'?'forest':
      a.scenery==='mountain'?'mountain':a.scenery==='ruins'?'ruins':'farmroad',
      period:phase,weather:a.weather||'breeze',seed:a.seed||1,timeProgress:prog,travel:true};
  }
  return {...(WORLD_ID[S.mission.id]||{style:'forest',period:'noon',weather:'clear'}),seed:S.adv?S.adv.seed:S.mission.id.length*71};
}
function worldHash(a,b){let v=(Math.imul((a|0)+9,2654435761)^Math.imul((b|0)+17,2246822519))>>>0;v^=v>>>15;return v>>>0;}
function worldRect(x,y,w,h,c){if(w>0&&h>0&&x+w>=0&&x<W&&y+h>=0&&y<H)R(Math.round(x),Math.round(y),Math.round(w),Math.round(h),c);}
function worldGlow(x,y,r,color){
  const gr=g.createRadialGradient(x,y,2,x,y,r);gr.addColorStop(0,color);gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);
}
function worldSky(cfg,cam){
  const p=WORLD_PALETTE[cfg.period]||WORLD_PALETTE.noon;
  const gr=g.createLinearGradient(0,0,0,GY);
  gr.addColorStop(0,p[0]);gr.addColorStop(.65,p[1]);gr.addColorStop(1,p[2]);
  g.fillStyle=gr;g.fillRect(0,0,W,H);
  const t=cfg.travel?(cfg.timeProgress||0):cfg.period==='night'?.9:cfg.period==='dusk'?.72:cfg.period==='sunset'?.76:cfg.period==='dawn'?.12:cfg.period==='morning'?.25:.48;
  const moon=t>=.86;
  const cx=Math.round(26+(W-52)*Math.min(1,Math.max(0,t)));
  const cy=Math.round(25+Math.sin(Math.PI*t)*-24+HZ*.28);
  if(moon){worldGlow(cx,cy,34,'rgba(219,221,235,.16)');worldRect(cx-7,cy-7,14,14,'#dde5f0');worldRect(cx-3,cy-10,6,20,'#dde5f0');}
  else{worldGlow(cx,cy,52,'rgba(255,204,129,.24)');worldRect(cx-9,cy-9,18,18,'#f6db99');worldRect(cx-5,cy-13,10,26,'#f6db99');}
  // Clouds move with time and wind; positions depend on each chapter's seed.
  for(let i=0;i<6;i++){
    const x=((worldHash(i,cfg.seed)%700)/700*W+S.t*(cfg.weather==='wind'||cfg.weather==='storm'?13:3)-cam*.03)%(W+140);
    const xx=(x+W+140)%(W+140)-85,y=14+i*17+(worldHash(cfg.seed,i)%9);
    const col=cfg.weather==='storm'?'rgba(40,48,61,.65)':cfg.weather==='rain'?'rgba(75,83,95,.55)':'rgba(244,241,218,.31)';
    worldRect(xx,y,52,7,col);worldRect(xx+8,y-5,30,6,col);worldRect(xx-8,y+4,71,5,col);
  }
  // Far silhouette is unique to the region: no repeating distant castle.
  if(['fen','forest','mountain','farmroad','fieldsiege','frontier','ruins'].indexOf(cfg.style)>=0){
    const color=cfg.period==='night'?'#28344a':cfg.style==='fen'?'#587b76':'#718581';
    for(let x=-10;x<W+10;x+=4){
      const h=25+Math.abs(Math.sin((x+cam*.09+cfg.seed*17)/79)*35+Math.cos(x/31)*15);
      worldRect(x,GY-87-h,4,85+h,color);
    }
  }
}
function worldTree(x,ground,kind,seed){
  const h=38+(seed%34),dark=kind==='fen'?'#2c4547':kind==='forest'?'#293f37':'#465b40';
  worldRect(x-4,ground-h,9,h,'#4c392d');worldRect(x-1,ground-h,2,h,'#78644a');
  if(kind==='fen'){
    worldRect(x-28,ground-h+9,58,6,'#465647');worldRect(x-23,ground-h,46,8,'#355449');
    for(let v=0;v<5;v++)worldRect(x-23+v*12,ground-h+8,2,14+((v*9)%14),'#667766');
  }else{
    for(const [dx,dy,w] of [[-27,-6,43],[-16,-19,48],[0,-25,28]]){
      worldRect(x+dx,ground-h+dy,w,12,dark);
      worldRect(x+dx+5,ground-h+dy+2,w-11,4,kind==='forest'?'#41654c':'#647b4d');
    }
  }
}
function worldHouse(x,ground,w,h,burning,seed){
  worldRect(x,ground-h,w,h,seed%2?'#685956':'#7a6250');
  worldRect(x+4,ground-h+7,w-8,4,'#968279');
  worldRect(x+6,ground-h+15,w-12,h-18,'#5d514d');
  for(let k=0;k<2;k++){
    worldRect(x+8+k*(w-25),ground-h+20,9,12,burning?'#ec994e':'#536f82');
    worldRect(x+12+k*(w-25),ground-h+19,2,14,'#b8aa8b');
  }
  worldRect(x-7,ground-h-9,w+14,10,'#47333e');
  worldRect(x,ground-h-14,w,5,seed%2?'#664342':'#704a3b');
  worldRect(x+w*.39,ground-20,w*.22,20,'#332c32');
  if(burning){
    for(let j=0;j<4;j++){
      const fx=x+9+j*(w-12)/4,fl=9+Math.sin(S.t*7+j+seed)*5;
      worldRect(fx,ground-h-12-fl,6,fl+8,'#d94a26');
      worldRect(fx+2,ground-h-10-fl,3,fl,'#ffd475');
      worldGlow(fx,ground-h-6,28,'rgba(255,106,42,.18)');
      worldRect(fx-4-S.t%18,ground-h-42-(S.t*4+j*7)%24,15,9,'rgba(51,42,47,.4)');
    }
  }
}
function worldCastle(x,y,w,mode){
  const dark=mode==='siege'?'#4c3c43':'#666574';
  worldRect(x,y,w,GY-y,dark);worldRect(x+6,y+8,w-12,8,'#9795a0');
  for(let i=0;i<w;i+=18){worldRect(x+i,y-9,11,10,'#878391');worldRect(x+i+2,y-12,7,3,'#b0a9a0');}
  for(let i=0;i<w-8;i+=34){worldRect(x+i+13,y+22,5,17,'#272b3a');worldRect(x+i+15,y+22,1,17,'#96929d');}
  worldRect(x+w*.35,y+Math.min(48,GY-y-24),w*.3,GY-y,'#30313b');
}
function worldDrawbridge(cam,cfg){
  const by=GY,gateX=350-cam*.58;
  worldRect(0,by-28,W,31,'#536765');
  worldRect(0,by-17,W,17,'#394e5c');
  for(let k=0;k<W;k+=23)worldRect(k,by-24+(k%3),17,2,'#8d9a88');
  // A defensible stone gate, moat and hinged wooden drawbridge are actual visible landmarks.
  worldCastle(gateX-115,by-155,230,cfg.style==='drawbridge'?'siege':'castle');
  worldRect(gateX-29,by-74,58,74,'#272631');
  for(let k=0;k<8;k++)worldRect(gateX-27+k*7,by-72,3,67,'#b6a38e');
  worldRect(gateX-88,by-19,160,9,'#7b5139');
  for(let k=0;k<10;k++)worldRect(gateX-86+k*16,by-17,12,5,'#b58b5a');
  g.strokeStyle='#d1b68b';g.lineWidth=2;g.beginPath();
  g.moveTo(gateX-86,by-19);g.lineTo(gateX-103,by-111);
  g.moveTo(gateX+73,by-19);g.lineTo(gateX+102,by-111);g.stroke();
  // Defenders and siege engines on the walls.
  for(let k=0;k<5;k++){
    const x=gateX-98+k*48,y=by-156;
    worldRect(x,y-15,8,14,'#a5a5b1');worldRect(x+2,y-20,4,6,'#d0bc9c');
    worldRect(x+5,y-24,17,2,'#bca07a');
  }
  if(cfg.style==='drawbridge'||cfg.style==='fieldsiege'){
    for(let k=0;k<3;k++){
      const bx=40+k*115-cam*.28;
      worldRect(bx,by-47,8,47,'#57483d');
      worldRect(bx-12,by-40,50,8,'#8c6041');
      worldRect(bx+26,by-41,18,2,'#e9cb84');
      worldRect(bx-14,by-53,13,12,'#615767');
    }
  }
}
function worldGranary(cam){
  const base=GY,xx=248-cam*.48;
  worldRect(0,base-3,W,7,'#74654e');
  for(let i=-1;i<4;i++){const x=i*220-cam*.35;worldHouse(x,base,57,45,false,i);worldRect(x+55,base-43,68,43,'#6f6651');}
  // Oversized granary and sacks: the story objective is visibly located here.
  worldRect(xx-100,base-114,205,115,'#7d6546');
  for(let k=0;k<7;k++)worldRect(xx-94+k*28,base-108,5,108,'#b89562');
  worldRect(xx-109,base-131,220,19,'#55443b');
  worldRect(xx-43,base-66,81,66,'#43362f');
  worldRect(xx-47,base-68,89,7,'#b59a70');
  for(let k=0;k<8;k++){
    const x=xx-105+(k%4)*24,yy=base-14-Math.floor(k/4)*13;
    worldRect(x,yy,23,12,'#c9b184');worldRect(x+3,yy+2,14,2,'#e7d3aa');
  }
  worldRect(xx+118,base-20,44,16,'#74533c');worldRect(xx+123,base-26,34,8,'#a7804e');
  for(let k=0;k<2;k++)worldRect(xx+124+k*27,base-8,8,8,'#343134');
}
function worldFen(cam){
  worldRect(0,GY-19,W,26,'#486f66');worldRect(0,GY-9,W,12,'#34666b');
  for(let i=-1;i<8;i++){
    const seed=worldHash(i,77),x=i*104-cam*.45+(seed%23);
    worldTree(x,GY-20,'fen',seed);worldRect(x+24,GY-23,36,3,'#648c85');
    for(let j=0;j<7;j++)worldRect(x+j*9,GY-26-(j%3)*9,2,20,'#77917b');
    const lantern=seed%3===0;
    if(lantern){worldRect(x+31,GY-71,2,34,'#8b896c');worldRect(x+26,GY-78,13,8,'#c2e9ad');worldGlow(x+32,GY-75,25,'rgba(178,254,169,.24)');}
  }
}
function worldCave(cam,mine){
  const base=GY;worldRect(0,0,W,H,mine?'#292b35':'#24273a');
  for(let i=-1;i<12;i++){
    const seed=worldHash(i,49),x=i*72-cam*.34;
    worldRect(x,0,44,32+seed%30,'#4b4a54');
    worldRect(x+7,0,7,52+seed%18,'#62606b');
    worldRect(x+3,base-39-seed%11,61,50,'#45414a');
    if(mine){
      worldRect(x+20,base-120,7,110,'#75634b');worldRect(x+12,base-116,60,6,'#9a815c');
      worldRect(x+45,base-35,38,20,'#56443c');worldRect(x+48,base-39,32,5,'#938779');
      worldRect(x+50,base-11,7,8,'#272b32');worldRect(x+74,base-11,7,8,'#272b32');
    }else{
      worldRect(x+24,base-51,11,19,'#4b90a6');worldRect(x+26,base-67,7,19,'#75bfd7');
      worldGlow(x+30,base-46,26,'rgba(96,183,220,.1)');
    }
  }
}
function worldLibrary(cam){
  const base=GY;worldRect(0,0,W,base,'#29273c');
  for(let i=-1;i<5;i++){
    const x=i*164-cam*.54;
    worldRect(x,30,148,base-36,'#4e3d3d');
    for(let row=0;row<4;row++){
      const yy=base-46-row*31;
      worldRect(x+4,yy,138,5,'#c1a073');
      for(let j=0;j<18;j++){
        const col=['#8f5d61','#4f6983','#78916b','#b68c62','#755d8e'][(j+row+i+35)%5];
        worldRect(x+6+j*7.3,yy-22,5,21-(j%4)*2,col);
        worldRect(x+6+j*7.3,yy-21,5,2,'#ccb58f');
      }
    }
    worldRect(x+145,0,12,base,'#7f7186');
    worldRect(x+147,10,7,20,'#b8a5a3');
    worldRect(x+54,base-132,30,47,'#665887');
    worldRect(x+60,base-126,18,33,'#e4bf82');
    worldGlow(x+70,base-115,42,'rgba(195,155,241,.18)');
  }
}
function worldTraining(cam){
  const base=GY;worldRect(0,base-5,W,8,'#af9a69');
  for(let i=-1;i<6;i++){
    const x=i*170-cam*.58;
    worldRect(x+8,base-60,13,59,'#867864');
    worldRect(x,base-69,31,9,'#bdb19a');
    worldRect(x+26,base-61,22,59,'#605a52');
    worldRect(x+110,base-47,4,47,'#66533b');
    for(let r=0;r<3;r++)worldRect(x+94+r*4,base-39+r*2,28-r*8,4,r===0?'#d7b45e':r===1?'#9e403a':'#e3d29d');
    worldRect(x+61,base-31,8,30,'#9a714b');
    worldRect(x+53,base-35,23,5,'#dbc78b');
    worldRect(x+61,base-49,9,13,'#b1b2b8');
  }
}
function worldGarden(cam){
  const base=GY;
  worldRect(0,base-3,W,8,'#a39b89');
  for(let i=-1;i<6;i++){
    const seed=worldHash(i,17),x=i*180-cam*.55;
    worldRect(x+10,base-165,8,162,'#727481');worldRect(x+151,base-165,8,162,'#727481');
    worldRect(x+3,base-175,165,13,'#a2a5a9');
    worldRect(x+25,base-130,124,90,'#5b6c69');
    worldRect(x+31,base-125,112,83,'#879f96');
    for(let k=0;k<5;k++){worldRect(x+35+k*22,base-117,5,65,'#566958');}
    worldRect(x+40,base-30,22,29,'#6d7b50');
    worldRect(x+52,base-43,9,13,'#c4b470');
    worldRect(x+115,base-32,19,31,'#657e61');
    worldRect(x+123,base-45,8,14,'#d3d4b4');
    worldRect(x+80,base-23,25,5,'#a4a8b5');
    worldGlow(x+92,base-42,24,'rgba(123,207,241,.18)');
    if(seed%2){worldRect(x+67,base-158,26,3,'#cdb47d');worldRect(x+78,base-172,4,16,'#d8d2bc');}
  }
}
function worldFields(cam,cfg){
  const base=GY;
  worldRect(0,base-2,W,7,'#847851');
  for(let i=-1;i<9;i++){
    const seed=worldHash(i,cfg.seed),x=i*122-cam*.62+(seed%26);
    if(cfg.style==='forest'||cfg.style==='frontier'){worldTree(x+24,base,'forest',seed);}
    else{
      worldRect(x+13,base-48,4,46,'#776246');worldRect(x-3,base-48,49,5,'#a28a59');
      for(let k=0;k<7;k++)worldRect(x+1+k*7,base-39,3,31,'#80694f');
      if(i%3===0)worldHouse(x+44,base,53,36,false,seed);
      else if(i%3===1){worldRect(x+60,base-32,28,26,'#a7a08a');worldRect(x+62,base-38,24,7,'#5e5550');}
      else{worldRect(x+48,base-17,34,9,'#6f5238');worldRect(x+50,base-23,30,7,'#b79858');}
    }
  }
}
function worldForeground(cam,cfg){
  const base=GY,mode=cfg.style;
  if(mode==='magegarden'){worldGarden(cam);return;}
  if(mode==='library'){worldLibrary(cam);return;}
  if(mode==='cave'||mode==='cellar'||mode==='mine'){worldCave(cam,mode==='mine');return;}
  if(mode==='fen'){worldFen(cam);return;}
  if(['gate','drawbridge','fieldsiege','rampart'].indexOf(mode)>=0){worldDrawbridge(cam,cfg);return;}
  if(mode==='granary'){worldGranary(cam);return;}
  if(['training','courtyard','chapel'].indexOf(mode)>=0){worldTraining(cam);if(mode==='chapel')worldLibrary(cam);return;}
  if(mode==='chapelfire'){worldLibrary(cam);worldHouse(W*.8,GY,66,56,true,3);return;}
  if(mode==='forge'){worldTraining(cam);worldGlow(W*.58,GY-48,65,'rgba(251,144,63,.28)');return;}
  if(mode==='burningkeep'){worldCastle(280-cam*.5,GY-152,220,'siege');worldHouse(30,GY,95,91,true,2);return;}
  if(mode==='cityfire'||mode==='siege'){
    for(let k=-1;k<6;k++)worldHouse(k*112-cam*.58,GY,84,55+(k%3)*21,true,k+16);
    return;
  }
  if(mode==='ruins'){for(let k=-1;k<7;k++){const x=k*155-cam*.52;worldRect(x,GY-82,14,82,'#77717a');worldRect(x+38,GY-49,46,49,'#5a555d');worldRect(x-6,GY-89,88,8,'#a39c8f');}return;}
  if(mode==='mountain'){
    for(let k=-1;k<9;k++){const x=k*95-cam*.47;worldRect(x,GY-72,75,71,'#737c7c');worldRect(x+20,GY-94,32,25,'#a9b7b1');worldRect(x+28,GY-102,13,17,'#e2e3d9');}return;
  }
  worldFields(cam,cfg);
}
function storyWorldBackdrop(cam){
  const cfg=worldConfig();if(!cfg)return false;
  worldSky(cfg,cam);
  worldForeground(cam,cfg);
  return true;
}
function storyWeatherOverlay(cam){
  const cfg=worldConfig();if(!cfg)return;
  const type=cfg.weather;
  if(type==='clear'||type==='clouds'||type==='breeze')return;
  if(type==='haze'||type==='fog'){
    for(let k=0;k<7;k++){
      const x=((k*97+S.t*(type==='fog'?5:2)-cam*.08)%(W+160)+W+160)%(W+160)-130;
      worldRect(x,GY-110+k*17,148,7,type==='fog'?'rgba(206,227,220,.16)':'rgba(193,178,153,.11)');
    }
    return;
  }
  if(type==='embers'){
    worldRect(0,0,W,H,'rgba(74,20,10,.13)');
    for(let k=0;k<55;k++){
      const hash=worldHash(k,cfg.seed),x=(hash%W+S.t*(7+k%9))%W;
      const y=((hash>>>9)%Math.max(1,GY)+S.t*(9+k%9))%Math.max(1,GY);
      worldRect(x,GY-y,1+(k%3===0?1:0),2,k%3?'#ed7542':'#ffd98a');
    }
    return;
  }
  const storm=type==='storm',wind=type==='wind',snow=type==='snow',drips=type==='drips';
  if(storm)worldRect(0,0,W,H,'rgba(27,33,56,.23)');
  if(storm&&Math.sin(S.t*1.93+cfg.seed)*Math.sin(S.t*3.11)> .91){
    worldRect(0,0,W,H,'rgba(222,228,246,.26)');
    const x=worldHash(cfg.seed,5)%Math.max(1,W-20);
    g.strokeStyle='#e8edf9';g.lineWidth=2;g.beginPath();g.moveTo(x,0);g.lineTo(x+7,HZ*.33);g.lineTo(x-8,HZ*.55);g.lineTo(x+9,GY-100);g.stroke();
  }
  for(let k=0;k<(storm?105:wind?36:drips?21:snow?65:76);k++){
    const hash=worldHash(k,cfg.seed+73),x0=hash%Math.max(1,W);
    const y0=(hash>>>10)%Math.max(1,GY);
    if(snow){
      const x=(x0+S.t*(6+k%7))%W,y=(y0+S.t*(17+k%12))%Math.max(1,GY);
      worldRect(x,y,2,2,'rgba(244,248,255,.85)');
    }else if(drips){
      const x=x0,y=(y0+S.t*(48+k%21))%Math.max(1,GY);
      worldRect(x,y,1,5,'rgba(126,189,214,.38)');
    }else if(wind){
      const x=(x0+S.t*(41+k%25))%W,y=y0;
      worldRect(x,y,14+(k%11),1,'rgba(205,199,149,.28)');
    }else{
      const x=(x0-S.t*(storm?51:20))%W,y=(y0+S.t*(storm?141:100))%Math.max(1,GY);
      g.strokeStyle=storm?'rgba(206,222,250,.57)':'rgba(198,215,227,.42)';g.lineWidth=1;
      g.beginPath();g.moveTo((x+W)%W,y);g.lineTo((x+W)%W-(storm?7:3),y+9);g.stroke();
    }
  }
}
