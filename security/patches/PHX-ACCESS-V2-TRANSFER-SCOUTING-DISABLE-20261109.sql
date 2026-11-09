-- Data-preserving backout. Run only on the explicitly authorized target.
-- The V2 labels and audit remain on file. Existing role values are unaffected.
-- Memberships granted during rollout retain baseline Member access.
BEGIN;
UPDATE app_private.phx_access_settings
SET scouting_roles_enabled = false
WHERE singleton AND scouting_roles_enabled;
COMMIT;
