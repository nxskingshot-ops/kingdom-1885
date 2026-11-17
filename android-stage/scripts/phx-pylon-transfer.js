(() => {
  'use strict';
  const dialog = document.getElementById('phx-pylon-modal');
  const art = dialog.querySelector('.phx-pylon-fullscreen-image');
  const links = document.createElement('div');
  links.setAttribute('role', 'navigation');
  links.setAttribute('aria-label', 'PYLON IX modules');
  links.style.cssText = 'display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap;padding:1rem';
  const atlas = document.createElement('button');
  atlas.textContent = 'Outpost Atlas';
  const transfer = document.createElement('button');
  transfer.textContent = 'Transfer Scouting';
  for (const button of [atlas, transfer]) {
    button.type = 'button';
    button.style.minHeight = '44px';
    links.append(button);
  }
  dialog.append(links);

  const screen = document.createElement('section');
  const back = document.createElement('button');
  back.type = 'button';
  back.textContent = '← PYLON IX';
  back.style.cssText = 'min-height:44px;margin:.5rem';
  screen.append(back);
  dialog.append(screen);

  const syncPylon = window.phxSyncPylon;
  let frame;
  function sync() {
    const open = location.hash === '#transfer';
    const wasOpen = !screen.hidden;
    art.hidden = open;
    links.style.display = open ? 'none' : 'flex';
    screen.hidden = !open;
    if (open) {
      if (!frame) {
        frame = document.createElement('iframe');
        frame.title = 'Transfer Scouting';
        frame.src = './pylon-ix/transfer-pr42/transfer-scouting-id-stage-20261030.html';
        frame.style.cssText = 'display:block;border:0;width:100%;height:calc(100dvh - 60px)';
        screen.append(frame);
      }
      if (!dialog.open) dialog.showModal();
      if (!wasOpen) back.focus();
    } else {
      syncPylon();
      if (wasOpen && dialog.open) transfer.focus();
    }
  }
  window.phxSyncPylon = sync;

  function navigate(hash, state, replace = false) {
    history[replace ? 'replaceState' : 'pushState'](state, '', hash);
    window.dispatchEvent(new Event('hashchange'));
  }
  atlas.addEventListener('click', () => {
    navigate('#map', { phxView: 'map' }, true);
  });
  transfer.addEventListener('click', () => {
    navigate('#transfer', { phxTransfer: true });
  });
  const homeCard = document.querySelector('#phx-r6-home [data-home-card="transfer"]');
  const homePylon = document.querySelector('#phx-r6-home [data-home-action="pylon"]');
  if (homeCard && homePylon) {
    const shortcut = document.createElement('button');
    shortcut.type = 'button';
    shortcut.className = homeCard.className;
    shortcut.dataset.homeCard = homeCard.dataset.homeCard;
    shortcut.append(...homeCard.childNodes);
    const subtitle = shortcut.querySelector('[data-home-text="pending"]');
    subtitle.removeAttribute('data-home-text');
    subtitle.textContent = 'PYLON IX';
    const arrow = document.createElement('span');
    arrow.className = 'phx-home-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    shortcut.append(arrow);
    shortcut.addEventListener('click', () => {
      homePylon.click();
      if (location.hash === '#pylon') transfer.click();
    });
    homeCard.replaceWith(shortcut);
  }
  function goBack() {
    if (location.hash !== '#transfer') return;
    if (!history.state?.phxTransfer) {
      navigate('#pylon', null, true);
      return;
    }
    const appHistory = window.navigation;
    const previous = appHistory?.entries()[appHistory.currentEntry?.index - 1];
    if (previous && new URL(previous.url).hash === '#pylon') {
      // Traverse the outer app entry even if the Transfer iframe has its own history.
      void appHistory.traverseTo(previous.key).committed.catch(() => history.back());
    } else {
      history.back();
    }
  }
  window.phxBackFromTransfer = goBack;
  back.addEventListener('click', goBack);
  dialog.addEventListener('cancel', event => {
    if (location.hash !== '#transfer') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    goBack();
  }, true);
  sync();
})();
