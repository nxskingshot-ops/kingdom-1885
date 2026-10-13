// NEXUS PHALANX — isolated Top-40 integration adapter.
// This module does not alter the frozen HOME and never creates a second Supabase client.
// Call mountPhalanxTop40({container, client}) from the EXISTING Alliance Comparison route.
const ALLIANCES = ['NXS', 'FRA', 'OoO', 'MYM'];
const SNAPSHOT = '2026-10-13';
const fmt = value => Number(value).toLocaleString('en-US');
export function mountPhalanxTop40({container, client}) {
  if (!(container instanceof HTMLElement)) throw new TypeError('Existing container required');
  if (!client?.from || !client?.auth?.getUser) throw new TypeError('Existing authenticated Supabase client required');
  const section = document.createElement('section');
  section.className = 'phalanx-top40-module';
  section.setAttribute('aria-label', 'PHALANX Top 40');
  const selector = document.createElement('select');
  selector.setAttribute('aria-label', 'Allianz wählen');
  for (const alliance of ALLIANCES) {
    const option = document.createElement('option'); option.value = alliance; option.textContent = alliance; selector.append(option);
  }
  const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Top 40 anzeigen';
  const status = document.createElement('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.textContent = 'Bereit';
  const result = document.createElement('div'); result.hidden = true; result.style.overflowX = 'auto';
  let sequence = 0;
  selector.addEventListener('change', () => { sequence++; result.hidden = true; result.replaceChildren(); status.textContent = selector.value + ' gewählt · bereit'; });
  button.addEventListener('click', async () => {
    const requestId = ++sequence, alliance = selector.value;
    status.textContent = 'Klick erkannt · prüfe ' + alliance + ' …';
    button.disabled = true;
    try {
      const identity = await client.auth.getUser();
      if (identity.error || !identity.data?.user) throw new Error('Bitte zuerst in der NEXUS App anmelden');
      const {data, error} = await client.from('phalanx_alliance_top40')
        .select('position,player_name,power,snapshot_date')
        .eq('kingdom', 1885).eq('alliance', alliance).eq('snapshot_date', SNAPSHOT).order('position');
      if (error) throw new Error(error.code === '42501' ? 'Kein Zugriff auf private Allianz-Daten (42501)' : 'Datenbankfehler ' + (error.code || 'unbekannt'));
      if (data?.length !== 40) throw new Error('Unvollständiger Datenstand: ' + (data?.length ?? 0) + '/40');
      if (requestId !== sequence) return;
      const table = document.createElement('table'), head = document.createElement('thead'), hrow = document.createElement('tr');
      for (const title of ['Rang','Spieler','Power']) {const th = document.createElement('th'); th.textContent = title; hrow.append(th);}
      head.append(hrow); table.append(head);
      const body = document.createElement('tbody');
      for (const entry of data) { const tr = document.createElement('tr'); for (const value of [entry.position,entry.player_name ?? '—',fmt(entry.power)]) {const td = document.createElement('td'); td.textContent = String(value); tr.append(td);} body.append(tr); }
      table.append(body); result.replaceChildren(table); result.hidden = false; status.textContent = '40 Einträge geladen · ' + alliance;
    } catch (error) { if (requestId === sequence) { result.hidden = true; status.textContent = 'Klick erkannt · ' + error.message; } }
    finally { if (requestId === sequence) button.disabled = false; }
  });
  section.append(selector, button, status, result); container.append(section);
  return () => {sequence++; section.remove();};
}
