// ISOLATED TEST ONLY — not connected to production
// Staging-only review queue. No automatic permission assignment.
const URL='https://yuyvmbdybwpwpqsipfjt.supabase.co',KEY='sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const queue=document.getElementById('queue'),status=document.getElementById('status'),reload=document.getElementById('reload');
async function call(action,extra={}){
 const {data:{session}}=await db.auth.getSession();
 if(!session?.access_token)throw Error('Sign in required');
 const r=await fetch(URL+'/functions/v1/phx-registration-v2',{method:'POST',headers:{apikey:KEY,authorization:'Bearer '+session.access_token,'content-type':'application/json'},body:JSON.stringify({action,...extra})});
 let body;try{body=await r.json();}catch{throw Error('Review service unavailable');}
 if(!r.ok)throw Error(body?.error||'Review unavailable');return body;
}
async function load(){
 reload.disabled=true;queue.replaceChildren();status.textContent='Loading pending requests…';
 try{
  const result=await call('review_queue');
  status.textContent=result.applications.length+' pending request(s).';
  for(const a of result.applications){
   const card=document.createElement('article');card.className='card';
   const heading=document.createElement('h2');heading.textContent='Player ID: '+a.player_id;
   const note=document.createElement('p');note.textContent='Submitted: '+new Date(a.submitted_at).toLocaleString();
   const message=document.createElement('input');message.placeholder='Optional message to applicant (max 500 characters)';message.maxLength=500;
   const roleLabel=document.createElement('label');roleLabel.textContent='PHALANX role on approval';
   const role=document.createElement('select');
   for(const [value,name] of [['observer','Observer'],['operator','Operator'],['administrator','Administrator']]){
    const option=document.createElement('option');option.value=value;option.textContent=name;role.append(option);
   }
   roleLabel.append(role);
   const actions=document.createElement('div');actions.className='actions';
   for(const [decision,label] of [['approved','Approve review'],['rejected','Decline request']]){
    const button=document.createElement('button');button.textContent=label;
    button.addEventListener('click',async()=>{
     const isApproval=decision==='approved';
     const description=isApproval
      ?'Approve player '+a.player_id+' and grant PHALANX '+role.value+'? This changes app access.'
      :'Decline registration for player '+a.player_id+'?';
     if(!window.confirm(description))return;
     button.disabled=true;
     try{
      if(decision==='approved')await call('approve_with_role_v2',{application_id:a.id,app_role:role.value,message:message.value});
      else await call('review',{application_id:a.id,decision,message:message.value});
      await load();
     }
     catch(e){status.textContent=e?.message||'Review failed';button.disabled=false;}
    });actions.append(button);
   }
   card.append(heading,note,message,roleLabel,actions);queue.append(card);
  }
 }catch(e){status.textContent=e?.message||'Review queue unavailable';}
 finally{reload.disabled=false;}
}
reload.addEventListener('click',load);load();
