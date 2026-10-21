export async function loadRegistry(url = './src/phalanx/pylon/core/pylon-capabilities.json') {
  const response = await fetch(url, {cache: 'no-store'});
  if (!response.ok) throw new Error('PYLON registry unavailable');
  const data = await response.json();
  if (data.schemaVersion !== '1.0.0' || !Array.isArray(data.modules)) throw new Error('PYLON registry incompatible');
  return data;
}
export function discover(registry, capabilityId) {
  for (const module of registry.modules) {
    const capability = (module.capabilities || []).find(c => c.id === capabilityId);
    if (capability) return {module, capability, available: module.status === 'PRODUCTION' && capability.runtimeAvailable === true};
  }
  return null;
}
