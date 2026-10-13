// PHALANX roster read adapter. Test-only, no production import.
const ALLIANCES = ['NXS', 'OoO', 'MYM', 'FRA'];
export async function loadAllianceTop40(client, alliance, date = '2026-10-13') {
  if (!ALLIANCES.includes(alliance)) throw new Error('Unknown alliance');
  const auth = await client.auth.getUser();
  if (auth.error || !auth.data?.user) throw new Error('Sign-in required');
  const result = await client.from('phalanx_alliance_top40')
    .select('snapshot_date,alliance,player_id,player_name,power,tg_level,position')
    .eq('kingdom', 1885).eq('alliance', alliance)
    .eq('snapshot_date', date).order('position');
  if (result.error) throw result.error;
  return result.data;
}
