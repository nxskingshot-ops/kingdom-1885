import { placeInAlliance, compareTopPeers } from './phx-transfer-alliance-placement-20261101.js?v=phx-transfer-evidence-20261107';
import { assessAccount } from './phx-transfer-account-assessment-20261101.js?v=phx-transfer-evidence-20261107';
import { seaWorldVerdict, THRESHOLDS, WEIGHTS } from './phx-sea-world-v2-gate-20261101.js';
import { candidateFromLookup, duplicateLookupFilter } from './transfer-id-candidate-20261030.js';
import { forecast as phxTransferForecast, transferStatus as phxTransferStatus } from './phx-transfer-forecast-20261101.js';
import { mountRuleDraftEditor } from './phx-transfer-rules-editor-20261101.js';
import { formatPlayerNumber, formatPlayerUtc, formatPlayerSection, playerLookupError, rankingLabels, canonicalRankingName, playerRankingMap, rankingSourceText, playerSummaryMetrics, compactPower } from './transfer-id-display-20261030.js';
const SUPABASE_URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(SUPABASE_URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>x==null?'–':Number(x).toLocaleString('en-US',{maximumFractionDigits:1});
let players=[],chosen=new Set(),active=null,canEdit=false;
// The event-specific cap and metric have not been verified. Never classify invitations from account power.
function invitationPreview(p){return 'Verify event rules';}
function showLogin(message=''){const badge=document.getElementById('phxIdentity');if(badge){badge.classList.remove('is-online');const n=document.getElementById('phxIdentityName'),m=document.getElementById('phxIdentityMeta');if(n)n.textContent='Session not verified';if(m)m.textContent='Please sign in';const online=document.getElementById('phxIdentityOnline');if(online)online.textContent='OFFLINE';}canEdit=false;$('login').hidden=false;$('private').hidden=true;$('message').textContent=message||'Please sign in with your approved NXS account.';$('message').setAttribute('role','status');}
function chosenPlayers(){return [...chosen].map(id=>players.find(p=>p.candidate_id===id)).filter(Boolean);}
function filtered(){const q=$('search').value.trim().toLowerCase();const list=players.filter(p=>[p.player_name,p.kingdom,p.alliance,p.contact_status,p.metadata?.role].some(v=>String(v??'').toLowerCase().includes(q)));const s=$('sort').value;return list.sort((a,b)=>s==='name'?a.player_name.localeCompare(b.player_name):s==='power'?Number(b.power_m||0)-Number(a.power_m||0):Date.parse(b.updated_at)-Date.parse(a.updated_at));}
function render(){
$('total').textContent=players.length;
$('contacted').textContent=players.filter(p=>['Contacted','Interested','Negotiating','Confirmed'].includes(p.contact_status)).length;
$('reviews').textContent=players.filter(p=>!p.contact_status||p.contact_status==='Needs Review').length;
$('kingdoms').textContent=new Set(players.map(p=>p.kingdom).filter(Boolean)).size;
const shown=filtered();$('count').textContent=shown.length+' of '+players.length+' saved candidates';$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';
$('rows').innerHTML=shown.map(p=>'<tr data-id="'+esc(p.candidate_id)+'" class="'+(active===p.candidate_id?'selected':'')+'"><td><input type="checkbox" data-check="'+esc(p.candidate_id)+'" '+(chosen.has(p.candidate_id)?'checked':'')+'></td><td><button type="button" class="scouting-name-button" data-dossier="'+esc(p.candidate_id)+'" aria-label="Open dossier for '+esc(p.player_name)+'">'+esc(p.player_name)+'</button></td><td>'+esc(p.kingdom||'–')+'</td><td>'+esc(p.alliance||'–')+'</td><td>'+esc(p.metadata?.role||'–')+'</td><td>'+esc(p.castle_level||'–')+'</td><td>'+fmt(p.power_m)+(p.power_m==null?'':'M')+'</td><td>'+esc(p.metadata?.fit==null?'–':p.metadata.fit+'%')+'</td><td>'+esc(invitationPreview(p))+'</td><td>'+esc(p.transfer_eligibility||'Unknown')+'</td><td>'+esc(p.contact_status||'–')+'</td></tr>').join('')||'<tr><td colspan="11" class="empty">'+(players.length?'No candidates match your current search. Clear the filter to see all saved candidates.':'No candidates saved yet. Use Find a Player to start your shortlist.')+'</td></tr>';
$('rows').querySelectorAll('tr[data-id]').forEach(row=>row.onclick=()=>{active=row.dataset.id;render()});
$('rows').querySelectorAll('button[data-dossier]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();active=btn.dataset.dossier;openDossier()});
$('rows').querySelectorAll('input[data-check]').forEach(box=>{box.onclick=e=>e.stopPropagation();box.onchange=()=>{if(box.checked){if(chosen.size>=3){box.checked=false;$('count').textContent='Select up to 3 candidates';return;}chosen.add(box.dataset.check)}else chosen.delete(box.dataset.check);$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';}});
const p=players.find(x=>x.candidate_id===active);$('profileTitle').textContent=p?p.player_name:'Candidate profile';$('editCandidate').hidden=!canEdit||!p;$('openDossier').hidden=!p;
$('profile').replaceChildren();if(p){renderHeadlineMetrics($('profile'),evidenceFor(p),p);const notes=document.createElement('p');notes.textContent=p.notes||'No notes recorded.';$('profile').append(notes);}
$('needs').innerHTML=['Rally Lead','Fighter','Joiner','R4 / R5 Potential'].map(role=>'<div><b>'+esc(role)+'</b><strong>'+players.filter(p=>p.metadata?.role===role).length+' recorded</strong></div>').join('');
const kds=new Map();for(const p of players){const kd=p.kingdom||'Unspecified';kds.set(kd,(kds.get(kd)||0)+1);}
$('kingdomNotes').innerHTML=[...kds].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([kd,n])=>'<div><b>Kingdom #'+esc(kd)+'</b><span>'+n+' candidates</span></div>').join('')||'<p class="empty">No saved kingdom records yet.</p>';
 renderExternalIntel();
}
async function load(){const {data,error}=await db.from('transfer_candidates').select('*').order('updated_at',{ascending:false}).limit(1000);
if(error){$('count').textContent='Access or database error: '+error.message;return false;}players=data||[];chosen=new Set([...chosen].filter(id=>players.some(p=>p.candidate_id===id)));if(!players.some(p=>p.candidate_id===active))active=players[0]?.candidate_id||null;render();if(dossierOpen)renderDossier();return true;}
async function check(){try{
const {data:{user},error}=await db.auth.getUser();
if(error){showLogin('Session verification failed: '+error.message+'. Please sign in again.');return;}
if(!user){showLogin('No active session. Please sign in with your approved NXS account.');return;}
const {data:membership,error:merror}=await db.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
if(merror){showLogin('Signed in, but membership verification failed: '+merror.message);return;}
if(!membership){showLogin('Signed in, but no approved NXS membership was found for this account.');return;}
if(!membership.active){showLogin('Signed in, but this NXS membership is inactive.');return;}
if(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now()){showLogin('Signed in, but this NXS membership has expired.');return;}
if(!['member','r4','r5','admin'].includes(membership.role)){showLogin('Signed in, but this account role is not approved for Transfer Scouting.');return;}
const badge=document.getElementById('phxIdentity');if(badge){const display=user.id==='d4da222e-8aac-4950-a6df-46c88972458c'?'FaQu':(user.email||'Signed-in account');const n=document.getElementById('phxIdentityName'),m=document.getElementById('phxIdentityMeta');badge.classList.add('is-online');if(n)n.textContent=display;if(m)m.textContent=membership.role.toUpperCase()+' · ACTIVE';const online=document.getElementById('phxIdentityOnline');if(online)online.textContent='ONLINE';}
canEdit=['r4','r5','admin'].includes(membership.role);$('newCandidate').hidden=!canEdit;$('login').hidden=true;$('private').hidden=false;await load();
}catch(e){showLogin('Unable to verify access: '+(e?.message||'Unknown error'));}}
$('authForm').onsubmit=async e=>{
e.preventDefault();const submit=$('authForm').querySelector('button[type="submit"]');if(submit.disabled)return;
submit.disabled=true;$('message').textContent='Signing in…';
try{const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});$('password').value='';
if(error){showLogin('Sign-in failed: '+error.message);return;}
await check();
}catch(error){showLogin('Sign-in request failed: '+(error?.message||'Network error'));}
finally{submit.disabled=false;}
};
$('refresh').onclick=check;$('search').oninput=render;$('sort').onchange=render;
$('compare').onclick=()=>{const a=chosenPlayers();if(a.length<2){$('comparison').textContent='Select two or three candidates.';return;}
const rows=[['Kingdom',p=>p.kingdom],['Alliance',p=>p.alliance],['Castle',p=>p.castle_level],['Power',p=>p.power_m==null?'–':fmt(p.power_m)+'M'],['Status',p=>p.contact_status],['Invitation · event verification',p=>invitationPreview(p)],['Transfer',p=>p.transfer_eligibility]];
$('comparison').innerHTML='<h3>Selected candidates</h3><div class="scroll"><table><thead><tr><th>Metric</th>'+a.map(p=>'<th>'+esc(p.player_name)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(([label,fn])=>'<tr><td>'+label+'</td>'+a.map(p=>'<td>'+esc(fn(p)||'–')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';};
$('csv').onclick=()=>{const columns=['candidate_id','player_name','kingdom','alliance','power_m','castle_level','contact_status','invitation_preview','transfer_eligibility','recruiter','notes','updated_at'];const csv=[columns.join(','),...filtered().map(p=>columns.map(k=>'"'+String(k==='invitation_preview'?invitationPreview(p):p[k]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nxs-real-transfer-records.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);};

let editingId=null;
function openEditor(p){
 if(!canEdit)return;
 editingId=p?.candidate_id||null;
 $('candidateForm').reset();$('editError').textContent='';
 $('editTitle').textContent=p?'Edit '+p.player_name:'Add candidate';
 for(const name of ['player_name','kingdom','alliance','power_m','castle_level','recruiter','contact_status','transfer_eligibility','notes']){
  const input=$('candidateForm').elements.namedItem(name);if(p&&p[name]!=null)input.value=p[name];
 }
 $('candidateForm').elements.namedItem('role').value=p?.metadata?.role||'';
 $('candidateForm').elements.namedItem('fit').value=p?.metadata?.fit??'';
 for(const key of externalTrials){$('candidateForm').elements.namedItem('trial_'+key).value=p?.metadata?.mystic_trials?.[key]??'';}
 $('candidateForm').elements.namedItem('trial_snapshot').value=p?.metadata?.mystic_trial_snapshot??'';
 $('candidateForm').elements.namedItem('trial_source').value=p?.metadata?.mystic_trial_source??'';
 $('modal').hidden=false;
}
$('newCandidate').onclick=()=>{showWorkspace('phxIdPanel');$('phxGovernorId').focus();};
$('editCandidate').onclick=()=>openEditor(players.find(p=>p.candidate_id===active));
// Protected removal: explicit confirmation, R4/R5/admin UI gate, exact record ID and verified response.
const removeCandidateButton=document.createElement('button');
removeCandidateButton.type='button';removeCandidateButton.textContent='Remove candidate';
removeCandidateButton.className='secondary phx-remove-candidate';removeCandidateButton.hidden=true;
$('editCandidate').insertAdjacentElement('afterend',removeCandidateButton);
removeCandidateButton.onclick=async()=>{
 const candidate=players.find(p=>p.candidate_id===active);
 if(!canEdit||!candidate||removeCandidateButton.disabled)return;
 const id=candidate.candidate_id;
 if(!window.confirm('Kandidat '+candidate.player_name+' aus der gespeicherten Liste entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden.'))return;
 removeCandidateButton.disabled=true;
 try{
  const {data,error}=await db.from('transfer_candidates').delete().eq('candidate_id',id).select('candidate_id');
  if(error)throw error;
  if(!Array.isArray(data)||data.length!==1||data[0].candidate_id!==id)throw Error('Löschung nicht bestätigt.');
  chosen.delete(id);if(active===id)active=null;
  if(dossierOpen)closeDossier();
  await load();
 }catch(error){window.alert('Kandidat konnte nicht entfernt werden: '+error.message);}
 finally{removeCandidateButton.disabled=false;}
};
const originalRenderCandidate=render;
render=function(){originalRenderCandidate();removeCandidateButton.hidden=!canEdit||!players.some(p=>p.candidate_id===active);};


function closeEditor(){$('modal').hidden=true}
$('cancelEdit').onclick=closeEditor;$('closeEdit').onclick=closeEditor;

$('candidateForm').onsubmit=async e=>{
e.preventDefault();if(!canEdit)return;
const v=Object.fromEntries(new FormData(e.currentTarget).entries());
if(!v.player_name.trim()){$('editError').textContent='Player name required';return;}
const old=players.find(x=>x.candidate_id===editingId);
const data={player_name:v.player_name.trim(),kingdom:v.kingdom||null,alliance:v.alliance||null,power_m:v.power_m?Number(v.power_m):null,castle_level:v.castle_level||null,recruiter:v.recruiter||null,transfer_eligibility:v.transfer_eligibility||null,contact_status:v.contact_status,notes:v.notes||null,metadata:{...(old?.metadata||{}),role:v.role||null,fit:v.fit?Number(v.fit):null,mystic_trials:Object.fromEntries(externalTrials.map(key=>[key,v['trial_'+key]?.trim()||null])),mystic_trial_snapshot:v.trial_snapshot||null,mystic_trial_source:v.trial_source?.trim()||null},updated_at:new Date().toISOString()};
await saveCandidate(data);
};

async function saveCandidate(data){
$('saveCandidate').disabled=true;$('editError').textContent='Saving…';
try{
const q=editingId?await db.from('transfer_candidates').update(data).eq('candidate_id',editingId).select('candidate_id').maybeSingle():await db.from('transfer_candidates').insert({...data,candidate_id:'NXS-'+crypto.randomUUID()}).select('candidate_id').maybeSingle();
if(q.error)throw q.error;if(!q.data)throw Error('Save not authorized.');
active=q.data.candidate_id;closeEditor();await load();
}catch(err){$('editError').textContent='Save failed: '+err.message}
finally{$('saveCandidate').disabled=false;}
}

/* Optional external scouting evidence and protected read-only internal comparison. */
const externalTrials=['coliseum','forest','crystal','knowledge','molten','radiant'];
const externalLabels={coliseum:'Heroes & Hero Gear',forest:'Pets',crystal:'Governor Charms',knowledge:'Research',molten:'Governor Gear',radiant:'Mixed · Radiant Spire'};
let internalPlayers=null,internalSnapshot='',internalLoading=false,internalHistorical=false;
const stageIndex=x=>{
 if(typeof x!=='string'||!/^\d{1,3}-\d{1,2}$/.test(x))return null;
 const [chapter,step]=x.split('-').map(Number);
 return chapter>=1&&step>=1&&step<=10?(chapter-1)*10+step:null;
};
const normal=x=>String(x??'').normalize('NFKC').trim().toLowerCase();
const currentEvidence=new Map(),evidencePending=new Set(),evidenceErrors=new Map();
const boardLabels=rankingLabels;
const evidenceKey=p=>String(p?.metadata?.governor_id||p?.metadata?.player_id||'');
const evidenceFor=p=>currentEvidence.get(evidenceKey(p))||p?.metadata?.external_lookup;
async function readPlayer(id){
 if(!/^[1-9][0-9]{0,15}$/.test(id))throw Error('Enter a valid Kingshot Player ID.');
 const {data:{session},error}=await db.auth.getSession();if(error||!session?.access_token)throw Error('Please sign in again.');
 const response=await fetch(SUPABASE_URL+'/functions/v1/phalanx-transfer-id-snapshot-fallback-stage-20261031?governorId='+id,{headers:{apikey:KEY,Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(125000)});
 if(!response.ok)throw Error(playerLookupError(response.status));const payload=await response.json();
 if(payload.ok!==true||String(payload.governorId)!==id||!Number.isSafeInteger(payload.player?.kingdom)||payload.player.kingdom<1)throw Error('Player identity could not be confirmed.');
 return payload;
}
async function loadCandidateEvidence(p,force=false){
 const id=evidenceKey(p);if(!id||evidencePending.has(id)||(!force&&(currentEvidence.has(id)||evidenceErrors.has(id))))return;
 evidencePending.add(id);evidenceErrors.delete(id);renderDossier();renderExternalIntel();
 try{const payload=await readPlayer(id);if(String(payload.player?.kingdom)!==String(p.kingdom))throw Error('Player kingdom has changed. Review the current profile in Find a Player.');currentEvidence.set(id,{...candidateFromLookup(payload,id).metadata.external_lookup,player:payload.player});}
 catch(e){evidenceErrors.set(id,e.message||'Current evidence unavailable.');}
 finally{evidencePending.delete(id);renderDossier();renderExternalIntel();}
}
const rankingMap=playerRankingMap;
function refreshInternalFilters(){
 const select=$('internalAlliance'),previous=select.value;select.replaceChildren();
 for(const [value,label] of [['','All alliances'],...[...new Set((internalPlayers||[]).map(p=>p.alliance_tag||'No alliance'))].sort((a,b)=>a.localeCompare(b)).map(x=>[x,x])]){
  const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);
 }
 if([...select.options].some(o=>o.value===previous))select.value=previous;
}
function renderInternalChoices(selected=$('internalGovernor').value){
 const select=$('internalGovernor'),query=normal($('internalSearch').value),alliance=$('internalAlliance').value;
 const ownIds=comparisonPanel.parentNode===lookupIntel?.compare?lookupIntel.ids:[];
 const available=(internalPlayers||[]).filter(p=>![p.governor_id,p.uid].some(id=>ownIds.includes(String(id))));
 const matches=available.filter(p=>(!alliance||(p.alliance_tag||'No alliance')===alliance)&&(!query||[p.player_name,p.governor_id].some(v=>normal(v).includes(query))));
 const chosen=available.find(p=>String(p.uid||p.player_name)===selected),pinned=chosen&&!matches.includes(chosen);
 select.replaceChildren();
 const append=p=>{const option=document.createElement('option');option.value=String(p.uid||p.player_name);option.textContent=p.player_name+' · '+(p.alliance_tag||'—');select.append(option);};
 if(pinned)append(chosen);
 for(const p of matches)append(p);
 if(chosen)select.value=selected;
 select.disabled=!select.options.length;
 $('internalFilterStatus').textContent=matches.length+' matches / '+(internalPlayers||[]).length+' available'
  +(internalHistorical?' · Historical alliance rosters · Use ID for other players':'')
  +(pinned?' · Selected player kept outside filter':'');
}
$('internalSearch').oninput=()=>renderInternalChoices();
$('internalAlliance').onchange=()=>renderInternalChoices();
function comparisonBrief(external,inside){
 const keys=['personal_power','true_power','troop_power','master_power','pet_power','hero_total','hero_equip',
  'gov_gear','gov_charm','research_power','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire'];
 const number=x=>['number','string'].includes(typeof x)&&String(x).trim()!==''&&Number.isFinite(Number(x))&&Number(x)>=0?Number(x):null;
 const pairs=keys.map(key=>({key,a:number(external[key]?.value),b:number(inside[key]?.value)}))
  .filter(row=>row.a!==null&&row.b!==null);
 const describe=rows=>rows.slice(0,2).map(row=>(boardLabels[row.key]||'True Power')
  +(row.b>0?' ('+((row.a-row.b)/row.b*100).toLocaleString('en-US',{signDisplay:'always',maximumFractionDigits:1})+'%)':'')).join(' · ');
 const focus=direction=>pairs.filter(row=>row.key!=='personal_power'&&direction*(row.a-row.b)>0)
  .sort((a,b)=>Math.abs(b.a-b.b)/Math.max(1,b.a,b.b)-Math.abs(a.a-a.b)/Math.max(1,a.a,a.b));
 const power=pairs.find(row=>row.key==='personal_power');
 const higher=focus(1),lower=focus(-1);
 const stamps=new Set(pairs.flatMap(({key})=>[external[key].captured_at,inside[key].captured_at]).map(formatPlayerUtc));
 return {
  summary: pairs.length
   ? [power&&describe([power]),higher.length&&'Higher '+describe(higher),lower.length&&'Lower '+describe(lower)].filter(Boolean).join(' · ')
    ||'Shared values are equal.'
   : 'No comparable values are available.',
  coverage: pairs.length+' of '+keys.length+' metrics compared'
   +(pairs.length&&(stamps.size>1||stamps.has('Not available'))?' · Capture times differ or are unknown':'')
 };
}
function lookupComparisonRanks(payload,ranks=rankingMap(payload.ranks?.values),metrics){
 const p=payload.player;
 const [total,truePower]=metrics||playerSummaryMetrics(payload.ranks?.values,{
  power:p.power??p.totalPower??p.total_power,captured_at:payload.source?.cachedAt
 });
 const entries={...ranks};
 if(total.value!==null)entries.personal_power={value:total.value,captured_at:total.captured_at,kingdom_rank:total.rank,
  source:total.captured_at===ranks.personal_power?.captured_at?ranks.personal_power?.source:undefined};
 if(truePower.calculated)entries.true_power={value:truePower.value,captured_at:truePower.captured_at,source:'calculated'};
 return entries;
}
function renderExternalIntel(){
 const box=$('externalIntelResult');
 const lookup=comparisonPanel.closest('#phxIdResult')?lookupIntel:null;
 const candidate=lookup?{player_name:lookup.name,kingdom:lookup.kingdom}:players.find(p=>p.candidate_id===active);
 if(!candidate){box.textContent='Select a candidate from your board first.';return;}
 if(internalLoading){box.textContent='Loading protected Kingdom #1885 data…';return;}
 if(!internalPlayers){box.textContent='Selected: '+candidate.player_name+'. Load the latest available #1885 rankings or enter an internal Kingshot Player ID.';return;}
 const internal=internalPlayers.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value);
 if(!internal){box.textContent='Select an internal player to compare.';return;}
 const evidence=lookup?{source_cached_at:lookup.stamp}:evidenceFor(candidate);
 const external=lookup?.ranks||rankingMap(evidence?.ranks?.values),inside=internal.rankings||{};
 const header=document.createElement('strong');header.textContent=candidate.player_name+' (KD '+(candidate.kingdom||'?')+') ↔ '+internal.player_name+' (#1885)';box.replaceChildren(header);
 const note=text=>{const p=document.createElement('p');p.textContent=text;box.append(p);};
 const brief=comparisonBrief(external,inside);
 box.append(element('p',brief.summary,'comparison-brief'),element('p',brief.coverage,'phx-decision-source'));
 const graphic=element('div',null,'phx-comparison-bars');
 for(const [key,label] of [['personal_power','Total Power'],['true_power','True Power'],['master_power','Master Power'],['pet_power','Pet Power'],['hero_total','Hero Power']]){
  const first=external[key]?.value, second=inside[key]?.value;
  if([first,second].some(value=>value==null||String(value).trim()===''||!Number.isFinite(Number(value))||Number(value)<0))continue;
  const max=Math.max(Number(first),Number(second),1);
  const group=element('div');
  group.append(element('strong',label));
  for(const [name,value] of [[candidate.player_name,first],[internal.player_name,second]]){
   const meter=element('meter');meter.min=0;meter.max=max;meter.value=Number(value);
   meter.setAttribute('aria-label',name+' '+label+' '+compactPower(value));
   group.append(element('small',name+' · '+compactPower(value)),meter);
  }
  graphic.append(group);
 }
 if(graphic.childElementCount)box.append(graphic);
 const sourceDetails=document.createElement('details'),sourceSummary=document.createElement('summary'),sourceText=document.createElement('p');sourceDetails.className='comparison-method';sourceSummary.textContent='Sources, coverage & interpretation';sourceText.textContent='Candidate capture '+formatPlayerUtc(evidence?.source_cached_at)+'; #1885 capture '+(internal.captured_at||formatPlayerUtc(internalSnapshot))+'. Request time is not capture time. Each rank belongs to its own kingdom and is not directly comparable across kingdoms. Missing Top-100 entries are unknown, never zero or rank 101. Scores are not verified trial stages or battle predictions. '+(internalHistorical?'The player picker uses historical alliance rosters. Use an ID for other #1885 players.':'The player list covers available Top-100 boards, not a complete census.');sourceDetails.append(sourceSummary,sourceText);box.append(sourceDetails);
 if(evidencePending.has(evidenceKey(candidate)))note('Loading current candidate rankings…');
 if(evidenceErrors.has(evidenceKey(candidate)))note('Current candidate refresh failed: '+evidenceErrors.get(evidenceKey(candidate))+'. Saved evidence remains visible.');
 if(!external.personal_power&&candidate.power_m!=null)note('Saved candidate Total Power: '+fmt(candidate.power_m)+'M (stored profile; current ranking value unavailable).');
 const rows=[];for(const key of new Set([...Object.keys(boardLabels),...Object.keys(external),...Object.keys(inside)])){
  const a=external[key],b=inside[key];
  rows.push([boardLabels[key]||(key==='true_power'?'True Power':key),a,b]);
 }
 const wrap=document.createElement('div');wrap.className='scroll';const table=document.createElement('table');
 const thead=document.createElement('thead'),tr=document.createElement('tr');for(const label of ['Metric',candidate.player_name,internal.player_name]){const th=document.createElement('th');th.textContent=label;tr.append(th);}thead.append(tr);table.append(thead);
 const body=document.createElement('tbody');
 table.className='ranking-comparison';
 for(const [label,a,b] of rows){
  const tr=document.createElement('tr'),metric=document.createElement('th');metric.scope='row';metric.textContent=label;tr.append(metric);
  for(const [entry,name,missing] of [[a,candidate.player_name,'Not available from source'],[b,internal.player_name,'Not listed in available board']]){
   const td=document.createElement('td');td.dataset.player=name;renderRankingEvidence(td,entry,missing,true);tr.append(td);
  }
  body.append(tr);
 }
 table.append(body);wrap.append(table);box.append(decisionDetails('Full ranking comparison',wrap));

}
async function loadHistoricalComparison(){
 const snapshots=await Promise.allSettled(destinationAlliances.map(loadAllianceSnapshot));
 const records=new Map();
 for(let i=0;i<snapshots.length;i++){
  const snapshot=snapshots[i];
  if(snapshot.status!=='fulfilled')continue;
  const {date,rows}=snapshot.value;
  for(const row of rows){
   const id=String(row.player_id??'');
   if(!/^[1-9][0-9]{0,15}$/.test(id))continue;
   const record=records.get(id);
   if(record&&record.captured_at>=date)continue;
   records.set(id,{
    uid:id,governor_id:id,player_name:row.player_name||'Player ID '+id,
    alliance_tag:destinationAlliances[i],captured_at:date,
    rankings:{personal_power:{value:row.power,source:'saved_snapshot'}}
   });
  }
 }
 return [...records.values()];
}
$('loadInternal').onclick=async()=>{
 if(internalLoading)return;
 internalLoading=true;$('loadInternal').disabled=true;renderExternalIntel();
 try{
  const {data:{session},error}=await db.auth.getSession();
  if(error||!session?.access_token)throw Error('Sign in with your approved NEXUS account first.');
  let data;
  try{
   const response=await fetch(SUPABASE_URL+'/functions/v1/phalanx-transfer-intelligence-stage-20261031',{method:'GET',
    headers:{apikey:KEY,Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(12000)});
   if(response.ok)data=await response.json();
  }catch(_error){/* Staging origins can lack CORS for the ranked list. The protected roster is a separate source. */}
  const historical=!Array.isArray(data?.observations)||!data.observations.length;
  const records=historical?await loadHistoricalComparison():data.observations;
  if(!records.length)throw Error('No verified #1885 records available. Compare by Kingshot Player ID.');
  internalHistorical=historical;
  internalPlayers=records;
  internalSnapshot=internalHistorical?'':data.snapshot_date||'';
  $('loadInternal').textContent='Refresh #1885 players ('+internalPlayers.length+')';
  const previous=$('internalGovernor').value;
  refreshInternalFilters();
  const context=comparisonPanel.closest('#phxIdResult')?lookupIntel:null;
  const selected=context?(internalPlayers.find(p=>String(p.governor_id||p.uid)===context.manualPeer)
   ||strongestInternalPlayer(context.picker.value,context.ids))
   :internalPlayers.find(p=>String(p.uid||p.player_name)===previous)||internalPlayers.find(p=>p.player_name==='FaQu')||internalPlayers[0];
  renderInternalChoices(selected?String(selected.uid||selected.player_name):'');
  if(!context)loadCandidateEvidence(players.find(p=>p.candidate_id===active));
  internalLoading=false;
  lookupIntel?.refresh();renderExternalIntel();
  if(internalHistorical&&selected?.governor_id)void refreshInternalPlayer();
 }catch(error){
  const box=$('externalIntelResult'),message='Comparison list unavailable: '+(error?.message||'Unknown error');
  internalLoading=false;
  if(internalPlayers){renderExternalIntel();box.append(element('p',message));}
  else box.textContent=message;
 }finally{
  $('loadInternal').disabled=false;
 }
};
async function refreshInternalPlayer(){
 renderExternalIntel();const selected=internalPlayers?.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value);
 if(!selected?.governor_id)return;
 const stillSelected=()=>internalPlayers?.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value)===selected;
 try{const payload=await readPlayer(String(selected.governor_id));if(payload.player?.kingdom!==1885)throw Error('Player kingdom has changed.');
  const refreshed=lookupComparisonRanks(payload);
  // Retain the dated roster value if the current profile has no Total Power.
  if(refreshed.personal_power?.value==null&&selected.rankings?.personal_power?.value!=null){
   refreshed.personal_power=selected.rankings.personal_power;
  }
  selected.rankings=refreshed;
  selected.captured_at=formatPlayerUtc(payload.source?.cachedAt);selected.player_name=payload.player.name;
 if(stillSelected())renderExternalIntel();
 }catch(e){if(stillSelected()){renderExternalIntel();const note=document.createElement('p');note.textContent='Current player refresh failed: '+e.message+'. Available ranking snapshot remains visible.';$('externalIntelResult').append(note);}}
}
$('internalGovernor').onchange=()=>{
 const selected=internalPlayers?.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value);
 if(lookupIntel&&comparisonPanel.parentNode===lookupIntel.compare)lookupIntel.manualPeer=String(selected?.governor_id||selected?.uid||'');
 void refreshInternalPlayer();
};
$('internalIdForm').onsubmit=async e=>{
 e.preventDefault();const button=$('loadInternalId');if(button.disabled)return;button.disabled=true;
 try{const id=$('internalPlayerId').value.trim(),payload=await readPlayer(id);if($('internalPlayerId').value.trim()!==id)throw Error('Kingshot Player ID changed. Load the player again.');if(payload.player?.kingdom!==1885)throw Error('This player is not in Kingdom #1885.');
 if(comparisonPanel.parentNode===lookupIntel?.compare&&lookupIntel.ids.some(own=>own===id||own===String(payload.uid)))throw Error('Choose a different player for comparison.');
 const record={uid:String(payload.uid||id),governor_id:id,player_name:payload.player.name,alliance_tag:payload.player.alliance,rankings:lookupComparisonRanks(payload)};
 internalPlayers=internalPlayers||[];const index=internalPlayers.findIndex(p=>p.uid===record.uid||p.governor_id===id);if(index>=0)internalPlayers[index]=record;else internalPlayers.push(record);
 refreshInternalFilters();renderInternalChoices(record.uid);
 if(lookupIntel&&comparisonPanel.parentNode===lookupIntel.compare)lookupIntel.manualPeer=id;
 record.captured_at=formatPlayerUtc(payload.source?.cachedAt);renderExternalIntel();loadCandidateEvidence(players.find(p=>p.candidate_id===active));
 }catch(error){$('externalIntelResult').textContent='Player comparison unavailable: '+error.message;}finally{button.disabled=false;}
};


/* Read-only candidate dossier navigation; existing candidate data is never modified. */
let dossierOpen=false,dossierTab='identity';
const show=v=>v===null||v===undefined||v===''?'Not recorded':String(v);
function dossierGrid(title,entries){
 const wrapper=document.createElement('section'),heading=document.createElement('h3'),grid=document.createElement('div'),missing=[];
 heading.textContent=title;grid.className='record-list';wrapper.append(heading,grid);
 for(const [label,v] of entries){if(v==null||v===''||v==='Not recorded'||v==='Unknown'){missing.push(label);continue;}
  const cell=document.createElement('div'),caption=document.createElement('span'),value=document.createElement('b');cell.className='record-row';caption.textContent=label;value.textContent=show(v);cell.append(caption,value);grid.append(cell);
 }
 if(missing.length){const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');details.className='missing-record';summary.textContent='Not recorded ('+missing.length+')';text.textContent=missing.join(', ');details.append(summary,text);wrapper.append(details);}
 return wrapper;
}
function dossierParagraph(text){const p=document.createElement('p');p.textContent=text;return p}
/* Smart Dossier V1: presentation-only grouping; original six evidence views remain available. */
const dossierGroups={
 overview:['identity','intelligence','evidence'],
 development:['development'],
 recruitment:['recruitment'],
 comparison:['comparison']
};
let dossierSmartGroup='overview';
const comparisonPanel=$('externalIntelPanel'),comparisonHome=comparisonPanel.parentNode;
function restoreComparisonPanel(){
 if(comparisonPanel.parentNode!==comparisonHome)comparisonHome.append(comparisonPanel);
}
function applySmartDossierNavigation(){
 const names={identity:'Overview',development:'Strengths & limits',recruitment:'Recruitment',history:'Compare #1885'};
 document.querySelectorAll('[data-dossier-tab]').forEach(button=>{
  const key=button.dataset.dossierTab;
  if(key==='intelligence'||key==='evidence'){button.hidden=true;return;}
  if(names[key])button.textContent=names[key];
  button.setAttribute('aria-pressed',String(({identity:'overview',history:'comparison'})[key]===dossierSmartGroup||key===dossierSmartGroup));
 });
}
function renderDossierSection(){
 if(!dossierOpen)return;
 const p=players.find(x=>x.candidate_id===active);
 if(!p){closeDossier();return}
 $('dossierTitle').textContent=p.player_name;
 $('dossierIdentity').textContent=[p.alliance,p.kingdom?'#'+p.kingdom:null,'ID '+(evidenceKey(p)||'Not confirmed'),p.contact_status].filter(Boolean).join(' · ');
 const headlineEvidence=evidenceFor(p);renderHeadlineMetrics($('dossierOverview'),headlineEvidence,p);
 document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dossierTab===dossierTab)));
 const root=$('dossierContent');root.replaceChildren();
 const evidence=evidenceFor(p),id=evidenceKey(p);
 const source=document.createElement('p');source.className='compact-source-line';source.textContent=(currentEvidence.has(id)?'Latest available data':'Saved data')+' · '+formatPlayerUtc(evidence?.source_cached_at)+(evidencePending.has(id)?' · Loading…':'')+(evidenceErrors.has(id)?' · Refresh unavailable':'');root.append(source);
 if(id){const refresh=document.createElement('button');refresh.type='button';refresh.className='compact-refresh';refresh.textContent='↻ Refresh';refresh.disabled=evidencePending.has(id);refresh.onclick=()=>loadCandidateEvidence(p,true);root.append(refresh);}

 const m=p.metadata||{},t=m.mystic_trials||{},labels={coliseum:'Heroes & Hero Gear',forest:'Pets',crystal:'Governor Charms',knowledge:'Research',molten:'Governor Gear',radiant:'Mixed · Radiant Spire'};
 if(dossierTab==='identity'||dossierTab==='overview'){
  const details=document.createElement('details'),summary=document.createElement('summary');details.className='record-details';summary.textContent='Saved record & identity';details.append(summary,dossierGrid('Identity & Power',[
   ['Player name',p.player_name],['Kingshot Player ID',evidenceKey(p)],['Kingdom',p.kingdom],['Alliance',p.alliance],['Saved Castle / Truegold',p.castle_level],['Saved Total Power',p.power_m==null?null:fmt(p.power_m)+'M'],['Previous name',m.previous_name],['Previous kingdom',m.previous_kingdom],['Updated on',p.updated_at?new Date(p.updated_at).toLocaleDateString('en-GB'):null]]));root.append(details);
 }
 if(dossierTab==='comparison'){root.append(comparisonPanel);renderExternalIntel();}
 if(dossierTab==='development'){
  renderTrialAssessment(root,evidence?.ranks?.values);
  const rankings=document.createElement('section'),rankingHeading=document.createElement('h3'),rankingGrid=document.createElement('div');rankingHeading.textContent='Player Rankings';rankingGrid.className='dossier-list';appendRankingEntries(rankingGrid,evidence?.ranks?.values,'dossier-cell');rankings.append(rankingHeading,rankingGrid);root.append(rankings);
  root.append(arenaList(evidence?.arena_squad?.heroes||[]));
  const stages=Object.entries(labels).filter(([key])=>stageIndex(t[key])!==null),detail=document.createElement('details'),summary=document.createElement('summary');detail.className='record-details';summary.textContent='Recorded Mystic Trial Stages ('+stages.length+'/6)';detail.append(summary);
  if(stages.length)detail.append(dossierGrid('Verified trial stages',stages.map(([key,label])=>[label,t[key]])));else detail.append(dossierParagraph('No manually verified trial stages recorded. Ranking scores are shown above.'));root.append(detail);
 }
 if(dossierTab==='history'){
  root.append(dossierGrid('Development History',[
   ['Last record update',p.updated_at?new Date(p.updated_at).toLocaleDateString('en-GB'):'Unknown'],
   ['Earlier power observations','Not recorded'],['Earlier trial snapshots','Not recorded']]));
  root.append(dossierParagraph('Persistent historical snapshots are not yet connected to live candidate dossiers.'));
 }
 if(dossierTab==='evidence'){
  const disclosure=document.createElement('details'),caption=document.createElement('summary');disclosure.className='record-details';caption.textContent='Sources, dates & history';disclosure.append(caption);root.append(disclosure);
  disclosure.append(dossierGrid('Evidence & Sources',[
   ['Mystic Trial evidence',m.mystic_trial_source],['Observation date',m.mystic_trial_snapshot],
   ['Profile evidence',m.profile_source||'Mighty Pulse via protected Stage Bridge'],['Player source capture',formatPlayerUtc(evidence?.source_cached_at)],['Player lookup time',formatPlayerUtc(evidence?.checked_at_utc)],['Saved screenshots','Not supported in LIVE yet']]));
  disclosure.append(dossierParagraph('Only evidence recorded for this candidate is shown. Screenshot attachments and persistent development history are not connected yet.'));
 }
 if(dossierTab==='recruitment'){
  root.append(dossierGrid('Recruitment',[
   ['Desired role',m.role],['Recorded fit',m.fit==null?null:m.fit+'%'],['Contact status',p.contact_status],
   ['Transfer eligibility',p.transfer_eligibility],['Invitation preview',invitationPreview(p)],
   ['Recruiter',p.recruiter],['Last contact',m.last_contact]]));
  const heading=document.createElement('h3');heading.textContent='Notes';root.append(heading,dossierParagraph(p.notes||'No notes recorded.'));
 }
 if(dossierTab==='intelligence'){
  const article=document.createElement('div');article.className='evidence-brief';const heading=document.createElement('h3');heading.textContent='Available evidence';article.append(heading,dossierParagraph(Object.keys(playerRankingMap(evidence?.ranks?.values)).length+' ranking metrics · '+(evidence?.arena_squad?.heroes||[]).length+' Arena heroes.'));
  if(p.notes)article.append(dossierParagraph(p.notes));root.append(article);
 }

}
function renderDossier(){
 if(!dossierOpen)return;
 restoreComparisonPanel();
 const tabs=dossierGroups[dossierSmartGroup]||['identity'];
 const root=$('dossierContent');
 const sections=[];
 for(const tab of tabs){
  dossierTab=tab;
  renderDossierSection();
  // Source summary and refresh belong once above the combined sections.
  const nodes=Array.from(root.childNodes);
  if(sections.length)nodes.splice(0,evidenceKey(players.find(x=>x.candidate_id===active))?2:1);
  sections.push(...nodes);
 }
 root.replaceChildren(...sections);
 const forecastPanel=document.createElement('section');
 forecastPanel.className='dossier-report';
 forecastPanel.setAttribute('aria-label','Expected transfer rules');
 const forecastHeading=document.createElement('h3');
 forecastHeading.textContent='PYLON IX · Transfer Intelligence — FORECAST';
 const forecastBody=document.createElement('p');
 forecastBody.textContent='Expected Group '+phxTransferForecast.group+' · Kingdoms '+phxTransferForecast.range.join('–')+' · Ordinary reference '+phxTransferForecast.ordinaryReferenceM+'M · Leading reference '+phxTransferForecast.leadingReferenceM+'M · '+phxTransferForecast.window+'.';
 const forecastNotice=document.createElement('p');
 forecastNotice.textContent=phxTransferStatus(null)+'. Community forecast only; #1885 classification, official power metric, active cap, invitations and final rules are unconfirmed. Source: '+phxTransferForecast.source+' (checked '+phxTransferForecast.checked+').';
 forecastPanel.append(forecastHeading,forecastBody,forecastNotice);
 root.prepend(forecastPanel);
 mountRuleDraftEditor(forecastPanel,{canEdit:false}); // Fail closed until a server-verified transfer_admin role exists.
 if(canEdit&&players.some(p=>p.candidate_id===active)){
  const admin=document.createElement('section');admin.className='dossier-report';
  const heading=document.createElement('h3');heading.textContent='Candidate management';
  const button=document.createElement('button');button.type='button';button.textContent='Remove candidate';
  button.onclick=()=>removeCandidateButton.click();admin.append(heading,button);root.append(admin);
 }
 applySmartDossierNavigation();
}
function openDossier(){
 if(!players.some(p=>p.candidate_id===active))return;
 dossierOpen=true;dossierSmartGroup='overview';dossierTab='identity';$('scoutingBoard').hidden=true;$('candidateDossier').hidden=false;
 renderDossier();loadCandidateEvidence(players.find(p=>p.candidate_id===active));syncWorkspace();$('candidateDossier').scrollIntoView({block:'start',behavior:'auto'});
}
function closeDossier(){restoreComparisonPanel();dossierOpen=false;$('candidateDossier').hidden=true;$('scoutingBoard').hidden=false;syncWorkspace()}
$('openDossier').onclick=openDossier;
$('backToBoard').onclick=()=>{closeDossier();$('openDossier').focus()};
document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.onclick=()=>{dossierSmartGroup=({identity:'overview',development:'development',recruitment:'recruitment',history:'comparison'})[b.dataset.dossierTab]||'overview';renderDossier()});


setInterval(()=>{if(!$('private').hidden&&$('modal').hidden&&!document.hidden)load()},20000);


/* PHX ID STAGE: additive read-only feature; original LIVE V5 logic above remains unchanged. */
const phxIdForm=$('phxIdForm'),phxIdStatus=$('phxIdStatus'),phxIdResult=$('phxIdResult');
const phxLookupIndicator=document.createElement('span');phxLookupIndicator.setAttribute('aria-hidden','true');phxLookupIndicator.style.cssText='display:none;width:17px;height:17px;border:2px solid rgba(226,189,112,.3);border-top-color:#e2bd70;border-radius:50%;animation:phx-lookup-spin .85s linear infinite;flex:none';const phxLookupWrap=document.createElement('div');phxLookupWrap.style.cssText='display:flex;align-items:center;gap:10px';phxIdStatus.parentNode.insertBefore(phxLookupWrap,phxIdStatus);phxLookupWrap.append(phxLookupIndicator,phxIdStatus);const phxLookupStyle=document.createElement('style');phxLookupStyle.textContent='@keyframes phx-lookup-spin{to{transform:rotate(360deg)}}';document.head.append(phxLookupStyle);function setPhxLookupState(state,message){phxIdStatus.textContent=message;phxLookupIndicator.style.display=state==='loading'?'inline-block':'none';phxIdStatus.style.color=state==='success'?'#70d69b':state==='error'?'#f0a0a0':'';phxIdStatus.style.fontWeight=state==='success'?'700':'';phxIdStatus.setAttribute('role','status');phxIdStatus.setAttribute('aria-live','polite');}
const phxBridgeUrl=SUPABASE_URL+'/functions/v1/phalanx-transfer-id-snapshot-fallback-stage-20261031'; // Staging only; browser CORS requires verified deployment.
// One compact read-only renderer for lookup, dossier and comparison. Values stay exact.
function renderRankingEvidence(target,entry,missing='Not available from source',compact=false){
 target.className=(target.className||'')+' ranking-evidence';
 if(!entry){const unknown=document.createElement('span');unknown.className='ranking-missing';unknown.textContent=missing;target.append(unknown);return;}
 const value=document.createElement('strong'),rank=document.createElement('small'),details=document.createElement('details'),summary=document.createElement('summary'),source=document.createElement('p');
 value.className='ranking-value';value.textContent=compact?compactPower(entry.value):formatPlayerNumber(entry.value);value.title='Exact value: '+formatPlayerNumber(entry.value);
 rank.className='ranking-rank';rank.textContent='Kingdom rank: '+formatPlayerNumber(entry.kingdom_rank);
 details.className='ranking-source';summary.textContent=compact?'ⓘ':entry.source==='saved_snapshot'?'Saved snapshot':'Source & time';summary.title='Exact value, kingdom rank, source and capture time';source.textContent='Exact value: '+formatPlayerNumber(entry.value)+' · Kingdom rank: '+formatPlayerNumber(entry.kingdom_rank)+(entry.source==='calculated'?' · Calculated from matched Total and Troop Power · '+formatPlayerUtc(entry.captured_at):rankingSourceText(entry));details.append(summary,source);target.append(value);if(!compact)target.append(rank);target.append(details);
}
function appendRankingEntries(target,values,cellClass){
 const v=values||{},map=playerRankingMap(v),table=document.createElement('table'),head=document.createElement('thead'),header=document.createElement('tr'),body=document.createElement('tbody');table.className='ranking-list';
 for(const label of ['Metric','Value','KD rank','']){const th=document.createElement('th');th.textContent=label;header.append(th);}head.append(header);table.append(head,body);
 const append=(label,entry,missing,sourceEntry)=>{const row=document.createElement('tr');row.className='ranking-evidence';for(const text of [label,entry?formatPlayerNumber(entry.value):missing,entry?formatPlayerNumber(entry.kingdom_rank):'—']){const td=document.createElement('td');td.textContent=text;row.append(td);}
  const td=document.createElement('td'),details=document.createElement('details'),summary=document.createElement('summary'),source=document.createElement('p');details.className='ranking-source';summary.textContent='ⓘ';summary.title='Source and time';source.textContent=rankingSourceText(entry||sourceEntry).replace(/^ · /,'');details.append(summary,source);td.append(details);row.append(td);body.append(row);};
 for(const [key,entry] of Object.entries(map))append(rankingLabels[key]||entry.name,entry);
 for(const board of Array.isArray(v.boards)?v.boards:[])if(board.status==='not_listed'&&!map[canonicalRankingName(board.name)])append(rankingLabels[board.name]||board.name,null,'Not listed in Top 100',board);
 if(!body.children.length)append('Rankings',null,'Not available');target.append(table);
 if(v.board_status==='unavailable'){const note=document.createElement('p');note.className='ranking-status';note.textContent='Additional kingdom boards unavailable; available player standings remain displayed.';target.append(note);}
}
function renderTrialAssessment(root,values){
 const keys=['coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire'],map=playerRankingMap(values);
 const section=document.createElement('section'),title=document.createElement('h3'),grid=document.createElement('div');
 title.textContent='Mystic Trials · relative development';grid.className='trial-balance';section.append(title,grid);
 const ranks=[];
 for(const key of keys){const row=document.createElement('div'),label=document.createElement('span'),value=document.createElement('b'),entry=map[key];label.textContent=rankingLabels[key];
  const rank=Number(entry?.kingdom_rank),valid=entry?.kingdom_rank!=null&&Number.isInteger(rank)&&rank>=1&&rank<=100;
  value.textContent=valid?'#'+rank:'Not available';row.append(label,value);grid.append(row);if(valid)ranks.push(rank);
 }
 const note=document.createElement('p');note.className='ranking-status';
 note.textContent=(ranks.length===6?'Mean rank '+(ranks.reduce((a,b)=>a+b,0)/6).toFixed(1)+' · Rank spread '+(Math.max(...ranks)-Math.min(...ranks))+'. ':'Coverage '+ranks.length+'/6; no overall indicator calculated. ')+
 'Smaller ranks indicate stronger placement within this kingdom. These are development indicators; they do not reveal equipment levels or battle outcomes. Missing Top-100 entries are unknown, never rank 101 or zero. Mean and spread are descriptive, not official Mystic Power.';
 section.append(note);root.append(section);
}
function renderHeadlineMetrics(target,evidence,record={}){
 const profile={power:evidence?.player?.power??(record.power_m==null?null:Number(record.power_m)*1e6),captured_at:evidence?.player?.power!=null?evidence?.source_cached_at:record.metadata?.external_lookup?.source_cached_at,castle_level:record.castle_level},metrics=playerSummaryMetrics(evidence?.ranks?.values,profile);target.replaceChildren();target.classList.add('headline-metrics');
 for(const metric of metrics){const item=document.createElement('div'),label=document.createElement('span'),value=document.createElement('strong'),detail=document.createElement('details'),summary=document.createElement('summary'),info=document.createElement('p');item.className='headline-metric';item.dataset.metric=metric.key;label.textContent=metric.label;value.textContent=metric.text;value.title=metric.details;detail.className='metric-info';summary.textContent='ⓘ';summary.title=metric.label+' source and calculation';info.textContent=metric.details;detail.append(summary,info);item.append(label,value,detail);target.append(item);}
}
function arenaList(heroes){const section=document.createElement('section'),heading=document.createElement('h3'),list=document.createElement('div');heading.textContent='Arena Squad';list.className='arena-list';section.append(heading,list);for(const [i,h] of heroes.entries()){const row=document.createElement('div'),name=document.createElement('span'),stats=document.createElement('b');row.className='arena-row';name.textContent=(i+1)+'. '+(h.name||'Unknown');stats.textContent=[h.level==null?null:'Level '+h.level,(h.stars??h.star)==null?null:(h.stars??h.star)+' stars'].filter(Boolean).join(' · ');row.append(name,stats);list.append(row);}if(!heroes.length)list.textContent='No Arena heroes available.';return section;}
const phxSearchShell=document.createElement('div');phxSearchShell.id='phxSearchShell';phxSearchShell.hidden=true;phxSearchShell.style.cssText='display:none;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 12px;border:1px solid #b88a47;background:#081d2c;color:#f1d7a4;margin:10px 0';const phxSearchLabel=document.createElement('strong');const phxNewSearch=document.createElement('button');phxNewSearch.type='button';phxNewSearch.textContent='New Search';phxNewSearch.addEventListener('click',()=>{restoreComparisonPanel();lookupIntel=null;phxSearchShell.hidden=true;phxSearchShell.style.display='none';phxIdForm.hidden=false;phxIdForm.style.display='';phxIdForm.querySelector('input')?.focus();});phxSearchShell.append(phxSearchLabel,phxNewSearch);phxIdForm.parentNode.insertBefore(phxSearchShell,phxIdForm);
const element = (tag, text, className) => {
 const node=document.createElement(tag);
 if(text!=null)node.textContent=text;
 if(className)node.className=className;
 return node;
};
function decisionDetails(title, ...contents){
 const details=element('details',null,'phx-decision-fold');
 details.append(element('summary',title),...contents);
 return details;
}
function allianceTag(value){
 return String(value||'').trim().replace(/^\[|\]$/g,'').toUpperCase();
}
const destinationAlliances=['NXS','OoO','MYM','FRA'];
let lookupIntel=null;

function strongestInternalPlayer(preferred, ownIds){
 const available=(internalPlayers||[]).filter(player=>![player.governor_id,player.uid].some(id=>ownIds.includes(String(id))));
 const power=player=>Number(player.rankings?.personal_power?.value)||0;
 const ordered=[...available].sort((a,b)=>power(b)-power(a));
 return ordered.find(player=>allianceTag(player.alliance_tag)===allianceTag(preferred)&&power(player)>0)
  ||ordered[0];
}

function verifiedTruePowerEvidence(metric, castle, candidateIds){
 const list=(internalPlayers||[]).filter(row=>row.true_power_verified===true
  && row.true_power!=null && String(row.true_power).trim()!=='' && Number.isFinite(Number(row.true_power))
  && Number(row.true_power)>=0 && formatPlayerUtc(row.captured_at)!=='Not available');
 const groups=new Map();
 for(const row of list){
  const id=String(row.governor_id??row.player_id??row.uid??'');
  if(!id||candidateIds.includes(id))continue;
  const time=formatPlayerUtc(row.captured_at);
  if(!groups.has(time))groups.set(time,new Map());
  groups.get(time).set(id,row);
 }
 const cohort=[...groups].sort(([a,first],[b,second])=>second.size-first.size||b.localeCompare(a))[0];
 if(!metric.calculated||!cohort||cohort[1].size<5)return 'Comparable True Power sample unavailable.';
 const [capture, members]=cohort;
 const rank=rows=>1+rows.filter(row=>Number(row.true_power)>metric.value).length;
 const peers=[...members.values()];
 const nxs=peers.filter(row=>allianceTag(row.alliance_tag??row.alliance_abbr)==='NXS');
 const tier=castle.text.match(/^TG(\d+) /)?.[1];
 const exact=peers.filter(row=>row.castle_level===castle.text);
 const tg=tier?peers.filter(row=>String(row.castle_level||'').startsWith('TG'+tier+' ')):[];
 const matched=exact.length>=5?exact:tg;
 const percentile=matched.length?Math.round(100*matched.filter(row=>Number(row.true_power)<=metric.value).length/matched.length):null;
 const tgNote=matched.length>=5?' · '+(exact.length>=5?'Same TG upgrade':'Same main TG tier')
  +' #'+rank(matched)+' of '+(matched.length+1)+' · sample percentile '+percentile:'';

 return 'Verified sample insertion #'+rank(peers)+' of '+(peers.length+1)
  +(nxs.length?' · NXS #'+rank(nxs)+' of '+(nxs.length+1):'')+tgNote+'. Peer capture '+capture
  +' · Candidate capture '+formatPlayerUtc(metric.captured_at)+'. Partial comparison sample.';
}

function mountDecision(payload,id){
 const p=payload.player, values=payload.ranks?.values, ranks=playerRankingMap(values);
 const name=p.name||p.playerName||p.player_name||'Unknown player';
 const stamp=payload.source?.cachedAt;
 const metrics=playerSummaryMetrics(values,{
  power:p.power??p.totalPower??p.total_power, captured_at:stamp,
  castle_level:p.townCenterLevel??p.town_center_level??p.castleLevel??p.castle_level
 });
 const assessment=assessAccount(p,ranks);
 const [total,truePower]=metrics;
 const castle=metrics.at(-1);
 if(castle.value===null&&castle.text!=='Not available')castle.details='Profile field · '+formatPlayerUtc(stamp);
 const comparisonRanks=lookupComparisonRanks(payload,ranks,metrics);
 const seaRanks=Object.fromEntries(assessment.rankingEvidence.filter(row=>row.rank<=100).map(row=>[row.key,row.rank]));
 // Use the documented historical rating presentation and the existing provisional formula.
 const sea=seaWorldVerdict({...p,governorId:id},Object.keys(WEIGHTS).some(key=>seaRanks[key])?{
  scope:'top25_provisional',ranks:seaRanks,truePower:truePower.calculated?truePower.value:null
 }:null);
 const tierName=tier=>tier.replaceAll('_',' ').replace(/\b[a-z]/g,letter=>letter.toUpperCase());
 const rating=element('div',null,'phx-decision-rating');
 const tierIndex=THRESHOLDS.findIndex(row=>row.tier===sea.tier);
 const nextThreshold=THRESHOLDS[tierIndex-1]?.min;
 const tier=sea.tier?tierName(sea.tier)+(sea.scoreLower>=nextThreshold-3?'+':''):'Rating unavailable';
 const tierStars=THRESHOLDS[tierIndex]?.stars;
 if(tierStars)rating.append(element('strong',tierStars.replace('+',' ◆'),'phx-decision-stars'));
 rating.append(element('span',tier,'phx-decision-tier'),
  element('small',sea.status==='PROVISIONAL_RANGE'?'SEA WORLD V2 · Lower bound':sea.tier?'SEA WORLD V2 · Provisional':'SEA WORLD V2 · No reference'));
 const card=element('section',null,'phx-transfer-decision');
 const head=element('header',null,'phx-decision-head');
 const identity=element('div');
 identity.append(element('small','PHALANX · PLAYER INTELLIGENCE'),element('h3',name),
  element('p',[p.alliance,'Kingdom #'+p.kingdom,'ID '+id].filter(Boolean).join(' · ')));
 head.append(identity,rating);
 const tiles=element('dl',null,'phx-decision-metrics');
 const metricEvidence=element('ul',null,'phx-decision-list');
 const trueSample=element('p');
 const trueHelp=element('dialog',null,'phx-decision-true-help');
 trueHelp.setAttribute('aria-label','True Power calculation and comparison');
 const closeHelp=element('button','Close');
 const closeForm=element('form');closeForm.method='dialog';closeForm.append(closeHelp);
 trueHelp.append(element('h4','True Power · calculation and comparison'),element('p',truePower.details),trueSample,closeForm);
 for(const metric of [total,truePower,castle,...metrics.slice(2,-1)]){
  const label=metric.label.replace(' · score','').replace('Truegold','TG');
  metricEvidence.append(element('li',label+' · '+metric.details));
  if(metric!==total&&metric!==truePower&&metric!==castle)continue;
  const tile=element('div');
  tile.dataset.metric=metric.key;
  const value=element('dd',metric.text==='Not available'?'—':metric.text);
  value.title=metric.details;
  if(metric===truePower){
   const info=element('button','i','phx-decision-info');
   info.type='button';info.setAttribute('aria-label','True Power calculation and comparison');
   info.addEventListener('click',()=>trueHelp.showModal());
   value.append(info);
  }
  tile.append(element('dt',label),value);
  tiles.append(tile);
 }

 const facts=element('div',null,'phx-decision-facts');
 const short=rows=>rows.map(row=>row.label+' #'+row.rank).join(' · ');
 for(const [label,content] of [
  ['Strengths',short(assessment.strengths.slice(0,2))||'No Top-15 strength recorded'],
  ['Development',short(assessment.development.slice(0,2))||'No relative gap recorded']
 ]){
  const cell=element('div');cell.append(element('strong',label),element('p',content));facts.append(cell);
 }
 const capture=formatPlayerUtc(stamp);
 const freshness=element('p',assessment.profile+' · '+assessment.coverage+'/'+assessment.expected
  +' kingdom categories'+(assessment.dated<assessment.coverage?' · Some dates unknown':assessment.oldest!==assessment.newest?' · Mixed capture dates':''),'phx-decision-source');
 const verdict=element('section',null,'phx-decision-verdict');
 const primaryRole=assessment.priorities[0];
 const tiedRoles=primaryRole?assessment.priorities.filter(role=>role.evidence.length===primaryRole.evidence.length
  && role.evidence.reduce((sum,row)=>sum+row.rank,0)===primaryRole.evidence.reduce((sum,row)=>sum+row.rank,0)):[];
 const roleSummary=primaryRole?'Review '+tiedRoles.map(role=>role.label).join(' or ')+' potential'
  +(tiedRoles.length===1?' · '+short(primaryRole.evidence.slice(0,2)):'')
  :'More evidence needed before suggesting a KvK role';
 verdict.append(element('small','⚔ PYLON IX · CENTRAL ACCOUNT ASSESSMENT'),element('h4',assessment.level),freshness,facts,
  element('p',roleSummary+'.','phx-decision-role-summary'));
 card.append(head,tiles,trueHelp,verdict);

 const alliance=element('section',null,'phx-decision-alliance');
 const controls=element('div',null,'phx-decision-alliance-controls');
 const label=element('label','Target alliance ');
 const picker=element('select');picker.id='phxDecisionAlliance';
 for(const tag of destinationAlliances){const option=element('option',tag);option.value=tag;picker.append(option);}
 picker.value=destinationAlliances.find(tag=>p.kingdom===1885&&allianceTag(tag)===allianceTag(p.alliance))||'NXS';
 label.append(picker);controls.append(label);
 const placement=element('div');placement.setAttribute('aria-live','polite');
 alliance.append(controls,placement);

 const roleGrid=element('ul',null,'phx-decision-roles');
 for(const role of assessment.roles){
  const row=element('li');
  row.append(element('strong',role.label),element('span',role.review?'Priority review':'Evidence needed'));
  roleGrid.append(row);
 }
 const roleEvidence=element('ul',null,'phx-decision-list');
 for(const role of assessment.roles){
  roleEvidence.append(element('li',role.label+' · '+(short(role.evidence)||'No Top-15 indicators recorded')+'. Verify: '+role.missing+'.'));
 }
 const roles=decisionDetails('KvK roles & evidence',roleGrid,
  element('p','Review priority uses the number of role-related Top-15 indicators, then the sum of their ranks. Verify role-specific buffs and battle reports before assigning a role.'),roleEvidence);
 verdict.append(roles);

 const evidence=element('div');
 const method=element('p','Overall level uses the median of at least 4 of 9 category ranks (≤15 strong, ≤40 established, >40 developing). '
  +'Strengths are Top 15. Development lists the weakest documented positions outside that group. Missing metrics remain unknown. '
  +'With enough categories, a Top-15 strength and a rank beyond #30 indicate specialization; a spread of 15 places or less indicates a balanced profile.');
 evidence.append(method,element('p',(assessment.median===null?'Median unavailable':'Median kingdom rank #'+assessment.median)
  +' · '+assessment.dated+'/'+assessment.coverage+' ranked categories dated'
  +(assessment.oldest?' · '+assessment.oldest+(assessment.oldest===assessment.newest?'':' to '+assessment.newest):'')
  +'. Missing ranks: '+(assessment.missing.join(', ')||'none')+'.'));
 const seaTiers=THRESHOLDS.map(({tier,min})=>tier.replaceAll('_',' ')+' ≥'+min).join(' · ');
 const seaWeights=Object.entries(WEIGHTS).map(([key,value])=>(rankingLabels[key]||'True Power')+' '+value+'%').join(' · ');
 evidence.append(decisionDetails('SEA WORLD rating method',element('p',sea.detail),
  ...(sea.status==='PROVISIONAL_RANGE'?[element('p','Possible upper tier with missing metrics: '+tierName(sea.upperTier)+'.')]:[]),
  element('p','Provisional #1885 reference · '+seaTiers),element('p',seaWeights),
  element('p','A + indicates a documented score within 3 points of the next tier. For other kingdoms the model uses the same provisional #1885 scale and local ranking positions.')));
 const candidateIds=[id,payload.uid,p.uid,p.governorId,p.governor_id].filter(Boolean).map(String);
 const refreshTrueSample=()=>{trueSample.textContent=verifiedTruePowerEvidence(truePower,castle,candidateIds);};
 refreshTrueSample();
 evidence.append(metricEvidence,
  element('p','Profile source capture: '+capture+' · Lookup (UTC): '+formatPlayerUtc(payload.checkedAtUtc)));

 const all=element('div',null,'phx-decision-rankings');
 appendRankingEntries(all,values,'');
 const graphs=element('div',null,'phx-decision-rank-bars');
 for(const row of assessment.rankingEvidence){
  const line=element('div');
  line.dataset.band=row.rank<=10?'top':row.rank<=20?'solid':'gap';
  const meter=element('meter');meter.min=0;meter.max=100;meter.value=Math.max(1,101-row.rank);
  meter.setAttribute('aria-label',row.label+' kingdom rank '+row.rank);
  line.append(element('span',row.label+' #'+row.rank),meter);graphs.append(line);
 }

 if(assessment.rankingEvidence.length){
  const profile=element('section',null,'phx-decision-profile');
  profile.append(element('h4','Strength Profile · Kingdom Rankings'),graphs);
  card.append(profile);
 }
 card.append(alliance);

 const compare=decisionDetails('Compare with a #1885 player');
 const chooseDefault=()=>{
  const peer=internalPlayers?.find(player=>String(player.governor_id||player.uid)===lookupIntel.manualPeer)
   ||strongestInternalPlayer(picker.value,candidateIds);
  renderInternalChoices(peer?String(peer.uid||peer.player_name):'');
 };
 lookupIntel={id,ids:candidateIds,name,kingdom:p.kingdom,ranks:comparisonRanks,stamp,picker,compare,refresh:refreshTrueSample};
 const showComparison=()=>{
  if(!compare.open||lookupIntel?.compare!==compare)return;
  const moved=comparisonPanel.parentNode!==compare;
  if(moved){compare.append(comparisonPanel);chooseDefault();}
  if(!internalPlayers&&!internalLoading)$('loadInternal').click();
  else {
   renderExternalIntel();
   if(moved&&internalHistorical&&!internalLoading)void refreshInternalPlayer();
  }
 };
 lookupIntel.showComparison=showComparison;
 compare.addEventListener('toggle',showComparison);
 picker.addEventListener('change',()=>{
  lookupIntel.manualPeer='';
  if(comparisonPanel.parentNode===compare&&internalPlayers){
   chooseDefault();renderExternalIntel();
   if(internalHistorical)void refreshInternalPlayer();
  }
 });
 const heroes=payload.arenaSquad?.heroes||[];
 card.append(compare,decisionDetails('Rankings & evidence · '+Object.keys(ranks).length+' metrics',all,
  decisionDetails('Sources, calculations & freshness',evidence),
  decisionDetails('Arena Squad · '+heroes.length+' · '+formatPlayerSection(payload.arenaSquad?.status),arenaList(heroes))));
 phxIdResult.replaceChildren(card);
 const refreshPlacement=mountAlliancePlacement(picker,placement,total,candidateIds,comparisonRanks);
 lookupIntel.refresh=()=>{refreshTrueSample();refreshPlacement();};
}

async function loadAllianceSnapshot(tag){
 const latest=await db.from('phalanx_alliance_players').select('snapshot_date').eq('kingdom',1885)
  .eq('alliance',tag).order('snapshot_date',{ascending:false}).limit(1);
 if(latest.error)throw Error('Historical roster access unavailable.');
 const date=latest.data?.[0]?.snapshot_date;
 if(!date)return {date:'',rows:[]};
 const metadata=Promise.resolve(db.from('phalanx_alliance_snapshots').select('members,total_power').eq('kingdom',1885)
  .eq('alliance',tag).eq('snapshot_date',date).maybeSingle()).catch(()=>({error:true}));
 const rows=[];
 for(let offset=0;offset<10000;offset+=500){
  const page=await db.from('phalanx_alliance_players').select('player_id,player_name,power,tg_level')
   .eq('kingdom',1885).eq('alliance',tag).eq('snapshot_date',date).order('player_id').range(offset,offset+499);
  if(page.error)throw Error('Historical roster access unavailable.');
  rows.push(...(page.data||[]));
  if((page.data||[]).length<500){
   const result=await metadata;
   return {date,rows,metadata:result.error?null:result.data};
  }
 }
 return {date,rows};
}

function mountAlliancePlacement(picker,root,total,candidateIds,candidateRanks){
 const cache=new Map();
 const rpc=!Number.isSafeInteger(total.value)?Promise.resolve(null):Promise.resolve(db.rpc('phx_live_alliance_placement',{p_power:total.value}))
  .then(result=>result.error||!Array.isArray(result.data)?null:result.data,()=>null);
 let generation=0;
 let updatePeerEvidence=()=>{};
 const render=async()=>{
  const request=++generation,tag=picker.value;
  updatePeerEvidence=()=>{};
  root.replaceChildren(element('p','Loading '+tag+' snapshots…'));
  if(!cache.has(tag))cache.set(tag,loadAllianceSnapshot(tag).catch(error=>({error:error.message})));
  const historical=await cache.get(tag);
  if(!root.isConnected||picker.value!==tag||request!==generation)return;
  const snapshot=placeInAlliance(total.value,historical.rows,historical.date,{
   candidateIds,members:historical.metadata?.members,totalPower:historical.metadata?.total_power
  });
  const result=element('div');
  if(snapshot.rankMin!==null){
   const position='#'+snapshot.rankMin+(snapshot.rankMin===snapshot.rankMax?'':'–'+snapshot.rankMax);
   const top=snapshot.top15Guaranteed?'Top 15':!snapshot.top15Possible?'Outside Top 15'
    :snapshot.complete?'Top-15 boundary tie':'Top 15 unverified';
   result.append(element('strong',snapshot.complete?position+' · '+top:top,'phx-decision-placement'));
   result.append(element('p',(snapshot.complete?'Complete historical roster':'Partial historical roster')+' · '
    +snapshot.comparisonSize+' peers · '+snapshot.snapshotDate+' · Total Power','phx-decision-source'));
   if(!snapshot.complete)result.append(element('p',snapshot.ahead+' of '+snapshot.comparisonSize+' recorded peers have higher Total Power. Overall placement is unknown.'));
   if(snapshot.complete){
    const delta=snapshot.top15Gap;
    if(delta!==null)result.append(element('p',delta===0?'Equal to the historical Top-15 cutoff.'
     :compactPower(Math.abs(delta))+' '+(delta>0?'above':'below')+' the historical Top-15 cutoff.'));
    const bar=element('meter');bar.min=0;bar.max=snapshot.rosterSize+1;
    bar.value=snapshot.rosterSize+2-snapshot.rankMin;
    bar.setAttribute('aria-label','Historical placement '+position);result.append(bar);
   }
  }else result.append(element('p',historical.error||(total.value===null?'Candidate Total Power unavailable.':'Historical placement unavailable.')));
  const supporting=decisionDetails(snapshot.top15.length
   ?(snapshot.complete?'Historical Top 15':'Top 15 recorded')+' · '+tag:'Alliance snapshot details');
  if(snapshot.top15.length){
   const list=element('ol',null,'phx-decision-list');
   for(const peer of snapshot.top15){
    list.append(element('li',(peer.player_name||'Player ID '+peer.player_id)+' · '+compactPower(peer.power)
     +(peer.tg_level?' · '+peer.tg_level:'')));
   }
   const gap='Gap above '+(snapshot.gapAbove==null?'—':compactPower(snapshot.gapAbove))
    +' · below '+(snapshot.gapBelow==null?'—':compactPower(snapshot.gapBelow));
   supporting.append(list,element('p',gap+' · Candidate Total Power capture '+formatPlayerUtc(total.captured_at)+'.'));
   result.append(supporting);
   const categories=element('div');
   result.insertBefore(categories,supporting);
   updatePeerEvidence=()=>{
    const evidence=compareTopPeers(candidateRanks,snapshot.top15,internalPlayers||[]);
    const summary=direction=>evidence.filter(row=>direction*(row.value-row.median)>0)
     .map(row=>rankingLabels[row.key]).join(', ');
    categories.replaceChildren(element('p',evidence.length?[
     summary(1)&&'Above peer median: '+summary(1),summary(-1)&&'Below peer median: '+summary(-1)
    ].filter(Boolean).join(' · ')||'Measured categories match their peer medians.'
     :'Total Power supports the roster comparison. Category comparisons need at least five dated peer values from the same capture.','phx-decision-source'));
    if(evidence.length){
     const details=decisionDetails('Category evidence · Historical roster peers');
     for(const row of evidence)details.append(element('p',rankingLabels[row.key]+' · Candidate '+formatPlayerNumber(row.value)
      +' ('+formatPlayerUtc(row.candidateCapture)+') · Median '+formatPlayerNumber(row.median)
      +' from '+row.count+'/'+snapshot.top15.length+' peers ('+formatPlayerUtc(row.capture)+')'));
     categories.append(details);
    }
   };
   updatePeerEvidence();
  }
  root.replaceChildren(result);
  const live=(await rpc)?.find(row=>allianceTag(row.alliance)===allianceTag(tag));
  if(!result.isConnected||!live||!Number.isSafeInteger(Number(live.rank))||Number(live.rank)<1
   ||!Number.isSafeInteger(Number(live.covered))||Number(live.covered)<1)return;
  if(!supporting.isConnected)result.append(supporting);
  supporting.append(decisionDetails('Kingdom Top 100 · partial snapshot',
   element('p',live.covered+' '+tag+' entries · '+formatPlayerUtc(live.sourceCapturedAt)
    +'. This board is a partial sample and can include the candidate’s earlier entry.')));
 };
 picker.addEventListener('change',render);
 render();
 return ()=>updatePeerEvidence();
}

phxIdForm.addEventListener('submit',async e=>{
 e.preventDefault();if(phxIdForm.querySelector('button').disabled)return;restoreComparisonPanel();lookupIntel=null;phxIdResult.replaceChildren();$('phxReview').hidden=true;clearLookupCandidate();
 if($('private').hidden){phxIdStatus.textContent='Sign in to continue.';return;}
 const id=$('phxGovernorId').value.trim();
 if(!/^[1-9][0-9]{0,15}$/.test(id)){phxIdStatus.textContent='Enter a valid Kingshot Player ID.';return;}
 if(!phxBridgeUrl){phxIdStatus.textContent='Player lookup is not available yet.';return;}
 const button=phxIdForm.querySelector('button');button.disabled=true;setPhxLookupState('loading','Loading player data… Source refresh can take up to 90 seconds.');
 try{
  const {data:{session},error}=await db.auth.getSession();
  if(error||!session?.access_token)throw Error('Please sign in again.');
  const endpoint=new URL(phxBridgeUrl);if(endpoint.protocol!=='https:')throw Error('A secure HTTPS connection is required.');
  endpoint.searchParams.set('governorId',id);
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),125000);
  let response;try{response=await fetch(endpoint,{headers:{Authorization:'Bearer '+session.access_token,apikey:KEY},signal:controller.signal,cache:'no-store'});}finally{clearTimeout(timeout);}
  if(!response.ok)throw Error(playerLookupError(response.status));
  const payload=await response.json();if($('phxGovernorId').value.trim()!==id){phxIdStatus.textContent='Kingshot Player ID changed. Load player data again.';return;}if(payload.ok!==true||String(payload.governorId)!==id||!Number.isSafeInteger(payload.player?.kingdom)||payload.player.kingdom<1)throw Error('Player identity could not be confirmed.');const p=payload.player;$('phxReview').hidden=false;
  mountDecision(payload,id);
  setPhxLookupState('success','✓ Player data loaded successfully. Review the details before adding this player to Candidates.');
  offerLookupCandidate(payload,id);
  phxSearchLabel.textContent=(p.name||p.player_name||p.nickname||'Player')+' · ID '+id;
  phxIdForm.hidden=true;phxIdForm.style.display='none';phxSearchShell.hidden=false;phxSearchShell.style.display='flex';
  $('phxReview').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(error){setPhxLookupState('error',error.name==='AbortError'?'The lookup timed out. Please try again later.':error instanceof TypeError?'Player lookup unavailable. Bitte die Freigabe der Testadresse (CORS), Anmeldung und API-Verbindung prüfen; deine Internetverbindung ist nicht zwingend die Ursache.':error.message);}
 finally{button.disabled=false;}
});

// Native section links; existing dossiers keep their own Back navigation.
/* V5 progressive workspace adapted to protected cloud IDs. Source: 55f372d. */
let workspaceView='phxIdPanel',profileOpen=false;
// Preserve the existing transfer calculator, but place it under the established Tools view.
const phxScenario=$('phxPowerScenario');
const phxToolsBody=document.querySelector('#workspace-tools .tools-body');
if(phxScenario&&phxToolsBody){phxScenario.classList.add('phx-tools-scenario');phxToolsBody.insertBefore(phxScenario,phxToolsBody.firstChild);}
// Initialize the existing five-card Tools menu only after the calculator is relocated.
if(typeof window.phxInitToolsMenu==='function')window.phxInitToolsMenu();

function syncWorkspace(){
 const total=players.length, candidateView=workspaceView==='scoutingBoard';
 $('private').classList.toggle('is-empty',!total);
 $('candidate-empty').hidden=!!total;
 $('workspaceStats').hidden=!candidateView||!total||dossierOpen;
 $('candidate-profile').hidden=!candidateView||!profileOpen||!players.some(p=>p.candidate_id===active);
 $('scoutingBoard').classList.toggle('profile-open',!$('candidate-profile').hidden);
 $('compare').disabled=chosen.size<2;$('compare').hidden=total<2;$('csv').hidden=!total;
 $('addFirstCandidate').hidden=!canEdit;$('readOnlyNotice').hidden=canEdit;
}
function showWorkspace(view){
 if(dossierOpen)closeDossier();
 if(view!=='phxIdPanel')restoreComparisonPanel();
 workspaceView=view;
 for(const id of ['scoutingBoard','phxIdPanel','workspace-tools'])$(id).hidden=id!==view;
 document.querySelector('main').dataset.workspaceView=view;
 document.querySelectorAll('.workspace-nav [data-view]').forEach(el=>{const on=el.dataset.view===view;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 syncWorkspace();
 if(view==='phxIdPanel')lookupIntel?.showComparison();
}
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showWorkspace(el.dataset.view);}));
$('addFirstCandidate').onclick=()=>$('newCandidate').click();
$('toolsCsv').onclick=()=>$('csv').click();
$('closeProfile').onclick=()=>{profileOpen=false;syncWorkspace();};
$('rows').addEventListener('click',e=>{if(e.target.closest('tr[data-id]')&&!e.target.closest('input,button')){profileOpen=true;syncWorkspace();}});
$('rows').addEventListener('change',syncWorkspace);
new MutationObserver(syncWorkspace).observe($('rows'),{childList:true});
showWorkspace('phxIdPanel');
const advanced=document.createElement('details');advanced.className='advanced-fields';const summary=document.createElement('summary');summary.textContent='More details · Role, contact & development';advanced.append(summary);
for(const label of [...$('candidateForm').querySelectorAll('.form-grid>label')]){if(!['player_name','kingdom'].includes(label.querySelector('[name]')?.name))advanced.append(label);}
advanced.append($('candidateForm').querySelector('fieldset'));$('candidateForm').insertBefore(advanced,$('candidateForm').querySelector('label:has(textarea)'));

/* ID-first candidate onboarding. Lookup stays read-only; the explicit button is the write action. */
let lookupCandidate=null,lookupSaving=false;
function clearLookupCandidate(){lookupCandidate=null;$('workspaceNotice').textContent='';$('phxAdoptCandidate').hidden=true;$('phxAdoptStatus').textContent='';}
function offerLookupCandidate(payload,id){
 if($('phxGovernorId').value.trim()!==id)return;
 try{lookupCandidate=candidateFromLookup(payload,id);$('phxAdoptCandidate').hidden=!canEdit;
 $('phxAdoptStatus').textContent=canEdit?'Review these details, then select Add to Candidates.':'Read only. Recruiter permission is required to add candidates.';
 }catch(error){clearLookupCandidate();$('phxAdoptStatus').textContent=error.message;}
}
$('phxGovernorId').addEventListener('input',clearLookupCandidate);
$('phxAdoptCandidate').onclick=async()=>{
 if(lookupSaving)return;
 const draft=lookupCandidate,id=draft?.metadata.governor_id;
 if(!canEdit||$('private').hidden||!draft||$('phxGovernorId').value.trim()!==id){clearLookupCandidate();return;}
 lookupSaving=true;$('phxAdoptCandidate').disabled=true;$('phxGovernorId').disabled=true;phxIdForm.querySelector('button').disabled=true;
 $('phxAdoptStatus').textContent='Checking existing candidates…';
 try{
  const {data:duplicates,error:readError}=await db.from('transfer_candidates').select('candidate_id,player_name').or(duplicateLookupFilter(id)).limit(1);
  if(readError)throw Error('Existing candidates could not be checked. Nothing was saved.');
  if(duplicates?.length){$('phxAdoptStatus').textContent='This player is already a candidate. Existing data remains unchanged.';return;}
  const {data:saved,error}=await db.from('transfer_candidates').insert({...draft,updated_at:new Date().toISOString()}).select('candidate_id').maybeSingle();
  if(error){if(error.code==='23505')throw Error('This player was already added. No duplicate was created.');throw Error('Could not add candidate: '+error.message);}
  if(!saved?.candidate_id)throw Error('Save not confirmed. Refresh Candidates before trying again.');
  active=saved.candidate_id;clearLookupCandidate();
  $('search').value=''; // Clear only the shortlist filter after confirmed insert; never on error.
  const loaded=await load();$('workspaceNotice').textContent=loaded?'Candidate added. Player data saved.':'Candidate saved. The list could not reload; please refresh.';
  showWorkspace('scoutingBoard');
 }catch(error){$('phxAdoptStatus').textContent=error.message||'Save not confirmed. Refresh Candidates before trying again.';}
 finally{lookupSaving=false;$('phxAdoptCandidate').disabled=false;$('phxGovernorId').disabled=false;phxIdForm.querySelector('button').disabled=false;}
};

check();
