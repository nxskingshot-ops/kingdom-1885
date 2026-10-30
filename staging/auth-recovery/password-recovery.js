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
 status('Rücksetzlink erkannt. Lege jetzt dein neues Passwort fest.');
});
byId('requestForm').addEventListener('submit',async event=>{
 event.preventDefault();
 const button=event.currentTarget.querySelector('button');button.disabled=true;
 status('Wiederherstellungs-E-Mail wird angefordert …');
 try{
  const {error}=await client.auth.resetPasswordForEmail(byId('recoveryEmail').value.trim(),{redirectTo:new URL('./password-recovery.html',location.href).href});
  if(error)throw error;
  status('Anfrage angenommen. Falls ein Konto für diese Adresse besteht, prüfe dein Postfach und den Spamordner. Eine Zustellung ist damit noch nicht bestätigt.');
 }catch{status('E-Mail konnte nicht angefordert werden. Bitte später erneut versuchen.');}
 finally{button.disabled=false;}
});
byId('passwordForm').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!recoveryReady){clearPasswords();status('Ein gültiger Rücksetzlink ist erforderlich.');return;}
 const password=byId('newPassword').value;
 if(password.length<12||password!==byId('confirmPassword').value){clearPasswords();status('Bitte mindestens zwölf Zeichen verwenden und beide Passwörter identisch eingeben.');return;}
 const button=event.currentTarget.querySelector('button');button.disabled=true;
 try{
  const {data,error:identityError}=await client.auth.getUser();
  if(identityError||!data.user){recoveryReady=false;throw Error('invalid_recovery');}
  const {error}=await client.auth.updateUser({password});
  if(error)throw error;
  recoveryReady=false;clearPasswords();byId('passwordForm').hidden=true;
  await client.auth.signOut({scope:'local'});
  status('Passwort geändert. Du kannst dich jetzt auf der Testseite anmelden.');
 }catch{clearPasswords();status('Passwort konnte nicht geändert werden. Der Link könnte abgelaufen sein oder das Passwort die Kontovorgaben nicht erfüllen.');}
 finally{button.disabled=false;}
});
