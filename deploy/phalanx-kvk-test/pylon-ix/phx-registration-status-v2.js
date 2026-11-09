// PHALANX staging-only account status + request submission. No role grants.
const URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const state=document.getElementById('state'),details=document.getElementById('details'),refresh=document.getElementById('refresh'),requestButton=document.getElementById('request-access');
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
async function endpoint(action,token,extra={}){
 const response=await fetch(URL+'/functions/v1/phx-registration-v2',{method:'POST',headers:{'authorization':'Bearer '+token,'apikey':KEY,'content-type':'application/json'},body:JSON.stringify({action,...extra})});
 let data;try{data=await response.json();}catch{throw Error('Registration service unavailable');}
 if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'Registration service unavailable');
 return data;
}
async function check(){
 refresh.disabled=true;requestButton.hidden=true;state.textContent='Checking your account…';details.textContent='';
 try{
  const {data:{user},error:userError}=await db.auth.getUser();
  if(userError)throw userError;
  if(!user){state.textContent='Sign in required';details.textContent='Please sign in to view your account status.';return;}
  if(!user.email_confirmed_at){state.textContent='Confirm your email';details.textContent='Please use the confirmation link sent to your email before requesting access.';return;}
  const {data:{session}}=await db.auth.getSession();
  if(!session?.access_token){state.textContent='Sign in required';details.textContent='Please sign in again.';return;}
  const result=await endpoint('status',session.access_token);
  if(result.application){
   const status=result.application.status;
   state.textContent=status==='pending'?'Awaiting administrator review':status==='approved'?'Approved — access pending':status==='rejected'?'Request declined':'Registration status unavailable';
   details.textContent=result.application.public_message|| (status==='approved'?'Approval was recorded, but an active module membership is not yet confirmed.':status==='pending'?'Your request has been submitted. Refresh to check for a decision.':'Contact an administrator if you need help.');
   if(status==='rejected')requestButton.hidden=false;
  }else{
   state.textContent='No access request submitted';details.textContent='Your account exists, but you have not submitted a PHALANX access request.';requestButton.hidden=false;
  }
 }catch(e){state.textContent='Status temporarily unavailable';details.textContent='The registration service could not be reached. No access decision can be inferred. Please try again later.';console.error('PHALANX status check failed',e?.name||'error');}
 finally{refresh.disabled=false;}
}
requestButton.addEventListener('click',async()=>{
 const playerId=window.prompt('Enter your numeric Kingshot Player ID');
 if(playerId===null)return;
 if(!/^[0-9]{1,20}$/.test(playerId)){state.textContent='Invalid player ID';details.textContent='Enter 1–20 digits only.';return;}
 requestButton.disabled=true;
 try{
  const {data:{session}}=await db.auth.getSession();
  if(!session?.access_token)throw Error('Please sign in again');
  await endpoint('submit',session.access_token,{player_id:playerId});
  await check();
 }catch(e){state.textContent='Request not submitted';details.textContent=e?.message||'Please try again later.';}
 finally{requestButton.disabled=false;}
});
refresh.addEventListener('click',check);check();
