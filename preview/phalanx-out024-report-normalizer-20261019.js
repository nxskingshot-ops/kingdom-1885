/* OUT-024 read-only normalization. No network, storage or credential access. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PhalanxOut024Normalize=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function normalize(rows){
 if(!Array.isArray(rows)||rows.length>1000)throw Error('Expected at most 1000 rows');
 const seen=new Set();
 return rows.map((r,i)=>{
  if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Invalid row '+(i+1));
  const id=r.source_key,alliance=r.alliance,x=r.coord_x,y=r.coord_y;
  if(typeof id!=='string'||!id.trim()||id.length>80||seen.has(id))throw Error('Invalid/duplicate source_key at '+(i+1));
  if(typeof alliance!=='string'||!alliance.trim()||alliance.length>80)throw Error('Invalid alliance at '+(i+1));
  if(typeof x!=='number'||typeof y!=='number'||!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>1199||y<0||y>1199)throw Error('Invalid coordinates at '+(i+1));
  seen.add(id);
  const quadrant=x<600?(y<600?'N':'W'):(y<600?'O':'S');
  return {id,alliance:alliance.trim(),quadrant};
 });
}
return Object.freeze({normalize});
});
