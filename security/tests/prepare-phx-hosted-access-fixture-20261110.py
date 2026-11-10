"""Build a namespaced hosted fixture from the reviewed Access Management SQL."""
from pathlib import Path
import hashlib
import re
import sys

source = Path(sys.argv[1])
names = {
    "app_private": "phx_hosted_fixture_private",
    "transfer_candidates": "phx_hosted_fixture_candidates",
    "nxs_memberships": "phx_hosted_fixture_memberships",
    "nxs_audit_log": "phx_hosted_fixture_audit",
    "phx_access_management": "phx_hosted_fixture_access",
}


def rewrite(sql):
    return re.sub(r"\b(" + "|".join(names) + r")\b", lambda m: names[m[0]], sql)


def patch(name):
    text = (source / "security/patches" / name).read_text()
    return re.sub(r"^\s*(BEGIN|COMMIT);\s*$", "", text, flags=re.M)


baseline = (source / "security/tests/phx-access-v2-native-baseline-20261109.sql").read_text()
baseline = baseline.replace("GRANT USAGE ON SCHEMA auth TO anon, authenticated;\n", "")
legacy = rewrite(patch("PHX-ACCESS-MANAGEMENT-STAGE-20261109.sql"))
v2 = rewrite(patch("PHX-ACCESS-V2-TRANSFER-SCOUTING-20261109.sql"))
legacy_body = re.search(r"CREATE FUNCTION phx_hosted_fixture_private\.phx_hosted_fixture_access\([\s\S]+?AS \$function\$([\s\S]+?)\$function\$;", legacy)[1]
v2 = v2.replace("0852112c42a32d75124330ae56c0f944", hashlib.md5(legacy_body.encode()).hexdigest(), 1)
guard = """
  -- Hosted test accounts use a separate roster with time-limited authority.
  IF NOT EXISTS (SELECT 1 FROM phx_hosted_fixture_private.roster
                 WHERE user_id = actor AND expires_at > clock_timestamp()) THEN
    IF p_action = 'check' THEN
      RETURN jsonb_build_object('allowed', false);
    END IF;
    RAISE EXCEPTION 'This account is outside the hosted test fixture.' USING ERRCODE = '42501';
  END IF;
  IF p_user_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM phx_hosted_fixture_private.roster WHERE user_id = p_user_id AND expires_at > clock_timestamp()
  ) THEN
    RAISE EXCEPTION 'This account is outside the hosted test fixture.' USING ERRCODE = '42501';
  END IF;
  IF p_action = 'invite' AND NOT EXISTS (
      SELECT 1 FROM phx_hosted_fixture_private.roster
      WHERE email = email_address AND player_id = p_player_id AND expires_at > clock_timestamp()
  ) THEN
    RAISE EXCEPTION 'This invitation is outside the hosted test fixture.' USING ERRCODE = '42501';
  END IF;
"""
needle = "BEGIN\n  -- Serialize writes"
assert v2.count(needle) == 1
v2 = v2.replace(needle, "BEGIN\n" + guard + "  -- Serialize writes")
needle = "          WHERE u.id <> actor AND u.id <> settings.protected_user_id"
assert v2.count(needle) == 1
v2 = v2.replace(needle, needle + """
            AND EXISTS (SELECT 1 FROM phx_hosted_fixture_private.roster
                        WHERE user_id = u.id AND expires_at > clock_timestamp())""")
assert v2.count("INSERT INTO public.phx_hosted_fixture_memberships (user_id, role, active, granted_by, scouting_role)") == 1
v2 = v2.replace(
    "INSERT INTO public.phx_hosted_fixture_memberships (user_id, role, active, granted_by, scouting_role)",
    "INSERT INTO public.phx_hosted_fixture_memberships (user_id, role, active, granted_by, scouting_role, expires_at)",
)
assert v2.count("VALUES (target.id, invitation.role, true, actor, invitation.scouting_role);") == 1
v2 = v2.replace(
    "VALUES (target.id, invitation.role, true, actor, invitation.scouting_role);",
    "VALUES (target.id, invitation.role, true, actor, invitation.scouting_role, "
    "(SELECT expires_at FROM phx_hosted_fixture_private.roster WHERE user_id = target.id));",
)
roster = """
CREATE TABLE phx_hosted_fixture_private.roster (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  player_id text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL
);
ALTER TABLE phx_hosted_fixture_private.roster ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON phx_hosted_fixture_private.roster FROM PUBLIC, anon, authenticated;
"""
grants = """
REVOKE ALL ON TABLE public.phx_hosted_fixture_memberships, public.phx_hosted_fixture_candidates,
  public.phx_hosted_fixture_audit FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.phx_hosted_fixture_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phx_hosted_fixture_candidates TO authenticated;
"""
# Application data access expires with the fixture membership. Access control uses the same expiry.
print("BEGIN;", rewrite(baseline), roster, legacy, v2, grants, "NOTIFY pgrst, 'reload schema';", "COMMIT;", sep="\n")
