-- Read-only preflight for isolated PHALANX Access V2.
-- Execute before applying PHX-ACCESS-V2-ISOLATED-ROLE-GUARD-20261109.sql.
-- This file does not create, modify or delete any data.
SELECT current_database() AS database_name,
       to_regprocedure('public.phx_set_app_role_v2(uuid,text,text)') IS NOT NULL AS function_exists,
       to_regclass('public.phx_app_roles') IS NOT NULL AS roles_table_exists,
       to_regclass('public.phx_app_role_events') IS NOT NULL AS events_table_exists,
       to_regclass('app_private.phx_access_settings') IS NOT NULL AS owner_settings_exist;
SELECT protected_user_id IS NOT NULL AS owner_configured,
       delegate_user_id IS NOT NULL AS delegate_configured
FROM app_private.phx_access_settings WHERE singleton=true;
SELECT has_function_privilege('anon','public.phx_set_app_role_v2(uuid,text,text)','EXECUTE') AS anonymous_can_execute,
       has_function_privilege('authenticated','public.phx_set_app_role_v2(uuid,text,text)','EXECUTE') AS authenticated_can_execute;
SELECT pg_get_functiondef('public.phx_set_app_role_v2(uuid,text,text)'::regprocedure) AS rollback_source_definition;
SELECT count(*) AS existing_role_rows FROM public.phx_app_roles;
SELECT count(*) AS existing_event_rows FROM public.phx_app_role_events;
-- A function-definition snapshot is not a tested backup. Export and verify the
-- isolated project's schema/data backup separately and rehearse restoration.
