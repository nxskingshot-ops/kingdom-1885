import { renderAlliancePreview } from './pylon-alliance-ui-adapter.mjs';

// Explicit mount for a host-owned, already authenticated PHALANX client.
// No credential discovery, local storage, global client or automatic connection.
export function mountPylonAllianceHost({ client = null, target, button, info } = {}) {
  if (!target || !button || !info) throw new TypeError('Missing PYLON host elements');
  let pending = false;
  let disposed = false;
  async function refresh() {
    if (pending || disposed) return;
    pending = true;
    button.disabled = true;
    info.textContent = 'Datenstatus wird geprüft …';
    try {
      const result = await renderAlliancePreview(client, target, {
        asOf: new Date().toISOString()
      });
      if (disposed) return;
      info.textContent = result.status === 'verified'
        ? 'Technisch geprüfter Snapshot · Live-Berechtigungen separat prüfen.'
        : result.status === 'stale'
          ? 'Daten veraltet · keine Kennzahlen verfügbar.'
          : 'Nicht verbunden · keine Allianzkennzahlen verfügbar.';
    } catch {
      if (disposed) return;
      target.textContent = 'PYLON IX · Keine geprüften Daten verfügbar.';
      info.textContent = 'Datenstatus konnte nicht geladen werden.';
    } finally {
      pending = false;
      if (!disposed) button.disabled = false;
    }
  }
  button.addEventListener('click', refresh);
  void refresh();
  return () => {
    disposed = true;
    button.removeEventListener('click', refresh);
    button.disabled = true;
  };
}
