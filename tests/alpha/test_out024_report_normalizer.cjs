#!/usr/bin/env node
const assert=require('node:assert/strict');
const {normalize}=require('../../preview/phalanx-out024-report-normalizer-20261019.js');
const base=(id,x,y)=>({source_key:id,alliance:'NXS',coord_x:x,coord_y:y});
assert.deepEqual(normalize([base('N',0,0),base('O',600,0),base('S',600,600),base('W',0,600)]).map(r=>r.quadrant),['N','O','S','W']);
assert.equal(normalize([base('A',1199,1199)])[0].id,'A');
assert.deepEqual(normalize([]),[]);
assert.deepEqual(normalize([base(' OP1 ',0,0)]),[{id:'OP1',alliance:'NXS',quadrant:'N'}]);
assert.throws(()=>normalize([base('OP1',0,0),base(' OP1 ',1,1)]));
for(const invalid of [
 null,{},Array.from({length:1001},(_,i)=>base(String(i),0,0)),
 [base('A',1,1),base('A',2,2)],[base('',0,0)],[base('A',-1,0)],
 [base('A',1200,0)],[base('A',0,NaN)],[base('A','1',0)],
 [{source_key:'A',alliance:'',coord_x:1,coord_y:1}],
 [{source_key:1,alliance:'NXS',coord_x:1,coord_y:1}]
])assert.throws(()=>normalize(invalid));
const src=JSON.stringify([base('A',1,2)]);normalize(JSON.parse(src));assert.equal(JSON.stringify([base('A',1,2)]),src);
console.log('PASS: OUT-024 pure normalizer boundary and invalid-input tests');
