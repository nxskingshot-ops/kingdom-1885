import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {adviseRecruitment} from '../../lab/pylon-ix-v3/recruitment-v31.mjs';
const fixture=JSON.parse(readFileSync(new URL('../fixtures/pylon-ix-v3-1913-20261004.json',import.meta.url)));
const player=name=>fixture.players.find(p=>p.player_name===name);
test('all benchmark accounts return safe advisory, not combat certification',()=>{
 assert.equal(fixture.players.length,10);
 for(const p of fixture.players){
  const a=adviseRecruitment(p,fixture);
  assert.equal(a.roleCandidates.length,3);
  assert.equal(a.verifiedCombatPerformance,false);
  assert.equal(a.verifiedTransferEligibility,false);
  assert.equal(a.dataFreshness,'HISTORICAL_NOT_LIVE');
  assert.equal(a.releaseStatus,'LAB_ONLY');
  assert(a.roleCandidates.every(r=>r.verifiedCombatRole===false));
 }
});
test('Achilles gets priority review, not automatic acceptance',()=>{
 const a=adviseRecruitment(player('Achilles'),fixture);
 assert.equal(a.decision,'PRIORITY_REVIEW');
 assert.match(a.recruitmentAdvice,/confirm alliance needs/);
});
test('Dovik receives conditional development review',()=>{
 assert.equal(adviseRecruitment(player('Dovik'),fixture).decision,'CONDITIONAL_REVIEW');
});
test('missing data never produces a recruitment recommendation',()=>{
 const a=adviseRecruitment({player_name:'Unknown'},fixture);
 assert.equal(a.decision,'NEEDS_MORE_DATA');
 assert.equal(a.alliancePlacement.status,'INSUFFICIENT_COMPARABLE_PEERS');
 assert(a.roleCandidates.every(r=>r.signal==='UNKNOWN'));
});
test('untrusted peers do not create a false alliance placement',()=>{
 const a=adviseRecruitment(player('Achilles'),{...fixture,alliance:{top15:[{},null,{ranking_evidence:{personal_power_rank:2}}]}});
 assert.equal(a.alliancePlacement.status,'INSUFFICIENT_COMPARABLE_PEERS');
});
test('invalid and missing ranks never become zeros',()=>{
 const a=adviseRecruitment({ranking_evidence:{personal_power_rank:0,troop_power_rank:'1'}},fixture);
 assert.equal(a.decision,'NEEDS_MORE_DATA');
 assert(a.roleCandidates.every(r=>r.evidence.length===0));
});
