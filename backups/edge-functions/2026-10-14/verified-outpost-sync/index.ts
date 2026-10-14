import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json"}});
Deno.serve(async(req)=>{
  if(req.method!=="POST") return json({error:"METHOD_NOT_ALLOWED"},405);
  const secret=Deno.env.get("OUTPOST_SYNC_SECRET");
  const provided=req.headers.get("x-outpost-sync-secret");
  if(!secret||!provided||secret.length<32||provided.length!==secret.length) return json({error:"UNAUTHORIZED"},401);
  const enc=new TextEncoder();
  const [a,b]=await Promise.all([
    crypto.subtle.digest("SHA-256",enc.encode(secret)),
    crypto.subtle.digest("SHA-256",enc.encode(provided))
  ]);
  const aa=new Uint8Array(a),bb=new Uint8Array(b);
  let mismatch=0; for(let i=0;i<aa.length;i++) mismatch|=aa[i]^bb[i];
  if(mismatch) return json({error:"UNAUTHORIZED"},401);

  let payload:any;
  try{payload=await req.json()}catch{return json({error:"INVALID_JSON"},400)}
  if(payload?.source!=="kingdom-1885-verified-outposts"||!Array.isArray(payload.rows))
    return json({error:"INVALID_PAYLOAD"},400);

  const rows=[];
  for(const item of payload.rows){
    rows.push({
      row_no:Number(item.row_no),
      alliance:String(item.alliance??"").trim(),
      structure_type:String(item.structure_type??"").trim(),
      level:Number(item.level),
      coord_x:Number(item.coord_x),
      coord_y:Number(item.coord_y),
      bonus:String(item.bonus??"").trim(),
      status:String(item.status??"").trim()
    });
  }

  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!key) return json({error:"SERVER_NOT_CONFIGURED"},500);
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {data,error}=await db.rpc("internal_replace_verified_outposts",{p_rows:rows});
  if(error){
    console.error("verified outpost sync failed",error.code);
    return json({error:"SYNC_FAILED",detail:error.message},400);
  }
  return json(data??{ok:true});
});