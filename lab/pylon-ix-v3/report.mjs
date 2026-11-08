import {assessHistoricalProfile} from './assessment.mjs';

// Evidence-first English report for the isolated historical benchmark.
// No inferred combat performance, no live-data claims, no certified roles.
export function buildAssessmentReport(player={}, context={}) {
  const a=assessHistoricalProfile(player,context);
  const ranks=player.ranking_evidence??{};
  const valid=v=>Number.isSafeInteger(v)&&v>0;
  const isHistorical=context.type==='HISTORICAL_READ_ONLY_BENCHMARK';
  const rankText=(items)=>items.length?items.map(x=>x.label+' #'+x.rank).join(', '):'No comparable category ranks available';
  const troop=valid(ranks.troop_power_rank)?'Troop Power #'+ranks.troop_power_rank:'Troop Power ranking unavailable';
  const personal=valid(ranks.personal_power_rank)?'Personal Power #'+ranks.personal_power_rank:'Personal Power ranking unavailable';
  const summary=a.confidence==='INSUFFICIENT'
    ? 'Insufficient comparable rankings to establish a reliable account profile.'
    : a.profile+'. '+personal+'; '+troop+'.';
  const strengths=a.confidence==='INSUFFICIENT'
    ? 'Insufficient evidence to identify reliable permanent-development strengths.'
    : 'Highest documented permanent-development positions: '+rankText(a.strengths)+'.';
  const weaknesses=a.development.length
    ? 'Relative development gaps in this kingdom snapshot: '+rankText(a.development)+'. These are relative ranks, not proof of poor combat performance.'
    : a.missing.length?'No documented low-ranking permanent-development category; missing categories prevent a complete weakness assessment.'
    :'No documented category outside the top 15 in available permanent-development rankings; this does not prove there are no weaknesses.';
  const interpretation=a.profile==='Troop-forward, uneven development'
    ? 'Troop ranking is comparatively strong while several permanent-development rankings lag; consider permanent-development balance when assigning frontline responsibilities.'
    : a.underestimated
    ? 'Permanent-development positions are materially better than Personal Power placement; do not evaluate this account from total power alone.'
    : a.profile==='Broad elite development'
    ? 'Strong rankings across multiple permanent-development categories indicate breadth, across the available categories.'
    : 'The documented rankings provide a development-based account assessment.';
  const roles=a.roleSignals.map(r=>({
    role:r.role,status:r.status,indicators:r.indicators,
    assessment:r.indicators.length?'Potential fit based on the available ranking indicators.':'Insufficient ranking indicators for a confident role recommendation.',
    requiredEvidence:r.requiredEvidence
  }));
  const sourceNote=isHistorical
    ? 'Historical kingdom #'+(context.kingdom??'unknown')+' benchmark captured '+(a.snapshotDate??'on an unknown date')+'; NOT LIVE.'
    : 'Source freshness and comparability have not been verified; NOT CERTIFIED LIVE.';
  const caveats=[
    sourceNote,
    'Rankings are kingdom-relative; they are not absolute power or battle scores.',
    'Strategic roles are recommendations based on available ranking evidence.'
  ];
  return {
    title:'PYLON IX — Account Assessment',
    player:a.player,language:'en',sourceNote,summary,
    evidence:{grade:a.confidence,permanentCategories:a.coverage,personalPowerRank:valid(ranks.personal_power_rank)?ranks.personal_power_rank:null,
      troopPowerRank:valid(ranks.troop_power_rank)?ranks.troop_power_rank:null,snapshotDate:a.snapshotDate},
    sections:{strengths,weaknesses,interpretation,roleRecommendations:roles,missingData:a.missing,caveats},
    releaseStatus:'LAB_ONLY'
  };
}
export function formatAssessmentReport(report) {
  const roles=report.sections.roleRecommendations.map(r=>
    '- '+r.role+' ['+r.status+']: '+r.assessment+' Indicators: '+(r.indicators.join(', ')||'none')+
    '. Needed: '+r.requiredEvidence+'.').join('\n');
  return [
    report.title,'Player: '+report.player,report.sourceNote,'Evidence: '+report.evidence.grade,
    'Assessment: '+report.summary,'Strengths: '+report.sections.strengths,
    'Development: '+report.sections.weaknesses,'Interpretation: '+report.sections.interpretation,
    'Strategic role recommendations:',roles,
    'Missing rankings: '+(report.sections.missingData.join(', ')||'none'),
    ...(report.evidence.grade==='INSUFFICIENT'?['Data note: '+report.sections.caveats.join(' ')]:[])
  ].join('\n\n');
}
