Deno.serve(async (req: Request) => {
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  if (req.method !== "GET") return new Response(JSON.stringify({ ok:false,error:"method_not_allowed" }), {status:405,headers});
  const secret = Deno.env.get("MIGHTPULSE_API_KEY");
  if (!secret) return new Response(JSON.stringify({ok:false,error:"mightpulse_secret_missing"}),{status:503,headers});
  const u = new URL(req.url);
  const board = u.searchParams.get("board") || "personal_power";
  const allowed = new Set(["personal_power","mystic_trial","troop_power","research_power","hero_no_equip","hero_equip","gov_gear","gov_charm","pet_power","town_center","alliance_power","master_power"]);
  if (!allowed.has(board)) return new Response(JSON.stringify({ok:false,error:"board_not_allowed"}),{status:400,headers});
  try {
    const upstream = await fetch("https://api.mightpulse.com/v1/kingdoms/1885/ranks?board="+encodeURIComponent(board)+"&limit=40", {headers:{"X-Api-Key":secret},signal:AbortSignal.timeout(25000)});
    const data = await upstream.json();
    return new Response(JSON.stringify({ok:upstream.ok,kingdom:1885,board,upstreamStatus:upstream.status,data}),{status:upstream.ok?200:502,headers});
  } catch {
    return new Response(JSON.stringify({ok:false,error:"upstream_unavailable"}),{status:502,headers});
  }
});