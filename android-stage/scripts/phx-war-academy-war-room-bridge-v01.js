(() => {
  'use strict';
  const core = window.PHXWarAcademyCore;
  const view = window.PHXWarAcademyView;
  const development = document.querySelector('#phx-r8-war details[data-panel="development"]');
  if (!development) return;

  const content = document.createElement('section');
  development.append(content);
  const clear = () => view.render(content, null, 'Awaiting verified player data.');
  clear();
  document.addEventListener('phx:own-profile-verified', event => {
    view.render(content, core.normalizeProfile(event.detail), 'Verified player data unavailable.');
  });
  document.addEventListener('phx:own-profile-cleared', clear);
})();
