"use strict";
const assert=require("node:assert/strict");
const {kvkRallyTool}=require("../src/phalanx-kvk-assistant-tool-v1.js");
const have={inventory:{infantry:60,cavalry:30,archers:50},marches:[{capacity:100,ratio:[50,20,30]},{capacity:40,ratio:[25,25,50]}]};
const good=kvkRallyTool({have,want:{goal:"feasible-rally",role:"kvk-rally-lead"}});
assert.equal(good.status,"answered");assert.equal(good.plan.fullyFeasible,true);
assert.equal(good.plan.deployments.length,2);
const lacking=kvkRallyTool({have:{...have,inventory:{infantry:1,cavalry:0,archers:0}},want:{goal:"feasible-rally",role:"kvk-rally-joiner"}});
assert.equal(lacking.status,"answered");assert.equal(lacking.plan.fullyFeasible,false);
for(const goal of ["max-damage","win-chance","min-losses"]){
 const result=kvkRallyTool({have,want:{goal,role:"kvk-rally-lead"}});
 assert.equal(result.status,"needs-combat-evidence");assert.equal(result.evidence,"combat-performance-unverified");
}
assert.equal(kvkRallyTool({have,want:{goal:"other",role:"kvk-rally-lead"}}).status,"needs-goal");
assert.equal(kvkRallyTool({have,want:{goal:"feasible-rally",role:"unknown"}}).status,"needs-role");
assert.equal(kvkRallyTool({have:null,want:{goal:"feasible-rally",role:"kvk-rally-lead"}}).status,"needs-input");
assert.equal(kvkRallyTool({have:{...have,marches:[{capacity:-1,ratio:[1,1,1]}]},want:{goal:"feasible-rally",role:"kvk-rally-lead"}}).status,"invalid-input");
console.log("KvK assistant tool tests passed");
