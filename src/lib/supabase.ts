import { createClient } from '@supabase/supabase-js';

// Use fallback values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ixeufyjzcpaczredfmfc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZXVmeWp6Y3BhY3pyZWRmbWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA1ODEsImV4cCI6MjA2MjAyNjU4MX0.tR8puyZgKG9TW4zIiZbnLiFCr_ckhVl2O9z_Fx0UV94';

// Only throw error if we're in production and missing real values
if ((!supabaseUrl || supabaseUrl === 'https://ixeufyjzcpaczredfmfc.supabase.co') && 
    (!supabaseAnonKey || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZXVmeWp6Y3BhY3pyZWRmbWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA1ODEsImV4cCI6MjA2MjAyNjU4MX0.tR8puyZgKG9TW4zIiZbnLiFCr_ckhVl2O9z_Fx0UV94') && 
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
