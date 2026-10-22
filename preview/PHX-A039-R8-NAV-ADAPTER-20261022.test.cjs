/* PHX navigation adapter contract test: run with node, no browser required. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/PHX-A039-R8-NAV-ADAPTER-20261022.js','utf8');
const calls=[];const window={phxNavigate:(route)=>calls.push(route)};
vm.runInNewContext(source,{window,Object});
const api=window.phxNavigationCapabilities;
assert.equal(api.openExisting('map'),true);
assert.equal(api.openExisting('report'),true);
assert.equal(api.openExisting('home'),true);
assert.equal(api.openExisting('territory'),false,'Do not silently route territory to home');
assert.equal(api.openExisting('pylon'),false,'PYLON modal needs its own verified contract');
assert.deepEqual(calls,['map','report','home']);
window.phxNavigate=undefined;
assert.equal(api.openExisting('map'),false);
console.log('PASS: existing routes reused; unsupported territory/PYLON rejected; missing router safe');
