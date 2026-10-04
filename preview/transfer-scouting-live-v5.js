const URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
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
 appendFictionalBoardRow();
$('rows').querySelectorAll('input[data-check]').forEach(box=>{box.onclick=e=>e.stopPropagation();box.onchange=()=>{if(box.checked){if(chosen.size>=3){box.checked=false;$('count').textContent='Select up to 3 candidates';return;}chosen.add(box.dataset.check)}else chosen.delete(box.dataset.check);$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';}});
const p=players.find(x=>x.candidate_id===active);$('profileTitle').textContent=p?p.player_name:'Candidate profile';$('editCandidate').hidden=!canEdit||!p;$('openDossier').hidden=!p;
$('profile').innerHTML=p?'<div class="detail-grid">'+[['Kingdom',p.kingdom],['Alliance',p.alliance],['Power',p.power_m==null?'Not recorded':fmt(p.power_m)+'M'],['Castle',p.castle_level],['Contact',p.contact_status],['Invitation (170M preview)',invitationPreview(p)],['Eligibility',p.transfer_eligibility],['Recruiter',p.recruiter],['Role',p.metadata?.role]].map(([a,b])=>'<div class="detail"><span>'+esc(a)+'</span><b>'+esc(b||'–')+'</b></div>').join('')+'</div><h3>Notes</h3><div class="notes">'+esc(p.notes||'No notes recorded.')+'</div>':'<p class="empty">Select a candidate.</p>';
$('needs').innerHTML=['Rally Lead','Fighter','Joiner','R4 / R5 Potential'].map(role=>'<div><b>'+esc(role)+'</b><strong>'+players.filter(p=>p.metadata?.role===role).length+' recorded</strong></div>').join('');
const kds=new Map();for(const p of players){const kd=p.kingdom||'Unspecified';kds.set(kd,(kds.get(kd)||0)+1);}
$('kingdomNotes').innerHTML=[...kds].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([kd,n])=>'<div><b>Kingdom #'+esc(kd)+'</b><span>'+n+' candidates</span></div>').join('')||'<p class="empty">No saved kingdom records yet.</p>';
 renderExternalIntel();
}
async function load(){const {data,error}=await db.from('transfer_candidates').select('*').order('updated_at',{ascending:false}).limit(1000);
if(error){$('count').textContent='Access or database error: '+error.message;return;}players=data||[];chosen=new Set([...chosen].filter(id=>players.some(p=>p.candidate_id===id)));if(!players.some(p=>p.candidate_id===active))active=players[0]?.candidate_id||null;render();if(dossierOpen)renderDossier();}
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
$('newCandidate').onclick=()=>openEditor(null);
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
let fictionalExampleActive=false;
const fictionalExternalCandidate={
 player_name:'Astra Vale',kingdom:'1768',power_m:218.4,
 metadata:{mystic_trials:{coliseum:'35-2',forest:'28-7',crystal:'27-6',knowledge:'31-8',molten:'24-9',radiant:'36-4'},
 mystic_trial_source:'FICTIONAL SAMPLE · no screenshot',mystic_trial_snapshot:'2026-09-29'}
};
const fictionalInternalGovernor={
 player_name:'Demo Governor #1885',alliance_tag:'DEMO',
 coliseum_stage:'29-4',forest_stage:'31-3',crystal_stage:'24-5',
 knowledge_stage:'34-2',molten_stage:'24-9',radiant_stage:'32-7'
};
const fictionalInternalPower={player_name:'Demo Governor #1885',power_m:215.8};
$('toggleExternalExample').onclick=()=>{
 fictionalExampleActive=!fictionalExampleActive;
 $('toggleExternalExample').textContent=fictionalExampleActive?'✕ Hide fictional comparison':'✦ Show fictional comparison';
 $('toggleExternalExample').setAttribute('aria-pressed',String(fictionalExampleActive));
 renderExternalIntel();
};
const stageIndex=x=>{
 if(typeof x!=='string'||!/^\d{1,3}-\d{1,2}$/.test(x))return null;
 const [chapter,step]=x.split('-').map(Number);
 return chapter>=1&&step>=1&&step<=10?(chapter-1)*10+step:null;
};
const normal=x=>String(x??'').normalize('NFKC').trim().toLowerCase();
function renderExternalIntel(){
 const box=$('externalIntelResult');
 const candidate=fictionalExampleActive?fictionalExternalCandidate:players.find(p=>p.candidate_id===active);
 if(!candidate){box.textContent='Select a candidate from the live board first, or open the fictional example.';return;}
 if(!fictionalExampleActive&&internalLoading){box.textContent='Loading protected Kingdom #1885 data…';return;}
 if(!fictionalExampleActive&&!internalPlayers){box.textContent='Selected: '+candidate.player_name+' · Kingdom '+(candidate.kingdom||'unknown')+'. Load #1885 players to compare verified information.';return;}
 const internal=fictionalExampleActive?fictionalInternalGovernor:internalPlayers.find(p=>p.player_name===$('internalGovernor').value);
 if(!internal){box.textContent='Select an internal player to compare.';return;}
 const ext=candidate.metadata?.mystic_trials||{};
 const comparable=externalTrials.slice(0,5).map(key=>({key,external:stageIndex(ext[key]),internal:stageIndex(internal[key+'_stage'])}))
   .filter(x=>x.external!==null&&x.internal!==null);
 const externalAhead=comparable.filter(x=>x.external>x.internal),internalAhead=comparable.filter(x=>x.internal>x.external);
 const matched=comparable.filter(x=>x.external===x.internal);
 const pwr=fictionalExampleActive?fictionalInternalPower:internalPowers.find(p=>normal(p.player_name)===normal(internal.player_name));
 const extPower=candidate.power_m===null||candidate.power_m===undefined||candidate.power_m===''?null:Number(candidate.power_m);
 const intPower=pwr?.power_m===null||pwr?.power_m===undefined?null:Number(pwr.power_m);
 const validExternal=extPower!==null&&Number.isFinite(extPower)&&extPower>=0;
 const validInternal=intPower!==null&&Number.isFinite(intPower)&&intPower>=0;
 const heading=document.createElement('strong');heading.textContent=candidate.player_name+' (KD '+(candidate.kingdom||'?')+') ↔ '+internal.player_name+' (#1885)';
 box.replaceChildren();
 if(fictionalExampleActive){const marker=document.createElement('span');marker.className='fictional-banner';marker.textContent='FICTIONAL DEMO · BOTH PLAYERS INVENTED · NOT SAVED';box.append(marker);}
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
 add('Evidence: external trial data '+(source?'source '+source:'source not documented')+(when?', dated '+when:' (date not supplied)')+'; internal snapshot '+(fictionalExampleActive?'FICTIONAL SAMPLE':internalSnapshot||'date unavailable')+'. Cross-kingdom progression may not be directly comparable if game generations or trial conditions differ. Troop Power is unavailable; no troop-free power or battle outcome is inferred.','external-notice');
 if(fictionalExampleActive)add('This illustration uses invented values for both governors. It is not a player record, does not affect live counts or rankings, and nothing is stored in Supabase.','fictional-disclaimer');
}
$('loadInternal').onclick=async()=>{
 if(internalLoading)return;
 internalLoading=true;$('loadInternal').disabled=true;renderExternalIntel();
 try{
  const {data:{session},error}=await db.auth.getSession();
  if(error||!session?.access_token)throw Error('Sign in with your approved NEXUS account first.');
  const response=await fetch(URL+'/functions/v1/nexus-true-power',{method:'GET',
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
  ['Player name',p.player_name],['Player ID',m.player_id],['Kingdom',p.kingdom],['Alliance',p.alliance],['Castle / Truegold',p.castle_level],
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
  root.append(dossierParagraph('Screenshots in the fictional demo are temporary previews, not evidence attached to this real candidate.'));
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
 renderDossier();$('candidateDossier').scrollIntoView({block:'start',behavior:'auto'});
}
function closeDossier(){dossierOpen=false;$('candidateDossier').hidden=true;$('scoutingBoard').hidden=false}
$('openDossier').onclick=openDossier;
$('backToBoard').onclick=()=>{closeDossier();$('openDossier').focus()};
document.querySelectorAll('[data-dossier-tab]').forEach(b=>b.onclick=()=>{dossierTab=b.dataset.dossierTab;renderDossier()});


/* Strictly in-memory fictional row. Never inserted into players or sent to Supabase. */
let demoDossierOpen=false,returnFromDemoComparison=false,demoFrameStarted=false;
function appendFictionalBoardRow(){
 const query=$('search').value.trim().toLowerCase();
 if(query&&!['astra vale','astra','1768','fictional','aur','demo'].some(t=>t.includes(query)||query.includes(t)))return;
 const row=document.createElement('tr');row.className='fictional-board-row';
 const cells=['—','', '1768','AUR','Rally Lead','TG5','218.4M','—','Special (demo)','Not verified','FICTIONAL'];
 for(let i=0;i<cells.length;i++){
  const td=document.createElement('td');
  if(i===1){
   const btn=document.createElement('button');btn.type='button';btn.className='scouting-name-button';
   btn.textContent='Astra Vale';btn.setAttribute('aria-label','Open fictional demo player dossier');
   btn.onclick=e=>{e.stopPropagation();openFictionalDossier()};
   const badge=document.createElement('span');badge.className='fictional-marker';badge.textContent='DEMO';
   td.append(btn,badge);
  }else td.textContent=cells[i];
  row.append(td);
 }
 $('rows').append(row);
}
function openFictionalDossier(){
 demoDossierOpen=true;
 if(dossierOpen)closeDossier();
 $('scoutingBoard').hidden=true;
 $('fictionalDossier').hidden=false;
 $('returnToFictionalDossier').hidden=true;
 if(!demoFrameStarted){
  const frame=$('fictionalDossierFrame');
  frame.addEventListener('load',()=>{
   try{
    const back=frame.contentDocument?.querySelector('header.top a');
    if(back)back.addEventListener('click',e=>{e.preventDefault();closeFictionalDossier()});
   }catch(_){/* embedded demo remains usable via outer Back button */}
  });
  frame.src='./scouting-player-profile-demo.html?build=player-dossier-demo-v1';
  demoFrameStarted=true;
 }
 $('fictionalDossier').scrollIntoView({block:'start',behavior:'auto'});
}
function closeFictionalDossier(){
 demoDossierOpen=false;
 $('fictionalDossier').hidden=true;
 $('scoutingBoard').hidden=false;
 $('returnToFictionalDossier').hidden=true;
}
$('backFromFictionalDossier').onclick=closeFictionalDossier;
$('compareDemoDossier').onclick=()=>{
 demoDossierOpen=false;
 $('fictionalDossier').hidden=true;
 $('scoutingBoard').hidden=false;
 returnFromDemoComparison=true;
 $('returnToFictionalDossier').hidden=false;
 if(!fictionalExampleActive)$('toggleExternalExample').click();
 else renderExternalIntel();
 $('externalIntelPanel').scrollIntoView({block:'start',behavior:'auto'});
};
$('returnToFictionalDossier').onclick=()=>{
 returnFromDemoComparison=false;
 openFictionalDossier();
};

check();
setInterval(()=>{if(!$('private').hidden&&$('modal').hidden&&!document.hidden)load()},20000);
