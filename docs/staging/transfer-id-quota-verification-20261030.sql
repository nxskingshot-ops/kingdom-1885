-- PHALANX staging verification plan; READ-ONLY checks only.
-- Run these before any proposed migration. Do not create objects.
select n.nspname as schema_name, c.relname as object_name, c.relkind
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where (n.nspname='phx_internal' and c.relname='transfer_id_quota')
   or (n.nspname='public' and c.relname='phx_take_transfer_id_quota');
select n.nspname as schema_name,p.proname, p.prosecdef,
       has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
       has_function_privilege('service_role',p.oid,'EXECUTE') as service_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='phx_take_transfer_id_quota';
-- After migration: test quota in a dedicated transaction with a synthetic UUID,
-- rollback to avoid persisting test counters. Never test with a real member ID.
-- begin;
-- select public.phx_take_transfer_id_quota('00000000-0000-4000-8000-000000000001'::uuid)
-- from generate_series(1,21);
-- rollback;
-- EXPECTED: 20 true, then false. Test concurrent callers separately.
