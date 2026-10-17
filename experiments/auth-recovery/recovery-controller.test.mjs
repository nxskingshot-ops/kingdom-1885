import assert from "node:assert/strict";
import { test } from "node:test";
import { createRecoveryController } from "./recovery-controller.js";
function setup() {
  let listener, updates=0, signs=0;
  const states=[];
  const auth={
    onAuthStateChange(fn){listener=fn;return {data:{subscription:{unsubscribe(){listener=null;}}}};},
    async updateUser({password}){updates++;assert.ok(password.length>=12);return {error:null};},
    async signOut(){signs++;return {error:null};}
  };
  const controller=createRecoveryController({auth,view:{render(value){states.push(value);}}});
  return {controller,states,emit(event){listener?.(event);},counts(){return {updates,signs};}};
}
test("recovery stays visible despite regular sign-in events",async()=>{
  const t=setup();await t.controller.initialize({hasRecoveryLink:true});
  t.emit("PASSWORD_RECOVERY");t.emit("SIGNED_IN");t.emit("INITIAL_SESSION");
  assert.equal(t.states.at(-1).state,"ready");
});
test("missing recovery link blocks password changes",async()=>{
  const t=setup();await t.controller.initialize();
  assert.equal(await t.controller.submit("very-long-password","very-long-password"),false);
  assert.deepEqual(t.counts(),{updates:0,signs:0});
});
test("confirmation mismatch blocks password update",async()=>{
  const t=setup();await t.controller.initialize({hasRecoveryLink:true});t.emit("PASSWORD_RECOVERY");
  assert.equal(await t.controller.submit("very-long-password","different-password"),false);
  assert.equal(t.counts().updates,0);
});
test("successful update never signs out or redirects automatically",async()=>{
  const t=setup();await t.controller.initialize({hasRecoveryLink:true});t.emit("PASSWORD_RECOVERY");
  assert.equal(await t.controller.submit("very-long-password","very-long-password"),true);
  assert.equal(t.states.at(-1).state,"complete");
  assert.deepEqual(t.counts(),{updates:1,signs:0});
  t.emit("SIGNED_IN");assert.equal(t.states.at(-1).state,"complete");
});
test("sign-out only after completed password update",async()=>{
  const t=setup();assert.equal(await t.controller.signOut(),false);
  await t.controller.initialize({hasRecoveryLink:true});t.emit("PASSWORD_RECOVERY");
  await t.controller.submit("very-long-password","very-long-password");
  assert.equal(await t.controller.signOut(),true);
  assert.deepEqual(t.counts(),{updates:1,signs:1});
});

test("recovery event without recovery URL never unlocks the form",async()=>{
  const t=setup();await t.controller.initialize({hasRecoveryLink:false});
  t.emit("PASSWORD_RECOVERY");
  assert.equal(await t.controller.submit("very-long-password","very-long-password"),false);
  assert.equal(t.states.at(-1).state,"invalid");
  assert.equal(t.counts().updates,0);
});
