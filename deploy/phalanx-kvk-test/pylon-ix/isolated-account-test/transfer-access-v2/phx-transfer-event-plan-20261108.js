export const transferPlanKey = 'phx-transfer-event-plan-v1';
export const transferPlanUpdated = 'phx:event-context-updated';

export function readTransferPlan() {
 try {
  const plan = JSON.parse(localStorage.getItem(transferPlanKey) || 'null');
  return plan && typeof plan === 'object' && !Array.isArray(plan) ? plan : null;
 } catch {
  return null;
 }
}

export function describeTransferPlan(plan) {
 if (!plan) return '';
 const positiveInteger = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
 const {phxEventGroup: group, phxTargetKingdom: target, phxEventCap: cap, phxGroupMin: from, phxGroupMax: to,
  phxEventStart: start, phxEventEnd: end} = plan;
 const parts = [];
 if (positiveInteger(group)) parts.push('Group ' + Number(group));
 if (positiveInteger(from) && positiveInteger(to) && Number(from) <= Number(to)) parts.push('Kingdoms #' + Number(from) + '–#' + Number(to));
 if (positiveInteger(target)) parts.push('Target #' + Number(target));
 if (Number.isFinite(Number(cap)) && Number(cap) > 0) {
  parts.push('Max. Transfer Power ' + Number(cap).toLocaleString('en-US', {maximumFractionDigits: 6}) + ' M');
 }
 if (start && end) parts.push(start + ' to ' + end);
 else if (start) parts.push('From ' + start);
 else if (end) parts.push('Until ' + end);
 return parts.join(' · ');
}
