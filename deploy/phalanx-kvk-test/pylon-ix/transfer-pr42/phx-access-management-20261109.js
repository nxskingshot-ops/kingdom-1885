const labels = {
  active: 'Active', suspended: 'Suspended', expired: 'Expired',
  pending: 'Pending approval', unconfirmed: 'Email not confirmed', rejected: 'Rejected',
  kingdom: 'Kingdom', member: 'Member',
};

function element(tag, text) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  return node;
}

function button(text, onClick) {
  const node = element('button', text);
  node.type = 'button';
  node.className = 'secondary';
  node.onclick = onClick;
  return node;
}

async function rpc(db, action, args = {}) {
  const { data, error } = await db.rpc('phx_access_management', { p_action: action, ...args });
  if (error) {
    const known = ['42501', '22023', '23505'];
    throw new Error(known.includes(error.code) ? error.message : 'Access management is temporarily unavailable.');
  }
  return data;
}

export async function mountAccessManagement(db, signal) {
  const menu = document.getElementById('phxToolsMenu');
  if (!menu || signal.aborted) return;
  const access = await rpc(db, 'check');
  if (signal.aborted || access?.allowed !== true) return;

  const section = element('details');
  section.className = 'phx-tool-item';
  section.id = 'phxAccessManagement';
  const title = element('summary', 'Access Management');
  title.append(element('small', 'Invite players and manage regular PHALANX access'));
  const body = element('div');
  body.className = 'phx-tool-content';
  section.append(title, body);
  menu.append(section);
  signal.addEventListener('abort', () => section.remove(), { once: true });

  const info = element('p', 'Invitations expire after seven days. Players register with the invited email and Kingshot Player ID and confirm their email before approval.');
  const form = element('form');
  form.className = 'form-grid';
  const email = element('input');
  Object.assign(email, { type: 'email', required: true, maxLength: 254, autocomplete: 'off' });
  const playerId = element('input');
  Object.assign(playerId, { inputMode: 'numeric', required: true, maxLength: 20, pattern: '[1-9][0-9]{0,19}' });
  const role = element('select');
  role.append(new Option('Member · Transfer Scouting access', 'member'), new Option('Kingdom', 'kingdom'));
  for (const [label, input] of [['Email', email], ['Kingshot Player ID', playerId], ['Access role', role]]) {
    const field = element('label', label);
    field.append(input);
    form.append(field);
  }
  const invite = element('button', 'Create invitation');
  invite.type = 'submit';
  form.append(invite);

  const status = element('p');
  status.setAttribute('role', 'status');
  const results = element('div');
  let busy = false;

  async function run(operation, success, refresh = true) {
    if (busy || signal.aborted) return;
    busy = true;
    const controls = [...body.querySelectorAll('button, input, select')];
    for (const control of controls) control.disabled = true;
    status.textContent = 'Working…';
    try {
      await operation();
      if (signal.aborted) return;
      status.textContent = success;
      if (refresh) {
        try { await reload(); }
        catch { results.replaceChildren(); status.textContent += ' Refresh to reload the list.'; }
      }
    } catch (error) {
      if (!signal.aborted) status.textContent = error.message;
    } finally {
      busy = false;
      for (const control of controls) control.disabled = false;
    }
  }

  form.onsubmit = event => {
    event.preventDefault();
    void run(async () => {
      await rpc(db, 'invite', { p_email: email.value.trim(), p_player_id: playerId.value.trim(), p_role: role.value });
      form.reset();
    }, 'Invitation ready. Share the registration link with the invited player.');
  };

  const registration = document.querySelector('#login a[href$="transfer-register.html"]');
  const link = element('a', 'Open registration link');
  if (registration) link.href = registration.href;
  const copy = button('Copy registration link', () => run(async () => {
    try { await navigator.clipboard.writeText(link.href); }
    catch { throw new Error('Open the registration link to copy its address.'); }
  }, 'Registration link copied.', false));
  const search = element('form');
  search.className = 'toolbar';
  const searchLabel = element('label', 'Filter by email or player ID');
  const searchInput = element('input');
  Object.assign(searchInput, { type: 'search', maxLength: 254 });
  searchLabel.append(searchInput);
  const refresh = element('button', 'Refresh accounts');
  refresh.type = 'submit';
  search.append(searchLabel, refresh);
  search.onsubmit = event => {
    event.preventDefault();
    void run(reload, 'Accounts refreshed.', false);
  };
  body.append(info, form, link, document.createTextNode(' '), copy, search, status, results);

  function accountButton(label, action, account) {
    return button(label, () => {
      if (busy || signal.aborted) return;
      if (!window.confirm(label + ' for ' + account.email + '?')) return;
      const args = { p_user_id: account.user_id };
      if (action === 'approve' || action === 'reject') {
        Object.assign(args, { p_email: account.email, p_player_id: account.player_id, p_role: account.invited_role });
      }
      return run(() => rpc(db, action, args), 'Account updated.');
    });
  }

  function describeAccount(account) {
    const card = element('article');
    card.className = 'record-row';
    card.append(element('strong', account.email));
    card.append(element('p', [
      account.player_id && 'ID ' + account.player_id,
      labels[account.role || account.invited_role], labels[account.status],
    ].filter(Boolean).join(' · ')));
    if (account.status === 'pending' || account.status === 'unconfirmed') {
      if (account.status === 'pending' && account.invited_role) {
        card.append(accountButton('Approve access', 'approve', account));
      } else if (!account.invited_role) {
        card.append(button('Prepare invitation', () => {
          email.value = account.email;
          playerId.value = account.player_id;
          role.focus();
        }));
      }
      card.append(accountButton('Reject request', 'reject', account));
    }
    if (account.status === 'active') card.append(accountButton('Suspend access', 'suspend', account));
    if (account.status === 'suspended') card.append(accountButton('Reactivate access', 'reactivate', account));
    return card;
  }

  async function reload() {
    const data = await rpc(db, 'list', { p_email: searchInput.value.trim() });
    if (signal.aborted) return;
    const accounts = data?.accounts || [];
    const invitations = data?.invitations || [];
    results.replaceChildren(element('h3', 'Accounts and requests'));
    results.append(...(accounts.length ? accounts.map(describeAccount) : [element('p', 'No eligible accounts found.')]));
    results.append(element('h3', 'Open invitations'));
    for (const invitation of invitations) {
      const card = element('article');
      card.className = 'record-row';
      card.append(element('strong', invitation.email), element('p', [
        'ID ' + invitation.player_id, labels[invitation.role],
        'Expires ' + new Date(invitation.expires_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) + ' UTC',
      ].join(' · ')));
      results.append(card);
    }
    if (!invitations.length) results.append(element('p', 'No open invitations.'));
    if (accounts.length === 100 || invitations.length === 100) {
      results.append(element('p', 'Showing up to 100 recent entries per list.'));
    }
  }

  section.addEventListener('toggle', () => {
    if (!section.open) return;
    for (const other of menu.querySelectorAll('details.phx-tool-item')) {
      if (other !== section) other.open = false;
    }
    void run(reload, 'Accounts refreshed.', false);
  });
}
