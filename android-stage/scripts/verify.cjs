'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const expected=JSON.parse(fs.readFileSync(path.join(base,'checksums.json'),'utf8'));
let ok=true;
for(const [name,hash] of Object.entries(expected)){
 const p=path.join(base,'www',name);
 if(!fs.existsSync(p)){console.error('FEHLT: '+name);ok=false;continue;}
 const got=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 const pass=got===hash;console.log((pass?'BESTANDEN':'FEHLGESCHLAGEN')+': '+name);ok=ok&&pass;
}
const file=path.join(base,'www','index.html');
if(fs.existsSync(file)){
 const html=fs.readFileSync(file,'utf8');
 for(const term of ['phxNavigate','phx-r6-home','PHX_HOME_QUEEN_AN_APPROVED.png']){
  const pass=html.includes(term);console.log((pass?'BESTANDEN':'FEHLGESCHLAGEN')+': Marker '+term);ok=ok&&pass;
 }
}
if(!ok)process.exit(1);
