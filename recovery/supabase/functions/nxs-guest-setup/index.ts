import { createClient } from "npm:@supabase/supabase-js@2";
const API = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CORS_ORIGIN = "https://nxskingshot-ops.github.io";
const cors = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Vary": "Origin",
};
const result = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status, headers: { ...cors, "Content-Type": "application/json" }
  });
const secret = () => Array.from(crypto.getRandomValues(new Uint8Array(28)),
  b => b.toString(16).padStart(2, "0")).join("");
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return result({ error: "Method not allowed." }, 405);
  if (req.headers.get("Origin") !== CORS_ORIGIN) return result({ error: "Origin not allowed." }, 403);
  if (!API || !SERVICE) return result({ error: "Server configuration missing." }, 503);
  const bearer = req.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!bearer) return result({ error: "Administrator sign-in required." }, 401);
  const admin = createClient(API, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: identity, error: identityError } = await admin.auth.getUser(bearer);
  if (identityError || !identity?.user) return result({ error: "Session invalid." }, 401);
  const uid = identity.user.id;
  const { data: role, error: roleError } = await admin.from("nxs_memberships")
    .select("role,active,expires_at").eq("user_id", uid).maybeSingle();
  if (roleError || role?.role !== "admin" || role.active !== true ||
      (role.expires_at && Date.parse(role.expires_at) <= Date.now()))
    return result({ error: "Administrator permission required." }, 403);
  let body: { action?: string } = {};
  try { body = await req.json(); } catch { return result({ error: "Invalid request." }, 400); }
  if (body.action !== "create" && body.action !== "disable")
    return result({ error: "Unsupported action." }, 400);
  const { data: settings, error: settingsError } = await admin
    .from("nxs_guest_access_config").select("guest_user_id,enabled,expires_at").eq("id", 1).single();
  if (settingsError || !settings) return result({ error: "Guest configuration unavailable." }, 503);
  if (body.action === "disable") {
    const { error } = await admin.from("nxs_guest_access_config")
      .update({ enabled: false }).eq("id", 1);
    if (error) return result({ error: "Guest deactivation failed." }, 503);
    if (settings.guest_user_id) {
      const { error: revoked } = await admin.from("nxs_memberships")
        .update({ active: false }).eq("user_id", settings.guest_user_id);
      if (revoked) return result({ error: "Guest deactivation incomplete. Contact administrator." }, 503);
    }
    return result({ disabled: true });
  }
  if (settings.guest_user_id && settings.enabled &&
      Date.parse(settings.expires_at) > Date.now())
    return result({ error: "An active guest account already exists. Disable it before creating a new one." }, 409);
  const email = "nxs-guest-" + crypto.randomUUID().replaceAll("-", "").slice(0, 20) + "@example.com";
  const password = secret();
  const expiration = new Date(Date.now() + 7 * 86400000).toISOString();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    app_metadata: { nxs_guest_account: true }
  });
  if (createError || !created?.user)
    return result({ error: "Guest account creation failed." }, 503);
  const guest = created.user.id;
  const { error: membershipError } = await admin.from("nxs_memberships")
    .insert({ user_id: guest, role: "member", active: true, expires_at: expiration, granted_by: uid });
  if (membershipError) {
    await admin.auth.admin.deleteUser(guest);
    return result({ error: "Guest permissions could not be activated." }, 503);
  }
  const { error: configurationError } = await admin.from("nxs_guest_access_config")
    .update({ enabled: true, expires_at: expiration, guest_user_id: guest, created_by: uid })
    .eq("id", 1);
  if (configurationError) {
    await admin.from("nxs_memberships").update({ active: false }).eq("user_id", guest);
    await admin.auth.admin.deleteUser(guest);
    return result({ error: "Guest expiration could not be activated." }, 503);
  }
  return result({ email, password, expires_at: expiration, role: "member" });
});