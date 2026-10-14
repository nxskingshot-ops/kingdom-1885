const allowed=["personal_power","troop_power","gov_gear","gov_charm","hero_total","pet_power","mystic_trial","alliance_power","town_center","hero_no_equip","hero_equip","research_power","building_power","master_power","kills","alliance_kills"];
const defaults=allowed.slice(0,7);
type Row={rank:number;uid?:string|number;nick_name?:string;alliance_abbr?:string;score:number;kid?:number;aid?:number};
Deno.serve(async(req:Request)=>{
 const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store","access-control-allow-origin":"*","access-control-allow-headers":"authorization,apikey,content-type","access-control-allow-methods":"GET,OPTIONS"};
 const send=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers});
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="GET")return send({ok:false,error:"method_not_allowed"},405);
 const u=new URL(req.url), raw=u.searchParams.get("kingdom")??"1913";
 if(!/^[0-9]{1,5}$/.test(raw)||Number(raw)<1)return send({ok:false,error:"invalid_kingdom"},400);
 const kingdom=Number(raw);
 const chosen=u.searchParams.get("boards");
 const boards=chosen?Array.from(new Set(chosen.split(",").map(x=>x.trim()).filter(Boolean))):defaults;
 if(!boards.length||boards.length>10||boards.some(x=>!allowed.includes(x)))return send({ok:false,error:"invalid_boards",allowed},400);
 const key=Deno.env.get("MIGHTPULSE_API_KEY");if(!key)return send({ok:false,error:"upstream_secret_missing"},503);
 const results=await Promise.all(boards.map(async board=>{
  try{
   const res=await fetch("https://api.mightpulse.com/v1/kingdoms/"+kingdom+"/ranks?board="+encodeURIComponent(board)+"&limit=100",{headers:{"X-Api-Key":key},signal:AbortSignal.timeout(25000)});
   if(!res.ok)return {board,ok:false,error:"upstream_http_"+res.status};
   const data=await res.json();const b=(Array.isArray(data?.boards)?data.boards:[]).find((x:{key?:string})=>x.key===board);
   if(!b)return {board,ok:false,error:"board_missing"};
   const rows:Row[]=Array.isArray(b.rows)?b.rows:[];
   const ranks=rows.map(x=>x.rank),scores=rows.map(x=>x.score);
   const checks={count100:rows.length===100,uniqueRanks:new Set(ranks).size===100,ranksOneToHundred:rows.length===100&&Math.min(...ranks)===1&&Math.max(...ranks)===100,correctKingdom:rows.every(x=>x.kid===kingdom),numericScores:scores.every(x=>typeof x==="number"&&Number.isFinite(x)),descendingScores:scores.every((x,i)=>i===0||scores[i-1]>=x),identities:rows.every(x=>board.startsWith("alliance_")?x.aid!=null:x.uid!=null)};
   const quality100=Object.values(checks).every(Boolean);
   return {board,ok:true,quality100,checks,rows:rows.length,sourceCapturedAt:b.captured_at??null,top10:rows.slice(0,10).map(x=>({rank:x.rank,uid:x.uid??null,name:x.nick_name??null,alliance:x.alliance_abbr??null,score:x.score})),_rows:quality100&&!board.startsWith("alliance_")?rows:[]};
  }catch{return {board,ok:false,error:"upstream_unavailable"};}
 }));
 const seen=new Map<string,{uid:string;name:string|null;alliance:string|null;boards:{board:string;rank:number;score:number}[]}>();
 for(const r of results){if(!r.ok||!r.quality100)continue;for(const x of r._rows??[]){if(x.uid==null)continue;const id=String(x.uid);let item=seen.get(id);if(!item){item={uid:id,name:x.nick_name??null,alliance:x.alliance_abbr??null,boards:[]};seen.set(id,item);}item.boards.push({board:r.board,rank:x.rank,score:x.score});}}
 const recurring=[...seen.values()].filter(x=>x.boards.length>=2).sort((a,b)=>b.boards.length-a.boards.length||Math.min(...a.boards.map(y=>y.rank))-Math.min(...b.boards.map(y=>y.rank))).slice(0,20);
 const clean=results.map(({_rows,...rest})=>rest);
 const passed=clean.filter(x=>x.ok&&x.quality100).length;
 return send({ok:passed===boards.length,mode:"isolated_read_only",reportType:"PHALANX Kingdom Scout",kingdom,requestedBoards:boards,passed,total:boards.length,checkedAtUtc:new Date().toISOString(),sourceCapturedAtByBoard:clean.map(x=>({board:x.board,sourceCapturedAt:x.sourceCapturedAt??null})),results:clean,recurringTop100Players:recurring,storage:"none",caveat:"MightPulse is third-party data. Structural quality checks do not establish gameplay accuracy or tactical effectiveness."});
});