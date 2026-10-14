"use strict";
const assert=require("node:assert/strict");
const {planMarches}=require("../src/phalanx-universal-marches-v1.js");
const modes=["pvp-attack","pvp-defense","kvk-rally-lead","kvk-rally-joiner","kvk-garrison","reinforcement","custom"];
for(const mode of modes){
 const r=planMarches({mode,inventory:{infantry:60,cavalry:30,archers:50},marches:[{capacity:100,ratio:[50,20,30]},{capacity:40,ratio:[25,25,50]}]});
 assert.equal(r.deployments.length,2);
 assert.equal(r.fullyFeasible,true);
 assert.deepEqual(r.remaining,{infantry:0,cavalry:0,archers:0});
 assert.equal(r.performanceEstimate,null);
 for(const k of ["infantry","cavalry","archers"])assert.equal(r.deployments.reduce((s,d)=>s+d.assigned[k],0)+r.remaining[k],r.required[k]);
}
const shortage=planMarches({mode:"custom",inventory:{infantry:1,cavalry:0,archers:0},marches:[{capacity:10,ratio:[50,20,30]}]});
assert.equal(shortage.fullyFeasible,false);
assert.equal(shortage.deficit.infantry,4);
assert.equal(shortage.deployments[0].shortfall,9);
assert.throws(()=>planMarches({mode:"bear",inventory:{infantry:0,cavalry:0,archers:0},marches:[{capacity:1,ratio:[1,0,0]}]}));
assert.throws(()=>planMarches({mode:"custom",inventory:{infantry:0,cavalry:0,archers:0},marches:[]}));
console.log("Universal march feasibility tests passed");
