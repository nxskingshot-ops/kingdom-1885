#!/usr/bin/env node
// Runtime navigation regression harness: no network, no browser, no frozen-file edits.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert(script,'isolated router script missing');
assert(html.includes('src="about:blank"'),'iframe must not navigate before listener registration');
const hooks={}, links=[];
function link(label){
 const badge={textContent:'NOT LINKED',classList:{remove(){},add(){}}};
 const a={textContent:label,attrs:{'data-pending':'','aria-disabled':''},href:'',title:'',listeners:{},querySelector:s=>s==='.status'?badge:null,
 removeAttribute(k){delete this.attrs[k]},addEventListener(type,fn,capture){this.listeners[type+':'+!!capture]=fn}};
 links.push(a);return a;
}
const map=link('Outpost Map NOT LINKED'),report=link('Report Center NOT LINKED');
const doc={querySelectorAll(s){if(s==='a[data-pending]')return links.filter(x=>'data-pending' in x.attrs);if(s==='.submenu a')return links;throw Error('Unexpected selector '+s)}};
const frame={src:'',contentDocument:doc,contentWindow:{location:{pathname:'/PHALANX_RC5_ALPHA_DERIVED_20261017.html'}},addEventListener(type,fn){hooks[type]=fn}};
const back={disabled:true,addEventListener(type,fn){hooks['back:'+type]=fn}};
const status={textContent:'RC5 lädt …'};
vm.runInNewContext(script[1],{document:{getElementById(id){return {preview:frame,back,status}[id]}},console:{error(...args){throw Error('Router error '+args.join(' '))}}},{timeout:1000});
assert.equal(typeof hooks.load,'function');
assert.equal(frame.src,'./PHALANX_RC5_ALPHA_DERIVED_20261017.html');
hooks.load();
assert.match(status.textContent,/verknüpft/);
assert.equal(report.attrs['data-pending'],undefined);
assert.equal(map.attrs['data-pending'],undefined);
function click(a){let stopped=false;const event={preventDefault(){},stopImmediatePropagation(){stopped=true}};a.listeners['click:true'](event);assert(stopped)}
click(report);
assert.equal(frame.src,'./phalanx-reports-out024-local-adapter-20261019.html');
assert.equal(back.disabled,false);
frame.contentWindow.location.pathname='/phalanx-reports-out024-local-adapter-20261019.html';hooks.load();
assert.match(status.textContent,/Reports-Adapter geladen/);
hooks['back:click']();
assert.equal(frame.src,'./PHALANX_RC5_ALPHA_DERIVED_20261017.html');
assert.equal(back.disabled,true);
// A new RC5 document is created on reload.
links.length=0;
const map2=link('Outpost Map NOT LINKED'),report2=link('Report Center NOT LINKED');
frame.contentWindow.location.pathname='/PHALANX_RC5_ALPHA_DERIVED_20261017.html';hooks.load();
click(map2);
assert.equal(frame.src,'./PHX-OUT-024-MAP2-FROZEN-20261018.html');
frame.contentWindow.location.pathname='/PHX-OUT-024-MAP2-FROZEN-20261018.html';hooks.load();
assert.match(status.textContent,/OUT-024 geladen/);
assert.equal(back.disabled,false);
// Fail-closed regression: missing Reports route must not report a successful link.
links.length=0;
link('Outpost Map NOT LINKED');
frame.contentWindow.location.pathname='/PHALANX_RC5_ALPHA_DERIVED_20261017.html';
let rejected=false;
try { hooks.load(); } catch(e) { rejected=true; }
assert(rejected || /Navigationsfehler/.test(status.textContent),'missing Reports route must fail closed');
console.log('PASS: isolated router initialization, Reports click, adapter load, back, OUT-024 click and map load');
