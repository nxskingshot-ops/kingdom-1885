// ISOLATED TEST ONLY. Directory is server-authorized; never accept user-entered UUIDs.
import {mountPhxRoleEditor} from './phx-role-editor-v2.js';
const URL='https://yuyvmbdybwpwpqsipfjt.supabase.co';
const KEY='sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const status=document.getElementById('status');
const members=document.getElementById('members');
const refresh=document.getElementById('refresh');
async function load(){
 refresh.disabled=true;members.replaceChildren();status.textContent='Loading verified app members…';
 try{
  const {data:{user},error:authError}=await db.auth.getUser();
  if(authError||!user)throw new Error('Sign in required');
  const {data,error}=await db.rpc('phx_list_app_members_v2');
  if(error)throw error;
  status.textContent=data.length+' app member(s) available to administer.';
  for(const record of data){
   const section=document.createElement('section');section.className='card';
   mountPhxRoleEditor({root:section,db,member:{
    user_id:record.user_id,verified:true,app_role:record.app_role,
    display_name:'Member '+record.user_id.slice(0,8),
    protected_owner:record.user_id===user.id || record.app_role==='administrator'
   }});
   members.append(section);
  }
 }catch(e){status.textContent='Members unavailable: '+(e?.message||'Authorization failed');}
 finally{refresh.disabled=false;}
}
refresh.addEventListener('click',load);load();
