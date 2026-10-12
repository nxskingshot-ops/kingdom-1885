'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const page='preview/phalanx-rally-selection-alpha32-2026-10-12.html';
test('Alpha32 preview local dependencies exist and cannot escape project',()=>{
 const html=fs.readFileSync(path.join(root,page),'utf8');
 const refs=[...html.matchAll(/<(?:script|a)\b[^>]*?\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(refs.length>=3,'Expected script dependencies and Monte Carlo link');
 for(const ref of refs){
  if(/^(https?:|data:|#)/.test(ref))continue;
  const normalized=ref.split(/[?#]/)[0];
  const full=path.resolve(root,'preview',normalized);
  assert.ok(full.startsWith(root+path.sep),'Escaping repo: '+ref);
  assert.ok(fs.existsSync(full),'Missing local resource: '+ref);
 }
});
