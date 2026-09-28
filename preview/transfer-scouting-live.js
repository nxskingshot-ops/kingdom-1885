const URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>x==null?'–':Number(x).toLocaleString('en-US',{maximumFractionDigits:1});
let players=[],chosen=new Set(),active=null,canEdit=false;
function showLogin(message=''){$('login').hidden=false;$('private').hidden=true;$('message').textContent=message;}
function chosenPlayers(){return [...chosen].map(id=>players.find(p=>p.candidate_id===id)).filter(Boolean);}
function filtered(){const q=$('search').value.trim().toLowerCase();const list=players.filter(p=>[p.player_name,p.kingdom,p.alliance,p.contact_status,p.metadata?.role].some(v=>String(v??'').toLowerCase().includes(q)));const s=$('sort').value;return list.sort((a,b)=>s==='name'?a.player_name.localeCompare(b.player_name):s==='power'?Number(b.power_m||0)-Number(a.power_m||0):Date.parse(b.updated_at)-Date.parse(a.updated_at));}
function render(){
$('total').textContent=players.length;
$('contacted').textContent=players.filter(p=>['Contacted','Interested','Negotiating','Confirmed'].includes(p.contact_status)).length;
$('reviews').textContent=players.filter(p=>!p.contact_status||p.contact_status==='Needs Review').length;
$('kingdoms').textContent=new Set(players.map(p=>p.kingdom).filter(Boolean)).size;
const shown=filtered();$('count').textContent=shown.length+' of '+players.length+' saved candidates';$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';
$('rows').innerHTML=shown.map(p=>'<tr data-id="'+esc(p.candidate_id)+'" class="'+(active===p.candidate_id?'selected':'')+'"><td><input type="checkbox" data-check="'+esc(p.candidate_id)+'" '+(chosen.has(p.candidate_id)?'checked':'')+'></td><td><b>'+esc(p.player_name)+'</b></td><td>'+esc(p.kingdom||'–')+'</td><td>'+esc(p.alliance||'–')+'</td><td>'+esc(p.metadata?.role||'–')+'</td><td>'+esc(p.castle_level||'–')+'</td><td>'+fmt(p.power_m)+(p.power_m==null?'':'M')+'</td><td>'+esc(p.metadata?.fit==null?'–':p.metadata.fit+'%')+'</td><td>'+esc(p.transfer_eligibility||'Unknown')+'</td><td>'+esc(p.contact_status||'–')+'</td></tr>').join('')||'<tr><td colspan="10" class="empty">No live candidates recorded. The protected scouting table is currently empty.</td></tr>';
$('rows').querySelectorAll('tr[data-id]').forEach(row=>row.onclick=()=>{active=row.dataset.id;render()});
$('rows').querySelectorAll('input[data-check]').forEach(box=>{box.onclick=e=>e.stopPropagation();box.onchange=()=>{if(box.checked){if(chosen.size>=3){box.checked=false;$('count').textContent='Select up to 3 candidates';return;}chosen.add(box.dataset.check)}else chosen.delete(box.dataset.check);$('compare').textContent='⚖ Compare selected ('+chosen.size+'/3)';}});
const p=players.find(x=>x.candidate_id===active);$('profileTitle').textContent=p?p.player_name:'Candidate profile';$('editCandidate').hidden=!canEdit||!p;
$('profile').innerHTML=p?'<div class="detail-grid">'+[['Kingdom',p.kingdom],['Alliance',p.alliance],['Power',p.power_m==null?'Not recorded':fmt(p.power_m)+'M'],['Castle',p.castle_level],['Contact',p.contact_status],['Eligibility',p.transfer_eligibility],['Recruiter',p.recruiter],['Role',p.metadata?.role]].map(([a,b])=>'<div class="detail"><span>'+esc(a)+'</span><b>'+esc(b||'–')+'</b></div>').join('')+'</div><h3>Notes</h3><div class="notes">'+esc(p.notes||'No notes recorded.')+'</div>':'<p class="empty">Select a candidate.</p>';
$('needs').innerHTML=['Rally Lead','Fighter','Joiner','R4 / R5 Potential'].map(role=>'<div><b>'+esc(role)+'</b><strong>'+players.filter(p=>p.metadata?.role===role).length+' recorded</strong></div>').join('');
const kds=new Map();for(const p of players){const kd=p.kingdom||'Unspecified';kds.set(kd,(kds.get(kd)||0)+1);}
$('kingdomNotes').innerHTML=[...kds].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([kd,n])=>'<div><b>Kingdom #'+esc(kd)+'</b><span>'+n+' candidates</span></div>').join('')||'<p class="empty">No saved kingdom records yet.</p>';
}
async function load(){const {data,error}=await db.from('transfer_candidates').select('*').order('updated_at',{ascending:false}).limit(1000);
if(error){$('count').textContent='Access or database error: '+error.message;return;}players=data||[];chosen=new Set([...chosen].filter(id=>players.some(p=>p.candidate_id===id)));if(!players.some(p=>p.candidate_id===active))active=players[0]?.candidate_id||null;render();}
async function check(){try{const {data:{user},error}=await db.auth.getUser();if(error||!user){showLogin();return;}
const {data:membership,error:merror}=await db.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
if(merror||!membership?.active||!['member','r4','admin'].includes(membership.role)||(membership.expires_at&&Date.parse(membership.expires_at)<=Date.now())){showLogin('Approved NXS membership required.');return;}
canEdit=['r4','admin'].includes(membership.role);$('newCandidate').hidden=!canEdit;$('login').hidden=true;$('private').hidden=false;await load();
}catch(e){showLogin('Unable to verify access: '+e.message)}}
$('authForm').onsubmit=async e=>{e.preventDefault();$('message').textContent='Signing in…';const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});$('password').value='';if(error)showLogin(error.message);else check();};
$('refresh').onclick=check;$('search').oninput=render;$('sort').onchange=render;
$('compare').onclick=()=>{const a=chosenPlayers();if(a.length<2){$('comparison').textContent='Select two or three candidates.';return;}
const rows=[['Kingdom',p=>p.kingdom],['Alliance',p=>p.alliance],['Castle',p=>p.castle_level],['Power',p=>p.power_m==null?'–':fmt(p.power_m)+'M'],['Status',p=>p.contact_status],['Transfer',p=>p.transfer_eligibility]];
$('comparison').innerHTML='<h3>Selected candidates</h3><div class="scroll"><table><thead><tr><th>Metric</th>'+a.map(p=>'<th>'+esc(p.player_name)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(([label,fn])=>'<tr><td>'+label+'</td>'+a.map(p=>'<td>'+esc(fn(p)||'–')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';};
$('csv').onclick=()=>{const columns=['candidate_id','player_name','kingdom','alliance','power_m','castle_level','contact_status','transfer_eligibility','recruiter','notes','updated_at'];const csv=[columns.join(','),...filtered().map(p=>columns.map(k=>'"'+String(p[k]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nxs-real-transfer-records.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);};

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
const data={player_name:v.player_name.trim(),kingdom:v.kingdom||null,alliance:v.alliance||null,power_m:v.power_m?Number(v.power_m):null,castle_level:v.castle_level||null,recruiter:v.recruiter||null,transfer_eligibility:v.transfer_eligibility||null,contact_status:v.contact_status,notes:v.notes||null,metadata:{...(old?.metadata||{}),role:v.role||null,fit:v.fit?Number(v.fit):null},updated_at:new Date().toISOString()};
await saveCandidate(data);
};
check();