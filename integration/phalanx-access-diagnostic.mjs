// PHALANX integration diagnostic, test branch only.
// Invoke from an authenticated app context:
// import { checkAllianceAccess } from '/integration/phalanx-access-diagnostic.mjs';
// await checkAllianceAccess(existingSupabaseClient)
// Never paste tokens, service-role keys, or roster data into reports.
export async function checkAllianceAccess(client) {
  if (!client?.auth?.getUser || !client?.from) throw new Error('Existing Supabase client required');
  const identity = await client.auth.getUser();
  if (identity.error || !identity.data?.user?.id) {
    return { signedIn: false, overview: 'NOT_TESTED', top40: 'NOT_TESTED' };
  }
  const overview = await client.from('phalanx_alliance_latest')
    .select('alliance,members,total_power,tg5,tg4,snapshot_date')
    .eq('kingdom', 1885);
  const top40 = await client.from('phalanx_alliance_top40')
    .select('position', { count: 'exact', head: true })
    .eq('kingdom', 1885).eq('snapshot_date', '2026-10-13');
  return {
    signedIn: true,
    overview: overview.error ? 'DENIED_OR_ERROR' : 'READ_OK',
    allianceCount: overview.error ? null : overview.data?.length,
    top40: top40.error ? 'DENIED_OR_ERROR' : 'READ_OK',
    top40Count: top40.error ? null : top40.count,
    // This diagnostic intentionally returns no player names, IDs, or session tokens.
  };
}
