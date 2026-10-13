// NEXUS PHALANX: effect/model bridge structural regression. Run: node tests/phalanx-effect-model-bridge-v1.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const bridge = read('data/phalanx-effect-model-bridge-v1-2026-10-13.json');
const taxonomy = read('data/phalanx-skill-effect-taxonomy-v1-2026-10-13.json');
const valid = new Set(['blocked','requires_specialized_model','conditional_input_only','scenario_only']);
assert.equal(bridge.effectMappings.length, taxonomy.effects.length);
const counts = {blocked:0,specialized:0,conditional:0,scenarioOnly:0};
const map = {blocked:'blocked',requires_specialized_model:'specialized',conditional_input_only:'conditional',scenario_only:'scenarioOnly'};
for (let i=0;i<bridge.effectMappings.length;i++){
  const e=bridge.effectMappings[i], src=taxonomy.effects[i];
  assert.equal(e.hero,src.hero);assert.equal(e.skill,src.skill);assert.equal(e.field,src.field);assert.equal(e.source,src.source);
  assert.ok(valid.has(e.status));assert.ok(e.guard);assert.ok(e.source);
  if(e.status==='blocked')assert.equal(e.model,null);
  if(e.status==='scenario_only')assert.equal(e.category,'probability');
  if(['attackSpeedPct','allSquadsDamageTakenReductionPct','targetAttackSpeedReductionPct'].includes(e.field))assert.equal(e.status,'requires_specialized_model');
  counts[map[e.status]]++;
}
assert.deepEqual({effects:bridge.effectMappings.length,...counts},bridge.counts);
assert.equal(bridge.releaseGate,'NOT_READY_FOR_GAME_ACCURACY_CLAIMS');
console.log('PASS: PHALANX effect bridge 47 mappings, provenance, guards, counts and release gate');
