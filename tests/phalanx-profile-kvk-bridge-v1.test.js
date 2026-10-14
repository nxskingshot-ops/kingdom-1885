"use strict";
const assert=require("node:assert/strict");
const {answerKvKFromProfile}=require("../src/phalanx-profile-kvk-bridge-v1.js");
const client={auth:{async getUser(){return {data:{user:{id:"u1"}},error:null};}}};
const profile={ownerId:"u1",verified:true,asOf:"2026-10-14",source:"user-confirmed",inventory:{infantry:50,cavalry:20,archers:30},marches:[{capacity:100,ratio:[50,20,30]}]};
(async()=>{
 assert.equal((await answerKvKFromProfile({client:null,goal:"feasible-rally",role:"kvk-rally-lead"})).status,"needs-auth");
 assert.equal((await answerKvKFromProfile({client,goal:"feasible-rally",role:"kvk-rally-lead"})).status,"needs-profile-connection");
 assert.equal((await answerKvKFromProfile({client,goal:"feasible-rally",role:"kvk-rally-lead",profileLoader:async()=>({...profile,ownerId:"u2"})})).status,"needs-verified-profile");
 assert.equal((await answerKvKFromProfile({client,goal:"feasible-rally",role:"kvk-rally-lead",profileLoader:async()=>({...profile,verified:false})})).status,"needs-verified-profile");
 const ok=await answerKvKFromProfile({client,goal:"feasible-rally",role:"kvk-rally-lead",profileLoader:async({userId})=>{assert.equal(userId,"u1");return profile;}});
 assert.equal(ok.status,"answered");assert.equal(ok.plan.fullyFeasible,true);assert.equal(ok.profileAsOf,"2026-10-14");
 const unknown=await answerKvKFromProfile({client,goal:"max-damage",role:"kvk-rally-lead",profileLoader:async()=>profile});
 assert.equal(unknown.status,"needs-combat-evidence");
 assert.equal((await answerKvKFromProfile({client,goal:"feasible-rally",role:"kvk-rally-lead",profileLoader:async()=>{throw Error("secret")}})).status,"profile-error");
 console.log("Authenticated profile-KvK bridge contract tests passed (mock only)");
})().catch(e=>{console.error(e);process.exitCode=1;});
