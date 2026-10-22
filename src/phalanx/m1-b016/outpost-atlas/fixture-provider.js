// PHX-M1-B006: isolated fixture ONLY. Not a live or authorized production provider.
// Load explicitly in an isolated test page BEFORE map-core.js. Never ship as a production default.
window.PHALANX_OUTPOST_DATA_PROVIDER = async ({signal}={}) => {
  if (signal?.aborted) throw new DOMException('Aborted','AbortError');
  const response = await fetch('./outposts-verified-20261002.fixture.json', {signal, cache:'no-store'});
  if (!response.ok) throw new Error('Testdaten konnten nicht geladen werden');
  return {rows:await response.json()};
};
