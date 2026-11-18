'use strict';
const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const target='http://127.0.0.1:8765';
const key='phx-war-room-session-yuyvmbdybwpwpqsipfjt-v1';
(async()=>{
  const browser=await chromium.launch();
  try {
    for(const width of [320,393,430]) {
      const page=await browser.newPage({viewport:{width,height:852},isMobile:true,hasTouch:true});
      let logins=0,renewals=0,profiles=0;
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
          return route.fulfill({json:{playerId:'123456789',freshness:'fresh',capturedAt:new Date().toISOString(),checkedAt:new Date().toISOString(),player:{name:'Fixture Étoile',kingdom:1901,alliance:'ALT',power:'12345678'}}});
        }
        if(path.pathname==='/auth/v1/logout') return route.fulfill({status:204});
        return route.fulfill({status:404});
      });
      await page.goto(target);
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
      await fs.mkdir('/tmp/phx-home-session-evidence',{recursive:true});
      await page.screenshot({path:'/tmp/phx-home-session-evidence/home-compact-'+width+'.png',fullPage:false});
      // Preserve every existing route while changing only HOME controls.
      await nav.getByRole('button',{name:'War Room',exact:true}).click();
      await expect(page).toHaveURL(target+'/#war-room');
      await page.locator('#phx-r8-war-back').click();
      await nav.getByRole('button',{name:'Territory Control',exact:true}).click();
      await expect(page).toHaveURL(target+'/#home');
      await page.getByRole('button',{name:'Outpost Map 2.0 öffnen',exact:true}).click();
      await expect(page).toHaveURL(target+'/#map');
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
      await account.getByRole('button',{name:'Refresh profile',exact:true}).click();
      await expect(account.getByRole('status')).toHaveText('Verified profile · MightPulse');
      await fs.mkdir('/tmp/phx-home-session-evidence',{recursive:true});
      await page.screenshot({path:'/tmp/phx-home-session-evidence/home-profile-'+width+'.png',fullPage:false});
      await account.getByRole('button',{name:'Sign out',exact:true}).click();
      await expect(page.locator('#phx-r10-name')).toHaveText('Profil');
      assert.equal(await page.evaluate(k=>sessionStorage.getItem(k),key),null);
      await page.reload();await expect(page.locator('#phx-r10-name')).toHaveText('Profil');
      await page.locator('#phx-r8-war-back').click();
      await page.locator('.phx-home-live-login').click();
      await account.getByLabel('Test account email').fill('fixture@example.invalid');
      await account.getByLabel('Password',{exact:true}).fill('fixture-wrong');
      await account.getByRole('button',{name:'Sign in',exact:true}).click();
      await expect(account.getByRole('status')).toHaveText('Could not sign in with that test account.');
      assert.equal(await page.evaluate(k=>sessionStorage.getItem(k),key),null);
      assert.deepEqual(errors,[]);
      console.log('BESTANDEN: '+width+'px · compact HOME, original IX badge, account only in War Room, all six routes/back, login/reload/refresh/logout/failed login (simulated HTTP)');
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
