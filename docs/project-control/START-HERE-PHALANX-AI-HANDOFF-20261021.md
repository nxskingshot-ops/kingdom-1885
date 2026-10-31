# ⚔️ NEXUS PHALANX — START HERE / AI HANDOFF (2026-10-21)

**Purpose:** The canonical *entry point* for any new chat, assistant, laptop session or developer. Read this first. It is an index, not a replacement for original FREEZEs or source code. **Status claims must be verified against repo/production.**

## 0. Source of truth / order
1. User's newest explicit approval and the most recent dated binding FREEZE for the same subject (newer supersedes conflicting older).
2. Verified actual code/assets/data in GitHub, Supabase and deployed app; design approval is not implementation proof.
3. This handoff and linked register.
4. Older drafts, previews and chat summaries are background only.
When sources conflict, record the conflict; do not silently choose an older version.

Repo: `nxskingshot-ops/kingdom-1885`.
Governance branch: `governance/phalanx-project-control-20261021` — contains recent FREEZEs and security drafts. **Do not assume main has these changes.**
Supabase production project ref: `hcjrdofkdkasznywvcxo`. No production schema/RLS/auth/deploy/main merge without explicit owner approval. Zero additional costs.
Product name: **NEXUS PHALANX 1.0 — FIRST STRIKE**. AI assistant name **PYLON IX**. Original Spartan-inspired art, not copied Kingshot hero portraits. DE/EN/FR planned.

## 1. Binding visual decisions
- HOME header: `docs/project-control/freezes/PHX-HOME-HEADER-FREEZE-20261021-01.md`. Approved visual **image is not yet committed as a canonical binary asset**. Do not claim pixel-perfect integration until archived/verified.
- Latest PHALANX WORLD DESIGN V1: approved epic Spartan-inspired, battle-scarred victorious fortress world; monumental rooms, worn stone/wood/bronze, torn banners/trophies, red/gold used as accents. Locate full original FREEZE before changing visual system.
- HOME: no phone status bar, circular gold-framed Spartan helmet avatar opens War Room; long player name responsive, kingdom/alliance gold shield, language selector last in nav; Power prominent, TC/TG, not kills on HOME. Personal avatar manual upload/crop only; no game-avatar fetching.
- Header color logic: HOME gold eyes/no burger; modules red eyes; function/detail blue eyes, latter two have back and burger. Respect latest specific HOME FREEZE if conflict.
- Territory Control Outpost Map 2.0 (Alpha24/Alpha35 historical versions) has multiple legacy artifacts. Verify **latest explicitly frozen and actual integrated** version before editing. Do not revert to old map. Keep Outpost Reports/Map distinct and user-friendly.
- PYLON IX emblem: crimson shield, gold lambda and laurel, glowing IX. Preserve existing protected art.
- **Navigation status (confirmed 2026-10-22):** Epic Navigation V2 is RETIRED and must not be restored as the current navigation. The provisional `docs/PHALANX_NAVIGATION_V1_2026-10-15.md` is historical reference only, NOT a current design FREEZE. Current navigation follows the user-approved HOME layout and its module/function hierarchy, including HOME → Territory Control → Outpost Map / Reports and profile avatar → War Room. Preserve HOME gold / module red / function blue header behavior. Old menu components in the repository are legacy artifacts, not permission to reintegrate them. The exact complete menu inventory still requires comparison with the newest approved HOME artwork; do not invent missing routes.

## 2. Registration and access FREEZEs
- Sign-up: email, password, Kingshot player ID; verify email, then PENDING_APPROVAL; authorized PHALANX admin approves. Do not ask user to manually supply name/alliance/power/TC. Profile data only from permitted, verified data source; source timestamp; no avatar lookup.
- No game rank auto-grants PHALANX rights. An may have broad *operational* admin powers by explicit grant, not ownership.
- Approved users: own profile, public Outpost facts and permitted PYLON IX. **Rankings are restricted**, not public-by-default. Strategist/Analyst can access authorized KvK intelligence, no automatic user admin.
- PYLON IX server-side permission checks for every tool/data query.
- References: `docs/project-control/PHX-REGISTRATION-MANUAL-APPROVAL-FREEZE-20261021.md`, `docs/project-control/PHX-OUTPOST-READ-RANKINGS-RESTRICTED-FREEZE-20261021.md`, `docs/project-control/PHX-STRATEGIST-ANALYST-PERMISSIONS-FREEZE-20261021.md`, `docs/project-control/PHX-PYLON-IX-PERMISSIONS-FREEZE-20261021.md`.

## 3. GOD MODE (critical, **NOT implemented**)
- Exactly one verified PHALANX owner with final authority; An/admins cannot ban, suspend, delete, demote, lock out, impersonate or transfer the owner via ordinary app/admin paths.
- Only owner can engage/disengage app-wide emergency lock. Independent recovery access. Owner identity separate from login credentials and **completely independent of Kingshot account/player ID/rank/kingdom/alliance**.
- Sole ownership transfer only after explicitly owner-authorized actual sale; no co-owner or normal transfer.
- Protected backend, Auth, RLS, API, infrastructure, deploy, recovery, auditing and negative tests required. No software can resist someone with unrestricted infrastructure control: secure credentials, reviews and backups.
- FREEZEs: `docs/project-control/PHX-GOD-MODE-INDEPENDENT-OF-KINGSHOT-FREEZE-20261021.md`, `docs/project-control/PHX-GOD-MODE-ANTI-OVERRIDE-FREEZE-20261021.md`, `docs/project-control/PHX-GOD-MODE-SALE-ONLY-TRANSFER-FREEZE-20261021.md`.
- Existing SQL guard is only a **draft**, SQL fixture **not run**. Python policy-model tests (5 groups) reported passed, **not database integration tests**. No Supabase development branches observed; branch may incur costs. Laptop PostgreSQL test deferred until user returns from walking Eddy.
- Test references: `security/tests/PHX-GOD-MODE-ISOLATED-OWNER-GUARD-TEST.sql`, `security/tests/PHX-GOD-MODE-POLICY-MODEL-TEST-20261021.md`, `security/audits/PHX-GOD-MODE-INTEGRATION-GATE-V2-20261021.md`.

## 4. Known technical facts / avoid false claims
- Supabase RLS enabled on existing membership/access/profile tables; `nxs_memberships` currently uses role enum kingdom/member/outpost_manager/r4/r5/admin; not the final permissions model. `nexus_access_requests` old form asks gamer_tag/alliance; conflicts with new sign-up FREEZE.
- Mighty Pulse snapshots exist but game `uid` vs `governor_id` identity mapping must be verified. Do not use game avatar URL.
- TC is castle tier only. Observed max 55 in kingdom 1885, not universal cap. TC 31–39 unknown.
- Backups reportedly completed on laptop (DB encrypted, 3 restore tests, 26 functions encrypted, external Drive ZIP); do not claim independently reverified unless inspect artifacts.
- Repo code search surfaced multiple legacy HOME and Outpost previews. This is why latest version/provenance audit precedes integration.

## 5. Immediate work queue (avoid loops)
A. **While user is away:** audit canonical HOME/Outpost/PYLON/navigation source versions and freeze provenance; consolidate references, identify *actual* integration blockers. No needless screenshot/test loop, no rewriting frozen artwork.
B. Then build one cohesive isolated HOME → Territory Control → Outpost Map / Reports integration on a safe branch, reusing canonical components, without fake placeholder navigation.
C. When laptop available: isolated real PostgreSQL security tests for GOD MODE; only then reviewed migrations.
D. Before release: end-to-end registration/approval, granular RLS, PYLON IX tool authorization, backups/restore, Android tests, language accessibility and production security gates.

## 6. Operating protocol
- User prefers design and concrete progress, minimal technical chores. Work in large blocks; no endless 'Go' prompts or repetitive checks.
- **Green text only for user approval/test actions**, not generic success narration.
- Links should be easy to copy. Never fabricate downloadable artifacts, commits, deployments or completed tests.
- Distinguish **FREEZE / draft / coded / tested / deployed** in every report.
- No merging into main, production deploy, RLS/auth changes or extra spending without explicit authorization.
- Update this entry-point document (or versioned successor with discoverable link) at each major milestone; link to immutable GitHub commit and record what changed.
- A future ChatGPT session does not automatically ingest this file: explicitly point it at this GitHub path and have it read before work.

## 7. Mandatory workflow / source gate (2026-10-22)
Before every development change, consult [PHX-A041 Mandatory Source Gate](https://github.com/nxskingshot-ops/kingdom-1885/blob/961000090cade29aa5f686b3fd70b1b4128f031e/docs/project-control/PHX-A041-MANDATORY-SOURCE-GATE-20261022.md) and [PHX-A040 Legacy Cleanup](https://github.com/nxskingshot-ops/kingdom-1885/blob/e07dc2f3ba0dc7f90648cb6c7065a52c8cac16ef/docs/project-control/PHX-A040-WORKFLOW-AND-LEGACY-CLEANUP-20261022.md). Both are currently on the isolated work branch, not main. Verify the latest actual implementation across relevant branches and Library; reuse before rebuilding, classify retired routes, test targeted regressions, preserve originals, and record evidence. These documents are workflow guidance, not proof of integration or CI enforcement. No production action is authorized by these links.


## Transfer Scouting Stage — 30.10.2026 Work-Nachtrag
Aktiver Stage-Branch: stage/transfer-id-lookup-20261030. Siehe docs/staging/transfer-work-verification-20261030.md. Stage-Bridge V2 deployed, CORS live negativ/Preflight geprüft; 9 lokale simulierte Prüfungen bestanden. Browser blockiert. Vercel hat angefordertes Preview im bislang leeren isolierten Projekt als production markiert; keine Gesamtfreigabe. PHALANX-Parent-Hülle, echte Anmeldung, Profile/Arena/Ranks, Candidate-CRUD und Navigation weiterhin offen. Keine Produktions-App ersetzt, kein Merge, keine Datenbankmigration.


## Isolated Transfer continuation — 2026-10-31
Read `docs/staging/transfer-work-verification-20261030.md`, section PHX-TRANSFER-WORLD-EN, before continuing Transfer work. Active branch `stage/transfer-id-lookup-20261030`; existing isolated Vercel test project only. English UI and removal of fictional runtime integrated; accepted header preserved. Local DOM tests are distinct from live Auth/RLS and Android tests. Remaining tests and local/cloud JSON convergence are explicitly open. No global release or freeze change.
