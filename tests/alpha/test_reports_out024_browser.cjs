#!/usr/bin/env node
// Real Chromium smoke test against the isolated static preview, never production.
const { chromium } = require('playwright');
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
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
    const status=page.locator('#status');
    await status.waitFor();
    await page.waitForTimeout(1500);
    const current=await status.innerText();
    assert.match(current,/verknüpft/, 'RC5 router failed to initialize: '+current+'; errors='+errors.join('; '));
    const frame=page.frameLocator('#preview');
    await frame.locator('details.group').filter({has:frame.locator('a').getByText('Report Center',{exact:false})}).locator('summary').click();
    const reports=frame.getByText('Report Center',{exact:false});
    await reports.click();
    await page.waitForTimeout(400);
    assert.match(await status.innerText(),/Reports-Adapter geladen|Reports · lokaler Alpha-Adapter/);
    await page.locator('#back').click();
    await page.waitForTimeout(400);
    assert.match(await status.innerText(),/verknüpft/);
    await frame.locator('summary[aria-label^="Territory Control"]').click();
    await frame.getByText('Outpost Map',{exact:false}).first().click();
    await page.waitForTimeout(500);
    assert.match(await status.innerText(),/OUT-024/);
    assert.deepEqual(errors,[],'Browser JavaScript errors');
    console.log('PASS: Chromium RC5 load, Report Center, back, OUT-024');
  } finally {if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
