import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers: {"content-type":"application/json"}});
Deno.serve(async (req) => {
  if (req.method !== "POST") return json({error:"METHOD_NOT_ALLOWED"},405);
  const secret = Deno.env.get("OUTPOST_SYNC_SECRET");
  const provided = req.headers.get("x-outpost-sync-secret");
  if (!secret || !provided || secret.length < 32 || provided.length !== secret.length) return json({error:"UNAUTHORIZED"},401);
  const enc = new TextEncoder();
  const [a,b] = await Promise.all([crypto.subtle.digest("SHA-256",enc.encode(secret)), crypto.subtle.digest("SHA-256",enc.encode(provided))]);
  const aa = new Uint8Array(a), bb = new Uint8Array(b);
  let mismatch = 0; for (let i=0;i<aa.length;i++) mismatch |= aa[i]^bb[i];
  if (mismatch) return json({error:"UNAUTHORIZED"},401);
  let payload: any;
  try { payload=await req.json(); } catch { return json({error:"INVALID_JSON"},400); }
  if (payload?.source !== "kingdom-1885-live-outpost-map" || !Array.isArray(payload.rows) || payload.rows.length === 0 || payload.rows.length > 300) return json({error:"INVALID_PAYLOAD"},400);
  const seen=new Set();
  const rows=[];
  for (const item of payload.rows) {
    const row = Number(item.row);
    const x = Number(item.coord_x), y=Number(item.coord_y), level=Number(item.level);
    const alliance = String(item.alliance??"").trim();
    const structure = String(item.structure_type??"").trim();
    if (!Number.isInteger(row) || row<2 || row>300 || !Number.isInteger(x) || x<0 || x>1199 || !Number.isInteger(y) || y<0 || y>1199 || !Number.isInteger(level) || level<1 || level>4 || !/^[A-Za-z0-9]{2,8}$/.test(alliance) || !structure || structure.length>80 || seen.has(row)) return json({error:"INVALID_ROW",row},400);
    seen.add(row);
    rows.push({source_key:"outpost-sheet:"+row,coord_x:x,coord_y:y,level,alliance,structure_type:structure,published:true,updated_at:new Date().toISOString()});
  }
  const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url || !key) return json({error:"SERVER_NOT_CONFIGURED"},500);
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {error}=await db.from("public_outposts").upsert(rows,{onConflict:"source_key"});
  if(error) { console.error("outpost sync upsert failed",error.code); return json({error:"SYNC_FAILED"},500); }
  return json({ok:true,upserted:rows.length,note:"Rows removed from the sheet are not deleted automatically."});
});