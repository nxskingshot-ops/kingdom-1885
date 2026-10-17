const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const client=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh');
const form=document.getElementById('reset');
const status=document.getElementById('status');
form.hidden=true;
let verified=false;
client.auth.onAuthStateChange((event)=>{
 if(event==='PASSWORD_RECOVERY'){
  verified=true;
  form.hidden=false;
  status.textContent='Wiederherstellungslink bestätigt. Bitte neues Passwort festlegen.';
 }
});
form.addEventListener('submit',async(event)=>{
 event.preventDefault();
 if(!verified)return;
 const button=form.querySelector('button');
 button.disabled=true;
 const {error}=await client.auth.updateUser({password:document.getElementById('password').value});
 if(error){
  status.textContent='Änderung fehlgeschlagen: '+error.message;
  button.disabled=false;
  return;
 }
 document.getElementById('password').value='';
 form.hidden=true;
 status.textContent='Passwort geändert. Bitte erneut anmelden.';
 await client.auth.signOut();
 history.replaceState(null,'',location.pathname);
});