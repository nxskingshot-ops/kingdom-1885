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
