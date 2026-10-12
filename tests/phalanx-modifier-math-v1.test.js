const assert=require('node:assert/strict');const {evaluate}=require('../src/phalanx-modifier-math-v1.js');
const rhino={id:'rhino',stat:'attack',value:10,modes:['rally','bear'],active:true,inSnapshot:false};
const panther={id:'panther',stat:'lethality',value:10,modes:['rally','bear'],active:true,inSnapshot:false};
const scenario=effects=>evaluate({attack:200,lethality:150,baseline:'snapshot',mode:'rally',effects});
function near(x,y){assert.ok(Math.abs(x-y)<1e-9,'Expected '+y+' got '+x)}
const both=scenario([rhino,panther]);near(both.relativeGainPct,7.466666666666659);assert.equal(both.attackAfter,210);assert.equal(both.lethalityAfter,160);
const excluded=scenario([{...rhino,inSnapshot:true},panther]);near(excluded.relativeGainPct,4);assert.equal(excluded.attackAfter,200);assert.equal(excluded.rows[0].reason,'already_in_snapshot');
near(scenario([]).relativeGainPct,0);
near(scenario([{...rhino,active:false}]).relativeGainPct,0);
near(evaluate({attack:200,lethality:150,mode:'arena',effects:[rhino]}).relativeGainPct,0);
near(evaluate({attack:200,lethality:150,baseline:'reconstruct',effects:[{...rhino,inSnapshot:true}]}).relativeGainPct,10/300*100);
assert.throws(()=>scenario([rhino,rhino]),/Duplicate/);
assert.throws(()=>evaluate({attack:NaN,lethality:150}),/Invalid attack/);
assert.throws(()=>evaluate({attack:-1,lethality:150}),/Invalid attack/);
assert.throws(()=>scenario([{...rhino,value:Infinity}]),/Invalid effect/);
console.log('PHALANX modifier regression: 10 assertions passed');
