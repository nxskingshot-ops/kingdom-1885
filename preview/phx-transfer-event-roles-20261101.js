// Read-only, deterministic PYLON event-role evidence; no battle-role certification.
export function evaluateEventRoles(rankings={},player={},context={}){
 const entries=Object.entries(rankings||{}).map(([key,value])=>({key,rank:value?.kingdom_rank==null?NaN:Number(value.kingdom_rank)})).filter(x=>Number.isInteger(x.rank)&&x.rank>0);
 const top15=entries.filter(x=>x.rank<=15);
 const getRank=key=>entries.find(x=>x.key===key)?.rank??null;
 const roleSignals={rallyLeader:[getRank('hero_equip'),getRank('hero_total'),getRank('master_power')],rallyJoiner:[getRank('troop_power'),getRank('research_power')],garrisonHolder:[getRank('troop_power'),getRank('gov_gear'),getRank('gov_charm')],kvkFrontline:[getRank('troop_power'),getRank('research_power'),getRank('master_power')]};
 const leadership=top15.length>=2?'Multiple Top-15 category rankings: investigate kingdom leadership suitability':'Insufficient category evidence for leadership prioritization';
 const troopTier=context.verifiedTroopTier==null?null:Number(context.verifiedTroopTier);
 const joiner=Number.isInteger(troopTier)&&troopTier>=4&&context.troopEvidenceVerified===true?'Verified troop tier supports Rally Joiner suitability review':'Rally Joiner suitability unverified: independently confirmed troop tier missing';
 const roster=context.kingdomRosterVerified===true?'Kingdom comparison available':'Full kingdom roster comparison missing';
 const alliance=context.allianceRosterVerified===true?'Alliance comparison available':'Alliance comparison missing';
 return {top15Count:top15.length,leadership,joiner,roster,alliance,
 kvk:'KvK · kingdom-wide: '+leadership+'. '+roster+'. Rally/Garrison leadership requires buffs, formations and battle evidence.',
 events:'Swordland / Tri-Alliance · alliance-specific: '+alliance+'. Event roles require event roster and rules; KvK roles do not transfer automatically.',
 allocation:top15.length>=2?'Evaluate leadership before routine joiner assignment.':'Do not assign a primary battle role without combat evidence.'};
}
export function mountEventRoles(target,rankings={},player={},context={}){
 const data=evaluateEventRoles(rankings,player,context);
 const section=document.createElement('section');section.className='phx-scout-section phx-event-intelligence';
 const heading=document.createElement('h4');heading.textContent='PYLON IX · Strategic Role Intelligence';section.append(heading);
 for(const [title,detail] of [['Kingdom War Intelligence',data.kvk],['Alliance Event Intelligence',data.events],['Role Allocation',data.allocation],['Troop Evidence',data.joiner]]){
 const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=title+': ';p.append(strong,document.createTextNode(detail));section.append(p);
 }
 const roleHint=document.createElement('p');roleHint.className='phx-scout-muted';roleHint.textContent='Role projections: Rally Leader needs verified rally buffs and battle reports; Rally Joiner needs verified troop tier and formations; Garrison Holder needs defense buffs and garrison reports; KvK Frontline needs troop depth and sustained combat evidence. Rankings alone cannot certify these roles.';section.append(roleHint);
 const note=document.createElement('p');note.className='phx-scout-muted';note.textContent='Projected suitability only; no battle role is certified. Same ranking data and rule version produce the same output.';section.append(note);target.append(section);return data;
}
