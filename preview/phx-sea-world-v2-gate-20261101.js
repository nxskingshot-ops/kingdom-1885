// SEA WORLD V2: conservative read-only display gate.
// A provisional Top-25 reference cannot establish a kingdom-wide tier.
export const SEA_WORLD_VERSION = 'V2-provisional';
export function seaWorldVerdict(player={}, reference=null) {
 const id=String(player.governorId??player.governor_id??player.id??'');
 if(id==='291246578') return {status:'INACTIVE',stars:null,tier:null,detail:'Inactive reference account; excluded from active comparisons.'};
 if(!reference || reference.kingdom!==1885 || reference.scope!=='kingdom_verified' || reference.verified!==true)
  return {status:'REFERENCE_PENDING',stars:null,tier:null,detail:'No verified kingdom-wide reference. SEA WORLD tier is pending; provisional Top-25 is not a full kingdom ranking.'};
 return {status:'CALIBRATION_PENDING',stars:null,tier:null,detail:'Verified reference provided; SEA WORLD calibration and tier approval still pending.'};
}
