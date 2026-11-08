import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildAssessmentReport,formatAssessmentReport} from '../../lab/pylon-ix-v3/report.mjs';
const fixture=JSON.parse(readFileSync(new URL('../fixtures/pylon-ix-v3-1913-20261004.json',import.meta.url)));
const player=name=>fixture.players.find(p=>p.player_name===name);
test('every historical account yields a complete English lab-only report',()=>{
 for(const p of fixture.players){
  const r=buildAssessmentReport(p,fixture),text=formatAssessmentReport(r);
  assert.equal(r.language,'en');
  assert.equal(r.releaseStatus,'LAB_ONLY');
  assert.match(text,/NOT LIVE/);
  assert.match(text,/Strengths:/);
  assert.match(text,/Development:/);
  assert.match(text,/Interpretation:/);
  assert(r.sections.roleRecommendations.every(x=>x.status==='REVIEW_ONLY'));
 }
});
test('Dovik includes concrete relative weaknesses without certifying combat roles',()=>{
 const r=buildAssessmentReport(player('Dovik'),fixture);
 assert.match(r.sections.weaknesses,/Governor Gear #28/);
 assert.match(r.sections.weaknesses,/Mystic Trial #28/);
 assert(r.sections.roleRecommendations.every(x=>x.status==='REVIEW_ONLY'));
});
test('Achilles is not assigned fabricated weaknesses',()=>{
 const r=buildAssessmentReport(player('Achilles'),fixture);
 assert.match(r.sections.weaknesses,/does not prove there are no weaknesses/);
});
test('Psychostick0 receives understated-power interpretation',()=>{
 const r=buildAssessmentReport(player('Psychostick0'),fixture);
 assert.match(r.sections.interpretation,/do not evaluate this account from total power alone/);
});
test('missing data is handled explicitly',()=>{
 const r=buildAssessmentReport({},{});
 assert.equal(r.evidence.grade,'INSUFFICIENT');
 assert.match(r.summary,/Insufficient comparable rankings/);
 assert(!formatAssessmentReport(r).includes('undefined'));
});
