import {loadRegistry, discover} from './registry.js';
// Isolated preview only. Metadata is not authorization.
export async function validateOutpostRoute() {
  const registry = await loadRegistry();
  const result = discover(registry, 'PHX-OUT-024.OPEN');
  if (!result || result.module.route !== '#outpost-map' || result.module.source !== 'modules/outpost/map-alpha24.html') throw new Error('Invalid module route');
  return {manualPreviewAllowed:true, autonomousExecutionAllowed:false, source:result.module.source};
}
