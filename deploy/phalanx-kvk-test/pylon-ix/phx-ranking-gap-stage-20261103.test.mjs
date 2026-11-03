import test from 'node:test';
import assert from 'node:assert/strict';
import { BOARDS } from './phx-ranking-ingestion-core-stage-20261103.mjs';
import { auditCoverage } from './phx-ranking-coverage-audit-stage-20261103.mjs';

const LIVE_POLLER_V7 = Object.freeze(['personal_power','alliance_power','alliance_kills','kills','town_center','hero_total','troop_power','building_power','research_power','hero_no_equip','hero_equip','gov_gear','gov_charm','pet_power','mystic_trial','master_power']);
const EXPECTED_MISSING = Object.freeze(['rebel_conquest','single_hero','island_prosperity','migrant_score','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire']);
function payload(board) {
 const alliance=board.startsWith('alliance_');
 return {key:board,captured_at:1793682000,rows:Array.from({length:100},(_,i)=>({
   kid:1885,rank:i+1,uid:alliance?undefined:i+1,aid:alliance?i+1:undefined,
   governor_id:alliance||board==='kills'?undefined:i+1,score:100-i
 }))};
}
test('poller-v7 gap is exactly ten named categories',()=>{
 assert.equal(BOARDS.length,26);
 assert.equal(LIVE_POLLER_V7.length,16);
 assert.deepEqual(BOARDS.filter(b=>!LIVE_POLLER_V7.includes(b)),EXPECTED_MISSING);
});
test('ten missing categories are individually eligible for read-only verification',async()=>{
 const requested=[];
 const result=await auditCoverage({apiKey:'fixture-only',boards:[...EXPECTED_MISSING],
 fetchImpl:async(url)=>{const board=new URL(url).searchParams.get('board');requested.push(board);return {ok:true,json:async()=>({boards:[payload(board)]})};}});
 assert.deepEqual(new Set(requested),new Set(EXPECTED_MISSING));
 assert.equal(result.total,10);assert.equal(result.verified,10);
 assert.equal(result.writesPerformed,false);
});
test('upstream 503 does not create a verified ranking',async()=>{
 const result=await auditCoverage({apiKey:'fixture-only',boards:['rebel_conquest'],
 fetchImpl:async()=>({ok:false,status:503})});
 assert.equal(result.verified,0);assert.equal(result.details[0].status,'ERROR');
 assert.equal(result.details[0].reason,'upstream_http_503');
});
