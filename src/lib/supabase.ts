import { createClient } from '@supabase/supabase-js';

// Direct Supabase credentials - embedded in code
const supabaseUrl = 'https://cqakffwerprfpvxjbnyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYWtmZndlcnByZnB2eGpibnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjQ3NTYsImV4cCI6MjA2MTE0MDc1Nn0.ecWuhSkTTAZLWguPSotHSaVZpSSEdBQPS88ynOrPNuQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
