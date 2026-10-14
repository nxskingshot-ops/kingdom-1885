import {createClient} from "npm:@supabase/supabase-js@2";
function same(a:string,b:string) {const enc=new TextEncoder();const x=enc.encode(a),y=enc.encode(b);let d=x.length^y.length;for(let i=0;i<Math.max(x.length,y.length);i++)d|=(x[i]??0)^(y[i]??0);return d===0;}
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff","access-control-allow-origin":"null"}});
Deno.serve(async (req:Request)=>{
 if(req.method!=="POST") return reply(405,{error:"method_not_allowed"});
 const expected=Deno.env.get("KVK_SYNC_WEBHOOK_TOKEN");
 const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const base=Deno.env.get("SUPABASE_URL");
 if(!expected||expected.length<32||!key||!base) return reply(503,{error:"sync_not_configured"});
 const provided=req.headers.get("x-nxs-sync-token")??"";
 if(!same(expected,provided)) return reply(401,{error:"unauthorized"});
 if(!req.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return reply(415,{error:"json_required"});
 const len=Number(req.headers.get("content-length")??"0");
 if(len>220000)return reply(413,{error:"payload_too_large"});
 let payload:Record<string,unknown>;
 try{const raw=await req.text();if(raw.length>220000)return reply(413,{error:"payload_too_large"});payload=JSON.parse(raw)}catch{return reply(400,{error:"invalid_json"})}
 if(!payload||payload.schema_version!=="1.9"||payload.release_status!=="ARCHIVED – COMPLETE")return reply(422,{error:"uncommitted_or_wrong_schema"});
 const client=createClient(base,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data,error}=await client.rpc("internal_kvk_ingest_service",{payload});
 if(error){return reply(422,{error:"import_rejected",detail:error.code??"validation_failed"})}
 return reply(200,data??{status:"NO_RESULT"});
});