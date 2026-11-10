// Add your Supabase Project URL and Publishable key. Never use a secret/service_role key here.
window.SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
window.SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";
window.supabaseClient = null;
if (window.supabase && window.SUPABASE_URL.startsWith("https://") && !window.SUPABASE_ANON_KEY.startsWith("PASTE_")) {
  window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}
