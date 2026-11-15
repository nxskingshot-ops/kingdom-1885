'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','war-room-v2-design-reference.html'),'utf8');
const checks=[
 ['five sections',()=>['COMMANDER PROFILE','ACCOUNT INTELLIGENCE','ALLIANCE POSITION','PLAYER DEVELOPMENT','COMMAND ACCESS'].every(x=>html.includes(x))],
 ['power present',()=>html.includes('id="power"')&&html.includes('Power')],
 ['identity placeholders',()=>['playerName','level','alliance','kingdom','playerId','updated'].every(x=>html.includes('id="'+x+'"'))],
 ['three shortcut targets',()=>['territory','reports','pylon'].every(x=>html.includes('data-target="'+x+'"'))],
 ['no false live values',()=>html.includes('Live data pending')&&html.includes('Data pending')],
 ['no backend requests',()=>!/(?:fetch\s*\(|XMLHttpRequest|createClient\s*\()/.test(html)],
 ['no data writes',()=>!/(?:localStorage\.setItem|sessionStorage\.setItem|indexedDB\.open)/.test(html)],
 ['no unauthorized original emblem claim',()=>html.includes('original PYLON IX emblem pending verification')],
 ['accessible expandable controls',()=>html.includes('aria-expanded="false"')&&html.includes("setAttribute('aria-expanded'")],
 ['no forbidden metrics',()=>!/(?:Master Power|Hero Power|Pet Power)/.test(html)]
];
let failed=0;for(const [name,fn] of checks){let pass=false;try{pass=!!fn()}catch{}console.log((pass?'BESTANDEN':'FEHLGESCHLAGEN')+': '+name);if(!pass)failed++}
console.log('Structural checks: '+(checks.length-failed)+'/'+checks.length+'. Visual pixel match, Android UI, backend, navigation and persistence: NICHT GETESTET.');
process.exitCode=failed?1:0;
