# Frag PHALANX — Release 1 acceptance gate

Decision 2026-10-14: A usable question-first assistant is required for the initial NEXUS PHALANX release, not a post-release enhancement. This is a product requirement, not an implemented feature.

## Goal
Make the extensive PHALANX capabilities approachable for all alliance members. Accept short keywords and ordinary-language questions, guide users to the relevant existing module, calculate with verified deterministic engines, explain answers and their uncertainty, and ask for missing information.

## Required coverage
- Bear trap marches, troop ratios, capacities and troop counts
- Hero and joiner comparisons with explicit model limitations
- KvK opponents, Head-to-Head, Players to Watch and data freshness
- Player Intelligence: personal strength, True Power, top-100 coverage where available, development trends, Mystic Trial categories, and dated Top 40 snapshots as one optional view. Never imply an old snapshot is current.
- Outpost intelligence and permitted reports
- Contextual help and navigation

## Release acceptance
1. New user can accomplish core tasks without knowing module names.
2. German and English queries and keyword synonyms work; third supported app language should be included before release if language parity is required.
3. Follow-up questions preserve context within a session.
4. Missing inputs produce clear clarification questions, never invented numbers.
5. Calculations are delegated to tested PHALANX functions; responses distinguish observations, assumptions and predictions.
6. All data access uses existing server-side authorization and roles; no privileged data is exposed by chat.
7. Errors and unsupported requests fail transparently with useful navigation.
8. Mobile portrait usability and frozen design are preserved; integration requires separate UI approval.
9. No paid AI API, paid Supabase branch or extra infrastructure without explicit user approval.
10. A regression test set and novice-user acceptance test must pass before go-live.
11. For development questions, require at least two comparable dated observations; if absent, report insufficient history instead of inferring change from a single ranking.
12. Route legacy keyword `Top 40` to Player Intelligence with an optional Top 40 view; prefer task language such as `Who improved most in our alliance?`.

## Scope note
A free rules-and-tools assistant cannot promise general ChatGPT-level language understanding. An optional LLM integration may be evaluated separately, with explicit privacy, cost and security review. Do not mark release ready before acceptance tests pass.
