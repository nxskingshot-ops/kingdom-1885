import { formatPlayerUtc } from './transfer-id-display-20261030.js';

// Decision Summary V2: documented kingdom positions, never missing ranks or battle scores.
const metrics = [
 ['hero_equip','Hero Equipment'], ['research_power','Research Power'], ['hero_total','Hero Power'],
 ['master_power','Master Power'], ['pet_power','Pet Power'], ['troop_power','Troop Power'],
 ['gov_gear','Governor Gear'], ['gov_charm','Governor Charms'], ['mystic_trial','Mystic Trial']
];

export function assessAccount(_player = {}, rankings = {}) {
 const rankingEvidence = metrics.flatMap(([key, label]) => {
  const entry = rankings[key];
  const raw = entry?.kingdom_rank ?? entry;
  const rank = typeof raw === 'string' || typeof raw === 'number' ? Number(raw) : NaN;
  return Number.isSafeInteger(rank) && rank > 0 ? [{
   key, label, rank, capturedAt: formatPlayerUtc(entry?.captured_at)
  }] : [];
 }).sort((a, b) => a.rank - b.rank);
 const top = rankingEvidence.filter(entry => entry.rank <= 15);
 const coverage = rankingEvidence.length;
 const median = coverage
  ? (rankingEvidence[Math.floor((coverage - 1) / 2)].rank + rankingEvidence[Math.floor(coverage / 2)].rank) / 2
  : null;
 const level = coverage < 4 ? (coverage ? 'Partial kingdom profile' : 'Insufficient ranking evidence')
  : median <= 15 ? 'Strong kingdom profile' : median <= 40 ? 'Established kingdom profile' : 'Developing kingdom profile';
 const profile = coverage < 4 ? 'Profile open'
  : top.length && rankingEvidence.at(-1).rank > 30 ? 'Specialized'
  : rankingEvidence.at(-1).rank - rankingEvidence[0].rank <= 15 ? 'Balanced' : 'Mixed development';
 const dates = rankingEvidence.map(entry => entry.capturedAt).filter(date => date !== 'Not available').sort();
 const ranked = Object.fromEntries(rankingEvidence.map(entry => [entry.key, entry]));
 const cue = keys => keys.map(key => ranked[key]).filter(entry => entry?.rank <= 15);
 const roles = [
  ['Rally Leader', cue(['hero_equip','hero_total','gov_gear','gov_charm']), 2, 'Rally reports, lead buffs and capacity'],
  ['Rally Joiner', cue(['troop_power','research_power']), 1, 'Troop tiers, march size and joiner heroes'],
  ['Garrison Holder', cue(['gov_gear','gov_charm','troop_power']), 2, 'Defense reports, garrison buffs and formation'],
  ['KvK Fighter', cue(['troop_power','research_power','hero_total']), 2, 'KvK battle reports, combat buffs and formation']
 ].map(([label, evidence, threshold, missing]) => ({
  label, review: evidence.length >= threshold, evidence: evidence.sort((a,b) => a.rank-b.rank), missing
 }));
 const priorities = roles.filter(role => role.review).sort((a,b) =>
  b.evidence.length-a.evidence.length
  || a.evidence.reduce((sum,row) => sum+row.rank,0)-b.evidence.reduce((sum,row) => sum+row.rank,0)
 );
 return {
  level, profile, median, rankingEvidence, coverage, expected: metrics.length,
  strengths: top.slice(0, 3),
  development: rankingEvidence.filter(entry => entry.rank > 15).slice(-3).reverse(),
  missing: metrics.filter(([key]) => !ranked[key]).map(([, label]) => label),
  dated: dates.length, oldest: dates[0], newest: dates.at(-1), roles, priorities
 };
}

// KvK Intelligence-derived evidence model. Only compares like-for-like metrics.
// Missing inputs remain unknown; no combat role is certified from power alone.
export function classifyCombatProfile(player = {}, rankings = {}) {
 const groups = [
  ['Troops', ['troop_power_rank','troopPowerRank']],
  ['Hero equipment', ['hero_equip_rank','heroEquipRank']],
  ['Governor gear', ['governor_gear_rank','governorGearRank']],
  ['Governor charms', ['governor_charm_rank','governorCharmRank']],
  ['Pets', ['pet_power_rank','petPowerRank']],
  ['Research', ['research_rank','researchRank']],
  ['Mystic Trial', ['mystic_rank','mysticRank']],
  ['Kills', ['kills_rank','killsRank']]
 ];
 const lookup = (obj, keys) => keys.map(k=>obj?.[k]).find(v=>v!==undefined&&v!==null&&v!=='');
 const rows = groups.map(([label,keys])=>{
  const raw=lookup(player,keys);
  const fromRanks=rankings?.[label.toLowerCase().replaceAll(' ','_')];
  const rank=Number(raw??fromRanks?.kingdom_rank);
  return {label,rank:Number.isInteger(rank)&&rank>0?rank:null};
 }).filter(x=>x.rank!==null);
 const top10=rows.filter(x=>x.rank<=10).sort((a,b)=>a.rank-b.rank);
 const strengths=top10.map(x=>x.label+' #'+x.rank);
 const coverage=rows.length;
 let profile='Insufficient comparative evidence';
 if(coverage>=4&&top10.length>=3){
  const troop=rows.find(x=>x.label==='Troops');
  const equip=rows.find(x=>x.label==='Hero equipment');
  profile=troop?.rank<=5&&equip?.rank<=5?'Broad elite development':'Multiple documented ranking strengths';
 }else if(coverage>=2&&top10.length>=1)profile='Partially documented development';
 return {profile,coverage,documentedStrengths:strengths,
  openQuestions:groups.filter(([label])=>!rows.some(x=>x.label===label)).map(([label])=>label),
  roleAssessment:'Combat role not verified without battle reports, formation and comparable roster data',
  evidenceLevel:coverage>=4?'MULTI_RANKING':coverage?'PARTIAL':'INSUFFICIENT'};
}
