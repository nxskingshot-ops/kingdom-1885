"use strict";
// Explicitly invoked browser download/import bridge; never auto-overwrites.
const {exportProfile,importProfile}=require("./phalanx-local-profile-portable-v1.js");
function prepareDownload(profile,{createdAt}={}){
 const contents=exportProfile(profile,{createdAt});
 return {filename:"phalanx-profile-backup.json",mime:"application/json",contents};
}
async function previewRestore(contents){
 const {profile,createdAt}=importProfile(contents);
 return {profile,createdAt,summary:{heroes:profile.heroes.length,marches:profile.marches.length,troops:Object.values(profile.inventory).reduce((a,b)=>a+b,0)},requiresConfirmation:true};
}
async function confirmRestore({preview,confirmed,store}){
 if(confirmed!==true) return {status:"cancelled"};
 if(!preview?.requiresConfirmation||!preview.profile||typeof store?.save!=="function")return {status:"invalid-restore"};
 const {profile}=importProfile(exportProfile(preview.profile));
 await store.save(profile);
 return {status:"restored"};
}
module.exports={prepareDownload,previewRestore,confirmRestore};
