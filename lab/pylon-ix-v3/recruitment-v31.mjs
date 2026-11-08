import {assessHistoricalProfile} from './assessment.mjs';

// PYLON IX V3.1 — evidence-first recruitment advice. Pure function, no network/storage.
// A missing rank is unknown, never zero. Rankings cannot certify combat capability.
const valid = v => Number.isSafeInteger(v) && v > 0;
const ROLE_KEYS = Object.freeze({
  'Rally Leader':['hero_equip_rank','governor_gear_rank','governor_charm_rank'],
  'Rally Joiner':['troop_power_rank','research_rank'],
  'Garrison Holder':['governor_gear_rank','governor_charm_rank','troop_power_rank']
});
export function adviseRecruitment(player={},context={}) {
  const a=assessHistoricalProfile(player,context);
  const ranks=player.ranking_evidence??{};
  const candidates=Object.entries(ROLE_KEYS).map(([role,keys])=>{
    const known=keys.filter(k=>valid(ranks[k]));
    const top10=known.filter(k=>ranks[k]<=10);
    const coverage=known.length/keys.length;
    const signal=coverage===1&&top10.length===keys.length?'STRONG_RANKING_SIGNAL'
      :coverage>=2/3&&top10.length>=2?'PROMISING_RANKING_SIGNAL'
      :known.length===0?'UNKNOWN':'LIMITED_RANKING_SIGNAL';
    return {role,signal,coverage:{known:known.length,expected:keys.length},
      evidence:known.map(k=>({metric:k,rank:ranks[k]})),
      verifiedCombatRole:false};
  }).sort((x,y)=>{
    const score=r=>r.evidence.filter(e=>e.rank<=10).length*10+r.coverage.known;
    return score(y)-score(x);
  });
  const alliance=context.alliance??null;
  const peers=Array.isArray(alliance?.top15)?alliance.top15.filter(p=>p&&typeof p==='object'):null;
  const comparable=peers?.filter(p=>valid(p.ranking_evidence?.personal_power_rank))??[];
  const personal=valid(ranks.personal_power_rank)?ranks.personal_power_rank:null;
  const betterOrEqual=personal===null?null:comparable.filter(p=>p.ranking_evidence.personal_power_rank<=personal).length;
  const placement=personal!==null&&comparable.length>=10
    ?{status:'PARTIAL_RANK_COMPARISON',peerCount:comparable.length,betterOrEqual,
       note:'Kingdom-wide Personal Power ranking comparison only; not a verified alliance power placement.'}
    :{status:'INSUFFICIENT_COMPARABLE_PEERS',peerCount:comparable.length,
       note:'No reliable alliance placement without comparable current player data.'};
  const strength=a.strengths[0]??null;
  const gap=a.development[0]??null;
  const decision=a.confidence==='INSUFFICIENT'?'NEEDS_MORE_DATA'
    :a.profile==='Troop-forward, uneven development'?'CONDITIONAL_REVIEW'
    :a.profile==='Broad elite development'?'PRIORITY_REVIEW'
    :'REVIEW';
  const reasons=[
    a.profile,
    strength?'Strongest documented permanent category: '+strength.label+' #'+strength.rank:'Permanent strength not established',
    gap?'Relative development gap: '+gap.label+' #'+gap.rank:'No documented bottom-three development gap',
    'No verified battle performance, activity, availability or transfer eligibility'
  ];
  return {
    version:'PYLON_IX_V3_1_LAB',player:a.player,decision,
    evidenceGrade:a.confidence,accountDNA:a.profile,
    reasons,roleCandidates:candidates,alliancePlacement:placement,
    recruitmentAdvice:decision==='PRIORITY_REVIEW'?'Prioritize direct recruitment review; confirm alliance needs and combat evidence before offering a role.'
      :decision==='CONDITIONAL_REVIEW'?'Review targeted permanent-development gaps before making a frontline commitment.'
      :decision==='NEEDS_MORE_DATA'?'Collect comparable current data before issuing a recruitment verdict.'
      :'Evaluate alliance fit and role evidence before deciding.',
    dataFreshness:context.type==='HISTORICAL_READ_ONLY_BENCHMARK'?'HISTORICAL_NOT_LIVE':'NOT_VERIFIED_LIVE',
    verifiedTransferEligibility:false,verifiedCombatPerformance:false,releaseStatus:'LAB_ONLY'
  };
}
