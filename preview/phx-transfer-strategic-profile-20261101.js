// Evidence-only PHALANX strategic profile. No mutations or guessed battle roles.
const metrics=[['hero_equip','Hero Equipment'],['research_power','Research Power'],['hero_total','Hero Power'],['troop_power','Troop Power'],['master_power','Master Power'],['pet_power','Pet Power'],['gov_gear','Governor Gear'],['gov_charm','Governor Charms'],['mystic_trial','Mystic Trial']];
export function strategicProfile(rankings={}){
 const rows=metrics.map(([key,label])=>({key,label,rank:Number(rankings?.[key]?.kingdom_rank),date:rankings?.[key]?.captured_at||null})).filter(x=>Number.isInteger(x.rank)&&x.rank>0);
 const strengths=rows.filter(x=>x.rank<=10),developing=rows.filter(x=>x.rank>10&&x.rank<=20),gaps=rows.filter(x=>x.rank>20);
 const missing=metrics.filter(([key])=>!rows.some(x=>x.key===key)).map(([,label])=>label);
 return {rows,strengths,developing,gaps,missing};
}
export function mountStrategicProfile(target,rankings={}){
 const report=strategicProfile(rankings);
 const section=document.createElement('section');section.className='phx-scout-section phx-intel-profile';
 const heading=document.createElement('h4');heading.textContent='Strength Profile · Kingdom Rankings';section.append(heading);
 const explain=document.createElement('p');explain.className='phx-scout-muted';explain.textContent='Ranking scale 1–100; bar length indicates ranking position, not combat power. Dated snapshots may differ.';section.append(explain);
 for(const item of report.rows){
  const row=document.createElement('div');row.className='phx-intel-rank';row.dataset.band=item.rank<=10?'good':item.rank<=20?'developing':'gap';
  const top=document.createElement('div');top.className='phx-intel-rank-head';
  const name=document.createElement('strong');name.textContent=item.label;
  const value=document.createElement('b');value.textContent='Kingdom #'+item.rank;top.append(name,value);row.append(top);
  const track=document.createElement('div');track.className='phx-intel-track';
  const fill=document.createElement('div');fill.className='phx-intel-fill';fill.style.width=Math.max(1,101-Math.min(100,item.rank))+'%';track.append(fill);row.append(track);section.append(row);
 }
 const sub=document.createElement('h4');sub.textContent='Strategic Account Assessment';section.append(sub);
 const paragraph=(label,items,kind,explanation)=>{
  if(!items.length)return;
  const p=document.createElement('p'),strong=document.createElement('strong');strong.className='phx-intel-'+kind;strong.textContent=label+': ';p.append(strong,document.createTextNode(items.map(x=>x.label+' (#'+x.rank+')').join(', ')+'. '+explanation));section.append(p);
 };
 paragraph('Documented strengths',report.strengths,'good','These are strong relative kingdom placements, not verified combat outcomes.');
 paragraph('Development opportunities',report.developing,'developing','These placements trail the Top-10 categories but do not alone prove an account deficit.');
 paragraph('Relative ranking gaps',report.gaps,'gap','Investigate the cause before interpreting these as weaknesses in battle.');
 const conclusion=document.createElement('p');conclusion.textContent=report.strengths.length>=3?'Multiple categories rank in the Kingdom Top 10, indicating a broad development profile. ':'Available rankings do not establish a broad elite profile. ';
 conclusion.append(document.createTextNode('Rally Leader, Joiner, Garrison Holder and Fighter roles require battle reports, formations and buffs; no role is verified from rankings alone.'));section.append(conclusion);
 const missing=document.createElement('p');missing.className='phx-scout-muted';missing.textContent='Not assessed: '+(report.missing.join(', ')||'none of these categories')+'.';section.append(missing);
 target.append(section);return report;
}
