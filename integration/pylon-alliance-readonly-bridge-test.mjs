import assert from 'node:assert/strict';
import { loadPylonAllianceContext } from './pylon-alliance-readonly-bridge.mjs';
// Mock-only security contract; no real DB access or credentials.
const asOf = '2026-10-17T12:00:00Z';
const rows = [{ snapshot_date: '2026-10-16', kingdom: 1885, alliance: 'NXS', members: 95, total_power: 12345, tg5: 5, tg4: 10 }];
function mock({ user = true, error = null, data = rows } = {}) {
  const calls = [];
  const chain = { select(cols) { calls.push(['select', cols]); return this; },
    eq(key, value) { calls.push(['eq', key, value]); return Promise.resolve({ data, error }); } };
  const client = { auth: { async getUser() { calls.push(['auth']); return { data: { user: user ? { id: 'mock' } : null }, error: null }; } },
    from(name) { calls.push(['from', name]); return chain; } };
  return { client, calls };
}
const ok = mock();
const verified = await loadPylonAllianceContext(ok.client, { asOf });
assert.equal(verified.data_status, 'verified');
assert.equal(verified.facts.length, 4);
assert.deepEqual(ok.calls.map(x => x[0]), ['auth', 'from', 'select', 'eq']);
assert.ok(ok.calls.some(x => x[0] === 'from' && x[1] === 'phalanx_alliance_latest'));
assert.ok(ok.calls.some(x => x[0] === 'eq' && x[1] === 'kingdom' && x[2] === 1885));
for (const testCase of [mock({ user: false }), mock({ error: { message: 'secret private db error' } }), mock({ data: [] })]) {
  const result = await loadPylonAllianceContext(testCase.client, { asOf });
  assert.equal(result.data_status, 'not-connected');
  assert.deepEqual(result.facts, []);
  assert.deepEqual(result.provenance, []);
  assert.ok(!JSON.stringify(result).includes('secret private db error'));
}
const stale = await loadPylonAllianceContext(mock({ data: [{ ...rows[0], snapshot_date: '2026-09-01' }] }).client, { asOf });
assert.equal(stale.data_status, 'stale');
assert.deepEqual(stale.facts, []);
const missing = await loadPylonAllianceContext(null, { asOf });
assert.equal(missing.data_status, 'not-connected');
const missingClientResult = await loadPylonAllianceContext({ auth: {}, from() {} }, { asOf });
assert.equal(missingClientResult.data_status, 'not-connected');
const noTime = mock();
assert.equal((await loadPylonAllianceContext(noTime.client)).data_status, 'not-connected');
assert.equal(noTime.calls.length, 0);
// A new alliance is blocked by default and only admitted by explicit reviewed scope.
const extraRows = [{ ...rows[0], alliance: 'ABC' }];
const extraDefault = await loadPylonAllianceContext(mock({ data: extraRows }).client, { asOf });
assert.equal(extraDefault.data_status, 'not-connected');
assert.deepEqual(extraDefault.facts, []);
const extraApproved = await loadPylonAllianceContext(mock({ data: extraRows }).client, { asOf, approvedAlliances: ['NXS', 'ABC'] });
assert.equal(extraApproved.data_status, 'verified');
assert.ok(extraApproved.facts.every(f => f.label.startsWith('ABC')));
console.log('PYLON isolated read-only bridge mock tests passed (no real RLS validation).');
