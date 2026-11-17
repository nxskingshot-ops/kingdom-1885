/* PHALANX War Academy bridge v0.1 - isolated War Room extension.
 * Requires PHXWarAcademyCore. Does not query APIs or alter HOME.
 * Receives only authorized backend profile payload through phx:own-profile-verified.
 */
(() => {
  'use strict';
  const core = window.PHXWarAcademyCore;
  const development = document.querySelector('#phx-r8-war details[data-panel="development"]');
  if (!core || !development || development.dataset.waBridge === 'yes') return;
  development.dataset.waBridge = 'yes';
  const content = document.createElement('section');
  content.className = 'phx-war-academy-readiness';
  content.setAttribute('aria-label', 'War Academy Intelligence');
  const heading = document.createElement('h3');
  heading.textContent = 'WAR ACADEMY · T11 INTELLIGENCE';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.textContent = 'Sign in to load verified player information.';
  const town = document.createElement('p');
  const academy = document.createElement('p');
  const troops = document.createElement('ul');
  const labels = {infantry:'Infantry',cavalry:'Cavalry',archers:'Archers'};
  content.append(heading,status,town,academy,troops);
  development.append(content);
  function clear(message) {
    status.textContent = message;
    town.textContent = 'Town Center: Unknown';
    academy.textContent = 'War Academy: Unknown · not supplied by the player API';
    troops.replaceChildren();
    for (const branch of core.BRANCHES) {
      const li = document.createElement('li');
      li.textContent = labels[branch] + ': Unknown · no verified research data';
      troops.append(li);
    }
  }
  clear('Awaiting authorized player data.');
  document.addEventListener('phx:own-profile-verified', event => {
    const profile = core.normalizeProfile(event.detail);
    if (!profile) return clear('Verified player data unavailable.');
    const result = core.assess(profile, null, null);
    status.textContent = 'Verified player: ' + (profile.name || profile.playerId) + ' · #' + profile.kingdom;
    town.textContent = 'Town Center: ' + (result.townCenter || 'Unknown · API field not confirmed');
    academy.textContent = 'War Academy: Unknown · not supplied by the player API';
    troops.replaceChildren();
    for (const branch of core.BRANCHES) {
      const li = document.createElement('li');
      li.textContent = labels[branch] + ': Unknown · not supplied by the player API';
      troops.append(li);
    }
  });
  document.addEventListener('phx:own-profile-cleared', () => clear('Sign in to load verified player information.'));
})();
