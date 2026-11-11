'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dir=__dirname;
const read=name=>fs.readFileSync(path.join(dir,name),'utf8');
test('R15 original builder remains SHA-pinned',()=>{
 const code=read('build.cjs');
 assert.match(code,/ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42/);
 assert.match(code,/9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016/);
});
test('Hybrid wrapper uses original R15 builder and never overwrites output',()=>{
 const code=read('build-hybrid.cjs');
 assert.match(code,/spawnSync\(process\.execPath/);
 assert.match(code,/Output already exists; refusing to overwrite/);
 assert.match(code,/R12 SHA mismatch/);
 assert.match(code,/Original R15 header missing or SHA mismatch/);
 assert.match(code,/phx-hc-original-pylon/);
 assert.match(code,/phx-hc-map-alliance/);
});
test('Hybrid CSS scoped to HOME',()=>{
 const css=read('hybrid.css');
 const rules=css.split('}').map(x=>x.trim()).filter(Boolean);
 assert.ok(rules.length>=10);
 for(const rule of rules){
   const selector=rule.split('{')[0].trim();
   assert.ok(selector.startsWith('#phx-r6-home '),'Unscoped selector: '+selector);
 }
});
test('Hybrid JS uses existing artwork and reads dynamic state without persistence',()=>{
 const js=read('hybrid.js');
 assert.match(js,/phx-pylon-modal/);
 assert.match(js,/phx-r11-alliance/);
 assert.match(js,/phx-r11-kingdom/);
 assert.match(js,/phx-r11-language-select/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\s*\(|\.remove\s*\(/);
});
test('Build source files have valid JS syntax',()=>{
 const vm=require('node:vm');
 for(const file of ['build-hybrid.cjs','hybrid.js'])assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
});

test('Nested HOME sections resolve to the outer closing tag',()=>{
 const builder=read('build-hybrid.cjs');
 assert.ok(builder.includes('const tag=/<\\/?section\\b[^>]*>/g;'));
 const html='<section id="phx-r6-home"><section class="nested"></section><div class="phx-home-command"></div></section><section id="other"></section>';
 const start=html.indexOf('<section id="phx-r6-home"');
 const tag=/<\/?section\b[^>]*>/g;
 tag.lastIndex=start;
 let depth=0,end=-1,match;
 while((match=tag.exec(html))){
  depth+=match[0].startsWith('</')?-1:1;
  if(depth===0){end=match.index;break;}
 }
 assert.equal(end,html.indexOf('</section><section id="other">'));
});
