// Uses Supabase Auth recovery tokens; no password is stored in application tables.
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh');
const $=id=>document.getElementById(id);
const status=message=>$('status').textContent=message;
const resetMode=()=>{$('request').hidden=true;$('reset').hidden=false;status('Enter and confirm your new password.');};
db.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')resetMode();});
const params=new URLSearchParams(location.search);
if(params.get('error')||params.get('error_description'))status('This recovery link is invalid or expired. Request a new link.');
if(params.get('code')){const {error}=await db.auth.exchangeCodeForSession(params.get('code'));if(error)status('This recovery link has expired or was already used. Request another.');else resetMode();}
$('request').addEventListener('submit',async event=>{event.preventDefault();const email=$('email').value.trim();const button=$('request').querySelector('button');button.disabled=true;try{await db.auth.resetPasswordForEmail(email,{redirectTo:new URL('./password-recovery.html',location.href).href});status('If the account exists, a recovery email will arrive shortly. Check your spam folder too.');}catch{status('Unable to request a recovery link right now. Please try again later.');}finally{button.disabled=false;}});
$('show').addEventListener('change',()=>{for(const id of ['password','confirm'])$(id).type=$('show').checked?'text':'password';});
$('reset').addEventListener('submit',async event=>{event.preventDefault();if($('password').value!==$('confirm').value){status('Passwords do not match.');return;}if($('password').value.length<12){status('Use at least 12 characters.');return;}const button=$('reset').querySelector('button');button.disabled=true;try{const {error}=await db.auth.updateUser({password:$('password').value});if(error){status('Password could not be updated. Request a fresh recovery link.');return;}$('password').value='';$('confirm').value='';await db.auth.signOut();$('reset').hidden=true;status('Password updated. Return to Transfer Scouting to sign in.');}catch{status('Password update failed. Please try again.');}finally{button.disabled=false;}});
