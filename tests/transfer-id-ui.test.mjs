import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError,playerRankingRows,rankingLabels,canonicalRankingName,playerRankingMap,rankingSourceText,playerSummaryMetrics,formatCastle,compactPower} from '../preview/transfer-id-display-20261030.js';
const source=readFileSync('preview/transfer-scouting-id-stage-20261030.js','utf8').split('/* PHX ID STAGE:')[1].split('// Native section links;')[0];
function setup(options={}){
 const nodes=new Map();
 const element=()=>({hidden:false,value:'',textContent:'',children:[],dataset:{},classList:{add(){}},disabled:false,append(...items){this.children.push(...items)},replaceChildren(){this.children=[]},querySelector(){return this.button??=element()},addEventListener(type,handler){this.handler=handler}});
 const $=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
 $('phxGovernorId').value=options.id??'290591005';$('private').hidden=options.loggedOut??false;
 let calls=0;const session=options.noSession?null:{access_token:'synthetic-test-jwt'};
 const payload=options.payload??{ok:true,governorId:'290591005',player:{name:'Synthetic <img onerror=test>',kingdom:1885,alliance:'NXS',power:232228946},source:{cachedAt:1793392324.689},checkedAtUtc:'2026-10-30T20:32:05Z',arenaSquad:{status:'available',heroes:[{name:'Synthetic hero',level:80,star:4}]},ranks:{status:'available',values:{power_rank:9,kills_rank:6,migrant_rank:6,mystic_trial:1561}}};
 vm.runInNewContext('/* PHX ID STAGE:'+source,{clearLookupCandidate(){},offerLookupCandidate(){},$,document:{createElement:element},SUPABASE_URL:'https://test.invalid',KEY:'public-test-key',db:{auth:{getSession:async()=>({data:{session},error:null})}},URL,AbortController,setTimeout,clearTimeout,Error,TypeError,formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError,playerRankingRows,rankingLabels,canonicalRankingName,playerRankingMap,rankingSourceText,playerSummaryMetrics,formatCastle,compactPower,fetch:async(url,opts)=>{calls++;assert.equal(url.searchParams.get('governorId'),'290591005');assert.equal(opts.headers.Authorization,'Bearer synthetic-test-jwt');return Response.json(payload,{status:options.status??200})}});
 return {$,calls:()=>calls,submit:()=>$('phxIdForm').handler({preventDefault(){}}),values:()=>$('phxIdResult').children.map(function text(cell){return cell.textContent+' '+cell.children.map(text).join(': ')}).join('\n')};
}
test('ID UI reads authenticated response, formats captured values, keeps ID exact and text safe',async()=>{const x=setup();await x.submit();assert.equal(x.calls(),1);const out=x.values();assert.match(out,/Kingshot Player ID\s*:\s*290591005/);assert.match(out,/232,228,946/);assert.match(out,/2026-10-30 · 20:32:04 UTC/);assert.match(out,/Available/);assert.match(out,/4 stars/);assert.match(out,/1,561/);assert.match(out,/Synthetic <img onerror=test>/);assert.equal(x.$('phxIdForm').querySelector().disabled,false);assert.match(x.$('phxIdStatus').textContent,/loaded/);});
test('logged-out, invalid ID and missing session never call bridge',async()=>{for(const options of [{loggedOut:true},{id:'01'},{noSession:true}]){const x=setup(options);await x.submit();assert.equal(x.calls(),0);assert.equal(x.$('phxIdResult').children.length,0);}});
test('HTTP failure messages are readable and button is re-enabled',async()=>{for(const status of [401,403,404,429,502,503,504]){const x=setup({status});await x.submit();assert.equal(x.$('phxIdStatus').textContent,playerLookupError(status));assert.equal(x.$('phxIdResult').children.length,0);assert.equal(x.$('phxIdForm').querySelector().disabled,false);}});
test('identity mismatch displays no player result',async()=>{const x=setup({payload:{ok:true,governorId:'999'}});await x.submit();assert.equal(x.$('phxIdResult').children.length,0);assert.match(x.$('phxIdStatus').textContent,/could not be confirmed/);});
