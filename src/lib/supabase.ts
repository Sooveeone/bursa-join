import { createBrowserClient } from "@supabase/ssr";

// Check if Supabase credentials are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build time or when env vars are missing
    // This will be replaced with real credentials in production
    console.warn("Supabase credentials not configured. Using placeholder.");
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

