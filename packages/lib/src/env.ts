export interface SupabasePublicEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function readExpoSupabaseEnv(env: Record<string, string | undefined>): SupabasePublicEnv {
  return {
    supabaseUrl: requireEnv("EXPO_PUBLIC_SUPABASE_URL", env.EXPO_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: requireEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY", env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
  };
}

export function readNextSupabaseEnv(env: Record<string, string | undefined>): SupabasePublicEnv {
  return {
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  };
}
