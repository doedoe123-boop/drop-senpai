import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { readExpoSupabaseEnv } from "@drop-senpai/lib";

const { supabaseUrl, supabaseAnonKey } = readExpoSupabaseEnv(process.env);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: AsyncStorage
  }
});
