import { BOARDS, validateBoard } from './phx-ranking-ingestion-core-stage-20261103.mjs';
/** Read-only collector. Does not persist, schedule, or expose credentials. */
export async function collectRankingBoards({ apiKey, fetchImpl = fetch, kingdom = 1885, timeoutMs = 25000, concurrency = 4, boards = BOARDS } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('Missing server-side provider key');
  if (!Number.isInteger(kingdom) || kingdom < 1) throw new Error('Invalid kingdom');
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error('Invalid concurrency');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 30000) throw new Error('Invalid timeout');
  if (!Array.isArray(boards) || boards.some(b => !BOARDS.includes(b)) || new Set(boards).size !== boards.length) throw new Error('Invalid board selection');
  const results = {};
  let cursor = 0;
  async function worker() {
    while (cursor < boards.length) {
      const board = boards[cursor++];
      try {
        const url = `https://api.mightpulse.com/v1/kingdoms/${kingdom}/ranks?board=${encodeURIComponent(board)}&limit=100`;
        const response = await fetchImpl(url, { headers: { 'X-Api-Key': apiKey }, redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
        if (!response.ok) { results[board] = { status: 'ERROR', reason: `upstream_http_${response.status}` }; continue; }
        const json = await response.json();
        const payload = Array.isArray(json?.boards) ? json.boards.find(x => x?.key === board) : null;
        results[board] = payload ? validateBoard(board, payload, kingdom) : { status: 'UNSUPPORTED', reason: 'board_not_returned' };
      } catch (error) {
        results[board] = { status: 'ERROR', reason: error?.name === 'TimeoutError' ? 'timeout' : 'fetch_failed' };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, boards.length) }, () => worker()));
  return { kingdom, checkedAtUtc: new Date().toISOString(), boards: results, verified: Object.values(results).filter(x => x.status === 'VERIFIED').length, total: boards.length, readOnly: true };
}
