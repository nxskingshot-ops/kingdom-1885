# PHX-TRANSFER-FINAL — 01.11.2026

Status: IMPLEMENTIERT / LOCAL TESTED; authenticated live acceptance remains open.

## Source gate and preservation
Stage baseline: 930bc79027ff74029c66fd0b63b54f5dd942e1fc. V8 deployment dpl_FfJtcrgmhrC9YwfBuPvujrya9ppP confirmed READY; deployed HTML references the V8 diagnostics script. Supabase hcjrdofkdkasznywvcxo ACTIVE_HEALTHY. Governance START-HERE, Master Register, five attached registers, immutable A041/A040, HOME header and TC interpretation read. Canonical governance retires Epic Navigation V2; it was not restored.

Active integration candidate: existing preview/transfer-scouting-id-stage-20261030.{html,js}, already containing the ID-first workflow, compact summary, ranking provenance and individual comparison. V8 is a regression/diagnostic reference, not a replacement for this more complete implementation. V5/V6/V7, original header and reference stylesheet remain unchanged. No HOME, Atlas, Reports, PYLON, backend, Auth/RLS, roles or data changes.

## Reproduced transport defect
Live OPTIONS to V8 origin for ID 227802999 returns 204, but Access-Control-Allow-Headers is only authorization, apikey, content-type. SDK functions.invoke adds x-client-info, which is absent from this contract. A successful OPTIONS alone does not permit the browser GET. Historical unified logs show three OPTIONS and no corresponding function GET around 2026-10-31 18:11–18:12 UTC; earlier GETs for the same ID returned 200. This proves a transport incompatibility, not current provider coverage or authenticated lookup success.

V8 now uses the existing authenticated explicit fetch pattern with only apikey and Authorization, plus timeout, allowlisted error categories and HTTP status. No wider CORS or disabled identity/auth checks. The complete existing workspace already uses this two-header pattern and remains the integration base. Supabase official CORS guidance also documents SDK x-client-info requirements.

## Cohesive integration
- Four dossier views: Overview; Strengths & limits; Compare #1885; Recruitment. Existing comparison controls move into the dossier and return to Tools on exit without losing handlers or selection.
- Overview retains ID, kingdom, alliance, castle, Total Power, True Power, Master, Pet and Hero values. Kills excluded from summary.
- Source ranking scores explicitly labeled; no undocumented conversion to actual power. Non-troop True Power requires matching full capture representation and provenance, not merely rounded timestamps.
- Six Mystic rank indicators, complete-only descriptive average/spread, no official formula or combat prediction. Missing coverage never becomes rank 101 or zero; external candidates are read from their own identity-verified bridge data.
- Sources/history grouped behind disclosure; available exact values and capture times preserved. Existing candidate adoption, duplicate guard, CSV and edit metadata preservation retained.

## Verification
59 automated tests passed (Node plus JSDOM, synthetic in-memory data only). Includes V8 exact headers/safe errors, roles and expired access gates, foreign origins, quota exhaustion, identity mismatch, snapshot fallback, per-source freshness, missing/zero values, strict True Power captures/provenance, ranking labels, six trials, four tabs, panel restoration, individual #1885 ID/wrong-kingdom rejection, candidate save/load/duplicate/edit and CSV. Header/reference CSS byte equality checked against historical original. Syntax and whitespace checks passed.

| Required check | Result | Evidence / limitation |
|---|---|---|
| V8 READY / actual HTML | BESTANDEN | Existing project and V8 script reference confirmed through Vercel |
| CORS incompatibility / corrected request headers | BESTANDEN | Live OPTIONS contract + source audit + executable regression |
| Login / roles | BESTANDEN local; NICHT GETESTET live authenticated | Current browser shows PHALANX login; no authenticated session available |
| Player ID / foreign kingdoms | BESTANDEN synthetic; NICHT GETESTET current authenticated live | 227802999 #1555 and 290591005 #1885 are historical successes only |
| Lineage / freshness / missing values | BESTANDEN local | Exact values and separate capture times; no missing-to-zero inference |
| Mystic rankings / individual comparison | BESTANDEN local; NICHT GETESTET current live | No cross-kingdom rank superiority claim; Top-100 union is not census |
| Candidate management / saving / loading | BESTANDEN synthetic; NICHT GETESTET live writes | No synthetic records written to real shortlist |
| Mobile | NICHT GETESTET on real Android | Responsive styles retained; DOM checks do not prove physical device layout |
| Navigation / regressions | BESTANDEN affected local routes | Dossier, four views, comparison restoration, back, task navigation, CSV |
| Whole application HOME/Atlas/Reports | NICHT GETESTET this session | Protected source unchanged; this preview remains Transfer Scouting |
| Data integrity | BESTANDEN before changes; final check pending | One real candidate; initial fingerprint fac74063041a32834ba0f185c6f8ef0d |

## Backup and return path
BACKUP ERSTELLT: phalanx-before-final.bundle includes complete fetched Stage history at 930bc79. INTEGRITÄT GEPRÜFT: git bundle verify. WIEDERHERSTELLUNG GETESTET: independent clone, git fsck --full and exact restored HEAD. No DB backup/restore, actual Vercel rollback or Edge rollback tested. All prior Git commits and deployments preserved. Current preview deployment evidence to be appended after verification.

## Remaining work / continuation
Authenticate through the secure browser login to test real ID 227802999 and at least one #1885 ID, current provider payload/capture dates, six boards and comparison. Verify narrow Android layout. Live candidate save only for an intended real candidate; no test records in real data. Full live role matrix, provider-outage E2E, full kingdom census and recovery tests remain open. No final release claim.
