import assert from 'node:assert/strict';
import { loadAllianceOverview } from './alliance-overview-reader-test.mjs';

// Offline-only contract: no Supabase connection, credentials or live records.
const calls = [];
const rows = [{ snapshot_date: '2026-10-16', kingdom: 1885, alliance: 'NXS', members: 90, total_power: 100000, tg5: 10, tg4: 20 }];
const client = {
  auth: { async getUser() { calls.push(['auth']); return { data: { user: { id: 'mock' } }, error: null }; } },
  from(view) {
    calls.push(['from', view]);
    return {
      select(fields) {
        calls.push(['select', fields]);
        return {
          async eq(key, value) {
            calls.push(['eq', key, value]);
            return { data: rows, error: null };
          }
        };
      }
    };
  }
};
assert.deepEqual(await loadAllianceOverview(client), rows);
assert.deepEqual(calls.map(x => x[0]), ['auth', 'from', 'select', 'eq']);
assert.ok(calls.some(x => x[0] === 'from' && x[1] === 'phalanx_alliance_latest'));
assert.ok(calls.some(x => x[0] === 'eq' && x[1] === 'kingdom' && x[2] === 1885));
assert.ok(calls.some(x => x[0] === 'select' && x[1] === 'snapshot_date,kingdom,alliance,members,total_power,tg5,tg4'));
await assert.rejects(() => loadAllianceOverview(null), /Signed-in client required/);
const anonymous = { ...client, auth: { async getUser() { return { data: { user: null }, error: null }; } } };
await assert.rejects(() => loadAllianceOverview(anonymous), /Sign-in required/);
const denied = { ...client, from() { return { select() { return { async eq() { return { data: null, error: new Error('Mock denied') }; } }; } }; } };
await assert.rejects(() => loadAllianceOverview(denied), /Mock denied/);
console.log('Alliance overview reader offline tests passed (mock-only, no live RLS proof).');
