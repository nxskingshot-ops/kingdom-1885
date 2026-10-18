import fs from 'node:fs';
import assert from 'node:assert/strict';
const path = 'data/phalanx-feature-id-baseline-20261018.json';
const data = JSON.parse(fs.readFileSync(path,'utf8'));
assert.equal(data.schema,'phalanx.feature-id-baseline.v1');
assert.equal(data.feature_count,74);
assert.equal(data.module_count,16);
assert.equal(data.features.length,74);
const ids = data.features.map(f=>f.id);
assert.equal(new Set(ids).size,74,'Duplicate feature IDs');
const modules = new Set(data.features.map(f=>f.module_id));
assert.equal(modules.size,16);
for(const f of data.features){
  assert.match(f.id,/^[A-Z]+-[0-9]+$/);
  assert.ok(f.name && f.module_id && f.legacy_status);
  assert.equal(f.verification,'UNVERIFIED_CURRENT_ALPHA','Historical statuses must not be silently promoted');
}
console.log('PASS: 74 unique historical features in 16 modules; runtime acceptance remains unverified');
