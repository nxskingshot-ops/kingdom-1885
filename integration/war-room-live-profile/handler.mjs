/** Read the current account's profile using an approved link and the existing lookup bridge. */
export function createWarRoomProfileHandler({ projectUrl, publishableKey, androidOrigin, request = fetch }) {
  const project = new URL(projectUrl);
  if (project.protocol !== 'https:' || project.pathname !== '/' || project.search || project.hash ||
      project.username || project.password || !project.hostname.endsWith('.supabase.co')) {
    throw new Error('Expected an HTTPS Supabase project URL');
  }
  if (!publishableKey) throw new Error('Missing Supabase publishable key');

  const linkUrl = new URL('/rest/v1/rpc/phx_war_room_current_player_id', project);
  const bridgeUrl = new URL('/functions/v1/phalanx-transfer-id-snapshot-fallback-stage-20261031', project);

  return async function handle(incoming) {
    const headers = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin' });
    const origin = incoming.headers.get('Origin');
    const reply = (body, status = 200) => Response.json(body, { status, headers });
    if (origin && origin !== androidOrigin) return reply({ error: 'origin_forbidden' }, 403);
    if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Authorization, apikey, Content-Type, x-client-info');
    }
    if (incoming.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (incoming.method !== 'GET') {
      headers.set('Allow', 'GET, OPTIONS');
      return reply({ error: 'method_not_allowed' }, 405);
    }
    if (new URL(incoming.url).search) return reply({ error: 'unexpected_query' }, 400);

    const authorization = incoming.headers.get('Authorization');
    if (!/^Bearer \S+$/.test(authorization ?? '')) return reply({ error: 'sign_in_required' }, 401);
    const authHeaders = { Authorization: authorization, apikey: publishableKey };
    try {
      const link = await request(linkUrl, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: '{}',
        redirect: 'error',
        signal: AbortSignal.timeout(8000)
      });
      if (link.status === 401 || link.status === 403) return reply({ error: 'sign_in_required' }, 401);
      if (!link.ok) return reply({ error: 'identity_service_unavailable' }, 503);
      const playerId = await link.json();
      if (playerId === null) return reply({ error: 'approved_player_link_required' }, 403);
      if (typeof playerId !== 'string' || !/^[1-9]\d{0,15}$/.test(playerId)) {
        return reply({ error: 'identity_service_unavailable' }, 503);
      }

      const target = new URL(bridgeUrl);
      target.searchParams.set('governorId', playerId);
      const source = await request(target, {
        headers: authHeaders,
        redirect: 'error',
        signal: AbortSignal.timeout(95000)
      });
      if (source.status === 401 || source.status === 403) {
        return reply({ error: 'profile_source_access_denied' }, 403);
      }
      if (!source.ok) return reply({ error: 'profile_source_unavailable' }, 503);
      const payload = await source.json();
      if (payload?.ok !== true || payload.governorId !== playerId) {
        return reply({ error: 'source_identity_mismatch' }, 502);
      }

      const capturedAt = utcDate(payload.source?.cachedAt);
      const checkedAt = utcDate(payload.checkedAtUtc);
      const isFresh = payload.source?.fresh === true && capturedAt && checkedAt &&
        Date.parse(capturedAt) <= Date.parse(checkedAt);
      const player = payload.player;
      return reply({
        playerId,
        freshness: isFresh ? 'fresh' : 'unknown_or_stale',
        capturedAt,
        checkedAt,
        player: isFresh && player ? {
          name: typeof player.name === 'string' ? player.name : null,
          kingdom: Number.isSafeInteger(player.kingdom) && player.kingdom > 0 ? player.kingdom : null,
          alliance: typeof player.alliance === 'string' ? player.alliance : null,
          power: normalizePower(player.power)
        } : null
      });
    } catch {
      return reply({ error: 'profile_source_unavailable' }, 503);
    }
  };
}

function utcDate(value) {
  let time;
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value))) {
    const timestamp = Number(value);
    if (!Number.isFinite(timestamp) || timestamp < 0) return null;
    time = new Date(timestamp >= 1e12 ? timestamp : timestamp * 1000).getTime();
  } else if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) &&
      /(?:Z|[+-]\d\d:\d\d)$/.test(value)) {
    time = Date.parse(value);
  }
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function normalizePower(power) {
  if (typeof power === 'number' && Number.isSafeInteger(power) && power >= 0) return String(power);
  if (typeof power === 'string' && /^\d{1,24}$/.test(power)) return power;
  return null;
}
