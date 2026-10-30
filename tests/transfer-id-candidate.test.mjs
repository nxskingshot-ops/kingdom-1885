import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {candidateFromLookup,duplicateLookupFilter} from '../preview/transfer-id-candidate-20261030.js';
const id='290591005';
const payload={ok:true,governorId:id,uid:'12345',player:{name:'Synthetic',kingdom:1885,alliance:'NXS',power:232228946},source:{cachedAt:1793392324.689},checkedAtUtc:'2026-10-30T20:32:05Z',arenaSquad:{status:'available',heroes:[{name:'Example',level:80,star:4}]},ranks:{status:'available',values:{power_rank:9,mystic_trial:1561}}};
test('confirmed lookup maps exact identity, power units and bounded evidence without invented fields',()=>{
 const out=candidateFromLookup({...payload,secret:'DO NOT COPY'},id,'2026-10-30T21:00:00Z');
 assert.equal(out.candidate_id,'NXS-GOV-'+id);assert.equal(out.power_m,232.228946);assert.equal(out.metadata.governor_id,id);assert.equal(out.metadata.player_id,id);
 assert.equal(out.metadata.external_lookup.ranks.values.mystic_trial,'1561');assert.equal(out.metadata.external_lookup.arena_squad.heroes[0].star,'4');
 for(const key of ['notes','castle_level','recruiter','transfer_eligibility'])assert.equal(out[key],undefined);
 assert.equal(out.metadata.role,undefined);assert.equal(out.metadata.fit,undefined);assert.equal(out.metadata.mystic_trials,undefined);assert.ok(!JSON.stringify(out).includes('DO NOT COPY'));
});
test('missing power remains unknown; zero power preserved; malformed identities/names/kingdoms rejected',()=>{
 assert.equal(candidateFromLookup({...payload,player:{...payload.player,power:null}},id).power_m,null);
 assert.equal(candidateFromLookup({...payload,player:{...payload.player,power:0}},id).power_m,0);
 for(const p of [{...payload,ok:false},{...payload,governorId:'999'},{...payload,player:{...payload.player,name:''}},{...payload,player:{...payload.player,kingdom:0}}])assert.throws(()=>candidateFromLookup(p,id));
 assert.throws(()=>duplicateLookupFilter('1,other.eq.2'));
});
const source=readFileSync('preview/transfer-scouting-id-stage-20261030.js','utf8').split('/* ID-first candidate onboarding.')[1].split('\ncheck();')[0];
function setup(options={}){
 const nodes=new Map();const $=k=>{if(!nodes.has(k))nodes.set(k,{hidden:false,disabled:false,textContent:'',value:'',querySelector(){return $('lookupButton')},addEventListener(t,f){this[t]=f}});return nodes.get(k)};
 $('phxGovernorId').value=id;$('private').hidden=!!options.loggedOut;
 let writes=0,reads=0,refreshes=0,views=[],resolveInsert;
 const draft=candidateFromLookup(payload,id);let recorded;
 const insertResult=async()=>{if(options.hold)await new Promise(r=>resolveInsert=r);return options.writeError?{error:options.writeError}:{data:{candidate_id:draft.candidate_id}}};
 const db={from:()=>({
  select:()=>({or:filter=>{
   assert.equal(filter,duplicateLookupFilter(id));
   return {limit:async()=>{reads++;return options.readError?{error:{message:'test'}}:{data:options.duplicate?[{candidate_id:'old'}]:[]};}};
  }}),
  insert:data=>{writes++;recorded=data;return {select:()=>({maybeSingle:insertResult})};}
 })};
 const context={candidateFromLookup,duplicateLookupFilter,$,canEdit:options.canEdit!==false,phxIdForm:$('phxIdForm'),active:null,Date,Error,db,load:async()=>{refreshes++;return true},showWorkspace:v=>views.push(v)};
 vm.createContext(context);vm.runInContext('/* ID-first candidate onboarding.'+source,context);
 return {$,offer:()=>context.offerLookupCandidate(payload,id),save:()=>$('phxAdoptCandidate').onclick(),state:()=>({writes,reads,refreshes,views,recorded}),release:()=>resolveInsert()};
}
test('lookup offers candidate but never writes; explicit save inserts only new record then reloads',async()=>{
 const x=setup();x.offer();assert.equal(x.state().writes,0);assert.equal(x.$('phxAdoptCandidate').hidden,false);await x.save();assert.equal(x.state().writes,1);assert.equal(x.state().refreshes,1);assert.equal(x.state().recorded.metadata.governor_id,id);assert.deepEqual(x.state().views,['scoutingBoard']);assert.match(x.$('workspaceNotice').textContent,/gespeichert/);
});
test('member, logged-out and changed-ID flows cannot save',async()=>{for(const o of [{canEdit:false},{loggedOut:true},{changed:true}]){const x=setup(o);x.offer();if(o.changed){x.$('phxGovernorId').value='999';x.$('phxGovernorId').input();}await x.save();assert.equal(x.state().writes,0);}});
test('legacy duplicate or failed duplicate read never inserts or updates',async()=>{for(const o of [{duplicate:true},{readError:true}]){const x=setup(o);x.offer();await x.save();assert.equal(x.state().writes,0);assert.equal(x.state().refreshes,0);assert.equal(x.$('phxAdoptCandidate').disabled,false);}});
test('PK race and save failure show errors without success or refresh',async()=>{for(const error of [{code:'23505'},{message:'RLS denied'}]){const x=setup({writeError:error});x.offer();await x.save();assert.equal(x.state().writes,1);assert.equal(x.state().refreshes,0);assert.equal(x.$('workspaceNotice').textContent,'');assert.ok(x.$('phxAdoptStatus').textContent);assert.equal(x.$('phxGovernorId').disabled,false);}});
test('rapid double-click has one insert; second click ignored while save in flight',async()=>{const x=setup({hold:true});x.offer();const a=x.save();await new Promise(r=>setImmediate(r));await x.save();assert.equal(x.state().writes,1);x.release();await a;assert.equal(x.state().refreshes,1);});
