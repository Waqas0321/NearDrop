"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  GUEST_MAX_RADIUS_KM,
  REGISTERED_DEFAULT_RADIUS_KM,
} from "@/lib/auth/constants";
import {
  clearGuestCredentials,
  ensureGuestSession,
  isGuestUser,
} from "@/lib/auth/guest-session";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfile, fetchProfile } from "@/lib/supabase/profile";
import type { Profile } from "@/lib/supabase/types";

interface AuthContextValue {
  ready: boolean;
  configured: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isGuest: boolean;
  isRegistered: boolean;
  maxRadiusKm: number;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const supabase = useMemo(() => {
    if (!configured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, [configured]);

  const loadProfile = useCallback(
    async (nextUser: User) => {
      if (!supabase) return;
      const guest = isGuestUser(nextUser);
      const nextProfile = await ensureProfile(
        supabase,
        nextUser.id,
        guest,
        guest ? "Guest" : "NearDrop User"
      );
      setProfile(nextProfile);
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) return;
    const nextProfile = await fetchProfile(supabase, user.id);
    if (nextProfile) setProfile(nextProfile);
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        const { session: nextSession, user: nextUser } =
          await ensureGuestSession(supabase);

        if (!mounted) return;

        setSession(nextSession);
        setUser(nextUser);
        await loadProfile(nextUser);
        setError(null);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Unable to initialize auth."
          );
        }
      } finally {
        if (mounted) setReady(true);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await loadProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    clearGuestCredentials();
    await supabase.auth.signOut();
    const { session: nextSession, user: nextUser } =
      await ensureGuestSession(supabase);
    setSession(nextSession);
    setUser(nextUser);
    await loadProfile(nextUser);
  }, [supabase, loadProfile]);

  const guest = isGuestUser(user);
  const isRegistered = Boolean(user && !guest);
  const maxRadiusKm = guest
    ? GUEST_MAX_RADIUS_KM
    : (profile?.visibility_radius_km ?? REGISTERED_DEFAULT_RADIUS_KM);

  const value: AuthContextValue = {
    ready,
    configured,
    session,
    user,
    profile,
    isGuest: guest,
    isRegistered,
    maxRadiusKm,
    error,
    refreshProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
