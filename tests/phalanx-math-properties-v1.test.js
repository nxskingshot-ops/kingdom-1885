const assert=require('node:assert/strict');
const P=require('../src/phalanx-probability-v1.js');
const D=require('../src/phalanx-dependence-bounds-v1.js');
const S=require('../src/phalanx-screenshot-joiner-v2.js');
const R=require('../src/phalanx-robust-ranking-v1.js');
const M=require('../src/phalanx-monte-carlo-v2.js');
let state=1885;
function random(){state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;}
function close(x,y){assert.ok(Math.abs(x-y)<1e-9,`${x} != ${y}`);}
let cases=0;
for(let t=0;t<500;t++){
 const p=Array.from({length:1+t%7},()=>random());
 const exact=P.poissonBinomial(p),bounds=D.analyze(p);
 let enumerated=Array(p.length+1).fill(0);
 for(let mask=0;mask<(1<<p.length);mask++){
   let prob=1,k=0;
   for(let i=0;i<p.length;i++){
     const on=(mask&(1<<i))!==0;
     prob*=on?p[i]:(1-p[i]);if(on)k++;
   }
   enumerated[k]+=prob;
 }
 enumerated.forEach((v,i)=>close(v,exact.distribution[i]));
 close(enumerated.reduce((a,b)=>a+b,0),1);
 close(exact.atLeastOne,bounds.independent.any);
 assert.ok(exact.atLeastOne>=bounds.anyBounds[0]-1e-9);
 assert.ok(exact.atLeastOne<=bounds.anyBounds[1]+1e-9);
 assert.ok(exact.distribution.at(-1)>=bounds.allBounds[0]-1e-9);
 assert.ok(exact.distribution.at(-1)<=bounds.allBounds[1]+1e-9);
 cases++;
}
for(let t=0;t<500;t++){
 const rows=Array.from({length:4},()=>({attack:Math.floor(random()*100),lethality:Math.floor(random()*100)}));
 const result=R.evaluate(rows);
 assert.ok(result.grouped+1e-12>=result.additive);
 close(result.grouped-result.additive,result.attackPct*result.lethalityPct/10000);
 cases++;
}
const group=['Chenko','Yeonwoo','Amane','Helga'].map((name,i)=>({name,level:5,playerId:String(i)}));
const result=S.evaluate(group);
close(result.grouped,R.evaluate(result.rows).grouped);
const zero=M.simulate({skills:[{chance:0,bonus:100,cooldown:2}],trials:100,rounds:10,seed:1885,dependence:'independent'});
assert.equal(zero.mean,0);
const certain=M.simulate({skills:[{chance:1,bonus:2,cooldown:2}],trials:100,rounds:10,seed:1885,dependence:'independent'});
assert.equal(certain.mean,8);
console.log(`${cases} randomized cross-model cases + 3 deterministic edge checks passed`);
