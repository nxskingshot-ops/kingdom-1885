import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'index.html'),'utf8');
for(const path of ['map.css','map-core.js','map-layout.js','assets/image-fd776b6be275a07b.jpg']){
 assert.ok(existsSync(resolve(root,path)),`Missing ${path}`);
 assert.ok(html.includes(path),`HTML missing reference ${path}`);
}
const core=readFileSync(resolve(root,'map-core.js'),'utf8');
assert.ok(core.includes('./core/provider.js'));
assert.ok(existsSync(resolve(root,'core/provider.js')));
assert.ok(existsSync(resolve(root,'core/data-contract.js')));
assert.ok(!core.includes('supabase.co'));
assert.ok(html.includes('Outpost Atlas'));

// Validate every static DOM lookup used by the map logic against the real HTML.
const referencedIds=[...core.matchAll(/\$\('([a-zA-Z][\w-]*)'\)/g)].map(m=>m[1]);
for(const id of new Set(referencedIds)){
 assert.ok(html.includes('id="'+id+'"'),`Map logic references missing HTML element #${id}`);
}
assert.ok(core.includes('loadAuthorizedOutposts()'),'Authorized data provider must be used');
console.log('PASS: Outpost Atlas module references, DOM elements and provider isolation');
