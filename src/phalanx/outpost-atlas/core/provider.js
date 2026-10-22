import {validateOutposts} from './data-contract.js';

// The Atlas runs inside R11's same-origin iframe. Reuse the host's explicitly
// configured provider; never fetch data automatically or bypass host authorization.
function authorizedProvider(){
 if(typeof window.PHALANX_OUTPOST_DATA_PROVIDER==='function')
  return window.PHALANX_OUTPOST_DATA_PROVIDER;
 try{
  if(window.parent!==window &&
     window.parent.location.origin===window.location.origin &&
     typeof window.parent.PHALANX_OUTPOST_DATA_PROVIDER==='function')
   return window.parent.PHALANX_OUTPOST_DATA_PROVIDER;
 }catch(_){ /* cross-origin frame: fail closed */ }
 return null;
}
export async function loadAuthorizedOutposts({signal}={}){
 const provider=authorizedProvider();
 if(!provider)throw Error('Kein freigegebener Datenanbieter konfiguriert');
 const result=await provider({signal});
 const rows=Array.isArray(result)?result:result?.rows;
 if(!rows)throw Error('Ungültige Antwort des Datenanbieters');
 return validateOutposts(rows);
}
