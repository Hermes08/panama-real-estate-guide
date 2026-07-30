import { createClient } from "@supabase/supabase-js";

/* =============================================================================
   Supabase client
   =============================================================================
   Uses the publishable key, which is meant to be public — it ships in client
   bundles by design. Security comes from RLS, not from hiding this value, so
   every table must have its policies right before it holds anything real.

   The service-role key must never appear in this file, in NEXT_PUBLIC_* vars,
   or anywhere that reaches the browser. When the lead endpoint needs elevated
   writes it reads a server-only var inside a route handler.
   ============================================================================= */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
      "Copy them into v2/.env.local — see supabase/migrations/0001_init.sql.",
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
