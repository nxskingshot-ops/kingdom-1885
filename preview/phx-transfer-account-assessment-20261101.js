// Read-only account summary. Never infer battle roles from raw power alone.
export function assessAccount(player = {}) {
  const keys = [['Hero Power','heroPower','hero_power'],['Pet Power','petPower','pet_power'],['Master Power','masterPower','master_power'],['True Power','truePower','true_power']];
  const available = keys.map(([label,a,b]) => ({label, raw:player[a] ?? player[b]})).filter(x=>x.raw!==null && x.raw!==undefined && x.raw!=='' && Number.isFinite(Number(x.raw)) && Number(x.raw)>=0);
  return {
    status: available.length >= 2 ? 'PARTIAL' : 'INSUFFICIENT_DATA',
    headline: available.length >= 2 ? 'Account overview · preliminary' : 'Account overview · awaiting data',
    detail: available.length >= 2 ? 'Available metrics are displayed, but strengths, weaknesses, battle roles and Top-15 placement require verified comparable player data.' : 'Not enough verified metrics for an account assessment.',
    available: available.map(x=>x.label),
    battleRole: 'Not verified',
    top15Placement: 'Not verified'
  };
}
