// Isolated PYLON IX bridge: caller must explicitly supply a signed-in PHALANX Supabase client.
// Never imports credentials, performs writes, stores rows or attaches itself to production.
import { loadAllianceOverview } from './alliance-overview-reader-test.mjs';
import { mapAllianceOverviewToPylon } from './pylon-alliance-context-mapper.mjs';

function disconnected(reason) {
  return { schema_version: 'pylon.module-context.v0', module: 'alliance-comparison',
    source: 'existing-phalanx-module', observed_at: null, verified_at: null,
    data_status: 'not-connected', scope: 'none', facts: [], warnings: [reason], provenance: [] };
}

/** Read-only test integration; never treat a successful query as proof of RLS policy correctness. */
export async function loadPylonAllianceContext(client, { asOf, maxAgeDays = 7 } = {}) {
  if (!client?.auth?.getUser || !client?.from) return disconnected('Kein angemeldeter PHALANX-Datenclient übergeben');
  if (typeof asOf !== 'string' || !Number.isFinite(Date.parse(asOf))) return disconnected('Prüfzeitpunkt fehlt');
  try {
    const rows = await loadAllianceOverview(client);
    return mapAllianceOverviewToPylon(rows, { kingdom: 1885, asOf, maxAgeDays });
  } catch (error) {
    // Do not disclose auth tokens, database error bodies or user details to the UI.
    return disconnected('Datenzugriff fehlgeschlagen oder nicht freigegeben');
  }
}
