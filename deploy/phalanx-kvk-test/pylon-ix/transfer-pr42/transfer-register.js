const supabaseUrl = 'https://hcjrdofkdkasznywvcxo.supabase.co';
const publishableKey = 'sb_publishable_hkqBaMme70g2f3wcxvaTKg_FczqkpCh';

const form = document.getElementById('register');
const status = document.getElementById('status');
const submit = form.querySelector('button[type="submit"]');
const password = document.getElementById('password');
const confirmation = document.getElementById('confirm');
const signInUrl = new URL('./transfer-scouting-id-stage-20261030', document.baseURI).href;

document.getElementById('show').addEventListener('change', (event) => {
  password.type = confirmation.type = event.target.checked ? 'text' : 'password';
});

try {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.119.0');
  const client = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'pkce' },
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    if (password.value !== confirmation.value) {
      status.textContent = 'The passwords do not match.';
      confirmation.focus();
      return;
    }

    submit.disabled = true;
    status.textContent = 'Submitting your registration…';
    try {
      const { error } = await client.auth.signUp({
        email: document.getElementById('email').value.trim(),
        password: password.value,
        options: {
          // The ID is self-reported. Only approved membership grants access.
          data: { player_id: document.getElementById('playerId').value.trim() },
          emailRedirectTo: signInUrl,
        },
      });
      if (error && !['user_already_exists', 'email_exists'].includes(error.code)) {
        status.textContent = error.status === 429
          ? 'Too many attempts. Wait a few minutes and try again.'
          : error.code === 'weak_password'
            ? 'Choose a stronger password and try again.'
            : 'Registration could not be completed. Check your details and try again.';
        return;
      }

      form.reset();
      password.type = confirmation.type = 'password';
      status.textContent = 'Check your inbox to confirm a new account, then return to Sign in. Transfer Scouting requires separate approval.';
    } catch {
      status.textContent = 'Unable to connect. Check your connection and try again.';
    } finally {
      submit.disabled = false;
    }
  });

  status.textContent = '';
  submit.disabled = false;
} catch {
  status.textContent = 'Registration could not load. Refresh this page to try again.';
}
