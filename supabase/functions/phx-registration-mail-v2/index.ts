// PHALANX V2 email worker. SOURCE ONLY — NOT DEPLOYED.
// Requires service-role access, Resend API credentials and atomic claim RPCs.
// Provider idempotency keys limit duplicates if the worker crashes after send.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
Deno.serve(async request=>{
 if(request.method!=='POST')return respond({error:'Method not allowed'},405);
 const token=Deno.env.get('PHX_MAIL_WORKER_TOKEN');
 const supplied=request.headers.get('authorization');
 if(!token||!supplied||supplied!=='Bearer '+token)return respond({error:'Unauthorized'},401);
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 const apiKey=Deno.env.get('RESEND_API_KEY'),from=Deno.env.get('PHX_MAIL_FROM');
 if(!url||!key||!apiKey||!from)return respond({error:'Worker not configured'},503);
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:jobs,error:claimError}=await db.rpc('phx_claim_registration_email',{p_limit:5});
 if(claimError)return respond({error:'Queue unavailable'},503);
 let delivered=0,failed=0;
 for(const job of jobs??[]){
  let success=false,code='delivery_failed';
  try{
   const {data:{user},error:userError}=await db.auth.admin.getUserById(job.requester_user_id);
   if(userError||!user?.email||!user.email_confirmed_at){code='recipient_unconfirmed';}
   else{
    const isApproved=job.event_type==='approved',isRejected=job.event_type==='rejected';
    if(!isApproved&&!isRejected){code='unsupported_event';}
    else{
     const subject=isApproved?'PHALANX registration review: approved':'PHALANX registration review: declined';
     const body=isApproved
       ?'Your PHALANX registration request has been approved for review purposes. Module access is activated separately and may not yet be available.'
       :'Your PHALANX registration request was declined. Please contact your PHALANX administrator if you need assistance.';
     const response=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{'authorization':'Bearer '+apiKey,'content-type':'application/json','Idempotency-Key':'phx-registration-event-'+job.event_id},
      body:JSON.stringify({from,to:[user.email],subject,text:body}),
     });
     if(response.ok){success=true;code='';}
     else{code='provider_http_'+response.status;}
    }
   }
  }catch{code='provider_unreachable';}
  const {data:completed,error:completeError}=await db.rpc('phx_complete_registration_email',{
   p_outbox_id:job.outbox_id,p_token:job.claim_token,p_success:success,p_error:code,
  });
  if(completeError||completed!==true){failed++;continue;}
  if(success)delivered++;else failed++;
 }
 return respond({processed:(jobs??[]).length,delivered,failed});
});
