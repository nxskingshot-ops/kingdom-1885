/* Nexus App — public outpost report UI, standalone preview ONLY.
   Reads published public_outposts; does not change outposts or access protected tables. */
(function () {
  'use strict';
  const API = 'https://hcjrdofkdkasznywvcxo.supabase.co/rest/v1/public_outposts?select=id,alliance,structure_type,level,coord_x,coord_y,updated_at&published=eq.true&order=id.asc';
  const KEY = 'sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
  const reports = window.NexusAllianceReports;
  if (!reports) { document.body.textContent = 'Report formatter unavailable'; return; }
  const $ = id => document.getElementById(id);
  let published = [];
  const setStatus = value => { $('status').textContent = value; };
  $('refresh').onclick = refresh;
  $('alliance').onchange = update;
  $('copy').onclick = async () => {
    const report = $('report').value;
    try {
      await navigator.clipboard.writeText(report);
      setStatus('Report copied.');
    } catch {
      $('report').focus(); $('report').select();
      setStatus('Select and copy the report manually.');
    }
  };
  function update() {
    if (!published.length) { $('report').value = ''; $('copy').disabled = true; return; }
    const alliance = $('alliance').value;
    const subset = published.filter(row => alliance === 'ALL' || row.alliance === alliance);
    const validTimes = subset.map(r => Date.parse(r.updated_at)).filter(Number.isFinite);
    const timestamp = validTimes.length === subset.length && validTimes.length
      ? new Date(Math.max(...validTimes)) : null;
    // Verified must come from independent human approval, NOT a successful database fetch.
    $('report').value = reports.makeOutpostReport({
      sector: alliance === 'ALL' ? 'KINGDOM #1885' : alliance,
      outposts: subset,
      sourceUpdatedAt: timestamp,
      verified: false
    });
    $('copy').disabled = false;
  }
  async function refresh() {
    $('copy').disabled = true;
    $('report').value = '';
    setStatus('Loading published outposts…');
    try {
      const response = await fetch(API, {headers:{apikey:KEY}, cache:'no-store',signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error('Unexpected response type');
      const coords = new Set(), ids = new Set();
      for (const row of rows) {
        const x=Number(row.coord_x), y=Number(row.coord_y), level=Number(row.level), id=Number(row.id);
        if (!Number.isInteger(id) || ids.has(id) ||
            !/^[A-Za-z0-9]{2,8}$/.test(String(row.alliance || '')) ||
            !String(row.structure_type || '').trim() ||
            !Number.isInteger(level) || level < 1 || level > 4 ||
            !Number.isInteger(x) || x < 0 || x > 1199 ||
            !Number.isInteger(y) || y < 0 || y > 1199 ||
            coords.has(x+','+y)) throw new Error('Invalid/duplicate published record');
        coords.add(x+','+y); ids.add(id);
      }
      published = rows;
      const previous = $('alliance').value;
      const alliances = [...new Set(rows.map(r=>r.alliance))].sort();
      $('alliance').replaceChildren();
      for (const key of ['ALL',...alliances]) {
        const opt=document.createElement('option');
        opt.value=key;opt.textContent=key==='ALL'?'All published outposts':key;
        $('alliance').appendChild(opt);
      }
      $('alliance').value=alliances.includes(previous)?previous:'ALL';
      update();
      setStatus(rows.length + ' published outposts loaded. Verification pending.');
    } catch (error) {
      published = []; $('alliance').replaceChildren(); $('report').value = '';
      setStatus('Public data unavailable. No report generated. ' + error.message);
    }
  }
  refresh();
})();