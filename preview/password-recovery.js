const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const client=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh');
const form=document.getElementById('reset');
const status=document.getElementById('status');
form.hidden=true;
let verified=false;
const password=document.getElementById('password');
const confirmation=document.getElementById('confirmPassword');
const submit=document.getElementById('submitPassword');
const matchMessage=document.getElementById('matchMessage');
const toggle=document.getElementById('togglePassword');
let saving=false;
function validatePasswords(){
 const enough=password.value.length>=12;
 const same=password.value===confirmation.value;
 submit.disabled=!(verified&&!saving&&enough&&same);
 matchMessage.classList.toggle('error',confirmation.value.length>0&&!same);
 matchMessage.textContent=!password.value&&!confirmation.value?'Bitte beide Felder ausfüllen.'
  :!enough?'Mindestens 12 Zeichen erforderlich.'
  :!confirmation.value?'Bitte Passwort bestätigen.'
  :!same?'Die Passwörter stimmen nicht überein.':'Die Passwörter stimmen überein.';
 return !submit.disabled;
}
password.addEventListener('input',validatePasswords);
confirmation.addEventListener('input',validatePasswords);
toggle.addEventListener('click',()=>{
 const show=password.type==='password';
 password.type=confirmation.type=show?'text':'password';
 toggle.textContent=show?'Verbergen':'Anzeigen';
 toggle.setAttribute('aria-pressed',String(show));
});
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
  validatePasswords();
 }
});
form.addEventListener('submit',async(event)=>{
 event.preventDefault();
 if(!validatePasswords())return;
 saving=true;
 submit.disabled=true;
 const {error}=await client.auth.updateUser({password:password.value});
 if(error){
  status.textContent='Änderung fehlgeschlagen: '+error.message;
  saving=false;
  validatePasswords();
  return;
 }
 password.value='';
 confirmation.value='';
 form.hidden=true;
 status.textContent='Passwort geändert. Bitte erneut anmelden.';
 await client.auth.signOut();
 history.replaceState(null,'',location.pathname);
});