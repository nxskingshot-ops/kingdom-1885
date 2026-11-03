import test from 'node:test';
import assert from 'node:assert/strict';
import { BOARDS } from './phx-ranking-ingestion-core-stage-20261103.mjs';
import { auditCoverage, summarizeCoverage } from './phx-ranking-coverage-audit-stage-20261103.mjs';
const payload = (board) => ({ key: board, captured_at: 1793682000, rows: Array.from({length:100},(_,i)=>({kid:1885,rank:i+1,uid:i+1,aid:i+1,governor_id:i+1,score:100-i})) });
test('26 valid boards are all verified without persistence', async()=>{
 let calls=0;
 const report=await auditCoverage({apiKey:'fixture-only',fetchImpl:async(url)=>{calls++;const board=new URL(url).searchParams.get('board');return {ok:true,json:async()=>({boards:[payload(board)]})}}});
 assert.equal(calls,26);assert.equal(report.total,26);assert.equal(report.verified,26);assert.equal(report.complete,true);assert.equal(report.writesPerformed,false);
});
test('unsupported and invalid boards remain unverified',async()=>{
 const report=await auditCoverage({apiKey:'fixture-only',boards:['kills','pet_power'],fetchImpl:async(url)=>{const board=new URL(url).searchParams.get('board');return {ok:true,json:async()=>({boards:board==='kills'?[]:[{...payload(board),rows:[]}]})}}});
 assert.equal(report.verified,0);assert.equal(report.details[0].status,'UNSUPPORTED');assert.equal(report.details[1].status,'INCOMPLETE');
});
test('missing result is reported not checked',()=>{
 const report=summarizeCoverage({kingdom:1885,checkedAtUtc:'2026-11-03T00:00:00Z',boards:{}},['kills']);
 assert.equal(report.details[0].reason,'not_checked');assert.equal(report.complete,false);
});
