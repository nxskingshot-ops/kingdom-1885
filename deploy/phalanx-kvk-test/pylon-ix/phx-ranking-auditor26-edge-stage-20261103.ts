// PHALANX Ranking Auditor 26 — isolated read-only Supabase Edge Function.
// Staging source only. No database access, no writes, no secrets in responses.
const boards = ['personal_power','kills','town_center','rebel_conquest','single_hero','hero_total','troop_power','building_power','research_power','hero_no_equip','hero_equip','gov_gear','gov_charm','pet_power','island_prosperity','migrant_score','mystic_trial','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire','master_power','alliance_power','alliance_kills'];
const json = (body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
Deno.serve(async(req:Request)=>{
 if(req.method!=='POST') return json({ok:false,error:'method_not_allowed'},405);
 const auth=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 const url=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),key=Deno.env.get('MIGHTPULSE_API_KEY');
 if(!auth||!url||!anon) return json({ok:false,error:'unauthorized'},401);
 const check=await fetch(url+'/auth/v1/user',{headers:{Authorization:'Bearer '+auth,apikey:anon}});
 if(!check.ok) return json({ok:false,error:'unauthorized'},401);
 if(!key) return json({ok:false,error:'provider_not_configured'},503);
 const result:Record<string,unknown>[]=[];
 for(let i=0;i<boards.length;i+=2){
  const batch=await Promise.all(boards.slice(i,i+2).map(async board=>{
   try{
    const r=await fetch('https://api.mightpulse.com/v1/kingdoms/1885/ranks?board='+encodeURIComponent(board)+'&limit=100',{headers:{'X-Api-Key':key},signal:AbortSignal.timeout(20000),redirect:'error'});
    if(!r.ok) return {board,status:'ERROR',reason:'http_'+r.status};
    const raw=await r.json(), b=Array.isArray(raw?.boards)?raw.boards.find((v:Record<string,unknown>)=>v.key===board):null;
    if(!b) return {board,status:'UNSUPPORTED',reason:'not_returned'};
    const rows=Array.isArray(b.rows)?b.rows:[],alliance=board.startsWith('alliance_'),ids=new Set(),ranks=new Set();
    let last=Infinity,valid=rows.length===100;
    for(const row of rows){
      const id=alliance?row.aid:row.uid;
      if(row.kid!==1885||id==null||ids.has(String(id))||(!alliance&&board!=='kills'&&row.governor_id==null)||!Number.isInteger(row.rank)||row.rank<1||row.rank>100||ranks.has(row.rank)||typeof row.score!=='number'||!Number.isFinite(row.score)||row.score>last) valid=false;
      ids.add(String(id));ranks.add(row.rank);last=row.score;
    }
    const timestamp=typeof b.captured_at==='number'&&Number.isFinite(b.captured_at)?new Date(b.captured_at*1000).toISOString():null;
    return {board,status:valid&&timestamp?'VERIFIED':'INCOMPLETE',count:rows.length,capturedAt:timestamp};
   }catch{return {board,status:'ERROR',reason:'upstream_unavailable'};}
  }));
  result.push(...batch);
 }
 return json({kingdom:1885,checkedAtUtc:new Date().toISOString(),total:boards.length,verified:result.filter(x=>x.status==='VERIFIED').length,results:result,writesPerformed:false});
});
