// NXS #1885: installable Google Sheets trigger, not a simple onEdit trigger.
const NXS_SYNC_URL='https://hcjrdofkdkasznywvcxo.supabase.co/functions/v1/outpost-sync';
function nxsSyncOutposts(){
const sheet=SpreadsheetApp.getActive().getSheetByName('Outpost Data');
if(!sheet)throw Error('Outpost Data tab not found');
const secret=PropertiesService.getScriptProperties().getProperty('NXS_OUTPOST_SYNC_SECRET');
if(!secret)throw Error('Set NXS_OUTPOST_SYNC_SECRET in Script Properties');
const rows=[];const data=sheet.getDataRange().getDisplayValues();
for(let i=1;i<data.length;i++){
const c=data[i],name=String(c[1]||'').trim();if(!name)continue;
rows.push({row:i+1,level:Number(String(c[0]).replace(/[^0-9]/g,'')),structure_type:name,alliance:c[3],coord_x:Number(c[4]),coord_y:Number(c[5])});
}
if(!rows.length)throw Error('Empty outpost input');
const resp=UrlFetchApp.fetch(NXS_SYNC_URL,{method:'post',contentType:'application/json',headers:{'x-outpost-sync-secret':secret},payload:JSON.stringify({source:'kingdom-1885-live-outpost-map',rows}),muteHttpExceptions:true});
if(resp.getResponseCode()!==200)throw Error('Sync failed '+resp.getResponseCode());
return JSON.parse(resp.getContentText());
}
