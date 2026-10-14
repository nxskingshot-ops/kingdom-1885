"use strict";
const assert=require("node:assert/strict");
const {allocate}=require("../src/phalanx-troop-allocation-v1.js");
assert.deepEqual([allocate(100, [50,20,30]).infantry,allocate(100,[50,20,30]).cavalry,allocate(100,[50,20,30]).archers],[50,20,30]);
assert.deepEqual([allocate(7,[1,1,1]).infantry,allocate(7,[1,1,1]).cavalry,allocate(7,[1,1,1]).archers],[3,2,2]);
for(let cap=0;cap<=1000;cap++)for(const ratio of [[50,20,30],[2,18,80],[1,1,1],[0,0,1]]){
 const a=allocate(cap,ratio);
 assert.equal(a.infantry+a.cavalry+a.archers,cap);
 assert.ok([a.infantry,a.cavalry,a.archers].every(n=>Number.isInteger(n)&&n>=0));
}
assert.throws(()=>allocate(-1,[50,20,30]));
assert.throws(()=>allocate(100,[0,0,0]));
assert.throws(()=>allocate(100,[50,20]));
console.log("Troop allocation checks passed");
