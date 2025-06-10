import { createClient } from '@supabase/supabase-js';

// Use fallback values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Only throw error if we're in production and missing real values
if ((!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') && 
    (!supabaseAnonKey || supabaseAnonKey === 'placeholder-anon-key') && 
    import.meta.env.PROD) {
  console.warn('Supabase environment variables not configured. Using fallback mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
