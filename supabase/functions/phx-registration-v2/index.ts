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
    const { data: memberships, error: membershipError } = await admin.from('nxs_memberships')
      .select('active,expires_at').eq('user_id', user.id).eq('active',true).limit(10);
    if (membershipError) return json({ error: 'Membership status unavailable' }, 503);
    const legacyMembershipActive = (memberships ?? []).some((m: { expires_at: string | null }) =>
      !m.expires_at || new Date(m.expires_at).getTime() > Date.now());
    const { data, error } = await admin.from('phx_registration_applications')
      .select('id,status,submitted_at,reviewed_at,public_message')
      .eq('requester_user_id', user.id).order('submitted_at', { ascending: false }).limit(1).maybeSingle();
    if (error) return json({ error: 'Status temporarily unavailable' }, 503);
    return json({ application: data ? publicRow(data) : null, legacy_membership_active: legacyMembershipActive });
  }
  if (action === 'submit') {
    // A user who already has an active membership must not create a second
    // registration workflow that could later be mistaken for a privilege grant.
    const { data: membership, error: membershipError } = await admin.from('nxs_memberships')
      .select('user_id,active,expires_at').eq('user_id',user.id).eq('active',true).limit(1);
    if (membershipError) return json({ error: 'Membership check unavailable' }, 503);
    if ((membership??[]).some((m: { expires_at: string | null }) =>
      !m.expires_at || new Date(m.expires_at).getTime() > Date.now()))
      return json({ error: 'Account already has an active membership' }, 409);
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
  if (action === 'review_queue') {
    // Only explicitly provisioned PHALANX reviewers, never Kingshot R5 by inference.
    const { data: reviewer, error: permissionError } = await admin.from('phx_registration_reviewers')
      .select('enabled').eq('user_id', user.id).maybeSingle();
    if (permissionError) return json({ error: 'Review queue unavailable' }, 503);
    if (reviewer?.enabled !== true) return json({ error: 'Review permission denied' }, 403);
    const { data: rows, error: queueError } = await admin.from('phx_registration_applications')
      .select('id,player_id,gamer_tag,status,submitted_at')
      .eq('status', 'pending').order('submitted_at', { ascending: true }).limit(100);
    if (queueError) return json({ error: 'Review queue unavailable' }, 503);
    return json({ applications: rows ?? [] });
  }
  if (action === 'review') {
    if (typeof payload.application_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(payload.application_id))
      return json({ error: 'Invalid application ID' }, 400);
    if (payload.decision !== 'approved' && payload.decision !== 'rejected')
      return json({ error: 'Invalid decision' }, 400);
    if (payload.message != null && (typeof payload.message !== 'string' || payload.message.length > 500))
      return json({ error: 'Invalid message' }, 400);
    // Run the atomic RPC under the CALLER JWT, not the service-role client.
    // PostgreSQL validates explicit reviewer permission and prevents self-review.
    const caller = createClient(url, publishable, {
      global: { headers: { Authorization: 'Bearer ' + jwt } },
      auth: { persistSession: false },
    });
    const { data, error } = await caller.rpc('phx_review_registration', {
      p_application_id: payload.application_id,
      p_decision: payload.decision,
      p_public_message: payload.message ?? null,
    });
    if (error) {
      if (error.code === '42501') return json({ error: 'Review permission denied' }, 403);
      if (error.code === '23505') return json({ error: 'Request already reviewed' }, 409);
      if (error.code === 'P0002') return json({ error: 'Request not found' }, 404);
      return json({ error: 'Review unavailable' }, 503);
    }
    return json({ review: data });
  }
  // No role or membership grants: approval is only a recorded review decision.
  return json({ error: 'Unsupported action' }, 400);
});
