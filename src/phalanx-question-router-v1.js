"use strict";
// PHALANX question intent router v1: offline, no external AI, no data access.
const patterns=[
  {id:"bear",terms:[/\b(bear|b[aä]r|b[aä]ren|bt2|bear trap)\b/i]},
  {id:"kvk",terms:[/\b(kvk|gegner|opponent|enemy|head.to.head|whale risk)\b/i]},
  {id:"heroes",terms:[/\b(held|helden|hero|heroes|alcar|amadeus|chenko|joiner|rally)\b/i]},
  {id:"players",terms:[/\b(top\s*40|top\s*100|true\s*power|spieler|players?|player intelligence|entwicklung|entwickelt|improved|st[aä]rkste[nr]?)\b/i]},
  {id:"outposts",terms:[/\b(outpost|outposts|au[sß]enposten|quadrant|quadranten)\b/i]},
  {id:"troops",terms:[/\b(truppen|troops?|ratio|verh[aä]ltnis|m[aä]rsche|march(?:es)?|infanterie|archer|bogensch[uü]tzen)\b/i]}
];
function route(question,context=null){
  if(typeof question!=="string"||!question.trim())return {intent:null,status:"clarify",question:"Was möchtest du über PHALANX wissen?"};
  const q=question.normalize("NFKC").trim();
  const matches=patterns.filter(p=>p.terms.some(t=>t.test(q))).map(p=>p.id);
  const contextIntent=context&&patterns.some(p=>p.id===context.intent)?context.intent:null;
  if(contextIntent&&/^(und|and|what about|wie|mit)\b/i.test(q)&&matches.length===1&&matches[0]==="troops"&&contextIntent==="bear")return {intent:"bear",status:"routed",contextual:true,related:["troops"]};
  if(matches.length===0)return contextIntent&&/^(und|and|what about|wie|mit)\b/i.test(q)?{intent:contextIntent,status:"routed",contextual:true}:{intent:null,status:"clarify",question:"Geht es um Bär, Truppen, Helden, KvK, Spieler oder Outposts?"};
  if(matches.includes("bear")&&matches.includes("troops"))return {intent:"bear",status:"routed",related:["troops"]};
  if(matches.includes("kvk")&&matches.includes("players"))return {intent:"kvk",status:"routed",related:["players"]};
  if(matches.length>1)return {intent:null,status:"clarify",candidates:matches,question:"Welchen Bereich möchtest du zuerst ansehen?"};
  return {intent:matches[0],status:"routed"};
}
module.exports={route};
