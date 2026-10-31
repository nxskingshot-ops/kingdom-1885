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
 const rows=[...map].map(([key,b])=>[rankingLabels[key]||b.name,'Value: '+formatPlayerNumber(b.value)+' · Kingdom rank: '+formatPlayerNumber(b.kingdom_rank)+(b.captured_at!=null?' · Source: '+formatPlayerUtc(b.captured_at):'')]);
 for(const b of Array.isArray(v.boards)?v.boards:[])if(b.status==='not_listed'&&!map.has(canonicalRankingName(b.name)))rows.push([rankingLabels[b.name]||b.name,'Not listed in available Top 100 · Source: '+formatPlayerUtc(b.captured_at)]);
 if(v.board_status==='unavailable')rows.push(['Additional kingdom boards','Unavailable; player standings remain displayed']);
 return rows.length?rows:[['Rankings','Not available from this source']];
}
