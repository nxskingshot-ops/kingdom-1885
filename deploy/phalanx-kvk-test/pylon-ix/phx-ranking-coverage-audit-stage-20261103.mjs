/** PHALANX M3 isolated coverage audit. Read-only. Never stores provider rows or credentials.
 * Run server-side: MIGHTPULSE_API_KEY=... node phx-ranking-coverage-audit-stage-20261103.mjs
 * Provider requests may be rate-limited or billed; only execute after confirming permission/cost.
 */
import { BOARDS } from './phx-ranking-ingestion-core-stage-20261103.mjs';
import { collectRankingBoards } from './phx-ranking-fetch-stage-20261103.mjs';

export function summarizeCoverage(result, expected = BOARDS) {
  if (!result || !result.boards) throw new TypeError('Missing collector result');
  const details = expected.map(board => {
    const v = result.boards[board] ?? { status: 'ERROR', reason: 'not_checked' };
    return { board, status: v.status, reason: v.reason ?? null, capturedAt: v.capturedAt ?? null, count: v.count ?? null };
  });
  const verified = details.filter(x => x.status === 'VERIFIED').length;
  return { kingdom: result.kingdom, checkedAtUtc: result.checkedAtUtc, total: expected.length,
    verified, incomplete: expected.length - verified, complete: verified === expected.length,
    details, writesPerformed: false };
}

export async function auditCoverage({ apiKey, fetchImpl, boards = BOARDS } = {}) {
  const result = await collectRankingBoards({ apiKey, fetchImpl, boards, concurrency: 2 });
  return summarizeCoverage(result, boards);
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const apiKey = process.env.MIGHTPULSE_API_KEY;
  if (!apiKey) {
    console.error('MIGHTPULSE_API_KEY missing; no provider requests performed');
    process.exitCode = 2;
  } else {
    try {
      const result = await auditCoverage({ apiKey });
      console.log(JSON.stringify(result, null, 2));
      if (!result.complete) process.exitCode = 1;
    } catch (error) {
      console.error('Coverage audit failed:', error.message);
      process.exitCode = 1;
    }
  }
}
