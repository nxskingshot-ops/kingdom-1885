/**
 * NEXUS PHALANX — staged manual MightPulse refresh control.
 * Does NOT modify production UI or frozen Alpha35.
 * Integration: mountMightPulseRefresh({container, supabase}) where supabase
 * is the existing authenticated Supabase client, never a service-role client.
 */
export function mountMightPulseRefresh({container,supabase}){
  if(!container || !supabase?.functions?.invoke) throw new Error("Authenticated Supabase client and container required");
  const root=document.createElement("section");
  root.className="phalanx-mightpulse-refresh";
  const button=document.createElement("button");
  button.type="button";
  button.textContent="↻ Rankings aktualisieren";
  const status=document.createElement("p");
  status.setAttribute("role","status");
  status.setAttribute("aria-live","polite");
  status.textContent="Noch keine manuelle Aktualisierung gestartet.";
  const source=document.createElement("details");
  source.style.cssText="margin-top:10px;border:1px solid #887044;border-radius:12px;background:#101a2a;color:#f1e2be;overflow:hidden";
  const summary=document.createElement("summary");
  summary.style.cssText="cursor:pointer;list-style-position:inside;padding:12px 14px;line-height:1.5;font-weight:600";
  summary.textContent="◯ MightPulse · Status wird geladen …";
  const details=document.createElement("div");
  details.style.cssText="padding:0 14px 12px;line-height:1.6;font-size:.92em;overflow-wrap:anywhere";
  source.append(summary,details);
  const notice=document.createElement("div");
  notice.style.cssText="display:none;margin-top:12px;border:1px solid #b7964d;border-radius:12px;padding:12px 14px;background:#1d2b32;line-height:1.5";
  const noticeTitle=document.createElement("strong");
  const noticeBody=document.createElement("div");
  const noticeButton=document.createElement("button");
  noticeButton.type="button";noticeButton.textContent="Als gesehen markieren";
  noticeButton.style.cssText="width:auto;padding:8px 12px;margin-top:8px;font-size:.9em";
  notice.append(noticeTitle,noticeBody,noticeButton);
  root.append(button,status,notice,source);
  const fmt=v=>v&&Number.isFinite(Date.parse(v))?new Date(v).toLocaleString("de-DE"):"unbekannt";
  const line=(label,value)=>{const p=document.createElement("div");const b=document.createElement("strong");b.textContent=label+": ";p.append(b,document.createTextNode(value));return p;};
  let lastData=null,alive=true,statusError=false;
  const seenKey="phalanx_mightpulse_seen_captures_v1_1885";
  let seen=null;
  try{seen=JSON.parse(localStorage.getItem(seenKey)||"null");}catch{seen=null;}
  function sourceMap(data){
    const raw=data?.boardCapturedAt;
    if(!raw||typeof raw!=="object")return {};
    return Object.fromEntries(Object.entries(raw).filter(([k,v])=>typeof k==="string"&&typeof v==="string"&&Number.isFinite(Date.parse(v))));
  }
  function saveSeen(map){seen={...map};try{localStorage.setItem(seenKey,JSON.stringify(seen));}catch{}}
  function drawNotice(){
    const current=sourceMap(lastData);
    const names=Object.keys(current);
    if(!names.length){notice.style.display="none";return;}
    if(seen===null){saveSeen(current);notice.style.display="none";return;}
    const changed=names.filter(k=>!seen[k]||Date.parse(current[k])>Date.parse(seen[k]));
    notice.style.display="";
    if(changed.length){
      noticeTitle.textContent="✨ Neue MightPulse-Quelldaten verfügbar";
      noticeBody.textContent=changed.length+" von "+names.length+" Rankings haben seit deinem letzten bestätigten Datenstand einen neueren Quellenzeitstempel. Das bedeutet nicht zwingend, dass sich Spielerwerte geändert haben.";
      noticeButton.hidden=false;
    }else{
      noticeTitle.textContent="✓ Keine neueren MightPulse-Quelldaten";
      noticeBody.textContent="PHALANX hat geprüft. Seit deinem bestätigten Datenstand gibt es keinen neueren Quellenzeitstempel.";
      noticeButton.hidden=true;
    }
  }
  noticeButton.addEventListener("click",()=>{saveSeen(sourceMap(lastData));drawNotice();});
  function draw(){
    if(!alive)return;
    details.replaceChildren();
    if(statusError){summary.textContent="⚠ MightPulse · Status nicht abrufbar";details.append(line("Hinweis","Verbindung oder Anmeldung prüfen."));return;}
    if(!lastData){summary.textContent="◯ MightPulse · Status wird geladen …";return;}
    const data=lastData;
    const latest=data.sourceLatest?Date.parse(data.sourceLatest):NaN;
    const age=Number.isFinite(latest)?Math.max(0,Math.floor((Date.now()-latest)/60000)):null;
    const health=!data.lastCheck?"⚪ Noch kein Abruf":data.successful===false?"⚠ Abruf fehlgeschlagen":age===null?"⚪ Datenstand unbekannt":age<=360?"🟢":age<=1440?"🟡":"🔴";
    const ageText=age===null?"unbekannt":Math.floor(age/60)+" Std. "+age%60+" Min.";
    summary.textContent=health+" Daten "+(age===null?"unbekannt":Math.floor(age/60)+"h "+age%60+"m")+" alt · "+(data.passed??"?")+"/"+(data.total??16)+" geprüft";
    details.append(line("Letzter PHALANX-Abruf",fmt(data.lastCheck)),line("Datenstand laut MightPulse",fmt(data.sourceLatest)),line("Alter der MightPulse-Daten",ageText),line("PHALANX-Qualitätsprüfung",data.lastCheck?(data.passed??"?")+"/"+(data.total??16)+" Rankings geprüft":"Noch kein Abruf"),line("Nächster geplanter PHALANX-Abruf",fmt(data.nextScheduled)));
    details.append(line("Hinweis","Ein erfolgreicher Abruf bedeutet nicht, dass MightPulse neue Spielwerte geliefert hat."));if(data.automaticEnabled!==true)details.append(line("Automatik","Nicht aktiv"));
  }
  async function loadStatus(){
    try{
      const {data,error}=await supabase.functions.invoke("phalanx-mightpulse-status",{method:"GET"});
      if(error)throw error;
      lastData=data;statusError=false;draw();drawNotice();
    }catch{statusError=true;draw();notice.style.display="none";}
  }
  draw();loadStatus();
  const refreshTimer=setInterval(()=>{if(alive)loadStatus()},60000);
  container.append(root);
  let busy=false;
  button.addEventListener("click",async()=>{
    if(busy)return;
    busy=true;button.disabled=true;button.textContent="Aktualisierung läuft …";
    status.textContent="16 Rankings werden geprüft …";
    try{
      const {data,error}=await supabase.functions.invoke("phalanx-mightpulse-poll",{method:"POST"});
      if(error)throw error;
      if(!data?.historySaved)throw new Error("Abruf wurde nicht gespeichert.");
      const time=data.checkedAtUtc?new Date(data.checkedAtUtc).toLocaleString("de-DE"):"unbekannt";
      await loadStatus();status.textContent=data.ok
        ? "✓ 16/16 geprüft · Letzter Abruf: "+time
        : "⚠ "+(data.passed??"?")+"/16 geprüft · Letzter Abruf: "+time+" · Details im Prüfprotokoll.";
    }catch(err){
      status.textContent="⚠ Aktualisierung fehlgeschlagen. Bitte Anmeldung und Verbindung prüfen.";
      console.error("PHALANX MightPulse manual refresh failed",err);
    }finally{busy=false;button.disabled=false;button.textContent="↻ Rankings aktualisieren";}
  });
  return ()=>{alive=false;clearInterval(refreshTimer);root.remove();};
}
