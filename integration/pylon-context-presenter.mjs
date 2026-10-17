// PYLON IX presentation boundary for existing PHALANX module-context.v0.
// Pure, offline and read-only: never fetches, stores or authorizes player data.
// Only verified contexts may produce numerical fact lines.
export function presentPylonContext(context, { module = 'alliance-comparison' } = {}) {
  const unavailable = (message, status = 'not-connected') => ({
    status, title: 'PYLON IX · Datenstatus', lines: [message], facts_visible: false
  });
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return unavailable('Kein geprüfter Modulkontext vorhanden.');
  }
  if (context.schema_version !== 'pylon.module-context.v0' ||
      context.module !== module || context.source !== 'existing-phalanx-module') {
    return unavailable('Unbekannter oder nicht freigegebener Modulkontext.');
  }
  if (!['verified', 'stale', 'not-connected'].includes(context.data_status)) {
    return unavailable('Unbekannter Datenstatus.');
  }
  if (context.data_status !== 'verified') {
    return unavailable(context.data_status === 'stale'
      ? 'Der Datenstand ist veraltet. Keine Kennzahlen anzeigen.'
      : 'Dieses Modul ist noch nicht mit geprüften Daten verbunden.', context.data_status);
  }
  if (!Array.isArray(context.facts) || !Array.isArray(context.provenance) ||
      !context.provenance.length || typeof context.scope !== 'string' ||
      !/^kingdom:1885$/.test(context.scope) ||
      typeof context.verified_at !== 'string' ||
      !Number.isFinite(Date.parse(context.verified_at))) {
    return unavailable('Die Herkunft oder Prüfung der Daten ist nicht ausreichend belegt.');
  }
  if (context.facts.length > 100) return unavailable('Zu viele Kennzahlen im Modulkontext.');
  const lines = [];
  for (const fact of context.facts) {
    if (!fact || typeof fact.label !== 'string' || !fact.label.trim() ||
        fact.label.length > 1000 ||
        !['string', 'number', 'boolean'].includes(typeof fact.value) ||
        (typeof fact.value === 'number' && !Number.isFinite(fact.value)) ||
        (typeof fact.value === 'string' && fact.value.length > 1000)) {
      return unavailable('Unvollständige oder ungültige Kennzahlen.');
    }
    lines.push(fact.label + ': ' + String(fact.value));
  }
  return {
    status: 'verified',
    title: 'PYLON IX · Alliance Comparison',
    lines: ['Geprüfter technischer Snapshot · ' + context.verified_at, ...lines,
      'Hinweis: Technische Validierung ist keine Bestätigung der Spielwerte oder der RLS-Berechtigungen.'],
    facts_visible: lines.length > 0
  };
}
