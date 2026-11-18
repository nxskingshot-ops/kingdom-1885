/* Tab-scoped session continuity. Never persist passwords or profile values. */
((root) => {
  'use strict';
  function create({ request, storage, key, now = () => Date.now() }) {
    let session = null;
    let revision = 0;
    let renewing = null;
    const remove = () => { try { storage?.removeItem(key); } catch {} };
    function normalize(data) {
      const expires = data?.expires_at ?? (Number.isFinite(data?.expires_in) ? now() / 1000 + data.expires_in : 0);
      if (typeof data?.access_token !== 'string' || !data.access_token ||
          typeof data?.refresh_token !== 'string' || !data.refresh_token ||
          !Number.isFinite(expires) || expires <= 0) return null;
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: expires };
    }
    function set(data) {
      ++revision;
      session = normalize(data);
      if (!session) { remove(); return false; }
      try { storage?.setItem(key, JSON.stringify(session)); } catch {}
      return true;
    }
    function clear() { ++revision; session = null; remove(); }
    function restore() {
      try {
        const raw = storage?.getItem(key);
        session = raw ? normalize(JSON.parse(raw)) : null;
        if (raw && !session) remove();
      } catch { session = null; remove(); }
      ++revision;
      return Boolean(session);
    }
    async function token(force = false) {
      if (!session) return null;
      if (renewing?.revision === revision) return renewing.promise;
      if (!force && session.expires_at * 1000 > now() + 60000) return session.access_token;
      const captured = revision;
      const refreshToken = session.refresh_token;
      const promise = (async () => {
        const result = await request('/auth/v1/token?grant_type=refresh_token', {
          method: 'POST', body: { refresh_token: refreshToken }
        });
        if (captured !== revision) return null;
        if (result.status === 400 || result.status === 401 || result.status === 403) {
          clear(); return null;
        }
        // A network/server failure is not a logout. Keep the session for retry.
        if (result.status !== 200) throw new Error('session_refresh_unavailable');
        if (!normalize(result.data)) throw new Error('invalid_session_response');
        set(result.data);
        return session.access_token;
      })();
      renewing = { revision: captured, promise };
      try { return await promise; }
      finally { if (renewing?.promise === promise) renewing = null; }
    }
    return { set, clear, restore, token, currentToken: () => session?.access_token ?? null };
  }
  if (typeof module === 'object' && module.exports) module.exports = { create };
  else root.PhxWarRoomSession = { create };
})(globalThis);
