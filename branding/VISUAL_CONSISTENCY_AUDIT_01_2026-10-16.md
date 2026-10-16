# PHALANX — Visual Consistency Audit 01
Date: 2026-10-16 · Branch: `fix/battle-readiness-navigation-isolated-20261015`
Decision: FREEZE-001 = B, dark-fantasy PHALANX as future shared visual direction.

## Scope and method
Static inspection of actual isolated HTML/CSS. **Not** a pixel-level or browser-rendered verification. No code or production change.

| Area | Epic Navigation V2 (protected) | Player Intelligence isolated (unapproved) | Finding |
| --- | --- | --- | --- |
| Base background | `#020b15`, `#03111e`, `#061522` | `#090e19`, `#0c1524` | Different navy systems |
| Header/background | Radial `#173047` to `#03111e` | Radial `#29344d` to `#090e19` | Different contrast and hue |
| Gold accents | `#ffe0a0`, `#bd9142`, `#ffcf6e` | `#f5d995`, `#a98d52` and additional custom gradients | Different gold hierarchy |
| Typography | Georgia serif heading, system UI metadata | System UI base with ad-hoc Georgia/Palatino commander styling | Inconsistent display typography |
| Navigation | Epic Navigation V2 custom groups | Separate three-button local nav | Integration/navigation ownership unverified |
| Crest | Approved navigation assets and frozen composition | Verified red-helmet PNG in commander tile | Scope-specific image, not a global replacement |
| Data states | Existing frozen behavior | Historical/demo account examples | Must preserve clear data-status distinction |

## Proposed token mapping — **candidate, not yet approved as pixel-perfect**
| Token | Candidate reference | Evidence |
| --- | --- | --- |
| `--px-bg-canvas` | `#020b15` | Epic Navigation V2 HTML root |
| `--px-bg-surface` | `#041320` | Epic Navigation V2 menu-group |
| `--px-gold-primary` | `#ffe0a0` | Epic Navigation V2 h1 |
| `--px-gold-muted` | `#bd9142` | Epic Navigation V2 group border |
| `--px-text-secondary` | `#a9b6c3` | Epic Navigation V2 metadata |
| `--px-font-display` | Georgia, serif (interim CSS implementation) | Epic Navigation V2 h1; **not proof of exact cinematic poster font** |
| `--px-font-ui` | system-ui, sans-serif | Epic Navigation V2 metadata |

## Integration guardrails
1. No edits to Epic Navigation V2 or frozen HOME.
2. Do not apply candidate tokens globally before comparing the original HOME and PHALANX typography assets.
3. Refactor Player Intelligence as a derived isolated preview only after a screenshot acceptance test.
4. Do not replace the verified player red helmet with the historic green NXS alliance crest or vice versa.
5. Do not present source-code comparison as completed mobile/browser visual QA.

## Next
- Inspect exact frozen HOME asset from Library for source typography/color extraction.
- Build a separate read-only token catalogue and component mapping.
- Identify any *actual* competing approved PHALANX FREEZEs; ask user only for real conflicts.
- Prepare mobile before/after preview and obtain approval before changing any frozen surface.
