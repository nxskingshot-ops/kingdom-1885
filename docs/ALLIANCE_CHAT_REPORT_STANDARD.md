# Nexus App — Alliance Chat Report Standard

**Status:** Prepared foundation only. No Nexus App UI or runtime behavior is changed by this document.

## Goal

Every useful data query in the Nexus App should be capable of producing a **copy-paste-ready report** that can be posted directly into a Kingdom #1885 alliance chat without manual reformatting.

The report feature should support authorized users and should remain simple enough that it does not add unnecessary complexity to the Nexus App.

## Core principle

For every supported query, ask:

> Can an authorized player turn this result into a clean alliance-chat message with one action?

The visible action can later be implemented as **Copy Report** / **Copy All** where appropriate.

## Report requirements

Each generated report should be:

- concise enough for alliance chat
- readable on mobile
- directly copyable
- based only on the currently displayed / authorized data
- consistently formatted across Nexus App sections
- free of unnecessary technical metadata
- explicit about verification status when data may not be fully verified

## First priority: Map reports

The first implementation target should be the Outpost Map after a reliable current map baseline has been established.

Example request from An:

> I need all outposts in the northern quadrant.

Target flow:

**Northern Quadrant → Create Report → Copy All**

Example output structure:

```
Nexus App — Northern Quadrant

Builder's Guild L1 — 1068,138
Forager Grove L1 — 957,138
Arsenal L2 — 868,139
...

Source: Nexus App
Status: Verified / Please verify in-game
```

Map report fields should support, where available:

- building / outpost name
- type
- level
- coordinates
- alliance assignment
- verification status

## Future supported report types

The same report engine should later be reusable for:

- Outpost / map queries
- alliance rankings
- True Power rankings
- player comparisons
- alliance comparisons
- Transfer Scouting summaries
- KvK / operational summaries
- other data views where sharing in alliance chat is useful

## Access and privacy

Reports must respect the same authorization rules as the source view.

A report must never expose information that the current user is not authorized to view in the Nexus App.

## UX constraint

Do not create a separate complicated reporting area unless clearly needed.

Prefer a small reusable action attached to relevant results, e.g.:

**Create Report** → preview → **Copy All**

The existing approved Nexus App design and working features remain unchanged unless implementation is explicitly approved.

## Dependency

Map reporting must not be treated as reliable until the current map data source is verified and a trustworthy present-day baseline exists.

Linus' help is valuable for establishing that reliable current source of truth.

## Approved Kingshot chat report format (frozen after in-game tests, 2026-09-30)

The user has approved the **single-message, one-outpost-per-line** report from the latest Kingshot screenshot. Treat its layout as frozen. Do not switch to a split report, icons or combined outpost lines unless expressly requested.

- Header: `FRA NORTH | 9 OUTPOSTS` in the illustrative example — use actual sector/alliance label and actual number of entries for real reports. **Do not put Nexus App in the header.**
- Body: one outpost per line, `Building name L#: x,y`, preserving the game's building names and source coordinates.
- Footer: a **data timestamp and verification status**, followed by `Provided by Nexus App` on the next line. **No emoji/icon** in the report footer, since candidate icons did not render satisfactorily in-game.
- Timestamp layout when a real last-update timestamp exists: `DD.MM.YY/HH:MM | Verified` (or `Unverified`, according to source status). The date/time must reflect the **source data's actual latest update** in Europe/Berlin time, **never** the report-generation time.
- If the source timestamp is unknown, write `Data: Date/time unknown | Unverified`. Do not use the example timestamp to imply verification.
- Last line exactly: `Provided by Nexus App`.
- The user-approved screenshot demonstrated that Kingshot can sometimes remove line breaks near the end of long messages; prioritize readable one-message reports for lists of this scale, and check final rendering before any future dynamic rollout.
- Keep authorization identical to the source data. This document is a specification only: it does not implement report buttons or modify the existing Nexus App design.

### Frozen format example, using historical/unverified FRA data

```text
FRA NORTH | 9 OUTPOSTS
Builder's Guild L1: 1068,138
Forager Grove L1: 957,138
Arsenal L2: 868,139
Harvest Altar L1: 770,140
Drill Camp L2: 769,239
Scholar's Tower L1: 666,267
Scholar's Tower L3: 869,328
Frontier Lodge L3: 769,329
Armory L2: 956,438
Data: Date/time unknown | Unverified
Provided by Nexus App
```

### Footer after actual verification (illustrative only)

```text
30.09.26/12:23 | Verified
Provided by Nexus App
```

The illustrative timestamp is **not a statement that this data was verified**. Obtain a reliable map source (Linus or another authoritative maintainer) before displaying Verified. These report conventions apply to future exportable reports in other Nexus App sections as appropriate.

## Quadrant report selector — provisional implementation (2026-09-30)

The public Outpost Map's **Copy Report** chooser now includes both individual published alliances and a provisional set of quadrant aliases:

- North → FRA
- East → NXS
- South → OoO
- West → MYM

**These are alliance-territory aliases, not geometric coordinate quadrants.** Do not use map-center filtering or claim that every outpost of an alliance lies geographically inside the named sector. Until Linus or another responsible map maintainer confirms sector definitions, show `(PROVISIONAL)` in the quadrant report header and `Unverified` in the footer. All quadrants only read published rows for their mapped alliance; edits and protected data are out of scope.

For lengthy reports, the formatter may pair short items on one line to preserve Kingshot chat line breaks at the end. Entries are ordered by building level descending, then type and coordinates; all records remain present. This compact treatment applies only where explicitly enabled (current public map report chooser), not across unrelated report types. Source timestamps always represent the newest change among displayed records, not a human verification date.
