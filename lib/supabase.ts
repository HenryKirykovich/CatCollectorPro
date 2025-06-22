// libs/supabase.ts
// Connects to Supabase using environment variables
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase config in .env or app.config.ts');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
