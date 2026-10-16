from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
import json
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(root)))
Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/deploy/phalanx-kvk-test/home-custom-001-isolated.html"
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(url)
    assert page.locator("#tiles .tile").count() == 3
    assert "Truppen noch nicht erfasst" in page.locator("#tiles").inner_text() or "Noch keine lokalen Accountdaten" in page.locator("#tiles").inner_text() or "Keine gültigen lokalen Accountdaten" in page.locator("#tiles").inner_text()
    page.locator("#edit").click()
    assert page.locator("#catalog").is_visible()
    page.get_by_role("button", name="+ Outpost Intelligence").click()
    assert page.locator("#tiles .tile").count() == 4
    page.get_by_role("button", name="Kachel Mein Account nach unten").click()
    assert page.locator("#tiles .tile").first.locator("a").inner_text().startswith("Team Optimizer")
    page.reload()
    assert page.locator("#tiles .tile").count() == 4
    assert page.locator("#tiles .tile").first.locator("a").inner_text().startswith("Team Optimizer")
    page.locator("#edit").click()
    page.get_by_role("button", name="Kachel Mein Account ausblenden").click()
    assert page.locator("#tiles .tile").count() == 3
    page.reload()
    assert page.locator("#tiles .tile").count() == 3
    page.evaluate("""localStorage.setItem('phalanx.commander.local.v1', JSON.stringify({schema:2,profile:{infantry:'100',cavalry:'200',archers:'300'}}))""")
    page.reload()
    assert "600 Truppen" in page.locator("#tiles").inner_text()
    page.on("dialog", lambda d: d.accept())
    page.locator("#reset").click()
    assert page.locator("#tiles .tile").count() == 3
    assert page.locator("#tiles .tile").first.locator("a").inner_text().startswith("Mein Account")
    assert page.evaluate("localStorage.getItem('phalanx.commander.local.v1')") is not None
    page.evaluate("localStorage.setItem('phalanx.home.custom.001.v1', JSON.stringify(['unknown','account','account']))")
    page.reload()
    assert page.locator("#tiles .tile").count() == 1
    assert page.locator("#tiles .tile").first.locator("a").inner_text().startswith("Mein Account")
    page.evaluate("localStorage.setItem('phalanx.home.custom.001.v1', JSON.stringify(Array(50).fill('account')))")
    page.reload()
    assert page.locator("#tiles .tile").count() == 3
    page.evaluate("localStorage.setItem('phalanx.commander.local.v1', JSON.stringify({schema:2,profile:{infantry:'abc',cavalry:'200',archers:'300'}}))")
    page.reload()
    assert "Truppenwerte nicht lesbar" in page.locator("#tiles").inner_text()
    page.evaluate("localStorage.setItem('phalanx.commander.local.v1', JSON.stringify({schema:999,profile:{infantry:'100',cavalry:'200',archers:'300'}}))")
    page.reload()
    assert "Keine gültigen lokalen Accountdaten" in page.locator("#tiles").inner_text()
    screenshots = root / "test-artifacts" / "home-custom-001"
    screenshots.mkdir(parents=True, exist_ok=True)
    page.evaluate("localStorage.removeItem('phalanx.home.custom.001.v1')")
    page.evaluate("localStorage.removeItem('phalanx.commander.local.v1')")
    page.reload()
    assert page.locator("main.px-home-native").count() == 1
    assert page.locator("main.px-home-native").evaluate("(e) => getComputedStyle(e).getPropertyValue('--px-border-panel').trim()") == "#235f8b"
    assert page.locator("body").evaluate("(e) => getComputedStyle(e).color") == "rgb(242, 245, 248)"
    page.screenshot(path=str(screenshots / "mobile-default.png"), full_page=True)
    page.locator("#edit").click()
    page.screenshot(path=str(screenshots / "mobile-edit.png"), full_page=True)
    assert not errors, errors
    browser.close()
server.shutdown()
print("HOME-CUSTOM-001 browser test: PASS")
