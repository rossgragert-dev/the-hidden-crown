/* ================= ENEMIES ================= */
const EN={
 blight:{n:'Blightling',hp:22,dmg:8,spd:40,rng:15,xp:10,g:[1,4],drop:.14},
 hound:{n:'Blight Hound',hp:90,dmg:16,spd:28,rng:30,xp:55,g:[12,22],drop:.7,k:1.7,big:1},
 bandit:{n:'Reaver',hp:34,dmg:9,spd:36,rng:18,xp:15,g:[3,9],drop:.2,h:1,w:0,sp:{col:'#8a3a2a',metal:'#6a6e78',trim:'#d0802a',hair:'#222',look:1,cape:'#3a2a22',helm:'#6a6e78',crest:'horns',leg:'#3a3036',scar:1,iris:'#8a2a1a',nosh:1,w:0}},
 archer:{n:'Reaver Archer',hp:24,dmg:7,spd:22,rng:130,xp:15,g:[3,9],drop:.2,h:1,w:2,ranged:1,sp:{col:'#5a6a3a',metal:'#8a6a42',trim:'#c9a24a',hair:'#4a3a22',crest:'hood',leg:'#6a5a3a',iris:'#6a4a2a',look:0,quiver:1,w:2}},
 ashen:{n:'Ashen Blade',hp:40,dmg:12,spd:54,rng:18,xp:24,g:[5,12],drop:.25,h:1,w:4,dash:1,sp:{col:'#2a2630',metal:'#3a3844',trim:'#8a2a3a',hair:'#111',crest:'hood',mask:1,leg:'#2a2630',look:0,w:4}}
};

/* ================= STORY DATA ================= */
const L=(who,text)=>({who,text}),N=text=>({who:'',text});
const REG={hearth:{n:'Castle Hearthmoor',pal:'day'},green:{n:'The Greenmarch',pal:'day'},fen:{n:'Veilfen Reeds',pal:'fen'},night:{n:'Hearthmoor by Night',pal:'night'},forest:{n:'Thornwood',pal:'wood'},cave:{n:'Hollowdeep Caves',pal:'cave'},mine:{n:'Greywatch Mine',pal:'mine'},keep:{n:'Ashfall Keep',pal:'keep'},chapel:{n:'Hearthmoor Chapel',pal:'keep'},road:{n:'The Southern Road',pal:'day'}};
const ACTN={1:'ACT I: THE SQUIRE',2:'ACT II: THE KNIGHT',3:'ACT III: THE KING'};
const MISSIONS=[
{id:'m0',type:'main',act:1,title:"The Knight's Squire",reg:'hearth',lvl:1,
 desc:"Before the crown, a boy's life: fetch Halvard's armor, groom his horse, and serve lances at the tournament.",
 areas:[
  {id:'armory',title:'Hearthmoor Armory',reg:'hearth',explore:{length:1060,scenery:'armory',seed:3,
    platforms:[{x:320,w:112,y:-26},{x:600,w:165,y:-54},{x:780,w:78,y:-28}],
    objects:[
     {kind:'chest',label:'OLD CHEST',x:220,y:0,flag:'squireChest',slot:'armor',rarity:1},
     {kind:'key',label:'IRON KEY',x:368,y:-26,flag:'squireArmoryKey'},
     {kind:'shield',label:'PRACTICE SHIELD',x:500,y:0,flag:'squireShield',tier:0},
     {kind:'gear',label:'BREASTPLATE',x:667,y:-54,flag:'squireArmor'},
     {kind:'gear',label:'TOURNAMENT HELM',x:742,y:-54,flag:'squireHelmet'},
     {kind:'gear',label:'POLISHING OIL',x:813,y:-28,flag:'squireOil'},
     {kind:'gear',label:'LANCE BUNDLE',x:897,y:0,flag:'squireLancesReady'},
     {kind:'exit',label:'STABLES DOOR',x:994,y:0,need:'squireArmoryKey',
      needFlags:['squireArmor','squireHelmet','squireOil','squireLancesReady','squireShield'],locked:'FIND THE ARMORY KEY'}
    ]
   },steps:[{t:'explore',goal:'Prepare Halvard\'s tournament armor, helm, polish and lances',intro:[
     N('Sixteen years after the Night of Ash, an unknown prince lives as an ordinary squire at Castle Hearthmoor.'),
     L('Ser Halvard','Corin! I need my breastplate, tournament helm, polishing oil, and a bundle of sound lances before I ride. The upper racks are locked; find the iron key.'),
     L('Corin','Aye, Father. I will have every buckle shining before the trumpets sound.'),
     N('Move with your left thumb and tap JUMP with your right. Search the armor racks, leap to the upper loft, and tap USE near supplies.')
   ]}]},
  {id:'stables',title:'The Castle Stables',reg:'hearth',explore:{length:995,scenery:'stable',seed:9,
    platforms:[{x:170,w:115,y:-23},{x:520,w:165,y:-36},{x:740,w:110,y:-26}],
    objects:[
     {kind:'chest',label:'TACK ROOM CHEST',x:222,y:-23,flag:'squireTackChest',slot:'trinket'},
     {kind:'horse',label:'GROOM HALVARD HORSE',x:416,y:0,flag:'squireHorse'},
     {kind:'gear',label:'TOURNAMENT SADDLE',x:602,y:-36,flag:'squireSaddle'},
     {kind:'exit',label:'TO THE LISTS',x:935,y:0,needFlags:['squireHorse','squireSaddle']}
    ]
   },steps:[{t:'explore',goal:"Groom Halvard's horse and retrieve the saddle",intro:[
     N('The stables smell of leather, straw and cold morning air.'),
     L('Stablemaster Tobren','A knight is only as ready as his horse. The saddle is stored above. Mind your footing, squire.'),
     L('Corin','The grey charger will be groomed and saddled before the first trumpet.')
   ]}]},
  {id:'lists',title:'The Tournament Lists',reg:'hearth',explore:{length:1030,scenery:'lists',seed:18,
    platforms:[{x:170,w:136,y:-34},{x:700,w:118,y:-45}],
    objects:[
     {kind:'gear',label:'SPARE LANCES',x:236,y:-34,flag:'squireLances'},
     {kind:'joust',label:'SERVE THE JOUST',x:527,y:0,need:'squireLances',flag:'squireJoust'},
     {kind:'chest',label:'CHAMPION CHEST',x:765,y:-45,flag:'squireTournamentChest',slot:'sword'},
     {kind:'exit',label:'PATROL GATE',x:956,y:0,needFlags:['squireJoust']}
    ]
   },steps:[{t:'explore',goal:'Collect spare lances and assist Halvard during the joust',intro:[
     N('Bright pennants ripple over the lists. Horns sound as mounted knights take their places.'),
     L('Ser Halvard','Listen closely. I ride; you bring the lances. Hand each one across as I pass the marker.'),
     L('Corin','And when may I joust?'),
     L('Ser Halvard','When you have learned to stand on your own feet. The lance handoff is the first lesson.'),
     N('Get the spare lances on the raised platform. At the lists, tap USE when the moving marker reaches the green band.')
   ]}]},
  {id:'greenroad',title:'The South Patrol Road',reg:'green',explore:{length:1260,scenery:'road',seed:27,
    platforms:[{x:270,w:115,y:-28},{x:800,w:160,y:-34}],
    combatAt:[
      {x:320,list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.6}]},
      {x:680,list:[{k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.7},{k:'bandit',s:1,d:1.3}]},
      {x:970,list:[{k:'hound',s:1,d:0,boss:1,name:'Greenmarch Ravager',hpm:1.1}]}
    ],
    objects:[
     {kind:'chest',label:'HIDDEN ROAD CACHE',x:324,y:-28,flag:'squireRoadCache',slot:'bow'},
     {kind:'key',label:'PATROL SEAL',x:852,y:-34,flag:'squirePatrolSeal'},
     {kind:'exit',label:'RETURN TO HEARTHMOOR',x:1205,y:0,need:'squirePatrolSeal'}
    ]
   },steps:[{t:'explore',goal:'Travel the patrol road, defeat threats and recover the seal',intro:[
     L('Ser Halvard','You served well. Now I send you along the southern road. Travel on foot; learn every turning of the kingdom.'),
     L('Corin','Alone?'),
     L('Ser Halvard','A knight must know when to walk without a shadow at his heel. Keep your shield to hand.'),
     N('Travel the road yourself. Blight creatures, reavers and archers may be lying in wait; recover the patrol seal on the upper ledge.')
   ]}]}
 ]},
{id:'m1',type:'main',act:1,title:'Eyes Up',reg:'hearth',lvl:1,req:'m0',desc:'Castle Hearthmoor. A squire, his mentor, and the first blight wolves.',steps:[
 {t:'say',lines:[
  N('Sixteen years later, at Castle Hearthmoor, a *squire* named Corin polishes his master\'s armor. He does not know who he is.'),
  N('*You* do.'),
  L('Ser Halvard','Eyes up, *Corin*. Blighted wolves are on the Greenmarch road, and the Regent\'s tax men will not ride out to face them.'),
  L('Corin','Then we ride out, Ser. Somebody should.'),
  L('Lysa','He says that like he is already a *knight*.'),
  L('Ser Halvard','...Aye. Like he was *born* to it.'),
  L('Corin','Why do you always look at me like that, Ser?'),
  L('Ser Halvard','Draw your steel, boy. Learn *all* *three*: sword, staff, bow. A knight who knows one trick dies of it.')]},
 {t:'toast',text:'ATK to fight. SWORD / STAFF / BOW to swap. Open BAG and SKILLS anytime.'},
 {t:'wave',intro:[L('Lysa','*Blightlings!* Left and right, Corin!')],list:[{k:'blight',s:1,d:0},{k:'blight',s:1,d:1},{k:'blight',s:-1,d:2}],outro:[L('Corin','They were wolves once. Look at their *eyes*.')]},
 {t:'chest',boost:0,lines:[L('Ser Halvard','The armory chest. Take what you can use. The rarer the gear, the brighter it *glows*.')]},
 {t:'say',lines:[L('Lysa','Whatever is killing the Greenmarch, it is *spreading*.'),L('Ser Halvard','Then we ride at dawn. Rest, both of you.')]}
]},
{id:'m2',type:'main',act:1,title:'The Greenmarch Road',reg:'green',lvl:1,req:'m1',desc:'A Regency guard crawls out of the blight with a warning.',steps:[
 {t:'say',lines:[N('The Greenmarch. Fields that should be golden are grey with rot.'),L('Lysa','Tracks. Dozens. Heading for the village.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:1,d:.9},{k:'blight',s:-1,d:1.8},{k:'blight',s:-1,d:2.7}],outro:[L('Corin','Wolves, hares, even crows. All of it *twisted*.')]},
 {t:'say',npc:{k:'guard',face:-1},lines:[N('A Regency guard staggers from the reeds. Blight-sick, unarmed, terrified.'),L('Guard','*Mercy!* I only collected the tax! Lord Vane said the Greenmarch pays or *burns*!'),L('Corin','Where is the rest of your patrol?'),L('Guard','Dead. Or worse. Please, *Ser*...')]},
 {t:'choice',prompt:'What does Corin do?',opts:[
  {label:'Spare him',desc:'Bind his wounds and send him home.',c:12,cl:'Mercy',flag:'spared',heal:.3,xp:30,lines:[L('Guard','Bless you... Listen. The Regent\'s hounds are searching every keep for a *boy* of sixteen. They mean to bury him.'),L('Ser Halvard','...We are leaving. *Now*.')]},
  {label:'Take his coin, leave him',desc:'The Regency can afford the loss.',c:-4,cl:'Greed',flag:'robbed',gold:45,lines:[L('Lysa','He was only following orders, Corin.'),L('Corin','So was the man who taxed these farms to *ash*.')]},
  {label:'Make an example',desc:'Cut him down. Let the Regency feel fear.',c:-14,cl:'Cruelty',flag:'cruel',shake:1,lines:[N('Lysa looks away. The relic at Corin\'s belt turns *cold*, then hums louder.'),L('Ser Halvard','...Remember this feeling, boy. *Vane* felt it once, too.')]}]},
 {t:'chest',boost:.3}
]},
{id:'m3',type:'main',act:1,title:'Bread or Blood',reg:'green',lvl:2,req:'m2',desc:'A starving village and a granary. Someone will go without.',steps:[
 {t:'say',npc:{k:'vill',face:-1},lines:[L('Villager','Ser, the granary is all we have left. The blight took the *fields*.'),L('Villager','The garrison will take what is inside by sundown. Please... *help* us.')]},
 {t:'choice',prompt:'The granary stands before Corin.',opts:[
  {label:'Share the grain',desc:'Feed the village. The army can wait.',c:15,cl:'Generosity',flag:'shared',maxhp:10,lines:[N('The villagers press warm bread into his hands. He feels *stronger* than he ever has.'),L('Ser Halvard','That is how *good* men are remembered, Corin.')]},
  {label:'Ration it fairly',desc:'Half for the village, half for the road.',c:5,cl:'Fairness',xp:25,lines:[L('Villager','A fair man. That is *rarer* than grain.')]},
  {label:'Requisition it for the war',desc:'Take it all. The cause needs it more.',c:-15,cl:'Tyranny',flag:'seized',maxmp:12,shake:1,lines:[N('The doors splinter. Stolen grain, stolen strength... and the relic *burns* warm.'),L('Ser Halvard','Careful, boy. I have seen where that road ends. I served *Vane\'s* road.')]}]},
 {t:'say',lines:[L('Lysa','Corin... that is no wolf. *Behind* you!')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.6},{k:'hound',s:1,d:1.8,boss:1,name:'Blight Hound'},{k:'blight',s:-1,d:3.2}],outro:[L('Ser Halvard','Well fought. Better than I deserve.')]},
 {t:'chest',boost:.5}
]},
{id:'m4',type:'main',act:1,title:'The Whispering Reeds',reg:'fen',lvl:3,req:'m3',desc:'The Veilfen. A Marshkin witch knows more than she should.',steps:[
 {t:'say',lines:[N('Veilfen. Mist coils between the reeds, and something old watches from the water.'),L('Lysa','I do not like this place.')]},
 {t:'say',npc:{k:'wren',face:-1},lines:[L('Mother Wren','Then you are *wise*, little archer. But the marsh likes the *brave* more.'),L('Mother Wren','Pretty blades, boy. Let us see if they cut the *rot*.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.8},{k:'blight',s:1,d:1.6},{k:'blight',s:-1,d:2.4},{k:'blight',s:1,d:3.2}],outro:[L('Mother Wren','Hm. You hold the bow like a *king* who learned archery in secret.'),L('Corin','Kings do not learn archery from squires.'),L('Mother Wren','No. They learn it from *mothers*. Mind your feet.')]},
 {t:'choice',prompt:'Mother Wren offers a Marshkin bargain.',opts:[
  {label:'Accept her charm',desc:'Wild magic. It will want something back.',c:-4,cl:'Bargain',flag:'wrenPact',loot:{slot:'trinket',rar:2},lines:[L('Mother Wren','Good. The marsh *remembers* a debt.')]},
  {label:'Decline politely',desc:'Honor the gift with thanks, not promises.',c:4,cl:'Honor',flag:'wrenRespect',gold:40,xp:30,lines:[L('Mother Wren','Hah! The old king said no to me, too. *Same* chin.')]},
  {label:'Ask about the old king',desc:'Why does she keep looking at him?',c:2,cl:'Curiosity',flag:'wrenTold',xp:40,lines:[L('Mother Wren','Roderan promised the marsh a *seat* at his table. He died before he could keep it. Do not make the same *mistake*, boy.')]}]},
 {t:'chest',boost:.4}
]},
{id:'m5',type:'main',act:1,title:'A Rival\'s Debt',reg:'hearth',lvl:3,req:'m4',desc:'Brannoch Vale wants his pride back, and he has hired help.',steps:[
 {t:'say',npc:{k:'brannoch',face:-1},lines:[L('Brannoch','Well, if it is not the *orphan* squire.'),L('Brannoch','Father says the Order wastes its time on strays. Let me show you what a *real* knight does.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.6},{k:'archer',s:1,d:1.8},{k:'bandit',s:1,d:3}],outro:[N('The hired Reavers fall. Brannoch is alone, sword shaking, face pale.')]},
 {t:'choice',prompt:'Brannoch lies at Corin\'s feet.',opts:[
  {label:'Offer him a hand',desc:'Help him up. Let him choose what he becomes.',c:10,cl:'Grace',flag:'brannochAlly',xp:40,lines:[L('Brannoch','...Why? I would not have.'),L('Corin','That is the difference between us.')]},
  {label:'Humiliate him publicly',desc:'Let the whole yard see what he is.',c:-8,cl:'Spite',flag:'brannochFoe',lines:[L('Brannoch','You will regret this, *orphan*.')]},
  {label:'Take his signet ring',desc:'A noble\'s ring buys a lot of bread.',c:-3,cl:'Spoils',gold:70,loot:{rar:1},lines:[L('Brannoch','That ring was my *grandfather\'s*!')]}]},
 {t:'chest',boost:.4}
]},
{id:'m6',type:'main',act:1,title:'The Relic Hums',reg:'night',lvl:4,req:'m5',desc:'A mage in the library knows what Corin carries.',steps:[
 {t:'say',npc:{k:'ione',face:-1},lines:[N('Night at Hearthmoor. In the library, Magister Ione has been waiting.'),L('Magister Ione','You carry something that should not exist, squire. Hold out your hand.'),L('Corin','It is only an old amulet Ser Halvard gave me.'),L('Magister Ione','It is a *shard* of the Oathcrown. And it is *singing*.'),N('*You* know whose blood it sings for.'),L('Magister Ione','Listen close. Magic comes in two tides: *Dawn* mends, *Dusk* devours. Try both. Use the toggle.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.6},{k:'blight',s:1,d:1.4},{k:'blight',s:-1,d:2.2},{k:'blight',s:1,d:3}],outro:[L('Magister Ione','Dawn heals. Dusk hits hard. Both answer to *you*. That is what troubles me.')]},
 {t:'choice',prompt:'Which tide does Corin trust first?',opts:[
  {label:'Dawn',desc:'Light, healing, and the long road.',c:6,cl:'Dawn',flag:'dawnFirst',xp:40,lines:[L('Magister Ione','A healer\'s instinct. It will serve you, and cost you *speed*.')]},
  {label:'Dusk',desc:'Fear and power. Win now, answer later.',c:-6,cl:'Dusk',flag:'duskFirst',xp:40,lines:[L('Magister Ione','Hmm. The power is *real*. So is the price.')]},
  {label:'Both, carefully',desc:'Refuse to choose a side yet.',c:0,flag:'balanced',xp:60,lines:[L('Magister Ione','Wise. Or *foolish*. We shall see.')]}]},
 {t:'chest',boost:1.2}
]},
{id:'m7',type:'main',act:1,title:'The Ashen Hand',reg:'night',lvl:5,req:'m6',desc:'Assassins drop over the walls. Someone sent them for a reason.',steps:[
 {t:'say',lines:[N('Alarm bells. Black-clad figures drop from the walls.'),L('Ser Halvard','The *Ashen* *Hand*. They have found us.'),L('Lysa','Found *us*? Or found *him*?'),L('Ser Halvard','Fight now. Talk later.')]},
 {t:'wave',list:[{k:'ashen',s:1,d:0},{k:'ashen',s:-1,d:.7},{k:'ashen',s:1,d:1.5}],outro:[N('A heavy tread behind them. The Regency\'s own blade has come in person.')]},
 {t:'say',npc:{k:'cmdr',face:-1},lines:[L('Captain Sorrel','The Regent was right. The fire did not take *everything*.'),L('Corin','What is he talking about?'),L('Ser Halvard','Nothing. *Fight*.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0,boss:1,name:'Captain Sorrel Dunmoor',hpm:6,dmgm:1.35,sp:{col:'#6a6e7a',metal:'#8a8f9a',trim:'#c9a24a',hair:'#222',look:2,helm:'#8a8f9a',crest:'plume',crestC:'#a02030',cape:'#6a1a2a',iris:'#4a2a2a',scar:1,nosh:1,w:0}},{k:'ashen',s:-1,d:2.5},{k:'ashen',s:1,d:4}],outro:[N('Sorrel falls to one knee, blade clattering away.')]},
 {t:'choice',prompt:'Captain Sorrel is at Corin\'s mercy.',opts:[
  {label:'Spare him',desc:'A beaten man is a messenger, not a threat.',c:10,cl:'Mercy',flag:'sorrelSpared',xp:50,lines:[L('Captain Sorrel','Fool... Vane will *find* you. But I will remember this.')]},
  {label:'Finish him',desc:'The Regency does not get a second chance.',c:-12,cl:'Ruthless',flag:'sorrelDead',lines:[N('Ser Halvard turns his head. He has seen this before.')]},
  {label:'Question him',desc:'Make him talk first. Decide after.',c:0,flag:'sorrelTold',xp:60,lines:[L('Captain Sorrel','Vane knows the heir lives. He knows it is *somewhere* in Hearthmoor. That is all I know. *Kill* me or do not.')]}]},
 {t:'chest',boost:1.5}
]},
{id:'m8',type:'main',act:1,title:'Trial of Steel',reg:'hearth',lvl:6,req:'m7',desc:'Three trials make a knight: blade, bow and mind.',steps:[
 {t:'say',npc:{k:'cmdr',face:-1},lines:[L('Commander Brandt','Three trials make a knight: the *blade*, the *bow*, and the *mind*. Fail one, and you remain a squire.'),L('Corin','Then I will not fail.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.8},{k:'bandit',s:1,d:3}],outro:[L('Commander Brandt','The blade is yours. Now, the *bow*.')]},
 {t:'wave',list:[{k:'archer',s:1,d:0},{k:'archer',s:-1,d:.6},{k:'archer',s:1,d:1.2},{k:'archer',s:-1,d:2}],outro:[L('Commander Brandt','Good eye. Now the hardest: the *mind*. The blight does not tire. Neither may you.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.4},{k:'blight',s:1,d:.8},{k:'blight',s:-1,d:1.6},{k:'hound',s:1,d:3,boss:1,name:'Trial Hound'},{k:'blight',s:-1,d:4}],outro:[L('Commander Brandt','You pass. The vigil is tonight. Tomorrow you are a *knight*... if you survive tonight.')]},
 {t:'chest',boost:2},
 {t:'say',lines:[N('Hearthmoor will not see another quiet dawn.')]}
]},
{id:'s1',type:'side',act:1,title:'Lysa\'s Challenge',reg:'hearth',lvl:1,after:'m1',desc:'Bet you cannot outshoot me, squire.',steps:[
 {t:'say',lines:[L('Lysa','Bet you cannot outshoot me, squire.'),L('Corin','Name the stakes.'),L('Lysa','Loser polishes *everyone\'s* armor.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.5},{k:'blight',s:1,d:1},{k:'blight',s:-1,d:1.5}],outro:[L('Lysa','Not bad. For a boy with a sword.')]},
 {t:'loot',slot:'bow',rar:2,lines:[L('Lysa','Take it. It shoots straighter than I do.')]}
]},
{id:'s2',type:'side',act:1,title:'The Lost Lamb',reg:'green',lvl:2,after:'m2',desc:'A child begs for help against the wolves.',steps:[
 {t:'say',npc:{k:'child',face:-1},lines:[L('Child','Please! Wolves took my *lamb*!')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.7},{k:'blight',s:1,d:1.4}],outro:[N('A trembling lamb, tied to a fencepost, bleats softly.')]},
 {t:'choice',prompt:'The lamb wears a silver collar.',opts:[
  {label:'Return the lamb',desc:'Give it back to the child.',c:8,cl:'Kindness',xp:30,lines:[L('Child','Thank you! Thank you, *Ser*!')]},
  {label:'Sell the collar',desc:'Silver is silver.',c:-4,cl:'Greed',gold:60,lines:[N('The child watches in silence.')]}]}
]},
{id:'s3',type:'side',act:1,title:'Unpaid Taxes',reg:'green',lvl:3,after:'m3',desc:'Reavers have hit a Regency tax wagon. Who gets the coin?',steps:[
 {t:'say',lines:[N('A Regency tax wagon, overturned. Reavers circle it like crows.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.7},{k:'archer',s:1,d:1.4},{k:'bandit',s:-1,d:2.2}]},
 {t:'choice',prompt:'The tax wagon is full of coin.',opts:[
  {label:'Escort it to the Regency',desc:'Order is order, even Vane\'s.',c:-4,cl:'Order',gold:80,lines:[L('Lysa','You are helping *Vane*.'),L('Corin','I am keeping the road *open*.')]},
  {label:'Burn the wagon',desc:'Let nothing reach the Regent.',c:6,cl:'Defiance',loot:{rar:1},lines:[N('The flames climb high. Somewhere, a tax collector weeps.')]},
  {label:'Return the coin to the villagers',desc:'It was theirs to begin with.',c:10,cl:'Charity',xp:50,lines:[L('Villager','The *Greenmarch* will remember this.')]}]}
]},
{id:'s4',type:'side',act:1,title:'Marsh Lanterns',reg:'fen',lvl:3,after:'m4',desc:'Pale lights whisper names across the water.',steps:[
 {t:'say',lines:[N('Pale lanterns drift over the water, whispering names.'),L('Lysa','Do not follow them.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.6},{k:'blight',s:1,d:1.2},{k:'blight',s:-1,d:1.8},{k:'hound',s:1,d:3.2,boss:1,name:'Marsh Hound'}]},
 {t:'choice',prompt:'Two lanterns remain: one warm and gold, one cold and violet.',opts:[
  {label:'Take the golden lantern',desc:'Dawn light.',c:5,cl:'Dawn',loot:{slot:'trinket',rar:2},lines:[N('It hums softly against the relic.')]},
  {label:'Take the violet lantern',desc:'Dusk light.',c:-5,cl:'Dusk',loot:{slot:'trinket',rar:2},lines:[N('It whispers a name. *Roderan*.')]}]}
]},
{id:'s5',type:'side',act:1,title:'The Armorer\'s Debt',reg:'hearth',lvl:4,after:'m5',desc:'Three Reavers took Tobren\'s forge over a debt he never owed.',steps:[
 {t:'say',npc:{k:'armorer',face:-1},lines:[L('Tobren','They took my forge. Three Reavers, a *debt* I never owed.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.7},{k:'bandit',s:1,d:1.4}],outro:[L('Tobren','You have my thanks, Ser. And my *gratitude*.')]},
 {t:'choice',prompt:'Tobren offers to repay the favor.',opts:[
  {label:'Forgive his debt',desc:'He has lost enough.',c:8,cl:'Kindness',loot:{slot:'armor',rar:2},lines:[L('Tobren','Take this. I made it for my *son*.')]},
  {label:'Collect what he owes',desc:'A fair wage for a fair fight.',c:-4,cl:'Cold',gold:90,lines:[N('Tobren counts the coins in silence.')]}]}
]},
{id:'m9',type:'main',act:1,title:'The Vigil',reg:'chapel',lvl:6,req:'m8',desc:'A night of prayer before knighthood. Something watches from the dark.',steps:[
 {t:'say',lines:[N('Hearthmoor Chapel. A single candle, a bare stone floor, and the long hours until dawn.'),L('Ser Halvard','A knight keeps vigil alone. Kneel, *Corin*. Think on what you will *protect*.'),L('Corin','And if I do not know what I am protecting?'),L('Ser Halvard','Then you have the whole night to *decide*.')]},
 {t:'choice',prompt:'What vow does Corin speak into the dark?',opts:[
  {label:'Vow of Mercy',desc:'"I will shield the weak, even from my own anger."',c:10,cl:'Mercy',flag:'vowMercy',xp:60,lines:[N('The candle steadies. Warmth gathers around the relic.')]},
  {label:'Vow of Iron',desc:'"I will be the wall no enemy can pass."',c:-10,cl:'Iron',flag:'vowIron',xp:60,lines:[N('The candle gutters. The relic turns cold and heavy.')]},
  {label:'Vow of Silence',desc:'Say nothing. Let deeds speak.',c:0,flag:'vowSilence',xp:90,lines:[L('Magister Ione','...Interesting. The relic *listened* to the silence.')]}]},
 {t:'say',npc:{k:'ione',face:-1},lines:[L('Magister Ione','Do not rise, Corin. The shard draws things. Hold the line.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.5},{k:'blight',s:1,d:1},{k:'blight',s:-1,d:1.5},{k:'blight',s:1,d:2.2}],outro:[L('Magister Ione','The blight is *hunting* the shard. It knows what it is. Do not tell Halvard I said so.')]},
 {t:'say',flag:'knighted',lines:[N('Dawn. Bells ring across Hearthmoor.'),L('Commander Brandt','By the oath you swore and the blade you have earned... rise, *Ser* Corin of Hearthmoor.'),L('Lysa','*Ser* Corin. It suits you.'),L('Ser Halvard','...Rise, boy. You were always going to.')]},
 {t:'loot',slot:'sword',rar:2,lines:[L('Commander Brandt','A knight\'s blade. Make it *count*.')]},
 {t:'chest',boost:1.5,out:.25}
]},
{id:'m10',type:'main',act:1,title:'Fire at Hearthmoor',reg:'night',lvl:7,req:'m9',
 desc:'The fall of Hearthmoor. Cross six battlefields, defend the gate, save civilians, protect the chapel, and escape the keep.',
 areas:[
 {id:'outskirts',title:'The Outer Fields',reg:'green',steps:[
  {t:'say',lines:[N('Smoke darkens the eastern sky. Regency banners fill the valley below Hearthmoor.'),L('Lysa','Scouts on the farm road. If they reach the walls first, the castle will be taken *unaware*.'),L('Corin','Then we get to the watchtower. Sound the alarm.')]},
  {t:'wave',goal:'Break through the Regency scouts',list:[{k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.7},{k:'bandit',s:1,d:1.4},{k:'archer',s:-1,d:2.2}]},
  {t:'interact',goal:'Reach the watchtower and ring the alarm',name:'ALARM BELL',flag:'m10warned',lines:[L('Corin','Hearthmoor! To *arms*!'),N('The warning bell cuts through the smoke. Soldiers rush to their posts.')]},
  {t:'say',lines:[L('Ser Halvard','You bought us a few precious minutes. Ride to the *gatehouse*. We shall need every one.')]}
 ]},
 {id:'gatehouse',title:'The Broken Gate',reg:'hearth',steps:[
  {t:'say',lines:[N('The gatehouse shudders under the Regent\'s battering rams.'),L('Commander Brandt','*Hold* the portcullis! They must not reach the village.')]},
  {t:'defend',goal:'Keep the gate standing through the assault',target:'Gate',hp:145,list:[
    {k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.7},{k:'bandit',s:1,d:1.3},{k:'ashen',s:-1,d:2.1},{k:'archer',s:1,d:3.0}
   ],outro:[L('Commander Brandt','The first assault is broken. Now seal the mechanism!')]},
  {t:'interact',goal:'Reach the winch and secure the portcullis',name:'GATE WINCH',flag:'m10gateSecured',lines:[N('Iron chains grind. The portcullis slams shut behind the final defenders.')]},
  {t:'say',lines:[L('Lysa','Smoke in the lower streets. The villagers are still inside.'),L('Corin','Then the battle is not finished.')]}
 ]},
 {id:'village',title:'The Burning Village',reg:'night',steps:[
  {t:'say',lines:[N('Hearthmoor\'s lower village burns. Families flee between shattered market stalls.'),L('Lysa','There are people behind the barricade. And Regency soldiers at the storehouse.')]},
  {t:'wave',goal:'Clear the market street',list:[
    {k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.8},{k:'ashen',s:1,d:1.7},{k:'bandit',s:-1,d:2.4}
   ]},
  {t:'choice',goal:'Decide whom to save in the village',prompt:'The gate is cracking again. Villagers pound on the postern.',opts:[
    {label:'Hold the gate',desc:'Guard the passage while families escape.',c:4,cl:'Duty',flag:'heldGate',xp:50,lines:[N('Corin holds the line while the last families pass through the smoke.')]},
    {label:'Open the postern',desc:'Evacuate everyone, even if the gate falls.',c:12,cl:'Compassion',flag:'evacuated',maxhp:8,lines:[N('Hundreds stream into the chapel and cellars. They will remember.')]},
    {label:'Burn the bridge',desc:'Cut off the attack. Some may be left outside.',c:-10,cl:'Ruthless',flag:'burnedBridge',lines:[N('Flames swallow the bridge. Behind them the street falls silent.')]}
   ]},
  {t:'interact',goal:'Recover the remaining supplies',name:'SUPPLY CACHE',flag:'m10supplies',lines:[N('Corin gathers medicine, bandages and dry provisions for the survivors.')]}
 ]},
 {id:'chapel',title:'The Chapel Ward',reg:'chapel',steps:[
  {t:'say',lines:[N('Under the chapel, the Oathcrown shard burns brighter than the candles.'),L('Magister Ione','The blight feels the shard. If I can raise the old *ward*, the wounded can escape.'),L('Corin','Tell me what you need.')]},
  {t:'wave',goal:'Clear the chapel approach',list:[
    {k:'blight',s:1,d:0},{k:'blight',s:-1,d:.5},{k:'hound',s:1,d:1.4},{k:'ashen',s:-1,d:2.3}
   ]},
  {t:'interact',goal:'Activate the Dawnroot focus',name:'WARD FOCUS',flag:'m10focus',lines:[L('Magister Ione','Now! The ward is awake. Hold it while I bind the runes.')]},
  {t:'defend',goal:'Protect Ione\'s ward from the blight',target:'Chapel Ward',hp:160,list:[
    {k:'blight',s:1,d:0},{k:'blight',s:-1,d:.55},{k:'ashen',s:1,d:1.2},{k:'blight',s:-1,d:1.8},{k:'hound',s:1,d:2.8}
   ],outro:[L('Magister Ione','It holds! Go to the keep. I will shepherd the wounded through the crypts.')]}
 ]},
 {id:'keep',title:'The Inner Keep',reg:'keep',steps:[
  {t:'say',lines:()=>G.flags.brannochAlly?[L('Brannoch','Ser Corin! I kept the stair open. Now we hold it *together*.')]:G.flags.brannochFoe?[L('Brannoch','You are late, orphan. I have no intention of dying for your *pride*.')]:[N('In the inner keep, the last defenders gather behind the fallen banners.')]},
  {t:'wave',goal:'Fight through the elite assault',list:[
    {k:'ashen',s:1,d:0},{k:'ashen',s:-1,d:.7},{k:'archer',s:1,d:1.4},{k:'bandit',s:-1,d:2.1}
   ]},
  {t:'say',lines:()=>G.flags.sorrelSpared?[N('Captain Sorrel stands beyond the broken gate. Recognizing Corin, he withdraws his men without a word.')]:G.flags.sorrelDead?[N('Without Sorrel, the Regency line falters. The Ashen Hand presses on.')]:[N('Lord Garran Vale storms into the keep, armored in the Regent\'s colors.')]},
  {t:'wave',goal:'Defeat Lord Garran Vale',list:[
    {k:'bandit',s:1,d:0,boss:1,name:'Lord Garran Vale',hpm:7,dmgm:1.4,sp:{col:'#5a2a8a',metal:'#c0c8d8',trim:'#e8b84a',look:2,helm:'#c0c8d8',crest:'plume',crestC:'#5a2a8a',cape:'#2a1040',iris:'#3a2a5a',nosh:1,w:0}},
    {k:'ashen',s:-1,d:2.5},{k:'archer',s:1,d:4}
   ],outro:[N('Garran falls. An arrow arcs down from the ramparts.'),L('Lysa','*Halvard*!'),N('A shaft strikes Halvard\'s shoulder. He drops to one knee.'),L('Ser Halvard','The cellar passage. Go, boy! The *castle* is lost.')]}
 ]},
 {id:'cellar',title:'The Cellar Passage',reg:'cave',steps:[
  {t:'say',lines:[N('Smoke follows Corin into the tunnels below Hearthmoor.'),L('Lysa','The eastern tunnel is blocked. We need to open the old escape shaft.'),L('Ser Halvard','Quickly. They are behind us.')]},
  {t:'interact',goal:'Open the ancient cellar lock',name:'CELLAR LOCK',flag:'m10cellarOpen',lines:[N('A rusted lever gives way. Cold air pours from the forgotten passage.') ]},
  {t:'wave',goal:'Drive off the pursuing enemies',list:[
    {k:'ashen',s:-1,d:0},{k:'blight',s:1,d:.8},{k:'hound',s:1,d:1.8},{k:'ashen',s:-1,d:2.5}
   ]},
  {t:'chest',boost:2.2,out:.35,goal:'Gather provisions for the road',lines:[L('Lysa','Take what we can carry. The wounded will need it.')]},
  {t:'say',flag:'m10escaped',goal:'Escape the fallen castle',lines:[N('Behind them, the banners of Hearthmoor vanish in the flames.'),L('Corin','The castle may have fallen. But we are not *finished*.'),N('Beyond the passage waits the Greenmarch and the long night.')]}
 ]}
 ]},
{id:'m11',type:'main',act:1,title:'The Long Night',reg:'night',lvl:8,req:'m10',endLoc:'green',desc:'Through the cellar road and across the Greenmarch, with the Regency on their heels.',steps:[
 {t:'say',lines:[N('Through the cellar road and out into the smoking dark. Behind them, Hearthmoor burns.'),L('Lysa','He is losing blood. We cannot outrun them like this.'),L('Ser Halvard','Leave me... I will hold them at the *bridge*.')]},
 {t:'choice',prompt:'Halvard can barely stand.',opts:[
  {label:'Carry him',desc:'No one is left behind.',c:10,cl:'Loyalty',flag:'halvardCarried',lines:[L('Ser Halvard','...Stubborn. Just like your... *just like you*.')]},
  {label:'Let him hold the bridge',desc:'His choice. His sacrifice.',c:-8,cl:'Sacrifice',flag:'halvardStands',lines:[L('Ser Halvard','Tell Ione... tell her it was *worth* it.')]},
  {label:'Bind his wound and move on',desc:'Fast and careful. Risky.',c:2,cl:'Prudence',flag:'halvardBound',lines:[L('Magister Ione','That will hold. For *now*.')]}]},
 {t:'wave',list:[{k:'hound',s:1,d:0},{k:'ashen',s:-1,d:.8},{k:'ashen',s:1,d:1.6},{k:'ashen',s:-1,d:2.4}],outro:[N('The pursuit thins. Not gone. Only *waiting*.')]},
 {t:'say',npc:{k:'ione',face:-1},lines:[L('Magister Ione','There you are. Quickly. I have wards on the old causeway. They will not hold long.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.4},{k:'blight',s:1,d:.8},{k:'blight',s:-1,d:1.2},{k:'blight',s:1,d:1.6},{k:'hound',s:-1,d:3,boss:1,name:'Blightwolf Alpha'}]},
 {t:'chest',boost:2.2,out:.3},
 {t:'say',lines:()=>G.flags.halvardStands?[N('Behind them, a distant clash of steel. Then silence. Lysa weeps without a sound.')]:[N('Dawn finds them on the Greenmarch road. Halvard sleeps beside the fire, breathing thinly, but breathing.')]}
]},
{id:'m12',type:'main',act:1,title:'The Southern Road',reg:'road',lvl:9,req:'m11',loc:'green',endLoc:'road',desc:'Act I finale. The road south leads to the truth, and the Ashen Hand is already waiting.',steps:[
 {t:'say',lines:()=>G.flags.halvardStands?[N('Dawn on the Southern Road. Three travelers, one fewer than set out.'),L('Magister Ione','He asked me to tell you something, Ser Corin. Not yet. *Not yet*.')]:[N('Dawn on the Southern Road. Halvard walks with a crutch of broken spear-shaft.'),L('Ser Halvard','Corin... there is something I should have told you. About the *fire*. About the night you came to Hearthmoor.'),L('Corin','Tell me.'),L('Ser Halvard','...Not yet. When we are *safe*.')]},
 {t:'wave',list:[{k:'ashen',s:1,d:0},{k:'ashen',s:-1,d:.5},{k:'ashen',s:1,d:1},{k:'ashen',s:-1,d:1.5}]},
 {t:'say',npc:{k:'veska',face:-1},lines:[L('Veska','Such a long way to run, little knight. And all for a *trinket*.'),L('Lysa','Corin, behind me!')]},
 {t:'wave',list:[{k:'ashen',s:1,d:0,boss:1,name:'Veska, Mistress of Knives',hpm:7,dmgm:1.3,sp:{col:'#3a2030',metal:'#4a3844',trim:'#c0402a',hair:'#d8d0e0',crest:'hood',mask:1,leg:'#2a1a24',look:0,w:4}},{k:'ashen',s:-1,d:2},{k:'ashen',s:1,d:3.5},{k:'ashen',s:-1,d:5}],outro:[N('Veska staggers, then vanishes into the smoke of a thrown vial.'),L('Veska','Prince *Corwen*. Lord Vane sends his regards. And his *patience* ends.'),L('Corin','What did she call me?'),L('Lysa','Corin...'),L('Magister Ione','Not here. Not yet.')]},
 {t:'chest',boost:2.5,out:.4},
 {t:'say',flag:'act1done',lines:[N('Act One ends. The road south leads to the refugee camps, and to the truth.'),N('*You* already know it.')]}
]},
{id:'d1',type:'dungeon',act:1,title:'Thornwood Hollow',reg:'forest',lvl:3,after:'m2',desc:'Poachers, wolves and an old hollow oak. Hidden chests lie deep in the roots.',steps:[
 {t:'say',lines:[N('Thornwood. Roots as thick as walls, and something has been digging here.'),L('Lysa','Poachers... or worse.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.8},{k:'bandit',s:1,d:1.6}]},
 {t:'chest',boost:.3,out:.4},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.5},{k:'blight',s:1,d:1},{k:'blight',s:-1,d:1.5}]},
 {t:'wave',list:[{k:'hound',s:1,d:0,boss:1,name:'Thornback Alpha',hpm:1.2},{k:'blight',s:-1,d:2}],outro:[N('The alpha collapses. Behind its den, a mossy chest glints.')]},
 {t:'chest',boost:1.2,out:1}
]},
{id:'d2',type:'dungeon',act:1,title:'Hollowdeep Caves',reg:'cave',lvl:4,after:'m4',desc:'Smugglers\' tunnels beneath the Veilfen, glowing with strange crystal and worse things.',steps:[
 {t:'say',lines:[N('The caves breathe cold. Pale crystals pulse like slow hearts.'),L('Lysa','Something is wrong with the light.')]},
 {t:'wave',list:[{k:'blight',s:1,d:0},{k:'blight',s:-1,d:.5},{k:'blight',s:1,d:1},{k:'blight',s:-1,d:1.5},{k:'blight',s:1,d:2}]},
 {t:'chest',boost:.5,out:.4},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'archer',s:-1,d:.7},{k:'archer',s:1,d:1.4},{k:'bandit',s:-1,d:2.1}]},
 {t:'chest',boost:.8,out:.4},
 {t:'wave',list:[{k:'hound',s:1,d:0,boss:1,name:'Hollowdeep Devourer',hpm:1.5},{k:'blight',s:-1,d:1.5},{k:'blight',s:1,d:3}]},
 {t:'chest',boost:1.5,out:1}
]},
{id:'d3',type:'dungeon',act:1,title:'Greywatch Mine',reg:'mine',lvl:5,after:'m5',desc:'An abandoned silver mine overrun by Reavers. The ore carts still carry something worth stealing.',steps:[
 {t:'say',lines:[N('Greywatch Mine. Lanterns swing on rusted hooks. Rails lead into the dark.'),L('Lysa','Reavers. They kicked the miners out.')]},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.6},{k:'archer',s:1,d:1.2},{k:'bandit',s:-1,d:1.8}]},
 {t:'chest',boost:.6,out:.4},
 {t:'wave',list:[{k:'bandit',s:1,d:0},{k:'bandit',s:-1,d:.6},{k:'archer',s:1,d:1.2},{k:'archer',s:-1,d:1.8},{k:'bandit',s:1,d:2.6}]},
 {t:'chest',boost:.9,out:.4},
 {t:'wave',list:[{k:'bandit',s:1,d:0,boss:1,name:'Foreman Brask',hpm:6,dmgm:1.3,sp:{col:'#6a4a2a',metal:'#8a8a92',trim:'#e8802a',look:2,helm:'#8a8a92',crest:'horns',cape:'#3a2a22',iris:'#4a2a1a',scar:1,nosh:1,w:0}},{k:'archer',s:-1,d:2.5}]},
 {t:'chest',boost:1.6,out:1}
]},
{id:'d4',type:'dungeon',act:1,title:'Ashfall Keep',reg:'keep',lvl:7,after:'m8',desc:'A burned-out keep, now an outpost of the Ashen Hand. Its vaults were never emptied.',steps:[
 {t:'say',lines:[N('Ashfall Keep. Torches still burn in a hall no one has lived in for years.'),L('Magister Ione','The Ashen Hand keeps its treasures where its victims cannot find them.')]},
 {t:'wave',list:[{k:'ashen',s:1,d:0},{k:'ashen',s:-1,d:.6},{k:'ashen',s:1,d:1.2}]},
 {t:'chest',boost:.9,out:.45},
 {t:'wave',list:[{k:'ashen',s:1,d:0},{k:'bandit',s:-1,d:.5},{k:'archer',s:1,d:1},{k:'ashen',s:-1,d:1.6},{k:'bandit',s:1,d:2.2}]},
 {t:'chest',boost:1.2,out:.45},
 {t:'wave',list:[{k:'bandit',s:1,d:0,boss:1,name:'Warden Grell',hpm:7,dmgm:1.4,sp:{col:'#4a3a5a',metal:'#c0c8d8',trim:'#c0402a',look:2,helm:'#a0a8b8',crest:'plume',crestC:'#c0402a',cape:'#2a1a30',iris:'#6a2a3a',scar:1,nosh:1,w:0}},{k:'ashen',s:-1,d:2},{k:'ashen',s:1,d:3.5}]},
 {t:'chest',boost:2,out:1}
]}
];
const STUBS=[
 [2,'Ashes and Oaths'],[2,'The Name in the Fire'],[2,'Road to Ironvale'],[2,'The Hammerguild Vote'],[2,'Forge of Embers'],[2,'Into the Veilfen'],[2,'What the Marshkin Remember'],[2,'The Drowned Court'],
 [2,'Quill & Flame'],[2,'Library of Dawn and Dusk'],[2,'Sable\'s Price'],[2,'A Knight\'s Mercy'],[2,'The Blighted Spire'],[2,'Midnight Council'],[2,'The Regent\'s Offer'],[2,'The March Begins'],
 [3,'Gates of Aurelith'],[3,'The Siege'],[3,'Streets of Gold and Ash'],[3,'The Ashen Hand\'s Last Knife'],[3,'The Throne Room Duel'],[3,'The Crown Answers'],[3,'First Decree'],[3,'The Hungry Winter'],
 [3,'The Faction Reckoning'],[3,'The Ghost of Roderan'],[3,'Dawnroot Heart'],[3,'The Last Blight'],[3,'The Final Decree'],[3,'The Kingdom Remembers']
];
const LOC={m0:'hearth',m1:'hearth',m2:'green',m3:'green',m4:'fen',m5:'hearth',m6:'hearth',m7:'hearth',m8:'hearth',m9:'hearth',m10:'hearth',m11:'hearth',m12:'green',s1:'hearth',s2:'green',s3:'green',s4:'fen',s5:'hearth',d1:'thorn',d2:'cave',d3:'mine',d4:'keep'};
MISSIONS.forEach(m=>{if(!m.loc)m.loc=LOC[m.id];});
const MBY=Object.fromEntries(MISSIONS.map(m=>[m.id,m]));
// Hidden preview mission (not on the world map): mounted jousting using the shared engine.
MBY.joustlab={id:'joustlab',type:'lab',act:0,title:'Joust Lab',reg:'hearth',lvl:1,desc:'Preview of mounted jousting.',areas:[
 {id:'lab',title:'Joust Lab: The Lists',reg:'hearth',explore:{length:1030,scenery:'lists',seed:18,platforms:[],
  objects:[{kind:'joust',role:'rider',label:'RIDE THE LISTS',x:527,y:0},{kind:'exit',label:'LEAVE LAB',x:956,y:0}]},
  steps:[{t:'explore',goal:'Walk to the marker and ride three passes',intro:[N('Preview: Corin rides his own horse. Lower your lance as the foe lowers his.')]}]}]};
