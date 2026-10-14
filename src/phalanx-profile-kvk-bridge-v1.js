"use strict";
// Narrow read-only bridge. No session tokens or DB keys are passed into calculation.
const {kvkRallyTool}=require("./phalanx-kvk-assistant-tool-v1.js");
const {validateConfirmedProfile}=require("./phalanx-personal-profile-validation-v1.js");
async function answerKvKFromProfile({client,goal,role,profileLoader}){
 if(!client?.auth?.getUser) return {status:"needs-auth",message:"PHALANX-Anmeldung erforderlich."};
 const auth=await client.auth.getUser();
 const userId=auth?.data?.user?.id;
 if(auth?.error||typeof userId!=="string"||!userId)return {status:"needs-auth",message:"PHALANX-Anmeldung erforderlich."};
 if(typeof profileLoader!=="function")return {status:"needs-profile-connection",message:"Es ist noch keine autorisierte Profildatenquelle verbunden."};
 try{
  // Loader MUST enforce DB row ownership/RLS; never accept a caller-provided user ID.
  const result=await profileLoader({client,userId});
  if(!result||result.ownerId!==userId||result.verified!==true)return {status:"needs-verified-profile",message:"Kein bestätigtes eigenes Spielerprofil verfügbar."};
  const validated=validateConfirmedProfile(result,userId);
  if(!validated.ok)return {status:"invalid-profile",reason:validated.error,message:"Das bestätigte Profil enthält ungültige oder unvollständige Truppendaten."};
  const answer=kvkRallyTool({have:validated.value,want:{goal,role}});
  return {...answer,profileAsOf:result.asOf||null,profileSource:result.source||null,limitations:[...(answer.plan?.limitations||[]),"Profile ownership must also be enforced by database RLS","Hero roster and combat outcome are not yet evaluated"]};
 }catch(_error){return {status:"profile-error",message:"Das Profil konnte nicht sicher geladen werden."};}
}
module.exports={answerKvKFromProfile};
