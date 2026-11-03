import { BOARDS, validateBoard } from './phx-ranking-ingestion-core-stage-20261103.mjs';
import { prepareSnapshot } from './phx-ranking-digest-stage-20261103.mjs';
import { planRankingSnapshots } from './phx-ranking-snapshot-plan-stage-20261103.mjs';

/**
 * Isolated ranking pipeline. Never calls Supabase directly.
 * fetchImpl, readLatest and writeSnapshots are injected server-side adapters.
 * Default dryRun=true. Production poller and existing database remain untouched.
 */
export async function runRankingPipeline({
  apiKey, fetchImpl = fetch, readLatest = async () => ({}),
  writeSnapshots, dryRun = true, kingdom = 1885, boards = BOARDS,
  concurrency = 4, timeoutMs = 25000
} = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('Server-side provider key required');
  if (!Number.isInteger(kingdom) || kingdom < 1) throw new Error('Invalid kingdom');
  if (!Array.isArray(boards) || !boards.length || boards.some(b => !BOARDS.includes(b)) || new Set(boards).size !== boards.length) throw new Error('Invalid boards');
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error('Invalid concurrency');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 30000) throw new Error('Invalid timeout');
  if (typeof readLatest !== 'function') throw new TypeError('readLatest adapter required');
  if (!dryRun && typeof writeSnapshots !== 'function') throw new Error('Explicit write adapter required');
  const checkedAtUtc = new Date().toISOString();
  const outcomes = {};
  const candidates = [];
  let cursor = 0;
  async function worker() {
    while (cursor < boards.length) {
      const board = boards[cursor++];
      try {
        const url = `https://api.mightpulse.com/v1/kingdoms/${kingdom}/ranks?board=${encodeURIComponent(board)}&limit=100`;
        const response = await fetchImpl(url, {
          headers: { 'X-Api-Key': apiKey }, redirect: 'error',
          signal: AbortSignal.timeout(timeoutMs)
        });
        if (!response.ok) {
          outcomes[board] = { status: 'ERROR', reason: `upstream_http_${response.status}` };
          continue;
        }
        const json = await response.json();
        const payload = Array.isArray(json?.boards) ? json.boards.find(x => x?.key === board) : null;
        if (!payload) {
          outcomes[board] = { status: 'UNSUPPORTED', reason: 'board_not_returned' };
          continue;
        }
        const validation = validateBoard(board, payload, kingdom);
        outcomes[board] = validation;
        if (validation.status === 'VERIFIED') {
          candidates.push(await prepareSnapshot(board, payload, validation));
        }
      } catch (error) {
        outcomes[board] = { status: 'ERROR', reason: error?.name === 'TimeoutError' ? 'timeout' : 'fetch_failed' };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, boards.length) }, () => worker()));
  // Only verified candidates can be inserted. Missing or invalid boards remain visible in outcomes.
  const latest = await readLatest([...boards]);
  if (!latest || typeof latest !== 'object' || Array.isArray(latest)) throw new TypeError('Invalid latest snapshot map');
  const ordered = boards.map(b => candidates.find(c => c.board === b)).filter(Boolean);
  const plan = await planRankingSnapshots(ordered, latest);
  const inserts = ordered.filter(c => plan.plans.some(p => p.board === c.board && p.action === 'INSERT'));
  let writesPerformed = false;
  if (!dryRun && inserts.length) {
    // Adapter must provide atomic persistence, authorization and idempotency.
    await writeSnapshots(inserts);
    writesPerformed = true;
  }
  return {
    kingdom, checkedAtUtc, total: boards.length,
    verified: ordered.length, outcomes,
    plan: plan.plans, insertsPlanned: inserts.length,
    writesPerformed, dryRun
  };
}
