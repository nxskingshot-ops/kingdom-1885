(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const home = byId('phx-r6-home');
  const commandHeading = byId('phx-home-command-heading');
  const language = byId('phx-r11-language-select');
  const moduleNavigation = byId('phx-r3-nav');
  const appSurfaces = document.querySelectorAll('body > header, body > nav, body > main, body > footer, #phx-r3-nav');
  const defaultLanguage = document.documentElement.lang;
  const translations = {
    de: {
      openWar: 'War Room öffnen', affiliation: 'Königreich und Allianz', navigation: 'HOME-Navigation',
      language: 'App-Sprache', kvkTitle: 'KvK Vorbereitung', allianceTitle: 'Allianzvergleich',
      pending: 'Anbindung folgt', noAlliance: 'Keine Allianz'
    },
    en: {
      openWar: 'Open War Room', affiliation: 'Kingdom and alliance', navigation: 'HOME navigation',
      language: 'App language', kvkTitle: 'KvK Preparation', allianceTitle: 'Alliance Comparison',
      pending: 'Coming later', noAlliance: 'No alliance'
    },
    fr: {
      openWar: 'Ouvrir le War Room', affiliation: 'Royaume et alliance', navigation: 'Navigation HOME',
      language: 'Langue de l’application', kvkTitle: 'Préparation KvK', allianceTitle: 'Comparaison des alliances',
      pending: 'À venir', noAlliance: 'Sans alliance'
    }
  };

  function localize() {
    const locale = Object.hasOwn(translations, language.value) ? language.value : 'de';
    const copy = translations[locale];
    home.lang = locale;
    if (!home.inert) document.documentElement.lang = locale;
    for (const element of home.querySelectorAll('[data-home-text]')) {
      element.textContent = copy[element.dataset.homeText];
    }
    for (const element of home.querySelectorAll('[data-home-label]')) {
      element.setAttribute('aria-label', copy[element.dataset.homeLabel]);
    }
    const alliance = byId('phx-r11-alliance');
    if (Object.values(translations).some(text => text.noAlliance === alliance.textContent)) {
      alliance.textContent = copy.noAlliance;
    }
  }

  function updateRoute() {
    const visible = location.hash === '' || location.hash === '#phalanx-home';
    const wasVisible = document.body.classList.contains('phx-r6-at-home');
    document.body.classList.toggle('phx-r6-at-home', visible);
    home.inert = !visible;
    for (const surface of appSurfaces) surface.inert = visible || location.hash === '#war-room';
    document.documentElement.lang = visible ? home.lang : defaultLanguage;
    if (visible && !wasVisible) home.scrollTop = 0;
  }

  const actions = {
    top: () => home.scrollTo({ top: 0 }),
    war: () => { location.hash = '#war-room'; },
    command: () => {
      commandHeading.focus({ preventScroll: true });
      commandHeading.scrollIntoView({ block: 'start' });
    },
    territory: () => { window.phxNavigate('home'); updateRoute(); },
    reports: () => { window.phxNavigate('report'); updateRoute(); },
    pylon: () => {
      if (location.hash === '') history.replaceState(history.state, '', '#phalanx-home');
      byId('phx-pylon-open').click();
      updateRoute();
    }
  };

  home.addEventListener('click', event => {
    const trigger = event.target.closest('[data-home-action]');
    if (trigger) actions[trigger.dataset.homeAction]();
  });
  byId('b-home').addEventListener('click', event => {
    if (!event.isTrusted) return;
    event.stopImmediatePropagation();
    location.hash = '#phalanx-home';
  }, true);
  moduleNavigation.addEventListener('click', event => {
    if (!event.target.closest('[data-phx-r3-target="home"]')) return;
    event.stopImmediatePropagation();
    location.hash = '#phalanx-home';
  }, true);
  language.addEventListener('change', localize);
  byId('phx-r10-save').addEventListener('click', localize);
  byId('phx-r10-reset').addEventListener('click', localize);
  window.addEventListener('hashchange', updateRoute);
  window.addEventListener('popstate', updateRoute);
  updateRoute();
  localize();
})();
