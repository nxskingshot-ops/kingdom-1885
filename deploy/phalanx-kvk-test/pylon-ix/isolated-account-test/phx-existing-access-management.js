import {PHX_PRODUCTION_SUPABASE_URL as URL,PHX_PRODUCTION_PUBLISHABLE_KEY as KEY} from './phx-production-auth-adapter-v2.js';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.8');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id), status=$('status'), list=$('members');
const login=$('login'), email=$('email'), password=$('password');
// Access V2 is not provisioned in production. Keep all legacy mutation controls disabled.
const ROLE_V2_READY=false;
$('invite').addEventListener('submit',async event=>{
 if(!ROLE_V2_READY){event.preventDefault();say('Invitations are paused until Observer, Operator and Administrator are secured server-side.');return;}
 event.preventDefault();const button=$('send-invite');button.disabled=true;
 try{const role=$('invite-role').value;if(!['kingdom','member'].includes(role))throw Error('Choose a supported legacy role.');
 await rpc('invite',{p_email:$('invite-email').value.trim(),p_player_id:$('invite-player').value.trim(),p_role:role});
 $('invite').reset();await load();say('Invitation recorded in existing PHALANX access management.');}
 catch(e){say('Invitation not saved: '+e.message)}finally{button.disabled=false}
});
login.addEventListener('submit',async event=>{
 event.preventDefault();const button=$('sign-in');button.disabled=true;
 try{const {error}=await db.auth.signInWithPassword({email:email.value.trim(),password:password.value});if(error)throw error;password.value='';await load()}
 catch(e){say('Sign-in failed: '+e.message)}finally{button.disabled=false}
});
function say(s){status.textContent=s}
function node(tag,text){const e=document.createElement(tag);e.textContent=text;return e}
async function rpc(action,params={}){const {data,error}=await db.rpc('phx_access_management',{p_action:action,p_user_id:null,p_email:null,p_player_id:null,p_role:null,...params});if(error)throw error;return data}
async function load(){
 list.replaceChildren();say('Checking existing account…');
 try{
  const {data:{user},error}=await db.auth.getUser();if(error)throw error;if(!user){login.hidden=false;throw Error('Sign in to your existing PHALANX account.');}
  login.hidden=true;
  const access=await rpc('check');if(!access?.allowed)throw Error('Your current session is not authorized to manage accounts.');
  const result=await rpc('list');const accounts=result?.accounts||[];
  say(accounts.length+' manageable regular account(s) returned. Protected administrators and other roles are intentionally excluded. Access V2 role changes are not enabled.');
  $('invite').hidden=true;
  const invites=result?.invitations||[];
  $('invitations').replaceChildren();
  for(const i of invites){$('invitations').append(node('p',i.email+' · Player ID '+i.player_id+' · '+i.role+' · expires '+new Date(i.expires_at).toLocaleDateString()));}
  for(const a of accounts){
   const section=node('section','');section.className='card';
   section.append(node('h3',a.email||'Account'),node('p','Player ID: '+(a.player_id||'—')+' · Status: '+(a.status||'unknown')+' · Legacy role: '+(a.role||'not assigned')));
   if(ROLE_V2_READY && ['active','suspended'].includes(a.status)){
    const action=a.status==='active'?'suspend':'reactivate';
    const button=node('button',action==='suspend'?'Suspend account':'Reactivate account');
    button.addEventListener('click',async()=>{
     if(!confirm(action+' '+a.email+'?'))return;
     button.disabled=true;
     try{await rpc(action,{p_user_id:a.user_id});await load()}catch(e){say('No change: '+e.message);button.disabled=false}
    });section.append(button);
   }
   if(ROLE_V2_READY && a.status==='pending' && a.invited_role && ['kingdom','member'].includes(a.invited_role)){
    for(const action of ['approve','reject']){
      const button=node('button',action==='approve'?'Approve registration':'Reject registration');
      button.addEventListener('click',async()=>{
        if(!confirm(action+' registration for '+a.email+'?'))return;
        button.disabled=true;
        try{await rpc(action,{p_user_id:a.user_id,p_email:a.email,p_player_id:a.player_id,p_role:a.invited_role});await load()}
        catch(e){say('No change: '+e.message);button.disabled=false}
      });section.append(button);
    }
   }
   list.append(section);
  }
 }catch(e){say('Unavailable: '+e.message)}
}
$('refresh').addEventListener('click',load);
load();
