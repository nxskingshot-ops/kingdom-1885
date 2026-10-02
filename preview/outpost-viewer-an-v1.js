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
#viewerControls{position:absolute;z-index:110;bottom:62px;right:8px;display:flex;align-items:center;gap:4px}
#mapTools #viewerControls{position:static;inset:auto;display:inline-flex;align-items:center;gap:4px;margin:0;padding:0;max-width:100%;background:transparent;border:0;box-shadow:none}
#viewerControls button{box-sizing:border-box;background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:5px 7px;font-size:11px;font-weight:800;white-space:nowrap;min-height:27px}
#viewerRefresh{background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:800}
#viewerStatus{background:#25190f;color:#e2c9a1;border:1px solid #99713c;border-radius:7px;padding:5px;font-size:10px;min-width:0;max-width:83px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mapTools #viewerStatus{display:none}
`;
  document.head.appendChild(styles);
  const controls = document.createElement('div');
  controls.id = 'viewerControls';
  controls.innerHTML = '<button type="button" id="viewerRefresh" aria-label="Refresh Map" title="Refresh Map">↻</button><small id="viewerStatus" role="status">Connecting…</small>';
  const nativeMapTools = $('mapTools');
  if (nativeMapTools) nativeMapTools.appendChild(controls);
  else $('app').appendChild(controls);

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
      const response = await fetch(API + '/rest/v1/public_outposts_verified_20261002?select=id,source_key,alliance,structure_type,level,coord_x,coord_y,updated_at&published=eq.true&order=id.asc', {
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
  const reportModuleURL = new URL('../reports/alliance-chat-report.js', document.currentScript?.src || location.href).href + '?build=discord-dual-export-v11';
  const reportStyle = document.createElement('style');
  reportStyle.textContent = `
#viewerControls #mapCopyReport{background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:5px 7px;font-size:11px;font-weight:800;white-space:nowrap;min-height:27px}
#mapCopyReport:disabled{opacity:.5}
#mapReportOverlay{position:fixed;inset:0;z-index:9999;background:#100c09b8;display:flex;align-items:center;justify-content:center;padding:12px}
#mapReportOverlay[hidden]{display:none}
#mapReportPanel{box-sizing:border-box;width:min(480px,100%);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;overflow:hidden;background:#2b2015;color:#ffe9bf;border:1px solid #c7a265;border-radius:12px;padding:12px;box-shadow:0 15px 50px #000a;font:13px system-ui}
#mapReportPanel h3{font:700 19px Georgia,serif;margin:0 0 9px}
#mapReportBody{display:flex;min-height:0;flex:1 1 auto;flex-direction:column;overflow:hidden}#mapReportPanel label{display:block;margin:8px 0 4px;flex-shrink:0}
#mapReportPanel select,#mapReportPanel textarea{box-sizing:border-box;width:100%;border:1px solid #a5814b;border-radius:6px;background:#17120d;color:#fff1d6;padding:8px}
#mapReportPanel textarea{min-height:80px;max-height:none;flex:1 1 auto;overflow:auto;resize:none;font:12px/1.5 monospace;white-space:pre}
#mapReportPanel button{margin:9px 8px 0 0;padding:9px 12px;border-radius:7px;border:1px solid #a5814b;background:#efd09b;color:#332111;font-weight:700}
#mapReportFormatRow{display:flex;align-items:center;gap:9px;flex-shrink:0}#mapReportFormatRow label{margin:4px 0!important}#mapReportFormatRow select{width:auto;flex:1;min-width:0;max-width:200px;padding:5px}#mapReportPageRow{display:flex;justify-content:space-between;align-items:center;gap:8px}#mapReportPageRow #mapReportPart{width:auto;max-width:55%;flex:0 1 auto;font-size:12px;padding:4px}#mapReportPageRow #mapReportPart[hidden]{display:none}#mapReportPanel small{display:block;color:#ead1a5;margin-top:7px}#mapReportFooter{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid #6b5030}#mapReportFooter small{margin:0;min-width:0;flex:1}#mapReportActions{display:flex;flex:0 0 auto;gap:7px}#mapReportActions button{margin:0;white-space:nowrap}@media(max-height:480px){#mapReportPanel{padding:8px}#mapReportPanel h3{font-size:16px;margin-bottom:3px}#mapReportPanel label{margin:3px 0 2px}#mapReportPanel textarea{min-height:60px}#mapReportFooter small{font-size:10px}}
`;
  document.head.appendChild(reportStyle);
  const reportButton = document.createElement('button');
  reportButton.type = 'button';
  reportButton.id = 'mapCopyReport';
  reportButton.textContent = '▤ Report';
  reportButton.title = 'Copy Outpost Report';
  reportButton.setAttribute('aria-label', 'Copy Outpost Report');
  reportButton.disabled = true;
  controls.insertBefore(reportButton, $('viewerStatus'));
  const overlay = document.createElement('div');
  overlay.id = 'mapReportOverlay';
  overlay.hidden = true;
  overlay.innerHTML = '<div id="mapReportPanel" role="dialog" aria-modal="true" aria-label="Public outpost report"><h3>Outpost Report</h3><div id="mapReportBody"><label for="mapReportAlliance">Alliance or quadrant</label><select id="mapReportAlliance"></select><div id="mapReportFormatRow"><label for="mapReportFormat">Format</label><select id="mapReportFormat" aria-label="Export format"><option value="kingshot">Kingshot · Compact</option><option value="discord">Discord · Detailed</option></select></div><div id="mapReportPageRow"><label for="mapReportText">Preview</label><select id="mapReportPart" aria-label="Report part" hidden></select></div><textarea id="mapReportText" readonly></textarea></div><div id="mapReportFooter"><small id="mapReportInfo" role="status">Published records · Verified</small><div id="mapReportActions"><button type="button" id="mapReportCopy">Copy All</button><button type="button" id="mapReportClose">Close</button></div></div></div>';
  document.body.appendChild(overlay);
  const selector = $('mapReportAlliance');
  const reportText = $('mapReportText');
  const reportInfo = $('mapReportInfo');
  const partSelector = $('mapReportPart');
  const formatSelector = $('mapReportFormat');
  let reportParts = [];
  let reportAPI = null;
  function showReportPart() {
    const partIndex = Number(partSelector.value) || 0;
    reportText.value = reportParts[partIndex] || '';
    reportText.scrollTop = 0;
    $('mapReportCopy').disabled = !reportText.value;
    $('mapReportCopy').textContent = reportParts.length > 1
      ? 'Copy Part ' + (partIndex + 1) + '/' + reportParts.length
      : formatSelector.value === 'discord'
        ? 'Copy Full Report'
        : 'Copy All';
  }
  partSelector.onchange = showReportPart;
  formatSelector.onchange = updateReport;
  function closeReport() { overlay.hidden = true; reportButton.focus(); }
  function updateReport() {
    if (!reportAPI || !hasLiveSnapshot) {
      reportParts = [];
      reportText.value = '';
      $('mapReportCopy').disabled = true;
      reportInfo.textContent = 'Published data unavailable.';
      return;
    }
    const selection = selector.value;
    if (!selection) {
      reportParts = [];
      partSelector.replaceChildren();
      partSelector.hidden = true;
      reportText.value = '';
      $('mapReportCopy').disabled = true;
      $('mapReportCopy').textContent = 'Copy All';
      reportInfo.textContent = 'Select an alliance or quadrant to generate a report.';
      return;
    }
    // Provisional alliance-to-quadrant aliases, NOT geographical coordinate boundaries.
    // Do not mark Verified until the official allocation is confirmed.
    const proposedSectors = {
      FRA: 'NORTHERN QUADRANT', NXS: 'EASTERN QUADRANT',
      OOO: 'SOUTHERN QUADRANT', MYM: 'WESTERN QUADRANT'
    };
    const selected = DATA.filter(item => selection === 'ALL' ||
      item.alliance.toUpperCase() === selection.toUpperCase());
    const name = proposedSectors[selection.toUpperCase()];
    const sectorLabel = selection === 'ALL' ? 'KINGDOM #1885'
      : name ? selection.toUpperCase() + ' · ' + name + ' (PROVISIONAL)'
      : selection.toUpperCase();
    const times = selected.map(item => Date.parse(item.updated_at)).filter(Number.isFinite);
    const updatedAt = times.length && times.length === selected.length
      ? new Date(Math.max(...times)) : null;
    const isDiscord = formatSelector.value === 'discord';
    const fullReport = (isDiscord ? reportAPI.makeDiscordOutpostReport : reportAPI.makeOutpostReport)({
      sector: sectorLabel,
      outposts: selected,
      sourceUpdatedAt: updatedAt,
      verified: true,
      kingshotCompact: !isDiscord
    });
    try {
      reportParts = isDiscord
        ? reportAPI.splitReportForDiscord(fullReport, 1900)
        : reportAPI.splitReportForKingshot(fullReport, 480);
    } catch (error) {
      reportParts = [];
      reportText.value = '';
      $('mapReportCopy').disabled = true;
      reportInfo.textContent = 'Report cannot be safely split: ' + error.message;
      return;
    }
    partSelector.replaceChildren();
    reportParts.forEach((part, index) => {
      const opt = document.createElement('option');
      opt.value = String(index);
      opt.textContent = 'Part ' + (index + 1) + '/' + reportParts.length;
      partSelector.appendChild(opt);
    });
    partSelector.hidden = reportParts.length <= 1;
    partSelector.value = '0';
    showReportPart();
    reportInfo.textContent = (isDiscord
      ? 'Discord: up to 1,900 characters per part · ' + reportParts.length + ' part' + (reportParts.length === 1 ? '' : 's') + '. '
      : 'Kingshot: up to 480 characters per part. ') +
      (name ? 'Quadrant assignment provisional. ' : '') + 'Published outposts · Verified.';
  }
  reportButton.onclick = () => {
    if (!hasLiveSnapshot || !reportAPI) return;
    // Reset the dialog on every opening; do not preserve selections from the last report.
    const alliances = [...new Set(DATA.map(item => item.alliance))].sort();
    const sectors = {
      FRA: 'Northern Quadrant', NXS: 'Eastern Quadrant',
      OOO: 'Southern Quadrant', MYM: 'Western Quadrant'
    };
    selector.replaceChildren();
    const appendOption = (value, label) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      selector.appendChild(opt);
    };
    appendOption('', 'Select alliance or quadrant…');
    appendOption('ALL', 'All published outposts');
    for (const name of alliances) {
      const direction = sectors[name.toUpperCase()];
      appendOption(name, direction ? name + ' · ' + direction + ' (provisional)' : name);
    }
    selector.value = '';
    formatSelector.value = 'kingshot';
    partSelector.value = '0';
    updateReport();
    overlay.hidden = false;
  };
  // Compact Outpost Intelligence entry point. Existing report dialog remains unchanged.
  const intelButton=document.createElement('button');
  intelButton.type='button';intelButton.id='outpostIntelButton';intelButton.textContent='🧠 Intelligence';
  intelButton.title='Outpost Intelligence';
  controls.insertBefore(intelButton,reportButton);
  reportButton.style.display='none';
  const intel=document.createElement('div');intel.id='outpostIntelOverlay';intel.hidden=true;
  intel.innerHTML='<div id="outpostIntelPanel"><h3>🧠 Outpost Intelligence</h3><h4>Alliance Overview</h4><div id="outpostIntelSummary"></div><h4>Ownership Changes</h4><div id="outpostIntelHistory">Loading…</div><div class="intelActions"><button type="button" id="outpostIntelReport">▤ Reports</button><button type="button" id="outpostIntelClose">Close</button></div></div>';
  document.body.appendChild(intel);
  const intelStyle=document.createElement('style');
  intelStyle.textContent='#outpostIntelOverlay{position:fixed;inset:0;z-index:9998;background:rgba(16,12,9,.72);display:flex;align-items:center;justify-content:center;padding:12px}#outpostIntelOverlay[hidden]{display:none}#outpostIntelPanel{width:min(520px,78vw);max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;background:#2b2015;color:#ffe9bf;border:1px solid #c7a265;border-radius:12px;padding:12px;font:13px system-ui}.intelActions{position:sticky;bottom:-12px;background:#2b2015;padding:8px 0 4px;z-index:2}#outpostIntelPanel h3{margin:0 0 10px;font:700 19px Georgia,serif}#outpostIntelPanel h4{margin:12px 0 6px;color:#f1d19a}#outpostIntelSummary{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:6px}#outpostIntelSummary span,#outpostIntelHistory div{display:block;border:1px solid #76552e;border-radius:7px;padding:7px;background:#1b140e}.intelActions{display:flex;justify-content:flex-end;gap:7px;margin-top:12px}.intelActions button,#outpostIntelButton{padding:7px 9px;border-radius:7px;border:1px solid #a5814b;background:#efd09b;color:#332111;font-weight:700}';
  document.head.appendChild(intelStyle);
  function showIntelSummary(){const counts={};DATA.forEach(item=>{counts[item.alliance]=(counts[item.alliance]||0)+1});$('outpostIntelSummary').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([name,count])=>'<span><b>'+name+'</b> · '+count+'</span>').join('');}
  const openReport=reportButton.onclick;
  async function loadIntelHistory(){const box=$('outpostIntelHistory');box.textContent='Loading…';try{const response=await fetch(API+'/rest/v1/outpost_ownership_history?select=structure_type,level,coord_x,coord_y,previous_owner,new_owner,status,reported_by,event_time,recorded_at&order=recorded_at.desc&limit=20',{headers:{apikey:KEY},cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);const rows=await response.json();box.replaceChildren();if(!rows.length){const empty=document.createElement('div');empty.textContent='No ownership changes recorded yet.';box.appendChild(empty);return;}for(const row of rows){const item=document.createElement('div');const first=document.createElement('b');first.textContent=row.status||'Change';item.append(first,document.createTextNode(' · '+row.structure_type+' L'+row.level+' · '+row.coord_x+','+row.coord_y),document.createElement('br'),document.createTextNode(row.previous_owner+' → '+row.new_owner+(row.reported_by?' · '+row.reported_by:'')));box.appendChild(item);}}catch(error){box.textContent='Ownership history unavailable.';}}
  intelButton.onclick=()=>{if(!hasLiveSnapshot)return;showIntelSummary();intel.hidden=false;loadIntelHistory();};
  window.addEventListener('message',event=>{if(event.data&&event.data.type==='nexus-outpost-tab-change')intel.hidden=true;});
  $('outpostIntelClose').onclick=()=>{intel.hidden=true;};
  $('outpostIntelReport').onclick=()=>{intel.hidden=true;openReport();};
  intel.addEventListener('click',event=>{if(event.target===intel)intel.hidden=true;});
  selector.onchange = updateReport;
  $('mapReportClose').onclick = closeReport;
  overlay.addEventListener('click', event => { if (event.target === overlay) closeReport(); });
  $('mapReportCopy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(reportText.value);
      reportInfo.textContent = formatSelector.value === 'discord'
        ? 'Copied Discord part ' + (Number(partSelector.value) + 1) + '/' + reportParts.length + ' · Ready to paste.'
        : 'Copied part ' + (Number(partSelector.value) + 1) + '/' + reportParts.length + ' · Ready for alliance chat.';
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
