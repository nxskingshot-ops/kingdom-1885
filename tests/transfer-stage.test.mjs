import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('preview/transfer-id-bridge-stage-20261030.ts','utf8').replace(/^import .*;$/m,'');
const origin='https://phalanx-r11-atlas-preview.vercel.app';
function setup(options={}) {
 let handler, calls=0, quotas=0;
 const env={SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:'test-anon',SUPABASE_SERVICE_ROLE_KEY:'test-service',MIGHTPULSE_API_KEY:'test-provider'};
 const membership=options.membership??{role:'member',active:true,expires_at:null};
 const admin={from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:membership,error:null})})})}),rpc:async()=>{quotas++;return {data:options.quota!==false,error:options.quotaError||null}}};
 const client={auth:{getUser:async()=>({data:{user:options.invalid?null:{id:'synthetic',is_anonymous:options.anonymous||false}},error:null})}};
 const context={Request,Response,URL,AbortSignal,Date,console,Deno:{env:{get:k=>env[k]},serve:h=>{handler=h}},createClient:(url,key)=>key==='test-service'?admin:client,fetch:async()=>{calls++; return Response.json(options.payload??{ok:true,governor_id:'290591005',uid:'72632112',player:{governor_id:'290591005',uid:'72632112',kid:1885,nick_name:'Synthetic',power:1},heroes:[{name:'Example',level:80,star:5}],ranks:{power_rank:8}})}};
 vm.runInNewContext(source,context);
 return {run:(method='GET',o=origin,token='test-jwt',query='?governorId=290591005')=>handler(new Request('https://test.invalid/'+query,{method,headers:{...(o?{origin:o}:{}),...(token?{authorization:'Bearer '+token}:{})}})),counts:()=>({calls,quotas})};
}
test('allowed browser preflight returns exact CORS without auth/quota/upstream',async()=>{const x=setup(),r=await x.run('OPTIONS',origin,'');assert.equal(r.status,204);assert.equal(r.headers.get('access-control-allow-origin'),origin);assert.match(r.headers.get('access-control-allow-headers'),/apikey/);assert.deepEqual(x.counts(),{calls:0,quotas:0});});
test('foreign origins rejected before upstream',async()=>{const x=setup(),r=await x.run('GET','https://foreign.invalid');assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null);assert.deepEqual(x.counts(),{calls:0,quotas:0});});
test('missing/invalid/anonymous auth rejected',async()=>{for(const options of [{},{invalid:true},{anonymous:true}]){const x=setup(options),r=await x.run('GET',origin,Object.keys(options).length?'bad':'');assert.equal(r.status,401);assert.equal(x.counts().calls,0);}});
test('inactive, wrong-role and expired memberships rejected',async()=>{for(const membership of [{role:'member',active:false},{role:'kingdom',active:true},{role:'member',active:true,expires_at:'2020-01-01'}]){const x=setup({membership}),r=await x.run();assert.equal(r.status,403);assert.equal(x.counts().calls,0);}});
test('quota exhausted or unavailable fails closed',async()=>{for(const [options,status] of [[{quota:false},429],[{quotaError:{message:'synthetic'}},503]]){const x=setup(options),r=await x.run();assert.equal(r.status,status);assert.equal(x.counts().calls,0);}});
test('bad parameters and methods never call provider',async()=>{const x=setup();for(const q of ['?governorId=0','?governorId=01','?governorId=1&governorId=2','?governorId=1&include=all'])assert.equal((await x.run('GET',origin,'test',q)).status,400);assert.equal((await x.run('POST')).status,405);assert.equal(x.counts().calls,0);});
test('authenticated profile projects bounded arena and rank fields with CORS',async()=>{const x=setup(),r=await x.run(),out=await r.json();assert.equal(r.status,200);assert.equal(out.governorId,'290591005');assert.equal(out.arenaSquad.heroes[0].star,5);assert.equal(out.ranks.values.power_rank,8);assert.equal(r.headers.get('access-control-allow-origin'),origin);assert.equal(r.headers.get('cache-control'),'no-store');assert.deepEqual(x.counts(),{calls:1,quotas:1});assert.ok(!JSON.stringify(out).includes('test-provider'));});
test('unverified identity rejected',async()=>{const x=setup({payload:{ok:true,governor_id:'wrong'}}),r=await x.run();assert.equal(r.status,502);});
test('frontend URL constructor and CSV Blob URL remain native',()=>{const js=readFileSync('preview/transfer-scouting-id-stage-20261030.js','utf8');assert.ok(!/const URL\s*=/.test(js));assert.ok(js.includes('new URL(phxBridgeUrl)'));assert.ok(js.includes('URL.createObjectURL'));assert.ok(js.includes('apikey:KEY'));});
