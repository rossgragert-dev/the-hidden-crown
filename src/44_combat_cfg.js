/* ================= COMBAT TUNING (v0.8.0) =================
   Every number that shapes combat feel lives here so it can be tuned in one place. Times are seconds, distances px. */
const COMBAT_CFG={
  // Sword: a three-stage combo by timing alone. Press ATK again as the swing ends (inside comboWindow) to chain.
  // Pressing inside the first `perfect` seconds after the cooldown opens adds a timing bonus.
  sword:[
    {cd:.30,act:.20,mul:1.00,reach:34,kb:80, stop:.045,shake:0,  snd:[210,.07,'sawtooth'],arc:.9},
    {cd:.30,act:.20,mul:1.15,reach:36,kb:95, stop:.050,shake:0,  snd:[260,.07,'sawtooth'],arc:-.9},
    {cd:.56,act:.28,mul:1.75,reach:42,kb:190,stop:.095,shake:.14,snd:[140,.13,'square'],  arc:1.3,heavy:1}
  ],
  comboWindow:.30, perfect:.10, perfectMul:1.15,
  // Weapon identities. Sword = fast/short/combos; staff = slow, piercing magic, costs mana; bow = long reach, slow, light impact.
  staff:{cd:.62,act:.26,kb:25},
  bow:{cd:.52,act:.18,kb:40},
  // Dodge roll: a short burst with limited invulnerability and a recovery where the hero is open.
  roll:{dist:64,time:.26,iframes:.20,recover:.16,cd:.80},
  // Timed guard: pressing GUARD just before a hit deflects it and opens the attacker to a counter.
  parry:{window:.20,stagger:1.0,counterMul:1.8,counterTime:.9,guardRefund:25},
  // Platforming feel
  coyote:.10,jumpBuffer:.12,jumpCut:.5,jumpCutV:-230,landSquash:.12,
  // Hit stop: world time scale while frozen
  hitStopScale:.04,
  // Archetypes
  shield:{frontMul:.2,breakStun:1.2,recover:.7},
  torch:{fireTime:2.4,radius:13,tick:.55,dmgMul:.5,throwMin:70,throwMax:135,windT:.55},
  spear:{windT:.55,keepAway:22},
  hound:{windT:.38,dashSpeed:300,dashTime:.3,recover:.9},
  // Defeat: encounter resets, rewards earned inside it are forfeited, nothing permanent is lost.
  defeat:{keepLevelUps:true}
};
