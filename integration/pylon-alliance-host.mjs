import { renderAlliancePreview } from './pylon-alliance-ui-adapter.mjs';

// Explicit mount for a host-owned, already authenticated PHALANX client.
// No credential discovery, local storage, global client or automatic connection.
export function mountPylonAllianceHost({ client = null, getClient = null, target, button, info, allowLiveRead = false } = {}) {
  if (!target?.ownerDocument || typeof target.replaceChildren !== 'function' ||
      typeof button?.addEventListener !== 'function' ||
      typeof button?.removeEventListener !== 'function' || !info) {
    throw new TypeError('Missing PYLON host elements');
  }
  if (getClient !== null && typeof getClient !== 'function') {
    throw new TypeError('getClient must be a function');
  }
  let pending = false;
  let disposed = false;
  let generation = 0;
  async function refresh() {
    if (pending || disposed) return;
    pending = true;
    const requestGeneration = ++generation;
    button.disabled = true;
    info.textContent = 'Datenstatus wird geprüft …';
    try {
      const detachedTarget = target.ownerDocument.createElement('div');
      // Resolve the host-owned session at refresh time, never cache tokens here.
      // Live reads require an explicit host-level opt-in after access review.
      const activeClient = allowLiveRead === true
        ? (getClient ? await getClient() : client)
        : null;
      if (disposed || requestGeneration !== generation) return;
      const result = await renderAlliancePreview(activeClient, detachedTarget, {
        asOf: new Date().toISOString()
      });
      if (disposed || requestGeneration !== generation) return;
      target.replaceChildren(...Array.from(detachedTarget.childNodes));
      info.textContent = !allowLiveRead
        ? 'Live-Abfrage gesperrt · Freigabe der Zugriffsrechte ausstehend.'
        : result.status === 'verified'
        ? 'Technisch geprüfter Snapshot · Live-Berechtigungen separat prüfen.'
        : result.status === 'stale'
          ? 'Daten veraltet · keine Kennzahlen verfügbar.'
          : 'Nicht verbunden · keine Allianzkennzahlen verfügbar.';
    } catch {
      if (disposed || requestGeneration !== generation) return;
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
    generation++;
    button.removeEventListener('click', refresh);
    button.disabled = true;
  };
}
