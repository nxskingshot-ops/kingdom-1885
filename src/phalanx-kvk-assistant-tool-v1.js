"use strict";
// First PHALANX assistant tool: explicit 'have -> want' KvK rally feasibility.
// This is a deterministic, read-only prototype, not combat AI.
const {planMarches}=require("./phalanx-universal-marches-v1.js");
function kvkRallyTool({have,want}){
 if(!have||!want||typeof want!=="object")return {status:"needs-input",missing:["have","want"]};
 const validGoals=new Set(["feasible-rally","max-damage","win-chance","min-losses"]);
 if(!validGoals.has(want.goal))return {status:"needs-goal",choices:[...validGoals]};
 if(!["kvk-rally-lead","kvk-rally-joiner"].includes(want.role))return {status:"needs-role",choices:["kvk-rally-lead","kvk-rally-joiner"]};
 if(!have.inventory||!Array.isArray(have.marches)||!have.marches.length)return {status:"needs-input",missing:["inventory","marches"]};
 try{
  const plan=planMarches({mode:want.role,inventory:have.inventory,marches:have.marches});
  const evidence=want.goal==="feasible-rally"?"exact-troop-feasibility":"combat-performance-unverified";
  return {status:want.goal==="feasible-rally"?"answered":"needs-combat-evidence",goal:want.goal,role:want.role,evidence,plan,answer:want.goal==="feasible-rally"?(plan.fullyFeasible?"Die angegebenen Märsche sind mit deinem Truppenbestand vollständig möglich.":"Die angegebenen Märsche sind mit deinem Truppenbestand nicht vollständig möglich; prüfe die Defizite."):"Die Truppenverteilung ist berechnet. Eine belastbare Rangfolge für Schaden, Siegchance oder Verluste benötigt verifizierte Kampfberichte und Gegnerdaten."};
 }catch(e){return {status:"invalid-input",message:e.message};}
}
module.exports={kvkRallyTool};
