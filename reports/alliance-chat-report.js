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
  function makeOutpostReport({sector, outposts, sourceUpdatedAt = null, verified = false} = {}) {
    if (!Array.isArray(outposts)) throw new TypeError('outposts must be an array');
    const name = clean(sector).toUpperCase();
    if (!name) throw new TypeError('sector is required');
    const lines = outposts.map((row, index) => {
      if (!row || typeof row !== 'object') throw new TypeError(`invalid outpost at ${index}`);
      const title = clean(row.name ?? row.structure_type ?? row.type);
      const level = Number(row.level);
      const x = Number(row.coord_x ?? row.x);
      const y = Number(row.coord_y ?? row.y);
      if (!title || !Number.isInteger(level) || level < 1 || !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
        throw new TypeError(`incomplete outpost at ${index}; never guess missing data`);
      }
      return `${title} L${level}: ${x},${y}`;
    });
    return [`${name} | ${lines.length} OUTPOST${lines.length === 1 ? '' : 'S'}`, ...lines,
      footer({sourceUpdatedAt, verified})].join('\n');
  }
  function makeTextReport({heading, lines, sourceUpdatedAt = null, verified = false} = {}) {
    const title = clean(heading);
    if (!title || !Array.isArray(lines)) throw new TypeError('heading and lines required');
    return [title, ...lines.map(clean).filter(Boolean), footer({sourceUpdatedAt, verified})].join('\n');
  }
  return Object.freeze({ makeOutpostReport, makeTextReport, footer });
});