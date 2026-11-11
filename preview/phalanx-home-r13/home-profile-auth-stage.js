/* PHALANX HOME R15 – isolated authenticated profile bridge (NOT production wired).
 * Preserves existing HOME DOM, roles and auth. Requires existing Supabase client.
 * Do not treat historic snapshot as current. No writes, no new auth, no storage.
 */
(() => {
  'use strict';
  // Never embed account UUID → player ID mappings in client-side source.
  const byId = id => document.getElementById(id);
  const setText = (id, value) => { const el=byId(id); if(el) el.textContent=value == null || value === '' ? '—' : String(value); };
  const formatKingdom = value => value == null ? '—' : '#' + String(value).replace(/^#/, '');
  async function renderAuthenticatedHome(supabase, resolvePlayerId) {
    if (!supabase?.auth?.getUser || !supabase?.from) throw new Error('Existing Supabase client required');
    const {data:authData,error:authError}=await supabase.auth.getUser();
    if(authError) throw authError;
    const user=authData?.user;
    if(!user) return {status:'NOT_AUTHENTICATED'};
    const {data:profile,error:profileError}=await supabase.from('app_profiles').select('display_name').eq('user_id',user.id).maybeSingle();
    if(profileError) throw profileError;
    setText('phx-r10-name',profile?.display_name || '—');
    // Resolver must use an authorized server-side account↔player mapping.
    // Do not derive identity from display name or untrusted browser storage.
    const playerId=typeof resolvePlayerId === 'function' ? await resolvePlayerId(user) : null;
    if(playerId && !/^\\d+$/.test(String(playerId))) throw new Error('Invalid player ID');
    if(!playerId) {
      setText('phx-r11-kingdom',null);
      setText('phx-r11-alliance',null);
      setText('phx-r10-sub','Level nicht verifiziert');
      return {status:'PLAYER_LINK_MISSING'};
    }
    const {data:rows,error:playerError}=await supabase.from('phalanx_alliance_players')
      .select('player_id,player_name,kingdom,alliance,alliance_rank,tg_level,snapshot_date')
      .eq('player_id',playerId).order('snapshot_date',{ascending:false}).limit(1);
    if(playerError) throw playerError;
    const player=rows?.[0];
    if(!player) return {status:'PLAYER_SNAPSHOT_MISSING'};
    setText('phx-r11-kingdom',formatKingdom(player.kingdom));
    setText('phx-r11-alliance',player.alliance);
    // TG-level is not player level; never render it as such.
    setText('phx-r10-sub','Level nicht verifiziert');
    // Rank and snapshot date are intentionally NOT silently inserted into frozen layout.
    return {status:'HISTORIC_SNAPSHOT',playerId,snapshotDate:player.snapshot_date,allianceRank:player.alliance_rank};
  }
  // Explicit staging hook; do not auto-bootstrap or bypass existing login/navigation.
  Object.defineProperty(window,'PHX_HOME_PROFILE_STAGE',{value:Object.freeze({renderAuthenticatedHome}),configurable:false});
})();
