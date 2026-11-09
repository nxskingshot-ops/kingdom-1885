// Run: node --experimental-default-type=module --test phx-access-v2-role-contract.test.mjs
// No network, credentials, or production writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {PHX_APP_ROLES,PHX_LEGACY_ROLES,isActiveMembership,canReviewLegacyAccess,canManageLegacyAccess,appRoleFromLegacy} from './phx-production-auth-adapter-v2.js';
test('app and legacy roles are independent',()=>{
 assert.deepEqual(PHX_APP_ROLES,['observer','operator','administrator']);
 assert.ok(PHX_LEGACY_ROLES.includes('r5'));
 for(const role of PHX_LEGACY_ROLES) assert.equal(appRoleFromLegacy(role),null);
});
test('only active non-expired membership is usable',()=>{
 const now=Date.parse('2026-11-09T20:00:00Z');
 assert.equal(isActiveMembership({role:'admin',active:true,expires_at:null},now),true);
 assert.equal(isActiveMembership({role:'admin',active:false,expires_at:null},now),false);
 assert.equal(isActiveMembership({role:'admin',active:true,expires_at:'2026-11-08T00:00:00Z'},now),false);
 assert.equal(isActiveMembership({role:'admin',active:true,expires_at:'bad'},now),false);
});
test('legacy review and management are distinct',()=>{
 const m=role=>({role,active:true,expires_at:null});
 for(const role of ['r4','r5','admin']) assert.equal(canReviewLegacyAccess(m(role)),true);
 for(const role of ['r4','r5','member','observer','operator','administrator']) assert.equal(canManageLegacyAccess(m(role)),false);
 assert.equal(canManageLegacyAccess(m('admin')),true);
 assert.equal(canReviewLegacyAccess(m('member')),false);
});
