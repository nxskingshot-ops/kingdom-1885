CREATE OR REPLACE FUNCTION public.phx_list_pending_registrations_v2()
 RETURNS TABLE(application_id uuid, player_id text, gamer_tag text, submitted_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$ begin if auth.uid() is null or not exists(select 1 from public.phx_app_roles r join public.phx_registration_reviewers rv on rv.user_id=r.user_id where r.user_id=auth.uid() and r.active and r.app_role='administrator' and rv.enabled) then raise exception 'PHALANX registration reviewer required' using errcode='42501';end if; return query select a.id,a.player_id,a.gamer_tag,a.submitted_at from public.phx_registration_applications a cross join app_private.phx_access_settings s where s.singleton and a.status='pending' and a.requester_user_id<>auth.uid() and a.requester_user_id<>s.protected_user_id and a.requester_user_id is distinct from s.delegate_user_id order by a.submitted_at asc; end $function$

