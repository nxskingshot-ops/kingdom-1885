/* Kingdom #1885: isolated test integration. Original index.html is untouched. */
(async function(){
'use strict';
const URL='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const $=id=>document.getElementById(id);
const notice=$('healthBadge'), existing=new Map(DATA.map(o=>[o.id,o]));
let supabase=null, officer=false, chosen=null, latest=new Map(), busy=false;
const styles=document.createElement('style');styles.textContent=`
#liveControls{position:absolute;z-index:110;bottom:62px;right:8px;display:flex;gap:5px}
#liveControls button{background:#f1d19a;color:#523719;border:1px solid #b58a4c;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:800}
#liveControls small{background:#25190f;color:#e2c9a1;border:1px solid #99713c;border-radius:7px;padding:8px}
#livePanel{position:absolute;z-index:150;right:8px;top:50px;bottom:51px;max-width:min(350px,85vw);width:320px;overflow:auto;background:#282016;color:#ffe8c0;border:2px solid #b69052;border-radius:11px;box-shadow:0 4px 35px #000a;padding:12px;font:12px system-ui}
#livePanel[hidden]{display:none}#livePanel h3{margin:0 0 10px;font:700 17px Georgia,serif}
#livePanel label{display:block;margin:7px 0}#livePanel input,#livePanel select{display:block;width:100%;box-sizing:border-box;margin-top:3px;padding:8px;background:#191b16;border:1px solid #82623c;border-radius:6px;color:#fff;font:13px system-ui}
#livePanel button{margin:4px 3px 0 0;padding:8px 12px;background:#eac681;border:1px solid #936a2f;border-radius:7px;color:#28190a;font-weight:800}
#livePanel .quiet{color:#cbb78d;font-size:11px}#liveMessage{min-height:22px;white-space:pre-wrap}#livePanel .panelHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:-12px;background:#282016;z-index:5;padding:8px 0;border-bottom:1px solid #ae843b}#livePanel .panelHeader h3{margin:0}#livePanel button#liveCloseTop{display:block;background:#efc87e;color:#241807;font-size:20px;min-width:46px;min-height:42px;line-height:20px;padding:7px 12px;border-radius:9px}#liveSyncStatus{display:inline-block;background:#2a2519;color:#fff1ce;border:1px solid #c19858;border-radius:7px;padding:7px;font-size:11px;min-width:88px;max-width:235px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;document.head.appendChild(styles);
const controls=document.createElement('div');controls.id='liveControls';controls.innerHTML='<button type="button" id="liveRefresh">↻ Refresh Map</button><small id="liveSyncStatus" role="status">Waiting…</small><button type="button" id="liveEditorBtn">🔒 Manage Outposts</button>';document.getElementById('app').appendChild(controls);
const panel=document.createElement('section');panel.id='livePanel';panel.hidden=true;
panel.innerHTML='<div class="panelHeader"><h3>♛ Outpost Administration</h3><button id="liveCloseTop" type="button" aria-label="Close outpost administration">✕</button></div><div id="liveMessage" role="status"></div><div id="liveFields"></div><button type="button" id="liveClose">Close</button>';document.getElementById('app').appendChild(panel);
function message(s){$('liveMessage').textContent=s}
function setBadge(txt){notice.textContent=txt;const status=$('liveSyncStatus');if(status){status.textContent=txt;status.title=txt}const sync=$('liveRefresh');if(sync){sync.textContent='↻ Refresh Map';sync.title=txt}}
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function redraw(){render();if(sel){const o=DATA.find(v=>v.id===sel);if(o)showOutpostPopup(o)}}
function updateData(rows){
 latest=new Map(rows.map(r=>[r.id,r]));
 let applied=0,unmapped=0;
 for(const r of rows){
  const match=/^outpost-sheet:(\d+)$/.exec(r.source_key||'');
  const target=match?existing.get(Number(match[1])-1):null;
  if(!target || target.type!==r.structure_type){unmapped++;continue}
  target.alliance=r.alliance;target.level=r.level;target.x=r.coord_x;target.y=r.coord_y;applied++;
 }
 redraw();
 setBadge('● Live '+applied+' / '+DATA.length);
 $('sourceNote').textContent='Supabase live: '+applied+' linked · '+(DATA.length-applied)+' snapshot-only · '+unmapped+' unmatched. Six conflicting sheet entries remain snapshot-only.';
}
async function refresh(){
 if(busy){setBadge('● Sync already running');return;}busy=true;setBadge('↻ Syncing…');
 try{
  const response=await fetch(URL+'/rest/v1/public_outposts?select=id,source_key,alliance,structure_type,level,coord_x,coord_y,updated_at&published=eq.true&order=id.asc',{headers:{apikey:KEY},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('HTTP '+response.status+' from Supabase');
  const rows=await response.json();if(!Array.isArray(rows))throw Error('Bad response');
  updateData(rows);
 }catch(e){setBadge('● Sync failed: '+e.message);$('sourceNote').textContent='Live sync unavailable: original 74 marker snapshot retained. '+e.message;console.error(e)}
 finally{busy=false}
}
async function client(){
 if(supabase)return supabase;
 const mod=await import('https://esm.sh/@supabase/supabase-js@2');
 supabase=mod.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
 return supabase;
}
async function isOfficer(db){
 const {data:{user},error:userError}=await db.auth.getUser();
 if(userError||!user)return false;
 const {data,error}=await db.from('nxs_memberships').select('role,active').eq('user_id',user.id).maybeSingle();
 return !error && data?.active===true && (data.role==='admin'||data.role==='r4');
}
function loginForm(){
 chosen=null;$('liveFields').innerHTML='<label>Email<input id="liveEmail" type="email" autocomplete="username"></label><label>Password<input id="livePass" type="password" autocomplete="current-password"></label><button id="liveSignIn" type="button">Administrator Login</button><p class="quiet">Only approved R4/admin members can edit. Do not use your GitHub password.</p>';
 $('liveSignIn').onclick=async()=>{
  const button=$('liveSignIn');button.disabled=true;
  try{const db=await client();const {error}=await db.auth.signInWithPassword({email:$('liveEmail').value,password:$('livePass').value});$('livePass').value='';if(error)throw error;
  officer=await isOfficer(db);if(!officer){await db.auth.signOut();throw Error('Active NXS R4/admin membership required.')}
  chooseForm();message('Administrator access confirmed.');
  }catch(e){message('Sign in failed: '+e.message)}finally{button.disabled=false}
 };
}
function chooseForm(){
 $('liveFields').innerHTML='<p class="quiet">Select an outpost on the map, then tap Edit selected. The original six conflicting entries are read-only.</p><button id="liveEditSelected" type="button">Edit selected</button><button id="liveSignOut" type="button">Sign out</button>';
 $('liveEditSelected').onclick=editSelected;
 $('liveSignOut').onclick=async()=>{(await client()).auth.signOut();officer=false;loginForm();message('Logged out.')};
}
function editSelected(){
 if(!officer)return loginForm();
 const o=DATA.find(v=>v.id===sel);
 if(!o){message('Choose an outpost marker or list entry first.');return}
 const match=[...latest.values()].find(r=>r.source_key==='outpost-sheet:'+(o.id+1) && r.structure_type===o.type);
 if(!match){message('Snapshot-only outpost: not editable until its source conflict is resolved.');return}
 chosen={...match};
 $('liveFields').innerHTML='<p><b>'+escapeText(o.type)+'</b> · '+escapeText(match.source_key)+'</p><label>Alliance<select id="liveAlliance">'+ALL.map(a=>'<option value="'+a+'">'+a+'</option>').join('')+'</select></label><label>Level<select id="liveLevel">'+[1,2,3,4].map(i=>'<option value="'+i+'">'+i+'</option>').join('')+'</select></label><label>X<input id="liveX" type="number" min="0" max="1199" step="1"></label><label>Y<input id="liveY" type="number" min="0" max="1199" step="1"></label><button id="liveSave" type="button">Save to Supabase</button><button id="liveBack" type="button">Back</button><p class="quiet">Changes update Supabase immediately, not the Google Sheet. Original map remains a separate snapshot.</p>';
 $('liveAlliance').value=match.alliance;$('liveLevel').value=String(match.level);$('liveX').value=match.coord_x;$('liveY').value=match.coord_y;
 $('liveBack').onclick=chooseForm;$('liveSave').onclick=save;
}
async function save(){
 if(!officer||!chosen)return;
 const x=Number($('liveX').value),y=Number($('liveY').value),lv=Number($('liveLevel').value),alliance=$('liveAlliance').value;
 if(!$('liveX').value||!$('liveY').value||!Number.isInteger(x)||x<0||x>1199||!Number.isInteger(y)||y<0||y>1199||!Number.isInteger(lv)||lv<1||lv>4){message('Whole coordinates from 0 to 1199 required.');return}
 if(DATA.some(o=>o.id!==Number(chosen.source_key.split(':')[1])-1&&o.x===x&&o.y===y)){message('Coordinates conflict with an existing marker.');return}
 const btn=$('liveSave');btn.disabled=true;
 try{
  const db=await client();if(!await isOfficer(db))throw Error('Officer permission expired.');
  const {data,error}=await db.from('public_outposts').update({alliance,level:lv,coord_x:x,coord_y:y,updated_at:new Date().toISOString()}).eq('id',chosen.id).eq('updated_at',chosen.updated_at).select('id');
  if(error)throw error;
  if(!data?.length)throw Error('Outpost changed elsewhere. Refresh before retrying.');
  await refresh();chooseForm();message('Changes saved to Supabase and the map refreshed.');
 }catch(e){message('Save failed: '+e.message)}finally{btn.disabled=false}
}
$('liveRefresh').onclick=async()=>{panel.hidden=true;await refresh();const txt=$('liveRefresh').title||$('liveRefresh').textContent;const box=$('liveMessage');if(box)box.textContent=txt; if(typeof toast==='function')toast(txt)};
const closePanel=()=>{panel.hidden=true;message('')};
$('liveClose').onclick=closePanel;
$('liveCloseTop').onclick=closePanel;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel()});
$('livePanel').addEventListener('click',e=>e.stopPropagation());
$('liveEditorBtn').onclick=async()=>{
 panel.hidden=!panel.hidden;if(panel.hidden)return;
 try{const db=await client();officer=await isOfficer(db)}catch{officer=false}
 if(officer)chooseForm();else loginForm();
};
setBadge('● Connecting…');await refresh();
setInterval(()=>{if(!document.hidden && !busy)refresh()},15000);
})();