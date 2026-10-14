const boards=new Set(["personal_power","alliance_power","alliance_kills","kills","town_center","hero_total","troop_power","building_power","research_power","hero_no_equip","hero_equip","gov_gear","gov_charm","pet_power","mystic_trial","master_power"]);
Deno.serve(async(req:Request)=>{
 const headers={"content-type":"application/json","cache-control":"no-store"};
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method!=="GET")return reply({ok:false,error:"method_not_allowed"},405);
 const key=Deno.env.get("MIGHTPULSE_API_KEY");if(!key)return reply({ok:false,error:"secret_missing"},503);
 const u=new URL(req.url),board=u.searchParams.get("board")||"personal_power";
 if(!boards.has(board))return reply({ok:false,error:"invalid_board"},400);
 try{
  const upstream=await fetch("https://api.mightpulse.com/v1/kingdoms/1885/ranks?board="+encodeURIComponent(board)+"&limit=100",{headers:{"X-Api-Key":key},signal:AbortSignal.timeout(25000)});
  if(!upstream.ok)return reply({ok:false,error:"upstream_http_error",status:upstream.status},502);
  const raw=await upstream.json(),now=Date.now()/1000;
  const summary=(Array.isArray(raw.boards)?raw.boards:[]).map((b:Record<string,unknown>)=>{
   const rows=Array.isArray(b.rows)?b.rows as Record<string,unknown>[]:[];
   const ranks=rows.map(r=>r.rank).filter((x):x is number=>typeof x==="number");
   const captured=typeof b.captured_at==="number"?b.captured_at:null;
   const scores=rows.map(r=>r.score).filter((x):x is number=>typeof x==="number");
   const allKid1885=rows.every(r=>r.kid===1885);
   const identityCount=rows.filter(r=>r.uid!=null&&r.governor_id!=null).length;
   return {key:b.key??null,name:b.name??null,type:b.type??null,reportedCount:b.count??null,returnedRows:rows.length,minRank:ranks.length?Math.min(...ranks):null,maxRank:ranks.length?Math.max(...ranks):null,uniqueRanks:new Set(ranks).size,allRowsKingdom1885:allKid1885,rowsWithBothPlayerIds:identityCount,scoreNumericCount:scores.length,scoreDescending:scores.length===rows.length&&scores.every((v,i)=>i===0||scores[i-1]>=v),capturedAtUnix:captured,capturedAtUtc:captured!==null?new Date(captured*1000).toISOString():null,ageMinutes:captured!==null?Math.round((now-captured)/60):null};
  });
  return reply({ok:true,kingdom:1885,requestedBoard:board,reportedLimit:raw.limit??null,checkedAtUtc:new Date().toISOString(),boards:summary,storage:"none",warning:"Score semantics and provider update cadence are not independently verified"});
 }catch{return reply({ok:false,error:"upstream_or_parse_error"},502)}
});