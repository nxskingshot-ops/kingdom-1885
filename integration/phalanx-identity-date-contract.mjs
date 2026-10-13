import assert from 'node:assert/strict';
import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';

function clientFor(rows) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'test' } }, error: null }) },
    from(name) {
      return {
        select() {
          return {
            eq() { return this; },
            then(resolve, reject) {
              return Promise.resolve(name === 'phalanx_alliance_latest'
                ? { data: rows, error: null }
                : { data: null, count: 160, error: null }).then(resolve, reject);
            }
          };
        }
      };
    }
  };
}
const good = ['NXS','OoO','MYM','FRA'].map(alliance => ({ alliance, snapshot_date: '2026-10-13' }));
const duplicated = good.map((row, i) => i === 3 ? { ...good[0] } : row);
const stale = good.map((row, i) => i === 0 ? { ...row, snapshot_date: '2026-10-12' } : row);
assert.equal((await checkAllianceAccess(clientFor(good))).overview, 'READ_OK');
assert.equal((await checkAllianceAccess(clientFor(duplicated))).overview, 'EMPTY_OR_INCOMPLETE');
assert.equal((await checkAllianceAccess(clientFor(stale))).overview, 'EMPTY_OR_INCOMPLETE');
console.log('PASS: only four distinct expected alliances at correct date count as success');
