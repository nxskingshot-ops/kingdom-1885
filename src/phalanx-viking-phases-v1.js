"use strict";
// Viking phase planner: troops are reinforced FIRST, then withdrawn for HQ wave 10/20.
// This computes inventory feasibility only, not travel/return timing or event scores.
const {allocate}=require("./phalanx-troop-allocation-v1.js");
const classes=["infantry","cavalry","archers"];
function validInventory(v){if(!v||classes.some(k=>!Number.isSafeInteger(v[k])||v[k]<0))throw Error("invalid inventory");return Object.fromEntries(classes.map(k=>[k,v[k]]));}
function planViking({inventory,reinforcements,hq,wave,castleAfter={infantry:0,cavalry:0,archers:0}}){
 if(wave!==10&&wave!==20)throw Error("HQ wave must be 10 or 20");
 if(!Array.isArray(reinforcements)||!reinforcements.length)throw Error("reinforcements required");
 const original=validInventory(inventory),castle=validInventory(castleAfter);
 if(castle.infantry||castle.cavalry)throw Error("castle may retain archers only");
 const available={...original},before=[];
 for(const [index,spec] of reinforcements.entries()){
  const target=allocate(spec.capacity,spec.ratio),assigned={};
  for(const k of classes){assigned[k]=Math.min(available[k],target[k]);available[k]-=assigned[k];}
  before.push({index:index+1,target:Object.fromEntries(classes.map(k=>[k,target[k]])),assigned,shortfall:spec.capacity-classes.reduce((n,k)=>n+assigned[k],0)});
 }
 const hqTarget=allocate(hq.capacity,hq.ratio),need=Object.fromEntries(classes.map(k=>[k,hqTarget[k]]));
 // Withdraw from reinforcements only, in reverse march order; no pre-reserving.
 const after=before.map(m=>({...m,assigned:{...m.assigned},withdrawn:{infantry:0,cavalry:0,archers:0}}));
 for(let i=after.length-1;i>=0;i--)for(const k of classes){
  const n=Math.min(need[k],after[i].assigned[k]);
  after[i].assigned[k]-=n;after[i].withdrawn[k]+=n;need[k]-=n;
 }
 const hqAssigned=Object.fromEntries(classes.map(k=>[k,hqTarget[k]-need[k]]));
 const hqShortfall=classes.reduce((n,k)=>n+need[k],0);
 // 'castleAfter' is a claimed separate placement; only uncommitted inventory can supply it.
 const uncommittedAfter={...available};
 const castleFeasible=classes.every(k=>castle[k]<=uncommittedAfter[k]);
 const conservation=classes.every(k=>before.reduce((n,m)=>n+m.assigned[k],0)+available[k]===original[k]&&after.reduce((n,m)=>n+m.assigned[k],0)+hqAssigned[k]+available[k]===original[k]);
 if(!conservation)throw Error("inventory reconciliation failed");
 return {wave,before,after,hq:{target:Object.fromEntries(classes.map(k=>[k,hqTarget[k]])),assigned:hqAssigned,shortfall:hqShortfall},uncommitted:available,castleAfter:castle,castleFeasible,fullyFeasible:before.every(m=>m.shortfall===0)&&hqShortfall===0&&castleFeasible,timingVerified:false,performanceEstimate:null};
}
module.exports={planViking};
