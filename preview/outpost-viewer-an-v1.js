/* Kingdom #1885 – public read-only Outpost viewer for An.
   Supabase public_outposts is the ONLY marker data source shown by this viewer.
   The embedded index snapshot supplies layout/buff labels only; its markers are never used as live data. */
(async function () {
  'use strict';
  const API = 'https://hcjrdofkdkasznywvcxo.supabase.co';
  const KEY = 'sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
  const $ = id => document.getElementById(id);
  const snapshotTemplate = DATA.map(outpost => ({...outpost}));
  const buffByTypeLevel = new Map(snapshotTemplate.map(outpost => [outpost.type + '|' + outpost.level, outpost.buff]));
  const notice = $('healthBadge');
  let busy = false;
  let hasLiveSnapshot = false;

  /* Never expose the old embedded snapshot as current map data. */
  DATA.splice(0, DATA.length);
  try { render(); } catch (error) { console.warn('Initial live-only map clear unavailable', error); }

  const styles = document.createElement('style');
  styles.textContent = `
#viewerControls{position:absolute;z-index:110;bottom:62px;right:8px;display:flex;align-items:center;gap:5px}
#viewerRefresh{background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:800}
#viewerStatus{background:#25190f;color:#e2c9a1;border:1px solid #99713c;border-radius:7px;padding:8px;font-size:11px;min-width:88px;max-width:235px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;
  document.head.appendChild(styles);
  const controls = document.createElement('div');
  controls.id = 'viewerControls';
  controls.innerHTML = '<button type="button" id="viewerRefresh">↻ Refresh Map</button><small id="viewerStatus" role="status">Connecting…</small>';
  $('app').appendChild(controls);

  function status(text, detail = text) {
    if (notice) notice.textContent = text;
    $('viewerStatus').textContent = text;
    $('viewerStatus').title = detail;
  }

  function colorFor(alliance, index) {
    if (COLORS[alliance]) return COLORS[alliance];
    const fallback = ['#6d7fa3','#a6604d','#5d8f80','#8d6b9c','#9a7c42','#55758a'];
    COLORS[alliance] = fallback[index % fallback.length];
    return COLORS[alliance];
  }

  function syncAllianceFilters(rows) {
    const alliances = [...new Set(rows.map(row => String(row.alliance || '').trim()).filter(Boolean))].sort();
    ALL.splice(0, ALL.length, ...alliances);
    for (let i = 0; i < alliances.length; i++) {
      colorFor(alliances[i], i);
      activeA.add(alliances[i]);
    }
    for (const existing of [...activeA]) if (!alliances.includes(existing)) activeA.delete(existing);
  }

  function redraw() {
    if (sel !== null && sel !== undefined && !DATA.some(row => row.id === sel)) sel = null;
    render();
    const heading = document.querySelector('.left .phead');
    if (heading) heading.textContent = 'Outposts · ' + DATA.length;
    if (sel !== null && sel !== undefined) {
      const item = DATA.find(row => row.id === sel);
      if (item) showOutpostPopup(item);
    }
  }

  function liveMarker(row) {
    return {
      id: Number(row.id),
      level: Number(row.level),
      type: String(row.structure_type || '').trim(),
      buff: buffByTypeLevel.get(String(row.structure_type || '').trim() + '|' + Number(row.level)) || 'Check in-game bonus',
      alliance: String(row.alliance || '').trim(),
      x: Number(row.coord_x),
      y: Number(row.coord_y),
      conflict: false,
      source_key: String(row.source_key || ''),
      updated_at: row.updated_at || null
    };
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    status('↻ Refreshing…');
    try {
      const response = await fetch(API + '/rest/v1/public_outposts?select=id,source_key,alliance,structure_type,level,coord_x,coord_y,updated_at&published=eq.true&order=id.asc', {
        method: 'GET',
        headers: {apikey: KEY, 'Cache-Control': 'no-cache'},
        cache: 'no-store',
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw Error('Unexpected response');

      const valid = rows.filter(row =>
        Number.isInteger(Number(row.id)) &&
        /^[A-Za-z0-9]{2,8}$/.test(String(row.alliance || '')) &&
        String(row.structure_type || '').trim() &&
        Number.isInteger(Number(row.level)) && Number(row.level) >= 1 && Number(row.level) <= 4 &&
        Number.isInteger(Number(row.coord_x)) && Number(row.coord_x) >= 0 && Number(row.coord_x) <= 1199 &&
        Number.isInteger(Number(row.coord_y)) && Number(row.coord_y) >= 0 && Number(row.coord_y) <= 1199
      );
      if (valid.length !== rows.length) throw Error('Published data failed validation');

      const coords = new Set();
      for (const row of valid) {
        const key = row.coord_x + ',' + row.coord_y;
        if (coords.has(key)) throw Error('Duplicate published coordinates');
        coords.add(key);
      }

      const live = valid.map(liveMarker);
      syncAllianceFilters(live);
      DATA.splice(0, DATA.length, ...live);
      hasLiveSnapshot = true;
      redraw();

      const times = valid.map(row => Date.parse(row.updated_at)).filter(Number.isFinite);
      const newest = times.length ? new Date(Math.max(...times)) : null;
      const detail = newest
        ? 'Supabase live data · ' + live.length + ' published outposts · latest record change ' + newest.toLocaleString()
        : 'Supabase live data · ' + live.length + ' published outposts';
      status('● Live DB · ' + live.length, detail);
      if ($('sourceNote')) $('sourceNote').textContent = 'Map markers come only from published Supabase records. ' + detail + '.';
    } catch (error) {
      if (!hasLiveSnapshot) {
        DATA.splice(0, DATA.length);
        redraw();
        status('● Live data unavailable', 'No unverified snapshot markers are being shown. ' + error.message);
        if ($('sourceNote')) $('sourceNote').textContent = 'Live data unavailable. No unverified snapshot markers are shown.';
      } else {
        status('● Last live data retained', 'Refresh failed; retaining the last successfully loaded Supabase snapshot. ' + error.message);
        if ($('sourceNote')) $('sourceNote').textContent = 'Refresh failed; showing the last successfully loaded live Supabase snapshot.';
      }
      console.error(error);
    } finally {
      busy = false;
    }
  }

  $('viewerRefresh').onclick = refresh;
  await refresh();
  setInterval(() => { if (!document.hidden && !busy) refresh(); }, 15000);
})();
