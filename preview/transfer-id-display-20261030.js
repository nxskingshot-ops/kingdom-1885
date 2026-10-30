// Display-only helpers. Original player IDs and provider values stay unchanged.
export function formatPlayerNumber(value) {
 if(value===null||value===undefined||value==='')return 'Nicht verfügbar';
 if(typeof value!=='number'&&typeof value!=='string')return 'Nicht verfügbar';
 const number=Number(value);
 return Number.isFinite(number)&&number>=0?number.toLocaleString('de-DE',{maximumFractionDigits:0}):'Nicht verfügbar';
}
export function formatPlayerUtc(value) {
 if(value===null||value===undefined||value==='')return 'Nicht verfügbar';
 let date;
 if(typeof value==='number'||(typeof value==='string'&&/^\d+(?:\.\d+)?$/.test(value))){
  const number=Number(value);
  if(!Number.isFinite(number)||number<0)return 'Nicht verfügbar';
  date=new Date(number>=1e12?number:number*1000);
 }else if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)&&/(?:Z|[+-]\d{2}:\d{2})$/.test(value))date=new Date(value);
 else return 'Nicht verfügbar';
 if(!Number.isFinite(date.getTime()))return 'Nicht verfügbar';
 const iso=date.toISOString();
 return iso.slice(8,10)+'.'+iso.slice(5,7)+'.'+iso.slice(0,4)+' · '+iso.slice(11,19)+' UTC';
}
export function formatPlayerSection(status) {
 return ({available:'Vorhanden',empty:'Keine Einträge',missing:'Nicht verfügbar',unexpected_shape:'Datenformat nicht unterstützt'})[status]||'Nicht bestätigt';
}
export function playerLookupError(status) {
 return ({401:'Die Anmeldung ist abgelaufen. Bitte erneut anmelden.',403:'Dein Konto hat keine Berechtigung für diese Abfrage.',404:'Zu dieser Governor-ID wurde kein Spieler gefunden.',429:'Das Abfragekontingent ist erreicht. Bitte später erneut versuchen.',502:'Die Spielerquelle ist momentan nicht erreichbar oder liefert unbestätigte Daten.',503:'Die Abfrage ist momentan nicht verfügbar. Bitte später erneut versuchen.',504:'Die Spielerquelle hat nicht rechtzeitig geantwortet.'})[status]||'Abfrage nicht verfügbar ('+status+').';
}
