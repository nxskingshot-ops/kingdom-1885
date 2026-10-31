// Display-only helpers. Original player IDs and provider values stay unchanged.
export function formatPlayerNumber(value) {
 if(value===null||value===undefined||value==='')return 'Not available';
 if(typeof value!=='number'&&typeof value!=='string')return 'Not available';
 const number=Number(value);
 return Number.isFinite(number)&&number>=0?number.toLocaleString('en-US',{maximumFractionDigits:0}):'Not available';
}
export function formatPlayerUtc(value) {
 if(value===null||value===undefined||value==='')return 'Not available';
 let date;
 if(typeof value==='number'||(typeof value==='string'&&/^\d+(?:\.\d+)?$/.test(value))){
  const number=Number(value);
  if(!Number.isFinite(number)||number<0)return 'Not available';
  date=new Date(number>=1e12?number:number*1000);
 }else if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)&&/(?:Z|[+-]\d{2}:\d{2})$/.test(value))date=new Date(value);
 else return 'Not available';
 if(!Number.isFinite(date.getTime()))return 'Not available';
 const iso=date.toISOString();
 return iso.slice(0,10)+' · '+iso.slice(11,19)+' UTC';
}
export function formatPlayerSection(status) {
 return ({available:'Available',empty:'No entries',missing:'Not available',unexpected_shape:'Unsupported data format'})[status]||'Unconfirmed';
}
export function playerLookupError(status) {
 return ({401:'Your session has expired. Please sign in again.',403:'Your account does not have permission for this lookup.',404:'No player was found for this Kingshot Player ID.',429:'The lookup quota has been reached. Please try again later.',502:'The player data source is unavailable or returned unconfirmed data.',503:'Player lookup is unavailable. Please try again later.',504:'The player data source did not respond in time.'})[status]||'Lookup unavailable ('+status+').';
}

// Provider leaderboard names are documented keys, never inferred Mystic Trial stages.
export const rankingLabels={personal_power:'Total Power',kills:'Kills',town_center:'Town Center',rebel_conquest:'Rebel Conquest',single_hero:'Single Hero',hero_total:'Hero Total',troop_power:'Troop Power',building_power:'Building Power',research_power:'Research Power',hero_no_equip:'Heroes without Equipment',hero_equip:'Hero Equipment',gov_gear:'Governor Gear',gov_charm:'Governor Charms',pet_power:'Pet Power',island_prosperity:'Island Prosperity',migrant_score:'Transfer Score',mystic_trial:'Mystic Trial',coliseum:'Coliseum',forest_of_life:'Forest of Life',crystal_cave:'Crystal Cave',knowledge_nexus:'Knowledge Nexus',molten_fort:'Molten Fort',radiant_spire:'Radiant Spire',master_power:'Master Power'};
export function canonicalRankingName(name){
 const key=String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
 return ({power:'personal_power',total_power:'personal_power',kill_count:'kills',town_center_level:'town_center',governor_gear:'gov_gear',governor_charms:'gov_charm',hero_equipment:'hero_equip',heroes_without_equipment:'hero_no_equip'})[key]||key;
}
export function playerRankingMap(values){
 const v=values||{},out={};
 const stamp=value=>{const text=formatPlayerUtc(value);return text==='Not available'?null:Date.parse(text.replace(' · ','T').replace(' UTC','Z'));};
 const put=(key,item)=>{const old=out[key],a=stamp(old?.captured_at),b=stamp(item.captured_at);if(!old||(b!==null&&(a===null||b>=a))||(a===null&&b===null))out[key]=item;};
 for(const [key,field,rank] of [['personal_power','power','power_rank'],['kills','kills','kills_rank'],['town_center','town_center_level','town_center_rank'],['migrant_score','migrant_score','migrant_rank'],['mystic_trial','mystic_trial','mystic_rank']])
  if(v[field]!=null||v[rank]!=null)put(key,{name:key,value:v[field],kingdom_rank:v[rank],captured_at:v.player_captured_at});
 for(const b of Array.isArray(v.leaderboards)?v.leaderboards:[])if(typeof b?.name==='string'&&b.name.trim())put(canonicalRankingName(b.name),b);
 return out;
}
export function playerRankingRows(values) {
 const v=values||{},map=new Map(Object.entries(playerRankingMap(v)));
 const rows=[...map].map(([key,b])=>[rankingLabels[key]||b.name,'Value: '+formatPlayerNumber(b.value)+' · Kingdom rank: '+formatPlayerNumber(b.kingdom_rank)+rankingSourceText(b)]);
 for(const b of Array.isArray(v.boards)?v.boards:[])if(b.status==='not_listed'&&!map.has(canonicalRankingName(b.name)))rows.push([rankingLabels[b.name]||b.name,'Not listed in available Top 100'+rankingSourceText(b)]);
 if(v.board_status==='unavailable')rows.push(['Additional kingdom boards','Unavailable; player standings remain displayed']);
 return rows.length?rows:[['Rankings','Not available from this source']];
}
export function rankingSourceText(entry){return ' · '+(entry?.source==='saved_snapshot'?'Saved snapshot':'Provider data')+' · Source: '+formatPlayerUtc(entry?.captured_at);}

// Reuse PHX-TC-TRUEGOLD-INTERPRETATION-20261021; do not extrapolate TG tiers.
export function formatCastle(value){
 if(value===null||value===undefined||value==='')return 'Not available';
 if(typeof value==='string'&&!/^\d+$/.test(value))return value;
 const raw=Number(value);if(!Number.isSafeInteger(raw)||raw<1)return 'Not available';
 if(raw>=40&&raw<=55){const tier=raw>=50?5:raw>=45?4:3,base=tier===5?50:tier===4?45:40;return 'TG'+tier+' '+(raw-base)+'/5';}
 return 'TC '+raw;
}
export function compactPower(value){
 if(value===null||value===undefined||value==='')return 'Not available';
 const n=Number(value);if(!Number.isFinite(n)||n<0)return 'Not available';
 return n>=1e6?(n/1e6).toLocaleString('en-US',{maximumFractionDigits:2})+' M':formatPlayerNumber(n);
}
export function playerSummaryMetrics(values,profile={}){
 const v=values||{},map=playerRankingMap(v);
 const number=x=>!['number','string'].includes(typeof x)||String(x).trim()===''?null:Number.isFinite(Number(x))&&Number(x)>=0?Number(x):null;
 const profileEntry=number(profile.power)===null?null:{value:profile.power,captured_at:profile.captured_at,source:profile.source};
 let power=number(map.personal_power?.value)!==null?map.personal_power:profileEntry;
 if(profileEntry&&formatPlayerUtc(profileEntry.captured_at)!=='Not available'&&(formatPlayerUtc(power?.captured_at)==='Not available'||formatPlayerUtc(profileEntry.captured_at)>formatPlayerUtc(power.captured_at)))power=profileEntry;
 const metric=(key,label,entry,castle=false)=>({key,label,value:number(entry?.value),rank:entry?.kingdom_rank??null,text:castle?formatCastle(entry?.value):compactPower(entry?.value),captured_at:entry?.captured_at,details:entry?('Exact value: '+formatPlayerNumber(entry.value)+rankingSourceText(entry)):'No verified value available.'});
 const totals=[power,...(Array.isArray(v.leaderboards)?v.leaderboards:[]).filter(e=>canonicalRankingName(e?.name)==='personal_power')].filter(Boolean);
 const troops=[map.troop_power,...(Array.isArray(v.leaderboards)?v.leaderboards:[]).filter(e=>canonicalRankingName(e?.name)==='troop_power')].filter(Boolean);
 const pairs=[];
 for(const total of totals)for(const troop of troops){const time=formatPlayerUtc(total.captured_at);if(time!=='Not available'&&time===formatPlayerUtc(troop.captured_at)&&number(total.value)!==null&&number(troop.value)!==null&&number(total.value)>=number(troop.value))pairs.push({total,troop,time});}
 pairs.sort((a,b)=>b.time.localeCompare(a.time));
 const pair=pairs[0],truePower=metric('true_power','True Power',pair?{value:Number(pair.total.value)-Number(pair.troop.value),captured_at:pair.total.captured_at}:null);
 truePower.calculated=Boolean(pair);truePower.details=pair?'Calculated: '+formatPlayerNumber(pair.total.value)+' minus '+formatPlayerNumber(pair.troop.value)+'. Matched source: '+pair.time+'. Non-troop power, not a battle prediction.':'Requires measured Total Power and Troop Power from the same source capture.';
 const castle=metric('castle','Castle / Truegold',map.town_center,true);
 if(castle.value===null&&profile.castle_level){castle.text=formatCastle(profile.castle_level);castle.details='Saved castle: '+profile.castle_level+'. Current source value unavailable.';}
 return [metric('power','Power',power),truePower,metric('master_power','Master Power',map.master_power),metric('pet_power','Pet Power',map.pet_power),metric('hero_total','Hero Power',map.hero_total),castle];
}
