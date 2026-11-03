import test from 'node:test';
import assert from 'node:assert/strict';
import { runRankingPipeline } from './phx-ranking-pipeline-stage-20261103.mjs';

function boardPayload(board, captured_at = 1793682000, scoreOffset = 0) {
  const alliance = board.startsWith('alliance_');
  return { key: board, captured_at, rows: Array.from({ length: 100 }, (_, i) => ({
    kid: 1885, rank: i + 1, uid: alliance ? undefined : i + 1,
    aid: alliance ? i + 1 : undefined,
    governor_id: alliance || board === 'kills' ? undefined : i + 1,
    score: 1000 - i + scoreOffset
  })) };
}
function mockFetch(options = {}) {
  return async url => {
    const board = new URL(url).searchParams.get('board');
    if (options.fail === board) return { ok: false, status: 503 };
    if (options.missing === board) return { ok: true, json: async () => ({ boards: [] }) };
    return { ok: true, json: async () => ({ boards: [boardPayload(board, options.capturedAt)] }) };
  };
}
test('dry-run integrates validated rows, hash and first snapshot decision without writes', async () => {
  let writes = 0;
  const result = await runRankingPipeline({
    apiKey: 'test-only', boards: ['personal_power', 'alliance_power'],
    fetchImpl: mockFetch(), readLatest: async () => ({}),
    writeSnapshots: async () => { writes++; }
  });
  assert.equal(result.verified, 2);
  assert.equal(result.insertsPlanned, 2);
  assert.equal(result.writesPerformed, false);
  assert.equal(writes, 0);
  assert.ok(result.plan.every(x => x.contentHash?.length === 64));
});
test('unchanged capture and content are not inserted', async () => {
  const first = await runRankingPipeline({ apiKey: 'test-only', boards: ['kills'], fetchImpl: mockFetch() });
  const latest = { kills: { capturedAt: first.plan[0].capturedAt, entries: boardPayload('kills').rows } };
  const next = await runRankingPipeline({ apiKey: 'test-only', boards: ['kills'], fetchImpl: mockFetch(), readLatest: async () => latest });
  assert.equal(next.plan[0].action, 'UNCHANGED');
  assert.equal(next.insertsPlanned, 0);
});
test('missing and upstream-failed boards never become inserts', async () => {
  const result = await runRankingPipeline({ apiKey: 'test-only', boards: ['kills','pet_power'], fetchImpl: mockFetch({ missing: 'kills' }) });
  assert.equal(result.outcomes.kills.status, 'UNSUPPORTED');
  assert.equal(result.insertsPlanned, 1);
});
test('write mode requires explicit adapter', async () => {
  await assert.rejects(() => runRankingPipeline({ apiKey: 'test-only', dryRun: false }), /write adapter/);
});
test('older source capture is skipped', async () => {
  const result = await runRankingPipeline({
    apiKey: 'test-only', boards: ['kills'], fetchImpl: mockFetch(),
    readLatest: async () => ({ kills: { capturedAt: '2026-11-04T00:00:00.000Z', entries: boardPayload('kills').rows } })
  });
  assert.equal(result.plan[0].action, 'SKIP');
});
