const assert = require('node:assert/strict');
// Isolated unit harness for the compensation decision logic of deployed V3.
// No Supabase requests, credentials, or production data are used.
async function compensate({state, stateError=null, bound=[], bindingError=null, membershipError=null, profileError=null, cleanupResult=true}) {
  const events=[];
  const admin={
    from(table){return {
      select(){return {eq(){return {single:async()=>({data:state,error:stateError})}}}},
      delete(){return {eq:async()=>{events.push('delete:'+table);return {error:table==='nxs_memberships'?membershipError:profileError}}}}
    }},
    rpc:async()=>({data:bound,error:bindingError})
  };
  const cleanup=async()=>{events.push('cleanup:auth');return cleanupResult};
  const id=990017,uid='synthetic-user';
  // Copied from nexus-access-review V3 compensation decision, with TS return type removed.
  const run=async()=>{
    const {data:state,error:stateError}=await admin.from('nexus_access_requests').select('status,granted_user_id').eq('id',id).single();
    const {data:bound,error:bindingError}=await admin.rpc('phx_binding_lookup',{p_request_id:id});
    if(stateError||bindingError||state?.status!=='pending'||state?.granted_user_id||(Array.isArray(bound)&&bound.length>0)) return false;
    const {error:membershipError}=await admin.from('nxs_memberships').delete().eq('user_id',uid);
    const {error:profileError}=await admin.from('app_profiles').delete().eq('user_id',uid);
    if(membershipError||profileError) return false;
    return await cleanup();
  };
  return {ok:await run(),events};
}
(async()=>{
  let n=0;
  async function check(name,settings,expected,events){const r=await compensate(settings);assert.equal(r.ok,expected,name);assert.deepEqual(r.events,events,name);console.log('PASS '+name);n++}
  await check('pending unbound: compensates', {state:{status:'pending',granted_user_id:null}},true,['delete:nxs_memberships','delete:app_profiles','cleanup:auth']);
  await check('approved account: no deletion', {state:{status:'approved',granted_user_id:'user'}},false,[]);
  await check('pending but bound: no deletion', {state:{status:'pending',granted_user_id:null},bound:[{request_id:990017}]},false,[]);
  await check('uncertain request lookup: no deletion', {state:null,stateError:{message:'network'}},false,[]);
  await check('uncertain binding lookup: no deletion', {state:{status:'pending'},bindingError:{message:'network'}},false,[]);
  await check('membership deletion failure: no auth deletion', {state:{status:'pending'},membershipError:{message:'denied'}},false,['delete:nxs_memberships','delete:app_profiles']);
  await check('auth cleanup failure: reported failure', {state:{status:'pending'},cleanupResult:false},false,['delete:nxs_memberships','delete:app_profiles','cleanup:auth']);
  console.log(`RESULT ${n}/${n} unit cases passed; NOT a live Edge Function fault injection test`);
})().catch(e=>{console.error(e);process.exitCode=1});
