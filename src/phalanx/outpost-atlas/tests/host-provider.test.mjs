import test from 'node:test';
import assert from 'node:assert/strict';
import {loadAuthorizedOutposts} from '../core/provider.js';

const row={id:'op-1',source_key:'verified',alliance:'NXS',structure_type:'outpost',coord_x:200,coord_y:300,level:1};
function setup({local,host,sameOrigin=true}={}){
 const frame={location:{origin:'https://phalanx.invalid'}};
 if(local)frame.PHALANX_OUTPOST_DATA_PROVIDER=local;
 const parent={location:{origin:sameOrigin?'https://phalanx.invalid':'https://other.invalid'}};
 if(host)parent.PHALANX_OUTPOST_DATA_PROVIDER=host;
 frame.parent=parent;
 globalThis.window=frame;
}
test('host provider is reused in same-origin R11 frame',async()=>{
 setup({host:async()=>({rows:[row]})});
 assert.deepEqual(await loadAuthorizedOutposts(),[row]);
});
test('local provider takes priority over host provider',async()=>{
 setup({local:async()=>[row],host:async()=>{throw Error('host must not run')}});
 assert.equal((await loadAuthorizedOutposts()).length,1);
});
test('missing provider fails closed',async()=>{
 setup();await assert.rejects(loadAuthorizedOutposts(),/Kein freigegebener Datenanbieter/);
});
test('cross-origin host provider is not trusted',async()=>{
 setup({host:async()=>[row],sameOrigin:false});
 await assert.rejects(loadAuthorizedOutposts(),/Kein freigegebener Datenanbieter/);
});
test('invalid provider payload is rejected',async()=>{
 setup({host:async()=>[{...row,coord_x:9999}]});
 await assert.rejects(loadAuthorizedOutposts(),/Invalid coord_x/);
});
test('provider exceptions are not converted into fake data',async()=>{
 setup({host:async()=>{throw Error('denied')}});
 await assert.rejects(loadAuthorizedOutposts(),/denied/);
});
