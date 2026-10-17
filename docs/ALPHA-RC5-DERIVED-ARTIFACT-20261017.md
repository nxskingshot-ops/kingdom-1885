# RC5 alpha derivative — built artifact, 2026-10-17

The immutable original RC5 HTML was extracted from ChatGPT Library archive `NEXUS_PHALANX_EPIC_NAVIGATION_V2_FREEZE_BACKUP_2026-10-15.zip`. Original SHA-256 verified: `635053c7bd5c846ef66a941d71c4915ce1dba95bc1198e56d27904be19b6d505`.

A **separate local derivative** `PHALANX_RC5_ALPHA_DERIVED_20261017.html` was generated (627059 bytes, SHA-256 `e767ed7fd477bd797cd3eb80401358b2a345458abe312cf3ffdff8249d452062`). It preserves original CSS, images, DOM grouping, labels and banners. Exactly six pending anchors with existing preview URLs have `data-pending` removed, and all seven preview URLs are converted to relative `./filename.html` for isolated deployment. The original click interceptor remains in place for the other 32 `href="#"` anchors. One test-only data attribute was added to the document root.

Static checks: 6 enabled + 1 existing Rankings link + 32 still disabled = 39 total. The generated artifact is **not yet committed to GitHub, deployed to Cloudflare or Android-tested**. Relative links require placing this HTML inside the same `preview/` directory as its target modules. Existing GitHub adapter JS remains experimental and is **not required** by this standalone derived artifact.

Next: upload the exact derived artifact into isolated branch `preview/` and integrate into the alpha harness, then run browser smoke tests. Do not modify original, main or production.
