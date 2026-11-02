/* THE HIDDEN CROWN — handcrafted-scale pixel landscape renderer.
   Wide, non-repeating ridges; layered snow; dark conifer valleys; environmental
   light and weather. Original artwork, adapted to the game's canvas scale.
*/
const PIXEL_SCENES={
 mountain:{far:'#b3c4cb',mid:'#899ba6',rock:'#596d7a',shadow:'#445967',tree:'#445f60',snow:true},
 frontier:{far:'#bcb6ae',mid:'#9a9da3',rock:'#667788',shadow:'#4c606c',tree:'#455c64',snow:true},
 ruins:{far:'#a9b0ac',mid:'#869399',rock:'#69767b',shadow:'#515b62',tree:'#3e5b58',snow:true},
 farmroad:{far:'#c1c3a7',mid:'#9aafa1',rock:'#6b897b',shadow:'#597466',tree:'#47684f'},
 forest:{far:'#9caeae',mid:'#75918b',rock:'#587369',shadow:'#39574f',tree:'#284c45'},
 fen:{far:'#9db4a5',mid:'#83a29b',rock:'#597e75',shadow:'#416a63',tree:'#2f6155',marsh:true},
 granary:{far:'#c4b9a3',mid:'#aea98c',rock:'#8c9c7f',shadow:'#6d836c',tree:'#547451'},
 fieldsiege:{far:'#aaa6a2',mid:'#85878e',rock:'#68727c',shadow:'#505665',tree:'#434951'},
 gate:{far:'#b7b7af',mid:'#939a99',rock:'#788789',shadow:'#5c6c71',tree:'#526a61'},
 drawbridge:{far:'#a6a6a7',mid:'#85848d',rock:'#646a73',shadow:'#505663',tree:'#404e57'},
 rampart:{far:'#7b879e',mid:'#66728a',rock:'#525d77',shadow:'#40485f',tree:'#364455'},
 cityfire:{far:'#77586a',mid:'#694f61',rock:'#544658',shadow:'#3f3546',tree:'#483c48',fire:true},
 burningkeep:{far:'#775a6c',mid:'#694f61',rock:'#544658',shadow:'#3f3546',tree:'#453741',fire:true},
 siege:{far:'#77586a',mid:'#694f61',rock:'#544658',shadow:'#3f3546',tree:'#453741',fire:true},
 training:{far:'#b4c3ae',mid:'#99aaa0',rock:'#738f83',shadow:'#567369',tree:'#4c6e56'},
 courtyard:{far:'#b6c0ad',mid:'#9bab9d',rock:'#7e9386',shadow:'#637e6b',tree:'#527357'},
 magegarden:{far:'#a7c2be',mid:'#93b4af',rock:'#739b9c',shadow:'#577c7d',tree:'#517b6c'}
};
const PIXEL_CACHE=new Map();
const PIXEL_CACHE_MAX=4;
function pixRandom(seed){
  let n=seed>>>0;
  return ()=>{n=(Math.imul(n^n>>>16,2246822519)+3266489917)>>>0;n^=n>>>13;return (n>>>0)/4294967296;};
}
function pixPoly(ctx,points,color){
  ctx.fillStyle=color;ctx.beginPath();
  ctx.moveTo(Math.round(points[0][0]),Math.round(points[0][1]));
  for(let i=1;i<points.length;i++)ctx.lineTo(Math.round(points[i][0]),Math.round(points[i][1]));
  ctx.closePath();ctx.fill();
}
function pixRect(ctx,x,y,w,h,color){
  if(w<=0||h<=0)return;
  ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));
}
function pixHaze(ctx,y,width,height,color){
  const gr=ctx.createLinearGradient(0,y,0,y+height);
  gr.addColorStop(0,'rgba(255,255,255,0)');
  gr.addColorStop(.52,color);gr.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gr;ctx.fillRect(0,y,width,height);
}
function pixMountain(ctx,x,base,wide,height,front,shade,rnd,snow){
  const apex=base-height,lo=x-wide*.54,hi=x+wide*.73;
  const ridge=[];
  for(let j=0;j<=24;j++){
    const t=j/24,xx=lo+(hi-lo)*t,p=Math.max(0,1-Math.abs((xx-x)/(xx<x?x-lo:hi-x)));
    ridge.push([xx,base-p*height+(rnd()-.5)*5]);
  }
  pixPoly(ctx,[[lo,base+15],...ridge,[hi,base+15]],front);
  pixPoly(ctx,[[x,apex],[x+wide*.10,apex+height*.20],[x+wide*.21,apex+height*.46],
    [x+wide*.36,base],[x+wide*.10,base],[x-wide*.10,apex+height*.39]],shade);
  if(snow){
    // White stone, wind-carved caps, narrow cascades and pale rocky gullies.
    pixPoly(ctx,[[x-3,apex],[x+10,apex+13],[x+17,apex+34],[x+8,apex+29],
      [x+2,apex+46],[x-8,apex+31],[x-18,apex+38],[x-14,apex+18]],'#e5e8e3');
    pixPoly(ctx,[[x+5,apex+9],[x+17,apex+34],[x+8,apex+29],[x+6,apex+21]],'#b7c7ce');
    for(let i=0;i<10;i++){
      const xx=x+(rnd()-.5)*wide*.5,yy=apex+height*(.26+rnd()*.60);
      const length=4+rnd()*18,sign=xx>x?1:-1;
      pixPoly(ctx,[[xx,yy],[xx+sign*2,yy+2],[xx+sign*7,yy+length],
        [xx+sign*4,yy+length-3]],i%3?'#9faeb4':'#d2d8d6');
    }
  }else{
    for(let i=0;i<13;i++){
      const xx=x+(rnd()-.5)*wide*.64,yy=apex+height*(.35+rnd()*.52);
      pixRect(ctx,xx,yy,3+rnd()*8,2,i%3?'#a2b0a2':shade);
    }
  }
}
function pixFir(ctx,x,base,height,dark,light,rnd){
  pixRect(ctx,x-2,base-height*.5,4,height*.5,'#504b43');
  for(let k=0;k<5;k++){
    const yy=base-height*(.9-k*.14);
    const w=height*(.12+k*.056);
    pixPoly(ctx,[[x,yy-8],[x-w,yy+height*.16],[x+w,yy+height*.16]],dark);
    pixPoly(ctx,[[x,yy-6],[x-w*.76,yy+height*.10],[x-w*.12,yy+height*.12]],light);
  }
  if(height>43)for(let k=0;k<6;k++){
    const px=x+(rnd()-.5)*height*.35,py=base-height*.48+rnd()*height*.27;
    pixRect(ctx,px,py,2,1,light);
  }
}
function pixRidge(ctx,width,base,seed,level,colors){
  const rnd=pixRandom(seed+level*99);
  const top=[],step=10;
  for(let x=-10;x<width+20;x+=step){
    const wave=21*Math.sin(x/(level===0?106:68)+seed*.011)
      +10*Math.sin(x/33+seed*.04)+5*Math.sin(x/17+seed*.15);
    const yy=base-(level===0?59:level===1?38:14)-wave*(level+1)*.42+(rnd()-.5)*3;
    top.push([x,yy]);
  }
  pixPoly(ctx,[[0,base+72],...top,[width+10,base+72]],level===0?colors.far:level===1?colors.mid:colors.rock);
}
function pixBuild(cfg){
  const key=[cfg.style,cfg.seed||7,W,H,GY].join('|');
  if(PIXEL_CACHE.has(key))return PIXEL_CACHE.get(key);
  const colors=PIXEL_SCENES[cfg.style],width=Math.max(1440,Math.ceil(W*2.6));
  const cv=document.createElement('canvas');cv.width=width;cv.height=H;
  const ctx=cv.getContext('2d');const rnd=pixRandom((cfg.seed||7)+77),ground=GY-9;
  if(colors.snow){
    for(let layer=0;layer<3;layer++){
      const n=layer===0?8:layer===1?10:11;
      for(let i=0;i<n;i++){
        const cx=(i-.3)*width/n+(rnd()-.5)*65;
        const tall=(layer===0?105:layer===1?139:109)+rnd()*68;
        const ww=(layer===0?215:layer===1?178:141)+rnd()*45;
        const b=ground+(layer===0?-53:layer===1?-17:23);
        pixMountain(ctx,cx,b,ww,tall,layer===0?colors.far:layer===1?colors.mid:colors.rock,
          layer===0?'#99a8b0':layer===1?'#647a88':colors.shadow,rnd,true);
      }
      if(layer===0)pixHaze(ctx,ground-75,width,59,'rgba(229,235,226,.25)');
      if(layer===1)pixHaze(ctx,ground-63,width,36,'rgba(215,224,219,.17)');
    }
  }else{
    pixRidge(ctx,width,ground-33,cfg.seed||7,0,colors);
    pixRidge(ctx,width,ground-10,(cfg.seed||7)+13,1,colors);
    pixHaze(ctx,ground-72,width,57,colors.marsh?'rgba(217,231,218,.3)':'rgba(232,228,210,.21)');
    pixRidge(ctx,width,ground+10,(cfg.seed||7)+37,2,colors);
  }
  if(colors.fire){
    // Charred roofs rather than a scenic forest behind a burning city.
    for(let i=0;i<22;i++){
      const x=i*81+rnd()*16,y=ground-20-rnd()*45;
      pixRect(ctx,x,y,34+rnd()*34,ground-y+8,'#434049');
      pixRect(ctx,x+7,y-14,18,14,'#574753');
      if(i%3===0)pixRect(ctx,x+27,y-35,4,35,'#665761');
    }
    pixHaze(ctx,ground-128,width,127,'rgba(195,106,80,.21)');
  }else{
    const gap=colors.marsh?10:cfg.style==='farmroad'||cfg.style==='granary'?24:13;
    for(let x=8;x<width;x+=gap){
      if(cfg.style==='farmroad'&&rnd()>.43)continue;
      const ht=(colors.snow?28:colors.marsh?48:30)+rnd()*54;
      pixFir(ctx,x,ground+8,ht,colors.tree,colors.mid,rnd);
    }
    pixHaze(ctx,ground-59,width,65,'rgba(225,233,218,.14)');
  }
  if(PIXEL_CACHE.size>=PIXEL_CACHE_MAX)PIXEL_CACHE.delete(PIXEL_CACHE.keys().next().value);
  PIXEL_CACHE.set(key,cv);return cv;
}
function pixSky(cfg){
  const band=WORLD_PALETTE[cfg.period]||WORLD_PALETTE.noon;
  const night=cfg.period==='night',sunset=cfg.period==='sunset',dawn=cfg.period==='dawn';
  const gr=g.createLinearGradient(0,0,0,GY);
  gr.addColorStop(0,night?'#121a31':sunset?'#505779':dawn?'#617795':band[0]);
  gr.addColorStop(.64,night?'#2d4261':sunset?'#af7b75':dawn?'#b1acb2':band[1]);
  gr.addColorStop(1,night?'#738091':sunset?'#e8be95':dawn?'#edc2a0':band[2]);
  g.fillStyle=gr;g.fillRect(0,0,W,H);
  const t=cfg.travel?(cfg.timeProgress||0):night?.93:dawn?.13:sunset?.78:
    cfg.period==='dusk'?.73:cfg.period==='morning'?.26:cfg.period==='late-afternoon'?.66:.5;
  const x=Math.round(clamp(18+W*.83*t,14,W-14));
  const y=Math.round(Math.max(17,GY*.31-38*Math.sin(Math.PI*t)));
  const moon=t>.86,r=moon?6:9;
  const halo=g.createRadialGradient(x,y,1,x,y,moon?34:55);
  halo.addColorStop(0,moon?'rgba(217,227,244,.20)':'rgba(252,213,145,.29)');
  halo.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=halo;g.fillRect(x-60,y-60,120,120);
  pixRect(g,x-r,y-r,r*2,r*2,moon?'#e6eae4':'#f8e2b1');
  pixRect(g,x-r+2,y-r-2,r*2-4,2,moon?'#f3f3ed':'#fff3ce');
  for(let i=0;i<8;i++){
    const pos=worldHash(i,cfg.seed||5),cloudX=((pos%W+S.t*(cfg.weather==='wind'?12:3))%(W+80))-40;
    const cloudY=10+((pos>>>8)%Math.max(16,Math.floor(GY*.23)));
    const color=cfg.weather==='storm'?'rgba(59,63,80,.45)':'rgba(243,239,222,.22)';
    pixRect(g,cloudX,cloudY,42,5,color);pixRect(g,cloudX+7,cloudY-4,30,5,color);
    pixRect(g,cloudX-4,cloudY+4,53,3,color);
  }
}
function pixelLandscapeBackdrop(cam,cfg){
  if(!PIXEL_SCENES[cfg.style])return false;
  pixSky(cfg);
  const cv=pixBuild(cfg),off=Math.max(0,Math.min(cv.width-W,cam*.19));
  g.drawImage(cv,off,0,W,cv.height,0,0,W,H);
  return true;
}
/* Authored near-landmark progression. These aren't wallpaper tiles: each
   segment has a different landmark and visual story, selected by route seed.
   Parallax is slower than the player, so roadside forms stay spatially stable.
*/
function pixWoodFence(ctx,x,base,width){
  pixRect(ctx,x,base-24,width,4,'#9e805a');
  pixRect(ctx,x,base-13,width,3,'#6c553f');
  for(let j=0;j<width;j+=22){
    pixRect(ctx,x+j+5,base-32,5,32,'#80634a');
    pixRect(ctx,x+j+6,base-36,3,5,'#bfa076');
    pixRect(ctx,x+j+6,base-27,1,16,'#be9b64');
  }
}
function pixRoadHouse(ctx,x,base,rnd){
  const w=79,h=67;
  pixRect(ctx,x+5,base-h,w,h,'#837b6d');
  pixRect(ctx,x+8,base-h+7,w-7,h-7,'#aca08b');
  for(let j=0;j<7;j++){
    pixRect(ctx,x+9+j*11,base-h+10,2,h-11,'#756c5e');
    pixRect(ctx,x+15+j*11,base-h+17,2,h-23,'#baa78b');
  }
  pixPoly(ctx,[[x-12,base-h+5],[x+24,base-h-26],[x+70,base-h-30],
    [x+103,base-h+6],[x+94,base-h+12],[x+12,base-h+13]],'#5b5455');
  pixPoly(ctx,[[x-8,base-h+4],[x+22,base-h-20],[x+64,base-h-22],
    [x+90,base-h+4]],'#81746c');
  for(let j=0;j<10;j++)pixRect(ctx,x+9+j*8,base-h-2-j%3*3,6,2,'#ae9280');
  pixRect(ctx,x+23,base-42,18,26,'#39434b');
  pixRect(ctx,x+24,base-41,16,4,'#c0ab8a');
  pixRect(ctx,x+31,base-39,2,23,'#aaa89b');
  pixRect(ctx,x+51,base-30,22,30,'#514438');
  pixRect(ctx,x+53,base-28,17,28,'#6e5743');
  pixRect(ctx,x+63,base-16,3,3,'#e0d3b5');
  pixRect(ctx,x+75,base-15,22,14,'#997b4b');
  pixRect(ctx,x+74,base-21,22,7,'#c7ad72');
  pixRect(ctx,x+76,base-20,18,2,'#f3d39c');
  for(let j=0;j<4;j++){
    pixRect(ctx,x+76+j*5,base-12,3,8,'#a98756');
  }
  const smoke=x+55+rnd()*5;
  pixRect(ctx,smoke,base-h-40,9,2,'rgba(214,205,193,.27)');
}
function pixRoadBridge(ctx,x,base){
  pixRect(ctx,x-8,base-4,120,9,'#526e70');
  pixRect(ctx,x,base-9,113,3,'#8aa7a4');
  pixRect(ctx,x+8,base-21,100,8,'#7e624b');
  for(let j=0;j<10;j++){
    pixRect(ctx,x+10+j*10,base-21,8,3,'#c3a178');
    pixRect(ctx,x+15+j*10,base-14,3,7,'#4a3a32');
  }
  for(const px of [x+12,x+95]){
    pixRect(ctx,px,base-45,5,29,'#785b48');
    pixRect(ctx,px+2,base-46,2,10,'#d0ae7e');
  }
  pixRect(ctx,x+16,base-41,80,3,'#b49670');
  pixRect(ctx,x+19,base-35,80,2,'#846d55');
}
function pixRoadWagon(ctx,x,base){
  pixRect(ctx,x+6,base-29,68,21,'#665348');
  pixRect(ctx,x+8,base-37,64,10,'#ae875c');
  pixRect(ctx,x+15,base-44,48,9,'#7b6b5a');
  pixPoly(ctx,[[x+14,base-45],[x+26,base-55],[x+61,base-55],[x+71,base-45]],'#b6a17a');
  for(const wx of [x+23,x+62]){
    for(const rad of [11,8]){ctx.strokeStyle=rad===11?'#50413b':'#9d825c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,base-6,rad,0,Math.PI*2);ctx.stroke();}
    pixRect(ctx,wx-1,base-14,2,16,'#b9a77e');
    pixRect(ctx,wx-8,base-7,16,2,'#b9a77e');
  }
  pixRect(ctx,x+73,base-16,28,3,'#8f775b');
}
function pixRoadShrine(ctx,x,base){
  pixRect(ctx,x+30,base-55,26,55,'#7b8584');
  pixRect(ctx,x+24,base-57,39,6,'#b4b9af');
  pixPoly(ctx,[[x+18,base-58],[x+44,base-84],[x+69,base-58]],'#6d7778');
  pixPoly(ctx,[[x+25,base-58],[x+44,base-77],[x+62,base-58]],'#a5aca4');
  pixRect(ctx,x+38,base-43,10,35,'#4c5d61');
  pixRect(ctx,x+40,base-35,6,12,'#d3bf8b');
  pixRect(ctx,x+42,base-31,2,8,'#e9d9ab');
  pixRect(ctx,x+24,base-7,40,7,'#596b66');
  pixRect(ctx,x+20,base-2,49,3,'#bcc5bb');
}
function pixRoadDetail(cam,cfg){
  const type=cfg.style;
  if(!['farmroad','forest','frontier','granary','fen'].includes(type))return;
  const rng=pixRandom((cfg.seed||17)+400),cols=PIXEL_SCENES[type],base=GY-3;
  const layouts=type==='farmroad'||type==='granary'?
     ['fence','house','bridge','cart','shrine','orchard','house','cart','bridge','fence','house']:
     type==='forest'?['pines','log','pines','shrine','fallen','pines','rocks','pines','log']:
     type==='fen'?['reeds','bridge','pines','lantern','reeds','shrine','reeds','bridge']:
     ['rocks','pines','shrine','rocks','pines','fallen','rocks','pines'];
  for(let k=0;k<layouts.length;k++){
    const worldX=80+k*167+(rng()-.5)*67;
    const x=worldX-cam*.65;
    if(x<-180||x>W+180)continue;
    const name=layouts[k];
    if(name==='fence'){pixWoodFence(g,x,base,114);continue;}
    if(name==='house'){pixRoadHouse(g,x,base,rng);continue;}
    if(name==='bridge'){pixRoadBridge(g,x,base);continue;}
    if(name==='cart'){pixRoadWagon(g,x,base);continue;}
    if(name==='shrine'){pixRoadShrine(g,x,base);continue;}
    if(name==='orchard'||name==='pines'){
      for(let j=0;j<4;j++)pixFir(g,x+j*25,base,35+rng()*54,cols.tree,cols.mid,rng);
      continue;
    }
    if(name==='reeds'||name==='lantern'){
      pixRect(g,x-7,base-13,93,11,'#467870');
      for(let j=0;j<19;j++){
        const xx=x+j*5,ht=11+rng()*26;
        pixRect(g,xx,base-ht,2,ht,cols.tree);
        if(j%3===0)pixRect(g,xx-1,base-ht-5,4,8,'#84745a');
      }
      if(name==='lantern'){
        pixRect(g,x+42,base-72,5,71,'#635948');
        pixRect(g,x+36,base-78,18,9,'#e8cb8a');
        pixRect(g,x+40,base-75,10,6,'#f4e9ab');
      }
      continue;
    }
    if(name==='log'||name==='fallen'){
      pixRect(g,x-5,base-15,112,14,'#685246');
      pixRect(g,x-4,base-12,110,4,'#917763');
      pixRect(g,x+96,base-14,10,11,'#af9373');
      pixRect(g,x+99,base-11,4,5,'#73604d');
      continue;
    }
    if(name==='rocks'){
      for(let j=0;j<7;j++){
        const xx=x+j*19,ht=12+rng()*20,ww=13+rng()*22;
        pixPoly(g,[[xx,base],[xx+4,base-ht*.75],[xx+ww*.35,base-ht],
          [xx+ww*.8,base-ht*.65],[xx+ww,base]],cols.rock);
        pixPoly(g,[[xx+4,base-ht*.75],[xx+ww*.35,base-ht],
          [xx+ww*.51,base-ht*.57],[xx+4,base-ht*.5]],cols.mid);
      }
    }
  }
}

function pixelLandscapeDetail(cam,cfg){
  pixRoadDetail(cam,cfg);
  if(!PIXEL_SCENES[cfg.style])return;
  const colors=PIXEL_SCENES[cfg.style],rnd=pixRandom((cfg.seed||7)+1441);
  pixRect(g,0,GY-6,W,7,colors.marsh?'#49786f':colors.snow?'#9caaab':colors.fire?'#625357':'#788b65');
  for(let i=0;i<88;i++){
    const x=((i*35+rnd()*9-cam*.85)%(W+30)+W+30)%(W+30)-15;
    const y=GY-5-rnd()*5;
    if(i%6===0){
      pixRect(g,x,y-7,2,9,colors.snow?'#84939b':colors.fire?'#958279':'#56774b');
      pixRect(g,x-3,y-3,7,2,colors.snow?'#d7ded7':'#b0b88d');
    }else pixRect(g,x,y,2+rnd()*4,1,colors.snow?'#dce3df':colors.marsh?'#abc5ac':colors.fire?'#bda18f':'#c2c49d');
  }
}
