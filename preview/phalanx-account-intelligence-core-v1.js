// PHALANX Account Intelligence CORE V1 — pure, read-only, no network or storage.
// Consumed by Transfer Scouting and (only after authorization) PYLON IX.
export const MYSTIC_BOARDS=Object.freeze(["coliseum","forest_of_life","crystal_cave","knowledge_nexus","molten_fort","radiant_spire"]);
export function analyzeMysticProfile(payload, governorId) {
 if(payload?.ok!==true||payload.kingdom!==1885||!Array.isArray(payload.results))throw Error("Unverified Mystic response");
 const id=String(governorId);
 if(!/^\d{1,20}$/.test(id)||String(payload.governor_id)!==id)throw Error("Governor ID mismatch");
 const boards={};let known=0;const ranks=[];const timestamps=[];
 for(const name of MYSTIC_BOARDS){
  const hits=payload.results.filter(r=>r.board===name);
  if(hits.length!==1)throw Error("Missing or duplicate board: "+name);
  const r=hits[0];
  if(r.http!==200||r.recognized!==true||r.count!==100)throw Error("Unverified board: "+name);
  const p=r.player;
  if(p===null){boards[name]={status:"outside_returned_top_100",rank:null,score:null};continue;}
  if(!Number.isInteger(p?.rank)||p.rank<1||p.rank>100||typeof p.score!=="number"||!Number.isFinite(p.score)||p.score<0)throw Error("Invalid player score: "+name);
  boards[name]={status:"ranked",rank:p.rank,score:p.score};
  ranks.push(p.rank);known++;
  if(Number.isFinite(r.captured_at))timestamps.push(r.captured_at);
 }
 const mean=known===6?ranks.reduce((a,b)=>a+b,0)/6:null;
 const spread=known===6?Math.max(...ranks)-Math.min(...ranks):null;
 return {governorId:id,boards,knownBoards:known,complete:known===6,meanRank:mean,rankSpread:spread,sourceCapturedAtRange:timestamps.length?[Math.min(...timestamps),Math.max(...timestamps)]:null,meaning:"Ranks are comparative placements, not a verified formula for Mystic total score or combat power."};
}
export function compareMysticProfiles(a,b){
 if(!a?.governorId||!b?.governorId)throw Error("Two validated profiles required");
 return {left:a.governorId,right:b.governorId,boards:Object.fromEntries(MYSTIC_BOARDS.map(k=>[k,{left:a.boards[k]?.rank??null,right:b.boards[k]?.rank??null,delta:a.boards[k]?.rank!=null&&b.boards[k]?.rank!=null?a.boards[k].rank-b.boards[k].rank:null}])),warning:"Null means not returned in top 100; it is not zero."};
}
