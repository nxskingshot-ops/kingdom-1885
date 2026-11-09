import test from 'node:test';
import assert from 'node:assert/strict';
import {loadCurrentProductionIdentity} from './phx-production-auth-adapter-v2.js';
test('signed-out user has no permissions',async()=>{
 const db={auth:{getUser:async()=>({data:{user:null},error:null})},from(){throw Error('must not read memberships')}};
 const x=await loadCurrentProductionIdentity(db);assert.equal(x.canManage,false);assert.equal(x.appRole,null);
});
test('signed-in admin loads own membership without granting app role',async()=>{
 let queried=false;
 const db={auth:{getUser:async()=>({data:{user:{id:'test-user'}},error:null})},
 from(table){assert.equal(table,'nxs_memberships');return {select(cols){assert.equal(cols,'role,active,expires_at');return {eq(key,id){assert.equal(key,'user_id');assert.equal(id,'test-user');return {maybeSingle:async()=>{queried=true;return {data:{role:'admin',active:true,expires_at:null},error:null}}}}}}}}};
 const x=await loadCurrentProductionIdentity(db);assert.equal(queried,true);assert.equal(x.canManage,true);assert.equal(x.appRole,null);
});
test('membership lookup failure fails closed',async()=>{
 const db={auth:{getUser:async()=>({data:{user:{id:'test-user'}},error:null})},
 from(){return {select(){return {eq(){return {maybeSingle:async()=>({data:null,error:new Error('RLS denied')})}}}}}}};
 await assert.rejects(()=>loadCurrentProductionIdentity(db),/RLS denied/);
});
