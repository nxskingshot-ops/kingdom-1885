(() => {
  'use strict';
  const core = window.PHXWarAcademyCore;
  const labels = { infantry: 'Infantry', cavalry: 'Cavalry', archers: 'Archers' };

  function render(section, profile, message, rankedTownCenter) {
    const result = core.assess(profile, null, null);
    const title = document.createElement('h3');
    title.textContent = 'War Academy · T11 Intelligence';
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.textContent = profile ? 'MightPulse · Player ID ' + profile.playerId
      + (profile.capturedAt ? ' · ' + profile.capturedAt : '') : message;

    const rows = [
      ['Town Center', rankedTownCenter ?? result.townCenter],
      ['War Academy', result.warAcademy],
      ...core.BRANCHES.map(branch => ['T11 ' + labels[branch], result.t11[branch].status])
    ];
    const facts = document.createElement('dl');
    for (const [label, value] of rows) {
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = !value || value === 'unknown' ? 'UNKNOWN' : value;
      facts.append(term, detail);
    }
    section.classList.add('phx-war-academy-readiness');
    section.setAttribute('aria-label', 'War Academy Intelligence');
    section.replaceChildren(title, status, facts);
    return section;
  }

  window.PHXWarAcademyView = Object.freeze({
    render,
    fromTransfer(payload, id, castle) {
      const profile = core.normalizeTransferProfile(payload, id);
      // Existing Transfer normalization applies the verified Castle/Truegold mapping.
      const rankCapture = core.normalizeCaptureTime(castle?.captured_at);
      const rankedTownCenter = profile && rankCapture && castle.value != null && castle.source !== 'saved_snapshot'
        ? castle.text + ' · ' + rankCapture : null;
      return render(document.createElement('section'), profile, 'Verified player data unavailable.', rankedTownCenter);
    }
  });
})();
