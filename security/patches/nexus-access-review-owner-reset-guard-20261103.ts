import { createClient } from "npm:@supabase/supabase-js@2";

const API = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ORIGIN = "https://nxskingshot-ops.github.io";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Vary": "Origin",
};
const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {status, headers:{...cors,"Content-Type":"application/json"}});

function password(){
  const bytes=crypto.getRandomValues(new Uint8Array(18));
  return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
}
function loginEmail(playerId:string){
  const safe=playerId.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,24)||"player";
  return `nexus-${safe}-${crypto.randomUUID().slice(0,8)}@example.com`;
}

Deno.serve(async req=>{
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:cors});
  if(req.method!=="POST") return reply({error:"Method not allowed."},405);
  if(req.headers.get("Origin")!==ORIGIN) return reply({error:"Origin not allowed."},403);
  if(!API||!SERVICE) return reply({error:"Server configuration missing."},503);

  const bearer=req.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if(!bearer) return reply({error:"Sign-in required."},401);

  const admin=createClient(API,SERVICE,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:identity,error:identityError}=await admin.auth.getUser(bearer);
  if(identityError||!identity?.user) return reply({error:"Session invalid."},401);
  const reviewer=identity.user.id;

  const {data:membership,error:membershipError}=await admin.from("nxs_memberships")
    .select("role,active,expires_at").eq("user_id",reviewer).maybeSingle();
  if(membershipError||!membership?.active||!["r4","r5","admin"].includes(membership.role)||
     (membership.expires_at&&Date.parse(membership.expires_at)<=Date.now()))
    return reply({error:"R4 / R5 / Admin permission required."},403);

  let body:{id?:number;action?:string;grant?:string}={};
  try{body=await req.json()}catch{return reply({error:"Invalid request."},400)}
  const id=Number(body.id);
  if(!Number.isInteger(id)||id<1) return reply({error:"Invalid request ID."},400);
  if(!["approve","reject","reset"].includes(body.action??"")) return reply({error:"Unsupported action."},400);

  const {data:request,error:reqError}=await admin.from("nexus_access_requests")
    .select("id,gamer_tag,player_id,alliance,status,granted_user_id,granted_role").eq("id",id).maybeSingle();
  if(reqError||!request) return reply({error:"Request not found."},404);
  if(body.action==="reset"){
    if(request.status!=="approved"||!request.granted_user_id) return reply({error:"No approved login exists for this request."},409);
    if(membership.role!=="admin") return reply({error:"Administrator permission required to reset login credentials."},403);
    // DRAFT: server-managed owner identity. This must be configured and tested before deployment.
    const protectedOwnerId = Deno.env.get("PHALANX_OWNER_AUTH_USER_ID") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(protectedOwnerId))
      return reply({error:"Protected owner identity is not configured."},503);
    if (request.granted_user_id.toLowerCase() === protectedOwnerId.toLowerCase())
      return reply({error:"Protected owner account cannot be reset by membership administrators."},403);
    const nextPassword=password();
    const {data:updated,error:updateUserError}=await admin.auth.admin.updateUserById(request.granted_user_id,{password:nextPassword});
    if(updateUserError||!updated?.user) return reply({error:"Password reset failed."},503);
    return reply({status:"reset",email:updated.user.email,password:nextPassword,role:request.granted_role});
  }

  if(request.status!=="pending") return reply({error:"Request has already been reviewed."},409);

  if(body.action==="reject"){
    const {error}=await admin.from("nexus_access_requests").update({
      status:"rejected",reviewed_at:new Date().toISOString(),reviewed_by:reviewer
    }).eq("id",id).eq("status","pending");
    if(error) return reply({error:"Could not reject request."},503);
    return reply({status:"rejected"});
  }

  const grant=body.grant??"";
  const roleMap:Record<string,string>={
    kingdom:"kingdom",
    member:"member",
    officer:"r4",
    r5:"r5",
    outpost:"outpost_manager",
    admin:"admin"
  };
  const role=roleMap[grant];
  if(!role) return reply({error:"Choose an access level."},400);

  if(membership.role!=="admin" && ["r4","r5","outpost_manager","admin"].includes(role))
    return reply({error:"Only an administrator can grant elevated access."},403);

  const email=loginEmail(String(request.player_id));
  const pass=password();
  const {data:created,error:createError}=await admin.auth.admin.createUser({
    email,password:pass,email_confirm:true,
    app_metadata:{
      nexus_access:true,
      gamer_tag:request.gamer_tag,
      player_id:request.player_id,
      alliance:request.alliance
    }
  });
  if(createError||!created?.user) return reply({error:"Login account could not be created."},503);
  const uid=created.user.id;

  const cleanup=async()=>{try{await admin.auth.admin.deleteUser(uid)}catch{}};
  const {error:profileError}=await admin.from("app_profiles").upsert({
    user_id:uid,display_name:request.gamer_tag
  },{onConflict:"user_id"});
  if(profileError){await cleanup();return reply({error:"Profile could not be created."},503)}

  const {error:grantError}=await admin.from("nxs_memberships").insert({
    user_id:uid,role,active:true,granted_by:reviewer
  });
  if(grantError){
    await admin.from("app_profiles").delete().eq("user_id",uid);
    await cleanup();
    return reply({error:"Access permissions could not be activated."},503);
  }

  const {error:updateError}=await admin.from("nexus_access_requests").update({
    status:"approved",reviewed_at:new Date().toISOString(),reviewed_by:reviewer,
    granted_user_id:uid,granted_role:role
  }).eq("id",id).eq("status","pending");
  if(updateError){
    await admin.from("nxs_memberships").delete().eq("user_id",uid);
    await admin.from("app_profiles").delete().eq("user_id",uid);
    await cleanup();
    return reply({error:"Request approval could not be finalized."},503);
  }

  return reply({
    status:"approved",
    gamer_tag:request.gamer_tag,
    alliance:request.alliance,
    role,
    email,
    password:pass
  });
});