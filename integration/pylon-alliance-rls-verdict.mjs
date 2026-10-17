// PYLON IX: compare independent, signed-in role probes. Never handles user tokens or rows.
const EXPECTED = ['phalanx_alliance_latest', 'phalanx_alliance_top40'];
export function evaluatePylonRlsRoles(authorized, unauthorized, { seededRowsConfirmed = false } = {}) {
  const blocked = (reason) => ({ verdict: 'inconclusive', reason, liveDataApproved: false });
  if (!seededRowsConfirmed) return blocked('test-fixtures-not-confirmed');
  for (const result of [authorized, unauthorized]) {
    if (result?.status !== 'probed' || !Array.isArray(result.views) || result.views.length !== EXPECTED.length) return blocked('incomplete-probe');
    if (EXPECTED.some(view => result.views.filter(v => v?.view === view).length !== 1)) return blocked('missing-or-duplicate-view');
    if (result.views.some(v => v.request !== 'ok' || !['rows-visible', 'zero-visible'].includes(v.visibility))) return blocked('query-error-or-unknown-count');
  }
  const authorizedVisible = authorized.views.every(v => v.visibility === 'rows-visible');
  const unauthorizedHidden = unauthorized.views.every(v => v.visibility === 'zero-visible');
  if (!unauthorizedHidden) return { verdict: 'failed', reason: 'unauthorized-rows-visible', liveDataApproved: false };
  if (!authorizedVisible) return blocked('authorized-rows-not-visible');
  return { verdict: 'role-check-passed', reason: 'two-roles-checked-not-a-production-approval', liveDataApproved: false };
}
