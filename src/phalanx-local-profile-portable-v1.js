"use strict";
// Portable local-first profile envelope. No cloud calls, no storage writes.
// The caller owns the actual IndexedDB persistence and file download/import.
const SCHEMA=1;
const TYPES=["infantry","cavalry","archers"];
function plain(x){return x!==null&&typeof x==="object"&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;}
function validateProfile(p){
 if(!plain(p))return false;
 if(!plain(p.inventory)||!TYPES.every(t=>Number.isSafeInteger(p.inventory[t])&&p.inventory[t]>=0))return false;
 if(!Array.isArray(p.marches)||p.marches.length>12)return false;
 if(!p.marches.every(m=>plain(m)&&Number.isSafeInteger(m.capacity)&&m.capacity>=0&&Array.isArray(m.ratio)&&m.ratio.length===3&&m.ratio.every(n=>typeof n==="number"&&Number.isFinite(n)&&n>=0)&&m.ratio.some(n=>n>0)))return false;
 if(!Array.isArray(p.heroes)||p.heroes.length>200)return false;
 if(!p.heroes.every(h=>plain(h)&&typeof h.key==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(h.key)&&Number.isFinite(h.stars)&&h.stars>=0&&h.stars<=6))return false;
 return true;
}
function exportProfile(profile,{createdAt=new Date().toISOString()}={}){
 if(!validateProfile(profile))throw new Error("invalid-local-profile");
 if(typeof createdAt!=="string"||!Number.isFinite(Date.parse(createdAt)))throw new Error("invalid-export-date");
 const safe={inventory:Object.fromEntries(TYPES.map(t=>[t,profile.inventory[t]])),marches:profile.marches.map(m=>({capacity:m.capacity,ratio:[...m.ratio]})),heroes:profile.heroes.map(h=>({key:h.key,stars:h.stars}))};
 return JSON.stringify({format:"phalanx-local-profile",schema:SCHEMA,createdAt,profile:safe},null,2);
}
function importProfile(raw){
 if(typeof raw!=="string"||raw.length>1024*1024)throw new Error("invalid-backup-size");
 let doc;
 try{doc=JSON.parse(raw);}catch{throw new Error("invalid-backup-json");}
 if(!plain(doc)||doc.format!=="phalanx-local-profile"||doc.schema!==SCHEMA||!validateProfile(doc.profile))throw new Error("unsupported-or-invalid-backup");
 return {profile:JSON.parse(exportProfile(doc.profile,{createdAt:doc.createdAt||new Date().toISOString()})).profile,createdAt:doc.createdAt};
}
module.exports={SCHEMA,validateProfile,exportProfile,importProfile};
