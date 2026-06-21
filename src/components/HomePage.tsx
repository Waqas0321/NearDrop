"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GuestUpgradeBanner,
  SupabaseSetupBanner,
} from "@/components/SupabaseBanners";
import { SharedClipboardWidget, CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";
import { NearbySharesList } from "@/components/widgets/NearbySharesList";
import { FeatureCards } from "@/components/widgets/FeatureCards";
import { StatusIndicator } from "@/components/widgets/StatusIndicator";
import { ProfileModal } from "@/components/widgets/ProfileModal";
import { useAuth } from "@/contexts/AuthProvider";
import {
  ShareSessionProvider,
  useShareSession,
} from "@/contexts/ShareSessionProvider";
import { createClient } from "@/lib/supabase/client";
import { deleteAccountData } from "@/lib/supabase/profile";

function HomePageContent() {
  const {
    ready,
    isRegistered,
    isGuest,
    profile,
    signOut,
    refreshProfile,
    configured,
  } = useAuth();
  const { nearbyCount, searching } = useShareSession();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!configured || !profile) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await deleteAccountData(supabase, user.id);
    await supabase.auth.signOut();
    await supabase.auth.signInAnonymously();
    setProfileOpen(false);
  };

  const displayName = profile?.display_name ?? "Guest";
  const userInitial = displayName.charAt(0).toUpperCase() || "G";

  return (
    <>
      <Navbar
        isRegistered={isRegistered}
        isGuest={isGuest}
        userInitial={userInitial}
        profileImage={profile?.avatar_url ?? null}
        onProfileClick={() => setProfileOpen(true)}
      />

      <main className="flex flex-1 flex-col items-center">
        <section className="home-above-fold flex w-full flex-col items-center px-4 pb-6 pt-3 sm:px-6 sm:pb-4 sm:pt-2">
          <div
            className={`mb-3 flex shrink-0 ${CLIPBOARD_WIDTH} flex-col items-center text-center`}
          >
            <h1 className="text-hero text-foreground">
              Instant.{" "}
              <span className="text-primary">Proximity.</span> Sharing.
            </h1>
            <p className="mt-1.5 text-sm leading-5 text-muted sm:text-base">
              Share with anyone in your radius. No common network needed.
            </p>
          </div>

          <SupabaseSetupBanner />
          <GuestUpgradeBanner />
          <SharedClipboardWidget className="min-h-0 flex-1" />
          {ready && <NearbySharesList />}
        </section>

        <div className="flex w-full flex-col items-center px-4 pb-16 pt-10 sm:px-6">
          <div className={`mb-12 flex ${CLIPBOARD_WIDTH} justify-center`}>
            {ready && (
              <StatusIndicator
                searching={searching}
                nearbyCount={nearbyCount}
                isGuest={isGuest}
              />
            )}
          </div>

          <section className="flex w-full justify-center">
            <FeatureCards />
          </section>
        </div>
      </main>

      <Footer />

      {isRegistered && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onProfileUpdated={refreshProfile}
        />
      )}
    </>
  );
}

export function HomePage() {
  return (
    <ShareSessionProvider>
      <HomePageContent />
    </ShareSessionProvider>
  );
}
