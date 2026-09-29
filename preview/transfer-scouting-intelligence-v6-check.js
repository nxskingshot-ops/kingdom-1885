/* Nexus transfer scouting — fully fictional, local-only demo. No network/API calls. */
(() => {
"use strict";
const KEY="nxs-transfer-intelligence-stage-v1";
const META_KEY="nxs-transfer-intelligence-schedule-stage-v1";
const predictedMeta={group:"Group 7 · K1690–K1935",date:"8–14 Nov 2026"};
let transferMeta={...predictedMeta};
try{const v=JSON.parse(localStorage.getItem(META_KEY)||"null");if(v&&typeof v==="object"){if(typeof v.group==="string"&&v.group.trim())transferMeta.group=v.group.slice(0,48);if(typeof v.date==="string"&&v.date.trim())transferMeta.date=v.date.slice(0,70);}}catch(e){}
function storeMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(transferMeta));}catch(e){}}
function showMeta(){
 $("groupValue").textContent=transferMeta.group||"Not set";
 $("dateValue").textContent=/^\d{4}-\d{2}-\d{2}$/.test(transferMeta.date)?transferMeta.date.split("-").reverse().join("."):transferMeta.date||"Not announced";
}
function toggleMeta(which,edit){
 const view=$(which+"View"),editor=$(which+"Editor");
 view.hidden=edit;editor.hidden=!edit;
 if(edit){$(which+"Input").value=which==="group"?transferMeta.group:transferMeta.date;$(which+"Input").focus();}
}
const statuses=["Scouted","Contacted","Interested","Negotiating","Confirmed","Needs Review","Declined"];
const roles=["Rally Lead","Fighter","Joiner","R4 / R5 Potential","Group Contact","Support"];
// Provisional planning cap; actual Kingshot limits must be confirmed.
const INVITATION_CAP_M=170;
function invitationType(p){if(["Ordinary","Special","To confirm"].includes(p.invitationType))return p.invitationType;if(p.power===null||p.power===undefined||p.power==="")return "To confirm";const power=Number(p.power);return Number.isFinite(power)&&power>=0?(power<=INVITATION_CAP_M?"Ordinary":"Special"):"To confirm";}
const defaultPlayers=[
["Astra Vale","1768","AUR","Rally Lead","TG5",218.4,88,"Scouted","Possible Special","High","English","UTC+1"],
["Nyx Ember","1812","NOVA","Fighter","TG5",164.1,84,"Contacted","Likely Eligible","High","English","UTC+2"],
["Echo Briar","1704","ECL","Joiner","TG4",128,82,"Scouted","Under Cap","High","German","UTC+2"],
["Raven Sol","1725","RAV","R4 / R5 Potential","TG4",136.2,76,"Interested","Unknown","Medium","English","UTC+1"],
["Polar Crest","1889","POL","Group Contact","TG5",195,74,"Negotiating","Needs Slots","Unknown","English","UTC+0"],
["Iron Finch","1917","IFN","Fighter","TG5",204,63,"Needs Review","Unknown","Unknown","Unknown","Unknown"],
["Sable Meridian","1830","SBL","Rally Lead","TG5",236.2,91,"Contacted","Possible Special","High","English","UTC-4"],
["Silver Rowan","1749","SRW","Joiner","TG4",119.5,79,"Interested","Under Cap","High","French","UTC+2"],
["Cinder Arc","1906","ARC","Fighter","TG5",187.7,80,"Scouted","Needs Invite","Medium","English","UTC+3"],
["Oak Sentinel","1697","OAK","Support","TG3",96.3,68,"Declined","Unknown","Medium","German","UTC+2"],
["Dawnward","1932","DAW","Fighter","TG4",141,77,"Negotiating","Likely Eligible","High","English","UTC+1"],
["Vesper Node","1782","VSP","R4 / R5 Potential","TG4",153.4,86,"Confirmed","Needs Invite","High","English","UTC+0"]
].map((v,i)=>({id:"DEMO-"+String(i+1).padStart(3,"0"),name:v[0],kingdom:v[1],alliance:v[2],role:v[3],castle:v[4],power:v[5],fit:v[6],status:v[7],eligibility:v[8],activity:v[9],language:v[10],timezone:v[11],notes:"Fictional example for interface testing. Not a real candidate.",lastUpdated:"Demo seed",...(i===0?{mysticTrials:{knowledge:47,molten:39,crystal:43,forest:52,coliseum:45,radiant:38},evidenceSource:"FICTIONAL TEST DATA · Six illustrative Mystic Trial stages",observedAt:"2026-09-29"}:i===1?{mysticTrials:{knowledge:51,molten:37,crystal:41,forest:49,coliseum:46,radiant:42},evidenceSource:"FICTIONAL TEST DATA · Six illustrative Mystic Trial stages",observedAt:"2026-09-29"}:{})}));
const TRIALS=[["Research","knowledge"],["Governor Gear","molten"],["Governor Charms","crystal"],["Pets","forest"],["Heroes & Hero Gear","coliseum"],["Other / Mixed","radiant"]];
const trialData=p=>p.mysticTrials||p.mystic_trials||{};
const stageValue=(p,k)=>{const raw=trialData(p)[k];if(raw===null||raw===undefined||raw==="")return null;const n=Number(raw);return Number.isInteger(n)&&n>=0&&n<=999?n:null;};
const stageCount=p=>TRIALS.filter(([,k])=>stageValue(p,k)!==null).length;
const stageDisplay=(p,k)=>{const v=stageValue(p,k);return v===null?"Not recorded":String(v);};
const trialBar=(p,key,scale)=>{const val=stageValue(p,key);if(val===null)return '<span class="trial-missing">Not recorded</span>';const width=scale>0?Math.max(0,Math.min(100,val/scale*100)):0;return '<div class="trial-visual"><strong>'+val+'</strong><span class="trial-track" aria-hidden="true"><span class="trial-fill" style="width:'+width.toFixed(2)+'%"></span></span></div>';};
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clone=()=>defaultPlayers.map(x=>({...x}));
let players=clone(),selected=players[0].id,filter="all",sort="fit",editing=false;
let compareIds=new Set();
try{const data=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(data))players=data;}catch(e){$("storageNotice").textContent="Local storage is unavailable; edits last for this visit only.";}
function save(){try{localStorage.setItem(KEY,JSON.stringify(players));$("storageNotice").textContent="Demo edits are saved only in this browser.";}catch(e){$("storageNotice").textContent="Browser storage blocked: changes will be lost when this page reloads.";}}
function getSelected(){return players.find(x=>x.id===selected);}
function filtered(){const q=$("search").value.toLowerCase().trim();return players.filter(p=>(!q||[p.name,p.kingdom,p.alliance,p.role,p.status,p.id].some(x=>String(x||"").toLowerCase().includes(q)))&&(filter==="all"||(filter==="high"&&p.fit>=80)||(filter==="contact"&&["Contacted","Interested","Negotiating","Confirmed"].includes(p.status))||(filter==="review"&&["Needs Review","Unknown"].includes(p.status)||p.fit<70))).sort((a,b)=>sort==="power"?b.power-a.power:sort==="name"?a.name.localeCompare(b.name):b.fit-a.fit||b.power-a.power);}
function fmt(v){return Number(v).toLocaleString("en-US",{maximumFractionDigits:1});}
function metrics(){
 $("candidateCount").textContent=players.length;
 $("highCount").textContent=players.filter(x=>x.fit>=80).length;
 $("contactCount").textContent=players.filter(x=>["Contacted","Interested","Negotiating","Confirmed"].includes(x.status)).length;
 $("reviewCount").textContent=players.filter(x=>x.status==="Needs Review"||x.activity==="Unknown").length;
}
function table(){
 const data=filtered();
 $("rowCount").textContent=data.length+" of "+players.length+" fictional candidates";
 $("compareBtn").textContent="⚖ Compare selected ("+compareIds.size+"/3)";
 $("boardRows").innerHTML=data.map(p=>'<tr class="'+(p.id===selected?'selected':'')+'" data-id="'+esc(p.id)+'" tabindex="0" role="button" aria-label="Open '+esc(p.name)+' profile"><td><input type="checkbox" class="compare-check" data-compare-id="'+esc(p.id)+'" aria-label="Compare '+esc(p.name)+'" '+(compareIds.has(p.id)?"checked":"")+'></td><td><b>'+esc(p.name)+'</b><small>'+esc(p.id)+'</small></td><td>#'+esc(p.kingdom)+'</td><td>'+esc(p.alliance||"–")+'</td><td>'+esc(p.role||"–")+'</td><td>'+esc(p.castle||"–")+'</td><td>'+fmt(p.power)+'M</td><td><strong class="fit">'+fmt(p.fit)+'%</strong></td><td>'+esc(invitationType(p))+'</td><td>'+esc(p.eligibility||"Unknown")+'</td><td><span class="chip '+(p.status==="Confirmed"?"good":p.status==="Needs Review"?"warn":"")+'">'+esc(p.status||"–")+'</span></td></tr>').join("")||'<tr><td colspan="11" class="empty">No fictional candidates match these filters.</td></tr>';
 $("boardRows").querySelectorAll("tr[data-id]").forEach(el=>{const open=()=>{selected=el.dataset.id;editing=false;render();};el.addEventListener("click",open);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});});
 $("boardRows").querySelectorAll(".compare-check").forEach(box=>{
  box.addEventListener("click",e=>e.stopPropagation());
  box.addEventListener("change",e=>{
   e.stopPropagation();
   const id=box.dataset.compareId;
   if(box.checked){if(compareIds.size>=3){box.checked=false;$("comparison").textContent="Choose up to three fictional candidates.";return;}compareIds.add(id);}
   else compareIds.delete(id);
   $("compareBtn").textContent="⚖ Compare selected ("+compareIds.size+"/3)";
  });
 });
}
function sidePanels(){
 const count=role=>players.filter(p=>p.role===role).length;
 $("needRally").textContent=count("Rally Lead")+" demo matches";
 $("needFighters").textContent=count("Fighter")+" demo matches";
 $("needJoiners").textContent=count("Joiner")+" demo matches";
 $("needCommand").textContent=count("R4 / R5 Potential")+" demo matches";
 const kingdoms=new Map();
 players.forEach(p=>{const kd=String(p.kingdom||"Unknown"),entry=kingdoms.get(kd)||{kd,n:0,max:0,contacts:0};entry.n++;entry.max=Math.max(entry.max,Number(p.fit)||0);if(["Contacted","Interested","Negotiating","Confirmed"].includes(p.status))entry.contacts++;kingdoms.set(kd,entry);});
 const list=[...kingdoms.values()].sort((a,b)=>b.n-a.n||b.max-a.max).slice(0,4);
 $("kingdomNotes").innerHTML=list.map(k=>'<div><b>Kingdom #'+esc(k.kd)+'</b><span>'+k.n+' fictional profile'+(k.n===1?'':'s')+' · highest demo fit '+fmt(k.max)+'% · '+k.contacts+' contacted+</span></div>').join("")||'<p class="empty">No fictional kingdom notes available.</p>';
}
const field=(label,value)=>'<div class="detail"><span>'+label+'</span><b>'+esc(value)+'</b></div>';
function profile(){
 const p=getSelected();
 $("profileTitle").textContent=p?p.name:"No candidate selected";
 $("editCandidate").disabled=!p;$("deleteCandidate").disabled=!p;
 if(!p){$("profileBody").innerHTML='<p class="empty">Add a fictional candidate to view a profile.</p>';return;}
 $("profileBody").innerHTML='<div class="profile-top"><span class="monogram">'+esc(p.name.slice(0,1).toUpperCase())+'</span><div><b>'+esc(p.name)+'</b><div class="muted">#'+esc(p.kingdom)+' · '+esc(p.alliance)+' · '+esc(p.id)+'</div></div><span class="score">'+fmt(p.fit)+'% fit</span></div><div class="detail-grid">'+field("Role",p.role)+field("Castle",p.castle)+field("Power",fmt(p.power)+"M")+field("Activity",p.activity)+field("Language",p.language)+field("Time zone",p.timezone)+field("Status",p.status)+field("Invitation (provisional)",invitationType(p))+field("Eligibility",p.eligibility)+field("Combat strength",p.combatStrength||"Not provided")+field("Availability",p.availability||"Not provided")+'</div><h3>Kingdom & scouting notes</h3><div class="notes">'+esc(p.notes||"No demo notes.")+'</div><p class="smallprint">Demo score is an editable illustration, not a predicted transfer outcome or verified game value.</p>';
}
function render(){metrics();table();sidePanels();profile();renderIntelligence();document.querySelectorAll("[data-filter]").forEach(b=>{const on=b.dataset.filter===filter;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});$("sort").value=sort;}
const makeOpts=(items,current)=>items.map(x=>'<option value="'+esc(x)+'"'+(x===current?" selected":"")+'>'+esc(x)+'</option>').join("");
function editForm(p){
 const fresh=!p;
 $("editorTitle").textContent=fresh?"Add fictional candidate":"Edit fictional candidate";
 $("editorSub").textContent="Demo only · These changes never reach real NXS data.";
 $("candidateForm").innerHTML='<div class="form-grid">'+
 ['name|Name|text','kingdom|Kingdom number|text','alliance|Alliance tag|text','castle|Castle level|text','power|Power (M)|number','fit|Demo fit score (0–100)|number','language|Language|text','timezone|Time zone|text'].map(field=>{const [name,label,type]=field.split("|");return '<label>'+label+'<input name="'+name+'" '+(name==="fit"?'min="0" max="100" step="1"':name==="power"?'min="0" step="0.1"':'maxlength="90"')+' type="'+type+'" value="'+esc(p?.[name]??(name==="fit"?50:name==="power"?0:""))+'" '+(name==="name"||name==="kingdom"?'required':'')+'></label>';}).join("")+
 '<label>Preferred role<select name="role">'+makeOpts(roles,p?.role||roles[0])+'</select></label>'+
 '<label>Contact status<select name="status">'+makeOpts(statuses,p?.status||statuses[0])+'</select></label>'+
 '<label>Invitation type<select name="invitationType">'+makeOpts(["Auto","Ordinary","Special","To confirm"],p?.invitationType||"Auto")+'</select></label>'+ '<label>Estimated eligibility<select name="eligibility">'+makeOpts(["Unknown","Under Cap","Likely Eligible","Possible Special","Needs Invite","Needs Slots"],p?.eligibility||"Unknown")+'</select></label>'+
 '<label>Activity<select name="activity">'+makeOpts(["Unknown","Low","Medium","High"],p?.activity||"Unknown")+'</select></label></div>'+
 '<label>Combat strength (optional)<input name="combatStrength" type="text" maxlength="60" value="'+esc(p?.combatStrength||"")+'" placeholder="e.g. PvP / Bear Hunt"></label>'+ '<label>Availability (optional)<input name="availability" type="text" maxlength="60" value="'+esc(p?.availability||"")+'" placeholder="e.g. Evenings / Weekends"></label>'+ '<label>Scouting notes<textarea name="notes" rows="4" maxlength="1500">'+esc(p?.notes||"")+'</textarea></label>'+
 '<details class="scout-intelligence"><summary>✦ Optional Mystic Trials evidence · Demo</summary><p class="smallprint">Enter only observed stages; leave unknowns blank.</p><div class="form-grid">'+TRIALS.map(([label,key])=>'<label>'+esc(label)+' stage<input name="trial_'+key+'" type="number" min="0" max="999" step="1" value="'+(stageValue(p||{},key)??"")+'"></label>').join("")+'</div><label>Evidence source<input name="evidenceSource" type="text" maxlength="160" value="'+esc(p?.evidenceSource||p?.evidence_source||"")+'"></label><label>Observation date<input name="observedAt" type="date" value="'+esc(/^\d{4}-\d{2}-\d{2}$/.test(p?.observedAt||p?.observed_at||"")?(p?.observedAt||p?.observed_at):"")+'"></label></details>'+
 '<div class="actions"><button type="submit">'+(fresh?"Add demo candidate":"Save demo changes")+'</button><button id="cancelEdit" type="button" class="secondary">Cancel</button></div>';
 $("modal").hidden=false;editing=true;$("candidateForm").dataset.editId=p?.id||"";
 $("cancelEdit").onclick=closeEdit;$("candidateForm").querySelector('input[name="name"]').focus();
}
function closeEdit(){$("modal").hidden=true;editing=false;}
$("candidateForm").onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries()),id=e.currentTarget.dataset.editId||"DEMO-"+Date.now().toString(36);const fit=Number(v.fit),power=Number(v.power);if(!v.name.trim()||!v.kingdom.trim()||!Number.isFinite(fit)||fit<0||fit>100||!Number.isFinite(power)||power<0){$("editorError").textContent="Please enter a name, kingdom number, valid power and fit score (0–100).";return;}const previous=players.find(p=>p.id===id);const mysticTrials={};for(const [,key] of TRIALS){const raw=v["trial_"+key];if(raw!==""){const n=Number(raw);if(!Number.isInteger(n)||n<0||n>999){$("editorError").textContent="Mystic Trial stages must be whole numbers from 0 to 999, or left blank.";return;}mysticTrials[key]=n;}delete v["trial_"+key];}
const item={...(previous||{}),...v,id,fit,power,mysticTrials,lastUpdated:"Local demo edit"};if(e.currentTarget.dataset.editId){const idx=players.findIndex(p=>p.id===id);if(idx>=0)players[idx]=item;}else players.unshift(item);selected=id;closeEdit();save();render();};
$("search").oninput=render;
$("sort").onchange=e=>{sort=e.target.value;render();};
document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
$("addCandidate").onclick=()=>editForm(null);
$("editCandidate").onclick=()=>{const p=getSelected();if(p)editForm(p);};
$("deleteCandidate").onclick=()=>{const p=getSelected();if(!p||!confirm("Delete the fictional candidate "+p.name+" from this browser's demo?"))return;players=players.filter(x=>x.id!==p.id);compareIds.delete(p.id);selected=players[0]?.id||"";save();render();};
$("closeModal").onclick=closeEdit;
$("modal").onclick=e=>{if(e.target===$("modal"))closeEdit();};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&editing)closeEdit();});
$("editGroup").onclick=()=>toggleMeta("group",true);
$("cancelGroup").onclick=()=>toggleMeta("group",false);
$("saveGroup").onclick=()=>{transferMeta.group=$("groupInput").value.trim().slice(0,48);storeMeta();showMeta();toggleMeta("group",false);};
$("editDate").onclick=()=>toggleMeta("date",true);
$("cancelDate").onclick=()=>toggleMeta("date",false);
$("saveDate").onclick=()=>{transferMeta.date=$("dateInput").value.trim().slice(0,70);storeMeta();showMeta();toggleMeta("date",false);};
showMeta();
$("resetDemo").onclick=()=>{if(!confirm("Reset all fictional candidates and remove your local demo edits?"))return;players=clone();selected=players[0].id;filter="all";sort="fit";compareIds.clear();$("comparison").innerHTML="";transferMeta={...predictedMeta};storeMeta();showMeta();toggleMeta("group",false);toggleMeta("date",false);$("search").value="";save();render();};
$("exportCsv").onclick=()=>{const cols=["id","name","kingdom","alliance","role","castle","power","fit","status","invitation_type","eligibility","activity","language","timezone","notes"];const csv=[cols.join(","),...filtered().map(p=>cols.map(k=>'"'+String(k==="invitation_type"?invitationType(p):p[k]??"").replace(/"/g,'""')+'"').join(","))].join("\r\n");const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="nxs-transfer-scouting-fictional-demo.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);};
$("compareBtn").onclick=()=>{
 const ids=[...compareIds].map(id=>players.find(p=>p.id===id)).filter(Boolean);
 if(ids.length<2){$("comparison").textContent="Select two or three fictional candidates using the checkboxes in the board.";return;}
 const values=[["Kingdom",p=>"#"+p.kingdom],["Alliance",p=>p.alliance||"–"],["Role",p=>p.role||"–"],["Castle",p=>p.castle||"–"],["Power",p=>fmt(p.power)+"M"],["Demo fit",p=>fmt(p.fit)+"%"],["Activity",p=>p.activity||"–"],["Combat strength",p=>p.combatStrength||"Not provided"],["Availability",p=>p.availability||"Not provided"],["Language",p=>p.language||"–"],["Invitation (provisional)",p=>invitationType(p)],["Transfer",p=>p.eligibility||"Unknown"],["Contact",p=>p.status||"–"]];
 $("comparison").innerHTML='<h3 style="margin:14px 0 8px">Selected candidates · demo comparison</h3><div class="scroll"><table><thead><tr><th>Metric</th>'+ids.map(p=>'<th>'+esc(p.name)+'</th>').join("")+'</tr></thead><tbody>'+values.map(([label,get])=>'<tr><td>'+esc(label)+'</td>'+ids.map(p=>'<td>'+esc(get(p))+'</td>').join("")+'</tr>').join("")+'</tbody></table></div><p class="smallprint">Only fictional data. No transfer outcome is predicted.</p>'+
 '<details class="scout-intelligence"><summary>✦ Compare Mystic Trials · Recorded stages</summary><div class="scroll"><table><thead><tr><th>Trial / evidence</th>'+ids.map(p=>'<th>'+esc(p.name)+'</th>').join("")+'</tr></thead><tbody>'+
 [['Recorded stages',p=>stageCount(p)+"/6"],...TRIALS.map(([label,key])=>[label,p=>trialBar(p,key,Math.max(1,...ids.map(candidate=>stageValue(candidate,key)??0)))]),['Evidence',p=>p.evidenceSource||p.evidence_source||"Not recorded"],['Observed on',p=>p.observedAt||p.observed_at||"Not recorded"]].map(([label,get])=>'<tr><td>'+esc(label)+'</td>'+ids.map(p=>'<td>'+(/^(Research|Governor Gear|Governor Charms|Pets|Heroes & Hero Gear|Other \/ Mixed)$/.test(label)?get(p):esc(get(p)))+'</td>').join("")+'</tr>').join("")+
 '</tbody></table></div><p class="smallprint">Each bar is relative to the highest recorded value for that same trial among selected candidates. This is not completion or a combined strength score. Missing values remain unknown.</p></details>';
 $("comparison").append(recruitmentAssessment(ids));
};

/* Explain recruitment suitability from actual selected demo fields; never invent a universal strength ranking. */
function recruitmentAssessment(ids){
 const out=document.createElement("section");out.className="scout-intelligence assessment";out.setAttribute("aria-label","Provisional recruitment assessment");
 const heading=document.createElement("h3");heading.textContent="✦ NEXUS Recruitment Assessment · Provisional";out.append(heading);
 const section=(name)=>{const node=document.createElement("div");node.className="assessment-group";const h=document.createElement("h4");h.textContent=name;node.append(h);out.append(node);return text=>{const p=document.createElement("p");p.textContent=text;node.append(p);};};
 const summary=section("1 · Recruitment Summary");
 const ordinary=ids.filter(p=>invitationType(p)==="Ordinary"),special=ids.filter(p=>invitationType(p)==="Special");
 summary(ids.map(p=>p.name+" · "+(p.role||"Role unknown")+" · "+fmt(p.power)+"M · "+invitationType(p)+" invitation (provisional) · "+(p.status||"Status unknown")).join(" | "));
 if(ordinary.length&&special.length)summary("At the demo planning cap of "+INVITATION_CAP_M+"M, "+ordinary.map(p=>p.name).join(", ")+" fall(s) within ordinary-invitation planning; "+special.map(p=>p.name).join(", ")+" require(s) special-invitation planning. Verify official rules.");
 else summary("The "+INVITATION_CAP_M+"M ordinary-invitation limit is a fictional planning assumption, not an official game rule.");
 const comparison=section("2 · Development Comparison");
 comparison("Mystic Trials recorded: "+ids.map(p=>p.name+" "+stageCount(p)+"/6").join("; ")+".");
 const differences=[];
 for(const [label,key] of TRIALS){const values=ids.map(p=>({name:p.name,value:stageValue(p,key)}));if(values.some(x=>x.value===null))continue;const high=Math.max(...values.map(x=>x.value)),low=Math.min(...values.map(x=>x.value));if(high===low)continue;differences.push(label+": "+values.filter(x=>x.value===high).map(x=>x.name).join(", ")+" "+high+" (difference "+(high-low)+")");}
 comparison(differences.length?"Higher recorded stage in comparable trials: "+differences.join("; ")+".":"Insufficient comparable trial stages or no recorded differences.");
 comparison("Trial stages describe recorded development only; differences across distinct trial categories cannot be added into an overall strength score.");
 const conclusion=section("3 · Conditional Conclusion");
 const roles=new Map();for(const p of ids){const role=p.role||"Not recorded";if(!roles.has(role))roles.set(role,[]);roles.get(role).push(p.name);}
 if(roles.size>1)conclusion("Recorded role matches: "+[...roles].map(([role,names])=>role+" — "+names.join(", ")).join("; ")+". The actual NXS vacancy determines which match is relevant.");
 else conclusion("All selected profiles show the role "+[...roles.keys()][0]+"; the recorded role does not distinguish them.");
 if(ordinary.length===1&&special.length===1)conclusion("For an ordinary-invitation vacancy under the provisional cap, "+ordinary[0].name+" is within the planning limit; "+special[0].name+" would need special-invitation planning. Neither condition proves actual transfer eligibility.");
 else conclusion("Invitation requirement: "+ids.map(p=>p.name+" — "+invitationType(p)).join("; ")+". Verify these estimates against official limits.");
 conclusion("Contact progress: "+ids.map(p=>p.name+" — "+(p.status||"Not recorded")).join("; ")+".");
 conclusion("No overall better candidate can be established without the specific opening and evidence of battle performance, participation and confirmed transfer eligibility.");
 const note=document.createElement("p");note.className="assessment-disclaimer";note.textContent="Fictional demo assessment · Editable fit scores, Total Power and trial stages are not proof of combat strength or reliability.";out.append(note);
 return out;
}
/* Optional player detail in existing profile; never changes candidate schema, editors or comparison calculations. */
function renderIntelligence(){
 const el=$("intelligenceContent"),p=getSelected();
 if(!el)return;
 el.replaceChildren();
 if(!p){el.textContent="Select a player to see recorded intelligence.";return;}
 const add=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;el.append(n);};
 const known=(v)=>v===null||v===undefined||String(v).trim()===""?"Not recorded":String(v);
 add("h3","Mystic Trials · Recorded stages ("+stageCount(p)+"/6)");
 if(stageCount(p)===0){
  add("p","No Mystic Trial stages recorded for this candidate. No development strength can be inferred.");
 }else{
  const grid=document.createElement("div");grid.className="trial-grid";const scale=Math.max(1,...TRIALS.map(([,key])=>stageValue(p,key)??0));
  for(const [name,key] of TRIALS){const row=document.createElement("div");row.className="trial-row";const title=document.createElement("span");title.textContent=name;row.append(title);const bar=document.createElement("div");bar.innerHTML=trialBar(p,key,scale);row.append(bar);grid.append(row);}el.append(grid);
  add("p","Bar lengths are relative to this profile's highest recorded stage, not trial completion.");
  if(stageCount(p)<6)add("p","Incomplete profile: unrecorded stages remain unknown.");
  add("h3","Development observations · Limited to recorded data");
  add("p","These are observed trial stages, not verified combat attributes. Compare each trial only with the same named trial in another profile; stages from different trials cannot be added together as a strength score.");
 }
 add("h3","Evidence & History");
 add("p","Evidence: "+known(p.evidenceSource||p.evidence_source));
 add("p","Observation date: "+known(p.observedAt||p.observed_at));
 add("p","Historical observations: not yet recorded. Existing scouting details above remain unchanged.");
 add("h3","NEXUS Intelligence · Observed facts");
 const facts=[];
 if(p.power!==null&&p.power!==undefined&&p.power!==""){
  const n=Number(p.power);if(Number.isFinite(n))facts.push("Recorded Total Power: "+fmt(n)+"M.");
 }
 if(p.castle)facts.push("Recorded castle level: "+p.castle+".");
 if(p.status)facts.push("Current scouting status: "+p.status+".");
 if(p.eligibility)facts.push("Transfer eligibility estimate: "+p.eligibility+".");
 add("p",facts.join(" ")||"No verifiable development details have been recorded.");
 add("p","Demo fit is an editable illustration, not a game-measured strength. Troop Power and battle outcomes are not inferred.");
}

render();
})();