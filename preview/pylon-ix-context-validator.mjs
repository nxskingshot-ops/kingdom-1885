// PYLON IX isolated, deterministic, read-only context validator.
// No network, storage, secrets or production modules.
export const MODULES = Object.freeze([
  "kvk-prep", "alliance-comparison", "outpost-intelligence", "account-intelligence"
]);
export const SCHEMA = "pylon.module-context.v0";
const MAX_FACTS = 100;
const MAX_TEXT = 1000;

export function validateContext(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {ok:false,reason:"invalid-context"};
  if (raw.schema_version !== SCHEMA) return {ok:false,reason:"unsupported-schema"};
  if (!MODULES.includes(raw.module)) return {ok:false,reason:"unsupported-module"};
  if (raw.source !== "existing-phalanx-module") return {ok:false,reason:"invalid-source"};
  if (!["not-connected","verified","stale"].includes(raw.data_status)) return {ok:false,reason:"invalid-status"};
  if (!Array.isArray(raw.facts) || raw.facts.length > MAX_FACTS) return {ok:false,reason:"invalid-facts"};
  if (!Array.isArray(raw.warnings) || !Array.isArray(raw.provenance)) return {ok:false,reason:"invalid-metadata"};
  if (typeof raw.scope !== "string" || raw.scope.length > 100) return {ok:false,reason:"invalid-scope"};
  if (raw.data_status === "verified") {
    if (!raw.verified_at || Number.isNaN(Date.parse(raw.verified_at))) return {ok:false,reason:"missing-verification"};
    if (raw.scope === "none") return {ok:false,reason:"missing-scope"};
  }
  for (const fact of raw.facts) {
    if (!fact || typeof fact !== "object" || typeof fact.label !== "string" || !fact.label.trim() || fact.label.length > MAX_TEXT || !["string","number","boolean"].includes(typeof fact.value)) return {ok:false,reason:"invalid-fact"};
    if (typeof fact.value === "number" && !Number.isFinite(fact.value)) return {ok:false,reason:"invalid-number"};
    if (typeof fact.value === "string" && fact.value.length > MAX_TEXT) return {ok:false,reason:"oversized-value"};
  }
  if (raw.data_status !== "verified" && raw.facts.length) return {ok:false,reason:"unverified-facts"};
  return {ok:true,reason:null};
}
export function summarizeContext(raw) {
  const check=validateContext(raw);
  if (!check.ok) return {status:"error",text:"Keine verlässlichen Daten verfügbar.",reason:check.reason};
  if (raw.data_status !== "verified") return {status:"unavailable",text:"Keine aktuellen, verifizierten Daten verfügbar.",reason:raw.data_status};
  return {status:"verified",text:raw.facts.length ? raw.facts.map(f=>`${f.label}: ${String(f.value)}`).join("\n") : "Verifiziert, aber keine Fakten übergeben.",verified_at:raw.verified_at};
}
