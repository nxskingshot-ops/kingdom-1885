import assert from 'node:assert/strict';
import { getPylonAlliancePreview } from './pylon-alliance-preview.mjs';

// Offline integration check: no real users, tokens, RLS or database connection.
const asOf = '2026-10-17T12:00:00Z';
const sample = { snapshot_date: '2026-10-16', kingdom: 1885, alliance: 'NXS', members: 95, total_power: 12345, tg5: 5, tg4: 10 };
function mock({ user = true, rows = [sample], error = null } = {}) {
  const calls = [];
  const chain = { select() { calls.push('select'); return this; },
    eq() { calls.push('eq'); return Promise.resolve({ data: rows, error }); } };
  return { calls, client: {
    auth: { async getUser() { calls.push('auth'); return { data: { user: user ? { id: 'offline-mock' } : null }, error: null }; } },
    from() { calls.push('from'); return chain; }
  } };
}
const ok = mock();
const verified = await getPylonAlliancePreview(ok.client, { asOf });
assert.equal(verified.status, 'verified');
assert.equal(verified.facts_visible, true);
assert.ok(verified.lines.some(line => line.includes('NXS · members: 95')));
assert.deepEqual(ok.calls, ['auth', 'from', 'select', 'eq']);
for (const { client } of [
  mock({ user: false }),
  mock({ rows: [] }),
  mock({ error: { message: 'DO NOT LEAK SECRET' } })
]) {
  const result = await getPylonAlliancePreview(client, { asOf });
  assert.equal(result.facts_visible, false);
  assert.ok(!JSON.stringify(result).includes('DO NOT LEAK SECRET'));
}
const stale = await getPylonAlliancePreview(mock({ rows: [{ ...sample, snapshot_date: '2026-09-01' }] }).client, { asOf });
assert.equal(stale.status, 'stale');
assert.equal(stale.facts_visible, false);
const missing = await getPylonAlliancePreview(null, { asOf });
assert.equal(missing.facts_visible, false);
console.log('PYLON Alliance preview integration mock check passed (no live RLS verification).');
