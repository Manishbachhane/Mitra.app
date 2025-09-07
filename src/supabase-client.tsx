import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hqmmkrsexbqhbmcxzqwl.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;  // ✅ ab default export
