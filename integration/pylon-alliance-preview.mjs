// Isolated PYLON IX Alliance Comparison orchestration.
// Explicit caller-supplied signed-in client; read-only, no production wiring.
import { loadPylonAllianceContext } from './pylon-alliance-readonly-bridge.mjs';
import { presentPylonContext } from './pylon-context-presenter.mjs';

/**
 * Returns presentation-ready lines, never raw database rows.
 * This is NOT a permission check or approval for live release.
 */
export async function getPylonAlliancePreview(client, options = {}) {
  const context = await loadPylonAllianceContext(client, options);
  return presentPylonContext(context, { module: 'alliance-comparison' });
}
