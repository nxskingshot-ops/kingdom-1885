// PHALANX isolated read-only ID bridge. No database writes.
// Deploy only after rate limiting and authorized browser tests are prepared.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store','vary':'Origin'}});
Deno.serve(async req=>{
 if(req.method!=='GET')return json({ok:false,error:'method_not_allowed'},405);
 const auth=req.headers.get('authorization')||'';
 if(!/^Bearer\s+[^\s]+$/i.test(auth))return json({ok:false,error:'unauthorized'},401);
 const url=new URL(req.url),id=url.searchParams.get('governorId');
 const origin=req.headers.get('origin');if(origin)return json({ok:false,error:'browser_origin_not_enabled'},403);
 if(url.searchParams.size!==1||!/^[1-9][0-9]{0,15}$/.test(id||''))return json({ok:false,error:'invalid_governor_id'},400);
 const supabaseUrl=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),key=Deno.env.get('MIGHTPULSE_API_KEY');
 if(!supabaseUrl||!anon||!service||!key)return json({ok:false,error:'configuration_unavailable'},503);
 const client=createClient(supabaseUrl,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await client.auth.getUser(auth.replace(/^Bearer\s+/i,''));
 if(error||!user||user.is_anonymous)return json({ok:false,error:'unauthorized'},401);
 const admin=createClient(supabaseUrl,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:membership,error:membershipError}=await admin.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
 if(membershipError)return json({ok:false,error:'authorization_unavailable'},503);
 if(!membership||membership.active!==true||!['member','r4','r5','admin'].includes(String(membership.role).toLowerCase())||(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now()))return json({ok:false,error:'forbidden'},403);
 const {data:quotaGranted,error:quotaError}=await admin.rpc('phx_take_transfer_id_quota',{p_user:user.id});
 if(quotaError)return json({ok:false,error:'rate_limit_unavailable'},503);
 if(quotaGranted!==true)return json({ok:false,error:'rate_limit_exceeded'},429);
 // Browser-origin requests remain blocked until a persistent shared rate limiter is installed.
 // This is a server-only staging implementation, not a public browser endpoint.
 try{
  const upstream=await fetch('https://api.mightpulse.com/v1/players/'+id+'?include=base,heroes,ranks',{headers:{'X-Api-Key':key},redirect:'error',signal:AbortSignal.timeout(95000)});
  if(!upstream.ok)return json({ok:false,error:'upstream_unavailable'},upstream.status===404?404:502);
  const d=await upstream.json(),p=d?.player;
  if(d?.ok!==true||String(d.governor_id)!==id||String(p?.governor_id??p?.fid)!==id||String(d.uid)!==String(p?.uid)||!Number.isSafeInteger(p?.kid)||p.kid<1)return json({ok:false,error:'identity_unverified'},502);
  const scalar=v=>typeof v==='string'?v.slice(0,200):typeof v==='number'&&Number.isFinite(v)?v:null;
  const heroes=Array.isArray(d.heroes)?d.heroes.slice(0,20).map(h=>({name:scalar(h?.name),level:scalar(h?.level),stars:scalar(h?.stars),star:scalar(h?.star)})):null;
  const ranks=d.ranks&&typeof d.ranks==='object'&&!Array.isArray(d.ranks)?Object.fromEntries(['power_rank','kills_rank','migrant_rank','mystic_trial'].map(k=>[k,scalar(d.ranks[k])])):null;
  return json({ok:true,governorId:id,uid:String(d.uid),player:{name:scalar(p.nick_name),kingdom:p.kid,power:scalar(p.power),alliance:scalar(p.alliance?.abbr)},source:{cachedAt:scalar(d.cached_at),fresh:typeof d.fresh==='boolean'?d.fresh:null,ageSeconds:scalar(d.age_seconds)},arenaSquad:{status:heroes?'available':'missing',heroes},ranks:{status:ranks?'available':'missing',values:ranks},checkedAtUtc:new Date().toISOString()});
 }catch{return json({ok:false,error:'upstream_unavailable'},502);}
});
