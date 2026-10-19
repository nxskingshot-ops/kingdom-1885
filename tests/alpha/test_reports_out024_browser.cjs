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
    const reportLink=page.getByRole('link',{name:/^Report Center/});
    const outpostLink=page.getByRole('link',{name:/^Outpost Map/});
    assert.equal(await reportLink.getAttribute('href'),'./phalanx-reports-out024-local-adapter-20261019.html');
    assert.equal(await outpostLink.getAttribute('href'),'./PHX-OUT-024-MAP2-FROZEN-20261018.html');
    await reportLink.click();
    await page.waitForURL(/phalanx-reports-out024-local-adapter-20261019\.html$/);
    await page.goBack({waitUntil:'load'});
    await page.getByRole('link',{name:/^Outpost Map/}).click();
    await page.waitForURL(/PHX-OUT-024-MAP2-FROZEN-20261018\.html$/);
    console.log('PASS: native RC5 derivative routes Reports and OUT-024 without an external test bar');
    console.log('PASS: Chromium direct navigation RC5 → Reports → RC5 → OUT-024');
  } finally {if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
