// Read-only partial leaderboard reconciliation. No database writes.
export function normalizeAlliance(value){return String(value??'').trim().toUpperCase();}
export function reconcileRankings(historical=[],current=[]){
 const previous=new Map(historical.filter(p=>p.player_id!=null&&String(p.player_id).trim()).map(p=>[String(p.player_id).trim(),p]));
 const matched=[],newRanked=[],changedAlliance=[],unknownAlliance=[],invalid=[];
 const seen=new Set();
 for(const entry of current){
  const id=String(entry?.governor_id??entry?.uid??'').trim();
  const score=Number(entry?.score);
  if(!/^[1-9][0-9]*$/.test(id)||entry?.score==null||entry.score===''||!Number.isFinite(score)||score<0||seen.has(id)){invalid.push(entry);continue;}
  seen.add(id);
  const alliance=normalizeAlliance(entry.alliance_abbr);
  const old=previous.get(id);
  const row={playerId:id,power:score,alliance,rank:Number.isInteger(Number(entry.rank))&&Number(entry.rank)>0?Number(entry.rank):null,previousPower:old?.power==null?null:Number(old.power)};
  if(!alliance){unknownAlliance.push(row);continue;}
  if(!old){newRanked.push(row);continue;}
  const oldAlliance=normalizeAlliance(old.alliance);
  if(!oldAlliance){unknownAlliance.push(row);continue;}
  if(oldAlliance!==alliance)changedAlliance.push(row);
  else matched.push(row);
 }
 return {matched,newRanked,changedAlliance,unknownAlliance,invalidCount:invalid.length,rankedCount:current.length,historicalCount:historical.length,completeRoster:false,note:'Top-100 rankings are partial. Alliance changes are observations, not proof of transfers. Absence does not imply departure.'};
}
