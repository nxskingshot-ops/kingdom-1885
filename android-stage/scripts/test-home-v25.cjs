'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium, expect } = require('@playwright/test');

const url = 'http://127.0.0.1:8765';
const evidence = process.env.PHX_EVIDENCE || '/tmp/phx-v25-evidence';
const profileKey = 'phx-personal-profile-r10';
const results = [];

async function check(label, run) {
  try {
    await run();
    results.push({ label, result: 'BESTANDEN' });
    return true;
  } catch (error) {
    results.push({ label, result: 'FEHLGESCHLAGEN', detail: error.message });
    return false;
  }
}

async function run() {
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true
    });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const id = name => page.locator('#' + name);
    const nav = action => page.locator('.phx-home-nav [data-home-action="' + action + '"]');
    const route = hash => expect(page).toHaveURL(url + '/#' + hash);
    const hero = page.locator('.phx-queen-experimental');
    const home = async () => page.goto(url + '/#phalanx-home', { waitUntil: 'load' });

    await check('HOME und Plaketten bei 393 px', async () => {
      await home();
      await expect(id('phx-r10-name')).toHaveText('FaQu');
      await expect(id('phx-r10-sub')).toBeHidden();
      await expect(id('phx-r11-affiliation')).toHaveText(/#1885\s*·\s*NXS/);
      await expect(hero.locator('.phx-home-name-texture')).toBeVisible();
      assert.equal(await hero.locator('.phx-queen-scene').evaluate(img => img.naturalWidth), 1670);
      await page.screenshot({ path: evidence + '/home-393.png' });
    });

    await check('Profilbild, War Room, Einstellungen und Profilspeicherung', async () => {
      await home();
      await id('phx-r8-war-entry').tap();
      await route('war-room');
      await expect(id('phx-r8-war')).toBeVisible();
      await expect(page.getByRole('region', { name: 'Commander Profile' })).toBeVisible();
      await expect(page.locator('[data-w2-name]')).toHaveText('FaQu');
      await expect(page.locator('[data-w2-alliance]')).toHaveText('NXS');
      await expect(page.locator('[data-w2-kingdom]')).toHaveText('#1885');
      await expect(page.locator('[data-w2-power]')).toHaveText('Data pending');
      const backBox = await id('phx-r8-war-back').boundingBox();
      const artBox = await page.locator('.phx-w2-hero').boundingBox();
      assert.ok(backBox.y + backBox.height <= artBox.y, 'Back button must stay above artwork');
      const artwork = await page.evaluate(async () => {
        const image = new Image();
        image.src = './phx-war-room-reference.jpg';
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      });
      assert.deepEqual(artwork, [969, 1536]);
      await page.screenshot({ path: evidence + '/war-room-design-393.png' });
      for (const title of ['ACCOUNT INTELLIGENCE', 'ALLIANCE POSITION', 'PLAYER DEVELOPMENT']) {
        const section = page.locator('.phx-w2-tile').filter({ hasText: title });
        await section.locator('summary').click();
        await expect(section.locator('p')).toBeVisible();
      }
      assert.doesNotMatch(await id('phx-r8-war').innerText(), /master power|pet power|hero power/i);
      await page.locator('.phx-w2-editor summary').click();
      const longName = 'CommanderFaQuTheGreatÉtoile';
      await id('phx-r10-input-name').fill(longName);
      await id('phx-r10-input-level').fill('33');
      await id('phx-r11-input-kingdom').fill('1901');
      await id('phx-r11-input-alliance').fill('ALT');
      await id('phx-r10-save').click();
      await expect(page.locator('[data-w2-name]')).toHaveText(longName);
      await expect(page.locator('[data-w2-level]')).toHaveText('33');
      assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).name, profileKey), longName);
      await page.locator('.phx-w2-shortcut-settings summary').click();
      const shortcuts = id('phx-r8-war-cards').locator('select');
      await expect(shortcuts).toHaveCount(3);
      await shortcuts.nth(0).selectOption('report');
      await shortcuts.nth(1).selectOption('territory');
      await shortcuts.nth(2).selectOption('map');
      await page.reload({ waitUntil: 'load' });
      await page.locator('.phx-w2-shortcut-settings summary').click();
      for (const [index, target] of ['report', 'territory', 'map'].entries()) {
        await expect(shortcuts.nth(index)).toHaveValue(target);
      }
      await page.locator('.phx-w2-shortcut-settings summary').click();
      await expect(page.locator('[data-w2-name]')).toHaveText(longName);
      await expect(page.locator('.phx-w2-shortcut')).toHaveText(['Reports', 'Territory', 'Outpost Map']);
      await page.screenshot({ path: evidence + '/war-room-393.png' });
      for (const [label, destination] of [['Outpost Reports', 'report'], ['Territory Control', 'home'], ['Outpost Map', 'map']]) {
        await page.getByRole('region', { name: 'Command Access' }).getByRole('button', { name: label }).click();
        await route(destination);
        await page.goBack();
        await route('war-room');
      }
      await id('phx-r8-war-back').click();
      await route('phalanx-home');
      await page.reload({ waitUntil: 'load' });
      await expect(id('phx-r10-name')).toHaveText(longName);
      await expect(id('phx-r10-sub')).toBeHidden();
      await expect(id('phx-r11-affiliation')).toHaveText(/#1901\s*·\s*ALT/);
      for (const width of [320, 393, 740]) {
        await page.setViewportSize({ width, height: 852 });
        const name = await id('phx-r10-name').evaluate(node => {
          const rect = node.getBoundingClientRect();
          const heroRect = node.closest('header').getBoundingClientRect();
          return { x: (rect.x + rect.width / 2 - heroRect.x) / heroRect.width,
            style: getComputedStyle(node).textOverflow };
        });
        assert.ok(Math.abs(name.x - 0.192) < 0.003, 'Name must be centered within the gilt frame');
        assert.equal(name.style, 'ellipsis');
        if (width === 320) await page.screenshot({ path: evidence + '/home-long-name-320.png' });
      }
      await page.setViewportSize({ width: 393, height: 852 });
    });

    await check('HOME → Command Center und PYLON IX → HOME', async () => {
      await home();
      await nav('command').click();
      await expect(id('phx-home-command-heading')).toBeFocused();
      await nav('pylon').click();
      await route('pylon');
      await expect(id('phx-pylon-modal')).toBeVisible();
      await expect(id('phx-pylon-modal').locator('img').first()).toBeVisible();
      await id('phx-pylon-close').click();
      await route('phalanx-home');
    });

    await check('HOME → Territory Control → Outpost Map und Reports → HOME', async () => {
      await home();
      await page.locator('[data-home-card=territory]').click();
      await route('home');
      await expect(id('home')).toBeVisible();
      await id('open-map').click();
      await route('map');
      await expect(id('map')).toBeVisible();
      await page.locator('#phx-r3-nav [data-phx-r3-target=home]').click();
      await route('home');
      await id('hall-open-report').click();
      await route('report');
      await expect(id('report')).toBeVisible();
      await id('report-back').click();
      await route('home');
      await page.getByRole('link', { name: 'Zurück zu HOME' }).click();
      await route('phalanx-home');
      await nav('reports').click();
      await route('report');
    });

    await home();
    await nav('territory').click();
    await id('open-map').click();
    const map = page.frameLocator('#map-frame');
    const loaded = await check('74 verifizierte Outposts über den bestehenden Lese-Endpunkt', async () => {
      await expect(map.locator('#status')).toContainText('74 verifizierte Outposts', { timeout: 15000 });
      await expect(map.locator('#rows > *')).toHaveCount(74);
    });
    if (loaded) {
      await check('Outpost Map Allianzfilter und Rücksetzen', async () => {
        const alliance = map.locator('#a');
        await alliance.selectOption({ index: 1 });
        const count = await map.locator('#rows > *').count();
        assert.ok(count > 0 && count < 74);
        await map.locator('#reset').click();
        await expect(map.locator('#rows > *')).toHaveCount(74);
      });
    } else {
      results.push({ label: 'Outpost Map Allianzfilter mit Live-Daten', result: 'NICHT GETESTET' });
    }
    await check('Map-Zoom und Vollbild-Umschaltung', async () => {
      const camera = map.locator('#camera');
      const initial = await camera.getAttribute('transform');
      await map.locator('#zin').click();
      await expect(camera).not.toHaveAttribute('transform', initial);
      const expand = map.locator('#expandMap');
      await expand.click();
      await expect(expand).toHaveAttribute('aria-pressed', 'true');
      await expand.click();
      await expect(expand).toHaveAttribute('aria-pressed', 'false');
    });
    await check('Reports CSV-Export', async () => {
      await page.locator('#phx-r3-nav [data-phx-r3-target=report]').click();
      const [file] = await Promise.all([page.waitForEvent('download'), id('matrix-csv').click()]);
      assert.match(file.suggestedFilename(), /\.csv$/i);
      assert.match(await fs.readFile(await file.path(), 'utf8'), /Allianz.*Nord.*Gesamt/);
    });
    await check('Keine unbehandelten Browserfehler', async () => assert.deepEqual(errors, []));
  } finally {
    await browser.close();
    await fs.writeFile(evidence + '/browser-results.json', JSON.stringify(results, null, 2) + '\n');
    for (const row of results) console.log(row.result + ' ' + row.label + (row.detail ? '\n' + row.detail : ''));
  }
  if (results.some(row => row.result === 'FEHLGESCHLAGEN')) process.exitCode = 1;
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
