const assert=require("node:assert/strict");
const S=require("../src/phalanx-joiner-search-v1.js");
const a=[{name:"C1",playerId:"1",level:5,group:"101",bonusPct:25},{name:"C2",playerId:"2",level:5,group:"101",bonusPct:25},{name:"A1",playerId:"3",level:5,group:"102",bonusPct:25},{name:"A2",playerId:"4",level:5,group:"102",bonusPct:25},{name:"C3",playerId:"5",level:5,group:"101",bonusPct:25}];
assert.equal(S.search(a).evaluated,5);
assert.equal(S.search(a).top[0].groupedFactor,2.25);
assert.equal(S.search(a).top[0].minFactor,2);
assert.throws(()=>S.search(a.slice(0,3)));
assert.throws(()=>S.search(a.map(x=>({...x,level:0}))));
console.log("5 search tests passed");
