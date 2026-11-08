-- Isolated staging candidate. Run only after the project security and restore gates.
-- Deployment leaves the feature disabled until the protected principal is configured.
BEGIN;

CREATE TABLE app_private.phx_access_settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  protected_user_id uuid NOT NULL,
  delegate_user_id uuid CHECK (delegate_user_id <> protected_user_id)
);

CREATE TABLE app_private.phx_access_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  player_id text NOT NULL CHECK (player_id ~ '^[1-9][0-9]{0,19}$'),
  role text NOT NULL CHECK (role IN ('kingdom', 'member')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  closed_at timestamptz,
  approved_user_id uuid,
  CHECK (approved_user_id IS NULL OR closed_at IS NOT NULL),
  CHECK (expires_at > created_at)
);

CREATE INDEX phx_access_invites_email_created_idx
  ON app_private.phx_access_invites (email, created_at DESC);

CREATE UNIQUE INDEX phx_access_invites_approved_player_idx
  ON app_private.phx_access_invites (player_id) WHERE approved_user_id IS NOT NULL;

CREATE TABLE app_private.phx_access_rejections (
  user_id uuid PRIMARY KEY,
  rejected_at timestamptz NOT NULL
);

ALTER TABLE app_private.phx_access_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.phx_access_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.phx_access_rejections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON app_private.phx_access_settings, app_private.phx_access_invites,
  app_private.phx_access_rejections FROM PUBLIC, anon, authenticated;

-- The active registration page and the previous page use different metadata keys.
-- These values are claims only. Approval additionally binds the verified email to an invite.
CREATE FUNCTION app_private.phx_registration_player_id(metadata jsonb) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = ''
AS $function$
  SELECT CASE
    WHEN metadata->>'player_id' IS NOT NULL AND metadata->>'kingshot_player_id' IS NOT NULL
         AND metadata->>'player_id' <> metadata->>'kingshot_player_id' THEN NULL
    ELSE coalesce(metadata->>'player_id', metadata->>'kingshot_player_id')
  END;
$function$;
REVOKE ALL ON FUNCTION app_private.phx_registration_player_id(jsonb) FROM PUBLIC, anon, authenticated;

CREATE FUNCTION app_private.phx_access_management(
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
BEGIN
  -- Serialize writes before taking row locks so concurrent managers cannot deadlock.
  IF p_action IN ('invite', 'approve', 'reject', 'suspend', 'reactivate') THEN
    PERFORM pg_advisory_xact_lock(1845, 1109);
  END IF;
  at_time := clock_timestamp();
  SELECT * INTO settings FROM app_private.phx_access_settings WHERE singleton FOR SHARE;
  allowed := settings.protected_user_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.nxs_memberships m
    JOIN auth.users u ON u.id = m.user_id
    JOIN auth.sessions s ON s.user_id = u.id
    WHERE m.user_id = actor AND m.active AND (m.expires_at IS NULL OR m.expires_at > at_time)
      AND (m.role = 'admin' OR (m.role = 'r5' AND m.user_id = settings.delegate_user_id))
      AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND NOT u.is_anonymous
      AND (u.banned_until IS NULL OR u.banned_until <= at_time)
      AND s.oauth_client_id IS NULL AND s.id = (auth.jwt()->>'session_id')::uuid
      AND (s.not_after IS NULL OR s.not_after > at_time)
    FOR SHARE OF m, u, s
  );

  IF p_action = 'check' THEN
    RETURN jsonb_build_object('allowed', allowed);
  END IF;
  IF NOT allowed THEN
    RAISE EXCEPTION 'Access management is unavailable for this session.' USING ERRCODE = '42501';
  END IF;

  IF p_action = 'list' THEN
    RETURN jsonb_build_object(
      'accounts', (
        SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.created_at DESC), '[]'::jsonb)
        FROM (
          SELECT u.id AS user_id, u.email, u.created_at,
            app_private.phx_registration_player_id(u.raw_user_meta_data) AS player_id,
            m.role, m.active, m.expires_at, i.role AS invited_role,
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
            SELECT id, role, created_at FROM app_private.phx_access_invites x
            WHERE x.email = lower(u.email) AND x.player_id = app_private.phx_registration_player_id(u.raw_user_meta_data)
              AND x.closed_at IS NULL AND x.expires_at > at_time
            ORDER BY x.created_at DESC LIMIT 1
          ) i ON true
          WHERE u.id <> actor AND u.id <> settings.protected_user_id
            AND u.id IS DISTINCT FROM settings.delegate_user_id
            AND u.deleted_at IS NULL AND NOT u.is_anonymous AND u.email IS NOT NULL
            AND (coalesce(email_address, '') = '' OR strpos(lower(u.email), email_address) > 0
                 OR strpos(app_private.phx_registration_player_id(u.raw_user_meta_data), email_address) > 0)
            AND (u.banned_until IS NULL OR u.banned_until <= at_time)
            AND (m.role IN ('kingdom', 'member') OR
                 (m.user_id IS NULL AND NOT u.is_sso_user AND app_private.phx_registration_player_id(u.raw_user_meta_data) ~ '^[1-9][0-9]{0,19}$'))
          ORDER BY u.created_at DESC, u.id LIMIT 100
        ) a
      ),
      'invitations', (
        SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY i.created_at DESC), '[]'::jsonb)
        FROM (
          SELECT id, email, player_id, role, created_at, expires_at
          FROM app_private.phx_access_invites
          WHERE closed_at IS NULL AND expires_at > at_time
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
       OR p_role IS NULL OR p_role NOT IN ('kingdom', 'member') THEN
      RAISE EXCEPTION 'Enter a valid email, Kingshot Player ID and regular role.' USING ERRCODE = '22023';
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
      IF invitation.email = email_address AND invitation.player_id = p_player_id AND invitation.role = p_role THEN
        RETURN jsonb_build_object('ok', true, 'changed', false);
      END IF;
      RAISE EXCEPTION 'An active invitation already uses this email or player ID.' USING ERRCODE = '23505';
    END IF;
    INSERT INTO app_private.phx_access_invites (email, player_id, role)
    VALUES (email_address, p_player_id, p_role) RETURNING * INTO invitation;
    record_key := invitation.id::text;
    after_state := jsonb_build_object('role', p_role);
  ELSE
    IF p_action IS NULL OR p_action NOT IN ('approve', 'reject', 'suspend', 'reactivate') THEN
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
       OR (membership.role IS NOT NULL AND membership.role NOT IN ('kingdom', 'member')) THEN
      RAISE EXCEPTION 'This account is unavailable for access management.' USING ERRCODE = '42501';
    END IF;

    record_key := target.id::text;
    IF p_action IN ('approve', 'reject') THEN
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

      IF p_action = 'approve' THEN
        IF target.email_confirmed_at IS NULL OR invitation.id IS NULL OR invitation.role IS DISTINCT FROM p_role THEN
          RAISE EXCEPTION 'Approval requires verified email and a matching current invitation.' USING ERRCODE = '42501';
        END IF;
        IF EXISTS (
          SELECT 1 FROM public.nxs_memberships m JOIN auth.users u ON u.id = m.user_id
          WHERE u.deleted_at IS NULL AND app_private.phx_registration_player_id(u.raw_user_meta_data) = p_player_id
        ) THEN
          RAISE EXCEPTION 'This player ID already has a PHALANX membership.' USING ERRCODE = '23505';
        END IF;
        INSERT INTO public.nxs_memberships (user_id, role, active, granted_by)
        VALUES (target.id, invitation.role, true, actor);
        after_state := jsonb_build_object('role', invitation.role, 'active', true, 'invitation_id', invitation.id);
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
      before_state := jsonb_build_object('role', membership.role, 'active', membership.active);
      UPDATE public.nxs_memberships SET active = (p_action = 'reactivate') WHERE user_id = target.id;
      after_state := jsonb_build_object('role', membership.role, 'active', p_action = 'reactivate');
    END IF;
  END IF;

  INSERT INTO public.nxs_audit_log (table_name, record_key, operation, actor_id, before_data, after_data)
  VALUES ('phx_access_management', record_key, p_action, actor, before_state, after_state);
  RETURN jsonb_build_object('ok', true, 'changed', true);
END;
$function$;

CREATE FUNCTION public.phx_access_management(
  p_action text, p_user_id uuid DEFAULT NULL, p_email text DEFAULT NULL,
  p_player_id text DEFAULT NULL, p_role text DEFAULT NULL
) RETURNS jsonb
LANGUAGE sql SECURITY INVOKER SET search_path = ''
AS $function$
  SELECT app_private.phx_access_management(p_action, p_user_id, p_email, p_player_id, p_role);
$function$;

REVOKE ALL ON FUNCTION app_private.phx_access_management(text, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.phx_access_management(text, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_private.phx_access_management(text, uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.phx_access_management(text, uuid, text, text, text) TO authenticated;

COMMIT;
