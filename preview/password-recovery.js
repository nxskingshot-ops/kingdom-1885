const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const client=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh');
const form=document.getElementById('reset');
const status=document.getElementById('status');
form.hidden=true;
let verified=false;
const query=new URLSearchParams(location.search);
const hash=new URLSearchParams(location.hash.slice(1));
const hasRecoveryLink=query.get('type')==='recovery'||hash.get('type')==='recovery'||query.has('code')||hash.has('access_token')||hash.has('error_code');
status.textContent=hasRecoveryLink
 ? 'Wiederherstellungslink wird geprüft …'
 : 'Bitte fordere über die Anmeldung einen neuen Wiederherstellungslink an.';
if(hasRecoveryLink){
 client.auth.initialize().then(({error})=>{
  if(!verified)status.textContent=error
   ? 'Wiederherstellungslink konnte nicht geprüft werden: '+error.message
   : 'Wiederherstellung nicht bestätigt. Bitte einen neuen Link anfordern.';
 }).catch(()=>{if(!verified)status.textContent='Wiederherstellung fehlgeschlagen. Bitte einen neuen Link anfordern.';});
}
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