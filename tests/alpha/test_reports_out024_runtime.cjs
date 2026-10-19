#!/usr/bin/env node
// Execute the inline reports script in a minimal isolated DOM harness.
// No network, no browser, no production state.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('preview/phalanx-reports-out024-local-adapter-20261019.html','utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
assert(match,'inline adapter script missing');
const elements=Object.fromEntries(['source','status','result','copy','generate'].map(id=>[id,{value:'',textContent:'',disabled:id==='copy',handlers:{},addEventListener(name,fn){this.handlers[name]=fn}}]));
const ctx={document:{getElementById:id=>elements[id]},navigator:{clipboard:{writeText:async()=>{}}}};
vm.runInNewContext(match[1],ctx,{timeout:1000});
function generate(input){elements.source.value=input;elements.generate.handlers.click();return{status:elements.status.textContent,report:elements.result.textContent,disabled:elements.copy.disabled}}
let r=generate(JSON.stringify([{id:'1',alliance:'NXS',quadrant:'N'},{id:'2',alliance:'NXS',quadrant:'N'},{id:'3',alliance:'FRA',quadrant:'W'}]));
assert.match(r.report,/Einträge: 3/);assert.match(r.report,/NXS · N: 2/);assert.match(r.report,/FRA · W: 1/);assert.equal(r.disabled,false);
for(const invalid of ['{',JSON.stringify([{id:'1',alliance:'NXS',quadrant:'X'}]),JSON.stringify([{id:'1',alliance:'NXS',quadrant:'N'},{id:'1',alliance:'FRA',quadrant:'S'}]),JSON.stringify([{alliance:'NXS',quadrant:'N'}]),JSON.stringify(Array.from({length:1001},(_,i)=>({id:String(i),alliance:'NXS',quadrant:'N'})))]){r=generate(invalid);assert.match(r.status,/Import abgelehnt/);assert.equal(r.report,'');assert.equal(r.disabled,true)}
console.log('PASS: 6 runtime cases (valid aggregation, malformed JSON, invalid quadrant, duplicate ID, missing ID, >1000 rows)');
