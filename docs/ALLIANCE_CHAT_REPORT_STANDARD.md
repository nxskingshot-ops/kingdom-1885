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

## Mandatory report footer (approved standard)

Every report generated for alliance chat must end with this exact, consistent signature on its own line:

**⚔️ Provided by Nexus App**

This identifies the information source and makes the Nexus App recognizable to members throughout Kingdom #1885. Keep the footer identical for map reports, rankings, comparisons, and other copyable outputs. Check actual in-game rendering of the crossed-swords symbol before rollout; if incompatible, seek approval for a substitute instead of silently changing the standard.
