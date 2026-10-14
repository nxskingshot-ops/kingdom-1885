"use strict";
// Exact integer troop allocation only. This does NOT estimate Kingshot damage.
function allocate(capacity,ratio){
 if(!Number.isSafeInteger(capacity)||capacity<0)throw Error("capacity must be a nonnegative safe integer");
 if(!Array.isArray(ratio)||ratio.length!==3||ratio.some(n=>!Number.isSafeInteger(n)||n<0)||ratio.every(n=>n===0))throw Error("ratio must be three nonnegative integers with a positive sum");
 const sum=ratio.reduce((a,b)=>a+b,0);
 const raw=ratio.map(n=>capacity*n/sum);
 const base=raw.map(Math.floor);
 let remaining=capacity-base.reduce((a,b)=>a+b,0);
 const order=[0,1,2].sort((a,b)=>(raw[b]-base[b])-(raw[a]-base[a])||a-b);
 for(let i=0;i<remaining;i++)base[order[i]]++;
 return {infantry:base[0],cavalry:base[1],archers:base[2],total:capacity,ratio:ratio.slice()};
}
module.exports={allocate};
