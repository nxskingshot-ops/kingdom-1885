"use strict";
// Universal PvP/KvK/custom march feasibility; NOT a battle-strength optimizer.
const {allocate}=require("./phalanx-troop-allocation-v1.js");
const types=["infantry","cavalry","archers"];
const modes=new Set(["pvp-attack","pvp-defense","kvk-rally-lead","kvk-rally-joiner","kvk-garrison","reinforcement","custom"]);
function planMarches({mode,inventory,marches}){
 if(!modes.has(mode))throw Error("unsupported mode");
 if(!inventory||types.some(k=>!Number.isSafeInteger(inventory[k])||inventory[k]<0))throw Error("invalid inventory");
 if(!Array.isArray(marches)||!marches.length||marches.length>20)throw Error("1-20 marches required");
 const remaining=Object.fromEntries(types.map(k=>[k,inventory[k]]));
 const required={infantry:0,cavalry:0,archers:0};
 const deployments=marches.map((march,index)=>{
  const target=allocate(march.capacity,march.ratio),assigned={};
  for(const k of types){
   required[k]+=target[k];
   if(!Number.isSafeInteger(required[k]))throw Error("total requirements exceed safe integer precision");
   assigned[k]=Math.min(target[k],remaining[k]);remaining[k]-=assigned[k];
  }
  const shortfall=march.capacity-types.reduce((n,k)=>n+assigned[k],0);
  return {index:index+1,label:typeof march.label==="string"?march.label:null,capacity:march.capacity,ratio:march.ratio.slice(),target:Object.fromEntries(types.map(k=>[k,target[k]])),assigned,shortfall,fullyFeasible:shortfall===0};
 });
 const deficit=Object.fromEntries(types.map(k=>[k,Math.max(0,required[k]-inventory[k])]));
 return {mode,deployments,required,remaining,deficit,fullyFeasible:deployments.every(d=>d.fullyFeasible),performanceEstimate:null,heroSkillsVerified:false,timingVerified:false,limitations:["No verified PvP/KvK combat outcome prediction","Marches allocated in supplied priority order","Hero assignments and simultaneous march availability not yet validated"]};
}
module.exports={planMarches,modes};
