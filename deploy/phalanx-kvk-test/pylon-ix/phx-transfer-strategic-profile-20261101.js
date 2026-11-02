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
 const pet=report.rows.find(x=>x.key==='pet_power');if(pet&&pet.rank>10){const note=document.createElement('p');note.className='phx-scout-muted';note.textContent='Pet Power #'+pet.rank+': resource saving for KvK Prep is possible, but unverified. This rank alone is not evidence of poor battle readiness.';section.append(note);}

 const paragraph=(label,items,kind,explanation)=>{
  if(!items.length)return;
  const p=document.createElement('p'),strong=document.createElement('strong');strong.className='phx-intel-'+kind;strong.textContent=label+': ';p.append(strong,document.createTextNode(items.map(x=>x.label+' (#'+x.rank+')').join(', ')+'. '+explanation));section.append(p);
 };



 const conclusion=document.createElement('p');conclusion.textContent='Ranking positions are relative kingdom placements, not verified combat results.';
 section.append(conclusion);
 const missing=document.createElement('p');missing.className='phx-scout-muted';missing.textContent='Not assessed: '+(report.missing.join(', ')||'none of these categories')+'.';section.append(missing);
 const details=document.createElement('details');details.className='phx-intel-evidence';
 const summary=document.createElement('summary');summary.textContent='ⓘ Ranking Evidence & Timestamps';details.append(summary);
 const table=document.createElement('table');table.className='phx-intel-evidence-table';
 const head=document.createElement('tr');for(const label of ['Category','Kingdom Rank','Source','Captured']){const th=document.createElement('th');th.textContent=label;head.append(th);}table.append(head);
 for(const [key,label] of metrics){const raw=rankings?.[key];const tr=document.createElement('tr');const rank=report.rows.find(x=>x.key===key);const cells=[label,rank?'#'+rank.rank:'Not available',raw?.source||'Not specified',raw?.captured_at||'Not specified'];for(const value of cells){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}table.append(tr);}
 const tableScroll=document.createElement('div');tableScroll.style.cssText='max-width:100%;overflow-x:auto;overscroll-behavior-x:contain';tableScroll.append(table);details.append(tableScroll);const note=document.createElement('p');note.className='phx-scout-muted';note.textContent='Original ranking evidence; capture times may differ. Rankings do not verify battle outcomes.';details.append(note);section.append(details);
 target.append(section);return report;
}
