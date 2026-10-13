import assert from 'node:assert/strict';
import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';

function clientFor(overviewRows, top40Count) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'test' } }, error: null }) },
    from(name) {
      return {
        select() {
          return {
            eq() { return this; },
            then(resolve, reject) {
              return Promise.resolve(name === 'phalanx_alliance_latest'
                ? { data: overviewRows, error: null }
                : { data: null, count: top40Count, error: null }).then(resolve, reject);
            }
          };
        }
      };
    }
  };
}
const empty = await checkAllianceAccess(clientFor([], 0));
assert.equal(empty.overview, 'EMPTY_OR_INCOMPLETE');
assert.equal(empty.top40, 'EMPTY_OR_INCOMPLETE');
const partial = await checkAllianceAccess(clientFor([{ alliance: 'NXS' }], 40));
assert.equal(partial.overview, 'EMPTY_OR_INCOMPLETE');
assert.equal(partial.top40, 'EMPTY_OR_INCOMPLETE');
console.log('PASS: empty and partial RLS-filtered results are not READ_OK');
