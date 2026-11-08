// Isolated PYLON IX V3 laboratory logic. No imports, network, storage, or UI mutations.
// Ranks are kingdom positions from one historical snapshot, not absolute combat scores.
const FIELDS = Object.freeze({
  troop_power_rank:'Troop Power',governor_gear_rank:'Governor Gear',
  governor_charm_rank:'Governor Charms',hero_no_equip_rank:'Hero without Equipment',
  hero_equip_rank:'Hero Equipment',pet_power_rank:'Pet Power',
  research_rank:'Research Power',mystic_rank:'Mystic Trial'
});
const CORE = ['governor_gear_rank','governor_charm_rank','hero_no_equip_rank','hero_equip_rank','pet_power_rank','research_rank','mystic_rank'];
const valid = v => Number.isSafeInteger(v) && v > 0;
const median = a => {const s=[...a].sort((x,y)=>x-y);return s.length?(s[Math.floor((s.length-1)/2)]+s[Math.floor(s.length/2)])/2:null;};
export function assessHistoricalProfile(player={}, context={}) {
  const evidence=Object.entries(FIELDS).flatMap(([key,label])=>valid(player.ranking_evidence?.[key])?[{key,label,rank:player.ranking_evidence[key]}]:[]);
  const byKey=Object.fromEntries(evidence.map(e=>[e.key,e]));
  const permanent=CORE.map(k=>byKey[k]).filter(Boolean);
  const troop=byKey.troop_power_rank;
  const strong=permanent.filter(e=>e.rank<=10);
  const lag=permanent.filter(e=>e.rank>15);
  const coverage=permanent.length;
  const allStrong=coverage>=6 && strong.length>=6;
  const gaps=coverage>=4 && lag.length>=2;
  const troopForward=!!troop && troop.rank<=7 && (gaps || coverage<4);
  const underestimated=coverage>=5 && strong.length>=4 && valid(player.ranking_evidence?.personal_power_rank)
    && player.ranking_evidence.personal_power_rank>=8;
  let profile='Insufficient evidence';
  if(coverage>=5 && allStrong) profile='Broad elite development';
  else if(coverage>=5 && underestimated) profile='Underestimated permanent-development strength';
  else if(troopForward) profile='Troop-forward, uneven development';
  else if(coverage>=5 && strong.length>=4) profile='Strong permanent-development profile';
  else if(coverage>=4 && gaps) profile='Uneven development';
  else if(coverage>=4) profile='Mixed documented development';
  const focus=permanent.length ? [...permanent].sort((a,b)=>a.rank-b.rank).slice(0,3) : [];
  const development=[...lag].sort((a,b)=>b.rank-a.rank).slice(0,3);
  const missing=Object.entries(FIELDS).filter(([key])=>!byKey[key]).map(([,label])=>label);
  const roleSignals=[
    {role:'Rally Leader',keys:['hero_equip_rank','governor_gear_rank','governor_charm_rank'],missing:'Lead buffs, rally capacity and battle reports'},
    {role:'Rally Joiner',keys:['troop_power_rank','research_rank'],missing:'March size, troop tiers and joiner hero buffs'},
    {role:'Garrison Holder',keys:['governor_gear_rank','governor_charm_rank','troop_power_rank'],missing:'Defense reports, garrison buffs and formation'}
  ].map(r=>({role:r.role,indicators:r.keys.map(k=>byKey[k]).filter(e=>e&&e.rank<=10).map(e=>e.label+' #'+e.rank),
    status:'REVIEW_ONLY',requiredEvidence:r.missing}));
  return {
    player:player.player_name??'Unknown',snapshotDate:context.snapshot_date??null,
    sourceType:context.type??'UNKNOWN',profile,confidence:coverage>=6?'RANKING_SUPPORTED':coverage>=4?'PARTIAL':'INSUFFICIENT',
    permanentMedianRank:median(permanent.map(e=>e.rank)),coverage:{known:coverage,expected:CORE.length},
    strengths:focus,development,missing,underestimated,roleSignals,
    roleVerdict:'No combat role verified: ranking evidence is not battle performance',
    limitations:['Historical snapshot, not live','Ranks are relative to the sampled kingdom','Missing ranks are unknown, not zero']
  };
}
