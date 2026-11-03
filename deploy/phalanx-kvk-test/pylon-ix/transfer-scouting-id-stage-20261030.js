import { placeInAlliance } from './phx-transfer-alliance-placement-20261101.js';
import { assessAccount, classifyCombatProfile } from './phx-transfer-account-assessment-20261101.js';
import { seaWorldVerdict } from './phx-sea-world-v2-gate-20261101.js';
import { mountStrategicProfile } from './phx-transfer-strategic-profile-20261101.js';
import { mountEventRoles } from './phx-transfer-event-roles-20261101.js';
import { candidateFromLookup, duplicateLookupFilter } from './transfer-id-candidate-20261030.js';
import { forecast as phxTransferForecast, transferStatus as phxTransferStatus } from './phx-transfer-forecast-20261101.js';
import { mountRuleDraftEditor } from './phx-transfer-rules-editor-20261101.js';
import { formatPlayerNumber, formatPlayerUtc, formatPlayerSection, playerLookupError, playerRankingRows, rankingLabels, canonicalRankingName, playerRankingMap, rankingSourceText, playerSummaryMetrics, formatCastle, compactPower } from './transfer-id-display-20261030.js';
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
removeCandidateButton.type='button';removeCandidateButton.textContent='Kandidat entfernen';
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
let internalPlayers=null,internalPowers=[],internalSnapshot='',internalLoading=false;
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
 const matches=(internalPlayers||[]).filter(p=>(!alliance||(p.alliance_tag||'No alliance')===alliance)&&(!query||[p.player_name,p.governor_id].some(v=>normal(v).includes(query))));
 const chosen=(internalPlayers||[]).find(p=>String(p.uid||p.player_name)===selected),pinned=chosen&&!matches.includes(chosen);
 select.replaceChildren();
 const append=p=>{const option=document.createElement('option');option.value=String(p.uid||p.player_name);option.textContent=p.player_name+' · '+(p.alliance_tag||'—');select.append(option);};
 if(pinned)append(chosen);
 for(const p of matches)append(p);
 if(chosen)select.value=selected;
 select.disabled=!select.options.length;
 $('internalFilterStatus').textContent=matches.length+' matches / '+(internalPlayers||[]).length+' available'+(pinned?' · Selected player kept outside filter':'');
}
$('internalSearch').oninput=()=>renderInternalChoices();
$('internalAlliance').onchange=()=>renderInternalChoices();
function comparisonBrief(external,inside){
 const keys=['personal_power','master_power','pet_power','hero_total','coliseum','forest_of_life','crystal_cave','knowledge_nexus','molten_fort','radiant_spire'];
 const number=x=>x===null||x===undefined||String(x).trim()===''||!['number','string'].includes(typeof x)?null:Number.isFinite(Number(x))&&Number(x)>=0?Number(x):null;
 const pairs=keys.map(k=>({key:k,a:number(external[k]?.value),b:number(inside[k]?.value)})).filter(x=>x.a!==null&&x.b!==null);
 const higher=pairs.filter(x=>x.a>x.b),lower=pairs.filter(x=>x.a<x.b),same=pairs.length-higher.length-lower.length;
 const list=items=>items.slice(0,2).map(x=>boardLabels[x.key]||x.key).join(', ')+(items.length>2?' (+'+(items.length-2)+')':'');
 const power=pairs.find(x=>x.key==='personal_power'),percent=power&&power.b>0?100*(power.a-power.b)/power.b:null;
 const powerText=percent===null?'':(' Total Power '+(percent>=0?'+':'')+percent.toFixed(1)+'% vs selected player.');
 return {count:pairs.length,higher,lower,same,text:pairs.length?pairs.length+'/10 priority values on both sides.'+powerText+(higher.length?' Higher values: '+list(higher)+'.':'')+(lower.length?' Lower values: '+list(lower)+'.':'')+(same?' Equal: '+same+'.':''):'Insufficient shared values for a comparison.'};
}
function renderExternalIntel(){
 const box=$('externalIntelResult'),candidate=players.find(p=>p.candidate_id===active);
 if(!candidate){box.textContent='Select a candidate from your board first.';return;}
 if(internalLoading){box.textContent='Loading protected Kingdom #1885 data…';return;}
 if(!internalPlayers){box.textContent='Selected: '+candidate.player_name+'. Load the latest available #1885 rankings or enter an internal Kingshot Player ID.';return;}
 const internal=internalPlayers.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value);
 if(!internal){box.textContent='Select an internal player to compare.';return;}
 const evidence=evidenceFor(candidate),external=rankingMap(evidence?.ranks?.values),inside=internal.rankings||{};
 const header=document.createElement('strong');header.textContent=candidate.player_name+' (KD '+(candidate.kingdom||'?')+') ↔ '+internal.player_name+' (#1885)';box.replaceChildren(header);
 const note=text=>{const p=document.createElement('p');p.textContent=text;box.append(p);};
 const brief=comparisonBrief(external,inside),assessment=document.createElement('p');assessment.className='comparison-brief';assessment.textContent=brief.text+' Higher scores do not establish combat superiority.';box.append(assessment);
 const sourceDetails=document.createElement('details'),sourceSummary=document.createElement('summary'),sourceText=document.createElement('p');sourceDetails.className='comparison-method';sourceSummary.textContent='Sources, coverage & interpretation';sourceText.textContent='Candidate capture '+formatPlayerUtc(evidence?.source_cached_at)+'; #1885 capture '+(internal.captured_at||formatPlayerUtc(internalSnapshot))+'. Request time is not capture time. Each rank belongs to its own kingdom and is not directly comparable across kingdoms. Missing Top-100 entries are unknown, never zero or rank 101. Scores are not verified trial stages or battle predictions. The player list covers available Top-100 boards, not a complete census.';sourceDetails.append(sourceSummary,sourceText);box.append(sourceDetails);
 if(evidencePending.has(evidenceKey(candidate)))note('Loading current candidate rankings…');
 if(evidenceErrors.has(evidenceKey(candidate)))note('Current candidate refresh failed: '+evidenceErrors.get(evidenceKey(candidate))+'. Saved evidence remains visible.');
 if(!external.personal_power&&candidate.power_m!=null)note('Saved candidate Total Power: '+fmt(candidate.power_m)+'M (stored profile; current ranking value unavailable).');
 const rows=[];for(const key of new Set([...Object.keys(boardLabels),...Object.keys(external),...Object.keys(inside)])){
  const a=external[key],b=inside[key];
  rows.push([boardLabels[key]||key,a,b]);
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
 table.append(body);wrap.append(table);box.append(wrap);

}
$('loadInternal').onclick=async()=>{
 if(internalLoading)return;
 internalLoading=true;$('loadInternal').disabled=true;renderExternalIntel();
 try{
  const {data:{session},error}=await db.auth.getSession();
  if(error||!session?.access_token)throw Error('Sign in with your approved NEXUS account first.');
  const response=await fetch(SUPABASE_URL+'/functions/v1/phalanx-transfer-intelligence-stage-20261031',{method:'GET',
    headers:{apikey:KEY,Authorization:'Bearer '+session.access_token},cache:'no-store'});
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'Protected intelligence unavailable.');
  internalPlayers=Array.isArray(data.observations)?data.observations:[];
  internalPowers=Array.isArray(data.power_references)?data.power_references:[];
  internalSnapshot=data.snapshot_date||'';
  $('loadInternal').textContent='Refresh #1885 players ('+internalPlayers.length+')';
  const previous=$('internalGovernor').value;
  refreshInternalFilters();
  const selected=internalPlayers.find(p=>String(p.uid||p.player_name)===previous)||internalPlayers.find(p=>p.player_name==='FaQu')||internalPlayers[0];
  renderInternalChoices(selected?String(selected.uid||selected.player_name):'');
  loadCandidateEvidence(players.find(p=>p.candidate_id===active));
  if(!internalPlayers.length)throw Error('No verified internal player records available.');
 }catch(error){internalPlayers=null;internalPowers=[];$('externalIntelResult').textContent='Comparison data unavailable: '+(error?.message||'Unknown error');}
 finally{internalLoading=false;$('loadInternal').disabled=false;if(internalPlayers)renderExternalIntel();}
};
$('internalGovernor').onchange=async()=>{
 renderExternalIntel();const selected=internalPlayers?.find(p=>String(p.uid||p.player_name)===$('internalGovernor').value);
 if(!selected?.governor_id)return;
 const selectedKey=$('internalGovernor').value;
 try{const payload=await readPlayer(String(selected.governor_id));if(payload.player?.kingdom!==1885)throw Error('Player kingdom has changed.');
 selected.rankings=rankingMap(payload.ranks?.values);selected.captured_at=formatPlayerUtc(payload.source?.cachedAt);selected.player_name=payload.player.name;
 if($('internalGovernor').value===selectedKey)renderExternalIntel();
 }catch(e){if($('internalGovernor').value===selectedKey){renderExternalIntel();const note=document.createElement('p');note.textContent='Current player refresh failed: '+e.message+'. Available ranking snapshot remains visible.';$('externalIntelResult').append(note);}}
};
$('internalIdForm').onsubmit=async e=>{
 e.preventDefault();const button=$('loadInternalId');if(button.disabled)return;button.disabled=true;
 try{const id=$('internalPlayerId').value.trim(),payload=await readPlayer(id);if($('internalPlayerId').value.trim()!==id)throw Error('Kingshot Player ID changed. Load the player again.');if(payload.player?.kingdom!==1885)throw Error('This player is not in Kingdom #1885.');
 const record={uid:String(payload.uid||id),governor_id:id,player_name:payload.player.name,alliance_tag:payload.player.alliance,rankings:rankingMap(payload.ranks?.values)};
 internalPlayers=internalPlayers||[];const index=internalPlayers.findIndex(p=>p.uid===record.uid);if(index>=0)internalPlayers[index]=record;else internalPlayers.push(record);
 refreshInternalFilters();renderInternalChoices(record.uid);
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
function restoreComparisonPanel(){if(comparisonPanel.parentNode!==comparisonHome)comparisonHome.append(comparisonPanel);}
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
  const heading=document.createElement('h3');heading.textContent='Kandidatenverwaltung';
  const button=document.createElement('button');button.type='button';button.textContent='Kandidat entfernen';
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
 details.className='ranking-source';summary.textContent=compact?'ⓘ':entry.source==='saved_snapshot'?'Saved snapshot':'Source & time';summary.title='Exact value, kingdom rank, source and capture time';source.textContent='Exact value: '+formatPlayerNumber(entry.value)+' · Kingdom rank: '+formatPlayerNumber(entry.kingdom_rank)+rankingSourceText(entry);details.append(summary,source);target.append(value);if(!compact)target.append(rank);target.append(details);
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
function phxField(label,value){const cell=document.createElement('div');cell.className='detail';const key=document.createElement('span');key.textContent=label;const val=document.createElement('b');val.textContent=value===null||value===undefined||value===''?'Not available':String(value);cell.append(key,val);phxIdResult.append(cell);return cell;}
function phxGroup(label){const heading=document.createElement('h4');heading.className='result-heading';heading.textContent=label;phxIdResult.append(heading);}
const phxSearchShell=document.createElement('div');phxSearchShell.id='phxSearchShell';phxSearchShell.hidden=true;phxSearchShell.style.cssText='display:none;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 12px;border:1px solid #b88a47;background:#081d2c;color:#f1d7a4;margin:10px 0';const phxSearchLabel=document.createElement('strong');const phxNewSearch=document.createElement('button');phxNewSearch.type='button';phxNewSearch.textContent='New Search';phxNewSearch.addEventListener('click',()=>{phxSearchShell.hidden=true;phxSearchShell.style.display='none';phxIdForm.hidden=false;phxIdForm.style.display='';phxIdForm.querySelector('input')?.focus();});phxSearchShell.append(phxSearchLabel,phxNewSearch);phxIdForm.parentNode.insertBefore(phxSearchShell,phxIdForm);
phxIdForm.addEventListener('submit',async e=>{
 e.preventDefault();if(phxIdForm.querySelector('button').disabled)return;phxIdResult.replaceChildren();$('phxReview').hidden=true;clearLookupCandidate();
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
  const payload=await response.json();if($('phxGovernorId').value.trim()!==id){phxIdStatus.textContent='Kingshot Player ID changed. Load player data again.';return;}if(payload.ok!==true||String(payload.governorId)!==id)throw Error('Player identity could not be confirmed.');const p=payload.player||{};$('phxReview').hidden=false;
  const identity=document.createElement('div');identity.className='player-identity';identity.textContent=[p.name||p.playerName||p.player_name,p.alliance,'#'+p.kingdom].filter(Boolean).join(' · ');identity.classList.add('phx-player-hero');
  const name=document.createElement('div');name.className='phx-hero-name';name.textContent=p.name||p.playerName||p.player_name||'Unknown player';
  const castleValue=playerSummaryMetrics(payload.ranks?.values,{power:p.power,captured_at:payload.source?.cachedAt}).find(m=>m.key==='castle');
  const castle=document.createElement('div');castle.className='phx-hero-castle';castle.textContent=castleValue?.text&&castleValue.text!=='Not available'?'✦ '+castleValue.text+' ✦':'Castle: nicht verfügbar';
  const sub=document.createElement('div');sub.className='phx-hero-meta';sub.textContent=[p.alliance,'Kingdom #'+p.kingdom,'ID '+id].filter(Boolean).join(' · ');
  identity.replaceChildren(name,sub);phxIdResult.append(identity);
  const headline=document.createElement('div');headline.className='headline-metrics';renderHeadlineMetrics(headline,{player:p,source_cached_at:payload.source?.cachedAt,ranks:payload.ranks},{});
  // Full metric data remains available in the ranking and evidence sections.
  for(const key of ['master_power','pet_power','hero_total','castle'])headline.querySelector('[data-metric="'+key+'"]')?.remove();
  const castleMetric=document.createElement('div');castleMetric.className='phx-castle-metric';castleMetric.innerHTML='<span>Castle / TG</span>';const castleLevel=document.createElement('strong');castleLevel.textContent=castleValue?.text&&castleValue.text!=='Not available'?castleValue.text:'Not available';castleMetric.append(castleLevel);headline.append(castleMetric);phxIdResult.append(headline);
  const assessment=assessAccount(p,playerRankingMap(payload.ranks?.values));
  mountStrategicProfile(phxIdResult,playerRankingMap(payload.ranks?.values));
  // Legacy role intelligence remains in source for rollback, but is not mounted: the central dossier is authoritative.
  const makeSection=(heading,description)=>{const section=document.createElement('section');section.className='phx-scout-section';const h=document.createElement('h4');h.textContent=heading;section.append(h);if(description){const p=document.createElement('p');p.className='phx-scout-muted';p.textContent=description;section.append(p);}phxIdResult.append(section);return section;};
  const rankEvidence=[...assessment.rankingEvidence].sort((a,b)=>a.rank-b.rank);
  const combatEvidence=classifyCombatProfile(p,playerRankingMap(payload.ranks?.values));
  const accountNote=makeSection('PHALANX Account Assessment','');accountNote.classList.add('phx-verdict-card');
  const seaMap=playerRankingMap(payload.ranks?.values);
  const seaRanks={};
  for(const key of ['mystic_trial','hero_total','hero_equip','gov_gear','gov_charm','master_power','pet_power','research_power']){
   const n=Number(seaMap[key]?.kingdom_rank);
   if(seaMap[key]?.kingdom_rank!=null&&Number.isInteger(n)&&n>=1&&n<=100)seaRanks[key]=n;
  }
  const trueMetric=playerSummaryMetrics(payload.ranks?.values,{power:p.power,captured_at:payload.source?.cachedAt}).find(m=>m.key==='true_power');
  const seaWorld=seaWorldVerdict(p,{scope:'top25_provisional',ranks:seaRanks,truePower:trueMetric?.calculated?trueMetric.value:null});
  const rating=document.createElement('div');rating.className='phx-sea-rating';rating.setAttribute('aria-label','Provisional account rating');
  // The verdict must stay in document flow on narrow screens, even if legacy theme CSS positions rating badges absolutely.
  rating.style.setProperty('position','static','important');rating.style.setProperty('inset','auto','important');rating.style.setProperty('transform','none','important');rating.style.setProperty('float','none','important');rating.style.setProperty('display','block','important');rating.style.setProperty('width','100%','important');rating.style.setProperty('max-width','100%','important');rating.style.setProperty('min-width','0','important');rating.style.setProperty('box-sizing','border-box','important');rating.style.setProperty('white-space','normal','important');rating.style.setProperty('overflow-wrap','anywhere','important');rating.style.setProperty('text-align','center','important');rating.style.setProperty('font-size','clamp(1rem, 4vw, 1.5rem)','important');rating.style.setProperty('line-height','1.3','important');
  const tierNames={mega_whale:'Mega Whale',whale:'Whale',orca_elite:'Orca Elite',orca:'Orca',strong:'Strong',solid:'Solid',developing:'Developing'};
  const coverage='';
  // A missing metric must not promote an account into an unverified higher tier.
  const selectedTier=seaWorld.status==='PROVISIONAL_RANGE'?seaWorld.lowerTier:seaWorld.tier;
  const selectedScore=seaWorld.status==='PROVISIONAL_RANGE'?seaWorld.scoreLower:seaWorld.scoreLower;
  const nextThreshold={developing:40,solid:55,strong:70,orca:85,orca_elite:90,whale:98};
  const nearPromotion=Number.isFinite(selectedScore)&&Number.isFinite(nextThreshold[selectedTier])&&selectedScore>=nextThreshold[selectedTier]-3;
  const tierLabel=(tierNames[selectedTier]||'Rating not available')+(nearPromotion?'+':'');
  const tierStars={mega_whale:'★★★★★',whale:'★★★★★',orca_elite:'★★★★☆',orca:'★★★★☆',strong:'★★★☆☆',solid:'★★☆☆☆',developing:'★☆☆☆☆'};
  const ratingRange=(tierStars[selectedTier]?tierStars[selectedTier]+' · ':'')+(['orca_elite','mega_whale'].includes(selectedTier)?'◆ ':'')+tierLabel;
  rating.textContent=ratingRange+coverage;
  accountNote.prepend(rating);
  if(seaWorld.status==='PROVISIONAL_RANGE'){
   const uncertainty=document.createElement('p');uncertainty.className='phx-scout-muted';uncertainty.style.cssText='margin:.4rem 0 .8rem;max-width:100%;overflow-wrap:anywhere;font-size:.9rem;line-height:1.4';
   const scoreRange=Number.isFinite(seaWorld.scoreLower)&&Number.isFinite(seaWorld.scoreUpper)?seaWorld.scoreLower.toFixed(2)+'–'+seaWorld.scoreUpper.toFixed(2)+' / 100':'not available';
   const missingNames={mystic_trial:'Mystic Trial',hero_total:'Hero Power',hero_equip:'Hero Equipment',gov_gear:'Governor Gear',gov_charm:'Governor Charms',master_power:'Master Power',pet_power:'Pet Power',research_power:'Research Power',true_power:'True Power'};
   const missingList=Array.isArray(seaWorld.missing)?seaWorld.missing.map(k=>missingNames[k]||k).join(', '):'not available';
   uncertainty.textContent='Provisional score: '+scoreRange+' · Data coverage: '+seaWorld.coveragePct+'% · Missing rating evidence: '+(missingList||'none')+'. The final tier depends on missing evidence.';
   rating.after(uncertainty);
  }
  const rules=document.createElement('details');rules.className='phx-scout-muted';
  const rulesTitle=document.createElement('summary');rulesTitle.textContent='ⓘ Rating Method & Data Coverage';rules.append(rulesTitle);
  const rulesText=document.createElement('p');rulesText.textContent='Provisional weighted rating: Mystic Trial (20%), Master Power (15%), Hero Power (10%), Hero Equipment (10%), Governor Gear (10%), Governor Charms (10%), Pet Power (7.5%), Research (7.5%), True Power (10%). Missing data does not mean poor performance. Stars represent the conservatively supported tier; missing evidence and provisional ranges are disclosed separately. Thresholds and reference scope remain provisional.';rules.append(rulesText);const coverageInfo=document.createElement('p');coverageInfo.textContent='Data coverage: '+(Number.isFinite(seaWorld.coveragePct)?seaWorld.coveragePct+'%':'not available')+'. Coverage measures available evidence, not player strength.';rules.append(coverageInfo);
  accountNote.append(rules);
  const summaryTitle=document.createElement('strong');summaryTitle.className='phx-scout-verdict';summaryTitle.textContent=rankEvidence.length>=10?'Broad documented ranking profile':rankEvidence.length?'Partial ranking profile':'Insufficient ranking evidence';accountNote.append(summaryTitle);
  const combatNote=document.createElement('p');combatNote.className='phx-scout-muted';
  combatNote.textContent='KvK-style evidence check: '+combatEvidence.profile+' · '+combatEvidence.coverage+' comparable category rankings. '+combatEvidence.roleAssessment+'.';
  accountNote.append(combatNote);
  if(combatEvidence.documentedStrengths.length){
   const combatStrengths=document.createElement('p');combatStrengths.className='phx-scout-muted';
   combatStrengths.textContent='Documented Top-10 category placements: '+combatEvidence.documentedStrengths.join(' · ')+'.';
   accountNote.append(combatStrengths);
  }
  // KvK deployment decisions are relative to the selected destination alliance, never to an opponent.
  // No joiner grading, event-leader inference, or fabricated role ranks.
  const destinationAlliance=String($('internalAlliance')?.value||'NXS').trim()||'NXS';
  const alliancePeers=Array.isArray(internalPlayers)?internalPlayers.filter(x=>String(x.alliance_tag||'').trim().toUpperCase()===destinationAlliance.toUpperCase()):[];
  const deployment=document.createElement('section');deployment.className='phx-scout-section phx-kvk-deployment';
  const deploymentTitle=document.createElement('h4');deploymentTitle.textContent='KvK Battles · '+destinationAlliance+' deployment';deployment.append(deploymentTitle);
  const deploymentInfo=document.createElement('p');deploymentInfo.className='phx-scout-muted';
  deploymentInfo.textContent=alliancePeers.length
    ?'Available '+destinationAlliance+' comparison records: '+alliancePeers.length+'. Candidate is assessed as a potential addition; opponents and alliance events are excluded.'
    :'No current '+destinationAlliance+' comparison cohort loaded. Load the #1885 player list and select the destination alliance before assigning any KvK leadership position.';
  deployment.append(deploymentInfo);
  const deploymentRoles=document.createElement('p');deploymentRoles.className='phx-scout-muted';
  deploymentRoles.textContent='KvK Rally Leader: not verified · KvK Garrison Leader: not verified. Account tier alone does not establish role suitability; verified, comparable role-specific evidence and an alliance-relative ranking are required.';
  deployment.append(deploymentRoles);
  const deploymentPolicy=document.createElement('p');deploymentPolicy.className='phx-scout-muted';
  deploymentPolicy.textContent='Deployment priority is determined by the best available accounts within the destination alliance, not the opponent. No Rally Joiner score or alliance-event leader score.';
  deployment.append(deploymentPolicy);accountNote.append(deployment);
  const summaryGrid=document.createElement('div');summaryGrid.className='phx-scout-facts';
  for(const [label,value] of [['Verified rankings',String(rankEvidence.length)],['Best kingdom rank',rankEvidence.length?'#'+rankEvidence[0].rank:'Not available']]){const cell=document.createElement('div');const k=document.createElement('span');k.textContent=label;const v=document.createElement('strong');v.textContent=value;cell.append(k,v);summaryGrid.append(cell);}
  accountNote.append(summaryGrid);
  const summaryEvidence=document.createElement('p');summaryEvidence.className='phx-scout-muted';summaryEvidence.textContent=rankEvidence.length?'Strongest documented placements: '+rankEvidence.slice(0,3).map(x=>x.key.replaceAll('_',' ')+' #'+x.rank).join(' · ')+'.':'No verified kingdom ranking available.';accountNote.append(summaryEvidence);
  const decision=document.createElement('p');decision.className='phx-scout-decision';decision.textContent=rankEvidence.length>=10?'Account development is documented across multiple rankings. Compare category strengths and dated alliance placement before a transfer decision.':rankEvidence.length?'Some account development is documented, but the evidence remains incomplete.':'Insufficient data for a reliable account assessment.';accountNote.append(decision);
  const strengths=document.createElement('p');strengths.className='phx-scout-muted';strengths.textContent=rankEvidence.length?'Best documented category: '+rankEvidence[0].key.replaceAll('_',' ')+' · kingdom #'+rankEvidence[0].rank+'.':'No documented ranking strength yet.';accountNote.append(strengths);
  const gaps=document.createElement('p');gaps.className='phx-scout-muted';gaps.textContent='Unverified: actual KvK performance, rally and garrison suitability. Missing evidence is not a proven weakness.';accountNote.append(gaps);
  const caution=document.createElement('p');caution.className='phx-scout-muted';caution.textContent='Rankings describe available account development, not proven rally leadership, garrison performance or KvK outcomes.';accountNote.append(caution);
  identity.style.order='-6';headline.style.order='-5';accountNote.style.order='-4';const pylon=phxIdResult.querySelector('.phx-event-intelligence');if(pylon)pylon.style.order='-3';
  const detail=document.createElement('details');detail.className='phx-scout-deep-dive';const detailLabel=document.createElement('summary');detailLabel.textContent='Detailed assessment & evidence';detail.append(detailLabel);while(accountNote.children.length>3)detail.append(accountNote.children[3]);for(const node of [...detail.children])if(node.classList?.contains('phx-scout-decision')||node.classList?.contains('phx-scout-verdict'))accountNote.append(node);accountNote.append(detail);
  const intel=document.createElement('section');intel.className='phx-scout-section phx-player-intel-card';intel.style.order='-7';
  const intelHead=document.createElement('div');intelHead.className='phx-intel-head';
  const intelPlayer=document.createElement('div');intelPlayer.innerHTML='<small>PHALANX · PLAYER INTELLIGENCE</small>';const intelName=document.createElement('h3');intelName.textContent=name.textContent;const intelMeta=document.createElement('p');intelMeta.textContent=sub.textContent;intelPlayer.append(intelName,intelMeta);
  const intelRating=document.createElement('div');intelRating.className='phx-intel-rating';const ratingParts=rating.textContent.split(' · ');const ratingStars=document.createElement('strong');ratingStars.textContent=ratingParts.length>1?ratingParts[0]:'';const ratingTier=document.createElement('span');ratingTier.textContent=ratingParts.length>1?ratingParts.slice(1).join(' · '):ratingParts[0];intelRating.append(ratingStars,ratingTier);ratingTier.className='phx-rating-shield';
  const legend=document.createElement('details');legend.className='phx-sea-world-legend';legend.style.cssText='margin-top:8px;font-size:12px;text-align:center;width:100%';
  const toggle=document.createElement('summary');toggle.textContent='ⓘ Bewertungsskala anzeigen';toggle.style.cssText='cursor:pointer;color:#b6c5ce;text-align:center;font-weight:400';
  const panel=document.createElement('div');panel.style.cssText='margin-top:8px;padding:10px;border:1px solid #a98749;border-radius:8px;background:#0b1b27;color:#eee;line-height:1.6';
  const levels=[['★★★★★ ◆','Mega Whale','98–100'],['★★★★★','Whale','90–<98'],['★★★★☆ ◆','Orca Elite','85–<90'],['★★★★☆','Orca','70–<85'],['★★★☆☆','Strong','55–<70'],['★★☆☆☆','Solid','40–<55'],['★☆☆☆☆','Developing','0–<40']];
  for(const [stars,name,range] of levels){const line=document.createElement('div');line.textContent=stars+' · '+name+' · '+range+' Punkte';panel.append(line);}
  const note=document.createElement('small');note.textContent='PYLON IX · Account-Bewertung · vorläufige Top-25-Referenz, keine kingdomweite Kalibrierung. Sterne nur bei ausreichender Datenlage; keine Aussage über Kampfeignung.';note.style.cssText='display:block;margin-top:8px';panel.append(note);
  const plusNote=document.createElement('small');plusNote.textContent='◆ kennzeichnet Orca Elite und Mega Whale. Ein + hinter dem Kategorienamen bedeutet: innerhalb der aktuellen Kategorie höchstens 3 Punkte von der nächsten Stufe entfernt. Bei fehlenden Daten gilt die konservativ belegte Stufe; Unsicherheit wird separat ausgewiesen.';panel.append(plusNote);legend.append(toggle,panel);intelHead.append(intelPlayer,intelRating);intel.append(intelHead);
  // TG-peer True Power comparison: only measured, dated, same-capture evidence.
  // A partial leaderboard is not a representative census; do not color without a valid peer cohort.
  const truePowerPeerRating=(()=>{
   const castle=playerSummaryMetrics(payload.ranks?.values,{power:p.power,captured_at:payload.source?.cachedAt}).find(m=>m.key==='castle');
   if(!trueMetric?.calculated||!Number.isFinite(trueMetric.value)||!castle?.text||castle.text==='Not available')return null;
   const ownTG=castle.text.match(/^TG(\d+) (\d)\/5$/);
   if(!ownTG||!Array.isArray(internalPlayers))return null;
   const peers=internalPlayers.filter(x=>x&&x.true_power_verified===true&&Number.isFinite(Number(x.true_power))&&Number(x.true_power)>=0&&typeof x.captured_at==='string'&&x.captured_at.length>0&&typeof x.castle_level==='string'&&/^TG\d+ [0-5]\/5$/.test(x.castle_level));
   const evaluate=(list,scope)=>{
    if(list.length<5)return null;
    const times=new Set(list.map(x=>x.captured_at));
    if(times.size!==1)return null;
    const values=list.map(x=>Number(x.true_power)).sort((a,b)=>a-b);
    const percentile=values.filter(n=>n<=trueMetric.value).length/values.length;
    const color=percentile>=.85?'#4ADE80':percentile>=.60?'#38BDF8':percentile>=.20?'#FACC15':'#FB7185';
    const title=percentile>=.85?'Sehr stark':percentile>=.60?'Stark':percentile>=.20?'Durchschnittlich':'Schwach';
    return {color,title,count:values.length,scope,percentile:Math.round(percentile*100),capture:[...times][0]};
   };
   const exact=evaluate(peers.filter(x=>x.castle_level===castle.text),'gleiche TG-Ausbaustufe');
   return exact||evaluate(peers.filter(x=>x.castle_level.startsWith('TG'+ownTG[1]+' ')),'gleiche TG-Hauptstufe');
  })();
  const rankProfile=(()=>{
   const keys=['research_power','troop_power','hero_total','hero_equip','master_power','gov_gear','gov_charm','mystic_trial'];
   const ranks=keys.map(k=>Number(seaMap[k]?.kingdom_rank)).filter(n=>Number.isInteger(n)&&n>=1&&n<=100).sort((a,b)=>a-b);
   if(ranks.length<4)return null;
   const median=(ranks[Math.floor((ranks.length-1)/2)]+ranks[Math.floor(ranks.length/2)])/2;
   return {count:ranks.length,median,title:median<=10?'Sehr stark':median<=25?'Stark':median<=50?'Durchschnittlich':'Entwicklungsbedarf',color:median<=10?'#4ADE80':median<=25?'#38BDF8':median<=50?'#FACC15':'#FB7185'};
  })();
  const intelMetrics=document.createElement('div');intelMetrics.className='phx-intel-metrics';for(const metric of [...headline.children]){const cell=document.createElement('div');cell.className='phx-intel-metric';const label=metric.querySelector('span')?.textContent||'Castle / TG';const value=metric.querySelector('strong')?.textContent||'Not available';const k=document.createElement('small');k.textContent=label;const v=document.createElement('strong');v.textContent=value;if(label.toLowerCase().includes('true power')){
    // No verified TG-matched reference distribution is available in this response.
    // Keep the value neutral rather than inventing a comparative performance rating.
    v.classList.add('phx-true-power-value');
    if(truePowerPeerRating){v.style.color=truePowerPeerRating.color;v.title=truePowerPeerRating.title+' · Vergleich mit '+truePowerPeerRating.count+' Spielern ('+truePowerPeerRating.scope+')';}
    if(!truePowerPeerRating&&rankProfile){const hint=document.createElement('small');hint.textContent='Profil: '+rankProfile.title;hint.style.color=rankProfile.color;hint.style.fontSize='.65rem';hint.title='Ranking-basierte Account-Einordnung, keine True-Power-Einstufung';cell.append(hint);}
    const help=document.createElement('details');help.className='phx-true-power-help';
    const summary=document.createElement('summary');summary.textContent='ⓘ';summary.title='Farbcode und Vergleichsbewertung';summary.setAttribute('aria-label','Farbcode und Vergleichsbewertung');summary.style.cssText='cursor:pointer;list-style:none;font-size:20px;width:25px;height:25px;display:flex;align-items:center;justify-content:center';
    const explanation=document.createElement('p');explanation.textContent='Grün = sehr stark · Blau = stark · Gelb = durchschnittlich · Rot = schwach. Die Einstufung erfolgt erst mit belastbaren Vergleichsdaten von Spielern mit ähnlichem TG-Level. Bis dahin bleibt die Zahl neutral; die Farbe ist keine Schätzung.';
    if(truePowerPeerRating)explanation.textContent+=' Aktuelle Einstufung: '+truePowerPeerRating.title+' (Perzentil '+truePowerPeerRating.percentile+', '+truePowerPeerRating.count+' Vergleichsspieler, '+truePowerPeerRating.scope+', Datenstand '+truePowerPeerRating.capture+').';else explanation.textContent+=rankProfile?' Account-Profil: '+rankProfile.title+' aus '+rankProfile.count+' Rankings (Median-Rang '+rankProfile.median+'). Das ist KEINE True-Power-Einstufung. Für diese fehlen mindestens fünf verifizierte TG-Vergleichswerte.':' Derzeit keine ausreichende Vergleichsgruppe (mindestens 5 verifizierte True-Power-Messungen).';help.append(summary,explanation);cell.append(k,v,help);
   }else cell.append(k,v);intelMetrics.append(cell);}intel.append(intelMetrics);intel.append(legend);
  const intelBody=document.createElement('div');intelBody.className='phx-intel-body';const kicker=document.createElement('div');kicker.className='phx-dossier-brand';kicker.innerHTML='<strong>⚔ PYLON IX</strong><small>ZENTRALE ACCOUNT-BEWERTUNG</small>';const verdict=document.createElement('h4');verdict.textContent=rankEvidence.length>=10?'Elite account · Leadership potential':rankEvidence.length?'Developing account · Further review':'Insufficient ranking evidence';const narrative=document.createElement('p');
  const intelligenceRanks=playerRankingMap(payload.ranks?.values);
  const evidenceRank=k=>{const n=Number(intelligenceRanks[k]?.kingdom_rank);return Number.isInteger(n)&&n>=1&&n<=100?n:null;};
  const core=[['hero_total','heroes'],['troop_power','troops'],['hero_equip','equipment']];
  const coreTop=core.filter(([k])=>evidenceRank(k)!==null&&evidenceRank(k)<=10);
  const petRank=evidenceRank('pet_power');
  const strengthsText=coreTop.map(([k,label])=>label+' #'+evidenceRank(k)).join(', ');
  verdict.textContent=coreTop.length===3?'Ausgewogener Elite-Account · Rollenprüfung':coreTop.length>=2?'Mehrere Top-10-Stärken · Rollenprüfung':coreTop.length===1?'Eine belegte Top-10-Stärke':'Keine belastbare taktische Einordnung möglich';
  narrative.textContent=coreTop.length>=2?'Breite Account-Entwicklung: '+strengthsText+'. '+(petRank!==null?'Pets auf Platz '+petRank+' – relativ zu den Spitzenwerten prüfen.':'Pet-Daten fehlen.')+' Kampfstärke nicht bestätigt.':coreTop.length===1?'Belegte Stärke: '+strengthsText+'. Für eine Rollenempfehlung fehlen weitere Nachweise.':'Die verfügbaren Rankings reichen für eine verlässliche Bewertung nicht aus.';
  const ranked=[['Helden','hero_total'],['Truppen','troop_power'],['Ausrüstung','hero_equip'],['Pets','pet_power'],['Master Power','master_power'],['Forschung','research_power']].map(([label,key])=>({label,key,rank:evidenceRank(key)}));
  const known=ranked.filter(x=>x.rank!==null).sort((a,b)=>a.rank-b.rank);
  const strong=known.filter(x=>x.rank<=10);
  const developing=known.filter(x=>x.rank>10).sort((a,b)=>b.rank-a.rank);
  const strengthText=strong.length?strong.slice(0,3).map(x=>x.label+' #'+x.rank).join(' · '):known.length?'Bester dokumentierter Bereich: '+known[0].label+' #'+known[0].rank:'Keine belastbaren Rankings';
  const relativeGap=developing.length&&strong.length&&developing[0].rank-strong[0].rank>=8?developing[0]:null;
  verdict.textContent=strong.length>=3?'Breit entwickelter Elite-Account mit Führungspotenzial':strong.length>=2?'Starker Account mit möglichem Führungspotenzial':strong.length===1?'Spezialisierter Account mit klarer Stärke':known.length?'Accountprofil noch nicht eindeutig':'Datenlage für Bewertung unzureichend';
  narrative.textContent=strong.length>=3?'Der Account gehört in '+strengthText+' zur Spitzengruppe. Seine Stärke ist die gleichmäßige Entwicklung dieser Kernbereiche. '+(relativeGap?'Die '+relativeGap.label+'-Entwicklung (#'+relativeGap.rank+') fällt im internen Vergleich zurück.':'In den bekannten Rankings zeigt sich keine ausgeprägte Entwicklungslücke.'):strong.length?'Besonders auffällig: '+strengthText+'. '+(relativeGap?relativeGap.label+' (#'+relativeGap.rank+') bleibt relativ zu den stärksten Bereichen zurück.':'Weitere Entwicklungsfelder sind nicht gesichert.'):'Die vorhandenen Rankings erlauben noch kein belastbares Gesamtprofil.';
  const recommendation=document.createElement('div');recommendation.className='phx-achilles-recommendation';
  const recommendationTitle=document.createElement('strong');recommendationTitle.textContent='Taktische Einschätzung';
  const recommendationText=document.createElement('p');
  const leadershipEvidence=['hero_total','troop_power','hero_equip'].filter(k=>evidenceRank(k)!==null&&evidenceRank(k)<=10).length;
  const troop=evidenceRank('troop_power'),hero=evidenceRank('hero_total'),equip=evidenceRank('hero_equip');
  recommendationText.textContent=leadershipEvidence>=3?'Interessanter Kandidat für die Führung wichtiger Rallys und anspruchsvolle KvK-Einsätze. Ob seine Vorteile eher im Angriff oder in der Garnison liegen, muss anhand der Kampfbuffs bestätigt werden.':leadershipEvidence>=2?'Die starke Entwicklung mehrerer Kernbereiche macht den Spieler für wichtige KvK-Aufgaben interessant. Eine Führungsrolle ist möglich, aber erst mit passenden Kampfbuffs und Gefechtsberichten belegbar.':troop!==null&&troop<=15?'Die Truppenentwicklung spricht für einen möglichen KvK-Einsatz. Für eine Rally- oder Garnisonsführung fehlen derzeit belastbare Nachweise.':'Eine bevorzugte Kampfrolle ist derzeit nicht belegbar. Zuerst Einsatzprofil und Gefechtsdaten klären.';
  const conclusion=document.createElement('p');conclusion.className='phx-scout-conclusion';conclusion.textContent=leadershipEvidence>=3?'Empfehlung für die Allianzführung: Als potenziellen Kernspieler einordnen und gezielt auf Rally-Führung prüfen. Eine feste Rolle erst nach Sichtung aktueller Gefechtsdaten vergeben.':leadershipEvidence>=2?'Empfehlung für die Allianzführung: Für wichtige KvK-Aufgaben vormerken und die passende Führungs- oder Unterstützungsrolle anhand der Kampfdaten bestimmen.':'Empfehlung für die Allianzführung: Weitere Account- und Kampfdaten einholen, bevor eine feste Rolle vergeben wird.';
  const evidenceDisclosure=document.createElement('details');evidenceDisclosure.className='phx-role-evidence-disclosure';
  const evidenceSummary=document.createElement('summary');evidenceSummary.textContent='Stärken und Entwicklungsfelder';evidenceDisclosure.append(evidenceSummary);
  recommendation.append(recommendationTitle,recommendationText,conclusion,evidenceDisclosure);
  const insight=document.createElement('div');insight.className='phx-intel-insights';
  for(const [label,value] of [['↗ Stärken',strengthText],['◇ Entwicklungsfelder',relativeGap?relativeGap.label+' #'+relativeGap.rank+' · relativ zu den Spitzenbereichen':'Keine gesicherte Schwäche; Kampfnachweise fehlen']]){const cell=document.createElement('div');const heading=document.createElement('strong');heading.textContent=label;const body=document.createElement('p');body.textContent=value;cell.append(heading,body);insight.append(cell);}
  evidenceDisclosure.append(insight);intelBody.append(kicker,verdict,narrative,recommendation);intel.append(intelBody);
  const disclosure=document.createElement('details');const disclosureLabel=document.createElement('summary');disclosureLabel.textContent='Evidence-based · Provisional assessment';disclosure.append(disclosureLabel,rules,detail);intel.append(disclosure);
  identity.hidden=true;headline.hidden=true;accountNote.hidden=true;phxIdResult.append(intel);for(const [selector,title] of [['.phx-event-intelligence','Combat roles & supporting evidence']]){const section=phxIdResult.querySelector(selector);if(section){const fold=document.createElement('details');fold.className='phx-dossier-detail';const label=document.createElement('summary');label.textContent=title;fold.append(label,section);intel.append(fold);}}
  const profileSection=phxIdResult.querySelector('.phx-intel-profile');if(profileSection){profileSection.classList.add('phx-profile-visible');const profileHeading=profileSection.querySelector('h4');if(profileHeading)profileHeading.textContent='Stärkenprofil · Kingdom-Rankings';const profileExplanation=profileSection.querySelector('.phx-scout-muted');if(profileExplanation)profileExplanation.textContent='Balken zeigen den Rang im Kingdom, nicht die tatsächliche Kampfkraft. Platz 1 ist der beste Rang.';intelBody.append(profileSection);}
  const placementSection=makeSection('Allianzvergleich','Voraussichtliche Platzierung nach Gesamtstärke · keine bestätigte Kampfkraft');placementSection.classList.add('phx-placement-compact');intelBody.append(placementSection);
  const rosterNote=document.createElement('p');rosterNote.className='phx-scout-placement';rosterNote.setAttribute('aria-live','polite');rosterNote.textContent='Checking available alliance rosters…';placementSection.append(rosterNote);
  const eliteRoleTier=['whale','mega_whale','orca','orca_elite'].includes(seaWorld.tier);
  const rolesSection=makeSection('Potential Alliance Role','Indicative suitability, not verified battle performance.');rolesSection.hidden=true;
  const roleGrid=document.createElement('div');roleGrid.className='phx-scout-roles';
  for(const role of (eliteRoleTier?['Rally Leader','Garrison Attacker','Garrison Holder','KvK Fighter']:['Rally Leader','Garrison Attacker','Rally Joiner','Garrison Holder','KvK Fighter'])){const cell=document.createElement('div');const name=document.createElement('strong');name.textContent=role;const status=document.createElement('span');status.textContent=['whale','mega_whale','orca','orca_elite'].includes(seaWorld.tier)?'Priority candidate · combat evidence pending':'Combat evidence pending';cell.append(name,status);roleGrid.append(cell);}rolesSection.append(roleGrid);
  if(!document.getElementById('phx-scout-layout-style')){const style=document.createElement('style');style.id='phx-scout-layout-style';style.textContent=`
  #phxIdResult{display:flex;flex-direction:column;gap:14px}
  #phxIdResult>.phx-player-intel-card{background:#080b10;border:1px solid rgba(178,183,190,.28);border-radius:16px;padding:18px;color:#f3f4f6;font-family:Arial,Helvetica,sans-serif}
  .phx-intel-head{display:flex;justify-content:space-between;align-items:start;gap:12px}.phx-intel-head small,.phx-intel-body>small{font-size:.72rem;letter-spacing:.09em;color:#b5b9bd}.phx-intel-head h3{font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.8rem,6vw,2.3rem);font-weight:700;line-height:1.13;overflow-wrap:anywhere;min-width:0;margin:7px 0 2px;color:#f1c777}.phx-intel-head p{margin:0;color:#b7c5d0;font-size:.85rem}.phx-intel-rating{text-align:right;font-weight:700;color:#f1c777;max-width:45%;font-size:.9rem;display:flex;flex-direction:column;gap:4px;align-items:flex-end}.phx-intel-rating strong{font-size:1.4rem;white-space:nowrap}.phx-intel-rating span{font-size:.95rem;align-self:center}
  .phx-event-intelligence{border:1px solid #b98c45!important;background:linear-gradient(135deg,#0b1824,#1b1720 70%,#2d1c18)!important;box-shadow:inset 0 0 0 1px rgba(239,183,86,.16),0 3px 16px rgba(90,33,24,.2)}.phx-event-intelligence .phx-scout-module-details>summary{color:#f1c777!important;font-family:Georgia,serif;font-size:1.18rem;font-weight:700;letter-spacing:.02em;padding:9px 0;text-shadow:0 1px 7px rgba(225,145,51,.3)}
  .phx-dossier-brand{display:flex;flex-wrap:wrap;align-items:baseline;gap:5px 12px;margin-bottom:10px}.phx-dossier-brand>strong{font-family:Georgia,serif;color:#f0c77b;font-size:clamp(1.35rem,4vw,1.85rem);letter-spacing:.075em;text-shadow:0 2px 10px rgba(235,169,75,.25)}.phx-dossier-brand>small{font-size:.7rem;letter-spacing:.12em;color:#b6c5ce}
  .phx-intel-rating .phx-rating-shield{display:block;align-self:center;max-width:100%;box-sizing:border-box;padding:5px 15px;border:1px solid #d8aa57;border-radius:8px;background:linear-gradient(135deg,#142536,#253041,#142536);box-shadow:inset 0 0 9px rgba(241,199,119,.14),0 0 10px rgba(241,199,119,.12);font-family:Georgia,serif;font-size:1.08rem;font-weight:800;color:#f4cf88;text-align:center;letter-spacing:.035em}
  .phx-intel-rating .phx-sea-world-legend{max-width:100%}
  .phx-profile-visible{margin-top:18px;padding-top:16px;border-top:1px solid rgba(221,176,92,.5)}
  .phx-profile-visible .phx-intel-rank{margin:8px 0}
  .phx-profile-visible .phx-intel-rank-head{display:flex;justify-content:space-between;gap:12px}
  .phx-profile-visible .phx-intel-track{overflow:hidden}
  .phx-intel-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:18px 0;padding-bottom:18px;border-bottom:1px solid #8c6b3b}.phx-intel-metric{background:#242424;border-radius:12px;padding:10px 8px;min-width:0;display:flex;flex-direction:column;gap:5px;min-height:0}.phx-true-power-help summary::-webkit-details-marker{display:none}.phx-true-power-help p{font-size:12px;line-height:1.4;overflow-wrap:anywhere}.phx-intel-metric small{color:#b7c5d0;font-size:.72rem}.phx-intel-metric strong{font-size:clamp(.9rem,3.8vw,1.45rem);color:#f3d28d;white-space:nowrap}
  .phx-intel-body h4{font-size:1.15rem;margin:10px 0;color:#f1d29b}.phx-intel-body>p{font-size:.9rem;line-height:1.5;color:#e0d4bf;margin:8px 0 15px}.phx-intel-insights{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:14px}.phx-intel-insights>div{background:#242424;border-radius:12px;padding:11px;min-width:0}.phx-intel-insights strong{font-size:.85rem;color:#f1d29b}.phx-intel-insights p{font-size:.8rem;line-height:1.4;color:#c9d3da;margin:6px 0 0}.phx-player-intel-card summary{cursor:pointer;color:#b7c5d0;font-size:.85rem}

  #phxIdResult>.headline-metrics{order:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}
  .phx-castle-metric{display:flex;flex-direction:column;justify-content:center;gap:5px;min-width:0;padding:10px;color:#e7c483;border:1px solid rgba(194,151,74,.5);grid-column:auto;box-sizing:border-box}.phx-castle-metric span{font-size:.8rem;color:#aab9c8}.phx-castle-metric strong{font-size:1.25rem}
  .phx-verdict-card{border-color:#e5b967!important;background:linear-gradient(135deg,#102c3b,#061522)!important;box-shadow:0 0 22px rgba(202,148,61,.13)}.phx-verdict-card .phx-sea-rating{font-size:1.2rem;font-weight:800;color:#f6d48e}
  #phxIdResult>.phx-scout-section{width:100%;min-width:0;box-sizing:border-box;padding:16px;border:1px solid rgba(194,151,74,.6);background:rgba(5,24,39,.8);border-radius:5px}
  .phx-scout-section h4{margin:0 0 9px;color:#e7c483;font-size:1.1rem;letter-spacing:.025em}
  .phx-scout-muted{color:#aab9c8;font-size:.88rem;line-height:1.5;margin:6px 0 10px}
  .phx-scout-verdict{display:block;font-size:1.12rem;color:#f1d7a4;margin:10px 0}
  .phx-scout-facts,.phx-scout-roles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
  .phx-scout-facts>div,.phx-scout-roles>div{min-width:0;padding:10px;border:1px solid rgba(194,151,74,.3);display:flex;flex-direction:column;gap:6px;overflow-wrap:anywhere}
  .phx-scout-facts span,.phx-scout-roles span{color:#aab9c8;font-size:.78rem}
  .phx-scout-facts strong,.phx-scout-roles strong{color:#e7c483;font-size:.98rem}
  .phx-scout-placement{margin:8px 0;color:#f1d7a4;line-height:1.6;overflow-wrap:anywhere}
  .phx-placement-compact{margin-top:20px;border-top:1px solid #bd914a;padding-top:12px}
  .phx-placement-compact .phx-alliance-picker{width:100%;max-width:100%;padding:10px 12px;margin:8px 0;border:1px solid #bd914a;border-radius:8px;background:#0b2230;color:#f1c87b;font-weight:700}
  .phx-placement-compact .phx-alliance-grid{display:block}
  .phx-placement-compact .phx-alliance-row{display:flex;flex-wrap:wrap;align-items:center;gap:5px 14px;border:1px solid #bd914a;border-radius:10px;padding:12px 14px;max-width:100%;box-sizing:border-box}
  .phx-placement-compact .phx-alliance-row strong{font-size:1.1rem;color:#f1c87b;min-width:50px}
  .phx-placement-compact .phx-alliance-row span{font-size:1.2rem;font-weight:700;color:#f1c87b}
  .phx-placement-compact .phx-alliance-row small{flex-basis:100%;font-size:.79rem;color:#b8c8d2}
  #phxIdResult>details{width:100%;min-width:0;box-sizing:border-box}
  @media(max-width:700px){#phxIdResult>.headline-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.phx-castle-metric{padding:6px}.phx-castle-metric strong{font-size:1rem}.phx-scout-facts,.phx-scout-roles{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}#phxIdResult>.phx-scout-section{padding:12px}.phx-scout-section h4{font-size:1rem}.phx-scout-muted{font-size:.82rem;line-height:1.4}}
  `;document.head.append(style);}
  const rawPower=p.power??p.totalPower??p.total_power??playerRankingMap(payload.ranks?.values).personal_power?.value;
  if(rawPower==null||rawPower===''){rosterNote.textContent='Historical placement unavailable: total player power missing.';}
  else {
   const alliances=['NXS','OoO','MYM','FRA'];
   const results=await Promise.all(alliances.map(async alliance=>{
    const latest=await db.from('phalanx_alliance_players').select('snapshot_date').eq('kingdom',1885).eq('alliance',alliance).order('snapshot_date',{ascending:false}).limit(1);
    if(latest.error)return {alliance,status:'Access unavailable'};
    const date=latest.data?.[0]?.snapshot_date;
    if(!date)return {alliance,status:'No historical snapshot'};
    const rows=[];
    for(let offset=0;offset<10000;offset+=500){
     const page=await db.from('phalanx_alliance_players').select('power').eq('kingdom',1885).eq('alliance',alliance).eq('snapshot_date',date).range(offset,offset+499);
     if(page.error)return {alliance,status:'Access unavailable'};
     rows.push(...(page.data||[]));
     if((page.data||[]).length<500)break;
     if(offset===9500)return {alliance,status:'Roster exceeds safe limit'};
    }
    const placement=placeInAlliance(rawPower,rows,date);
    return placement.status==='HISTORICAL_POWER_PLACEMENT'?{alliance,status:'OK',rank:placement.rankMin,rankMax:placement.rankMax,total:placement.rosterSize,date,top15:placement.top15Guaranteed,gapAbove:placement.gapAbove,gapBelow:placement.gapBelow}:{alliance,status:'Insufficient historical data'};
   }));
   let liveUsed=false;
   try{
    const live=await db.rpc('phx_live_alliance_placement',{p_power:Math.round(Number(rawPower))});
    if(!live.error&&Array.isArray(live.data)&&live.data.length===4){
     for(const item of live.data){
      const old=results.find(x=>x.alliance===item.alliance);
      if(!old||!Number.isFinite(Number(item.rank)))continue;
      old.status='LIVE';old.rank=Number(item.rank);old.rankMax=old.rank;
      old.total=Number(item.covered);old.date=String(item.sourceCapturedAt||'');
      old.top15=old.rank<=15&&Boolean(item.guaranteed);
      old.gapAbove=null;old.gapBelow=null;old.scope='Kingdom Top 100';
      liveUsed=true;
     }
    }
   }catch(_err){/* historical fallback remains available */}
   rosterNote.textContent=liveUsed?'Aktueller verfügbarer Top-100-Datenstand · keine vollständigen Allianz-Kader.':'Historische Allianz-Daten · keine aktuelle Kampfkraft.';
   const grid=document.createElement('div');grid.className='phx-alliance-grid';const preferredAlliance=String(p.alliance||p.allianceTag||p.alliance_tag||'').trim().replace(/^\[|\]$/g,'').toUpperCase();results.sort((a,b)=>(a.alliance.toUpperCase()===preferredAlliance?-1:0)-(b.alliance.toUpperCase()===preferredAlliance?-1:0));
   for(const row of results){const item=document.createElement('div');item.className='phx-alliance-row';const name=document.createElement('strong');name.textContent=row.alliance;const position=document.createElement('span');position.textContent=(row.status==='OK'||row.status==='LIVE')?'#'+row.rank+(row.rankMax!==row.rank?'–'+row.rankMax:'')+(row.status==='LIVE'?' · '+row.total+' erfasst':' von '+row.total):'Keine ausreichenden Daten';const note=document.createElement('small');note.textContent=(row.status==='OK'||row.status==='LIVE')?(row.top15?'Top 15 · ':'Nicht sicher Top 15 · ')+(row.date?new Date(row.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}):'Datum unbekannt'):'Daten fehlen';item.append(name,position,note);if(row.status==='OK'){const gaps=document.createElement('small');gaps.textContent='Abstand nach oben: '+(row.gapAbove==null?'–':(row.gapAbove/1e6).toFixed(2)+' M')+' · nach unten: '+(row.gapBelow==null?'–':(row.gapBelow/1e6).toFixed(2)+' M');item.append(gaps);}grid.append(item);}placementSection.append(grid);
  }
  const all=document.createElement('details'),allSummary=document.createElement('summary'),allBody=document.createElement('div');all.className='complete-rankings';allSummary.textContent='All rankings ('+Object.keys(playerRankingMap(payload.ranks?.values)).length+')';all.append(allSummary,allBody);appendRankingEntries(allBody,payload.ranks?.values,'');intel.append(all);
  const arenaDetail=document.createElement('details'),arenaSummary=document.createElement('summary');arenaDetail.className='arena-details';arenaSummary.textContent='Arena Squad ('+(payload.arenaSquad?.heroes||[]).length+') · '+formatPlayerSection(payload.arenaSquad?.status);arenaDetail.append(arenaSummary,arenaList(payload.arenaSquad?.heroes||[]));intel.append(arenaDetail);
  const provenance=document.createElement('details'),provenanceSummary=document.createElement('summary');provenance.className='lookup-provenance';provenanceSummary.textContent='ⓘ Data Sources & Freshness';provenance.append(provenanceSummary);intel.append(provenance);const sourceGrid=document.createElement('div');sourceGrid.className='phx-source-grid';for(const [label,value] of [['Data source','Kingshot player data'],['Source captured (UTC)',formatPlayerUtc(payload.source?.cachedAt)],['Lookup time (UTC)',formatPlayerUtc(payload.checkedAtUtc)]]){const cell=document.createElement('div');const key=document.createElement('small');key.textContent=label;const val=document.createElement('strong');val.textContent=value??'Not available';cell.append(key,val);sourceGrid.append(cell);}provenance.append(sourceGrid);
  setPhxLookupState('success','✓ Player data loaded successfully. Review the details before adding this player to Candidates.');
  offerLookupCandidate(payload,id);
  phxSearchLabel.textContent=(p.name||p.player_name||p.nickname||'Player')+' · ID '+id;
  phxIdForm.hidden=true;phxIdForm.style.display='none';phxSearchShell.hidden=false;phxSearchShell.style.display='flex';
  $('phxReview').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(error){setPhxLookupState('error',error.name==='AbortError'?'The lookup timed out. Please try again later.':error instanceof TypeError?'Spielerabfrage nicht erreichbar. Bitte die Freigabe der Testadresse (CORS), Anmeldung und API-Verbindung prüfen; deine Internetverbindung ist nicht zwingend die Ursache.':error.message);}
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
 workspaceView=view;
 for(const id of ['scoutingBoard','phxIdPanel','workspace-tools'])$(id).hidden=id!==view;
 document.querySelector('main').dataset.workspaceView=view;
 document.querySelectorAll('.workspace-nav [data-view]').forEach(el=>{const on=el.dataset.view===view;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 syncWorkspace();
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
