import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';
import assert from 'node:assert/strict';

function mock(allowed) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'mock' } }, error: null }) },
    from: name => ({
      select: () => ({
        eq() { return this; },
        then(resolve, reject) {
          const result = !allowed
            ? { data: null, count: null, error: { code: '42501' } }
            : name === 'phalanx_alliance_top40'
              ? { data: null, count: 160, error: null }
              : { data: ['NXS','OoO','MYM','FRA'].map(alliance => ({ alliance })), error: null };
          return Promise.resolve(result).then(resolve, reject);
        }
      })
    })
  };
}
const permitted = await checkAllianceAccess(mock(true));
assert.equal(permitted.overview, 'READ_OK');
assert.equal(permitted.allianceCount, 4);
assert.equal(permitted.top40, 'READ_OK');
assert.equal(permitted.top40Count, 160);
const denied = await checkAllianceAccess(mock(false));
assert.equal(denied.overview, 'DENIED_OR_ERROR');
assert.equal(denied.top40, 'DENIED_OR_ERROR');
console.log('PASS: allowed and denied access contract');
