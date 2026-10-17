// PHALANX roster read adapter. Test-only, no production import.
const DEFAULT_ALLIANCES = ['NXS', 'OoO', 'MYM', 'FRA'];
export async function loadAllianceTop40(client, alliance, date = '2026-10-13', { approvedAlliances } = {}) {
  const scope = approvedAlliances === undefined ? DEFAULT_ALLIANCES : approvedAlliances;
  if (!Array.isArray(scope) || !scope.length || scope.length > 100 || new Set(scope).size !== scope.length || scope.some(tag => typeof tag !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{1,15}$/.test(tag)) || !scope.includes(alliance)) throw new Error('Alliance not approved');
  const auth = await client.auth.getUser();
  if (auth.error || !auth.data?.user) throw new Error('Sign-in required');
  const result = await client.from('phalanx_alliance_top40')
    .select('snapshot_date,alliance,player_id,player_name,power,tg_level,position')
    .eq('kingdom', 1885).eq('alliance', alliance)
    .eq('snapshot_date', date).order('position');
  if (result.error) throw result.error;
  return result.data;
}
