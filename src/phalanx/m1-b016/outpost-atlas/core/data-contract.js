export const OUTPOST_SCHEMA_VERSION='1.0.0';
const validText=x=>typeof x==='string'&&x.length>0&&x.length<=128;
export function validateOutposts(rows){
 if(!Array.isArray(rows))throw Error('Outpost payload must be an array');
 if(rows.length>10000)throw Error('Outpost payload exceeds safety limit');
 const ids=new Set();
 return rows.map((r,i)=>{
  if(!r||typeof r!=='object'||Array.isArray(r))throw Error(`Invalid row ${i}`);
  for(const k of ['id','source_key','alliance','structure_type'])if(!validText(r[k]))throw Error(`Invalid ${k} at row ${i}`);
  if(ids.has(r.id))throw Error(`Duplicate ID ${r.id}`);ids.add(r.id);
  for(const k of ['coord_x','coord_y'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>1199)throw Error(`Invalid ${k} at row ${i}`);
  if(!Number.isInteger(r.level)||r.level<0||r.level>100)throw Error(`Invalid level at row ${i}`);
  return Object.freeze({id:r.id,source_key:r.source_key,alliance:r.alliance,structure_type:r.structure_type,coord_x:r.coord_x,coord_y:r.coord_y,level:r.level});
 });
}
