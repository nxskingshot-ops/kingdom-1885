#!/usr/bin/env node
// Real Chromium smoke test for the isolated, JavaScript-free direct navigation.
// This intentionally does not assert the legacy iframe router is functional.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const server=spawn('python3',['-m','http.server','8765','--directory','dist/reports-out024'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  let browser;
  try{
    await sleep(800);
    browser=await chromium.launch({headless:true,args:['--no-sandbox']});
    const page=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const expectedFiles=new Set([
      'PHALANX_RC5_ALPHA_DERIVED_20261017.html',
      'phalanx-reports-out024-local-adapter-20261019.html',
      'PHX-OUT-024-MAP2-FROZEN-20261018.html'
    ]);
    const served=new Map();
    page.on('response',response=>{
      const name=new URL(response.url()).pathname.split('/').pop();
      if(expectedFiles.has(name)) served.set(name,response.status());
    });
    await page.goto('http://127.0.0.1:8765/direct.html',{waitUntil:'load'});
    const frame=page.frameLocator('iframe[name="phxcontent"]');
    const inner=page.frame({name:'phxcontent'});
    assert.ok(inner,'Direct-navigation iframe missing');
    await frame.locator('body').waitFor();
    assert.equal(await page.locator('header a[target="phxcontent"]').count(),3,'Exactly three isolated navigation targets expected');
    assert.equal(await page.locator('iframe[name="phxcontent"]').count(),1,'Single content frame expected');
    assert.match(inner.url(),/PHALANX_RC5_ALPHA_DERIVED_20261017\.html$/);
    await page.getByRole('link',{name:'Report Center',exact:true}).click();
    await page.waitForFunction(()=>window.frames.phxcontent.location.pathname.endsWith('phalanx-reports-out024-local-adapter-20261019.html'));
    assert.match(inner.url(),/phalanx-reports-out024-local-adapter-20261019\.html$/);
    await page.getByRole('link',{name:'RC5 Menü',exact:true}).click();
    await page.waitForFunction(()=>window.frames.phxcontent.location.pathname.endsWith('PHALANX_RC5_ALPHA_DERIVED_20261017.html'));
    await page.getByRole('link',{name:'OUT-024 Karte',exact:true}).click();
    await page.waitForFunction(()=>window.frames.phxcontent.location.pathname.endsWith('PHX-OUT-024-MAP2-FROZEN-20261018.html'));
    assert.match(inner.url(),/PHX-OUT-024-MAP2-FROZEN-20261018\.html$/);
    assert.deepEqual([...served.keys()].sort(),[...expectedFiles].sort(),'All three module responses must be observed');
    for(const [name,status] of served) assert.equal(status,200,'Module must return HTTP 200: '+name);
    assert.deepEqual(errors,[],'Browser JavaScript errors');
    assert.equal(await page.locator('header a[target="phxcontent"]').count(),3,'Direct navigation must persist after module switches');
    // The separate RC5 derivative has native links; frozen source is never modified.
    await page.goto('http://127.0.0.1:8765/rc5-integrated.html',{waitUntil:'load'});
    const reportLink=page.locator('a[href="./phalanx-reports-out024-local-adapter-20261019.html"]');
    const outpostLink=page.locator('a[href="./PHX-OUT-024-MAP2-FROZEN-20261018.html"]');
    assert.equal(await reportLink.getAttribute('href'),'./phalanx-reports-out024-local-adapter-20261019.html');
    assert.equal(await outpostLink.getAttribute('href'),'./PHX-OUT-024-MAP2-FROZEN-20261018.html');
    await reportLink.evaluate(el=>el.closest('details').open=true);
    await reportLink.click();
    await page.waitForURL(/phalanx-reports-out024-local-adapter-20261019\.html$/);
    await page.goBack({waitUntil:'load'});
    const mapLink=page.locator('a[href="./PHX-OUT-024-MAP2-FROZEN-20261018.html"]');
    await mapLink.evaluate(el=>el.closest('details').open=true);
    await mapLink.click();
    await page.waitForURL(/PHX-OUT-024-MAP2-FROZEN-20261018\.html$/);
    // Browser gate: explicit offline import checker -> clipboard -> Report Center.
    await page.goto('http://127.0.0.1:8765/phalanx-out024-public-json-bridge-20261019.html',{waitUntil:'load'});
    const bridgeSource=page.locator('#source'),bridgeCopy=page.locator('#copy');
    assert.equal(await bridgeCopy.isDisabled(),true,'Unchecked OUT-024 data must not be copied');
    await bridgeSource.fill(JSON.stringify([{source_key:'OP1',alliance:'NXS',coord_x:120,coord_y:140}]));
    await page.locator('#check').click();
    assert.equal(await bridgeCopy.isEnabled(),true,'Valid OUT-024 data can be copied');
    await page.context().grantPermissions(['clipboard-read','clipboard-write'],{origin:'http://127.0.0.1:8765'});
    await bridgeCopy.click();
    await page.locator('#status').getByText(/kopiert/).waitFor({timeout:5000});
    await page.getByRole('link',{name:'Report Center öffnen'}).click();
    await page.waitForURL(/phalanx-reports-out024-local-adapter-20261019\.html$/);
    await page.locator('#paste-json').click();
    assert.match(await page.locator('#source').inputValue(),/OP1/,'Report Center must receive clipboard JSON');
    await page.locator('#generate').click();
    assert.match(await page.locator('#result').innerText(),/Einträge: 1/,'Imported OUT-024 data must generate a report');
    assert.match(await page.locator('#result').innerText(),/NXS · N: 1/);
    await page.locator('#source').fill('[]');
    assert.equal(await page.locator('#copy').isDisabled(),true,'Edited import must invalidate previous report');
    console.log('PASS: offline OUT-024 JSON validation and explicit clipboard handoff');
    // Same-origin direct handoff: browser popup, schema validation and acknowledgement.
    await page.goto('http://127.0.0.1:8765/phalanx-out024-public-json-bridge-20261019.html',{waitUntil:'load'});
    await page.locator('#source').fill(JSON.stringify([{source_key:'DIRECT1',alliance:'MYM',coord_x:700,coord_y:700}]));
    await page.locator('#check').click();
    assert.equal(await page.locator('#direct').isEnabled(),true,'Valid rows enable direct transfer');
    const popupPromise=page.waitForEvent('popup');
    await page.locator('#direct').click();
    const directPage=await popupPromise;
    await directPage.waitForLoadState('load');
    await directPage.waitForFunction(()=>document.querySelector('#source').value.includes('DIRECT1'));
    assert.match(await directPage.locator('#status').innerText(),/direkt übernommen/);
    await directPage.locator('#generate').click();
    assert.match(await directPage.locator('#result').innerText(),/MYM · S: 1/);
    await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('bestätigt'));
    await directPage.close();
    console.log('PASS: same-origin direct OUT-024 handoff and report generation');
    // Functional report gate: valid manual data produces a deterministic local summary.
    await page.goto('http://127.0.0.1:8765/phalanx-reports-out024-local-adapter-20261019.html',{waitUntil:'load'});
    const source=page.locator('#source'),generate=page.locator('#generate'),copy=page.locator('#copy');
    assert.equal(await copy.isDisabled(),true,'Copy must start disabled');
    await source.fill(JSON.stringify([
      {id:'A1',alliance:'NXS',quadrant:'N'},
      {id:'A2',alliance:'NXS',quadrant:'N'},
      {id:'B1',alliance:'FRA',quadrant:'S'}
    ]));
    await generate.click();
    const summary=await page.locator('#result').innerText();
    assert.match(summary,/Einträge: 3/);
    assert.match(summary,/NXS · N: 2/);
    assert.match(summary,/FRA · S: 1/);
    assert.equal(await copy.isEnabled(),true,'Copy must activate for valid report');
    await page.locator('#channel').selectOption('512');
    assert.match(await page.locator('#parts').innerText(),/Teil 1 von 1/);
    assert.equal(await page.locator('#copy-part').isEnabled(),true,'Manual chunk copy available');
    assert.equal(await page.locator('#next-part').isDisabled(),true,'No second chunk for short report');
    await source.fill(JSON.stringify([{id:'EDIT',alliance:'NXS',quadrant:'O'}]));
    assert.equal(await page.locator('#result').innerText(),'','Editing input must clear report');
    assert.equal(await copy.isDisabled(),true,'Editing input must disable full report copy');
    assert.equal(await page.locator('#copy-part').isDisabled(),true,'Editing input must disable chunk copy');
    assert.equal(await page.locator('#next-part').isDisabled(),true,'Editing input must disable navigation');
    assert.equal(await page.locator('#part-preview').innerText(),'','Editing source must erase stale chunk preview');
    // Verify a long but valid report is split into copy-safe chunks.
    await source.fill(JSON.stringify(Array.from({length:80},(_,i)=>({
      id:'T'+i,alliance:'ALLIANCE_'+String(i).padStart(3,'0'),quadrant:'N'
    }))));
    await generate.click();
    assert.match(await page.locator('#parts').innerText(),/Teil 1 von [2-9]/,'Long alliance report must split');
    assert.equal(await page.locator('#next-part').isEnabled(),true,'Next part available');
    const firstPart=await page.locator('#parts').innerText();
    const firstPreview=await page.locator('#part-preview').innerText();
    assert.ok(firstPreview.length>0&&firstPreview.length<=512,'Preview must show bounded chat text');
    assert.ok(firstPreview.includes(String.fromCharCode(10)),'Preview must preserve actual line breaks');
    await page.locator('#next-part').click();
    assert.notEqual(await page.locator('#parts').innerText(),firstPart,'Next part must advance');
    assert.equal(await page.locator('#copy-part').innerText(),'Teil 2 kopieren','Copy label must follow selected chunk');
    const secondPreview=await page.locator('#part-preview').innerText();
    assert.ok(secondPreview.length>0&&secondPreview.length<=512,'Second preview must fit chat limit');
    assert.notEqual(secondPreview,firstPreview,'Preview must follow selected chunk');
    const totalParts=Number((await page.locator('#parts').innerText()).match(/von (\d+)/)?.[1]);
    assert.ok(totalParts>1,'Multi-part report must have more than one chunk');
    const previews=[firstPreview,secondPreview];
    for(let i=2;i<totalParts;i++){
      await page.locator('#next-part').click();
      previews.push(await page.locator('#part-preview').innerText());
    }
    assert.ok(previews.every(p=>p.length>0&&p.length<=512),'Every chunk must fit alliance chat');
    assert.equal(previews.join(String.fromCharCode(10)),await page.locator('#result').innerText(),'Chunks must reconstruct the full report without lost lines');
    await page.locator('#channel').selectOption('2000');
    assert.match(await page.locator('#parts').innerText(),/Teil 1 von/,'Switching channel recalculates chunks');
    await source.fill('[{"id":"X","alliance":"NXS","quadrant":"N"},{"id":"X","alliance":"FRA","quadrant":"S"}]');
    await generate.click();
    assert.match(await page.locator('#status').innerText(),/Import abgelehnt/);
    assert.equal(await page.locator('#result').innerText(),'','Rejected import must clear stale report');
    assert.equal(await copy.isDisabled(),true,'Rejected import must disable copy');
    assert.equal(await page.locator('#part-preview').innerText(),'','Rejected import must clear chunk preview');
    assert.equal(await page.locator('#copy-part').isDisabled(),true,'Rejected import must disable chunk copying');
    // The documented maximum itself must remain accepted.
    await source.fill(JSON.stringify(Array.from({length:1000},(_,i)=>({
      id:'MAX'+i,alliance:'NXS',quadrant:'N'
    }))));
    await generate.click();
    assert.match(await page.locator('#result').innerText(),/Einträge: 1000/,'Exactly 1000 rows must be accepted');
    assert.equal(await copy.isEnabled(),true,'Valid maximum-size import must enable copying');
    // Boundary gate: reject oversized imports and never retain the previous output.
    await source.fill(JSON.stringify(Array.from({length:1001},(_,i)=>({
      id:'OVER'+i,alliance:'NXS',quadrant:'N'
    }))));
    await generate.click();
    assert.match(await page.locator('#status').innerText(),/Import abgelehnt/);
    assert.equal(await page.locator('#result').innerText(),'','Oversized import must not produce a report');
    assert.equal(await page.locator('#part-preview').innerText(),'','Oversized import must not retain a chunk preview');
    assert.equal(await copy.isDisabled(),true,'Oversized import must disable full copy');
    assert.equal(await page.locator('#copy-part').isDisabled(),true,'Oversized import must disable chunk copy');
    console.log('PASS: manual report aggregation and fail-closed invalid import');
    console.log('PASS: native RC5 derivative routes Reports and OUT-024 without an external test bar');
    console.log('PASS: Chromium direct navigation RC5 → Reports → RC5 → OUT-024');
  } finally {if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
