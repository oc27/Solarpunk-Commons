// Add your Supabase Project URL and Publishable key. Never use a secret/service_role key here.
window.SUPABASE_URL = "https://pcoqknmymdqrlrvnfuoi.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_3fI_19lwmtExpABUYROj2w_aYDScsxr";
window.supabaseClient = null;
if (window.supabase && window.SUPABASE_URL.startsWith("https://") && !window.SUPABASE_ANON_KEY.startsWith("PASTE_")) {
  window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}
