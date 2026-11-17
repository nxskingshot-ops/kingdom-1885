/* PHALANX Intelligence core v0.1 - isolated, pure and read-only.
 * No API calls, persistence, DOM changes, or production side effects.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PHXWarAcademyCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const STATUS = Object.freeze(['unknown', 'not-started', 'researching', 'unlocked']);
  const BRANCHES = Object.freeze(['infantry', 'cavalry', 'archers']);
  const asString = value => typeof value === 'string' ? value.trim() : '';
  const validId = value => /^[1-9][0-9]{0,15}$/.test(String(value ?? ''));
  const safeLevel = value => typeof value === 'string' && /^(?:[1-9][0-9]?|TG(?:[1-9]|10)(?:-[1-5])?)$/.test(value) ? value : null;
  function normalizeCaptureTime(value) {
    let time;
    if (typeof value === 'number' || (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value))) {
      const epoch = Number(value);
      if (!Number.isFinite(epoch) || epoch <= 0) return null;
      time = new Date(epoch >= 1e12 ? epoch : epoch * 1000).getTime();
    } else if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value)) {
      time = Date.parse(value);
    }
    return Number.isFinite(time) ? new Date(time).toISOString() : null;
  }
  function normalizeTransferProfile(response, expectedId) {
    if (response?.ok !== true || String(response.governorId) !== expectedId ||
        response.source?.fresh !== true) return null;
    const p = response.player;
    const time = normalizeCaptureTime(response.source?.cachedAt);
    if (!time) return null;
    const level = p?.townCenterLevel ?? p?.town_center_level ?? p?.castleLevel ?? p?.castle_level;
    return normalizeProfile({
      playerId: expectedId,
      freshness: 'fresh',
      capturedAt: time,
      checkedAt: response.checkedAtUtc,
      player: p && { ...p, town_center_level: level == null ? null : String(level) }
    });
  }

  function normalizeProfile(response) {
    if (!response || !validId(response.playerId) || response.freshness !== 'fresh') return null;
    const p = response.player;
    if (!p || !Number.isSafeInteger(p.kingdom) || p.kingdom < 1) return null;
    return Object.freeze({
      playerId: String(response.playerId),
      name: asString(p.name) || null,
      kingdom: p.kingdom,
      alliance: asString(p.alliance) || null,
      power: typeof p.power === 'string' && /^\d{1,24}$/.test(p.power) ? p.power : null,
      townCenter: safeLevel(p.town_center_level ?? p.townCenterLevel),
      source: 'mightpulse-via-authorized-backend',
      capturedAt: normalizeCaptureTime(response.capturedAt),
      checkedAt: typeof response.checkedAt === 'string' ? response.checkedAt : null
    });
  }
  function normalizeResearch(input) {
    const source = input && typeof input === 'object' ? input : {};
    const result = {};
    for (const branch of BRANCHES) {
      const raw = source[branch];
      const status = raw && typeof raw === 'object' ? raw.status : raw;
      const value = STATUS.includes(status) ? status : 'unknown';
      const evidence = raw && typeof raw === 'object' && raw.evidence === 'manual-confirmed' ? 'manual-confirmed' : null;
      result[branch] = Object.freeze({status: value, verification: evidence ?? 'unknown'});
    }
    return Object.freeze(result);
  }
  function assess(profile, research, academyLevel) {
    const troops = normalizeResearch(research);
    const statuses = BRANCHES.map(b => troops[b].status);
    const known = statuses.filter(s => s !== 'unknown').length;
    const confirmed = BRANCHES.filter(b => troops[b].status === 'unlocked' && troops[b].verification === 'manual-confirmed').length;
    return Object.freeze({
      playerId: profile?.playerId ?? null,
      townCenter: profile?.townCenter ?? null,
      warAcademy: safeLevel(academyLevel),
      t11: troops,
      knownBranches: known,
      confirmedUnlocks: confirmed,
      complete: known === 3,
      score: null, // Unknown T11 status must never be scored as a weakness.
      resourceEstimate: null // Requires validated, versioned technology-level reference data.
    });
  }
  return Object.freeze({BRANCHES, STATUS, validId, safeLevel, normalizeCaptureTime, normalizeProfile, normalizeTransferProfile, normalizeResearch, assess});
});
