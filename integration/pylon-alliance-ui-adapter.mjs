import { getPylonAlliancePreview } from './pylon-alliance-preview.mjs';

// Isolated opt-in view adapter. No automatic mounting or production wiring.
export async function renderAlliancePreview(client, target, options = {}) {
  if (!target || !target.ownerDocument || typeof target.replaceChildren !== 'function') throw new TypeError('Missing target');
  const result = await getPylonAlliancePreview(client, options);
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
