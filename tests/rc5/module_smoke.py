#!/usr/bin/env python3
"""RC5 module smoke tests: run from repository root with playwright installed.
Read-only: local static server, no external network, no credentials, no writes to app data.
"""
import json, threading, http.server, socketserver, pathlib, re
from playwright.sync_api import sync_playwright

ROOT=pathlib.Path(__file__).resolve().parents[2]
TARGETS=[
"preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html",
"preview/kvk-prep-five-contrast-v13.html",
"preview/kvk-enemy-1913.html",
"preview/nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html",
"preview/phalanx-kingdom-scout-report-v1-20261014.html",
"preview/phalanx-ranking-integration-rc-20261015.html",
"preview/outpost-report-v11.html",
"preview/outpost-editor-v5.html",
"preview/kingdom-hub-trends-v8.html",
"preview/transfer-scouting-integrated-v10.html",
"preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html",
"preview/phalanx-robust-optimizer-alpha28-2026-10-12.html",
]
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def log_message(self,*args):pass
class Server(socketserver.ThreadingTCPServer):allow_reuse_address=True
def main():
    results=[]
    with Server(("127.0.0.1",0),Handler) as server:
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        base=f"http://127.0.0.1:{server.server_address[1]}"
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True)
            for path in TARGETS:
                row={"path":path,"exists":(ROOT/path).is_file(),"errors":[],"blocked_external":0,"status":None,"title":None}
                if not row["exists"]:results.append(row);continue
                context=browser.new_context(viewport={"width":390,"height":844},service_workers="block")
                page=context.new_page()
                page.on("pageerror",lambda e,r=row:r["errors"].append(str(e)[:250]))
                # Only intercept non-local HTTP(S) requests. Local requests are
                # handled normally by Chromium; no Route.continue_ is needed.
                # This also avoids the failing route continuation observed in CI #1.
                def block_external(route, r=row):
                    r["blocked_external"]+=1
                    route.abort()
                page.route(re.compile(r"^https?://(?!127\\.0\\.0\\.1:)"), block_external)
                try:
                    response=page.goto(base+"/"+path,wait_until="domcontentloaded",timeout=12000)
                    page.wait_for_timeout(700)
                    row["status"]=response.status if response else None
                    row["title"]=page.title()
                    row["horizontal_overflow"]=page.evaluate("document.documentElement.scrollWidth>innerWidth")
                except Exception as e:row["errors"].append(str(e)[:250])
                context.close();results.append(row)
            browser.close()
        server.shutdown()
    print(json.dumps({"scope":"offline local smoke, not auth/API integration","results":results},ensure_ascii=False,indent=2))
if __name__=="__main__":main()
