/* Community-described joiner selection, not officially verified. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PhalanxRallySelection=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function select(joiners,limit=4){
 if(!Array.isArray(joiners)||joiners.length>14||!Number.isInteger(limit)||limit<1||limit>4)throw Error('Invalid rally size or skill slots');
 const seenIds=new Set(),seenOrders=new Set(),eligible=[],noSkill=[];
 for(const j of joiners){
  if(!j||typeof j.playerId!=='string'||!j.playerId.trim()||!Number.isInteger(j.joinOrder)||j.joinOrder<0||j.joinOrder>1000)throw Error('Invalid player or join order');
  if(seenIds.has(j.playerId)||seenOrders.has(j.joinOrder))throw Error('Duplicate player or join order');
  seenIds.add(j.playerId);seenOrders.add(j.joinOrder);
  if(j.hero==null){noSkill.push({...j,reason:'no_first_slot_hero'});continue;}
  if(typeof j.hero!=='string'||!j.hero.trim()||!Number.isInteger(j.skillLevel)||j.skillLevel<1||j.skillLevel>5)throw Error('Invalid first hero or first expedition skill level');
  eligible.push(j);
 }
 eligible.sort((a,b)=>b.skillLevel-a.skillLevel||a.joinOrder-b.joinOrder);
 return {selected:eligible.slice(0,limit),excluded:eligible.slice(limit).map(x=>({...x,reason:'skill_slots_full'})).concat(noSkill),slots:limit,model:'community skill-level priority then join order; unverified in game',warning:'Only first hero first expedition skill considered; chance-based skill effectiveness not modeled'};
}
return {select};});