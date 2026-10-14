/* Isolated PHALANX Monte Carlo worker prototype. Not production. */
importScripts('../src/phalanx-monte-carlo-v2.js');
self.onmessage = function(event) {
  const data = event.data || {};
  const id = data.id;
  try {
    const opts = data.options;
    if (!opts || !Array.isArray(opts.skills)) throw Error('Missing simulation options');
    const independent = self.PhalanxMonteCarlo.simulate({...opts, dependence:'independent'});
    const shared = self.PhalanxMonteCarlo.simulate({...opts, dependence:'shared'});
    self.postMessage({id, ok:true, independent, shared});
  } catch (error) {
    self.postMessage({id, ok:false, error:String(error && error.message || error)});
  }
};
