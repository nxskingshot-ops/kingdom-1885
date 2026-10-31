import { createClient } from "npm:@supabase/supabase-js@2";
const ORIGIN = "https://phalanx-r11-atlas-preview.vercel.app";
const cors: Record<string,string> = {
  "Access-Control-Allow-Origin":ORIGIN,
  "Access-Control-Allow-Headers":"Authorization, apikey, x-client-info, Content-Type",
  "Access-Control-Allow-Methods":"GET, OPTIONS",
  "Cache-Control":"no-store",
  "Vary":"Origin"
};
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8"}});
Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.method!=="GET")return respond({error:"Method not allowed"},405);
  if(req.headers.get("Origin")!==ORIGIN)return respond({error:"Origin not allowed"},403);
  const token=req.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if(!token)return respond({error:"Sign in to NEXUS to view protected intelligence."},401);
  const url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!service)return respond({error:"Service unavailable"},503);
  const client=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:identity,error:authError}=await client.auth.getUser(token);
  if(authError||!identity?.user)return respond({error:"Session invalid; please sign in again."},401);
  const {data:membership,error:memberError}=await client.from("nxs_memberships")
     .select("active,role,expires_at").eq("user_id",identity.user.id).maybeSingle();
  if(memberError||!membership?.active||(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now()))
    return respond({error:"Active NEXUS membership required."},403);


  try{
  // Latest successful saved source for EACH player board; no old hand-entered trial roster.
  const boards=['personal_power','kills','town_center','rebel_conquest','single_hero','hero_total','troop_power','building_power','research_power','hero_no_equip','hero_equip','gov_gear','gov_charm','pet_power','island_prosperity','migrant_score','mystic_trial','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire','master_power'];
  let results=[],sourceMode='saved_snapshot';
  const key=Deno.env.get("MIGHTPULSE_API_KEY");
  if(key)try{
    const res=await fetch('https://api.mightpulse.com/v1/kingdoms/1885/ranks?limit=100',{headers:{'X-Api-Key':key},redirect:'error',signal:AbortSignal.timeout(8000)});
    if(res.ok){const raw=await res.json();if(Array.isArray(raw?.boards)){
      results=raw.boards.filter(b=>boards.includes(b?.key)&&Array.isArray(b.rows)&&b.rows.length<=100).map(b=>({board:b.key,data:{entries:b.rows,entry_count:b.rows.length,source_captured_at:typeof b.captured_at==='number'?new Date(b.captured_at*1000).toISOString():null,created_at:null},error:null}));
      if(results.length)sourceMode='provider_request';
    }}
  }catch{/* Read-only saved snapshots are the documented fallback. */}
  if(!results.length)results=await Promise.all(boards.map(async board=>{
    const {data,error}=await client.from("phalanx_mightpulse_rank_snapshots")
      .select("board,source_captured_at,created_at,entries,entry_count").eq("board",board)
      .order("created_at",{ascending:false}).order("id",{ascending:false}).limit(1).maybeSingle();
    return {board,data,error};
  }));
  const players=new Map(),sources=[];
  for(const {board,data,error} of results){
    if(error||!data||!Array.isArray(data.entries)||data.entries.length>1000||data.entry_count!==data.entries.length)continue;
    sources.push({board,captured_at:data.source_captured_at,saved_at:data.created_at,entry_count:data.entry_count});
    for(const e of data.entries){
      if(e?.kid!==1885||!e.uid||typeof e.nick_name!=="string")continue;
      const uid=String(e.uid);let p=players.get(uid);
      if(!p){p={uid,player_name:e.nick_name.slice(0,160),alliance_tag:typeof e.alliance_abbr==="string"?e.alliance_abbr.slice(0,32):null,governor_id:e.governor_id==null?null:String(e.governor_id),rankings:{}};players.set(uid,p);}
      if(!p.governor_id&&e.governor_id)p.governor_id=String(e.governor_id);
      const value=typeof e.score==="number"&&Number.isFinite(e.score)?e.score:null;
      const rank=Number.isInteger(e.rank)&&e.rank>0?e.rank:null;
      p.rankings[board]={value,kingdom_rank:rank,captured_at:data.source_captured_at};
      if(board==="personal_power")p.power_m=value===null?null:value/1e6;
    }
  }
  if(!sources.length)return respond({error:"No Mighty Pulse ranking snapshots available."},503);
  const observations=[...players.values()].sort((a,b)=>a.player_name.localeCompare(b.player_name));
  return respond({snapshot_date:sources.map(s=>s.captured_at).filter(Boolean).sort()[0]||null,
    source_mode:sourceMode,checked_at_utc:new Date().toISOString(),player_count:observations.length,observations,
    power_references:observations.filter(p=>p.power_m!=null),categories:[],sources,
    coverage_note:"Players found across the available Top-100 player boards. This is not a complete kingdom census. Use a Kingshot Player ID to compare an unlisted player. Missing board entries are not zero; ranks are kingdom-specific.",
    measurement_note:"Ranking scores are not Mystic Trial stages. Source capture time is distinct from request time."});
  }catch{return respond({error:"Mighty Pulse ranking data temporarily unavailable."},503);}
});
