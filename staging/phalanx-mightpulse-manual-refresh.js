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
  const source=document.createElement("div");
  source.setAttribute("aria-live","polite");
  source.style.cssText="margin-top:14px;padding:14px;border:1px solid #887044;border-radius:12px;background:#101a2a;line-height:1.6";
  root.append(button,status,source);
  const fmt=v=>v&&Number.isFinite(Date.parse(v))?new Date(v).toLocaleString("de-DE"):"unbekannt";
  const line=(label,value)=>{const p=document.createElement("div");const b=document.createElement("strong");b.textContent=label+": ";p.append(b,document.createTextNode(value));return p;};
  let lastData=null,alive=true;
  function draw(){
    if(!alive)return;
    source.replaceChildren();
    if(!lastData){source.append(line("Status","Wird geladen …"));return;}
    const data=lastData;
    const latest=data.sourceLatest?Date.parse(data.sourceLatest):NaN;
    const age=Number.isFinite(latest)?Math.max(0,Math.floor((Date.now()-latest)/60000)):null;
    const health=!data.successful?"⚠ Letzter Abruf unvollständig":age===null?"⚪ Datenalter unbekannt":age<=360?"🟢 Aktuell (bis 6 Stunden)":age<=1440?"🟡 Älter (6–24 Stunden)":"🔴 Veraltet (über 24 Stunden)";
    source.append(line("MightPulse-Status",health),line("Letzter Abruf",fmt(data.lastCheck)),line("MightPulse-Datenstand",fmt(data.sourceLatest)),line("Datenalter",age===null?"unbekannt":Math.floor(age/60)+" Std. "+age%60+" Min."),line("Qualitätsprüfung",data.lastCheck?(data.passed??"?")+"/"+(data.total??16)+" Rankings":"Noch kein Abruf"),line("Nächster automatischer Abruf",fmt(data.nextScheduled)));
    if(data.automaticEnabled!==true)source.append(line("Automatik","Nicht aktiv"));
  }
  async function loadStatus(){
    try{
      const {data,error}=await supabase.functions.invoke("phalanx-mightpulse-status",{method:"GET"});
      if(error)throw error;
      lastData=data;draw();
    }catch{source.replaceChildren(line("Status","Aktualisierungsstatus derzeit nicht abrufbar."));}
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
