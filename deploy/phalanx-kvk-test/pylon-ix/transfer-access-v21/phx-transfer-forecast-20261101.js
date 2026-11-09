// Community planning forecast. Not official transfer eligibility.
export const forecast = Object.freeze({status:'forecast',kingdom:1885,group:7,range:[1690,1935],ordinaryReferenceM:200,leadingReferenceM:130,window:'8–14 November 2026',source:'https://kingshot.net/transfer-history',checked:'2026-11-01'});
export function transferStatus(confirmedRules){return confirmedRules?.status==='confirmed'?'Requires in-game eligibility verification':'Insufficient information — forecast only';}
