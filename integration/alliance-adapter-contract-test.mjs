import { loadAllianceOverview } from './alliance-overview-reader-test.mjs';
import { loadAllianceTop40 } from './alliance-top40-reader-test.mjs';

// Offline adapter contract test. No database keys, no live changes.
function check(ok, message) { if (!ok) throw new Error(message); }
function clientFor({ user = true, allowed = true, rows = [] } = {}) {
  const calls = [];
  const chain = {
    select(columns) { calls.push(['select', columns]); return this; },
    eq(field, value) { calls.push(['eq', field, value]); return this; },
    order(field) { calls.push(['order', field]); return Promise.resolve({ data: rows, error: allowed ? null : { message: 'permission denied' } }); },
    then(resolve, reject) { return Promise.resolve({ data: rows, error: allowed ? null : { message: 'permission denied' } }).then(resolve, reject); }
  };
  return {
    calls,
    auth: { async getUser() { return { data: { user: user ? { id: 'test-user' } : null }, error: null }; } },
    from(table) { calls.push(['from', table]); return chain; }
  };
}
const active = clientFor({ rows: [{ alliance: 'NXS', members: 98 }] });
check((await loadAllianceOverview(active)).length === 1, 'overview response');
check(active.calls.some(c => c[0] === 'from' && c[1] === 'phalanx_alliance_latest'), 'overview view');
const denied = clientFor({ user: false });
let blocked = false;
try { await loadAllianceOverview(denied); } catch { blocked = true; }
check(blocked, 'anonymous blocked');
const restricted = clientFor({ allowed: false });
blocked = false;
try { await loadAllianceOverview(restricted); } catch { blocked = true; }
check(blocked, 'RLS error forwarded');
const top = clientFor({ rows: [{ player_id: '1', position: 1 }] });
check((await loadAllianceTop40(top, 'NXS')).length === 1, 'top40 response');
check(top.calls.some(c => c[0] === 'eq' && c[1] === 'alliance' && c[2] === 'NXS'), 'alliance filter');
blocked = false;
try { await loadAllianceTop40(top, 'OTHER'); } catch { blocked = true; }
check(blocked, 'invalid alliance blocked');
console.log('PHALANX adapter contract tests passed (mock only; no live auth test).');
