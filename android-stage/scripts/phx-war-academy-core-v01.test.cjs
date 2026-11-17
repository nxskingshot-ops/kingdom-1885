'use strict';
const assert = require('node:assert/strict');
const core = require('./phx-war-academy-core-v01.js');
const valid = {playerId:'291688449',freshness:'fresh',checkedAt:'2026-11-17T08:00:00Z',player:{name:'Test',kingdom:1885,alliance:'NXS',power:'194223133',town_center_level:'TG5'}};
const p = core.normalizeProfile(valid);
assert.equal(p.playerId,'291688449');
assert.equal(p.townCenter,'TG5');
assert.equal(p.source,'mightpulse-via-authorized-backend');
assert.equal(core.normalizeProfile({...valid,freshness:'stale'}),null);
assert.equal(core.normalizeProfile({...valid,player:{...valid.player,kingdom:0}}),null);
assert.equal(core.normalizeProfile({...valid,playerId:'not-id'}),null);
assert.equal(core.normalizeProfile({...valid,player:{...valid.player,town_center_level:999}}).townCenter,null);
const a=core.assess(p,{infantry:{status:'unlocked',evidence:'manual-confirmed'},cavalry:'unlocked',archers:'unknown'},'TG5');
assert.equal(a.confirmedUnlocks,1);
assert.equal(a.knownBranches,2);
assert.equal(a.complete,false);
assert.equal(a.score,null);
assert.equal(a.resourceEstimate,null);
assert.equal(a.t11.cavalry.verification,'unknown');
assert.equal(core.assess(null,null,null).knownBranches,0);
assert.equal(core.assess(null,{infantry:'bogus'},'TG999').warAcademy,null);
console.log('PASS: 14 assertions covering identity, freshness, levels, T11 provenance, unknowns and no invented score.');

const transfer = {
  ok: true, governorId: '301999999',
  source: { cachedAt: Date.parse('2026-11-17T08:00:00Z') / 1000, fresh: true },
  player: { name: 'Other Kingdom', kingdom: 1901, townCenterLevel: 29 }
};
assert.equal(core.normalizeTransferProfile(transfer, '301999999').townCenter, '29');
assert.equal(core.normalizeTransferProfile(transfer, '291688449'), null);
assert.equal(core.normalizeTransferProfile({ ...transfer, source: { ...transfer.source, fresh: false } }, '301999999'), null);
assert.equal(core.normalizeTransferProfile({ ...transfer, source: { ...transfer.source, fresh: null } }, '301999999'), null);
assert.equal(core.normalizeTransferProfile(transfer, '301999999').capturedAt, '2026-11-17T08:00:00.000Z');
assert.equal(core.assess(core.normalizeTransferProfile(transfer, '301999999')).warAcademy, null);
console.log('PASS: Transfer uses its exact requested ID and leaves unsupported fields unknown.');
