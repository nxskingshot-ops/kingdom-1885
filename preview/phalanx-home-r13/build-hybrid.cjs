'use strict';
/* Isolated R15 Hybrid C build. Runs the original verified R15 builder unchanged.
   Usage: node build-hybrid.cjs /path/to/verified-R12.html /path/to/new/output
   Requires original home-header.jpg alongside build.cjs.
*/
const {spawnSync}=require('node:child_process');
const {readFileSync,writeFileSync,existsSync,mkdirSync}=require('node:fs');
const {resolve,join}=require('node:path');
const {createHash}=require('node:crypto');
const source=resolve(process.argv[2]||'');
const out=resolve(process.argv[3]||'');
if(process.argv.length!==4) throw Error('Usage: node build-hybrid.cjs R12_SOURCE NEW_OUTPUT_DIR');
if(existsSync(out)) throw Error('Output already exists; refusing to overwrite: '+out);
const digest=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
if(digest(source)!=='ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42') throw Error('R12 SHA mismatch');
if(digest(join(__dirname,'home-header.jpg'))!=='9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016') throw Error('Original R15 header missing or SHA mismatch');
const r=spawnSync(process.execPath,[join(__dirname,'build.cjs'),source,out],{stdio:'inherit'});
if(r.status!==0) throw Error('Original R15 build failed');
const file=join(out,'index.html');
let html=readFileSync(file,'utf8');
const once=(needle,replacement)=>{
 const start=html.indexOf(needle);if(start<0||html.indexOf(needle,start+needle.length)>=0) throw Error('Expected unique marker: '+needle);
 html=html.slice(0,start)+replacement+html.slice(start+needle.length);
};
if(!html.includes('data-home-version="PHX-007-R15"'))throw Error('Not R15');
if(html.includes('phx-hc-pylon'))throw Error('Already integrated');
// Match the actual HOME section boundary, not the first nested closing tag.
const start=html.indexOf('<section id="phx-r6-home"');
if(start<0||html.indexOf('<section id="phx-r6-home"',start+1)>=0)throw Error('HOME section missing or duplicated');
const tag=/<\/?section\b[^>]*>/g;
tag.lastIndex=start;
let depth=0,end=-1,match;
while((match=tag.exec(html))){
  depth+=match[0].startsWith('</')?-1:1;
  if(depth===0){end=match.index;break;}
  if(depth<0)throw Error('HOME section nesting invalid');
}
if(end<start||!html.slice(start,end).includes('class="phx-home-command"'))throw Error('HOME structure unexpected');
const panels=`
    <section class="phx-hc-pylon" aria-label="PYLON IX">
      <div class="phx-hc-pylon-emblem" aria-hidden="true"><img id="phx-hc-original-pylon" alt="" hidden></div>
      <div><strong>PYLON IX</strong><small>Alliance command · Strategic intelligence</small></div>
      <button type="button" data-home-action="pylon" aria-label="Open PYLON IX">›</button>
    </section>
    <section class="phx-hc-war-table" aria-label="War Room strategy table">
      <div class="phx-hc-war-heading"><span>⚔</span><div><strong>WAR ROOM</strong><small id="phx-hc-war-subtitle">Command table · Kingdom #1885</small></div></div>
      <div class="phx-hc-map" aria-hidden="true"><div class="phx-hc-map-ring"></div><div class="phx-hc-map-core" id="phx-hc-map-alliance">—</div></div>
      <button type="button" data-home-action="war">Enter War Room <span aria-hidden="true">›</span></button>
    </section>
`;
html=html.slice(0,end)+panels+html.slice(end);
const css=readFileSync(join(__dirname,'hybrid.css'),'utf8');
const js=readFileSync(join(__dirname,'hybrid.js'),'utf8');
once('</head>','<style id="phx-hybrid-c-isolated-css">\n'+css+'\n</style>\n</head>');
once('</body>','<script id="phx-hc-dynamic-adapter">\n'+js+'\n</script>\n</body>');
for(const id of ['phx-hc-original-pylon','phx-hc-map-alliance','phx-hc-dynamic-adapter'])if(html.split('id="'+id+'"').length!==2)throw Error('Duplicate or missing '+id);
writeFileSync(file,html);
console.log(JSON.stringify({status:'BUILT_NOT_BROWSER_TESTED',r15sha256:digest(file),bytes:Buffer.byteLength(html),output:file},null,2));
