/** Pure, read-only freshness decision. Never writes or deletes database rows. */
export function classifySnapshot(candidate, latest) {
  if (!candidate || candidate.status !== 'VERIFIED' || !candidate.capturedAt) return { action: 'SKIP', reason: 'unverified_candidate' };
  const candidateTime = Date.parse(candidate.capturedAt);
  if (!Number.isFinite(candidateTime)) return { action: 'SKIP', reason: 'invalid_candidate_time' };
  if (!latest) return { action: 'INSERT', reason: 'first_verified_snapshot' };
  const latestTime = Date.parse(latest.capturedAt);
  if (!Number.isFinite(latestTime)) return { action: 'REVIEW', reason: 'invalid_previous_time' };
  if (candidateTime < latestTime) return { action: 'SKIP', reason: 'older_source_capture' };
  if (candidateTime > latestTime) return { action: 'INSERT', reason: 'newer_source_capture' };
  const a = candidate.contentHash;
  const b = latest.contentHash;
  if (!a || !b) return { action: 'REVIEW', reason: 'same_time_hash_missing' };
  return a === b ? { action: 'UNCHANGED', reason: 'same_capture_and_content' } : { action: 'REVIEW', reason: 'source_conflict_same_capture' };
}