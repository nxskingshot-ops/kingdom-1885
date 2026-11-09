// Read-only status screen; no grants, request creation, or privileged calls.
// Registration request linkage and event emails are NOT yet implemented.
const URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const state=document.getElementById('state'),details=document.getElementById('details'),refresh=document.getElementById('refresh');
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
async function check(){
 refresh.disabled=true;state.textContent='Checking your account…';details.textContent='';
 try{
  const {data:{user},error:userError}=await db.auth.getUser();
  if(userError)throw userError;
  if(!user){state.textContent='Sign in required';details.textContent='Please sign in to view your account access status.';return;}
  if(!user.email_confirmed_at){state.textContent='Email confirmation may be required';details.textContent='Check your email if confirmation was requested. Access requires administrator approval.';return;}
  const {data:membership,error}=await db.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
  if(error)throw error;
  const active=membership?.active===true&&(!membership.expires_at||new Date(membership.expires_at)>new Date());
  if(active){state.textContent='Module membership active';details.textContent='Your account has an active membership. Available modules depend on server-side permissions. Return to sign in to continue.';}
  else{state.textContent='Awaiting access approval';details.textContent='Your account exists, but no active PHALANX membership was found. A review request is not yet automatically created by registration. Contact an administrator if you have not already requested access.';}
 }catch(e){state.textContent='Status temporarily unavailable';details.textContent='Please retry later. No access changes were made.';console.error('PHALANX status check failed',e?.name||'error');}
 finally{refresh.disabled=false;}
}
refresh.addEventListener('click',check);check();
