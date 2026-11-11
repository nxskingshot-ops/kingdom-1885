(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const emblem = get('phx-hc-original-pylon');
  const original = get('phx-pylon-modal')?.querySelector('img');
  if (emblem && original?.getAttribute('src')) {
    emblem.src = original.getAttribute('src');
    emblem.hidden = false;
  }
  const alliance = get('phx-r11-alliance');
  const kingdom = get('phx-r11-kingdom');
  const core = get('phx-hc-map-alliance');
  const subtitle = get('phx-hc-war-subtitle');
  const language = get('phx-r11-language-select');
  // Route only the existing Transfer Scouting card to the existing staging module.
  // No auth bypass, no new storage, and no changes to the module itself.
  const transferUrl = 'https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev/pylon-ix/transfer-scouting-id-stage-20261030.html';
  const transferCard = document.querySelector('#phx-r6-home [data-home-card="transfer"]');
  if (transferCard) {
    transferCard.setAttribute('role', 'link');
    transferCard.setAttribute('tabindex', '0');
    transferCard.setAttribute('aria-label', 'Open Transfer Scouting');
    const pendingLabel = transferCard.querySelector('[data-home-text="pending"]');
    if (pendingLabel) {
      pendingLabel.removeAttribute('data-home-text');
      pendingLabel.textContent = 'Open Transfer Scouting';
    }
    transferCard.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const tab = window.open(transferUrl, '_blank');
      if (tab) tab.opener = null;
      if (!tab) {
        // A blocked popup must not silently discard the user's action.
        window.location.assign(transferUrl);
      }
    }, {capture:true});
    transferCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        transferCard.click();
      }
    });
  }
  const missing = new Set(['Keine Allianz','No alliance','Aucune alliance','—','']);
  const text = {
    de: {table:'Kommandotisch', kingdom:'Königreich', enter:'War Room betreten', transfer:'Transfer Scouting öffnen'},
    en: {table:'Command table', kingdom:'Kingdom', enter:'Enter War Room', transfer:'Open Transfer Scouting'},
    fr: {table:'Table de commandement', kingdom:'Royaume', enter:'Entrer dans le War Room', transfer:'Ouvrir Transfer Scouting'}
  };
  function sync() {
    const locale = Object.hasOwn(text, language?.value) ? language.value : 'en';
    if (transferCard) {
      transferCard.setAttribute('aria-label', text[locale].transfer);
      const caption = transferCard.querySelector('.phx-home-card-copy small');
      if (caption && caption.textContent !== text[locale].transfer) caption.textContent = text[locale].transfer;
    }
    const label = (alliance?.textContent || '').trim();
    const value = missing.has(label) ? '—' : label;
    if (core && core.textContent !== value) core.textContent = value;
    const kingdomLabel = (kingdom?.textContent || '#1885').trim();
    const next = `${text[locale].table} · ${text[locale].kingdom} ${kingdomLabel}`;
    if (subtitle && subtitle.textContent !== next) subtitle.textContent = next;
    const enter = document.querySelector('#phx-r6-home .phx-hc-war-table [data-home-action="war"]');
    if (enter) {
      enter.setAttribute('aria-label', text[locale].enter);
      const labelNode = enter.firstChild;
      if (labelNode?.nodeType === Node.TEXT_NODE && labelNode.textContent !== text[locale].enter + ' ') labelNode.textContent = text[locale].enter + ' ';
    }
  }
  if (alliance) new MutationObserver(sync).observe(alliance,{childList:true,characterData:true,subtree:true});
  if (kingdom) new MutationObserver(sync).observe(kingdom,{childList:true,characterData:true,subtree:true});
  language?.addEventListener('change', sync);
  sync();
})();