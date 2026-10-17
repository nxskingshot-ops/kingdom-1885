// PYLON IX: opt-in read-only RLS role check, to be run in a controlled signed-in test harness.
// Does not create users, mutate memberships, write data, or log row contents.
const VIEWS = ['phalanx_alliance_latest', 'phalanx_alliance_top40'];
export async function probeAllianceReadAccess(client) {
  if (!client?.auth?.getUser || !client?.from) return { status: 'not-tested', reason: 'missing-client', views: [] };
  let auth;
  try { auth = await client.auth.getUser(); } catch { return { status: 'not-tested', reason: 'auth-failed', views: [] }; }
  if (auth.error || !auth.data?.user) return { status: 'not-tested', reason: 'not-signed-in', views: [] };
  const views = [];
  for (const view of VIEWS) {
    try {
      // HEAD-only exact count: no private row contents are returned.
      const result = await client.from(view).select('snapshot_date', { head: true, count: 'exact' }).limit(1);
      views.push({ view, request: result.error ? 'error' : 'ok', visibility: result.error ? 'unknown' : (Number.isSafeInteger(result.count) && result.count >= 0 ? (result.count > 0 ? 'rows-visible' : 'zero-visible') : 'unknown') });
    } catch { views.push({ view, request: 'error', visibility: 'unknown' }); }
  }
  return { status: 'probed', reason: 'not-a-rls-proof', views };
}
