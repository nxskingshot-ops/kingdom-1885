import assert from 'node:assert/strict';
import { probeAllianceReadAccess } from './pylon-alliance-rls-role-check.mjs';
// Offline-only mocks. HEAD queries must not retrieve row contents.
const missing = await probeAllianceReadAccess(null);
assert.equal(missing.status, 'not-tested');
const calls = [];
const client = { auth: { async getUser() { return { data: { user: { id: 'mock-user' } }, error: null }; } },
  from(view) { calls.push(['from', view]); return { select(field, options) {
    calls.push(['select', field, options]); return { async limit(n) { calls.push(['limit', n]); return { data: null, error: null, count: 3 }; } };
  } }; } };
const result = await probeAllianceReadAccess(client);
assert.equal(result.status, 'probed');
assert.equal(result.reason, 'not-a-rls-proof');
assert.equal(result.views.length, 2);
assert.ok(result.views.every(x => x.request === 'ok' && x.visibility === 'rows-visible'));
assert.ok(calls.filter(x => x[0] === 'select').every(x => x[2].head === true && x[2].count === 'exact'));
assert.ok(calls.filter(x => x[0] === 'limit').every(x => x[1] === 1));
const anonymous = { ...client, auth: { async getUser() { return { data: { user: null }, error: null }; } } };
assert.equal((await probeAllianceReadAccess(anonymous)).status, 'not-tested');
const denied = { ...client, from(view) { return { select() { return { async limit() { return { data: null, error: { message: 'sensitive details' } }; } }; } }; } };
const blocked = await probeAllianceReadAccess(denied);
assert.ok(blocked.views.every(x => x.request === 'error'));
assert.ok(!JSON.stringify(blocked).includes('sensitive details'));
const empty = { ...client, from(view) { return { select() { return { async limit() { return { data: null, error: null, count: 0 }; } }; } }; } };
const zero = await probeAllianceReadAccess(empty);
assert.ok(zero.views.every(x => x.visibility === 'zero-visible'));
assert.ok(blocked.views.every(x => x.visibility === 'unknown'));
console.log('PYLON role probe mock tests passed (not a live RLS authorization proof).');
