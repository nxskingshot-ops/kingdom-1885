"use strict";
const assert=require("node:assert/strict");
const {prepareDownload,previewRestore,confirmRestore}=require("../src/phalanx-local-backup-flow-v1.js");
(async()=>{
 const p={inventory:{infantry:5,cavalry:6,archers:7},marches:[{capacity:18,ratio:[50,20,30]}],heroes:[{key:"petra",stars:5}]};
 const file=prepareDownload(p,{createdAt:"2026-10-14T00:00:00Z"});
 assert.equal(file.mime,"application/json");
 const preview=await previewRestore(file.contents);
 assert.deepEqual(preview.summary,{heroes:1,marches:1,troops:18});
 let writes=0;const store={save:async data=>{writes++;assert.deepEqual(data,p);}};
 assert.equal((await confirmRestore({preview,confirmed:false,store})).status,"cancelled");
 assert.equal(writes,0);
 assert.equal((await confirmRestore({preview,confirmed:true,store})).status,"restored");
 assert.equal(writes,1);
 await assert.rejects(previewRestore("{broken"),/invalid-backup-json/);
 assert.equal((await confirmRestore({preview:{profile:{},requiresConfirmation:false},confirmed:true,store})).status,"invalid-restore");
 console.log("PHALANX backup confirmation flow tests passed");
})().catch(e=>{console.error(e);process.exitCode=1;});
