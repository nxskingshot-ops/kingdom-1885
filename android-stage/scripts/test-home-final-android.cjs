'use strict';

const { chromium, expect } = require('@playwright/test');

const evidence = '/tmp/phx-home-final-android';

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  try {
    const [context] = browser.contexts();
    const page = context.pages().find(tab => tab.url().startsWith('https://localhost/'));
    if (!page) throw new Error('Capacitor webview not found');
    page.setDefaultTimeout(10000);
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    const id = name => page.locator('#' + name);
    const nav = target => page.locator('.phx-home-nav [data-home-action="' + target + '"]');
    await page.reload();
    await expect(id('phx-r6-home')).toBeVisible();
    await expect(id('phx-r10-name')).toHaveText('Profil');
    await expect(id('phx-r10-sub')).toBeHidden();
    await expect(id('phx-r11-kingdom')).toHaveText('—');
    await id('phx-r8-war-entry').click();
    await expect(page).toHaveURL(/#war-room$/);
    await expect(page.getByRole('button', { name: 'Live profile' })).toBeVisible();
    await expect(page.locator('.phx-live-source-badge')).toHaveText('Sign in for live data');
    await page.screenshot({ path: evidence + '/android-war-room.png' });
    await id('phx-r8-war-back').click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    await nav('territory').click();
    await expect(page).toHaveURL(/#home$/);
    await id('open-map').click();
    await expect(page).toHaveURL(/#map$/);
    const map = page.frameLocator('#map-frame');
    await expect(map.locator('#rows > *')).toHaveCount(74, { timeout: 20000 });
    await expect(map.locator('#export-json')).toBeEnabled();
    await expect(map.locator('#export-csv')).toBeEnabled();
    await page.locator('#phx-r3-nav [data-phx-r3-target=home]').click();
    await expect(page).toHaveURL(/#home$/);
    await page.getByRole('link', { name: 'Zurück zu HOME' }).click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    await nav('reports').click();
    await expect(page).toHaveURL(/#report$/);
    await id('report-back').click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    await nav('pylon').click();
    await expect(id('phx-pylon-modal')).toBeVisible();
    await id('phx-pylon-close').click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    expect(failures).toEqual([]);
    console.log('BESTANDEN: API 35 APK-Installation, HOME, War Room, Navigation und 74 Live-Outposts im WebView');
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
