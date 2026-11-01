/* ================= ITEMS / LOOT ================= */
const RAR=[{n:'Common',c:'#c4c4c4',w:60},{n:'Uncommon',c:'#4cd964',w:26},{n:'Rare',c:'#4a9cf0',w:10},{n:'Epic',c:'#b45cff',w:3.4},{n:'Legendary',c:'#ff9a1f',w:.6}];
const SLOTS=['sword','staff','bow','armor','trinket'];
const SLOTN={sword:'Sword',staff:'Staff',bow:'Bow',armor:'Armor',trinket:'Trinket',outfit:'Outfit'};
const SLOTG={sword:'SW',staff:'ST',bow:'BW',armor:'AR',trinket:'TR',outfit:'OT'};
const EQSLOTS=['sword','staff','bow','armor','trinket','outfit'];
const BASE={
 sword:[['Rusty Sword',9],['Shortsword',11],['Longsword',14],['Falchion',18],['Kingsblade',23]],
 staff:[['Oak Staff',9],['Ashen Staff',12],['Rune Staff',16],['Crown Staff',21]],
 bow:[['Hunting Bow',8],['Yew Bow',11],['Longbow',15],['Warbow',20]],
 armor:[['Padded Jerkin',4,0,'#7a5a3a'],['Mail Hauberk',9,1,'#8a909a'],['Plate Cuirass',15,2,'#c4cad4'],['Gilded Plate',22,2,'#e6c860']],
 trinket:[['Copper Ring'],['Silver Amulet'],['Charm of Oaths'],['Signet']]
};
const LEG={sword:['Dawnbringer','Oathrender','Kingsbane'],staff:['Staff of the Last Ember','Heartwood Scepter'],bow:['Wraithstring','Sunpiercer'],armor:['Aldaris Regalia','Mantle of Ash'],trinket:['Oathcrown Shard','Tear of the Dawnroot']};
const AFX={
 dmg:{t:'+{v}% Damage',p:'Mighty',s:'of Might',b:3,l:.5},crit:{t:'+{v}% Crit Chance',p:'Keen',s:'of Precision',b:1.5,l:.25},leech:{t:'+{v}% Life Leech',p:'Vampiric',s:'of the Leech',b:1,l:.15},
 hp:{t:'+{v} Max HP',p:'Stout',s:'of Vigor',b:6,l:2.5},def:{t:'+{v} Defense',p:'Warding',s:'of the Bulwark',b:2,l:.8},regen:{t:'+{v} HP/sec',p:'Mending',s:'of Mending',b:.3,l:.06},
 mp:{t:'+{v} Max Mana',p:'Arcane',s:'of the Arcane',b:4,l:1.2},xp:{t:'+{v}% XP Gain',p:"Scholar's",s:'of Lore',b:2,l:.4}
};
const POOL={weapon:['dmg','crit','leech'],armor:['hp','def','regen','mp'],trinket:['dmg','crit','hp','mp','xp','leech','def']};

/* ---- outfits: cosmetic looks found in chests and as rare drops ---- */
const OUTFITS=[
 {id:'blue',n:"Squire's Blue",r:0,col:'#2f5fd0',tab:'#2f5fd0',trim:'#e8b84a',cape:'#b02a3a'},
 {id:'brown',n:'Peasant Brown',r:0,col:'#7a5a3a',tab:'#a88a5a',trim:'#c9ad78',cape:'#4a3220'},
 {id:'grey',n:'Hearth Grey',r:0,col:'#6a707c',tab:'#8a909c',trim:'#c4cad4',cape:'#3a3e48'},
 {id:'ranger',n:'Greenmarch Ranger',r:1,col:'#3f8a4e',tab:'#2f6a3a',trim:'#c9a24a',cape:'#2f6a3a'},
 {id:'marsh',n:'Marsh Walker',r:1,col:'#3a6a60',tab:'#2a4a48',trim:'#9fe0c0',cape:'#1a3a30'},
 {id:'crimson',n:'Crimson Tabard',r:1,col:'#a8323a',tab:'#a8323a',trim:'#e8b84a',cape:'#5a1a22'},
 {id:'thorn',n:'Silver Thorn Knight',r:2,col:'#aeb8cc',tab:'#2f5fd0',trim:'#f0f0f8',cape:'#2a5aa8',metal:'#d4dae4',plume:'#e8e8f2'},
 {id:'smith',n:'Ironvale Smith',r:2,col:'#5a5a62',tab:'#e8802a',trim:'#e8802a',cape:'#3a2a22',metal:'#8a8a92'},
 {id:'veil',n:'Veil Warden',r:2,col:'#2a5a4a',tab:'#9fe0c0',trim:'#9fe0c0',cape:'#1a3a30',metal:'#7ab8a0'},
 {id:'ashen',n:'Ashen Shroud',r:3,col:'#2a2630',tab:'#8a2a3a',trim:'#8a2a3a',cape:'#16121a',metal:'#3a3844',aura:'#a03040'},
 {id:'dawn',n:'Dawnwarden',r:3,col:'#f0e8c8',tab:'#ffffff',trim:'#e8c860',cape:'#fff6d0',metal:'#fff4c8',aura:'#ffe27a',plume:'#ffe27a'},
 {id:'dusk',n:'Duskwalker',r:3,col:'#4a2a6a',tab:'#241038',trim:'#c070ff',cape:'#241038',metal:'#8a60c0',aura:'#c070ff'},
 {id:'regalia',n:'Aldaris Regalia',r:4,col:'#e8c860',tab:'#2f5fd0',trim:'#fff0a0',cape:'#b02a3a',metal:'#fff0b8',aura:'#ffd34a',plume:'#fff0a0'},
 {id:'hollow',n:"Hollow King's Mantle",r:4,col:'#2a2a30',tab:'#10101a',trim:'#9acd32',cape:'#10101a',metal:'#4a4a54',aura:'#9acd32',plume:'#9acd32'}
];
const OBY=Object.fromEntries(OUTFITS.map(o=>[o.id,o]));
function genOutfit(rar){const pool=OUTFITS.filter(o=>o.r===rar),d=pool[Math.floor(rnd()*pool.length)];
  return {id:Math.floor(rnd()*1e9).toString(36)+Date.now().toString(36),slot:'outfit',rar,ilvl:1,aff:[],name:d.n,oid:d.id};}
function rollRar(boost){const ws=RAR.map((r,i)=>r.w*(i?1+(boost||0):1)),sum=ws.reduce((a,b)=>a+b,0);let x=rnd()*sum;for(let i=0;i<ws.length;i++){x-=ws[i];if(x<=0)return i;}return 0;}
function genItem(ilvl,rar,slot){
  if(slot==='outfit')return genOutfit(rar);
  slot=slot||SLOTS[Math.floor(rnd()*SLOTS.length)];
  const it={id:Math.floor(rnd()*1e9).toString(36)+Date.now().toString(36),slot,rar,ilvl,aff:[]};
  const tb=BASE[slot],b=tb[Math.min(tb.length-1,Math.floor((ilvl-1)/5))],rm=1+rar*.2;
  if(slot==='armor'){it.def=Math.round(b[1]*(1+ilvl*.05)*rm);it.look=b[2];it.col=b[3];}
  else if(slot!=='trinket')it.dmg=Math.round(b[1]*(1+ilvl*.06)*rm);
  const pool=POOL[slot==='armor'?'armor':slot==='trinket'?'trinket':'weapon'].slice();
  let n=[0,1,2,3,3][rar]+(slot==='trinket'&&rar<2?1:0);if(rar===4&&slot!=='trinket')n=3;
  while(n-->0&&pool.length){const k=pool.splice(Math.floor(rnd()*pool.length),1)[0],a=AFX[k];
    let v=(a.b+ilvl*a.l)*(.85+rnd()*.3)*(1+rar*.12);v=(k==='crit'||k==='leech'||k==='regen')?Math.round(v*10)/10:Math.round(v);it.aff.push({k,v});}
  let name=b[0];
  if(rar===4){const l=LEG[slot];name=l[Math.floor(rnd()*l.length)];it.leg=1;if(slot!=='trinket')it.aff.push({k:'dmg',v:8+Math.round(ilvl*.6)});}
  else{if(it.aff[0]&&rar>=1)name=AFX[it.aff[0].k].p+' '+name;if(it.aff[1]&&rar>=2)name+=' '+AFX[it.aff[1].k].s;}
  it.name=name;return it;
}
const itemCol=it=>RAR[it.rar].c;
function itemLines(it){const o=[];if(it.slot==='outfit'){o.push('Cosmetic outfit. Changes how Corin looks.');o.push('No stat bonus.');if(it.rar>=3)o.push('Glows with a faint aura.');return o;}if(it.dmg)o.push(it.dmg+' Damage');if(it.def)o.push(it.def+' Defense');for(const a of it.aff)o.push(AFX[a.k].t.replace('{v}',a.v));if(it.leg)o.push('"Forged in the age of kings."');return o;}
const sellVal=it=>it.slot==='outfit'?10+it.rar*it.rar*20:Math.round(4+it.ilvl*3*(1+it.rar*it.rar*.9));
function addItem(it,quiet){
  if(G.inv.length>=28){G.gold+=sellVal(it);if(!quiet)floatTxt(P.x,GY-50,'Bag full: sold '+sellVal(it)+'g','#ffd34a');return false;}
  G.inv.push(it);if(S.rew)S.rew.items.push(it);return true;
}
function equipItem(it){
  const old=G.eq[it.slot];G.inv=G.inv.filter(x=>x.id!==it.id);if(old)G.inv.push(old);G.eq[it.slot]=it;calc();save();
}
function sellItem(it){G.inv=G.inv.filter(x=>x.id!==it.id);G.gold+=sellVal(it);save();}
function fixedItem(slot,name,dmg,rar,x){const it={id:Math.floor(rnd()*1e9).toString(36)+Date.now().toString(36),slot,rar:rar||0,ilvl:1,aff:[],name};if(dmg)it.dmg=dmg;return Object.assign(it,x||{});}
// Corin starts with only a simple tunic and a wooden practice sword. The kit he used to carry is
// locked away in G.stash and returned at his knighting (see knightCorin).
function startGear(){
  const s=genItem(1,0,'sword');s.name='Squire\'s Sword';s.dmg=10;
  const t=genItem(1,0,'staff');t.name='Practice Staff';t.dmg=10;
  const b=genItem(1,0,'bow');b.name='Hunting Bow';b.dmg=9;
  const a=genItem(1,0,'armor');a.name='Squire\'s Tunic';a.def=4;a.col='#3a63b8';a.look=0;
  G.stash=[s,t,b,a];G.sq=1;
  const wood=fixedItem('sword','Wooden Practice Sword',6,0,{wood:1});
  const tunic=fixedItem('outfit',OBY.blue.n,0,0,{oid:'blue'});
  G.eq={sword:wood,staff:null,bow:null,armor:null,trinket:null,outfit:tunic};
  P.w=0;
}
// Ser Halvard's blunt iron sword, given at the end of the tournament.
function giveBluntSword(){
  if(G.flags.bluntSword)return false;G.flags.bluntSword=1;
  const it=fixedItem('sword','Blunt Iron Sword',9,0,{blunt:1});
  addItem(it,true);if(G.eq.sword&&G.eq.sword.wood)equipItem(it);save();return true;
}
// Knighting: the stashed kit comes back and Halvard's ancestral blade (House Hearthmoor, NOT the
// Act II sword tied to Corin's own bloodline) becomes his sword.
function knightCorin(){
  if(G.flags.knighted)return false;G.flags.knighted=1;
  const heir=fixedItem('sword','Hearthmoor Heirloom Blade',18,2,{ilvl:6,heir:1,aff:[{k:'dmg',v:4}]});
  const back=(G.stash||[]).slice();G.stash=[];
  for(const it of back){if(!G.eq[it.slot])G.eq[it.slot]=it;else addItem(it,true);if(S.rew)S.rew.items.push(it);}
  if(G.eq.sword)G.inv.push(G.eq.sword);G.eq.sword=heir;if(S.rew)S.rew.items.push(heir);
  G.inv=G.inv.filter(x=>x.id!==heir.id);calc();save();return true;
}


/* ================= SKILLS ================= */
const TREES={knight:{n:'VALOR',col:'#e8504a',d:'Sword & shield. Hold the line.'},arcana:{n:'ARCANA',col:'#b45cff',d:'Staff magic. Dawn mends, Dusk devours.'},wild:{n:'WILD',col:'#4cd964',d:'Bow & instinct. Strike from afar.'}};
const SK=[
 {id:'iron',tr:'knight',tier:1,n:'Iron Skin',max:3,d:r=>'+'+6*r+' Defense',fx:(m,r)=>{m.def+=6*r;}},
 {id:'edge',tr:'knight',tier:1,n:'Keen Edge',max:3,d:r=>'+'+8*r+'% sword damage',fx:(m,r)=>{m.swordDmg+=8*r;}},
 {id:'bash',tr:'knight',tier:2,n:'Shield Bash',max:1,req:'iron',d:()=>'ABILITY (sword): stun and hit foes in front. 6s cooldown.'},
 {id:'wind',tr:'knight',tier:2,n:'Second Wind',max:3,req:'edge',d:r=>'Heal '+3*r+'% max HP on each kill',fx:(m,r)=>{m.healKill+=3*r;}},
 {id:'whirl',tr:'knight',tier:3,n:'Whirlwind',max:1,req:'bash',d:()=>'ABILITY (sword): spin and hit everything around you. 9s cooldown.'},
 {id:'bulwark',tr:'knight',tier:3,n:'Bulwark',max:2,req:'wind',d:r=>'-'+6*r+'% damage taken, +'+10*r+' HP',fx:(m,r)=>{m.dmgRed+=6*r;m.hp+=10*r;}},
 {id:'oath',tr:'knight',tier:4,n:'Oath of the Knight',max:1,req:'bulwark',d:()=>'+15% all damage, +20 Defense, sword hits knock foes back.',fx:m=>{m.allDmg+=15;m.def+=20;m.kb=1;}},
 {id:'focus',tr:'arcana',tier:1,n:'Arcane Focus',max:3,d:r=>'+'+12*r+' max mana',fx:(m,r)=>{m.mp+=12*r;}},
 {id:'dawnm',tr:'arcana',tier:1,n:'Dawn Mastery',max:3,d:r=>'Dawn bolts heal '+3*r+' more HP',fx:(m,r)=>{m.dawnHeal+=3*r;}},
 {id:'duskm',tr:'arcana',tier:2,n:'Dusk Mastery',max:3,req:'focus',d:r=>'+'+10*r+'% Dusk damage, foes flee '+(.3*r).toFixed(1)+'s longer',fx:(m,r)=>{m.duskDmg+=10*r;m.fear+=.3*r;}},
 {id:'surge',tr:'arcana',tier:2,n:'Mana Surge',max:3,req:'dawnm',d:r=>'+'+(.5*r).toFixed(1)+' mana per second',fx:(m,r)=>{m.mpRegen+=.5*r;}},
 {id:'nova',tr:'arcana',tier:3,n:'Nova',max:1,req:'duskm',d:()=>'ABILITY (staff, 8 mana): blast all nearby. Dawn heals you, Dusk terrifies. 8s cooldown.'},
 {id:'ward',tr:'arcana',tier:3,n:'Dawn Ward',max:2,req:'surge',d:r=>'Dawn bolt hits grant a '+6*r+' point shield',fx:(m,r)=>{m.shieldPer+=6*r;}},
 {id:'crown',tr:'arcana',tier:4,n:'Crownfire',max:1,req:'nova',d:()=>'+25% staff damage, bolts pierce through a foe.',fx:m=>{m.staffDmg+=25;m.staffPierce=1;}},
 {id:'aim',tr:'wild',tier:1,n:'Steady Aim',max:3,d:r=>'+'+8*r+'% bow damage',fx:(m,r)=>{m.bowDmg+=8*r;}},
 {id:'eye',tr:'wild',tier:1,n:"Hunter's Eye",max:3,d:r=>'+'+4*r+'% crit chance',fx:(m,r)=>{m.crit+=4*r;}},
 {id:'quick',tr:'wild',tier:2,n:'Quick Draw',max:3,req:'aim',d:r=>'Bow fires '+8*r+'% faster',fx:(m,r)=>{m.bowCd*=Math.pow(.92,r);}},
 {id:'pierce',tr:'wild',tier:2,n:'Piercing Shot',max:2,req:'eye',d:r=>'Arrows pierce '+r+' extra foe'+(r>1?'s':''),fx:(m,r)=>{m.arrowPierce+=r;}},
 {id:'volley',tr:'wild',tier:3,n:'Volley',max:1,req:'quick',d:()=>'ABILITY (bow): loose five arrows in quick succession. 8s cooldown.'},
 {id:'evade',tr:'wild',tier:3,n:'Evasion',max:3,req:'pierce',d:r=>r*5+'% chance to dodge attacks',fx:(m,r)=>{m.dodge+=5*r;}},
 {id:'dead',tr:'wild',tier:4,n:'Deadeye',max:1,req:'volley',d:()=>'Crits deal 2.6x instead of 1.75x. +10% crit.',fx:m=>{m.critMul=2.6;m.crit+=10;}}
];
const SKB=Object.fromEntries(SK.map(s=>[s.id,s]));
const rank=id=>G.sk[id]||0;
const spent=tr=>SK.filter(s=>s.tr===tr).reduce((a,s)=>a+rank(s.id),0);
function canLearn(s){if(G.pts<1||rank(s.id)>=s.max)return false;if(spent(s.tr)<3*(s.tier-1))return false;if(s.req&&!rank(s.req))return false;return true;}
function learn(id){const s=SKB[id];if(!canLearn(s))return false;G.sk[id]=rank(id)+1;G.pts--;calc();save();return true;}
const respecCost=()=>25*G.lvl;
function respec(){const c=respecCost();if(G.gold<c)return false;G.gold-=c;let n=0;for(const k in G.sk)n+=G.sk[k];G.pts+=n;G.sk={};calc();save();return true;}

/* ================= STATS ================= */
function calc(){
  const m={dmg:0,crit:5,hp:0,mp:0,def:0,xp:0,leech:0,regen:0,swordDmg:0,staffDmg:0,bowDmg:0,duskDmg:0,allDmg:0,healKill:0,mpRegen:.8,fear:1.2,dawnHeal:3,shieldPer:0,dodge:0,critMul:1.75,dmgRed:0,bowCd:1,arrowPierce:0,staffPierce:0,kb:0};
  for(const s of SLOTS){const it=G.eq[s];if(!it)continue;if(it.def)m.def+=it.def;for(const a of it.aff)m[a.k]=(m[a.k]||0)+a.v;}
  m.hp+=G.bhp||0;m.mp+=G.bmp||0;
  for(const s of SK){const r=rank(s.id);if(r&&s.fx)s.fx(m,r);}
  const hpPct=P.max?P.hp/P.max:1;
  P.max=Math.round(100+9*(G.lvl-1)+m.hp);P.mmax=Math.round(30+3*(G.lvl-1)+m.mp);
  P.hp=clamp(Math.round(P.max*hpPct),1,P.max);P.mp=Math.min(P.mp,P.mmax);
  S.m=m;
}
const xpNeed=l=>50*l+10*l*l;
function gainXP(n){
  n=Math.round(n*(1+S.m.xp/100));G.xp+=n;if(S.rew)S.rew.xp+=n;let up=0;
  while(G.xp>=xpNeed(G.lvl)&&G.lvl<30){G.xp-=xpNeed(G.lvl);G.lvl++;G.pts++;up++;}
  if(up){calc();P.hp=P.max;P.mp=P.mmax;if(S.rew)S.rew.lv+=up;toast('LEVEL UP!  Lv '+G.lvl+'  (+1 skill point)');sfx(660,.4,'triangle',.06);burst(P.x,GY-20,'#ffe27a',24,160);}
}
