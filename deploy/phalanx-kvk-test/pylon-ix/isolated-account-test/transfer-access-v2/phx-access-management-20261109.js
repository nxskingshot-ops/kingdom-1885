export const scoutingRoleLabels = Object.freeze({
  observer: 'Observer',
  operator: 'Operator',
  administrator: 'Administrator',
});

const labels = {
  ...scoutingRoleLabels,
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

function roleSelect(label, selected = '') {
  const select = element('select');
  select.required = true;
  select.setAttribute('aria-label', label);
  select.append(new Option('Choose a role', ''));
  for (const [value, name] of Object.entries(scoutingRoleLabels)) select.append(new Option(name, value));
  select.value = selected;
  return select;
}

export async function accessManagementStatus(db) {
  return rpc(db, 'check');
}

async function rpc(db, action, args = {}) {
  const { data, error } = await db.rpc('phx_hosted_fixture_access', { p_action: action, ...args });
  if (error) {
    const known = ['42501', '22023', '23505'];
    throw new Error(known.includes(error.code) ? error.message : 'Access management is temporarily unavailable.');
  }
  return data;
}

export function mountAccessManagement(db, signal, access) {
  const menu = document.getElementById('phxToolsMenu');
  if (!menu || signal.aborted || access?.allowed !== true) return;
  const v2 = access.scouting_roles_enabled === true;

  const section = element('details');
  section.className = 'phx-tool-item';
  section.id = 'phxAccessManagement';
  const title = element('summary', 'Access Management');
  title.append(element('small', 'Accounts, approvals and invites'));
  const body = element('div');
  body.className = 'phx-tool-content';
  section.append(title, body);
  menu.append(section);
  signal.addEventListener('abort', () => section.remove(), { once: true });

  const header = element('header');
  header.className = 'phx-access-header';
  header.append(element('span', 'PHALANX'), element('h3', 'Manage access'));
  const metrics = element('dl');
  metrics.className = 'phx-access-metrics';
  const metricValues = ['Active', 'Pending', 'Invitations'].map(label => {
    const tile = element('div');
    const value = element('dd', '—');
    tile.append(element('dt', label), value);
    metrics.append(tile);
    return value;
  });

  const invitationPanel = element('details');
  invitationPanel.className = 'phx-access-invite';
  const inviteTitle = element('summary', 'Invite Player');
  const info = element('p', 'The player registers with the invited email and Kingshot ID, then verifies their email. Invitations expire after 7 days.');
  const form = element('form');
  form.className = 'form-grid';
  const email = element('input');
  Object.assign(email, { type: 'email', required: true, maxLength: 254, autocomplete: 'off' });
  const playerId = element('input');
  Object.assign(playerId, { inputMode: 'numeric', required: true, maxLength: 20, pattern: '[1-9][0-9]{0,19}' });
  let role = v2 ? roleSelect('Access role') : legacyRoleSelect();
  const roleHint = element('small');
  roleHint.id = 'phxAccessRoleHint';
  const roleField = element('label', 'Access role');
  const describeRole = legacy => {
    role.setAttribute('aria-label', legacy && v2 ? 'Legacy access role' : 'Access role');
    role.setAttribute('aria-describedby', roleHint.id);
    roleHint.textContent = legacy ? 'Member includes baseline Transfer Scouting access.'
      : 'Observer can view. Operator can also edit and export. Administrator can also manage access.';
  };
  function legacyRoleSelect() {
    const select = element('select');
    select.append(new Option('Member', 'member'), new Option('Kingdom', 'kingdom'));
    return select;
  }
  for (const [label, input] of [['Email', email], ['Kingshot Player ID', playerId]]) {
    const field = element('label', label);
    field.append(input);
    form.append(field);
  }
  describeRole(!v2);
  roleField.append(role, roleHint);
  form.append(roleField);
  const invite = element('button', 'Create invitation');
  invite.type = 'submit';
  form.append(invite);

  const inviteStatus = element('p');
  inviteStatus.className = 'phx-access-status';
  inviteStatus.setAttribute('role', 'status');
  const overviewStatus = element('p');
  overviewStatus.className = 'phx-access-status';
  overviewStatus.setAttribute('role', 'status');
  const results = element('div');
  results.className = 'phx-access-results';
  results.id = 'phxAccessResults';
  const sections = ['Accounts', 'Approvals', 'Invites'];
  const sectionPicker = element('div');
  sectionPicker.className = 'phx-access-sections';
  sectionPicker.setAttribute('role', 'group');
  sectionPicker.setAttribute('aria-label', 'Access management sections');
  let selectedSection = 0;
  let entries = [[], [], []];
  let appliedFilter = '';
  const sectionButtons = sections.map((name, index) => {
    const control = button(name, () => {
      selectedSection = index;
      renderSection();
    });
    control.setAttribute('aria-controls', results.id);
    control.setAttribute('aria-pressed', String(index === selectedSection));
    sectionPicker.append(control);
    return control;
  });
  const scope = element('p');
  scope.className = 'phx-access-scope';
  let loaded = false;
  let busy = false;

  async function run(status, operation, success = '', refresh = true) {
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
        catch {
          loaded = false;
          for (const value of metricValues) value.textContent = '—';
          scope.textContent = '';
          results.replaceChildren();
          overviewStatus.textContent = 'The list could not be updated. Run the search or refresh again.';
        }
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
    void run(inviteStatus, async () => {
      await rpc(db, 'invite', { p_email: email.value.trim(), p_player_id: playerId.value.trim(), p_role: role.value });
      form.reset();
      if (registration) linkPanel.open = true;
    }, registration ? 'Invitation created. Copy and share the registration link.' : 'Invitation created.');
  };

  const registration = document.querySelector('#login a[href$="transfer-register.html"]');
  const link = element('a', 'Open registration link');
  if (registration) link.href = registration.href;
  const copy = button('Copy registration link', () => run(inviteStatus, async () => {
    try { await navigator.clipboard.writeText(link.href); }
    catch { throw new Error('Open the registration link to copy its address.'); }
  }, 'Registration link copied.', false));
  const linkPanel = element('details');
  linkPanel.className = 'phx-access-registration';
  const linkActions = element('div');
  linkActions.append(copy, link);
  linkPanel.append(element('summary', 'Registration link'), linkActions);
  invitationPanel.append(inviteTitle, info, form, inviteStatus);
  if (v2 && access.legacy_manager) {
    let legacy = false;
    const switchRoles = button('Use legacy invitation', () => {
      legacy = !legacy;
      const next = legacy ? legacyRoleSelect() : roleSelect('Access role');
      role.replaceWith(next);
      role = next;
      describeRole(legacy);
      switchRoles.textContent = legacy ? 'Use Transfer Scouting roles' : 'Use legacy invitation';
      role.focus();
    });
    form.append(switchRoles);
  }
  if (registration) invitationPanel.append(linkPanel);

  const search = element('form');
  search.className = 'phx-access-search';
  const searchLabel = element('label', 'Email or player ID');
  const searchInput = element('input');
  Object.assign(searchInput, { type: 'search', maxLength: 254 });
  searchLabel.append(searchInput);
  const refresh = element('button', 'Refresh');
  refresh.type = 'submit';
  search.append(searchLabel, refresh);
  searchInput.addEventListener('input', () => {
    refresh.textContent = searchInput.value.trim() ? 'Search' : 'Refresh';
  });
  search.onsubmit = event => {
    event.preventDefault();
    void run(overviewStatus, () => reload(true), '', false);
  };
  body.append(header, metrics, scope, invitationPanel, search, overviewStatus, sectionPicker, results);

  function accountButton(label, action, account, approvalRole) {
    return button(label, () => {
      if (busy || signal.aborted) return;
      if (approvalRole && !approvalRole.reportValidity()) return;
      if (approvalRole && approvalRole.value !== account.invited_scouting_role) {
        overviewStatus.textContent = 'Select the role on the invitation before approving.';
        approvalRole.focus();
        return;
      }
      const chosenRole = approvalRole?.value || account.invited_scouting_role || account.invited_role;
      const roleSuffix = action === 'approve' ? ' as ' + labels[chosenRole] : '';
      if (!window.confirm(label + ' for ' + account.email + roleSuffix + '?')) return;
      const args = { p_user_id: account.user_id };
      if (action === 'approve' || action === 'reject') {
        Object.assign(args, { p_email: account.email, p_player_id: account.player_id, p_role: chosenRole });
      }
      return run(overviewStatus, () => rpc(db, action, args), 'Account updated.');
    });
  }

  function roleEditor(account) {
    const editor = element('details');
    editor.className = 'phx-access-role-editor';
    const form = element('form');
    form.className = 'form-grid';
    const select = roleSelect('Member role', account.scouting_role || '');
    const reason = element('input');
    Object.assign(reason, { required: true, maxLength: 500, autocomplete: 'off' });
    const roleField = element('label', 'Member role');
    const reasonField = element('label', 'Reason for change');
    roleField.append(select);
    reasonField.append(reason);
    const save = element('button', 'Save role');
    save.type = 'submit';
    form.append(roleField, reasonField, save);
    form.onsubmit = event => {
      event.preventDefault();
      if (!reason.value.trim()) {
        overviewStatus.textContent = 'Enter a reason for the role change.';
        reason.focus();
        return;
      }
      if (!window.confirm('Assign ' + labels[select.value] + ' to ' + account.email + '?')) return;
      void run(overviewStatus, () => rpc(db, 'set_scouting_role', {
        p_user_id: account.user_id, p_role: select.value, p_email: reason.value.trim(),
      }), 'Member role saved.');
    };
    editor.append(element('summary', 'Change role'), form);
    return editor;
  }

  function describeAccount(account) {
    const card = element('article');
    card.className = 'phx-access-card';
    const badge = element('span', labels[account.status] || account.status);
    badge.className = 'phx-access-badge';
    badge.dataset.status = account.status;
    const displayedRole = account.scouting_role || account.invited_scouting_role || account.role || account.invited_role;
    card.append(element('strong', account.email), badge, element('p', [
      account.player_id && 'ID ' + account.player_id,
      labels[displayedRole] || displayedRole || 'Role not assigned',
    ].filter(Boolean).join(' · ')));
    const actions = element('div');
    actions.className = 'phx-access-card-actions';
    if (account.status === 'pending' || account.status === 'unconfirmed') {
      if (account.status === 'pending' && account.invited_role) {
        let approvalRole;
        if (account.invited_scouting_role) {
          approvalRole = roleSelect('Approval role', account.invited_scouting_role);
          const roleField = element('label', 'Approval role');
          roleField.append(approvalRole, element('small', 'Use the role recorded on the invitation.'));
          actions.append(roleField);
        }
        actions.append(accountButton('Approve access', 'approve', account, approvalRole));
      } else if (!account.invited_role) {
        actions.append(button('Prepare invitation', () => {
          email.value = account.email;
          playerId.value = account.player_id;
          invitationPanel.open = true;
          role.focus();
        }));
      }
      actions.append(accountButton('Reject request', 'reject', account));
    }
    if (account.protected) {
      card.append(element('p', 'Protected administrator'));
    } else if (account.status === 'active') {
      if (v2 && account.role === 'member') actions.append(roleEditor(account));
      actions.append(accountButton('Suspend access', 'suspend', account));
    } else if (account.status === 'suspended') {
      actions.append(accountButton('Reactivate access', 'reactivate', account));
    }
    if (actions.childElementCount) card.append(actions);
    return card;
  }

  function describeInvitation(invitation) {
    const card = element('article');
    card.className = 'phx-access-card';
    const badge = element('span', 'Open');
    badge.className = 'phx-access-badge';
    card.append(element('strong', invitation.email), badge, element('p', [
      'ID ' + invitation.player_id, labels[invitation.scouting_role || invitation.role] || invitation.role,
      'Expires ' + new Date(invitation.expires_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) + ' UTC',
    ].join(' · ')));
    return card;
  }

  async function reload(selectMatchingSection = false) {
    const filter = searchInput.value.trim();
    const data = await rpc(db, 'list', { p_email: filter });
    if (signal.aborted) return;
    const accounts = data?.accounts || [];
    const invitations = data?.invitations || [];
    const isRequest = account => account.status === 'pending' || account.status === 'unconfirmed';
    entries = [accounts.filter(account => !isRequest(account)), accounts.filter(isRequest), invitations];
    const counts = [entries[0].filter(account => account.status === 'active').length, entries[1].length, invitations.length];
    counts.forEach((count, index) => { metricValues[index].textContent = String(count); });
    const capped = accounts.length >= 100 || invitations.length >= 100;
    scope.textContent = [
      filter ? 'Counts reflect search results.' : 'Only records you can manage.',
      capped ? 'Showing up to 100 recent entries per list.' : '',
    ].filter(Boolean).join(' ');
    appliedFilter = filter;
    loaded = true;
    if (selectMatchingSection && filter && !entries[selectedSection].length) {
      const match = entries.findIndex(items => items.length > 0);
      if (match !== -1) selectedSection = match;
    }
    renderSection();
  }

  function renderSection() {
    sectionButtons.forEach((control, index) => {
      control.setAttribute('aria-pressed', String(index === selectedSection));
    });
    if (!loaded) return;
    const cards = entries[selectedSection].map(selectedSection === 2 ? describeInvitation : describeAccount);
    const empty = appliedFilter
      ? ['No matching accounts.', 'No matching requests.', 'No matching invitations.']
      : ['No accounts to manage yet.', 'No requests to review.', 'No open invitations.'];
    results.replaceChildren(element('h4', sections[selectedSection]), ...(cards.length ? cards : [element('p', empty[selectedSection])]));
  }

  section.addEventListener('toggle', () => {
    if (!section.open) return;
    for (const other of menu.querySelectorAll('details.phx-tool-item')) {
      if (other !== section) other.open = false;
    }
    void run(overviewStatus, reload, '', false);
  });
}
