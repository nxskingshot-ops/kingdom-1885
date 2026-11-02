// PHALANX isolated read-only event contract v1; no production integration.
export const EVIDENCE = Object.freeze({CONFIRMED:'CONFIRMED',PROVISIONAL:'PROVISIONAL',UNKNOWN:'UNKNOWN'});
const integer = v => v !== '' && v != null && Number.isSafeInteger(Number(v)) && Number(v)>0 ? Number(v) : null;
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v+'T00:00:00Z')) && new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v ? v : null;
export function normalizeEventContext(raw={}, evidence={}) {
  const start=date(raw.phxEventStart), end=date(raw.phxEventEnd);
  const cap=raw.phxEventCap!=='' && raw.phxEventCap!=null && Number.isFinite(Number(raw.phxEventCap)) && Number(raw.phxEventCap)>0 ? Number(raw.phxEventCap) : null;
  const group=integer(raw.phxEventGroup);
  const range=group===7 ? {from:1690,to:1935,status:EVIDENCE.PROVISIONAL} : null;
  const capStatus=cap===null ? EVIDENCE.UNKNOWN : raw.phxEventCapVerified===true && evidence.capSource && date(evidence.capVerifiedAt) && evidence.trustedVerification===true ? EVIDENCE.CONFIRMED : EVIDENCE.PROVISIONAL;
  return {version:1,window:{start,end,status:start&&end&&end>=start?EVIDENCE.PROVISIONAL:EVIDENCE.UNKNOWN},destinationKingdom:integer(raw.phxTargetKingdom)??1885,group:{number:group,range,status:range?EVIDENCE.PROVISIONAL:EVIDENCE.UNKNOWN},powerCap:{million:cap,status:capStatus,source:evidence.capSource??null,verifiedAt:evidence.capVerifiedAt??null},origin:'device-local-plan',eligibility:'NOT_DETERMINED'};
}
export function normalizeRankingEvidence(raw={}) {
  const rank=integer(raw.kingdom_rank);
  return {rank,status:rank&&raw.source&&raw.captured_at?EVIDENCE.CONFIRMED:rank?EVIDENCE.PROVISIONAL:EVIDENCE.UNKNOWN,source:raw.source??null,capturedAt:raw.captured_at??null};
}
