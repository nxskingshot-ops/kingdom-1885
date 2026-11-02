// Read-only, evidence-gated assessment; never extrapolate combat roles.
export function assessAccount(player={}, ranks={}){
 const keys=[['Hero Power','heroPower','hero_power'],['Pet Power','petPower','pet_power'],['Master Power','masterPower','master_power'],['True Power','truePower','true_power']];
 const available=keys.map(([label,a,b])=>({label,raw:player[a]??player[b]})).filter(x=>x.raw!=null&&x.raw!==''&&Number.isFinite(Number(x.raw))&&Number(x.raw)>=0);
 const rankEvidence=Object.entries(ranks||{}).filter(([,v])=>v&&Number.isInteger(Number(v.kingdom_rank))&&Number(v.kingdom_rank)>0).map(([key,v])=>({key,rank:Number(v.kingdom_rank),source:v.source||'Provider data',capturedAt:v.captured_at||null}));
 const top15=rankEvidence.filter(x=>x.rank<=15);
 const best=[...rankEvidence].sort((a,b)=>a.rank-b.rank)[0];
 const evidence=best?'Best available kingdom leaderboard: '+best.key.replaceAll('_',' ')+' #'+best.rank+'.':'No verified kingdom ranking available.';
 return {
  status:rankEvidence.length?'PARTIAL_RANKING_EVIDENCE':available.length>=2?'PARTIAL':'INSUFFICIENT_DATA',
  headline:rankEvidence.length?'Account overview · leaderboard evidence':available.length>=2?'Account overview · preliminary':'Account overview · awaiting data',
  detail:evidence+' '+(top15.length?'Top-15 in '+top15.length+' available kingdom leaderboard(s); this is not an alliance Top-15 placement.':'No Top-15 placement confirmed in available leaderboards.')+' Combat roles and strengths require comparable alliance roster and battle evidence.',
  available:available.map(x=>x.label),
  battleRole:'Not verified',
  top15Placement:'Alliance Top-15 not verified',
  rankingEvidence:rankEvidence
 };
}


// KvK Intelligence-derived evidence model. Only compares like-for-like metrics.
// Missing inputs remain unknown; no combat role is certified from power alone.
export function classifyCombatProfile(player = {}, rankings = {}) {
 const groups = [
  ['Troops', ['troop_power_rank','troopPowerRank']],
  ['Hero equipment', ['hero_equip_rank','heroEquipRank']],
  ['Governor gear', ['governor_gear_rank','governorGearRank']],
  ['Governor charms', ['governor_charm_rank','governorCharmRank']],
  ['Pets', ['pet_power_rank','petPowerRank']],
  ['Research', ['research_rank','researchRank']],
  ['Mystic Trial', ['mystic_rank','mysticRank']],
  ['Kills', ['kills_rank','killsRank']]
 ];
 const lookup = (obj, keys) => keys.map(k=>obj?.[k]).find(v=>v!==undefined&&v!==null&&v!=='');
 const rows = groups.map(([label,keys])=>{
  const raw=lookup(player,keys);
  const fromRanks=rankings?.[label.toLowerCase().replaceAll(' ','_')];
  const rank=Number(raw??fromRanks?.kingdom_rank);
  return {label,rank:Number.isInteger(rank)&&rank>0?rank:null};
 }).filter(x=>x.rank!==null);
 const top10=rows.filter(x=>x.rank<=10).sort((a,b)=>a.rank-b.rank);
 const strengths=top10.map(x=>x.label+' #'+x.rank);
 const coverage=rows.length;
 let profile='Insufficient comparative evidence';
 if(coverage>=4&&top10.length>=3){
  const troop=rows.find(x=>x.label==='Troops');
  const equip=rows.find(x=>x.label==='Hero equipment');
  profile=troop?.rank<=5&&equip?.rank<=5?'Broad elite development':'Multiple documented ranking strengths';
 }else if(coverage>=2&&top10.length>=1)profile='Partially documented development';
 return {profile,coverage,documentedStrengths:strengths,
  openQuestions:groups.filter(([label])=>!rows.some(x=>x.label===label)).map(([label])=>label),
  roleAssessment:'Combat role not verified without battle reports, formation and comparable roster data',
  evidenceLevel:coverage>=4?'MULTI_RANKING':coverage?'PARTIAL':'INSUFFICIENT'};
}
