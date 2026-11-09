// ISOLATED TEST ONLY — not connected to production
// PHALANX staging-only account status + request submission. No role grants.
const URL='https://yuyvmbdybwpwpqsipfjt.supabase.co';
const KEY='sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4';
const state=document.getElementById('state'),details=document.getElementById('details'),refresh=document.getElementById('refresh'),requestButton=document.getElementById('request-access');
const playerInput=document.getElementById('player-id'),playerLabel=document.getElementById('player-label');
const showRequest=(visible)=>{requestButton.hidden=!visible;playerInput.hidden=!visible;playerLabel.hidden=!visible;};
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const endedSessionCodes=new Set(['session_not_found','session_expired','refresh_token_not_found','refresh_token_already_used','bad_jwt']);
const isEndedSession=(error)=>error?.name==='AuthSessionMissingError'||endedSessionCodes.has(error?.code)||error?.status===401;
function showSignIn(){
 showRequest(false);
 state.textContent='Sign in required';
 details.textContent='Please sign in again to view your account status.';
}
async function endpoint(action,token,extra={}){
 const response=await fetch(URL+'/functions/v1/phx-registration-v2',{method:'POST',headers:{'authorization':'Bearer '+token,'apikey':KEY,'content-type':'application/json'},body:JSON.stringify({action,...extra})});
 if(response.status===401)throw Object.assign(new Error('Authentication required'),{status:401});
 let data;try{data=await response.json();}catch{throw Error('Registration service unavailable');}
 if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'Registration service unavailable');
 return data;
}
async function check(){
 refresh.disabled=true;showRequest(false);state.textContent='Checking your account…';details.textContent='';
 try{
  const {data:{session},error:sessionError}=await db.auth.getSession();
  if(sessionError)throw sessionError;
  if(!session?.access_token){showSignIn();return;}
  const {data:{user},error:userError}=await db.auth.getUser();
  if(userError)throw userError;
  if(!user){showSignIn();return;}
  if(!user.email_confirmed_at){state.textContent='Confirm your email';details.textContent='Please use the confirmation link sent to your email before requesting access.';return;}
  const result=await endpoint('status',session.access_token);
  if(result.legacy_membership_active){
   state.textContent='Existing alliance membership';
   details.textContent='Your alliance membership is active. PHALANX module permissions are managed separately; no new registration request is needed.';
  }else if(result.application){
   const status=result.application.status;
   state.textContent=status==='pending'?'Awaiting administrator review':status==='approved'?'Approved — access pending':status==='rejected'?'Request declined':'Registration status unavailable';
   details.textContent=result.application.public_message|| (status==='approved'?'Approval was recorded, but an active module membership is not yet confirmed.':status==='pending'?'Your request has been submitted. Refresh to check for a decision.':'Contact an administrator if you need help.');
   if(status==='rejected')showRequest(true);
  }else{
   state.textContent='No access request submitted';details.textContent='Your account exists, but you have not submitted a PHALANX access request.';showRequest(true);
  }
 }catch(e){
  if(isEndedSession(e)){showSignIn();return;}
  state.textContent='Status temporarily unavailable';
  details.textContent='The registration service could not be reached. No access decision can be inferred. Please try again later.';
  console.error('PHALANX status check failed',e?.name||'error');
 }
 finally{refresh.disabled=false;}
}
requestButton.addEventListener('click',async()=>{
 const playerId=playerInput.value.trim();
 if(!/^[0-9]{1,20}$/.test(playerId)){state.textContent='Invalid player ID';details.textContent='Enter 1–20 digits only.';return;}
 requestButton.disabled=true;
 try{
  const {data:{session},error:sessionError}=await db.auth.getSession();
  if(sessionError)throw sessionError;
  if(!session?.access_token){showSignIn();return;}
  await endpoint('submit',session.access_token,{player_id:playerId});
  await check();
 }catch(e){
  if(isEndedSession(e)){showSignIn();return;}
  state.textContent='Request not submitted';details.textContent=e?.message||'Please try again later.';
 }
 finally{requestButton.disabled=false;}
});
refresh.addEventListener('click',check);check();
