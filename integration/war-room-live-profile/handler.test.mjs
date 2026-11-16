import assert from 'node:assert/strict';
import test from 'node:test';
import { createWarRoomProfileHandler } from './handler.mjs';

const projectUrl = 'https://fixture.supabase.co';
const androidOrigin = 'https://localhost';
const token = 'Bearer fixture-token';
const playerId = '123456789';
const capturedAt = '2026-11-16T06:00:00.000Z';
const checkedAt = '2026-11-16T06:05:00.000Z';
const player = { name: 'Fixture', alliance: 'FIX', kingdom: 1885, power: '155000000000000005' };

function setup({ link = Response.json(playerId), source } = {}) {
  source ??= Response.json({ ok: true, governorId: playerId, player, source: { fresh: true, cachedAt: capturedAt }, checkedAtUtc: checkedAt });
  const calls = [];
  const handle = createWarRoomProfileHandler({
    projectUrl, androidOrigin, publishableKey: 'fixture-key',
    request(url, options) {
      calls.push([url, options]);
      return Promise.resolve(calls.length === 1 ? link : source);
    }
  });
  const get = (query = '') => handle(new Request(projectUrl + '/profile' + query, {
    headers: { Origin: androidOrigin, Authorization: token }
  }));
  return { calls, get, handle };
}

test('forward only the ID from the authenticated server link and return a minimal fresh profile', async () => {
  const { get, calls } = setup();
  const response = await get();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { playerId, player, freshness: 'fresh', capturedAt, checkedAt });
  assert.equal(calls[0][0].pathname, '/rest/v1/rpc/phx_war_room_current_player_id');
  assert.equal(calls[0][1].body, '{}');
  assert.equal(calls[1][0].searchParams.get('governorId'), playerId);
  assert.ok(calls.every(([, options]) => options.headers.Authorization === token));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('allow Android preflight without fetching data and deny other origins', async () => {
  const { handle, calls } = setup();
  const preflight = await handle(new Request(projectUrl + '/profile', { method: 'OPTIONS', headers: { Origin: androidOrigin } }));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), androidOrigin);
  const forbidden = await handle(new Request(projectUrl + '/profile', { headers: { Origin: 'https://foreign.example', Authorization: token } }));
  assert.equal(forbidden.status, 403);
  assert.equal(forbidden.headers.get('access-control-allow-origin'), null);
  assert.equal(calls.length, 0);
});

test('reject a client-supplied player ID and all unauthenticated requests', async () => {
  const { handle, get, calls } = setup();
  assert.equal((await get('?governorId=678901234')).status, 400);
  assert.equal((await handle(new Request(projectUrl + '/profile'))).status, 401);
  assert.equal(calls.length, 0);
});

test('expired or unlinked sessions stop before the lookup', async () => {
  for (const [link, expected] of [[new Response(null, { status: 401 }), 401], [Response.json(null), 403]]) {
    const { get, calls } = setup({ link });
    assert.equal((await get()).status, expected);
    assert.equal(calls.length, 1);
  }
});

test('refuse a mismatched source identity', async () => {
  const { get } = setup({ source: Response.json({ ok: true, governorId: '987654321', player }) });
  assert.equal((await get()).status, 502);
});

test('show no current values when the source is stale or freshness cannot be verified', async () => {
  for (const source of [
    { fresh: false, cachedAt: capturedAt },
    { fresh: true, cachedAt: '2026-11-16T06:10:00Z' },
    { fresh: true, cachedAt: 'unknown' }
  ]) {
    const { get } = setup({ source: Response.json({ ok: true, governorId: playerId, player, source, checkedAtUtc: checkedAt }) });
    const profile = await (await get()).json();
    assert.equal(profile.freshness, 'unknown_or_stale');
    assert.equal(profile.player, null);
  }
});

test('accept source epoch timestamps and avoid rounding unsafe power values', async () => {
  const source = { fresh: true, cachedAt: Date.parse(capturedAt) / 1000 };
  const { get } = setup({ source: Response.json({
    ok: true, governorId: playerId, player: { ...player, power: Number.MAX_SAFE_INTEGER + 1 }, source, checkedAtUtc: checkedAt
  }) });
  const profile = await (await get()).json();
  assert.equal(profile.freshness, 'fresh');
  assert.equal(profile.capturedAt, capturedAt);
  assert.equal(profile.player.power, null);
});
