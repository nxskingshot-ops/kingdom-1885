// PHALANX Registration V2 — isolated source draft, NOT deployed.
// Requires phx_registration_applications migration and approved app-level
// permissions design. No service-role secret in browser.
// Deno/Supabase Edge Function; authenticated caller only.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } });
const publicRow = (row: Record<string, unknown>) => ({
  id: row.id, status: row.status, submitted_at: row.submitted_at,
  reviewed_at: row.reviewed_at, public_message: row.public_message,
});
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const jwt = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jwt) return json({ error: 'Authentication required' }, 401);
  const url = Deno.env.get('SUPABASE_URL');
  const publishable = Deno.env.get('SUPABASE_ANON_KEY');
  const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !publishable || !secret) return json({ error: 'Server not configured' }, 503);
  const authClient = createClient(url, publishable, { auth: { persistSession: false } });
  const { data: { user }, error: authError } = await authClient.auth.getUser(jwt);
  if (authError || !user) return json({ error: 'Invalid session' }, 401);
  const admin = createClient(url, secret, { auth: { persistSession: false } });
  let payload: Record<string, unknown>;
  try { payload = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json({ error: 'Invalid request' }, 400);
  const action = payload.action;
  if (action === 'status') {
    const { data, error } = await admin.from('phx_registration_applications')
      .select('id,status,submitted_at,reviewed_at,public_message')
      .eq('requester_user_id', user.id).order('submitted_at', { ascending: false }).limit(1).maybeSingle();
    if (error) return json({ error: 'Status temporarily unavailable' }, 503);
    return json({ application: data ? publicRow(data) : null });
  }
  if (action === 'submit') {
    if (!user.email_confirmed_at) return json({ error: 'Confirm email first' }, 403);
    const playerId = String(payload.player_id ?? '');
    if (!/^[0-9]{1,20}$/.test(playerId)) return json({ error: 'Invalid Kingshot Player ID' }, 400);
    const { data: existing, error: readError } = await admin.from('phx_registration_applications')
      .select('id,status,submitted_at,reviewed_at,public_message')
      .eq('requester_user_id', user.id).eq('status', 'pending').maybeSingle();
    if (readError) return json({ error: 'Request unavailable' }, 503);
    if (existing) return json({ application: publicRow(existing), already_pending: true });
    const { data, error } = await admin.from('phx_registration_applications')
      .insert({ requester_user_id: user.id, player_id: playerId })
      .select('id,status,submitted_at,reviewed_at,public_message').single();
    if (error) {
      // Concurrent duplicate submissions must never create multiple active requests.
      if (error.code === '23505') return json({ error: 'A request is already pending. Refresh status.' }, 409);
      return json({ error: 'Could not submit request' }, 503);
    }
    return json({ application: publicRow(data) }, 201);
  }
  // Review intentionally not exposed until app-level Administrator permissions,
  // atomic grant/review transaction and audit log are approved and implemented.
  return json({ error: 'Unsupported action' }, 400);
});
