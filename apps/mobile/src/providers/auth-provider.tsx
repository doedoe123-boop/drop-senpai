import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Linking } from "react-native";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!error) {
        setSession(data.session);
        await ensureProfile(data.session?.user ?? null);
      }

      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        await handleDeepLink(initialUrl);
      }

      setIsLoading(false);
    }

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        await ensureProfile(nextSession?.user ?? null);
        await queryClient.invalidateQueries();
      },
    );

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      void handleDeepLink(url);
    });

    void bootstrapAuth();

    return () => {
      isMounted = false;
      authSubscription.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signInWithEmail: async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });

        if (error) {
          throw error;
        }
      },
      verifyOtp: async (email: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: "email",
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

async function handleDeepLink(url: string) {
  if (!url.includes("access_token") && !url.includes("code=")) {
    return;
  }

  try {
    const parsedUrl = new URL(url);
    const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const code = parsedUrl.searchParams.get("code");

    if (accessToken && refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      return;
    }

    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  } catch {
    // Deep link parsing failed — ignore silently so the app doesn't crash
  }
}

async function ensureProfile(user: User | null) {
  if (!user) {
    return;
  }

  await supabase
    .from("profiles")
    .upsert(
      { id: user.id, username: user.email ?? null },
      { onConflict: "id", ignoreDuplicates: false },
    );
}
