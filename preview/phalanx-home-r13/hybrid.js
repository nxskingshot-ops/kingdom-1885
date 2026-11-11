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
  const missing = new Set(['Keine Allianz','No alliance','Aucune alliance','—','']);
  const text = {
    de: {table:'Kommandotisch', kingdom:'Königreich', enter:'War Room betreten'},
    en: {table:'Command table', kingdom:'Kingdom', enter:'Enter War Room'},
    fr: {table:'Table de commandement', kingdom:'Royaume', enter:'Entrer dans le War Room'}
  };
  function sync() {
    const locale = Object.hasOwn(text, language?.value) ? language.value : 'en';
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