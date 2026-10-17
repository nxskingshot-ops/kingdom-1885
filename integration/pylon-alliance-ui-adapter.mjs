import { getPylonAlliancePreview } from './pylon-alliance-preview.mjs';

// Isolated opt-in view adapter. No automatic mounting or production wiring.
export async function renderAlliancePreview(client, target, options = {}) {
  if (!target || !target.ownerDocument || typeof target.replaceChildren !== 'function') throw new TypeError('Missing target');
  let result;
  try {
    result = await getPylonAlliancePreview(client, options);
  } catch {
    result = { title: 'PYLON IX · Datenstatus', status: 'not-connected',
      lines: ['Keine geprüften Daten verfügbar.'], facts_visible: false };
  }
  if (!result || !['verified', 'stale', 'not-connected'].includes(result.status) ||
      typeof result.title !== 'string' || !Array.isArray(result.lines) ||
      result.lines.length > 110 || result.lines.some(line => typeof line !== 'string')) {
    result = { title: 'PYLON IX · Datenstatus', status: 'not-connected',
      lines: ['Keine geprüfte Anzeige verfügbar.'], facts_visible: false };
  }
  const doc = target.ownerDocument;
  const heading = doc.createElement('h3');
  heading.textContent = result.title;
  const status = doc.createElement('p');
  status.textContent = 'Status: ' + result.status;
  const list = doc.createElement('ul');
  for (const line of result.lines) {
    const item = doc.createElement('li');
    item.textContent = line;
    list.appendChild(item);
  }
  target.replaceChildren(heading, status, list);
  return { status: result.status, facts_visible: result.facts_visible };
}
