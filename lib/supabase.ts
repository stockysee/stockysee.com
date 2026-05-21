import { createClient } from '@supabase/supabase-js';

let warnedMissingEnv = false;

function resolveSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseKey =
    typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    if (!warnedMissingEnv) {
      console.warn('Supabase URL or key is missing. Storage features might not work.');
      warnedMissingEnv = true;
    }
    return null;
  }

  return { supabaseUrl, supabaseKey };
}

let supabaseInstance: any = null;

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  
  const config = resolveSupabaseConfig();
  if (!config) return null;
  
  supabaseInstance = createClient(config.supabaseUrl, config.supabaseKey);
  return supabaseInstance;
}
