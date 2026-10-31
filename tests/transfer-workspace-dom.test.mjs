// Full DOM integration with synthetic in-memory data only. No external network or database writes.
// Run with PHX_JSDOM_MODULE pointing to an installed jsdom module (26.1.0 used for this milestone).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {candidateFromLookup,duplicateLookupFilter} from '../preview/transfer-id-candidate-20261030.js';
import {formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError} from '../preview/transfer-id-display-20261030.js';
const {JSDOM}=await import(process.env.PHX_JSDOM_MODULE||'jsdom');
const html=readFileSync('preview/transfer-scouting-id-stage-20261030.html','utf8');
const original=readFileSync('preview/transfer-scouting-id-stage-20261030.js','utf8');
const header=x=>x.match(/<header class="phx-original-header">.*?<\/header>/s)[0];
const base=[{candidate_id:'QA-1',player_name:'Synthetic Sentinel',kingdom:'1885',alliance:'QA',power_m:123,contact_status:'Scouted',notes:'Preserve this note',metadata:{governor_id:'101',role:'Fighter',mystic_trials:{coliseum:'11-7'},external_lookup:{source_cached_at:'1793392324.689'}},updated_at:'2026-10-31T12:00:00Z'}, {candidate_id:'QA-2',player_name:'Synthetic Vanguard',kingdom:'1555',alliance:'QA',power_m:234,contact_status:'Contacted',metadata:{governor_id:'102'},updated_at:'2026-10-30T12:00:00Z'}];
const tick=()=>new Promise(r=>setImmediate(r));
async function setup(options={}){
 const dom=new JSDOM(html,{url:'https://qa.invalid/',runScripts:'outside-only'}),w=dom.window,ctx=dom.getInternalVMContext();
 let records=structuredClone(options.empty?[]:base),writes=0,reads=0,blob,download=false;
 const $=id=>w.document.getElementById(id);
 w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLAnchorElement.prototype.click=function(){download=true;};
 const db={auth:{getUser:async()=>({data:{user:options.loggedOut?null:{id:'synthetic'}},error:null}),getSession:async()=>({data:{session:{access_token:'synthetic-only'}}})},from(table){let op='read',data,match;
 const q={select(){return q},order(){return q},eq(k,v){match=[k,v];return q},or(v){match=['duplicate',v];return q},update(v){op='update';data=v;return q},insert(v){op='insert';data=v;return q},limit(){return q},maybeSingle(){return q},then(resolve){let result;
 if(table==='nxs_memberships')result={data:{active:options.active!==false,role:options.role||'r4',expires_at:options.expired?'2020-01-01T00:00:00Z':null}};
 else if(op==='insert'){writes++;records.push(data);result={data:{candidate_id:data.candidate_id}};}
 else if(op==='update'){writes++;const row=records.find(x=>x[match[0]]===match[1]);Object.assign(row,data);result={data:{candidate_id:row.candidate_id}};}
 else {reads++;result={data:match?.[0]==='duplicate'?records.filter(p=>match[1].includes(p.candidate_id)||match[1].includes('eq.'+p.metadata?.governor_id)):records};}
 return Promise.resolve({...result,error:null}).then(resolve)} };return q}};
 const payload=id=>({ok:true,governorId:id,player:{name:'Synthetic Pathfinder',kingdom:1555,alliance:'QA',power:232228946},source:{cachedAt:1793392324.689},checkedAtUtc:'2026-10-31T12:00:00Z',arenaSquad:{status:'available',heroes:[{name:'Synthetic Hero',level:80,star:4}]},ranks:{status:'available',values:{power_rank:9,kills_rank:6,migrant_rank:6,mystic_trial:1561}}});
 const mockFetch=async input=>{const url=String(input);if(url.includes('phalanx-transfer-intelligence-stage-20261031'))return Response.json({observations:[{player_name:'Synthetic Internal',alliance_tag:'QA',coliseum_stage:'10-5'}],power_references:[{player_name:'Synthetic Internal',power_m:100}],snapshot_date:'2026-10-31'});if(options.fetchHook)await options.fetchHook($);return Response.json(payload(new URL(url).searchParams.get('governorId')));};
 const NativeURL=URL;class TestURL extends NativeURL{static createObjectURL(value){blob=value;return 'blob:synthetic'}static revokeObjectURL(){}}
 Object.assign(ctx,{candidateFromLookup,duplicateLookupFilter,formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError,createClient:()=>db,fetch:mockFetch,URL:TestURL,Blob,AbortController,setTimeout,clearTimeout,setInterval:()=>0});
 let source=original.replace(/^import .*?;\n/gm,'').replace("const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');",'');
 vm.runInContext(source,ctx);await tick();await tick();
 return {dom,w,$,records:()=>records,writes:()=>writes,reads:()=>reads,blob:()=>blob,download:()=>download,run:s=>vm.runInContext(s,ctx),submit:async()=>{const ev=new w.Event('submit',{bubbles:true,cancelable:true});$('phxIdForm').dispatchEvent(ev);await tick();await tick();}};
}
test('accepted header and original reference stylesheet remain byte-identical to deployed source commit',()=>{
 assert.equal(header(html),header(execFileSync('git',['show','e49fa01ce7eb51babba0b405c518f1d01d729657:preview/transfer-scouting-id-stage-20261030.html'],{encoding:'utf8'})));
 assert.equal(readFileSync('preview/transfer-phalanx-reference-20261030.css','utf8'),execFileSync('git',['show','e49fa01ce7eb51babba0b405c518f1d01d729657:preview/transfer-phalanx-reference-20261030.css'],{encoding:'utf8'}));
});
test('all script DOM IDs resolve, no duplicate IDs, fictional runtime and authored German copy removed',()=>{
 const d=new JSDOM(html).window.document,ids=[...d.querySelectorAll('[id]')].map(x=>x.id);
 assert.equal(ids.length,new Set(ids).size);
 for(const [,id] of original.matchAll(/\$\('([^']+)'\)/g))assert.ok(d.getElementById(id),id);
 assert.doesNotMatch(original,/fictional|Astra Vale|demoDossier|Governor-ID|Gouverneur-ID|[ÄÖÜäöüß]/);
 assert.doesNotMatch(d.body.textContent,/fictional|Astra Vale|Governor-ID|Gouverneur-ID|[ÄÖÜäöüß]/i);
});
test('three task views, candidate comparison, six dossier tabs and back navigation work without demo dependencies',async()=>{
 const x=await setup(),{$,w}=x;assert.equal($('private').hidden,false);assert.equal($('rows').children.length,2);
 for(const id of ['phxIdPanel','workspace-tools','scoutingBoard']){w.document.querySelector(`.workspace-nav [data-view="${id}"]`).dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert.equal($(id).hidden,false,id+' / '+x.run('workspaceView'));}
 for(const box of $('rows').querySelectorAll('input'))box.click();await tick();assert.equal($('compare').disabled,false);$('compare').click();assert.match($('comparison').textContent,/Synthetic Sentinel/);assert.match($('comparison').textContent,/Synthetic Vanguard/);
 $('rows').querySelector('button').click();assert.equal($('candidateDossier').hidden,false);
 for(const tab of w.document.querySelectorAll('[data-dossier-tab]')){tab.click();assert.ok($('dossierContent').textContent.trim());}
 $('backToBoard').click();assert.equal($('scoutingBoard').hidden,false);assert.equal($('candidateDossier').hidden,true);assert.equal(x.writes(),0);
 x.dom.window.close();
});
test('empty board follows ID -> review -> explicit save -> reload; lookup alone never writes; duplicates retained',async()=>{
 const x=await setup({empty:true}),{$}=x;assert.equal($('candidate-empty').hidden,false);$('addFirstCandidate').click();assert.equal($('phxIdPanel').hidden,false);$('phxGovernorId').value='123456';await x.submit();
 assert.equal(x.writes(),0);assert.equal($('phxReview').hidden,false);assert.match($('phxIdResult').textContent,/Kingshot Player ID123456/);assert.match($('phxIdResult').textContent,/4 stars/);assert.match($('phxIdResult').textContent,/232,228,946/);assert.match($('phxIdResult').textContent,/Data source/);
 await $('phxAdoptCandidate').onclick();assert.equal(x.writes(),1);assert.equal($('scoutingBoard').hidden,false);assert.equal(x.records().length,1);await x.run('load()');assert.equal($('total').textContent,'1');
 x.run("showWorkspace('phxIdPanel')");await x.submit();await $('phxAdoptCandidate').onclick();assert.equal(x.writes(),1);assert.match($('phxAdoptStatus').textContent,/already a candidate/);x.dom.window.close();
});
test('member can read and compare but cannot add; logged-out/inactive/expired users remain gated',async()=>{
 const x=await setup({role:'member'});assert.equal(x.$('private').hidden,false);assert.equal(x.$('newCandidate').hidden,true);x.$('phxGovernorId').value='123456';await x.submit();assert.equal(x.$('phxAdoptCandidate').hidden,true);await x.$('phxAdoptCandidate').onclick();assert.equal(x.writes(),0);x.dom.window.close();
 for(const options of [{loggedOut:true},{active:false},{expired:true},{role:'kingdom'}]){const y=await setup(options);assert.equal(y.$('private').hidden,true);assert.equal(y.reads(),0);y.dom.window.close();}
});
test('existing candidate editing preserves external lookup metadata, notes and identity',async()=>{
 const x=await setup();x.run('openEditor(players[0])');const form=x.$('candidateForm');form.elements.namedItem('notes').value='Updated synthetic note';await form.onsubmit({preventDefault(){},currentTarget:form});assert.equal(x.writes(),1);const saved=x.records()[0];assert.equal(saved.metadata.governor_id,'101');assert.equal(saved.metadata.external_lookup.source_cached_at,'1793392324.689');assert.equal(saved.metadata.role,'Fighter');assert.equal(saved.notes,'Updated synthetic note');x.dom.window.close();
});
test('CSV uses native Blob and exports filtered records with escaped quotes and exact data',async()=>{
 const x=await setup();x.records()[0].notes='Quoted "evidence", retained';x.$('search').value='Sentinel';x.$('csv').click();assert.equal(x.download(),true);const csv=await x.blob().text();assert.match(csv,/Synthetic Sentinel/);assert.doesNotMatch(csv,/Synthetic Vanguard/);assert.match(csv,/Quoted ""evidence"", retained/);assert.match(csv,/candidate_id,player_name/);assert.equal(x.writes(),0);x.dom.window.close();
});
test('real candidate internal comparison still loads recorded intelligence after demo removal',async()=>{
 const x=await setup();await x.$('loadInternal').onclick();assert.match(x.$('externalIntelResult').textContent,/Synthetic Sentinel.*Synthetic Internal/);assert.match(x.$('externalIntelResult').textContent,/1\/5/);assert.match(x.$('externalIntelResult').textContent,/123M/);assert.equal(x.writes(),0);x.dom.window.close();
});
test('changed ID during lookup cannot display or adopt stale identity',async()=>{
 const x=await setup({fetchHook:async $=>{$('phxGovernorId').value='999';}});x.$('phxGovernorId').value='123456';await x.submit();assert.equal(x.$('phxReview').hidden,true);assert.equal(x.$('phxIdResult').children.length,0);assert.equal(x.$('phxAdoptCandidate').hidden,true);assert.match(x.$('phxIdStatus').textContent,/changed/);assert.equal(x.writes(),0);x.dom.window.close();
});
