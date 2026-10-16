from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
import json
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(root)))
Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/deploy/phalanx-kvk-test/commander-account-local-isolated.html"
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(accept_downloads=True)
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.goto(url)
    assert page.locator("#preview").inner_text() == "COMMANDER"
    page.locator("#name").fill("FaQu")
    page.locator("#kingdom").fill("1885")
    page.locator("#alliance").fill("NXS")
    page.locator("#infantry").fill("50000")
    page.locator("#cavalry").fill("20000")
    page.locator("#archers").fill("80000")
    assert "150.000" in page.locator("#troopSummary").inner_text()
    page.locator("#heroName").fill("Marlin")
    page.locator("#heroStars").fill("5")
    page.locator("#heroSkill").fill("5")
    page.locator("#addHero").click()
    assert "Marlin" in page.locator("#heroList").inner_text()
    page.locator("#save").click()
    assert "gespeichert" in page.locator("#status").inner_text()
    saved = page.evaluate("localStorage.getItem('phalanx.commander.local.v1')")
    obj = json.loads(saved)
    assert obj["profile"]["infantry"] == "50000"
    assert json.loads(obj["profile"]["heroRoster"])[0]["name"] == "Marlin"
    page.reload()
    assert page.locator("#name").input_value() == "FaQu"
    assert "Marlin" in page.locator("#heroList").inner_text()
    page.locator("#heroList button").first.click()
    assert page.locator("#addHero").inner_text() == "Änderung übernehmen"
    page.locator("#cancelHero").click()
    assert page.locator("#addHero").inner_text() == "Held hinzufügen"
    assert "Skill 5" in page.locator("#heroList").inner_text()
    page.locator("#heroList button").first.click()
    page.locator("#heroSkill").fill("4")
    page.locator("#addHero").click()
    assert "Skill 4" in page.locator("#heroList").inner_text()
    with page.expect_download() as download:
        page.locator("#export").click()
    exported = json.loads(Path(download.value.path()).read_text())
    assert json.loads(exported["profile"]["heroRoster"])[0]["skill"] == "4"
    with page.expect_download() as calculator_download:
        page.locator("#optimizerExport").click()
    calculator = json.loads(Path(calculator_download.value.path()).read_text())
    assert calculator["troops"] == {"infantry": 50000, "cavalry": 20000, "archers": 80000}
    assert calculator["heroes"][0]["name"] == "Marlin"
    optimizer_url = url.replace("commander-account-local-isolated.html", "team-optimizer-alpha11-isolated.html")
    page.goto(optimizer_url)
    page.locator("#loadCommander").click()
    assert "1 Helden übernommen" in page.locator("#commanderImportStatus").inner_text(), page.locator("#commanderImportStatus").inner_text()
    assert "Marlin" in page.locator("#roster").inner_text()
    page.locator("#loadCommander").click()
    assert "0 Helden übernommen" in page.locator("#commanderImportStatus").inner_text()
    assert page.locator("#roster .heroitem").count() == 1
    page.goto(url)
    page.on("dialog", lambda d: d.accept())
    page.locator("#heroList button").last.click()
    assert "Noch keine Helden" in page.locator("#heroList").inner_text()
    page.locator("#deleteLocal").click()
    assert page.evaluate("localStorage.getItem('phalanx.commander.local.v1')") is None
    assert not errors, errors
    browser.close()
server.shutdown()
print("Commander Account browser smoke test: PASS")
