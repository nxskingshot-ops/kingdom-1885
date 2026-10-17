import { mapAllianceOverviewToPylon as map } from './pylon-alliance-context-mapper.mjs';
import assert from 'node:assert/strict';
// Offline, mock-only: no network, no credentials, no live records.
const asOf = '2026-10-17T05:00:00Z';
const row = { snapshot_date: '2026-10-16', kingdom: 1885, alliance: 'NXS', members: 90, total_power: 100000, tg5: 10, tg4: 20 };
const valid = map([row], { asOf });
assert.equal(valid.schema_version, 'pylon.module-context.v0');
assert.equal(valid.module, 'alliance-comparison');
assert.equal(valid.data_status, 'verified');
assert.equal(valid.facts.length, 4);
assert.equal(valid.facts[0].value, 90);
assert.ok(valid.provenance[0].includes('2026-10-16'));
for (const [rows, opts, status] of [
  [[], { asOf }, 'not-connected'],
  [[row], {}, 'not-connected'],
  [[{ ...row, kingdom: 1913 }], { asOf }, 'not-connected'],
  [[{ ...row, alliance: 'UNKNOWN' }], { asOf }, 'not-connected'],
  [[{ ...row, total_power: '100000' }], { asOf }, 'not-connected'],
  [[{ ...row, members: -1 }], { asOf }, 'not-connected'],
  [[{ ...row, snapshot_date: '2026-09-01' }], { asOf }, 'stale'],
  [[{ ...row, snapshot_date: '2026-10-19' }], { asOf }, 'stale'],
  [[row, row], { asOf }, 'not-connected'],
  [[{ ...row, snapshot_date: '2026-02-30' }], { asOf }, 'not-connected'],
]) {
  const result = map(rows, opts);
  assert.equal(result.data_status, status);
  assert.deepEqual(result.facts, []);
  assert.deepEqual(result.provenance, []);
}
console.log('PYLON alliance mapper offline tests passed (mock-only; no live auth/RLS validation).');
