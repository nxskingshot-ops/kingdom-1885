// Nexus App · Kingdom #1885 · Verified Outposts → Supabase canonical map source
// Install in the Google Sheet "Kingdom 1885 – Verified Outposts – Nexus App".
// Requires Script Property NXS_OUTPOST_SYNC_SECRET. Never place the secret in cells or source control.
const NEXUS_VERIFIED_OUTPOST_SYNC_URL='https://hcjrdofkdkasznywvcxo.supabase.co/functions/v1/verified-outpost-sync';
const NEXUS_VERIFIED_OUTPOST_TAB='Outposts #1885';

function nexusSyncVerifiedOutposts(){
  const sheet=SpreadsheetApp.getActive().getSheetByName(NEXUS_VERIFIED_OUTPOST_TAB);
  if(!sheet)throw Error(NEXUS_VERIFIED_OUTPOST_TAB+' tab not found');
  const secret=PropertiesService.getScriptProperties().getProperty('NXS_OUTPOST_SYNC_SECRET');
  if(!secret)throw Error('Set NXS_OUTPOST_SYNC_SECRET in Script Properties');

  const values=sheet.getRange(4,1,Math.max(1,sheet.getLastRow()-3),7).getDisplayValues();
  const rows=[];
  for(let i=0;i<values.length;i++){
    const [structure,levelRaw,xRaw,yRaw,bonus,alliance,status]=values[i];
    if(!String(structure||'').trim()&&!String(alliance||'').trim())continue;
    const rowNumber=i+4;
    const level=Number(String(levelRaw||'').replace(/[^0-9]/g,''));
    const x=Number(xRaw),y=Number(yRaw);
    if(!String(structure||'').trim()||!String(alliance||'').trim()||!Number.isInteger(level)||!Number.isInteger(x)||!Number.isInteger(y))
      throw Error('Incomplete or invalid outpost row '+rowNumber);
    if(String(status||'').trim().toUpperCase()!=='VERIFIED')
      throw Error('Row '+rowNumber+' is not marked Verified');
    rows.push({
      row_no:rows.length+1,
      structure_type:String(structure).trim(),
      level,
      coord_x:x,
      coord_y:y,
      bonus:String(bonus||'').trim(),
      alliance:String(alliance).trim(),
      status:'Verified'
    });
  }

  if(rows.length<50)throw Error('Safety stop: fewer than 50 verified rows; no sync sent');

  const response=UrlFetchApp.fetch(NEXUS_VERIFIED_OUTPOST_SYNC_URL,{
    method:'post',
    contentType:'application/json',
    headers:{'x-outpost-sync-secret':secret},
    payload:JSON.stringify({source:'kingdom-1885-verified-outposts',rows}),
    muteHttpExceptions:true
  });
  const code=response.getResponseCode();
  if(code!==200)throw Error('Verified outpost sync failed '+code+': '+response.getContentText());
  return JSON.parse(response.getContentText());
}

function nexusOnVerifiedOutpostEdit(e){
  if(!e?.range||e.range.getSheet().getName()!==NEXUS_VERIFIED_OUTPOST_TAB)return;
  if(e.range.getRow()<4)return;
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000))return;
  try{nexusSyncVerifiedOutposts()}finally{lock.releaseLock()}
}

function nexusInstallVerifiedOutpostTrigger(){
  const exists=ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='nexusOnVerifiedOutpostEdit');
  if(!exists)ScriptApp.newTrigger('nexusOnVerifiedOutpostEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
  return nexusSyncVerifiedOutposts();
}
