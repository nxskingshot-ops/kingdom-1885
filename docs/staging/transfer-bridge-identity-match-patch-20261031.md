# Transfer Bridge — identity-safe ranking match correction (31.10.2026)

Status: STAGING PATCH PREPARED, NOT DEPLOYED. Existing edge function v7 unchanged.

## Verified source condition
`board.rows.find(e=>e?.kid===p.kid&&String(e.uid)===String(d.uid)&&(e.governor_id==null||String(e.governor_id)===id))`

The player record's `p.kid` is validated as a safe integer. The leaderboard `e.kid` type is not validated before strict comparison. If the upstream response contains the same kingdom ID as a numeric string, the match fails and a listed player is incorrectly shown as `not_listed`.

## Minimal patch proposal
Replace only the `kid` comparison with a safe, canonical decimal representation:

```js
const sameKingdom=e=>{
 const value=e?.kid;
 return (typeof value==='number'&&Number.isSafeInteger(value)&&value===p.kid)||
        (typeof value==='string'&&/^[1-9][0-9]*$/.test(value)&&value===String(p.kid));
};
const found=board.rows.find(e=>sameKingdom(e)&&String(e.uid)===String(d.uid)&&(e.governor_id==null||String(e.governor_id)===id));
```

Preserve UID match and optional governor ID match. Reject noncanonical kingdom strings and noninteger numbers. Do not match by name. This is a *possible* cause, not proof that the live API sends numeric strings.

## Required tests before edge deployment
- Positive: number `1885`, string `'1885'` with matching UID and governor ID.
- Negative: `'01885'`, `'1885.0'`, `1886`, `null`, wrong UID, wrong governor ID, invalid board rows.
- Check observed upstream `kid` type on a redacted real payload; compare listed/not_listed results.
- Confirm Auth, CORS, quota, error paths, data freshness, mobile and existing regression checks.

No SQL migration, no player data edits, no changes to protected functions or production.