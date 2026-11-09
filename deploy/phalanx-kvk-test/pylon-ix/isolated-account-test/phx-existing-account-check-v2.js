// Read-only production sign-in verification. Never writes membership or app roles.
import {PHX_PRODUCTION_SUPABASE_URL as URL,PHX_PRODUCTION_PUBLISHABLE_KEY as KEY,loadCurrentProductionIdentity} from './phx-production-auth-adapter-v2.js';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const form=document.getElementById('login'),status=document.getElementById('status'),signout=document.getElementById('signout'),submit=document.getElementById('submit'),details=document.getElementById('details');
async function refresh(){
  const identity=await loadCurrentProductionIdentity(db);
  form.hidden=!!identity.user;signout.hidden=!identity.user;
  status.textContent=identity.user?'Signed in to existing PHALANX account.':'Not signed in.';
  details.textContent=identity.user?('Membership: '+(identity.membership?.role||'none')+' · Active: '+(identity.membership?.active===true?'yes':'no')+' · Legacy admin: '+(identity.canManage?'yes':'no')+' · Access V2 role: not assigned'):'';
}
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;status.textContent='Signing in…';try{
 const email=document.getElementById('email').value.trim(),password=document.getElementById('password').value;
 const {error}=await db.auth.signInWithPassword({email,password});
 if(error)throw error;await refresh();
}catch(err){status.textContent='Sign-in failed: '+(err.message||'Unknown error');}finally{document.getElementById('password').value='';submit.disabled=false;}});
signout.addEventListener('click',async()=>{signout.disabled=true;try{const {error}=await db.auth.signOut();if(error)throw error;await refresh();}catch(err){status.textContent=err.message||'Sign-out failed';}finally{signout.disabled=false;}});
try{await refresh()}catch(err){status.textContent='Unable to verify session: '+(err.message||'Unknown error')}
