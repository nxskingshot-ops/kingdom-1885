import {test} from 'node:test';import assert from 'node:assert/strict';
import {assessPlayer,alliancePlacement,chooseComparison} from '../preview/transfer-assessment-20261103.js';
const b=(name,value,rank)=>({name,value,kingdom_rank:rank,captured_at:'2026-11-03T17:00:53Z'});
const player={leaderboards:[b('personal_power',419393744,6),b('research_power',39074590,4),b('troop_power',258631472,6),b('pet_power',13422120,61)]};
test('assessment preserves rank provenance and does not claim combat proof',()=>{const a=assessPlayer(player,{kingdom:1555});assert.equal(a.strongest[0].key,'research_power');assert.equal(a.weakest[0].key,'pet_power');assert.equal(a.roles.find(x=>x.role==='Rally Leader').status,'requires_combat_review');assert.match(a.disclaimer,/not alliance/);});
test('no invented alliance rank from partial roster',()=>{assert.equal(alliancePlacement(player,[{id:'a',alliance:'NXS',metrics:{personal_power:100}}]).status,'unknown');});
test('exact rank from complete synchronized roster including outside top 15',()=>{const roster=Array.from({length:18},(_,i)=>({id:String(i),alliance:'NXS',capturedAt:'t1',metrics:{personal_power:500000000+i}}));const x=alliancePlacement(player,roster);assert.equal(x.rank,19);assert.equal(x.top15,false);});
test('closest comparator selected deterministically',()=>{const r=[{id:'b',metrics:{personal_power:419393745}},{id:'a',metrics:{personal_power:419393743}}];assert.equal(chooseComparison(player,r).id,'a');});
test('missing measurements do not become zero',()=>{assert.equal(chooseComparison({},[{id:'a',metrics:{personal_power:100}}]),null);assert.equal(assessPlayer({}).coverage,0);});
