"use strict";
const assert=require("node:assert/strict");
const {localProfileStore}=require("../src/phalanx-local-profile-indexeddb-v1.js");
assert.throws(()=>localProfileStore(null),/indexeddb-unavailable/);
const values=new Map();
let db;
function request(tx,op){const r={};queueMicrotask(()=>{try{r.result=op();r.onsuccess?.();tx.oncomplete?.();}catch(e){r.error=e;r.onerror?.();tx.onerror?.();}});return r;}
db={objectStoreNames:{contains:()=>true},transaction:()=>{const tx={};tx.objectStore=()=>({get:k=>request(tx,()=>values.get(k)),put:(v,k)=>request(tx,()=>values.set(k,structuredClone(v))),delete:k=>request(tx,()=>values.delete(k))});return tx;},close:()=>{}};
const fake={open:()=>{const r={};queueMicrotask(()=>{r.result=db;r.onsuccess?.();});return r;}};
(async()=>{
 const store=localProfileStore(fake);
 assert.equal(await store.load(),undefined);
 const p={inventory:{infantry:1,cavalry:2,archers:3},marches:[],heroes:[]};
 await store.save(p);
 assert.deepEqual(await store.load(),p);
 await assert.rejects(store.save({...p,inventory:{infantry:-1,cavalry:2,archers:3}}),/invalid-local-profile/);
 assert.deepEqual(await store.load(),p);
 await store.remove();
 assert.equal(await store.load(),undefined);
 console.log("PHALANX IndexedDB adapter mock tests passed");
})().catch(e=>{console.error(e);process.exitCode=1;});
