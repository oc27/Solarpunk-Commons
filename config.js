// Supabase project connection. The publishable key is intended for browser use.
window.SUPABASE_URL = "https://pcoqknmymdqrlrvnfuoi.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_3fI_19lwmtExpABUYROj2w_aYDScsxr";
window.supabaseClient = null;

if (window.supabase && window.SUPABASE_URL.startsWith("https://") && window.SUPABASE_ANON_KEY.startsWith("sb_publishable_")) {
  window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
