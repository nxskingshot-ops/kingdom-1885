-- PHALANX Access V2 production READ-ONLY preflight. Do not modify production.
-- Run with authorized read-only credentials. Review results before migration.
SELECT 'memberships' AS metric, count(*) AS total FROM public.nxs_memberships
UNION ALL SELECT 'legacy_admins',count(*) FROM public.nxs_memberships WHERE role='admin' AND active
UNION ALL SELECT 'active_invitations',count(*) FROM app_private.phx_access_invites WHERE closed_at IS NULL AND expires_at>now()
UNION ALL SELECT 'pending_access_requests',count(*) FROM public.nexus_access_requests WHERE status='pending';
SELECT c.conrelid::regclass::text AS relation,c.conname,pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
WHERE c.conrelid IN ('public.nxs_memberships'::regclass,'app_private.phx_access_invites'::regclass)
ORDER BY 1,2;
SELECT p.oid::regprocedure::text AS function_name, p.prosecdef AS security_definer,
       p.proacl AS execution_grants
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE (n.nspname='public' AND p.proname='phx_access_management')
   OR (n.nspname='app_private' AND p.proname='phx_access_management');
SELECT 'v2_roles_table' AS object_name,to_regclass('public.phx_app_roles') IS NOT NULL AS present
UNION ALL SELECT 'v2_role_rpc',to_regprocedure('public.phx_set_app_role_v2(uuid,text,text)') IS NOT NULL
UNION ALL SELECT 'v2_approval_rpc',to_regprocedure('public.phx_approve_registration_with_role_v2(uuid,text,text)') IS NOT NULL;
-- NEVER copy auth.users, emails or session tokens into a public report.
