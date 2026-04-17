import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/private";

/**
 * Creates and returns a Supabase client for server-side operations.
 * Uses the service role key for admin operations (bypasses RLS).
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function getSupabaseClient() {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const AUDIT_BUCKET = "audit-exports";

/**
 * Upload an audit workbook to the public `audit-exports` bucket and
 * return its public URL.
 *
 * @param {Object} params
 * @param {Buffer|Uint8Array} params.buffer
 * @param {string} params.storeSlug - URL-safe identifier for filename
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadAuditWorkbook({ buffer, storeSlug }) {
  const supabase = getSupabaseClient();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `${storeSlug || "store"}/${timestamp}-catalog-audit.xlsx`;

  const { error } = await supabase.storage.from(AUDIT_BUCKET).upload(path, buffer, {
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(AUDIT_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
