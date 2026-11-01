import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('preview/transfer-scouting-live-v8-diagnostics-stage.js','utf8');
const start=source.indexOf('button.onclick=async()=>{',source.indexOf('const selected=p.candidate_id;'));
const end=source.indexOf('\n  root.append(panel);',start);
async function run(status,error){
 let request;const result={},button={},context={result,button,idField:{value:'227802999'},selected:'one',active:'one',dossierOpen:true,dossierTab:'intelligence',URL:'https://test.invalid',KEY:'public',AbortSignal,db:{auth:{getSession:async()=>({data:{session:{access_token:'synthetic'}}})}},fetch:async(url,options)=>{request={url,options};return Response.json({ok:false,error},{status})}};
 vm.runInNewContext(source.slice(start,end),context);await button.onclick();return {result,button,request};
}
test('V8 lookup sends only headers permitted by the live bridge, not SDK telemetry',async()=>{
 const x=await run(429,'rate_limit_exceeded');
 assert.deepEqual(Object.keys(x.request.options.headers).sort(),['Authorization','apikey']);
 assert.match(x.request.url,/governorId=227802999$/);
 assert.match(x.result.textContent,/HTTP 429.*rate_limit_exceeded/);
 assert.equal(x.button.disabled,false);
});
test('V8 exposes allowlisted categories and status without arbitrary response text',async()=>{
 const x=await run(502,'PRIVATE UPSTREAM DETAILS');
 assert.match(x.result.textContent,/HTTP 502.*unavailable/);assert.doesNotMatch(x.result.textContent,/PRIVATE/);
 assert.equal(x.button.disabled,false);
});
test('staging backend change preserves live v5 security contract and only increases refresh margin',()=>{
 const before=readFileSync('backups/transfer-id-fallback-v5-before-final-20261101.ts','utf8');
 const after=readFileSync('preview/transfer-id-snapshot-fallback-stage-20261031.ts','utf8');
 assert.equal(after,before.replace('AbortSignal.timeout(95000)','AbortSignal.timeout(105000)'));
 assert.match(source,/125000/);
});
