"use strict";
// Pure input validation before storing any personal PHALANX data.
// Validation is defense-in-depth; database constraints and RLS remain mandatory.
const TYPES=["infantry","cavalry","archers"];
const MODES=["basic","full"];
function fail(message){return {ok:false,error:message};}
function validateAccountTier(tier){return MODES.includes(tier)?{ok:true,value:tier}:fail("invalid-account-tier");}
function validatePlayerLookup(input){
 if(!input||typeof input!=="object"||Array.isArray(input))return fail("invalid-lookup");
 const id=input.playerId;
 if(typeof id!=="string"||!/^[0-9]{1,20}$/.test(id))return fail("invalid-player-id");
 return {ok:true,value:{playerId:id}};
}
function validateTroopInventory(inventory){
 if(!inventory||typeof inventory!=="object"||Array.isArray(inventory))return fail("invalid-inventory");
 const normalized={};
 for(const type of TYPES){
  const count=inventory[type];
  if(!Number.isSafeInteger(count)||count<0)return fail("invalid-"+type);
  normalized[type]=count;
 }
 return {ok:true,value:normalized};
}
function validateMarches(marches){
 if(!Array.isArray(marches)||marches.length===0||marches.length>12)return fail("invalid-marches");
 const normalized=[];
 for(const march of marches){
  if(!march||typeof march!=="object"||!Number.isSafeInteger(march.capacity)||march.capacity<0)return fail("invalid-capacity");
  const ratio=march.ratio;
  if(!Array.isArray(ratio)||ratio.length!==3||ratio.some(x=>typeof x!=="number"||!Number.isFinite(x)||x<0)||ratio.every(x=>x===0))return fail("invalid-ratio");
  normalized.push({capacity:march.capacity,ratio:[...ratio]});
 }
 return {ok:true,value:normalized};
}
function validateConfirmedProfile(profile,userId){
 if(!profile||typeof profile!=="object"||typeof userId!=="string"||!userId||profile.ownerId!==userId||profile.verified!==true)return fail("unverified-or-foreign-profile");
 const inventory=validateTroopInventory(profile.inventory);
 if(!inventory.ok)return inventory;
 const marches=validateMarches(profile.marches);
 if(!marches.ok)return marches;
 return {ok:true,value:{inventory:inventory.value,marches:marches.value}};
}
module.exports={validateAccountTier,validatePlayerLookup,validateTroopInventory,validateMarches,validateConfirmedProfile};
