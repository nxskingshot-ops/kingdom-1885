"use strict";
const assert=require("node:assert/strict");
const {planViking}=require("../src/phalanx-viking-phases-v1.js");
const setup={inventory:{infantry:30,cavalry:20,archers:50},reinforcements:[{capacity:40,ratio:[50,25,25]},{capacity:40,ratio:[25,25,50]}],hq:{capacity:20,ratio:[25,25,50]}};
for(const wave of [10,20]){
 const r=planViking({...setup,wave,castleAfter:{infantry:0,cavalry:0,archers:10}});
 assert.equal(r.wave,wave);
 assert.equal(r.hq.shortfall,0);
 assert.equal(r.hq.assigned.infantry,5);
 assert.equal(r.hq.assigned.cavalry,5);
 assert.equal(r.hq.assigned.archers,10);
 assert.equal(r.castleFeasible,true);
 assert.equal(r.timingVerified,false);
 for(const k of ["infantry","cavalry","archers"]){
  assert.equal(r.before.reduce((s,m)=>s+m.assigned[k],0)+r.uncommitted[k],setup.inventory[k]);
  assert.equal(r.after.reduce((s,m)=>s+m.assigned[k],0)+r.hq.assigned[k]+r.uncommitted[k],setup.inventory[k]);
 }
}
const shortage=planViking({...setup,inventory:{infantry:0,cavalry:0,archers:10},wave:10});
assert.ok(shortage.hq.shortfall>0);
assert.equal(shortage.fullyFeasible,false);
assert.throws(()=>planViking({...setup,wave:15}));
assert.throws(()=>planViking({...setup,wave:10,castleAfter:{infantry:1,cavalry:0,archers:0}}));
console.log("Viking phase conservation checks passed");
