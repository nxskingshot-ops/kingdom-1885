import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';
import assert from 'node:assert/strict';

const guest = {
  auth: { getUser: async () => ({ data: { user: null }, error: null }) },
  from: () => { throw new Error('Guest must not query protected data'); }
};
const result = await checkAllianceAccess(guest);
assert.equal(result.signedIn, false);
assert.equal(result.overview, 'NOT_TESTED');
assert.equal(result.top40, 'NOT_TESTED');
console.log('PASS guest access contract');
