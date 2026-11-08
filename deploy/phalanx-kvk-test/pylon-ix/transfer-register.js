// PHALANX registration — isolated review branch only.
// Never grant membership or privileged roles from self-supplied player IDs.
const SUPABASE_URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const SUPABASE_ANON_KEY="sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh"; // Existing public/publishable client key; not a service-role secret.
const form=document.getElementById('register');
const status=document.getElementById('status');
const show=document.getElementById('show');
const password=document.getElementById('password');
const confirmPassword=document.getElementById('confirm');
if(!form||!status||!show||!password||!confirmPassword)throw Error('Registration form is incomplete.');
show.addEventListener('change',()=>{password.type=confirmPassword.type=show.checked?'text':'password';});
form.addEventListener('submit',async event=>{
 event.preventDefault();
 const submit=form.querySelector('button[type="submit"],button:not([type])');
 if(submit?.disabled)return;
 const email=document.getElementById('email').value.trim();
 const playerId=document.getElementById('playerId').value.trim();
 const pass=password.value;
 if(!/^[0-9]{1,20}$/.test(playerId)){status.textContent='Enter a valid numeric Kingshot Player ID.';return;}
 if(pass.length<12||pass!==confirmPassword.value){status.textContent='Passwords must match and contain at least 12 characters.';return;}
 if(!SUPABASE_ANON_KEY){status.textContent='Registration is not yet configured. Please contact the administrator.';return;}
 if(submit)submit.disabled=true;
 status.textContent='Submitting registration…';
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data,error}=await db.auth.signUp({email,password:pass,options:{data:{kingshot_player_id:playerId}}});
  if(error)throw error;
  status.textContent=data?.user?'Registration request received. Please check your email if confirmation is required. Access is granted only after administrator approval.':'If registration can proceed, check your email for the next step. Administrator approval is still required.';
  form.reset();password.type=confirmPassword.type='password';
 }catch(error){
  status.textContent='Registration could not be completed: '+(error?.message||'Please try again later.');
 }finally{password.value='';confirmPassword.value='';if(submit)submit.disabled=false;}
});
