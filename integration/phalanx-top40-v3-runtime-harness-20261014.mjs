// Offline runtime harness: node integration/phalanx-top40-v3-runtime-harness-20261014.mjs
// Mock DOM, Supabase SDK and deferred responses. No network/database writes.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../preview/phalanx-top40-v5-membership-gate-race-v3-candidate-20261014.html',import.meta.url),'utf8');
const js=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(js);
const elements=new Map();
function el(){return {textContent:'',hidden:false,disabled:false,value:'NXS',style:{setProperty(){}},dataset:{},children:[],handlers:{},append(...xs){this.children.push(...xs)},replaceChildren(...xs){this.children=xs},addEventListener(type,cb){this.handlers[type]=cb}}}
const document={getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)},createElement(){return el()}};
const pending={};
function defer(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}}
function query(name){const q={select(){return q},eq(){return q},order(){return pending[name]?.promise??Promise.resolve({data:[],error:null})}};return q}
const listeners=[];
const client={auth:{getUser:()=>pending.user.promise,onAuthStateChange:fn=>listeners.push(fn)},from(name){const q=query(name);if(name==='nxs_memberships'||name==='phalanx_alliance_latest')q.then=(resolve,reject)=>(pending[name]?.promise??Promise.resolve({data:[],error:null})).then(resolve,reject);return q}};
const sandbox={document,console,Date,Number,Error,Promise,importSDK:()=>({createClient:()=>client})};
const runnable=js.replace("await import('https://esm.sh/@supabase/supabase-js@2')","await importSDK()");
vm.runInNewContext(runnable,sandbox);
const tick=()=>new Promise(resolve=>setImmediate(resolve));
pending.user=defer();pending.nxs_memberships=defer();pending.phalanx_alliance_latest=defer();pending.phalanx_alliance_top40=defer();
await tick();
const button=document.getElementById('phalanxLiveTop40Button');
assert.equal(button.disabled,true);
pending.user.resolve({data:{user:{id:'member-1'}},error:null});await tick();
pending.nxs_memberships.resolve({data:[{active:true,expires_at:null}],error:null});await tick();
pending.phalanx_alliance_latest.resolve({data:['NXS','FRA','OoO','MYM'].map(alliance=>({alliance,snapshot_date:'2026-10-13',members:40,total_power:1,tg4:0,tg5:0})),error:null});await tick();
assert.equal(button.disabled,false,'valid membership enables button');
const request=button.handlers.click();await tick();
const select=document.getElementById('phalanxLiveAllianceSelect');select.value='FRA';select.handlers.change();
pending.phalanx_alliance_top40.resolve({data:Array.from({length:40},(_,i)=>({position:i+1,player_name:'test',power:1})),error:null});await request;
assert.equal(document.getElementById('phalanxLiveTop40').hidden,true,'stale selection must not show old data');
listeners[0]('SIGNED_OUT',null);
assert.equal(button.disabled,true,'signout disables button');
console.log('PASS valid member unlock, stale alliance response suppression, signout lock');
