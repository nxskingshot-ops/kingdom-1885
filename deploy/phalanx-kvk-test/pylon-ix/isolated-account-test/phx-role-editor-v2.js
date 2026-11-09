// PHALANX Access V2 — isolated role editor controller.
// Explicitly NOT a production integration. Mount on an existing authenticated
// staging page with #phx-role-editor and an authenticated Supabase client.
// Requires server-side verified administrator bootstrap. No client-side grants.
export const PHX_APP_ROLES = Object.freeze([
 {value:'observer',label:'Observer'},
 {value:'operator',label:'Operator'},
 {value:'administrator',label:'Administrator'}
]);
export function mountPhxRoleEditor({root,db,member}) {
 if (!root || !db || !member?.user_id || !member?.verified) {
  throw new Error('Verified member and authenticated client required');
 }
 root.replaceChildren();
 const heading=document.createElement('h3');
 heading.textContent='Member permissions';
 const identity=document.createElement('p');
 identity.textContent=member.display_name || 'Verified member';
 const gameRank=document.createElement('small');
 gameRank.textContent=member.game_rank ? 'Kingshot rank: '+member.game_rank : 'Kingshot rank not verified';
 const label=document.createElement('label');label.textContent='PHALANX app role';
 const select=document.createElement('select');
 for (const role of PHX_APP_ROLES) {
  const opt=document.createElement('option');
  opt.value=role.value;opt.textContent=role.label;
  select.append(opt);
 }
 select.value=PHX_APP_ROLES.some(r=>r.value===member.app_role)?member.app_role:'observer';
 const reason=document.createElement('textarea');
 reason.maxLength=500;reason.placeholder='Reason for role change (required)';
 const save=document.createElement('button');
 save.type='button';save.textContent='Save app role';
 const feedback=document.createElement('p');
 feedback.setAttribute('role','status');
 save.addEventListener('click',async()=>{
  const role=select.value;
  const explanation=reason.value.trim();
  if(explanation.length<3){feedback.textContent='Please enter a reason (at least 3 characters).';return;}
  if(member.protected_owner){feedback.textContent='Protected owner: role changes disabled.';return;}
  if(!window.confirm('Change PHALANX app role to '+role+' for '+identity.textContent+'?'))return;
  save.disabled=true;feedback.textContent='Saving…';
  try {
   const {data,error}=await db.rpc('phx_set_app_role_v2',{
    p_target_user_id:member.user_id,p_new_role:role,p_reason:explanation
   });
   if(error)throw error;
   feedback.textContent=data?.changed?'Role updated and audited.':'No role change required.';
   member.app_role=role;
  } catch(e) {
   feedback.textContent='Role not changed: '+(e?.message||'Permission or network error');
  } finally {save.disabled=false;}
 });
 if(member.protected_owner){select.disabled=true;save.disabled=true;}
 root.append(heading,identity,gameRank,label,select,reason,save,feedback);
 return {destroy(){root.replaceChildren();}};
}
