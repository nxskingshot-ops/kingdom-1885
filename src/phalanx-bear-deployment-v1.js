"use strict";
// Bear deployment feasibility: lead plus up to six joiners, no inventory reuse.
// Does not infer game timing, damage or optimal strategy.
const {allocate}=require("./phalanx-troop-allocation-v1.js");
const keys=["infantry","cavalry","archers"];
function validateInventory(inv){
 if(!inv||keys.some(k=>!Number.isSafeInteger(inv[k])||inv[k]<0))throw Error("inventory must contain nonnegative integer infantry/cavalry/archers");
 return Object.fromEntries(keys.map(k=>[k,inv[k]]));
}
function planBear({inventory,mode="lead-and-joiners",lead=null,joiners=[]}){
 if(!["lead-only","joiners-only","lead-and-joiners"].includes(mode))throw Error("invalid mode");
 if(!Array.isArray(joiners)||joiners.length>6)throw Error("at most six joiners");
 const available=validateInventory(inventory);
 const includeLead=mode!=="joiners-only",includeJoiners=mode!=="lead-only";
 if(includeLead&&!lead)throw Error("lead required");
 if(includeJoiners&&joiners.length===0)throw Error("joiners required");
 const specs=[...(includeLead?[{...lead,role:"lead"}]:[]),...(includeJoiners?joiners.map((j,i)=>({...j,role:"joiner",index:i+1})):[])];
 const deployments=[],required={infantry:0,cavalry:0,archers:0};
 for(const spec of specs){
  const target=allocate(spec.capacity,spec.ratio);
  for(const k of keys){required[k]+=target[k];if(!Number.isSafeInteger(required[k]))throw Error("total requirement exceeds safe integer precision");}
  const assigned={};for(const k of keys){assigned[k]=Math.min(target[k],available[k]);available[k]-=assigned[k];}
  const assignedTotal=keys.reduce((s,k)=>s+assigned[k],0);
  deployments.push({role:spec.role,index:spec.index||null,capacity:spec.capacity,ratio:spec.ratio.slice(),target:{infantry:target.infantry,cavalry:target.cavalry,archers:target.archers},assigned,assignedTotal,shortfall:spec.capacity-assignedTotal,fullyFeasible:assignedTotal===spec.capacity});
 }
 const deficit=Object.fromEntries(keys.map(k=>[k,Math.max(0,required[k]-inventory[k])]));
 return {deployments,required,deficit,remaining:available,fullyFeasible:deployments.every(d=>d.fullyFeasible),timingVerified:false,performanceEstimate:null};
}
module.exports={planBear};
