import { digestRankingRows } from './phx-ranking-digest-stage-20261103.mjs';
import { classifySnapshot } from './phx-ranking-freshness-stage-20261103.mjs';
/** Pure planning layer; no database writes. Existing rows may not have content hashes. */
export async function planRankingSnapshots(candidates, latestByBoard = {}) {
  if (!Array.isArray(candidates)) throw new TypeError('candidates must be an array');
  const plans = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const board = candidate?.board;
    if (typeof board !== 'string' || !board || seen.has(board)) throw new Error('Missing or duplicate board');
    seen.add(board);
    const previous = latestByBoard[board] ?? null;
    let latest = null;
    if (previous) {
      const contentHash = previous.contentHash ?? (Array.isArray(previous.entries) ? await digestRankingRows(previous.entries) : null);
      latest = { capturedAt: previous.capturedAt ?? previous.source_captured_at, contentHash };
    }
    const contentHash = candidate.status === 'VERIFIED' && Array.isArray(candidate.entries)
      ? await digestRankingRows(candidate.entries) : null;
    const decision = classifySnapshot({ status: candidate.status, capturedAt: candidate.capturedAt, contentHash }, latest);
    plans.push({ board, action: decision.action, reason: decision.reason, capturedAt: candidate.capturedAt ?? null, contentHash });
  }
  return { plans, inserts: plans.filter(x => x.action === 'INSERT').length, writesPerformed: false };
}
