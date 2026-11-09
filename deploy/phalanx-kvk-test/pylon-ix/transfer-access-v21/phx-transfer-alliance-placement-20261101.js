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
 const top15 = rows.slice(0,15);
 return {
  status: !comparable ? 'UNAVAILABLE' : complete ? 'COMPLETE_SNAPSHOT' : 'PARTIAL_SNAPSHOT',
  rankMin: comparable ? stronger.length + 1 : null,
  rankMax: comparable ? stronger.length + tied.length + 1 : null,
  rosterSize: all.length, comparisonSize: rows.length, ahead: stronger.length,
  complete, snapshotDate, top15,
  top15Gap: comparable && complete && top15.length === 15 ? power - top15.at(-1).power : null,
  top15Guaranteed: comparable && complete && stronger.length + tied.length < 15,
  top15Possible: comparable && stronger.length < 15,
  gapAbove: above == null ? null : above - power,
  gapBelow: below == null ? null : power - below
 };
}

// Compare category values against a dated subset of the historical Top 15.
// The roster determines membership; independent category boards may be sparse.
export function compareTopPeers(candidate, top15, observations) {
 const metrics = ['master_power','pet_power','hero_total','hero_equip','gov_gear','gov_charm','research_power','troop_power'];
 const members = new Set(top15.map(row => String(row.player_id)));
 const peers = new Map();
 const captureTime = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)
  && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? Date.parse(value) : NaN;
 for (const row of observations) {
  const id = String(row.governor_id ?? '');
  if (members.has(id) && !peers.has(id)) peers.set(id, row.rankings);
 }
 return metrics.flatMap(key => {
  const value = number(candidate[key]?.value);
  const candidateCapture = captureTime(candidate[key]?.captured_at);
  if (value === null || !Number.isFinite(candidateCapture)) return [];
  const captures = new Map();
  for (const rankings of peers.values()) {
   const entry = rankings?.[key];
   const peerValue = number(entry?.value), capture = captureTime(entry?.captured_at);
   if (peerValue === null || !Number.isFinite(capture)) continue;
   if (!captures.has(capture)) captures.set(capture, []);
   captures.get(capture).push(peerValue);
  }
  const cohort = [...captures].sort(([a,first],[b,second]) => second.length-first.length || b-a)[0];
  if (!cohort || cohort[1].length < 5) return [];
  const [capture, values] = cohort;
  values.sort((a,b) => a-b);
  const median = (values[Math.floor((values.length-1)/2)]+values[Math.floor(values.length/2)])/2;
  return [{key, value, median, count: values.length, capture, candidateCapture}];
 });
}
