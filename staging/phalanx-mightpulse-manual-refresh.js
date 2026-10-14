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
  root.append(button,status);
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
      status.textContent=data.ok
        ? "✓ 16/16 geprüft · Letzter Abruf: "+time
        : "⚠ "+(data.passed??"?")+"/16 geprüft · Letzter Abruf: "+time+" · Details im Prüfprotokoll.";
    }catch(err){
      status.textContent="⚠ Aktualisierung fehlgeschlagen. Bitte Anmeldung und Verbindung prüfen.";
      console.error("PHALANX MightPulse manual refresh failed",err);
    }finally{busy=false;button.disabled=false;button.textContent="↻ Rankings aktualisieren";}
  });
  return ()=>root.remove();
}
