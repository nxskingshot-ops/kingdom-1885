/* Nexus App — standalone, side-effect-free alliance chat report formatter.
   Input is the caller's ALREADY AUTHORIZED and DISPLAYED data only.
   Does not fetch live data, alter the UI or infer verification. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (root) root.NexusAllianceReports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clean = value => String(value == null ? '' : value)
    .replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
  function stamp(input) {
    if (!input) return null;
    const d = input instanceof Date ? input : new Date(input);
    if (!Number.isFinite(d.getTime())) return null;
    const p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(d);
    const parts = Object.fromEntries(p.map(e => [e.type, e.value]));
    return `${parts.day}.${parts.month}.${parts.year}/${parts.hour}:${parts.minute}`;
  }
  function footer({sourceUpdatedAt, verified}) {
    const time = stamp(sourceUpdatedAt);
    // The date is the actual source record time, never Date.now() / report creation time.
    return `${time || 'Data: Date/time unknown'} | ${verified === true ? 'Verified' : 'Unverified'}\nProvided by Nexus App`;
  }
  function makeOutpostReport({sector, outposts, sourceUpdatedAt = null, verified = false, kingshotCompact = false} = {}) {
    if (!Array.isArray(outposts)) throw new TypeError('outposts must be an array');
    const name = clean(sector).toUpperCase();
    if (!name) throw new TypeError('sector is required');
    const items = outposts.map((row, index) => {
      if (!row || typeof row !== 'object') throw new TypeError(`invalid outpost at ${index}`);
      const title = clean(row.name ?? row.structure_type ?? row.type);
      const level = Number(row.level);
      const x = Number(row.coord_x ?? row.x);
      const y = Number(row.coord_y ?? row.y);
      if (!title || !Number.isInteger(level) || level < 1 || !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
        throw new TypeError(`incomplete outpost at ${index}; never guess missing data`);
      }
      return { title, level, x, y, text: `${title} L${level}: ${x},${y}` };
    });
    // Level descending, then building name, then coordinates. Never mutate the source.
    items.sort((a, b) => b.level - a.level ||
      a.title.localeCompare(b.title, 'en') || a.x - b.x || a.y - b.y);
    const lines = [];
    if (kingshotCompact) {
      // Some versions of Kingshot collapse newlines at the end of long reports.
      // Combine only genuinely short adjacent entries. Keep the long names legible.
      for (let i = 0; i < items.length; i++) {
        const next = items[i + 1];
        if (next && items[i].text.length + next.text.length + 3 <= 48) {
          lines.push(items[i].text + ' | ' + next.text);
          i++;
        } else {
          lines.push(items[i].text);
        }
      }
    } else {
      lines.push(...items.map(item => item.text));
    }
    return [`${name} | ${items.length} OUTPOST${items.length === 1 ? '' : 'S'}`, ...lines,
      footer({sourceUpdatedAt, verified})].join('\n');
  }
  // Keep each complete message below the experimentally estimated Kingshot limit.
  // The 512-character ceiling is not confirmed; 480 leaves a small safety margin.
  // Every part repeats the source footer so that forwarded individual parts retain provenance.
  function splitReportForKingshot(report, maxCharacters = 480) {
    if (typeof report !== 'string' || !report.trim()) throw new TypeError('report is required');
    if (!Number.isInteger(maxCharacters) || maxCharacters < 100) throw new RangeError('invalid character limit');
    if (report.length <= maxCharacters) return [report];
    const allLines = report.split('\n');
    if (allLines.length < 4 || allLines[allLines.length - 1] !== 'Provided by Nexus App') {
      throw new TypeError('report footer missing: cannot safely split');
    }
    const title = allLines[0];
    const ending = allLines.slice(-2).join('\n');
    const entries = allLines.slice(1, -2);
    if (!entries.length) throw new RangeError('no report entries to split');

    // Iterate until header numbering size stabilizes (Part 1/2, Part 1/10, etc.).
    let guess = 1;
    let chunks = [];
    for (let attempt = 0; attempt < 30; attempt++) {
      const pages = [];
      let current = [];
      for (const entry of entries) {
        const heading = title + ' (PART ' + (pages.length + 1) + '/' + guess + ')';
        const trial = [heading, ...current, entry, ending].join('\n');
        if (trial.length <= maxCharacters) {
          current.push(entry);
        } else {
          if (!current.length) throw new RangeError('one complete report entry exceeds character limit');
          pages.push(current);
          current = [entry];
          const nextHeading = title + ' (PART ' + (pages.length + 1) + '/' + guess + ')';
          if ([nextHeading, entry, ending].join('\n').length > maxCharacters) {
            throw new RangeError('one complete report entry exceeds character limit');
          }
        }
      }
      if (current.length) pages.push(current);
      if (pages.length === guess) {
        chunks = pages.map((entriesForPage, index) =>
          [title + ' (PART ' + (index + 1) + '/' + pages.length + ')',
            ...entriesForPage, ending].join('\n'));
        break;
      }
      guess = pages.length;
    }
    if (!chunks.length || chunks.some(part => part.length > maxCharacters)) {
      throw new RangeError('could not split report safely');
    }
    return chunks;
  }
  // Discord's ordinary message cap is 2,000 characters; keep a safety margin.
  // No truncation: complete entries are carried over to subsequent messages.
  function makeDiscordOutpostReport({sector, outposts, sourceUpdatedAt = null, verified = false} = {}) {
    const base = makeOutpostReport({sector, outposts, sourceUpdatedAt, verified, kingshotCompact:false});
    const lines = base.split('\n');
    const title = lines.shift();
    const attribution = lines.pop();
    const status = lines.pop();
    // Decorative markdown only: the building names/coordinates remain unchanged.
    return [
      '**NEXUS APP · OUTPOST REPORT**',
      '**' + title + '**',
      '',
      ...lines.map((line, index) => (index + 1) + '. ' + line),
      '',
      '**Source updated:** ' + status.split(' | ')[0],
      '**Verification:** ' + (verified === true ? 'Verified' : 'Unverified'),
      attribution
    ].join('\n');
  }
  function splitReportForDiscord(report, maxCharacters = 1900) {
    if (typeof report !== 'string' || !report.trim()) throw new TypeError('report is required');
    if (!Number.isInteger(maxCharacters) || maxCharacters < 150 || maxCharacters > 2000) {
      throw new RangeError('invalid Discord character limit');
    }
    if (report.length <= maxCharacters) return [report];
    const lines = report.split('\n');
    const header = lines.slice(0, 3);
    const footer = lines.slice(-3);
    if (header[0] !== '**NEXUS APP · OUTPOST REPORT**' ||
        footer[2] !== 'Provided by Nexus App' || !footer[0].startsWith('**Source updated:** ')) {
      throw new TypeError('Discord report header or footer missing');
    }
    const entries = lines.slice(3, -4); // exclude the blank separator before source status
    if (!entries.length) throw new RangeError('no report entries to split');
    const groups = [];
    let guess = 1;
    for (let attempt = 0; attempt < 30; attempt++) {
      const pages = [];
      let active = [];
      const make = (rows, index) =>
        [header[0], header[1] + ' (PART ' + (index + 1) + '/' + guess + ')', '',
          ...rows, '', ...footer].join('\n');
      for (const entry of entries) {
        if (make([...active, entry], pages.length).length <= maxCharacters) active.push(entry);
        else {
          if (!active.length) throw new RangeError('one complete Discord entry exceeds character limit');
          pages.push(active);
          active = [entry];
          if (make(active, pages.length).length > maxCharacters) {
            throw new RangeError('one complete Discord entry exceeds character limit');
          }
        }
      }
      if (active.length) pages.push(active);
      if (pages.length === guess) {
        return pages.map((rows, index) => make(rows,index));
      }
      guess = pages.length;
    }
    throw new RangeError('could not split Discord report safely');
  }
  function makeTextReport({heading, lines, sourceUpdatedAt = null, verified = false} = {}) {
    const title = clean(heading);
    if (!title || !Array.isArray(lines)) throw new TypeError('heading and lines required');
    return [title, ...lines.map(clean).filter(Boolean), footer({sourceUpdatedAt, verified})].join('\n');
  }
  return Object.freeze({ makeOutpostReport, makeDiscordOutpostReport, makeTextReport, splitReportForKingshot, splitReportForDiscord, footer });
});