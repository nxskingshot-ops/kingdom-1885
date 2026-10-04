const API='https://hcjrdofkdkasznywvcxo.supabase.co';
const KEY='sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';
const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
const db=createClient(API,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const escapeText=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],selected=null,authorized=false;
const visible=()=>{const q=$('search').value.trim().toLowerCase();return records.filter(r=>[r.alliance,r.structure_type,r.source_key,r.coord_x,r.coord_y].some(v=>String(v??'').toLowerCase().includes(q)))};
function locked(message=''){
 authorized=false;$('board').hidden=true;$('login').hidden=false;$('loginMessage').textContent=message;
}
function resetSelection(){const p=records.find(r=>r.id===selected);$('save').disabled=!p||!authorized;
 $('selectionInfo').textContent=p?'Outpost '+p.source_key+' · database ID '+p.id:'Select an outpost from the list.';
 const form=$('editForm');if(!p){for(const key of ['alliance','structure_type','coord_x','coord_y'])form.elements.namedItem(key).value='';form.elements.namedItem('level').value='1';$('selectedLevel').textContent='–';return;}
 for(const key of ['alliance','structure_type','level','coord_x','coord_y'])form.elements.namedItem(key).value=p[key];
 $('selectedLevel').textContent=p.level;
}
function render(){
 $('total').textContent=records.length;$('published').textContent=records.filter(r=>r.published).length;
 $('alliances').textContent=new Set(records.map(r=>r.alliance)).size;
 const items=visible();$('rowCount').textContent=items.length+' of '+records.length+' live outposts';
 $('rowList').innerHTML=items.map(p=>'<tr data-id="'+p.id+'" class="'+(selected===p.id?'active':'')+'"><td><b>'+escapeText(p.alliance)+'</b></td><td>'+escapeText(p.structure_type)+'</td><td>'+p.level+'</td><td>'+p.coord_x+'</td><td>'+p.coord_y+'</td></tr>').join('')||'<tr><td colspan="5">No matching outposts.</td></tr>';
 $('rowList').querySelectorAll('tr[data-id]').forEach(tr=>tr.onclick=()=>{selected=Number(tr.dataset.id);render()});
 resetSelection();
}
async function refresh(){
 if(!authorized)return;
 $('status').textContent='Loading records…';
 const {data,error}=await db.from('public_outposts').select('id,source_key,alliance,structure_type,level,coord_x,coord_y,published,updated_at').order('id',{ascending:true}).limit(400);
 if(error){$('status').textContent='Could not retrieve outposts: '+error.message;return;}
 records=data||[];if(!records.some(r=>r.id===selected))selected=null;
 render();$('status').textContent=records.length+' records loaded. Select a row to edit.';
}
async function verify(){
 try{
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user){locked();return;}
 const {data:member,error:membershipError}=await db.from('nxs_memberships').select('role,active,expires_at').eq('user_id',user.id).maybeSingle();
 if(membershipError||!member?.active||!['outpost_manager','r4','r5','admin'].includes(member.role)||(member.expires_at&&Date.parse(member.expires_at)<=Date.now())){locked('An active Outpost Manager, R4/R5 or Admin account is required.');return;}
 authorized=true;$('login').hidden=true;$('board').hidden=false;await refresh();
 }catch(error){locked('Unable to confirm editor access: '+error.message)}
}
$('authForm').onsubmit=async e=>{
 e.preventDefault();$('loginMessage').textContent='Signing in…';
 const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});
 $('password').value='';if(error){locked(error.message);return;}await verify();
};
$('editForm').onsubmit=async e=>{
 e.preventDefault();if(!authorized)return;
 const original=records.find(r=>r.id===selected);if(!original)return;
 const v=Object.fromEntries(new FormData(e.currentTarget).entries());
 const alliance=String(v.alliance).trim(),structure=String(v.structure_type).trim();
 const x=Number(v.coord_x),y=Number(v.coord_y),level=Number(v.level);
 if(!/^[a-z0-9]{2,8}$/i.test(alliance)||!structure||structure.length>80||![x,y,level].every(Number.isInteger)||x<0||x>1199||y<0||y>1199||level<1||level>4){$('status').textContent='Check alliance, structure, level and coordinates (0–1199).';return;}
 $('save').disabled=true;$('status').textContent='Saving to protected Supabase…';
 const payload={alliance,structure_type:structure,level,coord_x:x,coord_y:y,updated_at:new Date().toISOString()};
 try{
 const {data,error}=await db.from('public_outposts').update(payload).eq('id',original.id).select('id').maybeSingle();
 if(error)throw error;if(!data)throw Error('Update denied by access rules or record not found.');
 await refresh();$('status').textContent='✓ Saved. Public map will refresh shortly.';
 }catch(error){$('status').textContent='Save failed: '+error.message;$('save').disabled=false;}
};
$('search').oninput=render;$('resetSelectionBtn').onclick=resetSelection;$('refresh').onclick=verify;$('reload').onclick=refresh;
verify();
