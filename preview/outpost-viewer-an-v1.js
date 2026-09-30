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
      if (typeof reportButton !== 'undefined') reportButton.disabled = !reportAPI;
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
        if (typeof reportButton !== 'undefined') reportButton.disabled = true;
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

  // The only new public control: a self-contained report overlay.
  // Uses exactly the published data displayed by the map; never guesses sectors or verification.
  const reportModuleURL = new URL('../reports/alliance-chat-report.js', document.currentScript?.src || location.href).href;
  const reportStyle = document.createElement('style');
  reportStyle.textContent = \`
#mapCopyReport{background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:800}
#mapCopyReport:disabled{opacity:.5}
#mapReportOverlay{position:fixed;inset:0;z-index:9999;background:#100c09b8;display:flex;align-items:center;justify-content:center;padding:12px}
#mapReportOverlay[hidden]{display:none}
#mapReportPanel{box-sizing:border-box;width:min(480px,100%);max-height:85dvh;overflow:auto;background:#2b2015;color:#ffe9bf;border:1px solid #c7a265;border-radius:12px;padding:14px;box-shadow:0 15px 50px #000a;font:13px system-ui}
#mapReportPanel h3{font:700 19px Georgia,serif;margin:0 0 9px}
#mapReportPanel label{display:block;margin:8px 0 4px}
#mapReportPanel select,#mapReportPanel textarea{box-sizing:border-box;width:100%;border:1px solid #a5814b;border-radius:6px;background:#17120d;color:#fff1d6;padding:8px}
#mapReportPanel textarea{min-height:170px;max-height:35dvh;resize:vertical;font:12px/1.5 monospace;white-space:pre}
#mapReportPanel button{margin:9px 8px 0 0;padding:9px 12px;border-radius:7px;border:1px solid #a5814b;background:#efd09b;color:#332111;font-weight:700}
#mapReportPanel small{display:block;color:#ead1a5;margin-top:7px}
\`;
  document.head.appendChild(reportStyle);
  const reportButton = document.createElement('button');
  reportButton.type = 'button';
  reportButton.id = 'mapCopyReport';
  reportButton.textContent = 'Copy Report';
  reportButton.disabled = true;
  controls.insertBefore(reportButton, $('viewerStatus'));
  const overlay = document.createElement('div');
  overlay.id = 'mapReportOverlay';
  overlay.hidden = true;
  overlay.innerHTML = '<div id="mapReportPanel" role="dialog" aria-modal="true" aria-label="Public outpost report"><h3>Outpost Report</h3><label for="mapReportAlliance">Alliance</label><select id="mapReportAlliance"></select><label for="mapReportText">Preview</label><textarea id="mapReportText" readonly></textarea><small id="mapReportInfo" role="status">Published records only · Unverified</small><button type="button" id="mapReportCopy">Copy All</button><button type="button" id="mapReportClose">Close</button></div>';
  document.body.appendChild(overlay);
  const selector = $('mapReportAlliance');
  const reportText = $('mapReportText');
  const reportInfo = $('mapReportInfo');
  let reportAPI = null;
  function closeReport() { overlay.hidden = true; reportButton.focus(); }
  function updateReport() {
    if (!reportAPI || !hasLiveSnapshot) {
      reportText.value = '';
      $('mapReportCopy').disabled = true;
      reportInfo.textContent = 'Published data unavailable.';
      return;
    }
    const alliance = selector.value;
    const selected = DATA.filter(item => alliance === 'ALL' || item.alliance === alliance);
    const times = selected.map(item => Date.parse(item.updated_at)).filter(Number.isFinite);
    const updatedAt = times.length && times.length === selected.length
      ? new Date(Math.max(...times)) : null;
    reportText.value = reportAPI.makeOutpostReport({
      sector: alliance === 'ALL' ? 'KINGDOM #1885' : alliance,
      outposts: selected,
      sourceUpdatedAt: updatedAt,
      verified: false
    });
    $('mapReportCopy').disabled = false;
    reportInfo.textContent = 'Published outposts only · Unverified until confirmed by a responsible data steward.';
  }
  reportButton.onclick = () => {
    if (!hasLiveSnapshot || !reportAPI) return;
    const previous = selector.value;
    const alliances = [...new Set(DATA.map(item => item.alliance))].sort();
    selector.replaceChildren();
    for (const name of ['ALL', ...alliances]) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name === 'ALL' ? 'All published outposts' : name;
      selector.appendChild(opt);
    }
    selector.value = alliances.includes(previous) ? previous : 'ALL';
    updateReport();
    overlay.hidden = false;
  };
  selector.onchange = updateReport;
  $('mapReportClose').onclick = closeReport;
  overlay.addEventListener('click', event => { if (event.target === overlay) closeReport(); });
  $('mapReportCopy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(reportText.value);
      reportInfo.textContent = 'Copied · Ready for alliance chat.';
    } catch (error) {
      reportText.focus();
      reportText.select();
      reportInfo.textContent = 'Clipboard permission unavailable · Select and copy the highlighted text.';
    }
  };
  const reportScript = document.createElement('script');
  reportScript.src = reportModuleURL;
  reportScript.onload = () => {
    reportAPI = window.NexusAllianceReports;
    reportButton.disabled = !reportAPI || !hasLiveSnapshot;
  };
  reportScript.onerror = () => { reportButton.disabled = true; console.warn('Map report module unavailable'); };
  document.head.appendChild(reportScript);

  $('viewerRefresh').onclick = refresh;
  await refresh();
  setInterval(() => { if (!document.hidden && !busy) refresh(); }, 15000);
})();
