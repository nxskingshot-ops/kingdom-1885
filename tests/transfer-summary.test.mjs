import {test} from 'node:test';
import assert from 'node:assert/strict';
import {playerSummaryMetrics,formatCastle} from '../preview/transfer-id-display-20261030.js';
import {candidateFromLookup} from '../preview/transfer-id-candidate-20261030.js';
const capture='2026-10-31T01:11:17Z';
const board=(name,value,captured_at=capture)=>({name,value,captured_at,kingdom_rank:5});
test('six priority metrics use latest power, actual castle and synchronized non-troop calculation',()=>{
 const rows=playerSummaryMetrics({power:411282754,player_captured_at:'2026-10-31T10:45:29Z',leaderboards:[board('personal_power',410000000),board('troop_power',257541380),board('town_center',55),board('master_power',21339960),board('pet_power',13422120),board('hero_total',48376679),board('kills',57669353)]});
 assert.deepEqual(rows.map(x=>x.key),['power','true_power','master_power','pet_power','hero_total','castle']);
 assert.equal(rows[0].value,411282754);assert.equal(rows[1].value,152458620);assert.match(rows[1].details,/410,000,000 minus 257,541,380.*01:11:17 UTC/);assert.equal(rows[2].value,21339960);assert.equal(rows[3].value,13422120);assert.equal(rows[4].value,48376679);assert.equal(rows[5].text,'TG5 5/5');assert.match(rows[5].details,/55/);
});
test('True Power stays unknown for missing, mismatched, or contradictory measurements; actual zero is retained',()=>{
 for(const leaderboards of [[board('personal_power',100),board('troop_power',50,'2026-10-31T02:00:00Z')],[board('personal_power',100),board('troop_power',101)],[board('personal_power',100,null),board('troop_power',50,null)],[board('personal_power',100),board('troop_power',null)]])assert.equal(playerSummaryMetrics({leaderboards})[1].value,null);
 assert.equal(playerSummaryMetrics({leaderboards:[board('personal_power',100),board('troop_power',100)]})[1].value,0);
});
test('castle mapping is bounded and preserves raw source outside verified Truegold range',()=>{
 for(const [raw,display] of [[40,'TG3 0/5'],[45,'TG4 0/5'],[50,'TG5 0/5'],[55,'TG5 5/5'],[30,'TC 30'],[39,'TC 39'],[56,'TC 56']])assert.equal(formatCastle(raw),display);
 for(const unknown of [null,undefined,'',0,-1])assert.equal(formatCastle(unknown),'Not available');
});
test('explicit adoption includes verified castle and preserves snapshot provenance and raw TC',()=>{
 const payload={ok:true,governorId:'123',uid:'u1',player:{name:'Synthetic',kingdom:1885,power:1000},ranks:{values:{leaderboards:[{...board('town_center',55),source:'saved_snapshot'}],boards:[{name:'town_center',source:'saved_snapshot',captured_at:capture,status:'listed'}]}}};
 const candidate=candidateFromLookup(payload,'123');assert.equal(candidate.castle_level,'TG5 5/5');assert.equal(candidate.metadata.external_lookup.ranks.values.leaderboards[0].value,'55');assert.equal(candidate.metadata.external_lookup.ranks.values.leaderboards[0].source,'saved_snapshot');assert.equal(candidate.metadata.external_lookup.ranks.values.boards[0].source,'saved_snapshot');
});
