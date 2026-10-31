import {test} from 'node:test';
import assert from 'node:assert/strict';
import {formatPlayerNumber,formatPlayerUtc,formatPlayerSection,playerLookupError} from '../preview/transfer-id-display-20261030.js';
test('power and rank formatting preserves zero, groups whole numbers, rejects unknowns',()=>{
 assert.equal(formatPlayerNumber(232228946),'232,228,946');assert.equal(formatPlayerNumber('1561'),'1,561');assert.equal(formatPlayerNumber(0),'0');
 for(const x of [null,undefined,'',NaN,Infinity,-1,{},'unknown'])assert.equal(formatPlayerNumber(x),'Not available');
});
test('provider Unix seconds, milliseconds and ISO are displayed in explicit UTC',()=>{
 const expected='2026-10-30 · 20:32:04 UTC';
 for(const value of [1793392324.6892564,'1793392324.6892564',1793392324689,'2026-10-30T20:32:04.689Z','2026-10-30T21:32:04.689+01:00'])assert.equal(formatPlayerUtc(value),expected);
});
test('missing or invalid source dates never display a fabricated capture date',()=>{
 for(const value of [null,undefined,'','not a date','2026-10-30T20:32:04',{},-1,Infinity,1e30])assert.equal(formatPlayerUtc(value),'Not available');
});
test('known section states translated and unknown states remain unconfirmed',()=>{
 assert.equal(formatPlayerSection('available'),'Available');assert.equal(formatPlayerSection('empty'),'No entries');assert.equal(formatPlayerSection('missing'),'Not available');assert.equal(formatPlayerSection('new-provider-state'),'Unconfirmed');
});
test('not found, access, quota and upstream errors have distinct explanations',()=>{
 const statuses=[401,403,404,429,502,503,504];assert.equal(new Set(statuses.map(playerLookupError)).size,statuses.length);assert.match(playerLookupError(404),/No player/);assert.match(playerLookupError(429),/quota/);assert.match(playerLookupError(500),/500/);
});

test('newer player standings are not replaced by older kingdom board captures and missing is never zero',async()=>{
 const {playerRankingMap,playerRankingRows}=await import('../preview/transfer-id-display-20261030.js');
 const values={power:200,power_rank:5,player_captured_at:'2026-10-31T02:00:00Z',leaderboards:[{name:'personal_power',value:100,kingdom_rank:8,captured_at:'2026-10-30T02:00:00Z'}],boards:[{name:'pet_power',status:'not_listed'}]};
 assert.equal(playerRankingMap(values).personal_power.value,200);assert.match(playerRankingRows(values).find(x=>x[0]==='Pet Power')[1],/Not listed/);
});
