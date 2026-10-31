import { candidateFromLookup, duplicateLookupFilter } from './transfer-id-candidate-20261030.js';
import { formatPlayerNumber, formatPlayerUtc, formatPlayerSection, playerLookupError, playerRankingRows, rankingLabels, canonicalRankingName, playerRankingMap, rankingSourceText } from './transfer-id-display-20261030.js';
const SUPABASE_URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(SUPABASE_URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>x==null?'–':Number(x).toLocaleString('en-US',{maximumFractionDigits:1});
let players=[],chosen=new Set(),active=null,canEdit=false;
// Display-only planning estimate; actual invitation eligibility must be checked in Kingshot.
const PREVIEW_POWER_CAP_M=170;
function invitationPreview(p){if(p.power_m===null||p.power_m===undefined||p.power_m==='')return 'To confirm';const n=Number(p.power_m);return !Number.isFinite(n)||n<0?'To confirm':n<=PREVIEW_POWER_CAP_M?'Ordinary (est.)':'Special (est.)';}
function showLogin(message=''){canEdit=false;$('login').hidden=false;$('private').hidden=true;$('message').textContent=message;}
function chosenPlayers(){return [...chosen].map(id=>players.find(p=>p.candidate_id===id)).filter(Boolean);}
function filtered(){const q=$('search').value.trim().toLowerCase();const list=players.filter(p=>[p.player_name,p.kingdom,p.alliance,p.contact_status,p.metadata?.role].some(v=>String(v??'').toLowerCase().includes(q)));const s=$('sort').value;return list.sort((a,b)=>s==='name'?a.player_name.localeCompare(b.player_name):s==='power'?Number(b.power_m||0)-Number(a.power_m||0):Date.parse(b.updated_at)-Date.parse(a.updated_at));}
function render(){
$('total').textContent=players.length;
$('contacted').textContent=players.filter(p=>['Contacted','Interested','Negotiating','Confirmed'].includes(p.contact_status)).length;
$('reviews').textContent=players.filter(p=>!p.contact_status||p.contact_status==='Needs Review').length;
$('kingdoms').textContent=new Set(players.map(p=>p.kingdom).filter(Boolean)).size;
const shown=filtered();$('count').textContent=shown.length+' of '+players.length+' saved candidates';$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';
$('rows').innerHTML=shown.map(p=>'<tr data-id="'+esc(p.candidate_id)+'" class="'+(active===p.candidate_id?'selected':'')+'"><td><input type="checkbox" data-check="'+esc(p.candidate_id)+'" '+(chosen.has(p.candidate_id)?'checked':'')+'></td><td><button type="button" class="scouting-name-button" data-dossier="'+esc(p.candidate_id)+'" aria-label="Open dossier for '+esc(p.player_name)+'">'+esc(p.player_name)+'</button></td><td>'+esc(p.kingdom||'–')+'</td><td>'+esc(p.alliance||'–')+'</td><td>'+esc(p.metadata?.role||'–')+'</td><td>'+esc(p.castle_level||'–')+'</td><td>'+fmt(p.power_m)+(p.power_m==null?'':'M')+'</td><td>'+esc(p.metadata?.fit==null?'–':p.metadata.fit+'%')+'</td><td>'+esc(invitationPreview(p))+'</td><td>'+esc(p.transfer_eligibility||'Unknown')+'</td><td>'+esc(p.contact_status||'–')+'</td></tr>').join('')||'<tr><td colspan="11" class="empty">No live candidates recorded. The protected scouting table is currently empty.</td></tr>';
$('rows').querySelectorAll('tr[data-id]').forEach(row=>row.onclick=()=>{active=row.dataset.id;render()});
$('rows').querySelectorAll('button[data-dossier]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();active=btn.dataset.dossier;openDossier()});
$('rows').querySelectorAll('input[data-check]').forEach(box=>{box.onclick=e=>e.stopPropagation();box.onchange=()=>{if(box.checked){if(chosen.size>=3){box.checked=false;$('count').textContent='Select up to 3 candidates';return;}chosen.add(box.dataset.check)}else chosen.delete(box.dataset.check);$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';}});
const p=players.find(x=>x.candidate_id===active);$('profileTitle').textContent=p?p.player_name:'Candidate profile';$('editCandidate').hidden=!canEdit||!p;$('openDossier').hidden=!p;
$('profile').innerHTML=p?'<div class="detail-grid">'+[['Kingdom',p.kingdom],['Alliance',p.alliance],['Power',p.power_m==null?'Not recorded':fmt(p.power_m)+'M'],['Castle',p.castle_level],['Contact',p.contact_status],['Invitation (170M preview)',invitationPreview(p)],['Eligibility',p.transfer_eligibility],['Recruiter',p.recruiter],['Role',p.metadata?.role]].map(([a,b])=>'<div class="detail"><span>'+esc(a)+'</span><b>'+esc(b||'–')+'</b></div>').join('')+'</div><h3>Notes</h3><div class="notes">'+esc(p.notes||'No notes recorded.')+'</div>':'<p class="empty">Select a candidate.</p>';
$('needs').innerHTML=['Rally Lead','Fighter','Joiner','R4 / R5 Potential'].map(role=>'<div><b>'+esc(role)+'</b><strong>'+players.filter(p=>p.metadata?.role===role).length+' recorded</strong></div>').join('');
const kds=new Map();for(const p of players){const kd=p.kingdom||'Unspecified';kds.set(kd,(kds.get(kd)||0)+1);}
$('kingdomNotes').innerHTML=[...kds].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([kd,n])=>'<div><b>Kingdom #'+esc(kd)+'</b><span>'+n+' candidates</span></div>').join('')||'<p class="empty">No saved kingdom records yet.</p>';
 renderExternalIntel();
}
async function load(){const {data,error}=await db.from('transfer_candidates').select('*').order('updated_at',{ascending:false}).limit(1000);
if(error){$('count').textContent='Access or database error: '+error.message;return false;}players=data||[];chosen=new Set([...chosen].filter(id=>players.some(p=>p.candidate_id===id)));if(!players.some(p=>p.candidate_id===active))active=players[0]?.candidate_id||null;render();if(dossierOpen)renderDossier();return true;}
async function check(){try{const {data:{user},error}=await db.auth.getUser();if(error||!user){showLogin();return;}
const {data:membership,error:merror}=await db.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
if(merror||!membership?.active||!['member','r4','r5','admin'].includes(membership.role)||(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now())){showLogin('Approved NXS membership required.');return;}
canEdit=['r4','r5','admin'].includes(membership.role);$('newCandidate').hidden=!canEdit;$('login').hidden=true;$('private').hidden=false;await load();
}catch(e){showLogin('Unable to verify access: '+e.message)}}
$('authForm').onsubmit=async e=>{e.preventDefault();$('message').textContent='Signing in…';const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});$('password').value='';if(error)showLogin(error.message);else check();};
$('refresh').onclick=check;$('search').oninput=render;$('sort').onchange=render;
$('compare').onclick=()=>{const a=chosenPlayers();if(a.length<2){$('comparison').textContent='Select two or three candidates.';return;}
const rows=[['Kingdom',p=>p.kingdom],['Alliance',p=>p.alliance],['Castle',p=>p.castle_level],['Power',p=>p.power_m==null?'–':fmt(p.power_m)+'M'],['Status',p=>p.contact_status],['Invitation (170M preview)',p=>invitationPreview(p)],['Transfer',p=>p.transfer_eligibility]];
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
 const response=await fetch(SUPABASE_URL+'/functions/v1/phalanx-transfer-id-snapshot-fallback-stage-20261031?governorId='+id,{headers:{apikey:KEY,Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(110000)});
 if(!response.ok)throw Error(playerLookupError(response.status));const payload=await response.json();
 if(!payload.ok||String(payload.governorId)!==id)throw Error('Player identity could not be confirmed.');
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
 note('Available ranking data · #1885 capture '+(internal.captured_at||formatPlayerUtc(internalSnapshot))+'. Candidate source '+(formatPlayerUtc(evidence?.source_cached_at))+'. Latest request is not proof of newly captured game data.');
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
   const td=document.createElement('td');td.dataset.player=name;renderRankingEvidence(td,entry,missing);tr.append(td);
  }
  body.append(tr);
 }
 table.append(body);wrap.append(table);box.append(wrap);
 note('Each rank belongs to its own kingdom. Missing Top-100 entries do not mean zero. Scores are not Mystic Trial stages and do not predict battle outcomes.');
 note('Player list coverage: latest available Top-100 player boards, not a complete kingdom census. An unlisted #1885 player can be compared by Kingshot Player ID.');
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
  const select=$('internalGovernor'),previous=select.value;
  select.replaceChildren();
  for(const p of internalPlayers){
   const opt=document.createElement('option');opt.value=String(p.uid||p.player_name);opt.textContent=p.player_name+' · '+(p.alliance_tag||'–');select.append(opt);
  }
  select.disabled=!internalPlayers.length;
  if(internalPlayers.some(p=>String(p.uid||p.player_name)===previous))select.value=previous;
  else if(internalPlayers.some(p=>p.player_name==='FaQu'))select.value=String(internalPlayers.find(p=>p.player_name==='FaQu').uid||'FaQu');
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
 const select=$('internalGovernor');let option=[...select.options].find(o=>o.value===record.uid);if(!option){option=document.createElement('option');option.value=record.uid;select.append(option);}option.textContent=record.player_name+' · '+(record.alliance_tag||'–');select.disabled=false;select.value=record.uid;
 record.captured_at=formatPlayerUtc(payload.source?.cachedAt);renderExternalIntel();loadCandidateEvidence(players.find(p=>p.candidate_id===active));
 }catch(error){$('externalIntelResult').textContent='Player comparison unavailable: '+error.message;}finally{button.disabled=false;}
};


/* Read-only candidate dossier navigation; existing candidate data is never modified. */
let dossierOpen=false,dossierTab='identity';
const show=v=>v===null||v===undefined||v===''?'Not recorded':String(v);
function dossierGrid(title,entries){
 const wrapper=document.createElement('section'),heading=document.createElement('h3'),grid=document.createElement('div');
 heading.textContent=title;grid.className='dossier-list';wrapper.append(heading,grid);
 for(const [label,v] of entries){const cell=document.createElement('div'),caption=document.createElement('span'),value=document.createElement('b');
  cell.className='dossier-cell';caption.textContent=label;value.textContent=show(v);cell.append(caption,value);grid.append(cell)}
 return wrapper;
}
function dossierParagraph(text){const p=document.createElement('p');p.textContent=text;return p}
/* Smart Dossier V1: presentation-only grouping; original six evidence views remain available. */
const dossierGroups={
 overview:['identity','intelligence'],
 development:['development'],
 recruitment:['recruitment'],
 history:['history','evidence']
};
let dossierSmartGroup='overview';
function applySmartDossierNavigation(){
 const names={identity:'Overview',development:'Development',recruitment:'Recruitment',history:'History & Evidence'};
 document.querySelectorAll('[data-dossier-tab]').forEach(button=>{
  const key=button.dataset.dossierTab;
  if(key==='intelligence'||key==='evidence'){button.hidden=true;return;}
  if(names[key])button.textContent=names[key];
  button.setAttribute('aria-pressed',String(key===dossierSmartGroup));
 });
}
function renderDossierSection(){
 if(!dossierOpen)return;
 const p=players.find(x=>x.candidate_id===active);
 if(!p){closeDossier();return}
 $('dossierTitle').textContent=p.player_name+' · Player Intelligence Profile';
 const overview=[['KINGDOM',p.kingdom?'#'+p.kingdom:'Unknown'],['TOTAL POWER',p.power_m==null?'Unknown':fmt(p.power_m)+'M'],['CASTLE',p.castle_level||'Unknown'],['STATUS',p.contact_status||'Unknown']];
 $('dossierOverview').replaceChildren(...overview.map(([label,v])=>{const card=document.createElement('div'),cap=document.createElement('small'),val=document.createElement('strong');card.className='dossier-metric';cap.textContent=label;val.textContent=v;card.append(cap,val);return card}));
 document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dossierTab===dossierTab)));
 const root=$('dossierContent');root.replaceChildren();
 const evidence=evidenceFor(p),id=evidenceKey(p);
 const source=document.createElement('p');source.textContent=(currentEvidence.has(id)?'Latest fetched ranking / Arena evidence':'Saved ranking / Arena evidence')+' · Source capture: '+formatPlayerUtc(evidence?.source_cached_at)+(evidencePending.has(id)?' · Refreshing…':'')+(evidenceErrors.has(id)?' · Refresh failed: '+evidenceErrors.get(id):'');root.append(source);
 if(id){const refresh=document.createElement('button');refresh.type='button';refresh.textContent='Refresh player evidence';refresh.disabled=evidencePending.has(id);refresh.onclick=()=>loadCandidateEvidence(p,true);root.append(refresh);}

 const m=p.metadata||{},t=m.mystic_trials||{},labels={coliseum:'Heroes & Hero Gear',forest:'Pets',crystal:'Governor Charms',knowledge:'Research',molten:'Governor Gear',radiant:'Mixed · Radiant Spire'};
 if(dossierTab==='identity'||dossierTab==='overview')root.append(dossierGrid('Identity & Power',[
  ['Player name',p.player_name],['Kingshot Player ID',m.governor_id||m.player_id],['Kingdom',p.kingdom],['Alliance',p.alliance],['Castle / Truegold',p.castle_level],
  ['Saved Total Power',p.power_m==null?null:fmt(p.power_m)+'M'],['Latest fetched Total Power',currentEvidence.has(id)?formatPlayerNumber(evidence?.player?.power):'Open or refresh player evidence'],['Previous name',m.previous_name],['Previous kingdom',m.previous_kingdom],
  ['Updated on',p.updated_at?new Date(p.updated_at).toLocaleDateString('en-GB'):'Unknown']]));
 if(dossierTab==='development'){
  const rankings=document.createElement('section'),rankingHeading=document.createElement('h3'),rankingGrid=document.createElement('div');rankingHeading.textContent='Player Rankings';rankingGrid.className='dossier-list';appendRankingEntries(rankingGrid,evidence?.ranks?.values,'dossier-cell');rankings.append(rankingHeading,rankingGrid);root.append(rankings);
  root.append(dossierGrid('Arena Squad',(evidence?.arena_squad?.heroes||[]).map((h,i)=>['Hero '+(i+1),[h.name,h.level==null?null:'Level '+h.level,(h.stars??h.star)==null?null:(h.stars??h.star)+' stars'].filter(Boolean).join(' · ')])));

  root.append(dossierGrid('Recorded Mystic Trial Stages',Object.entries(labels).map(([key,label])=>[label,stageIndex(t[key])===null?'Not recorded':t[key]])));
  root.append(dossierParagraph('Only recorded stages are displayed; unknown development is never estimated.'));
 }
 if(dossierTab==='history'){
  root.append(dossierGrid('Development History',[
   ['Last record update',p.updated_at?new Date(p.updated_at).toLocaleDateString('en-GB'):'Unknown'],
   ['Earlier power observations','Not recorded'],['Earlier trial snapshots','Not recorded']]));
  root.append(dossierParagraph('Persistent historical snapshots are not yet connected to live candidate dossiers.'));
 }
 if(dossierTab==='evidence'){
  root.append(dossierGrid('Evidence & Sources',[
   ['Mystic Trial evidence',m.mystic_trial_source],['Observation date',m.mystic_trial_snapshot],
   ['Profile evidence',m.profile_source||'Mighty Pulse via protected Stage Bridge'],['Player source capture',formatPlayerUtc(evidence?.source_cached_at)],['Player lookup time',formatPlayerUtc(evidence?.checked_at_utc)],['Saved screenshots','Not supported in LIVE yet']]));
  root.append(dossierParagraph('Only evidence recorded for this candidate is shown. Screenshot attachments are not connected yet.'));
 }
 if(dossierTab==='recruitment'){
  root.append(dossierGrid('Recruitment',[
   ['Desired role',m.role],['Recorded fit',m.fit==null?null:m.fit+'%'],['Contact status',p.contact_status],
   ['Transfer eligibility',p.transfer_eligibility],['Invitation preview',invitationPreview(p)],
   ['Recruiter',p.recruiter],['Last contact',m.last_contact]]));
  const heading=document.createElement('h3');heading.textContent='Notes';root.append(heading,dossierParagraph(p.notes||'No notes recorded.'));
 }
 if(dossierTab==='intelligence'){
  const article=document.createElement('div');article.className='dossier-report';const heading=document.createElement('h3');heading.textContent='✦ NEXUS Intelligence · Evidence-based Overview';article.append(heading);
  const count=Object.keys(labels).filter(k=>k!=='radiant'&&stageIndex(t[k])!==null).length;
  [
   'Kingdom '+show(p.kingdom)+' candidate with '+(p.power_m==null?'unknown Total Power':fmt(p.power_m)+'M recorded Total Power')+' and castle '+show(p.castle_level)+'.',
   count+' of five specialized Mystic Trials have recorded stages. '+(count<3?'The available development evidence is too incomplete for a broad assessment.':'The available stages may support comparisons with another governor.'),
   'Recruitment status: '+show(p.contact_status)+'. Transfer eligibility: '+show(p.transfer_eligibility)+'.',
   playerRankingRows(evidence?.ranks?.values).length+' ranking rows available in Development. Recorded ranking scores remain distinct from manually evidenced trial stages.',
   'Undocumented strengths and battle outcomes cannot be inferred from these records.'
  ].forEach(line=>article.append(dossierParagraph(line)));root.append(article);
 }
}
function renderDossier(){
 if(!dossierOpen)return;
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
 applySmartDossierNavigation();
}
function openDossier(){
 if(!players.some(p=>p.candidate_id===active))return;
 dossierOpen=true;dossierSmartGroup='overview';dossierTab='identity';$('scoutingBoard').hidden=true;$('candidateDossier').hidden=false;
 renderDossier();loadCandidateEvidence(players.find(p=>p.candidate_id===active));syncWorkspace();$('candidateDossier').scrollIntoView({block:'start',behavior:'auto'});
}
function closeDossier(){dossierOpen=false;$('candidateDossier').hidden=true;$('scoutingBoard').hidden=false;syncWorkspace()}
$('openDossier').onclick=openDossier;
$('backToBoard').onclick=()=>{closeDossier();$('openDossier').focus()};
document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.onclick=()=>{dossierSmartGroup=({identity:'overview',development:'development',recruitment:'recruitment',history:'history'})[b.dataset.dossierTab]||'overview';renderDossier()});


setInterval(()=>{if(!$('private').hidden&&$('modal').hidden&&!document.hidden)load()},20000);


/* PHX ID STAGE: additive read-only feature; original LIVE V5 logic above remains unchanged. */
const phxIdForm=$('phxIdForm'),phxIdStatus=$('phxIdStatus'),phxIdResult=$('phxIdResult');
const phxBridgeUrl=SUPABASE_URL+'/functions/v1/phalanx-transfer-id-snapshot-fallback-stage-20261031'; // Staging only; browser CORS requires verified deployment.
// One compact read-only renderer for lookup, dossier and comparison. Values stay exact.
function renderRankingEvidence(target,entry,missing='Not available from source'){
 target.className=(target.className||'')+' ranking-evidence';
 if(!entry){const unknown=document.createElement('span');unknown.className='ranking-missing';unknown.textContent=missing;target.append(unknown);return;}
 const value=document.createElement('strong'),rank=document.createElement('small'),details=document.createElement('details'),summary=document.createElement('summary'),source=document.createElement('p');
 value.className='ranking-value';value.textContent=formatPlayerNumber(entry.value);
 rank.className='ranking-rank';rank.textContent='Kingdom rank: '+formatPlayerNumber(entry.kingdom_rank);
 details.className='ranking-source';summary.textContent=entry.source==='saved_snapshot'?'Saved snapshot':'Source & time';source.textContent=rankingSourceText(entry).replace(/^ · /,'');details.append(summary,source);target.append(value,rank,details);
}
function appendRankingEntries(target,values,cellClass){
 const v=values||{},map=playerRankingMap(v);let count=0;
 const append=(label,entry,missing)=>{const cell=document.createElement('div'),caption=document.createElement('span');cell.className=cellClass;caption.className='ranking-label';caption.textContent=label;cell.append(caption);renderRankingEvidence(cell,entry,missing);target.append(cell);count++;};
 for(const [key,entry] of Object.entries(map))append(rankingLabels[key]||entry.name,entry);
 for(const board of Array.isArray(v.boards)?v.boards:[])if(board.status==='not_listed'&&!map[canonicalRankingName(board.name)]){
  const cell=document.createElement('div'),caption=document.createElement('span'),unknown=document.createElement('span'),details=document.createElement('details'),summary=document.createElement('summary'),source=document.createElement('p');
  cell.className=cellClass+' ranking-evidence';caption.className='ranking-label';caption.textContent=rankingLabels[board.name]||board.name;unknown.className='ranking-missing';unknown.textContent='Not listed in available Top 100';details.className='ranking-source';summary.textContent=board.source==='saved_snapshot'?'Saved snapshot':'Source & time';source.textContent=rankingSourceText(board).replace(/^ · /,'');details.append(summary,source);cell.append(caption,unknown,details);target.append(cell);count++;
 }
 if(!count)append('Rankings',null,'Not available from this source');
 if(v.board_status==='unavailable'){const note=document.createElement('p');note.className='ranking-status';note.textContent='Additional kingdom boards unavailable; available player standings remain displayed.';target.append(note);}
}
function phxField(label,value){const cell=document.createElement('div');cell.className='detail';const key=document.createElement('span');key.textContent=label;const val=document.createElement('b');val.textContent=value===null||value===undefined||value===''?'Not available':String(value);cell.append(key,val);phxIdResult.append(cell);return cell;}
function phxGroup(label){const heading=document.createElement('h4');heading.className='result-heading';heading.textContent=label;phxIdResult.append(heading);}
phxIdForm.addEventListener('submit',async e=>{
 e.preventDefault();if(phxIdForm.querySelector('button').disabled)return;phxIdResult.replaceChildren();$('phxReview').hidden=true;clearLookupCandidate();
 if($('private').hidden){phxIdStatus.textContent='Sign in to continue.';return;}
 const id=$('phxGovernorId').value.trim();
 if(!/^[1-9][0-9]{0,15}$/.test(id)){phxIdStatus.textContent='Enter a valid Kingshot Player ID.';return;}
 if(!phxBridgeUrl){phxIdStatus.textContent='Player lookup is not available yet.';return;}
 const button=phxIdForm.querySelector('button');button.disabled=true;phxIdStatus.textContent='Loading player data…';
 try{
  const {data:{session},error}=await db.auth.getSession();
  if(error||!session?.access_token)throw Error('Please sign in again.');
  const endpoint=new URL(phxBridgeUrl);if(endpoint.protocol!=='https:')throw Error('A secure HTTPS connection is required.');
  endpoint.searchParams.set('governorId',id);
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),110000);
  let response;try{response=await fetch(endpoint,{headers:{Authorization:'Bearer '+session.access_token,apikey:KEY},signal:controller.signal,cache:'no-store'});}finally{clearTimeout(timeout);}
  if(!response.ok)throw Error(playerLookupError(response.status));
  const payload=await response.json();if($('phxGovernorId').value.trim()!==id){phxIdStatus.textContent='Kingshot Player ID changed. Load player data again.';return;}if(payload.ok!==true||String(payload.governorId)!==id)throw Error('Player identity could not be confirmed.');const p=payload.player||{};$('phxReview').hidden=false;
  phxGroup('Identity & Power');phxField('Kingshot Player ID',id);phxField('Player name',p.name||p.playerName||p.player_name);
  phxField('Kingdom',p.kingdom);phxField('Alliance',p.alliance);
  phxField('Total Power',formatPlayerNumber(p.power));
  phxGroup('Arena Squad');const arena=payload.arenaSquad;phxField('Arena Squad',formatPlayerSection(arena?.status));if(Array.isArray(arena?.heroes))arena.heroes.forEach((hero,i)=>phxField('Arena hero '+(i+1),[hero.name,hero.level==null?null:'Level '+hero.level,(hero.stars??hero.star)==null?null:(hero.stars??hero.star)+' stars'].filter(Boolean).join(' · ')||'Unknown'));
  phxGroup('Rankings');const ranks=payload.ranks;appendRankingEntries(phxIdResult,ranks?.values,'detail');
  const provenance=document.createElement('details'),provenanceSummary=document.createElement('summary');provenance.className='lookup-provenance';provenanceSummary.textContent='Sources & lookup time';provenance.append(provenanceSummary);phxIdResult.append(provenance);provenance.append(phxField('Data source','Kingshot player data'),phxField('Source captured (UTC)',formatPlayerUtc(payload.source?.cachedAt)),phxField('Lookup time (UTC)',formatPlayerUtc(payload.checkedAtUtc)));
  phxIdStatus.textContent='Player data loaded. Review the details before adding this player to Candidates.';
  offerLookupCandidate(payload,id);
 }catch(error){phxIdStatus.textContent=error.name==='AbortError'?'The lookup timed out. Please try again later.':error instanceof TypeError?'Connection interrupted. Check your internet connection.':error.message;}
 finally{button.disabled=false;}
});

// Native section links; existing dossiers keep their own Back navigation.
/* V5 progressive workspace adapted to protected cloud IDs. Source: 55f372d. */
let workspaceView='scoutingBoard',profileOpen=false;
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
showWorkspace('scoutingBoard');
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
  const loaded=await load();$('workspaceNotice').textContent=loaded?'Candidate added. Player data saved.':'Candidate saved. The list could not reload; please refresh.';
  showWorkspace('scoutingBoard');
 }catch(error){$('phxAdoptStatus').textContent=error.message||'Save not confirmed. Refresh Candidates before trying again.';}
 finally{lookupSaving=false;$('phxAdoptCandidate').disabled=false;$('phxGovernorId').disabled=false;phxIdForm.querySelector('button').disabled=false;}
};

check();
