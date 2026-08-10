// =========================================================
// SUPABASE CONFIGURATION
// =========================================================

// Your Supabase project URL
const SUPABASE_URL =
    "https://wzwlnnhxllbxunlsusvu.supabase.co";

// Your Supabase Publishable Key
const SUPABASE_ANON_KEY =
    "sb_publishable_n1tzUzoDrVWLV89QkufTbg_O0y4Dkkk";

// =========================================================
// CREATE SUPABASE CLIENT
// =========================================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =========================================================
// MAKE CLIENT AVAILABLE GLOBALLY
// =========================================================

window.supabaseClient = supabaseClient;