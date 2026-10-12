'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const roster=read('data/phalanx-hero-roster-gen1-gen5-v1-2026-10-12.json');
const registry=read('data/phalanx-source-registry-v13-2026-10-12.json');
test('Registry counts and source files are internally consistent',()=>{
 assert.equal(roster.heroes.length,registry.hero_count);
 assert.equal(new Set(roster.heroes.map(h=>h.name)).size,roster.heroes.length);
 assert.equal(new Set(registry.github_skill_sources).size,registry.github_skill_sources.length);
 for(const p of registry.github_skill_sources){
   assert.match(p,/^data\/phalanx-[a-z0-9-]+\.json$/);
   assert.ok(fs.existsSync(path.join(root,p)),p+' missing');
 }
});
test('Every linked hero maps to an existing source containing that hero',()=>{
 for(const hero of roster.heroes){
  if(!hero.skillEvidencePath)continue;
  const p=hero.skillEvidencePath;
  assert.ok(registry.github_skill_sources.includes(p),hero.name+' unregistered source');
  const source=read(p);
  if(source.hero)assert.equal(source.hero,hero.name);
  else assert.ok(Array.isArray(source.heroes)&&source.heroes.some(h=>h.name===hero.name),hero.name+' absent in '+p);
 }
});
test('Rosa evidence is explicitly pending, never silently fabricated',()=>{
 const rosa=roster.heroes.find(h=>h.name==='Rosa');
 assert.ok(rosa);
 if(rosa.skillDataStatus.includes('pending'))assert.equal(rosa.skillValues,null);
});
