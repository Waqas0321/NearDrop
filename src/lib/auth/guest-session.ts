import type { SupabaseClient } from "@supabase/supabase-js";

const GUEST_CREDENTIALS_KEY = "neardrop-guest-credentials";

interface GuestCredentials {
  email: string;
  password: string;
}

export function isGuestUser(user: {
  is_anonymous?: boolean;
  user_metadata?: Record<string, unknown>;
  email?: string | null;
} | null): boolean {
  if (!user) return false;
  if (user.is_anonymous) return true;
  if (user.user_metadata?.is_guest === true) return true;
  return Boolean(
    user.email?.startsWith("guest_") && user.email.endsWith("@test.com")
  );
}

function readGuestCredentials(): GuestCredentials | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GUEST_CREDENTIALS_KEY);
    return raw ? (JSON.parse(raw) as GuestCredentials) : null;
  } catch {
    return null;
  }
}

function storeGuestCredentials(credentials: GuestCredentials) {
  localStorage.setItem(GUEST_CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function clearGuestCredentials() {
  localStorage.removeItem(GUEST_CREDENTIALS_KEY);
}

export async function ensureGuestSession(
  supabase: SupabaseClient
): Promise<{ session: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>; user: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>["user"] }> {
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) {
    return { session: existing.session, user: existing.session.user };
  }

  const anonymous = await supabase.auth.signInAnonymously();
  if (!anonymous.error && anonymous.data.session?.user) {
    return {
      session: anonymous.data.session,
      user: anonymous.data.session.user,
    };
  }

  const saved = readGuestCredentials();
  if (saved) {
    const signIn = await supabase.auth.signInWithPassword(saved);
    if (!signIn.error && signIn.data.session?.user) {
      return { session: signIn.data.session, user: signIn.data.session.user };
    }
  }

  const email = `guest_${crypto.randomUUID().slice(0, 8)}@test.com`;
  const password = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: "Guest", is_guest: true },
    },
  });

  if (signUp.error || !signUp.data.session?.user) {
    throw (
      signUp.error ??
      new Error(
        "Guest sign-up failed. Disable email confirmation in Supabase or enable anonymous sign-ins."
      )
    );
  }

  storeGuestCredentials({ email, password });
  return { session: signUp.data.session, user: signUp.data.session.user };
}
