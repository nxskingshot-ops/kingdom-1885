// Isolated PHALANX test adapter. Not loaded by the production app.
// Uses the existing signed-in Supabase client; never a service-role key.
export async function loadAllianceOverview(client) {
  const auth = await client.auth.getUser();
  if (auth.error || !auth.data?.user) throw new Error('Sign-in required');
  const response = await client.from('phalanx_alliance_latest')
    .select('snapshot_date,kingdom,alliance,members,total_power,tg5,tg4')
    .eq('kingdom', 1885);
  if (response.error) throw response.error;
  return response.data;
}
