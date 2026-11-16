(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const war = byId('phx-r8-war');
  const cards = byId('phx-r8-war-cards');
  const back = byId('phx-r8-war-back');
  const settings = byId('phx-r10-settings');
  const head = war?.querySelector('.wr-head');
  if (!head || !cards || !back || !settings || war.dataset.v2Integrated === 'yes') return;

  war.dataset.v2Integrated = 'yes';
  war.classList.add('phx-war-v2');
  war.querySelector('.wr-intro').hidden = true;
  war.querySelector('.wr-note').hidden = true;

  const toolbar = document.createElement('div');
  toolbar.className = 'phx-w2-toolbar';
  head.before(toolbar);
  toolbar.append(back);
  head.classList.add('phx-w2-hero', 'phx-w2-art');
  head.firstElementChild.classList.add('phx-w2-visually-hidden');
  head.querySelector('.wr-title').setAttribute('role', 'heading');
  head.querySelector('.wr-title').setAttribute('aria-level', '1');

  const profile = document.createElement('section');
  profile.className = 'phx-w2-profile phx-w2-art';
  profile.setAttribute('aria-label', 'Commander Profile');
  profile.innerHTML = `
    <h2 class="phx-w2-visually-hidden">Commander Profile</h2>
    <span class="phx-w2-visually-hidden">Live data pending</span>
    <img class="phx-w2-avatar" alt="Commander avatar" hidden>
    <strong class="phx-w2-value phx-w2-name" data-w2-name></strong>
    <span class="phx-w2-value phx-w2-level"><span class="phx-w2-visually-hidden">Level </span><span data-w2-level></span></span>
    <span class="phx-w2-value phx-w2-alliance"><span class="phx-w2-visually-hidden">Alliance </span><span data-w2-alliance></span></span>
    <span class="phx-w2-value phx-w2-kingdom"><span class="phx-w2-visually-hidden">Kingdom </span><span data-w2-kingdom></span></span>
    <span class="phx-w2-visually-hidden">Player ID and last update unavailable.</span>
    <span class="phx-w2-visually-hidden">Power: <span data-w2-power>Data pending</span></span>
  `;
  head.after(profile);

  const sections = document.createElement('div');
  sections.className = 'phx-w2-sections';
  const panels = [
    ['account', 'ACCOUNT INTELLIGENCE', 'Current assessment, strengths & weaknesses', 'Verified account assessment unavailable.'],
    ['alliance', 'ALLIANCE POSITION', 'Your position in alliance', 'Verified alliance placement unavailable.'],
    ['development', 'PLAYER DEVELOPMENT', 'Progress and changes over time', 'Verified progress history unavailable.']
  ];
  for (const [kind, title, description, empty] of panels) {
    const details = document.createElement('details');
    details.className = 'phx-w2-tile';
    details.dataset.panel = kind;
    const summary = document.createElement('summary');
    summary.className = 'phx-w2-art';
    const label = document.createElement('span');
    label.className = 'phx-w2-visually-hidden';
    label.textContent = title + ' — ' + description;
    summary.append(label);
    const content = document.createElement('p');
    content.textContent = empty;
    details.append(summary, content);
    sections.append(details);
  }
  profile.after(sections);

  const command = document.createElement('section');
  command.className = 'phx-w2-command phx-w2-art';
  command.setAttribute('aria-label', 'Command Access');
  command.innerHTML = '<h2 class="phx-w2-visually-hidden">Command Access</h2>';
  sections.after(command);
  const shortcutSettings = document.createElement('details');
  shortcutSettings.className = 'phx-w2-editor phx-w2-shortcut-settings';
  shortcutSettings.innerHTML = '<summary>Configure shortcuts</summary>';
  shortcutSettings.append(cards);
  command.after(shortcutSettings);

  const shortLabels = { territory: 'Territory', map: 'Outpost Map', report: 'Reports', pylon: 'PYLON IX' };
  for (const card of cards.querySelectorAll('.wr-card')) {
    const select = card.querySelector('select');
    const button = card.querySelector('button');
    button.classList.add('phx-w2-shortcut');
    button.addEventListener('click', event => {
      if (select.value !== 'pylon') return;
      // Use the module's opener so the dialog records the current history entry.
      event.stopImmediatePropagation();
      const previousUrl = location.href;
      byId('phx-pylon-open').click();
      // The opener uses pushState. Notify the existing view listeners.
      if (location.href !== previousUrl) {
        window.dispatchEvent(new HashChangeEvent('hashchange', {
          oldURL: previousUrl,
          newURL: location.href
        }));
      }
    }, { capture: true });
    const label = document.createElement('span');
    button.replaceChildren(label);
    command.append(button);

    const refresh = () => {
      const target = select.selectedOptions[0];
      label.textContent = shortLabels[select.value] ?? target.textContent;
      button.setAttribute('aria-label', target.textContent);
    };
    select.addEventListener('change', refresh);
    refresh();
  }

  const edit = document.createElement('details');
  edit.className = 'phx-w2-editor';
  edit.innerHTML = '<summary>Profile settings</summary>';
  edit.append(settings);
  shortcutSettings.after(edit);

  function refreshProfile() {
    const profileValues = {
      name: byId('phx-r10-name').textContent,
      level: byId('phx-r10-sub').textContent.replace(/^Lvl\s+|\s+⚔$/g, ''),
      alliance: byId('phx-r11-alliance').textContent,
      kingdom: byId('phx-r11-kingdom').textContent
    };
    for (const [field, value] of Object.entries(profileValues)) {
      const element = profile.querySelector('[data-w2-' + field + ']');
      element.textContent = value || '—';
      element.title = element.textContent;
    }
    const homePhoto = byId('phx-r10-photo');
    const avatar = profile.querySelector('.phx-w2-avatar');
    avatar.hidden = homePhoto.hidden;
    if (avatar.hidden) avatar.removeAttribute('src');
    else avatar.src = homePhoto.src;
  }

  refreshProfile();
  for (const id of ['phx-r10-save', 'phx-r10-reset']) {
    byId(id).addEventListener('click', refreshProfile);
  }
  window.addEventListener('hashchange', () => {
    if (location.hash === '#war-room') refreshProfile();
  });
})();
