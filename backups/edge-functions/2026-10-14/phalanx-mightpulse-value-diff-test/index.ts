const boards=new Set(["personal_power","alliance_power","alliance_kills","kills","town_center","hero_total","troop_power","building_power","research_power","hero_no_equip","hero_equip","gov_gear","gov_charm","pet_power","mystic_trial","master_power"]);
Deno.serve(async(req:Request)=>{
 const h={"content-type":"application/json","cache-control":"no-store","access-control-allow-origin":"https://nxskingshot-ops.github.io","access-control-allow-methods":"GET, OPTIONS","access-control-allow-headers":"authorization, apikey, x-client-info, content-type"};
 const send=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:h});
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:h});
 if(req.method!=="GET")return send({ok:false,error:"method_not_allowed"},405);
 const board=new URL(req.url).searchParams.get("board")??"personal_power";
 if(!boards.has(board))return send({ok:false,error:"invalid_board"},400);
 const url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),pub=Deno.env.get("SUPABASE_ANON_KEY");
 if(!url||!service||!pub)return send({ok:false,error:"missing_config"},503);
 const auth=req.headers.get("authorization")??"";
 const user=await fetch(url+"/auth/v1/user",{headers:{"Authorization":auth,"apikey":pub}});
 if(!user.ok)return send({ok:false,error:"unauthorized"},401);
 const q=new URL(url+"/rest/v1/phalanx_mightpulse_rank_snapshots");
 q.searchParams.set("select","run_id,board,source_captured_at,entries");
 q.searchParams.set("board","eq."+board);
 q.searchParams.set("order","source_captured_at.desc,run_id.desc");
 q.searchParams.set("limit","30");
 const res=await fetch(q,{headers:{"apikey":service,"Authorization":"Bearer "+service}});
 if(!res.ok)return send({ok:false,error:"snapshot_query_failed"},502);
 const snapshots=await res.json();
 const current=snapshots[0];
 if(!current)return send({ok:true,board,state:"no_data",hasChanges:false,changes:[]});
 const previous=snapshots.find((x:Record<string,unknown>)=>x.source_captured_at&&x.source_captured_at!==current.source_captured_at);
 if(!previous)return send({ok:true,board,state:"waiting_for_new_source",hasChanges:false,latestSourceCapturedAt:current.source_captured_at,previousSourceCapturedAt:null,compared:false,changes:[],note:"No earlier distinct MightPulse source timestamp available."});
 const key=(x:Record<string,unknown>)=>String(board.startsWith("alliance_")?x.aid:x.uid);
 const oldRows=new Map((previous.entries??[]).filter((x:Record<string,unknown>)=>x.uid!=null||x.aid!=null).map((x:Record<string,unknown>)=>[key(x),x]));
 const changes=[];
 for(const x of current.entries??[]){
  const old=oldRows.get(key(x));
  if(!old)continue;
  const scoreDelta=typeof x.score==="number"&&typeof old.score==="number"?x.score-old.score:null;
  const rankDelta=typeof x.rank==="number"&&typeof old.rank==="number"?old.rank-x.rank:null;
  if(scoreDelta===0&&rankDelta===0)continue;
  changes.push({id:key(x),name:x.nick_name??x.alliance_abbr??null,alliance:x.alliance_abbr??null,previousScore:old.score??null,currentScore:x.score??null,scoreDelta,previousRank:old.rank??null,currentRank:x.rank??null,rankImprovement:rankDelta});
 }
 changes.sort((a,b)=>Math.abs(b.scoreDelta??0)-Math.abs(a.scoreDelta??0));
 return send({ok:true,board,state:changes.length?"changes_detected":"no_value_changes",hasChanges:changes.length>0,compared:true,latestSourceCapturedAt:current.source_captured_at,previousSourceCapturedAt:previous.source_captured_at,matchedPlayers:(current.entries??[]).length,changedCount:changes.length,changes:changes.slice(0,40),note:"Only entries present in both Top-100 snapshots compared; changes outside Top-100 not inferred."});
});