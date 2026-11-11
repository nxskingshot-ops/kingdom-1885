# PHALANX HOME R15 – Header V2 design proposal (2026-11-11)

Status: USER REQUESTS RECORDED; PROPOSALS NOT YET APPROVED OR IMPLEMENTED.

## User's four requested changes (preserve verbatim in intent)
1. Both upper plaques receive small, fine golden laurel sprigs or wheat-ear ornaments; symmetrical and subtle, engraved rather than cluttered.
2. Remove level display beneath the name; center and emphasize FaQu. Do not remove level from data model; only hide it in the header presentation.
3. Move the upper-left and upper-right flags outward toward image edges so they read as banner-wings around the central helmet. Preserve red/gold fabric, not literal feather wings.
4. Replace coarse/pixelated appearance with truly higher-detail artwork, not a simple upscale; sharp metal engraving, crisp fabric, high-resolution mobile/zoom-friendly source.

## Assistant proposals – user review pending
A. Improve helmet presence with restrained gold edge highlights, darker recesses and subtle red glow; avoid increasing height.
B. Unify plaques via matching gold material, laurel engraving and balanced typography; right side retains kingdom/alliance.
C. Increase micro-detail selectively, simplify backgrounds immediately behind text for mobile readability.
D. Separate artwork from live app profile labels: name, kingdom and alliance rendered as DOM text, not rasterized. Preserve existing auth/profile and FREEZEs; do not treat hard-coded screenshot values as data.

## Protection / release gates
- Original R12, original pinned header and R15 build guardrails remain unchanged.
- This is a design proposal, not a FREEZE amendment. No changes to production or permissions.
- Create new isolated image candidate; require visual approval before replacing any pinned asset or changing checksum/build.
- Verify 4K-source actual detail, mobile layout, image size/performance, contrast, text data bindings, navigation, original HOME regression and authenticated session E2E before release.
