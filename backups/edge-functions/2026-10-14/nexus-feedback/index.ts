import { createClient } from "npm:@supabase/supabase-js@2";

const ORIGIN = "https://nxskingshot-ops.github.io";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Vary": "Origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
});
const lastSent = new Map<string, number>();
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (req.headers.get("Origin") !== ORIGIN) return json({ error: "Origin not allowed" }, 403);
  const webhook = Deno.env.get("DISCORD_FEEDBACK_WEBHOOK_URL");
  if (!webhook || !/^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/.test(webhook)) {
    return json({ error: "Feedback service unavailable" }, 503);
  }
  const token = req.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return json({ error: "Sign in required" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !service) return json({ error: "Service unavailable" }, 503);
  const client = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: identity, error: authError } = await client.auth.getUser(token);
  if (authError || !identity?.user) return json({ error: "Session invalid" }, 401);
  const userId = identity.user.id;
  const { data: membership, error: membershipError } = await client.from("nxs_memberships")
    .select("active,role,expires_at").eq("user_id", userId).maybeSingle();
  if (membershipError || !membership?.active ||
      (membership.expires_at && Date.parse(membership.expires_at) <= Date.now())) {
    return json({ error: "Active NEXUS membership required" }, 403);
  }
  if (Number(req.headers.get("Content-Length") ?? 0) > 9000) return json({ error: "Message too long" }, 413);
  let input: unknown;
  try { input = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "Invalid feedback" }, 400);
  const fields = input as Record<string, unknown>;
  if (typeof fields.message !== "string") return json({ error: "Message required" }, 400);
  const message = fields.message.trim();
  const category = typeof fields.category === "string" ? fields.category.trim() : "General";
  if (!message || message.length > 1400 || category.length > 40) {
    return json({ error: "Invalid message length" }, 400);
  }
  const now = Date.now();
  if (now - (lastSent.get(userId) ?? 0) < 60_000) return json({ error: "Please wait before sending again" }, 429);
  lastSent.set(userId, now);
  const { data: profile } = await client.from("app_profiles")
    .select("display_name").eq("user_id", userId).maybeSingle();
  const name = String(profile?.display_name || "NEXUS member").slice(0, 70)
    .replace(/[@`]/g, "");
  const cleanCategory = category.replace(/[@`]/g, "") || "General";
  const content = [
    "**NEXUS Contact & Feedback**",
    "From: " + name,
    "Category: " + cleanCategory,
    "",
    message.replace(/@/g, "@\u200b"),
  ].join("\n");
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(7500),
    });
    if (!response.ok) {
      lastSent.delete(userId);
      return json({ error: "Message could not be delivered" }, 502);
    }
    return json({ delivered: true });
  } catch {
    lastSent.delete(userId);
    return json({ error: "Message could not be delivered" }, 502);
  }
});
