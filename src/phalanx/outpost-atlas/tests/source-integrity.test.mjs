import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const expected={
 'index.html':'113caa4e10ea8cb6ad5c89c57f94f26ef2405a1ba00e9a505c1bdf59169ccc0c',
 'map-core.js':'658864339a773cbfee3dae6e4075470854db6cbf9af125c540b9403e4029d4e8',
 'map-layout.js':'88ff306fafa7516b3e199ee4f7841eca73c59e408191da9c813ee8ca5e6ef84e',
 'map.css':'fcdbb8d1c4f49fa2b2eb482be21140096a04d7c394027068a09ea2fb1a0a8ea3',
 'assets/image-117d0614cb0aa2fc.jpg':'117d0614cb0aa2fc0250b4e6189528c7bb0d76151c0c14cd3b228a79e48ecc1c',
 'assets/image-b82a95f2cba1bb85.jpg':'b82a95f2cba1bb85c2b35478aaf1559e31d94da565e45aabcf70f19b83e3c045',
 'assets/image-fd776b6be275a07b.jpg':'fd776b6be275a07b8ec3ca27c1d56fb35ce916c216b78d424d5d624616b2ea6c'
};
for(const [path,hash] of Object.entries(expected)){
 const file=resolve(root,path);
 assert.ok(existsSync(file),`Missing ${path}`);
 assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,`Changed ${path}; update manifest only after reviewed change`);
}
console.log('PASS: seven canonical Outpost Atlas source/assets checksums');
