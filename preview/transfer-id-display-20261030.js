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

// Provider leaderboards carry raw values AND kingdom ranks. Never treat missing ranks as zero.
export function playerRankingRows(values) {
 const v=values||{},rows=[];
 for(const [key,label] of [['power','Total Power'],['kills','Kills'],['migrant_score','Transfer score'],['mystic_trial','Mystic Trial score']])
  if(v[key]!==null&&v[key]!==undefined&&v[key]!=='')rows.push([label,formatPlayerNumber(v[key])]);
 for(const [key,label] of [['power_rank','Power rank'],['kills_rank','Kills rank'],['migrant_rank','Transfer rank']])
  if(v[key]!==null&&v[key]!==undefined&&v[key]!=='')rows.push([label,formatPlayerNumber(v[key])]);
 for(const b of Array.isArray(v.leaderboards)?v.leaderboards:[]) {
  if(typeof b?.name!=='string'||!b.name.trim())continue;
  rows.push([b.name,'Value: '+formatPlayerNumber(b.value)+' · Kingdom rank: '+formatPlayerNumber(b.kingdom_rank)]);
 }
 return rows.length?rows:[['Rankings','Not available from this source']];
}
