"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";

export function SupabaseSetupBanner() {
  const { configured } = useAuth();

  if (configured) return null;

  return (
    <div className="mx-auto mb-3 w-full max-w-[min(100%,960px)] rounded-xl border border-primary/30 bg-primary-light/50 px-4 py-3 text-sm text-foreground">
      <p className="font-semibold">Supabase setup required</p>
      <p className="mt-1 text-muted">
        Copy <code className="text-xs">.env.example</code> to{" "}
        <code className="text-xs">.env.local</code>, add your Supabase URL and
        anon key, enable anonymous sign-ins, then run the SQL migration in{" "}
        <code className="text-xs">supabase/migrations/</code>.
      </p>
    </div>
  );
}

export function GuestUpgradeBanner() {
  const { isGuest, isRegistered } = useAuth();

  if (!isGuest || isRegistered) return null;

  return (
    <div className="mx-auto mb-3 flex w-full max-w-[min(100%,960px)] flex-col items-start justify-between gap-3 rounded-xl border border-border-light bg-card px-4 py-3 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Sharing as guest within 1 KM
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Register free to unlock wider radius, profile settings, and full
          features.
        </p>
      </div>
      <Link
        href="/register"
        className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Register free
      </Link>
    </div>
  );
}
