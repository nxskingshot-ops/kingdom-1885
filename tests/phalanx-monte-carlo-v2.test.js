const assert=require("node:assert/strict");const M=require("../src/phalanx-monte-carlo-v2.js");const near=(a,b,t)=>assert.ok(Math.abs(a-b)<t);const base={rounds:1,trials:100000,seed:1885,skills:Array.from({length:4},()=>({chance:.4,bonus:1,cooldown:0}))};const a=M.simulate({...base,dependence:"independent"});const b=M.simulate({...base,dependence:"shared"});near(a.mean,1.6,.02);near(b.mean,1.6,.03);near(a.standardDeviation,Math.sqrt(.96),.02);near(b.standardDeviation,Math.sqrt(3.84),.03);assert.ok(b.standardDeviation>a.standardDeviation);assert.deepEqual(a,M.simulate({...base,dependence:"independent"}));assert.equal(M.simulate({...base,dependence:"independent",skills:[{chance:0,bonus:7,cooldown:0}]}).mean,0);assert.equal(M.simulate({...base,dependence:"independent",skills:[{chance:1,bonus:7,cooldown:0}]}).mean,7);assert.equal(M.simulate({...base,dependence:"independent",rounds:5,skills:[{chance:1,bonus:2,cooldown:1}]}).mean,6);assert.throws(()=>M.simulate({...base,dependence:"wrong"}));assert.throws(()=>M.simulate({...base,trials:0,dependence:"independent"}));console.log("11 Monte Carlo assertions passed");
const cooldownCase=M.simulate({rounds:10,trials:30,seed:1885,dependence:'independent',skills:[{chance:1,bonus:3,cooldown:2}]});
assert.equal(cooldownCase.mean,12);
assert.equal(cooldownCase.p05,12);
assert.equal(cooldownCase.p95,12);

assert.throws(()=>M.simulate({...base,dependence:'independent',seed:1.5}));
assert.throws(()=>M.simulate({...base,dependence:'independent',skills:[{chance:.4,bonus:1,cooldown:-1}]}));
