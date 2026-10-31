// Map only confirmed bridge fields. Never infer recruitment assessments or overwrite records.
export function candidateFromLookup(payload, expectedId, now=new Date().toISOString()) {
 const id=String(expectedId),p=payload?.player;
 if(!/^[1-9][0-9]{0,15}$/.test(id)||payload?.ok!==true||String(payload.governorId)!==id)throw Error('Player identity could not be confirmed.');
 if(typeof p?.name!=='string'||!p.name.trim()||p.name.length>90||!Number.isSafeInteger(p.kingdom)||p.kingdom<1)throw Error('Player name or kingdom is missing. Load player data again.');
 const power=p.power===null||p.power===undefined||p.power===''?null:Number(p.power);
 const text=x=>typeof x==='string'||typeof x==='number'?String(x).slice(0,200):null;
 const heroes=Array.isArray(payload.arenaSquad?.heroes)?payload.arenaSquad.heroes.slice(0,5).map(h=>({name:text(h.name),level:text(h.level),star:text(h.stars??h.star)})):[];
 const values=Object.fromEntries(['power_rank','kills_rank','migrant_rank','mystic_trial'].map(k=>[k,text(payload.ranks?.values?.[k])]));
 return {candidate_id:'NXS-GOV-'+id,player_name:p.name.trim(),kingdom:String(p.kingdom),alliance:text(p.alliance),power_m:power!==null&&Number.isFinite(power)&&power>=0?power/1e6:null,contact_status:'Scouted',metadata:{governor_id:id,player_id:id,source_uid:text(payload.uid),external_lookup:{checked_at_utc:text(payload.checkedAtUtc),source_cached_at:text(payload.source?.cachedAt),arena_squad:{status:text(payload.arenaSquad?.status),heroes},ranks:{status:text(payload.ranks?.status),values}}},updated_at:now};
}
export function duplicateLookupFilter(id) {
 if(!/^[1-9][0-9]{0,15}$/.test(String(id)))throw Error('Invalid Kingshot Player ID.');
 return 'candidate_id.eq.NXS-GOV-'+id+',metadata->>governor_id.eq.'+id+',metadata->>player_id.eq.'+id;
}
