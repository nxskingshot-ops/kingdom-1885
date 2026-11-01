// SEA WORLD V2 provisional weighted rating, read-only. Never claim kingdom-wide calibration.
export const SEA_WORLD_VERSION='V2-provisional';
export const BASELINE=Object.freeze({kingdom:1885,capturedAt:'2026-11-01T00:31:29.925Z',truePowerMax:134260900,scope:'top25_provisional'});
export const WEIGHTS=Object.freeze({mystic_trial:20,hero_total:10,hero_equip:10,gov_gear:10,gov_charm:10,master_power:15,pet_power:7.5,research_power:7.5,true_power:10});
export const THRESHOLDS=Object.freeze([{min:98,tier:'mega_whale',stars:'★★★★★+'},{min:90,tier:'whale',stars:'★★★★★'},{min:85,tier:'orca_elite',stars:'★★★★☆+'},{min:70,tier:'orca',stars:'★★★★☆'},{min:55,tier:'strong',stars:'★★★☆☆'},{min:40,tier:'solid',stars:'★★☆☆☆'},{min:0,tier:'developing',stars:'★☆☆☆☆'}]);
export function classify(score){if(!Number.isFinite(score)||score<0||score>100)throw Error('invalid score');return THRESHOLDS.find(t=>score>=t.min);}
export function evaluate({governorId,ranks,truePower},baseline=BASELINE){
 if(!ranks||typeof ranks!=='object')throw Error('ranks required');
 if(!Number.isFinite(baseline.truePowerMax)||baseline.truePowerMax<=0)throw Error('invalid baseline');
 let lower=0,unknownWeight=0;const missing=[];
 for(const [key,weight] of Object.entries(WEIGHTS)){
  if(key==='true_power'){if(truePower==null){unknownWeight+=weight;missing.push(key);continue;}if(!Number.isFinite(truePower)||truePower<0)throw Error('invalid truePower');lower+=weight*Math.min(truePower/baseline.truePowerMax,1);continue;}
  const rank=ranks[key];if(rank==null){unknownWeight+=weight;missing.push(key);continue;}if(!Number.isInteger(rank)||rank<1||rank>100)throw Error('invalid rank '+key);lower+=weight*(101-rank)/100;
 }
 const upper=Math.min(100,lower+unknownWeight),lowTier=classify(lower),highTier=classify(upper);
 return {governorId,scoreLower:+lower.toFixed(3),scoreUpper:+upper.toFixed(3),coveragePct:+(100-unknownWeight).toFixed(1),missing,lowerTier:lowTier.tier,upperTier:highTier.tier,stars:lowTier.tier===highTier.tier?lowTier.stars:null,confidence:lowTier.tier===highTier.tier?'category_stable':'category_uncertain',baseline:baseline.capturedAt};
}
export function seaWorldVerdict(player={},reference=null){
 const id=String(player.governorId??player.governor_id??player.id??'');
 if(id==='291246578')return {status:'INACTIVE',stars:null,tier:null,detail:'Inactive reference account; excluded from active comparisons.'};
 if(!reference||reference.scope!=='top25_provisional')return {status:'REFERENCE_PENDING',stars:null,tier:null,detail:'No verified input for provisional SEA WORLD rating.'};
 const result=evaluate({governorId:id,ranks:reference.ranks,truePower:reference.truePower},BASELINE);
 return {status:result.stars?'PROVISIONAL_STABLE':'PROVISIONAL_RANGE',stars:result.stars,tier:result.lowerTier,detail:'Top-25 provisional reference only · score '+result.scoreLower+'–'+result.scoreUpper+' / 100 · coverage '+result.coveragePct+'% · '+(result.stars?'stable provisional tier':'tier uncertain; no fixed stars'),...result};
}
