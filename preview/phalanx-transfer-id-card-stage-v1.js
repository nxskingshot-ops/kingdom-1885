// PHALANX staging: verified cross-kingdom player identity summary.
export function summarizePlayer(d,id){
 if(!/^[1-9][0-9]{0,15}$/.test(String(id)))throw Error("Invalid player ID");
 if(d?.ok!==true||String(d.governorId)!==String(id))throw Error("Identity mismatch");
 const p=d.player||{};
 if(!Number.isSafeInteger(p.kingdom)||p.kingdom<1)throw Error("Invalid kingdom");
 const entries=Array.isArray(d.ranks?.values?.leaderboards)?d.ranks.values.leaderboards:[];
 const boards=["master_power","pet_power","hero_no_equip","hero_equip","gov_gear","gov_charm","mystic_trial"];
 const ranking=boards.map(name=>{
  const hits=entries.filter(e=>e?.name===name);
  const x=hits.length===1?hits[0]:null;
  return {name,value:typeof x?.value==="number"&&Number.isFinite(x.value)?x.value:null,rank:Number.isInteger(x?.kingdom_rank)?x.kingdom_rank:null};
 });
 return {id:String(id),name:p.name??null,kingdom:p.kingdom,totalPower:typeof p.power==="number"&&Number.isFinite(p.power)?p.power:null,ranking,castle:null,truePower:null};
}
