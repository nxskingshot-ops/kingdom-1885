// Run: node integration/phalanx-top40-v2-static-regression-20261014.mjs
// Offline static contract checks only; not a browser, auth, or server permission test.
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const html=readFileSync(new URL('../preview/phalanx-top40-v5-membership-gate-race-v2-candidate-20261014.html',import.meta.url),'utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'module script exists');
const cases=[
 ['initial button disabled',/topButton\.disabled=true/],
 ['async init wrapper',/async function initializeTop40Access\(\)/],
 ['session verification',/await client\.auth\.getUser\(\)/],
 ['membership validation',/from\('nxs_memberships'\)/],
 ['membership expiry validation',/Date\.parse\(m\.expires_at\)>Date\.now\(\)/],
 ['auth change invalidation',/event==='SIGNED_OUT'/],
 ['auth generation invalidation',/if\(initEpoch!==accessEpoch\)return/],
 ['request generation invalidation',/requestEpoch!==accessEpoch/],
 ['stale error suppression',/if\(accessReady&&requestEpoch===accessEpoch\)/],
 ['button unlock after verification',/authorizedUserId=verifiedUserId;accessReady=true;topButton\.disabled=false/],
 ['fixed snapshot documented',/2026-10-13/]
];
for(const [name,regex] of cases){assert.match(script,regex,name);console.log('PASS',name)}
console.log('PASS',cases.length,'static contracts; browser and database behavior NOT tested');
