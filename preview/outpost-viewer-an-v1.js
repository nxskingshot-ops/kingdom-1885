/* Kingdom #1885 – public read-only Outpost viewer for An.
   Deliberately contains no Supabase Auth client and no database write operations.
   Original index.html and administrator preview remain untouched. */
(async function () {
  'use strict';
  const API = 'https://hcjrdofkdkasznywvcxo.supabase.co';
  const KEY = 'sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
  const $ = id => document.getElementById(id);
  const original = new Map(DATA.map(outpost => [outpost.id, outpost]));
  const notice = $('healthBadge');
  let busy = false;
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
  function status(text) {
    if (notice) notice.textContent = text;
    $('viewerStatus').textContent = text;
    $('viewerStatus').title = text;
  }
  function redraw() {
    render();
    if (sel !== null && sel !== undefined) {
      const item = DATA.find(row => row.id === sel);
      if (item) showOutpostPopup(item);
    }
  }
  async function refresh() {
    if (busy) return;
    busy = true;
    status('↻ Refreshing…');
    try {
      const response = await fetch(API + '/rest/v1/public_outposts?select=source_key,alliance,structure_type,level,coord_x,coord_y&published=eq.true&order=id.asc', {
        method: 'GET', headers: {apikey: KEY}, signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw Error('Unexpected response');
      let linked = 0;
      for (const row of rows) {
        const id = /^outpost-sheet:(\d+)$/.exec(row.source_key || '');
        const marker = id ? original.get(Number(id[1]) - 1) : null;
        if (!marker) continue;
        marker.type = row.structure_type;
        marker.alliance = row.alliance;
        marker.level = row.level;
        marker.x = row.coord_x;
        marker.y = row.coord_y;
        linked++;
      }
      redraw();
      status('● Live ' + linked + ' / ' + DATA.length);
      if ($('sourceNote')) $('sourceNote').textContent = 'Read-only preview: ' + linked + ' verified live outposts, ' + (DATA.length-linked) + ' unresolved snapshot markers. Unverified coordinates are not live data.';
    } catch (error) {
      status('● Live data unavailable');
      if ($('sourceNote')) $('sourceNote').textContent = 'Live refresh unavailable; showing original snapshot. ' + error.message;
      console.error(error);
    } finally {busy = false}
  }
  $('viewerRefresh').onclick = refresh;
  await refresh();
  setInterval(() => {if (!document.hidden && !busy) refresh()}, 15000);
})();
