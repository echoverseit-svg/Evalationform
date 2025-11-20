// Replace the placeholder values with your actual Supabase project credentials
// from Project Settings → API. Do NOT commit real keys to public repos.
(function initializeSupabase() {
  const SUPABASE_URL = 'https://cmarbxhnufoivtlhrele.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYXJieGhudWZvaXZ0bGhyZWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mjc0NjcsImV4cCI6MjA3OTIwMzQ2N30.rPH_qepTVq890VshXqea5fSGoJ45082FdI1H4eySats';

  if (!window.supabase || !window.supabase.createClient) {
    console.warn('Supabase JS library missing. Make sure @supabase/supabase-js UMD script is loaded first.');
    return;
  }

  if (SUPABASE_URL.includes('YOUR_PROJECT_REF')) {
    console.warn('Supabase credentials not configured yet. Update supabase-config.js with your project URL and anon key.');
    return;
  }

  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
