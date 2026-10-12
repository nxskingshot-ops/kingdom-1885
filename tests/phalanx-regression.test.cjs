/* NEXUS PHALANX regression checks — hypothetical models, not game calibration.
   Run from repository root: node --test tests/phalanx-regression.test.cjs */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const selection=require('../src/phalanx-rally-selection-v1.js');
const heroes=require('../src/phalanx-screenshot-joiner-v2.js');
const mc=require('../src/phalanx-monte-carlo-v2.js');
const bounds=require('../src/phalanx-dependence-bounds-v1.js');

const join=(id,order,level,hero='Chenko')=>({playerId:id,joinOrder:order,skillLevel:level,hero});
test('Rally selects four highest skill levels; join order breaks ties',()=>{
 const x=[join('a',0,1),join('b',1,5),join('c',2,3),join('d',3,5),join('e',4,5),join('f',5,5)];
 assert.deepEqual(selection.select(x).selected.map(j=>j.playerId),['b','d','e','f']);
});
test('Joiners with no first-slot hero consume no skill slot',()=>{
 const x=[{playerId:'empty',joinOrder:0,hero:null},join('a',1,1)];
 const r=selection.select(x);
 assert.equal(r.selected.length,1);assert.equal(r.excluded[0].reason,'no_first_slot_hero');
});
test('Reject duplicate join order and duplicate player IDs',()=>{
 assert.throws(()=>selection.select([join('a',0,1),join('b',0,2)]));
 assert.throws(()=>selection.select([join('a',0,1),join('a',1,2)]));
});
test('Known level-5 offensive skills calculate independently',()=>{
 const a=heroes.evaluate([{name:'Chenko',level:5},{name:'Yeonwoo',level:5},{name:'Amane',level:5},{name:'Helga',level:5}]);
 assert.equal(a.totals.attack,50);assert.equal(a.totals.lethality,50);
 assert.equal(a.allAdditive,2);assert.equal(a.grouped,2.25);
});
test('Defensive effects never silently count as offensive points',()=>{
 const a=heroes.evaluate(Array.from({length:4},()=>({name:'Saul',level:5})));
 assert.equal(a.totals.attack,0);assert.equal(a.totals.lethality,0);
 assert.ok(a.totals.defense>0);assert.ok(a.totals.health>0);
 assert.equal(a.allAdditive,1);
});
test('Four-candidate optimization examines exactly one grouping',()=>{
 const pool=['Chenko','Amane','Yeonwoo','Saul'].map((name,i)=>({playerId:String(i),name,level:5}));
 const r=heroes.optimize(pool);assert.equal(r.evaluated,1);assert.equal(r.top.length,1);
});
const opts=(chance,extra={})=>({skills:[{chance,bonus:2,cooldown:0}],rounds:10,trials:100,seed:1885,dependence:'independent',...extra});
test('Monte Carlo extreme probabilities have exact known outcomes',()=>{
 assert.equal(mc.simulate(opts(0)).mean,0);
 assert.equal(mc.simulate(opts(1)).mean,20);
});
test('Cooldown is enforced exactly, including 100% proc',()=>{
 const x=opts(1,{skills:[{chance:1,bonus:3,cooldown:2}]});
 assert.equal(mc.simulate(x).mean,12); // rounds 0,3,6,9
});
test('Same seed and parameters produce identical Monte Carlo results',()=>{
 const x=opts(.4,{trials:500,skills:[{chance:.4,bonus:1,cooldown:1},{chance:.3,bonus:2,cooldown:0}]});
 assert.deepEqual(mc.simulate(x),mc.simulate(x));
});
test('Shared trigger makes identical skills perfectly correlated without cooldown',()=>{
 const x=opts(.4,{skills:[{chance:.4,bonus:1,cooldown:0},{chance:.4,bonus:1,cooldown:0}],dependence:'shared'});
 const r=mc.simulate(x);
 assert.equal(r.meanTriggers,r.mean); // both bonus=1
 assert.equal(r.mean*100%2,0); // total score across 100 trials is always even
});
test('Dependence bounds respect known union/intersection cases',()=>{
 const a=bounds.analyze([.4,.4]);
 assert.deepEqual(a.anyBounds,[.4,.8]);assert.deepEqual(a.allBounds,[0,.4]);
 assert.ok(Math.abs(a.independent.any-.64)<1e-12);
 assert.equal(a.sharedUniform.any,.4);assert.equal(a.sharedUniform.all,.4);
});
test('Reject invalid input rather than inventing output',()=>{
 assert.throws(()=>mc.simulate(opts(-.1)));
 assert.throws(()=>mc.simulate(opts(1,{trials:0})));
 assert.throws(()=>bounds.analyze([1.2]));
 assert.throws(()=>heroes.skill('unverified',5));
});
