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
  const raw=String(plan.phxEventCap??'').trim();
  if(raw!==''&&Number.isFinite(Number(raw))&&Number(raw)>0){cap.value=raw;verified.checked=plan.phxEventCapVerified===true;}else{cap.value='';verified.checked=false;}
 };
 applySavedPlanning();
 window.addEventListener('phx:event-context-updated',applySavedPlanning);
 byId('phxCalculatePower').addEventListener('click',()=>{
  const val=id=>{const raw=byId(id).value.trim();return raw===''?undefined:Number(raw)};
  const result=simulateTransferPower({currentTransferPowerM:val('phxCurrentTransferPower'),hypotheticalReductionM:val('phxPowerReduction'),confirmedCapM:val('phxOfficialCap'),capVerified:byId('phxCapVerified').checked});
  byId('phxPowerOutcome').textContent=(result.projectedM===undefined?'':('Simulated power: '+result.projectedM+'M. '))+(result.differenceM===undefined?'':('Difference to example cap: '+result.differenceM+'M. '))+result.message;
 });
}
