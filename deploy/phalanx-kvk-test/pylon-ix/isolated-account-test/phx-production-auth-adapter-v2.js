// PHALANX Access V2 — read-only production identity adapter.
// Safe for staging only. No role writes, no account creation, no password changes.
// This is NOT the authorization layer: all mutations must be checked server-side.
export const PHX_PRODUCTION_SUPABASE_URL = 'https://hcjrdofkdkasznywvcxo.supabase.co';
export const PHX_PRODUCTION_PUBLISHABLE_KEY = 'sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
export const PHX_LEGACY_ROLES = Object.freeze(['kingdom','member','r4','r5','outpost_manager','admin']);
export const PHX_APP_ROLES = Object.freeze(['observer','operator','administrator']);
export function isActiveMembership(row, now=Date.now()) {
  return !!row && row.active === true &&
    (!row.expires_at || (Number.isFinite(Date.parse(row.expires_at)) && Date.parse(row.expires_at)>now));
}
export function canReviewLegacyAccess(row, now=Date.now()) {
  return isActiveMembership(row,now) && ['r4','r5','admin'].includes(row.role);
}
export function canManageLegacyAccess(row, now=Date.now()) {
  return isActiveMembership(row,now) && row.role==='admin';
}
// Never infer the new PHALANX app role from an existing Kingshot/legacy role.
export function appRoleFromLegacy() { return null; }
export async function loadCurrentProductionIdentity(db) {
  if (!db?.auth?.getUser || !db?.from) throw new TypeError('Authenticated Supabase client required');
  const {data:identity,error:authError}=await db.auth.getUser();
  if(authError) throw authError;
  const user=identity?.user;
  if(!user) return {user:null,membership:null,canReview:false,canManage:false,appRole:null};
  const {data:membership,error:membershipError}=await db.from('nxs_memberships')
    .select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
  if(membershipError) throw membershipError;
  return {user,membership:membership||null,
    canReview:canReviewLegacyAccess(membership),
    canManage:canManageLegacyAccess(membership),appRole:null};
}
