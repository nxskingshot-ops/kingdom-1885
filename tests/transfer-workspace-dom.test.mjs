// Full DOM integration with synthetic in-memory data only. No external network or database writes.
// Run with PHX_JSDOM_MODULE pointing to an installed jsdom module (26.1.0 used for this milestone).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {candidateFromLookup,duplicateLookupFilter} from '../preview/transfer-id-candidate-20261030.js';
import {formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError,playerRankingRows,rankingLabels,canonicalRankingName,playerRankingMap,rankingSourceText} from '../preview/transfer-id-display-20261030.js';
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
 const payload=id=>({ok:true,governorId:id,player:{name:'Synthetic Pathfinder',kingdom:options.lookupKingdom||1555,alliance:'QA',power:232228946},source:{cachedAt:1793392324.689},checkedAtUtc:'2026-10-31T12:00:00Z',arenaSquad:{status:'available',heroes:[{name:'Synthetic Hero',level:80,star:4}]},ranks:{status:'available',values:{power_rank:9,kills_rank:6,migrant_rank:6,mystic_trial:1561,leaderboards:[{name:'pet_power',value:12500,kingdom_rank:7}]}}});
 const mockFetch=async input=>{const url=String(input);if(url.includes('phalanx-transfer-intelligence-stage-20261031'))return Response.json({observations:[{uid:'44',player_name:'Synthetic Internal',alliance_tag:'QA',rankings:{pet_power:{value:900,kingdom_rank:2}}}],power_references:[{player_name:'Synthetic Internal',power_m:100}],snapshot_date:'2026-10-31'});if(options.fetchHook)await options.fetchHook($);return Response.json(payload(new URL(url).searchParams.get('governorId')));};
 const NativeURL=URL;class TestURL extends NativeURL{static createObjectURL(value){blob=value;return 'blob:synthetic'}static revokeObjectURL(){}}
 Object.assign(ctx,{candidateFromLookup,duplicateLookupFilter,formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError,playerRankingRows,rankingLabels,canonicalRankingName,playerRankingMap,rankingSourceText,createClient:()=>db,fetch:mockFetch,URL:TestURL,Blob,AbortController,AbortSignal,setTimeout,clearTimeout,setInterval:()=>0});
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
test('three task views, candidate comparison, four smart dossier groups and back navigation work without demo dependencies',async()=>{
 const x=await setup(),{$,w}=x;assert.equal($('private').hidden,false);assert.equal($('rows').children.length,2);
 for(const id of ['phxIdPanel','workspace-tools','scoutingBoard']){w.document.querySelector(`.workspace-nav [data-view="${id}"]`).dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert.equal($(id).hidden,false,id+' / '+x.run('workspaceView'));}
 for(const box of $('rows').querySelectorAll('input'))box.click();await tick();assert.equal($('compare').disabled,false);$('compare').click();assert.match($('comparison').textContent,/Synthetic Sentinel/);assert.match($('comparison').textContent,/Synthetic Vanguard/);
 $('rows').querySelector('button').click();assert.equal($('candidateDossier').hidden,false);
 await tick();await tick();
 const groups={identity:['Identity & Power','NEXUS Intelligence'],development:['Player Rankings','Arena Squad','Recorded Mystic Trial Stages'],recruitment:['Recruitment','Notes'],history:['Development History','Evidence & Sources']};
 for(const [name,headings] of Object.entries(groups)){
  const tab=w.document.querySelector('[data-dossier-tab="'+name+'"]');
  assert.equal(tab.hidden,false,name+' should be visible');tab.click();
  for(const heading of headings)assert.ok($('dossierContent').textContent.includes(heading),name+' missing '+heading);
  assert.equal($('dossierContent').querySelectorAll('button').length,1,name+' refresh control must not repeat');
 }
 for(const name of ['evidence','intelligence'])assert.equal(w.document.querySelector('[data-dossier-tab="'+name+'"]').hidden,true,name+' is grouped, not removed');
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
 const x=await setup();await x.$('loadInternal').onclick();assert.match(x.$('externalIntelResult').textContent,/Synthetic Sentinel.*Synthetic Internal/);assert.match(x.$('externalIntelResult').textContent,/Pet Power/);assert.match(x.$('externalIntelResult').textContent,/900/);await tick();await tick();assert.match(x.$('externalIntelResult').textContent,/123M/);assert.equal(x.writes(),0);x.dom.window.close();
});
test('changed ID during lookup cannot display or adopt stale identity',async()=>{
 const x=await setup({fetchHook:async $=>{$('phxGovernorId').value='999';}});x.$('phxGovernorId').value='123456';await x.submit();assert.equal(x.$('phxReview').hidden,true);assert.equal(x.$('phxIdResult').children.length,0);assert.equal(x.$('phxAdoptCandidate').hidden,true);assert.match(x.$('phxIdStatus').textContent,/changed/);assert.equal(x.writes(),0);x.dom.window.close();
});

test('lookup leaderboards persist through explicit adoption and display in dossier with arena evidence without further writes',async()=>{
 const x=await setup({empty:true}),{$,w}=x;$('phxGovernorId').value='123456';await x.submit();assert.match($('phxIdResult').textContent,/12,500/);assert.match($('phxIdResult').textContent,/Kingdom rank: 7/);await $('phxAdoptCandidate').onclick();
 assert.equal(x.records()[0].metadata.external_lookup.ranks.values.leaderboards[0].value,'12500');
 $('openDossier').click();await tick();await tick();w.document.querySelector('[data-dossier-tab="development"]').click();assert.match($('dossierContent').textContent,/12,500/);assert.match($('dossierContent').textContent,/Synthetic Hero/);assert.equal(x.writes(),1);x.dom.window.close();
});
test('unlisted #1885 ID can be selected for one-to-one rankings comparison; wrong kingdom rejected without writes',async()=>{
 const x=await setup({lookupKingdom:1885}),{$}=x;$('internalPlayerId').value='888';await $('internalIdForm').onsubmit({preventDefault(){}});await tick();await tick();assert.equal($('internalGovernor').disabled,false);assert.match($('externalIntelResult').textContent,/12,500/);assert.match($('externalIntelResult').textContent,/Synthetic Pathfinder/);assert.equal(x.writes(),0);x.dom.window.close();
 const y=await setup();y.$('internalPlayerId').value='888';await y.$('internalIdForm').onsubmit({preventDefault(){}});assert.match(y.$('externalIntelResult').textContent,/not in Kingdom/);assert.equal(y.writes(),0);y.dom.window.close();
});

test('compact rankings keep exact values, both comparison players and closed source details',async()=>{
 const x=await setup();x.$('phxGovernorId').value='123456';await x.submit();
 const card=x.$('phxIdResult').querySelector('.ranking-evidence');assert.ok(card);assert.ok(card.querySelector('.ranking-value'));assert.ok(card.querySelector('details'));assert.equal(card.querySelector('details').open,false);assert.match(card.querySelector('details').textContent,/Source.*Not available/);
 x.run("active='QA-2'");await x.run("loadCandidateEvidence(players[1])");await x.$('loadInternal').onclick();
 const table=x.$('externalIntelResult').querySelector('.ranking-comparison');assert.ok(table);
 const row=[...table.querySelectorAll('tbody tr')].find(r=>r.querySelector('th').textContent==='Pet Power');assert.equal(row.querySelectorAll('td[data-player]').length,2);assert.equal(row.querySelectorAll('.ranking-value').length,2);assert.equal(row.querySelectorAll('details[open]').length,0);assert.match(row.textContent,/12,500/);assert.match(row.textContent,/900/);
 row.querySelector('details').open=true;assert.equal(row.querySelector('details').open,true);assert.equal(x.writes(),0);x.dom.window.close();
});
