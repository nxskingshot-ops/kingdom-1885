const names=["personal_power","alliance_power","alliance_kills","kills","town_center","hero_total","troop_power","building_power","research_power","hero_no_equip","hero_equip","gov_gear","gov_charm","pet_power","mystic_trial","master_power"];
Deno.serve(async(req:Request)=>{
 const h={"content-type":"application/json","cache-control":"no-store"};
 const out=(x:unknown,s=200)=>new Response(JSON.stringify(x),{status:s,headers:h});
 if(req.method!=="GET")return out({ok:false,error:"method_not_allowed"},405);
 const key=Deno.env.get("MIGHTPULSE_API_KEY");if(!key)return out({ok:false,error:"secret_missing"},503);
 const u=new URL(req.url),start=Number(u.searchParams.get("start")||"0"),count=Number(u.searchParams.get("count")||"4"),limit=Number(u.searchParams.get("limit")||"100");
 if(!Number.isInteger(start)||start<0||start>=names.length||!Number.isInteger(count)||count<1||count>4||!Number.isInteger(limit)||limit<1||limit>100)return out({ok:false,error:"invalid_params"},400);
 const selection=names.slice(4,8);
 const result=[];
 for(const requested of selection){
  try{
   const res=await fetch("https://api.mightpulse.com/v1/kingdoms/1885/ranks?board="+encodeURIComponent(requested)+"&limit="+limit,{headers:{"X-Api-Key":key},signal:AbortSignal.timeout(20000)});
   if(!res.ok){result.push({requested,ok:false,status:res.status});continue}
   const raw=await res.json(),boards=Array.isArray(raw.boards)?raw.boards:[];
   result.push({requested,ok:true,status:res.status,reportedLimit:raw.limit??null,boards:boards.map((b:Record<string,unknown>)=>{
    const rows=Array.isArray(b.rows)?b.rows:[],ranks=rows.map((r:Record<string,unknown>)=>r.rank).filter((x:unknown)=>typeof x==="number") as number[];
    return {key:b.key??null,name:b.name??null,type:b.type??null,count:b.count??null,captured_at:b.captured_at??null,returnedRows:rows.length,minRank:ranks.length?Math.min(...ranks):null,maxRank:ranks.length?Math.max(...ranks):null,uniqueRanks:new Set(ranks).size,firstRowFields:rows.length?Object.keys(rows[0]):[]}
   })});
  }catch{result.push({requested,ok:false,error:"upstream_or_parse_error"})}
 }
 return out({ok:true,kingdom:1885,start:4,count:selection.length,limit,results:result,storage:"none",warning:"scores and freshness require independent validation"});
});