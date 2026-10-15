# NEXUS PHALANX — Kingdom Head-to-Head visual FREEZE (2026-10-15)

Status: **VISUAL REFERENCE APPROVED / NOT YET IMPLEMENTED**

Approved reference: image generated and approved in ChatGPT conversation on 2026-10-15. The original generated artwork must be supplied as a real deployable image asset before marking the visual implementation complete. Do not substitute a generic helmet, circle, or newly invented insignia.

## Approved composition
- Two matching PHALANX helmets, each backed by **two crossed swords**.
- Left: Kingdom #1885 / NEXUS, gold + cool blue highlights, blue kingdom panel.
- Right: Kingdom #1913 / current opponent, silver + dark red highlights, red kingdom panel.
- Gold VS centered between both sides.
- Identical helmet geometry, balanced scale and spacing; fantasy background should not obscure content.
- Keep numeric kingdom identification and the existing power totals readable and visible at portrait mobile widths.
- Existing data status, date and source remain visible; historical snapshot must not be presented as live.
- Preserve the approved Epic Navigation V2 header/navigation and working Battle Readiness switching.

## Sword geometry — additional approved FREEZE requirement
- Each helmet must have two complete, straight sword axes forming a **geometrically symmetric X**, crossing at the same central point behind the helmet.
- Sword tips and pommels must align on their respective straight diagonals; no bent, disconnected, or offset blades.
- Left and right emblems must have **identical crossing angles, sword lengths, centers, vertical alignment and overall scale**. Only their approved blue/gold versus red/silver material accents differ.
- On mobile, both crossed-sword emblems must share the same horizontal baseline; no independent stretching or cropping that alters alignment.
- Validate against an overlay/guide before visual acceptance; the prior generated image is a mood/composition reference but its sword geometry is **not** approved as-is.

## Asset contract (not yet satisfied)
Expected files, once approved artwork has been exported and made available:
- `deploy/phalanx-kvk-test/assets/h2h-1885-helmet-swords.webp`
- `deploy/phalanx-kvk-test/assets/h2h-1913-helmet-swords.webp`

Both should have transparent backgrounds, matching dimensions and consistent framing. Never claim this FREEZE is implemented until actual assets exist, deployed pages reference them, preflight passes, and Android screenshot matches the reference.

## Implementation boundary
Only the isolated Cloudflare test branch may be modified. Do not change `main`, production, Supabase, permissions, RLS, or the established FREEZEs of unrelated modules.

## Acceptance
1. Both helmet-and-crossed-sword assets load on Android without placeholder circles or broken images.
2. Blue/red kingdom panels and VS visually match the approved reference.
3. Both kingdom power totals and labels are fully visible without clipping at mobile portrait widths.
4. Battle Readiness opens, and the return link works.
5. Existing preflight and Cloudflare preview deploy pass; visual acceptance is confirmed by the user.
