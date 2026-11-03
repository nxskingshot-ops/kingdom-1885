export const PLAYER_BOARDS = Object.freeze(['personal_power','kills','town_center','rebel_conquest','single_hero','hero_total','troop_power','building_power','research_power','hero_no_equip','hero_equip','gov_gear','gov_charm','pet_power','island_prosperity','migrant_score','mystic_trial','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire','master_power']);
export const ALLIANCE_BOARDS = Object.freeze(['alliance_power','alliance_kills']);
export const BOARDS = Object.freeze([...PLAYER_BOARDS,...ALLIANCE_BOARDS]);
export function validateBoard(board, payload, kingdom=1885) {
 if(!BOARDS.includes(board)) return {status:'UNSUPPORTED',reason:'unknown_board'};
 if(!payload || !Array.isArray(payload.rows)) return {status:'ERROR',reason:'missing_rows'};
 const rows=payload.rows;
 if(rows.length!==100) return {status:'INCOMPLETE',reason:'expected_100_rows',count:rows.length};
 const alliance=ALLIANCE_BOARDS.includes(board);
 const ids=new Set(), ranks=new Set();let previous=Infinity;
 for(const row of rows){
  if(!row || row.kid!==kingdom) return {status:'ERROR',reason:'kingdom_mismatch'};
  const id=alliance?row.aid:row.uid;
  if(id===null||id===undefined||String(id)==='')return {status:'ERROR',reason:'missing_identity'};
  if(!alliance && board!=='kills' && (row.governor_id===null||row.governor_id===undefined))return {status:'ERROR',reason:'missing_governor_id'};
  if(ids.has(String(id)))return {status:'ERROR',reason:'duplicate_identity'};
  ids.add(String(id));
  if(!Number.isInteger(row.rank)||row.rank<1||row.rank>100||ranks.has(row.rank))return {status:'ERROR',reason:'invalid_rank'};
  ranks.add(row.rank);
  if(typeof row.score!=='number'||!Number.isFinite(row.score)||row.score>previous)return {status:'ERROR',reason:'invalid_score_order'};
  previous=row.score;
 }
 const captured=payload.captured_at;
 if(typeof captured!=='number'||!Number.isFinite(captured)||captured<=0)return {status:'ERROR',reason:'missing_capture_time'};
 return {status:'VERIFIED',count:100,capturedAt:new Date(captured*1000).toISOString(),kind:alliance?'alliance':'player'};
}
export function summarize(results){
 const statuses=Object.fromEntries(BOARDS.map(board=>[board,results[board]?.status||'ERROR']));
 const verified=Object.values(statuses).filter(s=>s==='VERIFIED').length;
 return {total:BOARDS.length,verified,statuses,complete:verified===BOARDS.length};
}
