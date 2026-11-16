import { createWarRoomProfileHandler } from './handler.mjs';

Deno.serve(createWarRoomProfileHandler({
  projectUrl: Deno.env.get('SUPABASE_URL'),
  publishableKey: Deno.env.get('SUPABASE_ANON_KEY'),
  androidOrigin: 'https://localhost',
}));
