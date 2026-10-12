const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const roster=read('data/phalanx-hero-roster-gen1-gen5-v1-2026-10-12.json');
const first=read('data/phalanx-seven-hero-first-expedition-skills-2026-10-12.json').values;
const engine=require('../src/phalanx-screenshot-joiner-v2.js');
assert.equal(roster.heroes.length,28);
assert.equal(new Set(roster.heroes.map(h=>h.name)).size,28);
assert.deepEqual([1,2,3,4,5].map(g=>roster.heroes.filter(h=>h.generation===g).length),[16,3,3,3,3]);
let checked=0;
for(const [name,record] of Object.entries(first)){
 const hero=roster.heroes.find(h=>h.name===name);
 assert.ok(hero&&hero.skillEvidencePath,name+' missing evidence link');
 const evidence=read(hero.skillEvidencePath);
 assert.equal(evidence.hero,name);
 const firstSkill=evidence.skills.find(s=>s.mode==='expedition'&&s.slot===1);
 assert.ok(firstSkill,name+' missing expedition skill 1');
 const fields=record.stat==='lethality'?[['pct','allSquadsLethalityPct','lethality']]:record.stat==='attack'?[['pct','allSquadsAttackPct','attack']]:record.stat==='attack_and_defense'?[['attackPct','allSquadsAttackPct','attack'],['defensePct','allSquadsDefensePct','defense']]:[['defensePct','defensePct','defense'],['healthPct','healthPct','health']];
 for(const [inputKey,evidenceKey,outputKey] of fields){
   assert.deepEqual(record[inputKey],firstSkill[evidenceKey],name+' '+evidenceKey);
   for(let level=1;level<=5;level++)assert.equal(engine.skill(name,level)[outputKey],record[inputKey][level-1]);
 }
 checked++;
}
assert.equal(checked,7);
console.log('Roster 28, seven evidence files and 45 screenshot skill level values cross-checked');
