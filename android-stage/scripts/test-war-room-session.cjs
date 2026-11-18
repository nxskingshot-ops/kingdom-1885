'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { create } = require('../www/phx-war-room-session.js');
const fresh = { access_token:'fixture-access', refresh_token:'fixture-refresh', expires_at:4600 };
function setup(request = async () => ({status:200,data:{...fresh,access_token:'rotated-access',refresh_token:'rotated-refresh'}})) {
  const items = new Map([['unrelated-profile','preserve']]);
  const storage = {getItem:k=>items.get(k)??null,setItem:(k,v)=>items.set(k,v),removeItem:k=>items.delete(k)};
  return {items,storage,create:()=>create({request,storage,key:'test-session',now:()=>1000000})};
}
test('reload restores the same tab session without persisting password, user or profile', async () => {
  const f=setup(); const first=f.create();
  first.set({...fresh,password:'must-not-store',user:{email:'fixture@example.invalid'},player:{name:'Fixture'}});
  assert.deepEqual(JSON.parse(f.items.get('test-session')),fresh);
  const reloaded=f.create(); assert.equal(reloaded.restore(),true);
  assert.equal(await reloaded.token(),'fixture-access');
});
test('expired session refreshes once for concurrent calls and stores the rotated token', async () => {
  let calls=0; const f=setup(async (url,options)=>{
    calls++; assert.equal(url,'/auth/v1/token?grant_type=refresh_token');
    assert.deepEqual(options,{method:'POST',body:{refresh_token:'fixture-refresh'}});
    return {status:200,data:{...fresh,access_token:'rotated',refresh_token:'rotated-refresh'}};
  });
  const s=f.create();s.set({...fresh,expires_at:999});
  assert.deepEqual(await Promise.all([s.token(),s.token()]),['rotated','rotated']);
  assert.equal(calls,1);assert.equal(JSON.parse(f.items.get('test-session')).refresh_token,'rotated-refresh');
});
test('logout removes only this session and reload remains signed out', async () => {
  const f=setup();const s=f.create();s.set(fresh);s.clear();
  const next=f.create();assert.equal(next.restore(),false);assert.equal(await next.token(),null);
  assert.equal(f.items.get('unrelated-profile'),'preserve');
});
test('a refresh arriving after logout cannot restore the session', async () => {
  let finish;const f=setup(()=>new Promise(resolve=>{finish=resolve;}));
  const s=f.create();s.set({...fresh,expires_at:999});const pending=s.token();s.clear();
  finish({status:200,data:fresh});assert.equal(await pending,null);assert.equal(s.currentToken(),null);
  assert.equal(f.items.has('test-session'),false);
});
test('a refresh from an earlier account cannot overwrite a new login', async () => {
  let finish;const f=setup(()=>new Promise(resolve=>{finish=resolve;}));
  const s=f.create();s.set({...fresh,expires_at:999});const pending=s.token();
  s.set({...fresh,access_token:'other-account'});finish({status:200,data:fresh});
  assert.equal(await pending,null);assert.equal(await s.token(),'other-account');
});
test('invalid refresh token signs out; temporary server errors preserve retry', async () => {
  for(const status of [400,401,403,429,503]) {
    const f=setup(async()=>({status}));const s=f.create();s.set({...fresh,expires_at:999});
    if(status<429) {assert.equal(await s.token(),null);assert.equal(s.currentToken(),null);}
    else {await assert.rejects(s.token(),/unavailable/);assert.equal(s.currentToken(),'fixture-access');}
  }
});
test('network failure keeps session and a later refresh can recover', async () => {
  let attempts=0;const f=setup(async()=>{if(++attempts===1)throw Error('offline');return {status:200,data:fresh};});
  const s=f.create();s.set({...fresh,expires_at:999});await assert.rejects(s.token(),/offline/);
  assert.equal(await s.token(),'fixture-access');assert.equal(attempts,2);
});
test('malformed stored sessions are discarded without touching other data', () => {
  for(const value of ['{broken','null','{}',JSON.stringify({...fresh,refresh_token:null})]) {
    const f=setup();f.items.set('test-session',value);assert.equal(f.create().restore(),false);
    assert.equal(f.items.get('unrelated-profile'),'preserve');assert.equal(f.items.has('test-session'),false);
  }
});
test('blocked browser storage keeps login in memory without throwing', async () => {
  const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
  const s=create({request:()=>{},storage,key:'test',now:()=>1000000});assert.equal(s.restore(),false);
  assert.equal(s.set(fresh),true);assert.equal(await s.token(),'fixture-access');s.clear();
});
test('forced renewal handles a server-rejected unexpired access token', async () => {
  const f=setup();const s=f.create();s.set(fresh);assert.equal(await s.token(true),'rotated-access');
});
