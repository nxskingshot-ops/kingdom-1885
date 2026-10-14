"use strict";
// Read-only answer preparation: no DB calls, no invented stats, no user-supplied executable actions.
const {route}=require("./phalanx-question-router-v1.js");
const modules=Object.freeze({bear:"bear",troops:"troops",heroes:"heroes",kvk:"kvk",players:"player-intelligence",outposts:"outposts"});
function respond(question,context=null,adapters={}){
  const match=route(question,context);
  if(match.status!=="routed")return {status:"clarify",question:match.question||"Welchen Bereich meinst du?",candidates:match.candidates||[],context};
  const intent=match.intent;
  const nextContext={intent};
  const adapter=adapters[intent];
  if(typeof adapter!=="function")return {status:"needs-connection",intent,module:modules[intent],message:"Ich habe den passenden Bereich gefunden, aber noch keine geprüfte Datenquelle oder Berechnung angebunden.",context:nextContext};
  try{
    const result=adapter({question,context:nextContext,previousContext:context});
    if(result&&typeof result.then==="function")return {status:"error",intent,message:"Asynchrone Datenzugriffe müssen über eine autorisierte Server-Schnittstelle erfolgen.",context:nextContext};
    if(!result||result.verified!==true||typeof result.answer!=="string"||!result.answer.trim())return {status:"insufficient-data",intent,message:"Für eine belastbare Antwort fehlen geprüfte Daten.",context:nextContext};
    return {status:"answered",intent,answer:result.answer,source:result.source||null,asOf:result.asOf||null,limitations:result.limitations||null,context:nextContext};
  }catch(_error){return {status:"error",intent,message:"Die Anfrage konnte nicht sicher ausgewertet werden.",context:nextContext};}
}
module.exports={respond};
