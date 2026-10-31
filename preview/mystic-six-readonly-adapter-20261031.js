// PHALANX Mystic Trials: read-only adapter for authenticated preview data.
// The existing six-board probe resolves only KomaR; other IDs must not be inferred.
export const BOARDS = ["coliseum","forest_of_life","crystal_cave","knowledge_nexus","molten_fort","radiant_spire"];
export function parseMysticSix(payload,governorId){
  if(String(governorId)!=="290591005") throw Error("Probe supports only verified KomaR ID");
  if(payload?.ok!==true||payload.kingdom!==1885||!Array.isArray(payload.results)) throw Error("Invalid response");
  const result={};
  for(const board of BOARDS){
    const rows=payload.results.filter(x=>x.board===board);
    if(rows.length!==1||rows[0].http!==200||rows[0].recognized!==true||rows[0].count!==100)throw Error("Board not verified: "+board);
    const p=rows[0].komar;
    if(p===null){result[board]={status:"outside_returned_top_100",rank:null,score:null};continue;}
    if(!Number.isInteger(p?.rank)||p.rank<1||p.rank>100||typeof p.score!=="number"||!Number.isFinite(p.score)||p.score<0)throw Error("Invalid rank or score");
    result[board]={status:"ranked",rank:p.rank,score:p.score};
  }
  return result;
}
