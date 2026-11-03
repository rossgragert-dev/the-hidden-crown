/* ================= ONE REUSABLE JOUST ENGINE =================
   Deterministic fixed-step simulation shared by every jousting scene.
   role 'squire': Corin on foot hands a lance to a passing rider (mission M0).
   role 'rider' : Corin mounted, couching a lance against an opponent (preview / later acts).
   Both roles use the same actors, passes, reach tests, scoring and events.
   The handoff/contact test is positional: a rider hand must be inside the reach
   window while an offer (or a lowered lance) is active, so timing is read from
   the horse itself instead of an abstract bar.
*/
const JOUST_STEP=1/60;
const JOUST_CFG={
  speed:{walk:46,trot:92,canter:132,gallop:176},
  reach:20,reachEasy:36,offer:.42,offerEasy:.7,
  lance:62,setMin:.22,setMax:1.1
};
function joustCreate(c){
  const easy=!!(G.opts&&G.opts.joustEasy)||!!c.easy,role=c.role||'squire',seed=c.seed||11;
  const J={role,easy,seed,rnd:mkr(seed),acc:0,t:0,round:1,passes:c.passes||3,score:0,foe:0,object:c.object||null,
    anchor:c.anchor||0,lane:c.lane||0,lead:c.lead||300,opponent:c.opponent||'brannoch',phase:'prep',pt:0,events:[],result:null,
    reach:easy?JOUST_CFG.reachEasy:JOUST_CFG.reach,offerDur:easy?JOUST_CFG.offerEasy:JOUST_CFG.offer,
    offer:0,used:false,handed:false,verdict:'',set:-1,broke:false,log:[],
    a:{x:0,v:0,gait:'idle',ph:0,face:1,ang:-12},b:{x:0,v:0,gait:'idle',ph:0,face:-1,ang:-12,set:-1,q:0}};
  joustReset(J);return J;
}
function joustReset(J){
  const a=J.a,b=J.b;J.pt=0;J.phase='prep';J.offer=0;J.used=false;J.handed=false;J.verdict='';J.set=-1;J.broke=false;
  a.x=J.anchor-J.lead;a.v=0;a.gait='idle';a.ph=0;a.ang=-12;
  if(J.role==='rider'){a.x=J.anchor-J.lead/2;b.x=J.anchor+J.lead/2;b.v=0;b.set=-1;b.q=.35+J.rnd()*.65;b.gait='idle';}
}
function joustEvent(J,k,v){J.events.push({k,t:J.t,v});if(J.events.length>40)J.events.shift();if(J.on)J.on(k,v);}
// Player action: squire offers the lance, rider lowers the lance.
function joustAct(J){
  if(J.phase!=='approach'&&J.phase!=='prep')return false;
  if(J.role==='squire'){
    if(J.used||J.phase!=='approach')return false;
    J.used=true;J.offer=J.offerDur;joustEvent(J,'offer');return true;
  }
  if(J.set>=0)return false;
  J.set=0;joustEvent(J,'set');return true;
}
function joustHand(J){return J.role==='squire'?J.anchor+9:J.b.x;}
function joustPassEnd(J,res){
  J.phase='resolve';J.pt=0;J.verdict=res.verdict;
  if(res.pts)J.score+=res.pts;if(res.foe)J.foe+=res.foe;
  joustEvent(J,'resolve',res);
}
function joustStep(J,dt){
  J.acc+=Math.min(dt,.1);
  while(J.acc>=JOUST_STEP){J.acc-=JOUST_STEP;joustTick(J,JOUST_STEP);if(J.phase==='done')break;}
}
function joustTick(J,dt){
  const a=J.a,b=J.b,C=JOUST_CFG;J.t+=dt;J.pt+=dt;
  if(J.set>=0)J.set+=dt;if(J.offer>0)J.offer-=dt;
  if(J.phase==='prep'){
    a.gait='walk';a.v=C.speed.walk*Math.min(1,J.pt/.5);a.x+=a.v*dt;a.ph+=dt*joustStride(a.gait);
    if(J.role==='rider'){b.gait='walk';b.v=-C.speed.walk;b.x+=b.v*dt;b.ph+=dt*joustStride('walk');}
    if(J.pt>=1.1){J.phase='approach';J.pt=0;joustEvent(J,'start',J.round);}
    return;
  }
  if(J.phase==='approach'){
    const k=Math.min(1,J.pt/.8);
    const g=k<.35?'trot':k<.7?'canter':'gallop';
    a.gait=g;a.v=C.speed[g];a.x+=a.v*dt;a.ph+=dt*joustStride(g);
    if(J.role==='squire'){
      a.ang=-12;
      const dx=a.x+14-joustHand(J);
      if(J.offer>0&&!J.handed&&Math.abs(dx)<=J.reach){J.handed=true;J.offer=0;joustEvent(J,'handoff',dx);joustPassEnd(J,{pts:1,verdict:'PERFECT HANDOFF'});return;}
      if(a.x+14>joustHand(J)+J.reach+10){
        const v=!J.used?'NO LANCE OFFERED':(J.offer>0?'TOO EARLY':'TOO LATE');
        joustPassEnd(J,{pts:0,verdict:v});
      }
    }else{
      b.gait=g;b.v=-C.speed[g];b.x+=b.v*dt;b.ph+=dt*joustStride(g);
      // the opponent lowers his lance on a seeded schedule; quality sets how well
      if(b.set<0&&(b.x-a.x)<(280+b.q*110))b.set=0;if(b.set>=0)b.set+=dt;
      const lowered=J.set>=0;a.ang=lowered?(J.set<.18?-12+J.set/.18*12:2):-30;
      const gap=b.x-a.x;
      if(gap<=C.lance*2-4+J.reach*.2){
        const mine=lowered&&J.set>=C.setMin&&J.set<=C.setMax;
        const glance=lowered&&!mine&&J.set>=0.05;
        const theirs=b.set>=C.setMin;
        const pts=mine?3:(glance?1:0),foe=theirs?(b.q>.7?3:2):0;
        J.broke=mine;joustPassEnd(J,{pts,foe,verdict:mine?'CLEAN HIT':glance?(J.set>C.setMax?'LANCE DROOPED':'GLANCING BLOW'):'MISSED'});
      }
    }
    return;
  }
  if(J.phase==='resolve'){
    const g=J.role==='squire'&&J.handed?'canter':'trot';
    const slow=Math.max(0,1-J.pt/1.1);
    a.gait=slow>.15?g:'walk';a.v=C.speed[a.gait]*(slow>.15?slow+.2:1);a.x+=a.v*dt;a.ph+=dt*joustStride(a.gait);
    if(J.role==='rider'){b.gait=slow>.15?'trot':'walk';b.v=-C.speed[b.gait];b.x+=b.v*dt;b.ph+=dt*joustStride(b.gait);}
    if(J.pt>=1.6){
      if(J.round>=J.passes){J.phase='done';J.pt=0;joustEvent(J,'done',J.score);}
      else{J.round++;joustReset(J);}
    }
  }
}
function joustStride(g){return {walk:1.7,trot:2.8,canter:3.2,gallop:4.2,idle:0}[g]||0;}
function joustDone(J){return J.phase==='done';}
// Prebake every pose the engine will show so the first pass does not hitch.
function joustPrebake(){const gs=['walk','trot','canter','gallop'];prebakeHorse('charger','tourney','hearth',gs);prebakeHorse('chestnut','tourney','hearth',gs);prebakeHorse('black','tourney','crimson',gs);}
const JOUST_HALV={...NPCS.halv,mv:true,w:3};
function joustDraw(J,cam,gy){
  const ax=J.anchor-cam;
  // handoff marker: shows the reach zone on the ground
  const hx=Math.round(joustHand(J)-cam);
  if(J.role==='squire'&&J.phase==='approach'){
    const r=J.reach;R(hx-r,gy-1,r*2,1,'rgba(255,230,130,.55)');R(hx-r,gy-3,1,3,'rgba(255,230,130,.8)');R(hx+r-1,gy-3,1,3,'rgba(255,230,130,.8)');
  }
  const a=J.a;
  const rd=Object.assign({},J.role==='squire'?JOUST_HALV:heroOpts(),{mounted:1});
  const lance={ang:a.ang,none:false};if(J.broke&&J.role==='rider')lance.broken=24;
  if(J.role==='squire'&&J.handed&&J.phase!=='prep')lance.none=true;
  const laneY=gy-(J.role==='squire'?7:0);
  const ph=J.a.ph;
  const m=drawMounted(a.x-cam,laneY,1,{v:J.role==='squire'?'charger':'chestnut',tk:'tourney',liv:'hearth',gait:a.gait,ph},rd,lance);
  if(J.role==='squire'&&J.handed){drawLance(Math.round(ax+10),gy-26,1,-70,{back:6});}
  if(J.role==='rider'){
    const b=J.b,bl={ang:b.set>=0?2:-26,none:false};
    const mentor=J.opponent==='halvard';
    drawMounted(b.x-cam,laneY,-1,
      {v:mentor?'charger':'black',tk:'tourney',liv:mentor?'hearth':'crimson',gait:b.gait,ph:b.ph},
      mentor?{...NPCS.halv,mv:true,w:3}:{...NPCS.brannoch,mv:true,w:3,helm:'#8a8f9a',crest:'plume',crestC:'#2a2a34'},bl);
  }
  // off-screen indicator for the narrow portrait view
  const rx=a.x-cam;
  if(rx<-34)joustArrow(J,'<',Math.round(J.anchor-a.x));
  if(J.role==='rider'&&J.b.x-cam>W+34)joustArrow(J,'>',Math.round(J.b.x-J.a.x));
}
function joustArrow(J,s,d){
  const left=s==='<';g.font='bold 8px Courier New';g.textAlign=left?'left':'right';
  g.fillStyle='rgba(12,10,14,.75)';R(left?2:W-44,GY-120,42,12,'rgba(12,10,14,.75)');
  g.fillStyle='#ffe28a';g.fillText(left?'< RIDER':'FOE >',left?5:W-5,GY-111);
}
function joustHud(J,x,y){
  g.textAlign='left';g.font='bold 8px Courier New';
  R(x-4,y-14,112,30,'rgba(12,10,14,.82)');
  g.fillStyle='#ffedbb';
  const t=J.role==='squire'?'PASS '+J.round+'/'+J.passes+'  HANDOFFS '+J.score:'PASS '+J.round+'/'+J.passes+'  YOU '+J.score+' FOE '+J.foe;
  g.fillText(t,x,y-4);
  g.fillStyle=J.phase==='resolve'?(J.verdict==='PERFECT HANDOFF'||J.verdict==='CLEAN HIT'?'#9be58a':'#ff9b8a'):'#c9b88a';
  g.fillText(J.phase==='resolve'?J.verdict:J.phase==='prep'?'RIDER MOUNTING UP...':(J.role==='squire'?(J.used?'LANCE OUT...':'USE: OFFER THE LANCE'):(J.set>=0?'LANCE SET':(J.phase==='approach'&&J.b.x-J.a.x<420&&J.b.x-J.a.x>230?'LOWER LANCE NOW!':'USE: COUCH THE LANCE'))),x,y+8);
}
