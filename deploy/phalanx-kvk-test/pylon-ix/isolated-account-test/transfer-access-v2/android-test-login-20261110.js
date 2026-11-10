(() => {
  const expectedOrigin = 'https://phalanx-cloudflare-test-depl.nexus-phalanx-kvk-test.pages.dev';
  const url = 'https://yuyvmbdybwpwpqsipfjt.supabase.co';
  const key = 'sb_publishable_Zhtb-Gqaqe3Axf5XvuaSeQ_aGENmNQ4';
  const button = document.getElementById('continue');
  const status = document.getElementById('status');
  let token = new URLSearchParams(location.hash.slice(1)).get('test');
  history.replaceState(null, '', location.pathname);

  if (location.origin !== expectedOrigin || !/^[a-f0-9]{64}$/i.test(token ?? '')) {
    status.textContent = 'Open the complete one-time test link.';
    return;
  }

  status.textContent = 'Ready to sign in.';
  button.disabled = false;

  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Signing in…';
    let db;
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.119.0');
      db = createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const verified = await db.auth.verifyOtp({ token_hash: token, type: 'email' });
      token = null;
      if (verified.error || !verified.data.session) {
        status.textContent = 'This test link has expired or has already been used.';
        return;
      }
      const access = await db.rpc('phx_hosted_fixture_access', { p_action: 'check' });
      if (access.error || access.data?.allowed !== true || access.data?.scouting_role !== 'administrator') {
        await db.auth.signOut({ scope: 'local' });
        status.textContent = 'This account has no active Android test access.';
        return;
      }
      location.replace('./transfer-scouting-id-stage-20261030');
    } catch {
      if (token) {
        button.disabled = false;
        status.textContent = 'Could not connect. Try again.';
      } else {
        await db?.auth.signOut({ scope: 'local' }).catch(() => {});
        status.textContent = 'Sign-in did not complete. A fresh test link is required.';
      }
    }
  });
})();
