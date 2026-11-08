// Isolated planning calculation only. Does not determine in-game eligibility.
export function simulateTransferPower({currentTransferPowerM, hypotheticalReductionM, confirmedCapM, capVerified=false}={}){
 const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 if(!valid(currentTransferPowerM)||!valid(hypotheticalReductionM)||hypotheticalReductionM>currentTransferPowerM) return {status:'INVALID_INPUT',message:'Enter valid, nonnegative values; reduction cannot exceed current power.'};
 const projectedM=Math.round((currentTransferPowerM-hypotheticalReductionM)*100)/100;
 if(!capVerified||!valid(confirmedCapM)) return {status:'NEEDS_VERIFICATION',projectedM,message:'Hypothetical only. Confirm the event power cap and the exact in-game transfer metric.'};
 return {status:'SCENARIO_ONLY',projectedM,differenceM:Math.round((projectedM-confirmedCapM)*100)/100,belowCapInScenario:projectedM<=confirmedCapM,message:'Numerical scenario only. Troop losses are not proven to reduce the applicable transfer power; verify in game. Transfer Score and passes are separate.'};
}
