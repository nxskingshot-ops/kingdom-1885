import { candidateFromLookup, duplicateLookupFilter } from './transfer-id-candidate-20261030.js';
import { formatPlayerNumber, formatPlayerUtc, formatPlayerSection, playerLookupError } from './transfer-id-display-20261030.js';
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
function renderExternalIntel(){
 const box=$('externalIntelResult');
 const candidate=players.find(p=>p.candidate_id===active);
 if(!candidate){box.textContent='Select a candidate from your board first.';return;}
 if(internalLoading){box.textContent='Loading protected Kingdom #1885 data…';return;}
 if(!internalPlayers){box.textContent='Selected: '+candidate.player_name+' · Kingdom '+(candidate.kingdom||'unknown')+'. Load #1885 players to compare verified information.';return;}
 const internal=internalPlayers.find(p=>p.player_name===$('internalGovernor').value);
 if(!internal){box.textContent='Select an internal player to compare.';return;}
 const ext=candidate.metadata?.mystic_trials||{};
 const comparable=externalTrials.slice(0,5).map(key=>({key,external:stageIndex(ext[key]),internal:stageIndex(internal[key+'_stage'])}))
   .filter(x=>x.external!==null&&x.internal!==null);
 const externalAhead=comparable.filter(x=>x.external>x.internal),internalAhead=comparable.filter(x=>x.internal>x.external);
 const matched=comparable.filter(x=>x.external===x.internal);
 const pwr=internalPowers.find(p=>normal(p.player_name)===normal(internal.player_name));
 const extPower=candidate.power_m===null||candidate.power_m===undefined||candidate.power_m===''?null:Number(candidate.power_m);
 const intPower=pwr?.power_m===null||pwr?.power_m===undefined?null:Number(pwr.power_m);
 const validExternal=extPower!==null&&Number.isFinite(extPower)&&extPower>=0;
 const validInternal=intPower!==null&&Number.isFinite(intPower)&&intPower>=0;
 const heading=document.createElement('strong');heading.textContent=candidate.player_name+' (KD '+(candidate.kingdom||'?')+') ↔ '+internal.player_name+' (#1885)';
 box.replaceChildren();
 box.append(heading);
 const add=(text,cls='')=>{const p=document.createElement('p');p.className=cls;p.textContent=text;box.append(p);};
 if(normal(candidate.kingdom).replace(/[^0-9]/g,'')==='1885')add('This candidate is marked as Kingdom #1885; confirm the origin kingdom before treating the profile as external.');
 if(validExternal&&validInternal){
  add('Recorded Total Power: '+candidate.player_name+' '+fmt(extPower)+'M · '+internal.player_name+' '+fmt(intPower)+'M. '+(extPower===intPower?'The recorded figures match.':(extPower>intPower?candidate.player_name:internal.player_name)+' has the higher recorded Total Power.'));
 }else add('Power comparison unavailable: a valid Total Power figure is missing for one or both players.');
 if(comparable.length===0)add('No directly comparable Mystic Trial stages are available yet. Optional external stages can be entered by an authorized scouting editor, supported by candidate evidence.');
 else{
  add('Specialty trials with stages on both sides: '+comparable.length+'/5. The external candidate has a later recorded stage in '+externalAhead.length+', the #1885 player in '+internalAhead.length+', and '+matched.length+' match.');
  if(externalAhead.length)add('External progression is further in: '+externalAhead.map(x=>externalLabels[x.key]).join(', ')+'.');
  if(internalAhead.length)add('#1885 progression is further in: '+internalAhead.map(x=>externalLabels[x.key]).join(', ')+'.');
  if(comparable.length<3)add('The sample is too narrow for a broad development assessment.');
  else if(externalAhead.length===comparable.length)add('The candidate is further along in all comparable specialty trials. This reflects the recorded stages, not predicted combat performance.');
  else if(internalAhead.length===comparable.length)add('The #1885 player is further along in all comparable specialty trials. This reflects the recorded stages, not predicted combat performance.');
  else if(externalAhead.length&&internalAhead.length)add('The observed development profile differs by category. No single combat conclusion follows from this pattern.');
 }
 const mixedA=stageIndex(ext.radiant),mixedB=stageIndex(internal.radiant_stage);
 if(mixedA!==null&&mixedB!==null)add('Radiant Spire (mixed indicator): '+candidate.player_name+' '+ext.radiant+' vs '+internal.player_name+' '+internal.radiant_stage+'. Not included in the five specialty trials.');
 const source=candidate.metadata?.mystic_trial_source,when=candidate.metadata?.mystic_trial_snapshot;
 add('Evidence: external trial data '+(source?'source '+source:'source not documented')+(when?', dated '+when:' (date not supplied)')+'; internal snapshot '+(internalSnapshot||'date unavailable')+'. Cross-kingdom progression may not be directly comparable if game generations or trial conditions differ. Troop Power is unavailable; no troop-free power or battle outcome is inferred.','external-notice');
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
  const select=$('internalGovernor'),previous=select.value;
  select.replaceChildren();
  for(const p of internalPlayers){
   const opt=document.createElement('option');opt.value=p.player_name;opt.textContent=p.player_name+' · '+(p.alliance_tag||'–');select.append(opt);
  }
  select.disabled=!internalPlayers.length;
  if(internalPlayers.some(p=>p.player_name===previous))select.value=previous;
  else if(internalPlayers.some(p=>p.player_name==='FaQu'))select.value='FaQu';
  if(!internalPlayers.length)throw Error('No verified internal player records available.');
 }catch(error){internalPlayers=null;internalPowers=[];$('externalIntelResult').textContent='Comparison data unavailable: '+(error?.message||'Unknown error');}
 finally{internalLoading=false;$('loadInternal').disabled=false;if(internalPlayers)renderExternalIntel();}
};
$('internalGovernor').onchange=renderExternalIntel;


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
function renderDossier(){
 if(!dossierOpen)return;
 const p=players.find(x=>x.candidate_id===active);
 if(!p){closeDossier();return}
 $('dossierTitle').textContent=p.player_name+' · Player Intelligence Profile';
 const overview=[['KINGDOM',p.kingdom?'#'+p.kingdom:'Unknown'],['TOTAL POWER',p.power_m==null?'Unknown':fmt(p.power_m)+'M'],['CASTLE',p.castle_level||'Unknown'],['STATUS',p.contact_status||'Unknown']];
 $('dossierOverview').replaceChildren(...overview.map(([label,v])=>{const card=document.createElement('div'),cap=document.createElement('small'),val=document.createElement('strong');card.className='dossier-metric';cap.textContent=label;val.textContent=v;card.append(cap,val);return card}));
 document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dossierTab===dossierTab)));
 const root=$('dossierContent');root.replaceChildren();
 const m=p.metadata||{},t=m.mystic_trials||{},labels={coliseum:'Heroes & Hero Gear',forest:'Pets',crystal:'Governor Charms',knowledge:'Research',molten:'Governor Gear',radiant:'Mixed · Radiant Spire'};
 if(dossierTab==='identity')root.append(dossierGrid('Identity & Power',[
  ['Player name',p.player_name],['Kingshot Player ID',m.governor_id||m.player_id],['Kingdom',p.kingdom],['Alliance',p.alliance],['Castle / Truegold',p.castle_level],
  ['Total Power',p.power_m==null?null:fmt(p.power_m)+'M'],['Previous name',m.previous_name],['Previous kingdom',m.previous_kingdom],
  ['Updated on',p.updated_at?new Date(p.updated_at).toLocaleDateString('en-GB'):'Unknown']]));
 if(dossierTab==='development'){
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
   ['Profile evidence',m.profile_source],['Saved screenshots','Not supported in LIVE yet']]));
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
   'Troop Power, undocumented strengths, and battle outcomes cannot be inferred from these records.'
  ].forEach(line=>article.append(dossierParagraph(line)));root.append(article);
 }
}
function openDossier(){
 if(!players.some(p=>p.candidate_id===active))return;
 dossierOpen=true;dossierTab='identity';$('scoutingBoard').hidden=true;$('candidateDossier').hidden=false;
 renderDossier();syncWorkspace();$('candidateDossier').scrollIntoView({block:'start',behavior:'auto'});
}
function closeDossier(){dossierOpen=false;$('candidateDossier').hidden=true;$('scoutingBoard').hidden=false;syncWorkspace()}
$('openDossier').onclick=openDossier;
$('backToBoard').onclick=()=>{closeDossier();$('openDossier').focus()};
document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.onclick=()=>{dossierTab=b.dataset.dossierTab;renderDossier()});


setInterval(()=>{if(!$('private').hidden&&$('modal').hidden&&!document.hidden)load()},20000);


/* PHX ID STAGE: additive read-only feature; original LIVE V5 logic above remains unchanged. */
const phxIdForm=$('phxIdForm'),phxIdStatus=$('phxIdStatus'),phxIdResult=$('phxIdResult');
const phxBridgeUrl=SUPABASE_URL+'/functions/v1/phalanx-transfer-id-bridge-stage-20261030'; // Staging only; browser CORS requires verified deployment.
function phxField(label,value){const cell=document.createElement('div');cell.className='detail';const key=document.createElement('span');key.textContent=label;const val=document.createElement('b');val.textContent=value===null||value===undefined||value===''?'Not available':String(value);cell.append(key,val);phxIdResult.append(cell);}
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
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),100000);
  let response;try{response=await fetch(endpoint,{headers:{Authorization:'Bearer '+session.access_token,apikey:KEY},signal:controller.signal,cache:'no-store'});}finally{clearTimeout(timeout);}
  if(!response.ok)throw Error(playerLookupError(response.status));
  const payload=await response.json();if($('phxGovernorId').value.trim()!==id){phxIdStatus.textContent='Kingshot Player ID changed. Load player data again.';return;}if(payload.ok!==true||String(payload.governorId)!==id)throw Error('Player identity could not be confirmed.');const p=payload.player||{};$('phxReview').hidden=false;
  phxField('Data source','Kingshot player data via protected Stage Bridge');phxField('Kingshot Player ID',id);phxField('Player name',p.name||p.playerName||p.player_name);
  phxField('Kingdom',p.kingdom);phxField('Alliance',p.alliance);
  phxField('Total Power',formatPlayerNumber(p.power));phxField('Source captured (UTC)',formatPlayerUtc(payload.source?.cachedAt));phxField('Lookup time (UTC)',formatPlayerUtc(payload.checkedAtUtc));
  const arena=payload.arenaSquad;phxField('Arena Squad',formatPlayerSection(arena?.status));if(Array.isArray(arena?.heroes))arena.heroes.forEach((hero,i)=>phxField('Arena hero '+(i+1),[hero.name,hero.level==null?null:'Level '+hero.level,(hero.stars??hero.star)==null?null:(hero.stars??hero.star)+' stars'].filter(Boolean).join(' · ')||'Unknown'));
  const ranks=payload.ranks;phxField('Rankings',formatPlayerSection(ranks?.status));if(ranks?.values)for(const [key,label] of [['power_rank','Power rank'],['kills_rank','Kills rank'],['migrant_rank','Transfer rank'],['mystic_trial','Mystic Trial']])phxField(label,formatPlayerNumber(ranks.values[key]));
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
