#!/usr/bin/env python3
"""Daily PHALANX evidence journal. GitHub API read-only; writes local Markdown only.

The GitHub workflow commits only docs/journal/daily/* on the dedicated journal branch.
No secrets or private backup data are fetched. Duration ≠ human working time.
"""
import datetime as dt
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

UTC = dt.timezone.utc
REPO = os.environ.get("GITHUB_REPOSITORY", "nxskingshot-ops/kingdom-1885")
BASE = "https://api.github.com/repos/" + REPO
TOKEN = os.environ.get("GH_TOKEN", "")
OUTPUT = pathlib.Path("docs/journal/daily")

def iso(value):
    return value.strftime("%Y-%m-%dT%H:%M:%SZ")

def github(path):
    url = BASE + path
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + TOKEN,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "phalanx-journal-v1",
    })
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)

def paged(path, limit=5):
    out = []
    for page in range(1, limit + 1):
        sep = "&" if "?" in path else "?"
        data = github(path + sep + "per_page=100&page=" + str(page))
        values = data.get("workflow_runs", []) if isinstance(data, dict) else data
        out.extend(values)
        if len(values) < 100:
            return out, False
    return out, True

def cell(value, maximum=100):
    # Prevent unsafe Markdown or forged rows/newlines in commit titles.
    s = str(value or "").splitlines()[0]
    s = re.sub(r"[\\x00-\\x1f\\x7f]", " ", s)
    return s.replace("|", "/").replace("`", "'")[:maximum]

def summarize(day, commits, runs, truncated):
    lines = [
        "# PHALANX · Technisches Tagesjournal · " + day,
        "",
        "**Quelle:** GitHub API, erfasst für das UTC-Kalenderdatum " + day + ".",
        "**Begrenzung:** GitHub-Ereignisse, keine Chat-Zeiten, keine persönlichen Arbeitsstunden.",
        "**Status:** Automatischer Nachweisbericht, KEINE Freigabe/Abnahme.",
        "",
        "## Commits (alle Branches im Repository)",
        "",
        "| Zeit UTC | Commit | Nachricht |",
        "| --- | --- | --- |",
    ]
    commits = sorted(commits, key=lambda c: c.get("commit", {}).get("committer", {}).get("date", ""))
    if commits:
        for c in commits:
            stamp = cell(c.get("commit", {}).get("committer", {}).get("date", ""), 30)
            sha = c.get("sha", "")[:12]
            title = cell(c.get("commit", {}).get("message", ""), 100)
            lines.append("| " + stamp + " | [`" + sha + "`](https://github.com/" + REPO + "/commit/" + sha + ") | " + title + " |")
    else:
        lines.append("| — | — | Keine gefunden |")
    lines += ["", "## GitHub Actions", "", "| Start UTC | Workflow | Status / Ergebnis | Nachweis |", "| --- | --- | --- | --- |"]
    runs = sorted(runs, key=lambda r: r.get("created_at", ""))
    if runs:
        for r in runs:
            url = r.get("html_url", "")
            if not url.startswith("https://github.com/" + REPO + "/actions/runs/"):
                continue
            lines.append("| " + cell(r.get("created_at"), 30) + " | " +
                         cell(r.get("name"), 70) + " | " +
                         cell(r.get("status")) + " / " + cell(r.get("conclusion")) + " | [Run](" + url + ") |")
    else:
        lines.append("| — | — | Keine gefunden | — |")
    lines += [
        "",
        "## Zeitangaben",
        "",
        "- Persönliche/aktive Arbeitsstunden: **NICHT ERFASST**.",
        "- Automatisierte GitHub-Läufe sind keine menschliche Arbeitszeit.",
        "- Historische Schätzung: 100–180 h (separat im Hauptjournal, nicht in Tagessummen aufnehmen).",
        "",
        "## Einschränkungen",
        "",
        "- Automatische Inventarisierung ist keine Bestätigung, dass Funktionen getestet oder freigegeben sind.",
        "- Branch-/Workflow-API hat maximal 500 Datensätze je Kategorie pro Tag; bei Grenzerreichung als unvollständig gekennzeichnet.",
        "- API-Limits, gelöschte Runs, verzögerte Jobs und GitHub-Retention können die Vollständigkeit beeinflussen.",
        "- Noch nicht erfasste Designarbeit und Gespräche sind explizit nicht mitgezählt.",
        "- Daten nur aus dem Repository; keine Supabase-Daten oder GitHub-Secrets im Bericht.",
        "- Abfrage vollständig: " + ("NEIN – Pagination-Limit erreicht." if any(truncated) else "JA – innerhalb des API-Umfangs."),
        "",
    ]
    return "\n".join(lines)

def main():
    if not TOKEN:
        raise RuntimeError("GH_TOKEN missing")
    day = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else dt.datetime.now(UTC).date() - dt.timedelta(days=1)
    if day > dt.datetime.now(UTC).date():
        raise ValueError("Future dates are not valid")
    begin = dt.datetime.combine(day, dt.time.min, UTC)
    end = begin + dt.timedelta(days=1)
    q = urllib.parse.urlencode({"since": iso(begin), "until": iso(end)})
    commits, ct = paged("/commits?" + q)
    runs, rt = paged("/actions/runs?created=" + urllib.parse.quote(day.isoformat(), safe=""))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    dest = OUTPUT / (day.isoformat() + ".md")
    new_content = summarize(day.isoformat(), commits, runs, (ct, rt))
    if not dest.exists() or dest.read_text(encoding="utf-8") != new_content:
        dest.write_text(new_content, encoding="utf-8")
    print("Generated " + str(dest) + ": " + str(len(commits)) +
          " commits, " + str(len(runs)) + " workflows, truncated=" + str(ct or rt))

if __name__ == "__main__":
    main()
