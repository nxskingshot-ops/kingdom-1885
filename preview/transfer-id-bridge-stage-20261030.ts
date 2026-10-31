// PHALANX isolated read-only ID bridge. No database writes.
// Deploy only after rate limiting and authorized browser tests are prepared.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
const allowedOrigins=new Set(['https://phalanx-r11-atlas-preview.vercel.app','https://phalanx-r11-atlas-preview-hwmocd03j-matze4428-6040.vercel.app']);
const corsHeaders=(origin)=>origin&&allowedOrigins.has(origin)?{'access-control-allow-origin':origin,'access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':'authorization, apikey, content-type','access-control-max-age':'600'}:{};
const json=(body,status=200,origin=null)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store','vary':'Origin',...corsHeaders(origin)}});
Deno.serve(async req=>{
 const origin=req.headers.get('origin');
 const reply=(body,status=200)=>json(body,status,origin);
 if(origin&&!allowedOrigins.has(origin))return reply({ok:false,error:'origin_forbidden'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{...corsHeaders(origin),'vary':'Origin'}});
 if(req.method!=='GET')return reply({ok:false,error:'method_not_allowed'},405);
 const auth=req.headers.get('authorization')||'';
 if(!/^Bearer\s+[^\s]+$/i.test(auth))return reply({ok:false,error:'unauthorized'},401);
 const url=new URL(req.url),id=url.searchParams.get('governorId');

 if(url.searchParams.size!==1||!/^[1-9][0-9]{0,15}$/.test(id||''))return reply({ok:false,error:'invalid_governor_id'},400);
 const supabaseUrl=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),key=Deno.env.get('MIGHTPULSE_API_KEY');
 if(!supabaseUrl||!anon||!service||!key)return reply({ok:false,error:'configuration_unavailable'},503);
 const client=createClient(supabaseUrl,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await client.auth.getUser(auth.replace(/^Bearer\s+/i,''));
 if(error||!user||user.is_anonymous)return reply({ok:false,error:'unauthorized'},401);
 const admin=createClient(supabaseUrl,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:membership,error:membershipError}=await admin.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
 if(membershipError)return reply({ok:false,error:'authorization_unavailable'},503);
 if(!membership||membership.active!==true||!['member','r4','r5','admin'].includes(String(membership.role).toLowerCase())||(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now()))return reply({ok:false,error:'forbidden'},403);
 const {data:quotaGranted,error:quotaError}=await admin.rpc('phx_take_transfer_id_quota',{p_user:user.id});
 if(quotaError)return reply({ok:false,error:'rate_limit_unavailable'},503);
 if(quotaGranted!==true)return reply({ok:false,error:'rate_limit_exceeded'},429);
 // Authenticated staging browser requests use the existing shared quota RPC.
 try{
  const upstream=await fetch('https://api.mightpulse.com/v1/players/'+id+'?include=base,heroes,ranks',{headers:{'X-Api-Key':key},redirect:'error',signal:AbortSignal.timeout(95000)});
  if(!upstream.ok)return reply({ok:false,error:'upstream_unavailable'},upstream.status===404?404:502);
  const d=await upstream.json(),p=d?.player;
  if(d?.ok!==true||String(d.governor_id)!==id||String(p?.governor_id??p?.fid)!==id||String(d.uid)!==String(p?.uid)||!Number.isSafeInteger(p?.kid)||p.kid<1)return reply({ok:false,error:'identity_unverified'},502);
  const scalar=v=>typeof v==='string'?v.slice(0,200):typeof v==='number'&&Number.isFinite(v)?v:null;
  const heroes=Array.isArray(d.heroes)?d.heroes.slice(0,20).map(h=>({name:scalar(h?.name),level:scalar(h?.level),stars:scalar(h?.stars),star:scalar(h?.star)})):null;
  let ranks=d.ranks&&typeof d.ranks==='object'&&!Array.isArray(d.ranks)?Object.fromEntries(['power','power_rank','kills','kills_rank','town_center_level','town_center_rank','migrant_score','migrant_rank','mystic_trial','mystic_rank'].map(k=>[k,scalar(d.ranks[k])])):null;
  if(ranks)ranks.player_captured_at=scalar(d.cached_at);
  if(ranks)ranks.leaderboards=Array.isArray(d.ranks.leaderboards)?d.ranks.leaderboards.slice(0,100).map(b=>({name:scalar(b?.name),value:scalar(b?.value),kingdom_rank:scalar(b?.kingdom_rank),captured_at:scalar(d.cached_at)})):null;
  // One documented bulk kingdom call supplements player-only standings. No paid endpoints.
  let boardStatus='unavailable';
  try{
   const res=await fetch('https://api.mightpulse.com/v1/kingdoms/'+p.kid+'/ranks?limit=100',{headers:{'X-Api-Key':key},redirect:'error',signal:AbortSignal.timeout(8000)});
   if(res.ok){const raw=await res.json();if(Array.isArray(raw?.boards)){
    const allowed=new Set(['personal_power','kills','town_center','rebel_conquest','single_hero','hero_total','troop_power','building_power','research_power','hero_no_equip','hero_equip','gov_gear','gov_charm','pet_power','island_prosperity','migrant_score','mystic_trial','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire','master_power']);
    ranks=ranks||{};ranks.leaderboards=ranks.leaderboards||[];
    ranks.boards=[];
    for(const board of raw.boards){
     if(!allowed.has(board?.key)||!Array.isArray(board.rows)||board.rows.length>100)continue;
     const found=board.rows.find(e=>e?.kid===p.kid&&String(e.uid)===String(d.uid)&&(e.governor_id==null||String(e.governor_id)===id));
     const captured=scalar(board.captured_at);
     ranks.boards.push({name:board.key,captured_at:captured,status:found?'listed':'not_listed'});
     if(found)ranks.leaderboards.push({name:board.key,value:scalar(found.score),kingdom_rank:scalar(found.rank),captured_at:captured});
    }
    boardStatus=ranks.boards.length?'available':'unavailable';
   }}
  }catch{/* Player standings remain usable if supplemental boards are unavailable. */}
  if(ranks)ranks.board_status=boardStatus;
  return reply({ok:true,governorId:id,uid:String(d.uid),player:{name:scalar(p.nick_name),kingdom:p.kid,power:scalar(p.power),alliance:scalar(p.alliance?.abbr)},source:{cachedAt:scalar(d.cached_at),fresh:typeof d.fresh==='boolean'?d.fresh:null,ageSeconds:scalar(d.age_seconds)},arenaSquad:{status:heroes?'available':'missing',heroes},ranks:{status:ranks?'available':'missing',values:ranks},checkedAtUtc:new Date().toISOString()});
 }catch{return reply({ok:false,error:'upstream_unavailable'},502);}
});
