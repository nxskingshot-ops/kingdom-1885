const boards=["personal_power","troop_power","gov_gear","gov_charm","hero_total","pet_power","mystic_trial"];
Deno.serve(async(req:Request)=>{
 const h={"content-type":"application/json","cache-control":"no-store"};
 const send=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:h});
 if(req.method!=="GET")return send({ok:false,error:"method_not_allowed"},405);
 const key=Deno.env.get("MIGHTPULSE_API_KEY");
 if(!key)return send({ok:false,error:"missing_api_key"},503);
 const results=await Promise.all(boards.map(async board=>{
  try{
   const response=await fetch("https://api.mightpulse.com/v1/kingdoms/1913/ranks?board="+encodeURIComponent(board)+"&limit=100",{headers:{"X-Api-Key":key},signal:AbortSignal.timeout(25000)});
   if(!response.ok)return {board,ok:false,httpStatus:response.status};
   const data=await response.json();
   const b=(Array.isArray(data?.boards)?data.boards:[]).find((x:{key?:string})=>x.key===board);
   if(!b)return {board,ok:false,error:"board_missing"};
   const rows=Array.isArray(b.rows)?b.rows:[];
   const ranks=rows.map((x:{rank:number})=>x.rank);
   const scores=rows.map((x:{score:number})=>x.score);
   const checks={count100:rows.length===100,uniqueRanks:new Set(ranks).size===rows.length,ranksOneToHundred:rows.length===100&&Math.min(...ranks)===1&&Math.max(...ranks)===100,correctKingdom:rows.every((x:{kid:number})=>x.kid===1913),uidComplete:rows.every((x:{uid:unknown})=>x.uid!=null),numericScores:scores.every((x:unknown)=>typeof x==="number"&&Number.isFinite(x)),descendingScores:scores.every((x:number,i:number)=>i===0||scores[i-1]>=x)};
   return {board,ok:true,quality100:Object.values(checks).every(Boolean),checks,rows:rows.length,sourceCapturedAt:b.captured_at??null,top10:rows.slice(0,10).map((x:{rank:number;uid:unknown;nick_name?:string;alliance_abbr?:string;score:number})=>({rank:x.rank,uid:x.uid,name:x.nick_name??null,alliance:x.alliance_abbr??null,score:x.score}))};
  }catch{return {board,ok:false,error:"upstream_unavailable"};}
 }));
 return send({ok:results.every(x=>x.ok&&x.quality100),mode:"isolated_read_only",kingdom:1913,requestedBoards:boards,passed:results.filter(x=>x.ok&&x.quality100).length,total:boards.length,checkedAt:new Date().toISOString(),results,storage:"none",note:"MightPulse rankings are third-party data; no combat effectiveness inferred."});
});