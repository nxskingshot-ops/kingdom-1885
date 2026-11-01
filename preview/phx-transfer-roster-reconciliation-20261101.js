// Read-only leaderboard reconciliation; never replace a full roster with a Top-100 subset.
export function normalizeAlliance(value){return String(value??'').trim().toUpperCase();}
export function reconcileRankings(historical=[],current=[]){
 const old=new Map(historical.filter(p=>p.player_id!=null).map(p=>[String(p.player_id),p]));
 const matched=[],newRanked=[],changedAlliance=[],invalid=[];
 for(const entry of current){
  const id=entry.governor_id??entry.uid;
  const score=Number(entry.score);
  if(id==null||!Number.isFinite(score)||score<0){invalid.push(entry);continue;}
  const previous=old.get(String(id));
  const row={playerId:String(id),power:score,alliance:normalizeAlliance(entry.alliance_abbr),rank:Number(entry.rank)||null,previousPower:previous?Number(previous.power):null};
  if(!previous)newRanked.push(row);
  else if(normalizeAlliance(previous.alliance)!==row.alliance)changedAlliance.push(row);
  else matched.push(row);
 }
 return {matched,newRanked,changedAlliance,invalidCount:invalid.length,rankedCount:current.length,historicalCount:historical.length,completeRoster:false,note:'Top-100 rankings are a partial source; absence does not imply departure.'};
}
