// PYLON IX isolated pure mapping layer. No network, secrets, storage or production imports.
export const PYLON_CONTEXT_SCHEMA = 'pylon.module-context.v0';
const ALLOWED = new Set(['NXS', 'FRA', 'OoO', 'MYM']);
const FIELDS = ['members', 'total_power', 'tg5', 'tg4'];

export function mapAllianceOverviewToPylon(rows, options = {}) {
  const { kingdom = 1885, asOf, maxAgeDays = 7 } = options;
  const base = { schema_version: PYLON_CONTEXT_SCHEMA, module: 'alliance-comparison',
    source: 'existing-phalanx-module', observed_at: null, verified_at: null,
    data_status: 'not-connected', scope: 'none', facts: [],
    warnings: [], provenance: [] };
  const unavailable = (status, reason) => ({ ...base, data_status: status, warnings: [reason] });
  if (!Array.isArray(rows) || !rows.length) return unavailable('not-connected', 'Keine freigegebenen Allianz-Daten übergeben');
  if (typeof asOf !== 'string' || !Number.isFinite(Date.parse(asOf))) return unavailable('not-connected', 'Prüfzeitpunkt fehlt');
  if (!Number.isInteger(maxAgeDays) || maxAgeDays < 0 || maxAgeDays > 30) return unavailable('not-connected', 'Ungültige Frischegrenze');
  const now = Date.parse(asOf);
  const checked = [];
  for (const row of rows) {
    if (!row || row.kingdom !== kingdom || !ALLOWED.has(row.alliance)) return unavailable('not-connected', 'Ungültiger Geltungsbereich');
    if (typeof row.snapshot_date !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(row.snapshot_date)) return unavailable('not-connected', 'Snapshot-Datum fehlt');
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
