#!/usr/bin/env node
// PHX-A042: non-destructive route gate for standalone A039-R11 HTML.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const p=process.argv[2];
if(!p){console.error('Usage: node PHX-A042-R11-ROUTE-GATE.cjs <R11.html>');process.exit(2)}
const s=fs.readFileSync(p,'utf8');
const one=(needle)=>assert.equal(s.split(needle).length-1,1,'Expected exactly one: '+needle);
one('function openTarget(v)');
one('window.phxNavigate=navigate');
one('id="phx-r6-home"');
one('id="phx-r8-war-entry"');
assert.ok(s.includes('phx-r8-war-back'));
assert.ok(!s.includes("if(v==='territory'){location.hash='home';return;}"),'Legacy War Room #home route remains');
assert.ok(s.includes('data-target="territory"'),'Existing Territory entry missing');
assert.ok(s.includes('id="report"'),'Reports view missing');
assert.ok(s.includes('id="map"'),'Map view missing');
console.log('PASS: R11 navigation structure and legacy War Room route gate');
