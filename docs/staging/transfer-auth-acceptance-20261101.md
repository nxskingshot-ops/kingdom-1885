# PHALANX Transfer Scouting — secure self-service access

Status: REQUIRED, NOT IMPLEMENTED OR TESTED.

## Registration
- English mobile-first UI: Sign in, Create account, Forgot password, Reset password.
- Two password fields during account creation and reset, immediate match feedback, Show/Hide password on both fields, accessible labels, password-manager/autocomplete support, clear validation and loading states.
- Email verification and safe resend; never expose whether an unrelated email exists. No access to protected scouting data before verification and separately approved module entitlement.
- Queen An supplies her email directly to the auth provider. No passwords sent to project owner, chat, logs or source code.

## Recovery
- Forgot password sends a time-limited single-use recovery link through configured Supabase Auth email delivery; approved HTTPS redirect allowlist and domain are prerequisites.
- Reset form verifies recovery session/token, requests new password twice, validates policy and match, submits to Supabase Auth, then gives clear success and sign-in path. Invalid, expired or reused link has an understandable restart flow. Confirm session behavior, revoke or refresh other sessions according to verified auth provider capabilities.
- Rate limits, resend throttling, no account enumeration, and useful errors. Never build custom plaintext token or password storage.

## Authorization
- Sign-up creates no Transfer Admin rights. Owner approval binds a verified account to module-scoped transfer_admin entitlement; never use global admin/r5 or client-only role checks. Server-side RLS/endpoint checks required.
- Logout, expired session, revoked access, direct URL, forwarded link, read-only user and Android regression tests required.

## Release gate
- Verify Supabase Auth configuration, mail provider delivery, confirmation and recovery redirect URLs, session lifecycle, existing policies and backup/rollback before deployment. No production changes, new costs or invitations without explicit approval.
