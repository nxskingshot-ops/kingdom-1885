'use strict';

const { execFileSync } = require('node:child_process');
const { _android, expect } = require('@playwright/test');

const evidence = '/tmp/phx-home-final-android';

async function run() {
  const [device] = await _android.devices();
  if (!device) throw new Error('Android emulator not found');
  try {
    const pid = Number(execFileSync('adb', ['shell', 'pidof', 'app.nexusphalanx.stage.homefinal'], {
      encoding: 'utf8'
    }).trim());
    if (!Number.isSafeInteger(pid) || pid < 1) throw new Error('App process not found');
    const socketName = 'webview_devtools_remote_' + pid;
    const webView = await device.webView({ socketName }, { timeout: 30000 });
    const page = await webView.page();
    await expect(page).toHaveURL(/^https:\/\/localhost\//);
    page.setDefaultTimeout(10000);
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    const id = name => page.locator('#' + name);
    const nav = target => page.locator('.phx-home-nav [data-home-action="' + target + '"]');
    await page.reload();
    await expect(id('phx-r6-home')).toBeVisible();
    await expect.poll(() => page.evaluate(async () =>
      (await window.Capacitor.Plugins.StatusBar.getInfo()).visible
    )).toBe(false);
    await expect(id('phx-r10-name')).toHaveText('Profil');
    await expect(id('phx-r10-sub')).toBeHidden();
    await expect(id('phx-r11-kingdom')).toHaveText('—');

    if (process.env.PHX_UNIFIED_PLAQUE === 'true') {
      const plaque = page.locator('.phx-home-unified-plaque');
      await expect(plaque).toBeVisible();
      await expect(plaque.locator('.phx-home-approved-portrait')).toHaveAttribute('viewBox', '649 0 220 220');
      await expect(plaque.locator('#phx-r11-affiliation')).toHaveCSS('border-top-left-radius', '0px');
      const plaqueBox = await plaque.boundingBox();
      const artworkBox = await page.locator('.phx-queen-scene').boundingBox();
      expect(plaqueBox.y + plaqueBox.height).toBeLessThanOrEqual(artworkBox.y);
      await page.screenshot({ path: evidence + '/android-home-unified-plaque.png' });
      console.log('BESTANDEN: API 35 consolidated HOME plaque above unchanged artwork.');
    }
    await id('phx-r8-war-entry').click();
    await expect(page).toHaveURL(/#war-room$/);
    await expect(page.getByRole('button', { name: 'Live profile' })).toBeVisible();
    await expect(page.locator('.phx-live-source-badge')).toHaveText('Sign in for live data');
    await expect(page.getByRole('region', { name: 'Live profile' })).toBeHidden();
    await expect(page.getByText('HOME FINAL TEST')).toHaveCount(0);
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
    await page.getByRole('button', { name: 'Transfer Scouting', exact: true }).click();
    await expect(page).toHaveURL(/#transfer$/);
    await expect(page.frameLocator('iframe[title="Transfer Scouting"]').locator('#login')).toBeVisible();
    execFileSync('adb', ['shell', 'input', 'keyevent', '4']);
    await expect(page).toHaveURL(/#pylon$/);
    await id('phx-pylon-close').click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    await page.getByRole('button', { name: 'Transfer Scouting PYLON IX' }).click();
    await expect(page).toHaveURL(/#transfer$/);
    await page.getByRole('button', { name: '← PYLON IX' }).click();
    await expect(page).toHaveURL(/#pylon$/);
    await id('phx-pylon-close').click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    console.log('BESTANDEN: API 35 HOME, War Room, Territory Control, Reports PYLON IX, Transfer Scouting und Android-Zurücktaste.');
    await nav('territory').click();
    await id('open-map').click();
    await expect(map.locator('#rows > *')).toHaveCount(74, { timeout: 20000 });
    expect(await page.evaluate(() => window.Capacitor.isPluginAvailable('OutpostExport'))).toBe(true);
    for (const format of ['json', 'csv']) {
      await map.locator('#export-' + format).dispatchEvent('click');
      await expect.poll(() => {
        execFileSync('adb', ['shell', 'uiautomator', 'dump', '/sdcard/phx-export.xml']);
        const xml = execFileSync('adb', ['shell', 'cat', '/sdcard/phx-export.xml'], { encoding: 'utf8' });
        const button = xml.match(/<node\b[^>]*(?:text="Save"|resource-id="[^"]+:id\/action_menu_save")[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/i);
        if (button) {
          const [, left, top, right, bottom] = button.map(Number);
          execFileSync('adb', ['shell', 'input', 'tap', String((left + right) >> 1), String((top + bottom) >> 1)]);
        }
        return Boolean(button);
      }, { timeout: 18000 }).toBe(true);
      await expect(map.locator('#export-status')).toHaveText('Export gespeichert.');
    }
    await page.locator('#phx-r3-nav [data-phx-r3-target=home]').click();
    await page.getByRole('link', { name: 'Zurück zu HOME' }).click();
    await expect(page).toHaveURL(/#phalanx-home$/);
    expect(failures).toEqual([]);
    console.log('BESTANDEN: API 35 Outpost-JSON und -CSV über den Android-Dateidialog gespeichert');
  } finally {
    await device.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
