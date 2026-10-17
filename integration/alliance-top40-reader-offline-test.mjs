import assert from 'node:assert/strict';
import { loadAllianceTop40 } from './alliance-top40-reader-test.mjs';
const calls = [];
const chain = { select(fields) { calls.push(['select', fields]); return this; }, eq(field, value) { calls.push(['eq', field, value]); return this; }, async order(field) { calls.push(['order', field]); return { data: [], error: null }; } };
const client = { auth: { async getUser() { calls.push(['auth']); return { data: { user: { id: 'mock' } }, error: null }; } }, from() { calls.push(['from']); return chain; } };
await assert.rejects(() => loadAllianceTop40(client, 'ABC'), /not approved/);
assert.equal(calls.length, 0);
assert.deepEqual(await loadAllianceTop40(client, 'ABC', '2026-10-13', { approvedAlliances: ['NXS', 'ABC'] }), []);
assert.deepEqual(await loadAllianceTop40(client, 'NXS'), []);
assert.ok(calls.some(call => call[0] === 'eq' && call[1] === 'kingdom' && call[2] === 1885));
assert.ok(calls.some(call => call[0] === 'eq' && call[1] === 'alliance' && call[2] === 'NXS'));
assert.ok(calls.some(call => call[0] === 'eq' && call[1] === 'snapshot_date' && call[2] === '2026-10-13'));
assert.ok(calls.some(call => call[0] === 'order' && call[1] === 'position'));
const beforeRejected = calls.length;
for (const approvedAlliances of [[], ['ABC', 'ABC'], ['*'], ['ABC', 'bad tag']]) {
  await assert.rejects(() => loadAllianceTop40(client, 'ABC', '2026-10-13', { approvedAlliances }), /not approved/);
}
for (const badDate of ['2026-02-30', '2026-10-13x', 'not-a-date']) {
  await assert.rejects(() => loadAllianceTop40(client, 'NXS', badDate), /Invalid snapshot date/);
}
assert.equal(calls.length, beforeRejected);
await assert.rejects(() => loadAllianceTop40(null, 'NXS'), /Signed-in client required/);
const anonymous = { ...client, auth: { async getUser() { return { data: { user: null }, error: null }; } } };
await assert.rejects(() => loadAllianceTop40(anonymous, 'NXS'), /Sign-in required/);
const rejectedAuth = { ...client, auth: { async getUser() { return { data: { user: null }, error: { message: 'private auth detail' } }; } } };
await assert.rejects(() => loadAllianceTop40(rejectedAuth, 'NXS'), /Sign-in required/);
const dbFailure = { ...client, from() { return { select() { return this; }, eq() { return this; }, async order() { return { data: null, error: new Error('Mock database failure') }; } }; } };
await assert.rejects(() => loadAllianceTop40(dbFailure, 'NXS'), /Mock database failure/);
console.log('Top40 allowlist mock tests passed; no live authorization tested.');