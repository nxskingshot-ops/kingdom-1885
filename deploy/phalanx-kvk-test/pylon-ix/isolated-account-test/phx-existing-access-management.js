import {PHX_PRODUCTION_SUPABASE_URL as URL,PHX_PRODUCTION_PUBLISHABLE_KEY as KEY} from './phx-production-auth-adapter-v2.js';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.8');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id), status=$('status'), list=$('members');
function say(s){status.textContent=s}
function node(tag,text){const e=document.createElement(tag);e.textContent=text;return e}
async function rpc(action,params={}){const {data,error}=await db.rpc('phx_access_management',{p_action:action,p_user_id:null,p_email:null,p_player_id:null,p_role:null,...params});if(error)throw error;return data}
async function load(){
 list.replaceChildren();say('Checking existing account…');
 try{
  const {data:{user},error}=await db.auth.getUser();if(error)throw error;if(!user)throw Error('Sign in to your existing PHALANX account first.');
  const access=await rpc('check');if(!access?.allowed)throw Error('Your current session is not authorized to manage accounts.');
  const result=await rpc('list');const accounts=result?.accounts||[];
  say(accounts.length+' eligible account(s). Existing PHALANX access management — legacy roles only.');
  for(const a of accounts){
   const section=node('section','');section.className='card';
   section.append(node('h3',a.email||'Account'),node('p','Player ID: '+(a.player_id||'—')+' · Status: '+(a.status||'unknown')+' · Legacy role: '+(a.role||'not assigned')));
   if(['active','suspended'].includes(a.status)){
    const action=a.status==='active'?'suspend':'reactivate';
    const button=node('button',action==='suspend'?'Suspend account':'Reactivate account');
    button.addEventListener('click',async()=>{
     if(!confirm(action+' '+a.email+'?'))return;
     button.disabled=true;
     try{await rpc(action,{p_user_id:a.user_id});await load()}catch(e){say('No change: '+e.message);button.disabled=false}
    });section.append(button);
   }
   list.append(section);
  }
 }catch(e){say('Unavailable: '+e.message)}
}
$('refresh').addEventListener('click',load);
load();
