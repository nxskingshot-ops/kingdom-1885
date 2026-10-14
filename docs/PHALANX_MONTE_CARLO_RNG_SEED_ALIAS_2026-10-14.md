# PHALANX RNG seed alias verification — 2026-10-14

Source reviewed: `src/phalanx-monte-carlo-v2.js`, where `rng(seed)` initializes state with `seed >>> 0` and uses a 32-bit LCG.

Local Node.js checks:
- Seed `1885` and `4294969181` both normalize to `1885` and yield identical first RNG output `0.9666042979806662`.
- Seed `-1` and `4294967295` both normalize to `4294967295` and yield identical first output `0.2356804204173386`.
- Decimal inputs `9007199254740992` and `9007199254740993` parse to the same JavaScript Number, confirming unsafe-integer precision loss.

The generator's 32-bit normalization is intentional-looking but not explicitly explained in Alpha31. This is a reproducibility/UX ambiguity, not proof of incorrect Monte Carlo calculations.

**Recommendation:** For Alpha31, prefer a UI-only guard requiring an integer seed in the inclusive range 0..4294967295 and label this as a 32-bit seed. Preserve existing engine behavior for compatibility. Prepare and test only as an isolated candidate; do not merge without approval.

No production code or frozen design changed.
