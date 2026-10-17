// NEXUS PHALANX — isolated deployment-path candidate.
// Matches the published recovery HTML IDs: #reset, #status, #password.
// Do not deploy without reviewing the original HTML and an authorized Preview approval.
// The key below is the existing PUBLIC Supabase publishable key, not a secret.
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const client=createClient('https://hcjrdofkdkasznywvcxo.supabase.co','sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh');
const form=document.getElementById('reset');
const status=document.getElementById('status');
const password=document.getElementById('password');
if(!form||!status||!password)throw new Error('Recovery page elements missing');
const submit=form.querySelector('button[type="submit"]')||form.querySelector('button');
if(!submit)throw new Error('Recovery submit button missing');
const query=new URLSearchParams(location.search);
const hash=new URLSearchParams(location.hash.slice(1));
const hasRecoveryLink=query.get('type')==='recovery'||hash.get('type')==='recovery'||query.has('code')||hash.has('access_token');
let verified=false,completed=false,busy=false;
form.hidden=true;
status.setAttribute('role','status');
status.setAttribute('aria-live','polite');
function addVisibility(input){
 const button=document.createElement('button');
 button.type='button';
 button.textContent='Anzeigen';
 button.setAttribute('aria-label','Passwort anzeigen');
 button.addEventListener('click',()=>{
  const visible=input.type==='text';
  input.type=visible?'password':'text';
  button.textContent=visible?'Anzeigen':'Verbergen';
  button.setAttribute('aria-label',visible?'Passwort anzeigen':'Passwort verbergen');
 });
 input.insertAdjacentElement('afterend',button);
}
password.minLength=12;
password.autocomplete='new-password';
addVisibility(password);
const label=document.createElement('label');
label.htmlFor='confirm-password';
label.textContent='Neues Passwort wiederholen';
const confirm=document.createElement('input');
confirm.id='confirm-password';
confirm.type='password';
confirm.required=true;
confirm.minLength=12;
confirm.autocomplete='new-password';
submit.insertAdjacentElement('beforebegin',label);
label.insertAdjacentElement('afterend',confirm);
addVisibility(confirm);
function message(value){status.textContent=value;}
message(hasRecoveryLink?'Wiederherstellungslink wird geprüft …':'Bitte fordere über die Anmeldung einen neuen Wiederherstellungslink an.');
// Subscribe before explicitly initializing auth: the published version did the reverse.
client.auth.onAuthStateChange(event=>{
 if(completed||!hasRecoveryLink)return;
 if(event==='PASSWORD_RECOVERY'){
  verified=true;
  form.hidden=false;
  message('Wiederherstellungslink bestätigt. Bitte neues Passwort festlegen.');
 }
});
if(hasRecoveryLink){
 // The client may have started initialization on creation; the listener is
 // registered before this explicit call, and late failures cannot hide the form.
 client.auth.initialize().then(({error})=>{
  if(!verified&&!completed&&error)message('Wiederherstellungslink konnte nicht geprüft werden. Bitte neuen Link anfordern.');
 }).catch(()=>{
  if(!verified&&!completed)message('Wiederherstellung fehlgeschlagen. Bitte neuen Link anfordern.');
 });
}
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!verified||completed||busy)return;
 if(password.value.length<12){message('Bitte mindestens 12 Zeichen verwenden.');return;}
 if(password.value!==confirm.value){message('Die Passwörter stimmen nicht überein.');return;}
 busy=true;submit.disabled=true;
 try{
  const {error}=await client.auth.updateUser({password:password.value});
  if(error)throw error;
  completed=true;verified=false;
  password.value='';confirm.value='';
  form.hidden=true;
  message('Passwort geändert. Bitte erneut anmelden.');
  history.replaceState(null,'',location.pathname);
  // Deliberately no automatic navigation to Outpost.
  // Do not call signOut here: auth listeners elsewhere may redirect.
 }catch{
  message('Passwortänderung fehlgeschlagen. Bitte erneut versuchen.');
 }finally{busy=false;submit.disabled=false;}
});
