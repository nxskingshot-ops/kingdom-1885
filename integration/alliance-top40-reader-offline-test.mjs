import assert from 'node:assert/strict';
import { loadAllianceTop40 } from './alliance-top40-reader-test.mjs';
const calls = [];
const chain = { select() { calls.push('select'); return this; }, eq() { calls.push('eq'); return this; }, async order() { calls.push('order'); return { data: [], error: null }; } };
const client = { auth: { async getUser() { calls.push('auth'); return { data: { user: { id: 'mock' } }, error: null }; } }, from() { calls.push('from'); return chain; } };
await assert.rejects(() => loadAllianceTop40(client, 'ABC'), /not approved/);
assert.equal(calls.length, 0);
assert.deepEqual(await loadAllianceTop40(client, 'ABC', '2026-10-13', { approvedAlliances: ['NXS', 'ABC'] }), []);
assert.deepEqual(await loadAllianceTop40(client, 'NXS'), []);
for (const approvedAlliances of [[], ['ABC', 'ABC'], ['*'], ['ABC', 'bad tag']]) {
  await assert.rejects(() => loadAllianceTop40(client, 'ABC', '2026-10-13', { approvedAlliances }), /not approved/);
}
const anonymous = { ...client, auth: { async getUser() { return { data: { user: null }, error: null }; } } };
await assert.rejects(() => loadAllianceTop40(anonymous, 'NXS'), /Sign-in required/);
console.log('Top40 allowlist mock tests passed; no live authorization tested.');