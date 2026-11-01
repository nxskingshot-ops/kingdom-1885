import {simulateTransferPower} from './phx-transfer-power-simulator-20261101.js';
const byId=id=>document.getElementById(id);
const panel=byId('phxPowerScenario');
if(panel){
 panel.hidden=true;
 const observer=new MutationObserver(()=>{panel.hidden=byId('private')?.hidden!==false;});
 const priv=byId('private');if(priv){observer.observe(priv,{attributes:true,attributeFilter:['hidden']});panel.hidden=priv.hidden;}
 byId('phxCalculatePower').addEventListener('click',()=>{
  const val=id=>{const raw=byId(id).value.trim();return raw===''?undefined:Number(raw)};
  const result=simulateTransferPower({currentTransferPowerM:val('phxCurrentTransferPower'),hypotheticalReductionM:val('phxPowerReduction'),confirmedCapM:val('phxOfficialCap'),capVerified:byId('phxCapVerified').checked});
  byId('phxPowerOutcome').textContent=(result.projectedM===undefined?'':('Simulated power: '+result.projectedM+'M. '))+(result.differenceM===undefined?'':('Difference to example cap: '+result.differenceM+'M. '))+result.message;
 });
}
