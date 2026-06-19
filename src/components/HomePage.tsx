"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SharedClipboardWidget, CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";
import { FeatureCards } from "@/components/widgets/FeatureCards";
import { StatusIndicator } from "@/components/widgets/StatusIndicator";
import { ProfileModal } from "@/components/widgets/ProfileModal";
import { clearAccountData } from "@/lib/profile-storage";

export function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("neardrop-auth") === "true");
    const stored = localStorage.getItem("neardrop-profile-image");
    if (stored) setProfileImage(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("neardrop-auth");
    setIsLoggedIn(false);
    setProfileOpen(false);
  };

  const handleDeleteAccount = () => {
    clearAccountData();
    setIsLoggedIn(false);
    setProfileImage(null);
    setProfileOpen(false);
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
        onProfileClick={() => setProfileOpen(true)}
      />

      <main className="flex flex-1 flex-col items-center">
        {/* Above the fold: hero → clipboard → drop files → save */}
        <section
          className="home-above-fold flex w-full flex-col items-center px-4 pb-6 pt-3 sm:px-6 sm:pb-4 sm:pt-2"
        >
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

          <SharedClipboardWidget className="min-h-0 flex-1" />
        </section>

        {/* Below the fold */}
        <div
          className={`flex w-full flex-col items-center px-4 pb-16 pt-10 sm:px-6`}
        >
          <div className={`mb-12 flex ${CLIPBOARD_WIDTH} justify-center`}>
            <StatusIndicator />
          </div>

          <section className="flex w-full justify-center">
            <FeatureCards />
          </section>
        </div>
      </main>

      <Footer />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onProfileImageChange={setProfileImage}
      />
    </>
  );
}
