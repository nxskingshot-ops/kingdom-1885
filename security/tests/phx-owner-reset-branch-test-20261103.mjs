// Run: node security/tests/phx-owner-reset-branch-test-20261103.mjs
// Isolated executable test of the ACTUAL reset branch, without Supabase credentials.
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const source = readFileSync('security/patches/nexus-access-review-owner-reset-guard-20261103.ts', 'utf8');
const start = source.indexOf('  if(body.action==="reset"){');
const end = source.indexOf('\n\n  if(request.status!=="pending")', start);
assert.ok(start >= 0 && end > start, 'reset branch anchors must match deployed v6 draft');
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const execute = new AsyncFunction('body','request','membership','admin','Deno','password','reply',source.slice(start,end)+'\nreturn {status:599};');
const owner='11111111-1111-4111-8111-111111111111';
const member='22222222-2222-4222-8222-222222222222';
const scenarios=[
  {name:'owner denied',target:owner,expected:403,calls:0},
  {name:'missing owner config fails closed',env:'',expected:503,calls:0},
  {name:'ordinary admin reset succeeds',expected:200,calls:1},
  {name:'R4 reset denied',role:'r4',expected:403,calls:0},
  {name:'pending request denied',status:'pending',expected:409,calls:0},
];
for(const c of scenarios){
  let calls=0;
  const admin={auth:{admin:{updateUserById:async()=>{calls++;return {data:{user:{email:'fixture@example.invalid'}},error:null};}}}};
  const result=await execute(
    {action:'reset'},
    {status:c.status??'approved',granted_user_id:c.target??member,granted_role:'member'},
    {role:c.role??'admin'},
    admin,
    {env:{get:()=>c.env===undefined?owner:c.env}},
    ()=>'fixture-password',
    (body,status=200)=>({body,status})
  );
  assert.equal(result.status,c.expected,c.name+' HTTP status');
  assert.equal(calls,c.calls,c.name+' privileged auth call count');
  console.log('PASS '+c.name);
}
console.log('PASS 5/5 isolated branch tests; NO real Supabase/Auth calls');
