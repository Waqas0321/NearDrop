"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthProvider";
import {
  getCurrentPosition,
  haversineDistanceKm,
  isWithinRadius,
} from "@/lib/geo/location";
import { createClient } from "@/lib/supabase/client";
import {
  deactivateShareSession,
  fetchActiveShareSessions,
  fetchProfilesByIds,
  fetchShareFilesForSession,
  getShareFileDownloadUrl,
  upsertShareSession,
  type SaveSharePayload,
} from "@/lib/supabase/share";
import type { ShareFile, ShareSession } from "@/lib/supabase/types";

export interface NearbyShare extends ShareSession {
  distanceKm: number;
  files: ShareFile[];
  displayName: string;
}

interface ShareSessionContextValue {
  saving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  myShare: NearbyShare | null;
  nearbyShares: NearbyShare[];
  nearbyCount: number;
  searching: boolean;
  saveShare: (
    payload: Omit<SaveSharePayload, "latitude" | "longitude" | "radiusKm">
  ) => Promise<boolean>;
  clearShare: () => Promise<boolean>;
  refreshNearby: () => Promise<void>;
  downloadSharedFile: (file: ShareFile) => Promise<string>;
}

export function sortNearbyShares(shares: NearbyShare[]): NearbyShare[] {
  return [...shares]
    .filter(
      (share) => share.text_content.trim() || share.files.length > 0
    )
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
}

export function pickPrimaryNearbyShare(
  shares: NearbyShare[]
): NearbyShare | null {
  const sorted = sortNearbyShares(shares);
  return sorted[0] ?? null;
}

const ShareSessionContext = createContext<ShareSessionContextValue | null>(
  null
);

export function ShareSessionProvider({ children }: { children: ReactNode }) {
  const { user, maxRadiusKm, configured, ready } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [myShare, setMyShare] = useState<NearbyShare | null>(null);
  const [nearbyShares, setNearbyShares] = useState<NearbyShare[]>([]);
  const [searching, setSearching] = useState(false);

  const locationRef = useRef<{ latitude: number; longitude: number } | null>(
    null
  );
  const maxRadiusRef = useRef(maxRadiusKm);
  maxRadiusRef.current = maxRadiusKm;

  const refreshNearby = useCallback(async () => {
    if (!configured || !user) return;

    setSearching(true);
    try {
      const supabase = createClient();
      let coords = locationRef.current;

      if (!coords) {
        coords = await getCurrentPosition();
        locationRef.current = coords;
      }

      const sessions = await fetchActiveShareSessions(supabase);
      const profiles = await fetchProfilesByIds(
        supabase,
        sessions.map((session) => session.user_id)
      );
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

      let ownShare: NearbyShare | null = null;
      const nearby: NearbyShare[] = [];

      for (const session of sessions) {
        const files = await fetchShareFilesForSession(supabase, session.id);
        const displayName =
          profileMap.get(session.user_id)?.display_name ?? "Guest";

        if (session.user_id === user.id) {
          ownShare = {
            ...session,
            distanceKm: 0,
            files,
            displayName,
          };
          continue;
        }

        if (
          !isWithinRadius(
            coords.latitude,
            coords.longitude,
            maxRadiusRef.current,
            session.latitude,
            session.longitude,
            session.radius_km
          )
        ) {
          continue;
        }

        const distanceKm =
          session.latitude != null && session.longitude != null
            ? haversineDistanceKm(
                coords.latitude,
                coords.longitude,
                session.latitude,
                session.longitude
              )
            : 0;

        nearby.push({
          ...session,
          distanceKm,
          files,
          displayName,
        });
      }

      setMyShare(ownShare);
      setNearbyShares(nearby);
    } catch {
      setMyShare(null);
      setNearbyShares([]);
    } finally {
      setSearching(false);
    }
  }, [configured, user]);

  const refreshNearbyRef = useRef(refreshNearby);
  refreshNearbyRef.current = refreshNearby;

  useEffect(() => {
    if (!ready || !configured || !user) return;

    void refreshNearbyRef.current();

    const supabase = createClient();
    const channelName = `share_sessions_${user.id}`;

    const existing = supabase
      .getChannels()
      .find((ch) => ch.topic === `realtime:${channelName}`);
    if (existing) {
      void supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "share_sessions" },
        () => {
          void refreshNearbyRef.current();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "share_files" },
        () => {
          void refreshNearbyRef.current();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [ready, configured, user?.id]);

  const saveShare = useCallback(
    async (
      payload: Omit<SaveSharePayload, "latitude" | "longitude" | "radiusKm">
    ) => {
      if (!configured || !user) {
        setSaveError(
          "Supabase is not configured. Add your project keys to .env.local."
        );
        return false;
      }

      setSaving(true);
      setSaveError(null);
      setSaveMessage(null);

      try {
        const supabase = createClient();
        const coords = await getCurrentPosition();
        locationRef.current = coords;

        await upsertShareSession(supabase, user.id, {
          ...payload,
          latitude: coords.latitude,
          longitude: coords.longitude,
          radiusKm: maxRadiusKm,
        });

        setSaveMessage(
          user.is_anonymous
            ? "Shared within 1 KM. Register to unlock wider radius."
            : "Shared with nearby devices."
        );
        await refreshNearby();
        return true;
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : "Failed to share clipboard."
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [configured, user, maxRadiusKm, refreshNearby]
  );

  const clearShare = useCallback(async () => {
    if (!configured || !user) return false;

    setSaveError(null);
    setSaveMessage(null);

    try {
      const supabase = createClient();
      await deactivateShareSession(supabase, user.id);
      setMyShare(null);
      await refreshNearby();
      return true;
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to remove your share."
      );
      return false;
    }
  }, [configured, user, refreshNearby]);

  const downloadSharedFile = useCallback(async (file: ShareFile) => {
    const supabase = createClient();
    return getShareFileDownloadUrl(supabase, file.storage_path);
  }, []);

  const value: ShareSessionContextValue = {
    saving,
    saveMessage,
    saveError,
    myShare,
    nearbyShares,
    nearbyCount: sortNearbyShares(nearbyShares).length,
    searching,
    saveShare,
    clearShare,
    refreshNearby,
    downloadSharedFile,
  };

  return (
    <ShareSessionContext.Provider value={value}>
      {children}
    </ShareSessionContext.Provider>
  );
}

export function useShareSession() {
  const context = useContext(ShareSessionContext);
  if (!context) {
    throw new Error("useShareSession must be used within ShareSessionProvider");
  }
  return context;
}
