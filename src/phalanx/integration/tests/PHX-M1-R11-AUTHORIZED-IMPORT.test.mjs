import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const script=readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'../PHX-M1-R11-AUTHORIZED-IMPORT.js'),'utf8');
const row=id=>({id,source_key:'manual',alliance:'NXS',structure_type:'outpost',coord_x:100,coord_y:200,level:1});
function harness(){
 const listeners=new Map(), events=[];
 const element=()=>({style:{},children:[],append(...v){this.children.push(...v)},prepend(v){this.children.unshift(v)},setAttribute(){},addEventListener(k,cb){listeners.set(k,cb)},textContent:'',files:[]});
 const map=element(),input=element(),elements=[];
 const document={getElementById:id=>id==='map'?map:null,createElement:()=>{const e=elements.length===1?input:element();elements.push(e);return e}};
 const window={dispatchEvent:e=>events.push(e.type)};
 vm.runInNewContext(script,{document,window,Event:class{constructor(type){this.type=type}}});
 return {window,input,events,async choose(file){input.files=file?[file]:[];await listeners.get('change')()},row};
}
test('valid authorized rows activate provider',async()=>{
 const h=harness();await h.choose({size:300,text:async()=>JSON.stringify([row('A')])});
 assert.equal((await h.window.PHALANX_OUTPOST_DATA_PROVIDER()).rows[0].id,'A');
 assert.equal(h.events.filter(x=>x==='phx-outpost-provider-changed').length,2);
});
test('invalid replacement revokes old provider immediately',async()=>{
 const h=harness();await h.choose({size:300,text:async()=>JSON.stringify([row('A')])});
 await h.choose({size:10,text:async()=>'{invalid'});
 assert.equal(h.window.PHALANX_OUTPOST_DATA_PROVIDER,undefined);
});
test('stale asynchronous import cannot override newer data',async()=>{
 const h=harness();let release;
 const pending=new Promise(resolve=>{release=resolve});
 const first=h.choose({size:200,text:()=>pending});
 await h.choose({size:200,text:async()=>JSON.stringify([row('NEW')])});
 release(JSON.stringify([row('OLD')]));await first;
 assert.equal((await h.window.PHALANX_OUTPOST_DATA_PROVIDER()).rows[0].id,'NEW');
});
test('rejects duplicate IDs and out-of-range coordinates',async()=>{
 for(const rows of [[row('X'),row('X')],[{...row('X'),coord_x:1200}]]){
 const h=harness();await h.choose({size:300,text:async()=>JSON.stringify(rows)});
 assert.equal(h.window.PHALANX_OUTPOST_DATA_PROVIDER,undefined);
 }
});
