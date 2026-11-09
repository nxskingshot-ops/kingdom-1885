-- Reviewed candidate. Apply only to an authorized isolated backend until release gates pass.
BEGIN;

DO $preflight$
BEGIN
  IF (SELECT md5(prosrc) FROM pg_proc
      WHERE oid = 'app_private.phx_access_management(text,uuid,text,text,text)'::regprocedure)
      IS DISTINCT FROM '0852112c42a32d75124330ae56c0f944' THEN
    RAISE EXCEPTION 'Access Management baseline differs from the reviewed function.';
  END IF;
  IF (SELECT count(*) FROM pg_class
      WHERE oid IN ('public.nxs_memberships'::regclass, 'public.transfer_candidates'::regclass)
        AND relrowsecurity) <> 2 THEN
    RAISE EXCEPTION 'Membership and candidate RLS must both be enabled.';
  END IF;
END;
$preflight$;

ALTER TABLE app_private.phx_access_settings
  ADD COLUMN scouting_roles_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.nxs_memberships
  ADD COLUMN scouting_role text CHECK (scouting_role IN ('observer', 'operator', 'administrator'));
ALTER TABLE app_private.phx_access_invites
  ADD COLUMN scouting_role text CHECK (scouting_role IN ('observer', 'operator', 'administrator')),
  ADD CONSTRAINT phx_access_invites_scouting_requires_member CHECK (scouting_role IS NULL OR role = 'member');

-- Existing membership role and existing policies remain authoritative for legacy capabilities.
-- V2 adds only these two Transfer Scouting policies. No app role grants legacy R4/R5/admin.
CREATE FUNCTION app_private.phx_current_scouting_role() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT m.scouting_role
  FROM public.nxs_memberships m
  JOIN auth.users u ON u.id = m.user_id
  JOIN auth.sessions s ON s.user_id = u.id
  JOIN app_private.phx_access_settings cfg ON cfg.singleton AND cfg.scouting_roles_enabled
  WHERE m.user_id = (SELECT auth.uid()) AND m.role = 'member' AND m.active
    AND (m.expires_at IS NULL OR m.expires_at > statement_timestamp())
    AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND NOT u.is_anonymous
    AND (u.banned_until IS NULL OR u.banned_until <= statement_timestamp())
    AND s.oauth_client_id IS NULL AND s.id::text = (SELECT auth.jwt()->>'session_id')
    AND (s.not_after IS NULL OR s.not_after > statement_timestamp());
$function$;

REVOKE ALL ON FUNCTION app_private.phx_current_scouting_role() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_private.phx_current_scouting_role() TO authenticated;

CREATE POLICY phx_scouting_v2_insert ON public.transfer_candidates FOR INSERT TO authenticated
  WITH CHECK ((SELECT app_private.phx_current_scouting_role()) IN ('operator', 'administrator'));
CREATE POLICY phx_scouting_v2_update ON public.transfer_candidates FOR UPDATE TO authenticated
  USING ((SELECT app_private.phx_current_scouting_role()) IN ('operator', 'administrator'))
  WITH CHECK ((SELECT app_private.phx_current_scouting_role()) IN ('operator', 'administrator'));

CREATE OR REPLACE FUNCTION app_private.phx_access_management(
  p_action text, p_user_id uuid, p_email text, p_player_id text, p_role text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  actor uuid := auth.uid();
  settings app_private.phx_access_settings%ROWTYPE;
  target auth.users%ROWTYPE;
  membership public.nxs_memberships%ROWTYPE;
  invitation app_private.phx_access_invites%ROWTYPE;
  email_address text := lower(btrim(p_email));
  at_time timestamptz;
  before_state jsonb;
  after_state jsonb;
  record_key text;
  allowed boolean;
  actor_legacy_role text;
  legacy_manager boolean;
  v2_enabled boolean;
  is_scouting_role boolean := coalesce(p_role IN ('observer', 'operator', 'administrator'), false);
  selected_scouting_role text := CASE WHEN is_scouting_role THEN p_role END;
  selected_legacy_role text := CASE WHEN is_scouting_role THEN 'member' ELSE p_role END;
BEGIN
  -- Serialize writes before taking row locks so concurrent managers cannot deadlock.
  IF p_action IN ('invite', 'approve', 'reject', 'suspend', 'reactivate', 'set_scouting_role') THEN
    PERFORM pg_advisory_xact_lock(1845, 1109);
  END IF;
  at_time := clock_timestamp();
  SELECT * INTO settings FROM app_private.phx_access_settings WHERE singleton FOR SHARE;
  v2_enabled := coalesce(settings.scouting_roles_enabled, false);
  SELECT m.role INTO actor_legacy_role
  FROM public.nxs_memberships m
  JOIN auth.users u ON u.id = m.user_id
  JOIN auth.sessions s ON s.user_id = u.id
  WHERE settings.protected_user_id IS NOT NULL AND m.user_id = actor AND m.active AND (m.expires_at IS NULL OR m.expires_at > at_time)
    AND (m.role = 'admin' OR (m.role = 'r5' AND m.user_id = settings.delegate_user_id)
         OR (v2_enabled AND m.role = 'member' AND m.scouting_role = 'administrator'))
    AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND NOT u.is_anonymous
    AND (u.banned_until IS NULL OR u.banned_until <= at_time)
    AND s.oauth_client_id IS NULL AND s.id::text = (auth.jwt()->>'session_id')
    AND (s.not_after IS NULL OR s.not_after > at_time)
  FOR SHARE OF m, u, s;
  allowed := FOUND;
  legacy_manager := coalesce(actor_legacy_role = 'admin'
    OR (actor_legacy_role = 'r5' AND actor = settings.delegate_user_id), false);

  IF p_action = 'check' THEN
    IF v2_enabled THEN
      RETURN jsonb_build_object('allowed', allowed, 'scouting_roles_enabled', true,
        'legacy_manager', legacy_manager, 'scouting_role', app_private.phx_current_scouting_role());
    END IF;
    RETURN jsonb_build_object('allowed', allowed);
  END IF;
  IF NOT allowed THEN
    RAISE EXCEPTION 'Access management is unavailable for this session.' USING ERRCODE = '42501';
  END IF;

  IF NOT v2_enabled AND (is_scouting_role OR p_action = 'set_scouting_role') THEN
    RAISE EXCEPTION 'Transfer Scouting roles are unavailable.' USING ERRCODE = '42501';
  END IF;

  IF p_action = 'list' THEN
    RETURN jsonb_build_object(
      'accounts', (
        SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.created_at DESC), '[]'::jsonb)
        FROM (
          SELECT u.id AS user_id, u.email, u.created_at,
            app_private.phx_registration_player_id(u.raw_user_meta_data) AS player_id,
            m.role, m.active, m.expires_at, i.role AS invited_role,
            CASE WHEN v2_enabled THEN m.scouting_role END AS scouting_role,
            i.scouting_role AS invited_scouting_role,
            coalesce(m.scouting_role = 'administrator', false) AS protected,
            CASE
              WHEN m.expires_at <= at_time THEN 'expired'
              WHEN m.active THEN 'active'
              WHEN m.user_id IS NOT NULL THEN 'suspended'
              WHEN r.rejected_at IS NOT NULL AND (i.id IS NULL OR r.rejected_at >= i.created_at) THEN 'rejected'
              WHEN u.email_confirmed_at IS NULL THEN 'unconfirmed'
              ELSE 'pending'
            END AS status
          FROM auth.users u
          LEFT JOIN public.nxs_memberships m ON m.user_id = u.id
          LEFT JOIN app_private.phx_access_rejections r ON r.user_id = u.id
          LEFT JOIN LATERAL (
            SELECT id, role, scouting_role, created_at FROM app_private.phx_access_invites x
            WHERE x.email = lower(u.email) AND x.player_id = app_private.phx_registration_player_id(u.raw_user_meta_data)
              AND x.closed_at IS NULL AND x.expires_at > at_time
              AND (v2_enabled OR x.scouting_role IS NULL)
              AND (legacy_manager OR x.role = 'member')
            ORDER BY x.created_at DESC LIMIT 1
          ) i ON true
          WHERE u.id <> actor AND u.id <> settings.protected_user_id
            AND u.id IS DISTINCT FROM settings.delegate_user_id
            AND u.deleted_at IS NULL AND NOT u.is_anonymous AND u.email IS NOT NULL
            AND (coalesce(email_address, '') = '' OR strpos(lower(u.email), email_address) > 0
                 OR strpos(app_private.phx_registration_player_id(u.raw_user_meta_data), email_address) > 0)
            AND (u.banned_until IS NULL OR u.banned_until <= at_time)
            AND (m.role = 'member' OR (legacy_manager AND m.role = 'kingdom') OR
                 (m.user_id IS NULL AND NOT u.is_sso_user AND app_private.phx_registration_player_id(u.raw_user_meta_data) ~ '^[1-9][0-9]{0,19}$'))
          ORDER BY u.created_at DESC, u.id LIMIT 100
        ) a
      ),
      'invitations', (
        SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY i.created_at DESC), '[]'::jsonb)
        FROM (
          SELECT id, email, player_id, role, scouting_role, created_at, expires_at
          FROM app_private.phx_access_invites
          WHERE closed_at IS NULL AND expires_at > at_time
            AND (v2_enabled OR scouting_role IS NULL)
            AND (legacy_manager OR role = 'member')
            AND (coalesce(email_address, '') = '' OR strpos(email, email_address) > 0 OR strpos(player_id, email_address) > 0)
          ORDER BY created_at DESC, id LIMIT 100
        ) i
      )
    );
  END IF;

  IF p_action = 'invite' THEN
    IF email_address IS NULL OR length(email_address) > 254
       OR email_address !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
       OR p_player_id IS NULL OR p_player_id !~ '^[1-9][0-9]{0,19}$'
       OR p_role IS NULL OR selected_legacy_role NOT IN ('kingdom', 'member') THEN
      RAISE EXCEPTION 'Enter a valid email, Kingshot Player ID and access role.' USING ERRCODE = '22023';
    END IF;
    IF NOT legacy_manager AND selected_legacy_role = 'kingdom' THEN
      RAISE EXCEPTION 'This role is outside Transfer Scouting.' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (
      SELECT 1 FROM app_private.phx_access_invites WHERE player_id = p_player_id AND approved_user_id IS NOT NULL
    ) OR EXISTS (
      SELECT 1 FROM auth.users u
      LEFT JOIN public.nxs_memberships m ON m.user_id = u.id
      WHERE u.deleted_at IS NULL
        AND (m.user_id IS NOT NULL OR u.id IN (settings.protected_user_id, settings.delegate_user_id))
        AND (lower(u.email) = email_address OR app_private.phx_registration_player_id(u.raw_user_meta_data) = p_player_id)
    ) THEN
      RAISE EXCEPTION 'An existing account already has a PHALANX membership.' USING ERRCODE = '23505';
    END IF;
    SELECT * INTO invitation FROM app_private.phx_access_invites
    WHERE closed_at IS NULL AND expires_at > at_time
      AND (email = email_address OR player_id = p_player_id)
    ORDER BY created_at DESC LIMIT 1;
    IF FOUND THEN
      IF invitation.email = email_address AND invitation.player_id = p_player_id AND invitation.role = selected_legacy_role
         AND invitation.scouting_role IS NOT DISTINCT FROM selected_scouting_role THEN
        RETURN jsonb_build_object('ok', true, 'changed', false);
      END IF;
      RAISE EXCEPTION 'An active invitation already uses this email or player ID.' USING ERRCODE = '23505';
    END IF;
    INSERT INTO app_private.phx_access_invites (email, player_id, role, scouting_role)
    VALUES (email_address, p_player_id, selected_legacy_role, selected_scouting_role) RETURNING * INTO invitation;
    record_key := invitation.id::text;
    after_state := jsonb_strip_nulls(jsonb_build_object('role', selected_legacy_role, 'scouting_role', selected_scouting_role));
  ELSE
    IF p_action IS NULL OR p_action NOT IN ('approve', 'reject', 'suspend', 'reactivate', 'set_scouting_role') THEN
      RAISE EXCEPTION 'Unknown access management action.' USING ERRCODE = '22023';
    END IF;
    IF p_user_id IS NULL OR p_user_id IN (actor, settings.protected_user_id)
      OR p_user_id = settings.delegate_user_id THEN
      RAISE EXCEPTION 'This account is protected.' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO target FROM auth.users WHERE id = p_user_id FOR UPDATE;
    SELECT * INTO membership FROM public.nxs_memberships WHERE user_id = p_user_id FOR UPDATE;
    IF target.id IS NULL OR target.deleted_at IS NOT NULL OR target.is_anonymous
       OR target.banned_until > at_time OR target.email IS NULL
       OR (NOT legacy_manager AND membership.role = 'kingdom')
       OR membership.scouting_role = 'administrator'
       OR (membership.role IS NOT NULL AND membership.role NOT IN ('kingdom', 'member')) THEN
      RAISE EXCEPTION 'This account is unavailable for access management.' USING ERRCODE = '42501';
    END IF;

    record_key := target.id::text;
    IF p_action = 'set_scouting_role' THEN
      -- p_email is unused for this action; the audited reason is passed in that slot.
      IF NOT is_scouting_role OR coalesce(length(btrim(p_email)), 0) NOT BETWEEN 1 AND 500 THEN
        RAISE EXCEPTION 'Choose a Transfer Scouting role and enter a reason (1–500 characters).' USING ERRCODE = '22023';
      END IF;
      IF membership.user_id IS NULL OR membership.role <> 'member' OR NOT membership.active
         OR membership.expires_at <= at_time OR target.email_confirmed_at IS NULL THEN
        RAISE EXCEPTION 'Only active, verified Member accounts can be assigned a Transfer Scouting role.' USING ERRCODE = '42501';
      END IF;
      IF membership.scouting_role IS NOT DISTINCT FROM selected_scouting_role THEN
        RETURN jsonb_build_object('ok', true, 'changed', false);
      END IF;
      before_state := jsonb_build_object('role', membership.role, 'scouting_role', membership.scouting_role);
      UPDATE public.nxs_memberships SET scouting_role = selected_scouting_role WHERE user_id = target.id;
      after_state := jsonb_build_object('role', membership.role, 'scouting_role', selected_scouting_role, 'reason', btrim(p_email));
    ELSIF p_action IN ('approve', 'reject') THEN
      IF membership.user_id IS NOT NULL OR target.is_sso_user OR app_private.phx_registration_player_id(target.raw_user_meta_data) IS NULL
        OR app_private.phx_registration_player_id(target.raw_user_meta_data) !~ '^[1-9][0-9]{0,19}$'
        OR lower(target.email) IS DISTINCT FROM email_address
        OR app_private.phx_registration_player_id(target.raw_user_meta_data) IS DISTINCT FROM p_player_id THEN
        RAISE EXCEPTION 'The registration changed. Refresh accounts and review it again.' USING ERRCODE = '22023';
      END IF;
      SELECT * INTO invitation FROM app_private.phx_access_invites
      WHERE email = email_address AND player_id = p_player_id
        AND closed_at IS NULL AND expires_at > at_time
      ORDER BY created_at DESC LIMIT 1 FOR UPDATE;

      IF NOT legacy_manager AND invitation.role = 'kingdom' THEN
        RAISE EXCEPTION 'This invitation is outside Transfer Scouting.' USING ERRCODE = '42501';
      END IF;
      IF NOT v2_enabled AND invitation.scouting_role IS NOT NULL THEN
        RAISE EXCEPTION 'Transfer Scouting roles are unavailable.' USING ERRCODE = '42501';
      END IF;
      IF p_action = 'approve' THEN
        IF target.email_confirmed_at IS NULL OR invitation.id IS NULL
           OR invitation.role IS DISTINCT FROM selected_legacy_role
           OR invitation.scouting_role IS DISTINCT FROM selected_scouting_role THEN
          RAISE EXCEPTION 'Approval requires verified email and a matching current invitation.' USING ERRCODE = '42501';
        END IF;
        IF EXISTS (
          SELECT 1 FROM public.nxs_memberships m JOIN auth.users u ON u.id = m.user_id
          WHERE u.deleted_at IS NULL AND app_private.phx_registration_player_id(u.raw_user_meta_data) = p_player_id
        ) THEN
          RAISE EXCEPTION 'This player ID already has a PHALANX membership.' USING ERRCODE = '23505';
        END IF;
        INSERT INTO public.nxs_memberships (user_id, role, active, granted_by, scouting_role)
        VALUES (target.id, invitation.role, true, actor, invitation.scouting_role);
        after_state := jsonb_strip_nulls(jsonb_build_object('role', invitation.role, 'active', true,
          'invitation_id', invitation.id, 'scouting_role', invitation.scouting_role));
      ELSE
        INSERT INTO app_private.phx_access_rejections (user_id, rejected_at)
        VALUES (target.id, at_time)
        ON CONFLICT (user_id) DO UPDATE SET rejected_at = excluded.rejected_at
        WHERE invitation.id IS NOT NULL;
        IF NOT FOUND THEN
          RETURN jsonb_build_object('ok', true, 'changed', false);
        END IF;
        after_state := jsonb_build_object('status', 'rejected', 'invitation_id', invitation.id);
      END IF;
      UPDATE app_private.phx_access_invites
      SET closed_at = at_time, approved_user_id = CASE WHEN p_action = 'approve' THEN target.id END
      WHERE id = invitation.id;
    ELSE
      IF membership.user_id IS NULL OR (p_action = 'reactivate' AND membership.expires_at <= at_time) THEN
        RAISE EXCEPTION 'No eligible regular membership was found.' USING ERRCODE = '42501';
      END IF;
      IF membership.active = (p_action = 'reactivate') THEN
        RETURN jsonb_build_object('ok', true, 'changed', false);
      END IF;
      before_state := jsonb_strip_nulls(jsonb_build_object('role', membership.role,
        'active', membership.active, 'scouting_role', membership.scouting_role));
      UPDATE public.nxs_memberships SET active = (p_action = 'reactivate') WHERE user_id = target.id;
      after_state := jsonb_strip_nulls(jsonb_build_object('role', membership.role,
        'active', p_action = 'reactivate', 'scouting_role', membership.scouting_role));
    END IF;
  END IF;

  INSERT INTO public.nxs_audit_log (table_name, record_key, operation, actor_id, before_data, after_data)
  VALUES ('phx_access_management', record_key, p_action, actor, before_state, after_state);
  RETURN jsonb_build_object('ok', true, 'changed', true);
END;
$function$;

COMMIT;
