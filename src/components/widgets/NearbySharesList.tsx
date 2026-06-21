"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  pickPrimaryNearbyShare,
  useShareSession,
} from "@/contexts/ShareSessionProvider";
import { ShareFilePreviewList } from "@/components/widgets/ShareFilePreviewList";
import { RemoteFileViewerModal } from "@/components/widgets/RemoteFileViewerModal";
import { CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";
import type { ShareFile } from "@/lib/supabase/types";

export function NearbySharesList() {
  const { nearbyShares, searching } = useShareSession();
  const [viewingFile, setViewingFile] = useState<ShareFile | null>(null);
  const primaryNearby = pickPrimaryNearbyShare(nearbyShares);

  const extraShares = nearbyShares.filter(
    (share) => share.id !== primaryNearby?.id && share.files.length > 0
  );

  if (searching || extraShares.length === 0) return null;

  return (
    <>
      <div className={`mx-auto mt-4 ${CLIPBOARD_WIDTH}`}>
        <p className="mb-2 text-center text-label-caps text-muted-light">
          More nearby shares
        </p>
        <div className="flex flex-col gap-3">
          {extraShares.map((share) => (
            <Card key={share.id} padding="md" className="rounded-xl p-4 shadow-sm">
              <div className="mb-2 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {share.displayName}
                </p>
                <p className="text-[10px] text-muted-light">
                  {share.distanceKm < 0.1
                    ? "Very close"
                    : `${share.distanceKm.toFixed(1)} KM away`}
                </p>
              </div>
              <ShareFilePreviewList
                files={share.files}
                onView={setViewingFile}
                compact
              />
            </Card>
          ))}
        </div>
      </div>

      <RemoteFileViewerModal
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </>
  );
}
