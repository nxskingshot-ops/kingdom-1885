'use strict';
const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const target='http://127.0.0.1:8765';
const accountName='Fixture Étoile';
const longName='Aurelia Nachtwache';
const key='phx-war-room-session-yuyvmbdybwpwpqsipfjt-v1';
(async()=>{
  const outpostCapture=process.env.PHX_TEST_OUTPOST_CAPTURE;
  const outpostData=outpostCapture && await fs.readFile(outpostCapture,'utf8');
  const executablePath=process.env.PHX_CHROMIUM_EXECUTABLE;
  const browser=await chromium.launch(executablePath ? {executablePath} : {});
  try {
    for(const width of [320,393,430]) {
      const page=await browser.newPage({viewport:{width,height:852},isMobile:true,hasTouch:true});
      let logins=0,renewals=0,profiles=0;
      let player={name:accountName,kingdom:1901,alliance:'ALT',power:'12345678'};
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      const account=page.getByRole('region',{name:'Live profile',exact:true});
      await page.route('https://yuyvmbdybwpwpqsipfjt.supabase.co/**',route=>{
        const path=new URL(route.request().url());
        if(path.pathname==='/auth/v1/token') {
          if(path.searchParams.get('grant_type')==='refresh_token') renewals++;else logins++;
          if(route.request().postDataJSON().password==='fixture-wrong') return route.fulfill({status:400,json:{error:'invalid_grant'}});
          return route.fulfill({json:{access_token:'fixture-access',refresh_token:'fixture-refresh-'+renewals,expires_at:Date.now()/1000+3600}});
        }
        if(path.pathname==='/functions/v1/phx-war-room-own-profile') {
          profiles++;
          assert.equal(route.request().headers().authorization,'Bearer fixture-access');
          return route.fulfill({json:{playerId:'123456789',freshness:'fresh',capturedAt:new Date().toISOString(),checkedAt:new Date().toISOString(),player}});
        }
        if(path.pathname==='/auth/v1/logout') return route.fulfill({status:204});
        return route.fulfill({status:404});
      });
      if (outpostData) {
        await page.route('**/rest/v1/public_outposts_verified_20261002?*',route=>
          route.fulfill({contentType:'application/json',body:outpostData}));
      }
      await page.goto(target);
      const scene=page.locator('.phx-queen-experimental');
      const name=scene.locator('#phx-r10-name');
      const kingdom=scene.locator('#phx-r11-kingdom');
      const alliance=scene.locator('#phx-r11-alliance');
      const divider=scene.locator('#phx-r11-sep');
      await expect(scene.locator('.phx-queen-scene')).toHaveAttribute('src','PHX_HOME_QUEEN_AN_APPROVED.png');
      await expect(scene.locator('.phx-home-plaque-texture')).toBeVisible();
      await expect(page.locator('.phx-home-unified-plaque')).toHaveCount(0);
      await expect(name).toHaveText('');
      await expect(kingdom).toBeHidden();
      await expect(alliance).toBeHidden();
      await expect(divider).toBeHidden();
      await expect(scene.locator('#phx-r10-sub')).toBeHidden();
      const fitsFrame=async (frameSelector,textSelector)=>page.evaluate(([frameSelector,textSelector])=>{
        const box=document.querySelector(frameSelector).getBoundingClientRect();
        const text=document.querySelector(textSelector);
        const range=document.createRange();
        range.selectNodeContents(text);
        const rects=Array.from(range.getClientRects()).filter(rect=>rect.width>0);
        return rects.length>0 && rects.every(rect=>
          rect.left>=box.left-0.5 && rect.right<=box.right+0.5 &&
          rect.top>=box.top-0.5 && rect.bottom<=box.bottom+0.5
        );
      },[frameSelector,textSelector]);
      const nav=page.getByRole('navigation',{name:'HOME-Navigation'});
      const navBox=await nav.boundingBox();
      assert.ok(navBox.height<=100, 'Compact navigation exceeds two 44px rows');
      assert.equal(await nav.getByRole('button').count(),6);
      assert.equal(await page.locator('#phx-r6-home .phx-live-account').count(),0);
      assert.equal(await page.locator('.phx-home-card').count(),4);
      const emblem=await page.locator('.phx-home-pylon-icon image').getAttribute('href');
      assert.equal(emblem,await page.locator('#phx-pylon-modal img').getAttribute('src'));
      await expect(page.locator('.phx-home-accountbar #phx-r11-language-select')).toBeVisible();
      await page.locator('.phx-home-live-login').click();
      await expect(page).toHaveURL(target+'/#war-room');
      await account.getByLabel('Test account email').fill('fixture@example.invalid');
      await account.getByLabel('Password',{exact:true}).fill('fixture-password-not-saved');
      await account.getByRole('button',{name:'Sign in',exact:true}).click();
      await expect(page.locator('#phx-r10-name')).toHaveText('Fixture Étoile');
      assert.equal(logins,1);
      assert.equal(await account.getByLabel('Password',{exact:true}).inputValue(),'');
      const saved=await page.evaluate(k=>sessionStorage.getItem(k),key);
      assert.ok(saved && !saved.includes('fixture-password') && !saved.includes('Étoile') && !saved.includes('fixture@example'));
      const geometry=await account.evaluate(el=>({x:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,width:innerWidth,font:getComputedStyle(el.querySelector('h2')).fontSize,grid:getComputedStyle(el.querySelector('dl div')).display,overflow:[...el.querySelectorAll('input,dd,time')].some(e=>e.getBoundingClientRect().right>el.getBoundingClientRect().right)}));
      assert.ok(geometry.x>=0 && geometry.right<=width && !geometry.overflow,JSON.stringify(geometry));
      assert.equal(geometry.grid,'grid');
      await page.reload();
      await expect(page.locator('#phx-r10-name')).toHaveText('Fixture Étoile');
      assert.equal(logins,1);assert.equal(renewals,0);assert.equal(profiles,2);
      await expect(page.locator('[data-w2-name]')).toHaveText('Fixture Étoile');
      await page.locator('#phx-r8-war-back').click();
      await expect(page).toHaveURL(target+'/#phalanx-home');
      await expect(page.locator('#phx-r6-home .phx-live-account')).toHaveCount(0);
      await expect(kingdom).toHaveText('#1901');
      await expect(alliance).toHaveText('ALT');
      await expect(divider).toBeVisible();
      await expect.poll(()=>fitsFrame('#phx-r10-identity','#phx-r10-name')).toBe(true);
      await expect.poll(()=>fitsFrame('#phx-r11-affiliation','#phx-r11-affiliation')).toBe(true);
      await fs.mkdir('/tmp/phx-home-session-evidence',{recursive:true});
      await page.screenshot({path:'/tmp/phx-home-session-evidence/home-original-'+width+'.png',fullPage:false});
      await scene.locator('#phx-r8-war-entry').click();
      await expect(page).toHaveURL(target+'/#war-room');
      await page.locator('#phx-r8-war-back').click();
      await scene.locator('.phx-home-war-tab').click();
      await expect(page).toHaveURL(target+'/#war-room');
      await page.locator('#phx-r8-war-back').click();
      // Preserve every existing route while changing only HOME controls.
      await nav.getByRole('button',{name:'War Room',exact:true}).click();
      await expect(page).toHaveURL(target+'/#war-room');
      await page.locator('#phx-r8-war-back').click();
      await nav.getByRole('button',{name:'Territory Control',exact:true}).click();
      await expect(page).toHaveURL(target+'/#home');
      await page.getByRole('button',{name:'Outpost Map 2.0 öffnen',exact:true}).click();
      await expect(page).toHaveURL(target+'/#map');
      const map=page.frameLocator('#map-frame');
      await expect(map.locator('#rows > *')).toHaveCount(74,{timeout:15000});
      for (const format of ['json','csv']) {
        const [download]=await Promise.all([
          page.waitForEvent('download'),
          map.locator('#export-'+format).click()
        ]);
        const data=await fs.readFile(await download.path(),'utf8');
        assert.equal(format==='json' ? JSON.parse(data).length : data.trimEnd().split('\n').length-1,74);
      }
      await page.getByRole('button',{name:'← Outposts & Reports',exact:true}).click();
      await page.getByRole('button',{name:'Outpost Reports öffnen',exact:true}).click();
      await expect(page).toHaveURL(target+'/#report');
      await page.locator('#report-back').click();
      await expect(page).toHaveURL(target+'/#home');
      await page.getByRole('link',{name:'Zurück zu HOME',exact:true}).click();
      await nav.getByRole('button',{name:'Reports',exact:true}).click();
      await page.locator('#report-back').click();
      await expect(page).toHaveURL(target+'/#phalanx-home');
      await nav.getByRole('button',{name:'PYLON IX',exact:true}).click();
      await expect(page).toHaveURL(target+'/#pylon');
      await page.locator('#phx-pylon-close').click();
      await expect(page).toHaveURL(target+'/#phalanx-home');
      await nav.getByRole('button',{name:'Home',exact:true}).click();
      await nav.getByRole('button',{name:'Command Center',exact:true}).click();
      await expect(page.locator('#phx-home-command-heading')).toBeVisible();
      await page.evaluate(k=>{const s=JSON.parse(sessionStorage.getItem(k));s.expires_at=1;sessionStorage.setItem(k,JSON.stringify(s));},key);
      await page.reload();await expect(page.locator('#phx-r10-name')).toHaveText('Fixture Étoile');
      assert.equal(renewals,1);assert.equal(logins,1);
      await page.locator('.phx-home-live-login').click();
      player={...player,name:longName,kingdom:2468,alliance:'LONG-TAG'};
      await account.getByRole('button',{name:'Refresh profile',exact:true}).click();
      await expect(account.getByRole('status')).toHaveText('Verified profile · MightPulse');
      await page.locator('#phx-r8-war-back').click();
      await expect(name).toHaveText(longName);
      await expect(kingdom).toHaveText('#2468');
      await expect(alliance).toHaveText('LONG-TAG');
      await expect.poll(()=>fitsFrame('#phx-r10-identity','#phx-r10-name')).toBe(true);
      await expect.poll(()=>fitsFrame('#phx-r11-affiliation','#phx-r11-affiliation')).toBe(true);
      await page.screenshot({path:'/tmp/phx-home-session-evidence/home-long-'+width+'.png'});
      await page.locator('.phx-home-live-login').click();
      player={...player,alliance:null};
      await account.getByRole('button',{name:'Refresh profile',exact:true}).click();
      await expect(account.getByRole('status')).toHaveText('Verified profile · MightPulse');
      await expect(kingdom).toHaveText('#2468');
      await expect(alliance).toHaveText('');
      await expect(divider).toBeHidden();
      await fs.mkdir('/tmp/phx-home-session-evidence',{recursive:true});
      await page.screenshot({path:'/tmp/phx-home-session-evidence/home-profile-'+width+'.png',fullPage:false});
      await account.getByRole('button',{name:'Sign out',exact:true}).click();
      await expect(page.locator('#phx-r10-name')).toHaveText('');
      assert.equal(await page.evaluate(k=>sessionStorage.getItem(k),key),null);
      await page.reload();await expect(page.locator('#phx-r10-name')).toHaveText('');
      await page.locator('#phx-r8-war-back').click();
      await page.locator('.phx-home-live-login').click();
      await account.getByLabel('Test account email').fill('fixture@example.invalid');
      await account.getByLabel('Password',{exact:true}).fill('fixture-wrong');
      await account.getByRole('button',{name:'Sign in',exact:true}).click();
      await expect(account.getByRole('status')).toHaveText('Could not sign in with that test account.');
      assert.equal(await page.evaluate(k=>sessionStorage.getItem(k),key),null);
      assert.deepEqual(errors,[]);
      console.log('BESTANDEN: '+width+'px · original plaques, long profile and missing alliance, all six routes/back, 74 Outposts and JSON/CSV, session lifecycle (simulated HTTP)');
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
