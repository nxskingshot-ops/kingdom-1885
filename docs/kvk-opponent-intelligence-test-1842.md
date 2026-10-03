# Nexus App — KvK Opponent Intelligence test: Kingdom #1842

**Status:** isolated test only · no live Nexus App changes  
**Date:** 03.10.2026

## Why this test
Use a real, publicly indexed kingdom to find out which fields can be filled without screenshots and which still require in-game evidence.

## Publicly available now
Kingdom #1842 is well indexed publicly. We can obtain:
- total kingdom power, governors, mapped/active players and alliance count
- 7-day/30-day momentum
- Top-100 aggregate Governor Power, Troop Power, Hero Power/Equipment, Pet Power, Governor Gear, Charms, Building and Research power
- Top-100 Mystic Trial aggregate
- TG1–TG5 distribution
- KvK history
- top-player Total Power, TG level and alliance for at least the top 20
- major alliance power/member structure

## Example values from the test
- Total kingdom power: **46.08B**
- Active 7d: **949 / 1,335 mapped (65.6%)**
- Top-100 Governor Power: **15.39B**
- Top-100 Troop Power: **9.11B**
- Top-100 Mystic Trial aggregate: **109K**
- TG5: **13**, TG4: **28**, TG3: **77**
- Top player: **Lord Z [FFS], TG5, 459M Total Power**
- Top 5 Total Power sum: **1.585B**
- Top 10 Total Power sum: **2.742B**
- Top 20 Total Power sum: **4.593B**

## What this means for our planned Head-to-Head
Public data is already enough for:
- kingdom-level strength profile
- TG depth
- activity/momentum
- KvK history
- alliance concentration of high-power players
- initial whale screening

It is **not** enough for a reliable player-level True Power comparison. Public sources do not consistently expose, for the exact same top players:
- individual Mystic Trial totals
- Governor Gear
- Governor Charms
- Research
- Hero/Hero Gear
- Pet Power
- verified rally-lead role / garrison capability

Therefore the final Nexus App workflow should be:
1. Load public kingdom data first.
2. Identify only the 3–10 players that matter.
3. Ask for targeted in-game screenshots for the missing permanent-power fields.
4. Run K1885 vs opponent Head-to-Head only when the minimum data coverage is met.

## Design consequence
Keep **Kingdom Profile** and **Player True Power** separate:
- Kingdom Profile may be largely automated from public data.
- Player True Power / Mega-Whale Watch must show **data missing** rather than estimate.
- Total Power may trigger a candidate for deeper inspection, but must not be treated as True Power.

## Test verdict
The approach works and should substantially reduce screenshots. The public layer can pre-fill most kingdom context; screenshots should be reserved for a small number of high-impact players.
