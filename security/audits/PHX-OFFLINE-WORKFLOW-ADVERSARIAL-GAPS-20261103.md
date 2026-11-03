# PHALANX – adversarial review of offline binding simulator

Date: 2026-11-03. Three characterization tests passed; they demonstrate three UNSAFE properties of the offline model, not production exploits.

1. Caller-provided actorRole allows model-only admin impersonation. The actual Edge Function v7 was previously observed to validate membership server-side.
2. Caller-provided ownerId allows model-only owner reset when an incorrect owner ID is passed. Actual Edge Function v7 has a server-side owner UUID guard.
3. Object.freeze on a binding record does not prevent replacement of the Map entry; after replacing both binding and request fields, the offline model accepts the changed target. A protected database mapping with independently controlled write privileges is required.

The previous 16/16 workflow tests did not prove these boundaries. Do not deploy the simulator. Production remains unchanged. Next gate: use verified session claims, trusted owner ID, protected binding storage and end-to-end role tests in an isolated backend, with no additional costs or production mutations without approval.
