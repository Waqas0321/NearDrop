"use client";

import { useEffect, useRef, useState } from "react";
import { X, BadgeCheck, Camera } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { VisibilityRadiusWidget } from "./VisibilityRadiusWidget";
import { useAuth } from "@/contexts/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, uploadAvatar } from "@/lib/supabase/profile";
import { DEFAULT_PROFILE_IMAGE, readImageFile } from "@/lib/profile-storage";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  onProfileUpdated?: () => void;
}

type ConfirmAction = "logout" | "delete" | null;

export function ProfileModal({
  isOpen,
  onClose,
  onLogout,
  onDeleteAccount,
  onProfileUpdated,
}: ProfileModalProps) {
  const { user, profile, maxRadiusKm, refreshProfile } = useAuth();
  const [radiusKm, setRadiusKm] = useState(50);
  const [displayName, setDisplayName] = useState("NearDrop User");
  const [avatarSrc, setAvatarSrc] = useState(DEFAULT_PROFILE_IMAGE);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setAvatarSrc(profile.avatar_url ?? DEFAULT_PROFILE_IMAGE);
      setDisplayName(profile.display_name);
      setRadiusKm(profile.visibility_radius_km);
      setError(null);
      setConfirmAction(null);
    }
  }, [isOpen, profile]);

  const persistProfile = async (
    updates: Partial<{
      display_name: string;
      avatar_url: string | null;
      visibility_radius_km: number;
    }>
  ) => {
    if (!user) return;
    const supabase = createClient();
    await updateProfile(supabase, user.id, updates);
    await refreshProfile();
    onProfileUpdated?.();
  };

  const handleRadiusChange = async (km: number) => {
    setRadiusKm(km);
    try {
      await persistProfile({ visibility_radius_km: km });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update radius.");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setError(null);
      await readImageFile(file);
      const supabase = createClient();
      const avatarUrl = await uploadAvatar(supabase, user.id, file);
      setAvatarSrc(avatarUrl);
      await persistProfile({ avatar_url: avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      setAvatarSrc(DEFAULT_PROFILE_IMAGE);
      await persistProfile({ avatar_url: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image.");
    }
  };

  const handleConfirm = () => {
    if (confirmAction === "logout") {
      onLogout?.();
    } else if (confirmAction === "delete") {
      onDeleteAccount?.();
    }
    setConfirmAction(null);
  };

  if (!isOpen || !profile) return null;

  const hasCustomImage =
    Boolean(profile.avatar_url) && avatarSrc !== DEFAULT_PROFILE_IMAGE;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-overlay"
        onClick={() => {
          if (confirmAction) {
            setConfirmAction(null);
            return;
          }
          onClose();
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile settings"
        className="fixed inset-x-3 top-[3.75rem] z-[101] max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-2xl border border-border bg-surface-modal p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:top-[4.5rem] sm:w-[min(calc(100vw-3rem),22rem)] sm:p-5 lg:right-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="pr-8 text-center text-xs text-muted">
          {user?.email ?? "Registered account"}
        </p>

        <button
          type="button"
          onClick={() => {
            if (confirmAction) {
              setConfirmAction(null);
              return;
            }
            onClose();
          }}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-light transition-colors hover:bg-card hover:text-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mt-1 flex flex-col items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-16 w-16 overflow-hidden rounded-full bg-border ring-2 ring-transparent transition-all hover:ring-primary/30"
              aria-label="Change profile photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </span>
            </button>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <BadgeCheck className="h-3.5 w-3.5" />
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <p className="mt-1.5 text-center text-[11px] leading-4 text-muted">
            Click photo to upload · JPG, PNG, WEBP (max 5MB)
          </p>
          {error && <p className="mt-0.5 text-[11px] text-danger">{error}</p>}
          {hasCustomImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-0.5 text-[11px] text-muted-light transition-colors hover:text-danger"
            >
              Remove photo
            </button>
          )}

          <h2 className="mt-1.5 text-base font-bold text-foreground">
            {displayName}
          </h2>
        </div>

        <div className="mt-4 border-t border-border-light pt-4">
          <VisibilityRadiusWidget
            valueKm={radiusKm}
            onChange={handleRadiusChange}
            maxRadiusKm={maxRadiusKm}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <button
            type="button"
            onClick={() => setConfirmAction("logout")}
            className="w-full rounded-full bg-danger-bg px-5 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger-bg-hover sm:w-auto sm:py-2"
          >
            Log Out
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction("delete")}
            className="w-full py-1 text-sm font-normal text-muted transition-colors hover:text-danger sm:w-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmAction === "logout"}
        title="Log out?"
        description="You'll return to guest mode with a 1 KM sharing limit until you sign in again."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        isOpen={confirmAction === "delete"}
        title="Delete account?"
        description="This permanently removes your profile, settings, and shared data. This action cannot be undone."
        confirmLabel="Delete Account"
        cancelLabel="Keep Account"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
