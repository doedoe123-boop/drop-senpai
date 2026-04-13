"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { ProfileRole } from "@drop-senpai/types";

import { createBrowserSupabaseClient } from "../lib/supabase";

interface AdminProfileState {
  exists: boolean;
  role: ProfileRole | null;
}

interface AdminAuthContextValue {
  user: User | null;
  session: Session | null;
  role: ProfileRole | null;
  profileExists: boolean;
  isLoading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  supabase: ReturnType<typeof createBrowserSupabaseClient> | null;
}

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);

export function AdminAuthProvider({ children }: PropsWithChildren) {
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createBrowserSupabaseClient
  > | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<ProfileRole | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let browserSupabase: ReturnType<typeof createBrowserSupabaseClient>;
    try {
      browserSupabase = createBrowserSupabaseClient();
    } catch (err) {
      console.error("[AdminAuth] Failed to create Supabase client:", err);
      setIsLoading(false);
      return;
    }
    setSupabase(browserSupabase);

    let isMounted = true;

    async function syncSession(nextSession: Session | null) {
      if (!isMounted) return;

      if (!nextSession) {
        setSession(null);
        setRole(null);
        setProfileExists(false);
        setIsLoading(false);
        return;
      }

      setSession(nextSession);

      try {
        const profileState = await ensureProfile(browserSupabase, nextSession.user);

        if (!isMounted) return;

        setProfileExists(profileState.exists);
        setRole(profileState.role);
      } catch {
        if (!isMounted) return;

        setProfileExists(false);
        setRole(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    async function bootstrapAuth() {
      try {
        const { data, error } = await browserSupabase.auth.getSession();

        if (error) {
          await syncSession(null);
          return;
        }

        await syncSession(data.session);
      } catch {
        await syncSession(null);
      }
    }

    const { data: authSubscription } = browserSupabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setIsLoading(true);
        await syncSession(nextSession);
      },
    );

    void bootstrapAuth();

    return () => {
      isMounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      role,
      profileExists,
      isLoading,
      signInWithPassword: async (email: string, password: string) => {
        if (!supabase) {
          throw new Error("Admin sign-in is still initializing. Try again.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
      supabase,
    }),
    [isLoading, profileExists, role, session, supabase],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

async function fetchProfileState(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  user: User,
): Promise<AdminProfileState> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return {
      exists: false,
      role: null,
    };
  }

  return {
    exists: true,
    role: (data as { role?: ProfileRole }).role ?? null,
  };
}

async function ensureProfile(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  user: User,
): Promise<AdminProfileState> {
  const currentProfile = await fetchProfileState(supabase, user);

  if (currentProfile.exists) {
    return currentProfile;
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username: user.email ?? null,
  });

  if (error) {
    return {
      exists: false,
      role: null,
    };
  }

  return fetchProfileState(supabase, user);
}
