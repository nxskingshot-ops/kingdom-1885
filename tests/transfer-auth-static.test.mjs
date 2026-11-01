// PHALANX transfer access acceptance checks; run with node --test.
// These are static regression checks, NOT proof of email delivery or a live reset.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => readFileSync(new URL('../preview/'+name,import.meta.url),'utf8');

test('protected scouting login links registration and recovery',()=>{
  const html=read('transfer-scouting-id-stage-20261030.html');
  assert.match(html,/href="\.\/transfer-register\.html"/);
  assert.match(html,/href="\.\/password-recovery\.html"/);
});
test('registration requires two password inputs and offers visibility toggle',()=>{
  const html=read('transfer-register.html');
  assert.match(html,/id="password"[^>]*minlength="12"/);
  assert.match(html,/id="confirm"[^>]*minlength="12"/);
  assert.match(html,/id="show"/);
  const js=read('transfer-register.js');
  assert.match(js,/signUp\(/);
  assert.match(js,/password!==\$\('confirm'\)\.value/);
});
test('recovery has reset and confirmation inputs',()=>{
  const html=read('password-recovery.html');
  assert.match(html,/id="request"/);
  assert.match(html,/id="reset"/);
  assert.match(html,/id="confirm"/);
  assert.match(html,/id="show"/);
});
test('recovery uses Supabase auth and signs out after successful update',()=>{
  const js=read('password-recovery.js');
  assert.match(js,/resetPasswordForEmail\(/);
  assert.match(js,/updateUser\(\{password:/);
  assert.match(js,/auth\.signOut\(/);
});
test('security gate: generic auth code must not directly open reset form',()=>{
  const js=read('password-recovery.js');
  assert.doesNotMatch(js,/exchangeCodeForSession\([^)]*\)[\s\S]{0,180}else resetMode\(\)/);
});
