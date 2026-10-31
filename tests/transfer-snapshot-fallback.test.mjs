import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('preview/transfer-id-snapshot-fallback-stage-20261031.ts','utf8').replace(/^import .*;$/m,'');
const origin='https://phalanx-r11-atlas-preview-g7995somu-matze4428-6040.vercel.app';
function setup({live=false,wrongUid=false,role='member'}={}){
 let handler,quota=0,upstream=0;
 const entry={kid:1885,uid:wrongUid?'other':'u1',governor_id:'290591005',score:123,rank:7};
 const admin={rpc:async()=>{quota++;return {data:true}},from(table){assert.ok(['nxs_memberships','phalanx_mightpulse_rank_snapshots'].includes(table));let board;const q={select(){return q},eq(k,v){if(k==='board')board=v;return q},order(){return q},limit(){return q},async maybeSingle(){return {data:table==='nxs_memberships'?{role,active:true}:board==='pet_power'?{board,source_captured_at:'2026-10-30T00:00:00Z',entry_count:1,entries:[entry]}:null}}};return q}};
 const ctx={Request,Response,URL,Date,AbortSignal,createClient:(url,key)=>key==='service'?admin:{auth:{getUser:async()=>({data:{user:{id:'test-user'}}})}},Deno:{env:{get:k=>k==='SUPABASE_SERVICE_ROLE_KEY'?'service':'configured'},serve:h=>handler=h},fetch:async url=>{upstream++;if(String(url).includes('/kingdoms/'))return live?Response.json({boards:[{key:'pet_power',captured_at:'2026-10-31T00:00:00Z',rows:[{...entry,score:999}]}]}):new Response('',{status:503});return Response.json({ok:true,governor_id:'290591005',uid:'u1',cached_at:'2026-10-31T00:00:00Z',player:{governor_id:'290591005',uid:'u1',kid:1885,nick_name:'Synthetic'},ranks:{}})}};
 vm.runInNewContext(source,ctx);
 return {request:(method='GET',o=origin,auth=true)=>handler(new Request('https://example.invalid/?governorId=290591005',{method,headers:{origin:o,...(auth?{authorization:'Bearer test'}:{})}})),counts:()=>({quota,upstream})};
}
test('current immutable origin has exact preflight; foreign origin and missing JWT fail closed',async()=>{
 const x=setup();const pre=await x.request('OPTIONS',origin,false);assert.equal(pre.status,204);assert.equal(pre.headers.get('access-control-allow-origin'),origin);assert.deepEqual(x.counts(),{quota:0,upstream:0});assert.equal((await x.request('GET','https://foreign.invalid')).status,403);assert.equal((await x.request('GET',origin,false)).status,401);assert.deepEqual(x.counts(),{quota:0,upstream:0});
});
test('provider board outage uses identity-matched snapshots with provenance and no writes',async()=>{
 const x=setup(),out=await (await x.request()).json();const pet=out.ranks.values.leaderboards.find(b=>b.name==='pet_power');assert.equal(pet.value,123);assert.equal(pet.source,'saved_snapshot');assert.equal(pet.captured_at,'2026-10-30T00:00:00Z');assert.deepEqual(x.counts(),{quota:1,upstream:2});
});
test('live board is not replaced with saved snapshot; wrong UID never matches',async()=>{
 const live=await (await setup({live:true}).request()).json();assert.equal(live.ranks.values.leaderboards.find(b=>b.name==='pet_power').value,999);
 const mismatch=await (await setup({wrongUid:true}).request()).json();assert.equal(mismatch.ranks.values.leaderboards.length,0);assert.equal(mismatch.ranks.values.boards.find(b=>b.name==='pet_power').status,'not_listed');
});
test('unauthorized role cannot use quota or read provider',async()=>{const x=setup({role:'kingdom'});assert.equal((await x.request()).status,403);assert.deepEqual(x.counts(),{quota:0,upstream:0});});
