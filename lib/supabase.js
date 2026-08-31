import { createClient } from "@supabase/supabase-js";

// Uses the service_role key — this file is only ever imported by
// server-side API routes, never sent to the browser, so it's safe here.
// NEVER import this from a component or page that runs client-side.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key"
);
