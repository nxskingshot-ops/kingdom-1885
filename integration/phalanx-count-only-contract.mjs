import assert from 'node:assert/strict';
import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';

let sawCountOnly = false;
const client = {
  auth: { getUser: async () => ({ data: { user: { id: 'test' } }, error: null }) },
  from(name) {
    return {
      select(columns, options) {
        if (name === 'phalanx_alliance_top40') {
          assert.equal(columns, 'position');
          assert.equal(options?.count, 'exact');
          assert.equal(options?.head, true);
          sawCountOnly = true;
        }
        const query = {
          eq() { return this; },
          then(resolve, reject) {
            const result = name === 'phalanx_alliance_top40'
              ? { data: null, count: 160, error: null }
              : { data: [{ alliance: 'NXS' }, { alliance: 'OoO' }, { alliance: 'MYM' }, { alliance: 'FRA' }], error: null };
            return Promise.resolve(result).then(resolve, reject);
          }
        };
        return query;
      }
    };
  }
};
const result = await checkAllianceAccess(client);
assert.equal(sawCountOnly, true);
assert.equal(result.top40Count, 160);
assert.equal(result.allianceCount, 4);
console.log('PASS: count-only top40 diagnostic contract');
