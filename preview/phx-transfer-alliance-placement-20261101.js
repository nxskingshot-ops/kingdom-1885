// Historical alliance power placement, not a current combat-role assessment.
export function placeInAlliance(candidatePower, roster=[], snapshotDate=''){
 const power=Number(candidatePower);
 if(candidatePower==null||candidatePower===''||!Number.isFinite(power)||power<0)return {status:'MISSING_POWER'};
 const values=roster.filter(p=>p?.power!=null&&p.power!=='').map(p=>Number(p.power)).filter(n=>Number.isFinite(n)&&n>=0);
 if(values.length<15)return {status:'INSUFFICIENT_ROSTER',count:values.length};
 const higher=values.filter(n=>n>power).length;
 const tied=values.filter(n=>n===power).length;
 return {status:'HISTORICAL_POWER_PLACEMENT',rankMin:higher+1,rankMax:higher+Math.max(1,tied),top15Guaranteed:higher+Math.max(1,tied)<=15,top15Possible:higher+1<=15,rosterSize:values.length,snapshotDate,metric:'Total Power',note:'Hypothetical insertion into a dated roster; not current power, True Power, battle strength or invitation eligibility.'};
}
