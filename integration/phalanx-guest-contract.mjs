import { checkAllianceAccess } from './phalanx-access-diagnostic.mjs';
import assert from 'node:assert/strict';

const guest = {
  auth: { getUser: async () => ({ data: { user: null }, error: null }) },
  from: () => { throw Error('Protected view queried without login'); }
};
const outcome = await checkAllianceAccess(guest);
assert.equal(outcome.signedIn, false);
assert.equal(outcome.overview, 'NOT_TESTED');
assert.equal(outcome.top40, 'NOT_TESTED');
console.log('PASS: guest cannot query alliance data');
