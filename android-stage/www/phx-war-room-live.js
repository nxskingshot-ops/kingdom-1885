(() => {
  'use strict';

  const war = document.getElementById('phx-r8-war');
  const profile = war?.querySelector('.phx-w2-profile');
  if (!profile) return;

  const project = 'https://yuyvmbdybwpwpqsipfjt.supabase.co';
  const apiKey = 'sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4'; // Supabase publishable key for the isolated project.
  const account = document.createElement('section');
  account.className = 'phx-w2-editor phx-live-account';
  account.setAttribute('aria-label', 'Live profile');
  account.innerHTML = `
    <h2>Live profile</h2>
    <p data-live-status role="status">Sign in with your approved PHALANX test account.</p>
    <form data-live-login>
      <label>Test account email <input name="email" type="email" autocomplete="username" required></label>
      <label>Password <input name="password" type="password" autocomplete="current-password" required></label>
      <button type="submit">Sign in</button>
    </form>
    <dl data-live-values hidden>
      <div><dt>Name</dt><dd data-live-name></dd></div>
      <div><dt>Kingdom</dt><dd data-live-kingdom></dd></div>
      <div><dt>Alliance</dt><dd data-live-alliance></dd></div>
      <div><dt>Player ID</dt><dd data-live-id></dd></div>
      <div><dt>Power</dt><dd data-live-power></dd></div>
      <div><dt>Captured</dt><dd><time data-live-captured></time></dd></div>
      <div><dt>Checked</dt><dd><time data-live-checked></time></dd></div>
    </dl>
    <div data-live-actions hidden>
      <button type="button" data-live-refresh>Refresh profile</button>
      <button type="button" data-live-logout>Sign out</button>
    </div>`;
  const accountPanel = war.querySelector('[data-panel="account"]');
  if (!accountPanel) return;
  accountPanel.append(account);
  const toolbar = war.querySelector('.phx-w2-toolbar');
  const openProfile = document.createElement('button');
  openProfile.type = 'button';
  openProfile.className = 'phx-live-open';
  openProfile.textContent = 'Live profile';
  toolbar.append(openProfile);
  // HOME entry uses the existing verified War Room authentication form.
  // Do not duplicate credentials, session handling, or identity sources.
  const homeLogin = document.createElement('button');
  homeLogin.type = 'button';
  homeLogin.className = 'phx-home-live-login';
  homeLogin.textContent = 'Sign in';
  homeLogin.setAttribute('aria-label', 'Open account in War Room');
  const homeSection = document.getElementById('phx-r6-home');
  const homeNavigation = homeSection?.querySelector('.phx-home-nav');
  if (homeNavigation) {
    const accountBar = document.createElement('div');
    accountBar.className = 'phx-home-accountbar';
    const language = homeNavigation.querySelector('#phx-r11-language');
    if (language) accountBar.append(language);
    accountBar.append(homeLogin);
    homeNavigation.after(accountBar);
    // Use the existing approved image, showing its original top-right IX badge.
    const original = document.querySelector('#phx-pylon-modal img');
    const emblemTarget = homeNavigation.querySelector('[data-home-action="pylon"] span');
    if (original && emblemTarget) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '882 34 132 132');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('phx-home-pylon-icon');
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('href', original.getAttribute('src'));
      image.setAttribute('width', '1024');
      image.setAttribute('height', '1536');
      svg.append(image);
      emblemTarget.replaceWith(svg);
    }
  }
  homeLogin.addEventListener('click', () => {
    // Keep one account form inside the existing War Room and its router.
    document.getElementById('phx-r8-war-entry').click();
    openProfile.click();
  });
  accountPanel.id = 'phx-war-room-account';
  openProfile.setAttribute('aria-controls', accountPanel.id);
  openProfile.setAttribute('aria-expanded', 'false');
  accountPanel.addEventListener('toggle', () => {
    openProfile.setAttribute('aria-expanded', String(accountPanel.open));
  });
  openProfile.addEventListener('click', () => {
    accountPanel.open = true;
    accountPanel.append(account);
    account.hidden = false;
    account.scrollIntoView({ block: 'start' });
    (form.hidden ? refresh : form.elements.email).focus({ preventScroll: true });
  });
  const sourceBadge = document.createElement('span');
  sourceBadge.className = 'phx-live-source-badge';
  sourceBadge.textContent = 'Sign in for live data';
  profile.append(sourceBadge);
  const el = name => account.querySelector('[data-live-' + name + ']');
  const form = el('login');
  const status = el('status');
  const actions = el('actions');
  const values = el('values');
  const refresh = el('refresh');
  const power = profile.querySelector('[data-w2-power]');
  const profileId = profile.querySelector('[data-w2-player-id]');
  const profileUpdated = profile.querySelector('[data-w2-updated]');
  const home = document.getElementById('phx-r6-home');
  const statusBar = window.Capacitor?.isPluginAvailable('StatusBar') && window.Capacitor.Plugins.StatusBar;
  if (statusBar) {
    const syncStatusBar = () => {
      const onHome = !location.hash || location.hash === '#phalanx-home';
      void (onHome ? statusBar.hide() : statusBar.show()).catch(() => {});
    };
    window.addEventListener('hashchange', syncStatusBar);
    window.addEventListener('popstate', syncStatusBar);
    new MutationObserver(syncStatusBar).observe(home, { attributes: true, attributeFilter: ['inert'] });
    syncStatusBar();
  }
  // Approved HOME-only unified plaque. Existing identity nodes are MOVED, not cloned:
  // renderIdentity() continues to update the same authorized live-data elements.
  const queenHero = home?.querySelector('.phx-queen-experimental');
  if (queenHero && !home.querySelector('.phx-home-unified-plaque')) {
    const plaque = document.createElement('section');
    plaque.className = 'phx-home-unified-plaque';
    plaque.setAttribute('aria-label', 'Commander identity');
    // Reuse the original entry, its router listener and the uploaded-photo node.
    // The default portrait is a viewport onto the approved Queen-An asset,
    // exactly as the existing PYLON badge reuses its approved source image.
    const avatar = document.getElementById('phx-r8-war-entry');
    const info = document.createElement('div');
    info.className = 'phx-home-unified-info';
    const identity = document.getElementById('phx-r10-identity');
    const affiliationNode = document.getElementById('phx-r11-affiliation');
    if (avatar && identity && affiliationNode) {
      avatar.classList.add('phx-home-unified-avatar');
      const portrait = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      portrait.setAttribute('viewBox', '25 0 160 160');
      portrait.setAttribute('aria-hidden', 'true');
      portrait.setAttribute('focusable', 'false');
      portrait.classList.add('phx-home-approved-portrait');
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('href', queenHero.querySelector('.phx-queen-scene').getAttribute('src'));
      image.setAttribute('width', '1670');
      image.setAttribute('height', '941');
      portrait.append(image);
      avatar.prepend(portrait);
      const arrow = document.createElement('span');
      arrow.className = 'phx-home-unified-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '❯';
      avatar.append(arrow);
      info.append(identity, affiliationNode);
      plaque.append(avatar, info);
      queenHero.before(plaque);
      home.classList.add('phx-home-unified-active');
    }
  }
  const homeName = document.getElementById('phx-r10-name');
  const homeLevel = document.getElementById('phx-r10-sub');
  const homeKingdom = document.getElementById('phx-r11-kingdom');
  const homeAlliance = document.getElementById('phx-r11-alliance');
  const homeDivider = document.getElementById('phx-r11-sep');
  const affiliation = document.getElementById('phx-r11-affiliation');
  for (const field of ['phx-r10-input-name', 'phx-r10-input-level', 'phx-r11-input-kingdom', 'phx-r11-input-alliance']) {
    document.getElementById(field).closest('label').hidden = true;
  }
  let tabStorage;
  try { tabStorage = window.sessionStorage; } catch {}
  const session = window.PhxWarRoomSession.create({
    request, storage: tabStorage, key: 'phx-war-room-session-yuyvmbdybwpwpqsipfjt-v1'
  });
  let operation = 0;

  async function request(path, { method = 'GET', body, token, timeout = 12000 } = {}) {
    const headers = { apikey: apiKey };
    if (token) headers.Authorization = 'Bearer ' + token;
    if (body) headers['Content-Type'] = 'application/json';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(project + path, {
        method, headers, body: body && JSON.stringify(body), cache: 'no-store',
        redirect: 'error', signal: controller.signal
      });
      return { status: res.status, data: await res.json().catch(() => null) };
    } finally {
      clearTimeout(timer);
    }
  }

  function renderIdentity(player) {
    const name = player?.name ?? '';
    homeName.dataset.profileName = name;
    homeName.textContent = name || (home.lang === 'en' ? 'Profile' : 'Profil');
    homeName.classList.toggle('phx-long-name', Array.from(name).length > 8);
    homeName.title = name;
    homeLevel.textContent = '';
    homeKingdom.textContent = player ? '#' + player.kingdom : '—';
    homeAlliance.textContent = player?.alliance ?? '';
    homeAlliance.hidden = !player?.alliance;
    homeDivider.hidden = homeAlliance.hidden;
    affiliation.title = player ? [homeKingdom.textContent, player.alliance].filter(Boolean).join(' · ') : '';
    document.dispatchEvent(new Event('phx:profile-rendered'));
  }

  function clearProfile() {
    document.dispatchEvent(new Event('phx:own-profile-cleared'));
    renderIdentity(null);
    values.hidden = true;
    for (const field of values.querySelectorAll('dd:not(:has(time)), time')) {
      field.textContent = '';
      field.removeAttribute('datetime');
    }
    power.textContent = 'Data pending';
    profileId.textContent = '—';
    profileId.removeAttribute('title');
    setTime(profileUpdated, null, '—');
    profile.classList.remove('phx-live-verified');
  }

  function showSignedOut(message) {
    homeLogin.textContent = 'Sign in';
    session.clear();
    clearProfile();
    sourceBadge.textContent = 'Sign in for live data';
    actions.hidden = true;
    form.hidden = false;
    status.textContent = message;
  }

  const timeFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'UTC'
  });

  const dossierTimeFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short', timeZone: 'UTC'
  });

  function setTime(node, value, empty = 'Unavailable', format = timeFormat) {
    const time = new Date(value);
    if (!value || !Number.isFinite(time.valueOf())) {
      node.removeAttribute('datetime');
      node.textContent = empty;
      return;
    }
    node.dateTime = time.toISOString();
    node.textContent = format.format(time) + ' UTC';
  }

  async function loadProfile() {
    if (!session.currentToken()) return;
    const current = ++operation;
    clearProfile();
    status.textContent = 'Loading own profile…';
    sourceBadge.textContent = 'Checking live data';
    refresh.disabled = true;
    try {
      let token = await session.token();
      if (current !== operation) return;
      if (!token) return showSignedOut('Session expired. Sign in again.');
      let result = await request('/functions/v1/phx-war-room-own-profile', { token, timeout: 45000 });
      if (current !== operation) return;
      if (result.status === 401) {
        token = await session.token(true);
        if (current !== operation) return;
        if (!token) return showSignedOut('Session expired. Sign in again.');
        result = await request('/functions/v1/phx-war-room-own-profile', { token, timeout: 45000 });
      }
      if (current !== operation) return;
      if (result.status === 401) return showSignedOut('Session expired. Sign in again.');
      const data = result.data;
      if (result.status !== 200 || !/^[1-9][0-9]{0,15}$/.test(data?.playerId ?? '')) {
        sourceBadge.textContent = 'Live data unavailable';
        status.textContent = result.status === 403 ? 'This account has no verified player access.'
          : result.status === 429 ? 'Request limit reached. Try again later.'
          : 'Live profile is temporarily unavailable.';
        return;
      }

      const player = data.freshness === 'fresh' && Number.isSafeInteger(data.player?.kingdom) &&
        data.player.kingdom > 0 ? {
          ...data.player,
          name: typeof data.player.name === 'string' ? data.player.name.trim() : '',
          alliance: typeof data.player.alliance === 'string' ? data.player.alliance.trim() : ''
        } : null;
      const amount = typeof player?.power === 'string' && /^\d{1,24}$/.test(player.power)
        ? new Intl.NumberFormat().format(BigInt(player.power)) : null;
      renderIdentity(player);
      document.dispatchEvent(new CustomEvent('phx:own-profile-verified', { detail: data }));
      el('name').textContent = player?.name || '—';
      el('kingdom').textContent = player?.kingdom ? '#' + player.kingdom : '—';
      el('alliance').textContent = player?.alliance || '—';
      el('id').textContent = data.playerId;
      el('power').textContent = amount ?? 'Unavailable';
      setTime(el('captured'), data.capturedAt);
      setTime(el('checked'), data.checkedAt);
      profileId.textContent = data.playerId;
      profileId.title = data.playerId;
      setTime(profileUpdated, player ? data.capturedAt : null, '—', dossierTimeFormat);
      status.textContent = player ? 'Verified profile · MightPulse'
        : 'Current values are unavailable. Refresh to check again.';
      values.hidden = false;
      sourceBadge.textContent = player ? 'Verified live data' : 'Current data unavailable';
      if (player) {
        power.textContent = amount ?? 'Unavailable';
        profile.classList.add('phx-live-verified');
      }
    } catch {
      if (current === operation) {
        sourceBadge.textContent = 'Live data unavailable';
        status.textContent = 'Could not load the live profile. Try again.';
      }
    } finally {
      if (current === operation) refresh.disabled = false;
    }
  }

  renderIdentity(null);
  document.getElementById('phx-r11-language-select').addEventListener('change', () => {
    if (!homeName.dataset.profileName && !profile.classList.contains('phx-live-verified')) renderIdentity(null);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const current = ++operation;
    const submit = form.querySelector('button');
    submit.disabled = true;
    status.textContent = 'Signing in…';
    try {
      const password = form.elements.password.value;
      form.elements.password.value = '';
      const { status: code, data } = await request('/auth/v1/token?grant_type=password', {
        method: 'POST', body: { email: form.elements.email.value.trim(), password }
      });
      if (current !== operation) return;
      if (code !== 200 || !session.set(data)) {
        status.textContent = 'Could not sign in with that test account.';
        return;
      }
      homeLogin.textContent = 'Account';
      form.hidden = true;
      actions.hidden = false;
      await loadProfile();
    } catch {
      if (current === operation) status.textContent = 'Sign-in service is unavailable. Try again.';
    } finally {
      submit.disabled = false;
    }
  });
  refresh.addEventListener('click', loadProfile);
  el('logout').addEventListener('click', () => {
    ++operation;
    const token = session.currentToken();
    showSignedOut('Signed out.');
    if (token) void request('/auth/v1/logout?scope=local', { method: 'POST', token }).catch(() => {});
  });
  // Restore only this tab's session; fetch verified identity again from the server.
  if (session.restore()) {
    homeLogin.textContent = 'Account';
    form.hidden = true;
    actions.hidden = false;
    void loadProfile();
  }
})();
