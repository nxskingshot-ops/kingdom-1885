import {normalizeEventContext, EVIDENCE} from './phx-event-context.mjs';
import {simulateTransferPower} from './phx-transfer-power-simulator-20261101.js';
const byId=id=>document.getElementById(id);
const panel=byId('phxPowerScenario');
if(panel){
 const applySavedPlanning=()=>{
  let plan;
  try{plan=JSON.parse(localStorage.getItem('phx-transfer-event-plan-v1')||'null');}catch(_){return;}
  if(!plan||typeof plan!=='object')return;
  const cap=byId('phxOfficialCap'),verified=byId('phxCapVerified');
  if(!cap||!verified)return;
  verified.disabled=true; // A local checkbox cannot establish independent verification.
  const context=normalizeEventContext(plan,{capSource:plan.phxEventCapSource,capVerifiedAt:plan.phxEventCapVerifiedAt});
  if(context.powerCap.million!==null){cap.value=String(context.powerCap.million);verified.checked=context.powerCap.status===EVIDENCE.CONFIRMED;}else{cap.value='';verified.checked=false;}
  const status=byId('phxPowerOutcome');
  if(status&&context.powerCap.status!==EVIDENCE.CONFIRMED)status.textContent='Planning cap is provisional or unknown. Verify official source and event metric before assessing transfer eligibility.';
 };
 applySavedPlanning();
 window.addEventListener('phx:event-context-updated',applySavedPlanning);
 byId('phxCalculatePower').addEventListener('click',()=>{
  const val=id=>{const raw=byId(id).value.trim();return raw===''?undefined:Number(raw)};
  const result=simulateTransferPower({currentTransferPowerM:val('phxCurrentTransferPower'),hypotheticalReductionM:val('phxPowerReduction'),confirmedCapM:val('phxOfficialCap'),capVerified:false});
  byId('phxPowerOutcome').textContent=(result.projectedM===undefined?'':('Simulated power: '+result.projectedM+'M. '))+(result.differenceM===undefined?'':('Difference to example cap: '+result.differenceM+'M. '))+result.message;
 });
}
