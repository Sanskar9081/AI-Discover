import { createClient } from '@supabase/supabase-js';
import supabaseMock from './supabase-mock';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  // Test connection
  const testPromise = Promise.race([
    supabase.auth.getSession(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
  ]);
  
  testPromise.catch(() => {
    console.warn('⚠️ Supabase unreachable, using mock/offline mode');
    supabase = supabaseMock;
  });
} catch (error) {
  console.warn('⚠️ Failed to initialize Supabase, using mock/offline mode:', error);
  supabase = supabaseMock;
}

export { supabase };
