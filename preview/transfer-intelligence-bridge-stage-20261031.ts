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

  const {data:latest,error:latestError}=await client.from("mystic_trial_observations")
    .select("snapshot_date").order("snapshot_date",{ascending:false}).limit(1).maybeSingle();
  if(latestError||!latest?.snapshot_date)return respond({error:"No private intelligence snapshot available."},503);
  const date=latest.snapshot_date;

  const [observations,powerReferences,categoryLabels,nxsRoster]=await Promise.all([
    client.from("mystic_trial_observations")
      .select("snapshot_date,player_name,alliance_tag,overall_rank,overall_score,coliseum_rank,coliseum_stage,forest_rank,forest_stage,crystal_rank,crystal_stage,knowledge_rank,knowledge_stage,molten_rank,molten_stage,radiant_rank,radiant_stage")
      .eq("snapshot_date",date).order("overall_rank",{ascending:true,nullsFirst:false}).limit(200),
    client.from("mystic_trial_power_references")
      .select("snapshot_date,player_name,power_m,castle,roster_player_name,source_note")
      .eq("snapshot_date",date).limit(200),
    client.from("mystic_trial_categories").select("trial_key,display_name,theme_label,sort_order,description").order("sort_order",{ascending:true}),
    client.from("kvk_roster_history").select("snapshot_date,player_name,power_m,castle").eq("snapshot_date",date).limit(200)
  ]);
  if(observations.error||powerReferences.error||categoryLabels.error||nxsRoster.error)
    return respond({error:"Private intelligence data temporarily unavailable."},503);
  const visibleNames=new Set((observations.data??[]).map(p=>String(p.player_name).normalize("NFKC").trim().toLowerCase()));
  return respond({
    snapshot_date:date,
    player_count:observations.data?.length??0,
    observations:observations.data??[],
    power_references:[...(powerReferences.data??[]),...(nxsRoster.data??[]).filter(r=>!(powerReferences.data??[]).some(p=>p.player_name.toLowerCase()===r.player_name.toLowerCase())).map(r=>({...r,source_note:"NXS private roster snapshot",roster_player_name:r.player_name}))].filter(r=>visibleNames.has(String(r.player_name).normalize("NFKC").trim().toLowerCase())),
    categories:categoryLabels.data??[],
    measurement_note:"Trial stage and rank are comparative progress indicators, not direct measures of troop power or non-troop power."
  });
});

