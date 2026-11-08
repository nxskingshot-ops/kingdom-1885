import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assessHistoricalProfile} from '../../lab/pylon-ix-v3/assessment.mjs';
const fixture=JSON.parse(readFileSync(new URL('../fixtures/pylon-ix-v3-1913-20261004.json',import.meta.url)));
const byName=name=>fixture.players.find(p=>p.player_name===name);
test('all ten reference accounts are assessed without role certification',()=>{
 assert.equal(fixture.players.length,10);
 for(const p of fixture.players){const a=assessHistoricalProfile(p,fixture);assert.equal(a.player,p.player_name);assert.equal(a.roleSignals.length,3);assert(a.roleSignals.every(r=>r.status==='REVIEW_ONLY'));assert.match(a.roleVerdict,/No combat role verified/);}
});
test('Achilles has broad elite development',()=>assert.equal(assessHistoricalProfile(byName('Achilles'),fixture).profile,'Broad elite development'));
test('Greyjoy has broad permanent development despite lower total power',()=>assert.equal(assessHistoricalProfile(byName('Greyjoy'),fixture).profile,'Broad elite development'));
test('Dovik is troop-forward with uneven permanent development',()=>assert.equal(assessHistoricalProfile(byName('Dovik'),fixture).profile,'Troop-forward, uneven development'));
test('Psychostick0 is identified as underestimated',()=>assert.equal(assessHistoricalProfile(byName('Psychostick0'),fixture).profile,'Underestimated permanent-development strength'));
test('missing values never become zero and confidence is insufficient',()=>{const a=assessHistoricalProfile({player_name:'Unknown',ranking_evidence:{troop_power_rank:2}},fixture);assert.equal(a.confidence,'INSUFFICIENT');assert.equal(a.permanentMedianRank,null);assert.equal(a.missing.length,7);});
test('no data remains unknown',()=>{const a=assessHistoricalProfile({},{});assert.equal(a.profile,'Insufficient evidence');assert.equal(a.roleSignals.length,3);});
test('historical timestamp remains visible',()=>assert.equal(assessHistoricalProfile(byName('Achilles'),fixture).snapshotDate,'2026-10-04'));
