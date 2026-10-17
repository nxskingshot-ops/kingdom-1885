// PYLON IX isolated pure mapping layer. No network, secrets, storage or production imports.
export const PYLON_CONTEXT_SCHEMA = 'pylon.module-context.v0';
const DEFAULT_ALLOWED = Object.freeze(['NXS', 'FRA', 'OoO', 'MYM']);
const VALID_TAG = /^[A-Za-z0-9][A-Za-z0-9_-]{1,15}$/;
function approvedScope(input) {
  if (input === undefined) return new Set(DEFAULT_ALLOWED);
  if (!Array.isArray(input) || !input.length || input.length > 100 || input.some(tag => typeof tag !== 'string' || !VALID_TAG.test(tag)) || new Set(input).size !== input.length) return null;
  return new Set(input);
}
const FIELDS = ['members', 'total_power', 'tg5', 'tg4'];

export function mapAllianceOverviewToPylon(rows, options = {}) {
  const { kingdom = 1885, asOf, maxAgeDays = 7, approvedAlliances } = options;
  const base = { schema_version: PYLON_CONTEXT_SCHEMA, module: 'alliance-comparison',
    source: 'existing-phalanx-module', observed_at: null, verified_at: null,
    data_status: 'not-connected', scope: 'none', facts: [],
    warnings: [], provenance: [] };
  const unavailable = (status, reason) => ({ ...base, data_status: status, warnings: [reason] });
  if (!Array.isArray(rows) || !rows.length) return unavailable('not-connected', 'Keine freigegebenen Allianz-Daten übergeben');
  if (typeof asOf !== 'string' || !Number.isFinite(Date.parse(asOf))) return unavailable('not-connected', 'Prüfzeitpunkt fehlt');
  if (!Number.isInteger(maxAgeDays) || maxAgeDays < 0 || maxAgeDays > 30) return unavailable('not-connected', 'Ungültige Frischegrenze');
  const allowed = approvedScope(approvedAlliances);
  if (!allowed) return unavailable('not-connected', 'Ungültige freigegebene Allianz-Auswahl');
  const now = Date.parse(asOf);
  const checked = [];
  for (const row of rows) {
    if (!row || row.kingdom !== kingdom || !allowed.has(row.alliance)) return unavailable('not-connected', 'Ungültiger Geltungsbereich');
    if (typeof row.snapshot_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.snapshot_date)) return unavailable('not-connected', 'Snapshot-Datum fehlt');
    const snapshot = Date.parse(row.snapshot_date + 'T00:00:00Z');
    if (!Number.isFinite(snapshot) || new Date(snapshot).toISOString().slice(0, 10) !== row.snapshot_date) return unavailable('not-connected', 'Ungültiges Snapshot-Datum');
    const age = now - snapshot;
    if (age < 0 || age > maxAgeDays * 86400000 + 86400000) return unavailable('stale', 'Snapshot liegt außerhalb des geprüften Zeitfensters');
    for (const field of FIELDS) {
      if (!Number.isSafeInteger(row[field]) || row[field] < 0) return unavailable('not-connected', 'Fehlende oder ungültige Kennzahl: ' + field);
    }
    checked.push(row);
  }
  if (new Set(checked.map(row => row.alliance)).size !== checked.length) return unavailable('not-connected', 'Doppelte Allianz-Datensätze');
  const facts = checked.flatMap(row => FIELDS.map(field => ({ label: row.alliance + ' · ' + field, value: row[field] })));
  return { ...base, data_status: 'verified', scope: 'kingdom:' + kingdom,
    observed_at: asOf, verified_at: asOf, facts,
    warnings: ['Technisch validierter Snapshot; keine eigenständige Bestätigung der Spielwerte'],
    provenance: checked.map(row => 'phalanx_alliance_latest/' + row.snapshot_date + '/' + row.alliance) };
}
