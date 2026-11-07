// Insertion by raw Total Power. Complete snapshots require an independent count and sum.
const number = value => {
 if (!['string', 'number'].includes(typeof value) || String(value).trim() === '') return null;
 const parsed = Number(value);
 return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
};

export function placeInAlliance(candidatePower, roster = [], snapshotDate = '', options = {}) {
 const power = number(candidatePower);
 const identities = new Set((options.candidateIds || []).map(String));
 const seen = new Map();
 for (const row of roster) {
  const id = String(row?.player_id ?? row?.uid ?? row?.governor_id ?? '').trim();
  const value = number(row?.power);
  if (id && value !== null && !seen.has(id)) seen.set(id, {...row, power: value});
 }
 const all = [...seen.values()];
 const rows = [...seen].filter(([id]) => !identities.has(id)).map(([, row]) => row)
  .sort((a, b) => b.power - a.power);
 const stamp = /^\d{4}-\d{2}-\d{2}$/.test(snapshotDate) && Date.parse(snapshotDate);
 const dated = Number.isFinite(stamp);
 const complete = dated && all.length > 0 && all.length === roster.length
  && all.length === number(options.members)
  && all.reduce((sum, row) => sum + row.power, 0) === number(options.totalPower);
 const stronger = power === null ? [] : rows.filter(row => row.power > power);
 const tied = power === null ? [] : rows.filter(row => row.power === power);
 const above = stronger.at(-1)?.power;
 const below = power === null ? null : rows.find(row => row.power < power)?.power;
 const comparable = power !== null && dated && rows.length > 0;
 return {
  status: !comparable ? 'UNAVAILABLE' : complete ? 'COMPLETE_SNAPSHOT' : 'PARTIAL_SNAPSHOT',
  rankMin: comparable ? stronger.length + 1 : null,
  rankMax: comparable ? stronger.length + tied.length + 1 : null,
  rosterSize: all.length, complete, snapshotDate, top15: all.sort((a, b) => b.power - a.power).slice(0, 15),
  top15Guaranteed: comparable && complete && stronger.length + tied.length < 15,
  top15Possible: comparable && stronger.length < 15,
  gapAbove: above == null ? null : above - power,
  gapBelow: below == null ? null : power - below
 };
}
