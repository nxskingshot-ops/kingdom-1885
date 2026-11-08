import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessAccount } from '../deploy/phalanx-kvk-test/pylon-ix/phx-transfer-account-assessment-20261101.js';
import { placeInAlliance, compareTopPeers } from '../deploy/phalanx-kvk-test/pylon-ix/phx-transfer-alliance-placement-20261101.js';
import { playerRankingMap, playerSummaryMetrics } from '../deploy/phalanx-kvk-test/pylon-ix/transfer-id-display-20261030.js';

const date = '2026-10-13';
const capture = '2026-11-06T07:00:00Z';
const roster = Array.from({ length: 20 }, (_, index) => ({
 player_id: String(index + 1), power: 100_000_000 + index * 10_000_000
}));
const metadata = {
 members: roster.length,
 totalPower: roster.reduce((sum, row) => sum + row.power, 0)
};
const insert = (power, rows = roster, options = metadata, day = date) =>
 placeInAlliance(power, rows, day, options);

test('normalizes observed keys and summarizes the evidence without inferring missing ranks', () => {
 const ranks = playerRankingMap({leaderboards:[
  {name:'hero_equipment',kingdom_rank:'5',captured_at:capture},
  {name:'research_power',kingdom_rank:6,captured_at:capture},
  {name:'hero_total',kingdom_rank:8},
  {name:'master_power',kingdom_rank:44},
  {name:'pet_power',kingdom_rank:0},
  {name:'kills',kingdom_rank:2}
 ]});
 const result = assessAccount({}, ranks);
 assert.equal(result.level, 'Strong kingdom profile');
 assert.equal(result.profile, 'Specialized');
 assert.equal(result.median, 7);
 assert.equal(result.dated, 2);
 assert.equal(result.newest, '2026-11-06 · 07:00:00 UTC');
 assert.deepEqual(result.strengths.map(row => row.key), ['hero_equip','research_power','hero_total']);
 assert.deepEqual(result.development.map(row => row.rank), [44]);
 assert(result.missing.includes('Pet Power'));
 assert.equal(result.coverage, 4);
});

test('distinguishes balanced, partial and unavailable profiles', () => {
 const result = assessAccount({}, {hero_total:7, master_power:12, gov_gear:11, gov_charm:8});
 assert.equal(result.profile, 'Balanced');
 assert.equal(result.roles.find(role => role.label === 'Garrison Holder').review, true);
 assert.equal(assessAccount({}, {hero_total:1}).profile, 'Profile open');
 assert.equal(assessAccount({}, {hero_total:true,pet_power:0,gov_gear:'',troop_power:{kingdom_rank:null}}).coverage, 0);
});

test('labels all four KvK roles and their missing evidence', () => {
 const result = assessAccount({}, {troop_power:4, research_power:7, hero_total:8});
 assert.deepEqual(result.roles.map(role => [role.label,role.review]), [
  ['Rally Leader',false], ['Rally Joiner',true], ['Garrison Holder',false], ['KvK Fighter',true]
 ]);
 assert(result.roles.every(role => role.missing));
});

test('uses Total Power and keeps exactly the highest 15 from a complete roster', () => {
 const result = insert(234_630_000);
 assert.equal(result.status, 'COMPLETE_SNAPSHOT');
 assert.equal(result.rankMin, 7);
 assert.equal(result.rankMax, 7);
 assert.equal(result.top15Guaranteed, true);
 assert.equal(result.top15.length, 15);
 assert.equal(result.top15[0].power, 290_000_000);
 assert.equal(result.top15Gap, 84_630_000);
 assert.equal(result.gapAbove, 5_370_000);
 assert.equal(result.gapBelow, 4_630_000);
});

test('preserves a tie at the Top-15 boundary', () => {
 const result = insert(150_000_000);
 assert.equal(result.rankMin, 15);
 assert.equal(result.rankMax, 16);
 assert.equal(result.top15Guaranteed, false);
 assert.equal(result.top15Possible, true);
});

test('calculates positions outside Top 15 and excludes the candidate’s historical row', () => {
 const result = insert(110_000_000, roster, {...metadata,candidateIds:['20']});
 assert.equal(result.rankMin, 18);
 assert.equal(result.rankMax, 19);
 assert.equal(result.top15Possible, false);
 assert.equal(result.top15[0].player_id, '19');
 assert.equal(result.comparisonSize, 19);
});

test('unknown count, wrong sum or duplicated IDs cannot establish roster completeness', () => {
 for (const result of [
  insert(234_630_000, roster, {}),
  insert(234_630_000, roster, {...metadata,totalPower:1}),
  insert(234_630_000, [...roster,roster[0]]),
  insert(234_630_000, roster.map((row,index)=>index===0?{...row,power:null}:row))
 ]) {
  assert.equal(result.status,'PARTIAL_SNAPSHOT');
  assert.equal(result.top15Guaranteed,false);
  assert.equal(result.top15Gap,null);
 }
});

test('only compares category medians against verified IDs with at least five same-capture peer values', () => {
 const top15=roster.slice(0,6);
 const observations=top15.map((row,index)=>({governor_id:row.player_id,rankings:{
  pet_power:{value:10+index,captured_at:index===5?'2026-11-07T07:00:00Z':capture}
 }}));
 const candidate={pet_power:{value:16,captured_at:capture},hero_total:{value:0}};
 assert.deepEqual(compareTopPeers(candidate,top15,[...observations,observations[0]]),[
  {key:'pet_power',value:16,median:12,count:5,capture:Date.parse(capture),candidateCapture:Date.parse(capture)}
 ]);
 assert.deepEqual(compareTopPeers(candidate,top15,observations.slice(1)),[]);
 assert.deepEqual(compareTopPeers(candidate,top15,observations.map(({governor_id,...row})=>({...row,uid:governor_id}))),[]);
});

test('uses separate indicators for Rally Leader and Garrison Holder', () => {
 const attack=assessAccount({}, {hero_equip:2,hero_total:3,personal_power:1});
 const defense=assessAccount({}, {troop_power:3,gov_charm:4,personal_power:1});
 assert.equal(attack.priorities[0].label,'Rally Leader');
 assert.equal(defense.priorities[0].label,'Garrison Holder');
 assert.equal(assessAccount({}, {personal_power:1}).priorities.length,0);
});

test('handles a genuinely complete alliance with fewer than 15 members', () => {
 const small=roster.slice(0,3);
 const result=insert(90_000_000,small,{members:3,totalPower:330_000_000});
 assert.equal(result.status,'COMPLETE_SNAPSHOT');
 assert.equal(result.rankMin,4);
 assert.equal(result.top15Guaranteed,true);
});

test('requires a dated, comparable sample and never converts missing power to zero', () => {
 for (const result of [insert(null),insert('  '),insert(234_630_000,[],{}),insert(234_630_000,roster,metadata,'unknown')]){
  assert.equal(result.status,'UNAVAILABLE');
  assert.equal(result.rankMin,null);
 }
});

test('only computes True Power from matched source and capture, with Castle/TG mapping', () => {
 const v={town_center_level:55,player_captured_at:capture,leaderboards:[
  {name:'personal_power',value:234_630_000,captured_at:capture,source:'saved_snapshot'},
  {name:'troop_power',value:144_740_000,captured_at:capture,source:'saved_snapshot'}
 ]};
 const metrics=playerSummaryMetrics(v);
 assert.equal(metrics.find(row=>row.key==='true_power').value,89_890_000);
 assert.equal(metrics.find(row=>row.key==='castle').text,'TG5 5/5');
 v.leaderboards[1].captured_at='2026-11-07T07:00:00Z';
 assert.equal(playerSummaryMetrics(v).find(row=>row.key==='true_power').value,null);
});

test('selects a measured capture within a second and prefers the provider on a capture tie', () => {
 const older = '2026-11-08T10:00:00.100001Z';
 const newer = '2026-11-08T10:00:00.100002Z';
 const direct = {name:'personal_power',value:300,captured_at:newer,source:'provider_kingdom'};
 const stored = {name:'personal_power',value:200,captured_at:older,source:'saved_snapshot'};
 assert.equal(playerRankingMap({leaderboards:[direct,stored]}).personal_power.value,300);
 assert.equal(playerRankingMap({leaderboards:[direct,{...stored,captured_at:newer}]}).personal_power.value,300);
 assert.equal(playerRankingMap({leaderboards:[{...direct,captured_at:older},{...stored,captured_at:newer}]}).personal_power.value,200);
});

test('rejects cross-source and different-instant True Power pairs and accepts equivalent time representations', () => {
 const total = {name:'personal_power',value:300,captured_at:'2026-11-08T10:00:00.100001Z',source:'provider_kingdom'};
 const troop = {name:'troop_power',value:200,captured_at:'2026-11-08T11:00:00.100001+01:00',source:'provider_kingdom'};
 const score = entry=>playerSummaryMetrics({leaderboards:[total,entry]})[1].value;
 assert.equal(score(troop),100);
 assert.equal(score({...troop,source:'saved_snapshot'}),null);
 assert.equal(score({...troop,captured_at:'2026-11-08T11:00:00.100002+01:00'}),null);
 assert.equal(score({...troop,captured_at:null}),null);
 assert.equal(playerSummaryMetrics({leaderboards:[troop]},{power:300,captured_at:troop.captured_at})[1].value,null);
});
