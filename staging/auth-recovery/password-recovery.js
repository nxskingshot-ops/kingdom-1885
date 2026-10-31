// Isolated recovery UI. Never stores, logs, or exports passwords or recovery tokens.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
const client=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:true}});
const byId=id=>document.getElementById(id);
let recoveryReady=false;
const status=message=>{byId('status').textContent=message;};
const clearPasswords=()=>{byId('newPassword').value='';byId('confirmPassword').value='';};
client.auth.onAuthStateChange(event=>{
 if(event!=='PASSWORD_RECOVERY')return;
 recoveryReady=true;
 byId('requestForm').hidden=true;
 byId('passwordForm').hidden=false;
 history.replaceState(null,'',location.pathname);
 status('Reset link recognized. Choose your new password.');
});
byId('requestForm').addEventListener('submit',async event=>{
 event.preventDefault();
 const button=event.currentTarget.querySelector('button');button.disabled=true;
 status('Requesting recovery email…');
 try{
  const {error}=await client.auth.resetPasswordForEmail(byId('recoveryEmail').value.trim(),{redirectTo:new URL('./password-recovery.html',location.href).href});
  if(error)throw error;
  status('Request accepted. If an account exists for this address, check your inbox and spam folder. Delivery is not yet confirmed.');
 }catch{status('Recovery email could not be requested. Please try again later.');}
 finally{button.disabled=false;}
});
byId('passwordForm').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!recoveryReady){clearPasswords();status('A valid reset link is required.');return;}
 const password=byId('newPassword').value;
 if(password.length<12||password!==byId('confirmPassword').value){clearPasswords();status('Use at least twelve characters and enter the same password twice.');return;}
 const button=event.currentTarget.querySelector('button');button.disabled=true;
 try{
  const {data,error:identityError}=await client.auth.getUser();
  if(identityError||!data.user){recoveryReady=false;throw Error('invalid_recovery');}
  const {error}=await client.auth.updateUser({password});
  if(error)throw error;
  recoveryReady=false;clearPasswords();byId('passwordForm').hidden=true;
  await client.auth.signOut({scope:'local'});
  status('Password changed. You can now sign in to the test site.');
 }catch{clearPasswords();status('Password could not be changed. The link may have expired or the password may not meet the account requirements.');}
 finally{button.disabled=false;}
});
