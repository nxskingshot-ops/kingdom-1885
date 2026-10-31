// Proposal only: synthetic tests do not deploy or call the production service.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const origin='https://phalanx-r11-atlas-preview.vercel.app';
const raw=readFileSync('preview/transfer-intelligence-bridge-stage-20261031.ts','utf8');
const source=raw.replace(/^import .*;$/m,'').replace(': Record<string,string>','').replace(':unknown','').replace(':Request','');
function setup(options={}){
 let handler,reads=0,authCalls=0;
 const membership={active:true,role:'member',expires_at:null,...options.membership};
 const observations=[{player_name:'Synthetic',alliance_tag:'QA',coliseum_stage:'11-7'}];
 const client={auth:{getUser:async()=>{authCalls++;return {data:{user:options.invalid?null:{id:'synthetic'}},error:null}}},from(table){const query={select(){return query},eq(){return query},order(){return query},limit(){return query},maybeSingle(){return query},then(resolve){reads++;return Promise.resolve({error:null,data:table==='nxs_memberships'?membership:table==='mystic_trial_observations'? (reads===2?{snapshot_date:'2026-10-31'}:observations):table==='mystic_trial_power_references'?[{player_name:'Synthetic',power_m:123}]:[]}).then(resolve)}};return query;}};
 vm.runInNewContext(source,{Request,Response,Date,Set,String,Deno:{serve:h=>handler=h,env:{get:k=>({SUPABASE_URL:'https://synthetic.invalid',SUPABASE_SERVICE_ROLE_KEY:'synthetic-not-a-real-key'})[k]}},createClient:()=>client});
 return {run:(method='GET',o=origin,token='synthetic')=>handler(new Request('https://synthetic.invalid',{method,headers:{origin:o,...(token?{authorization:'Bearer '+token}:{})}})),stats:()=>({reads,authCalls})};
}
test('stage preflight declares only the exact isolated test origin without reading data',async()=>{const x=setup(),r=await x.run('OPTIONS',origin,'');assert.equal(r.status,204);assert.equal(r.headers.get('access-control-allow-origin'),origin);assert.deepEqual(x.stats(),{reads:0,authCalls:0});});
test('foreign origin and write methods never reach auth or data',async()=>{const x=setup();assert.equal((await x.run('GET','https://foreign.invalid')).status,403);assert.equal((await x.run('POST')).status,405);assert.deepEqual(x.stats(),{reads:0,authCalls:0});});
test('missing or invalid identity is rejected before candidate intelligence data',async()=>{const x=setup();assert.equal((await x.run('GET',origin,'')).status,401);assert.equal(x.stats().reads,0);const y=setup({invalid:true});assert.equal((await y.run()).status,401);assert.equal(y.stats().reads,0);});
test('inactive and expired membership is rejected before private intelligence reads',async()=>{for(const membership of [{active:false},{expires_at:'2020-01-01'}]){const x=setup({membership});assert.equal((await x.run()).status,403);assert.equal(x.stats().reads,1);}});
test('authorized synthetic read returns existing response contract and no secret',async()=>{const x=setup(),r=await x.run(),out=await r.json();assert.equal(r.status,200);assert.equal(out.observations[0].player_name,'Synthetic');assert.equal(out.power_references[0].power_m,123);assert.equal(out.snapshot_date,'2026-10-31');assert.equal(r.headers.get('cache-control'),'no-store');assert.ok(!JSON.stringify(out).includes('synthetic-not-a-real-key'));});
