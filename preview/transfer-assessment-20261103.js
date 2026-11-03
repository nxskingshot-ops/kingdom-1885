// PHALANX transfer assessment: read-only, source-aware, no invented alliance ranks.
import {playerRankingMap,canonicalRankingName} from './transfer-id-display-20261030.js';
const keys=['personal_power','research_power','troop_power','single_hero','hero_total','master_power','pet_power','gov_charm','hero_no_equip'];
const asNumber=x=>x!==null&&x!==undefined&&String(x).trim()!==''&&Number.isFinite(Number(x))?Number(x):null;
export function assessPlayer(values,options={}){
 const map=playerRankingMap(values),evidence=keys.map(key=>({key,value:asNumber(map[key]?.value),rank:asNumber(map[key]?.kingdom_rank),capturedAt:map[key]?.captured_at||null,source:map[key]?.source||'provider'}));
 const ranked=evidence.filter(x=>Number.isInteger(x.rank)&&x.rank>0);
 const strongest=[...ranked].sort((a,b)=>a.rank-b.rank).slice(0,3);
 const weakest=[...ranked].sort((a,b)=>b.rank-a.rank).slice(0,3);
 const research=ranked.find(x=>x.key==='research_power'),troops=ranked.find(x=>x.key==='troop_power');
 const pet=ranked.find(x=>x.key==='pet_power');
 const notes=[];
 if(research?.rank<=10)notes.push('Research is top 10 in the source kingdom');
 if(troops?.rank<=10)notes.push('Troop Power is top 10 in the source kingdom');
 if(pet&&ranked.length>=4&&pet.rank>Math.max(...ranked.filter(x=>x.key!=='pet_power').map(x=>x.rank)))notes.push('Pet Power ranks behind other measured core areas');
 const roles=[
  {role:'Rally Joiner',status:troops?.rank<=15?'potential':'insufficient_evidence',reason:'Troop ranking is only a screening signal; combat stats are not available'},
  {role:'Rally Leader',status:'requires_combat_review',reason:'Rally bonuses, heroes and combat performance not verified'},
  {role:'Garrison Holder',status:'requires_combat_review',reason:'Defensive bonuses and garrison results not verified'},
  {role:'KvK Fighter',status:troops?.rank<=15?'potential':'insufficient_evidence',reason:'Troop ranking does not establish activity or KvK participation'}
 ];
 return {evidence,strongest,weakest,notes,roles,coverage:ranked.length,sourceKingdom:options.kingdom??null,disclaimer:'Kingdom ranks are not alliance ranks. Role signals are provisional.'};
}
export function alliancePlacement(candidate,roster,metric='personal_power',snapshot={}){
 const key=canonicalRankingName(metric);
 const value=asNumber(playerRankingMap(candidate)[key]?.value);
 if(value===null)return {status:'unknown',reason:'Candidate metric unavailable'};
 if(!Array.isArray(roster)||!roster.length)return {status:'unknown',reason:'Alliance roster unavailable'};
 const valid=roster.map(p=>({id:String(p.id??''),value:asNumber(p.metrics?.[key]),alliance:p.alliance,sourceAt:p.capturedAt})).filter(p=>p.value!==null);
 const sameAlliance=valid.every(p=>p.alliance===roster[0]?.alliance);
 const complete=roster.every(p=>p.metrics&&asNumber(p.metrics[key])!==null);
 const sameCapture=valid.length>0&&valid.every(p=>p.sourceAt&&p.sourceAt===valid[0].sourceAt);
 const proven=snapshot.complete===true&&Number.isSafeInteger(snapshot.expectedMemberCount)&&snapshot.expectedMemberCount===roster.length&&typeof snapshot.alliance==='string'&&snapshot.alliance.length>0&&snapshot.alliance===roster[0]?.alliance&&typeof snapshot.capturedAt==='string'&&snapshot.capturedAt.length>0&&snapshot.capturedAt===valid[0]?.sourceAt&&new Set(roster.map(p=>String(p.id??''))).size===roster.length&&roster.every(p=>p.id!=null&&String(p.id).length>0); 
 if(!sameAlliance||!complete||!sameCapture||!proven)return {status:'unknown',reason:'Verified complete alliance roster, distinct IDs and synchronized snapshot metadata required'};
 const ahead=valid.filter(p=>p.value>value).length;
 const tied=valid.filter(p=>p.value===value).length;
 return {status:'ranked',rank:ahead+1,tied,top15:ahead+1<=15,rosterSize:valid.length,metric:key,sourceAt:valid[0].sourceAt};
}
export function chooseComparison(candidate,roster,metric='personal_power'){
 const key=canonicalRankingName(metric),target=asNumber(playerRankingMap(candidate)[key]?.value);
 if(target===null||!Array.isArray(roster))return null;
 const candidates=roster.filter(p=>p&&asNumber(p.metrics?.[key])!==null&&p.id!=null).map(p=>({...p,distance:Math.abs(asNumber(p.metrics[key])-target)}));
 candidates.sort((a,b)=>a.distance-b.distance||String(a.id).localeCompare(String(b.id)));
 return candidates[0]||null;
}
