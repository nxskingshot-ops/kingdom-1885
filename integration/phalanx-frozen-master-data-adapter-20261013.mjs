// NEXUS PHALANX: frozen master integration contract (test branch only).
// This module intentionally does not change any approved UI.
export async function loadVerifiedAllianceData(client, alliance) {
  if (!client?.auth?.getUser || !client?.from) throw Error('Missing Supabase client');
  const auth=await client.auth.getUser();
  if(auth.error || !auth.data?.user) throw Error('NOT_SIGNED_IN');
  const names=['NXS','FRA','OoO','MYM'];
  if(!names.includes(alliance)) throw Error('INVALID_ALLIANCE');
  const overview=await client.from('phalanx_alliance_latest')
    .select('alliance,members,total_power,tg5,tg4,snapshot_date')
    .eq('kingdom',1885);
  if(overview.error) throw overview.error;
  if(overview.data?.length!==4 || names.some(name=>!overview.data.some(x=>x.alliance===name&&x.snapshot_date==='2026-10-13')))
    throw Error('SNAPSHOT_INCOMPLETE');
  const players=await client.from('phalanx_alliance_top40')
    .select('alliance,position,player_name,power,snapshot_date')
    .eq('kingdom',1885).eq('snapshot_date','2026-10-13')
    .eq('alliance',alliance).order('position');
  if(players.error) throw players.error;
  if(players.data?.length!==40) throw Error('TOP40_INCOMPLETE');
  return {overview:overview.data,players:players.data};
}
