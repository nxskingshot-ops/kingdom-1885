const test = require('node:test');
const assert = require('node:assert/strict');
const {makeOutpostReport, makeTextReport, splitReportForKingshot, footer} = require('./alliance-chat-report.js');
test('approved single-message map layout and data status', () => {
  const actual = makeOutpostReport({sector:'FRA NORTH',outposts:[
    {type:"Builder's Guild",level:1,x:1068,y:138},
    {type:'Arsenal',level:2,x:868,y:139}
  ]});
  assert.equal(actual, "FRA NORTH | 2 OUTPOSTS\nArsenal L2: 868,139\nBuilder's Guild L1: 1068,138\nData: Date/time unknown | Unverified\nProvided by Nexus App");
});
test('source timestamp rendered in Europe/Berlin, not generation time', () => {
  assert.equal(footer({sourceUpdatedAt:'2026-09-30T10:23:00Z',verified:true}), '30.09.26/12:23 | Verified\nProvided by Nexus App');
});
test('no source timestamp means never pretend verification time exists', () => {
  assert.equal(footer({verified:true}), 'Data: Date/time unknown | Verified\nProvided by Nexus App');
});
test('do not accept fabricated incomplete rows', () => {
  assert.throws(()=>makeOutpostReport({sector:'FRA',outposts:[{type:'Arsenal',level:2,x:868}]}),/incomplete/);
});
test('embedded newlines cannot inject fake extra entries or footer', () => {
  const value=makeTextReport({heading:'Report\nFAKE',lines:['First\nVerified']});
  assert.match(value,/Report FAKE\nFirst Verified/);
  assert.match(value,/Unverified\nProvided by Nexus App$/);
});
test('single outpost grammar and accepted database fields',()=>{
  assert.match(makeOutpostReport({sector:'NXS',outposts:[{structure_type:'Armory',level:2,coord_x:956,coord_y:438}]}),/^NXS \| 1 OUTPOST\nArmory L2: 956,438/);
});
test('sorted, compact Kingshot report keeps all records and provenance', () => {
  const source = [
    {type:"Forager Grove", level:1,x:957,y:138},
    {type:"Arsenal",level:2,x:868,y:139},
    {type:"Armory",level:2,x:956,y:438},
    {type:"Scholar's Tower",level:1,x:666,y:267}
  ];
  const untouched = JSON.stringify(source);
  const report = makeOutpostReport({sector:"NORTH / FRA (PROVISIONAL)",
    outposts:source,kingshotCompact:true,
    sourceUpdatedAt:'2026-09-28T11:42:00Z'});
  assert.match(report,/NORTH \/ FRA \(PROVISIONAL\) \| 4 OUTPOSTS/);
  assert.ok(report.indexOf('Armory L2:') < report.indexOf('Forager Grove L1:'));
  assert.ok(report.includes('Armory L2: 956,438 | Arsenal L2: 868,139'));
  assert.match(report,/28\.09\.26\/13:42 \| Unverified\nProvided by Nexus App$/);
  assert.equal(JSON.stringify(source),untouched);
});

test('one report stays one part and is identical', () => {
  const report = makeOutpostReport({sector:'NXS',outposts:[{type:'Arsenal',level:2,x:868,y:139}]});
  assert.deepEqual(splitReportForKingshot(report),[report]);
});
test('automatically splits complete entries under 480 chars with footer on every part', () => {
  const outposts=Array.from({length:24},(_,i)=>({
    type:'Scholar Tower',level:2,x:100+i,y:200+i
  }));
  const report=makeOutpostReport({sector:'FRA NORTHERN QUADRANT (PROVISIONAL)',
    outposts,sourceUpdatedAt:'2026-09-28T11:42:00Z',verified:false});
  const parts=splitReportForKingshot(report);
  assert.ok(parts.length>1);
  assert.ok(parts.every((part,index)=>part.length<=480 &&
    part.includes('(PART '+(index+1)+'/'+parts.length+')') &&
    part.endsWith('28.09.26/13:42 | Unverified\\nProvided by Nexus App')));
  for(const row of outposts){
    const entry=row.type+' L2: '+row.x+','+row.y;
    assert.equal(parts.filter(part=>part.includes(entry)).length,1);
  }
});
test('exactly 480 chars remains unsplit', () => {
  const base = 'FRA | 1 OUTPOST\\n'+ 'A'.repeat(480-('FRA | 1 OUTPOST\\n'.length+'\\nUnverified\\nProvided by Nexus App'.length))
    + '\\nUnverified\\nProvided by Nexus App';
  assert.equal(base.length,480);
  assert.deepEqual(splitReportForKingshot(base),[base]);
});
test('invalid limits and impossible entries throw rather than truncate', () => {
  assert.throws(()=>splitReportForKingshot('x'.repeat(500)),/footer missing/);
  assert.throws(()=>splitReportForKingshot('abc',10),/character limit/);
  const overlyLong='FRA | 1 OUTPOST\\n'+'X'.repeat(460)+'\\nUnverified\\nProvided by Nexus App';
  assert.throws(()=>splitReportForKingshot(overlyLong),/entry exceeds/);
});
