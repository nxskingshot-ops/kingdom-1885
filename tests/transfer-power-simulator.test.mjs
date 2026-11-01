import { simulateTransferPower } from '../preview/phx-transfer-power-simulator-20261101.js';
import assert from 'node:assert/strict';
assert.equal(simulateTransferPower({currentTransferPowerM:220,hypotheticalReductionM:25}).status,'NEEDS_VERIFICATION');
assert.equal(simulateTransferPower({currentTransferPowerM:220,hypotheticalReductionM:25,confirmedCapM:200,capVerified:true}).belowCapInScenario,true);
assert.equal(simulateTransferPower({currentTransferPowerM:220,hypotheticalReductionM:10,confirmedCapM:200,capVerified:true}).belowCapInScenario,false);
assert.equal(simulateTransferPower({currentTransferPowerM:220,hypotheticalReductionM:250}).status,'INVALID_INPUT');
assert.equal(simulateTransferPower({currentTransferPowerM:220,hypotheticalReductionM:25,confirmedCapM:200,capVerified:false}).status,'NEEDS_VERIFICATION');
console.log('5 transfer scenario assertions passed');
