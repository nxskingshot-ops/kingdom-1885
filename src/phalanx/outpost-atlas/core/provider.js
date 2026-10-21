import {validateOutposts} from './data-contract.js';
export async function loadAuthorizedOutposts({signal}={}){
 const provider=window.PHALANX_OUTPOST_DATA_PROVIDER;
 if(typeof provider!=='function')throw Error('Kein freigegebener Datenanbieter konfiguriert');
 const result=await provider({signal});
 const rows=Array.isArray(result)?result:result?.rows;
 if(!rows)throw Error('Ungültige Antwort des Datenanbieters');
 return validateOutposts(rows);
}
