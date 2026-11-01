-- STAGE ONLY. NOT APPLIED. Review security and migration rollback before deployment.
-- PostgreSQL function call is one transaction: either run and 22 snapshots commit, or none do.
create or replace function public.phalanx_store_22_snapshot_stage(p_run jsonb, p_snapshots jsonb)
returns bigint
language plpgsql security invoker set search_path = ''
as $$
declare v_run_id bigint; v_count integer; v_source text;
begin
  if jsonb_typeof(p_snapshots) <> 'array' or jsonb_array_length(p_snapshots) <> 22 then
    raise exception 'Expected exactly 22 ranking snapshots';
  end if;
  if (p_run->>'kingdom')::integer <> 1885 or (p_run->>'passed')::integer <> 22
     or (p_run->>'total')::integer <> 22 or (p_run->>'successful')::boolean is distinct from true then
    raise exception 'Run quality gate failed';
  end if;
  select count(distinct e->>'board'), count(distinct e->>'source_captured_at')
    into v_count, v_source
    from jsonb_array_elements(p_snapshots) e;
  if v_count <> 22 or v_source <> '1' then
    raise exception 'Missing boards or mixed source timestamps';
  end if;
  if exists(select 1 from jsonb_array_elements(p_snapshots) e
    where (e->>'entry_count')::integer <> 100
      or jsonb_typeof(e->'entries') <> 'array'
      or jsonb_array_length(e->'entries') <> 100
      or nullif(e->>'source_captured_at','') is null) then
    raise exception 'Invalid board entry counts';
  end if;
  insert into public.phalanx_mightpulse_poll_runs
    (kingdom,passed,total,successful,board_captured_at,failures,duration_ms,source_changed,source_changed_boards,run_origin)
  values
    (1885,22,22,true,p_run->'board_captured_at',p_run->'failures',
     (p_run->>'duration_ms')::integer,(p_run->>'source_changed')::boolean,
     (p_run->>'source_changed_boards')::integer,p_run->>'run_origin')
  returning id into v_run_id;
  insert into public.phalanx_mightpulse_rank_snapshots
    (run_id,board,source_captured_at,entries,entry_count)
  select v_run_id,e->>'board',(e->>'source_captured_at')::timestamptz,e->'entries',100
    from jsonb_array_elements(p_snapshots) e;
  return v_run_id;
end;
$$;
-- No GRANT or deployment here. Restrict EXECUTE to trusted service role after review.
