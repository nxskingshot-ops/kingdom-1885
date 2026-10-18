# RC5 nested dependency audit — 2026-10-18

Seven direct preview targets are present in the alpha branch. Static inspection found further relative dependencies in Command Center, KvK Prep, Battle Readiness, Outpost Report and Kingdom Hub Trends. Rankings and Hero Intelligence showed no relative HTML src/href references in this scan.

The current standalone package includes the seven direct targets, but does not yet cover every nested link or PWA asset. In particular, some assets use parent-directory paths. This is a source audit, not a functional test. Do not mark the standalone package complete or deploy it as accepted until the nested dependencies are resolved. Original FREEZEs and production remain unchanged.
