const ALLOWED=new Set(["personal_power","alliance_power","alliance_kills","kills","town_center","hero_total","troop_power","building_power","research_power","hero_no_equip","hero_equip","gov_gear","gov_charm","pet_power","mystic_trial","master_power"]);
Deno.serve(async(req:Request)=>{
 const h={"content-type":"application/json","cache-control":"no-store"};
 const send=(v:unknown,s=200)=>new Response(JSON.stringify(v),{status:s,headers:h});
 if(req.method!=="GET")return send({ok:false,error:"method_not_allowed"},405);
 const key=Deno.env.get("MIGHTPULSE_API_KEY");
 if(!key)return send({ok:false,error:"secret_missing"},503);
 const u=new URL(req.url),board=u.searchParams.get("board")||"personal_power";
 const limit=Number(u.searchParams.get("limit")||"100");
 if(!ALLOWED.has(board)||!Number.isInteger(limit)||limit<1||limit>100)return send({ok:false,error:"invalid_board_or_limit"},400);
 try{
 const upstream=await fetch("https://api.mightpulse.com/v1/kingdoms/1885/ranks?board="+encodeURIComponent(board)+"&limit="+limit,{headers:{"X-Api-Key":key},signal:AbortSignal.timeout(25000)});
 if(!upstream.ok)return send({ok:false,error:"upstream_error",upstreamStatus:upstream.status},502);
 const raw=await upstream.json();
 const boards=Array.isArray(raw?.boards)?raw.boards:[];
 const summaries=boards.map((b:Record<string,unknown>)=>{
 const rows=Array.isArray(b.rows)?b.rows:[];
 const ranks=rows.map((r:Record<string,unknown>)=>r.rank).filter((v:unknown)=>typeof v==="number") as number[];
 const kids=rows.map((r:Record<string,unknown>)=>r.kid).filter((v:unknown)=>typeof v==="number");
 return {type:b.type??null,key:b.key??null,name:b.name??null,count:b.count??null,captured_at:b.captured_at??null,returnedRows:rows.length,minRank:ranks.length?Math.min(...ranks):null,maxRank:ranks.length?Math.max(...ranks):null,uniqueRanks:new Set(ranks).size,allRowsKingdom1885:kids.length===rows.length&&kids.every((v:unknown)=>v===1885),sampleFields:rows.length?Object.keys(rows[0]):[],scoreMeaning:"not independently validated"};
 });
 return send({ok:true,requestedBoard:board,requestedLimit:limit,kingdom:1885,reportedLimit:raw.limit??null,boardCount:boards.length,boards:summaries,storage:"none",note:"board identity based on upstream key/name; scores not automatically treated as power"});
 }catch{return send({ok:false,error:"upstream_or_parse_error"},502)}
});