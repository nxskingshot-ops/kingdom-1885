/* PHALANX modifier math · reproducible scenario proxy · not actual Kingshot damage */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PhalanxModifierMath=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function finite(n,label){if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>100000)throw Error('Invalid '+label);return n}
function evaluate({attack,lethality,baseline='snapshot',mode='rally',effects=[]}) {
finite(attack,'attack');finite(lethality,'lethality');
if(!['snapshot','reconstruct'].includes(baseline)||!['rally','bear','arena'].includes(mode)||!Array.isArray(effects))throw Error('Invalid scenario');
const ids=new Set(),rows=[];let addAttack=0,addLethality=0;
for(const e of effects){if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id))throw Error('Duplicate or invalid effect');ids.add(e.id);finite(e.value,'effect value');if(!['attack','lethality'].includes(e.stat)||!Array.isArray(e.modes)||!e.modes.every(x=>['rally','bear','arena'].includes(x)))throw Error('Invalid effect metadata');if(typeof e.active!=='boolean'||typeof e.inSnapshot!=='boolean')throw Error('Invalid effect flags');
let reason=e.active?'included':'inactive';if(reason==='included'&&!e.modes.includes(mode))reason='mode_excluded';if(reason==='included'&&baseline==='snapshot'&&e.inSnapshot)reason='already_in_snapshot';if(reason==='included'){if(e.stat==='attack')addAttack+=e.value;else addLethality+=e.value}rows.push({id:e.id,reason,contribution:reason==='included'?e.value:0})}
const before=(1+attack/100)*(1+lethality/100),after=(1+(attack+addAttack)/100)*(1+(lethality+addLethality)/100);
if(!Number.isFinite(before)||!Number.isFinite(after)||before<=0)throw Error('Invalid proxy');
return {attackAfter:attack+addAttack,lethalityAfter:lethality+addLethality,relativeGainPct:(after/before-1)*100,rows,model:'illustrative offensive proxy; not calibrated game damage'};
}return {evaluate};});
