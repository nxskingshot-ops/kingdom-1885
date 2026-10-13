// Integration hook for the frozen HOME's existing Alliances tile.
// Import only in a derived TEST copy, never edit the frozen source.
import { mountPhalanxTop40 } from './phalanx-top40-module.mjs';

/**
 * Use this as the existing HOME go('alliance') handler's branch.
 * Existing client must come from authenticated app context, not a new anonymous session.
 * A dedicated existing panel should be passed as container.
 */
export function openAllianceComparison({container, existingSupabaseClient, showPanel}) {
  if (!container || typeof showPanel !== 'function') throw new TypeError('Existing panel and navigation callback required');
  showPanel(); // preserve existing app's navigation / back handling
  return mountPhalanxTop40({container, client:existingSupabaseClient});
}

// Source hook verified against the SHA-256 frozen HOME 2026-10-11:
// function go(id){if(id==='kvk'||id==='watch')showKvk();else{const name={outpost:'Outpost Map',alliance:'Alliance Comparison',...}[id]; ...}}
// Only intercept id === 'alliance'; leave kvk, watch, outpost, scouting, status unchanged.
// Do not wire before the app's Supabase client and authentication mechanism are identified.
