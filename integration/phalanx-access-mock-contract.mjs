import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';
import assert from 'node:assert/strict';

function mock(allowed) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'mock' } }, error: null }) },
    from: (name) => ({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve(allowed
            ? { data: [], count: name.includes('top40') ? 160 : null, error: null }
            : { data: null, count: null, error: { code: '42501' } }),
          then: (resolve, reject) => Promise.resolve(allowed
            ? { data: [{ alliance: 'NXS' }, { alliance: 'OoO' }, { alliance: 'MYM' }, { alliance: 'FRA' }], error: null }
            : { data: null, error: { code: '42501' } }).then(resolve, reject)
        })
      })
    })
  };
}
const permitted = await checkAllianceAccess(mock(true));
assert.equal(permitted.overview, 'READ_OK');
assert.equal(permitted.allianceCount, 4);
assert.equal(permitted.top40Count, 160);
const denied = await checkAllianceAccess(mock(false));
assert.equal(denied.overview, 'DENIED_OR_ERROR');
assert.equal(denied.top40, 'DENIED_OR_ERROR');
console.log('PASS: access diagnostic handles allowed and denied responses');
