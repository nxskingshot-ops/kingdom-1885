// ISOLATED TEST ONLY. Never store passwords or use a service-role key.
const URL='https://yuyvmbdybwpwpqsipfjt.supabase.co';
const KEY='sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const form=document.getElementById('login'),status=document.getElementById('status'),signout=document.getElementById('signout'),submit=document.getElementById('submit');
async function refresh(){const {data:{user}}=await db.auth.getUser();form.hidden=!!user;signout.hidden=!user;status.textContent=user?'Signed in: '+(user.email||'isolated account'):'Not signed in.';}
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;status.textContent='Signing in…';try{const email=document.getElementById('email').value.trim();const password=document.getElementById('password').value;const {error}=await db.auth.signInWithPassword({email,password});document.getElementById('password').value='';if(error)throw error;await refresh();}catch(err){status.textContent='Sign-in failed: '+(err.message||'Unknown error');}finally{submit.disabled=false;}});
signout.addEventListener('click',async()=>{signout.disabled=true;try{const {error}=await db.auth.signOut();if(error)throw error;await refresh();}catch(e){status.textContent=e.message||'Sign-out failed';}finally{signout.disabled=false;}});
await refresh();