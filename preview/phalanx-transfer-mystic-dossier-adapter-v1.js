// PHALANX Transfer Scouting -> Account Intelligence, isolated opt-in dossier enhancement.
// No changes to candidate records, role grants, PYLON IX, or existing dossier tabs.
import {analyzeMysticProfile,MYSTIC_BOARDS} from "./phalanx-account-intelligence-core-v1.js";
const NAMES={coliseum:"Coliseum",forest_of_life:"Forest of Life",crystal_cave:"Crystal Cave",knowledge_nexus:"Knowledge Nexus",molten_fort:"Molten Fort",radiant_spire:"Radiant Spire"};
const FUNCTION="phalanx-mystic-six-faqu-stage-20261031";
export function getGovernorId(candidate){
 const raw=candidate?.metadata?.governor_id??candidate?.metadata?.player_id??null;
 return raw!=null&&/^\d{1,20}$/.test(String(raw))?String(raw):null;
}
export function buildMysticBalanceView(profile){
 if(!profile?.governorId||!profile.boards)throw Error("Validated profile required");
 const entries=MYSTIC_BOARDS.map(board=>({board,label:NAMES[board],rank:profile.boards[board]?.rank??null,score:profile.boards[board]?.score??null}));
 return {governorId:profile.governorId,complete:profile.complete,meanRank:profile.meanRank,rankSpread:profile.rankSpread,entries,disclaimer:"Rank positions compare players within each trial; no proven Mystic total formula or combat strength inference."};
}
export async function fetchMysticBalance(db,candidate){
 const id=getGovernorId(candidate);
 if(!id)return {status:"missing_governor_id",message:"Verified player ID required; no automatic name matching."};
 if(!db?.auth?.getUser||!db?.functions?.invoke)throw Error("Authenticated Supabase client required");
 const {data:{user}={},error:authError}=await db.auth.getUser();
 if(authError||!user)return {status:"unauthorized"};
 const {data,error}=await db.functions.invoke(FUNCTION,{method:"GET",headers:{"x-phalanx-source":"transfer-scouting"},/* query supported by supabase-js */ query:{governor_id:id}});
 if(error)return {status:"unavailable",message:"Mystic rankings temporarily unavailable"};
 if(String(data?.governor_id)!==id)return {status:"id_mismatch",message:"Provider returned a different player; results suppressed."};
 return {status:"ok",view:buildMysticBalanceView(analyzeMysticProfile(data,id))};
}
export function renderMysticBalance(container,result){
 if(!container||typeof document==="undefined")throw Error("DOM container required");
 container.replaceChildren();
 const add=(tag,text,parent=container)=>{const el=document.createElement(tag);el.textContent=String(text);parent.append(el);return el;};
 add("h3","Mystic Balance · verified rankings");
 if(result.status!=="ok"){add("p",result.message||result.status);return;}
 const v=result.view;
 add("p",v.complete?"Six of six trials available":"Incomplete top-100 coverage; no balance score calculated.");
 if(v.complete)add("p","Mean rank: "+v.meanRank.toFixed(1)+" · Rank spread: "+v.rankSpread);
 const ul=document.createElement("ul");container.append(ul);
 for(const e of v.entries)add("li",e.label+": "+(e.rank===null?"Outside returned Top 100":"#"+e.rank)+" · "+(e.score===null?"Score unavailable":e.score+" points"),ul);
 add("small",v.disclaimer);
}
