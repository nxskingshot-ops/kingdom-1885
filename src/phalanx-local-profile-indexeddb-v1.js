"use strict";
// Browser-only IndexedDB adapter; injected indexedDB enables isolated fake-DB tests.
// No network requests. Do not persist authentication secrets here.
const DB_NAME="phalanx-personal-v1",STORE="profiles",KEY="active";
function localProfileStore(indexedDB){
 if(!indexedDB||typeof indexedDB.open!=="function")throw new Error("indexeddb-unavailable");
 let connection;
 function open(){
  if(connection)return Promise.resolve(connection);
  return new Promise((resolve,reject)=>{
   const req=indexedDB.open(DB_NAME,1);
   req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
   req.onerror=()=>reject(new Error("indexeddb-open-failed"));
   req.onsuccess=()=>{connection=req.result;connection.onversionchange=()=>{connection.close();connection=null;};resolve(connection);};
  });
 }
 async function transact(mode,fn){
  const db=await open();
  return new Promise((resolve,reject)=>{
   const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
   let result;
   const req=fn(store);
   req.onsuccess=()=>{result=req.result;};
   req.onerror=()=>reject(new Error("indexeddb-request-failed"));
   tx.oncomplete=()=>resolve(result);
   tx.onerror=()=>reject(new Error("indexeddb-transaction-failed"));
   tx.onabort=()=>reject(new Error("indexeddb-transaction-aborted"));
  });
 }
 return {
  load:()=>transact("readonly",s=>s.get(KEY)),
  save:async profile=>{
   const {validateProfile}=require("./phalanx-local-profile-portable-v1.js");
   if(!validateProfile(profile))throw new Error("invalid-local-profile");
   await transact("readwrite",s=>s.put(profile,KEY));
  },
  remove:async()=>{await transact("readwrite",s=>s.delete(KEY));}
 };
}
module.exports={localProfileStore};
